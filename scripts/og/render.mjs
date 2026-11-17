/**
 * Renders link-preview pages in Microsoft Edge (or Chrome) already installed on the computer and
 * checks every image before it is written. Used by scripts/og-images.mjs.
 *
 *   const renderer = await openRenderer({ root, size });
 *   const { buffer, report } = await renderer.render({ name, html, lang, format });
 *   await renderer.close();
 *
 * Every request of the page goes to https://og.render and is answered from the project: files
 * under public/ and node_modules/@fontsource/, by their path from the project root (e.g.
 * https://og.render/public/brand/…). `files` adds addresses for tests only
 * ({ '/public/photos/x.webp': '<path>' }). Anything else is aborted: nothing comes from the network.
 *
 * Grayscale text antialiasing (--disable-lcd-text): Windows' coloured subpixel fringes would
 * otherwise be baked into the images and show when apps scale them down.
 *
 * A render fails, with an Error that lists every problem of the image, unless:
 *   - the page finished its fitting (html[data-ready="1"]) and reports no misfit
 *     (data-fit, data-visual-fit, data-fit-reason; a misfit is reported in the page's own words,
 *     and the layout checks below wait until the text fits)
 *   - every asset loaded, and no [data-fit] element overflows its box (the reading-end column is
 *     measured on its content's boxes, to the half pixel)
 *   - Arabic is never letter-spaced: every text element of an Arabic image, and Arabic script on
 *     any image, has letter-spacing 0
 *   - every glyph comes from the brand fonts (no font of the computer: CSS.getPlatformFontsForNode),
 *     and no text reads "undefined", "NaN" or "[object Object]"
 *   - words read in order on every line ([data-text] blocks): a run of Latin words left to right
 *     (also when an Arabic prefix is written onto its first word, "لـBucher Municipal"), Arabic
 *     right to left, and the runs in the block's direction
 *   - text and the logo stay inside the 64 px safe area and clear of the band; the logo and the
 *     title lie inside the central 630 × 630 square (x 285–915) that some apps crop previews to
 *   - the band (rows 460–629) matches public/og/og-en.png within anti-aliasing tolerance
 *   - the file is at most 300 KB (WhatsApp skips larger preview images)
 */
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { extname, join, resolve, sep } from 'node:path';
import { chromium } from 'playwright-core';
import { ORIGIN } from './templates.mjs';

export { ORIGIN };
const ARGS = ['--disable-lcd-text', '--font-render-hinting=none'];
const MAX_BYTES = 300 * 1024;
const JPEG_QUALITY = 85;
const LIMITS = {
  safe: 64,
  square: { left: 285, right: 915 },
  /** Text ends at least this far above the band (the layout stands it on y 428). */
  bandClear: 8,
};
const BAND = {
  top: 460,
  bottom: 630,
  reference: '/public/og/og-en.png',
  /** A pixel differs when a channel differs by more than this. */
  tolerance: 24,
  /**
   * At most this many differing pixels in the 1200 × 170 band. Anti-aliasing of the tile's edges
   * accounts for 277 (Edge and Chrome 157); the band 1 px off in position or height gives about 775.
   */
  maxPixels: 600,
};
const MIME = {
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
};

async function launch() {
  const choice = process.env.OG_BROWSER;
  const options = choice && /[\\/]/.test(choice) ? { executablePath: choice } : { channel: choice === 'chrome' ? 'chrome' : 'msedge' };
  return chromium.launch({ headless: true, args: ARGS, ...options }).catch((error) => {
    if (choice) throw error;
    return chromium.launch({ headless: true, args: ARGS, channel: 'chrome' });
  });
}

