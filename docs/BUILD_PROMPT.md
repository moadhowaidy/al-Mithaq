# Mithaq General Supplies: Website Build Prompt

Prepared by SwiftScale · 16 November 2026 · includes the company's contact data and the luxury direction

> Saved verbatim from the build session of 16 November 2026 so that every later session (and every build agent) works from the same brief. The live copy and data now live in `src/data/`; if this file and `src/data/` ever disagree, `src/data/` wins and this file is the original reference.

**How to use:**
1. Create an empty project folder and unzip `Mithaq_Web_Assets.zip` into it, so the folder has `public/brand`, `public/icons`, `public/patterns`, `public/illustrations` and `public/og`.
2. Paste everything below the line into Claude Code, Antigravity, Bolt.new or Cursor, opened in that folder.
3. Fill in any [CONFIRM] item you already know. The full list is in `<confirm_list>` near the end.

**Pages at a glance:** Home · Sectors · Products (with a page for each product) · About · Partners (new) · Contact. Each one is its own page with its own address, in Arabic (`/ar/...`) and English (`/en/...`).

---

Act as a Senior React Developer and UI/UX Designer. I need you to build a modern, responsive, luxury, bilingual (Arabic and English) website for Mithaq General Supplies (شركة ميثاق للتجهيزات العامة) using React, Vite, TypeScript, and Tailwind CSS. The company data comes first, then the brief, then how to work. Your task is at the end.

<business_data>

<company>
```json
{
  "name": { "ar": "شركة ميثاق للتجهيزات العامة", "en": "Mithaq General Supplies" },
  "shortName": { "ar": "ميثاق", "en": "Mithaq" },
  "slogan": { "ar": "كلمتنا ميثاق", "en": "Our word is our pledge." },
  "city": { "ar": "الخمس", "en": "Al-Khums" },
  "country": { "ar": "ليبيا", "en": "Libya" },
  "founded": null,
  "domain": "al-mithaq.com"
}
```
- What they do: supplies general equipment and services to companies and public bodies across eight sectors, with a special focus on roads and municipal services.
- Head office (المقر الرئيسي): Al-Khums (مدينة الخمس), Libya.
- English spelling: "Mithaq", as in the company email domain (al-mithaq.com) and the new logo. Keep the names in one constant in `src/data/index.ts`, so a spelling change is a one-line edit.
- Meaning of the name: ميثاق is the Arabic word for a covenant, a binding promise. The brand idea is "every delivery is a pledge kept".
- Slogan: كلمتنا ميثاق · "Our word is our pledge." [CONFIRM]
- Logo: "The Gateway", an M drawn as a gate standing over a road that runs to the horizon. The road is the empty space under the M, with five gold lane dashes.
- Principles and tone: calm, precise and dependable. Luxury comes from restraint and accuracy, not from big claims. Arabic is formal Modern Standard Arabic, written natively and proofread; English is plain and clear.
- Words to avoid: claims nobody has proven ("the best", "No. 1", "leading", "the largest", "100%") and sales pressure ("hurry", "limited offer"), because a false or pushy claim costs a procurement buyer's trust.
- Facts the site may state: the eight sectors, the G2200 specifications, the meaning of the name, the head-office city and the contact details below. Show no years of experience, client counts, certifications or partner brands until they are confirmed.
</company>

<sectors>
The order and names follow the company's current logo. The summaries are neutral descriptions of each category for MOAD to review [CONFIRM].

```json
[
  { "id": "oil-gas", "order": 1, "name": { "en": "Oil & Gas Supplies", "ar": "تجهيزات النفط والغاز" }, "summary": { "en": "Equipment and supplies for oil and gas sites and facilities.", "ar": "تجهيزات ومستلزمات لمواقع ومنشآت النفط والغاز." }, "icon": "/icons/sectors/01-oil-gas.svg", "iconWhite": "/icons/sectors-white/01-oil-gas.svg" },
  { "id": "heavy-machinery", "order": 2, "name": { "en": "Heavy Machinery & Equipment", "ar": "الآليات والمعدات الثقيلة" }, "summary": { "en": "Heavy machinery and equipment for construction, roads and industry.", "ar": "آليات ومعدات ثقيلة للإنشاءات والطرق والصناعة." }, "icon": "/icons/sectors/02-heavy-machinery.svg", "iconWhite": "/icons/sectors-white/02-heavy-machinery.svg" },
  { "id": "municipal-cleaning", "order": 3, "name": { "en": "Municipal & Cleaning Equipment", "ar": "معدات النظافة والخدمات البلدية" }, "summary": { "en": "Road sweepers and equipment for municipal and cleaning services.", "ar": "كانسات الطرق ومعدات الخدمات البلدية والنظافة." }, "icon": "/icons/sectors/03-municipal-cleaning.svg", "iconWhite": "/icons/sectors-white/03-municipal-cleaning.svg" },
  { "id": "road-traffic-safety", "order": 4, "name": { "en": "Road & Traffic Safety Equipment", "ar": "تجهيزات الطرق والسلامة المرورية" }, "summary": { "en": "Equipment for road works and traffic safety.", "ar": "تجهيزات أعمال الطرق والسلامة المرورية." }, "icon": "/icons/sectors/04-road-traffic-safety.svg", "iconWhite": "/icons/sectors-white/04-road-traffic-safety.svg" },
  { "id": "medical-rehabilitation", "order": 5, "name": { "en": "Medical & Rehabilitation", "ar": "التجهيزات الطبية والتأهيل" }, "summary": { "en": "Medical and rehabilitation equipment.", "ar": "تجهيزات طبية ومعدات تأهيل." }, "icon": "/icons/sectors/05-medical-rehabilitation.svg", "iconWhite": "/icons/sectors-white/05-medical-rehabilitation.svg" },
  { "id": "office-furniture", "order": 6, "name": { "en": "Office Supplies & Furniture", "ar": "التجهيزات المكتبية والإدارية" }, "summary": { "en": "Office supplies and furniture for companies and institutions.", "ar": "لوازم وأثاث مكتبي للشركات والمؤسسات." }, "icon": "/icons/sectors/06-office-furniture.svg", "iconWhite": "/icons/sectors-white/06-office-furniture.svg" },
  { "id": "spare-parts-maintenance", "order": 7, "name": { "en": "Spare Parts & Maintenance", "ar": "قطع الغيار والصيانة" }, "summary": { "en": "Spare parts and maintenance support for equipment.", "ar": "قطع الغيار وخدمات الصيانة للمعدات." }, "icon": "/icons/sectors/07-spare-parts-maintenance.svg", "iconWhite": "/icons/sectors-white/07-spare-parts-maintenance.svg" },
  { "id": "safety-ppe", "order": 8, "name": { "en": "Safety & PPE Equipment", "ar": "معدات السلامة والحماية" }, "summary": { "en": "Personal protective equipment and workplace safety supplies.", "ar": "معدات الحماية الشخصية ومستلزمات السلامة المهنية." }, "icon": "/icons/sectors/08-safety-ppe.svg", "iconWhite": "/icons/sectors-white/08-safety-ppe.svg" }
]
```
</sectors>

<products>
Only the G2200 is confirmed. Every value below comes from the supplier's spec sheet (catalogue page 25, "G2200 (Hummer Four-Wheel)"). More products will be added in the same shape when MOAD sends the catalogue [CONFIRM].

