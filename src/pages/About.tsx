// Placeholder: replaced by the About build (milestone 6).
import { copy } from '../data';
import { useLanguage } from '../data/i18n';
import PageHero from '../components/ui/PageHero';
import QuoteBand from '../components/ui/QuoteBand';
import Seo from '../components/ui/Seo';

export default function About() {
  const { t } = useLanguage();
  return (
    <>
      <Seo title={copy.seo.about.title} description={copy.seo.about.description} />
      <PageHero kicker={t(copy.aboutPage.title)} title={t(copy.aboutPage.heroTitle)} lead={t(copy.slogan)} />
      <div className="h-[60vh]" />
      <QuoteBand />
    </>
  );
}