export async function openRenderer({ root, size, files = {} }) {
  const browser = await launch();
  const served = [join(root, 'public') + sep, join(root, 'node_modules', '@fontsource') + sep];
  const context = await browser.newContext({ viewport: size, deviceScaleFactor: 1 });
  let html = '';
  await context.route('**/*', async (route) => {
    const url = new URL(route.request().url());
    if (url.origin !== ORIGIN) return route.abort();
    if (url.pathname === '/') return route.fulfill({ contentType: 'text/html; charset=utf-8', body: html });
    const pathname = decodeURIComponent(url.pathname);
    const extra = Object.hasOwn(files, pathname);
    const file = extra ? files[pathname] : resolve(root, `.${pathname}`);
    if ((!extra && !served.some((dir) => file.startsWith(dir))) || !existsSync(file)) return route.fulfill({ status: 404, body: '' });
    return route.fulfill({ contentType: MIME[extname(file).toLowerCase()] ?? 'application/octet-stream', body: await readFile(file) });
  });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  const failures = [];
  page.on('requestfailed', (request) => failures.push(`${request.url()} (${request.failure()?.errorText ?? 'failed'})`));
  page.on('response', (response) => response.status() >= 400 && failures.push(`${response.status()} ${response.url()}`));
  page.on('pageerror', (error) => failures.push(`script error: ${error.message}`));

  async function render({ name, html: markup, lang, format = 'png' }) {
    html = markup;
    failures.length = 0;
    await page.goto(`${ORIGIN}/`, { waitUntil: 'load' });
    try {
      await page.waitForFunction(() => document.documentElement.dataset.ready === '1', null, { timeout: 20_000 });
    } catch {
      throw new Error(`${name}:\n  - the page did not finish its fitting within 20 s${failures.length ? ` (${failures.join(', ')})` : ''}`);
    }
    const { problems, report } = await page.evaluate(inspect, { lang, width: size.width, height: size.height, bandTop: BAND.top, ...LIMITS });
    if (failures.length) problems.unshift(`assets failed to load: ${failures.join(', ')}`);
    problems.push(...(await systemFonts()));

    const clip = { x: 0, y: 0, ...size };
    const png = await page.screenshot({ type: 'png', clip });
    // The band is compared on the lossless capture, also for pages written as JPEG.
    const band = await page.evaluate(compareBand, {
      shot: `data:image/png;base64,${png.toString('base64')}`,
      reference: `${ORIGIN}${BAND.reference}`,
      top: BAND.top,
      bottom: BAND.bottom,
      tolerance: BAND.tolerance,
    });
    report.bandMismatch = band.mismatch;
    if (band.error) problems.push(`the band check failed: ${band.error}`);
    else if (band.mismatch > BAND.maxPixels) problems.push(`the band (rows ${BAND.top}–${BAND.bottom - 1}) differs from og-en.png in ${band.mismatch} pixels (at most ${BAND.maxPixels})`);

    const buffer = format === 'jpeg' ? await page.screenshot({ type: 'jpeg', quality: JPEG_QUALITY, clip }) : png;
    if (buffer.length > MAX_BYTES) problems.push(`${(buffer.length / 1024).toFixed(0)} KB, above the 300 KB WhatsApp limit`);
    if (problems.length) throw Object.assign(new Error(`${name}:\n${problems.map((p) => `  - ${p}`).join('\n')}`), { problems });
    return { buffer, report: { ...report, bytes: buffer.length } };
  }

  /** Text drawn in a font of the computer instead of the brand fonts (the image would depend on the machine). */
  async function systemFonts() {
    const found = [];
    await cdp.send('DOM.enable');
    await cdp.send('CSS.enable');
    const { root: doc } = await cdp.send('DOM.getDocument', { depth: -1 });
    const { nodeIds } = await cdp.send('DOM.querySelectorAll', { nodeId: doc.nodeId, selector: 'main *' });
    for (const nodeId of nodeIds) {
      let fonts = [];
      try {
        ({ fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId }));
      } catch {
        continue;
      }
      const system = fonts.filter((font) => !font.isCustomFont);
      if (!system.length) continue;
      const { node } = await cdp.send('DOM.describeNode', { nodeId, depth: 1 });
      const text = (node.children ?? []).filter((child) => child.nodeType === 3).map((child) => child.nodeValue).join('').trim();
      if (!text) continue; // the text is in a child element, which is reported itself
      found.push(`text drawn in a font of this computer (${system.map((font) => font.familyName).join(', ')}), not in the brand fonts: "${text.length > 40 ? `${text.slice(0, 39)}…` : text}"`);
    }
    return found;
  }

  return { render, page, close: () => browser.close() };
}

/* ------------------------------------------------------------------ */
/* Checks run in the page (self-contained: they are serialised)        */
/* ------------------------------------------------------------------ */