```json
[
  {
    "id": "g2200",
    "sector": "municipal-cleaning",
    "name": { "en": "G2200 Four-Wheel Road Sweeper", "ar": "كانسة الطرق G2200 رباعية العجلات" },
    "summary": {
      "en": "Four-wheel road sweeper with a 1.5–2.3 m electronically adjustable cleaning width, a 300 L water tank and a 240 L waste bin.",
      "ar": "كانسة طرق رباعية العجلات بعرض تنظيف 1.5–2.3 م قابل للتعديل إلكترونياً، وخزان مياه 300 لتر وحاوية نفايات 240 لتر."
    },
    "image": "/illustrations/g2200-side.svg",
    "photos": [],
    "brochure": null,
    "keyFigures": [
      { "value": "17,000", "unit": { "en": "m²/h", "ar": "م²/ساعة" }, "label": { "en": "Working efficiency", "ar": "كفاءة العمل" } },
      { "value": "1.5–2.3", "unit": { "en": "m", "ar": "م" }, "label": { "en": "Cleaning width", "ar": "عرض التنظيف" } },
      { "value": "300", "unit": { "en": "L", "ar": "لتر" }, "label": { "en": "Water tank", "ar": "خزان المياه" } },
      { "value": "240", "unit": { "en": "L", "ar": "لتر" }, "label": { "en": "Waste bin", "ar": "حاوية النفايات" } },
      { "value": "4–6", "unit": { "en": "h", "ar": "ساعات" }, "label": { "en": "Continuous operation", "ar": "تشغيل متواصل" } }
    ],
    "specs": [
      { "label": { "en": "Main brush", "ar": "الفرشاة الرئيسية" }, "value": { "en": "790 mm × 1", "ar": "790 مم × 1" } },
      { "label": { "en": "Side brushes", "ar": "الفرش الجانبية" }, "value": { "en": "600 mm × 2 (front) · 500 mm × 2 (rear)", "ar": "600 مم × 2 (أمامية) · 500 مم × 2 (خلفية)" } },
      { "label": { "en": "Cleaning width", "ar": "عرض التنظيف" }, "value": { "en": "1500–2300 mm, electronically adjustable within the range", "ar": "1500–2300 مم، قابل للتعديل إلكترونياً ضمن هذا المدى" } },
      { "label": { "en": "Working efficiency", "ar": "كفاءة العمل" }, "value": { "en": "17,000 m²/h", "ar": "17,000 م²/ساعة" } },
      { "label": { "en": "Continuous operating time", "ar": "مدة التشغيل المتواصل" }, "value": { "en": "4–6 h", "ar": "4–6 ساعات" } },
      { "label": { "en": "Gradeability", "ar": "القدرة على صعود المنحدرات" }, "value": { "en": "30%", "ar": "30%" } },
      { "label": { "en": "Water tank", "ar": "خزان المياه" }, "value": { "en": "300 L", "ar": "300 لتر" } },
      { "label": { "en": "Waste bin", "ar": "حاوية النفايات" }, "value": { "en": "240 L", "ar": "240 لتر" } },
      { "label": { "en": "Drive power", "ar": "قوة الدفع" }, "value": { "en": "3000 W AC motor", "ar": "محرك تيار متردد 3000 واط" } },
      { "label": { "en": "Main brush + side brush power", "ar": "قدرة الفرشاة الرئيسية والجانبية" }, "value": { "en": "1000 W + 100 W × 4", "ar": "1000 واط + 100 واط × 4" } },
      { "label": { "en": "Shaking + blower power", "ar": "قدرة الهزاز والمنفاخ" }, "value": { "en": "200 W × 4 + 500 W × 4", "ar": "200 واط × 4 + 500 واط × 4" } },
      { "label": { "en": "Braking", "ar": "نظام الكبح" }, "value": { "en": "Hydraulic dual disc brakes + intelligent electronic braking", "ar": "فرامل قرصية هيدروليكية مزدوجة + كبح إلكتروني ذكي" } },
      { "label": { "en": "Power source", "ar": "مصدر الطاقة" }, "value": { "en": "200 A Tianneng maintenance-free battery", "ar": "بطارية Tianneng بقدرة 200 أمبير بدون صيانة" } },
      { "label": { "en": "Tyres", "ar": "الإطارات" }, "value": { "en": "400-08 solid tyres × 4", "ar": "4 إطارات مصمتة 400-08" } },
      { "label": { "en": "Dimensions (L × W × H)", "ar": "الأبعاد (الطول × العرض × الارتفاع)" }, "value": { "en": "3200 × 2200 × 2750 mm", "ar": "3200 × 2200 × 2750 مم" } },
      { "label": { "en": "Machine weight", "ar": "وزن الآلة" }, "value": { "en": "1150 kg", "ar": "1150 كغ" } },
      { "label": { "en": "High-pressure pump", "ar": "مضخة الضغط العالي" }, "value": { "en": "1500 W", "ar": "1500 واط" } },
      { "label": { "en": "High-pressure hose", "ar": "خرطوم الضغط العالي" }, "value": { "en": "13 m, imported", "ar": "13 م، مستورد" } },
      { "label": { "en": "Mist cannon range", "ar": "مدى مدفع الرذاذ" }, "value": { "en": "10 m", "ar": "10 م" } },
      { "label": { "en": "Rear-view camera", "ar": "كاميرا الرؤية الخلفية" }, "value": { "en": "7.2-inch HD display, rear HD camera", "ar": "شاشة HD مقاس 7.2 بوصة، كاميرا خلفية HD" } },
      { "label": { "en": "Special configuration", "ar": "تجهيزات خاصة" }, "value": { "en": "8 kg industrial dry-powder fire extinguisher × 3", "ar": "3 طفايات حريق بودرة صناعية 8 كغ" } }
    ]
  }
]
```
</products>

<partners>
No partner has been confirmed yet [CONFIRM]. The page is built now and fills in automatically once partners are added to the `partners` array. Each partner will have: `id`, `name`, `logo` (file in `public/partners/`), `group` (one of the group ids), `country`, `sectors` (sector ids) and `website`.

```json
{
  "partnerGroups": [
    { "id": "manufacturer", "name": { "en": "Manufacturers & brands", "ar": "المصنّعون والعلامات التجارية" } },
    { "id": "supplier", "name": { "en": "Suppliers & distributors", "ar": "الموردون والموزعون" } },
    { "id": "service", "name": { "en": "Service & maintenance partners", "ar": "شركاء الخدمة والصيانة" } }
  ],
  "partners": []
}
```
</partners>

<contact>
```json
{
  "whatsappBusiness": { "label": { "ar": "واتساب أعمال", "en": "WhatsApp Business" }, "display": "+218 92 484 1963", "digits": "218924841963" },
  "phones": [
    { "label": { "ar": "الهاتف", "en": "Phone" }, "display": "+218 91 108 7744", "tel": "+218911087744" }
  ],
  "email": "info@al-mithaq.com",
  "headOffice": { "label": { "ar": "المقر الرئيسي", "en": "Head office" }, "value": { "ar": "مدينة الخمس، ليبيا", "en": "Al-Khums, Libya" }, "street": null },
  "map": {
    "link": "https://maps.app.goo.gl/JxddCUthB8No13AE7?g_st=iw",
    "lat": null,
    "lng": null
  },
  "hours": null,
  "social": []
}
```
- The WhatsApp Business number is for WhatsApp chats, and its button appears on the Contact page only (company rule). The phone number is for calls.
- The email appears in the footer, on the Contact page and on product pages, where visitors can request a spec sheet by email.
- The map link opens the head office in Google Maps. Its coordinates are not confirmed yet [CONFIRM]. When `lat` and `lng` are filled in, the Contact page embeds the map (format in `<examples>`). Until then it shows the map card with the "Open in Google Maps" button, so the layout is final either way.
- Street address [CONFIRM] · Working hours [CONFIRM] · Social links [CONFIRM] (real links only; leave the icons out until links exist).
</contact>

<translations>
- Languages: Arabic (default, right-to-left) and English (left-to-right). The full interface copy in both languages is in `<copy>`.
- Each language has its own address prefix: `/ar/...` and `/en/...`, with the same slugs in both, so switching language keeps the visitor on the same page.
- The company name stays "ميثاق" in Arabic text and "Mithaq" in English text. Product names keep "G2200" in Latin characters in both languages.
- Use Western digits (0–9) in both languages, because that is how specs and phone numbers are read in Libya. Always show phone numbers left to right (`<span dir="ltr">`), because in RTL text the "+" otherwise jumps to the end.
- MOAD reviews the Arabic. Write any new Arabic copy natively in the same formal, calm tone.
</translations>

<assets>
All files are already in `public/` (from `Mithaq_Web_Assets.zip`). Use them as files; do not redraw or recolour the logo.
- `public/brand/mithaq-arabic-reversed.svg` (1085 × 368): header logo when the site is in Arabic (on the navy header)
- `public/brand/mithaq-english-reversed.svg` (1212 × 368): header logo when the site is in English
- `public/brand/mithaq-arabic-colour.svg`, `mithaq-english-colour.svg`: the same logos for light backgrounds
- `public/brand/mithaq-horizontal-reversed.svg` (1530 × 368): footer logo (bilingual, on navy)
- `public/brand/mithaq-horizontal-colour.svg`, `mithaq-vertical-colour.svg`, `mithaq-vertical-reversed.svg`: About page and 404
- `public/brand/mithaq-symbol-colour.svg`, `mithaq-symbol-reversed.svg`, `mithaq-symbol-small-colour.svg`: the Gateway mark alone (the small version below 32 px)
- `public/icons/sectors/*.svg` (navy + gold, for light backgrounds) and `public/icons/sectors-white/*.svg` (white + gold, for navy): the eight sector icons
- `public/patterns/gateway-band-dark-tile.svg` (tone-on-tone navy with gold dashes, for navy sections and above the footer), `gateway-band-light-tile.svg` (for light sections), `gateway-band-gold-tile.svg` (sparingly): seamless tiles, 781.714 × 360, used with `background-repeat: repeat-x`
- `public/patterns/work-zone-chevrons.svg`: yellow-and-dark safety stripes, product panels only
- `public/illustrations/hero-road.svg` (1600 × 900): the dusk road shown inside the Gateway window in the Home hero
- `public/illustrations/g2200-side.svg` (1177 × 624): the G2200 sweeper in Mithaq livery, transparent background
- `public/og/og-ar.png`, `public/og/og-en.png`: social share images, 1200 × 630
- `public/favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`, `icon-512.png`
- Real photos of products, the head office, the fleet and the team: [CONFIRM]. The supplier's catalogue (page 25) shows front, side and rear photos of the G2200, so the original image files can be requested from the supplier. When MOAD adds photos to `assets-raw/`, convert them to WebP in `public/photos/` and list them in the product's `photos` array.
</assets>

