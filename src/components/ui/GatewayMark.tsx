import { useRef, type CSSProperties } from 'react';
import { m, useInView, useReducedMotion } from 'framer-motion';
import { cx } from '../../data';

/** Official geometry of the logo (viewBox 0 0 700 630). Do not edit. */
export const GATE_VIEWBOX = '0 0 700 630';
export const GATE = '0,630 56,0 196,0 350,245 504,0 644,0 700,630 546,630 350,385 154,630';
/** The five lane dashes, from the bottom (nearest) to the top (the horizon). */
export const DASHES = [
  'M331.76 621.42 L368.24 621.42 L364.46 572.42 L335.54 572.42 Z',
  'M337.71 544.25 L362.29 544.25 L359.79 511.91 L340.21 511.91 Z',
  'M341.64 493.31 L358.36 493.31 L356.71 471.97 L343.29 471.97 Z',
  'M344.24 459.70 L355.76 459.70 L354.68 445.61 L345.32 445.61 Z',
  'M345.95 437.51 L354.05 437.51 L353.33 428.21 L346.67 428.21 Z',
];

/**
 * How the dashes behave:
 * - static: always lit
 * - dim: at 30 % (the transition, before the swap)
 * - lit: light up from bottom to top, 20 ms apart (the transition, after the swap)
 * - loop: runway lights heading for the horizon, a 2.4 s loop (Home hero). Static with reduced motion.
 */
export type DashMode = 'static' | 'dim' | 'lit' | 'loop';

function dashMotion(mode: DashMode, index: number) {
  switch (mode) {
    case 'dim':
      return { initial: { opacity: 0.3 }, animate: { opacity: 0.3 }, transition: { duration: 0.3 } };
    case 'lit':
      return { initial: { opacity: 0.3 }, animate: { opacity: 1 }, transition: { delay: index * 0.02, duration: 0.08 } };
    case 'loop':
      return {
        initial: { opacity: 0.28 },
        animate: { opacity: [0.28, 1, 0.28] },
        transition: { duration: 2.4, times: [0, 0.12, 0.55], ease: 'easeInOut' as const, repeat: Infinity, delay: index * 0.22 },
      };
    default:
      return { initial: false as const, animate: { opacity: 1 } };
  }
}

/**
 * The five gold dashes, as <path> elements for use inside any <svg viewBox="0 0 700 630">.
 * The loop only runs while the mark is on screen (and never under reduced motion).
 */
export function GateDashes({ mode = 'static' }: { mode?: DashMode }) {
  const reduce = useReducedMotion();
  const group = useRef<SVGGElement>(null);
  const onScreen = useInView(group, { margin: '120px 0px' });
  let resolved: DashMode = reduce && (mode === 'loop' || mode === 'lit') ? 'static' : mode;
  if (resolved === 'loop' && !onScreen) resolved = 'dim';
  return (
    <g ref={group}>
      {DASHES.map((d, index) => (
        <m.path key={d} d={d} className="fill-accent" {...dashMotion(resolved, index)} />
      ))}
    </g>
  );
}

interface GatewayMarkProps {
  /** 'dark' = navy mark for light grounds; 'light' = Lane White mark for navy grounds. Dashes are always gold. */
  tone?: 'dark' | 'light';
  dashes?: DashMode;
  /** Accessible name. Leave empty when the mark is decorative. */
  title?: string;
  className?: string;
  style?: CSSProperties;
}

/** The Gateway mark as inline SVG (no network request). Never mirrored in RTL. */
export default function GatewayMark({ tone = 'dark', dashes = 'static', title, className, style }: GatewayMarkProps) {
  return (
    <svg
      viewBox={GATE_VIEWBOX}
      className={cx('block', className)}
      style={style}
      role={title ? 'img' : undefined}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <polygon points={GATE} className={tone === 'light' ? 'fill-background' : 'fill-primary'} />
      <GateDashes mode={dashes} />
    </svg>
  );
}
