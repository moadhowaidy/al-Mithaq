/**
 * The link-preview image (Open Graph, 1200 × 630) of an inner page, as an HTML page that
 * scripts/og-images.mjs photographs.
 *
 *   ogPage(data, rest, lang) → { html, alt, format }
 *     data    the module namespace of src/data/index.ts (read only)
 *     rest    the address without the language prefix: '/sectors', '/products',
 *             '/products/<id>', '/about', '/partners', '/contact'
 *     alt     the image description (og:image:alt), from copy.og.pageAlt
 *     format  'png', or 'jpeg' when the image shows a product photo
 *   ogHomeAlt(data, lang)  the description of the Home image (the official og-ar/og-en.png)
 *   SIZE      { width: 1200, height: 630 }
 *   ORIGIN    the address the generator serves the page and its files from
 *
 * Direction "Editorial cover": each image repeats its page opening on the site (gold kicker and
 * hairline, title, lead) on Covenant Navy above the official Gateway band, with the page's picture
 * in the reading-end column. Every word comes from data and is HTML-escaped; a missing or empty
 * string stops the run with its place in src/data. Every asset comes from
 * https://og.render/public/… or https://og.render/node_modules/@fontsource/…, the only addresses the
 * generator serves. The look is in og.css; the fitting runs in the page (fit.js), which sets
 * <html data-ready="1"> when it has finished and reports a misfit with data-fit="false" (or
 * data-visual-fit="false") and data-fit-reason.
 *
 * The logo, the Gateway window, the icons and the pictures are used as files or with the official
 * geometry (read from GatewayMark.tsx), and are never mirrored: only the grid mirrors in Arabic.
 */
import { readFileSync } from 'node:fs';

export const SIZE = { width: 1200, height: 630 };
export const ORIGIN = 'https://og.render';

