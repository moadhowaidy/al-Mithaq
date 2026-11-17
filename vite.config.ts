import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * Heading weights of both languages are preloaded so that the other language
 * is already in the browser when the visitor switches (see docs/BUILD_PROMPT.md).
 * Arabic: Noto Kufi Arabic 700/800/900 · Latin: Barlow 600/700.
 */
const PRELOADED_FONTS = [
  /noto-kufi-arabic-arabic-(700|800|900)-normal-[\w-]+\.woff2$/,
  /barlow-latin-(600|700)-normal-[\w-]+\.woff2$/,
];

function preloadHeadingFonts(): Plugin {
  return {
    name: 'mithaq:preload-heading-fonts',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(_html, ctx) {
        if (!ctx.bundle) return [];
        return Object.keys(ctx.bundle)
          .filter((file) => PRELOADED_FONTS.some((pattern) => pattern.test(file)))
          .sort()
          .map((file) => ({
            tag: 'link',
            attrs: { rel: 'preload', as: 'font', type: 'font/woff2', href: `/${file}`, crossorigin: '' },
            injectTo: 'head' as const,
          }));
      },
    },
  };
}

/**
 * The site's public address, used in canonical links, link previews (og:url, og:image) and the
 * sitemap. SITE_URL wins when it is set. On Vercel it is the project's production domain
 * (al-mithaq.com once that domain is connected, the vercel.app address until then), so shared
 * links always point at a site that answers and their preview image always loads. Elsewhere,
 * https://al-mithaq.com.
 */
function siteUrl(): string {
  const explicit = process.env.SITE_URL?.trim();
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  const value = explicit || vercel || 'https://al-mithaq.com';
  const invalid = new Error(`Invalid site address "${value}" (SITE_URL or VERCEL_PROJECT_PRODUCTION_URL): expected https://<domain>`);
  let url: URL;
  try {
    url = new URL(value.includes('://') ? value : `https://${value}`);
  } catch {
    throw invalid;
  }
  // https only (plain http is accepted for a local test server), and a real domain name.
  const local = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  if (!(url.protocol === 'https:' || (local && url.protocol === 'http:')) || (!local && !url.hostname.includes('.'))) throw invalid;
  return url.origin;
}

export default defineConfig({
  plugins: [react(), tailwindcss(), preloadHeadingFonts()],
  define: { __SITE_URL__: JSON.stringify(siteUrl()) },
});
