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
    title: 'The Autumn/Winter Lookbook: Volume & Neutral Palettes',
    category: 'Style Editorial',
    date: 'September 2026',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
    excerpt: 'An in-depth exploration of architectural layering, heavy melton wool overcoats, and monochromatic minimalism.',
    author: 'Elena Laurent',
    status: 'Active',
    content: 'Full editorial breakdown on styling contemporary relaxed proportions for the autumn and winter season.'
  },
  {
    id: 'blog-2',
    title: 'Behind The Seams: Sustainable Portuguese Milling',
    category: 'Craftsmanship',
    date: 'September 2026',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    excerpt: 'How our family-owned textile partner in Porto spins GOTS-certified organic cotton with closed-loop water filtration.',
    author: 'Marcus Hayes',
    status: 'Active',
    content: 'Discover the artisanal spinning and dye processes ensuring our heavy hoodies and t-shirts endure for a decade.'
  },
  {
    id: 'blog-3',
    title: 'The Essential Capsule: 7 Pieces for 30 Outfits',
    category: 'Wardrobe Guide',
    date: 'September 2026',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80',
    excerpt: 'Mastering understated versatility with timeless tailoring, neutral knitwear, and classic raw selvedge denim.',
    author: 'Sophia Vance',
    status: 'Active',
    content: 'A comprehensive styling blueprint for building an intentional, cohesive wardrobe that simplifies daily dressing.'
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
        id: 'h-sec-slideshow',
        type: 'Slideshow',
        settings: {
          fullWidth: true,
          backgroundColor: '#0F172A',
          headingColor: '#FFFFFF',
          textColor: '#E2E8F0',
          slides: [
            {
              title: 'THE AUTUMN / WINTER ATELIER',
              description: 'Architectural tailoring, luxurious double-faced wool, and modern silhouettes crafted for enduring versatility.',
              imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1800&q=85',
              buttonText: 'SHOP NEW ARRIVALS',
              buttonLink: 'frontend-shop'
            },
            {
              title: 'MINIMALIST STREETWEAR',
              description: 'Heavyweight 450gsm organic cotton, dropped shoulder proportions, and relaxed monochrome palettes engineered for everyday comfort.',
              imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1800&q=85',
              buttonText: 'EXPLORE THE DROP',
              buttonLink: 'frontend-shop'
            },
            {
              title: 'TIMELESS CONTEMPORARY TAILORING',
              description: 'Unstructured blazers, relaxed pleated trousers, and breathable linen-blend overshirts designed for effortless layering.',
              imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1800&q=85',
              buttonText: 'DISCOVER LOOKBOOK',
              buttonLink: 'frontend-shop'
            }
          ]
        }
      },
      {
        id: 'h-sec-collections',
        type: 'Collection list',
        settings: {
          fullWidth: false,
          headingColor: '#0F172A',
          textColor: '#64748B',
          title: 'CURATED COLLECTIONS',
          description: 'Explore contemporary menswear and womenswear across tailored outerwear, fine knitwear, and streetwear essentials.',
          itemsCount: 4
        }
      },
      {
        id: 'h-sec-products',
        type: 'Featured collection',
        settings: {
          fullWidth: false,
          headingColor: '#0F172A',
          textColor: '#64748B',
          title: 'TRENDING THIS WEEK',
          description: 'Our most coveted garments, tailored with architectural precision and crafted from sustainable luxury textiles.',
          itemsCount: 8
        }
      },
      {
        id: 'h-sec-marquee',
        type: 'Marquee text',
        settings: {
          fullWidth: true,
          backgroundColor: '#0F172A',
          headingColor: '#FFFFFF',
          textColor: '#E2E8F0',
          title: 'COMPLIMENTARY EXPRESS WORLDWIDE SHIPPING ON ORDERS OVER £100  ·  30-DAY EFFORTLESS RETURNS  ·  SUSTAINABLY CRAFTED FROM ORGANIC TEXTILES  ·  HAND-FINISHED IN EUROPEAN ATELIERS  ·  NEW CURATED DROPS EVERY THURSDAY',
          marqueeSpeed: 4
        }
      },
      {
        id: 'h-sec-editorial',
        type: 'Image with text',
        settings: {
          fullWidth: false,
          backgroundColor: '#F8FAFC',
          headingColor: '#0F172A',
          textColor: '#475569',
          title: 'THE ART OF UNDERSTATED LUXURY',
          description: 'We believe in wardrobe longevity over disposable fast-fashion cycles. Every silhouette in our studio is cut with clean architectural lines, woven from GOTS-certified organic cotton and European virgin wool, and finished with meticulous double-needle craftsmanship designed to endure for decades.',
          buttonText: 'EXPLORE OUR ATELIER',
          buttonLink: 'frontend-shop',
          imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80'
        }
      },
      {
        id: 'h-sec-trust',
        type: 'Trust badges',
        settings: {
          fullWidth: false,
          backgroundColor: '#FFFFFF',
          trustBadges: [
            { iconType: 'badge', title: 'ETHICALLY CRAFTED', description: 'GOTS certified organic cotton & recycled wool.' },
            { iconType: 'shield', title: 'EXPRESS TRACKED SHIPPING', description: 'Carbon-neutral delivery across UK & Worldwide.' },
            { iconType: 'globe', title: 'COMPLIMENTARY RETURNS', description: '30-day effortless return and exchange policy.' },
            { iconType: 'tag', title: 'PREMIUM SUSTAINABILITY', description: 'Zero single-use plastics in all shipping packaging.' }
          ]
        }
      },
      {
        id: 'h-sec-blog',
        type: 'Blog post',
        settings: {
          fullWidth: false,
          headingColor: '#0F172A',
          textColor: '#64748B',
          title: 'THE STYLE JOURNAL',
          description: 'Editorials, seasonal styling blueprints, and craftsmanship stories direct from our European ateliers.',
          columnsDesktop: 3,
          columnsMobile: 1
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
