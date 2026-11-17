import { useEffect, useRef, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router';
import { ArrowRight } from 'lucide-react';
import {
  copy,
  cx,
  getSector,
  langPath,
  products,
  quoteHref,
  sectors,
  type Product,
  type SectorId,
} from '../../data';
import { useLanguage } from '../../data/i18n';
import Button from '../ui/Button';
import GatewayMark from '../ui/GatewayMark';
import { LaneDashes } from '../ui/GatewayBand';
import { CountUp, Reveal, RevealGroup, RevealItem } from '../ui/Reveal';
import { bindAmpersand } from '../ui/Typeset';

/** Soft gold glow behind the machine on the asphalt stage. */
const STAGE_GLOW = 'radial-gradient(58% 52% at 50% 58%, rgb(234 166 32 / 0.12), transparent 72%)';
/**
 * Cards whose top edge is an asphalt stage: the stage would paint over the gold hover hairline of
 * `card-interactive`, so the hairline is lifted above it (and lets clicks through to the card link).
 */
const STAGED_CARD = 'card card-interactive overflow-hidden before:pointer-events-none before:z-10';

/**
 * Body of the Products page: the sector filter (kept in ?sector=<id>, so a filtered view can be
 * shared), the product cards and the closing "More products are on the way" card.
 * An unknown sector id behaves like "All".
 */
export default function ProductGrid() {
  const { t } = useLanguage();
  const [params, setParams] = useSearchParams();
  const active = getSector(params.get('sector'))?.id ?? null;
  const shown = active ? products.filter((product) => product.sector === active) : products;
  const empty = shown.length === 0;
  /** From 1024 px the grid has two columns: the closing card spans the row whenever it would sit alone in it. */
  const moreWide = shown.length % 2 === 0;
  const listKey = shown.map((product) => product.id).join(' ') || 'none';

  const select = (id: SectorId | null) => {
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        if (id) next.set('sector', id);
        else next.delete('sector');
        return next;
      },
      { replace: true, preventScrollReset: true },
    );
  };

  return (
    <div className="section bg-background">
      <div className="container-site">
        <SectorFilter active={active} onSelect={select} />

        {/* Polite, so screen readers hear when a chosen sector has no product yet (keyed, so moving
            from one empty sector to another is announced again). */}
        <div aria-live="polite">
          {empty ? (
            <p key={active ?? 'all'} className="lead mt-10 max-w-text text-muted lg:mt-14">
              {t(copy.productsPage.empty)}
            </p>
          ) : null}
        </div>

        {/* Keyed by the products shown: when a new selection changes them, its cards rise in (and count up) again. */}
        <RevealGroup key={listKey} className="mt-8 grid gap-6 md:mt-10 lg:mt-12 lg:grid-cols-2 lg:gap-8">
          {shown.map((product, index) => (
            <RevealItem key={product.id}>
              <ProductCard product={product} priority={index === 0} />
            </RevealItem>
          ))}
          <RevealItem className={cx(moreWide && 'lg:col-span-2')}>
            <MoreCard sector={active} wide={moreWide} />
          </RevealItem>
        </RevealGroup>
      </div>
    </div>
  );
}

/**
 * "All" plus the eight sectors. On phones and tablets a single row that scrolls sideways
 * (bleeding to the screen edges without widening the page). From 1024 px the sector chips wrap
 * in their own column beside "All" and its divider, so every row lines up with the first sector.
 */
