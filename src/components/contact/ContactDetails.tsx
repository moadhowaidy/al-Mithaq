import type { ReactNode } from 'react';
import { m } from 'framer-motion';
import { Clock, ExternalLink, Mail, MapPin, MessageCircle, Phone, type LucideIcon } from 'lucide-react';
import { contact, copy, cx, telLink, whatsappLink } from '../../data';
import { useLanguage } from '../../data/i18n';
import Button from '../ui/Button';
import { RevealGroup, RevealItem, useSwitchHeading } from '../ui/Reveal';

/** The value line of a row: 18 px on phones, 20 px from 640 px, at least 44 px tall. */
const VALUE = 'flex min-h-11 items-center text-lg font-medium leading-normal sm:text-xl';

interface DetailRowProps {
  icon: LucideIcon;
  label: string;
  children: ReactNode;
  /** A button or link under the value. */
  action?: ReactNode;
  /**
   * The lead row (WhatsApp Business): its button spans the whole row on phones, and on tablets,
   * where the list runs in two columns, the row spans both with the button at its inline end.
   */
  lead?: boolean;
}

/** One line of the list: icon in a hairline circle, label, value, and an optional action. */
function DetailRow({ icon: Icon, label, children, action, lead = false }: DetailRowProps) {
  return (
    <RevealItem
      as="li"
      className={cx(
        'grid grid-cols-[auto_minmax(0,1fr)] content-start items-center gap-x-5 border-b border-line py-6 sm:gap-x-6 lg:py-7',
        lead && 'md:col-span-2 md:max-lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:col-span-1',
      )}
    >
      <span aria-hidden="true" className="grid h-12 w-12 place-items-center rounded-full border border-line bg-surface">
        <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.5} />
      </span>
      <div className="min-w-0">
        <h3 className="kicker text-muted">{label}</h3>
        <div className="mt-0.5">{children}</div>
      </div>
      {action ? (
        <div
          className={
            lead
              ? 'col-span-2 mt-5 sm:col-span-1 sm:col-start-2 md:max-lg:col-start-3 md:max-lg:row-start-1 md:max-lg:mt-0'
              : 'col-start-2'
          }
        >
          {action}
        </div>
      ) : null}
    </RevealItem>
  );
}

/**
 * Contact details, separated by hairlines: WhatsApp Business (with the site's only WhatsApp
 * button, a company rule), phone, email, head office with its Google Maps link, and hours
 * ("To be added" until they are confirmed).
 */
export default function ContactDetails() {
  const { t } = useLanguage();
  const switchHeading = useSwitchHeading(2);
  const { street } = contact.headOffice;

  return (
    <section aria-labelledby="contact-details-title" className="lg:pt-10 xl:pt-12">
      <RevealGroup>
        <RevealItem>
          <m.h2 id="contact-details-title" className="h2" {...switchHeading}>
            {t(copy.contactPage.detailsTitle)}
          </m.h2>
        </RevealItem>

        <ul role="list" className="mt-8 grid border-t border-line md:grid-cols-2 md:gap-x-12 lg:mt-10 lg:grid-cols-1 lg:gap-x-0">
          <DetailRow
            icon={MessageCircle}
            label={t(copy.contactPage.labels.whatsappBusiness)}
            lead
            action={
              <Button
                external
                href={whatsappLink(t(copy.whatsappMessages.general))}
                icon={MessageCircle}
                className="w-full sm:w-auto"
              >
                {t(copy.contactPage.whatsappButton)}
              </Button>
            }
          >
            <p className={cx(VALUE, 'font-num')}>
              <span dir="ltr">{contact.whatsappBusiness.display}</span>
            </p>
          </DetailRow>

          <DetailRow icon={Phone} label={t(copy.contactPage.labels.phone)}>
            {contact.phones.map((phone) => (
              <p key={phone.tel} className={cx(VALUE, 'font-num')}>
                <a href={telLink(phone)} className="inline-flex min-h-11 items-center">
                  <span dir="ltr" className="link-draw">
                    {phone.display}
                  </span>
                </a>
              </p>
            ))}
          </DetailRow>

          <DetailRow icon={Mail} label={t(copy.contactPage.labels.email)}>
            <p className={cx(VALUE, 'font-latin')}>
              <a href={`mailto:${contact.email}`} className="inline-flex min-h-11 items-center">
                <span dir="ltr" className="link-draw">
                  {contact.email}
                </span>
              </a>
            </p>
          </DetailRow>

          <DetailRow
            icon={MapPin}
            label={t(copy.contactPage.labels.headOffice)}
            action={
              <a
                href={contact.map.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 text-[15px] font-medium"
              >
                <span className="link-inline">{t(copy.contactPage.openMap)}</span>
                <ExternalLink aria-hidden="true" className="h-4 w-4 shrink-0 rtl:-scale-x-100" strokeWidth={1.5} />
                <span className="sr-only"> {t(copy.a11y.newTab)}</span>
              </a>
            }
          >
            {street ? <p className={VALUE}>{t(street)}</p> : null}
            <p className={VALUE}>{t(contact.headOffice.value)}</p>
          </DetailRow>

          <DetailRow icon={Clock} label={t(copy.contactPage.labels.hours)}>
            <p className={cx(VALUE, !contact.hours && 'text-muted')}>
              {contact.hours ? t(contact.hours) : t(copy.contactPage.toBeAdded)}
            </p>
          </DetailRow>
        </ul>
      </RevealGroup>
    </section>
  );
}
