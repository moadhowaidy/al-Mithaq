import { copy } from '../data';
import { useLanguage } from '../data/i18n';
import BecomePartner from '../components/partners/BecomePartner';
import PartnerGroups from '../components/partners/PartnerGroups';
import PageHero from '../components/ui/PageHero';
import QuoteBand from '../components/ui/QuoteBand';
import Seo from '../components/ui/Seo';

/**
 * Partners (/:lang/partners): the three partner groups (placeholder tiles until partners are
 * confirmed), the invitation to become a partner, and the quote band.
 */
export default function Partners() {
  const { t } = useLanguage();
  return (
    <>
      <Seo title={copy.seo.partners.title} description={copy.seo.partners.description} />
      <PageHero kicker={t(copy.partnersPage.title)} title={t(copy.partnersPage.heroTitle)} lead={t(copy.partnersPage.heroBody)} />
      <PartnerGroups />
      <BecomePartner />
      <QuoteBand />
    </>
  );
}
