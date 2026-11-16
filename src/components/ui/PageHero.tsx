import type { ReactNode } from 'react';
import { m } from 'framer-motion';
import { cx } from '../../data';
import GatewayBand from './GatewayBand';
import { useEntrance } from './Reveal';

interface PageHeroProps {
  /** Small gold label above the title. */
  kicker: string;
  /** The page's H1. */
  title: string;
  /** One-line lead under the title. */
  lead?: string;
  /** Optional content under the lead (breadcrumb, buttons). */
  children?: ReactNode;
  /** Optional content above the kicker (e.g. a breadcrumb). */
  before?: ReactNode;
  className?: string;
}

/**
 * The navy page opening shared by every page except Home: a gold kicker with its hairline,
 * the H1, a one-line lead, and the dark Gateway band along the bottom edge.
 */
export default function PageHero({ kicker, title, lead, children, before, className }: PageHeroProps) {
  const entrance = useEntrance();
  return (
    <section className={cx('on-dark grain relative overflow-hidden bg-primary', className)}>
      <div className="container-site relative pb-28 pt-16 md:pb-32 md:pt-24 lg:pb-36 lg:pt-28">
        {before ? <m.div className="mb-10" {...entrance(0)}>{before}</m.div> : null}
        <m.p className="kicker text-accent" {...entrance(0)}>
          {kicker}
        </m.p>
        <m.span aria-hidden="true" className="mt-4 block h-px w-12 bg-accent" {...entrance(1)} />
        <m.h1 className="h1 mt-6 max-w-[20ch] text-background" {...entrance(1, 'heading')}>
          {title}
        </m.h1>
        {lead ? (
          <m.p className="lead mt-6 max-w-text text-steel" {...entrance(2)}>
            {lead}
          </m.p>
        ) : null}
        {children ? (
          <m.div className="mt-10" {...entrance(3)}>
            {children}
          </m.div>
        ) : null}
      </div>
      <GatewayBand className="absolute inset-x-0 bottom-0" />
    </section>
  );
}
