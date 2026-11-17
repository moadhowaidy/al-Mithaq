/**
 * What a link-preview image is made from, as a short fingerprint, so a change in src/data that the
 * image does not show yet is noticed (scripts/og/check.mjs).
 *
 *   ogFingerprint(root, { html, alt, format }) → 10 hexadecimal characters
 *
 * It covers the image's page (every word, the template, og.css and fit.js), its description and
 * format, and the bytes of every file the page loads (logo, pictures, icons, band tile, fonts).
 * Text files are read with Unix line endings, so the fingerprint is the same on every computer.
 * The renderer (scripts/og/render.mjs) and the browser are not part of it.
 */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ORIGIN } from './templates.mjs';

const TEXT_FILE = /\.(?:svg|css|html?|txt|json)$/i;
const FILE_ADDRESS = new RegExp(`${ORIGIN.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(/(?:public|node_modules/@fontsource)/[^"'()\\s<>]+)`, 'g');

export function ogFingerprint(root, { html, alt, format }) {
  const page = html.replace(/\r\n?/g, '\n');
  const hash = createHash('sha256').update(`${format}\0${alt}\0${page}`);
  const files = [...new Set([...page.matchAll(FILE_ADDRESS)].map((m) => decodeURIComponent(m[1].replace(/&amp;/g, '&'))))].sort();
  for (const path of files) {
    let bytes;
    try {
      bytes = readFileSync(join(root, ...path.split('/').filter(Boolean)));
    } catch {
      bytes = Buffer.from('(missing)');
    }
    if (TEXT_FILE.test(path)) bytes = Buffer.from(bytes.toString('utf8').replace(/\r\n?/g, '\n'));
    hash.update(`\0${path}\0`).update(bytes);
  }
  return hash.digest('hex').slice(0, 10);
}