</business_data>

<context>
Mithaq launched its new visual identity, "The Gateway", in November 2026. The website is the first place that identity lives online. It presents the eight sectors, the product catalogue (starting with the G2200 road sweeper) and the company's partners, and it turns visitors into quote requests.

The goal is the most refined equipment-supplier website in Libya: luxury expressed through restraint, precision and real information, not decoration. Visitors are procurement and project staff at companies, municipalities and contractors, mostly in Libya and mostly on mobile phones [CONFIRM], plus foreign manufacturers and suppliers who read the English version. Success means quote requests: quote-form submissions and WhatsApp Business chats from the Contact page, calls and emails.

The site's signature moment is the language switch. Pressing the language button sends one animated sweep across the whole page; the page "passes through the gateway" and comes out in the other language and the other reading direction.

These rules come from SwiftScale's previous luxury builds and apply here:
- Every page is its own page with its own address, not a section of the home page.
- The WhatsApp button lives on the Contact page only, and the Contact page shows the head office on Google Maps.
- All text comes from `src/data/`, with nothing hard-coded, so MOAD can correct any line in one place.
- Facts only: no invented numbers, clients, partners or testimonials.
- Arabic is proofread and never letter-spaced, because one Arabic typo ruins a luxury impression.
</context>

<project_overview>
I am building a luxury bilingual corporate catalogue website named "Mithaq General Supplies". The main goal of the site is to present the company's eight sectors and its products, and to turn visitors into quote requests.
- **Audience:** procurement and project teams at Libyan companies, municipalities and contractors; foreign manufacturers looking for a Libyan partner.
- **Languages:** Arabic (default, RTL) and English (LTR), each at its own address (`/ar`, `/en`).
- **Domain:** al-mithaq.com
- **Pages:** six separate pages (Home, Sectors, Products, About, Partners, Contact), a page for each product, and a 404 page.
</project_overview>

<design_style>
- **Vibe:** luxury, engineered, assured. Deep navy grounds, one precise line of gold, generous space and slow, cinematic motion. It should feel like a premium industrial brand, not a catalogue.
- **Primary Color:** Covenant Navy #0E2240 (from the logo) · **Accent:** Signal Gold #EAA620 (from the logo) · **Background:** Lane White #F6F3EC (a warm, very light tint)
- **Font Style:**
  - Arabic: Noto Kufi Arabic, weights 900/800/700 for headings and 400/500 for body text. Its geometric Kufi shapes match the straight cuts of the M.
  - Latin: Barlow 700/600 for headings and 400/500 for body text. It is the logo's Latin typeface and it comes from highway-sign lettering.
  - Labels: Barlow Semi Condensed 600, uppercase, letter-spacing 0.28em (English only; Arabic labels use Noto Kufi 700 with no letter-spacing, because spacing breaks the joined letters).
  - Self-host all fonts with `@fontsource` and preload the heading weights of both languages, so the new language appears instantly when the visitor switches.
- **Animations:** Use framer-motion for smooth entry animations: one orchestrated hero entrance, slow fade-up reveals on scroll (700 ms, ease `[0.22, 1, 0.36, 1]`, 80 ms stagger, once per element), the language transition described in `<language_transition>`, and respect for prefers-reduced-motion everywhere.
- **Icons:** Use lucide-react with a 1.5 stroke width for a finer line (Menu, X, ArrowRight, Phone, Mail, MapPin, MessageCircle, Download, Clock, ExternalLink). The eight sector icons are the provided SVG files, not lucide.

Tokens (use only these colours, on every page; opacity variants are allowed for lines, glows and overlays):
```
primary     #0E2240  header, page openings, headings, body text, footer
background  #F6F3EC  page background, light sections
accent      #EAA620  primary buttons, lane dashes, hairlines and section numbers on navy
muted       #4E5D70  secondary text on light backgrounds
asphalt     #1D2228  product stages and product page hero
steel       #8D98A5  secondary text and lines on navy only
surface     #FFFFFF  cards, inputs
line        #DDD6C8  hairlines and borders on light backgrounds
```
- Contrast (measured):
  - Navy on Lane White 14.3:1 and navy on white 15.9:1, for all body text.
  - Muted on Lane White 6.1:1 and on white 6.7:1, for secondary text.
  - Lane White on navy 14.3:1 and white on navy 15.9:1, for text on navy.
  - Gold on navy 7.6:1 and gold on asphalt 7.6:1, so gold text and hairlines are used on dark grounds freely.
  - Navy on gold 7.6:1, so primary buttons are gold with navy text.
  - Steel on navy 5.4:1, for secondary text on navy.
  - Gold on Lane White is 1.9:1 and steel on Lane White 2.6:1, so neither is ever used for text, icons or focus rings on light backgrounds. Gold appears there only as a button background or a decorative dash.
- Type scale (desktop / mobile):
  - H1: English Barlow 700 72/44 px, line-height 1.02; Arabic Noto Kufi 900 64/40 px, line-height 1.35.
  - H2: English 48/32 px; Arabic 42/30 px.
  - Labels and kickers: English 13 px; Arabic 15 px.
  - Body: 17 px. Line-height 1.7 in English and 1.9 in Arabic, because Arabic needs more room for dots and marks. Text columns are at most 640 px wide.

Luxury rules (each with its reason):
1. **Dark and light rhythm.** The header and every page opening are navy, content sections are Lane White, and the quote band and footer are navy again. Alternating deep and light sections with plenty of air is what reads as premium.
2. **Gold stays scarce.** Use it for the primary button, the lane dashes, 1 px hairlines under kickers on navy, section numbers and link underlines. Gold everywhere stops looking precious.
3. **Space is the main luxury signal.** Section padding is 128 px on desktop and 80 px on mobile, the container is 1200 px, and nothing is cramped.
4. **Editorial section openers.** Home sections open with a number, a kicker and a title (for example "01 · Our eight sectors" / "01 · قطاعاتنا الثمانية"). Numbering gives the page a crafted, deliberate structure.
5. **Hairlines over heavy boxes.** Use 1 px lines (`line` on light, steel at 30% on navy) instead of thick borders. Cards are white with a 1 px `line` border, radius 16 px, and a soft shadow only on hover: `0 16px 40px rgba(14, 34, 64, 0.10)`.
6. **Depth without clutter.** Add a very subtle grain on navy sections (inline SVG noise at 3% opacity) and a soft dusk glow behind the hero window (a radial gradient of gold at 12% opacity).
7. **Calm motion.** Images reveal with a clip wipe in the reading direction, key figures count up once when they enter the screen, and the hero road drifts with a parallax of at most 24 px. No bounce or spring overshoot, because calm motion signals control.
8. **Real imagery only.** Use real photographs when they arrive, graded with a cool navy-and-dusk treatment for consistency; until then, use the provided illustrations. Never use stock photos of other companies' machines, because that is a false claim.
9. **Fine details.** Links get a gold underline (on navy) or navy underline (on light) that draws in from the reading start. Buttons are filled by a sweep from the inline start on hover. Focus rings are always visible.
10. **Speed is part of luxury.** Fast loading and no layout shift: set width and height on every image and logo.

- Logo:
  - Header (navy): the Arabic reversed logo in Arabic and the English reversed logo in English, 44 px tall on desktop (about 130 px and 145 px wide) and 36 px on mobile. The swap happens at the midpoint of the language transition.
  - Footer: the bilingual reversed logo, 48 px tall.
  - About page: the vertical colour logo on Lane White.
  - Social image: `/og/og-ar.png` or `/og/og-en.png`, depending on the language. Favicon: `/favicon.svg`, with `/favicon-32.png` and `/apple-touch-icon.png`.
  - Never mirror the logo or the Gateway mark in RTL. Only directional icons (arrows, chevrons) flip.
