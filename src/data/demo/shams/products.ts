import { LocalizedString, Product } from '../../../types/store';

// Shams Stores demo catalog — photo/video/audio equipment, prices in EGP.
//
// IMPORTANT: this is placeholder catalog data, not the shop's real listings.
// Every entry is marked `isDemo: true`, carries no reviews or rating, and uses
// Unsplash stock photography. The titles are representative of the kinds of
// equipment the business sells, but **the prices and stock levels are made up
// for development and review** and must be replaced by the real catalog
// (ideally through a real CommerceProvider) before launch. See
// docs/SHAMS-LAUNCH-CHECKLIST.md.
const WARRANTY_NOTE: LocalizedString = {
  en: 'Warranty terms depend on the manufacturer or local distributor — ask a branch about this item.',
  ar: 'شروط الضمان بتختلف حسب الشركة المصنّعة أو الموزّع المحلي — اسأل الفرع عن المنتج ده.',
};

function demoBase(): Pick<Product, 'storeId' | 'isDemo' | 'rating' | 'reviewCount' | 'reviews' | 'warranty'> {
  return {
    storeId: 'shams',
    isDemo: true,
    rating: 0,
    reviewCount: 0,
    reviews: [],
    warranty: WARRANTY_NOTE,
  };
}

export const SHAMS_PRODUCTS: Product[] = [
  // ---------------------------------------------------------------- cameras
  {
    ...demoBase(),
    id: 'shams-canon-eos-r6-ii',
    title: {
      en: 'Canon EOS R6 Mark II Mirrorless Body',
      ar: 'كاميرا كانون EOS R6 Mark II بودي',
    },
    brand: 'Canon',
    category: 'cameras',
    price: 89900,
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=85',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=85',
      'https://images.unsplash.com/photo-1606933987254-25cbb6d54cd7?w=800&q=85',
    ],
    description: {
      en: 'Full-frame mirrorless body with fast autofocus and in-body stabilization — suited to weddings, events and hybrid photo/video work.',
      ar: 'بودي ميرورليس فل فريم بنظام أوتوفوكس سريع ومثبت داخلي — مناسبة لتصوير الأفراح والمناسبات والعمل المزدوج فوتو/فيديو.',
    },
    shortSpecs: [
      { en: 'Full-Frame Sensor', ar: 'مستشعر فل فريم' },
      { en: 'In-Body Image Stabilization', ar: 'مثبت صورة داخلي' },
      { en: '4K Video Recording', ar: 'تسجيل فيديو 4K' },
    ],
    inStock: true,
    // Low stock, to exercise the low-stock UI state.
    stockCount: 4,
    specs: [
      {
        group: { en: 'Sensor & Body', ar: 'المستشعر والهيكل' },
        items: [
          { label: { en: 'Sensor Format', ar: 'مقاس المستشعر' }, value: { en: 'Full-Frame', ar: 'فل فريم' } },
          { label: { en: 'Lens Mount', ar: 'نوع الحاضن' }, value: { en: 'Canon RF', ar: 'كانون RF' } },
        ],
      },
    ],
    isFeatured: true,
  },
  {
    ...demoBase(),
    id: 'shams-sony-a7-iv',
    title: { en: 'Sony Alpha a7 IV Mirrorless Body', ar: 'كاميرا سوني ألفا a7 IV بودي' },
    brand: 'Sony',
    category: 'cameras',
    price: 94500,
    originalPrice: 99000,
    images: [
      'https://images.unsplash.com/photo-1519183071298-a2962feb14f4?w=800&q=85',
      'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=800&q=85',
    ],
    description: {
      en: 'Hybrid full-frame body with high-resolution stills and 10-bit video, built for photographers who also shoot client video.',
      ar: 'بودي فل فريم هجين بدقة عالية للصور وفيديو 10-bit، مناسب للمصورين اللي بيصوّروا فيديو للعملاء كمان.',
    },
    shortSpecs: [
      { en: 'Full-Frame Hybrid Body', ar: 'بودي فل فريم هجين' },
      { en: '10-bit Video', ar: 'فيديو 10-bit' },
      { en: 'Dual Card Slots', ar: 'منفذين لكروت الذاكرة' },
    ],
    badge: { text: { en: 'Offer', ar: 'عرض' }, type: 'sale' },
    inStock: true,
    stockCount: 6,
    specs: [
      {
        group: { en: 'Sensor & Body', ar: 'المستشعر والهيكل' },
        items: [{ label: { en: 'Lens Mount', ar: 'نوع الحاضن' }, value: { en: 'Sony E', ar: 'سوني E' } }],
      },
    ],
    isFeatured: true,
  },
  {
    ...demoBase(),
    id: 'shams-fujifilm-x-t5',
    title: { en: 'Fujifilm X-T5 Mirrorless Body', ar: 'كاميرا فوجي فيلم X-T5 بودي' },
    brand: 'Fujifilm',
    category: 'cameras',
    price: 62000,
    images: ['https://images.unsplash.com/photo-1495707902641-75cac588d2e9?w=800&q=85'],
    description: {
      en: 'APS-C body with classic dial-led handling — a lighter kit for street, travel and documentary work.',
      ar: 'بودي APS-C بتحكم كلاسيكي بالأقراص — طقم أخف لتصوير الشارع والسفر والتوثيقي.',
    },
    shortSpecs: [
      { en: 'APS-C Sensor', ar: 'مستشعر APS-C' },
      { en: 'Compact, Lightweight Body', ar: 'هيكل مدمج وخفيف' },
    ],
    // Deliberately unavailable, to exercise the out-of-stock state.
    inStock: false,
    stockCount: 0,
    specs: [
      {
        group: { en: 'Sensor & Body', ar: 'المستشعر والهيكل' },
        items: [{ label: { en: 'Lens Mount', ar: 'نوع الحاضن' }, value: { en: 'Fujifilm X', ar: 'فوجي X' } }],
      },
    ],
  },

  // ----------------------------------------------------------------- lenses
  {
    ...demoBase(),
    id: 'shams-canon-rf-24-70',
    title: { en: 'Canon RF 24-70mm f/2.8L IS USM Lens', ar: 'عدسة كانون RF 24-70mm f/2.8L IS USM' },
    brand: 'Canon',
    category: 'lenses',
    price: 78000,
    images: [
      'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=800&q=85',
      'https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b?w=800&q=85',
    ],
    description: {
      en: 'Fast standard zoom covering wide to short telephoto at a constant f/2.8 — the everyday working lens for events and portraits.',
      ar: 'عدسة زووم قياسية سريعة من الواسع للتيليفوتو القصير بفتحة ثابتة f/2.8 — عدسة الشغل اليومي للمناسبات والبورتريه.',
    },
    shortSpecs: [
      { en: 'Constant f/2.8 Aperture', ar: 'فتحة ثابتة f/2.8' },
      { en: 'Optical Image Stabilization', ar: 'مثبت صورة بصري' },
    ],
    inStock: true,
    stockCount: 5,
    specs: [
      {
        group: { en: 'Optics', ar: 'المواصفات البصرية' },
        items: [
          { label: { en: 'Focal Length', ar: 'البعد البؤري' }, value: { en: '24-70mm', ar: '24-70 مم' } },
          { label: { en: 'Mount', ar: 'الحاضن' }, value: { en: 'Canon RF', ar: 'كانون RF' } },
        ],
      },
    ],
    isFeatured: true,
  },
  {
    ...demoBase(),
    id: 'shams-sony-fe-85-18',
    title: { en: 'Sony FE 85mm f/1.8 Portrait Lens', ar: 'عدسة سوني FE 85mm f/1.8 للبورتريه' },
    brand: 'Sony',
    category: 'lenses',
    price: 21500,
    originalPrice: 23900,
    images: ['https://images.unsplash.com/photo-1606986601547-0ba1af6c1a4d?w=800&q=85'],
    description: {
      en: 'Short telephoto prime with smooth background separation — a straightforward portrait lens.',
      ar: 'عدسة ثابتة تيليفوتو قصيرة بعزل خلفية ناعم — عدسة بورتريه مباشرة وبسيطة.',
    },
    shortSpecs: [
      { en: 'f/1.8 Maximum Aperture', ar: 'أقصى فتحة f/1.8' },
      { en: 'Lightweight Prime', ar: 'عدسة ثابتة خفيفة' },
    ],
    badge: { text: { en: 'Offer', ar: 'عرض' }, type: 'sale' },
    inStock: true,
    // Low stock.
    stockCount: 3,
    specs: [
      {
        group: { en: 'Optics', ar: 'المواصفات البصرية' },
        items: [{ label: { en: 'Mount', ar: 'الحاضن' }, value: { en: 'Sony E', ar: 'سوني E' } }],
      },
    ],
  },

  // -------------------------------------------------------- video production
  {
    ...demoBase(),
    id: 'shams-atem-mini-pro',
    title: { en: 'Blackmagic ATEM Mini Pro Live Switcher', ar: 'سويتشر بلاك ماجيك ATEM Mini Pro للبث المباشر' },
    brand: 'Blackmagic Design',
    category: 'video-production',
    price: 34500,
    images: [
      'https://images.unsplash.com/photo-1579965342575-16428a7c8881?w=800&q=85',
      'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&q=85',
    ],
    description: {
      en: 'Four-input HDMI switcher with built-in streaming and recording — for live shows, webinars and multi-camera interviews.',
      ar: 'سويتشر HDMI بأربع مداخل مع بث وتسجيل مدمج — للبث المباشر والويبينار والمقابلات بأكثر من كاميرا.',
    },
    shortSpecs: [
      { en: '4 HDMI Inputs', ar: '4 مداخل HDMI' },
      { en: 'Built-in Streaming', ar: 'بث مباشر مدمج' },
    ],
    inStock: true,
    stockCount: 7,
    specs: [
      {
        group: { en: 'Connections', ar: 'التوصيلات' },
        items: [{ label: { en: 'Inputs', ar: 'المداخل' }, value: { en: '4 x HDMI', ar: '4 × HDMI' } }],
      },
    ],
    isFeatured: true,
  },
  {
    ...demoBase(),
    id: 'shams-dji-rs4-gimbal',
    title: { en: 'DJI RS 4 Camera Gimbal Stabilizer', ar: 'مثبت كاميرا DJI RS 4 جيمبال' },
    brand: 'DJI',
    category: 'video-production',
    price: 27900,
    images: [
      'https://images.unsplash.com/photo-1601984862832-2ecfd3ba76ca?w=800&q=85',
      'https://images.unsplash.com/photo-1611262588019-db6cc2032da3?w=800&q=85',
    ],
    description: {
      en: 'Three-axis gimbal for mirrorless bodies, with quick-release plates and balanced handling for run-and-gun shooting.',
      ar: 'جيمبال ثلاثي المحاور للكاميرات الميرورليس، بقواعد سريعة الفك وتوازن مناسب للتصوير المتحرك.',
    },
    shortSpecs: [
      { en: '3-Axis Stabilization', ar: 'تثبيت ثلاثي المحاور' },
      { en: 'Quick-Release Plate', ar: 'قاعدة سريعة الفك' },
    ],
    inStock: true,
    stockCount: 8,
    // Kit tiers (the shared variant slot is reused for kit options).
    variants: {
      storage: [
        {
          id: 'kit-standard',
          name: { en: 'Standard Kit', ar: 'الطقم الأساسي' },
          priceAdjustment: 0,
          sku: 'RS4-STD',
          stock: 5,
        },
        {
          id: 'kit-combo',
          name: { en: 'Combo Kit', ar: 'طقم كومبو' },
          priceAdjustment: 12000,
          sku: 'RS4-COMBO',
          stock: 3,
        },
      ],
    },
    specs: [
      {
        group: { en: 'Handling', ar: 'التعامل' },
        items: [{ label: { en: 'Axes', ar: 'المحاور' }, value: { en: '3', ar: '٣' } }],
      },
    ],
  },

  // --------------------------------------------------------------- lighting
  {
    ...demoBase(),
    id: 'shams-godox-sl60ii',
    title: { en: 'Godox SL60II Bi-Color LED Video Light', ar: 'إضاءة فيديو جودوكس SL60II ليد ثنائية اللون' },
    brand: 'Godox',
    category: 'lighting',
    price: 9800,
    images: ['https://images.unsplash.com/photo-1595859703065-2259f4e4fca5?w=800&q=85'],
    description: {
      en: 'Continuous LED light with adjustable color temperature — a dependable key light for interviews and product shots.',
      ar: 'إضاءة ليد مستمرة بدرجة حرارة لون قابلة للتعديل — إضاءة أساسية معتمدة للمقابلات وتصوير المنتجات.',
    },
    shortSpecs: [
      { en: 'Bi-Color Temperature', ar: 'حرارة لون ثنائية' },
      { en: 'Bowens Mount', ar: 'حاضن Bowens' },
    ],
    inStock: true,
    stockCount: 12,
    specs: [
      {
        group: { en: 'Output', ar: 'الإضاءة' },
        items: [{ label: { en: 'Mount', ar: 'الحاضن' }, value: { en: 'Bowens-S', ar: 'Bowens-S' } }],
      },
    ],
  },
  {
    ...demoBase(),
    id: 'shams-aputure-amaran-200x',
    title: { en: 'Aputure Amaran 200x S LED Light', ar: 'إضاءة أبتور أماران 200x S ليد' },
    brand: 'Aputure',
    category: 'lighting',
    price: 19500,
    originalPrice: 21800,
    images: [
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&q=85',
      'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=800&q=85',
    ],
    description: {
      en: 'Bi-color 200W LED with app control and reliable color accuracy for studio and location work.',
      ar: 'ليد 200 وات ثنائية اللون بتحكم من التطبيق ودقة لون معتمدة للاستوديو والتصوير الخارجي.',
    },
    shortSpecs: [
      { en: '200W Bi-Color LED', ar: 'ليد 200 وات ثنائية اللون' },
      { en: 'App & DMX Control', ar: 'تحكم بالتطبيق و DMX' },
    ],
    badge: { text: { en: 'Offer', ar: 'عرض' }, type: 'sale' },
    inStock: true,
    stockCount: 9,
    specs: [
      {
        group: { en: 'Output', ar: 'الإضاءة' },
        items: [{ label: { en: 'Power', ar: 'القدرة' }, value: { en: '200W', ar: '200 وات' } }],
      },
    ],
    isFeatured: true,
  },

  // ------------------------------------------------------- professional audio
  {
    ...demoBase(),
    id: 'shams-zoom-h6',
    title: { en: 'Zoom H6 Portable Field Recorder', ar: 'مسجل صوت محمول زووم H6' },
    brand: 'Zoom',
    category: 'audio',
    price: 18900,
    images: [
      'https://images.unsplash.com/photo-1520166012956-add9ba0835cb?w=800&q=85',
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=85',
    ],
    description: {
      en: 'Six-track field recorder with interchangeable capsules and XLR inputs — for documentary, interview and film sound.',
      ar: 'مسجل ميداني بستة مسارات بكبسولات قابلة للتغيير ومداخل XLR — لصوت الأفلام التوثيقية والمقابلات.',
    },
    shortSpecs: [
      { en: '6-Track Recording', ar: 'تسجيل 6 مسارات' },
      { en: '4 x XLR/TRS Inputs', ar: '4 مداخل XLR/TRS' },
    ],
    inStock: true,
    stockCount: 6,
    specs: [
      {
        group: { en: 'Recording', ar: 'التسجيل' },
        items: [{ label: { en: 'Tracks', ar: 'المسارات' }, value: { en: '6', ar: '٦' } }],
      },
    ],
    isFeatured: true,
  },
  {
    ...demoBase(),
    id: 'shams-ath-m50x',
    title: { en: 'Audio-Technica ATH-M50x Studio Headphones', ar: 'سماعة استوديو أوديو تكنيكا ATH-M50x' },
    brand: 'Audio-Technica',
    category: 'audio',
    price: 6900,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=85'],
    description: {
      en: 'Closed-back monitoring headphones with detachable cables — for editing, monitoring and on-set playback.',
      ar: 'سماعة مراقبة مغلقة بكابلات قابلة للفك — للمونتاج والمراقبة والاستماع في موقع التصوير.',
    },
    shortSpecs: [
      { en: 'Closed-Back Monitoring', ar: 'مراقبة مغلقة' },
      { en: 'Detachable Cables', ar: 'كابلات قابلة للفك' },
    ],
    inStock: true,
    // Low stock.
    stockCount: 2,
    specs: [
      {
        group: { en: 'Audio', ar: 'الصوت' },
        items: [{ label: { en: 'Design', ar: 'التصميم' }, value: { en: 'Closed-back', ar: 'مغلقة' } }],
      },
    ],
  },

  // ------------------------------------------------------------ microphones
  {
    ...demoBase(),
    id: 'shams-rode-ntg5',
    title: { en: 'Rode NTG5 Shotgun Microphone Kit', ar: 'طقم ميكروفون رود NTG5 شوت جن' },
    brand: 'Rode',
    category: 'microphones',
    price: 24500,
    images: [
      'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&q=85',
      'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&q=85',
    ],
    description: {
      en: 'Lightweight broadcast shotgun microphone with shock mount and windshield, for boom and on-camera use.',
      ar: 'ميكروفون شوت جن خفيف لمستوى البث مع حاضن مانع للاهتزاز وعازل هواء، للبوم والتثبيت على الكاميرا.',
    },
    shortSpecs: [
      { en: 'Supercardioid Pattern', ar: 'نمط سوبر كارديود' },
      { en: 'Shock Mount & Windshield Included', ar: 'يشمل حاضن مانع للاهتزاز وعازل هواء' },
    ],
    inStock: true,
    stockCount: 5,
    specs: [
      {
        group: { en: 'Microphone', ar: 'الميكروفون' },
        items: [{ label: { en: 'Connector', ar: 'الموصل' }, value: { en: 'XLR', ar: 'XLR' } }],
      },
    ],
  },
  {
    ...demoBase(),
    id: 'shams-rode-wireless-go-ii',
    title: { en: 'Rode Wireless GO II Dual Microphone System', ar: 'نظام ميكروفون لاسلكي رود Wireless GO II مزدوج' },
    brand: 'Rode',
    category: 'microphones',
    price: 13200,
    images: ['https://images.unsplash.com/photo-1607355739828-0bf365440db1?w=800&q=85'],
    description: {
      en: 'Two-channel wireless microphone system with on-board recording — for interviews and two-person dialogue.',
      ar: 'نظام ميكروفون لاسلكي بقناتين مع تسجيل داخلي — للمقابلات وحوار شخصين.',
    },
    shortSpecs: [
      { en: 'Dual Transmitters', ar: 'مرسلين' },
      { en: 'On-board Recording', ar: 'تسجيل داخلي' },
    ],
    // Deliberately unavailable.
    inStock: false,
    stockCount: 0,
    specs: [
      {
        group: { en: 'Microphone', ar: 'الميكروفون' },
        items: [{ label: { en: 'Channels', ar: 'القنوات' }, value: { en: '2', ar: '٢' } }],
      },
    ],
  },

  // -------------------------------------------------- tripods & stabilizers
  {
    ...demoBase(),
    id: 'shams-manfrotto-befree',
    title: { en: 'Manfrotto Befree Advanced Travel Tripod', ar: 'حامل ثلاثي مانفروتو Befree Advanced للسفر' },
    brand: 'Manfrotto',
    category: 'tripods-stabilizers',
    price: 7400,
    images: [
      'https://images.unsplash.com/photo-1606933987254-25cbb6d54cd7?w=800&q=85',
      'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=800&q=85',
    ],
    description: {
      en: 'Folding travel tripod with ball head — compact enough for a camera bag, stable enough for a full body-and-lens setup.',
      ar: 'حامل ثلاثي قابل للطي مع رأس كروي — مدمج بيدخل شنطة الكاميرا وثابت يشيل بودي وعدسة.',
    },
    shortSpecs: [
      { en: 'Folding Travel Design', ar: 'تصميم قابل للطي للسفر' },
      { en: 'Ball Head Included', ar: 'يشمل رأس كروي' },
    ],
    inStock: true,
    stockCount: 10,
    variants: {
      colors: [
        {
          id: 'c-black',
          name: { en: 'Black', ar: 'أسود' },
          colorHex: '#111827',
          priceAdjustment: 0,
          sku: 'BEFREE-BLK',
          stock: 6,
        },
        {
          id: 'c-grey',
          name: { en: 'Grey', ar: 'رمادي' },
          colorHex: '#6B7280',
          priceAdjustment: 0,
          sku: 'BEFREE-GRY',
          stock: 4,
        },
      ],
    },
    specs: [
      {
        group: { en: 'Support', ar: 'الحمل' },
        items: [{ label: { en: 'Head Type', ar: 'نوع الرأس' }, value: { en: 'Ball head', ar: 'رأس كروي' } }],
      },
    ],
  },
  {
    ...demoBase(),
    id: 'shams-video-fluid-head-tripod',
    title: { en: 'Fluid-Head Video Tripod System', ar: 'طقم حامل فيديو برأس سائل' },
    brand: 'Shams Stores',
    category: 'tripods-stabilizers',
    price: 11500,
    images: ['https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=800&q=85'],
    description: {
      en: 'Two-stage video tripod with a fluid head for smooth pans and tilts — for interviews and event coverage.',
      ar: 'حامل فيديو من مرحلتين برأس سائل لحركة بان وتلت ناعمة — للمقابلات وتغطية المناسبات.',
    },
    shortSpecs: [
      { en: 'Fluid Head', ar: 'رأس سائل' },
      { en: 'Two-Stage Legs', ar: 'أرجل من مرحلتين' },
    ],
    inStock: true,
    stockCount: 7,
    specs: [
      {
        group: { en: 'Support', ar: 'الحمل' },
        items: [{ label: { en: 'Head Type', ar: 'نوع الرأس' }, value: { en: 'Fluid head', ar: 'رأس سائل' } }],
      },
    ],
  },

  // --------------------------------------- bags, cards, accessories, darkroom
  {
    ...demoBase(),
    id: 'shams-lowepro-protactic-450',
    title: { en: 'Lowepro ProTactic 450 AW II Camera Backpack', ar: 'شنطة ظهر كاميرا لوبرو ProTactic 450 AW II' },
    brand: 'Lowepro',
    category: 'bags-cases',
    price: 8600,
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=85'],
    description: {
      en: 'Modular camera backpack with all-weather cover — carries a body, several lenses and a laptop.',
      ar: 'شنطة ظهر معيارية للكاميرا مع غطاء لكل الأجواء — تشيل بودي وأكثر من عدسة ولابتوب.',
    },
    shortSpecs: [
      { en: 'All-Weather Cover', ar: 'غطاء لكل الأجواء' },
      { en: 'Laptop Compartment', ar: 'جيب للابتوب' },
    ],
    inStock: true,
    stockCount: 14,
    specs: [
      {
        group: { en: 'Capacity', ar: 'السعة' },
        items: [{ label: { en: 'Type', ar: 'النوع' }, value: { en: 'Backpack', ar: 'شنطة ظهر' } }],
      },
    ],
  },
  {
    ...demoBase(),
    id: 'shams-sandisk-extreme-pro-128',
    title: { en: 'SanDisk Extreme PRO 128GB SDXC Card', ar: 'كارت ذاكرة سان ديسك Extreme PRO 128 جيجا SDXC' },
    brand: 'SanDisk',
    category: 'memory-cards',
    price: 1450,
    images: ['https://images.unsplash.com/photo-1618410320928-25228d8bcbe1?w=800&q=85'],
    description: {
      en: 'High-speed SDXC card suited to burst stills and 4K video recording.',
      ar: 'كارت SDXC سريع مناسب للتصوير المتتابع وتسجيل فيديو 4K.',
    },
    shortSpecs: [
      { en: '128GB Capacity', ar: 'سعة 128 جيجا' },
      { en: 'UHS-I Speed Class', ar: 'فئة سرعة UHS-I' },
    ],
    inStock: true,
    stockCount: 25,
    specs: [
      {
        group: { en: 'Storage', ar: 'التخزين' },
        items: [{ label: { en: 'Capacity', ar: 'السعة' }, value: { en: '128 GB', ar: '128 جيجا' } }],
      },
    ],
  },
  {
    ...demoBase(),
    id: 'shams-battery-charger-kit',
    title: { en: 'Camera Battery & Dual Charger Kit', ar: 'طقم بطارية كاميرا وشاحن مزدوج' },
    brand: 'Shams Stores',
    category: 'camera-accessories',
    price: 2300,
    images: ['https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=85'],
    description: {
      en: 'Spare battery with a dual charger — the accessory most often forgotten before a long shoot day.',
      ar: 'بطارية احتياطية مع شاحن مزدوج — أكتر إكسسوار بيتنسي قبل يوم تصوير طويل.',
    },
    shortSpecs: [
      { en: 'Dual-Slot Charger', ar: 'شاحن بمنفذين' },
      { en: 'Spare Battery Included', ar: 'يشمل بطارية احتياطية' },
    ],
    inStock: true,
    stockCount: 18,
    specs: [
      {
        group: { en: 'Power', ar: 'الطاقة' },
        items: [{ label: { en: 'Charger Slots', ar: 'منافذ الشاحن' }, value: { en: '2', ar: '٢' } }],
      },
    ],
  },
  {
    ...demoBase(),
    id: 'shams-darkroom-enlarger-kit',
    title: { en: 'Darkroom Enlarger & Developing Kit', ar: 'طقم مكبّر وتحميض لغرفة التحميض' },
    brand: 'Shams Stores',
    category: 'darkroom',
    price: 12000,
    images: ['https://images.unsplash.com/photo-1495707902641-75cac588d2e9?w=800&q=85'],
    description: {
      en: 'Enlarger with developing trays and safelight — a starting point for a black-and-white darkroom.',
      ar: 'مكبّر مع صواني تحميض وإضاءة آمنة — نقطة بداية لغرفة تحميض أبيض وأسود.',
    },
    shortSpecs: [
      { en: 'Enlarger Included', ar: 'يشمل المكبّر' },
      { en: 'Developing Trays & Safelight', ar: 'صواني تحميض وإضاءة آمنة' },
    ],
    inStock: true,
    stockCount: 3,
    specs: [
      {
        group: { en: 'Kit', ar: 'الطقم' },
        items: [{ label: { en: 'Format', ar: 'المقاس' }, value: { en: '35mm', ar: '35 مم' } }],
      },
    ],
  },
  {
    ...demoBase(),
    id: 'shams-kodak-portra-400',
    title: { en: 'Kodak Portra 400 35mm Film (3-Pack)', ar: 'فيلم كوداك بورترا 400 مقاس 35 مم (3 عبوات)' },
    brand: 'Kodak',
    category: 'film',
    price: 1850,
    images: ['https://images.unsplash.com/photo-1495121553079-4c61bcce1894?w=800&q=85'],
    description: {
      en: 'Colour negative film known for natural skin tones — sold as a three-roll pack.',
      ar: 'فيلم نيجاتيف ملوّن معروف بدرجات البشرة الطبيعية — بيتباع عبوة 3 رولات.',
    },
    shortSpecs: [
      { en: 'ISO 400', ar: 'ISO 400' },
      { en: '3 Rolls per Pack', ar: '3 رولات في العبوة' },
    ],
    inStock: true,
    stockCount: 20,
    specs: [
      {
        group: { en: 'Film', ar: 'الفيلم' },
        items: [{ label: { en: 'Format', ar: 'المقاس' }, value: { en: '35mm', ar: '35 مم' } }],
      },
    ],
  },

  // ----------------------------------------------------------------- offers
  {
    ...demoBase(),
    id: 'shams-creator-starter-bundle',
    title: { en: 'Content Creator Starter Bundle', ar: 'باقة البداية لصنّاع المحتوى' },
    brand: 'Shams Stores',
    category: 'offers',
    price: 15900,
    originalPrice: 19500,
    images: [
      'https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b?w=800&q=85',
      'https://images.unsplash.com/photo-1601984862832-2ecfd3ba76ca?w=800&q=85',
    ],
    description: {
      en: 'LED light, tripod and a wireless microphone bundled for a first talking-head setup.',
      ar: 'إضاءة ليد وحامل ثلاثي وميكروفون لاسلكي في باقة واحدة لأول إعداد تصوير كلام أمام الكاميرا.',
    },
    shortSpecs: [
      { en: 'Light + Tripod + Microphone', ar: 'إضاءة + حامل + ميكروفون' },
      { en: 'Bundle Price', ar: 'سعر الباقة' },
    ],
    badge: { text: { en: 'Bundle Offer', ar: 'عرض الباقة' }, type: 'deal' },
    inStock: true,
    stockCount: 6,
    specs: [
      {
        group: { en: 'Bundle Contents', ar: 'محتويات الباقة' },
        items: [{ label: { en: 'Items', ar: 'عدد القطع' }, value: { en: '3', ar: '٣' } }],
      },
    ],
    isFeatured: true,
  },
  {
    ...demoBase(),
    id: 'shams-studio-lighting-kit',
    title: { en: 'Two-Head Studio Lighting Kit', ar: 'طقم إضاءة استوديو برأسين' },
    brand: 'Shams Stores',
    category: 'offers',
    price: 22400,
    originalPrice: 26000,
    images: ['https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=800&q=85'],
    description: {
      en: 'Two continuous LED heads with stands and softboxes — a complete small-studio lighting setup.',
      ar: 'رأسين إضاءة ليد مستمرة مع حوامل وسوفت بوكس — إعداد إضاءة كامل لاستوديو صغير.',
    },
    shortSpecs: [
      { en: '2 LED Heads', ar: 'رأسين ليد' },
      { en: 'Stands & Softboxes Included', ar: 'يشمل حوامل وسوفت بوكس' },
    ],
    badge: { text: { en: 'Bundle Offer', ar: 'عرض الباقة' }, type: 'deal' },
    inStock: true,
    stockCount: 4,
    specs: [
      {
        group: { en: 'Bundle Contents', ar: 'محتويات الباقة' },
        items: [{ label: { en: 'Heads', ar: 'الرؤوس' }, value: { en: '2', ar: '٢' } }],
      },
    ],
    isFeatured: true,
  },
];
