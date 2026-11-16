// Placeholder: replaced by the product page build (milestone 5).
import { useParams } from 'react-router';
import { copy, getProduct, getSector, productSeo } from '../data';
import { useLanguage } from '../data/i18n';
import PageHero from '../components/ui/PageHero';
import QuoteBand from '../components/ui/QuoteBand';
import Seo from '../components/ui/Seo';
import NotFound from './NotFound';

export default function ProductPage() {
  const { id } = useParams();
  const { t } = useLanguage();
  const product = getProduct(id);
  if (!product) return <NotFound />;
  const seo = productSeo(product);
  const sector = getSector(product.sector);
  return (
    <>
      <Seo title={seo.title} description={seo.description} />
      <PageHero kicker={sector ? t(sector.name) : t(copy.nav.products)} title={t(product.name)} lead={t(product.summary)} />
      <div className="h-[60vh]" />
      <QuoteBand product={product.id} />
    </>
  );
}
