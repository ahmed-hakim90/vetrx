import { Category, Product } from '../types/store';

// Currency symbols and conversion rates now live in each client's own config
// (ClientConfig.currencies) so that one client's build never carries another
// market's currency codes.

export const CATEGORIES: Category[] = [
  {
    id: 'smartphones',
    slug: 'smartphones',
    name: { en: 'Smartphones & Tablets', ar: 'الهواتف الذكية والأجهزة اللوحية' },
    icon: 'Smartphone',
    count: 42,
    image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&q=80',
    featured: true,
  },
  {
    id: 'laptops',
    slug: 'laptops',
    name: { en: 'Laptops & Computing', ar: 'أجهزة الكمبيوتر المحمولة والمكتبية' },
    icon: 'Laptop',
    count: 36,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
    featured: true,
  },
  {
    id: 'audio',
    slug: 'audio',
    name: { en: 'Audio & Hi-Fi', ar: 'الصوتيات وسماعات الرأس' },
    icon: 'Headphones',
    count: 28,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    featured: true,
  },
  {
    id: 'gaming',
    slug: 'gaming',
    name: { en: 'Pro Gaming Gear', ar: 'معدات الألعاب الاحترافية' },
    icon: 'Gamepad2',
    count: 31,
    image: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=600&q=80',
    featured: true,
  },
  {
    id: 'wearables',
    slug: 'wearables',
    name: { en: 'Wearables & Smartwatches', ar: 'الساعات والأجهزة القابلة للارتداء' },
    icon: 'Watch',
    count: 19,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    featured: true,
  },
  {
    id: 'smarthome',
    slug: 'smarthome',
    name: { en: 'Smart Living & IoT', ar: 'المنزل الذكي وإنترنت الأشياء' },
    icon: 'Home',
    count: 24,
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=600&q=80',
    featured: true,
  },
];

