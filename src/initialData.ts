import { Product, Collection, Order, FileEntry, Customer, Discount, CustomPage, BlogPost } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: 'Oversized Heavyweight Wool Overcoat',
    description: 'Double-faced melton wool overcoat featuring dropped shoulders, wide notch lapels, horn buttons, and deep welt pockets. Designed for effortless cold-weather layering.',
    price: 185.00,
    compareAtPrice: 220.00,
    costPerItem: 70.00,
    sku: 'APP-OVC-01',
    barcode: '506001234001',
    inventoryQuantity: 34,
    status: 'Active',
    category: 'Outerwear',
    vendor: 'Atelier',
    tags: ['Outerwear', 'Wool', 'Bestseller', 'Winter'],
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
    media: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80'
    ],
    strength: 'Charcoal Grey',
    flavour: 'Relaxed Fit',
    format: 'Outerwear',
    weight: '1200g',
    createdAt: '2026-09-01'
  },
  {
    id: 'prod-2',
    title: 'Relaxed Boxy Fit Organic Hoodie',
    description: 'Heavyweight 450gsm organic French terry cotton hoodie. Pre-shrunk with double-layered hood, kangaroo pocket, and ribbed side panels for maximum movement.',
    price: 75.00,
    compareAtPrice: 90.00,
    costPerItem: 24.00,
    sku: 'APP-HOD-02',
    barcode: '506001234002',
    inventoryQuantity: 58,
    status: 'Active',
    category: 'Streetwear',
    vendor: 'Essentials',
    tags: ['Streetwear', 'Cotton', 'New In', 'Tops'],
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    media: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80'
    ],
    strength: 'Washed Black',
    flavour: 'Boxy Fit',
    format: 'Tops',
    weight: '750g',
    createdAt: '2026-09-05'
  },
  {
    id: 'prod-3',
    title: 'Minimal Pleated Wide-Leg Trousers',
    description: 'Architectural tailored trousers cut from structured tropical wool blend. Features front double pleats, concealed hook closure, and clean straight-leg drape.',
    price: 95.00,
    compareAtPrice: 115.00,
    costPerItem: 32.00,
    sku: 'APP-TRS-03',
    barcode: '506001234003',
    inventoryQuantity: 42,
    status: 'Active',
    category: 'Tailoring',
    vendor: 'Studio',
    tags: ['Tailoring', 'Pants', 'Trending', 'Minimalist'],
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
    media: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80'
    ],
    strength: 'Earthy Olive',
    flavour: 'Wide Leg',
    format: 'Bottoms',
    weight: '500g',
    createdAt: '2026-09-08'
  },
  {
    id: 'prod-4',
    title: 'Chunky Ribbed Cashmere Knit Sweater',
    description: 'Spun from 7-gauge Mongolian cashmere and extrafine merino wool. Designed with a structured mock neck, dropped shoulders, and chunky fisherman ribbing.',
    price: 130.00,
    compareAtPrice: 155.00,
    costPerItem: 48.00,
    sku: 'APP-KNT-04',
    barcode: '506001234004',
    inventoryQuantity: 26,
    status: 'Active',
    category: 'Knitwear',
    vendor: 'Atelier',
    tags: ['Knitwear', 'Cashmere', 'Bestseller', 'Winter'],
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
    media: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80'
    ],
    strength: 'Oatmeal Melange',
    flavour: 'Regular Fit',
    format: 'Knitwear',
    weight: '620g',
    createdAt: '2026-09-10'
  },
  {
    id: 'prod-5',
    title: 'Structured Double-Breasted Blazer',
    description: 'Tailored unstructured blazer crafted from Italian virgin wool canvas. Complete with peak lapels, horn buttons, interior passport pockets, and unlined sleeves.',
    price: 160.00,
    compareAtPrice: 195.00,
    costPerItem: 55.00,
    sku: 'APP-BLZ-05',
    barcode: '506001234005',
    inventoryQuantity: 19,
    status: 'Active',
    category: 'Tailoring',
    vendor: 'Studio',
    tags: ['Tailoring', 'Blazer', 'Formal'],
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
    media: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80'
    ],
    strength: 'Deep Navy',
    flavour: 'Tailored Fit',
    format: 'Tailoring',
    weight: '850g',
    createdAt: '2026-09-12'
  },
  {
    id: 'prod-6',
    title: 'Vintage Washed Heavyweight Graphic Tee',
    description: 'Constructed from 280gsm combed organic cotton with garment-dyed wash for a lived-in feel. Features subtle tonal embroidery and reinforced rib collar.',
    price: 42.00,
    compareAtPrice: 50.00,
    costPerItem: 12.00,
    sku: 'APP-TEE-06',
    barcode: '506001234006',
    inventoryQuantity: 75,
    status: 'Active',
    category: 'Tees',
    vendor: 'Essentials',
    tags: ['Tees', 'Cotton', 'New In', 'Streetwear'],
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    media: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'
    ],
    strength: 'Vintage Cream',
    flavour: 'Relaxed Fit',
    format: 'Tops',
    weight: '320g',
    createdAt: '2026-09-14'
  },
  {
    id: 'prod-7',
    title: 'Clean Japanese Raw Denim Jacket',
    description: '14oz selvedge denim woven on vintage shuttle looms in Okayama. Finished with copper shank hardware, clean bar-tacking, and internal selvedge ID detail.',
    price: 145.00,
    compareAtPrice: 175.00,
    costPerItem: 50.00,
    sku: 'APP-DNM-07',
    barcode: '506001234007',
    inventoryQuantity: 28,
    status: 'Active',
    category: 'Outerwear',
    vendor: 'Atelier',
    tags: ['Outerwear', 'Denim', 'Trending'],
    image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=800&q=80',
    media: [
      'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=800&q=80'
    ],
    strength: 'Indigo Raw',
    flavour: 'Classic Trucker',
    format: 'Outerwear',
    weight: '900g',
    createdAt: '2026-09-15'
  },
  {
    id: 'prod-8',
    title: 'Monochrome Suede Minimalist Loafers',
    description: 'Italian calf suede slip-on shoes with lightweight Vibram rubber soles and leather lining. Hand-stitched apron toe for sophisticated day-to-night styling.',
    price: 110.00,
    compareAtPrice: 135.00,
    costPerItem: 38.00,
    sku: 'APP-SHS-08',
    barcode: '506001234008',
    inventoryQuantity: 31,
    status: 'Active',
    category: 'Footwear',
    vendor: 'Footwear',
    tags: ['Footwear', 'Leather', 'Trending', 'Accessories'],
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
    media: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80'
    ],
    strength: 'Sand Taupe',
    flavour: 'Slip-on',
    format: 'Footwear',
    weight: '700g',
    createdAt: '2026-09-16'
  }
];

