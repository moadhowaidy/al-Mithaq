// Placeholder: replaced by the Home build (milestone 4).
import { copy } from '../data';
import { useLanguage } from '../data/i18n';
import QuoteBand from '../components/ui/QuoteBand';
import Seo from '../components/ui/Seo';

export default function Home() {
  const { t } = useLanguage();
  return (
    <>
      <Seo title={copy.seo.home.title} description={copy.seo.home.description} />
      <section className="on-dark grain bg-primary">
        <div className="container-site py-40">
          <p className="kicker text-accent">{t(copy.home.heroKicker)}</p>
          <h1 className="h1 mt-6 text-background">{t(copy.home.heroTitle)}</h1>
        </div>
      </section>
      <div className="h-[80vh]" />
      <QuoteBand />
    </>
  );
}
