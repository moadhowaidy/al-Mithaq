import { Link } from 'react-router';
import { m } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import {
  SECTOR_ICON_SIZE,
  copy,
  cx,
  langPath,
  productsInSector,
  quoteHref,
  sectorNumber,
  sectors,
  type Sector,
} from '../../data';
import { useLanguage } from '../../data/i18n';
import Button from '../ui/Button';
import { Reveal, RevealGroup, RevealItem, useSwitchHeading } from '../ui/Reveal';
import { bindAmpersand } from '../ui/Typeset';

/**
 * The eight sector blocks of the Sectors page, in the logo's order, separated by hairlines.
 * Each block carries its own anchor (#oil-gas …), used by the footer and the Home cards.
 * From 768 px the blocks alternate sides; on phones they stack, plate first.
 * A block ends with the sector's products (chips to each product page) or, while the sector
 * has none, a quote button that arrives at the form with the sector pre-selected.
 */
export default function SectorBlocks() {
  return (
    <div className="section bg-background">
      <div className="container-site">
        {sectors.map((sector, index) => (
          <SectorBlock key={sector.id} sector={sector} index={index} />
        ))}
      </div>
    </div>
  );
}

function SectorBlock({ sector, index }: { sector: Sector; index: number }) {
  const { lang, t } = useLanguage();
  const switchHeading = useSwitchHeading(index + 1);
  const items = productsInSector(sector.id);
  const flipped = index % 2 === 1;
  const titleId = `${sector.id}-title`;

  return (
    <section
      id={sector.id}
      aria-labelledby={titleId}
      className="grid items-center gap-y-10 border-t border-line py-16 first:border-t-0 first:pt-0 last:pb-0 md:grid-cols-12 md:gap-x-8 md:py-20 lg:gap-x-12 lg:py-24"
    >
      <Reveal className={cx('md:col-span-5 md:row-start-1', flipped ? 'md:col-start-8' : 'md:col-start-1')}>
        <SectorPlate sector={sector} />
      </Reveal>

      <RevealGroup
        className={cx(
          'md:col-span-7 md:row-start-1 lg:col-span-6',
          flipped ? 'md:col-start-1' : 'md:col-start-6 lg:col-start-7',
        )}
      >
        <RevealItem>
          <m.h2 id={titleId} className="h2 text-primary" {...switchHeading}>
            {bindAmpersand(t(sector.name))}
          </m.h2>
        </RevealItem>
        <RevealItem as="p" className="lead mt-5 max-w-text text-pretty text-muted">
          {t(sector.summary)}
        </RevealItem>
        <RevealItem className="mt-8 md:mt-10">
          {items.length > 0 ? (
            <div className="border-t border-line pt-5">
              <h3 className="kicker">
                <Link
                  to={`${langPath(lang, '/products')}?sector=${sector.id}`}
                  className="inline-flex min-h-11 items-center gap-2.5 text-primary"
                >
                  <span className="link-draw">{t(copy.sectorsPage.productsInSector)}</span>
                  <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 rtl:-scale-x-100" strokeWidth={1.5} />
                </Link>
              </h3>
              <ul role="list" className="mt-3 flex flex-wrap gap-3">
                {items.map((product) => (
                  <li key={product.id} className="max-w-full">
                    <Link
                      to={langPath(lang, `/products/${product.id}`)}
                      className="chip max-w-full whitespace-normal py-2.5 text-start"
                    >
                      <span>{t(product.name)}</span>
                      <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 rtl:-scale-x-100" strokeWidth={1.5} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <Button
              to={quoteHref(lang, { sector: sector.id })}
              variant="outline-dark"
              arrow
              className="max-w-full whitespace-normal py-3.5"
            >
              {t(copy.sectorsPage.quoteForSector)}
            </Button>
          )}
        </RevealItem>
      </RevealGroup>
    </section>
  );
}

/**
 * The sector's white plate: the large decorative number ("01"–"08", Barlow 300 in the line
 * colour) in the top-start corner and the sector icon in the bottom-end corner.
 */
function SectorPlate({ sector }: { sector: Sector }) {
  return (
    <div className="card relative aspect-[2/1] overflow-hidden md:aspect-[4/3] lg:aspect-[16/10]">
      <span aria-hidden="true" className="deco-number absolute start-5 top-3 select-none md:start-8 md:top-5">
        {sectorNumber(sector)}
      </span>
      <img
        src={sector.icon}
        width={SECTOR_ICON_SIZE}
        height={SECTOR_ICON_SIZE}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="absolute bottom-5 end-5 h-20 w-20 md:bottom-8 md:end-8 md:h-24 md:w-24 lg:h-28 lg:w-28"
      />
    </div>
  );
}