export const INITIAL_COLLECTIONS: Collection[] = [
  {
    id: 'col-new',
    title: 'New In & Trending',
    description: 'The latest drops, contemporary silhouettes, and seasonal highlights fresh from the atelier.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
    productIds: ['prod-1', 'prod-2', 'prod-3', 'prod-6'],
    createdAt: '2026-09-01'
  },
  {
    id: 'col-outerwear',
    title: 'Coats & Outerwear',
    description: 'Engineered coats, double-breasted blazers, and heavy denim jackets designed for cold climates.',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
    productIds: ['prod-1', 'prod-5', 'prod-7'],
    createdAt: '2026-09-01'
  },
  {
    id: 'col-knitwear',
    title: 'Knitwear & Sweaters',
    description: 'Cashmere blends, ribbed fisherman knits, and heavyweight cardigans woven for luxurious warmth.',
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80',
    productIds: ['prod-4', 'prod-2'],
    createdAt: '2026-09-01'
  },
  {
    id: 'col-tailoring',
    title: 'Minimalist Tailoring',
    description: 'Pleated trousers, unstructured suiting, and elevated formal silhouettes for the modern wardrobe.',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    productIds: ['prod-3', 'prod-5', 'prod-8'],
    createdAt: '2026-09-01'
  }
];

export const INITIAL_ORDERS: Order[] = [];
export const INITIAL_FILES: FileEntry[] = [];
export const INITIAL_CUSTOMERS: Customer[] = [];
export const INITIAL_DISCOUNTS: Discount[] = [];

