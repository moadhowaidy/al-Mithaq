import type { MouseEvent, ReactNode } from 'react';
import { Link } from 'react-router';
import { ArrowRight, type LucideIcon } from 'lucide-react';
import { copy, cx } from '../../data';
import { useLanguage } from '../../data/i18n';

export type ButtonVariant = 'primary' | 'outline-light' | 'outline-dark';

export interface ButtonProps {
  children: ReactNode;
  /** primary: gold with navy text · outline-light: on navy/asphalt · outline-dark: on light grounds. */
  variant?: ButtonVariant;
  /** md: 52 px (default) · sm: 44 px (header). */
  size?: 'md' | 'sm';
  /** Internal route, rendered as a router <Link> (e.g. quoteHref(lang)). */
  to?: string;
  /** External, mailto: or tel: address, rendered as <a>. */
  href?: string;
  /** Opens `href` in a new tab and tells screen readers so. */
  external?: boolean;
  download?: boolean;
  type?: 'button' | 'submit';
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  /** Trailing arrow: flips in RTL and slides in the reading direction on hover. */
  arrow?: boolean;
  /** Leading lucide icon, e.g. icon={Phone}. Drawn with a 1.5 stroke. */
  icon?: LucideIcon;
  className?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

/** Pill button (52 px, 28 px side padding) filled by a sweep from the inline start on hover. */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  to,
  href,
  external = false,
  download = false,
  type = 'button',
  onClick,
  arrow = false,
  icon: Icon,
  className,
  ...aria
}: ButtonProps) {
  const { t } = useLanguage();
  const classes = cx('btn', `btn-${variant}`, size === 'sm' && 'btn-sm', className);
  const content = (
    <>
      {Icon ? <Icon aria-hidden="true" className="btn-icon" strokeWidth={1.5} /> : null}
      <span>{children}</span>
      {arrow ? <ArrowRight aria-hidden="true" className="btn-icon btn-arrow rtl:-scale-x-100" strokeWidth={1.5} /> : null}
      {external ? <span className="sr-only"> {t(copy.a11y.newTab)}</span> : null}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} onClick={onClick} {...aria}>
        {content}
      </Link>
    );
  }
  if (href) {
    return (
      <a
        href={href}
        className={classes}
        onClick={onClick}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        download={download || undefined}
        {...aria}
      >
        {content}
      </a>
    );
  }
  return (
    <button type={type} className={classes} onClick={onClick} {...aria}>
      {content}
    </button>
  );
}
