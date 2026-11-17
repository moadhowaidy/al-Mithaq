import { useId } from 'react';
import { brand, cx } from '../../data';

interface GatewayBandProps {
  /** dark: navy sections and above the footer · light: light sections · gold: sparingly. */
  tone?: 'dark' | 'light' | 'gold';
  className?: string;
}

/** The Gateway band: a 40 px strip of the brand tile, repeated horizontally. Decorative. */
export default function GatewayBand({ tone = 'dark', className }: GatewayBandProps) {
  return (
    <div
      aria-hidden="true"
      className={cx('gateway-band w-full', className)}
      style={{ backgroundImage: `url(${brand.bands[tone]})` }}
    />
  );
}

/** Lane dashes: a row of gold rounded bars (40 × 6 px, 32 px gaps), a divider on navy. Set its width. */
export function LaneDashes({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cx('lane-dashes', className)} />;
}

/** The stripes of the work-zone tile (800 × 240) repeat every 92 units; the tile width itself does not. */
const CHEVRON_PERIOD = 92;
/** Length of the strip in tile units: at 16–20 px tall it covers screens up to 4,000–5,000 px wide. */
const CHEVRON_RUN = 60000;

/**
 * Work-zone chevrons as a slim strip (product panels only; set its height, e.g. "h-4 md:h-5").
 * Repeating the whole 800-unit tile would break the stripe rhythm at every seam, so one 92-unit
 * period of the same file is repeated instead. The stripes lean forward in the reading direction
 * (mirrored in Arabic, like the language sweep).
 */
export function ChevronStrip({ className }: { className?: string }) {
  const patternId = `chevrons-${useId().replace(/[^\w-]/g, '')}`;
  const { src, width, height } = brand.chevrons;
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={`0 0 ${CHEVRON_RUN} ${height}`}
      preserveAspectRatio="xMinYMid slice"
      className={cx('block w-full rtl:-scale-x-100', className)}
    >
      <defs>
        <pattern id={patternId} width={CHEVRON_PERIOD} height={height} patternUnits="userSpaceOnUse">
          <image href={src} width={width} height={height} />
        </pattern>
      </defs>
      <rect width={CHEVRON_RUN} height={height} fill={`url(#${patternId})`} />
    </svg>
  );
}