export const INITIAL_BLOGS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'How To Elevate Your Whimsical Wardrobe',
    slug: 'how-to-elevate-your-whimsical-wardrobe',
    category: 'Fashion Style',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
    excerpt: 'An in-depth exploration of architectural layering, romantic textures, and how to balance whimsical silhouettes with understated sophistication.',
    author: 'Jade Tailor',
    status: 'Active',
    publishedAt: 'Dec 29, 2026',
    readTime: '4 min read',
    tags: ['Fashion Style', 'Whimsical', 'Capsule Wardrobe'],
    content: 'Whimsical fashion is not about costume; it is about intentional delight. In this editorial guide, Jade Tailor breaks down how to weave playful textures, voluminous skirts, and vintage-inspired collars into everyday luxury tailoring.'
  },
  {
    id: 'blog-2',
    title: "Women's Business Formal Attire To Promote Your Style",
    slug: 'womens-business-formal-attire-to-promote-your-style',
    category: 'Business Style',
    image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=800&q=80',
    excerpt: 'Redefining corporate elegance with structured blazers, high-waisted cigarette trousers, and refined neutral palettes that project authority and poise.',
    author: 'Jade Tailor',
    status: 'Active',
    publishedAt: 'Dec 27, 2026',
    readTime: '5 min read',
    tags: ['Business Style', 'Executive', 'Tailoring'],
    content: 'Executive styling is the ultimate power move. Discover how tailored double-breasted suits, premium Italian silk camisoles, and minimalist leather accessories elevate your presence in boardrooms and beyond.'
  },
  {
    id: 'blog-3',
    title: 'The Essential Capsule: 7 Pieces for 30 Outfits',
    slug: 'the-essential-capsule-7-pieces-for-30-outfits',
    category: 'Wardrobe Guide',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80',
    excerpt: 'Mastering understated versatility with timeless tailoring, neutral knitwear, and classic raw selvedge denim.',
    author: 'Jade Tailor',
    status: 'Active',
    publishedAt: 'Dec 15, 2026',
    readTime: '3 min read',
    tags: ['Capsule', 'Minimalism', 'Personal Styling'],
    content: 'A comprehensive styling blueprint for building an intentional, cohesive wardrobe that eliminates decision fatigue and transforms getting dressed into pure effortless confidence.'
  }
];

