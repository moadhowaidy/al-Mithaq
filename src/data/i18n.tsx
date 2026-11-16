/**
 * Language context: current language and direction, t(), and the state machine of the
 * "Through the Gateway" switch (idle → covering → swapping → revealing → idle).
 *
 * Two contexts live here, so a running switch never re-renders the whole page mid-sweep:
 * - useLanguage(): lang, dir, t(), switchLanguage() … (changes only when the language does)
 * - useLanguageTransition(): phase, target … (changes four times per switch; only the overlay,
 *   the toggle and the <main> wrapper read it)
 *
 * The language always comes from the address (/ar/... or /en/...). The toggle saves the
 * visitor's choice under `mithaq-lang`; opening "/" uses it (see preferredLang()).
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useLocation, useNavigate, useNavigationType } from 'react-router';
import {
  DEFAULT_LANG,
  LANG_STORAGE_KEY,
  brand,
  dirOf,
  isLang,
  otherLang,
  swapLangInPath,
  type Dir,
  type Lang,
  type Localized,
} from './index';
import { copy } from './translations';

export type TransitionPhase = 'idle' | 'covering' | 'swapping' | 'revealing';
/** How the <main> wrapper enters after the latest swap. */
export type EntranceMode = 'none' | 'sweep' | 'fade';

/** Timeline of the switch in milliseconds (docs/BUILD_PROMPT.md, <language_transition>). */
export const SWITCH_MS = { swap: 320, reveal: 420, end: 720 } as const;
/** Reduced motion: a 200 ms crossfade with the swap at its midpoint. */
export const REDUCED_SWITCH_MS = { swap: 100, end: 200 } as const;
/** In-view reveals show at once for this long after the switch ends (the main wrapper did the entrance). */
const SETTLE_MS = 400;

export const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export function langFromPath(pathname: string): Lang | null {
  const segment = pathname.split('/')[1];
  return isLang(segment) ? segment : null;
}

function savedLang(): Lang | null {
  try {
    const saved = window.localStorage.getItem(LANG_STORAGE_KEY);
    return isLang(saved) ? saved : null;
  } catch {
    return null; // storage unavailable (private mode)
  }
}

/** Saved choice, then the browser language (ar* → Arabic, en* → English), then Arabic. Browser only. */
export function preferredLang(): Lang {
  if (typeof window === 'undefined') return DEFAULT_LANG;
  const saved = savedLang();
  if (saved) return saved;
  const list = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const entry of list) {
    const code = (entry || '').toLowerCase();
    if (code.startsWith('ar')) return 'ar';
    if (code.startsWith('en')) return 'en';
  }
  return DEFAULT_LANG;
}

/** A Back/Forward step that reloaded the page still follows the saved choice. */
function arrivalSessionLang(): Lang | null {
  if (typeof window === 'undefined' || typeof performance === 'undefined') return null;
  const entry = performance.getEntriesByType?.('navigation')[0] as PerformanceNavigationTiming | undefined;
  return entry?.type === 'back_forward' ? savedLang() : null;
}

export interface LanguageContextValue {
  lang: Lang;
  dir: Dir;
  /** t(copy.nav.home) → "الرئيسية" or "Home" */
  t: <T>(value: Localized<T>) => T;
  /** True for a short moment after a swap: components that mount then skip their own intro. */
  justSwitched: boolean;
  /** Back/Forward landed on the other language: the layout replaces the address with this one. */
  pendingRedirect: string | null;
  /** Runs the transition and opens the same page in the other language. */
  switchLanguage: (trigger?: HTMLElement | null) => void;
}

export interface LanguageTransitionValue {
  phase: TransitionPhase;
  /** Language being opened while a switch runs. */
  target: Lang | null;
  /** The running switch is the reduced-motion crossfade. */
  reducedSwitch: boolean;
  entrance: EntranceMode;
  /** Text of the polite live region ("English version" / "النسخة العربية"). */
  announcement: string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);
const LanguageTransitionContext = createContext<LanguageTransitionValue | null>(null);

const WARM_FONTS = [
  '400 1em "Noto Kufi Arabic"',
  '500 1em "Noto Kufi Arabic"',
  '700 1em "Noto Kufi Arabic"',
  '800 1em "Noto Kufi Arabic"',
  '900 1em "Noto Kufi Arabic"',
  '300 1em "Barlow"',
  '400 1em "Barlow"',
  '500 1em "Barlow"',
  '600 1em "Barlow"',
  '700 1em "Barlow"',
  '600 1em "Barlow Semi Condensed"',
];

