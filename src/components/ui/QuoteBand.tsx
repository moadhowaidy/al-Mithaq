import { m } from 'framer-motion';
import { copy, quoteHref } from '../../data';
import { useLanguage } from '../../data/i18n';
import Button from './Button';
import { LaneDashes } from './GatewayBand';
import { Reveal, RevealGroup, RevealItem, useSwitchHeading } from './Reveal';

interface QuoteBandProps {
  /** Pre-fill the quote form with this product (product pages). */
  product?: string;
  /** Pre-fill the quote form with this sector. */
  sector?: string;
}

/**
 * The last section before the footer on every page except Contact: a navy band whose
 * inline-start edge is cut at the logo's 50° road angle, with the quote button.
 */
export default function QuoteBand({ product, sector }: QuoteBandProps) {
  const { lang, t } = useLanguage();
  const switchHeading = useSwitchHeading(6);
  return (
    <section aria-labelledby="quote-band-title" className="bg-background">
      <div className="quote-band on-dark grain relative overflow-hidden bg-primary">
        <div className="container-site relative grid items-center gap-10 py-20 lg:grid-cols-[1fr_auto] lg:gap-16 lg:py-28">
          <RevealGroup>
            <RevealItem>
              <LaneDashes className="mb-8 w-[184px]" />
            </RevealItem>
            <RevealItem>
              <m.h2 id="quote-band-title" className="h2 max-w-[22ch] text-background" {...switchHeading}>
                {t(copy.quoteBand.title)}
              </m.h2>
            </RevealItem>
            <RevealItem as="p" className="lead mt-5 max-w-text text-steel">
              {t(copy.quoteBand.body)}
            </RevealItem>
          </RevealGroup>
          <Reveal delay={0.24}>
            <Button to={quoteHref(lang, { product, sector })} arrow>
              {t(copy.cta.quote)}
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
