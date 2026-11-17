import type { CSSProperties } from 'react';
import { copy, cx, getProduct, langPath, quoteHref } from '../../data';
import { useLanguage } from '../../data/i18n';
import Button from '../ui/Button';
import { ChevronStrip } from '../ui/GatewayBand';
import SectionOpener from '../ui/SectionOpener';
import { ClipReveal, CountUp, Reveal, RevealGroup, RevealItem } from '../ui/Reveal';
import { figureSpan, keepCompounds, setFigures } from '../ui/Typeset';

const FEATURED_ID = 'g2200';

/** The soft dusk glow of the product stages (radial gold at 12 %), as on the Products and product pages. */
const STAGE_GLOW = 'radial-gradient(closest-side, rgb(234 166 32 / 0.12), transparent)';

/**
 * 02 · Featured product: a full-width asphalt stage for the G2200, with the side illustration
 * large on a soft dusk glow (clip wipe in the reading direction), the five key figures counting
 * up once, the two actions and the work-zone chevrons as a slim strip along the stage's bottom edge.
 *
 * Phones and tablets read it like a product page: title, illustration, figures, then the actions.
 * From 1024 px the text and the actions share the column beside the illustration, and the figures
 * run in one row underneath.
 */
export default function FeaturedProduct() {
  const { lang, t } = useLanguage();
  const product = getProduct(FEATURED_ID);
  if (!product) return null;
  const figures = product.keyFigures;

  return (
    <section aria-labelledby="home-featured-title" className="on-dark grain relative overflow-hidden bg-asphalt">
      <div className="container-site section">
        <div className="grid gap-y-12 md:gap-y-16 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-0">
          <div className="lg:col-span-6 lg:row-start-1 lg:self-end xl:col-span-5">
            <SectionOpener
              tone="dark"
              number="02"
              label={t(copy.home.featuredKicker)}
              title={keepCompounds(t(product.name))}
              headingId="home-featured-title"
            />
            {/* Set here rather than as the opener's intro: balanced lines, so no line strands a word or two. */}
            <Reveal as="p" delay={0.16} className="lead mt-5 max-w-text text-balance text-steel">
              {setFigures(t(copy.home.featuredBody))}
            </Reveal>
          </div>

          <div className="relative lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1 lg:self-center xl:col-span-7 xl:col-start-6">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-x-6 -inset-y-10 md:-inset-x-12"
              style={{ background: STAGE_GLOW }}
            />
            {/* The wipe switches the lazy image to eager loading before it opens. */}
            <ClipReveal className="relative">
              <img
                src={product.image}
                width={product.imageSize.width}
                height={product.imageSize.height}
                alt={t(copy.home.featuredImageAlt)}
                loading="lazy"
                decoding="async"
                className="block h-auto w-full"
              />
            </ClipReveal>
          </div>

          <RevealGroup
            as="dl"
            className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-6 lg:col-span-12 lg:row-start-3 lg:mt-24 lg:grid-cols-[repeat(var(--figures),minmax(0,1fr))] lg:gap-x-8"
            style={{ '--figures': Math.min(figures.length, 6) } as CSSProperties}
          >
            {figures.map((figure, index) => (
              <RevealItem
                key={figure.label.en}
                className={cx('flex flex-col-reverse border-t border-steel/30 pt-6', figureSpan(index, figures.length))}
              >
                {/* The label comes first for screen readers ("Water tank: 300 L") and shows under the value. */}
                <dt className="mt-3 text-[15px] leading-snug text-steel">{t(figure.label)}</dt>
                {/* Five across from 1024 px: units sit under the values until 1280 px, where every pair fits on one line. */}
                <dd className="flex flex-wrap items-baseline gap-x-2 gap-y-1 lg:flex-col lg:items-start lg:gap-y-1.5 xl:flex-row xl:items-baseline xl:gap-y-1">
                  <CountUp value={figure.value} className="figure-value text-background" />
                  <span className={cx('text-accent', lang === 'ar' ? 'text-[15px] font-bold' : 'text-base font-semibold')}>
                    {t(figure.unit)}
                  </span>
                </dd>
              </RevealItem>
            ))}
          </RevealGroup>

          {/* Last in reading order: after the figures on phones and tablets, under the text from 1024 px. */}
          <Reveal
            delay={0.24}
            className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:col-span-6 lg:row-start-2 lg:mt-10 lg:self-start xl:col-span-5"
          >
            <Button to={langPath(lang, `/products/${product.id}`)} variant="outline-light" className="w-full sm:w-auto">
              {t(copy.cta.details)}
            </Button>
            <Button to={quoteHref(lang, { product: product.id })} arrow className="w-full sm:w-auto">
              {t(copy.cta.quote)}
            </Button>
          </Reveal>
        </div>
      </div>

      <ChevronStrip className="h-4 md:h-5" />
    </section>
  );
}
