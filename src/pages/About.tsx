import { copy } from '../data';
import { useLanguage } from '../data/i18n';
import NameStory, { LogoStory, WhatWeDo } from '../components/about/NameStory';
import Values, { CompanyFacts } from '../components/about/Values';
import PageHero from '../components/ui/PageHero';
import QuoteBand from '../components/ui/QuoteBand';
import Seo from '../components/ui/Seo';

/**
 * About (/:lang/about): "Our name is our promise". After the navy opening, the Lane White
 * sections follow one another, divided by hairlines: the meaning of the name, what we do,
 * our values and the story behind the logo. Company facts appear only once they are confirmed.
 */
export default function About() {
  const { t } = useLanguage();
  return (
    <>
      <Seo title={copy.seo.about.title} description={copy.seo.about.description} />
      <PageHero kicker={t(copy.aboutPage.title)} title={t(copy.aboutPage.heroTitle)} lead={t(copy.slogan)} />
      <NameStory />
      <WhatWeDo />
      <Values />
      <LogoStory />
      <CompanyFacts />
      <QuoteBand />
    </>
  );
}
