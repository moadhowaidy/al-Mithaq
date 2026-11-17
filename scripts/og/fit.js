/*
 * Fitting of one link-preview image. Runs in the page (templates.mjs inlines this file).
 * When it has finished, <html> carries:
 *   data-ready="1"
 *   data-fit="true|false"          false: the text cannot be set within the rules
 *   data-visual-fit="true|false"   false: the reading-end column overflows
 *   data-fit-reason                why, in words (empty when everything fits)
 *   data-title-size, data-title-lines, data-title-text (JSON: the title's lines as set),
 *   data-title-fallback ("1" when the title needed a last-resort setting), data-kicker-size,
 *   data-figures, data-figures-total (key figures shown, of), data-dropped (optional lines left out),
 *   data-notes (JSON: what else gave way, and why)
 *
 * 1. Fonts, pictures and the band tile are loaded and decoded first.
 * 2. The kicker keeps one line: its own size, or 2 px smaller. A product's sector kicker that is
 *    still too long gives way (with its hairline); any other kicker is a misfit.
 * 3. Contact: phone and email share a line when they fit, otherwise each takes its own line (no dot
 *    between them); a phone number or email wider than the column is a misfit.
 * 4. The title takes the largest size that keeps it on one line (down to --title-one-line-min),
 *    otherwise the largest from --title-multi-max down to --title-min on up to --title-max-lines
 *    lines. Every size must keep each line inside the column and the whole stack inside its box.
 *    If nothing fits even at the smallest size, optional lines give way (data-optional, lowest
 *    number first; the kicker takes its hairline with it) and the title is fitted again. As a last
 *    resort the title's other settings are tried in order (template[data-title-fallback], see
 *    titleHtml in templates.mjs: the words always keep their order), each with its optional lines
 *    back where they fit.
 * 5. A title of three words or more never ends on a single word (in Arabic a Latin model code may
 *    stand alone: it is the name's own break point; a setting marked data-lone allows it).
 * 6. Arabic kicker, title and lead start with their first stroke on the column edge: the side
 *    bearing of the glyph at the start of each line is measured and taken back.
 * 7. The reading-end column stands on the main column's last baseline: the Gateway window's foot,
 *    the ink of the sector icons' last row and of a standing picture (img[data-stand], measured on a
 *    canvas), the gold word's baseline and the last key figure's baseline sit on it.
 * 8. Key figures give way: one too wide for the column wherever it stands, then the last ones until
 *    the column holds them. With none left, the product picture stands on the baseline instead.
 */
