import type { CSSProperties } from 'react';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { copy, cx, langPath, partners, type Partner } from '../../data';
import { useLanguage } from '../../data/i18n';
import SectionOpener from '../ui/SectionOpener';
import { Reveal, RevealGroup, RevealItem } from '../ui/Reveal';

/** Tiles in the row: four across on tablets and desktop, two by two on phones. */
const TILE_COUNT = 4;

/** A white tile with a hairline border, the same frame as the partner tiles on the Partners page. */
const TILE =
  'relative flex h-24 items-center justify-center rounded-card border border-line bg-surface px-3 text-center sm:h-28 lg:h-36 lg:px-5';

/**
 * 04 · Our partners: a row of partner logos (greyscale, full colour on hover) and a link to the
 * Partners page. No partner is confirmed yet, so the row shows quiet placeholder tiles, marked the
 * same way as on the Partners page, that fill in by themselves once entries are added to
 * `partners` in src/data/index.ts.
 */
export default function PartnersTeaser() {
  const { lang, t } = useLanguage();
  const shown = partners.slice(0, TILE_COUNT);
  const tileCount = shown.length || TILE_COUNT;

  return (
    <section aria-labelledby="home-partners-title" className="bg-background">
      {/* Hairline between two Lane White sections. */}
      <div aria-hidden="true" className="container-site">
        <div className="h-px bg-line" />
      </div>
      <div className="container-site section grid gap-y-12 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-x-12 md:gap-y-16 lg:gap-x-16">
        <SectionOpener
          number="04"
          label={t(copy.home.partnersTitle)}
          title={t(copy.home.partnersBody)}
          headingId="home-partners-title"
        />

        <Reveal delay={0.16} className="order-last md:order-none md:pb-1.5">
          <Link to={langPath(lang, '/partners')} className="group inline-flex min-h-11 items-center gap-2.5 font-semibold text-primary">
            <span className="link-draw group-hover:[background-size:100%_1px] group-focus-visible:[background-size:100%_1px]">
              {t(copy.cta.allPartners)}
            </span>
            <ArrowRight
              aria-hidden="true"
              strokeWidth={1.5}
              className="h-[18px] w-[18px] shrink-0 transition-[translate] duration-500 ease-gateway rtl:-scale-x-100 ltr:group-hover:translate-x-1 ltr:group-focus-visible:translate-x-1 rtl:group-hover:-translate-x-1 rtl:group-focus-visible:-translate-x-1"
            />
          </Link>
        </Reveal>

        {/* Columns follow the number of tiles, so one to three confirmed partners never leave a half-empty row. */}
        <RevealGroup
          as="ul"
          className="grid grid-cols-[repeat(var(--tiles-phone),minmax(0,1fr))] gap-3 sm:gap-4 md:col-span-2 md:grid-cols-[repeat(var(--tiles),minmax(0,1fr))] lg:gap-6"
          style={{ '--tiles': tileCount, '--tiles-phone': Math.min(tileCount, 2) } as CSSProperties}
        >
          {shown.length > 0
            ? shown.map((partner) => (
                <RevealItem as="li" key={partner.id} className={cx('group', TILE)}>
                  <PartnerLogo partner={partner} />
                </RevealItem>
              ))
            : Array.from({ length: TILE_COUNT }, (_, index) => (
                <RevealItem as="li" key={index} className={TILE}>
                  <CornerMarks />
                  <span className="text-[13px] font-medium leading-snug text-muted sm:text-sm">
                    {t(copy.partnersPage.placeholder)}
                  </span>
                </RevealItem>
              ))}
        </RevealGroup>
      </div>
    </section>
  );
}

/**
 * A partner logo in greyscale that turns to full colour on hover. The colour comes from a second
 * copy of the logo fading in on top, so only opacity is animated.
 */
function PartnerLogo({ partner }: { partner: Partner }) {
  const { t } = useLanguage();
  const logo = { src: partner.logo, width: partner.logoSize.width, height: partner.logoSize.height };
  const shape = 'col-start-1 row-start-1 h-auto max-h-12 w-auto max-w-full object-contain';
  return (
    <span className="grid w-full place-items-center">
      <img {...logo} alt={t(partner.name)} loading="lazy" decoding="async" className={cx(shape, 'opacity-75 grayscale')} />
      <img
        {...logo}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className={cx(shape, 'opacity-0 transition-opacity duration-500 ease-gateway group-hover:opacity-100')}
      />
    </span>
  );
}

/** Fine corner marks, the way a reserved space is marked on a layout (as on the Partners page). Decorative. */
function CornerMarks() {
  const corner = 'absolute h-3 w-3 border-primary/25 sm:h-3.5 sm:w-3.5';
  return (
    <>
      <span aria-hidden="true" className={cx(corner, 'start-3 top-3 border-s border-t sm:start-4 sm:top-4')} />
      <span aria-hidden="true" className={cx(corner, 'end-3 top-3 border-e border-t sm:end-4 sm:top-4')} />
      <span aria-hidden="true" className={cx(corner, 'bottom-3 start-3 border-b border-s sm:bottom-4 sm:start-4')} />
      <span aria-hidden="true" className={cx(corner, 'bottom-3 end-3 border-b border-e sm:bottom-4 sm:end-4')} />
    </>
  );
}
