import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { AnimatePresence, m } from 'framer-motion';
import { ArrowRight, Mail, Menu, Phone, X } from 'lucide-react';
import { brand, contact, copy, cx, langPath, navItems, quoteHref, stripLang, telLink } from '../../data';
import { useLanguage } from '../../data/i18n';
import Button from '../ui/Button';
import { EASE_OUT } from '../ui/Reveal';
import LanguageToggle from './LanguageToggle';

/**
 * Navy sticky header (80 px). After scrolling it turns 95 % navy with a backdrop blur and a
 * 1 px gold hairline. Desktop: logo · six links · "Request a quote" · language toggle.
 * Mobile: logo · toggle · menu button opening a full-screen navy panel.
 */
export default function Navbar() {
  const { lang, t } = useLanguage();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const page = stripLang(pathname);
  const logo = brand.headerLogo[lang];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // A new page closes the menu (a language switch keeps it open, in the new language).
  useEffect(() => {
    setMenuOpen(false);
  }, [page]);

  // The panel is for small screens only.
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)');
    const onChange = () => desktop.matches && setMenuOpen(false);
    desktop.addEventListener('change', onChange);
    return () => desktop.removeEventListener('change', onChange);
  }, []);

  const closeMenu = useCallback((restoreFocus: boolean) => {
    setMenuOpen(false);
    if (restoreFocus) window.requestAnimationFrame(() => menuButton.current?.focus());
  }, []);

  return (
    <header
      className={cx(
        'on-dark sticky top-0 z-50 transition-[background-color,backdrop-filter] duration-500',
        scrolled ? 'bg-primary/95 backdrop-blur-md' : 'bg-primary',
      )}
    >
      <div className="container-site flex h-20 items-center justify-between gap-6">
        <Link to={langPath(lang)} className="shrink-0 rounded-sm">
          <img
            src={logo.src}
            width={logo.width}
            height={logo.height}
            alt={t(copy.a11y.homeLink)}
            className="h-9 w-auto lg:h-11"
            decoding="async"
          />
        </Link>

        <nav aria-label={t(copy.a11y.mainNav)} className="hidden lg:block">
          <ul className="flex items-center gap-5 xl:gap-8">
            {navItems.map((item) => {
              const label = t(copy.nav[item.key]);
              return (
                <li key={item.key}>
                  <NavLink
                    to={langPath(lang, item.path)}
                    end={item.path === ''}
                    className="group relative inline-flex h-11 items-center text-[15px] font-medium text-background aria-[current=page]:font-bold"
                  >
                    {({ isActive }) => (
                      <>
                        <span className={cx('nav-label', !isActive && 'link-draw')} data-label={label}>
                          {label}
                        </span>
                        {isActive ? (
                          <span aria-hidden="true" className="absolute bottom-0.5 start-0 h-[3px] w-3.5 rounded-full bg-accent" />
                        ) : null}
                      </>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Button to={quoteHref(lang)} size="sm" className="hidden lg:inline-flex">
            {t(copy.cta.quote)}
          </Button>
          <LanguageToggle />
          <button
            ref={menuButton}
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full text-background lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={t(copy.nav.menu)}
            onClick={() => setMenuOpen(true)}
          >
            <Menu aria-hidden="true" className="h-6 w-6" strokeWidth={1.5} />
          </button>
        </div>
      </div>
      <span
        aria-hidden="true"
        className={cx('absolute inset-x-0 bottom-0 h-px bg-accent/40 transition-opacity duration-500', scrolled ? 'opacity-100' : 'opacity-0')}
      />

      <MobileMenu open={menuOpen} onClose={closeMenu} />
    </header>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: (restoreFocus: boolean) => void }) {
  const { lang, dir, t } = useLanguage();
  const panel = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const logo = brand.headerLogo[lang];
  const phone = contact.phones[0];
  const offscreen = dir === 'rtl' ? '-100%' : '100%'; // slides in from the inline-end side

  // Lock the page behind the panel and move focus into it.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = 'hidden';
    const frame = window.requestAnimationFrame(() => closeButton.current?.focus());
    return () => {
      window.cancelAnimationFrame(frame);
      root.style.overflow = previous;
    };
  }, [open]);

  // Escape closes; Tab stays inside the panel.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose(true);
        return;
      }
      if (event.key !== 'Tab' || !panel.current) return;
      const focusable = Array.from(panel.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <m.div
          key="mobile-menu"
          id="mobile-menu"
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-label={t(copy.nav.menu)}
          className="on-dark grain fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-primary lg:hidden"
          initial={{ x: offscreen }}
          animate={{ x: 0 }}
          exit={{ x: offscreen }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
        >
          <div className="container-site flex h-20 shrink-0 items-center justify-between gap-4">
            <Link to={langPath(lang)} className="shrink-0 rounded-sm" onClick={() => onClose(false)}>
              <img src={logo.src} width={logo.width} height={logo.height} alt={t(copy.a11y.homeLink)} className="h-9 w-auto" />
            </Link>
            <div className="flex items-center gap-3">
              <LanguageToggle />
              <button
                ref={closeButton}
                type="button"
                className="grid h-11 w-11 place-items-center rounded-full text-background"
                aria-label={t(copy.nav.close)}
                onClick={() => onClose(true)}
              >
                <X aria-hidden="true" className="h-6 w-6" strokeWidth={1.5} />
              </button>
            </div>
          </div>

          <nav aria-label={t(copy.a11y.mainNav)} className="container-site flex-1 pt-6">
            <ul>
              {navItems.map((item, index) => (
                <m.li
                  key={item.key}
                  className="border-b border-steel/30"
                  initial={{ opacity: 0, x: dir === 'rtl' ? -24 : 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.12 + index * 0.06, duration: 0.5, ease: EASE_OUT }}
                >
                  <NavLink
                    to={langPath(lang, item.path)}
                    end={item.path === ''}
                    onClick={() => onClose(false)}
                    className="flex min-h-[4.25rem] items-center justify-between gap-4 py-2 text-[32px] font-bold leading-tight text-background aria-[current=page]:text-accent"
                  >
                    {t(copy.nav[item.key])}
                    <ArrowRight aria-hidden="true" className="h-6 w-6 shrink-0 text-accent rtl:-scale-x-100" strokeWidth={1.5} />
                  </NavLink>
                </m.li>
              ))}
            </ul>
            <m.div
              className="mt-10"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5, ease: EASE_OUT }}
            >
              <Button to={quoteHref(lang)} className="w-full" arrow onClick={() => onClose(false)}>
                {t(copy.cta.quote)}
              </Button>
            </m.div>
          </nav>

          <div className="container-site shrink-0 py-8">
            <ul className="space-y-1 text-steel">
              <li>
                <a href={telLink(phone)} className="inline-flex min-h-11 items-center gap-3 hover:text-background">
                  <Phone aria-hidden="true" className="h-5 w-5 text-accent" strokeWidth={1.5} />
                  <span dir="ltr">{phone.display}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${contact.email}`} className="inline-flex min-h-11 items-center gap-3 hover:text-background">
                  <Mail aria-hidden="true" className="h-5 w-5 text-accent" strokeWidth={1.5} />
                  <span dir="ltr">{contact.email}</span>
                </a>
              </li>
            </ul>
          </div>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
