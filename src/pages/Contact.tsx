// Placeholder: replaced by the Contact build (milestone 6).
import { copy } from '../data';
import { useLanguage } from '../data/i18n';
import PageHero from '../components/ui/PageHero';
import Seo from '../components/ui/Seo';

export default function Contact() {
  const { t } = useLanguage();
  return (
    <>
      <Seo title={copy.seo.contact.title} description={copy.seo.contact.description} />
      <PageHero kicker={t(copy.pageKickers.contact)} title={t(copy.contactPage.title)} lead={t(copy.contactPage.intro)} />
      <section className="section">
        <div id="quote" className="container-site h-[70vh]">
          <h2 className="h2">{t(copy.form.title)}</h2>
        </div>
      </section>
    </>
  );
}
