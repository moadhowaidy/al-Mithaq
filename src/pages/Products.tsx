import { copy } from '../data';
import { useLanguage } from '../data/i18n';
import ProductGrid from '../components/products/ProductGrid';
import PageHero from '../components/ui/PageHero';
import QuoteBand from '../components/ui/QuoteBand';
import Seo from '../components/ui/Seo';

/** Products (/:lang/products, filtered with ?sector=<id>): the page hero, the filter and cards, and the quote band. */
export default function Products() {
  const { t } = useLanguage();
  return (
    <>
      <Seo title={copy.seo.products.title} description={copy.seo.products.description} />
      <PageHero kicker={t(copy.pageKickers.products)} title={t(copy.productsPage.title)} lead={t(copy.productsPage.intro)} />
      <ProductGrid />
      <QuoteBand />
    </>
  );
}