export const DEFAULT_PAGES: CustomPage[] = [
  {
    id: 'homepage',
    title: 'Home Page',
    slug: '',
    visibility: 'Visible',
    updatedAt: 'Sep 24, 2026',
    isHomepage: true,
    sections: [
      {
        id: 'sec-hero-banner',
        type: 'Hero banner',
        settings: {
          fullWidth: true,
          backgroundColor: '#111111',
          headingColor: '#FFFFFF',
          textColor: '#E5E5E5',
          subtitle: 'JADE TAILOR • PERSONAL STYLIST',
          title: 'Elevate Your Style',
          description: 'Bespoke silhouettes, signature color palettes, and effortless everyday elegance.',
          buttonText: 'WORK WITH JADE',
          buttonLink: '#appointment-section',
          imageUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1920&q=85'
        }
      },
      {
        id: 'sec-about-jade',
        type: 'About Jade Tailor',
        settings: {
          fullWidth: false,
          backgroundColor: '#FFFFFF',
          headingColor: '#1A1A1A',
          textColor: '#555555',
          badge: 'ABOUT JADE TAILOR',
          title: 'Find Your Style',
          italicTitle: 'With Me',
          description: 'Style sit amet risus ac dui auctor posuere sit amet eget libero. Ut lacinia lectus non risus facilisis, semper consequat sem fringilla. Etiam et tincidunt felis. Quisque at maximus nulla dictum vestibulum sed interdum neque dictum.',
          description2: 'Your style laboris sollicitudin purus vel posuere. Maecenas auctor, turpis quis mattis tristique, ligula dolor vestibulum risus, nec ullamcorper justo dolor soda lorem. Sed interdum arcu ac metus mollis venenatis.',
          stats: ['7+ years of work', '150+ free consultations', '90+ happy clients'],
          imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
          image2Url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80'
        }
      },
      {
        id: 'sec-my-services',
        type: 'My Services',
        settings: {
          fullWidth: false,
          backgroundColor: '#F9F7F4',
          headingColor: '#1A1A1A',
          textColor: '#666666',
          badge: 'WHAT I DO',
          title: 'My',
          italicTitle: 'Services',
          cardTitle: 'Individual Consultation',
          cardDescription: 'A comprehensive one-on-one deep dive into your personal aesthetic, body architecture, and lifestyle requirements. We assess your color typology, define your signature silhouette, and formulate a seasonal style blueprint tailored specifically for you.',
          cardButtonText: 'LEARN MORE',
          imageUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1000&q=80'
        }
      },
      {
        id: 'sec-service-pillars',
        type: 'Service Pillars',
        settings: {
          fullWidth: false,
          backgroundColor: '#F9F7F4',
          headingColor: '#1A1A1A',
          textColor: '#666666',
          accentColor: '#B58D59',
          pillars: [
            { num: '01', title: 'Wardrobe Styling', desc: 'Lorem ipsum nisl quam nestibulum drana odio elementum scesue the monte.' },
            { num: '02', title: 'Closet Cleanse', desc: 'Lorem ipsum nisl quam nestibulum drana odio elementum monte.' },
            { num: '03', title: 'Shopping Tour', desc: 'Lorem ipsum nisl quam nestibulum drana odio elementum scesue the can.' }
          ]
        }
      },
      {
        id: 'sec-video-tips',
        type: 'Video banner',
        settings: {
          fullWidth: true,
          backgroundColor: '#111111',
          headingColor: '#FFFFFF',
          textColor: '#E5E5E5',
          title: 'Discover My Video Tips And Hints',
          italicWord: 'Discover',
          videoUrl: 'dQw4w9WgXcQ',
          imageUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1800&q=85'
        }
      },
      {
        id: 'sec-styling-packages',
        type: 'Styling Packages',
        settings: {
          fullWidth: false,
          backgroundColor: '#FFFFFF',
          headingColor: '#1A1A1A',
          textColor: '#666666',
          badge: 'PRICING PLAN',
          title: 'Styling',
          italicTitle: 'Packages',
          packages: [
            {
              title: 'In-Home Styling',
              price: '$300',
              imageUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=600&q=80',
              features: [
                { text: 'Complete closet audit & organization', included: true },
                { text: 'Color analysis & silhouette mapping', included: true },
                { text: 'Personalized digital lookbook (20 outfits)', included: false }
              ],
              isFeatured: false,
              btnText: 'WORK WITH ME'
            },
            {
              title: 'Half Day Shopping',
              price: '$450',
              imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80',
              features: [
                { text: '4 hours private curated shopping tour', included: true },
                { text: 'Pre-selected garments ready in VIP suites', included: true },
                { text: 'Seasonal capsule wardrobe integration', included: false }
              ],
              isFeatured: true,
              btnText: 'WORK WITH ME'
            },
            {
              title: 'Full Day Shopping',
              price: '$600',
              imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80',
              features: [
                { text: 'Full 8 hours complete wardrobe overhaul', included: true },
                { text: 'Luxury boutique access & stylist discounts', included: true },
                { text: 'Comprehensive seasonal digital lookbook', included: true }
              ],
              isFeatured: false,
              btnText: 'WORK WITH ME'
            }
          ]
        }
      },
      {
        id: 'sec-client-reviews',
        type: 'Client Reviews',
        settings: {
          fullWidth: false,
          backgroundColor: '#FBF9F6',
          headingColor: '#1A1A1A',
          textColor: '#555555',
          badge: 'CLIENTS REVIEWS',
          title: 'What Clients Say',
          italicTitle: 'About Me',
          quote: 'Highly recommend, thank you again!',
          content: 'Jade is so lovely and did such a great job with my wedding dress along with bridal party and mother of the bride outfits... She understood exactly what flattered my shape while keeping me entirely comfortable. Highly recommend, thank you again!',
          author: 'Emily Brown',
          role: 'Customer Review',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
          imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80'
        }
      },
      {
        id: 'sec-my-portfolio',
        type: 'My Portfolio',
        settings: {
          fullWidth: false,
          backgroundColor: '#FFFFFF',
          headingColor: '#1A1A1A',
          badge: 'MY PORTFOLIO',
          title: 'Find Your Ideal Style and Look?',
          items: [
            { image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80', title: 'Architectural Tailoring & Cream Trench', category: 'Editorial Streetwear' },
            { image: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=800&q=80', title: 'Effortless Summer Linen Ensemble', category: 'Casual Resort' },
            { image: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=800&q=80', title: 'Bohemian Sunhat & Warm Earth Tones', category: 'Seasonal Lookbook' },
            { image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80', title: 'Modern Sport-Luxe & Monochrome', category: 'Contemporary Casual' },
            { image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80', title: 'Pastel Blazer & Checked Silk Separates', category: 'Executive Style' },
            { image: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=800&q=80', title: 'Evening Velvet & Statement Eyewear', category: 'Gala & Red Carpet' }
          ]
        }
      },
      {
        id: 'sec-news-blog',
        type: 'News & Blog',
        settings: {
          fullWidth: true,
          backgroundColor: '#0F0F10',
          headingColor: '#FFFFFF',
          textColor: '#CCCCCC',
          badge: 'LATEST NEWS',
          title: 'News',
          italicTitle: '& Blog'
        }
      },
      {
        id: 'sec-make-appointment',
        type: 'Make An Appointment',
        settings: {
          fullWidth: true,
          backgroundColor: '#111111',
          headingColor: '#FFFFFF',
          promptText: 'To submit an enquiry or to arrange an appointment please call me or alternatively please complete the form.',
          phone: '800 123 4444',
          formTitle: 'Make An Appointment',
          buttonText: 'MAKE APPOINTMENT',
          imageUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1600&q=80'
        }
      },
      {
        id: 'sec-brand-logos',
        type: 'Brand Logos',
        settings: {
          fullWidth: false,
          backgroundColor: '#FFFFFF',
          logos: ["CHIPPY'S", "FASTLANE", "SWEETY.", "MIGHTY FURNITURES", "CARA INDOORS", "GOLDEN NET 109", "avant garde"]
        }
      }
    ]
  },
  {
    id: 'brands',
    title: 'Atelier Directory',
    slug: 'brands',
    visibility: 'Visible',
    updatedAt: 'Sep 24, 2026',
    sections: [
      {
        id: 's2',
        type: 'Rich text',
        settings: {
          fullWidth: false,
          backgroundColor: '#FFFFFF',
          headingColor: '#1E293B',
          textColor: '#64748B',
          title: 'Curated Brands & Designers',
          description: 'Explore our catalog of certified ethical fashion brands and independent ateliers.',
        }
      }
    ]
  },
  {
    id: 'subscribe',
    title: 'Wardrobe Capsule Plans',
    slug: 'subscribe',
    visibility: 'Visible',
    updatedAt: 'Sep 24, 2026',
    sections: [
      {
        id: 'subs-sec-1',
        type: 'Plans',
        settings: {
          fullWidth: false,
          backgroundColor: '#0F172A',
          headingColor: '#FFFFFF',
          textColor: '#E2E8F0',
          title: 'SEASONAL CAPSULE PLANS',
          description: 'Curated wardrobe drops. Timeless garments. Member pricing.',
          alertBadgeText: 'Subscribers save up to 25% on new season releases',
          promoBannerText: '★ NEW MEMBERS - COMPLIMENTARY WELCOME GIFT WITH FIRST CAPSULE >',
          planItems: [
            {
              slug: 'lite',
              name: 'ESSENTIALS',
              subtitle: 'Perfect for wardrobe updates',
              price: 69.00,
              limit: 3,
              saveAmountText: 'Save £15.00/month',
              imageUrl: '',
              features: [
                '3 premium curated garments',
                'Seasonal style delivery',
                'Swap sizes or fits anytime',
                'Skip or pause with one click'
              ],
              isPopular: false
            },
            {
              slug: 'core',
              name: 'SIGNATURE',
              subtitle: 'Most popular wardrobe tier',
              price: 119.00,
              limit: 5,
              saveAmountText: 'Save £35.00/month',
              imageUrl: '',
              features: [
                '5 premium curated garments',
                'Includes premium knitwear & tops',
                'Complimentary exchanges',
                'Priority access to new drops'
              ],
              isPopular: true
            },
            {
              slug: 'pro',
              name: 'ATELIER LUXURY',
              subtitle: 'Complete seasonal wardrobe',
              price: 189.00,
              limit: 8,
              saveAmountText: 'Save £65.00/month',
              imageUrl: '',
              features: [
                '8 luxury tailored pieces',
                'Includes tailored outerwear & coats',
                'FREE Express tracked courier',
                'Complimentary personal styling consultation',
                'Full control to pause or cancel anytime'
              ],
              isPopular: false
            }
          ]
        }
      }
    ]
  }
];
