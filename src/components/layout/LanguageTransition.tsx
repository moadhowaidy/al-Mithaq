import { m } from 'framer-motion';
import { copy, cx } from '../../data';
import { useLanguageTransition } from '../../data/i18n';
import { GATE, GATE_VIEWBOX, GateDashes } from '../ui/GatewayMark';

const SWEEP_EASE = [0.76, 0, 0.24, 1] as const;
const LANE_DASH_STRIP = 'repeating-linear-gradient(to bottom, #EAA620 0 40px, transparent 40px 76px)';

/**
 * "Through the Gateway": a navy panel with gold edges sweeps across the screen in the reading
 * direction of the language being opened (→ English, ← Arabic). Its edges lean at the logo's
 * 50° road angle (skewX ±40°). While the screen is covered, the Gateway mark shows the new
 * language's name and its lane dashes light up; underneath, the page swaps language.
 *
 * Physical left/right are used on purpose: the document direction flips mid-animation.
 * Not rendered with reduced motion (the main content crossfades instead).
 *
 * The reveal starts only once the new page has committed, and the overlay stays until the panel
 * has left the screen (onAnimationComplete ends the switch). The panel animates a transform
 * string, which the browser can run off the main thread while the new page settles.
 */
export default function LanguageTransition() {
  const { phase, target, reducedSwitch, finishSwitch } = useLanguageTransition();
  if (phase === 'idle' || !target || reducedSwitch) return null;

  const toEnglish = target === 'en';
  const revealing = phase === 'revealing';
  const covered = phase === 'swapping' || revealing;
  const skew = `skewX(${toEnglish ? -40 : 40}deg)`;
  const enter = toEnglish ? '-100%' : '100%';
  const exit = toEnglish ? '100%' : '-100%';

  return (
    <div aria-hidden="true" className="fixed inset-0 z-[100] overflow-hidden">
      <m.div
        className="absolute inset-y-0 bg-primary will-change-transform"
        style={{ left: '-50vh', width: 'calc(100vw + 100vh)' }}
        initial={{ transform: `translateX(${enter}) ${skew}` }}
        animate={{ transform: `translateX(${revealing ? exit : '0%'}) ${skew}` }}
        transition={{ duration: 0.3, ease: SWEEP_EASE }}
        onAnimationComplete={() => {
          if (revealing) finishSwitch();
        }}
      >
        {/* Both edges: an 8 px gold strip and, 24 px inside it, a 6 px strip of lane dashes. */}
        <span className="absolute inset-y-0 left-0 w-2 bg-accent" />
        <span className="absolute inset-y-0 left-8 w-1.5" style={{ background: LANE_DASH_STRIP }} />
        <span className="absolute inset-y-0 right-0 w-2 bg-accent" />
        <span className="absolute inset-y-0 right-8 w-1.5" style={{ background: LANE_DASH_STRIP }} />
      </m.div>

      {/* Unskewed centre layer: the mark and the new language's name. */}
      <m.div
        className="absolute inset-0 flex flex-col items-center justify-center gap-6"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={revealing ? { opacity: 0, scale: 1 } : { opacity: 1, scale: 1 }}
        transition={revealing ? { duration: 0.1, ease: 'easeOut' } : { delay: 0.2, duration: 0.12, ease: 'easeOut' }}
      >
        <svg viewBox={GATE_VIEWBOX} className="block w-28" focusable="false">
          <polygon points={GATE} className="fill-background" />
          <GateDashes mode={covered ? 'lit' : 'dim'} />
        </svg>
        <span
          lang={target}
          className={cx(
            'text-background',
            toEnglish
              ? 'font-label text-sm font-semibold uppercase tracking-[0.3em]'
              : 'font-arabic text-lg font-extrabold',
          )}
        >
          {copy.toggle.overlayName[target]}
        </span>
      </m.div>
    </div>
  );
}