- Shape: buttons are pills, 52 px tall, with 28 px side padding; inputs radius 12 px, 52 px tall; cards radius 16 px; container max-width 1200 px.
- Graphic devices (from the identity):
  - The Gateway band: the dark tile along the bottom edge of navy page openings and above the footer, 40 px tall (`background-size: auto 40px; background-repeat: repeat-x`).
  - Lane dashes: a row of gold rounded bars, 40 × 6 px with 32 px gaps, as dividers on navy.
  - The 50° road angle for diagonal cuts, for example the leading edge of the quote band.
  - Work-zone chevrons, used sparingly, only on product panels.
- Language toggle: SwiftScale's animated full-screen toggle, here a 50° navy sweep with gold edges, about 720 ms long, that switches language, direction and address at its midpoint. It remembers the visitor's choice and fades instead when reduced motion is on. The full spec is in `<language_transition>`.
</design_style>

<language_transition>
**Concept: "Through the Gateway" (عبر البوابة).** The language switch is the site's signature. A navy panel with gold edges sweeps across the whole screen in the reading direction of the language being opened: left to right when opening English, right to left when opening Arabic. Its edges lean at 50°, the logo's road angle, and rows of gold lane dashes ride along them like road markings rushing past. While the screen is covered, the Gateway mark appears in the centre with the name of the new language, and its lane dashes light up one after another toward the horizon. Underneath, the page switches language, direction, fonts, header logo and address. The panel then keeps going in the same direction and reveals the page in the new language, whose headings slide in from the new reading side.

**The toggle (`LanguageToggle.tsx`):**
- A pill, 44 px tall (the minimum tap size), with two labels: `ع` and `EN`, and a 1 px Lane White outline at 40% opacity on the navy header. The active label sits in a gold segment with navy text; the other is Lane White text. A small gold dash (14 × 3 px) sits under the inactive label and slides 6 px on hover and focus, as a hint of movement.
- It is a real link to the same page in the other language (`/ar/products` ↔ `/en/products`), with `hreflang`, so it also works without JavaScript. With JavaScript, the click runs the transition instead of a plain page load.
- `aria-label`: "Switch to English" when Arabic is active, and "التبديل إلى العربية" when English is active. Put `lang` on the link to match its label (`lang="en"` or `lang="ar"`), so screen readers pronounce it correctly.
- Placement: in the header at the inline end, next to the "Request a quote" button. On mobile it is in the header and repeated in the full-screen menu.

**Timeline (720 ms total, ease `cubic-bezier(0.76, 0, 0.24, 1)` for the panel):**

| Time | What happens |
|---|---|
| 0 ms | Click. Ignore further clicks until the end. The overlay becomes visible and blocks pointer events. |
| 0–300 ms | Cover: the skewed navy panel moves from off-screen (−100% of its width) to 0, entering from the start side of the new language. |
| 200–320 ms | The Gateway mark (Lane White with gold dashes, 112 px wide) fades in and scales from 0.92 to 1, with the new language's name under it: "ENGLISH" in Barlow Semi Condensed 600 with 0.3em tracking, or "العربية" in Noto Kufi Arabic 800. |
| 320 ms | Swap, fully covered: navigate to the same path with the other language prefix (keeping query and hash, no scroll reset), set `<html lang dir>`, swap the header logo, save the choice and update the live region. |
| 320–420 ms | Hold: the mark's five lane dashes light up from bottom to top (opacity 0.3 → 1, 20 ms apart). |
| 420–720 ms | Reveal: the panel continues from 0 to +100% in the same direction. The mark fades out by 520 ms. |
| 540–860 ms | The page content enters: the main wrapper fades in and slides 24 px from the inline-start side (from the right in Arabic, from the left in English), with section headings staggered 40 ms apart. |

**How it is built:**
- The panel is a `motion.div` inside a fixed, full-screen overlay. It is full height, `width: calc(100vw + 100vh)` and centred with `left: -50vh`, so its skewed edges clear the viewport on any screen shape, phones in portrait included. It uses `skewX: -40` for the English sweep and `skewX: 40` for the Arabic sweep: skewing 40° from vertical gives the logo's 50° road angle, leaning forward in the direction of travel.
- Animate `x` between `"-100%"`, `"0%"` and `"100%"` (mirrored for Arabic). Percentages refer to the panel's own width, which is exactly enough to take it fully off-screen. Let framer-motion own the whole transform, because a CSS `transform` would be overwritten by the animated `x`.
- Both vertical edges of the panel carry an 8 px solid gold strip and, 24 px inside it, a 6 px strip of lane dashes: `background: repeating-linear-gradient(to bottom, #EAA620 0 40px, transparent 40px 76px)`. They are children of the skewed panel, so they follow the 50° edges. Inside the overlay use physical `left`/`right`, not start/end, because the document direction flips in the middle of the animation.
- The mark and the language name sit in a separate, unskewed layer centred in the viewport.
- Animate only `transform` and `opacity`, and add `will-change: transform` only while the transition runs, so it stays at 60 fps on mid-range phones.
- Keep the state in the language context as a small state machine: `idle → covering → swapping → revealing → idle`.
- Use `navigate(newPath, { replace: true, preventScrollReset: true })` so the visitor stays at the same scroll position on the same page. If the app scrolls to the top on route changes, skip that when only the language prefix changed.
- The `<main>` wrapper uses `key={lang}`, so its entrance replays in the new language (opacity and 24 px slide, 220 ms delay after the swap, 320 ms duration).
- Back and Forward: the language follows the visitor's saved choice. If a Back or Forward step lands on an address in the other language, replace it with the same page in the saved language, without the sweep, so the site never flips back unexpectedly.
- Reduced motion: no panel and no mark. The main content crossfades over 200 ms (opacity only) and the swap happens at the midpoint.
- Accessibility: the overlay is `aria-hidden`. After the swap, a polite live region announces "English version" or "النسخة العربية", and focus returns to the toggle.
- Persistence: the toggle saves the choice in `localStorage` under the key `mithaq-lang`. Opening `/` redirects to the saved language, then to the browser language (`ar*` → Arabic, `en*` → English), then to Arabic. A shared link with a language prefix always opens in that language.

**Sketch** (adapt freely, keep the timings and geometry):
```tsx
// src/components/layout/LanguageTransition.tsx
import { motion } from "framer-motion";
import { useLanguage } from "../../data/i18n";
import GatewayMark from "../ui/GatewayMark";

const EASE = [0.76, 0, 0.24, 1] as const;

export default function LanguageTransition() {
  const { phase, target } = useLanguage(); // "idle" | "covering" | "swapping" | "revealing"
  if (phase === "idle") return null;
  const toEn = target === "en"; // English sweeps left → right, Arabic right → left
  return (
    <div aria-hidden="true" className="fixed inset-0 z-[100] overflow-hidden">
      <motion.div
        className="absolute inset-y-0 bg-primary"
        style={{ left: "-50vh", width: "calc(100vw + 100vh)", skewX: toEn ? -40 : 40 }}
        initial={{ x: toEn ? "-100%" : "100%" }}
        animate={{ x: phase === "revealing" ? (toEn ? "100%" : "-100%") : "0%" }}
        transition={{ duration: 0.3, ease: EASE }}
      >
        {/* left and right edges: 8 px gold strip + lane-dash strip 24 px inside it */}
      </motion.div>
      {/* unskewed centre layer: <GatewayMark /> and the new language's name, timed as in the table */}
    </div>
  );
}
// switchLanguage() in i18n.tsx: return if phase !== "idle"; reduced motion → 200 ms crossfade.
// Otherwise: "covering" → at 320 ms swap and "swapping" → at 420 ms "revealing" → at 720 ms "idle".
```

**The Gateway mark as inline SVG** (`src/components/ui/GatewayMark.tsx`). It is used in the transition, the hero window and the 404 page, so it never needs a network request:

```tsx
// viewBox and paths are the official geometry of the logo; do not edit them
const GATE = "0,630 56,0 196,0 350,245 504,0 644,0 700,630 546,630 350,385 154,630";
const DASHES = [
  "M331.76 621.42 L368.24 621.42 L364.46 572.42 L335.54 572.42 Z",
  "M337.71 544.25 L362.29 544.25 L359.79 511.91 L340.21 511.91 Z",
  "M341.64 493.31 L358.36 493.31 L356.71 471.97 L343.29 471.97 Z",
  "M344.24 459.70 L355.76 459.70 L354.68 445.61 L345.32 445.61 Z",
  "M345.95 437.51 L354.05 437.51 L353.33 428.21 L346.67 428.21 Z",
];
// Render: <svg viewBox="0 0 700 630"> <polygon points={GATE} fill={markColor}/> {DASHES.map(d => <path d={d} fill="#EAA620"/>)} </svg>
// markColor: #0E2240 on light backgrounds, #F6F3EC on navy. Dashes are always gold.
```
</language_transition>

