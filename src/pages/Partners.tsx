// Placeholder: replaced by the Partners build (milestone 6).
import { copy } from '../data';
import { useLanguage } from '../data/i18n';
import PageHero from '../components/ui/PageHero';
import QuoteBand from '../components/ui/QuoteBand';
import Seo from '../components/ui/Seo';

export default function Partners() {
  const { t } = useLanguage();
  return (
    <>
      <Seo title={copy.seo.partners.title} description={copy.seo.partners.description} />
      <PageHero kicker={t(copy.partnersPage.title)} title={t(copy.partnersPage.heroTitle)} lead={t(copy.partnersPage.heroBody)} />
      <div className="h-[60vh]" />
      <QuoteBand />
    </>
  );
}
