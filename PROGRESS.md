# Mithaq General Supplies website: progress

Bilingual (Arabic/English) luxury catalogue site for **al-mithaq.com**, built by SwiftScale.
The full brief is saved in [`docs/BUILD_PROMPT.md`](docs/BUILD_PROMPT.md); code conventions are in [`docs/CONVENTIONS.md`](docs/CONVENTIONS.md); brand-package notes are in [`docs/LOGO_PACKAGE_README.txt`](docs/LOGO_PACKAGE_README.txt) and [`docs/ASSETS.md`](docs/ASSETS.md).

**New session?** Read this file and `git log` first.

## Milestones

| # | Milestone | Status |
|---|---|---|
| 1 | Project setup, tokens, fonts, routing with the language prefix | Done |
| 2 | Layout: navy header, mobile menu, page hero, footer, quote band | Done |
| 3 | The language toggle and the "Through the Gateway" transition | Done |
| 4 | Home | Done |
| 5 | Sectors, Products and the product page | Done |
| 6 | About, Partners and Contact (map card, WhatsApp Business button) | Done |
| 7 | SEO, 404, `vercel.json`, pre-rendering, final checks | 404, `vercel.json`, pre-rendering and sitemap done; final review in progress |

Milestones 1–3 were built and checked together and share one commit. Milestones 4–6 were built in parallel (one builder and one independent reviewer per page group), then integrated: shared helpers moved into `src/components/ui/` (`Typeset.tsx`, `ChevronStrip` in `GatewayBand.tsx`, the reworked `ClipReveal`).

## Stack

React 19.3 · Vite 8 · TypeScript 7 · Tailwind CSS 4.3 (`@theme` tokens in `src/index.css`) · React Router 8 (declarative `BrowserRouter`) · framer-motion 14 (light `LazyMotion` mode) · lucide-react · `@fontsource` (Noto Kufi Arabic, Barlow, Barlow Semi Condensed).

## Checks (after milestones 4–6, production build)

- `npm run build` passes: type-check, client build, 14 pre-rendered pages, `sitemap.xml`. Script 132 KB and CSS 12 KB (brotli).
- SEO check of every pre-rendered page: one title and description, canonical, `hreflang` ar/en/x-default (Arabic), Open Graph image of the page's language, sitemap lists all 14 addresses.
- All 18 routes (the 14 pages, two filtered views, a pre-filled Contact address and a 404) at 375 / 768 / 1280 px: no horizontal scroll, correct `lang`/`dir`, no console errors, no failed requests, no letter-spaced Arabic, every image sized and loaded, exactly one h1.
- Brief rules on all pages at 375 and 1280: no gold or steel text on light grounds, phone numbers left to right, tap targets at least 44 px, `wa.me` only on the Contact page (one link).
- Language switch on 9 pages, both directions, scrolled and from the top: path, query, hash and scroll position kept; header logo swaps; a second click is ignored; focus returns to the toggle; the live region announces; the choice is saved. Overlay at ~45 ms, swap at 350–465 ms (the new page renders under the cover), overlay gone at ~740 ms. Reduced motion: a crossfade, no sweep. Back/Forward keep the chosen language, also across a page reload.
- Mobile menu: opens from the inline end, traps focus, Escape closes it and returns focus to the menu button, page scroll is locked while open.

## Decisions (for review)