<pages_and_features>
**Rules for every page:**
- Header: navy, sticky, 80 px tall. Once the page scrolls it becomes navy at 95% opacity with a backdrop blur and a 1 px gold hairline at 40% opacity along its bottom edge. It holds the reversed logo at the inline start, the six links (Home, Sectors, Products, About, Partners, Contact) in Lane White, and the "Request a quote" button (gold with navy text) and the language toggle at the inline end. The active link has `aria-current="page"`, weight 700 and a gold dash under it.
- Mobile header: logo, toggle and a menu button. The menu opens a full-screen navy panel that slides in from the inline-end side, with the six links at 32 px (staggered in), the quote button, and the phone number and email at the bottom.
- Page opening: every page except Home starts with a navy page hero: a gold kicker, the H1, a one-line lead, and the dark Gateway band along its bottom edge. This gives every page the same premium entrance.
- Footer: navy, with the dark Gateway band along its top edge. It has the bilingual reversed logo with the slogan, three columns (Pages; Sectors with the eight links; Contact with the phone number, email and head office) and a bottom bar: "© 2026 Mithaq General Supplies" and "al-mithaq.com".
- Primary action on every page: "Request a quote". It goes to `/<lang>/contact#quote`, adding `?product=<id>` or `?sector=<id>` when pressed from a product or sector, so the form arrives pre-filled.
- WhatsApp appears only on the Contact page: no WhatsApp links on other pages and no floating WhatsApp button. This is the company's rule.
- Quote band: the last section before the footer on every page except Contact. A navy band with a 50° cut on its inline-start edge, the title "Need equipment for your project?", one line of body text and the quote button.
- Routes: `/:lang/...` with lang `ar` or `en`. `/` and any unknown language redirect as described in `<language_transition>`. When an address has a hash (such as `#quote`), scroll to that element after the page renders.

**1. Home (`/ar`, `/en`)**
1. Hero (navy, at least 640 px tall and up to the full viewport height below the header): the text sits on the inline-start side and the Gateway window on the inline-end side (on mobile, the window comes first, 300 px tall).
   - The Gateway window is an SVG (`viewBox="0 0 700 630"`) with the `GATE` polygon as its clip path. Inside the clipped group, place `<image href="/illustrations/hero-road.svg" x="0" y="0" width="700" height="630" preserveAspectRatio="xMidYMid slice"/>`; the horizon and the setting sun then sit in the bridge of the M, and the road in the picture runs toward the logo's own road.
   - Draw the five gold dashes outside the clipped group, because they sit in the road under the M, which is empty space in the logo. On the navy hero they read gold on navy.
   - The dashes light up from bottom to top in a 2.4 s loop, like runway lights heading for the horizon. The road image drifts with a parallax of at most 24 px. Both stop when reduced motion is on.
   - A soft dusk glow (radial gold at 12% opacity) sits behind the window.
   - Entrance: the window reveals upward (clip from 0 to full height, 900 ms), then the kicker, headline, subline and buttons rise in, 80 ms apart.
   - Kicker "Al-Khums · Libya", headline, subline, body, and two buttons: "Request a quote" (primary, gold) and "Browse products" (Lane White outline).
2. 01 · Our eight sectors (Lane White): a 4 × 2 grid of white cards (2 × 4 on mobile), each with its icon, number, name and an arrow. Each links to `/<lang>/sectors#<id>`. On hover the card lifts 4 px, a gold hairline draws across its top edge, and the arrow slides 4 px in the reading direction.
3. 02 · Featured product (full-width asphalt stage): `g2200-side.svg` large, the work-zone chevrons along the bottom edge, the five key figures in a row (value in Barlow 700 at 44 px in Lane White, unit in gold, counting up once), and two buttons: "View details" (to `/<lang>/products/g2200`, Lane White outline) and "Request a quote" (to `/<lang>/contact?product=g2200#quote`).
4. 03 · The pledge (Lane White, centred, generous space): the slogan large in Arabic, with the English line under it, then three short pillars separated by hairlines (Eight sectors · Clear specifications · A promise we keep).
5. 04 · Our partners: a row of partner logos (neutral placeholder tiles until partners are confirmed) and a link to `/<lang>/partners`.
6. Quote band.

**2. Sectors (`/<lang>/sectors`)**
1. Page hero: title, intro.
2. Eight sector blocks in order, alternating sides, each with its own anchor (`#oil-gas` and so on): a large decorative number ("01"–"08", Barlow 300 at 120 px in the `line` colour, `aria-hidden`), the icon on a white card, the name, the summary, and either chips linking to that sector's products (`/<lang>/products?sector=<id>`) or, when the sector has no product yet, the button "Request a quote for this sector" (to `/<lang>/contact?sector=<id>#quote`).
3. Quote band.

**3. Products (`/<lang>/products`)**
1. Page hero: title, intro.
2. Filter chips: All plus the eight sectors, kept in sync with `?sector=<id>` so a filtered view can be shared. Use a horizontal scroll row on mobile.
3. Product grid: cards with the image on an asphalt stage, sector name, product name, three key figures, "View details" and "Request a quote".
4. A final card: "More products are on the way" with "Ask for the full catalogue", linking to the quote action.
5. Quote band.

**3b. Product page (`/<lang>/products/:id`)**
1. Hero (asphalt instead of navy, as a product stage): breadcrumb (Home / Products / product name), product name, sector link, summary, the image with a clip-wipe reveal, and the key figures.
2. Technical specifications: a two-column table (label and value in the current language) on white, with zebra rows in Lane White and hairline separators. On desktop, a sticky side card holds "Request a quote for this product" (to the Contact page with the product pre-selected), "Request the spec sheet by email" (a `mailto:` to the company email with the product in the subject), and "Download the spec sheet", which appears only when `brochure` is set [CONFIRM].
3. Back to the sector: a link to `/<lang>/sectors#<sector>`.
4. Quote band.
- An unknown id shows the 404 page.

**4. About (`/<lang>/about`)**
1. Page hero: "Our name is our promise".
2. The meaning of the name, as an editorial feature: the word ميثاق set very large in Noto Kufi 900, with the definition beside it ("ميثاق: عهدٌ مُلزِم" · "Mithaq: a binding covenant") and a short paragraph.
3. What we do: the company line, the head office in Al-Khums, and the eight sectors as small icon chips.
4. Our values: Commitment, Clarity, Readiness and Safety, each with one line, in a grid separated by hairlines [CONFIRM wording].
5. The story behind the logo: the vertical colour logo large, with a short caption about the gate standing over a road to the horizon.
6. Company facts: founding year and registration [CONFIRM]. Hide this block until the facts exist.
7. Quote band.

**5. Partners (`/<lang>/partners`) — new page**
1. Page hero: "Our partners" and "The manufacturers and suppliers behind our eight sectors."
2. Partner groups (Manufacturers & brands; Suppliers & distributors; Service & maintenance partners). Each group shows a grid of tiles with the logo in greyscale that turns to full colour on hover, plus name, country and sectors. When a group is empty, show three neutral placeholder tiles labelled "Partner logo" and list the gap in PROGRESS.md.
3. Become a partner: "Are you a manufacturer or supplier in one of our sectors?" with a button that opens an email to the company address with the subject "Partnership enquiry".
4. Quote band.

**6. Contact (`/<lang>/contact`)**
1. Page hero: title and intro.
2. Two columns on desktop (stacked on mobile):
   - Contact details, as a list separated by hairlines:
     - WhatsApp Business, with the only WhatsApp button on the site: "Chat on WhatsApp Business" (gold), opening a chat with the greeting in `<copy>`.
     - Phone, as a `tel:` link.
     - Email, as a `mailto:` link.
     - Head office: "Al-Khums, Libya", with an "Open in Google Maps" link.
     - Hours, which shows "To be added" (Arabic: "سيُضاف قريباً") while it is still [CONFIRM], so the layout is final.
   - Quote form (`id="quote"`) on a white card:
     - Fields: full name, company or organisation, phone, sector (select), product (optional select filtered by sector), quantity, request details.
     - It is pre-filled from `?product=` and `?sector=`, and validated on submit with inline messages.
     - Submit builds the quote message (format in `<examples>`) and opens it in WhatsApp Business. A secondary link, "or send by email", opens a `mailto:` with the same text.
     - There is no backend.
