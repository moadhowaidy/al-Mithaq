/**
 * Renders the link-preview images (Open Graph, 1200 × 630) of every inner page in both
 * languages from src/data into public/og/<lang>/<page>.png (.jpg for a page that shows a product
 * photo), and writes src/data/og-images.ts (address, size, type, content hash and description of
 * every image, Home included, and the fingerprint of what each image is made from).
 *
 *   npm run og
 *
 * Run it after changing a page's title or lead, a product's name, key figures or photos, the
 * contact details, or after adding a product, then commit public/og and src/data/og-images.ts.
 * `node scripts/og/check.mjs` tells, without a browser, whether the images still match src/data.
 * The Home page keeps the official share images from the logo package (public/og/og-ar.png,
 * og-en.png).
 *
 * The design is scripts/og/templates.mjs (with og.css and fit.js). scripts/og/render.mjs drives
 * Microsoft Edge or Google Chrome already installed on the computer (playwright-core downloads no
 * browser): OG_BROWSER=chrome picks Chrome, OG_BROWSER=<path> a specific browser. Nothing is
 * fetched from the network: every request of the page is answered from the project's public/ and
 * node_modules/@fontsource/ folders. Every image is checked (fit, assets, fonts, Arabic
 * letter-spacing, reading order, safe area, the central square, the band, 300 KB), and nothing is
 * written unless all of them pass.
 */
import { createHash } from 'node:crypto';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { ogFingerprint } from './og/fingerprint.mjs';
import { loadSiteData } from './og/load-data.mjs';
import { openRenderer } from './og/render.mjs';
import { ogHomeAlt, ogPage, SIZE } from './og/templates.mjs';

const root = resolve(import.meta.dirname, '..');
const outDir = join(root, 'public', 'og');

// 1. Data, loaded through Vite so the TypeScript modules and build-time constants work as on the site.
const { data } = await loadSiteData(root);
const rests = [...new Set(data.sitePaths().map((url) => url.replace(/^\/(ar|en)/, '')))].filter(Boolean);

// 2. Render and check every image in memory first: a failed run leaves the current images and
//    src/data/og-images.ts untouched.
const renderer = await openRenderer({ root, size: SIZE });
const images = [];
const failed = [];
try {
  for (const rest of rests) {
    for (const lang of data.LANGS) {
      const name = `${lang}${rest}`;
      try {
        const page = ogPage(data, rest, lang);
        const { buffer, report } = await renderer.render({ name, html: page.html, lang, format: page.format });
        images.push({ rest, lang, format: page.format, alt: page.alt, source: ogFingerprint(root, page), buffer, report });
      } catch (error) {
        failed.push(error.message.startsWith(`${name}:`) ? error.message : `${name}:\n  - ${error.message}`);
      }
    }
  }
} finally {
  await renderer.close();
}
if (failed.length) {
  console.error(`${failed.length} of ${rests.length * data.LANGS.length} link-preview images do not pass, so nothing was written:\n${failed.join('\n')}`);
  process.exit(1);
}

// The manifest keeps its header (comment and interface); without it nothing is written.
const manifestFile = join(root, 'src', 'data', 'og-images.ts');
const previous = await readFile(manifestFile, 'utf8');
const headerEnd = previous.indexOf('export const ogImages');
if (headerEnd < 0) {
  console.error('src/data/og-images.ts has no "export const ogImages" line, so nothing was written.');
  process.exit(1);
}

const hash = (buffer) => createHash('sha256').update(buffer).digest('hex').slice(0, 10);

// 3. Home: the official share images, unchanged (checked before anything is written).
const home = {};
for (const lang of data.LANGS) {
  const src = data.brand.og[lang];
  const buffer = await readFile(join(root, 'public', src));
  if (buffer.toString('latin1', 1, 4) !== 'PNG') throw new Error(`${src} (brand.og.${lang}) is not a PNG file`);
  home[lang] = { src: `${src}?v=${hash(buffer)}`, width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20), type: 'image/png', alt: ogHomeAlt(data, lang) };
}

// 4. Write. The generated folders are cleared first, so a removed page leaves no stale image.
for (const lang of data.LANGS) await rm(join(outDir, lang), { recursive: true, force: true });
const entries = {};
const sources = {};
const lines = [];
for (const { rest, lang, format, alt, source, buffer, report } of images) {
  const name = `${lang}${rest}.${format === 'jpeg' ? 'jpg' : 'png'}`;
  const file = join(outDir, ...name.split('/'));
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, buffer);
  (entries[rest] ??= {})[lang] = { src: `/og/${name}?v=${hash(buffer)}`, ...SIZE, type: `image/${format}`, alt };
  (sources[rest] ??= {})[lang] = source;

  const facts = [
    `title ${report.titleSize} px × ${report.titleLines}`,
    report.kickerSize ? `kicker ${report.kickerSize} px` : !report.dropped.includes('kicker') && 'no kicker',
    report.figuresTotal && `${report.figures} of ${report.figuresTotal} key figures`,
    report.dropped.length && `left out: ${report.dropped.join(', ')}`,
    ...report.notes,
    `band matches (${report.bandMismatch} px differ)`,
  ].filter(Boolean);
  lines.push(`  ${name.padEnd(24)} ${(buffer.length / 1024).toFixed(1).padStart(5)} KB  ${facts.join(' · ')}\n  ${''.padEnd(24)} ${report.titleText.join(' / ')}`);
}

// 5. The manifest the site reads (src/data/og-images.ts), in the project's single-quote style.
/** A string as a single-quoted TypeScript literal (JSON escaping, with the quotes swapped). */
const quote = (value) => `'${JSON.stringify(String(value)).slice(1, -1).replace(/\\"/g, '"').replace(/'/g, "\\'")}'`;
const literal = (image) =>
  `{ src: ${quote(image.src)}, width: ${image.width}, height: ${image.height}, type: ${quote(image.type)}, alt: ${quote(image.alt)} }`;
const body = Object.entries({ '': home, ...entries })
  .map(([rest, set]) => `  ${quote(rest)}: {\n${data.LANGS.map((lang) => `    ${lang}: ${literal(set[lang])},`).join('\n')}\n  },`)
  .join('\n');
const sourceBody = Object.entries(sources)
  .map(([rest, set]) => `  ${quote(rest)}: { ${data.LANGS.map((lang) => `${lang}: ${quote(set[lang])}`).join(', ')} },`)
  .join('\n');
await writeFile(
  manifestFile,
  `${previous.slice(0, headerEnd)}export const ogImages: Readonly<Record<string, { ar: OgImage; en: OgImage }>> = {\n${body}\n};\n\n` +
    `/** Fingerprint of what each image is made from (scripts/og/fingerprint.mjs), compared with src/data by scripts/og/check.mjs. */\n` +
    `export const ogImageSources: Readonly<Record<string, { ar: string; en: string }>> = {\n${sourceBody}\n};\n`,
  'utf8',
);

console.log(`Rendered ${images.length} link-preview images, all checks passed:\n${lines.join('\n')}\nUpdated src/data/og-images.ts`);