- **Brand assets** from `Mithaq_Web_Assets.zip` were copied unchanged into `public/`. The logo package README (clear space, minimum sizes, colours) is kept in `docs/`; its print PDFs and PNGs are not part of the website.
- **English spelling** is "Mithaq", held in `company` in `src/data/index.ts`. The brief's copy also contains the name inside some sentences (SEO titles, footer, form message); a spelling change means a search-and-replace for "Mithaq" in `src/data/`.
- **Pre-rendering** uses React 19's `renderToString` with React Router's `StaticRouter` (`src/entry-server.tsx` + `scripts/prerender.mjs`) instead of `vite-react-ssg`. Every page in both languages gets its own static HTML (`dist/<lang>/<page>.html`) with its own title, description, canonical, hreflang alternates and the Open Graph image of its language, so link previews on WhatsApp and social networks show the right page. In the browser the app then renders fresh on top (no hydration), so filtered views (`?sector=`) and the pre-filled quote form (`?product=`) are correct from the first frame. A CSS fallback shows the pre-rendered content if the script fails to start.
- **framer-motion light mode** (`LazyMotion` + `m.*`) keeps the script about 15 KB (gzipped) smaller. The whole script is about 133 KB gzipped, most of it React itself.
- **Two contexts in `i18n.tsx`**: the language (`useLanguage`) and the running switch (`useLanguageTransition`), so the four phase changes of a switch never re-render the whole page mid-sweep.
- **Toggle**: the pill is always laid out left to right (`ع | EN`), so its gold segment travels in the same direction as the sweep. The header button uses the 44 px size to line up with the 44 px toggle inside the 80 px header; all other buttons are 52 px.
- **Saved language**: only the toggle writes `mithaq-lang` (as specified). Shared links always open in their own language. Back/Forward follow the language of the visit; if a Back/Forward step reloads the page, the saved choice is used.
- **Addresses without a language**: `/products` becomes `/<preferred>/products`; an unknown two-letter prefix (`/fr/products`) is replaced. Without JavaScript, `/` forwards to `/ar`.
- **Quote band**: the 50° cut is a chamfer on the inline-start top corner (the angle is exact: tan 50°). A full-height 50° edge would take most of a phone's width.
- **404**: navy page with the Gateway mark, `noindex`, no quote band.
- **Hosting**: `vercel.json` rewrites every address that is not a file to the app shell (`dist/index.html`, written as `/` because Vercel's `cleanUrls` expects destinations without `.html`), so deep links work on refresh. Pre-rendered pages are files and are served first. Unknown addresses show the site's 404 page with HTTP status 200; if real 404 status codes are wanted later, the rewrite can be limited and a `404.html` added. To verify on the first preview deployment.
- **Fonts**: heading weights of both languages are preloaded (build plugin in `vite.config.ts`); the remaining weights and the other language's header logo are fetched when the browser is idle, so the switch never shows a font swap.
- **Form errors**: the palette has no red, so invalid fields get a heavier navy border plus a text message and an error summary.
- **Phone check**: 7–15 digits after removing spaces, dashes and a leading "+" (dots and brackets are tolerated too); Arabic-Indic digits typed on Arabic keyboards are converted to 0–9.
- **Copy added during the build** (not in the brief) is marked `// Added during the build` in `src/data/translations.ts`: accessibility labels, the toggle labels, page-opening kickers (e.g. "ما نورّده" / "What we supply"), About section titles and Company-facts labels, partner-tile labels, the G2200 image alt text, form placeholders, intro and messages, the 404 kicker and SEO text. MOAD to review the Arabic.
- **Number ranges in Arabic text** ("1.5–2.3", "4–6") are shown left to right, like the key figures and phone numbers; without this the Unicode bidi rules would display them as "2.3–1.5". Figures also never break across lines with their units.
- **Quote message**: an invisible left-to-right mark sits before the phone number in Arabic messages, so WhatsApp and email never show its digit groups reversed. Entries in the form survive a language switch; a fresh visit starts empty. The form has no `name` attributes, so details can never end up in an address bar or server log.
- **Contact form fields**: product is the only optional field (its label says so); all others are required, as the copy implies.
- **Gold buttons stay scarce**: sectors without products, the product-card actions on tablets and the map buttons use outline buttons; gold is kept for the main quote actions and the WhatsApp button.
- **Partners**: each empty group shows three quiet placeholder tiles (no invented brands); the Home teaser shows four. They fill in automatically from `partners` in `src/data/index.ts`.
- **Wipe reveals** watch an unclipped wrapper and load lazy images before they open (browsers skip clipped lazy images, and a clipped element can miss the in-view signal at the top of the screen).
- **Anchors and page changes**: following a `#hash` (e.g. "Request a quote" → `#quote`) moves keyboard focus there; any other in-app page change moves focus to the new page's title, so keyboard and screen-reader users start at the top of the new page. `scroll-padding` keeps focused controls and anchors clear of the sticky header.
- **Language switch sequencing**: only the 320 ms swap is on a clock. The reveal starts once the new page has committed and painted (after the 100 ms dash hold), and the switch ends when the panel has left the screen. On a slow phone the reveal comes later but always plays in full; it never pops. The swap render runs as a React transition, and the panel animates a transform string the browser can run off the main thread.
- **Page openings animate in CSS**: the opening of every page (kicker, title, lead, buttons, the Home window, the product image) uses CSS keyframes from its first paint, so the pre-rendered HTML is visible before the script arrives. When the app takes over it continues the running animation instead of replaying it. Below-the-fold reveals stay script-driven.
- **Arabic pages use Barlow for Latin text and digits**: Noto Kufi Arabic is loaded as its Arabic subset only, so "G2200", phone numbers and the email match the logo's Latin face everywhere.
- **Form fields** have a navy 50 % border (3:1 against white), so they stay visible for low-vision visitors; decorative hairlines keep the lighter `line` colour.
- **Only the Home hero loops**: its runway-light dashes loop as briefed (paused off screen and with reduced motion). The 404 and the Contact map card light their dashes once instead.
- **Product page opening** is asphalt with the work-zone chevrons along its bottom edge instead of the navy Gateway band, since the brief makes it a product stage and keeps the chevrons for product panels. Easy to swap if MOAD prefers the band.
- **Home sector cards** are 2 columns on tablets (768–1023 px) as well as phones, and 4 × 2 from 1024 px: at four across on a tablet, Arabic names broke one word per line.
- **Sector product chips** link to each product's own page; the "Products in this sector" heading above them links to the filtered catalogue (`/products?sector=`), as the brief describes.
- **App shell and manifest**: `dist/index.html` (used for "/" and unknown addresses) and `dist/site.webmanifest` take their titles and names from `src/data` at build time; `public/site.webmanifest` is only the development copy.

## TODO for the client ([CONFIRM] items)

1. Slogan: كلمتنا ميثاق · "Our word is our pledge."
2. Head-office map coordinates (`contact.map.lat`, `lng`) and street address. Until then the Contact page shows the map card with the "Open in Google Maps" button.
3. Working hours. The Contact page shows "To be added" / "سيُضاف قريباً"; the footer leaves hours out.
4. Social media links (no icons are shown until real links exist).
5. Founding year and registration details (the About "Company facts" block stays hidden until then).
6. Partners [CONFIRM]: names, logos, countries and sectors. No partner is confirmed, so all three groups on the Partners page show three placeholder tiles each, and the Home partners row shows four.
7. Further products from the catalogue, and the G2200 brochure PDF (the "Download the spec sheet" button appears once `brochure` is set).
8. Real photos (products, head office, fleet, team). The supplier's catalogue (page 25) has front, side and rear photos of the G2200.
9. Sector summaries and values wording.
10. Audience assumption: mostly mobile visitors in Libya.
11. Analytics: out of scope unless requested.
12. Official English spelling: the logo package README notes that older logos show "METHAQ"; the new identity and the brief use "Mithaq".
13. Review the Arabic copy added during the build (see Decisions).
14. Confirm that number ranges should read left to right inside Arabic text (see Decisions).
