import type { MouseEvent } from 'react';
import { useLocation } from 'react-router';
import { copy, cx, otherLang, swapLangInPath, type Lang } from '../../data';
import { useLanguage, useLanguageTransition } from '../../data/i18n';

const SEGMENTS: Lang[] = ['ar', 'en'];

/**
 * The language toggle: a 44 px pill with "ع" and "EN". It is a real link to the same page in
 * the other language (works without JavaScript); with JavaScript the click runs the
 * "Through the Gateway" transition instead. The pill is always laid out left to right, so the
 * gold segment travels in the same direction as the sweep (→ English, ← Arabic).
 */
export default function LanguageToggle({ className }: { className?: string }) {
  const { lang, switchLanguage } = useLanguage();
  const { phase, target } = useLanguageTransition();
  const { pathname, search, hash } = useLocation();
  const to = otherLang(lang);
  const href = swapLangInPath(pathname, to) + search + hash;
  // The gold segment moves as soon as the sweep starts.
  const shown: Lang = phase !== 'idle' && target ? target : lang;

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return; // let the browser open a new tab or window
    }
    event.preventDefault();
    switchLanguage(event.currentTarget);
  };

  return (
    <a
      href={href}
      hrefLang={to}
      lang={to}
      dir="ltr"
      aria-label={to === 'en' ? copy.toggle.ariaToEnglish : copy.toggle.ariaToArabic}
      onClick={onClick}
      className={cx(
        'group relative inline-flex h-11 shrink-0 items-center rounded-full border border-background/40 p-[3px] text-background transition-colors duration-300 hover:border-background/70',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-[3px] left-[3px] w-11 rounded-full bg-accent transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)]"
        style={{ transform: shown === 'en' ? 'translateX(44px)' : 'translateX(0)' }}
      />
      {SEGMENTS.map((code) => {
        const active = shown === code;
        return (
          <span
            key={code}
            aria-hidden="true"
            lang={code}
            className={cx(
              'relative z-10 grid h-9 w-11 place-items-center leading-none transition-colors duration-300',
              code === 'ar' ? 'font-arabic text-[17px] font-bold' : 'font-label text-[13px] font-semibold tracking-[0.12em]',
              active ? 'text-primary' : 'text-background',
            )}
          >
            {copy.toggle.short[code]}
            {!active ? (
              <span
                className={cx(
                  'absolute bottom-[3px] left-1/2 h-[3px] w-3.5 -translate-x-1/2 rounded-full bg-accent transition-[translate] duration-300',
                  code === 'en'
                    ? 'group-hover:-translate-x-[calc(50%-6px)] group-focus-visible:-translate-x-[calc(50%-6px)]'
                    : 'group-hover:-translate-x-[calc(50%+6px)] group-focus-visible:-translate-x-[calc(50%+6px)]',
                )}
              />
            ) : null}
          </span>
        );
      })}
    </a>
  );
}
