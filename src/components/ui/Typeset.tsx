/**
 * Text-setting helpers shared by the pages. They only add spans and no-break spaces around the
 * copy from src/data; the words themselves never change.
 */
import type { ReactNode } from 'react';
import { cx } from '../../data';

/**
 * A figure with its range and unit: "1.5–2.3 m", "300 L", "1.5 إلى 2.3 م", "3200 × 2200 × 2750 mm".
 * Connectors are an en dash, a hyphen or a short word between digits; a unit is a short word right after.
 */
const FIGURE = /(\d[\d.,]*(?:(?:[–-]| [^\s\d]{1,3} )\d[\d.,]*)*(?: [^\s\d]{1,3}(?=[\s.,،)]|$))?)/u;
/**
 * Two numbers joined by an en dash or a hyphen ("1.5–2.3", the tyre size "400-08"); separators count
 * only between digits, so a following full stop stays outside.
 */
const RANGE = /(\d+(?:[.,]\d+)*[–-]\d+(?:[.,]\d+)*)/;

/**
 * In Arabic text "1.5–2.3" would be laid out as "2.3–1.5", and the tyre code "400-08" as "08-400";
 * isolating them keeps them reading left to right, like the key figures.
 */
function isolateRanges(text: string): ReactNode {
  const parts = text.split(RANGE);
  if (parts.length === 1) return text;
  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <span key={index} dir="ltr">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

/**
 * Figures in running text: each figure stays on one line with its range and unit (a range never
 * breaks in the middle, a unit never starts a line), and en-dash ranges read left to right inside
 * Arabic. The sentence around them keeps its natural direction. [CONFIRM with MOAD: left-to-right ranges.]
 */
export function setFigures(source: string): ReactNode {
  // Multiplication groups ("600 mm × 2", "× 3") never break: no-break spaces around the ×.
  const text = source.replace(/ × /g, ' × ');
  const parts = text.split(FIGURE);
  if (parts.length === 1) return text;
  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <span key={index} className="whitespace-nowrap">
        {isolateRanges(part)}
      </span>
    ) : (
      part
    ),
  );
}

/** Keeps hyphenated compounds ("Four-Wheel", "Al-Khums") on one line, so a heading never breaks at the hyphen. */
export function keepCompounds(text: string): ReactNode {
  const parts = text.split(/(\S+-\S+)/);
  if (parts.length === 1) return text;
  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <span key={index} className="whitespace-nowrap">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

/** Keeps "&" with the word after it ("Municipal & / Cleaning" never ends a line on "&"). */
export function bindAmpersand(text: string): string {
  return text.replace(/ & /g, ' & ');
}

/**
 * Grid placement of a row of key figures, in tidy rows for any count. Phones (2 columns): with an
 * odd count the first figure takes a full row (five read 1 · 2 · 2). Tablets (6 columns): rows of
 * three or two (five read 3 · 2). From 1024 px: one row (the grid sets the column count).
 */
export function figureSpan(index: number, count: number): string {
  const phone = count % 2 === 1 && index === 0 && 'col-span-2';
  let tablet = 'md:col-span-2';
  if (count === 1) tablet = 'md:col-span-6';
  else if (count === 2 || count === 4 || (count === 5 && index >= 3)) tablet = 'md:col-span-3';
  return cx(phone, tablet, 'lg:col-span-1');
}
