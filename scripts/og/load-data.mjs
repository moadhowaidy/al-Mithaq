/**
 * Loads the site's data (src/data/index.ts) and the link-preview manifest (src/data/og-images.ts)
 * through Vite, so the TypeScript modules and the build-time constants (vite.config.ts) work as on
 * the site. Used by scripts/og-images.mjs and scripts/og/check.mjs.
 *
 * Vite's dependency discovery is switched off: loading src/data does not need it, and when the
 * server closes while it is still scanning it leaves a node_modules/.vite/deps_temp_* folder
 * behind. (@vitejs/plugin-react still asks for React to be pre-bundled into node_modules/.vite/deps,
 * which is harmless.)
 */
import { createServer } from 'vite';

export async function loadSiteData(root) {
  const vite = await createServer({
    root,
    logLevel: 'error',
    appType: 'custom',
    optimizeDeps: { noDiscovery: true, include: [] },
    server: { middlewareMode: true, hmr: false, ws: false },
  });
  try {
    const data = await vite.ssrLoadModule('/src/data/index.ts');
    const manifest = await vite.ssrLoadModule('/src/data/og-images.ts');
    return { data, manifest };
  } finally {
    await vite.close();
  }
}
