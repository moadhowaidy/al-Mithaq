/**
 * Interface copy in both languages.
 *
 * The blocks taken from the brief (docs/BUILD_PROMPT.md, <copy>) are used exactly as written.
 * Lines marked "Added during the build" were not in the brief: they are labels the
 * interface needs (accessibility names, form hints, section titles). MOAD to review them.
 */
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
    // Added during the build: the two labels shown inside the toggle pill.
    short: { ar: "ع", en: "EN" },
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
    // Added during the build: alt text of the G2200 illustration on the featured-product stage.
    featuredImageAlt: { ar: "منظر جانبي لكانسة الطرق G2200", en: "Side view of the G2200 road sweeper" },
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
    // Added during the build: shown when a filtered sector has no product yet.
    empty: { ar: "لا توجد منتجات مدرجة في هذا القطاع بعد.", en: "No products are listed in this sector yet." },
  },
  productPage: {
    keyFigures: { ar: "الأرقام الرئيسية", en: "Key figures" },
    specs: { ar: "المواصفات الفنية", en: "Technical specifications" },
    quoteForProduct: { ar: "اطلب عرض سعر لهذا المنتج", en: "Request a quote for this product" },
    emailSpec: { ar: "اطلب ملف المواصفات بالبريد الإلكتروني", en: "Request the spec sheet by email" },
    download: { ar: "تحميل ملف المواصفات", en: "Download the spec sheet" },
    backToSector: { ar: "العودة إلى القطاع", en: "Back to the sector" },
    // Added during the build: table headers (read by screen readers) and labels.
    sector: { ar: "القطاع", en: "Sector" },
    specItem: { ar: "البند", en: "Item" },
    specValue: { ar: "القيمة", en: "Value" },
    photos: { ar: "صور المنتج", en: "Product photos" },
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
    // Added during the build: section titles and image text for the About page.
    nameTitle: { ar: "معنى الاسم", en: "The meaning of the name" },
    whatWeDoTitle: { ar: "ما نقدّمه", en: "What we do" },
    valuesTitle: { ar: "قيمنا", en: "Our values" },
    logoTitle: { ar: "قصة الشعار", en: "The story behind the logo" },
    logoName: { ar: "البوابة", en: "The Gateway" },
    logoAlt: { ar: "شعار ميثاق: بوابة تقف فوق طريق يمتد إلى الأفق", en: "The Mithaq logo: a gate standing over a road that runs to the horizon" },
    // Added during the build: the "Company facts" block, shown once the founding year or registration is confirmed.
    factsTitle: { ar: "بيانات الشركة", en: "Company facts" },
    founded: { ar: "سنة التأسيس", en: "Founded" },
    registration: { ar: "بيانات التسجيل", en: "Registration" },
  },
  partnersPage: {
    title: { ar: "الشركاء", en: "Partners" },
    heroTitle: { ar: "شركاؤنا", en: "Our partners" },
    heroBody: { ar: "المصنّعون والموردون وراء قطاعاتنا الثمانية.", en: "The manufacturers and suppliers behind our eight sectors." },
    placeholder: { ar: "شعار الشريك", en: "Partner logo" },
    becomeTitle: { ar: "كن شريكاً لنا", en: "Become a partner" },
    becomeBody: { ar: "هل أنت مصنّع أو مورّد في أحد قطاعاتنا؟ تواصل معنا.", en: "Are you a manufacturer or supplier in one of our sectors? Get in touch." },
    becomeButton: { ar: "راسلنا بخصوص الشراكة", en: "Email us about partnering" },
    // Added during the build: link label on a partner tile that has a website.
    visitWebsite: { ar: "زيارة الموقع", en: "Visit website" },
    // Added during the build: the two small labels on a partner tile.
    country: { ar: "البلد", en: "Country" },
    sectors: { ar: "القطاعات", en: "Sectors" },
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
    // Added during the build: title of the contact-details column.
    detailsTitle: { ar: "بيانات التواصل", en: "Contact details" },
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
    // Added during the build: select placeholders, the error summary and the confirmation note.
    chooseSector: { ar: "اختر القطاع", en: "Choose a sector" },
    chooseProduct: { ar: "اختر المنتج", en: "Choose a product" },
    noProducts: { ar: "لا توجد منتجات مدرجة في هذا القطاع بعد", en: "No products listed in this sector yet" },
    errorSummary: { ar: "يرجى مراجعة الحقول المشار إليها.", en: "Please check the highlighted fields." },
    opened: { ar: "فُتح واتساب أعمال برسالتك. أرسلها من هناك لإتمام الطلب.", en: "WhatsApp Business has opened with your message. Send it there to complete your request." },
    // Added during the build: the product line of the quote message, the form's intro line and the email confirmation.
    productLine: { ar: "المنتج", en: "Product" },
    intro: { ar: "املأ النموذج، وسيُفتح طلبك جاهزاً للإرسال في واتساب أعمال.", en: "Fill in the form and your request opens in WhatsApp Business, ready to send." },
    openedEmail: { ar: "فُتح تطبيق البريد الإلكتروني برسالتك. أرسلها من هناك لإتمام الطلب.", en: "Your email app has opened with your message. Send it there to complete your request." },
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
    // Added during the build: small label above the line.
    kicker: { ar: "خطأ 404", en: "Error 404" },
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
    // Added during the build: the 404 page.
    notFound: {
      title: { ar: "الصفحة غير موجودة | ميثاق", en: "Page not found | Mithaq" },
      description: { ar: "هذا الطريق لا يؤدي إلى أي صفحة.", en: "This road doesn't lead to a page." },
    },
  },
  // Added during the build: descriptions of the link-preview images (og:image:alt), written into
  // src/data/og-images.ts by scripts/og-images.mjs: homeAlt for the official Home images, pageAlt
  // for the images of the other pages ({title} is the title drawn on the image).
  og: {
    homeAlt: { ar: "شعار {company} وعبارة «{slogan}»", en: "{company} logo and the slogan “{slogan}”" },
    pageAlt: { ar: "{title}، {company}", en: "{title}, {company}" },
  },
  // Added during the build: accessibility names and the small kickers of the page openings.
  a11y: {
    skipToContent: { ar: "الانتقال إلى المحتوى", en: "Skip to content" },
    mainNav: { ar: "التنقل الرئيسي", en: "Main navigation" },
    footerNav: { ar: "روابط الصفحات", en: "Page links" },
    homeLink: { ar: "ميثاق، الصفحة الرئيسية", en: "Mithaq, home page" },
    breadcrumb: { ar: "مسار التنقل", en: "Breadcrumb" },
    newTab: { ar: "(يفتح في نافذة جديدة)", en: "(opens in a new tab)" },
    sectorFilter: { ar: "تصفية المنتجات حسب القطاع", en: "Filter products by sector" },
  },
  pageKickers: {
    sectors: { ar: "ما نورّده", en: "What we supply" },
    products: { ar: "الكتالوج", en: "Catalogue" },
    contact: { ar: "الخمس · ليبيا", en: "Al-Khums · Libya" },
  },
};

export type Copy = typeof copy;
