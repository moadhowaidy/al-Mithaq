import { m } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { copy, cx, getSector, partnerGroups, partners, type Partner, type PartnerGroup, type Sector } from '../../data';
import { useLanguage } from '../../data/i18n';
import { RevealGroup, RevealItem, useSwitchHeading } from '../ui/Reveal';

/** Neutral tiles shown in a group that has no confirmed partner yet. */
const PLACEHOLDER_TILES = 3;

/**
 * The three partner groups in order, each with its h2 and a grid of tiles. A group without
 * partners shows three quiet placeholder tiles, so the page is final and fills in by itself
 * once partners are added to `partners` in src/data/index.ts [CONFIRM].
 */
export default function PartnerGroups() {
  return (
    <div className="bg-background pb-16 pt-20 md:pb-20 lg:pb-24 lg:pt-32">
      <div className="container-site">
        {partnerGroups.map((group, index) => (
          <GroupBlock key={group.id} group={group} index={index} members={partners.filter((partner) => partner.group === group.id)} />
        ))}
      </div>
    </div>
  );
}

function GroupBlock({ group, index, members }: { group: PartnerGroup; index: number; members: Partner[] }) {
  const { t } = useLanguage();
  const switchHeading = useSwitchHeading(index + 1);
  const headingId = `partners-group-${group.id}`;
  return (
    <section
      aria-labelledby={headingId}
      className="grid gap-8 border-t border-line py-12 first:border-t-0 first:pt-0 last:pb-0 md:gap-10 md:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16 lg:py-20"
    >
      <RevealGroup>
        <RevealItem as="p" className="flex items-center gap-3 text-primary">
          <span aria-hidden="true" className="font-num text-sm font-semibold tracking-[0.2em]">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span aria-hidden="true" className="h-px w-8 shrink-0 bg-primary/30" />
        </RevealItem>
        <RevealItem>
          <m.h2 id={headingId} className="h3 mt-5 text-balance text-[1.625rem] text-primary lg:text-[1.875rem]" {...switchHeading}>
            {t(group.name)}
          </m.h2>
        </RevealItem>
      </RevealGroup>

      {members.length > 0 ? <PartnerTiles members={members} /> : <PlaceholderTiles />}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Partner tiles                                                       */
/* ------------------------------------------------------------------ */

function PartnerTiles({ members }: { members: Partner[] }) {
  return (
    <RevealGroup as="ul" role="list" className="grid gap-4 sm:grid-cols-2 lg:gap-5 xl:grid-cols-3">
      {members.map((partner) => (
        <PartnerTile key={partner.id} partner={partner} />
      ))}
    </RevealGroup>
  );
}

/**
 * A partner: the logo in greyscale that turns to full colour on hover (and when its link has
 * focus), then the name, country and sectors, and a website link when one is set.
 * The greyscale copy and a full-colour copy of the logo crossfade, so only opacity is animated.
 * The card sits inside the revealed <li>: the reveal leaves an inline transform on the <li>,
 * which would cancel the card's hover lift if both were the same element.
 */
function PartnerTile({ partner }: { partner: Partner }) {
  const { t } = useLanguage();
  const partnerSectors = partner.sectors.map((id) => getSector(id)).filter((sector): sector is Sector => Boolean(sector));
  const nameId = `partner-${partner.id}-name`;
  const logoClass = 'col-start-1 row-start-1 h-auto max-h-14 w-auto max-w-full object-contain transition-opacity duration-500 ease-gateway';
  const logo = { src: partner.logo, width: partner.logoSize.width, height: partner.logoSize.height };

  return (
    <RevealItem as="li" className="flex">
      <article aria-labelledby={nameId} className={cx('card group flex w-full flex-col', partner.website && 'card-interactive')}>
        {/* The name follows as text, so the logo images carry empty alt text. */}
        <div className="grid aspect-[2/1] place-items-center border-b border-line px-8 sm:aspect-[3/2]">
          <span className="grid place-items-center">
            <img
              {...logo}
              alt=""
              loading="lazy"
              decoding="async"
              className={cx(logoClass, 'opacity-75 grayscale group-focus-within:opacity-0 group-hover:opacity-0')}
            />
            <img
              {...logo}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              className={cx(logoClass, 'opacity-0 group-focus-within:opacity-100 group-hover:opacity-100')}
            />
          </span>
        </div>
        <div className="flex flex-1 flex-col p-6">
          <h3 id={nameId} className="h3 text-primary">
            {t(partner.name)}
          </h3>
          <dl className="mt-5 space-y-4 text-[15px] leading-snug">
            <div>
              <dt className="kicker text-muted">{t(copy.partnersPage.country)}</dt>
              <dd className="mt-1.5 text-primary">{t(partner.country)}</dd>
            </div>
            {partnerSectors.length > 0 ? (
              <div>
                <dt className="kicker text-muted">{t(copy.partnersPage.sectors)}</dt>
                <dd className="mt-1.5">
                  <ul role="list" className="space-y-1 text-primary">
                    {partnerSectors.map((sector) => (
                      <li key={sector.id}>{t(sector.name)}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            ) : null}
          </dl>
          {partner.website ? (
            <a
              href={partner.website}
              target="_blank"
              rel="noopener noreferrer"
              aria-describedby={nameId}
              className="mt-auto inline-flex min-h-11 items-center gap-2 self-start pt-5 font-semibold text-primary"
            >
              <span className="link-draw">{t(copy.partnersPage.visitWebsite)}</span>
              <ExternalLink aria-hidden="true" className="h-4 w-4 shrink-0 rtl:-scale-x-100" strokeWidth={1.5} />
              <span className="sr-only"> {t(copy.a11y.newTab)}</span>
            </a>
          ) : null}
        </div>
      </article>
    </RevealItem>
  );
}

/* ------------------------------------------------------------------ */
/* Placeholder tiles                                                   */
/* ------------------------------------------------------------------ */

/**
 * Three neutral tiles labelled "Partner logo": a hairline frame with fine corner marks, the way
 * a reserved space is marked on a layout. Nothing in them could be mistaken for a brand.
 */
function PlaceholderTiles() {
  const { t } = useLanguage();
  const label = t(copy.partnersPage.placeholder);
  return (
    <RevealGroup as="ul" role="list" className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
      {Array.from({ length: PLACEHOLDER_TILES }, (_, index) => (
        <RevealItem
          as="li"
          key={index}
          className="relative grid aspect-square place-items-center rounded-card border border-line bg-surface px-2 text-center sm:aspect-[3/2] sm:px-4"
        >
          <CornerMarks />
          <span className="text-[13px] font-medium leading-snug text-muted sm:text-sm">{label}</span>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}

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
