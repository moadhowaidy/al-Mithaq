import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { SECTOR_ICON_SIZE, copy, cx, langPath, sectorNumber, sectors } from '../../data';
import { useLanguage } from '../../data/i18n';
import SectionOpener from '../ui/SectionOpener';
import { RevealGroup, RevealItem } from '../ui/Reveal';
import { bindAmpersand } from '../ui/Typeset';

/**
 * 01 · Our eight sectors: a 4 × 2 grid of white cards (2 × 4 on phones and tablets, where four
 * columns would stack the longer Arabic names one word per line), in the logo's order.
 * Each card is one link to its block on the Sectors page. On hover and focus the card lifts 4 px,
 * a gold hairline draws across its top edge and the arrow slides 4 px in the reading direction.
 */
export default function SectorsStrip() {
  const { lang, t } = useLanguage();
  return (
    <section aria-labelledby="home-sectors-title" className="section bg-background">
      <div className="container-site">
        <SectionOpener
          number="01"
          label={t(copy.home.sectorsTitle)}
          title={t(copy.home.sectorsSubtitle)}
          headingId="home-sectors-title"
        />
        <RevealGroup as="ul" className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:mt-16 lg:grid-cols-4 lg:gap-6">
          {sectors.map((sector) => (
            <RevealItem as="li" key={sector.id} className="flex">
              <Link
                to={`${langPath(lang, '/sectors')}#${sector.id}`}
                className="card card-interactive group flex w-full flex-col p-4 sm:p-5 lg:min-h-[15.5rem] lg:p-7"
              >
                {/* Icon at the start, arrow at the end: the name below keeps the card's full width. */}
                <div className="flex items-start justify-between gap-3">
                  <img
                    src={sector.icon}
                    width={SECTOR_ICON_SIZE}
                    height={SECTOR_ICON_SIZE}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                    className="h-14 w-14 lg:h-16 lg:w-16"
                  />
                  <ArrowRight
                    aria-hidden="true"
                    strokeWidth={1.5}
                    className="mt-1 h-5 w-5 shrink-0 text-primary transition-[translate] duration-500 ease-gateway rtl:-scale-x-100 ltr:group-hover:translate-x-1 ltr:group-focus-visible:translate-x-1 rtl:group-hover:-translate-x-1 rtl:group-focus-visible:-translate-x-1"
                  />
                </div>
                {/* Anchored under the icon, so numbers and names line up across each row. */}
                <div className="pt-7 lg:pt-10">
                  <span aria-hidden="true" className="font-num block text-sm font-semibold text-muted">
                    {sectorNumber(sector)}
                  </span>
                  <h3
                    className={cx(
                      'mt-1.5 text-balance text-primary',
                      lang === 'ar'
                        ? 'text-[15px] font-bold leading-[1.75] sm:text-base lg:text-[17px]'
                        : 'text-base font-semibold leading-snug lg:text-lg',
                    )}
                  >
                    {bindAmpersand(t(sector.name))}
                  </h3>
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
