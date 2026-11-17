import { useLocation } from 'react-router';
import { SITE_URL, company, ogImageFor, stripLang, type Localized } from '../../data';
import { useLanguage } from '../../data/i18n';

interface SeoProps {
  title: Localized | string;
  description: Localized | string;
  /** The 404 page: kept out of search results and without canonical or hreflang links. */
  noindex?: boolean;
}

/**
 * Title, description, canonical, hreflang alternates and the link preview (Open Graph and
 * X/Twitter tags) of the current page in the current language. React 19 hoists these tags into
 * <head>; scripts/prerender.mjs writes them into every pre-rendered page, which is what WhatsApp,
 * Facebook, LinkedIn, X and Telegram read. Every address is absolute (SITE_URL); the preview
 * image is the page's own (src/data/og-images.ts), or the Home image for pages without one.
 */
export default function Seo({ title, description, noindex = false }: SeoProps) {
  const { lang, t } = useLanguage();
  const { pathname } = useLocation();
  const rest = stripLang(pathname);
  const urlFor = (code: string) => `${SITE_URL}/${code}${rest}`;
  const pageTitle = typeof title === 'string' ? title : t(title);
  const pageDescription = typeof description === 'string' ? description : t(description);
  const url = urlFor(lang);
  const image = ogImageFor(rest, lang);
  const imageUrl = `${SITE_URL}${image.src}`;

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
      <meta property="og:locale" content={lang === 'ar' ? 'ar_LY' : 'en_GB'} />
      <meta property="og:locale:alternate" content={lang === 'ar' ? 'en_GB' : 'ar_LY'} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:secure_url" content={imageUrl} />
      <meta property="og:image:type" content={image.type} />
      <meta property="og:image:width" content={String(image.width)} />
      <meta property="og:image:height" content={String(image.height)} />
      <meta property="og:image:alt" content={image.alt} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={image.alt} />
    </>
  );
}
