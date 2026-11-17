import { copy } from '../data';
import { useLanguage } from '../data/i18n';
import SectorBlocks from '../components/sectors/SectorBlocks';
import PageHero from '../components/ui/PageHero';
import QuoteBand from '../components/ui/QuoteBand';
import Seo from '../components/ui/Seo';

/** Sectors (/:lang/sectors): the page hero, the eight sector blocks (each with its own #anchor) and the quote band. */
export default function Sectors() {
  const { t } = useLanguage();
  return (
    <>
      <Seo title={copy.seo.sectors.title} description={copy.seo.sectors.description} />
      <PageHero kicker={t(copy.pageKickers.sectors)} title={t(copy.sectorsPage.title)} lead={t(copy.sectorsPage.intro)} />
      <SectorBlocks />
      <QuoteBand />
    </>
  );
}