function SectorFilter({ active, onSelect }: { active: SectorId | null; onSelect: (id: SectorId | null) => void }) {
  const { t } = useLanguage();
  const row = useRef<HTMLDivElement>(null);
  /** Set by a click, so only a chosen chip glides into view; on arrival the row is placed at once. */
  const chosen = useRef(false);
  const choose = (id: SectorId | null) => {
    chosen.current = true;
    onSelect(id);
  };

  // Keep the pressed chip in view inside the scrolling row (e.g. a shared ?sector= link on a phone).
  useEffect(() => {
    const scroller = row.current;
    if (!scroller) return;
    const smooth = chosen.current && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    chosen.current = false;
    const centre = (behavior: ScrollBehavior) => {
      const chip = scroller.querySelector<HTMLElement>('[aria-pressed="true"]');
      if (!chip || scroller.scrollWidth <= scroller.clientWidth + 1) return;
      const box = scroller.getBoundingClientRect();
      const target = chip.getBoundingClientRect();
      scroller.scrollBy({ left: target.left + target.width / 2 - (box.left + box.width / 2), behavior });
    };
    centre(smooth ? 'smooth' : 'auto');
    // On arrival the web fonts can still be loading; they widen the chips, so centre again once they are ready.
    let cancelled = false;
    if (!smooth && document.fonts?.status === 'loading') {
      document.fonts.ready.then(() => !cancelled && centre('auto')).catch(() => undefined);
    }
    return () => {
      cancelled = true;
    };
  }, [active]);

  return (
    <Reveal className="-mx-[var(--gutter)] overflow-hidden lg:mx-0 lg:overflow-visible">
      <div
        ref={row}
        role="group"
        aria-label={t(copy.a11y.sectorFilter)}
        className="flex items-start gap-2 overflow-x-auto overscroll-x-contain px-[var(--gutter)] py-2 [scrollbar-width:none] lg:gap-3 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden"
      >
        <FilterChip pressed={active === null} onClick={() => choose(null)}>
          {t(copy.productsPage.all)}
        </FilterChip>
        <span aria-hidden="true" className="mx-1 w-px shrink-0 self-stretch bg-line" />
        <div className="flex shrink-0 gap-2 lg:min-w-0 lg:flex-1 lg:flex-wrap lg:gap-3">
          {sectors.map((sector) => (
            <FilterChip key={sector.id} pressed={active === sector.id} onClick={() => choose(sector.id)}>
              {t(sector.name)}
            </FilterChip>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

function FilterChip({ pressed, onClick, children }: { pressed: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      className="chip shrink-0"
      aria-pressed={pressed}
      onClick={onClick}
      // In the sideways-scrolling row a chip that receives keyboard focus is brought fully into view.
      onFocus={(event) => event.currentTarget.scrollIntoView({ block: 'nearest', inline: 'nearest' })}
    >
      {children}
    </button>
  );
}

/**
 * A product card: the machine on an asphalt stage, the sector, the name (the whole card opens
 * the product page), three key figures, "View details" and "Request a quote".
 */
/** `priority`: the first card's image is in the first screen on phones, so it loads at once. */
function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { lang, t } = useLanguage();
  const sector = getSector(product.sector);
  const href = langPath(lang, `/products/${product.id}`);
  const titleId = `product-${product.id}-title`;

  return (
    <article aria-labelledby={titleId} className={cx(STAGED_CARD, 'flex h-full flex-col')}>
      <div className="on-dark grain relative grid aspect-[16/10] place-items-center bg-asphalt md:aspect-[2/1] lg:aspect-[16/10]">
        <div aria-hidden="true" className="absolute inset-0" style={{ background: STAGE_GLOW }} />
        <img
          src={product.image}
          width={product.imageSize.width}
          height={product.imageSize.height}
          alt={t(product.name)}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          className="relative h-auto w-[84%] md:w-[68%] lg:w-[84%]"
        />
      </div>

      <div className="flex flex-1 flex-col p-6 md:p-8">
        {sector ? <p className="kicker text-balance text-muted">{bindAmpersand(t(sector.name))}</p> : null}
        <h2 id={titleId} className="h3 mt-1 text-balance text-primary">
          <Link to={href} className="inline-flex min-h-11 items-center after:absolute after:inset-0">
            <span className="link-draw">{t(product.name)}</span>
          </Link>
        </h2>

        {/* Phones: one row per figure (label · value). From 640 px: three columns, value above label. */}
        <dl className="mt-4 grid sm:mt-5 sm:grid-cols-3 sm:border-t sm:border-line sm:pt-6">
          {product.keyFigures.slice(0, 3).map((figure, index) => (
            <div
              key={figure.label.en}
              className={cx(
                'flex min-w-0 items-baseline justify-between gap-4 border-t border-line py-3.5 sm:flex-col-reverse sm:items-start sm:justify-end sm:gap-0 sm:border-t-0 sm:py-0',
                index > 0 && 'sm:border-s sm:ps-4 md:ps-6',
              )}
            >
              <dt className="text-sm leading-snug text-muted sm:mt-2">{t(figure.label)}</dt>
              <dd className="flex flex-wrap items-baseline gap-x-1.5">
                <CountUp
                  value={figure.value}
                  className="font-num text-xl font-bold leading-none text-primary sm:text-2xl md:text-[1.75rem]"
                />
                <span className="text-sm font-medium text-muted">{t(figure.unit)}</span>
              </dd>
            </div>
          ))}
        </dl>

        {/* The same pair as the featured product on Home: 52 px pills, the arrow on the quote. */}
        <div className="relative z-10 mt-auto flex flex-col gap-3 pt-7 sm:flex-row sm:flex-wrap sm:pt-8">
          <Button to={href} variant="outline-dark" aria-describedby={titleId} className="w-full sm:w-auto">
            {t(copy.cta.details)}
          </Button>
          <Button to={quoteHref(lang, { product: product.id })} arrow aria-describedby={titleId} className="w-full sm:w-auto">
            {t(copy.cta.quote)}
          </Button>
        </div>
      </div>
    </article>
  );
}

/**
 * The closing card: "More products are on the way" with "Ask for the full catalogue", opening
 * the quote form (with the filtered sector pre-selected). Its stage only carries the mark, so it
 * stays compact: short on phones and beside the text from 768 px. From 1024 px it stands beside a
 * product card with the same stage proportions, or spans the row when it would sit alone in it.
 */
function MoreCard({ sector, wide }: { sector: SectorId | null; wide: boolean }) {
  const { lang, t } = useLanguage();
  return (
    <article
      aria-labelledby="products-more-title"
      className={cx(STAGED_CARD, 'flex h-full flex-col md:flex-row', !wide && 'lg:flex-col')}
    >
      <div
        className={cx(
          'on-dark grain relative flex aspect-[2/1] flex-col items-center justify-center gap-6 bg-asphalt md:aspect-auto md:min-h-60 md:w-2/5 md:shrink-0 md:gap-7',
          wide ? 'lg:min-h-80 lg:w-5/12' : 'lg:aspect-[16/10] lg:min-h-0 lg:w-full',
        )}
      >
        <div aria-hidden="true" className="absolute inset-0" style={{ background: STAGE_GLOW }} />
        <GatewayMark tone="light" className="relative w-14 md:w-20" />
        <LaneDashes className="relative w-[112px]" />
      </div>

      <div className={cx('flex flex-1 flex-col p-6 md:justify-center md:p-8', wide ? 'lg:p-12' : 'lg:justify-start')}>
        <p className="kicker text-muted">{t(copy.pageKickers.products)}</p>
        <h2 id="products-more-title" className={cx('h3 mt-3 text-balance text-primary', wide && 'lg:text-[1.75rem]')}>
          {t(copy.productsPage.moreTitle)}
        </h2>
        {/* Beside a product card (1024 px+) the link sits on the same line as the card's buttons. */}
        <p className={cx('pt-6', !wide && 'lg:mt-auto')}>
          <Link
            to={quoteHref(lang, sector ? { sector } : undefined)}
            className="inline-flex min-h-11 items-center gap-2.5 font-medium text-primary after:absolute after:inset-0"
          >
            <span className="link-inline">{t(copy.productsPage.moreBody)}</span>
            <ArrowRight aria-hidden="true" className="h-[18px] w-[18px] shrink-0 rtl:-scale-x-100" strokeWidth={1.5} />
          </Link>
        </p>
      </div>
    </article>
  );
}
