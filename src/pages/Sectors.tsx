// Placeholder: replaced by the Sectors build (milestone 5).
import { copy } from '../data';
import { useLanguage } from '../data/i18n';
import PageHero from '../components/ui/PageHero';
import QuoteBand from '../components/ui/QuoteBand';
import Seo from '../components/ui/Seo';

export default function Sectors() {
  const { t } = useLanguage();
  return (
    <>
      <Seo title={copy.seo.sectors.title} description={copy.seo.sectors.description} />
      <PageHero kicker={t(copy.pageKickers.sectors)} title={t(copy.sectorsPage.title)} lead={t(copy.sectorsPage.intro)} />
      <div className="h-[60vh]" />
      <QuoteBand />
    </>
  );
}
