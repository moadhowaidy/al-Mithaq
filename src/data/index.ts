/**
 * Mithaq General Supplies: company data, sectors, products, partners, contact details
 * and the small helpers the components share. Every fact shown on the site comes from
 * this file or from translations.ts, so MOAD can correct any line in one place.
 *
 * Items marked [CONFIRM] are not confirmed yet; see the TODO list in PROGRESS.md.
 */
import { copy } from './translations';
import { ogImages, type OgImage } from './og-images';

export { copy };

/* ------------------------------------------------------------------ */
/* Languages                                                           */
/* ------------------------------------------------------------------ */

export type Lang = 'ar' | 'en';
export type Dir = 'rtl' | 'ltr';
export type Localized<T = string> = { ar: T; en: T };

export const LANGS: readonly Lang[] = ['ar', 'en'];
export const DEFAULT_LANG: Lang = 'ar';
export const LANG_STORAGE_KEY = 'mithaq-lang';
/** Public address for canonical links, link previews and the sitemap (set at build time, see vite.config.ts). */
export const SITE_URL: string = __SITE_URL__;

export const isLang = (value: unknown): value is Lang => value === 'ar' || value === 'en';
export const dirOf = (lang: Lang): Dir => (lang === 'ar' ? 'rtl' : 'ltr');
export const otherLang = (lang: Lang): Lang => (lang === 'ar' ? 'en' : 'ar');

/** Picks the current language from an { ar, en } pair. */
export function localized<T>(obj: Localized<T>, lang: Lang): T {
  return obj[lang];
}

/** Replaces {tokens}: fill('Spec sheet request: {product}', { product: 'G2200' }). */
export function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);
}

/** Joins class names, skipping empty values: cx('btn', active && 'is-active'). */
export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

/* ------------------------------------------------------------------ */
/* Company                                                             */
/* ------------------------------------------------------------------ */

/** The company's names in one constant, so a spelling change is a one-line edit. */
export const company = {
  name: { ar: 'شركة ميثاق للتجهيزات العامة', en: 'Mithaq General Supplies' },
  shortName: { ar: 'ميثاق', en: 'Mithaq' },
  slogan: copy.slogan, // [CONFIRM]
  city: { ar: 'جنزور، طرابلس', en: 'Janzour, Tripoli' },
  country: { ar: 'ليبيا', en: 'Libya' },
  founded: null as number | null, // [CONFIRM] the About "Company facts" block stays hidden while this is null
  registration: null as Localized | null, // [CONFIRM]
  domain: 'al-mithaq.com',
};

/* ------------------------------------------------------------------ */
/* Brand assets (files in public/, used unchanged)                     */
/* ------------------------------------------------------------------ */

export interface ImageAsset {
  src: string;
  width: number;
  height: number;
}

export const brand = {
  /** Header logo on navy: Arabic lockup in Arabic, English lockup in English. */
  headerLogo: {
    ar: { src: '/brand/mithaq-arabic-reversed.svg', width: 1085, height: 368 },
    en: { src: '/brand/mithaq-english-reversed.svg', width: 1212, height: 368 },
  } satisfies Localized<ImageAsset>,
  /** Same lockups for light backgrounds. */
  colourLogo: {
    ar: { src: '/brand/mithaq-arabic-colour.svg', width: 1085, height: 368 },
    en: { src: '/brand/mithaq-english-colour.svg', width: 1212, height: 368 },
  } satisfies Localized<ImageAsset>,
  /** Footer logo (bilingual, on navy). */
  footerLogo: { src: '/brand/mithaq-horizontal-reversed.svg', width: 1530, height: 368 } satisfies ImageAsset,
  horizontalColour: { src: '/brand/mithaq-horizontal-colour.svg', width: 1530, height: 368 } satisfies ImageAsset,
  /** About page: the vertical colour logo on Lane White. */
  verticalColour: { src: '/brand/mithaq-vertical-colour.svg', width: 408, height: 824 } satisfies ImageAsset,
  verticalReversed: { src: '/brand/mithaq-vertical-reversed.svg', width: 408, height: 824 } satisfies ImageAsset,
  symbolColour: { src: '/brand/mithaq-symbol-colour.svg', width: 1000, height: 908 } satisfies ImageAsset,
  symbolReversed: { src: '/brand/mithaq-symbol-reversed.svg', width: 1000, height: 908 } satisfies ImageAsset,
  /** The dusk road shown inside the Gateway window in the Home hero. */
  heroRoad: { src: '/illustrations/hero-road.svg', width: 1600, height: 900 } satisfies ImageAsset,
  /** Yellow-and-dark safety stripes: product panels only. */
  chevrons: { src: '/patterns/work-zone-chevrons.svg', width: 800, height: 240 } satisfies ImageAsset,
  /** Gateway band tiles (781.714 × 360), used 40 px tall with repeat-x. */
  bands: {
    dark: '/patterns/gateway-band-dark-tile.svg',
    light: '/patterns/gateway-band-light-tile.svg',
    gold: '/patterns/gateway-band-gold-tile.svg',
  },
  /** Social share images, 1200 × 630. */
  og: { ar: '/og/og-ar.png', en: '/og/og-en.png' } satisfies Localized,
};

