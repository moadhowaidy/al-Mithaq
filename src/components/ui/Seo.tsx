import { useLocation } from 'react-router';
import { SITE_URL, brand, company, stripLang, type Localized } from '../../data';
import { useLanguage } from '../../data/i18n';

interface SeoProps {
  title: Localized | string;
  description: Localized | string;
  /** For the 404 page: no canonical or alternates, and robots noindex. */
  noindex?: boolean;
}

/**
 * Page title and meta tags. React 19 places them in <head>; the pre-renderer copies them
 * into each page's static HTML. Canonical and hreflang alternates point to https://al-mithaq.com,
 * with x-default on the Arabic page.
 */
export default function Seo({ title, description, noindex = false }: SeoProps) {
  const { lang, t } = useLanguage();
  const { pathname } = useLocation();
  const rest = stripLang(pathname);
  const urlFor = (code: string) => `${SITE_URL}/${code}${rest}`;
  const pageTitle = typeof title === 'string' ? title : t(title);
  const pageDescription = typeof description === 'string' ? description : t(description);
  const url = urlFor(lang);

  return (
    <>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      {noindex ? (
        <meta name="robots" content="noindex, follow" />
      ) : (
        <>
          <link rel="canonical" href={url} />
          <link rel="alternate" hrefLang="ar" href={urlFor('ar')} />
          <link rel="alternate" hrefLang="en" href={urlFor('en')} />
          <link rel="alternate" hrefLang="x-default" href={urlFor('ar')} />
        </>
      )}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={company.name[lang]} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={`${SITE_URL}${brand.og[lang]}`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={company.name[lang]} />
      <meta property="og:locale" content={lang === 'ar' ? 'ar_LY' : 'en_GB'} />
      <meta property="og:locale:alternate" content={lang === 'ar' ? 'en_GB' : 'ar_LY'} />
      <meta name="twitter:card" content="summary_large_image" />
    </>
  );
}