3. Head office map, full width with radius 16 px:
   - When `contact.map.lat` and `lng` are set, embed the Google map (format in `<examples>`) with a floating card "Head office · Al-Khums, Libya" and the "Open in Google Maps" button.
   - Until then, show the map card: a navy panel with the Gateway mark, "Al-Khums, Libya" and the "Open in Google Maps" button linking to `contact.map.link`.

**7. 404 (`/<lang>/*`)**
- On navy: the Gateway mark, the line "This road doesn't lead to a page.", and a button back to Home.
</pages_and_features>

<structural_constraints>
Structural Constraints (Crucial): I want a simple, clean React folder structure. Do not over-complicate it with too many tiny components. Group components by the page they belong to.
- **Stack:** React + Vite + TypeScript + Tailwind CSS + React Router + framer-motion + lucide-react, plus `@fontsource` for the fonts.
- **Page titles and meta tags:** with React 19, render `<title>`, `<meta>` and `<link>` inside each page component, and React places them in the document head. On React 18, use `react-helmet-async` instead.
- **Data:**
  - All text and data live in `src/data/`, with no backend yet. Components read from there, with no copy, specs or contact details hard-coded.
  - Small helpers live in `src/data/index.ts`: `whatsappLink(message)`, `mailtoLink(subject, body)`, `mapEmbed(lang)` (null while the coordinates are not set), `swapLangInPath(path, lang)` and `localized(obj, lang)`.
  - The language context (current language, direction, `t()`, the transition state and `switchLanguage()`) lives in `src/data/i18n.tsx`.
- **Tailwind:** define the tokens as theme colours and the three font families. In Tailwind v4 use `@theme` in `src/index.css`; in v3 use `tailwind.config`.
- **Translations:**
  - Strings live in `src/data/translations.ts`.
  - Set `<html lang dir>` when the language changes.
  - Use logical spacing utilities (ms/me/ps/pe, start/end) so RTL mirrors correctly, and flip directional icons with `rtl:-scale-x-100`.
  - Show phone numbers, specs and figures in Western digits, with phone numbers always left to right.
  - Switch the body font with `html[lang="ar"]` and `html[lang="en"]` selectors.
- **Responsive:** design for mobile first, at 375 / 768 / 1280 px, with no horizontal scroll in either direction.
- **SEO:**
  - A title and meta description for every page and language (in `<copy>`).
  - Canonical and `hreflang` alternate links for `ar` and `en` on `https://al-mithaq.com`, with `x-default` pointing to the Arabic page.
  - The Open Graph image of the current language, and a `sitemap.xml` listing every page in both languages.
  - Pre-render the pages if the setup supports it (for example `vite-react-ssg`).
- **Hosting:** add `vercel.json` with a rewrite of all routes to `/index.html`, so deep links such as `/en/products/g2200` work on refresh. Deploying itself needs approval (see `<ask_before>`).
- **Performance and accessibility:**
  - SVG for all brand graphics. WebP for photos, with width and height set, and lazy loading below the fold (the map iframe too).
  - Alt text on every image (empty alt for decorative patterns and numbers).
  - Tap targets of at least 44 px.
  - A visible focus ring, 2 px with a 2 px offset: navy on light backgrounds and gold on navy, because gold on Lane White is too faint to see.
  - No content that only appears on hover.
</structural_constraints>

<folder_structure>
Strict Folder Structure to Follow:
```
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── LanguageToggle.tsx
│   │   └── LanguageTransition.tsx
│   ├── home/ (Components specific to the homepage)
│   │   ├── Hero.tsx
│   │   ├── SectorsStrip.tsx
│   │   ├── FeaturedProduct.tsx
│   │   ├── Pledge.tsx
│   │   └── PartnersTeaser.tsx
│   ├── sectors/ (Components specific to the Sectors page)
│   │   └── SectorBlocks.tsx
│   ├── products/ (Components specific to the Products and product pages)
│   │   ├── ProductGrid.tsx
│   │   └── ProductDetail.tsx
│   ├── about/ (Components specific to the About page)
│   │   ├── NameStory.tsx
│   │   └── Values.tsx
│   ├── partners/ (Components specific to the Partners page)
│   │   ├── PartnerGroups.tsx
│   │   └── BecomePartner.tsx
│   ├── contact/ (Components specific to the Contact page)
│   │   ├── ContactDetails.tsx
│   │   ├── QuoteForm.tsx
│   │   └── LocationMap.tsx
│   └── ui/ (Only for generic reusable items)
│       ├── Button.tsx
│       ├── PageHero.tsx
│       ├── SectionOpener.tsx
│       ├── QuoteBand.tsx
│       ├── GatewayMark.tsx
│       └── GatewayBand.tsx
├── pages/
│   ├── Home.tsx
│   ├── Sectors.tsx
│   ├── Products.tsx
│   ├── ProductPage.tsx
│   ├── About.tsx
│   ├── Partners.tsx
│   ├── Contact.tsx
│   └── NotFound.tsx
├── data/ (Store all text/data here, no backend yet)
│   ├── index.ts
│   ├── translations.ts
│   └── i18n.tsx
├── App.tsx
├── main.tsx
└── index.css
```
</folder_structure>

<copy>
The interface copy in both languages. Use it exactly; it becomes `src/data/translations.ts`.