/* ------------------------------------------------------------------ */
/* Sectors (order and names follow the company's logo)                 */
/* ------------------------------------------------------------------ */

export type SectorId =
  | 'oil-gas'
  | 'heavy-machinery'
  | 'municipal-cleaning'
  | 'road-traffic-safety'
  | 'medical-rehabilitation'
  | 'office-furniture'
  | 'spare-parts-maintenance'
  | 'safety-ppe';

export interface Sector {
  id: SectorId;
  order: number;
  name: Localized;
  /** Neutral category descriptions, for MOAD to review [CONFIRM]. */
  summary: Localized;
  /** Navy + gold icon for light backgrounds (96 × 96). */
  icon: string;
  /** White + gold icon for navy backgrounds (96 × 96). */
  iconWhite: string;
}

export const sectors: Sector[] = [
  { id: 'oil-gas', order: 1, name: { en: 'Oil & Gas Supplies', ar: 'تجهيزات النفط والغاز' }, summary: { en: 'Equipment and supplies for oil and gas sites and facilities.', ar: 'تجهيزات ومستلزمات لمواقع ومنشآت النفط والغاز.' }, icon: '/icons/sectors/01-oil-gas.svg', iconWhite: '/icons/sectors-white/01-oil-gas.svg' },
  { id: 'heavy-machinery', order: 2, name: { en: 'Heavy Machinery & Equipment', ar: 'الآليات والمعدات الثقيلة' }, summary: { en: 'Heavy machinery and equipment for construction, roads and industry.', ar: 'آليات ومعدات ثقيلة للإنشاءات والطرق والصناعة.' }, icon: '/icons/sectors/02-heavy-machinery.svg', iconWhite: '/icons/sectors-white/02-heavy-machinery.svg' },
  { id: 'municipal-cleaning', order: 3, name: { en: 'Municipal & Cleaning Equipment', ar: 'معدات النظافة والخدمات البلدية' }, summary: { en: 'Road sweepers and equipment for municipal and cleaning services.', ar: 'كانسات الطرق ومعدات الخدمات البلدية والنظافة.' }, icon: '/icons/sectors/03-municipal-cleaning.svg', iconWhite: '/icons/sectors-white/03-municipal-cleaning.svg' },
  { id: 'road-traffic-safety', order: 4, name: { en: 'Road & Traffic Safety Equipment', ar: 'تجهيزات الطرق والسلامة المرورية' }, summary: { en: 'Equipment for road works and traffic safety.', ar: 'تجهيزات أعمال الطرق والسلامة المرورية.' }, icon: '/icons/sectors/04-road-traffic-safety.svg', iconWhite: '/icons/sectors-white/04-road-traffic-safety.svg' },
  { id: 'medical-rehabilitation', order: 5, name: { en: 'Medical & Rehabilitation', ar: 'التجهيزات الطبية والتأهيل' }, summary: { en: 'Medical and rehabilitation equipment.', ar: 'تجهيزات طبية ومعدات تأهيل.' }, icon: '/icons/sectors/05-medical-rehabilitation.svg', iconWhite: '/icons/sectors-white/05-medical-rehabilitation.svg' },
  { id: 'office-furniture', order: 6, name: { en: 'Office Supplies & Furniture', ar: 'التجهيزات المكتبية والإدارية' }, summary: { en: 'Office supplies and furniture for companies and institutions.', ar: 'لوازم وأثاث مكتبي للشركات والمؤسسات.' }, icon: '/icons/sectors/06-office-furniture.svg', iconWhite: '/icons/sectors-white/06-office-furniture.svg' },
  { id: 'spare-parts-maintenance', order: 7, name: { en: 'Spare Parts & Maintenance', ar: 'قطع الغيار والصيانة' }, summary: { en: 'Spare parts and maintenance support for equipment.', ar: 'قطع الغيار وخدمات الصيانة للمعدات.' }, icon: '/icons/sectors/07-spare-parts-maintenance.svg', iconWhite: '/icons/sectors-white/07-spare-parts-maintenance.svg' },
  { id: 'safety-ppe', order: 8, name: { en: 'Safety & PPE Equipment', ar: 'معدات السلامة والحماية' }, summary: { en: 'Personal protective equipment and workplace safety supplies.', ar: 'معدات الحماية الشخصية ومستلزمات السلامة المهنية.' }, icon: '/icons/sectors/08-safety-ppe.svg', iconWhite: '/icons/sectors-white/08-safety-ppe.svg' },
];

