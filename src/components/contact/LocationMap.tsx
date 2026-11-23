import type { ReactNode } from 'react';
import { m, useReducedMotion } from 'framer-motion';
import { ExternalLink, Navigation } from 'lucide-react';
import { contact, copy, cx, directionsLink, mapEmbed } from '../../data';
import { useLanguage } from '../../data/i18n';
import Button from '../ui/Button';
import GatewayBand from '../ui/GatewayBand';
import GatewayMark from '../ui/GatewayMark';
import { ClipReveal, EASE_OUT, REVEAL_VIEWPORT, useSwitchHeading } from '../ui/Reveal';
import SectionOpener from '../ui/SectionOpener';

/**
 * The head-office section of the Contact page, on Lane White: the opener (kicker, H2, lead), then
 * the map at full container width (480 px tall on desktop, 360 px on phones, 16 px radius, 1 px
 * line border). Once contact.map.lat and lng are set, the Google map is embedded in the page's
 * language with a navy card floating over its inline-start bottom corner (below the map on
 * phones). While they are null there is no iframe and no "Get directions": the navy map card
 * fills the map area with the Gateway band along its bottom edge and the "Open in Google Maps"
 * button, which always opens the exact head office (contact.map.link).
 */
export default function LocationMap({ className }: { className?: string }) {
  const { t, lang } = useLanguage();
  const embed = mapEmbed(lang);
  return (
    <section aria-labelledby="location-title" className={cx('section border-t border-line bg-background', className)}>
      <div className="container-site">
        <SectionOpener
          label={t(copy.location.kicker)}
          title={t(copy.location.title)}
          intro={t(copy.location.lead)}
          headingId="location-title"
        />
        <div className="mt-12 lg:mt-16">{embed ? <MapEmbed src={embed} /> : <MapCard />}</div>
      </div>
    </section>
  );
}

function OpenMapButton() {
  const { t } = useLanguage();
  return (
    <Button external href={contact.map.link} variant="outline-light" icon={ExternalLink}>
      {t(copy.location.openMap)}
    </Button>
  );
}

function DirectionsButton({ href }: { href: string }) {
  const { t } = useLanguage();
  return (
    <Button external href={href} variant="primary" icon={Navigation}>
      {t(copy.location.directions)}
    </Button>
  );
}

/** With reduced motion the card appears at once; otherwise it rises 16 px after the map wipe (700 ms). */
function CardRise({ className, children }: { className?: string; children: ReactNode }) {
  const reduce = useReducedMotion();
  const { justSwitched } = useLanguage();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={REVEAL_VIEWPORT}
      transition={justSwitched ? { duration: 0 } : { duration: 0.7, ease: EASE_OUT, delay: 0.7 }}
    >
      {children}
    </m.div>
  );
}

/** Head-office label (gold) with a gold hairline under it, then the city in Lane White. Navy grounds only. */
function CardText({ headingLevel = 'p' }: { headingLevel?: 'p' | 'h3' }) {
  const { t } = useLanguage();
  const Tag = headingLevel;
  const { street } = contact.headOffice;
  return (
    <>
      <GatewayMark tone="light" className="w-7" />
      <p className="kicker mt-5 text-accent">{t(copy.location.kicker)}</p>
      <span aria-hidden="true" className="mt-3 block h-px w-12 bg-accent" />
      <Tag className="h3 mt-4 text-background">{t(copy.location.city)}</Tag>
      {street ? <p className="mt-2 text-steel">{t(street)}</p> : null}
    </>
  );
}

/** Until the coordinates are confirmed: the navy card fills the map area; no iframe, no directions. */
function MapCard() {
  const { t } = useLanguage();
  const switchHeading = useSwitchHeading(4);
  const { street } = contact.headOffice;
  return (
    <ClipReveal duration={0.7} className="rounded-2xl">
      <div className="on-dark relative flex h-[360px] overflow-hidden rounded-2xl border border-line bg-primary md:h-[480px]">
        <MapVisual />
        <div className="relative z-10 flex w-full flex-col justify-center px-6 pb-16 pt-6 sm:px-10 md:px-14 md:pb-20">
          <GatewayMark tone="light" className="w-7" />
          <p className="kicker mt-5 text-accent">{t(copy.location.kicker)}</p>
          <span aria-hidden="true" className="mt-3 block h-px w-12 bg-accent" />
          <m.p className="h2 mt-5 text-background" {...switchHeading}>
            {t(copy.location.city)}
          </m.p>
          {street ? <p className="lead mt-3 text-steel">{t(street)}</p> : null}
          <div className="mt-8">
            <OpenMapButton />
          </div>
        </div>
        <GatewayBand tone="dark" className="absolute inset-x-0 bottom-0" />
      </div>
    </ClipReveal>
  );
}

/**
 * Decorative, desktop only: dusk glow and hairline rings around the Gateway mark at the inline end
 * (never mirrored). A radial mask dissolves the rings into the navy. The runway-light loop rests
 * by itself while off screen and never runs under reduced motion; here the dashes just stay lit.
 */
function MapVisual() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-y-0 end-0 hidden w-1/2 overflow-hidden [mask-image:radial-gradient(closest-side,#000_55%,transparent)] md:block"
    >
      <div className="absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full dusk-glow" />
      <div className="absolute inset-x-0 top-1/2 h-px bg-steel/15" />
      <div className="absolute inset-y-0 left-1/2 w-px bg-steel/15" />
      {[9, 16, 24, 33].map((size) => (
        <div
          key={size}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-steel/30"
          style={{ width: `${size}rem`, height: `${size}rem` }}
        />
      ))}
      <GatewayMark tone="light" dashes="static" className="absolute left-1/2 top-1/2 w-24 -translate-x-1/2 -translate-y-1/2 lg:w-28" />
    </div>
  );
}

/** With confirmed coordinates: the embedded Google map and the location card. */
function MapEmbed({ src }: { src: string }) {
  const { t } = useLanguage();
  const directions = directionsLink();
  return (
    <div className="relative">
      <ClipReveal duration={0.7} className="rounded-2xl" innerClassName="overflow-hidden rounded-2xl border border-line bg-surface">
        <iframe
          src={src}
          title={t(copy.location.mapTitle)}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className="block h-[360px] w-full border-0 md:h-[480px]"
        />
      </ClipReveal>
      <CardRise className="mt-4 md:absolute md:bottom-6 md:start-6 md:mt-0 md:w-[22rem]">
        <div className="on-dark rounded-2xl bg-primary p-6 shadow-lift sm:p-7">
          <CardText headingLevel="h3" />
          <div className="mt-6 flex flex-col gap-3">
            {directions ? <DirectionsButton href={directions} /> : null}
            <OpenMapButton />
          </div>
        </div>
      </CardRise>
    </div>
  );
}
