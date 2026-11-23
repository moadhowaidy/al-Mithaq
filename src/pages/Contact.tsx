import { businessJsonLd, copy } from '../data';
import { useLanguage } from '../data/i18n';
import ContactDetails from '../components/contact/ContactDetails';
import LocationMap from '../components/contact/LocationMap';
import QuoteForm from '../components/contact/QuoteForm';
import PageHero from '../components/ui/PageHero';
import Seo from '../components/ui/Seo';

/**
 * Contact: the navy page hero, then on Lane White the contact details (with the site's only
 * WhatsApp button) at the inline start and the quote form (#quote) at the inline end, stacked
 * on phones, and, in its own section below, the head-office location with the map. The only page without a quote band.
 */
export default function Contact() {
  const { t } = useLanguage();
  return (
    <>
      <Seo title={copy.seo.contact.title} description={copy.seo.contact.description} />
      <PageHero kicker={t(copy.pageKickers.contact)} title={t(copy.contactPage.title)} lead={t(copy.contactPage.intro)} />
      <div className="section bg-background">
        <div className="container-site">
          <div className="grid gap-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14 xl:gap-20">
            <ContactDetails />
            <QuoteForm />
          </div>
        </div>
      </div>
      <LocationMap />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd()) }} />
    </>
  );
}
