/**
 * Motion helpers shared by every page, so all reveals use the same calm language:
 * slow fade-up on scroll (700 ms, ease [0.22, 1, 0.36, 1], 80 ms stagger, once per element),
 * clip wipes in the reading direction and key figures that count up once.
 *
 * After a language switch the new page enters through the <main> wrapper; elements that are
 * already in view then appear at once instead of replaying their own reveal.
 * Reduced motion: MotionConfig (App.tsx) drops the movement; wipes and count-ups are skipped.
 */
import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { animate, m, useInView, useReducedMotion } from 'framer-motion';
import { cx } from '../../data';
import { useIsomorphicLayoutEffect, useLanguage, useMountedBySwitch } from '../../data/i18n';

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
export const REVEAL_DURATION = 0.7;
export const REVEAL_STAGGER = 0.08;
export const REVEAL_VIEWPORT = { once: true, margin: '0px 0px -10% 0px' } as const;

type RevealTag =
  | 'div'
  | 'section'
  | 'article'
  | 'header'
  | 'footer'
  | 'figure'
  | 'ul'
  | 'ol'
  | 'li'
  | 'dl'
  | 'p'
  | 'span'
  | 'h2'
  | 'h3'
  | 'blockquote';

interface RevealBaseProps {
  as?: RevealTag;
  className?: string;
  style?: CSSProperties;
  id?: string;
  children?: ReactNode;
}

/** One element that fades up when it enters the screen. */
export function Reveal({ as = 'div', className, style, id, children, delay = 0, y = 24 }: RevealBaseProps & { delay?: number; y?: number }) {
  const { justSwitched } = useLanguage();
  const Component = m[as] as typeof m.div;
  return (
    <Component
      id={id}
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={REVEAL_VIEWPORT}
      transition={justSwitched ? { duration: 0 } : { duration: REVEAL_DURATION, ease: EASE_OUT, delay }}
    >
      {children}
    </Component>
  );
}

