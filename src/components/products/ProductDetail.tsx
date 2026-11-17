import type { CSSProperties } from 'react';
import { Link } from 'react-router';
import { m } from 'framer-motion';
import { ArrowLeft, ChevronRight, Download, Mail } from 'lucide-react';
import {
  contact,
  copy,
  cx,
  fill,
  getSector,
  langPath,
  mailtoLink,
  quoteHref,
  type Product,
} from '../../data';
import { useLanguage } from '../../data/i18n';
import Button from '../ui/Button';
import { ChevronStrip } from '../ui/GatewayBand';
import { ClipReveal, CountUp, Reveal, RevealGroup, RevealItem, useEntrance, useSwitchHeading } from '../ui/Reveal';
import { figureSpan, keepCompounds, setFigures } from '../ui/Typeset';

/**
 * Body of a product page: the asphalt product stage (breadcrumb, name, sector, summary, the
 * image and the key figures, with the work-zone chevrons along its bottom edge), the technical
 * specifications beside the request card (sticky on desktop), the photo grid once real photos
 * are listed, and the way back to the product's sector.
 */
export default function ProductDetail({ product }: { product: Product }) {
  const { t } = useLanguage();
  const switchHeading = useSwitchHeading(2);

  return (
    <>
      <ProductStage product={product} />

      <div className="section bg-background">
        <div className="container-site">
          {/* The specifications region holds the table and its request card; photos and the way back follow it. */}
          <section aria-labelledby="specs-title" className="grid gap-12 lg:grid-cols-12 lg:gap-x-12">
            <div className="min-w-0 lg:col-span-7">
              <RevealGroup>
                <RevealItem>
                  <span aria-hidden="true" className="block h-px w-12 bg-primary/30" />
                </RevealItem>
                <RevealItem>
                  <m.h2 id="specs-title" className="h2 mt-6 text-primary" {...switchHeading}>
                    {t(copy.productPage.specs)}
                  </m.h2>
                </RevealItem>
              </RevealGroup>
              <Reveal className="mt-10 lg:mt-12">
                <SpecTable product={product} />
              </Reveal>
            </div>

            <div className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:col-span-5 lg:self-start">
              <Reveal delay={0.12}>
                <RequestCard product={product} />
              </Reveal>
            </div>
          </section>

          {product.photos.length > 0 ? <ProductPhotos product={product} /> : null}

          <BackToSector product={product} />
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Product stage (the page opening, on asphalt)                        */
/* ------------------------------------------------------------------ */

function ProductStage({ product }: { product: Product }) {
  const { lang, t } = useLanguage();
  const entrance = useEntrance();
  const sector = getSector(product.sector);
  const name = t(product.name);
  const figures = product.keyFigures;

  return (
    <section aria-labelledby="product-title" className="on-dark grain relative overflow-hidden bg-asphalt">
      <div className="container-site relative pb-20 pt-6 md:pb-24 md:pt-8 lg:pb-28 lg:pt-10">
        <m.nav aria-label={t(copy.a11y.breadcrumb)} {...entrance(0)}>
          <ol className="flex flex-wrap items-center gap-x-1.5 text-sm text-steel">
            <Crumb to={langPath(lang)}>{t(copy.nav.home)}</Crumb>
            <Crumb to={langPath(lang, '/products')}>{t(copy.nav.products)}</Crumb>
            <li className="flex min-h-11 items-center">
              <span aria-current="page" className="text-background">
                {name}
              </span>
            </li>
          </ol>
        </m.nav>

        {/* The text takes eight columns from 1024 px and seven from 1280 px, so the name sets in two lines at the H1 size in both languages. */}
        <div className="mt-8 grid items-center gap-y-12 md:mt-10 lg:mt-12 lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-8 xl:col-span-7">
            {sector ? (
              <m.p {...entrance(1)}>
                <Link
                  to={`${langPath(lang, '/sectors')}#${sector.id}`}
                  className="kicker inline-flex min-h-11 items-center text-accent"
                >
                  <span className="sr-only">{t(copy.productPage.sector)}: </span>
                  <span className="link-draw">{t(sector.name)}</span>
                </Link>
              </m.p>
            ) : null}
            <m.span aria-hidden="true" className="mt-2 block h-px w-12 bg-accent" {...entrance(1)} />
            <m.h1 id="product-title" className="h1 mt-6 text-background" {...entrance(2, 'heading')}>
              {keepCompounds(name)}
            </m.h1>
            <m.p className="lead mt-6 max-w-text text-pretty text-steel" {...entrance(3)}>
              {setFigures(t(product.summary))}
            </m.p>
          </div>

          <div className="relative w-full md:ms-auto md:max-w-[620px] lg:col-span-4 lg:max-w-none xl:col-span-5">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-x-6 -inset-y-10 md:-inset-x-12"
              style={{ background: 'radial-gradient(closest-side, rgb(234 166 32 / 0.12), transparent)' }}
            />
            <ClipReveal immediate delay={0.25} className="relative">
              <img
                src={product.image}
                width={product.imageSize.width}
                height={product.imageSize.height}
                alt={name}
                decoding="async"
                fetchPriority="high"
                className="h-auto w-full"
              />
            </ClipReveal>
          </div>
        </div>

        <m.div className="mt-14 md:mt-16 lg:mt-20" {...entrance(4)}>
          <p className="kicker text-steel">{t(copy.productPage.keyFigures)}</p>
          <dl
            className="mt-6 grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-6 lg:grid-cols-[repeat(var(--figures),minmax(0,1fr))] lg:gap-x-8"
            style={{ '--figures': Math.min(figures.length, 6) } as CSSProperties}
          >
            {figures.map((figure, index) => (
              <div
                key={figure.label.en}
                className={cx('flex min-w-0 flex-col-reverse border-t border-steel/30 pt-5', figureSpan(index, figures.length))}
              >
                <dt className="mt-3 text-sm leading-snug text-steel">{t(figure.label)}</dt>
                {/* Units sit under the value until 1280 px, where every value and unit fit on one line. */}
                <dd className="flex flex-col items-start gap-y-1.5 xl:flex-row xl:items-baseline xl:gap-x-2">
                  <CountUp value={figure.value} className="figure-value text-background" />
                  <span className="text-base font-semibold leading-tight text-accent">{t(figure.unit)}</span>
                </dd>
              </div>
            ))}
          </dl>
        </m.div>
      </div>

      {/* Work-zone chevrons: product panels only, here along the stage's bottom edge (as on Home's product stage). */}
      <ChevronStrip className="absolute inset-x-0 bottom-0 h-4 md:h-5" />
    </section>
  );
}

/**
 * A breadcrumb step. Its tap area is widened by 6 px on each side with a pseudo-element (short
 * labels such as "Home" still get 44 px) instead of a minimum width, which would pad the label on
 * one side only and make the gaps around the separators uneven.
 */
function Crumb({ to, children }: { to: string; children: string }) {
  return (
    <li className="flex items-center gap-1.5">
      <Link to={to} className="relative inline-flex min-h-11 items-center after:absolute after:inset-y-0 after:-inset-x-1.5">
        <span className="link-draw">{children}</span>
      </Link>
      <ChevronRight aria-hidden="true" className="h-4 w-4 shrink-0 text-steel rtl:-scale-x-100" strokeWidth={1.5} />
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* Technical specifications                                            */
/* ------------------------------------------------------------------ */

/**
 * Label and value in the current language; values keep their natural direction (Arabic words,
 * Latin and numbers mix). Two columns from 640 px; on phones each label sits above its value.
 * The explicit roles keep the table semantics when the phone layout changes its display.
 */
function SpecTable({ product }: { product: Product }) {
  const { t } = useLanguage();
  return (
    <div className="card overflow-hidden">
      <table role="table" aria-labelledby="specs-title" className="block w-full border-collapse sm:table">
        <thead role="rowgroup" className="block sm:table-header-group">
          <tr role="row" className="block sm:table-row">
            <th role="columnheader" scope="col" className="block p-0 sm:table-cell">
              <span className="sr-only">{t(copy.productPage.specItem)}</span>
            </th>
            <th role="columnheader" scope="col" className="block p-0 sm:table-cell">
              <span className="sr-only">{t(copy.productPage.specValue)}</span>
            </th>
          </tr>
        </thead>
        <tbody role="rowgroup" className="block sm:table-row-group">
          {product.specs.map((row, index) => (
            <tr
              key={row.label.en}
              role="row"
              className={cx('block sm:table-row', index > 0 && 'border-t border-line', index % 2 === 1 && 'bg-background')}
            >
              <th
                role="rowheader"
                scope="row"
                className="block px-5 pb-1 pt-4 text-start text-sm font-medium leading-snug text-muted sm:table-cell sm:w-2/5 sm:px-6 sm:py-4 sm:align-top sm:text-[15px] md:px-8 md:py-5 md:text-base"
              >
                {t(row.label)}
              </th>
              <td
                role="cell"
                className="block px-5 pb-4 text-[15px] leading-snug text-primary sm:table-cell sm:px-6 sm:py-4 sm:align-top md:px-8 md:py-5 md:text-base"
              >
                {setFigures(t(row.value))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Full-width pills of the request card: the labels are long, so they keep 20 px sides and wrap in balanced lines if they must. */
const CARD_BUTTON = 'w-full whitespace-normal px-5 py-3 leading-snug text-balance';

/**
 * The request card: quote for this product, spec sheet by email, download (once a brochure exists)
 * and the address. The card is a size container: when it is narrow (phones, and the side column
 * between 1024 and 1279 px) the decorative icons and arrow give their room to the labels.
 */
function RequestCard({ product }: { product: Product }) {
  const { lang, t } = useLanguage();
  const name = t(product.name);
  const specSheetMail = mailtoLink(fill(t(copy.emailSubjects.specSheet), { product: name }));

  return (
    <div className="card @container p-5 sm:p-8">
      <p className="h3 text-balance text-primary">{keepCompounds(name)}</p>
      <div className="mt-6 flex flex-col gap-3 [&_.btn-icon]:hidden @min-[20rem]:[&_.btn-icon]:block">
        <Button to={quoteHref(lang, { product: product.id })} arrow className={CARD_BUTTON}>
          {t(copy.productPage.quoteForProduct)}
        </Button>
        <Button href={specSheetMail} variant="outline-dark" icon={Mail} className={CARD_BUTTON}>
          {t(copy.productPage.emailSpec)}
        </Button>
        {product.brochure ? (
          <Button href={product.brochure} download variant="outline-dark" icon={Download} className={CARD_BUTTON}>
            {t(copy.productPage.download)}
          </Button>
        ) : null}
      </div>
      <div className="mt-7 border-t border-line pt-5">
        <p className="text-sm text-muted">{t(copy.contactPage.labels.email)}</p>
        <a href={specSheetMail} className="inline-flex min-h-11 items-center font-medium text-primary">
          <span dir="ltr" className="link-inline">
            {contact.email}
          </span>
        </a>
      </div>
    </div>
  );
}

/** Real photos [CONFIRM]: renders once the product's `photos` array has entries. */
function ProductPhotos({ product }: { product: Product }) {
  const { t } = useLanguage();
  const switchHeading = useSwitchHeading(3);
  return (
    <section aria-labelledby="photos-title" className="mt-16 border-t border-line pt-16 lg:mt-24 lg:pt-24">
      <Reveal>
        <m.h2 id="photos-title" className="h2 text-primary" {...switchHeading}>
          {t(copy.productPage.photos)}
        </m.h2>
      </Reveal>
      <RevealGroup as="ul" role="list" className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {product.photos.map((photo) => (
          <RevealItem as="li" key={photo.src}>
            <ClipReveal className="overflow-hidden rounded-card border border-line bg-surface">
              <img
                src={photo.src}
                width={photo.width}
                height={photo.height}
                alt={t(photo.alt)}
                loading="lazy"
                decoding="async"
                className="h-auto w-full"
              />
            </ClipReveal>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}

/** "Back to the sector", with the sector's name, to /<lang>/sectors#<sector>. */
function BackToSector({ product }: { product: Product }) {
  const { lang, t } = useLanguage();
  const sector = getSector(product.sector);
  return (
    <Reveal className="mt-16 border-t border-line pt-8 lg:mt-24 lg:pt-10">
      <Link to={`${langPath(lang, '/sectors')}#${product.sector}`} className="group inline-flex min-h-11 items-center gap-5">
        <span
          aria-hidden="true"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-line bg-surface transition-colors duration-300 group-hover:border-primary"
        >
          <ArrowLeft className="h-5 w-5 rtl:-scale-x-100" strokeWidth={1.5} />
        </span>
        <span className="flex flex-col">
          <span className="kicker text-muted">{t(copy.productPage.backToSector)}</span>
          {sector ? (
            <span className="h3 mt-1 text-primary">
              <span className="link-draw">{t(sector.name)}</span>
            </span>
          ) : null}
        </span>
      </Link>
    </Reveal>
  );
}