(async () => {
  const root = document.documentElement;
  const problems = [];
  const visualProblems = [];
  const dropped = []; // { el, name }
  const notes = [];
  const px = (el, prop) => parseFloat(getComputedStyle(el)[prop]) || 0;
  const overflowsX = (el) => el.scrollWidth > el.clientWidth + 1;
  const shown = (el) => Boolean(el) && !el.hidden && el.getClientRects().length > 0;
  const ARABIC = /[\p{Script=Arabic}\u0640]/u;
  const clean = (text) => text.replace(/\s+/g, ' ').trim();

  // Words of an element in reading (logical) order, split at spaces and no-break spaces, each with
  // its box on the page and its text nodes ("لـBucher" is one word across two nodes).
  const wordsOf = (el) => {
    const words = [];
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let word = null;
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      if (!node.parentElement.getClientRects().length) continue; // hidden
      for (let i = 0; i < node.data.length; i += 1) {
        if (/\s/.test(node.data[i])) {
          word = null;
          continue;
        }
        if (!word) {
          word = { text: '', start: [node, i], nodes: [] };
          words.push(word);
        }
        if (word.nodes.at(-1) !== node) word.nodes.push(node);
        word.text += node.data[i];
        word.end = [node, i + 1];
      }
    }
    for (const w of words) {
      const range = document.createRange();
      range.setStart(...w.start);
      range.setEnd(...w.end);
      w.rect = range.getBoundingClientRect();
    }
    return words;
  };
  // Lines of an element: its words grouped by their vertical centre (a Latin run set in Barlow
  // inside an Arabic line sits a little higher or lower, but on the same line).
  const linesOf = (el) => {
    const size = px(el, 'fontSize');
    const lines = [];
    for (const w of wordsOf(el)) {
      const centre = w.rect.top + w.rect.height / 2;
      const line = lines.at(-1);
      if (line && Math.abs(centre - line.centre) <= size * 0.5) line.words.push(w);
      else lines.push({ centre, words: [w] });
    }
    return lines.map((line) => line.words);
  };
  // The baseline of an element's last line: an empty inline-block sits with its bottom on it.
  const baselineOf = (el) => {
    const mark = document.createElement('span');
    mark.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline';
    el.appendChild(mark);
    const y = mark.getBoundingClientRect().bottom;
    mark.remove();
    return y;
  };
  // How far the ink of each line starts inside the element's start edge (px; the smallest over its
  // lines): the text at the start of each line, measured on a canvas in its own font.
  const canvas = document.createElement('canvas').getContext('2d');
  const startInset = (el) => {
    const rtl = getComputedStyle(el).direction === 'rtl';
    const pieces = [];
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      if (!node.parentElement.getClientRects().length) continue;
      for (const m of node.data.matchAll(/\S+/g)) {
        const range = document.createRange();
        range.setStart(node, m.index);
        range.setEnd(node, m.index + m[0].length);
        pieces.push({ text: m[0], parent: node.parentElement, rect: range.getBoundingClientRect() });
      }
    }
    const size = px(el, 'fontSize');
    const lines = [];
    for (const p of pieces) {
      const centre = p.rect.top + p.rect.height / 2;
      const line = lines.find((l) => Math.abs(l.centre - centre) <= size * 0.5);
      if (line) line.pieces.push(p);
      else lines.push({ centre, pieces: [p] });
    }
    let inset = Infinity;
    for (const line of lines) {
      const edge = line.pieces.reduce((a, b) => (rtl ? (b.rect.right > a.rect.right ? b : a) : b.rect.left < a.rect.left ? b : a));
      const cs = getComputedStyle(edge.parent);
      canvas.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      canvas.direction = ARABIC.test(edge.text) ? 'rtl' : 'ltr';
      canvas.textAlign = rtl ? 'right' : 'left';
      const m = canvas.measureText(edge.text);
      inset = Math.min(inset, rtl ? -m.actualBoundingBoxRight : -m.actualBoundingBoxLeft);
    }
    return Number.isFinite(inset) ? inset : 0;
  };

  // How far the ink of a picture ends above the foot of its box (px): its pixels on a canvas.
  const inkGap = (img) => {
    try {
      const r = img.getBoundingClientRect();
      const w = Math.max(1, Math.round(r.width));
      const h = Math.max(1, Math.round(r.height));
      const paper = document.createElement('canvas');
      paper.width = w;
      paper.height = h;
      const context = paper.getContext('2d', { willReadFrequently: true });
      context.drawImage(img, 0, 0, w, h);
      const { data } = context.getImageData(0, 0, w, h);
      for (let y = h - 1; y >= 0; y -= 1) for (let x = 0; x < w; x += 1) if (data[(y * w + x) * 4 + 3] > 64) return ((h - 1 - y) * r.height) / h;
    } catch {
      // A picture the canvas cannot read stands on its box.
    }
    return 0;
  };

  try {
    // 1. Fonts (every declared face, so none is still loading), pictures, the band tile.
    await Promise.allSettled([...document.fonts].map((face) => face.load()));
    await document.fonts.ready;
    for (const face of document.fonts) if (face.status !== 'loaded') problems.push(`font did not load: ${face.family} ${face.weight}`);
    const pictures = [...document.images, ...[...document.querySelectorAll('[data-bg]')].map((el) => Object.assign(new Image(), { src: el.dataset.bg }))];
    const decoded = await Promise.allSettled(pictures.map((img) => img.decode()));
    decoded.forEach((result, i) => result.status === 'rejected' && problems.push(`picture did not load: ${pictures[i].src}`));

    const kicker = document.querySelector('.kicker');
    const rule = document.querySelector('.rule');
    const title = document.querySelector('.title');
    const lead = document.querySelector('.lead');
    const details = document.querySelector('.details');
    const stack = document.querySelector('.stack');
    const box = document.querySelector('.content');
    const visual = document.querySelector('.visual');
    const rtl = getComputedStyle(title).direction === 'rtl';
    const drop = (el, name) => {
      el.hidden = true;
      if (el === kicker && rule) rule.hidden = true; // the hairline belongs to the kicker
      dropped.push({ el, name });
    };
    const restore = (el) => {
      el.hidden = false;
      if (el === kicker && rule) rule.hidden = false;
      const index = dropped.findIndex((d) => d.el === el);
      if (index >= 0) dropped.splice(index, 1);
    };

    // 2. Kicker on one line.
    if (kicker) {
      const start = px(kicker, 'fontSize');
      for (const size of [start, start - 2]) {
        kicker.style.fontSize = `${size}px`;
        if (!overflowsX(kicker)) break;
      }
      if (overflowsX(kicker)) {
        if (kicker.dataset.optional) drop(kicker, 'kicker');
        else problems.push(`the kicker "${clean(kicker.textContent)}" is wider than the column even at ${start - 2} px`);
      }
    }

    // 3. Phone and email: one line, or one line each.
    if (details) {
      const items = [...details.querySelectorAll('.detail')];
      for (const item of items) {
        const width = item.getBoundingClientRect().width;
        if (width > box.clientWidth + 1) problems.push(`the ${item.dataset.name || 'contact detail'} "${item.textContent}" is wider than the column (${Math.ceil(width)} px in ${box.clientWidth}). Shorten it in src/data/index.ts.`);
      }
      if (new Set(items.map((item) => Math.round(item.getBoundingClientRect().top))).size > 1) {
        details.classList.add('stacked');
        notes.push('phone and email on two lines');
      }
    }

    // 4. Title.
    const cs = getComputedStyle(title);
    const value = (name, fallback) => {
      const v = parseFloat(cs.getPropertyValue(name));
      return Number.isFinite(v) ? v : fallback;
    };
    const max = value('--title-max', 112);
    const oneMin = value('--title-one-line-min', max);
    const multiMax = value('--title-multi-max', 88);
    const min = value('--title-min', 64);
    const maxLines = value('--title-max-lines', 3);
    // The stack's height without its padding below the line (room for glyphs, see og.css).
    const stackHeight = () => stack.getBoundingClientRect().height - px(stack, 'paddingBottom');
    const fits = (lines) => !overflowsX(title) && stackHeight() <= box.clientHeight + 0.5 && linesOf(title).length <= lines;
    const trySize = (size, lines) => {
      title.style.fontSize = `${size}px`;
      return fits(lines);
    };
    const fitTitle = () => {
      for (let s = max; s >= oneMin; s -= 2) if (trySize(s, 1)) return s;
      for (let s = Math.min(multiMax, max); s >= min; s -= 2) if (trySize(s, maxLines)) return s;
      return 0;
    };
    const settings = [{ html: title.innerHTML, lone: false, note: '' }, ...[...document.querySelectorAll('template[data-title-fallback]')].map((t) => ({ html: t.innerHTML, lone: t.hasAttribute('data-lone'), note: t.dataset.note }))];
    const optionalAll = [...document.querySelectorAll('[data-optional]')].filter((el) => !el.hidden).sort((a, b) => a.dataset.optional - b.dataset.optional);
    let size = 0;
    let setting = settings[0];
    for (const candidate of settings) {
      setting = candidate;
      title.innerHTML = candidate.html;
      for (const el of optionalAll) if (el.hidden) restore(el);
      const optional = [...optionalAll];
      size = fitTitle();
      // 5. Optional lines give way if the title cannot fit at its smallest size.
      while (!size && optional.length) {
        const el = optional.shift();
        drop(el, el.dataset.name || el.className);
        size = fitTitle();
      }
      if (size) break;
    }
    if (size && setting.note) notes.push(setting.note);
    if (!size) {
      title.style.fontSize = `${min}px`;
      const without = dropped.length ? ` even without the ${dropped.map((d) => d.name).join(' and the ')}` : '';
      const hint = title.dataset.hint ? ` ${title.dataset.hint}` : '';
      const wide = linesOf(title)
        .map((line) => ({ text: line.map((w) => w.text).join(' '), width: Math.max(...line.map((w) => w.rect.right)) - Math.min(...line.map((w) => w.rect.left)) }))
        .find((line) => line.width > title.clientWidth + 1);
      if (wide) problems.push(`the title "${clean(title.textContent)}" does not fit at ${min} px${without}: "${wide.text}" must stay on one line and is ${Math.ceil(wide.width)} px wide, the column ${title.clientWidth} px.${hint}`);
      else problems.push(`the title "${clean(title.textContent)}" does not fit on ${maxLines} lines at ${min} px${without}.${hint}`);
    }

    // 5. A title of three words or more never ends on a single word.
    const lines = linesOf(title);
    const words = lines.flat();
    const last = lines.at(-1) ?? [];
    const code = last.length === 1 && last[0].nodes.some((node) => node.parentElement.closest('[data-code]'));
    if (size && lines.length > 1 && words.length >= 3 && last.length === 1 && !code && !setting.lone) problems.push(`the title ends on a single word ("${last[0].text}")`);

    // 6. Arabic: the first stroke of each block on the column edge.
    if (rtl) {
      for (const el of [kicker, title, lead]) {
        if (!shown(el)) continue;
        const inset = startInset(el);
        if (Math.abs(inset) > 0.25 && Math.abs(inset) < 0.15 * px(el, 'fontSize')) el.style.marginInlineStart = `${-Math.round(inset * 10) / 10}px`;
      }
    }

    // 7–8. The reading-end column: on the last baseline, key figures giving way.
    const lastText = [...stack.querySelectorAll(':scope > [data-text]')].filter(shown).at(-1);
    const baseline = lastText ? baselineOf(lastText === details ? [...details.querySelectorAll('.detail')].at(-1) : lastText) : null;
    const standOn = (offset) => {
      visual.style.height = `${baseline + offset - visual.getBoundingClientRect().top}px`;
    };
    // The column holds its content: measured on the boxes (scrollHeight is rounded to whole pixels).
    const holds = () => {
      const column = visual.getBoundingClientRect();
      const inside = [...visual.children].every((child) => {
        if (!child.getClientRects().length) return true;
        const r = child.getBoundingClientRect();
        return r.top >= column.top - 0.5 && r.bottom <= column.bottom + 0.5;
      });
      return inside && visual.scrollWidth <= visual.clientWidth + 1;
    };
    const figures = visual ? [...visual.querySelectorAll('.figure')] : [];
    const showing = () => figures.filter((f) => !f.hidden);
    // A standing picture (and its glow, 0.45 of its height above it): its ink's foot on the baseline.
    const standPicture = () => {
      const img = document.querySelector('img.picture');
      const glow = document.querySelector('.glow');
      if (!img || baseline === null) return;
      const h = img.getBoundingClientRect().height;
      const top = baseline + inkGap(img) - h;
      img.style.top = `${top}px`;
      if (glow) glow.style.top = `${top - h * 0.45}px`;
    };
    if (document.querySelector('img.picture[data-stand]')) standPicture();
    if (visual && baseline !== null) {
      const win = visual.querySelector('.window');
      const word = visual.querySelector('.word');
      const icons = visual.querySelector('.icons');
      if (win) standOn(0);
      else if (word) standOn(word.getBoundingClientRect().bottom - baselineOf(word));
      else if (icons) {
        const images = [...icons.querySelectorAll('img')];
        const foot = Math.max(...images.map((img) => img.getBoundingClientRect().bottom));
        const lastRow = images.filter((img) => Math.abs(img.getBoundingClientRect().bottom - foot) < 1);
        standOn(Math.min(...lastRow.map(inkGap)) + (icons.getBoundingClientRect().bottom - foot));
      }
    }
    if (figures.length) {
      for (const f of figures) {
        if (f.scrollWidth > f.clientWidth + 1) {
          f.hidden = true;
          notes.push(`key figure "${f.dataset.name}" is wider than the column`);
        }
      }
      const block = visual.querySelector('.figures');
      // The offset from the last label's baseline to the column's foot is the same for every figure.
      for (let pass = 0; pass < 3; pass += 1) {
        if (baseline !== null && showing().length) standOn(block.getBoundingClientRect().bottom - baselineOf(showing().at(-1).querySelector('.figure-label')));
        while (!holds() && showing().length) showing().at(-1).hidden = true;
      }
      if (!showing().length) standPicture();
    }
    if (visual && !holds()) visualProblems.push(`the reading-end column needs ${visual.scrollWidth} × ${visual.scrollHeight} px but has ${visual.clientWidth} × ${visual.clientHeight}`);

    root.dataset.titleSize = String(parseFloat(title.style.fontSize));
    root.dataset.titleLines = String(lines.length);
    root.dataset.titleText = JSON.stringify(lines.map((line) => line.map((w) => w.text).join(' ')));
    root.dataset.titleFallback = size && setting !== settings[0] ? '1' : '';
    root.dataset.kickerSize = shown(kicker) ? String(px(kicker, 'fontSize')) : '';
    root.dataset.figures = String(showing().length);
    root.dataset.figuresTotal = String(figures.length);
  } catch (error) {
    problems.push(`the fitting script failed: ${error.message}`);
  }

  root.dataset.dropped = dropped.map((d) => d.name).join(',');
  root.dataset.notes = JSON.stringify(notes);
  root.dataset.fit = String(!problems.length);
  root.dataset.visualFit = String(!visualProblems.length);
  root.dataset.fitReason = [...problems, ...visualProblems].join('; ');
  // Two frames, so the final layout is painted before the screenshot.
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  root.dataset.ready = '1';
})();
