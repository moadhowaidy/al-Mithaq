# Code conventions

How the Mithaq site is put together, for anyone adding a page, a product or a section.
The brief itself is in [`BUILD_PROMPT.md`](BUILD_PROMPT.md).

## Commands

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check, client build, pre-render every page + sitemap.xml into dist/
npm run preview    # serve dist/ at http://localhost:4173
```

## Where things live

| Path | What |
|---|---|
| `src/data/index.ts` | Company, sectors, products, partners, contact data, brand asset paths and helpers (`whatsappLink`, `mailtoLink`, `mapEmbed`, `swapLangInPath`, `localized`, `quoteHref`, `langPath`, `getProduct`, `getSector`, `productsInSector`, `isValidPhone`, `toWesternDigits`, `fill`, `cx` …) |
| `src/data/translations.ts` | All interface copy (`copy`) in Arabic and English |
| `src/data/i18n.tsx` | Language context: `useLanguage()` → `{ lang, dir, t, switchLanguage, justSwitched }`; `useLanguageTransition()` for the switch state; `useMountedBySwitch()` |
| `src/components/layout/` | Navbar (with the mobile menu), Footer, LanguageToggle, LanguageTransition |
| `src/components/ui/` | Shared pieces: `Button`, `PageHero`, `SectionOpener`, `QuoteBand`, `GatewayMark` (+ `GATE`, `DASHES`, `GateDashes`), `GatewayBand` (+ `LaneDashes`, `ChevronStrip`), `Reveal` (motion helpers), `Typeset` (`setFigures`, `keepCompounds`, `bindAmpersand`, `figureSpan`), `Seo` |
| `src/components/<page>/` | Components used by one page only |
| `src/pages/` | One component per route |
| `scripts/prerender.mjs` | Writes `dist/<lang>/<page>.html` for every page, `dist/sitemap.xml`, the app shell's head tags (`dist/index.html`) and `dist/site.webmanifest`, all from `src/data` |

## Text and data

- **Every visible string comes from `src/data/`.** No copy, specs or contact details in components; aria-labels and alt text too.
- Read copy with `t()`: `t(copy.nav.home)`; read data the same way: `t(sector.name)`.
- A new string goes into the matching namespace of `translations.ts`, under a `// Added during the build` comment, in both languages. New Arabic is formal Modern Standard Arabic in the same calm tone, written natively.
- **Facts only**: nothing that is not in the brief (no numbers, clients, partners, certifications, testimonials, prices). Unconfirmed items show neutral placeholders and are listed in `PROGRESS.md`.
- **WhatsApp lives on the Contact page only.** Build links with `whatsappLink()`; never write `wa.me` anywhere else.

## Language, direction and addresses

- The language comes from the address (`/ar/…`, `/en/…`). Build links with `langPath(lang, '/products')` and `quoteHref(lang, { product })` — never hard-code `/ar` or `/en`.
- Layout uses logical utilities (`ms-* me-* ps-* pe-* start-* end-* text-start text-end border-s border-e`) so RTL mirrors itself. Directional icons (arrows, chevrons) flip with `rtl:-scale-x-100`. **The logo and the Gateway mark are never mirrored.**
- Western digits everywhere. Phone numbers are always wrapped in `<span dir="ltr">`. Key-figure values use `<CountUp>` (left to right). Running Arabic text keeps its natural direction; pass sentences and spec values that contain figures through `setFigures()` (figures never break across lines, number ranges and codes like "400-08" read left to right).
- Fonts: Noto Kufi Arabic is loaded as its Arabic subset only, so Latin text and digits inside Arabic pages use Barlow, the logo's Latin face.
- Arabic is never letter-spaced (a global `:lang(ar)` rule enforces it). Put `lang="ar"` / `lang="en"` on any phrase in the other language.

## Design tokens and classes

Only the brand colours exist (the default Tailwind palette is removed, so `text-gray-500` does nothing):
`primary` (navy) · `background` (Lane White) · `accent` (gold) · `muted` · `asphalt` · `steel` · `surface` (white) · `line`.
Opacity variants are for lines, glows and overlays only (`border-steel/30`, `bg-primary/95`).

