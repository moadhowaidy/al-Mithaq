import { useEffect, useRef, useState } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation, useNavigationType, useParams } from 'react-router';
import { LazyMotion, MotionConfig, domAnimation, m } from 'framer-motion';
import { PAGE_SLUGS, copy, isLang, stripLang } from './data';
import { LanguageProvider, langFromPath, preferredLang, useIsomorphicLayoutEffect, useLanguage, useLanguageTransition } from './data/i18n';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LanguageTransition from './components/layout/LanguageTransition';
import { EASE_OUT } from './components/ui/Reveal';
import Home from './pages/Home';
import Sectors from './pages/Sectors';
import Products from './pages/Products';
import ProductPage from './pages/ProductPage';
import About from './pages/About';
import Partners from './pages/Partners';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

/**
 * framer-motion runs in its light mode: <LazyMotion features={domAnimation} strict> with `m.*`
 * components (animations, variants, exit, in-view and hover/tap). Using `motion.*` throws.
 * MotionConfig drops movement for visitors who ask for reduced motion.
 */
export default function App() {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <LanguageProvider>
          <ScrollManager />
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path=":lang" element={<SiteLayout />}>
              <Route index element={<Home />} />
              <Route path="sectors" element={<Sectors />} />
              <Route path="products" element={<Products />} />
              <Route path="products/:id" element={<ProductPage />} />
              <Route path="about" element={<About />} />
              <Route path="partners" element={<Partners />} />
              <Route path="contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </LanguageProvider>
      </MotionConfig>
    </LazyMotion>
  );
}

/** "/" opens the saved language, then the browser language, then Arabic. */
function RootRedirect() {
  const { search, hash } = useLocation();
  return <Navigate replace to={`/${preferredLang()}${search}${hash}`} />;
}

function SiteLayout() {
  const { lang: segment } = useParams();
  const { pathname, search, hash } = useLocation();
  const { t, pendingRedirect } = useLanguage();

  // Unknown language prefix: "/products" gains one, "/fr/products" has it replaced.
  if (!isLang(segment)) {
    const parts = pathname.split('/').filter(Boolean);
    const keep = PAGE_SLUGS.includes(parts[0] ?? '') || (parts[0] ?? '').length !== 2 ? parts : parts.slice(1);
    return <Navigate replace to={`/${preferredLang()}${keep.length ? `/${keep.join('/')}` : ''}${search}${hash}`} />;
  }

  return (
    <>
      {pendingRedirect ? <Navigate replace to={pendingRedirect} /> : null}
      <a href="#main" className="skip-link">
        {t(copy.a11y.skipToContent)}
      </a>
      <Navbar />
      <MainArea />
      <Footer />
      <LanguageTransition />
      <LiveRegion />
    </>
  );
}

/**
 * The <main> wrapper is keyed by language, so after a swap its entrance replays in the new
 * language: it fades in and slides 24 px from the inline-start side (220 ms after the swap,
 * 320 ms long). With reduced motion it crossfades instead (200 ms, swap at the midpoint).
 * While the new page is still transparent, a backdrop in the colour of the page opening keeps
 * the revealed screen from flashing light between two navy states.
 */
function MainArea() {
  const { lang } = useLanguage();
  const { phase, reducedSwitch, entrance } = useLanguageTransition();
  const wrapper = useRef<HTMLDivElement>(null);
  const [backdrop, setBackdrop] = useState<{ top: number; height: number; color: string } | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (phase !== 'covering' || reducedSwitch || !wrapper.current) return;
    const opening = wrapper.current.querySelector('main > :first-child');
    if (!(opening instanceof HTMLElement)) return;
    const box = opening.getBoundingClientRect();
    const origin = wrapper.current.getBoundingClientRect();
    setBackdrop({ top: box.top - origin.top, height: box.height, color: getComputedStyle(opening).backgroundColor });
  }, [phase, reducedSwitch]);

  const fadingOut = reducedSwitch && phase === 'covering';
  const initial =
    entrance === 'sweep' ? { opacity: 0, x: lang === 'ar' ? 24 : -24 } : entrance === 'fade' ? { opacity: 0 } : false;
  const transition = fadingOut
    ? { duration: 0.1, ease: 'linear' as const }
    : entrance === 'sweep'
      ? { delay: 0.22, duration: 0.32, ease: EASE_OUT }
      : { duration: 0.1, ease: 'linear' as const };

  return (
    <div ref={wrapper} className="relative">
      {backdrop ? (
        <div
          aria-hidden="true"
          className="absolute inset-x-0"
          style={{ top: backdrop.top, height: backdrop.height, backgroundColor: backdrop.color }}
        />
      ) : null}
      <m.main
        key={lang}
        id="main"
        tabIndex={-1}
        className="relative outline-none"
        initial={initial}
        animate={{ opacity: fadingOut ? 0 : 1, x: 0 }}
        transition={transition}
        onAnimationComplete={() => setBackdrop(null)}
      >
        <Outlet />
      </m.main>
    </div>
  );
}

/** Polite live region: announces "English version" / "النسخة العربية" after a switch. */
function LiveRegion() {
  const { lang } = useLanguage();
  const { announcement } = useLanguageTransition();
  return (
    <div role="status" aria-live="polite" lang={lang} className="sr-only">
      {announcement}
    </div>
  );
}

/**
 * Scrolls to the top on a new page and to #hash targets after render.
 * Keeps the position when only the language prefix changed, and on Back/Forward.
 */
function ScrollManager() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const previous = useRef<{ page: string; lang: string | null } | null>(null);

  useEffect(() => {
    const page = stripLang(location.pathname);
    const lang = langFromPath(location.pathname);
    const before = previous.current;
    previous.current = { page, lang };

    if (before && before.page === page && before.lang !== lang) return; // language switch: same place
    if (before && navigationType === 'POP') return; // Back/Forward: the browser restores the position
    if (location.hash) {
      scrollToHash(location.hash, Boolean(before && before.page === page));
      return;
    }
    if (before && before.page !== page) window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  return null;
}

function scrollToHash(hash: string, smooth: boolean) {
  const id = decodeURIComponent(hash.slice(1));
  let attempts = 0;
  const tryScroll = () => {
    const target = document.getElementById(id);
    if (target) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({ behavior: smooth && !reduce ? 'smooth' : 'auto', block: 'start' });
      return;
    }
    if (attempts++ < 20) window.requestAnimationFrame(tryScroll);
  };
  window.requestAnimationFrame(tryScroll);
}
