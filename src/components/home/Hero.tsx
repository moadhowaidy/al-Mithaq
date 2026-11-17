import { useId, useRef } from 'react';
import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { brand, copy, cx, langPath, quoteHref } from '../../data';
import { useLanguage, useMountedBySwitch } from '../../data/i18n';
import Button from '../ui/Button';
import GatewayBand from '../ui/GatewayBand';
import { GATE, GATE_VIEWBOX, GateDashes } from '../ui/GatewayMark';
import { EASE_OUT, useEntrance } from '../ui/Reveal';

/** The window rises out of the road first (seconds)… */
const WINDOW_DELAY = 0.1;
const WINDOW_DURATION = 0.9;
/** …and the text follows once the calm ease has opened most of it. */
const TEXT_DELAY = 0.55;
/**
 * Largest drift of the road picture inside the window, in viewBox units. The window is never
 * drawn larger than its 700-unit viewBox, so on screen the drift stays under 24 px.
 */
const DRIFT = 24;

/**
 * The road picture covers the 700 × 630 window plus the drift above it. Browsers draw an SVG
 * referenced by <image> with its own "meet" fitting (they ignore "slice" there), so the cover box
 * is computed here with the picture's exact ratio: the horizon then sits in the bridge of the M.
 */
const ROAD_SCALE = Math.max(700 / brand.heroRoad.width, (630 + DRIFT) / brand.heroRoad.height);
const ROAD = {
  width: brand.heroRoad.width * ROAD_SCALE,
  height: brand.heroRoad.height * ROAD_SCALE,
  x: (700 - brand.heroRoad.width * ROAD_SCALE) / 2,
  y: -DRIFT + (630 + DRIFT - brand.heroRoad.height * ROAD_SCALE) / 2,
};

/**
 * Home hero (navy page opening): the text on the inline-start side and the Gateway window on the
 * inline-end side (on phones the window comes first, 300 px tall). The window is the logo's M used
 * as a clip path over the dusk road, so the horizon and the sun sit in the bridge of the M; the five
 * gold dashes run up the road under it like runway lights. A soft dusk glow sits behind it.
 */
export default function Hero() {
  const { lang, t } = useLanguage();
  const reduce = useReducedMotion();
  const mountedBySwitch = useMountedBySwitch();
  const entrance = useEntrance(reduce ? 0.1 : TEXT_DELAY);
  const section = useRef<HTMLElement>(null);
  const reactId = useId();
  const clipId = `hero-gate-${reactId.replace(/[^\w-]/g, '')}`;

  // Parallax: the road drifts down inside the fixed window as the hero scrolls away.
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end start'] });
  const drift = useTransform(scrollYProgress, [0, 1], [0, DRIFT]);

  // Opened by a language switch, or with reduced motion: no window reveal (the <main> wrapper enters).
  const playIntro = !reduce && !mountedBySwitch;

  return (
    <section
      ref={section}
      aria-labelledby="home-hero-title"
      className="on-dark grain relative flex min-h-[640px] flex-col overflow-hidden bg-primary lg:min-h-[clamp(640px,calc(100svh_-_5rem),62rem)]"
    >
      <div className="container-site relative grid flex-1 content-center items-center gap-10 pb-28 pt-8 md:gap-14 md:pt-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16 lg:pb-32 lg:pt-16">
        <div className="relative">
          <m.p className="kicker text-accent" {...entrance(0)}>
            {t(copy.home.heroKicker)}
          </m.p>
          <m.span aria-hidden="true" className="mt-4 block h-px w-12 bg-accent" {...entrance(1)} />
          <m.h1 id="home-hero-title" className="h1 mt-6 text-background" {...entrance(1, 'heading')}>
            {t(copy.home.heroTitle)}
          </m.h1>
          <m.p
            className={cx(
              'mt-6 text-background',
              lang === 'ar' ? 'text-xl font-bold leading-[1.7] md:text-[1.375rem]' : 'text-[1.375rem] font-medium leading-snug md:text-2xl',
            )}
            {...entrance(2)}
          >
            {t(copy.home.heroSubtitle)}
          </m.p>
          <m.p className="mt-4 max-w-[34rem] text-pretty text-steel" {...entrance(3)}>
            {t(copy.home.heroBody)}
          </m.p>
          <m.div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap" {...entrance(4)}>
            <Button to={quoteHref(lang)} arrow className="w-full sm:w-auto">
              {t(copy.cta.quote)}
            </Button>
            <Button to={langPath(lang, '/products')} variant="outline-light" className="w-full sm:w-auto">
              {t(copy.cta.browse)}
            </Button>
          </m.div>
        </div>

        <div className="order-first lg:order-none">
          <div className="relative mx-auto w-[333px] max-w-full md:w-[400px] lg:me-0 lg:ms-auto lg:w-full lg:max-w-[560px]">
            {/* Dusk glow: radial gold at 12 % behind the window. */}
            <m.div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-[22%]"
              style={{ background: 'radial-gradient(closest-side, rgb(234 166 32 / 0.12), transparent)' }}
              {...(playIntro
                ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: WINDOW_DELAY + 0.2, duration: 1.4, ease: EASE_OUT } }
                : {})}
            />
            {/* The window reveals upward: the clip opens from the bottom edge to the full height. */}
            <m.div
              className="relative aspect-[700/630] w-full"
              {...(playIntro
                ? {
                    initial: { clipPath: 'inset(100% 0% 0% 0%)' },
                    animate: { clipPath: 'inset(0% 0% 0% 0%)' },
                    transition: { delay: WINDOW_DELAY, duration: WINDOW_DURATION, ease: EASE_OUT },
                  }
                : {})}
            >
              {/* Never mirrored in RTL: the Gateway geometry is the logo's own. */}
              <svg viewBox={GATE_VIEWBOX} className="block h-full w-full" aria-hidden="true" focusable="false">
                <defs>
                  <clipPath id={clipId}>
                    <polygon points={GATE} />
                  </clipPath>
                </defs>
                <g clipPath={`url(#${clipId})`}>
                  {/* Oversized by the drift above the window, so its edges never show while it moves. */}
                  <m.g style={reduce ? undefined : { y: drift }}>
                    <image
                      href={brand.heroRoad.src}
                      x={ROAD.x}
                      y={ROAD.y}
                      width={ROAD.width}
                      height={ROAD.height}
                      preserveAspectRatio="xMidYMid slice"
                    />
                  </m.g>
                </g>
                {/* A 1 px hairline keeps the gate's edges crisp where the night sky meets the navy ground. */}
                <polygon
                  points={GATE}
                  fill="none"
                  strokeWidth={1}
                  vectorEffect="non-scaling-stroke"
                  className="stroke-steel/30"
                />
                {/* The dashes sit in the road under the M (empty space in the logo), outside the clip.
                    The loop rests by itself off screen and turns static with reduced motion. */}
                <GateDashes mode="loop" />
              </svg>
            </m.div>
          </div>
        </div>
      </div>
      <GatewayBand className="absolute inset-x-0 bottom-0" />
    </section>
  );
}
