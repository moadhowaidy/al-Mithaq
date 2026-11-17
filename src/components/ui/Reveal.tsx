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
/**
 * Elements reveal when they reach the lower 90 % of the screen. The huge top margin counts content
 * that was scrolled past (or skipped by a jump to an anchor, or straddling the top edge after a
 * language switch) as seen, so it is already there on the way back instead of fading in late.
 */
export const REVEAL_VIEWPORT = { once: true, margin: '100000px 0px -10% 0px' } as const;

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
  /** Passed through to the element (e.g. role="list" on a <ul>). */
  role?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
}

/** One element that fades up when it enters the screen. */
export function Reveal({ as = 'div', className, style, id, children, delay = 0, y = 24, ...aria }: RevealBaseProps & { delay?: number; y?: number }) {
  const { justSwitched } = useLanguage();
  const Component = m[as] as typeof m.div;
  return (
    <Component
      {...aria}
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
export function RevealGroup({ as = 'div', className, style, id, children, stagger = REVEAL_STAGGER, delay = 0, ...aria }: RevealBaseProps & { stagger?: number; delay?: number }) {
  const { justSwitched } = useLanguage();
  const Component = m[as] as typeof m.div;
  return (
    <Component
      {...aria}
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
export function RevealItem({ as = 'div', className, style, id, children, y = 24, ...aria }: RevealBaseProps & { y?: number }) {
  const { justSwitched } = useLanguage();
  const Component = m[as] as typeof m.div;
  return (
    <Component
      {...aria}
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
 * Image reveal: a clip wipe from the reading start (left → right in English, right → left in
 * Arabic), or from a fixed edge with `from`. `immediate` plays it on mount (above the fold)
 * instead of when it enters the screen.
 *
 * Two elements: the outer one (className, style) is never clipped and watches the screen; the
 * inner one (innerClassName, full size by default) is wiped in. Chromium does not report a clipped
 * element as in view while it straddles the top of the screen, so a wrapper watching itself could
 * stay hidden after a language switch or a restored scroll position.
 *
 * Browsers never start a lazy image that is fully clipped, so lazy images inside switch to eager
 * loading once the outer element is within 800 px of the screen; they are ready when the wipe opens.
 */
export function ClipReveal({
  className,
  innerClassName,
  style,
  children,
  delay = 0,
  duration = 1.1,
  immediate = false,
  from = 'start',
}: {
  className?: string;
  innerClassName?: string;
  style?: CSSProperties;
  children?: ReactNode;
  delay?: number;
  duration?: number;
  immediate?: boolean;
  /** Edge the wipe starts from: the reading start (default), or a fixed side (e.g. 'right' for an Arabic word). */
  from?: 'start' | 'left' | 'right';
}) {
  const { dir, justSwitched } = useLanguage();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const lazy = node.querySelectorAll<HTMLImageElement>('img[loading="lazy"]');
    if (lazy.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        lazy.forEach((img) => {
          img.loading = 'eager';
        });
        observer.disconnect();
      },
      { rootMargin: '800px 0px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const inner = cx('h-full w-full', innerClassName);
  if (reduce) {
    return (
      <div ref={ref} className={className} style={style}>
        <div className={inner}>{children}</div>
      </div>
    );
  }
  const edge = from === 'start' ? (dir === 'rtl' ? 'right' : 'left') : from;
  return (
    <m.div
      ref={ref}
      className={className}
      style={style}
      initial="hidden"
      {...(immediate ? { animate: 'visible' } : { whileInView: 'visible', viewport: REVEAL_VIEWPORT })}
      variants={{ hidden: {}, visible: {} }}
    >
      <m.div
        className={inner}
        variants={{
          hidden: { clipPath: edge === 'right' ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)' },
          visible: {
            clipPath: 'inset(0% 0% 0% 0%)',
            transition: justSwitched ? { duration: 0 } : { duration, ease: EASE_OUT, delay },
          },
        }}
      >
        {children}
      </m.div>
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
  // The huge top margin counts figures that were scrolled past (or skipped by a jump to an
  // anchor) as seen: they finish counting off screen and show their final value on the way back.
  const inView = useInView(ref, { once: true, margin: '100000px 0px -10% 0px' });
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