/** Sector icons are drawn on a 96-unit grid. */
export const SECTOR_ICON_SIZE = 96;

/* ------------------------------------------------------------------ */
/* Products                                                            */
/* ------------------------------------------------------------------ */

export interface KeyFigure {
  /** Western digits, e.g. "17,000" or "1.5–2.3". */
  value: string;
  unit: Localized;
  label: Localized;
}

export interface SpecRow {
  label: Localized;
  value: Localized;
}

export interface ProductPhoto {
  /** WebP file in public/photos/ */
  src: string;
  width: number;
  height: number;
  alt: Localized;
}

export interface Product {
  id: string;
  sector: SectorId;
  name: Localized;
  /** Shorter name for the link-preview images, for a name that would need a fourth line there (the images then show this one). */
  shareName?: Localized;
  summary: Localized;
  image: string;
  /** Intrinsic size of `image`, so it is drawn without layout shift. */
  imageSize: { width: number; height: number };
  /** Real photos [CONFIRM]: convert to WebP in public/photos/ and list them here. */
  photos: ProductPhoto[];
  /** Spec-sheet PDF in public/ [CONFIRM]; the download button appears once this is set. */
  brochure: string | null;
  keyFigures: KeyFigure[];
  specs: SpecRow[];
}

/**
 * Only the G2200 is confirmed. Every value comes from the supplier's spec sheet
 * (catalogue page 25, "G2200 (Hummer Four-Wheel)"). More products follow in the same shape [CONFIRM].
 */