- **Never gold or steel text, icons or focus rings on light grounds** (too faint). On light grounds: navy text, `muted` secondary text. On navy/asphalt: Lane White text, `steel` secondary text, gold accents.
- Grounds: add `on-dark` to every navy/asphalt section (sets text colour, gold focus rings, gold link underlines, light button sweeps); `on-light` resets inside it. White cards (`card`) reset themselves.
- Layout: `container-site` (1200 px + gutters), `section` (80 px / 128 px vertical padding), `max-w-text` (640 px text columns).
- Type: `h1` `h2` `h3` `kicker` `lead` `figure-value` (44 px Barlow figures) `deco-number` (120 px Barlow 300 in `line`) `font-num` (Barlow digits in both languages). They switch font, size and line-height per language by themselves. Body text is 17 px.
- Components: `<Button variant="primary|outline-light|outline-dark" size="md|sm" to|href arrow icon={Phone}>`; `card` + `card-interactive` (lift, gold top hairline, soft shadow on hover); `link-draw` (underline drawn from the reading start) and `link-inline` (inline links, keeps a faint underline); `chip` (+ `aria-pressed="true"` or `aria-current` when active); `field` for inputs, selects and textareas; `grain` for navy sections; `dusk-glow` (radial gold at 12 % behind windows and product images); `<GatewayBand tone="dark|light|gold">`; `<LaneDashes className="w-[184px]">`; `<ChevronStrip className="h-4 md:h-5">` (work-zone chevrons, product panels only).
- Shapes: buttons are 52 px pills, inputs 52 px with 12 px radius, cards 16 px radius, 1 px hairlines instead of heavy borders.
- Icons: lucide-react with `strokeWidth={1.5}` and `aria-hidden="true"`. Sector icons are the SVG files in `public/icons/` (`sector.icon` on light, `sector.iconWhite` on navy), drawn at their 96 × 96 grid.

## Motion

- framer-motion runs in light mode: **use `m.div`, `m.h2`… (`import { m } from 'framer-motion'`), never `motion.*`** (it throws under `<LazyMotion strict>`). Hooks (`useScroll`, `useTransform`, `useInView`, `useReducedMotion`) work as usual.
- Use the shared helpers in `ui/Reveal.tsx`: `<Reveal>`, `<RevealGroup>` + `<RevealItem>` (fade-up, 700 ms, 80 ms stagger, once; content already scrolled past counts as seen), `<ClipReveal>` (image wipe from the reading start or a fixed edge with `from`; `immediate` above the fold; lazy images inside load before it opens), `<CountUp value="17,000">`, `useEntrance()` (page-opening entrance), `useSwitchHeading(order)` (section headings after a language switch).
- **Page openings use CSS intros**, not framer's hidden first frame: `useEntrance()` and `introProps()` add `data-intro` and `--intro-delay` (keyframes in index.css), so the pre-rendered HTML is visible and animates from its first paint, and the app continues the running animation instead of replaying it. Anything above the fold that animates on arrival should go through them.
- After a language switch the `<main>` wrapper performs the entrance; components with their own intro check `useMountedBySwitch()` and skip it.
- Animate only `transform`, `opacity` (and `clip-path` for wipes). Calm easing `[0.22, 1, 0.36, 1]`, no springs or bounce.
- Reduced motion: `MotionConfig` drops movement automatically; loops and parallax must stop explicitly (`useReducedMotion()`).

## Page anatomy

```tsx
<>
  <Seo title={copy.seo.x.title} description={copy.seo.x.description} />
  <PageHero kicker=… title=… lead=… />        {/* Home has its own hero */}
  <section className="section bg-background">…</section>
  <QuoteBand />                                 {/* every page except Contact and 404 */}
</>
```

- One `<h1>` per page (PageHero or the Home hero); sections use `<h2>` with `aria-labelledby`.
- Images: always `width` and `height`; `alt` text from `src/data/` (empty `alt` plus `aria-hidden` for decoration); `loading="lazy"` below the fold; `decoding="async"`.
- Tap targets are at least 44 px. Nothing appears only on hover.
- Pages are pre-rendered at build time and then rendered fresh in the browser (no hydration): never touch `window`, `document` or `localStorage` at module level or during render — only in effects and event handlers. The exceptions are guarded and never run during pre-rendering: `preferredLang()` in the redirects of `App.tsx` ("/" and unknown prefixes are not pre-rendered), the arrival check in `LanguageProvider`, and `useIntroElapsed()` (reads `performance` behind a guard).
