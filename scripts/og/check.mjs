/**
 * Checks that the link-preview images still match src/data. It needs no browser, so it can run in
 * the build (also on Vercel):
 *
 *   node scripts/og/check.mjs
 *
 * For every inner page it rebuilds the image's page (templates.mjs) and compares its fingerprint
 * (fingerprint.mjs) with the one `npm run og` recorded in src/data/og-images.ts (ogImageSources);
 * so a changed title, lead, product name, key figure, phone number, email, description pattern,
 * picture or template is noticed. It also checks that every image file exists in public/ with the
 * content hash its address carries (?v=), and that the Home images' description still matches
 * src/data. Exit code 1, with the reasons, when an image is out of date: run `npm run og`, then
 * commit public/og and src/data/og-images.ts. A page without an image of its own (it shows the Home
 * image) is only noted.
 *
 *   checkOgImages({ root, data, ogImages, ogImageSources }) → { problems, notes }
 */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ogFingerprint } from './fingerprint.mjs';
import { ogHomeAlt, ogPage } from './templates.mjs';

export function checkOgImages({ root, data, ogImages, ogImageSources = {} }) {
  const problems = [];
  const notes = [];
  const contentHash = (file) => createHash('sha256').update(readFileSync(file)).digest('hex').slice(0, 10);
  const pages = [...new Set(data.sitePaths().map((url) => url.replace(/^\/(ar|en)/, '')))];
  const name = (rest, lang) => `${lang}${rest || ' (Home)'}`;

  // Every image the manifest names: in public/, with the content hash its address carries.
  for (const [rest, set] of Object.entries(ogImages)) {
    if (rest && !pages.includes(rest)) notes.push(`${rest}: an image for a page that no longer exists`);
    for (const lang of data.LANGS) {
      const image = set?.[lang];
      if (!image) {
        problems.push(`${name(rest, lang)}: no entry in src/data/og-images.ts`);
        continue;
      }
      const [path, query = ''] = image.src.split('?');
      const file = join(root, 'public', ...path.split('/').filter(Boolean));
      if (!existsSync(file)) problems.push(`${name(rest, lang)}: public${path} is missing`);
      else if (new URLSearchParams(query).get('v') !== contentHash(file)) problems.push(`${name(rest, lang)}: public${path} has changed since src/data/og-images.ts was written (?v= does not match)`);
    }
  }

  // Home: the official images; their description comes from src/data.
  for (const lang of data.LANGS) {
    const image = ogImages['']?.[lang];
    const alt = ogHomeAlt(data, lang);
    if (image && image.alt !== alt) problems.push(`${name('', lang)}: the description reads "${image.alt}", src/data now gives "${alt}"`);
  }

  // Inner pages: what the image would show today against what it was made from.
  for (const rest of pages.filter(Boolean)) {
    if (!ogImages[rest]) {
      notes.push(`${rest}: no link-preview image of its own yet (the Home image is used)`);
      continue;
    }
    for (const lang of data.LANGS) {
      let page;
      try {
        page = ogPage(data, rest, lang);
      } catch (error) {
        problems.push(`${name(rest, lang)}: ${error.message}`);
        continue;
      }
      const image = ogImages[rest][lang];
      if (!image) continue; // reported above
      if (ogImageSources[rest]?.[lang] !== ogFingerprint(root, page)) {
        const what = image.alt !== page.alt ? ` (it was made for "${image.alt}", the page is now "${page.alt}")` : '';
        problems.push(`${name(rest, lang)}: the image no longer matches src/data or the template${what}`);
      } else if (image.type !== `image/${page.format}`) problems.push(`${name(rest, lang)}: the manifest says ${image.type}, the page is now ${page.format}`);
    }
  }
  return { problems, notes };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const { loadSiteData } = await import('./load-data.mjs');
  const root = resolve(import.meta.dirname, '..', '..');
  const { data, manifest } = await loadSiteData(root);
  const { problems, notes } = checkOgImages({ root, data, ogImages: manifest.ogImages, ogImageSources: manifest.ogImageSources });
  for (const note of notes) console.log(`  note: ${note}`);
  if (problems.length) {
    console.error(`Link-preview images are out of date:\n${problems.map((p) => `  - ${p}`).join('\n')}\nRun \`npm run og\`, then commit public/og and src/data/og-images.ts.`);
    process.exit(1);
  }
  console.log('  link-preview images match src/data');
}
