import { m } from 'framer-motion';
import { company, copy, cx } from '../../data';
import { useLanguage } from '../../data/i18n';
import { Reveal, RevealGroup, RevealItem, useSwitchHeading } from '../ui/Reveal';

/** Opens with a hairline, like the other About sections after the first one. */
const DIVIDED_SECTION = 'section border-t border-line';

/**
 * Inline padding of a value cell, so the text of the first column lines up with the title above
 * and the hairlines sit centred in the gaps: 1 column on mobile, 2 on tablet, 4 on desktop.
 */
function cellPadding(index: number): string {
  const even = index % 2 === 0;
  const column = index % 4;
  return cx(even ? 'md:pe-8' : 'md:ps-8', even && column > 0 && 'lg:ps-8', !even && column < 3 && 'lg:pe-8');
}

/** Our values: four short commitments in a grid separated by 1 px hairlines, numbered 01–04. */
export default function Values() {
  const { t } = useLanguage();
  const switchHeading = useSwitchHeading(3);
  return (
    <section aria-labelledby="about-values-title" className="bg-background">
      <div className="container-site">
        <div className={DIVIDED_SECTION}>
          <Reveal>
            <m.h2 id="about-values-title" className="h2 text-primary" {...switchHeading}>
              {t(copy.aboutPage.valuesTitle)}
            </m.h2>
          </Reveal>
          {/* gap-px over a line-coloured ground draws the hairlines between the cells. Only a top rule:
              the next section's own hairline closes the grid, so no second rule runs parallel to it. */}
          <RevealGroup as="ol" role="list" className="mt-12 grid gap-px border-t border-line bg-line md:grid-cols-2 lg:mt-16 lg:grid-cols-4">
            {copy.aboutPage.values.map((value, index) => (
              <li key={value.title.en} className={cx('bg-background py-10 md:py-12 lg:py-14', cellPadding(index))}>
                <RevealItem>
                  <p aria-hidden="true" className="flex items-center gap-3 text-primary">
                    <span className="font-num text-sm font-semibold tracking-[0.2em]">{String(index + 1).padStart(2, '0')}</span>
                    <span className="h-px w-8 shrink-0 bg-primary/30" />
                  </p>
                  <h3 className="h3 mt-6 text-primary lg:mt-8">{t(value.title)}</h3>
                  <p className="mt-3 text-pretty text-muted">{t(value.text)}</p>
                </RevealItem>
              </li>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}

/**
 * Company facts: founding year and registration. Both are [CONFIRM] and null for now, so the
 * block renders nothing until one of them is filled in src/data/index.ts.
 */
export function CompanyFacts() {
  const { t } = useLanguage();
  const switchHeading = useSwitchHeading(5);
  const { founded, registration } = company;
  if (founded == null && registration == null) return null;
  const both = founded != null && registration != null;
  return (
    <section aria-labelledby="about-facts-title" className="bg-background">
      <div className="container-site">
        <div className={DIVIDED_SECTION}>
          <Reveal>
            <m.h2 id="about-facts-title" className="h2 text-primary" {...switchHeading}>
              {t(copy.aboutPage.factsTitle)}
            </m.h2>
          </Reveal>
          <Reveal as="dl" delay={0.08} className={cx('mt-12 grid gap-px border-t border-line bg-line lg:mt-16', both && 'md:grid-cols-2')}>
            {founded != null ? (
              <div className={cx('bg-background py-10', both && 'md:pe-8')}>
                <dt className="kicker text-muted">{t(copy.aboutPage.founded)}</dt>
                <dd className="figure-value mt-4 text-primary">{founded}</dd>
              </div>
            ) : null}
            {registration != null ? (
              <div className={cx('bg-background py-10', both && 'md:ps-8')}>
                <dt className="kicker text-muted">{t(copy.aboutPage.registration)}</dt>
                <dd className="mt-4 text-lg font-medium text-primary">{t(registration)}</dd>
              </div>
            ) : null}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