/** URL-encodes a path; quotes and brackets too, so it is also safe inside CSS url('…'). */
const encodePath = (path) => encodeURI(path).replace(/['()]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
/** Address of a file under public/ (paths as in src/data, e.g. '/brand/…'). */
const asset = (path) => `${ORIGIN}/public${encodePath(path)}`;
const fontFile = (file) => `${ORIGIN}/node_modules/@fontsource/${encodePath(file)}`;

/** A file next to this one, with Unix line endings (the same page on every computer). */
const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8').replace(/\r\n?/g, '\n');
const CSS = read('./og.css');
const FIT = read('./fit.js');

/* The official Gateway geometry (viewBox 0 0 700 630), read from the site's component. */
const markSource = read('../../src/components/ui/GatewayMark.tsx');
const GATE = /export const GATE = '([\d., ]+)'/.exec(markSource)?.[1];
const DASHES = [...(/export const DASHES = \[([\s\S]*?)\];/.exec(markSource)?.[1] ?? '').matchAll(/'(M[\d. LZ-]+)'/g)].map((m) => m[1]);
if (!GATE || DASHES.length !== 5) throw new Error('scripts/og/templates.mjs: GATE and the five DASHES were not found in src/components/ui/GatewayMark.tsx');
const GATE_POINTS = GATE.split(' ').map((pair) => pair.split(',').map(Number));

/** Grid values the template needs for placing pictures (the same as in og.css). */
const GRID = { margin: 64, line: 428, visual: 216, pictureMaxHeight: 144, pictureGap: 28, logoHeight: 52 };

/**
 * The site's self-hosted fonts (@fontsource). Noto Kufi Arabic is its Arabic subset only, so Latin
 * letters, digits and spaces fall through to Barlow; Barlow and Barlow Semi Condensed come in their
 * latin, latin-ext and vietnamese subsets, as on the site (ş, ğ, Š… in a brand name are drawn in
 * Barlow, not in a font of the computer). Barlow 900 is used only for Latin words inside Arabic
 * titles: its stroke matches Noto Kufi Arabic 900 (Barlow 700 is a quarter thinner there).
 */
const ARABIC_RANGE =
  'U+0600-06FF, U+0750-077F, U+0870-088E, U+0890-0891, U+0897-08E1, U+08E3-08FF, U+200C-200E, U+2010-2011, U+204F, U+2E41, U+FB50-FDFF, U+FE70-FE74, U+FE76-FEFC';
const LATIN_SUBSETS = {
  latin: 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
  'latin-ext':
    'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF',
  vietnamese: 'U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB',
};
const latinFaces = (family, dir, weights) =>
  weights.flatMap((weight) => Object.entries(LATIN_SUBSETS).map(([subset, range]) => [family, weight, `${dir}/files/${dir}-${subset}-${weight}-normal.woff2`, range]));
const FONTS = [
  ...[500, 700, 900].map((weight) => ['Noto Kufi Arabic', weight, `noto-kufi-arabic/files/noto-kufi-arabic-arabic-${weight}-normal.woff2`, ARABIC_RANGE]),
  ...latinFaces('Barlow', 'barlow', [500, 600, 700, 900]),
  ...latinFaces('Barlow Semi Condensed', 'barlow-semi-condensed', [600]),
];
const FONT_FACES = FONTS.map(
  ([family, weight, file, range]) =>
    `@font-face { font-family: '${family}'; font-style: normal; font-weight: ${weight}; font-display: block; src: url('${fontFile(file)}') format('woff2');${range ? ` unicode-range: ${range};` : ''} }`,
).join('\n');

/* ------------------------------------------------------------------ */
/* Text: spans and no-break spaces only, the words never change        */
/* ------------------------------------------------------------------ */

const ENTITIES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (value) => String(value).replace(/[&<>"']/g, (c) => ENTITIES[c]);
const NBSP = '\u00a0';
const words = (text) => String(text).trim().split(/ +/).filter(Boolean);

/** An Arabic letter (with tatweel; Arabic punctuation is neutral, like all punctuation). */
const ARABIC = /[\p{Script=Arabic}\u0640]/u;
/** A Latin letter (accented ones too) or a Western digit. */
const LATIN = /[\p{Script=Latin}0-9]/u;
const scriptOfChar = (ch) => (ARABIC.test(ch) ? 'R' : LATIN.test(ch) ? 'L' : 'N');

/**
 * A word split where its script changes: "لـBucher" → "لـ" + "Bucher", "الـG2200" → "الـ" + "G2200".
 * Neutral characters (punctuation, symbols, harakat) stay with the letters before them; an opening
 * bracket or quote just before a change goes with what follows.
 */
function segments(word) {
  const out = [];
  let lead = '';
  for (const ch of word) {
    const script = scriptOfChar(ch);
    const last = out.at(-1);
    if (script === 'N') {
      if (last) last.text += ch;
      else lead += ch;
    } else if (!last) {
      out.push({ script, text: lead + ch });
      lead = '';
    } else if (last.script === script) last.text += ch;
    else {
      const carry = /[(\[«“‘"]+$/.exec(last.text)?.[0] ?? '';
      last.text = last.text.slice(0, last.text.length - carry.length);
      out.push({ script, text: carry + ch });
    }
  }
  return out.length ? out : [{ script: 'N', text: lead }];
}

/**
 * What a word of Arabic text is: 'R' Arabic, 'L' Latin ("G2200", "1.5–2.3", "+218",
 * "info@al-mithaq.com"), 'N' neither ("–", "×", "·"), or Latin with an Arabic prefix and/or suffix
 * written onto it ('RL' "لـBucher", 'LR', 'RLR'). Any other mixture is left to the bidi algorithm as
 * one Arabic word.
 */
function wordOf(word) {
  // Words joined with a no-break space in src/data stay one word, set as written: the bidi
  // algorithm orders its parts ("G2200 Pro", "G2200 رباعية").
  if (word.includes(NBSP)) return { kind: 'R' };
  const segs = segments(word);
  const pattern = segs.map((s) => s.script).join('');
  switch (pattern) {
    case 'L':
      return { kind: 'L', prefix: '', latin: word, suffix: '' };
    case 'RL':
      return { kind: 'L', prefix: segs[0].text, latin: segs[1].text, suffix: '' };
    case 'LR':
      return { kind: 'L', prefix: '', latin: segs[0].text, suffix: segs[1].text };
    case 'RLR':
      return { kind: 'L', prefix: segs[0].text, latin: segs[1].text, suffix: segs[2].text };
    case 'N':
      return { kind: 'N' };
    default:
      return { kind: 'R' };
  }
}

/** A word that ends an Arabic clause (Arabic comma, semicolon, question mark, closing quote). */
const endsClause = (word) => /[،؛؟»”]$/.test(word);
/** A word that opens a quotation. */
const opensQuote = (word) => /^[«“]/.test(word);

const count = (text, char) => text.split(char).length - 1;
/**
 * The edges of a phrase set in the other direction: sentence punctuation, quotation marks and a
 * bracket opened or closed outside the phrase stay in the surrounding flow, where the bidi algorithm
 * places (and mirrors) them; a bracket pair inside the phrase stays with it.
 */
function edges(text) {
  let core = text;
  let open = '';
  let close = '';
  for (let c = core.at(-1); core && (/[.,،؛;:!?؟»”"'’]/.test(c) || (c === ')' && count(core, '(') < count(core, ')')) || (c === ']' && count(core, '[') < count(core, ']'))); c = core.at(-1)) {
    close = c + close;
    core = core.slice(0, -1);
  }
  for (let c = core[0]; core && (/[«“"'‘]/.test(c) || (c === '(' && count(core, '(') > count(core, ')')) || (c === '[' && count(core, '[') > count(core, ']'))); c = core[0]) {
    open += c;
    core = core.slice(1);
  }
  return { open, core, close };
}

const nowrap = (html) => `<span class="nowrap">${html}</span>`;
/** A hyphenated compound ("Four-Wheel", "8FD-25") never breaks at its hyphen. */
const keepCompounds = (html) => html.replace(/[^\s<>]+-[^\s<>]+/g, (w) => nowrap(w));

/**
 * A Latin phrase inside Arabic text ("G2200 Pro", "1.5–2.3", "+218 91 108 7744"): one left-to-right
 * isolate set in Barlow, so its words keep their order; an Arabic prefix or suffix written onto it
 * ("لـBucher Municipal") stays outside the isolate, joined to it without a space.
 * `glueLast` joins its last two words with a no-break space.
 */
function latinHtml({ prefix, words: list, suffix }, glueLast) {
  const text = glueLast && list.length > 1 ? `${list.slice(0, -1).join(' ')}${NBSP}${list.at(-1)}` : list.join(' ');
  const { open, core, close } = edges(text);
  // A single Latin word (a model code) may stand alone on a title's last line (data-code, see fit.js).
  return `${esc(prefix + open)}<span class="latin" dir="ltr"${list.length === 1 ? ' data-code' : ''}>${keepCompounds(esc(core))}</span>${esc(close + suffix)}`;
}
/** An Arabic phrase inside English text: one right-to-left isolate (the mirror image of latinHtml). */
function arabicHtml(text) {
  const { open, core, close } = edges(text);
  return `${esc(open)}<span lang="ar" dir="rtl">${esc(core)}</span>${esc(close)}`;
}

/**
 * A text as pieces, in reading order. A piece is set as one unit: line breaks fall between pieces,
 * and a piece of several words never breaks. Each piece has `words` and `html(mode, glueLast)`;
 * mode 'loose' (a title's last resort, see titleHtml) lets a Latin phrase of up to three words wrap.
 * - Arabic: a Latin phrase is one piece, a left-to-right isolate (kept on one line when it is a
 *   number or has at most three words); every other word is a piece of its own. A Latin phrase is a
 *   run of Latin words with the neutral words between them ("G2200 Pro", "3200 × 2200 × 2750"); it
 *   ends at an Arabic word or suffix, after a word that ends an Arabic clause, or before a quotation.
 * - English: every word is a piece (a hyphenated compound never breaks at its hyphen); Arabic words
 *   form one right-to-left piece, without the punctuation around them.
 * Then, as on the site (setFigures in Typeset.tsx), a figure stays on one line with its range and
 * unit ("1.5–2.3 m", "300 لتر", "3200 × 2200 × 2750 mm", "1.5 إلى 2.3 م"), a short bracketed
 * phrase ("(G2200 Pro)") stays whole, and in English a short function word stays with the word
 * after it (a line never ends on "with", "of", "the", "and"…) unless `functionWords` is false.
 */
function pieces(text, lang, functionWords = true) {
  const list = words(text);
  const out = [];
  if (lang === 'ar') {
    let phrase = null; // the open Latin phrase
    const plain = (word) => ({ words: [word], kind: wordOf(word).kind, html: () => esc(word) });
    const close = () => {
      if (!phrase) return;
      const p = phrase;
      const numeric = /^[\d\s+().,–-]+$/.test(p.words.join(' '));
      out.push({
        words: p.tokens,
        kind: 'L',
        core: p.words,
        html: (mode = 'strict', glueLast = false) => {
          const html = latinHtml(p, glueLast);
          return numeric || (mode === 'strict' && p.words.length <= 3) ? nowrap(html) : html;
        },
      });
      out.push(...p.pending.map(plain));
      phrase = null;
    };
    const joins = (word) => phrase && !phrase.suffix && ![phrase.tokens.at(-1), ...phrase.pending].some(endsClause) && ![...phrase.pending, word].some(opensQuote);
    for (const word of list) {
      const w = wordOf(word);
      if (w.kind === 'L') {
        if (!w.prefix && joins(word)) {
          phrase.words.push(...phrase.pending, w.latin);
          phrase.tokens.push(...phrase.pending, word);
          phrase.pending = [];
        } else {
          close();
          phrase = { prefix: w.prefix, words: [w.latin], suffix: '', tokens: [word], pending: [] };
        }
        if (w.suffix) {
          phrase.suffix = w.suffix;
          close();
        }
      } else if (w.kind === 'N' && phrase) phrase.pending.push(word);
      else {
        close();
        out.push(plain(word));
      }
    }
    close();
  } else {
    for (const word of list) {
      const arabic = ARABIC.test(word);
      const last = out.at(-1);
      // Arabic words form one phrase, up to a word that ends with English punctuation.
      if (arabic && last?.arabic && !/[.,;:!?)\]”"’']$/.test(last.words.at(-1))) last.words.push(word);
      else out.push({ words: [word], arabic });
    }
    for (const piece of out) {
      const text = piece.words.join(' ');
      const html = piece.arabic ? arabicHtml(text) : keepCompounds(esc(text));
      piece.html = () => (piece.arabic && piece.words.length <= 3 ? nowrap(html) : html);
    }
  }
  const bound = bindBrackets(bindTimes(bindFigures(out)));
  return lang === 'ar' || !functionWords ? bound : bindFunctionWords(bound);
}

const textOf = (piece) => piece.words.join(' ');
/** What goes after a piece: a space, or a no-break space after "&" (it stays with the next word). */
const gap = (piece) => (textOf(piece) === '&' ? NBSP : ' ');
const render = (list, mode = 'strict') => list.map((piece, i) => (i ? gap(list[i - 1]) : '') + piece.html(mode)).join('');
/** Pieces that never break apart (figures, brackets). */
const merge = (list) => ({ words: list.flatMap((p) => p.words), kind: 'group', html: () => nowrap(render(list)) });
/** Two pieces joined by a no-break space: a pair that stays on one line, whose pieces may still wrap inside. */
const glue = (a, b) => ({ words: [...a.words, ...b.words], kind: 'group', html: (mode) => `${a.html(mode)}${NBSP}${b.html(mode)}` });

/** Starts with a figure ("300", "1.5–2.3", "(300"), also a Latin phrase with an Arabic prefix ("بـ300"). */
const isFigure = (piece) => /^[(\[]?\d/.test(piece.core ? piece.core[0] : textOf(piece));
/** A connector or unit: one word of one to three characters with a letter, no digit ("m", "L", "×"…). */
const isShort = (piece) => {
  const core = textOf(piece).replace(/[.,،)]$/, '');
  return piece.words.length === 1 && core.length >= 1 && core.length <= 3 && !/\d/.test(core);
};
function bindFigures(list) {
  const out = [];
  for (let i = 0; i < list.length; i += 1) {
    let end = i;
    if (isFigure(list[i])) {
      while (list[end + 2] && isShort(list[end + 1]) && isFigure(list[end + 2])) end += 2;
      if (list[end + 1] && isShort(list[end + 1]) && /\p{L}|[%²³°]/u.test(textOf(list[end + 1]))) end += 1;
    }
    out.push(end > i ? merge(list.slice(i, end + 1)) : list[i]);
    i = end;
  }
  return out;
}
/** A multiplication never breaks: "×" stays with both its neighbours ("600 mm × 2"). */
function bindTimes(list) {
  const out = [];
  for (const piece of list) {
    const before = out.at(-1);
    if (before && textOf(before) === '×' && out.length > 1) out.splice(-2, 2, merge([out.at(-2), before, piece]));
    else out.push(piece);
  }
  return out;
}
/** A bracketed phrase of at most three pieces stays whole. */
function bindBrackets(list) {
  const out = [];
  for (let i = 0; i < list.length; i += 1) {
    let end = i;
    if (/^[(\[]/.test(textOf(list[i])) && !/[)\]]/.test(textOf(list[i]))) {
      const close = list.findIndex((p, j) => j > i && /[)\]]/.test(textOf(p)));
      if (close > i && close - i <= 2) end = close;
    }
    out.push(end > i ? merge(list.slice(i, end + 1)) : list[i]);
    i = end;
  }
  return out;
}
/** English: a short function word stays with the word after it, so no line ends on it. */
const FUNCTION_WORD = /^(a|an|the|of|to|in|on|at|by|for|with|from|into|and|or|nor)$/i;
function bindFunctionWords(list) {
  const out = [];
  for (let i = 0; i < list.length; i += 1) {
    let piece = list[i];
    while (FUNCTION_WORD.test(piece.words.at(-1)) && list[i + 1]) {
      i += 1;
      piece = glue(piece, list[i]);
    }
    out.push(piece);
  }
  return out;
}

const setText = (text, lang) => render(pieces(text, lang));

/** Arabic definite article at the start of a word ("الطرق", "والسلامة", "للبلديات"). */
const hasArticle = (word) => /^(?:[وفبك]?ال|لل)/.test(word);
/**
 * Arabic titles keep their two-word phrases whole: each run of Arabic words (between Latin phrases
 * and figures) is set in pairs ("كانسة الطرق" · "رباعية العجلات"). In a run with an odd number of
 * words, the single word goes where the article shows it is not part of a construct: at the start
 * when the run ends on one ("مكنسة" · "رباعية العجلات"), otherwise at the end.
 */
function pairArabic(list) {
  const out = [];
  for (let i = 0; i < list.length; ) {
    if (list[i].kind !== 'R') {
      out.push(list[i]);
      i += 1;
      continue;
    }
    let end = i;
    while (list[end + 1]?.kind === 'R') end += 1;
    const run = list.slice(i, end + 1);
    const n = run.length;
    const word = (k) => run[k].words[0];
    const startsSingle = n % 2 === 1 && n > 1 && !(!hasArticle(word(0)) && hasArticle(word(1))) && !hasArticle(word(n - 2)) && hasArticle(word(n - 1));
    let k = 0;
    if (startsSingle) {
      out.push(run[0]);
      k = 1;
    }
    for (; k < n; k += 2) out.push(run[k + 1] ? glue(run[k], run[k + 1]) : run[k]);
    i = end + 1;
  }
  return out;
}

/**
 * Line breaks of a title, as a list of settings fit.js tries in order: [{ html, lone, note }].
 * The first one keeps every rule:
 * - with three words or more it never ends on a single word: its last two words stay together
 *   (in Arabic a Latin model code at the end may stand alone: it is the name's own break point);
 * - in Arabic a Latin model code divides the name into phrases and is the place to break, the
 *   two-word phrases between them stay whole ("كانسة الطرق" · "G2200" · "رباعية العجلات"), and a
 *   Latin name of up to three words stays whole and in order (a longer one wraps, still in order);
 * - in English a short function word stays with the word after it.
 * The others are last resorts, used only when the title fits no other way even without its optional
 * lines; the words always keep their order:
 * - Arabic: the phrases stay whole and the last word may stand alone (lone: a qualifier after the
 *   code line, "رافعة شوكية" / "Toyota 8FD-25/30" / "ديزل"); then the phrases give way, but not the
 *   last two words.
 * - English: the function words give way, not the last two words.
 */
function titleHtml(text, lang) {
  const total = words(text).length;
  const build = ({ mode, pairs, glueEnd }) => {
    const list = pieces(text, lang, mode === 'strict');
    const items = lang === 'ar' && pairs ? pairArabic(list) : [...list];
    if (glueEnd && total >= 3 && items.length) {
      const last = items.at(-1);
      if (last.kind === 'L' && last.core.length > 1) items[items.length - 1] = { ...last, html: (m) => last.html(m, true) };
      // In Arabic a single Latin word at the end (a model code) is the name's own break point.
      else if (last.words.length === 1 && items.length > 1 && last.kind !== 'L') items.splice(-2, 2, glue(items.at(-2), last));
    }
    return render(items, mode);
  };
  const settings =
    lang === 'ar'
      ? [
          { html: build({ mode: 'strict', pairs: true, glueEnd: true }), lone: false, note: '' },
          { html: build({ mode: 'strict', pairs: true, glueEnd: false }), lone: true, note: 'the title ends on a single word to keep its phrases whole' },
          { html: build({ mode: 'loose', pairs: false, glueEnd: true }), lone: false, note: 'the title gave up its two-word phrases to fit' },
        ]
      : [
          { html: build({ mode: 'strict', glueEnd: true }), lone: false, note: '' },
          { html: build({ mode: 'loose', glueEnd: true }), lone: false, note: 'the title gave up keeping short function words with the next word' },
        ];
  return settings.filter((s, i) => !settings.slice(0, i).some((t) => t.html === s.html));
}

/* ------------------------------------------------------------------ */
/* What each page shows (every word from src/data)                     */
/* ------------------------------------------------------------------ */

const TRANSLATIONS = 'src/data/translations.ts';
const DATA = 'src/data/index.ts';
/** A text the image shows: a non-empty string, or the run stops with its place in src/data. */
function need(value, path, file) {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${path} is ${value === undefined ? 'missing' : 'empty or not text'} (${file})`);
  return value;
}

/** A product's picture: its first photo when it has one, otherwise its illustration. */
function pictureOf(product, path) {
  const photo = product?.photos?.[0];
  if (photo) return { photo: { src: need(photo.src, `${path}.photos[0].src`, DATA), width: photo.width, height: photo.height } };
  if (product?.image) {
    if (!product.imageSize?.width || !product.imageSize?.height) throw new Error(`${path}.imageSize is missing (${DATA})`);
    return { picture: { src: product.image, width: product.imageSize.width, height: product.imageSize.height } };
  }
  return {};
}

function pageSpec(data, rest, lang) {
  const { copy } = data;
  /** copy.<path>[lang] */
  const tr = (path) => need(path.split('.').reduce((value, key) => value?.[key], copy)?.[lang], `copy.${path}.${lang}`, TRANSLATIONS);
  const titleHint = `Shorten it in ${TRANSLATIONS}.`;
  switch (rest) {
    case '/sectors':
      return {
        page: 'sectors',
        kicker: tr('pageKickers.sectors'),
        title: tr('sectorsPage.title'),
        titleHint,
        lead: tr('sectorsPage.intro'),
        icons: [...data.sectors].sort((a, b) => a.order - b.order).map((s) => need(s.iconWhite, `sectors (${s.id}).iconWhite`, DATA)),
      };
    case '/products':
      // The catalogue shows its first product (today the G2200), standing on the line.
      return {
        page: 'products',
        kicker: tr('pageKickers.products'),
        title: tr('productsPage.title'),
        titleHint,
        lead: tr('productsPage.intro'),
        stand: true,
        ...pictureOf(data.products[0], 'products[0]'),
      };
    case '/about':
      return {
        page: 'about',
        kicker: tr('aboutPage.title'),
        title: tr('aboutPage.heroTitle'),
        titleHint,
        lead: tr('aboutPage.definition'),
        // The word ميثاق, the About page's editorial feature: the Arabic name in both languages.
        word: need(data.company.shortName?.ar, 'company.shortName.ar', DATA),
      };
    case '/partners':
      return {
        page: 'partners',
        kicker: tr('partnersPage.title'),
        title: tr('partnersPage.heroTitle'),
        titleHint,
        lead: tr('partnersPage.heroBody'),
        gateway: true,
      };
    case '/contact': {
      // Phone (for calls) and email. The WhatsApp number stays on the Contact page itself.
      const phone = data.contact.phones?.[0];
      return {
        page: 'contact',
        kicker: tr('pageKickers.contact'),
        title: tr('contactPage.title'),
        titleHint,
        lead: tr('contactPage.intro'),
        details: [
          phone && { name: 'phone', text: need(phone.display, 'contact.phones[0].display', DATA) },
          { name: 'email', text: need(data.contact.email, 'contact.email', DATA) },
        ].filter(Boolean),
        gateway: true,
      };
    }
    default: {
      const id = /^\/products\/([^/]+)$/.exec(rest)?.[1];
      const index = id ? data.products.findIndex((p) => p.id === id) : -1;
      if (index < 0) throw new Error(`No link-preview layout for "${rest}" (scripts/og/templates.mjs)`);
      const product = data.products[index];
      const at = `products[${index}] (${product.id})`;
      const sector = data.sectors.find((s) => s.id === product.sector);
      const name = product.shareName ? `${at}.shareName` : `${at}.name`;
      return {
        page: 'product',
        kicker: sector ? need(sector.name?.[lang], `sectors (${sector.id}).name.${lang}`, DATA) : tr('nav.products'),
        kickerOptional: true, // a long name keeps its size: the sector kicker gives way first
        title: need((product.shareName ?? product.name)?.[lang], `${name}.${lang}`, DATA),
        titleHint: product.shareName
          ? `Shorten its shareName in ${DATA}.`
          : `Give the product a shorter shareName in ${DATA} (link-preview images only).`,
        figures: (product.keyFigures ?? []).map((f, i) => ({
          value: need(f.value, `${at}.keyFigures[${i}].value`, DATA),
          unit: need(f.unit?.[lang], `${at}.keyFigures[${i}].unit.${lang}`, DATA),
          label: need(f.label?.[lang], `${at}.keyFigures[${i}].label.${lang}`, DATA),
        })),
        ...pictureOf(product, at),
      };
    }
  }
}

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

const round = (n) => Math.round(n * 100) / 100;
const pct = (value, of) => `${round((value / of) * 100)}%`;

/** Size of a product picture in the 216 px column (at most 144 px tall). */
function pictureSize({ width, height }) {
  let w = GRID.visual;
  let h = (w * height) / width;
  if (h > GRID.pictureMaxHeight) {
    h = GRID.pictureMaxHeight;
    w = (h * width) / height;
  }
  return { w: round(w), h: round(h) };
}

/**
 * The illustration with the site's dusk glow (its top 0.45 of the picture's height above the
 * picture), hung from the reading-end margin: at the top of the column above the key figures, or
 * standing (data-stand) on the line, where fit.js sets its foot on the main column's last baseline.
 * A product page's picture stands too when no key figure fits below it.
 */
function pictureHtml(picture, stand) {
  const { w, h } = pictureSize(picture);
  const top = stand ? GRID.line - h : GRID.margin;
  const glow = `inset-inline-end:${round(GRID.margin - w * 0.08)}px;width:${round(w * 1.16)}px;top:${round(top - h * 0.45)}px;height:${round(h * 1.65)}px`;
  return (
    `<div class="glow" style="${glow}" aria-hidden="true"></div>` +
    `<img class="picture"${stand ? ' data-stand' : ''} src="${esc(asset(picture.src))}" width="${esc(picture.width)}" height="${esc(picture.height)}" alt="" style="top:${round(top)}px;width:${w}px;height:${h}px">`
  );
}

/** A product photo as a full-bleed panel on the reading-end edge, down to the band. */
const photoHtml = (photo) => `<div class="photo"><img src="${esc(asset(photo.src))}" width="${esc(photo.width)}" height="${esc(photo.height)}" alt=""></div>`;

/**
 * The Gateway window: the official M as a clip over the dusk road, framed as in the Home hero
 * (Hero.tsx, before its parallax drift: the picture covers the window plus a 24-unit drift above
 * it, so the horizon sits in the bridge of the M), a 1 px steel hairline at 30 % along the gate,
 * and the five gold dashes in the road under it.
 */
function gatewayWindowHtml(road) {
  const DRIFT = 24;
  const scale = Math.max(700 / road.width, (630 + DRIFT) / road.height);
  const w = road.width * scale;
  const h = road.height * scale;
  const x = (700 - w) / 2;
  const y = -DRIFT + (630 + DRIFT - h) / 2;
  const clip = GATE_POINTS.map(([px, py]) => `${pct(px, 700)} ${pct(py, 630)}`).join(', ');
  return (
    `<div class="window">` +
    `<div class="window-clip" style="clip-path:polygon(${clip})"><img src="${esc(asset(road.src))}" width="${esc(road.width)}" height="${esc(road.height)}" alt="" style="left:${pct(x, 700)};top:${pct(y, 630)};width:${pct(w, 700)};height:${pct(h, 630)}"></div>` +
    `<svg viewBox="0 0 700 630" aria-hidden="true"><polygon points="${GATE}" fill="none" stroke="#8D98A5" stroke-opacity="0.3" stroke-width="1" vector-effect="non-scaling-stroke"/>${DASHES.map((d) => `<path d="${d}" fill="#EAA620"/>`).join('')}</svg>` +
    `</div>`
  );
}

const figuresHtml = (figures, lang) =>
  `<div class="figures">${figures
    .map(
      (f) =>
        `<div class="figure" data-text data-name="${esc(f.label)}"><p class="figure-line"><span class="figure-value" dir="ltr">${esc(f.value)}</span><span class="figure-unit">${setText(f.unit, lang)}</span></p><p class="figure-label">${setText(f.label, lang)}</p></div>`,
    )
    .join('')}</div>`;

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export function ogPage(data, rest, lang) {
  const spec = pageSpec(data, rest, lang);
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const logo = data.brand.headerLogo?.[lang];
  if (!logo?.src || !logo.width || !logo.height) throw new Error(`brand.headerLogo.${lang} is missing (${DATA})`);
  const logoWidth = Math.round((GRID.logoHeight * logo.width) / logo.height);
  const band = asset(need(data.brand.bands?.dark, 'brand.bands.dark', DATA));

  // Reading-end column: a photo panel, or the page's picture.
  let behind = ''; // pictures placed on the canvas, under the text
  let visual = '';
  let visualStyle = '';
  if (spec.photo) {
    behind = photoHtml(spec.photo); // the key figures give way to the photo
  } else if (spec.picture && (spec.stand || !spec.figures?.length)) {
    // The catalogue, or a product without key figures: the picture stands on the line.
    behind = pictureHtml(spec.picture, true);
  } else if (spec.picture) {
    const { h } = pictureSize(spec.picture);
    behind = pictureHtml(spec.picture, false);
    const top = round(GRID.margin + h + GRID.pictureGap);
    visualStyle = ` style="top:${top}px;height:${round(GRID.line - top)}px"`;
    visual = figuresHtml(spec.figures, lang);
  } else if (spec.icons) {
    visual = `<div class="icons">${spec.icons.map((src) => `<img src="${esc(asset(src))}" width="96" height="96" alt="">`).join('')}</div>`;
  } else if (spec.word) {
    visual = `<p class="word" lang="ar" dir="rtl" data-text>${esc(spec.word)}</p>`;
  } else if (spec.gateway) {
    visual = gatewayWindowHtml(data.brand.heroRoad);
  }

  const [title, ...fallbacks] = titleHtml(spec.title, lang);
  const kicker = spec.kicker
    ? `<p class="kicker" data-text${spec.kickerOptional ? ' data-optional="1" data-name="kicker"' : ''}>${setText(spec.kicker, lang)}</p><span class="rule" aria-hidden="true"></span>`
    : '';
  const lead = spec.lead ? `<p class="lead" data-text data-optional="${spec.details ? 1 : 2}" data-name="lead">${setText(spec.lead, lang)}</p>` : '';
  const details = spec.details?.length
    ? `<p class="details" data-text>${spec.details.map((d) => `<span class="detail" dir="ltr" data-name="${d.name}">${esc(d.text)}</span>`).join('<span class="sep" aria-hidden="true"></span>')}</p>`
    : '';

  const html = `<!doctype html>
<html lang="${esc(lang)}" dir="${dir}">
<head>
<meta charset="utf-8">
<style>
${FONT_FACES}
${CSS}
</style>
</head>
<body>
<main class="og og--${spec.page}">
${behind}
<img class="logo" data-logo src="${esc(asset(logo.src))}" width="${logoWidth}" height="${GRID.logoHeight}" alt="">
<div class="content"><div class="stack" data-fit="stack">
${kicker}
<h1 class="title" data-fit="title" data-text data-hint="${esc(spec.titleHint)}">${title.html}</h1>${fallbacks.map((f) => `\n<template data-title-fallback${f.lone ? ' data-lone' : ''} data-note="${esc(f.note)}">${f.html}</template>`).join('')}
${lead}${details}
</div></div>
<div class="visual" data-fit="visual"${visualStyle}>${visual}</div>
<div class="band" data-bg="${esc(band)}" style="background-image:url('${esc(band)}')" aria-hidden="true"></div>
</main>
<script>
${FIT}
</script>
</body>
</html>
`;

  const pattern = need(data.copy.og?.pageAlt?.[lang], `copy.og.pageAlt.${lang}`, TRANSLATIONS);
  const unknown = [...pattern.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).filter((key) => key !== 'title' && key !== 'company');
  if (unknown.length) throw new Error(`copy.og.pageAlt.${lang} has {${unknown[0]}}; only {title} and {company} are filled in (${TRANSLATIONS})`);
  const alt = data.fill(pattern, { title: spec.title, company: need(data.company.name?.[lang], `company.name.${lang}`, DATA) });
  return { html, alt, format: spec.photo ? 'jpeg' : 'png' };
}

/** The description of the Home image (the official share images from the logo package). */
export function ogHomeAlt(data, lang) {
  const pattern = need(data.copy.og?.homeAlt?.[lang], `copy.og.homeAlt.${lang}`, TRANSLATIONS);
  return data.fill(pattern, {
    company: need(data.company.name?.[lang], `company.name.${lang}`, DATA),
    slogan: need(data.company.slogan?.[lang], `company.slogan.${lang}`, DATA),
  });
}
