/**
 * Pre-rendering entry, used only at build time by scripts/prerender.mjs.
 * Renders one address to HTML; React 19 emits the page's <title>, <meta> and <link> tags
 * first, and the script moves them into <head>.
 */
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import App from './App';
import { DEFAULT_LANG, SITE_URL, company, dirOf, isLang, sitePaths } from './data';

export { sitePaths, SITE_URL, company };

export function render(url: string) {
  const html = renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  );
  const segment = url.split('/')[1];
  const lang = isLang(segment) ? segment : DEFAULT_LANG;
  return { html, lang, dir: dirOf(lang) };
}
