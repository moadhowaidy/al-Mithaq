// Placeholder: replaced by the Products build (milestone 5).
import { copy } from '../data';
import { useLanguage } from '../data/i18n';
import PageHero from '../components/ui/PageHero';
import QuoteBand from '../components/ui/QuoteBand';
import Seo from '../components/ui/Seo';

export default function Products() {
  const { t } = useLanguage();
  return (
    <>
      <Seo title={copy.seo.products.title} description={copy.seo.products.description} />
      <PageHero kicker={t(copy.pageKickers.products)} title={t(copy.productsPage.title)} lead={t(copy.productsPage.intro)} />
      <div className="h-[60vh]" />
      <QuoteBand />
    </>
  );
}
