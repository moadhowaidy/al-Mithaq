import { m } from 'framer-motion';
import { company, copy, cx } from '../../data';
import { useLanguage } from '../../data/i18n';
import { RevealGroup, RevealItem, useSwitchHeading } from '../ui/Reveal';

/**
 * 03 · The pledge (Lane White, centred): the slogan set very large in Arabic with the English line
 * under it, in both language versions, then the pledge and three pillars divided by hairlines
 * (vertical between columns on desktop, horizontal when stacked on phones).
 */
export default function Pledge() {
  const { t } = useLanguage();
  const switchHeading = useSwitchHeading(3);
  return (
    <section aria-labelledby="home-pledge-title" className="section bg-background">
      <div className="container-site">
        <RevealGroup className="mx-auto max-w-4xl text-center">
          {/* Centred section opener: "03 —— Our pledge". */}
          <RevealItem as="p" className="kicker flex items-center justify-center gap-3 text-muted">
            <span className="font-num text-primary">03</span>
            <span aria-hidden="true" className="h-px w-8 shrink-0 bg-primary/30" />
            <span>{t(copy.home.pledgeKicker)}</span>
          </RevealItem>
          <RevealItem>
            <m.h2 id="home-pledge-title" className="mt-8 md:mt-10" {...switchHeading}>
              <span
                lang="ar"
                dir="rtl"
                className="block font-arabic text-[clamp(3rem,1.2rem+7.5vw,7.5rem)] font-black leading-[1.3] text-primary"
              >
                {company.slogan.ar}
              </span>
              <span
                lang="en"
                dir="ltr"
                className="mt-3 block font-latin text-[clamp(1.25rem,1.05rem+0.85vw,1.75rem)] font-medium leading-snug text-muted md:mt-4"
              >
                {company.slogan.en}
              </span>
            </m.h2>
          </RevealItem>
          <RevealItem>
            {/* A single lane dash: gold on light grounds only as a decorative mark. */}
            <span aria-hidden="true" className="mx-auto mt-10 block h-1.5 w-10 rounded-full bg-accent md:mt-12" />
          </RevealItem>
          <RevealItem as="p" className="lead mx-auto mt-10 max-w-text text-balance text-muted md:mt-12">
            {t(copy.home.pledgeBody)}
          </RevealItem>
        </RevealGroup>

        <RevealGroup as="ul" className="mx-auto mt-16 grid max-w-5xl md:mt-20 lg:mt-24 lg:grid-cols-3">
          {copy.home.pillars.map((pillar, index) => (
            <RevealItem
              as="li"
              key={pillar.title.en}
              className={cx(
                'relative px-2 py-8 text-center lg:px-8 lg:py-3',
                // Stacked: a short centred hairline (distinct from the full-width one before the next section).
                // Side by side: a vertical hairline between the columns.
                index > 0 &&
                  'before:absolute before:inset-x-0 before:top-0 before:mx-auto before:h-px before:w-16 before:bg-line lg:border-s lg:border-line lg:before:hidden',
              )}
            >
              <h3 className="h3 text-primary">{t(pillar.title)}</h3>
              <p className="mx-auto mt-3 max-w-[32ch] text-pretty text-muted">{t(pillar.text)}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
