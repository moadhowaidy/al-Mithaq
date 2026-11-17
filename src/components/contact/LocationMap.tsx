import { m } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { contact, copy, cx, mapEmbed } from '../../data';
import { useLanguage } from '../../data/i18n';
import Button from '../ui/Button';
import GatewayMark from '../ui/GatewayMark';
import { ClipReveal, Reveal, useSwitchHeading } from '../ui/Reveal';

/**
 * The head office, full width with a 16 px radius. Once contact.map.lat and lng are set, the
 * Google map is embedded with a floating card; until then a navy map card shows the Gateway
 * mark, "Al-Khums, Libya" and the "Open in Google Maps" button (always contact.map.link).
 */
export default function LocationMap({ className }: { className?: string }) {
  const { lang } = useLanguage();
  const embed = mapEmbed(lang);
  return embed ? <MapEmbed src={embed} className={className} /> : <MapCard className={className} />;
}

function MapButton({ variant }: { variant: 'outline-light' | 'outline-dark' }) {
  const { t } = useLanguage();
  return (
    <Button external href={contact.map.link} variant={variant} icon={MapPin}>
      {t(copy.contactPage.openMap)}
    </Button>
  );
}

/** Until the coordinates are confirmed: a navy panel with the Gateway mark at the centre of hairline rings. */
function MapCard({ className }: { className?: string }) {
  const { t } = useLanguage();
  const switchHeading = useSwitchHeading(4);
  const { street } = contact.headOffice;

  return (
    <section aria-labelledby="location-title" className={className}>
      <Reveal>
        <div className="on-dark grain relative overflow-hidden rounded-2xl bg-primary">
          {/* 420 px on desktop, the height of the embedded map, so the layout is final either way. */}
          <div className="grid lg:min-h-[420px] lg:grid-cols-2">
            <div className="relative order-last px-6 pb-12 pt-2 sm:px-10 sm:pb-14 lg:order-first lg:flex lg:flex-col lg:justify-center lg:px-16 lg:py-16">
              <h2 id="location-title" className="kicker text-accent">
                {t(copy.contactPage.mapTitle)}
              </h2>
              <span aria-hidden="true" className="mt-4 block h-px w-12 bg-accent" />
              <m.p className="h2 mt-6 text-background" {...switchHeading}>
                {t(contact.headOffice.value)}
              </m.p>
              {street ? <p className="lead mt-3 text-steel">{t(street)}</p> : null}
              <div className="mt-10">
                <MapButton variant="outline-light" />
              </div>
            </div>
            <MapVisual />
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/**
 * Decorative: dusk glow, hairline rings and a crosshair around the Gateway mark (never mirrored).
 * A radial mask lets the rings dissolve into the navy instead of stopping at a hard edge.
 * The runway-light loop rests by itself while the card is off screen (GateDashes) and never
 * runs under reduced motion.
 */
function MapVisual() {
  return (
    <div
      aria-hidden="true"
      className="relative h-60 overflow-hidden [mask-image:radial-gradient(closest-side,#000_55%,transparent)] sm:h-72 lg:h-auto"
    >
      <div
        className="absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full dusk-glow"
      />
      <div className="absolute inset-x-0 top-1/2 h-px bg-steel/15" />
      <div className="absolute inset-y-0 left-1/2 w-px bg-steel/15" />
      {[9, 16, 24, 33].map((size) => (
        <div
          key={size}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-steel/30"
          style={{ width: `${size}rem`, height: `${size}rem` }}
        />
      ))}
      <GatewayMark
        tone="light"
        dashes="lit"
        className="absolute left-1/2 top-1/2 w-20 -translate-x-1/2 -translate-y-1/2 sm:w-24 lg:w-28"
      />
    </div>
  );
}

/** With confirmed coordinates: the embedded Google map and a floating card. */
function MapEmbed({ src, className }: { src: string; className?: string }) {
  const { t } = useLanguage();
  const { street } = contact.headOffice;
  return (
    <section aria-labelledby="location-title" className={cx('relative', className)}>
      <ClipReveal className="overflow-hidden rounded-2xl border border-line bg-surface">
        <iframe
          src={src}
          title={t(copy.contactPage.mapTitle)}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className="block h-[420px] w-full rounded-2xl border-0"
        />
      </ClipReveal>
      <Reveal className="relative z-10 mx-4 -mt-20 sm:mx-6 md:absolute md:bottom-6 md:start-6 md:mx-0 md:mt-0 md:w-[24rem]">
        <div className="card p-6 shadow-lift sm:p-7">
          <h2 id="location-title" className="kicker text-muted">
            {t(copy.contactPage.labels.headOffice)}
          </h2>
          <p className="h3 mt-2">{t(contact.headOffice.value)}</p>
          {street ? <p className="mt-1 text-muted">{t(street)}</p> : null}
          <div className="mt-6">
            <MapButton variant="outline-dark" />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
