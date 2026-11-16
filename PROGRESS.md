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
| 4 | Home | Planned |
| 5 | Sectors, Products and the product page | Planned |
| 6 | About, Partners and Contact (map card, WhatsApp Business button) | Planned |
| 7 | SEO, 404, `vercel.json`, pre-rendering, final checks | 404, `vercel.json`, pre-rendering and sitemap done; final checks planned |

Milestones 1–3 were built and checked together and share one commit.

## Stack

React 19.3 · Vite 8 · TypeScript 7 · Tailwind CSS 4.3 (`@theme` tokens in `src/index.css`) · React Router 8 (declarative `BrowserRouter`) · framer-motion 14 (light `LazyMotion` mode) · lucide-react · `@fontsource` (Noto Kufi Arabic, Barlow, Barlow Semi Condensed).

## Checks so far (milestones 1–3)

- `npm run build` passes (type-check, client build, 14 pre-rendered pages, `sitemap.xml`).
- Placeholder pages at 375 / 768 / 1280 px in both languages: no horizontal scroll, correct `lang`/`dir`, no console errors, no failed requests, no letter-spaced Arabic.
- Language switch (production build): overlay at ~50 ms, swap at ~350 ms, overlay gone at ~740 ms, content in by ~870 ms; path, query, hash and scroll position kept; header logo swaps; a second click is ignored; focus returns to the toggle; the live region announces; the choice is saved. Back/Forward keep the chosen language, also across a page reload.
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
- **Hosting**: `vercel.json` rewrites every address that is not a file to `/index.html` (as the brief asks) and uses `cleanUrls`. Unknown addresses therefore show the site's 404 page with HTTP status 200; if real 404 status codes are wanted later, the rewrite can be limited and a `404.html` added.
- **Fonts**: heading weights of both languages are preloaded (build plugin in `vite.config.ts`); the remaining weights and the other language's header logo are fetched when the browser is idle, so the switch never shows a font swap.
- **Form errors**: the palette has no red, so invalid fields get a heavier navy border plus a text message and an error summary.
- **Phone check**: 7–15 digits after removing spaces, dashes and a leading "+" (dots and brackets are tolerated too); Arabic-Indic digits typed on Arabic keyboards are converted to 0–9.
- **Copy added during the build** (not in the brief) is marked `// Added during the build` in `src/data/translations.ts`: accessibility labels, the toggle labels, page-opening kickers (e.g. "ما نورّده" / "What we supply"), About section titles, form placeholders and messages, the 404 kicker and SEO text. MOAD to review the Arabic.

## TODO for the client ([CONFIRM] items)

1. Slogan: كلمتنا ميثاق · "Our word is our pledge."
2. Head-office map coordinates (`contact.map.lat`, `lng`) and street address. Until then the Contact page shows the map card with the "Open in Google Maps" button.
3. Working hours. The Contact page shows "To be added" / "سيُضاف قريباً"; the footer leaves hours out.
4. Social media links (no icons are shown until real links exist).
5. Founding year and registration details (the About "Company facts" block stays hidden until then).
6. Partner names, logos, countries and sectors (the Partners page shows neutral "Partner logo" tiles until then).
7. Further products from the catalogue, and the G2200 brochure PDF (the "Download the spec sheet" button appears once `brochure` is set).
8. Real photos (products, head office, fleet, team). The supplier's catalogue (page 25) has front, side and rear photos of the G2200.
9. Sector summaries and values wording.
10. Audience assumption: mostly mobile visitors in Libya.
11. Analytics: out of scope unless requested.
12. Official English spelling: the logo package README notes that older logos show "METHAQ"; the new identity and the brief use "Mithaq".
13. Review the Arabic copy added during the build (see Decisions).
