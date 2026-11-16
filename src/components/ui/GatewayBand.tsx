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
