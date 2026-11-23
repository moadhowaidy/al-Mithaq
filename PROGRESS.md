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
| 7 | SEO, 404, `vercel.json`, pre-rendering, final checks | Done (final review by six independent reviewers; every finding fixed or recorded below) |
| 8 | Link previews: a share image for every page and language, reachable absolute addresses, complete Open Graph and X tags | Done (three design directions and a judge; three independent reviewers; see "Link previews" below) |

Milestones 1–3 were built and checked together and share one commit. Milestones 4–6 were built in parallel (one builder and one independent reviewer per page group), then integrated: shared helpers moved into `src/components/ui/` (`Typeset.tsx`, `ChevronStrip` in `GatewayBand.tsx`, the reworked `ClipReveal`).

## Stack

React 19.3 · Vite 8 · TypeScript 7 · Tailwind CSS 4.3 (`@theme` tokens in `src/index.css`) · React Router 8 (declarative `BrowserRouter`) · framer-motion 14 (light `LazyMotion` mode) · lucide-react · `@fontsource` (Noto Kufi Arabic, Barlow, Barlow Semi Condensed).

## Checks (final production build)

- `npm run build` passes: type-check, client build, 14 pre-rendered pages, `sitemap.xml`, app shell and manifest from `src/data`. Script 127 KB and CSS 11 KB (brotli).
- SEO check of every pre-rendered page: one title and description, canonical, `hreflang` ar/en/x-default (Arabic); the sitemap lists all 14 addresses.
- Link-preview check of every pre-rendered page and the app shell (15): `og:image` is the page's own image on the site address, the file exists and is a 1200 × 630 PNG under 300 KB, width, height, type, `secure_url` and the description (in the page's language) are right, the X tags equal the Open Graph ones, `og:url` equals the canonical, and the tags sit in the first 4 KB of the page (in `<head>`, before the scripts and stylesheets). Every page also fetched as the WhatsApp, Facebook, X, LinkedIn, Telegram and Slack crawlers from a local server: right tags, image served as PNG under 300 KB. The build was replayed on Linux with Node 26 (Vercel's version for this project): identical output. Built once with the Vercel address as well: every address followed it.
- All 18 routes (the 14 pages, two filtered views, a pre-filled Contact address and a 404) at 375 / 768 / 1280 px, 54 runs: no horizontal scroll, correct `lang`/`dir`, no console errors, no failed requests, no letter-spaced Arabic, every image sized and loaded, exactly one h1.
- Brief rules on 15 pages at 375 and 1280, 30 runs: no gold or steel text on light grounds, phone numbers left to right, tap targets at least 44 px (the breadcrumb's "Home" is widened to 48 px by an invisible hit area), `wa.me` only on the Contact page (one link).
- Language switch, 15 runs on 9 pages (both directions, from the top and scrolled, 4× CPU throttling, reduced motion, Back/Forward): path, query, hash and the exact scroll position kept; header logo swaps; a second click is ignored; focus returns to the toggle; the live region announces; the choice is saved. Cover complete at ~300 ms, swap at ~340–410 ms, the 300 ms reveal always plays in full and the overlay leaves only when the panel is off screen (~770–1000 ms; ~2–2.5 s on a 4× slower CPU). Reduced motion: a crossfade of ~200–400 ms, no sweep. Back/Forward keep the chosen language, also across a page reload.
- Pre-rendered openings: with the script held back 4 s, page titles are visible by ~0.9–1.3 s and never vanish or replay when the app takes over.
- Mobile menu, at the top and after scrolling: full screen, opens from the inline end, the page behind it is inert, focus is trapped, Escape closes it and returns focus to the menu button, page scroll is locked while open.

## Deployment

- **Vercel project** `al-mithaq` in the team "moad's projects", deployed on 17 Nov 2026 (Vercel builds it with `npm run build`). Vercel makes a project's first deployment a Production one, so it lives at the project's own address: **https://al-mithaq-orpin.vercel.app** (publicly reachable; later deployments can be previews with `npx vercel deploy`). al-mithaq.com is **not** connected and no DNS was changed.
- Checked on the live site: every pre-rendered page is served as a file with the right `lang`, `dir` and title; `.html` addresses and trailing slashes redirect (308) to the clean address; "/", unknown prefixes and unknown pages fall back to the app shell (redirect or 404 page); security headers are set and `/assets/` is cached for a year; sitemap, robots and manifest are served; the language switch, the 404 page and the page-opening intro behave as on the local build.
- Link previews of that first deployment pointed at al-mithaq.com, which is not connected yet, so shared links showed no picture. Since milestone 8 the build takes the address from Vercel (`VERCEL_PROJECT_PRODUCTION_URL`): the vercel.app address now, al-mithaq.com once that domain is added to the project and the site is deployed again.
- **Milestone 8 deployed to Production on 18 Nov 2026** (commit 691ac34, `npx vercel deploy --prod`). The Vercel build log shows "link-preview images match src/data" and "site address: https://al-mithaq-orpin.vercel.app". Checked on the live site: all 15 pages fetched as the WhatsApp, Facebook, X, LinkedIn, Telegram and Slack crawlers carry their own `og:image` on https://al-mithaq-orpin.vercel.app, and every image answers 200 as `image/png` under 300 KB; robots.txt and the sitemap use the same address.
- **Vercel Authentication** is on for the project's other addresses (`al-mithaq-moads-projects-…vercel.app` and each deployment's own address ask for a Vercel login), so link previews only work from https://al-mithaq-orpin.vercel.app, which is public, and later from al-mithaq.com. Preview deployments cannot be tested in WhatsApp for the same reason.
- `vercel link` also connected the project to the GitHub repository `moadhowaidy/al-Mithaq` (this folder's `origin`). `main` is on GitHub, and every push to it deploys to Production automatically (since the footer signature on 17 Nov 2026); milestone 8 was pushed on 18 Nov 2026. Other branches get preview deployments, behind the Vercel login. `vercel link` also wrote a local `.env.local` with a Vercel token (git-ignored).

## Decisions (for review)

- **Brand assets** from `Mithaq_Web_Assets.zip` were copied unchanged into `public/`. The logo package README (clear space, minimum sizes, colours) is kept in `docs/`; its print PDFs and PNGs are not part of the website.
- **English spelling** is "Mithaq", held in `company` in `src/data/index.ts`. The brief's copy also contains the name inside some sentences (SEO titles, footer, form message); a spelling change means a search-and-replace for "Mithaq" in `src/data/`.
- **Pre-rendering** uses React 19's `renderToString` with React Router's `StaticRouter` (`src/entry-server.tsx` + `scripts/prerender.mjs`) instead of `vite-react-ssg`. Every page in both languages gets its own static HTML (`dist/<lang>/<page>.html`) with its own title, description, canonical, hreflang alternates and link preview (its own share image, see "Link previews"), so link previews on WhatsApp and social networks show the right page. In the browser the app then renders fresh on top (no hydration), so filtered views (`?sector=`) and the pre-filled quote form (`?product=`) are correct from the first frame. A CSS fallback shows the pre-rendered content if the script fails to start.
- **framer-motion light mode** (`LazyMotion` + `m.*`) keeps the script about 15 KB (gzipped) smaller, and key figures count up with a small frame loop instead of the animation engine. The whole script is 127 KB brotli-compressed (148 KB gzipped), most of it React itself.
- **Two contexts in `i18n.tsx`**: the language (`useLanguage`) and the running switch (`useLanguageTransition`), so the four phase changes of a switch never re-render the whole page mid-sweep.
- **Toggle**: the pill is always laid out left to right (`ع | EN`), so its gold segment travels in the same direction as the sweep. The header button uses the 44 px size to line up with the 44 px toggle inside the 80 px header; all other buttons are 52 px.
- **Saved language**: only the toggle writes `mithaq-lang` (as specified). Shared links always open in their own language. Back/Forward follow the language of the visit; if a Back/Forward step reloads the page, the saved choice is used.
- **Addresses without a language**: `/products` becomes `/<preferred>/products`; an unknown two-letter prefix (`/fr/products`) is replaced. Without JavaScript, `/` forwards to `/ar`.
- **Quote band**: the 50° cut is a chamfer on the inline-start top corner (the angle is exact: tan 50°). A full-height 50° edge would take most of a phone's width.
- **404**: navy page with the Gateway mark, `noindex`, no quote band.
- **Hosting**: `vercel.json` rewrites every address that is not a file to the app shell (`dist/index.html`, written as `/` because Vercel's `cleanUrls` expects destinations without `.html`), so deep links work on refresh. Pre-rendered pages are files and are served first. Unknown addresses show the site's 404 page with HTTP status 200; if real 404 status codes are wanted later, the rewrite can be limited and a `404.html` added. Verified on Vercel (17 Nov 2026, see "Deployment" below).
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

### Link previews (milestone 8)

- **Every page has its own share image** in both languages (12 images, 46–87 KB), so a link to the G2200 shows the G2200, a link to Contact shows the phone and email. Home keeps the official images from the logo package. Three design directions were drawn (editorial cover, a Gateway window, a product spec card); the editorial one won because it reads as a sibling of the official images: same navy, gold kicker and the identical Gateway band, and the layout of the site's own page openings. In WhatsApp's square crop it still shows the logo, the full title and the band.
- **What each image shows** (all words from `src/data`): Sectors: the eight sector icons. Products and the product page: the G2200 illustration, with two key figures on the product page. About: the title "Our name is our promise", the definition "Mithaq: a binding covenant" and the word ميثاق in gold. Partners and Contact: the Home hero's Gateway window (the dusk road seen through the M); Contact adds the phone and email (no WhatsApp number, which stays on the Contact page).
- **Arabic typesetting**: Latin names and figures read left to right inside Arabic, two-word phrases are kept whole ("رباعية العجلات"; split only as a last resort, which the generator reports), Arabic words are spaced as on the site, and Arabic is never letter-spaced. The Arabic G2200 title needs three lines (كانسة الطرق / G2200 / رباعية العجلات) and does not fit with its sector label above it, even at the 60 px minimum, so the label is left out and the title is set at 68 px; the English image keeps it.
- **On About in Arabic, ميثاق appears three times** (the logo, the definition, the gold word). Kept on purpose, since the page is about the name; easy to change.
- **Addresses**: every preview address is absolute and built from the site address at build time (`SITE_URL`, else Vercel's production domain, else al-mithaq.com); an invalid value stops the build. Image addresses carry a content hash, so whenever a platform reads a page again it fetches the changed image; a link already shared is refreshed with Facebook's Sharing Debugger or LinkedIn's Post Inspector.
- **Kept up to date**: `npm run og` renders the images from `src/data` and records what each was made from; `npm run build` (also on Vercel) stops if anything an image shows or is made from changed since (titles, leads, products, phone, email, logos, fonts…), until the images are rendered again and committed. A new product without an image only gets a note (its page shares the Home image). The generator uses Edge or Chrome already on the computer; Vercel never needs a browser.

## TODO for the client ([CONFIRM] items)

1. Slogan: كلمتنا ميثاق · "Our word is our pledge."
2. Head-office map coordinates [CONFIRM] (`contact.map.lat`, `lng`, copied from the pin of the map link by MOAD; never estimated) and street address. The map link itself is confirmed by the company. Until the coordinates are set, the Contact page shows the navy map card with "Open in Google Maps" only (no iframe, no "Get directions") and the structured data has no `geo`; once set, the embedded map, the directions button and `geo` appear by themselves.
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
15. Short labels (kickers) for the About and Partners page openings: the Partners opening and its share image repeat the title ("Partners / Our partners"), and the About image uses "About us". Also review the share images' descriptions ("{title}, {company}") and the Arabic About image (see "Link previews").
