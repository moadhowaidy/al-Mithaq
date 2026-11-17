import { m } from 'framer-motion';
import { Link } from 'react-router';
import { ArrowRight, MapPin } from 'lucide-react';
import { SECTOR_ICON_SIZE, brand, company, contact, copy, cx, langPath, sectors } from '../../data';
import { useLanguage } from '../../data/i18n';
import GatewayBand from '../ui/GatewayBand';
import { ClipReveal, Reveal, RevealGroup, RevealItem, useSwitchHeading } from '../ui/Reveal';
import { keepCompounds } from '../ui/Typeset';

/**
 * About page sections that tell the company's story: the meaning of the name (an editorial
 * feature around the word ميثاق), what the company does, and the story behind the logo.
 * The values and the company facts live in Values.tsx.
 */

/** Content sections after the first one open with a hairline, so the Lane White sections read as one calm sequence. */
const DIVIDED_SECTION = 'section border-t border-line';

/** The meaning of the name: ميثاق set very large, with its definition beside it and a short paragraph. */
export default function NameStory() {
  const { t } = useLanguage();
  const switchHeading = useSwitchHeading(1);
  return (
    <section aria-labelledby="about-name-title" className="section bg-background">
      <div className="container-site">
        <Reveal>
          <m.h2 id="about-name-title" className="kicker flex items-center gap-3 text-muted" {...switchHeading}>
            <span aria-hidden="true" className="h-px w-8 shrink-0 bg-primary/30" />
            <span>{t(copy.aboutPage.nameTitle)}</span>
          </m.h2>
        </Reveal>

        <div className="mt-8 grid gap-10 md:mt-10 lg:mt-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)] lg:items-center lg:gap-0">
          <NameWord />
          <RevealGroup delay={0.15} className="border-t border-line pt-10 lg:border-t-0 lg:border-s lg:py-6 lg:ps-16">
            <RevealItem as="p" className="h2 text-primary">
              <Definition text={t(copy.aboutPage.definition)} />
            </RevealItem>
            <RevealItem as="p" className="lead mt-6 max-w-text text-pretty text-muted lg:mt-8">
              {t(copy.aboutPage.meaning)}
            </RevealItem>
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}

/**
 * "Mithaq: a binding covenant", set like a dictionary entry: if the line has to wrap, it wraps
 * after the colon, never inside the definition ("Mithaq: a / binding covenant"). The definition is
 * an inline block, so on a screen narrower than the phrase it still wraps instead of overflowing.
 */
function Definition({ text }: { text: string }) {
  const colon = text.indexOf(':');
  if (colon <= 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, colon + 1)} <span className="inline-block">{text.slice(colon + 1).trim()}</span>
    </>
  );
}

/**
 * The word itself, in Noto Kufi Arabic 900, navy on Lane White, in both language versions.
 * It is Arabic in both, so its wipe always runs from right to left, the way the word is read.
 * The line box is tall enough for the alef, the three dots of ث and the dots under ي, so the
 * clip never trims them.
 *
 * Set in Kufi 900 the word is about 3.05 em wide, so each size keeps it within ~90 % of its
 * column: 28vw on phones, 168 px on tablets, and up to 184 px in the desktop column.
 */
function NameWord() {
  return (
    <ClipReveal from="right" duration={1.3} delay={0.05}>
      <p
        lang="ar"
        className="whitespace-nowrap font-arabic text-[min(28vw,10rem)] font-black leading-[1.32] text-primary md:text-[10.5rem] lg:text-[min(calc(14.8vw-0.25rem),11.5rem)]"
      >
        {company.shortName.ar}
      </p>
    </ClipReveal>
  );
}

/**
 * What we do: the company line, the head office and the eight sectors as small icon chips.
 * The two columns start at 1280 px: below that the chip names would wrap onto two lines,
 * so the section stays stacked and the chips keep one calm line each.
 */
