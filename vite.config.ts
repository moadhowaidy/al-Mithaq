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

export default defineConfig({
  plugins: [react(), tailwindcss(), preloadHeadingFonts()],
});