export const products: Product[] = [
  {
    id: 'g2200',
    sector: 'municipal-cleaning',
    name: { en: 'G2200 Four-Wheel Road Sweeper', ar: 'كانسة الطرق G2200 رباعية العجلات' },
    summary: {
      en: 'Four-wheel road sweeper with a 1.5–2.3 m electronically adjustable cleaning width, a 300 L water tank and a 240 L waste bin.',
      ar: 'كانسة طرق رباعية العجلات بعرض تنظيف 1.5–2.3 م قابل للتعديل إلكترونياً، وخزان مياه 300 لتر وحاوية نفايات 240 لتر.',
    },
    image: '/illustrations/g2200-side.svg',
    imageSize: { width: 1177, height: 624 },
    photos: [],
    brochure: null,
    keyFigures: [
      { value: '17,000', unit: { en: 'm²/h', ar: 'م²/ساعة' }, label: { en: 'Working efficiency', ar: 'كفاءة العمل' } },
      { value: '1.5–2.3', unit: { en: 'm', ar: 'م' }, label: { en: 'Cleaning width', ar: 'عرض التنظيف' } },
      { value: '300', unit: { en: 'L', ar: 'لتر' }, label: { en: 'Water tank', ar: 'خزان المياه' } },
      { value: '240', unit: { en: 'L', ar: 'لتر' }, label: { en: 'Waste bin', ar: 'حاوية النفايات' } },
      { value: '4–6', unit: { en: 'h', ar: 'ساعات' }, label: { en: 'Continuous operation', ar: 'تشغيل متواصل' } },
    ],
    specs: [
      { label: { en: 'Main brush', ar: 'الفرشاة الرئيسية' }, value: { en: '790 mm × 1', ar: '790 مم × 1' } },
      { label: { en: 'Side brushes', ar: 'الفرش الجانبية' }, value: { en: '600 mm × 2 (front) · 500 mm × 2 (rear)', ar: '600 مم × 2 (أمامية) · 500 مم × 2 (خلفية)' } },
      { label: { en: 'Cleaning width', ar: 'عرض التنظيف' }, value: { en: '1500–2300 mm, electronically adjustable within the range', ar: '1500–2300 مم، قابل للتعديل إلكترونياً ضمن هذا المدى' } },
      { label: { en: 'Working efficiency', ar: 'كفاءة العمل' }, value: { en: '17,000 m²/h', ar: '17,000 م²/ساعة' } },
      { label: { en: 'Continuous operating time', ar: 'مدة التشغيل المتواصل' }, value: { en: '4–6 h', ar: '4–6 ساعات' } },
      { label: { en: 'Gradeability', ar: 'القدرة على صعود المنحدرات' }, value: { en: '30%', ar: '30%' } },
      { label: { en: 'Water tank', ar: 'خزان المياه' }, value: { en: '300 L', ar: '300 لتر' } },
      { label: { en: 'Waste bin', ar: 'حاوية النفايات' }, value: { en: '240 L', ar: '240 لتر' } },
      { label: { en: 'Drive power', ar: 'قوة الدفع' }, value: { en: '3000 W AC motor', ar: 'محرك تيار متردد 3000 واط' } },
      { label: { en: 'Main brush + side brush power', ar: 'قدرة الفرشاة الرئيسية والجانبية' }, value: { en: '1000 W + 100 W × 4', ar: '1000 واط + 100 واط × 4' } },
      { label: { en: 'Shaking + blower power', ar: 'قدرة الهزاز والمنفاخ' }, value: { en: '200 W × 4 + 500 W × 4', ar: '200 واط × 4 + 500 واط × 4' } },
      { label: { en: 'Braking', ar: 'نظام الكبح' }, value: { en: 'Hydraulic dual disc brakes + intelligent electronic braking', ar: 'فرامل قرصية هيدروليكية مزدوجة + كبح إلكتروني ذكي' } },
      { label: { en: 'Power source', ar: 'مصدر الطاقة' }, value: { en: '200 A Tianneng maintenance-free battery', ar: 'بطارية Tianneng بقدرة 200 أمبير بدون صيانة' } },
      { label: { en: 'Tyres', ar: 'الإطارات' }, value: { en: '400-08 solid tyres × 4', ar: '4 إطارات مصمتة 400-08' } },
      { label: { en: 'Dimensions (L × W × H)', ar: 'الأبعاد (الطول × العرض × الارتفاع)' }, value: { en: '3200 × 2200 × 2750 mm', ar: '3200 × 2200 × 2750 مم' } },
      { label: { en: 'Machine weight', ar: 'وزن الآلة' }, value: { en: '1150 kg', ar: '1150 كغ' } },
      { label: { en: 'High-pressure pump', ar: 'مضخة الضغط العالي' }, value: { en: '1500 W', ar: '1500 واط' } },
      { label: { en: 'High-pressure hose', ar: 'خرطوم الضغط العالي' }, value: { en: '13 m, imported', ar: '13 م، مستورد' } },
      { label: { en: 'Mist cannon range', ar: 'مدى مدفع الرذاذ' }, value: { en: '10 m', ar: '10 م' } },
      { label: { en: 'Rear-view camera', ar: 'كاميرا الرؤية الخلفية' }, value: { en: '7.2-inch HD display, rear HD camera', ar: 'شاشة HD مقاس 7.2 بوصة، كاميرا خلفية HD' } },
      { label: { en: 'Special configuration', ar: 'تجهيزات خاصة' }, value: { en: '8 kg industrial dry-powder fire extinguisher × 3', ar: '3 طفايات حريق بودرة صناعية 8 كغ' } },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Partners                                                            */
/* ------------------------------------------------------------------ */

export type PartnerGroupId = 'manufacturer' | 'supplier' | 'service';

export interface PartnerGroup {
  id: PartnerGroupId;
  name: Localized;
}

export interface Partner {
  id: string;
  name: Localized;
  /** Logo file in public/partners/ */
  logo: string;
  logoSize: { width: number; height: number };
  group: PartnerGroupId;
  country: Localized;
  sectors: SectorId[];
  website: string | null;
}

export const partnerGroups: PartnerGroup[] = [
  { id: 'manufacturer', name: { en: 'Manufacturers & brands', ar: 'المصنّعون والعلامات التجارية' } },
  { id: 'supplier', name: { en: 'Suppliers & distributors', ar: 'الموردون والموزعون' } },
  { id: 'service', name: { en: 'Service & maintenance partners', ar: 'شركاء الخدمة والصيانة' } },
];

/** No partner is confirmed yet [CONFIRM]. The Partners page fills in once entries are added here. */
export const partners: Partner[] = [];

/* ------------------------------------------------------------------ */
/* Contact                                                             */
/* ------------------------------------------------------------------ */

export interface PhoneEntry {
  label: Localized;
  /** Shown left to right, e.g. "+218 91 108 7744". */
  display: string;
  /** For tel: links, e.g. "+218911087744". */
  tel: string;
}

export interface SocialLink {
  id: string;
  label: Localized;
  url: string;
}

export const contact = {
  /** WhatsApp chats only, and its button appears on the Contact page only (company rule). */
  whatsappBusiness: { label: { ar: 'واتساب أعمال', en: 'WhatsApp Business' }, display: '+218 92 484 1963', digits: '218924841963' },
  /** For calls. */
  phones: [{ label: { ar: 'الهاتف', en: 'Phone' }, display: '+218 91 108 7744', tel: '+218911087744' }] as PhoneEntry[],
  email: 'info@al-mithaq.com',
  headOffice: {
    label: { ar: 'المقر الرئيسي', en: 'Head office' },
    value: { ar: 'جنزور، طرابلس، ليبيا', en: 'Janzour, Tripoli, Libya' },
    street: null as Localized | null, // [CONFIRM]
  },
  map: {
    link: 'https://maps.app.goo.gl/JxddCUthB8No13AE7?g_st=iw',
    // The pin of the map link itself (its redirect carries q=32.8461561,13.0718402). MOAD to confirm it is the right building.
    lat: 32.8461561 as number | null, // when lat and lng are set, the Contact page embeds the map
    lng: 13.0718402 as number | null,
  },
  hours: null as Localized | null, // [CONFIRM] the Contact page shows "To be added" while null
  social: [] as SocialLink[], // [CONFIRM] real links only; no icons are shown while empty
};

/* ------------------------------------------------------------------ */
/* Navigation and routes                                               */
/* ------------------------------------------------------------------ */

export type NavKey = 'home' | 'sectors' | 'products' | 'about' | 'partners' | 'contact';

/** The six pages, in header order. `path` follows the /<lang> prefix. */
export const navItems: { key: NavKey; path: string }[] = [
  { key: 'home', path: '' },
  { key: 'sectors', path: '/sectors' },
  { key: 'products', path: '/products' },
  { key: 'about', path: '/about' },
  { key: 'partners', path: '/partners' },
  { key: 'contact', path: '/contact' },
];

/** First path segments that are pages (used to repair addresses that lack a language prefix). */
export const PAGE_SLUGS = ['sectors', 'products', 'about', 'partners', 'contact'];

/** Every page in both languages: used by the pre-renderer and sitemap.xml. */
export function sitePaths(): string[] {
  const rests = ['', '/sectors', '/products', ...products.map((p) => `/products/${p.id}`), '/about', '/partners', '/contact'];
  return LANGS.flatMap((lang) => rests.map((rest) => `/${lang}${rest}`));
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/** WhatsApp Business chat with a pre-filled message. Used on the Contact page only. */
export function whatsappLink(message: string): string {
  return `https://wa.me/${contact.whatsappBusiness.digits}?text=${encodeURIComponent(message)}`;
}

/** mailto: link to the company address. Line breaks in the body are kept. */
export function mailtoLink(subject: string, body?: string): string {
  const params = [`subject=${encodeURIComponent(subject)}`];
  if (body) params.push(`body=${encodeURIComponent(body.replace(/\r?\n/g, '\r\n'))}`);
  return `mailto:${contact.email}?${params.join('&')}`;
}

/** tel: link for a phone entry. */
export function telLink(phone: PhoneEntry): string {
  return `tel:${phone.tel}`;
}

/** Google Maps embed address, or null while the coordinates are not confirmed (the map card shows instead). */
export function mapEmbed(lang: Lang): string | null {
  const { lat, lng } = contact.map;
  if (lat == null || lng == null) return null;
  return `https://maps.google.com/maps?q=${lat},${lng}&z=16&hl=${lang}&output=embed`;
}

/** Google Maps directions to the head office, or null while the coordinates are not confirmed (never route to the city centre). */
export function directionsLink(): string | null {
  const { lat, lng } = contact.map;
  if (lat == null || lng == null) return null;
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

/** schema.org LocalBusiness for the Home and Contact pages. `geo` is added only once the coordinates exist. */
export function businessJsonLd(): Record<string, unknown> {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Mithaq General Supplies',
    alternateName: 'شركة ميثاق للتجهيزات العامة',
    url: 'https://al-mithaq.com',
    logo: 'https://al-mithaq.com/icon-512.png',
    email: contact.email,
    telephone: contact.phones[0].tel,
    address: { '@type': 'PostalAddress', addressLocality: 'Janzour, Tripoli', addressCountry: 'LY' },
    hasMap: contact.map.link,
  };
  const { lat, lng } = contact.map;
  if (lat != null && lng != null) {
    data.geo = { '@type': 'GeoCoordinates', latitude: lat, longitude: lng };
  }
  return data;
}

/** Same page in the other language: '/ar/products/g2200' → '/en/products/g2200'. Query and hash are kept. */
export function swapLangInPath(path: string, lang: Lang): string {
  const match = /^\/(ar|en)(?=[/?#]|$)/.exec(path);
  if (match) return `/${lang}${path.slice(match[0].length)}`;
  const rest = path === '' || path === '/' ? '' : path.startsWith('/') ? path : `/${path}`;
  return `/${lang}${rest}`;
}

/** The part of a pathname after the language prefix: '/ar/products/' → '/products', '/ar' → ''. */
export function stripLang(pathname: string): string {
  return pathname.replace(/^\/(ar|en)(?=\/|$)/, '').replace(/\/+$/, '');
}

/** Address of a page in a language: langPath('en', '/products') → '/en/products'. */
export function langPath(lang: Lang, rest = ''): string {
  return `/${lang}${rest}`;
}

/** "Request a quote" target. Pressed from a product or sector, the form arrives pre-filled. */
export function quoteHref(lang: Lang, from?: { product?: string; sector?: string }): string {
  const params = new URLSearchParams();
  if (from?.product) params.set('product', from.product);
  else if (from?.sector) params.set('sector', from.sector);
  const query = params.toString();
  return `/${lang}/contact${query ? `?${query}` : ''}#quote`;
}

export const getSector = (id: string | null | undefined): Sector | undefined => sectors.find((s) => s.id === id);
export const getProduct = (id: string | null | undefined): Product | undefined => products.find((p) => p.id === id);
export const productsInSector = (id: string): Product[] => products.filter((p) => p.sector === id);

/** "01" … "08" */
export const sectorNumber = (sector: Sector): string => String(sector.order).padStart(2, '0');

/** Arabic-Indic (٠–٩) and Eastern Arabic-Indic (۰–۹) digits become 0–9, so numbers typed on Arabic keyboards work. */
export function toWesternDigits(value: string): string {
  return value
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0));
}

/** Phone check from the brief: 7–15 digits after removing spaces, dashes and a leading "+" (dots and brackets are tolerated too). */
export function isValidPhone(value: string): boolean {
  const digits = toWesternDigits(value.trim()).replace(/^\+/, '').replace(/[\s\-.()]/g, '');
  return /^\d{7,15}$/.test(digits);
}

/* ------------------------------------------------------------------ */
/* SEO                                                                 */
/* ------------------------------------------------------------------ */

export interface SeoEntry {
  title: Localized;
  description: Localized;
}

export type PageSeoKey = 'home' | 'sectors' | 'products' | 'about' | 'partners' | 'contact' | 'notFound';

/** Title and description of a product page: from copy.seo[<id>] when present, otherwise from the product data. */
export function productSeo(product: Product): SeoEntry {
  const entry = (copy.seo as Record<string, SeoEntry | undefined>)[product.id];
  return (
    entry ?? {
      title: { ar: `${product.name.ar} | ${company.shortName.ar}`, en: `${product.name.en} | ${company.shortName.en}` },
      description: product.summary,
    }
  );
}

export { ogImages, type OgImage };

/** Link-preview image of a page ('/sectors', '/products/g2200' …); pages without their own image use the Home image. */
export function ogImageFor(rest: string, lang: Lang): OgImage {
  return (ogImages[rest] ?? ogImages[''])[lang];
}