```ts
export const copy = {
  nav: {
    home: { ar: "الرئيسية", en: "Home" },
    sectors: { ar: "القطاعات", en: "Sectors" },
    products: { ar: "المنتجات", en: "Products" },
    about: { ar: "من نحن", en: "About" },
    partners: { ar: "الشركاء", en: "Partners" },
    contact: { ar: "تواصل معنا", en: "Contact" },
    menu: { ar: "القائمة", en: "Menu" },
    close: { ar: "إغلاق", en: "Close" },
  },
  cta: {
    quote: { ar: "اطلب عرض سعر", en: "Request a quote" },
    browse: { ar: "تصفّح المنتجات", en: "Browse products" },
    details: { ar: "التفاصيل", en: "View details" },
    allPartners: { ar: "كل الشركاء", en: "All partners" },
    backHome: { ar: "العودة إلى الرئيسية", en: "Back to home" },
  },
  toggle: {
    ariaToEnglish: "Switch to English",
    ariaToArabic: "التبديل إلى العربية",
    overlayName: { ar: "العربية", en: "English" },
    announce: { ar: "النسخة العربية", en: "English version" },
  },
  slogan: { ar: "كلمتنا ميثاق", en: "Our word is our pledge." },
  home: {
    heroKicker: { ar: "الخمس · ليبيا", en: "Al-Khums · Libya" },
    heroTitle: { ar: "نجهّز الطرق والمدن والصناعة", en: "Equipping roads, cities and industry" },
    heroSubtitle: { ar: "ثمانية قطاعات، ميثاقٌ واحد.", en: "Eight sectors. One pledge." },
    heroBody: {
      ar: "توريد معدات الطرق والخدمات البلدية والسلامة والنفط والغاز وقطع الغيار والتجهيزات الطبية والمكتبية.",
      en: "Equipment for roads, municipal services, safety, oil and gas, spare parts, medical and office needs.",
    },
    sectorsTitle: { ar: "قطاعاتنا الثمانية", en: "Our eight sectors" },
    sectorsSubtitle: { ar: "مورّد واحد لاحتياجات مشاريعكم.", en: "One supplier for your project's needs." },
    featuredKicker: { ar: "منتج مميز", en: "Featured product" },
    featuredBody: {
      ar: "كانسة طرق رباعية العجلات بعرض تنظيف من 1.5 إلى 2.3 م وكفاءة تصل إلى 17,000 م² في الساعة.",
      en: "A four-wheel road sweeper that cleans a 1.5–2.3 m path at up to 17,000 m² per hour.",
    },
    pledgeKicker: { ar: "وعدنا", en: "Our pledge" },
    pledgeBody: {
      ar: "ميثاق تعني العهد، ولهذا جعلنا اسمنا وعداً نلتزم به مع كل توريد.",
      en: "Mithaq means covenant, so we made our name a promise we keep with every supply.",
    },
    pillars: [
      { title: { ar: "ثمانية قطاعات", en: "Eight sectors" }, text: { ar: "من معدات الطرق إلى السلامة المهنية والتجهيزات المكتبية.", en: "From road equipment to workplace safety and office supplies." } },
      { title: { ar: "مواصفات واضحة", en: "Clear specifications" }, text: { ar: "نعرض المواصفات الفنية كاملة لكل منتج.", en: "Full technical specifications for every product." } },
      { title: { ar: "عهدٌ نصونه", en: "A promise we keep" }, text: { ar: "اسمنا ميثاق، وهذا التزامنا.", en: "Our name is Mithaq, and that is our commitment." } },
    ],
    partnersTitle: { ar: "شركاؤنا", en: "Our partners" },
    partnersBody: { ar: "المصنّعون والموردون الذين نعمل معهم.", en: "The manufacturers and suppliers we work with." },
  },
  quoteBand: {
    title: { ar: "تحتاج معدات لمشروعك؟", en: "Need equipment for your project?" },
    body: { ar: "أخبرنا بما تحتاجه وسنرسل لك عرض سعر.", en: "Tell us what you need and we'll send you a quote." },
  },
  sectorsPage: {
    title: { ar: "القطاعات", en: "Sectors" },
    intro: { ar: "ثمانية قطاعات نوفّر لها المعدات والمستلزمات.", en: "Eight sectors we supply with equipment and materials." },
    productsInSector: { ar: "منتجات هذا القطاع", en: "Products in this sector" },
    quoteForSector: { ar: "اطلب عرض سعر لهذا القطاع", en: "Request a quote for this sector" },
  },
  productsPage: {
    title: { ar: "المنتجات", en: "Products" },
    intro: { ar: "كتالوج منتجاتنا حسب القطاع.", en: "Our catalogue by sector." },
    all: { ar: "الكل", en: "All" },
    moreTitle: { ar: "منتجات أخرى قيد الإضافة", en: "More products are on the way" },
    moreBody: { ar: "اطلب الكتالوج الكامل.", en: "Ask for the full catalogue." },
  },
  productPage: {
    keyFigures: { ar: "الأرقام الرئيسية", en: "Key figures" },
    specs: { ar: "المواصفات الفنية", en: "Technical specifications" },
    quoteForProduct: { ar: "اطلب عرض سعر لهذا المنتج", en: "Request a quote for this product" },
    emailSpec: { ar: "اطلب ملف المواصفات بالبريد الإلكتروني", en: "Request the spec sheet by email" },
    download: { ar: "تحميل ملف المواصفات", en: "Download the spec sheet" },
    backToSector: { ar: "العودة إلى القطاع", en: "Back to the sector" },
  },
  aboutPage: {
    title: { ar: "من نحن", en: "About us" },
    heroTitle: { ar: "اسمنا وعدنا", en: "Our name is our promise" },
    definition: { ar: "ميثاق: عهدٌ مُلزِم", en: "Mithaq: a binding covenant" },
    meaning: {
      ar: "ميثاق كلمة عربية تعني العهد والالتزام، ولذلك نتعامل مع كل توريد كعهدٍ نلتزم به.",
      en: "Mithaq is an Arabic word for a covenant, a binding promise. That is how we treat every supply.",
    },
    whatWeDo: {
      ar: "شركة ميثاق للتجهيزات العامة توفّر المعدات والخدمات للشركات والجهات في ثمانية قطاعات، مع تركيز خاص على الطرق والخدمات البلدية. مقرنا الرئيسي في مدينة الخمس، ليبيا.",
      en: "Mithaq General Supplies provides equipment and services to companies and public bodies across eight sectors, with a special focus on roads and municipal services. Our head office is in Al-Khums, Libya.",
    },
    values: [
      { title: { ar: "الالتزام", en: "Commitment" }, text: { ar: "ما نتفق عليه نلتزم به.", en: "What we agree, we honour." } },
      { title: { ar: "الوضوح", en: "Clarity" }, text: { ar: "مواصفات وعروض أسعار واضحة.", en: "Clear specifications and clear quotes." } },
      { title: { ar: "الجاهزية", en: "Readiness" }, text: { ar: "نجهّز ما تحتاجه مشاريعكم.", en: "We prepare what your projects need." } },
      { title: { ar: "السلامة", en: "Safety" }, text: { ar: "السلامة أولاً في كل ما نورّده.", en: "Safety first in everything we supply." } },
    ],
    logoStory: {
      ar: "شعارنا بوابةٌ فوق طريقٍ يمتد إلى الأفق: نفتح الطريق لمشاريعكم.",
      en: "Our logo is a gate standing over a road that runs to the horizon: we open the way for your projects.",
    },
  },
  partnersPage: {
    title: { ar: "الشركاء", en: "Partners" },
    heroTitle: { ar: "شركاؤنا", en: "Our partners" },
    heroBody: { ar: "المصنّعون والموردون وراء قطاعاتنا الثمانية.", en: "The manufacturers and suppliers behind our eight sectors." },
    placeholder: { ar: "شعار الشريك", en: "Partner logo" },
    becomeTitle: { ar: "كن شريكاً لنا", en: "Become a partner" },
    becomeBody: { ar: "هل أنت مصنّع أو مورّد في أحد قطاعاتنا؟ تواصل معنا.", en: "Are you a manufacturer or supplier in one of our sectors? Get in touch." },
    becomeButton: { ar: "راسلنا بخصوص الشراكة", en: "Email us about partnering" },
  },
  contactPage: {
    title: { ar: "تواصل معنا", en: "Contact us" },
    intro: { ar: "اطلب عرض سعر أو استفسر عن أي منتج.", en: "Request a quote or ask about any product." },
    labels: {
      whatsappBusiness: { ar: "واتساب أعمال", en: "WhatsApp Business" },
      phone: { ar: "الهاتف", en: "Phone" },
      email: { ar: "البريد الإلكتروني", en: "Email" },
      headOffice: { ar: "المقر الرئيسي", en: "Head office" },
      hours: { ar: "ساعات العمل", en: "Hours" },
    },
    whatsappButton: { ar: "تواصل عبر واتساب أعمال", en: "Chat on WhatsApp Business" },
    openMap: { ar: "افتح في خرائط Google", en: "Open in Google Maps" },
    mapTitle: { ar: "موقع المقر الرئيسي", en: "Head office location" },
    toBeAdded: { ar: "سيُضاف قريباً", en: "To be added" },
  },
  form: {
    title: { ar: "طلب عرض سعر", en: "Quote request" },
    messageTitle: { ar: "طلب عرض سعر لشركة ميثاق للتجهيزات العامة", en: "Quote request for Mithaq General Supplies" },
    name: { ar: "الاسم الكامل", en: "Full name" },
    company: { ar: "الشركة أو الجهة", en: "Company or organisation" },
    phone: { ar: "رقم الهاتف", en: "Phone number" },
    sector: { ar: "القطاع", en: "Sector" },
    product: { ar: "المنتج (اختياري)", en: "Product (optional)" },
    quantity: { ar: "الكمية", en: "Quantity" },
    details: { ar: "تفاصيل الطلب", en: "Request details" },
    submit: { ar: "إرسال عبر واتساب أعمال", en: "Send via WhatsApp Business" },
    email: { ar: "أو أرسل بالبريد الإلكتروني", en: "or send by email" },
    required: { ar: "هذا الحقل مطلوب", en: "This field is required" },
    invalidPhone: { ar: "أدخل رقم هاتف صحيحاً", en: "Enter a valid phone number" },
  },
  footer: {
    pages: { ar: "الصفحات", en: "Pages" },
    sectors: { ar: "القطاعات", en: "Sectors" },
    contact: { ar: "تواصل", en: "Contact" },
    headOffice: { ar: "المقر الرئيسي: الخمس، ليبيا", en: "Head office: Al-Khums, Libya" },
    rights: { ar: "© 2026 شركة ميثاق للتجهيزات العامة. جميع الحقوق محفوظة.", en: "© 2026 Mithaq General Supplies. All rights reserved." },
  },
  notFound: {
    title: { ar: "هذا الطريق لا يؤدي إلى أي صفحة.", en: "This road doesn't lead to a page." },
  },
  whatsappMessages: {
    general: { ar: "مرحباً، أتواصل معكم من موقع شركة ميثاق للتجهيزات العامة.", en: "Hello, I'm contacting you from the Mithaq General Supplies website." },
  },
  emailSubjects: {
    quote: { ar: "طلب عرض سعر", en: "Quote request" },
    specSheet: { ar: "طلب ملف مواصفات: {product}", en: "Spec sheet request: {product}" },
    partner: { ar: "طلب شراكة مع شركة ميثاق", en: "Partnership enquiry: Mithaq General Supplies" },
  },
  seo: {
    home: {
      title: { ar: "ميثاق للتجهيزات العامة | معدات الطرق والبلديات والسلامة", en: "Mithaq General Supplies | Road, municipal and safety equipment" },
      description: {
        ar: "شركة ميثاق للتجهيزات العامة في الخمس، ليبيا: توريد معدات الطرق والخدمات البلدية والسلامة والنفط والغاز وقطع الغيار في ثمانية قطاعات.",
        en: "Mithaq General Supplies, Al-Khums, Libya: equipment for roads, municipal services, safety, oil and gas, spare parts, medical and office needs across eight sectors.",
      },
    },
    sectors: {
      title: { ar: "القطاعات | ميثاق للتجهيزات العامة", en: "Sectors | Mithaq General Supplies" },
      description: { ar: "ثمانية قطاعات من معدات الطرق والبلديات إلى السلامة المهنية والتجهيزات المكتبية.", en: "Eight sectors, from road and municipal equipment to workplace safety and office supplies." },
    },
    products: {
      title: { ar: "المنتجات | ميثاق للتجهيزات العامة", en: "Products | Mithaq General Supplies" },
      description: { ar: "كتالوج منتجات ميثاق حسب القطاع، مع المواصفات الفنية الكاملة.", en: "Mithaq's product catalogue by sector, with full technical specifications." },
    },
    g2200: {
      title: { ar: "كانسة الطرق G2200 | ميثاق", en: "G2200 Road Sweeper | Mithaq" },
      description: { ar: "كانسة طرق رباعية العجلات: عرض تنظيف 1.5–2.3 م، كفاءة 17,000 م²/ساعة، خزان مياه 300 لتر.", en: "Four-wheel road sweeper: 1.5–2.3 m cleaning width, 17,000 m²/h, 300 L water tank." },
    },
    about: {
      title: { ar: "من نحن | ميثاق للتجهيزات العامة", en: "About | Mithaq General Supplies" },
      description: { ar: "ميثاق تعني العهد: شركة توريد معدات وخدمات في ثمانية قطاعات، مقرها الخمس، ليبيا.", en: "Mithaq means covenant: an equipment and services supplier across eight sectors, based in Al-Khums, Libya." },
    },
    partners: {
      title: { ar: "الشركاء | ميثاق للتجهيزات العامة", en: "Partners | Mithaq General Supplies" },
      description: { ar: "المصنّعون والموردون وراء قطاعات ميثاق الثمانية.", en: "The manufacturers and suppliers behind Mithaq's eight sectors." },
    },
    contact: {
      title: { ar: "تواصل معنا | ميثاق للتجهيزات العامة", en: "Contact | Mithaq General Supplies" },
      description: { ar: "اطلب عرض سعر من شركة ميثاق للتجهيزات العامة. المقر الرئيسي: الخمس، ليبيا.", en: "Request a quote from Mithaq General Supplies. Head office: Al-Khums, Libya." },
    },
  },
};
```
</copy>

