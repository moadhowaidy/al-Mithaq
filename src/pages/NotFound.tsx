import { m } from 'framer-motion';
import { copy, langPath } from '../data';
import { useLanguage } from '../data/i18n';
import Button from '../components/ui/Button';
import GatewayMark from '../components/ui/GatewayMark';
import Seo from '../components/ui/Seo';
import { useEntrance } from '../components/ui/Reveal';

/**
 * 404: on navy, the Gateway mark, "This road doesn't lead to a page." and a way back home.
 * No quote band here, and no band of its own: the footer's Gateway band follows directly.
 */
export default function NotFound() {
  const { lang, t } = useLanguage();
  const entrance = useEntrance();
  return (
    <>
      <Seo title={copy.seo.notFound.title} description={copy.seo.notFound.description} noindex />
      <section className="on-dark grain relative flex min-h-[calc(100svh-5rem)] items-center overflow-hidden bg-primary">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: 'radial-gradient(closest-side, rgb(234 166 32 / 0.12), transparent)' }}
        />
        <div className="container-site relative flex flex-col items-center py-24 text-center">
          <m.div {...entrance(0)}>
            <GatewayMark tone="light" dashes="loop" className="w-28 md:w-36" />
          </m.div>
          <m.p className="kicker mt-10 text-accent" {...entrance(1)}>
            {t(copy.notFound.kicker)}
          </m.p>
          <m.h1 className="h2 mt-5 max-w-[22ch] text-background" {...entrance(2, 'heading')}>
            {t(copy.notFound.title)}
          </m.h1>
          <m.div className="mt-10" {...entrance(3)}>
            <Button to={langPath(lang)} variant="outline-light" arrow>
              {t(copy.cta.backHome)}
            </Button>
          </m.div>
        </div>
      </section>
    </>
  );
}