export function WhatWeDo() {
  const { lang, t } = useLanguage();
  const switchHeading = useSwitchHeading(2);
  return (
    <section aria-labelledby="about-what-title" className="bg-background">
      <div className="container-site">
        <div className={cx(DIVIDED_SECTION, 'grid gap-x-16 gap-y-10 xl:grid-cols-12 xl:gap-y-14')}>
          <Reveal className="xl:col-span-5">
            <m.h2 id="about-what-title" className="h2 text-primary" {...switchHeading}>
              {t(copy.aboutPage.whatWeDoTitle)}
            </m.h2>
          </Reveal>

          <Reveal className="xl:col-span-7" delay={0.08}>
            <p className="lead max-w-text text-pretty text-primary">{keepCompounds(t(copy.aboutPage.whatWeDo))}</p>
          </Reveal>

          <Reveal className="xl:col-span-5 xl:row-start-2" delay={0.12}>
            <div className="flex items-start gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-line bg-surface">
                <MapPin aria-hidden="true" className="h-5 w-5 text-primary" strokeWidth={1.5} />
              </span>
              <div>
                <p className="kicker text-muted">{t(copy.contactPage.labels.headOffice)}</p>
                <p className="mt-1 text-lg font-medium text-primary">{t(contact.headOffice.value)}</p>
              </div>
            </div>
          </Reveal>

          <div className="max-w-3xl xl:col-span-7 xl:row-start-2">
            <Reveal as="h3" className="kicker text-muted" delay={0.12}>
              {t(copy.home.sectorsTitle)}
            </Reveal>
            <RevealGroup as="ul" role="list" delay={0.16} stagger={0.05} className="mt-5 grid gap-3 sm:grid-cols-2">
              {sectors.map((sector) => (
                <RevealItem as="li" key={sector.id} y={12}>
                  <Link
                    to={`${langPath(lang, '/sectors')}#${sector.id}`}
                    className="chip group flex min-h-[52px] w-full whitespace-normal py-2 ps-3 pe-4 text-start"
                  >
                    <img
                      src={sector.icon}
                      width={SECTOR_ICON_SIZE}
                      height={SECTOR_ICON_SIZE}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      decoding="async"
                      className="h-8 w-8 shrink-0"
                    />
                    <span className="leading-snug">{t(sector.name)}</span>
                    <ArrowRight
                      aria-hidden="true"
                      className="ms-auto h-4 w-4 shrink-0 text-muted transition-[translate] duration-500 ease-gateway rtl:-scale-x-100 ltr:group-hover:translate-x-1 ltr:group-focus-visible:translate-x-1 rtl:group-hover:-translate-x-1 rtl:group-focus-visible:-translate-x-1"
                      strokeWidth={1.5}
                    />
                  </Link>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </div>
    </section>
  );
}

/** The story behind the logo: the vertical colour logo large on Lane White, with its name and caption. */
export function LogoStory() {
  const { t } = useLanguage();
  const switchHeading = useSwitchHeading(4);
  const logo = brand.verticalColour;
  return (
    <section aria-labelledby="about-logo-title" className="bg-background">
      <div className="container-site">
        <div className={cx(DIVIDED_SECTION, 'grid items-center gap-12 md:grid-cols-2 md:gap-12 lg:gap-24')}>
          <RevealGroup>
            <RevealItem>
              <m.h2 id="about-logo-title" className="h2 text-primary" {...switchHeading}>
                {t(copy.aboutPage.logoTitle)}
              </m.h2>
            </RevealItem>
            <RevealItem className="mt-10 flex items-center gap-3 lg:mt-14">
              <span aria-hidden="true" className="h-px w-8 shrink-0 bg-primary/30" />
              <h3 className="h3 text-primary">{t(copy.aboutPage.logoName)}</h3>
            </RevealItem>
            <RevealItem as="p" className="lead mt-4 max-w-text text-pretty text-muted">
              {t(copy.aboutPage.logoStory)}
            </RevealItem>
          </RevealGroup>

          <Reveal delay={0.1} className="relative overflow-hidden rounded-card border border-line">
            {/* The wipe starts from the reading side; ClipReveal loads the lazy logo before it opens. */}
            <ClipReveal delay={0.2} className="px-8 pb-24 pt-16 md:pb-28 md:pt-20 lg:pb-32 lg:pt-24" innerClassName="grid place-items-center">
              <img
                src={logo.src}
                width={logo.width}
                height={logo.height}
                alt={t(copy.aboutPage.logoAlt)}
                loading="lazy"
                decoding="async"
                className="h-[300px] w-auto md:h-[380px] lg:h-[420px]"
              />
            </ClipReveal>
            <GatewayBand tone="light" className="absolute inset-x-0 bottom-0" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