function inspect({ lang, width, safe, square, bandTop, bandClear }) {
  const problems = [];
  const data = document.documentElement.dataset;
  const ARABIC = /[\p{Script=Arabic}\u0640]/u;
  const LATIN = /[\p{Script=Latin}0-9]/u;
  const at = (r) => `x ${Math.round(r.left)}–${Math.round(r.right)}, y ${Math.round(r.top)}–${Math.round(r.bottom)}`;
  const short = (s) => (s.length > 40 ? `${s.slice(0, 39)}…` : s);
  const rectsOf = (node) => {
    const range = document.createRange();
    range.selectNodeContents(node);
    return [...range.getClientRects()].filter((r) => r.width > 0 && r.height > 0);
  };
  const textNodes = (rootEl) => {
    const list = [];
    const walker = document.createTreeWalker(rootEl, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) if (node.data.trim() && !node.parentElement.closest('script')) list.push(node);
    return list;
  };

  // The page's own fitting. When the text does not fit, the layout checks below would only list
  // its consequences (overflowing boxes, text over the band), so they wait until it fits.
  const misfit = data.fit !== 'true' || data.visualFit !== 'true';
  if (misfit) problems.push(data.fitReason || 'the page reports a misfit');
  const stray = /\b(?:undefined|NaN)\b|\[object Object\]/.exec(document.querySelector('main')?.textContent ?? '');
  if (stray) problems.push(`the image shows "${stray[0]}": a value is missing in src/data`);

  // Assets and boxes.
  for (const img of document.images) if (!img.complete || !img.naturalWidth) problems.push(`picture did not load: ${img.src}`);
  for (const el of misfit ? [] : document.querySelectorAll('[data-fit]')) {
    if (!el.getClientRects().length) continue;
    if (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1) {
      problems.push(`${el.dataset.fit} overflows its box (${el.scrollWidth} × ${el.scrollHeight} px in ${el.clientWidth} × ${el.clientHeight})`);
    }
  }

  const visual = document.querySelector('.visual');
  if (!misfit && visual?.getClientRects().length) {
    const box = visual.getBoundingClientRect();
    for (const child of visual.children) {
      if (!child.getClientRects().length) continue;
      const r = child.getBoundingClientRect();
      if (r.top < box.top - 0.5 || r.bottom > box.bottom + 0.5 || r.left < box.left - 0.5 || r.right > box.right + 0.5) problems.push(`the reading-end column's content (${at(r)}) goes beyond its box (${at(box)})`);
    }
  }

  // Text: letter-spacing, safe area, clear of the band.
  for (const node of textNodes(document.body)) {
    const rects = rectsOf(node);
    if (!rects.length) continue;
    const text = node.data.trim();
    const spacing = getComputedStyle(node.parentElement).letterSpacing;
    if ((lang === 'ar' || ARABIC.test(text)) && spacing !== 'normal' && parseFloat(spacing) !== 0) {
      problems.push(`letter-spaced ${ARABIC.test(text) ? 'Arabic' : 'text on an Arabic image'}: "${short(text)}" (${spacing})`);
    }
    if (misfit) continue;
    for (const r of rects) {
      if (r.left < safe - 0.5 || r.right > width - safe + 0.5 || r.top < safe - 0.5) problems.push(`text outside the ${safe} px safe area: "${short(text)}" (${at(r)})`);
      else if (r.bottom > bandTop - bandClear + 0.5) problems.push(`text too close to the band: "${short(text)}" ends at y ${Math.round(r.bottom)} (the band starts at y ${bandTop})`);
    }
  }
  if (misfit) return { problems: [...new Set(problems)], report: {} };

  // The logo and the title: inside the safe area and the central square.
  const logo = document.querySelector('img[data-logo]');
  if (!logo) problems.push('the logo is missing');
  else {
    const r = logo.getBoundingClientRect();
    if (r.left < safe - 0.5 || r.right > width - safe + 0.5 || r.top < safe - 0.5 || r.bottom > bandTop - bandClear) problems.push(`the logo is outside the safe area (${at(r)})`);
    if (r.left < square.left - 0.5 || r.right > square.right + 0.5) problems.push(`the logo is outside the central square x ${square.left}–${square.right} (${at(r)})`);
  }
  const title = document.querySelector('h1');
  if (!title || !title.textContent.trim()) problems.push('the title is missing');
  else {
    for (const node of textNodes(title)) {
      for (const r of rectsOf(node)) {
        if (r.left < square.left - 0.5 || r.right > square.right + 0.5) problems.push(`the title is outside the central square x ${square.left}–${square.right}: "${short(node.data.trim())}" (${at(r)})`);
      }
    }
  }

  // Reading order. Words are measured on the page: on each line, words follow the block's
  // direction, and a run of words in the other script reads in its own direction (a Latin phrase
  // such as "G2200 Pro" or a phone number left to right inside Arabic). A word ends at a space, where
  // its script changes ("لـ" + "Bucher") and where the text enters or leaves an isolate or a flex
  // item, so punctuation the bidi algorithm places outside an isolate ("Pro،", "«G2200") is a word of
  // its own. A run of the other script ends at an Arabic clause mark or a quotation mark (as in
  // templates.mjs) and at the edge of a flex item; an isolate does not end it, so a Latin phrase
  // split into two isolates is caught.
  const BREAKS = /[،؛؟«»“”]/;
  for (const block of document.querySelectorAll('[data-text]')) {
    if (!block.getClientRects().length) continue;
    const rtl = getComputedStyle(block).direction === 'rtl';
    const words = [];
    let word = null;
    const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      if (!node.parentElement.getClientRects().length) continue;
      let owner = node.parentElement; // the isolate or box the text is set in
      while (owner !== block && !owner.hasAttribute('dir') && getComputedStyle(owner).display === 'inline') owner = owner.parentElement;
      let flow = owner; // the box (block, flex item) whose line it is on
      while (flow !== block && getComputedStyle(flow).display === 'inline') flow = flow.parentElement;
      for (let i = 0; i < node.data.length; i += 1) {
        const ch = node.data[i];
        if (/\s/.test(ch)) {
          word = null;
          continue;
        }
        const script = ARABIC.test(ch) ? 'R' : LATIN.test(ch) ? 'L' : null;
        if (!word || word.owner !== owner || (script && word.kind && word.kind !== script)) {
          word = { text: '', owner, flow, kind: null, start: [node, i] };
          words.push(word);
        }
        word.kind ??= script;
        word.text += ch;
        word.end = [node, i + 1];
      }
    }
    const lines = [];
    for (const w of words) {
      const range = document.createRange();
      range.setStart(...w.start);
      range.setEnd(...w.end);
      w.rect = range.getBoundingClientRect();
      w.size = parseFloat(getComputedStyle(w.start[0].parentElement).fontSize);
      w.kind ??= 'N';
      const centre = w.rect.top + w.rect.height / 2;
      const line = lines.at(-1);
      if (line && Math.abs(centre - line.centre) <= Math.min(line.size, w.size) * 0.5) line.words.push(w);
      else lines.push({ centre, size: w.size, words: [w] });
    }
    const other = rtl ? 'L' : 'R';
    const text = (unit) => unit.words.map((w) => w.text).join(' ');
    const span = (unit) => ({ left: Math.min(...unit.words.map((w) => w.rect.left)), right: Math.max(...unit.words.map((w) => w.rect.right)) });
    for (const line of lines) {
      const units = [];
      let broken = false;
      for (const w of line.words) {
        if (w.kind === 'N') {
          if (BREAKS.test(w.text)) broken = true;
          continue;
        }
        const last = units.at(-1);
        const joins = last && !broken && w.kind === other && last.kind === other && last.flow === w.flow && !BREAKS.test(last.words.at(-1).text) && !BREAKS.test(w.text);
        if (joins) last.words.push(w);
        else units.push({ kind: w.kind, flow: w.flow, words: [w] });
        broken = false;
      }
      for (const unit of units) {
        for (let i = 1; i < unit.words.length; i += 1) {
          const a = unit.words[i - 1].rect;
          const b = unit.words[i].rect;
          if (other === 'L' ? b.left < a.right - 1 : b.right > a.left + 1) problems.push(`"${text(unit)}" does not read ${other === 'L' ? 'left to right' : 'right to left'}`);
        }
      }
      for (let i = 1; i < units.length; i += 1) {
        const a = span(units[i - 1]);
        const b = span(units[i]);
        if (rtl ? b.right > a.left + 1 : b.left < a.right - 1) problems.push(`"${text(units[i - 1])}" and "${text(units[i])}" are out of reading order`);
      }
    }
  }

  return {
    problems: [...new Set(problems)],
    report: {
      titleSize: Number(data.titleSize),
      titleLines: Number(data.titleLines),
      titleText: JSON.parse(data.titleText || '[]'),
      kickerSize: data.kickerSize ? Number(data.kickerSize) : null,
      figures: Number(data.figures || 0),
      figuresTotal: Number(data.figuresTotal || 0),
      dropped: data.dropped ? data.dropped.split(',') : [],
      titleFallback: data.titleFallback === '1',
      notes: JSON.parse(data.notes || '[]'),
    },
  };
}

async function compareBand({ shot, reference, top, bottom, tolerance }) {
  const load = (src) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`could not load ${src.startsWith('data:') ? 'the screenshot' : src}`));
      img.src = src;
    });
  try {
    const [shotImage, referenceImage] = await Promise.all([load(shot), load(reference)]);
    const width = shotImage.naturalWidth;
    if (referenceImage.naturalWidth !== width || referenceImage.naturalHeight < bottom) return { error: `${reference} is ${referenceImage.naturalWidth} × ${referenceImage.naturalHeight}` };
    const rows = bottom - top;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = rows;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    const pixels = (img) => {
      context.clearRect(0, 0, width, rows);
      context.drawImage(img, 0, -top);
      return context.getImageData(0, 0, width, rows).data;
    };
    const a = pixels(shotImage);
    const b = pixels(referenceImage);
    let mismatch = 0;
    for (let i = 0; i < a.length; i += 4) {
      if (Math.max(Math.abs(a[i] - b[i]), Math.abs(a[i + 1] - b[i + 1]), Math.abs(a[i + 2] - b[i + 2])) > tolerance) mismatch += 1;
    }
    return { mismatch };
  } catch (error) {
    return { error: error.message };
  }
}
