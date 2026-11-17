import { useParams } from 'react-router';
import { getProduct, productSeo } from '../data';
import ProductDetail from '../components/products/ProductDetail';
import QuoteBand from '../components/ui/QuoteBand';
import Seo from '../components/ui/Seo';
import NotFound from './NotFound';

/** A product page (/:lang/products/:id). An unknown id shows the 404 page. */
export default function ProductPage() {
  const { id } = useParams();
  const product = getProduct(id);
  if (!product) return <NotFound />;
  const seo = productSeo(product);
  return (
    <>
      <Seo title={seo.title} description={seo.description} />
      <ProductDetail key={product.id} product={product} />
      <QuoteBand product={product.id} />
    </>
  );
}