/** A group whose <RevealItem> children fade up one after another (80 ms apart). */
export function RevealGroup({ as = 'div', className, style, id, children, stagger = REVEAL_STAGGER, delay = 0 }: RevealBaseProps & { stagger?: number; delay?: number }) {
  const { justSwitched } = useLanguage();
  const Component = m[as] as typeof m.div;
  return (
    <Component
      id={id}
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={REVEAL_VIEWPORT}
      variants={{
        hidden: {},
        visible: { transition: justSwitched ? { staggerChildren: 0 } : { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {children}
    </Component>
  );
}

/** A child of <RevealGroup> (at any depth). */
export function RevealItem({ as = 'div', className, style, id, children, y = 24 }: RevealBaseProps & { y?: number }) {
  const { justSwitched } = useLanguage();
  const Component = m[as] as typeof m.div;
  return (
    <Component
      id={id}
      className={className}
      style={style}
      variants={{
        hidden: { opacity: 0, y },
        visible: { opacity: 1, y: 0, transition: justSwitched ? { duration: 0 } : { duration: REVEAL_DURATION, ease: EASE_OUT } },
      }}
    >
      {children}
    </Component>
  );
}

/**
 * Image reveal: a clip wipe in the reading direction (left → right in English, right → left in Arabic).
 * `immediate` plays it on mount (above the fold) instead of when it enters the screen.
 */
export function ClipReveal({
  className,
  style,
  children,
  delay = 0,
  duration = 1.1,
  immediate = false,
}: {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  delay?: number;
  duration?: number;
  immediate?: boolean;
}) {
  const { dir, justSwitched } = useLanguage();
  const reduce = useReducedMotion();
  if (reduce) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }
  const hidden = dir === 'rtl' ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)';
  const shown = { clipPath: 'inset(0% 0% 0% 0%)' };
  return (
    <m.div
      className={className}
      style={style}
      initial={{ clipPath: hidden }}
      {...(immediate ? { animate: shown } : { whileInView: shown, viewport: REVEAL_VIEWPORT })}
      transition={justSwitched ? { duration: 0 } : { duration, ease: EASE_OUT, delay }}
    >
      {children}
    </m.div>
  );
}

interface ParsedNumber {
  index: number;
  text: string;
  target: number;
  decimals: number;
  grouped: boolean;
}

function parseNumbers(value: string): ParsedNumber[] {
  return [...value.matchAll(/\d[\d,]*(?:\.\d+)?/g)].map((match) => {
    const text = match[0];
    return {
      index: match.index ?? 0,
      text,
      target: Number(text.replace(/,/g, '')),
      decimals: (text.split('.')[1] ?? '').length,
      grouped: text.includes(','),
    };
  });
}

function formatAt(value: string, numbers: ParsedNumber[], progress: number): string {
  if (progress >= 1) return value;
  let out = '';
  let last = 0;
  for (const n of numbers) {
    out += value.slice(last, n.index);
    const current = n.target * progress;
    out += n.grouped
      ? current.toLocaleString('en-US', { minimumFractionDigits: n.decimals, maximumFractionDigits: n.decimals })
      : current.toFixed(n.decimals);
    last = n.index + n.text.length;
  }
  return out + value.slice(last);
}

/**
 * A key-figure value ("17,000", "1.5–2.3", "4–6") that counts up once when it enters the screen.
 * Always left to right with Western digits; the width is reserved so nothing shifts.
 */
export function CountUp({ value, className, duration = 1.6 }: { value: string; className?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const mountedBySwitch = useMountedBySwitch();
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const numbers = useMemo(() => parseNumbers(value), [value]);
  const animatable = !reduce && !mountedBySwitch && numbers.length > 0;
  const [progress, setProgress] = useState(1);

  // Start from zero before the first paint (the pre-rendered HTML shows the final value).
  useIsomorphicLayoutEffect(() => {
    if (animatable) setProgress(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!animatable || !inView) return;
    const controls = animate(0, 1, { duration, ease: EASE_OUT, onUpdate: setProgress });
    return () => controls.stop();
  }, [animatable, inView, duration]);

  return (
    <span ref={ref} dir="ltr" className={cx('inline-grid', className)}>
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">
        {value}
      </span>
      <span aria-hidden="true" className="col-start-1 row-start-1">
        {formatAt(value, numbers, animatable ? progress : 1)}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  );
}

/**
 * Entrance props for the elements of a page opening (PageHero, Home hero text):
 * on arrival they rise in, 80 ms apart; when the page was opened by a language switch,
 * headings slide in from the new reading side 40 ms apart and the rest arrives with <main>.
 *
 *   const entrance = useEntrance();
 *   <m.h1 {...entrance(1, 'heading')}>…</m.h1>
 */
export function useEntrance(baseDelay = 0.1) {
  const { dir } = useLanguage();
  const mountedBySwitch = useMountedBySwitch();
  return (order: number, kind: 'heading' | 'text' = 'text') => {
    if (mountedBySwitch) {
      if (kind !== 'heading') return { initial: false as const };
      return {
        initial: { opacity: 0, x: dir === 'rtl' ? 32 : -32 },
        animate: { opacity: 1, x: 0 },
        transition: { delay: 0.22 + order * 0.04, duration: 0.42, ease: EASE_OUT },
      };
    }
    return {
      initial: { opacity: 0, y: 24 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: baseDelay + order * REVEAL_STAGGER, duration: REVEAL_DURATION, ease: EASE_OUT },
    };
  };
}

/** Props for a section heading (<m.h2>) that slides in from the new reading side after a language switch. */
export function useSwitchHeading(order: number) {
  const { dir } = useLanguage();
  const mountedBySwitch = useMountedBySwitch();
  if (!mountedBySwitch) return {};
  return {
    initial: { opacity: 0, x: dir === 'rtl' ? 32 : -32 },
    animate: { opacity: 1, x: 0 },
    transition: { delay: 0.22 + order * 0.04, duration: 0.42, ease: EASE_OUT },
  };
}