<examples>
<example name="whatsapp_link">
Used only on the Contact page. The greeting button opens:
`https://wa.me/218924841963?text=` + `encodeURIComponent("مرحباً، أتواصل معكم من موقع شركة ميثاق للتجهيزات العامة.")`

```ts
export function whatsappLink(message: string): string {
  return `https://wa.me/${contact.whatsappBusiness.digits}?text=${encodeURIComponent(message)}`;
}
```
</example>
<example name="quote_form_message">
The form joins these lines with "\n", leaves out lines for empty optional fields, and passes the result to `whatsappLink()` (or to `mailtoLink(form.messageTitle, message)` for "or send by email"):

```
طلب عرض سعر لشركة ميثاق للتجهيزات العامة
الاسم الكامل: {name}
الشركة أو الجهة: {company}
رقم الهاتف: {phone}
القطاع: {sector}
المنتج: {product}
الكمية: {quantity}
تفاصيل الطلب: {details}
```
In English, the same lines start with "Quote request for Mithaq General Supplies", followed by "Full name:", "Company or organisation:" and so on, using the `form` labels. Phone validation: 7–15 digits after removing spaces, dashes and a leading "+".
</example>
<example name="map_embed">
```ts
export function mapEmbed(lang: "ar" | "en"): string | null {
  const { lat, lng } = contact.map;
  if (lat == null || lng == null) return null; // coordinates still [CONFIRM]: show the map card
  return `https://maps.google.com/maps?q=${lat},${lng}&z=16&hl=${lang}&output=embed`;
}
// <iframe src={embed} title={copy.contactPage.mapTitle[lang]} loading="lazy"
//   referrerPolicy="no-referrer-when-downgrade" className="h-[420px] w-full rounded-2xl border-0" allowFullScreen />
```
The "Open in Google Maps" button always links to `contact.map.link`.
</example>
<example name="missing_information">
Working hours are not confirmed yet, so `contact.hours` is null. The Hours line on the Contact page shows "To be added" (Arabic: "سيُضاف قريباً"), the footer leaves hours out, and PROGRESS.md lists "Hours [CONFIRM]".
</example>
<example name="translation">
`{ en: "Our eight sectors", ar: "قطاعاتنا الثمانية" }`, rendered as an H2 in Barlow 700 in English and in Noto Kufi Arabic 800 in Arabic, never letter-spaced.
</example>
<example name="language_address">
`/ar/products/g2200` ↔ `/en/products/g2200` (same slug in both languages). `/en/products?sector=municipal-cleaning` ↔ `/ar/products?sector=municipal-cleaning` (query kept). `/ar/contact?product=g2200#quote` opens the Contact page with the G2200 and its sector pre-selected and scrolls to the form. `/` → `/ar`, or the language saved in `mithaq-lang`.
</example>
<example name="numbers">
English: "17,000 m²/h" · Arabic: "17,000 م²/ساعة". Phone in an Arabic sentence: `<span dir="ltr">+218 91 108 7744</span>`, so it never shows as "218 91 108 7744+".
</example>
</examples>

<confirm_list>
Items that are not confirmed yet. Build with the neutral placeholders described above and list each one in PROGRESS.md:
1. Slogan: كلمتنا ميثاق · "Our word is our pledge."
2. Head-office map coordinates (`lat`, `lng`) and street address
3. Working hours
4. Social media links
5. Founding year and registration details
6. Partner names, logos, countries and sectors
7. Further products from the catalogue, and the G2200 brochure PDF
8. Real photos (products, head office, fleet, team)
9. Sector summaries and values wording
10. Audience assumption: mostly mobile visitors in Libya
11. Analytics: out of scope unless requested
</confirm_list>

<working_rules>
<default_to_action>
Build the site yourself: create and edit the files rather than describing them. When a detail is unclear, choose the most reasonable option, note it in PROGRESS.md, and continue. The exceptions are the actions in `<ask_before>`.
</default_to_action>
<read_before_changing>
If the folder already has code, read it first and build on it. The files in `public/` are final brand assets: use them as they are.
</read_before_changing>
<facts_only>
Use only facts from `<business_data>`. For anything marked [CONFIRM] or missing, show a neutral placeholder and add it to the TODO list. Do not invent statistics, testimonials, clients, partners, awards, certifications, prices or results, because every claim on the site must be true.
</facts_only>
<scope>
Build exactly what `<pages_and_features>` lists, with the language transition in `<language_transition>`. Out of scope: login, payments, prices, a CMS, a blog, live chat, a backend and analytics.
</scope>
<progress_tracking>
Keep PROGRESS.md up to date: the milestones, their status, your decisions and a TODO list with every [CONFIRM] item. Commit with git after each milestone. In a new session, read PROGRESS.md and `git log` first.

Suggested milestones:
1. Project setup, tokens, fonts, routing with the language prefix
2. Layout: navy header, mobile menu, page hero, footer, quote band
3. The language toggle and the "Through the Gateway" transition
4. Home
5. Sectors, Products and the product page
6. About, Partners and Contact (with the map card and the WhatsApp Business button)
7. SEO, 404, `vercel.json`, final checks
</progress_tracking>
<verification>
Before you report that you are done:
- `npm run build` passes with no TypeScript errors.
- Every page works at 375, 768 and 1280 px in both languages: no horizontal scroll, correct direction, and every link and button works.
- The language switch works from every page, including the product page and a filtered Products view. It keeps the same page, query and scroll position, swaps the header logo, and cannot be triggered twice. Back and Forward keep the chosen language.
- With reduced motion turned on, the switch is a 200 ms fade, and the hero loop and parallax are off.
- `wa.me` appears only in `src/data/index.ts` and the Contact page components, and there is no floating WhatsApp button.
- Phone numbers read left to right in Arabic, every visible string comes from `src/data/`, and no Arabic text is letter-spaced.

Fix any failure rather than weakening the check.
</verification>
<ask_before>
Ask before you deploy, connect a domain or change DNS, delete files you did not create, push to a remote repository, or add a paid service.
</ask_before>
<final_report>
Finish with a plain-English report:
- What was built
- How to run it
- The results of each check
- TODO items for the client (every [CONFIRM])
- Decisions to review
</final_report>
</working_rules>

<task>
Build the Mithaq General Supplies website as described above. Start by writing PROGRESS.md with your milestone plan, then work through it, checking as you go, and finish with the final report.
</task>
