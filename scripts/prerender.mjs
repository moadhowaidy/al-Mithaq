/**
 * Pre-renders every page in both languages and writes sitemap.xml.
 *
 * Runs after `vite build` (client) and `vite build --ssr src/entry-server.tsx --outDir dist-ssr`.
 * For each address from sitePaths() it renders the app to HTML, moves the page's <title>,
 * <meta> and <link> tags into <head>, sets <html lang dir> and writes dist/<lang>/<page>.html.
 * dist/index.html stays the app shell for "/" and unknown addresses (vercel.json rewrites
 * everything that is not a file to it).
 */
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(import.meta.dirname, '..');
const dist = join(root, 'dist');
const ssrDir = join(root, 'dist-ssr');

const template = await readFile(join(dist, 'index.html'), 'utf8');
const { render, sitePaths, SITE_URL, company } = await import(pathToFileURL(join(ssrDir, 'entry-server.js')).href);

/** React 19 emits a page's hoistable tags (<title>, <meta>, <link>) before the markup. */
const LEADING_HEAD_TAGS = /^(?:<title>[\s\S]*?<\/title>|<meta\b[^>]*>|<link\b[^>]*>)+/;

/** Renders an address; returns its head tags (marked data-ssr, which main.tsx removes) and its markup. */
function renderParts(url) {
  const { html, lang, dir } = render(url);
  const head = html.match(LEADING_HEAD_TAGS)?.[0] ?? '';
  if (!head.includes('<title>')) throw new Error(`No <title> rendered for ${url}`);
  const headTags = head.replace(/<(title|meta|link)\b/g, '<$1 data-ssr').replace(/hrefLang=/g, 'hreflang=');
  return { headTags, body: html.slice(head.length), lang, dir };
}

function buildPage(url) {
  const { headTags, body, lang, dir } = renderParts(url);

  // Function replacements, so "$" in page text is never read as a replacement pattern.
  const page = template
    .replace(/<html lang="[^"]*" dir="[^"]*">/, () => `<html lang="${lang}" dir="${dir}">`)
    .replace(/<!-- seo:start[\s\S]*?<!-- seo:end -->/, () => headTags)
    .replace(/\s*<!-- shell:start[\s\S]*?<!-- shell:end -->/, () => '')
    .replace('<div id="root"></div>', () => `<div id="root">${body}</div>`);

  if (page === template || !page.includes(body.slice(0, 200))) throw new Error(`Template markers missing while rendering ${url}`);
  return page;
}

// Flat files (dist/en/products/g2200.html): served at /en/products/g2200 by Vercel's cleanUrls
// and by `vite preview`, without a trailing slash.
const paths = sitePaths();
for (const url of paths) {
  const segments = url.split('/').filter(Boolean);
  const file = join(dist, ...segments.slice(0, -1), `${segments.at(-1)}.html`);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, buildPage(url), 'utf8');
  console.log(`  pre-rendered ${url}`);
}

// sitemap.xml: every page in both languages, each with its hreflang alternates.
const today = new Date().toISOString().slice(0, 10);
const pages = [...new Set(paths.map((url) => url.replace(/^\/(ar|en)/, '')))];
const entries = pages.flatMap((rest) =>
  ['ar', 'en'].map(
    (lang) => `  <url>
    <loc>${SITE_URL}/${lang}${rest}</loc>
    <lastmod>${today}</lastmod>
    <xhtml:link rel="alternate" hreflang="ar" href="${SITE_URL}/ar${rest}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}/en${rest}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/ar${rest}"/>
  </url>`,
  ),
);
await writeFile(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`,
  'utf8',
);
console.log(`  wrote sitemap.xml (${entries.length} addresses)`);

// The app shell ("/" and unknown addresses) carries the Arabic home page's tags, rendered from
// src/data like every page, so link previews of the bare domain follow any copy correction.
// Its body stays empty and it keeps the no-JavaScript forward to /ar.
const shellTags = renderParts('/ar').headTags;
await writeFile(join(dist, 'index.html'), template.replace(/<!-- seo:start[\s\S]*?<!-- seo:end -->/, () => shellTags), 'utf8');
console.log('  wrote the app shell head tags from src/data');

// The web manifest takes the names from src/data too (public/site.webmanifest is the development copy).
const manifest = {
  name: `${company.name.en} · ${company.name.ar}`,
  short_name: company.shortName.en,
  start_url: '/',
  display: 'standalone',
  background_color: '#F6F3EC',
  theme_color: '#0E2240',
  icons: [
    { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
  ],
};
await writeFile(join(dist, 'site.webmanifest'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
console.log('  wrote site.webmanifest from src/data');

await rm(ssrDir, { recursive: true, force: true });
