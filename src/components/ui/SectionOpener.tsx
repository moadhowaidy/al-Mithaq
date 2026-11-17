import type { ReactNode } from 'react';
import { m } from 'framer-motion';
import { cx } from '../../data';
import { RevealGroup, RevealItem, useSwitchHeading } from './Reveal';

interface SectionOpenerProps {
  /** Editorial section number, e.g. "01" (Western digits in both languages). */
  number?: string;
  /** Short label next to the number, e.g. copy.home.sectorsTitle. */
  label: string;
  /** The section's H2. */
  title: ReactNode;
  /** Optional lead paragraph. */
  intro?: string;
  /** light: on Lane White / white · dark: on navy or asphalt. */
  tone?: 'light' | 'dark';
  align?: 'start' | 'center';
  /** id for the H2, so the section can use aria-labelledby. */
  headingId?: string;
  className?: string;
}

/**
 * Editorial section opener: "01 —— Label", then the H2 and an optional lead.
 * Numbers are gold on dark grounds and navy on light ones (gold is never text on light).
 */
export default function SectionOpener({
  number,
  label,
  title,
  intro,
  tone = 'light',
  align = 'start',
  headingId,
  className,
}: SectionOpenerProps) {
  const dark = tone === 'dark';
  const switchHeading = useSwitchHeading(Number(number ?? 0));
  return (
    <RevealGroup className={cx('max-w-3xl', align === 'center' && 'mx-auto text-center', className)}>
      <RevealItem
        as="p"
        className={cx('kicker flex items-center gap-3', align === 'center' && 'justify-center', dark ? 'text-steel' : 'text-muted')}
      >
        {number ? (
          <>
            <span className={cx('font-num', dark ? 'text-accent' : 'text-primary')}>{number}</span>
            <span aria-hidden="true" className={cx('h-px w-8 shrink-0', dark ? 'bg-accent' : 'bg-primary/30')} />
          </>
        ) : null}
        <span>{label}</span>
      </RevealItem>
      <RevealItem>
        <m.h2 id={headingId} className={cx('h2 mt-5', dark ? 'text-background' : 'text-primary')} {...switchHeading}>
          {title}
        </m.h2>
      </RevealItem>
      {intro ? (
        <RevealItem
          as="p"
          className={cx('lead mt-5 max-w-text text-pretty', align === 'center' && 'mx-auto', dark ? 'text-steel' : 'text-muted')}
        >
          {intro}
        </RevealItem>
      ) : null}
    </RevealGroup>
  );
}