export const PRODUCTS: Product[] = [
  // 1. Voltix Flagship Phone
  {
    id: 'prod-iphone-16-pro-max',
    storeId: 'voltix',
    title: {
      en: 'Apple iPhone 16 Pro Max (512GB) - Titanium Finish',
      ar: 'أبل آيفون 16 برو ماكس (512 جيجابايت) - هيكل تيتانيوم مصقول',
    },
    brand: 'Apple',
    category: 'smartphones',
    price: 5099,
    originalPrice: 5599,
    rating: 4.9,
    reviewCount: 342,
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=85',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=85',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&q=85',
    ],
    description: {
      en: 'Forged in aerospace-grade grade 5 titanium with the industry-leading A18 Pro chip. Features Camera Control button, 48MP Fusion camera system with 5x telephoto, and revolutionary Apple Intelligence architecture with unmatched all-day battery life.',
      ar: 'مصنوع من تيتانيوم الفئة 5 المستخدم في هندسة الطيران والفضاء ومزود بشريحة A18 Pro الرائدة عالمياً. يتميز بزر التحكم بالكاميرا الجديد كلياً، ونظام كاميرات Fusion بدقة 48 ميجابكسل مع تقريب بصري 5x، ومحرك الذكاء الفائق أبل إنتلجنس مع بطارية تدوم طوال اليوم.',
    },
    shortSpecs: [
      { en: '6.9" Super Retina XDR OLED (120Hz ProMotion)', ar: 'شاشة 6.9 بوصة سوبر ريتينا XDR أوليد 120 هرتز' },
      { en: 'A18 Pro 3nm Chip with 6-core GPU', ar: 'شريحة A18 Pro بدقة تصنيع 3 نانومتر مع معالج رسومي سداسي النوى' },
      { en: '48MP Main + 48MP Ultra-Wide + 12MP 5x Telephoto', ar: 'نظام كاميرات ثلاثي 48 ميجابكسل رئيسي وواسع جداً و12 ميجابكسل تيليفوتو' },
      { en: 'All-Day Battery: Up to 33 Hours Video Playback', ar: 'بطارية تدوم طوال اليوم: حتى 33 ساعة من تشغيل الفيديو' },
    ],
    badge: { text: { en: 'Flagship Deal', ar: 'عرض رائد' }, type: 'hot' },
    inStock: true,
    stockCount: 14,
    variants: {
      colors: [
        { id: 'c-nat', name: { en: 'Natural Titanium', ar: 'تيتانيوم طبيعي' }, colorHex: '#9b9893', priceAdjustment: 0, sku: 'IP16PM-NAT', stock: 6 },
        { id: 'c-blk', name: { en: 'Black Titanium', ar: 'تيتانيوم أسود' }, colorHex: '#2f2f32', priceAdjustment: 0, sku: 'IP16PM-BLK', stock: 4 },
        { id: 'c-wht', name: { en: 'White Titanium', ar: 'تيتانيوم أبيض' }, colorHex: '#e5e5ea', priceAdjustment: 0, sku: 'IP16PM-WHT', stock: 4 },
      ],
      storage: [
        { id: 's-256', name: { en: '256 GB', ar: '256 جيجابايت' }, priceAdjustment: -400, sku: 'IP16PM-256', stock: 8 },
        { id: 's-512', name: { en: '512 GB', ar: '512 جيجابايت' }, priceAdjustment: 0, sku: 'IP16PM-512', stock: 4 },
        { id: 's-1tb', name: { en: '1 TB', ar: '1 تيرابايت' }, priceAdjustment: 750, sku: 'IP16PM-1TB', stock: 2 },
      ],
    },
    specs: [
      {
        group: { en: 'Display & Design', ar: 'الشاشة والتصميم' },
        items: [
          { label: { en: 'Screen Size', ar: 'حجم الشاشة' }, value: { en: '6.9 inches OLED', ar: '6.9 بوصة أوليد' } },
          { label: { en: 'Resolution', ar: 'دقة العرض' }, value: { en: '2868 x 1320 pixels at 460 ppi', ar: '2868 × 1320 بكسل بكثافة 460 بكسل لكل بوصة' } },
          { label: { en: 'Peak Brightness', ar: 'ذروة السطوع' }, value: { en: '2000 nits Outdoor', ar: '2000 شمعة تحت أشعة الشمس' } },
          { label: { en: 'Chassis Material', ar: 'خامات الهيكل' }, value: { en: 'Grade 5 Titanium & Ceramic Shield', ar: 'تيتانيوم الدرجة 5 ودرع سيراميك فائق الصلابة' } },
        ],
      },
      {
        group: { en: 'Processor & Power', ar: 'المعالج والطاقة' },
        items: [
          { label: { en: 'Chipset', ar: 'المعالج' }, value: { en: 'Apple A18 Pro (3nm)', ar: 'أبل A18 Pro (3 نانومتر)' } },
          { label: { en: 'Neural Engine', ar: 'المحرك العصبي' }, value: { en: '16-core Apple Intelligence', ar: '16 نواة معالجة للذكاء الاصطناعي' } },
          { label: { en: 'Charging Port', ar: 'منفذ الشحن' }, value: { en: 'USB-C (USB 3 up to 10Gb/s)', ar: 'يو إس بي سي (USB 3 حتى 10 جيجابت/ث)' } },
        ],
      },
    ],
    reviews: [
      {
        id: 'rev-1',
        author: 'Khalid Al-Nuaimi',
        rating: 5,
        date: '2025-02-18',
        title: { en: 'Best smartphone on the market hands down', ar: 'أفضل هاتف ذكي في السوق بدون أدنى منازع' },
        comment: {
          en: 'The battery easily lasts two full days of heavy usage. Camera control is surprisingly intuitive for 4K 120fps video capture.',
          ar: 'البطارية تصمد يومين كاملين بسهولة مع الاستخدام المكثف. زر التحكم بالكاميرا سلس ومبتكر جداً لتصوير الفيديو بدقة 4K بمعدل 120 إطاراً في الثانية.',
        },
        verified: true,
      },
      {
        id: 'rev-2',
        author: 'Sarah Mansoor',
        rating: 5,
        date: '2025-02-10',
        title: { en: 'Blazing fast delivery in Dubai', ar: 'توصيل فائق السرعة خلال ساعات في دبي' },
        comment: {
          en: 'Ordered at 9 AM and received it by 1:30 PM with official warranty certificate. Excellent packaging and customer care.',
          ar: 'طلبت الهاتف في التاسعة صباحاً ووصلني عند الواحدة والنصف ظهراً مع شهادة الضمان الرسمية وتغليف ممتاز.',
        },
        verified: true,
      },
    ],
    warranty: { en: '2-Year Official Apple GCC Authorized Warranty', ar: 'ضمان رسمي معتمد سنتين من أبل في دول الخليج' },
    isFeatured: true,
  },

  // 2. Samsung S25 Ultra
  {
    id: 'prod-samsung-s25-ultra',
    storeId: 'voltix',
    title: {
      en: 'Samsung Galaxy S25 Ultra 5G (512GB) - Titanium Gray',
      ar: 'سامسونج جالاكسي إس 25 ألترا 5G (512 جيجابايت) - تيتانيوم رمادي',
    },
    brand: 'Samsung',
    category: 'smartphones',
    price: 4799,
    originalPrice: 5299,
    rating: 4.8,
    reviewCount: 215,
    images: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=85',
      'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&q=85',
    ],
    description: {
      en: 'The ultimate AI flagship smartphone with built-in S-Pen, Qualcomm Snapdragon 8 Elite processor, 200MP quad telephoto camera system, and ultra anti-reflective Gorilla Armor 2 display.',
      ar: 'الهاتف الرائد الأقوى بالذكاء الاصطناعي مع قلم S-Pen مدمج، ومعالج كوالكوم سنابدراجون 8 إيليت فائق السرعة، ونظام كاميرات رباعي بدقة 200 ميجابكسل مع زجاج غوريلا أرمور المقاوم للانعكاس.',
    },
    shortSpecs: [
      { en: '6.8" Dynamic AMOLED 2X (1-120Hz Anti-Reflective)', ar: 'شاشة 6.8 بوصة ديناميك أموليد 2X مضادة للانعكاس' },
      { en: 'Snapdragon 8 Elite for Galaxy (3nm)', ar: 'معالج سنابدراجون 8 إيليت المخصص لجالاكسي' },
      { en: '200MP Main + 50MP 5x Periscope + S-Pen', ar: 'كاميرا 200 ميجابكسل + 50 ميجابكسل بيريسكوب + قلم S-Pen مدمج' },
      { en: '5000mAh Battery with 45W Fast Charge', ar: 'بطارية 5000 مللي أمبير مع شحن فائق السرعة بقدرة 45 واط' },
    ],
    badge: { text: { en: 'Sale -10%', ar: 'خصم 10%' }, type: 'sale' },
    inStock: true,
    stockCount: 9,
    variants: {
      colors: [
        { id: 'c-gry', name: { en: 'Titanium Gray', ar: 'تيتانيوم رمادي' }, colorHex: '#6b7280', priceAdjustment: 0, sku: 'S25U-GRY', stock: 5 },
        { id: 'c-blk', name: { en: 'Titanium Black', ar: 'تيتانيوم أسود' }, colorHex: '#111827', priceAdjustment: 0, sku: 'S25U-BLK', stock: 4 },
      ],
      storage: [
        { id: 's-256', name: { en: '256 GB', ar: '256 جيجابايت' }, priceAdjustment: -350, sku: 'S25U-256', stock: 6 },
        { id: 's-512', name: { en: '512 GB', ar: '512 جيجابايت' }, priceAdjustment: 0, sku: 'S25U-512', stock: 3 },
      ],
    },
    specs: [
      {
        group: { en: 'Hardware & Camera', ar: 'العتاد والكاميرا' },
        items: [
          { label: { en: 'Main Sensor', ar: 'المستشعر الرئيسي' }, value: { en: '200 MP f/1.7 OIS', ar: '200 ميجابكسل بفتحة عدسة f/1.7 مع تثبيت بصري' } },
          { label: { en: 'RAM', ar: 'ذاكرة الرام' }, value: { en: '16GB LPDDR5X', ar: '16 جيجابايت LPDDR5X' } },
        ],
      },
    ],
    reviews: [
      {
        id: 'rev-3',
        author: 'Fahad Al-Zahrani',
        rating: 5,
        date: '2025-01-28',
        title: { en: 'Galaxy AI features are incredible', ar: 'مزايا جالاكسي للذكاء الاصطناعي مذهلة' },
        comment: {
          en: 'Real-time call translation in Arabic works like magic. Screen reflection reduction makes outdoor reading effortless.',
          ar: 'الترجمة الفورية للمكالمات باللغة العربية تعمل بسلاسة فائقة، وانعدام انعكاس الشاشة يجعل القراءة تحت الشمس مريحة جداً.',
        },
        verified: true,
      },
    ],
    warranty: { en: '2-Year Samsung Gulf Warranty with Screen Protection', ar: 'ضمان سنتين من سامسونج الخليج مع حماية للشاشة' },
    isFeatured: true,
  },

  // 3. Apple MacBook Pro M4 Max
  {
    id: 'prod-macbook-pro-m4',
    storeId: 'voltix',
    title: {
      en: 'Apple MacBook Pro 16" (M4 Max, 36GB RAM, 1TB SSD) - Space Black',
      ar: 'أبل ماك بوك برو 16 بوصة (M4 Max، رام 36 جيجابايت، 1 تيرابايت) - أسود فلكي',
    },
    brand: 'Apple',
    category: 'laptops',
    price: 13499,
    originalPrice: 14299,
    rating: 5.0,
    reviewCount: 128,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=85',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=85',
    ],
    description: {
      en: 'Engineered for developers, 3D animators, and music producers. The M4 Max chip with 14-core CPU and 32-core GPU delivers monstrous power with silent efficiency and up to 24 hours of battery longevity.',
      ar: 'مصمم خصيصاً للمطورين ومحترفي الرسوم ثلاثية الأبعاد وصناع المحتوى. شريحة M4 Max بمعالج مركزي 14 نواة ومعالج رسومي 32 نواة تقدم قوة هائلة بهدوء تام وبطارية تدوم حتى 24 ساعة.',
    },
    shortSpecs: [
      { en: '16.2" Liquid Retina XDR Mini-LED (1600 nits Peak)', ar: 'شاشة 16.2 بوصة ليكويد ريتينا XDR ميني ليد' },
      { en: 'Apple M4 Max Chip (14-Core CPU, 32-Core GPU)', ar: 'شريحة M4 Max فائقة القوة (14 نواة مركزية، 32 نواة رسومية)' },
      { en: '36GB Unified Memory + 1TB Fast NVMe SSD', ar: 'ذاكرة موحدة 36 جيجابايت وسعة تخزين فائق السرعة 1 تيرابايت' },
      { en: 'MagSafe 3, 3x Thunderbolt 5, HDMI 2.1, SDXC', ar: 'منافذ ثندربولت 5 ومغناطيس ماج سيف 3 وقارئ بطاقات SDXC' },
    ],
    badge: { text: { en: 'Pro Workstation', ar: 'محطة عمل احترافية' }, type: 'new' },
    inStock: true,
    stockCount: 5,
    variants: {
      colors: [
        { id: 'c-sb', name: { en: 'Space Black', ar: 'أسود فلكي' }, colorHex: '#1e2022', priceAdjustment: 0, sku: 'MBP16-SB', stock: 3 },
        { id: 'c-slv', name: { en: 'Silver', ar: 'فضي' }, colorHex: '#e5e7eb', priceAdjustment: 0, sku: 'MBP16-SLV', stock: 2 },
      ],
      storage: [
        { id: 's-1tb', name: { en: '1 TB SSD', ar: '1 تيرابايت' }, priceAdjustment: 0, sku: 'MBP-1TB', stock: 3 },
        { id: 's-2tb', name: { en: '2 TB SSD', ar: '2 تيرابايت' }, priceAdjustment: 1800, sku: 'MBP-2TB', stock: 2 },
      ],
    },
    specs: [
      {
        group: { en: 'Performance & Display', ar: 'الأداء والشاشة' },
        items: [
          { label: { en: 'Display Technology', ar: 'تقنية العرض' }, value: { en: 'Liquid Retina XDR, ProMotion 120Hz', ar: 'ليكويد ريتينا XDR مع برو موشن 120 هرتز' } },
          { label: { en: 'Memory Bandwidth', ar: 'عرض حزمة الذاكرة' }, value: { en: '410 GB/s', ar: '410 جيجابايت في الثانية' } },
        ],
      },
    ],
    reviews: [
      {
        id: 'rev-4',
        author: 'Omar Al-Haddad',
        rating: 5,
        date: '2025-02-12',
        title: { en: 'Unrivaled compilation speeds', ar: 'سرعة تصيير وبرمجة لا تضاهى' },
        comment: {
          en: 'Renders 8K ProRes RAW video without breaking a sweat. The battery lasts a full 14-hour workday without plugging in.',
          ar: 'يعالج تصدير فيديوهات 8K بروريس بكل سلاسة وهدوء تام. والبطارية تكفي يوم عمل كامل 14 ساعة دون الحاجة للشاحن.',
        },
        verified: true,
      },
    ],
    warranty: { en: '2-Year Official Apple GCC Care Warranty', ar: 'ضمان رسمي معتمد سنتين من أبل الخليج' },
    isFeatured: true,
  },

  // 4. Sony WH-1000XM5 Headphones (Deal of the Day)
  {
    id: 'prod-sony-wh1000xm5',
    storeId: 'voltix',
    title: {
      en: 'Sony WH-1000XM5 Wireless Noise-Cancelling Headphones',
      ar: 'سماعات الرأس اللاسلكية سوني WH-1000XM5 بعزل الضوضاء النشط',
    },
    brand: 'Sony',
    category: 'audio',
    price: 1099,
    originalPrice: 1499,
    rating: 4.8,
    reviewCount: 489,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=85',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=85',
    ],
    description: {
      en: 'Industry-leading noise cancellation optimized automatically based on your wearing conditions and environment. Features 8 microphones, LDAC Hi-Res Audio, Speak-to-Chat, and 30-hour battery life with quick charging.',
      ar: 'أفضل تقنية لعزل الضوضاء في العالم يتم ضبطها تلقائياً حسب البيئة المحيطة. مزودة بـ 8 ميكروفونات متطورة، وصوت عالي الدقة بنظام LDAC، وميزة التحدث للدردشة التلقائية وبطارية تدوم 30 ساعة مع شحن سريع.',
    },
    shortSpecs: [
      { en: 'Auto NC Optimizer with V1 + QN1 Processors', ar: 'معالجا V1 و QN1 لعزل الضجيج التلقائي الذكي' },
      { en: '30-Hour Battery Life (3 min charge = 3 hours)', ar: 'بطارية 30 ساعة (3 دقائق شحن تمنحك 3 ساعات استماع)' },
      { en: 'Crystal-Clear Hands-Free Calling with 4 Beamforming Mics', ar: 'مكالمات فائقة النقاء بـ 4 ميكروفونات موجهة' },
      { en: 'Multipoint Connection: Pair 2 Devices Simultaneously', ar: 'اتصال متعدد الأجهزة: الربط بجهازين معاً في نفس الوقت' },
    ],
    badge: { text: { en: 'Save 27% Today', ar: 'وفّر 27% اليوم' }, type: 'deal' },
    inStock: true,
    stockCount: 8,
    variants: {
      colors: [
        { id: 'c-slv', name: { en: 'Silver Platinum', ar: 'فضي بلاتيني' }, colorHex: '#d1d5db', priceAdjustment: 0, sku: 'XM5-SLV', stock: 5 },
        { id: 'c-blk', name: { en: 'Matte Black', ar: 'أسود مطفي' }, colorHex: '#18181b', priceAdjustment: 0, sku: 'XM5-BLK', stock: 3 },
        { id: 'c-blu', name: { en: 'Midnight Blue', ar: 'أزرق كحلي' }, colorHex: '#1e3a8a', priceAdjustment: 50, sku: 'XM5-BLU', stock: 0 },
      ],
    },
    specs: [
      {
        group: { en: 'Audio & Connectivity', ar: 'الصوت والاتصال' },
        items: [
          { label: { en: 'Driver Unit', ar: 'حجم مكبر الصوت' }, value: { en: '30 mm Carbon Fiber Dome', ar: '30 مم قبة ألياف الكربون خفيفة الوزن' } },
          { label: { en: 'Bluetooth Version', ar: 'إصدار البلوتوث' }, value: { en: '5.2 with LDAC, AAC, SBC', ar: 'بلوتوث 5.2 مع دعم LDAC و AAC' } },
        ],
      },
    ],
    reviews: [
      {
        id: 'rev-5',
        author: 'Zaid Al-Marri',
        rating: 5,
        date: '2025-02-04',
        title: { en: 'Silence in noisy flights and offices', ar: 'هدوء وصمت تام في الرحلات الجوية والمكاتب' },
        comment: {
          en: 'The comfort is superior to previous generations. Noise cancelling makes background chatter disappear entirely.',
          ar: 'الراحة أثناء الارتداء تفوق الأجيال السابقة بكثير. عزل الضجيج يلغي أصوات الطائرات والضوضاء المحيطة تماماً.',
        },
        verified: true,
      },
    ],
    warranty: { en: '2-Year Official Sony GCC Authorized Warranty', ar: 'ضمان سنتين معتمد من سوني الخليج' },
    isFeatured: true,
    isFlashDeal: true,
    flashDealSoldPercentage: 82,
  },

  // 5. Apex Gaming Gear: ASUS ROG Zephyrus G16
  {
    id: 'prod-rog-zephyrus-g16',
    storeId: 'apex',
    title: {
      en: 'ASUS ROG Zephyrus G16 OLED (Intel Core Ultra 9, RTX 4080, 32GB, 2TB) - Eclipse Gray',
      ar: 'لابتوب ألعاب آسوس روج زيفيروس G16 أوليد (إنتل ألترا 9، RTX 4080، رام 32، 2 تيرابايت)',
    },
    brand: 'ASUS ROG',
    category: 'gaming',
    price: 9899,
    originalPrice: 10999,
    rating: 4.9,
    reviewCount: 164,
    images: [
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=85',
      'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&q=85',
    ],
    description: {
      en: 'The pinnacle of portable gaming mastery. Encased in a CNC-machined aluminum chassis with Slash Lighting. Powered by Intel Core Ultra 9 and NVIDIA GeForce RTX 4080 Laptop GPU on a jaw-dropping 2.5K 240Hz ROG Nebula OLED display.',
      ar: 'قمة هندسة أجهزة الألعاب المحمولة. هيكل ألمنيوم CNC نحيف للغاية مع شريط إضاءة Slash، ومعالج إنتل كور ألترا 9 وبطاقة رسوميات إنفيديا RTX 4080 وشاشة روج نيبولا أوليد بدقة 2.5K وتردد خيالي 240 هرتز.',
    },
    shortSpecs: [
      { en: '16" 2.5K (2560x1600) 240Hz 0.2ms ROG Nebula OLED Display', ar: 'شاشة 16 بوصة 2.5K أوليد بتردد 240 هرتز وزمن استجابة 0.2 مللي ثانية' },
      { en: 'Intel Core Ultra 9 185H with Dedicated AI NPU', ar: 'معالج إنتل كور ألترا 9 185H مع وحدة معالجة عصبية NPU' },
      { en: 'NVIDIA GeForce RTX 4080 (12GB GDDR6)', ar: 'بطاقة رسوميات إنفيديا جيفورس RTX 4080 بسعة 12 جيجابايت' },
      { en: '32GB LPDDR5X-7467MHz + 2TB PCIe 4.0 SSD', ar: 'ذاكرة رام 32 جيجابايت فائقة السرعة مع 2 تيرابايت SSD' },
    ],
    badge: { text: { en: 'Pro Esports Choice', ar: 'خيار محترفي الألعاب' }, type: 'hot' },
    inStock: true,
    stockCount: 4,
    variants: {
      colors: [
        { id: 'c-ecl', name: { en: 'Eclipse Gray', ar: 'رمادي كسوف' }, colorHex: '#27272a', priceAdjustment: 0, sku: 'G16-ECL', stock: 3 },
        { id: 'c-plt', name: { en: 'Platinum White', ar: 'أبيض بلاتيني' }, colorHex: '#f4f4f5', priceAdjustment: 200, sku: 'G16-PLT', stock: 1 },
      ],
    },
    specs: [
      {
        group: { en: 'Gaming Specs & Cooling', ar: 'مواصفات الألعاب والتبريد' },
        items: [
          { label: { en: 'Display Refresh Rate', ar: 'معدل تحديث الشاشة' }, value: { en: '240Hz / 0.2ms Response G-Sync', ar: '240 هرتز مع زمن استجابة 0.2 مللي ثانية ودعم G-Sync' } },
          { label: { en: 'Thermal Solution', ar: 'نظام التبريد' }, value: { en: 'ROG Intelligent Cooling with Liquid Metal', ar: 'تبريد ذكي بغرف البخار والمعدن السائل' } },
        ],
      },
    ],
    reviews: [
      {
        id: 'rev-6',
        author: 'Majed Al-Ghamdi',
        rating: 5,
        date: '2025-01-20',
        title: { en: 'Plays Cyberpunk & Warzone at ultra effortlessly', ar: 'يشغل أثقل الألعاب على أعلى إعدادات بأريحية' },
        comment: {
          en: 'The OLED screen is unbelievable. Blacks are pure and colors pop like nothing else. Sleek enough to take to client meetings.',
          ar: 'شاشة الأوليد خيالية بألوانها وسوادها الحقيقي. الجهاز نحيف وأنيق بحيث تستطيع أخذه لبيئة العمل دون إحراج.',
        },
        verified: true,
      },
    ],
    warranty: { en: '2-Year ASUS Perfect Warranty with Accidental Damage Cover', ar: 'ضمان شامل سنتين من آسوس مع تغطية الأضرار العرضية' },
    isFeatured: true,
  },

  // 6. Apex Gaming: Logitech G PRO X 2 LIGHTSPEED Headset
  {
    id: 'prod-logitech-pro-x-2',
    storeId: 'apex',
    title: {
      en: 'Logitech G PRO X 2 LIGHTSPEED Wireless Gaming Headset - Graphene Drivers',
      ar: 'سماعة الألعاب اللاسلكية لوجيتك جي برو إكس 2 لايت سبيد - محركات جرافين',
    },
    brand: 'Logitech G',
    category: 'gaming',
    price: 899,
    originalPrice: 1049,
    rating: 4.8,
    reviewCount: 95,
    images: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=85',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=85',
    ],
    description: {
      en: 'Designed with the world’s top esports athletes. PRO-G 50mm Graphene drivers provide groundbreaking audio response and positional precision for competitive FPS clarity.',
      ar: 'صممت بالتعاون مع نخبة لاعبي الرياضات الإلكترونية حول العالم. محركات جرافين 50 مم تقدم دقة متناهية وسرعة استجابة لتحديد مواقع الأقدام والطلقات في ألعاب التصويب.',
    },
    shortSpecs: [
      { en: '50mm Graphene Audio Drivers', ar: 'محركات صوتية مصنوعة من الجرافين النقي 50 مم' },
      { en: 'LIGHTSPEED Wireless (Up to 50h Battery)', ar: 'اتصال لايت سبيد فائق السرعة وبطارية حتى 50 ساعة' },
      { en: 'DTS Headphone:X 2.0 7.1 Surround Sound', ar: 'صوت محيطي مجسم 7.1 DTS Headphone:X 2.0' },
      { en: 'Detachable 6mm Cardioid Mic with Blue VO!CE', ar: 'ميكروفون قابل للفصل مزود بفلاتر بلو فويس الاحترافية' },
    ],
    badge: { text: { en: 'Esports Certified', ar: 'معتمدة للبطولات' }, type: 'deal' },
    inStock: true,
    stockCount: 11,
    specs: [
      {
        group: { en: 'Wireless & Audio', ar: 'الاتصال والصوت' },
        items: [
          { label: { en: 'Wireless Range', ar: 'مدى الاتصال اللاسلكي' }, value: { en: 'Up to 30 meters', ar: 'حتى 30 متراً' } },
        ],
      },
    ],
    reviews: [
      {
        id: 'rev-7',
        author: 'Saud Al-Otaibi',
        rating: 5,
        date: '2025-02-14',
        title: { en: 'Spatial awareness in CS2 and Valorant is next level', ar: 'دقة تحديد الخطوات في فالورانت وكاونتر سترايك غير طبيعية' },
        comment: {
          en: 'You can hear exactly where enemies are defusing or reloading. Lightweight and zero headband fatigue.',
          ar: 'تسمع بوضوح شديد صوت خطوات الخصوم وإعادة تعبئة السلاح. خفيفة جداً ومريحة في جلسات اللعب الطويلة.',
        },
        verified: true,
      },
    ],
    warranty: { en: '2-Year Official Logitech GCC Warranty', ar: 'ضمان رسمي سنتين من لوجيتك الخليج' },
    isFeatured: true,
    isFlashDeal: true,
    flashDealSoldPercentage: 65,
  },

  // 7. Lumina Smart Living: Roborock S8 Pro Ultra Robot Vacuum
  {
    id: 'prod-roborock-s8-pro-ultra',
    storeId: 'lumina',
    title: {
      en: 'Roborock S8 Pro Ultra Robot Vacuum & Mop with All-in-One RockDock Ultra',
      ar: 'المكنسة والممسحة الروبوتية الذكية روبوروك S8 برو ألترا مع محطة التفريغ والغسيل التلقائي',
    },
    brand: 'Roborock',
    category: 'smarthome',
    price: 3999,
    originalPrice: 4799,
    rating: 4.9,
    reviewCount: 112,
    images: [
      'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=85',
      'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&q=85',
    ],
    description: {
      en: 'The ultimate hands-free automated cleaning station. RockDock Ultra washes, dries with warm air, empties dust for 7 weeks, and auto-refills the water tank. Powered by 6000Pa suction and VibraRise 2.0 dual sonic mopping.',
      ar: 'محطة التنظيف الذاتي الأقوى على الإطلاق. تقوم المحطة بغسيل الممسحة وتجفيفها بالهواء الدافئ لمنع البكتيريا والروائح، مع تفريغ الغبار تلقائياً لمدة 7 أسابيع وإعادة ملء خزان المياه بقوة شفط جبارة 6000 باسكال.',
    },
    shortSpecs: [
      { en: 'RockDock Ultra: Self-Washing, Self-Drying, Self-Emptying & Refilling', ar: 'محطة RockDock: غسيل ذاتي وتجفيف وتفريغ تلقائي للغبار والماء' },
      { en: '6,000Pa HyperForce Extreme Suction Power', ar: 'قوة شفط فائقة 6000 باسكال تلتقط أدق ذرات الغبار' },
      { en: 'Reactive 3D AI Obstacle Avoidance + PreciSense LiDAR', ar: 'تجنب ذكي للعوائق ثلاثي الأبعاد مع رادار ليدار فائق الدقة' },
      { en: 'VibraRise 2.0 Dual Sonic Vibration Mopping System', ar: 'نظام مسح مزدوج بالاهتزاز الصوتي 3000 دورة بالدقيقة مع رفع آلي' },
    ],
    badge: { text: { en: 'Top Rated 2025', ar: 'الأعلى تقييماً' }, type: 'hot' },
    inStock: true,
    stockCount: 6,
    specs: [
      {
        group: { en: 'Cleaning & Automation', ar: 'التنظيف والأتمتة' },
        items: [
          { label: { en: 'Mopping Vibration', ar: 'تردد اهتزاز الممسحة' }, value: { en: '3,000 times/min with 6N down pressure', ar: '3000 مرة/دقيقة مع ضغط سفلي 6 نيوتن' } },
          { label: { en: 'Dustbag Capacity', ar: 'سعة كيس الغبار' }, value: { en: '2.5L (up to 7 weeks)', ar: '2.5 لتر (تكفي حتى 7 أسابيع)' } },
        ],
      },
    ],
    reviews: [
      {
        id: 'rev-8',
        author: 'Dr. Reem Al-Sabah',
        rating: 5,
        date: '2025-01-15',
        title: { en: 'Completely transformed our home cleaning routine', ar: 'غيرت روتين نظافة منزلنا بشكل جذري' },
        comment: {
          en: 'The self-drying mop prevents any odors. Floors are spotless every day even with pets. Outstanding smart mapping via mobile app.',
          ar: 'التجفيف التلقائي للممسحة بالهواء يمنع الروائح تماماً، والأرضيات تلمع يومياً رغم وجود حيوانات أليفة. تطبيق الجوال ذكي ودقيق جداً.',
        },
        verified: true,
      },
    ],
    warranty: { en: '2-Year Official GCC Agency Warranty with Home Pickup', ar: 'ضمان رسمي سنتين مع خدمة الاستلام والصيانة من المنزل' },
    isFeatured: true,
  },

  // 8. Lumina Smart Living: Philips Hue Smart Home Ambience Starter Kit
  {
    id: 'prod-philips-hue-starter',
    storeId: 'lumina',
    title: {
      en: 'Philips Hue White & Color Ambiance Smart Lighting Starter Kit (4 Bulbs + Bridge)',
      ar: 'طقم إضاءة فيليبس هيو الذكي بالألوان الكاملة والأبيض (4 مصابيح + جسر الاتصال)',
    },
    brand: 'Philips Hue',
    category: 'smarthome',
    price: 749,
    originalPrice: 899,
    rating: 4.7,
    reviewCount: 88,
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=85',
      'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=85',
    ],
    description: {
      en: 'Transform your living spaces with 16 million colors and tunable white lighting. Sync lights with music, movies, and PC games. Integrates natively with Apple HomeKit, Alexa, and Google Assistant.',
      ar: 'حوّل أجواء منزلك مع 16 مليون لون وإضاءات بيضاء دافئة وباردة قابلة للتعديل. مزامنة فورية مع الموسيقى والأفلام والألعاب. يتكامل بسلاسة مع أبل هوم كيت وأليكسا ومساعد جوجل.',
    },
    shortSpecs: [
      { en: '16 Million Colors + Warm to Cool Daylight Whites', ar: '16 مليون لون مذهل مع درجات الأبيض الدافئ والبارد' },
      { en: 'Includes Hue Bridge Hub + Smart Dimmer Switch', ar: 'يشمل موزع هيو بريدج ومفتاح تعتيم ذكي لاسلكي' },
      { en: 'Works with Apple Home, Google Home & Amazon Alexa', ar: 'متوافق مع أبل هوم وجوجل هوم وأمازون أليكسا' },
      { en: 'Music, TV & Screen Light Syncing Support', ar: 'دعم المزامنة الضوئية التفاعلية مع شاشات التلفاز والموسيقى' },
    ],
    badge: { text: { en: 'Best Seller', ar: 'الأكثر مبيعاً' }, type: 'sale' },
    inStock: true,
    stockCount: 18,
    specs: [
      {
        group: { en: 'Luminance & Smart Protocol', ar: 'السطوع والبروتوكول الذكي' },
        items: [
          { label: { en: 'Lumen Output', ar: 'شدة الإضاءة' }, value: { en: '1100 Lumens per bulb (75W equivalent)', ar: '1100 لومن لكل مصباح (يعادل 75 واط)' } },
          { label: { en: 'Protocol', ar: 'بروتوكول الاتصال' }, value: { en: 'Zigbee & Bluetooth Mesh', ar: 'زيجبي وبلوتوث ميش' } },
        ],
      },
    ],
    reviews: [
      {
        id: 'rev-9',
        author: 'Nasser Al-Ghanem',
        rating: 5,
        date: '2025-02-01',
        title: { en: 'Movie nights look like an IMAX theater now', ar: 'سهرات السينما في المنزل أصبحت تشبه صالات الآيماكس' },
        comment: {
          en: 'Setup took 5 minutes with Apple HomeKit. Creating morning sunrise routines has made waking up so much gentler.',
          ar: 'الربط استغرق 5 دقائق فقط عبر تطبيق أبل هوم كيت. وجدولة محاكاة شروق الشمس صباحاً جعلت الاستيقاظ أكثر راحة وهدوءاً.',
        },
        verified: true,
      },
    ],
    warranty: { en: '2-Year Philips GCC Official Warranty', ar: 'ضمان رسمي سنتين من فيليبس الخليج' },
    isFeatured: true,
  },

  // 9. Apple Watch Ultra 2
  {
    id: 'prod-apple-watch-ultra-2',
    storeId: 'voltix',
    title: {
      en: 'Apple Watch Ultra 2 (GPS + Cellular, 49mm) - Titanium Case with Trail Loop',
      ar: 'ساعة أبل ألترا 2 (GPS + خلوي، 49 مم) - هيكل تيتانيوم مع حزام تريل الرياضي',
    },
    brand: 'Apple',
    category: 'wearables',
    price: 3199,
    originalPrice: 3499,
    rating: 4.9,
    reviewCount: 201,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=85',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=85',
    ],
    description: {
      en: 'The ultimate sports and adventure watch. Powered by the S9 SiP, double-tap gesture, brightest 3000-nit display, precision dual-frequency GPS, and up to 72 hours of battery in Low Power Mode.',
      ar: 'ساعة المغامرات والرياضات القصوى الأقوى. مدعومة بمعالج S9 مع إيماءة الضغط المزدوج بأصابعك، وشاشة هي الأكثر سطوعاً بقوة 3000 شمعة، ونظام GPS مزدوج التردد فائق الدقة وبطارية تدوم حتى 72 ساعة في نمط توفير الطاقة.',
    },
    shortSpecs: [
      { en: '49mm Aerospace Titanium Case (100m Water Resistant)', ar: 'هيكل تيتانيوم 49 مم مقاوم للماء حتى عمق 100 متر' },
      { en: '3,000 Nits Always-On Retina Display', ar: 'شاشة ريتينا قيد التشغيل دائماً بسطوع جبار 3000 شمعة' },
      { en: 'Precision Dual-Frequency GPS (L1 and L5)', ar: 'نظام تحديد مواقع ثنائي التردد L1 و L5 فائق الدقة' },
      { en: 'Up to 36 hours normal use (72h Low Power Mode)', ar: 'عمر بطارية يصل إلى 36 ساعة وحتى 72 ساعة في وضع التوفير' },
    ],
    badge: { text: { en: 'Adventure Ready', ar: 'جاهزة للمغامرة' }, type: 'new' },
    inStock: true,
    stockCount: 7,
    specs: [
      {
        group: { en: 'Sensors & Durability', ar: 'المستشعرات والمتانة' },
        items: [
          { label: { en: 'Water Resistance', ar: 'مقاومة الماء' }, value: { en: '100m (Diving certified to 40m EN13319)', ar: '100 متر (معتمدة للغوص حتى 40 متراً EN13319)' } },
          { label: { en: 'Health Sensors', ar: 'المستشعرات الصحية' }, value: { en: 'ECG, Blood Oxygen, Depth Gauge & Water Temp', ar: 'تخطيط القلب، قياس الأكسجين، ومقياس العمق وحرارة الماء' } },
        ],
      },
    ],
    reviews: [
      {
        id: 'rev-10',
        author: 'Hamdan Al-Falasi',
        rating: 5,
        date: '2025-02-08',
        title: { en: 'Indestructible watch with unmatched GPS accuracy', ar: 'ساعة شديدة الصلابة مع دقة GPS لا مثيل لها' },
        comment: {
          en: 'Used it during desert trail running and open sea swimming in Fujairah. The screen is visible in blazing direct sunlight.',
          ar: 'استخدمتها في الركض بالمسارات الصحراوية والسباحة المفتوحة بالفجيرة. الشاشة فائقة الوضوح تحت أشعة الشمس المباشرة الحارقة.',
        },
        verified: true,
      },
    ],
    warranty: { en: '2-Year Apple GCC Warranty', ar: 'ضمان رسمي سنتين من أبل الخليج' },
    isFeatured: true,
  },

];

// Shams Store's demo catalog lives entirely in src/data/demo/shams/ — a
// fully separate dataset, not appended here (see core/commerce/demoCatalog.ts).

export const BRAND_LOGOS = [
  { name: 'Apple', logo: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=120&q=80' },
  { name: 'Sony', logo: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=120&q=80' },
  { name: 'Samsung', logo: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=120&q=80' },
  { name: 'ASUS ROG', logo: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=120&q=80' },
  { name: 'Logitech G', logo: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=120&q=80' },
  { name: 'Roborock', logo: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=120&q=80' },
  { name: 'Philips Hue', logo: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=120&q=80' },
];
