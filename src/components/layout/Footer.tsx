import { Link } from 'react-router';
import { Mail, MapPin, Phone } from 'lucide-react';
import { brand, company, contact, copy, langPath, navItems, sectors, telLink } from '../../data';
import { useLanguage } from '../../data/i18n';
import GatewayBand from '../ui/GatewayBand';
import { bindAmpersand } from '../ui/Typeset';

/**
 * Navy footer with the dark Gateway band along its top edge: the bilingual logo and slogan,
 * three columns (Pages · Sectors · Contact) and the bottom bar. Hours are left out until
 * they are confirmed, and there is no WhatsApp link here (company rule).
 */
export default function Footer() {
  const { lang, t } = useLanguage();
  const logo = brand.footerLogo;

  return (
    <footer className="on-dark relative bg-primary text-background">
      <GatewayBand />
      <div className="container-site grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_1.15fr_1.1fr] lg:gap-10 lg:py-24">
        <div className="md:col-span-2 lg:col-span-1">
          <Link to={langPath(lang)} className="inline-flex min-h-11 items-center rounded-sm">
            <img
              src={logo.src}
              width={logo.width}
              height={logo.height}
              alt={company.name[lang]}
              loading="lazy"
              decoding="async"
              className="h-10 w-auto md:h-12"
            />
          </Link>
          <p className="kicker mt-8 text-accent">{t(company.slogan)}</p>
        </div>

        <nav aria-label={t(copy.a11y.footerNav)}>
          <h2 className="kicker text-steel">{t(copy.footer.pages)}</h2>
          <ul className="mt-6 space-y-1">
            {navItems.map((item) => (
              <li key={item.key}>
                <Link to={langPath(lang, item.path)} className="inline-flex min-h-11 min-w-11 items-center">
                  <span className="link-draw">{t(copy.nav[item.key])}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="kicker text-steel">{t(copy.footer.sectors)}</h2>
          <ul className="mt-6 space-y-1">
            {sectors.map((sector) => (
              <li key={sector.id}>
                <Link to={`${langPath(lang, '/sectors')}#${sector.id}`} className="inline-flex min-h-11 min-w-11 items-center py-1.5">
                  <span className="link-draw leading-snug">{bindAmpersand(t(sector.name))}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="kicker text-steel">{t(copy.footer.contact)}</h2>
          <ul className="mt-6 space-y-1">
            {contact.phones.map((phone) => (
              <li key={phone.tel}>
                <a href={telLink(phone)} className="inline-flex min-h-11 items-center gap-3">
                  <Phone aria-hidden="true" className="h-[18px] w-[18px] shrink-0 text-accent" strokeWidth={1.5} />
                  <span className="sr-only">{t(phone.label)}: </span>
                  <span dir="ltr" className="link-draw">
                    {phone.display}
                  </span>
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${contact.email}`} className="inline-flex min-h-11 items-center gap-3">
                <Mail aria-hidden="true" className="h-[18px] w-[18px] shrink-0 text-accent" strokeWidth={1.5} />
                <span className="sr-only">{t(copy.contactPage.labels.email)}: </span>
                <span dir="ltr" className="link-draw">
                  {contact.email}
                </span>
              </a>
            </li>
            <li className="flex min-h-11 items-start gap-3 pt-2.5 text-background">
              <MapPin aria-hidden="true" className="mt-1 h-[18px] w-[18px] shrink-0 text-accent" strokeWidth={1.5} />
              <span>{t(copy.footer.headOffice)}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-steel/30">
        <div className="container-site flex flex-col gap-2 py-6 text-sm text-steel md:flex-row md:items-center md:justify-between">
          <p>{t(copy.footer.rights)}</p>
          <p dir="ltr" className="font-num tracking-wide">
            {company.domain}
          </p>
        </div>
      </div>
    </footer>
  );
}
