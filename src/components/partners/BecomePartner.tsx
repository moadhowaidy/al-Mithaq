import { m } from 'framer-motion';
import { Mail } from 'lucide-react';
import { copy, mailtoLink } from '../../data';
import { useLanguage } from '../../data/i18n';
import Button from '../ui/Button';
import { GATE, GATE_VIEWBOX } from '../ui/GatewayMark';
import { Reveal, RevealGroup, RevealItem, useSwitchHeading } from '../ui/Reveal';

/** "Question? Invitation." → [question, invitation]; text without a question mark stays whole. */
function splitQuestion(text: string): [string, string | null] {
  const match = /^(.*?[?؟])\s+(.+)$/.exec(text);
  return match ? [match[1], match[2]] : [text, null];
}

/**
 * Become a partner: a white panel on Lane White with the invitation for manufacturers and
 * suppliers, and a button that opens an email to the company with the subject "Partnership enquiry".
 */
export default function BecomePartner() {
  const { t } = useLanguage();
  const switchHeading = useSwitchHeading(4);
  const [question, invitation] = splitQuestion(t(copy.partnersPage.becomeBody));
  return (
    <section aria-labelledby="become-partner-title" className="bg-background pb-20 lg:pb-32">
      <div className="container-site">
        <Reveal className="card relative isolate overflow-hidden">
          {/* The gate of the logo in Lane White, rising from the panel's lower edge at the inline end:
              tone on tone, like the light Gateway band. Shown only where it clears the text. Decorative. */}
          <svg
            viewBox={GATE_VIEWBOX}
            aria-hidden="true"
            focusable="false"
            className="pointer-events-none absolute -z-10 hidden lg:-bottom-16 lg:end-8 lg:block lg:w-60 xl:-bottom-20 xl:end-24 xl:w-80"
          >
            <polygon points={GATE} className="fill-background" />
          </svg>
          <RevealGroup className="px-6 py-12 sm:px-10 md:max-w-[38rem] md:px-14 md:py-16 lg:max-w-[46rem] lg:px-20 lg:py-20">
            <RevealItem>
              <span aria-hidden="true" className="block h-1.5 w-10 rounded-full bg-accent" />
            </RevealItem>
            <RevealItem>
              <m.h2 id="become-partner-title" className="h2 mt-8 text-primary" {...switchHeading}>
                {t(copy.partnersPage.becomeTitle)}
              </m.h2>
            </RevealItem>
            {/* From 768 px the invitation starts its own line, so it never trails as "Get / in touch.";
                on phones the two sentences simply flow on. */}
            <RevealItem as="p" className="lead mt-5 max-w-text text-pretty text-muted">
              {question}
              {invitation ? (
                <>
                  {' '}
                  <br className="hidden md:inline" />
                  {invitation}
                </>
              ) : null}
            </RevealItem>
            <RevealItem className="mt-10">
              <Button href={mailtoLink(t(copy.emailSubjects.partner))} icon={Mail}>
                {t(copy.partnersPage.becomeButton)}
              </Button>
            </RevealItem>
          </RevealGroup>
        </Reveal>
      </div>
    </section>
  );
}
