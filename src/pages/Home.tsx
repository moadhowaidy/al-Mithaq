import { copy } from '../data';
import FeaturedProduct from '../components/home/FeaturedProduct';
import Hero from '../components/home/Hero';
import PartnersTeaser from '../components/home/PartnersTeaser';
import Pledge from '../components/home/Pledge';
import SectorsStrip from '../components/home/SectorsStrip';
import QuoteBand from '../components/ui/QuoteBand';
import Seo from '../components/ui/Seo';

/**
 * Home (/ar, /en): the navy hero with the Gateway window, then the four numbered sections
 * (01 sectors · 02 featured product · 03 the pledge · 04 partners) and the quote band.
 */
export default function Home() {
  return (
    <>
      <Seo title={copy.seo.home.title} description={copy.seo.home.description} />
      <Hero />
      <SectorsStrip />
      <FeaturedProduct />
      <Pledge />
      <PartnersTeaser />
      <QuoteBand />
    </>
  );
}