export function LanguageProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const navigationType = useNavigationType();

  const urlLang = langFromPath(location.pathname);
  /** Language of this visit: set on arrival and by the toggle. Back/Forward follow it. */
  const sessionLang = useRef<Lang | null | undefined>(undefined);
  if (sessionLang.current === undefined) sessionLang.current = arrivalSessionLang();

  const pendingRedirect =
    urlLang && navigationType === 'POP' && sessionLang.current && sessionLang.current !== urlLang
      ? swapLangInPath(location.pathname, sessionLang.current) + location.search + location.hash
      : null;
  const lang: Lang = (pendingRedirect ? sessionLang.current : urlLang) ?? DEFAULT_LANG;
  const dir = dirOf(lang);

  const [phase, setPhaseState] = useState<TransitionPhase>('idle');
  const phaseRef = useRef<TransitionPhase>('idle');
  const [target, setTarget] = useState<Lang | null>(null);
  const [reducedSwitch, setReducedSwitch] = useState(false);
  const [entrance, setEntrance] = useState<EntranceMode>('none');
  const [justSwitched, setJustSwitched] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const timers = useRef<number[]>([]);
  const locationRef = useRef(location);

  const setPhase = useCallback((next: TransitionPhase) => {
    phaseRef.current = next;
    setPhaseState(next);
  }, []);

  useIsomorphicLayoutEffect(() => {
    locationRef.current = location;
  });

  // Remember the language of this visit (arrival, links, toggle). Back/Forward do not change it.
  useIsomorphicLayoutEffect(() => {
    if (!urlLang || pendingRedirect) return;
    if (!sessionLang.current || navigationType !== 'POP') sessionLang.current = urlLang;
  }, [location.key, urlLang, navigationType, pendingRedirect]);

  // A page restored from the back/forward cache follows the saved choice too.
  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (!event.persisted) return;
      const saved = savedLang();
      const { pathname, search, hash } = window.location;
      const current = langFromPath(pathname);
      if (saved && current && saved !== current) {
        sessionLang.current = saved;
        navigate(swapLangInPath(pathname, saved) + search + hash, { replace: true });
      }
    };
    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, [navigate]);

  // <html lang dir> follows the language; the body font follows through html[lang] selectors.
  useIsomorphicLayoutEffect(() => {
    const root = document.documentElement;
    if (root.lang !== lang) root.lang = lang;
    if (root.dir !== dir) root.dir = dir;
  }, [lang, dir]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((id) => window.clearTimeout(id));
  }, []);

  // Once the page is idle, fetch the other language's fonts and header logo,
  // so the switch never shows a font swap or an empty logo.
  useEffect(() => {
    const warm = () => {
      const other = otherLang(langFromPath(window.location.pathname) ?? DEFAULT_LANG);
      const logo = new Image();
      logo.src = brand.headerLogo[other].src;
      if ('fonts' in document) {
        for (const face of WARM_FONTS) {
          document.fonts.load(face, face.includes('Kufi') ? 'ميثاق G2200' : 'Mithaq 2200').catch(() => undefined);
        }
      }
    };
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(warm, { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = globalThis.setTimeout(warm, 1500); // Safari before 18 has no requestIdleCallback
    return () => globalThis.clearTimeout(id);
  }, []);

  const switchLanguage = useCallback(
    (trigger?: HTMLElement | null) => {
      if (phaseRef.current !== 'idle') return; // ignore further clicks until the end
      const { pathname, search, hash } = locationRef.current;
      const to = otherLang(langFromPath(pathname) ?? DEFAULT_LANG);
      const nextPath = swapLangInPath(pathname, to) + search + hash;
      const focusTarget = trigger ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const swapAt = reduce ? REDUCED_SWITCH_MS.swap : SWITCH_MS.swap;
      const endAt = reduce ? REDUCED_SWITCH_MS.end : SWITCH_MS.end;
      const started = performance.now();
      // Timers are measured from the click, so a slow render never stretches the timeline.
      const at = (time: number, run: () => void) => {
        timers.current.push(window.setTimeout(run, Math.max(0, time - (performance.now() - started))));
      };

      timers.current.forEach((id) => window.clearTimeout(id));
      timers.current = [];
      phaseRef.current = 'covering';
      setTarget(to);
      setReducedSwitch(reduce);
      setPhase('covering');

      at(swapAt, () => {
        try {
          window.localStorage.setItem(LANG_STORAGE_KEY, to);
        } catch {
          /* storage unavailable (private mode) */
        }
        sessionLang.current = to;
        setEntrance(reduce ? 'fade' : 'sweep');
        setJustSwitched(true);
        setAnnouncement(copy.toggle.announce[to]);
        setPhase(reduce ? 'revealing' : 'swapping');
        navigate(nextPath, { replace: true, preventScrollReset: true });
        window.requestAnimationFrame(() => {
          if (focusTarget?.isConnected && document.activeElement !== focusTarget) {
            focusTarget.focus({ preventScroll: true });
          }
        });
      });
      if (!reduce) at(SWITCH_MS.reveal, () => setPhase('revealing'));
      at(endAt, () => {
        setPhase('idle');
        setTarget(null);
      });
      at(endAt + SETTLE_MS, () => setJustSwitched(false));
    },
    [navigate, setPhase],
  );

  const t = useCallback(<T,>(value: Localized<T>): T => value[lang], [lang]);

  const languageValue = useMemo<LanguageContextValue>(
    () => ({ lang, dir, t, justSwitched, pendingRedirect, switchLanguage }),
    [lang, dir, t, justSwitched, pendingRedirect, switchLanguage],
  );
  const transitionValue = useMemo<LanguageTransitionValue>(
    () => ({ phase, target, reducedSwitch, entrance, announcement }),
    [phase, target, reducedSwitch, entrance, announcement],
  );

  return (
    <LanguageContext.Provider value={languageValue}>
      <LanguageTransitionContext.Provider value={transitionValue}>{children}</LanguageTransitionContext.Provider>
    </LanguageContext.Provider>
  );
}

/** Current language, direction, t() and switchLanguage(). */
export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage() must be used inside <LanguageProvider>.');
  return context;
}

/** State of the running switch (overlay, toggle and <main> wrapper only). */
export function useLanguageTransition(): LanguageTransitionValue {
  const context = useContext(LanguageTransitionContext);
  if (!context) throw new Error('useLanguageTransition() must be used inside <LanguageProvider>.');
  return context;
}

/**
 * True when the component mounted during a language switch (the new <main> after the swap).
 * Components with their own intro (hero entrance, count-ups) skip it then, because the
 * main wrapper already performs the entrance.
 */
export function useMountedBySwitch(): boolean {
  const { justSwitched } = useLanguage();
  const [mountedBySwitch] = useState(justSwitched);
  return mountedBySwitch;
}
