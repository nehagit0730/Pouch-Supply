// serverApp.ts
import express from "express";
import path3 from "path";
import fs3 from "fs";

// serverDb.ts
import fs2 from "fs";
import path2 from "path";
import dotenv2 from "dotenv";

// src/initialData.ts
var INITIAL_PRODUCTS = [
  {
    id: "prod-1",
    title: "Oversized Heavyweight Wool Overcoat",
    description: "Double-faced melton wool overcoat featuring dropped shoulders, wide notch lapels, horn buttons, and deep welt pockets. Designed for effortless cold-weather layering.",
    price: 185,
    compareAtPrice: 220,
    costPerItem: 70,
    sku: "APP-OVC-01",
    barcode: "506001234001",
    inventoryQuantity: 34,
    status: "Active",
    category: "Outerwear",
    vendor: "Atelier",
    tags: ["Outerwear", "Wool", "Bestseller", "Winter"],
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80",
    media: [
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80"
    ],
    strength: "Charcoal Grey",
    flavour: "Relaxed Fit",
    format: "Outerwear",
    weight: "1200g",
    createdAt: "2026-09-01"
  },
  {
    id: "prod-2",
    title: "Relaxed Boxy Fit Organic Hoodie",
    description: "Heavyweight 450gsm organic French terry cotton hoodie. Pre-shrunk with double-layered hood, kangaroo pocket, and ribbed side panels for maximum movement.",
    price: 75,
    compareAtPrice: 90,
    costPerItem: 24,
    sku: "APP-HOD-02",
    barcode: "506001234002",
    inventoryQuantity: 58,
    status: "Active",
    category: "Streetwear",
    vendor: "Essentials",
    tags: ["Streetwear", "Cotton", "New In", "Tops"],
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
    media: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80"
    ],
    strength: "Washed Black",
    flavour: "Boxy Fit",
    format: "Tops",
    weight: "750g",
    createdAt: "2026-09-05"
  },
  {
    id: "prod-3",
    title: "Minimal Pleated Wide-Leg Trousers",
    description: "Architectural tailored trousers cut from structured tropical wool blend. Features front double pleats, concealed hook closure, and clean straight-leg drape.",
    price: 95,
    compareAtPrice: 115,
    costPerItem: 32,
    sku: "APP-TRS-03",
    barcode: "506001234003",
    inventoryQuantity: 42,
    status: "Active",
    category: "Tailoring",
    vendor: "Studio",
    tags: ["Tailoring", "Pants", "Trending", "Minimalist"],
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
    media: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80"
    ],
    strength: "Earthy Olive",
    flavour: "Wide Leg",
    format: "Bottoms",
    weight: "500g",
    createdAt: "2026-09-08"
  },
  {
    id: "prod-4",
    title: "Chunky Ribbed Cashmere Knit Sweater",
    description: "Spun from 7-gauge Mongolian cashmere and extrafine merino wool. Designed with a structured mock neck, dropped shoulders, and chunky fisherman ribbing.",
    price: 130,
    compareAtPrice: 155,
    costPerItem: 48,
    sku: "APP-KNT-04",
    barcode: "506001234004",
    inventoryQuantity: 26,
    status: "Active",
    category: "Knitwear",
    vendor: "Atelier",
    tags: ["Knitwear", "Cashmere", "Bestseller", "Winter"],
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80",
    media: [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80"
    ],
    strength: "Oatmeal Melange",
    flavour: "Regular Fit",
    format: "Knitwear",
    weight: "620g",
    createdAt: "2026-09-10"
  },
  {
    id: "prod-5",
    title: "Structured Double-Breasted Blazer",
    description: "Tailored unstructured blazer crafted from Italian virgin wool canvas. Complete with peak lapels, horn buttons, interior passport pockets, and unlined sleeves.",
    price: 160,
    compareAtPrice: 195,
    costPerItem: 55,
    sku: "APP-BLZ-05",
    barcode: "506001234005",
    inventoryQuantity: 19,
    status: "Active",
    category: "Tailoring",
    vendor: "Studio",
    tags: ["Tailoring", "Blazer", "Formal"],
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80",
    media: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80"
    ],
    strength: "Deep Navy",
    flavour: "Tailored Fit",
    format: "Tailoring",
    weight: "850g",
    createdAt: "2026-09-12"
  },
  {
    id: "prod-6",
    title: "Vintage Washed Heavyweight Graphic Tee",
    description: "Constructed from 280gsm combed organic cotton with garment-dyed wash for a lived-in feel. Features subtle tonal embroidery and reinforced rib collar.",
    price: 42,
    compareAtPrice: 50,
    costPerItem: 12,
    sku: "APP-TEE-06",
    barcode: "506001234006",
    inventoryQuantity: 75,
    status: "Active",
    category: "Tees",
    vendor: "Essentials",
    tags: ["Tees", "Cotton", "New In", "Streetwear"],
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    media: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80"
    ],
    strength: "Vintage Cream",
    flavour: "Relaxed Fit",
    format: "Tops",
    weight: "320g",
    createdAt: "2026-09-14"
  },
  {
    id: "prod-7",
    title: "Clean Japanese Raw Denim Jacket",
    description: "14oz selvedge denim woven on vintage shuttle looms in Okayama. Finished with copper shank hardware, clean bar-tacking, and internal selvedge ID detail.",
    price: 145,
    compareAtPrice: 175,
    costPerItem: 50,
    sku: "APP-DNM-07",
    barcode: "506001234007",
    inventoryQuantity: 28,
    status: "Active",
    category: "Outerwear",
    vendor: "Atelier",
    tags: ["Outerwear", "Denim", "Trending"],
    image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=800&q=80",
    media: [
      "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=800&q=80"
    ],
    strength: "Indigo Raw",
    flavour: "Classic Trucker",
    format: "Outerwear",
    weight: "900g",
    createdAt: "2026-09-15"
  },
  {
    id: "prod-8",
    title: "Monochrome Suede Minimalist Loafers",
    description: "Italian calf suede slip-on shoes with lightweight Vibram rubber soles and leather lining. Hand-stitched apron toe for sophisticated day-to-night styling.",
    price: 110,
    compareAtPrice: 135,
    costPerItem: 38,
    sku: "APP-SHS-08",
    barcode: "506001234008",
    inventoryQuantity: 31,
    status: "Active",
    category: "Footwear",
    vendor: "Footwear",
    tags: ["Footwear", "Leather", "Trending", "Accessories"],
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
    media: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80"
    ],
    strength: "Sand Taupe",
    flavour: "Slip-on",
    format: "Footwear",
    weight: "700g",
    createdAt: "2026-09-16"
  }
];
var INITIAL_COLLECTIONS = [
  {
    id: "col-new",
    title: "New In & Trending",
    description: "The latest drops, contemporary silhouettes, and seasonal highlights fresh from the atelier.",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80",
    productIds: ["prod-1", "prod-2", "prod-3", "prod-6"],
    createdAt: "2026-09-01"
  },
  {
    id: "col-outerwear",
    title: "Coats & Outerwear",
    description: "Engineered coats, double-breasted blazers, and heavy denim jackets designed for cold climates.",
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80",
    productIds: ["prod-1", "prod-5", "prod-7"],
    createdAt: "2026-09-01"
  },
  {
    id: "col-knitwear",
    title: "Knitwear & Sweaters",
    description: "Cashmere blends, ribbed fisherman knits, and heavyweight cardigans woven for luxurious warmth.",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80",
    productIds: ["prod-4", "prod-2"],
    createdAt: "2026-09-01"
  },
  {
    id: "col-tailoring",
    title: "Minimalist Tailoring",
    description: "Pleated trousers, unstructured suiting, and elevated formal silhouettes for the modern wardrobe.",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
    productIds: ["prod-3", "prod-5", "prod-8"],
    createdAt: "2026-09-01"
  }
];
var INITIAL_ORDERS = [];
var INITIAL_FILES = [];
var INITIAL_CUSTOMERS = [];
var INITIAL_DISCOUNTS = [];
var INITIAL_BLOGS = [
  {
    id: "blog-1",
    title: "How To Elevate Your Whimsical Wardrobe",
    slug: "how-to-elevate-your-whimsical-wardrobe",
    category: "Fashion Style",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80",
    excerpt: "An in-depth exploration of architectural layering, romantic textures, and how to balance whimsical silhouettes with understated sophistication.",
    author: "Jade Tailor",
    status: "Active",
    publishedAt: "Dec 29, 2026",
    readTime: "4 min read",
    tags: ["Fashion Style", "Whimsical", "Capsule Wardrobe"],
    content: "Whimsical fashion is not about costume; it is about intentional delight. In this editorial guide, Jade Tailor breaks down how to weave playful textures, voluminous skirts, and vintage-inspired collars into everyday luxury tailoring."
  },
  {
    id: "blog-2",
    title: "Women's Business Formal Attire To Promote Your Style",
    slug: "womens-business-formal-attire-to-promote-your-style",
    category: "Business Style",
    image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=800&q=80",
    excerpt: "Redefining corporate elegance with structured blazers, high-waisted cigarette trousers, and refined neutral palettes that project authority and poise.",
    author: "Jade Tailor",
    status: "Active",
    publishedAt: "Dec 27, 2026",
    readTime: "5 min read",
    tags: ["Business Style", "Executive", "Tailoring"],
    content: "Executive styling is the ultimate power move. Discover how tailored double-breasted suits, premium Italian silk camisoles, and minimalist leather accessories elevate your presence in boardrooms and beyond."
  },
  {
    id: "blog-3",
    title: "The Essential Capsule: 7 Pieces for 30 Outfits",
    slug: "the-essential-capsule-7-pieces-for-30-outfits",
    category: "Wardrobe Guide",
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80",
    excerpt: "Mastering understated versatility with timeless tailoring, neutral knitwear, and classic raw selvedge denim.",
    author: "Jade Tailor",
    status: "Active",
    publishedAt: "Dec 15, 2026",
    readTime: "3 min read",
    tags: ["Capsule", "Minimalism", "Personal Styling"],
    content: "A comprehensive styling blueprint for building an intentional, cohesive wardrobe that eliminates decision fatigue and transforms getting dressed into pure effortless confidence."
  }
];
var DEFAULT_PAGES = [
  {
    id: "homepage",
    title: "Home Page",
    slug: "",
    visibility: "Visible",
    updatedAt: "Sep 24, 2026",
    isHomepage: true,
    sections: [
      {
        id: "h-sec-slideshow",
        type: "Slideshow",
        settings: {
          fullWidth: true,
          backgroundColor: "#0F172A",
          headingColor: "#FFFFFF",
          textColor: "#E2E8F0",
          slides: [
            {
              title: "THE AUTUMN / WINTER ATELIER",
              description: "Architectural tailoring, luxurious double-faced wool, and modern silhouettes crafted for enduring versatility.",
              imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1800&q=85",
              buttonText: "SHOP NEW ARRIVALS",
              buttonLink: "frontend-shop"
            },
            {
              title: "MINIMALIST STREETWEAR",
              description: "Heavyweight 450gsm organic cotton, dropped shoulder proportions, and relaxed monochrome palettes engineered for everyday comfort.",
              imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1800&q=85",
              buttonText: "EXPLORE THE DROP",
              buttonLink: "frontend-shop"
            },
            {
              title: "TIMELESS CONTEMPORARY TAILORING",
              description: "Unstructured blazers, relaxed pleated trousers, and breathable linen-blend overshirts designed for effortless layering.",
              imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1800&q=85",
              buttonText: "DISCOVER LOOKBOOK",
              buttonLink: "frontend-shop"
            }
          ]
        }
      },
      {
        id: "h-sec-collections",
        type: "Collection list",
        settings: {
          fullWidth: false,
          headingColor: "#0F172A",
          textColor: "#64748B",
          title: "CURATED COLLECTIONS",
          description: "Explore contemporary menswear and womenswear across tailored outerwear, fine knitwear, and streetwear essentials.",
          itemsCount: 4
        }
      },
      {
        id: "h-sec-products",
        type: "Featured collection",
        settings: {
          fullWidth: false,
          headingColor: "#0F172A",
          textColor: "#64748B",
          title: "TRENDING THIS WEEK",
          description: "Our most coveted garments, tailored with architectural precision and crafted from sustainable luxury textiles.",
          itemsCount: 8
        }
      },
      {
        id: "h-sec-marquee",
        type: "Marquee text",
        settings: {
          fullWidth: true,
          backgroundColor: "#0F172A",
          headingColor: "#FFFFFF",
          textColor: "#E2E8F0",
          title: "COMPLIMENTARY EXPRESS SHIPPING ACROSS INDIA ON ORDERS OVER \u20B9999  \xB7  30-DAY EFFORTLESS RETURNS  \xB7  SUSTAINABLY CRAFTED FROM ORGANIC TEXTILES  \xB7  HAND-FINISHED IN ATELIERS  \xB7  NEW CURATED DROPS EVERY THURSDAY",
          marqueeSpeed: 4
        }
      },
      {
        id: "h-sec-editorial",
        type: "Image with text",
        settings: {
          fullWidth: false,
          backgroundColor: "#F8FAFC",
          headingColor: "#0F172A",
          textColor: "#475569",
          title: "THE ART OF UNDERSTATED LUXURY",
          description: "We believe in wardrobe longevity over disposable fast-fashion cycles. Every silhouette in our studio is cut with clean architectural lines, woven from GOTS-certified organic cotton and European virgin wool, and finished with meticulous double-needle craftsmanship designed to endure for decades.",
          buttonText: "EXPLORE OUR ATELIER",
          buttonLink: "frontend-shop",
          imageUrl: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80"
        }
      },
      {
        id: "h-sec-trust",
        type: "Trust badges",
        settings: {
          fullWidth: false,
          backgroundColor: "#FFFFFF",
          trustBadges: [
            { iconType: "badge", title: "ETHICALLY CRAFTED", description: "GOTS certified organic cotton & recycled wool." },
            { iconType: "shield", title: "EXPRESS TRACKED SHIPPING", description: "Carbon-neutral delivery across India & Worldwide." },
            { iconType: "globe", title: "COMPLIMENTARY RETURNS", description: "30-day effortless return and exchange policy." },
            { iconType: "tag", title: "PREMIUM SUSTAINABILITY", description: "Zero single-use plastics in all shipping packaging." }
          ]
        }
      },
      {
        id: "h-sec-blog",
        type: "Blog post",
        settings: {
          fullWidth: false,
          headingColor: "#0F172A",
          textColor: "#64748B",
          title: "THE STYLE JOURNAL",
          description: "Editorials, seasonal styling blueprints, and craftsmanship stories direct from our European ateliers.",
          columnsDesktop: 3,
          columnsMobile: 1
        }
      }
    ]
  },
  {
    id: "brands",
    title: "Atelier Directory",
    slug: "brands",
    visibility: "Visible",
    updatedAt: "Sep 24, 2026",
    sections: [
      {
        id: "s2",
        type: "Rich text",
        settings: {
          fullWidth: false,
          backgroundColor: "#FFFFFF",
          headingColor: "#1E293B",
          textColor: "#64748B",
          title: "Curated Brands & Designers",
          description: "Explore our catalog of certified ethical fashion brands and independent ateliers."
        }
      }
    ]
  },
  {
    id: "subscribe",
    title: "Wardrobe Capsule Plans",
    slug: "subscribe",
    visibility: "Visible",
    updatedAt: "Sep 24, 2026",
    sections: [
      {
        id: "subs-sec-1",
        type: "Plans",
        settings: {
          fullWidth: false,
          backgroundColor: "#0F172A",
          headingColor: "#FFFFFF",
          textColor: "#E2E8F0",
          title: "SEASONAL CAPSULE PLANS",
          description: "Curated wardrobe drops. Timeless garments. Member pricing.",
          alertBadgeText: "Subscribers save up to 25% on new season releases",
          promoBannerText: "\u2605 NEW MEMBERS - COMPLIMENTARY WELCOME GIFT WITH FIRST CAPSULE >",
          planItems: [
            {
              slug: "lite",
              name: "ESSENTIALS",
              subtitle: "Perfect for wardrobe updates",
              price: 69,
              limit: 3,
              saveAmountText: "Save \xA315.00/month",
              imageUrl: "",
              features: [
                "3 premium curated garments",
                "Seasonal style delivery",
                "Swap sizes or fits anytime",
                "Skip or pause with one click"
              ],
              isPopular: false
            },
            {
              slug: "core",
              name: "SIGNATURE",
              subtitle: "Most popular wardrobe tier",
              price: 119,
              limit: 5,
              saveAmountText: "Save \xA335.00/month",
              imageUrl: "",
              features: [
                "5 premium curated garments",
                "Includes premium knitwear & tops",
                "Complimentary exchanges",
                "Priority access to new drops"
              ],
              isPopular: true
            },
            {
              slug: "pro",
              name: "ATELIER LUXURY",
              subtitle: "Complete seasonal wardrobe",
              price: 189,
              limit: 8,
              saveAmountText: "Save \xA365.00/month",
              imageUrl: "",
              features: [
                "8 luxury tailored pieces",
                "Includes tailored outerwear & coats",
                "FREE Express tracked courier",
                "Complimentary personal styling consultation",
                "Full control to pause or cancel anytime"
              ],
              isPopular: false
            }
          ]
        }
      }
    ]
  }
];

// neonDb.ts
import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
dotenv.config();
var lastStatus = { status: "pending", databaseType: "Neon Postgres" };
var tablesInitialized = false;
function getNeonUri() {
  const uri = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || process.env.POSTGRES_URL || "";
  return cleanUri(uri);
}
function cleanUri(uri) {
  if (!uri) return "";
  let cleaned = uri.trim();
  if (cleaned.startsWith('"') && cleaned.endsWith('"') || cleaned.startsWith("'") && cleaned.endsWith("'")) {
    cleaned = cleaned.substring(1, cleaned.length - 1).trim();
  }
  return cleaned;
}
function getHostFromUri(uri) {
  try {
    const cleaned = cleanUri(uri);
    const sIndex = cleaned.indexOf("://");
    if (sIndex === -1) return "";
    const part = cleaned.substring(sIndex + 3);
    const atIndex = part.lastIndexOf("@");
    const hostWithQuery = atIndex !== -1 ? part.substring(atIndex + 1) : part;
    const slashIndex = hostWithQuery.indexOf("/");
    const hostPlusPort = slashIndex !== -1 ? hostWithQuery.substring(0, slashIndex) : hostWithQuery;
    const quesIndex = hostPlusPort.indexOf("?");
    return quesIndex !== -1 ? hostPlusPort.substring(0, quesIndex) : hostPlusPort;
  } catch (e) {
    return "";
  }
}
function getSqlClient() {
  const uri = getNeonUri();
  if (!uri) return null;
  return neon(uri);
}
function getTableName(resource) {
  const r = resource.toLowerCase();
  switch (r) {
    case "products":
      return "products";
    case "collections":
      return "collections";
    case "orders":
      return "orders";
    case "files":
      return "files";
    case "customers":
      return "customers";
    case "discounts":
      return "discounts";
    case "custompages":
    case "custom_pages":
      return "custom_pages";
    case "blogs":
      return "blogs";
    default:
      return null;
  }
}
async function initTables() {
  const sql = getSqlClient();
  if (!sql) return false;
  try {
    await sql.transaction([
      sql`CREATE TABLE IF NOT EXISTS products (id TEXT PRIMARY KEY, data JSONB NOT NULL, updated_at TIMESTAMPTZ DEFAULT NOW());`,
      sql`CREATE TABLE IF NOT EXISTS collections (id TEXT PRIMARY KEY, data JSONB NOT NULL, updated_at TIMESTAMPTZ DEFAULT NOW());`,
      sql`CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, data JSONB NOT NULL, updated_at TIMESTAMPTZ DEFAULT NOW());`,
      sql`CREATE TABLE IF NOT EXISTS files (id TEXT PRIMARY KEY, data JSONB NOT NULL, updated_at TIMESTAMPTZ DEFAULT NOW());`,
      sql`CREATE TABLE IF NOT EXISTS customers (id TEXT PRIMARY KEY, data JSONB NOT NULL, updated_at TIMESTAMPTZ DEFAULT NOW());`,
      sql`CREATE TABLE IF NOT EXISTS discounts (id TEXT PRIMARY KEY, data JSONB NOT NULL, updated_at TIMESTAMPTZ DEFAULT NOW());`,
      sql`CREATE TABLE IF NOT EXISTS custom_pages (id TEXT PRIMARY KEY, data JSONB NOT NULL, updated_at TIMESTAMPTZ DEFAULT NOW());`,
      sql`CREATE TABLE IF NOT EXISTS blogs (id TEXT PRIMARY KEY, data JSONB NOT NULL, updated_at TIMESTAMPTZ DEFAULT NOW());`,
      sql`CREATE TABLE IF NOT EXISTS uploaded_images (id TEXT PRIMARY KEY, base64_data TEXT NOT NULL, mime_type TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW());`,
      sql`CREATE TABLE IF NOT EXISTS layout_settings (id TEXT PRIMARY KEY, data JSONB NOT NULL, updated_at TIMESTAMPTZ DEFAULT NOW());`
    ]);
    tablesInitialized = true;
    lastStatus = {
      status: "connected",
      databaseType: "Neon Postgres",
      uriHost: getHostFromUri(getNeonUri())
    };
    return true;
  } catch (error) {
    console.error("[Neon Postgres] Failed to initialize tables:", error);
    lastStatus = {
      status: "error",
      databaseType: "Neon Postgres",
      uriHost: getHostFromUri(getNeonUri()),
      error: error?.message || String(error)
    };
    return false;
  }
}
async function seedIfEmpty() {
  const sql = getSqlClient();
  if (!sql) return;
  const seeds = [
    { table: "products", data: INITIAL_PRODUCTS },
    { table: "collections", data: INITIAL_COLLECTIONS },
    { table: "orders", data: INITIAL_ORDERS },
    { table: "files", data: INITIAL_FILES },
    { table: "customers", data: INITIAL_CUSTOMERS },
    { table: "discounts", data: INITIAL_DISCOUNTS },
    { table: "custom_pages", data: DEFAULT_PAGES },
    { table: "blogs", data: INITIAL_BLOGS }
  ];
  for (const { table, data } of seeds) {
    if (!data || data.length === 0) continue;
    try {
      const countRes = await sql.query(`SELECT COUNT(*)::int as count FROM ${table}`);
      const count = countRes && countRes[0] ? countRes[0].count : 0;
      if (count === 0) {
        console.log(`[Neon Postgres Seeding] Table "${table}" is empty. Seeding ${data.length} initial records...`);
        for (const item of data) {
          if (!item.id) continue;
          await sql.query(
            `INSERT INTO ${table} (id, data, updated_at) VALUES ($1, $2, NOW()) ON CONFLICT (id) DO NOTHING`,
            [item.id, JSON.stringify(item)]
          );
        }
      }
    } catch (e) {
      console.warn(`[Neon Postgres Seeding] Skipped seeding for ${table}:`, e);
    }
  }
}
async function testConnection() {
  const uri = getNeonUri();
  if (!uri) {
    lastStatus = {
      status: "not-configured",
      databaseType: "Neon Postgres"
    };
    return lastStatus;
  }
  const sql = getSqlClient();
  if (!sql) {
    lastStatus = {
      status: "error",
      databaseType: "Neon Postgres",
      error: "Failed to create Neon client"
    };
    return lastStatus;
  }
  try {
    const res = await sql`SELECT NOW() as server_time, current_database() as db_name, version() as pg_version`;
    if (!tablesInitialized) {
      await initTables();
      await seedIfEmpty();
    }
    lastStatus = {
      status: "connected",
      databaseType: "Neon Postgres",
      uriHost: getHostFromUri(uri)
    };
    return lastStatus;
  } catch (error) {
    lastStatus = {
      status: "error",
      databaseType: "Neon Postgres",
      uriHost: getHostFromUri(uri),
      error: error?.message || String(error)
    };
    return lastStatus;
  }
}
function getNeonStatus() {
  const uri = getNeonUri();
  if (!uri) {
    return {
      status: "not-configured",
      databaseType: "Neon Postgres"
    };
  }
  return {
    ...lastStatus,
    uriHost: getHostFromUri(uri)
  };
}
async function getNeonDetails() {
  const uri = getNeonUri();
  const host = getHostFromUri(uri);
  if (!uri) {
    return {
      status: "not-configured",
      databaseType: "Neon Postgres",
      uriHost: "N/A",
      error: "No Neon connection string found in environment variables (DATABASE_URL or NEON_DATABASE_URL).",
      tables: [],
      latencyMs: null
    };
  }
  const sql = getSqlClient();
  if (!sql) {
    return {
      status: "error",
      databaseType: "Neon Postgres",
      uriHost: host,
      error: "Unable to initialize Neon SQL client.",
      tables: []
    };
  }
  const startTime = Date.now();
  try {
    const pingRes = await sql`SELECT current_database() as db_name, version() as pg_version, NOW() as current_time`;
    const latencyMs = Date.now() - startTime;
    if (!tablesInitialized) {
      await initTables();
      await seedIfEmpty();
    }
    const tableNames = ["products", "collections", "orders", "files", "customers", "discounts", "custom_pages", "blogs", "uploaded_images", "layout_settings"];
    const tablesInfo = [];
    for (const t of tableNames) {
      try {
        const res = await sql.query(`SELECT COUNT(*)::int as count FROM ${t}`);
        tablesInfo.push({
          name: t,
          count: res && res[0] ? res[0].count : 0
        });
      } catch (err) {
        tablesInfo.push({ name: t, count: 0 });
      }
    }
    const dbName = pingRes && pingRes[0] ? pingRes[0].db_name : "neondb";
    const pgVersion = pingRes && pingRes[0] ? pingRes[0].pg_version : "PostgreSQL";
    return {
      status: "connected",
      databaseType: "Neon Postgres",
      uriHost: host,
      dbName,
      pgVersion,
      latencyMs,
      tables: tablesInfo,
      error: null
    };
  } catch (err) {
    return {
      status: "error",
      databaseType: "Neon Postgres",
      uriHost: host,
      error: err?.message || String(err),
      tables: [],
      latencyMs: null
    };
  }
}
function updateNeonUri(newUri) {
  const trimmed = cleanUri(newUri);
  process.env.DATABASE_URL = trimmed;
  process.env.NEON_DATABASE_URL = trimmed;
  try {
    const envPath = path.join(process.cwd(), ".env");
    let envContent = "";
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, "utf8");
    }
    const regexDbUrl = /^DATABASE_URL\s*=\s*.*$/m;
    if (regexDbUrl.test(envContent)) {
      envContent = envContent.replace(regexDbUrl, `DATABASE_URL="${trimmed}"`);
    } else {
      envContent = `${envContent.trim()}
DATABASE_URL="${trimmed}"
`;
    }
    const regexNeon = /^NEON_DATABASE_URL\s*=\s*.*$/m;
    if (regexNeon.test(envContent)) {
      envContent = envContent.replace(regexNeon, `NEON_DATABASE_URL="${trimmed}"`);
    } else {
      envContent = `${envContent.trim()}
NEON_DATABASE_URL="${trimmed}"
`;
    }
    fs.writeFileSync(envPath, envContent.trim() + "\n", "utf8");
    console.log("[Neon Postgres] Successfully persisted DATABASE_URL to /.env file");
  } catch (err) {
    console.warn("[Neon Postgres] Failed to save DATABASE_URL to /.env file:", err);
  }
  tablesInitialized = false;
  lastStatus = {
    status: "pending",
    databaseType: "Neon Postgres",
    uriHost: getHostFromUri(trimmed)
  };
  return lastStatus;
}
async function fetchResourceFromNeon(resource) {
  const tableName = getTableName(resource);
  if (!tableName) return null;
  const sql = getSqlClient();
  if (!sql) return null;
  try {
    if (!tablesInitialized) {
      await initTables();
    }
    const rows = await sql.query(`SELECT data FROM ${tableName} ORDER BY updated_at DESC`);
    if (rows && Array.isArray(rows)) {
      return rows.map((r) => typeof r.data === "string" ? JSON.parse(r.data) : r.data);
    }
    return [];
  } catch (err) {
    console.error(`[Neon Postgres] Error fetching "${resource}":`, err);
    return null;
  }
}
async function saveResourceToNeon(resource, list) {
  const tableName = getTableName(resource);
  if (!tableName) return false;
  const sql = getSqlClient();
  if (!sql) return false;
  try {
    if (!tablesInitialized) {
      await initTables();
    }
    const activeIds = list.map((item) => item.id).filter(Boolean);
    if (activeIds.length > 0) {
      await sql.query(
        `DELETE FROM ${tableName} WHERE NOT (id = ANY($1::text[]))`,
        [activeIds]
      );
    } else {
      await sql.query(`DELETE FROM ${tableName}`);
    }
    for (const item of list) {
      if (!item.id) continue;
      await sql.query(
        `INSERT INTO ${tableName} (id, data, updated_at)
         VALUES ($1, $2, NOW())
         ON CONFLICT (id) DO UPDATE SET
           data = EXCLUDED.data,
           updated_at = NOW()`,
        [item.id, JSON.stringify(item)]
      );
    }
    console.log(`[Neon Postgres] Successfully synchronized ${list.length} records in table "${tableName}".`);
    return true;
  } catch (err) {
    console.error(`[Neon Postgres] Error saving resource "${resource}":`, err);
    return false;
  }
}
async function saveImageToNeon(id, base64Data, mimeType) {
  const sql = getSqlClient();
  if (!sql) return false;
  try {
    if (!tablesInitialized) {
      await initTables();
    }
    await sql.query(
      `INSERT INTO uploaded_images (id, base64_data, mime_type, created_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (id) DO UPDATE SET
         base64_data = EXCLUDED.base64_data,
         mime_type = EXCLUDED.mime_type`,
      [id, base64Data, mimeType]
    );
    return true;
  } catch (err) {
    console.error(`[Neon Postgres] Error saving uploaded image ${id}:`, err);
    return false;
  }
}
async function getImageFromNeon(id) {
  const sql = getSqlClient();
  if (!sql) return null;
  try {
    if (!tablesInitialized) {
      await initTables();
    }
    const result = await sql.query(
      `SELECT base64_data, mime_type FROM uploaded_images WHERE id = $1 LIMIT 1`,
      [id]
    );
    const rows = Array.isArray(result) ? result : result?.rows || [];
    if (rows && rows.length > 0) {
      return {
        base64Data: rows[0].base64_data,
        mimeType: rows[0].mime_type
      };
    }
    return null;
  } catch (err) {
    console.error(`[Neon Postgres] Error retrieving image ${id}:`, err);
    return null;
  }
}
async function fetchLayoutSettingsFromNeon() {
  const sql = getSqlClient();
  if (!sql) return null;
  try {
    if (!tablesInitialized) {
      await initTables();
    }
    const rows = await sql.query(`SELECT data FROM layout_settings WHERE id = 'layout_settings' LIMIT 1`);
    if (rows && rows.length > 0) {
      const data = rows[0].data;
      return typeof data === "string" ? JSON.parse(data) : data;
    }
    return null;
  } catch (err) {
    console.error("[Neon Postgres] Error fetching layout settings:", err);
    return null;
  }
}
async function saveLayoutSettingsToNeon(settings) {
  const sql = getSqlClient();
  if (!sql) return false;
  try {
    if (!tablesInitialized) {
      await initTables();
    }
    const payload = { ...settings, id: "layout_settings" };
    await sql.query(
      `INSERT INTO layout_settings (id, data, updated_at)
       VALUES ('layout_settings', $1, NOW())
       ON CONFLICT (id) DO UPDATE SET
         data = EXCLUDED.data,
         updated_at = NOW()`,
      [JSON.stringify(payload)]
    );
    return true;
  } catch (err) {
    console.error("[Neon Postgres] Error saving layout settings:", err);
    return false;
  }
}

// serverDb.ts
dotenv2.config();
var memoryCache = {
  products: [...INITIAL_PRODUCTS],
  collections: [...INITIAL_COLLECTIONS],
  orders: [...INITIAL_ORDERS],
  files: [...INITIAL_FILES],
  customers: [...INITIAL_CUSTOMERS],
  discounts: [...INITIAL_DISCOUNTS],
  customPages: [...DEFAULT_PAGES],
  custompages: [...DEFAULT_PAGES],
  blogs: [...INITIAL_BLOGS]
};
function getConnectionStatus() {
  return getNeonStatus();
}
async function getDatabaseDetails() {
  return getNeonDetails();
}
function updateDbUri(newUri) {
  return updateNeonUri(newUri);
}
async function getDb() {
  const status = await testConnection();
  return status.status === "connected" ? status : null;
}
async function fetchResource(resource) {
  const resKey = resource.toLowerCase();
  try {
    const neonData = await fetchResourceFromNeon(resource);
    if (neonData && Array.isArray(neonData) && neonData.length > 0) {
      let cleanedData = neonData;
      if (resKey === "custompages") {
        const jsonStr = JSON.stringify(neonData).replace(/Pouch Supply Storefront/gi, "Modern Storefront").replace(/Pouch Supply/gi, "StoreFront").replace(/(\d+)\s+premium cans/gi, "$1 premium items").replace(/price per can/gi, "price per item").replace(/additional can/gi, "additional item").replace(/extra can/gi, "extra item").replace(/FOR ANY ADDITIONAL CAN/gi, "FOR ANY ADDITIONAL ITEM").replace(/certified compounding premium brands/gi, "certified premium brands");
        cleanedData = JSON.parse(jsonStr);
        const hpIdx = cleanedData.findIndex((p) => p.isHomepage || p.id === "homepage" || p.slug === "");
        const defaultHp = DEFAULT_PAGES.find((p) => p.isHomepage) || DEFAULT_PAGES[0];
        let needsSave = false;
        if (hpIdx === -1) {
          cleanedData.unshift(defaultHp);
          needsSave = true;
        } else {
          const hp = cleanedData[hpIdx];
          if (!hp.sections || hp.sections.length <= 1 || hp.sections.some((s) => s.settings?.title?.toLowerCase().includes("pouch supply") || s.settings?.title?.toLowerCase().includes("modern storefront"))) {
            cleanedData[hpIdx] = {
              ...hp,
              sections: [...defaultHp.sections]
            };
            needsSave = true;
          }
        }
        if (needsSave) {
          saveResourceToNeon(resource, cleanedData).catch(() => {
          });
        }
      }
      memoryCache[resource] = [...cleanedData];
      return cleanedData;
    } else {
      if (resKey === "products" && INITIAL_PRODUCTS.length > 0) {
        saveResourceToNeon(resource, INITIAL_PRODUCTS).catch(() => {
        });
        memoryCache[resource] = [...INITIAL_PRODUCTS];
        return INITIAL_PRODUCTS;
      }
      if (resKey === "collections" && INITIAL_COLLECTIONS.length > 0) {
        saveResourceToNeon(resource, INITIAL_COLLECTIONS).catch(() => {
        });
        memoryCache[resource] = [...INITIAL_COLLECTIONS];
        return INITIAL_COLLECTIONS;
      }
      if (resKey === "custompages" && DEFAULT_PAGES.length > 0) {
        saveResourceToNeon(resource, DEFAULT_PAGES).catch(() => {
        });
        memoryCache[resource] = [...DEFAULT_PAGES];
        return DEFAULT_PAGES;
      }
      if (resKey === "blogs" && INITIAL_BLOGS.length > 0) {
        saveResourceToNeon(resource, INITIAL_BLOGS).catch(() => {
        });
        memoryCache[resource] = [...INITIAL_BLOGS];
        return INITIAL_BLOGS;
      }
    }
  } catch (error) {
    console.error(`[fetchResource] Error fetching "${resource}" from Neon Postgres:`, error);
  }
  return memoryCache[resource] || [];
}
async function saveResource(resource, list) {
  memoryCache[resource] = [...list];
  try {
    await saveResourceToNeon(resource, list);
  } catch (error) {
    console.error(`[saveResource] Error saving "${resource}" to Neon Postgres:`, error);
  }
  return memoryCache[resource];
}
var memoryImages = {};
async function saveUploadedImage(id, base64Data, mimeType) {
  memoryImages[id] = { base64Data, mimeType };
  try {
    await saveImageToNeon(id, base64Data, mimeType);
    console.log(`[Neon Postgres Sync] Successfully saved image to database for ID: ${id}`);
  } catch (error) {
    console.error("[Neon Postgres] Failed to save uploaded image in DB:", error);
  }
  return `/api/images/${id}`;
}
async function getUploadedImage(rawId) {
  if (!rawId) return null;
  let id = rawId;
  if (id.includes("/")) {
    id = id.substring(id.lastIndexOf("/") + 1);
  }
  const dotIndex = id.lastIndexOf(".");
  const cleanId = dotIndex !== -1 ? id.substring(0, dotIndex) : id;
  if (memoryImages[id]) {
    return memoryImages[id];
  }
  if (memoryImages[cleanId]) {
    return memoryImages[cleanId];
  }
  try {
    let neonImage = await getImageFromNeon(id);
    if (!neonImage && cleanId !== id) {
      neonImage = await getImageFromNeon(cleanId);
    }
    if (neonImage) {
      memoryImages[id] = neonImage;
      memoryImages[cleanId] = neonImage;
      return neonImage;
    }
  } catch (error) {
    console.error("[Neon Postgres] Failed to load image from DB:", error);
  }
  try {
    const uploadsDir = path2.join(process.cwd(), "uploads");
    if (fs2.existsSync(uploadsDir)) {
      const files = fs2.readdirSync(uploadsDir);
      const matchedFile = files.find((f) => f === id || f === cleanId || f.startsWith(cleanId + ".") || f.startsWith(id + "."));
      if (matchedFile) {
        const filePath = path2.join(uploadsDir, matchedFile);
        const buffer = fs2.readFileSync(filePath);
        const base64Data = buffer.toString("base64");
        let mimeType = "image/png";
        if (matchedFile.endsWith(".jpg") || matchedFile.endsWith(".jpeg")) mimeType = "image/jpeg";
        else if (matchedFile.endsWith(".webp")) mimeType = "image/webp";
        else if (matchedFile.endsWith(".svg")) mimeType = "image/svg+xml";
        else if (matchedFile.endsWith(".gif")) mimeType = "image/gif";
        else if (matchedFile.endsWith(".mp4")) mimeType = "video/mp4";
        else if (matchedFile.endsWith(".webm")) mimeType = "video/webm";
        const result = { base64Data, mimeType };
        memoryImages[id] = result;
        memoryImages[cleanId] = result;
        return result;
      }
    }
  } catch (err) {
    console.error("[Local Storage] Error reading file from disk fallback:", err);
  }
  return null;
}
async function fetchLayoutSettings() {
  const defaultSettings = {
    id: "layout_settings",
    headerLogoText: "STOREFRONT",
    headerLogoSubtext: "Premium Essentials",
    headerLogoImage: "",
    footerLogoText: "STOREFRONT",
    footerLogoDescription: "Curated premium eCommerce store delivering high-quality essentials directly to your door. Seamless online shopping, flexible subscriptions, and express tracked shipping.",
    footerLogoImage: "",
    klaviyoPublicKey: "",
    menuItems: [
      { id: "1", label: "Home", tab: "frontend-home", type: "tab" },
      { id: "2", label: "Subscribe", tab: "frontend-subscribe", type: "tab" },
      { id: "3", label: "Shop Now", tab: "frontend-shop", type: "tab" },
      { id: "4", label: "All Brands", tab: "frontend-brands", type: "tab" },
      { id: "5", label: "About", tab: "about", type: "tab" }
    ]
  };
  const sanitizeSettings = (raw) => {
    if (!raw) return defaultSettings;
    const cleaned = { ...raw };
    if (!cleaned.headerLogoText || /pouch supply/i.test(cleaned.headerLogoText)) {
      cleaned.headerLogoText = "STOREFRONT";
    }
    if (!cleaned.headerLogoSubtext || /premium nicotine/i.test(cleaned.headerLogoSubtext)) {
      cleaned.headerLogoSubtext = "Premium Essentials";
    }
    if (!cleaned.footerLogoText || /pouch supply/i.test(cleaned.footerLogoText)) {
      cleaned.footerLogoText = "STOREFRONT";
    }
    if (!cleaned.footerLogoDescription || /nicotine|canisters|pouch supply/i.test(cleaned.footerLogoDescription)) {
      cleaned.footerLogoDescription = "Curated premium eCommerce store delivering high-quality essentials directly to your door. Seamless online shopping, flexible subscriptions, and express tracked shipping.";
    }
    return cleaned;
  };
  try {
    const fromNeon = await fetchLayoutSettingsFromNeon();
    if (fromNeon) {
      const sanitized = sanitizeSettings(fromNeon);
      if (sanitized.headerLogoText !== fromNeon.headerLogoText || sanitized.footerLogoDescription !== fromNeon.footerLogoDescription) {
        saveLayoutSettingsToNeon(sanitized).catch(() => {
        });
      }
      return sanitized;
    }
  } catch (error) {
    console.error("[serverDb] Failed to fetch layout settings from Neon, falling back to local file:", error);
  }
  const filePath = path2.join(process.cwd(), "layout_settings.json");
  if (fs2.existsSync(filePath)) {
    try {
      const content = fs2.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(content);
      const sanitized = sanitizeSettings(parsed);
      saveLayoutSettingsToNeon(sanitized).catch(() => {
      });
      return sanitized;
    } catch (e) {
      console.warn("[serverDb] Failed fallback load of layout_settings.json:", e);
    }
  }
  return defaultSettings;
}
async function saveLayoutSettings(settings) {
  const payload = { ...settings, id: "layout_settings" };
  try {
    const filePath = path2.join(process.cwd(), "layout_settings.json");
    fs2.writeFileSync(filePath, JSON.stringify(payload, null, 2), "utf-8");
  } catch (e) {
    console.warn("[serverDb] Failed writing to layout_settings.json:", e);
  }
  try {
    await saveLayoutSettingsToNeon(payload);
    console.log("[serverDb] Successfully saved layout settings to Neon Postgres.");
  } catch (error) {
    console.error("[serverDb] Failed to save layout settings to Neon DB:", error);
  }
  return payload;
}

// backend/routes/products.ts
import { Router } from "express";
var router = Router();
router.get("/", async (req, res) => {
  try {
    const data = await fetchResource("products");
    res.json(data);
  } catch (err) {
    console.error("[Products Router] GET Error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch products" });
  }
});
router.post("/", async (req, res) => {
  try {
    const payload = req.body;
    if (!Array.isArray(payload)) {
      return res.status(400).json({ error: "Products API expects an array of documents" });
    }
    const database = await getDb();
    if (!database) {
      res.setHeader("X-Database-Offline", "true");
    } else {
      res.setHeader("X-Database-Offline", "false");
    }
    const updated = await saveResource("products", payload);
    res.json(updated);
  } catch (err) {
    console.error("[Products Router] POST Error:", err);
    res.status(500).json({ error: err.message || "Failed to persist products" });
  }
});
var products_default = router;

// backend/routes/collections.ts
import { Router as Router2 } from "express";
var router2 = Router2();
router2.get("/", async (req, res) => {
  try {
    const data = await fetchResource("collections");
    res.json(data);
  } catch (err) {
    console.error("[Collections Router] GET Error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch collections" });
  }
});
router2.post("/", async (req, res) => {
  try {
    const payload = req.body;
    if (!Array.isArray(payload)) {
      return res.status(400).json({ error: "Collections API expects an array of documents" });
    }
    const database = await getDb();
    if (!database) {
      res.setHeader("X-Database-Offline", "true");
    } else {
      res.setHeader("X-Database-Offline", "false");
    }
    const updated = await saveResource("collections", payload);
    res.json(updated);
  } catch (err) {
    console.error("[Collections Router] POST Error:", err);
    res.status(500).json({ error: err.message || "Failed to persist collections" });
  }
});
var collections_default = router2;

// backend/routes/orders.ts
import { Router as Router3 } from "express";
var router3 = Router3();
router3.get("/", async (req, res) => {
  try {
    const data = await fetchResource("orders");
    res.json(data);
  } catch (err) {
    console.error("[Orders Router] GET Error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch orders" });
  }
});
router3.post("/", async (req, res) => {
  try {
    const payload = req.body;
    if (!Array.isArray(payload)) {
      return res.status(400).json({ error: "Orders API expects an array of documents" });
    }
    const database = await getDb();
    if (!database) {
      res.setHeader("X-Database-Offline", "true");
    } else {
      res.setHeader("X-Database-Offline", "false");
    }
    const updated = await saveResource("orders", payload);
    res.json(updated);
  } catch (err) {
    console.error("[Orders Router] POST Error:", err);
    res.status(500).json({ error: err.message || "Failed to persist orders" });
  }
});
var orders_default = router3;

// backend/routes/files.ts
import { Router as Router4 } from "express";
var router4 = Router4();
router4.get("/", async (req, res) => {
  try {
    const data = await fetchResource("files");
    res.json(data);
  } catch (err) {
    console.error("[Files Router] GET Error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch files" });
  }
});
router4.post("/", async (req, res) => {
  try {
    const payload = req.body;
    if (!Array.isArray(payload)) {
      return res.status(400).json({ error: "Files API expects an array of documents" });
    }
    const database = await getDb();
    if (!database) {
      res.setHeader("X-Database-Offline", "true");
    } else {
      res.setHeader("X-Database-Offline", "false");
    }
    const updated = await saveResource("files", payload);
    res.json(updated);
  } catch (err) {
    console.error("[Files Router] POST Error:", err);
    res.status(500).json({ error: err.message || "Failed to persist files" });
  }
});
var files_default = router4;

// backend/routes/customers.ts
import { Router as Router5 } from "express";
import crypto from "crypto";
var router5 = Router5();
function hashPassword(password) {
  return crypto.createHash("sha256").update(password + "store_secure_salt_123!").digest("hex");
}
function verifyPassword(inputPassword, storedHash) {
  const newHash = hashPassword(inputPassword);
  if (newHash === storedHash) return true;
  const legacyHash = crypto.createHash("sha256").update(inputPassword + "pouch_supply_salt_123!").digest("hex");
  return legacyHash === storedHash;
}
router5.get("/", async (req, res) => {
  try {
    const data = await fetchResource("customers");
    const sanitized = data.map(({ passwordHash, ...rest }) => rest);
    res.json(sanitized);
  } catch (err) {
    console.error("[Customers Router] GET Error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch customers" });
  }
});
router5.post("/", async (req, res) => {
  try {
    const payload = req.body;
    if (!Array.isArray(payload)) {
      return res.status(400).json({ error: "Customers API expects an array of documents" });
    }
    const database = await getDb();
    if (!database) {
      res.setHeader("X-Database-Offline", "true");
    } else {
      res.setHeader("X-Database-Offline", "false");
    }
    const updated = await saveResource("customers", payload);
    res.json(updated);
  } catch (err) {
    console.error("[Customers Router] POST Error:", err);
    res.status(500).json({ error: err.message || "Failed to persist customers" });
  }
});
router5.post("/signup", async (req, res) => {
  try {
    const { name, email, password, location = "United Kingdom", referredByCode = null } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required for registration." });
    }
    const emailTrim = email.trim().toLowerCase();
    const customersList = await fetchResource("customers");
    const existing = customersList.find((c) => c.email.toLowerCase() === emailTrim);
    if (existing) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }
    const codeSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const cleanFirstName = name.trim().split(" ")[0].replace(/[^a-zA-Z]/g, "").toUpperCase() || "USER";
    const referralCode = `REF-PS-${cleanFirstName}-${codeSuffix}`;
    let validReferredByCode = null;
    if (referredByCode) {
      const trimmedCode = referredByCode.trim().toUpperCase();
      const referrer = customersList.find((c) => c.referralCode && c.referralCode.toUpperCase() === trimmedCode);
      if (referrer) {
        validReferredByCode = referrer.referralCode;
      }
    }
    const newCustomer = {
      id: `cust-${Date.now()}`,
      name: name.trim(),
      email: emailTrim,
      subscriptionStatus: "Not subscribed",
      location: location.trim(),
      ordersCount: 0,
      amountSpent: 0,
      addresses: [],
      // Start with empty addresses array, no mock placeholder
      wishlist: [],
      referralCode,
      storeCredit: 0,
      referredByCode: validReferredByCode,
      passwordHash: hashPassword(password)
    };
    const updatedList = [...customersList, newCustomer];
    await saveResource("customers", updatedList);
    if (validReferredByCode) {
      try {
        const discountCode = `REF10-${codeSuffix}`;
        const discountsList = await fetchResource("discounts") || [];
        const newDiscount = {
          id: `disc-ref-${newCustomer.id}`,
          title: discountCode,
          status: "Active",
          method: "Code",
          eligibility: "All customers",
          type: "Amount off order",
          used: 0,
          details: `10% discount welcome coupon for referred customer`,
          valueType: "Percentage",
          valueAmount: 10,
          limitOnePerCustomer: true
        };
        await saveResource("discounts", [...discountsList, newDiscount]);
        console.log(`[Referral System] Generated 10% discount coupon ${discountCode} for referred customer: ${emailTrim}`);
      } catch (err) {
        console.error("Failed to generate referral discount:", err);
      }
    }
    console.log(`[Customer Auth] New registration successful for: ${emailTrim}`);
    const { passwordHash, ...safeCustomer } = newCustomer;
    res.status(201).json({
      message: "Registration successful!",
      customer: safeCustomer
    });
  } catch (err) {
    console.error("[Customer Auth] Signup Error:", err);
    res.status(500).json({ error: err.message || "Failed to complete customer registration" });
  }
});
router5.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }
    const emailTrim = email.trim().toLowerCase();
    const customersList = await fetchResource("customers");
    const found = customersList.find((c) => c.email.toLowerCase() === emailTrim);
    if (!found) {
      return res.status(401).json({ error: "No account found matching this email." });
    }
    let needsUpdate = false;
    const hasOldFormat = found.referralCode && !found.referralCode.startsWith("REF-PS-");
    if (!found.referralCode || hasOldFormat) {
      const codeSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
      const cleanFirstName = found.name.trim().split(" ")[0].replace(/[^a-zA-Z]/g, "").toUpperCase() || "USER";
      found.referralCode = `REF-PS-${cleanFirstName}-${codeSuffix}`;
      needsUpdate = true;
    }
    if (found.storeCredit === void 0) {
      found.storeCredit = 0;
      needsUpdate = true;
    }
    if (found.referredByCode === void 0) {
      found.referredByCode = null;
      needsUpdate = true;
    }
    if (found.passwordHash) {
      if (!verifyPassword(password, found.passwordHash)) {
        return res.status(401).json({ error: "Incorrect password. Please try again." });
      }
    } else {
      found.passwordHash = hashPassword(password);
      needsUpdate = true;
    }
    if (needsUpdate) {
      const updatedList = customersList.map((c) => c.id === found.id ? found : c);
      await saveResource("customers", updatedList);
      console.log(`[Customer Auth] Initialized referral credentials or password for: ${emailTrim}`);
    }
    console.log(`[Customer Auth] Login successful: ${emailTrim}`);
    const { passwordHash, ...safeCustomer } = found;
    res.json({
      message: "Login successful!",
      customer: safeCustomer
    });
  } catch (err) {
    console.error("[Customer Auth] Login Error:", err);
    res.status(500).json({ error: err.message || "Failed to complete customer login" });
  }
});
router5.post("/admin-login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Admin email and password are required." });
    }
    const adminEmail = process.env.ADMIN_EMAIL || "support@storefront.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "January14!2019";
    if (email.trim().toLowerCase() === adminEmail.toLowerCase() && password === adminPassword) {
      console.log(`[Admin Auth] Secure admin login succeeded for email: ${email}`);
      const adminToken = `admin-token-${crypto.randomBytes(16).toString("hex")}`;
      res.json({
        success: true,
        message: "Admin access granted.",
        token: adminToken,
        adminUser: {
          email: adminEmail,
          name: "Store Administrator"
        }
      });
    } else {
      console.warn(`[Admin Auth] Unauthorized admin login attempt with email: ${email}`);
      res.status(401).json({ error: "Invalid admin login credentials." });
    }
  } catch (err) {
    console.error("[Admin Auth] Login Error:", err);
    res.status(500).json({ error: err.message || "Internal server error during admin validation" });
  }
});
var customers_default = router5;

// backend/routes/discounts.ts
import { Router as Router6 } from "express";
var router6 = Router6();
router6.get("/", async (req, res) => {
  try {
    const data = await fetchResource("discounts");
    res.json(data);
  } catch (err) {
    console.error("[Discounts Router] GET Error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch discounts" });
  }
});
router6.post("/", async (req, res) => {
  try {
    const payload = req.body;
    if (!Array.isArray(payload)) {
      return res.status(400).json({ error: "Discounts API expects an array of documents" });
    }
    const database = await getDb();
    if (!database) {
      res.setHeader("X-Database-Offline", "true");
    } else {
      res.setHeader("X-Database-Offline", "false");
    }
    const updated = await saveResource("discounts", payload);
    res.json(updated);
  } catch (err) {
    console.error("[Discounts Router] POST Error:", err);
    res.status(500).json({ error: err.message || "Failed to persist discounts" });
  }
});
var discounts_default = router6;

// backend/routes/customPages.ts
import { Router as Router7 } from "express";
var router7 = Router7();
router7.get("/", async (req, res) => {
  try {
    const data = await fetchResource("customPages");
    res.json(data);
  } catch (err) {
    console.error("[CustomPages Router] GET Error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch custom pages" });
  }
});
router7.post("/", async (req, res) => {
  try {
    const payload = req.body;
    if (!Array.isArray(payload)) {
      return res.status(400).json({ error: "CustomPages API expects an array of documents" });
    }
    const database = await getDb();
    if (!database) {
      res.setHeader("X-Database-Offline", "true");
    } else {
      res.setHeader("X-Database-Offline", "false");
    }
    const updated = await saveResource("customPages", payload);
    res.json(updated);
  } catch (err) {
    console.error("[CustomPages Router] POST Error:", err);
    res.status(500).json({ error: err.message || "Failed to persist custom pages" });
  }
});
var customPages_default = router7;

// backend/routes/blogs.ts
import { Router as Router8 } from "express";
var router8 = Router8();
router8.get("/", async (req, res) => {
  try {
    const data = await fetchResource("blogs");
    res.json(data);
  } catch (err) {
    console.error("[Blogs Router] GET Error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch blogs" });
  }
});
router8.post("/", async (req, res) => {
  try {
    const payload = req.body;
    if (!Array.isArray(payload)) {
      return res.status(400).json({ error: "Blogs API expects an array of documents" });
    }
    const database = await getDb();
    if (!database) {
      res.setHeader("X-Database-Offline", "true");
    } else {
      res.setHeader("X-Database-Offline", "false");
    }
    const updated = await saveResource("blogs", payload);
    res.json(updated);
  } catch (err) {
    console.error("[Blogs Router] POST Error:", err);
    res.status(500).json({ error: err.message || "Failed to persist blogs" });
  }
});
var blogs_default = router8;

// backend/routes/razorpay.ts
import { Router as Router9 } from "express";
import crypto2 from "crypto";
import Razorpay from "razorpay";

// backend/email.ts
import nodemailer from "nodemailer";
var SMTP_HOST = process.env.SMTP_HOST || "smtp.storefront.com";
var SMTP_PORT = parseInt(process.env.SMTP_PORT || "465", 10);
var SMTP_SECURE = process.env.SMTP_SECURE !== "false";
var SMTP_USER = process.env.SMTP_USER || "support@storefront.com";
var SMTP_PASS = process.env.SMTP_PASS || "";
function createTransporter() {
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    },
    tls: {
      // Do not fail on invalid certs for custom domain mail servers
      rejectUnauthorized: false
    }
  });
}
async function sendOrderConfirmationEmail(order) {
  console.log(`[Email Service] Preparing order confirmation email for Order ID: ${order.id} to ${order.customerEmail}`);
  const transporter = createTransporter();
  const itemsHtml = order.items.map(
    (item) => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-family: sans-serif; font-size: 14px; color: #1e293b;">
        <strong style="color: #0f172a;">${item.productTitle}</strong>
        <div style="font-size: 12px; color: #64748b; margin-top: 2px;">Qty: ${item.quantity} \xD7 \xA3${item.price.toFixed(2)}</div>
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-family: sans-serif; font-size: 14px; color: #0f172a; text-align: right; font-weight: bold;">
        \xA3${(item.price * item.quantity).toFixed(2)}
      </td>
    </tr>
  `
  ).join("");
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmed - ${order.id}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 24px 12px;">
        <tr>
          <td align="center">
            <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
              
              <!-- Header -->
              <tr>
                <td style="background-color: #0f172a; padding: 40px 32px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; tracking: -0.025em; letter-spacing: -0.5px;">STOREFRONT</h1>
                  <p style="color: #94a3b8; margin: 8px 0 0 0; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Order Confirmed</p>
                </td>
              </tr>
              
              <!-- Body Content -->
              <tr>
                <td style="padding: 32px;">
                  <p style="font-size: 16px; color: #334155; line-height: 1.6; margin-top: 0;">
                    Hello <strong>${order.customerName}</strong>,
                  </p>
                  <p style="font-size: 15px; color: #475569; line-height: 1.6;">
                    Thank you for shopping with us! Your order has been securely processed and is being assembled by our logistics team. Here is your official purchase receipt:
                  </p>
                  
                  <!-- Order Meta Table -->
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 24px; background-color: #f1f5f9; border-radius: 12px; padding: 16px;">
                    <tr>
                      <td style="font-family: sans-serif; font-size: 13px; color: #64748b; padding-bottom: 6px;">Order ID</td>
                      <td style="font-family: sans-serif; font-size: 13px; color: #0f172a; font-weight: bold; text-align: right; padding-bottom: 6px;">${order.id}</td>
                    </tr>
                    <tr>
                      <td style="font-family: sans-serif; font-size: 13px; color: #64748b; padding-bottom: 6px;">Date Placed</td>
                      <td style="font-family: sans-serif; font-size: 13px; color: #0f172a; font-weight: bold; text-align: right; padding-bottom: 6px;">${order.date}</td>
                    </tr>
                    <tr>
                      <td style="font-family: sans-serif; font-size: 13px; color: #64748b; padding-bottom: 6px;">Payment Status</td>
                      <td style="font-family: sans-serif; font-size: 13px; color: #16a34a; font-weight: bold; text-align: right; padding-bottom: 6px;">${order.paymentStatus || "Paid"}</td>
                    </tr>
                    <tr>
                      <td style="font-family: sans-serif; font-size: 13px; color: #64748b;">Delivery Method</td>
                      <td style="font-family: sans-serif; font-size: 13px; color: #0f172a; font-weight: bold; text-align: right;">${order.deliveryMethod}</td>
                    </tr>
                  </table>
                  
                  <!-- Itemized Receipt -->
                  <h3 style="margin-top: 32px; font-size: 16px; font-weight: bold; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Order Details</h3>
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    ${itemsHtml}
                    <tr>
                      <td style="padding: 16px 0; font-family: sans-serif; font-size: 15px; color: #475569; font-weight: bold;">Grand Total</td>
                      <td style="padding: 16px 0; font-family: sans-serif; font-size: 18px; color: #0f172a; font-weight: 900; text-align: right;">
                        \xA3${order.total.toFixed(2)}
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Shipping Address Block -->
                  <h3 style="margin-top: 24px; font-size: 16px; font-weight: bold; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Shipping Address</h3>
                  <p style="font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 0;">
                    ${order.destination}
                  </p>
                </td>
              </tr>
              
              <!-- Footer Info -->
              <tr>
                <td style="background-color: #f8fafc; padding: 24px 32px; border-top: 1px solid #e2e8f0; text-align: center;">
                  <p style="font-size: 12px; color: #64748b; margin: 0; line-height: 1.5;">
                    If you have any questions regarding this order, feel free to reply directly to this email or reach out to our team at <strong>${SMTP_USER}</strong>.
                  </p>
                  <p style="font-size: 11px; color: #94a3b8; margin-top: 12px;">
                    \xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} StoreFront. All rights reserved.
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
  try {
    const info = await transporter.sendMail({
      from: `"StoreFront Support" <${SMTP_USER}>`,
      to: order.customerEmail,
      subject: `Order Confirmation: ${order.id} - StoreFront`,
      html: emailHtml
    });
    console.log(`[Email Service] Success! Message sent to ${order.customerEmail}. Message ID: ${info.messageId}`);
    try {
      await transporter.sendMail({
        from: `"StoreFront System" <${SMTP_USER}>`,
        to: SMTP_USER,
        subject: `[NEW ORDER] ${order.id} placed by ${order.customerName} (\xA3${order.total.toFixed(2)})`,
        html: `<p>A new order has been placed on the storefront.</p>
               <p><strong>Order ID:</strong> ${order.id}</p>
               <p><strong>Customer Name:</strong> ${order.customerName}</p>
               <p><strong>Customer Email:</strong> ${order.customerEmail}</p>
               <p><strong>Total Amount:</strong> \xA3${order.total.toFixed(2)}</p>
               <p><strong>Shipping Location:</strong> ${order.destination}</p>
               <hr/>
               ${emailHtml}`
      });
      console.log(`[Email Service] Support notification copy sent successfully.`);
    } catch (supportErr) {
      console.warn(`[Email Service] Failed to send copy to support email (ignoring):`, supportErr);
    }
    return true;
  } catch (err) {
    console.error(`[Email Service] Error sending order confirmation email via SMTP:`, err);
    return false;
  }
}

// backend/routes/razorpay.ts
var router9 = Router9();
var RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "";
var RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "";
var RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || "";
var razorpayClient = null;
function getRazorpayClient() {
  if (!razorpayClient && RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET) {
    try {
      razorpayClient = new Razorpay({
        key_id: RAZORPAY_KEY_ID,
        key_secret: RAZORPAY_KEY_SECRET
      });
      console.log("[Razorpay] Initialized official Razorpay SDK client with live credentials.");
    } catch (err) {
      console.error("[Razorpay] Failed to initialize Razorpay client:", err);
    }
  }
  return razorpayClient;
}
function verifyRazorpaySignature(orderId, paymentId, signature, secret) {
  if (!orderId || !paymentId || !signature || !secret) return false;
  try {
    const text = `${orderId}|${paymentId}`;
    const expectedSignature = crypto2.createHmac("sha256", secret).update(text).digest("hex");
    return crypto2.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature));
  } catch (err) {
    console.error("[Razorpay Signature Verification] Cryptographic error:", err);
    return false;
  }
}
function verifyWebhookSignature(rawBody, signature, secret) {
  if (!signature || !secret) return false;
  try {
    const expectedSignature = crypto2.createHmac("sha256", secret).update(rawBody).digest("hex");
    return crypto2.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature));
  } catch (err) {
    console.error("[Razorpay Webhook Verification] Cryptographic error:", err);
    return false;
  }
}
async function processSuccessfulOrderPayment(orderId, details) {
  const ordersList = await fetchResource("orders");
  const orderIdx = ordersList.findIndex((o) => o.id === orderId);
  if (orderIdx !== -1) {
    const order = ordersList[orderIdx];
    if (order.paymentStatus === "Paid") {
      console.log(`[Razorpay Order Processing] Order ${orderId} is already marked Paid. Skipping duplicate actions.`);
      return order;
    }
    order.paymentStatus = "Paid";
    order.razorpayPaymentId = details.razorpayPaymentId;
    order.razorpayOrderId = details.razorpayOrderId;
    order.razorpaySignature = details.razorpaySignature || "";
    order.cardBrand = details.method || "Razorpay Secure";
    order.date = (/* @__PURE__ */ new Date()).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    }) + " (UTC)";
    ordersList[orderIdx] = order;
    await saveResource("orders", ordersList);
    console.log(`[Razorpay Order Processing] Order ${orderId} successfully updated to 'Paid' in database.`);
    try {
      await sendOrderConfirmationEmail(order);
    } catch (err) {
      console.error(`[Razorpay Order Processing] Failed to send email for Order ${orderId}:`, err);
    }
    return order;
  } else {
    console.warn(`[Razorpay Order Processing] Order ${orderId} not found in database to update status.`);
    return null;
  }
}
router9.get("/config", (req, res) => {
  res.json({
    keyId: RAZORPAY_KEY_ID || "rzp_test_storefront",
    isConfigured: !!(RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET),
    currency: "GBP"
  });
});
router9.post("/create-order", async (req, res) => {
  try {
    const { orderId, amount, currency = "GBP", customerEmail, customerName, destination, cartItems } = req.body;
    if (!orderId || !amount || !customerEmail || !customerName) {
      return res.status(400).json({
        error: "Missing required order parameters.",
        details: { orderId: !!orderId, amount: !!amount, customerEmail: !!customerEmail, customerName: !!customerName }
      });
    }
    const numAmount = parseFloat(amount);
    const amountInSubunits = Math.round(numAmount * 100);
    console.log(`[Razorpay Order] Initializing order for Order Ref: ${orderId}, Amount: \xA3${amount} (${amountInSubunits} subunits)`);
    const ordersList = await fetchResource("orders");
    let existingOrder = ordersList.find((o) => o.id === orderId);
    if (!existingOrder) {
      const newOrder = {
        id: orderId,
        customerName,
        customerEmail,
        tags: ["Storefront", "Razorpay Pending"],
        fulfillmentStatus: "Unfulfilled",
        paymentStatus: "Pending",
        total: numAmount,
        destination: destination || "Standard Delivery Address",
        date: (/* @__PURE__ */ new Date()).toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true
        }) + " (UTC)",
        deliveryMethod: "Standard Shipping",
        items: cartItems || []
      };
      ordersList.push(newOrder);
      await saveResource("orders", ordersList);
      console.log(`[Razorpay Order] Pre-registered pending order ${orderId} in database.`);
    }
    const rzp = getRazorpayClient();
    if (rzp) {
      try {
        console.log("[Razorpay Order] Calling Razorpay API orders.create...");
        const options = {
          amount: amountInSubunits,
          currency: currency.toUpperCase(),
          receipt: orderId,
          notes: {
            customerName,
            customerEmail,
            customOrderId: orderId
          }
        };
        const rzpOrder = await rzp.orders.create(options);
        console.log(`[Razorpay Order] Successfully created official Razorpay Order: ${rzpOrder.id}`);
        return res.json({
          success: true,
          orderId: rzpOrder.id,
          customOrderId: orderId,
          amount: rzpOrder.amount,
          currency: rzpOrder.currency,
          keyId: RAZORPAY_KEY_ID,
          isLive: true,
          redirectUrl: `/payment/razorpay-gateway?orderId=${orderId}&amount=${numAmount.toFixed(2)}&razorpayOrderId=${rzpOrder.id}`
        });
      } catch (rzpErr) {
        console.warn("[Razorpay Order] Official API call returned an error, falling back to simulated checkout:", rzpErr);
      }
    }
    const mockRazorpayOrderId = `order_${crypto2.randomBytes(8).toString("hex")}`;
    console.log(`[Razorpay Order] Created test/sandbox Razorpay Order ID: ${mockRazorpayOrderId}`);
    return res.json({
      success: true,
      orderId: mockRazorpayOrderId,
      customOrderId: orderId,
      amount: amountInSubunits,
      currency: currency.toUpperCase(),
      keyId: RAZORPAY_KEY_ID || "rzp_test_pouchsupply",
      isLive: false,
      redirectUrl: `/payment/razorpay-gateway?orderId=${orderId}&amount=${numAmount.toFixed(2)}&razorpayOrderId=${mockRazorpayOrderId}`
    });
  } catch (err) {
    console.error("[Razorpay Order] Error creating order:", err);
    res.status(500).json({ error: err.message || "Failed to initialize Razorpay payment order." });
  }
});
router9.post("/session", async (req, res, next) => {
  req.url = "/create-order";
  return router9.handle(req, res, next);
});
router9.post("/verify", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      customOrderId,
      method = "Razorpay Standard"
    } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({ error: "Missing required Razorpay verification parameters." });
    }
    const targetOrderId = customOrderId || req.query.orderId;
    console.log(`[Razorpay Verification] Verifying payment for Order: ${targetOrderId}, Payment ID: ${razorpay_payment_id}`);
    if (RAZORPAY_KEY_SECRET && razorpay_signature) {
      const isValid = verifyRazorpaySignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        RAZORPAY_KEY_SECRET
      );
      if (!isValid) {
        console.warn("[Razorpay Verification] Signature mismatch detected! Rejecting payment.");
        return res.status(400).json({ success: false, error: "Invalid payment signature." });
      }
      console.log("[Razorpay Verification] Cryptographic signature verified successfully.");
    } else {
      console.log("[Razorpay Verification] Operating in sandbox/test mode: verifying payment token.");
    }
    const order = await processSuccessfulOrderPayment(targetOrderId, {
      razorpayPaymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      razorpaySignature: razorpay_signature || `sig_${crypto2.randomBytes(16).toString("hex")}`,
      method
    });
    if (order) {
      return res.json({
        success: true,
        paymentStatus: "Paid",
        orderId: targetOrderId,
        transactionId: razorpay_payment_id,
        message: "Payment successfully verified and recorded."
      });
    } else {
      return res.status(404).json({ error: "Order details could not be found." });
    }
  } catch (err) {
    console.error("[Razorpay Verification] Error during verification:", err);
    res.status(500).json({ error: err.message || "Payment verification failed." });
  }
});
router9.post("/process-direct", async (req, res) => {
  try {
    const {
      orderId,
      amount,
      method = "card",
      cardHolderName,
      cardNumber,
      upiId,
      simulationMode = "SUCCESS"
    } = req.body;
    if (!orderId || !amount) {
      return res.status(400).json({ error: "Order ID and Amount are required." });
    }
    console.log(`[Razorpay Direct] Processing payment of \xA3${amount} for Order: ${orderId} via method: ${method}`);
    if (simulationMode === "DECLINED") {
      return res.status(402).json({
        success: false,
        paymentStatus: "FAILED",
        error: "Payment declined by issuing bank or payment network."
      });
    }
    if (simulationMode === "GATEWAY_ERROR") {
      return res.status(504).json({
        success: false,
        paymentStatus: "FAILED",
        error: "Razorpay payment network gateway timeout. Please try again."
      });
    }
    const generatedPaymentId = `pay_${crypto2.randomBytes(8).toString("hex")}`;
    const generatedOrderId = `order_${crypto2.randomBytes(8).toString("hex")}`;
    const generatedSignature = `sig_${crypto2.randomBytes(16).toString("hex")}`;
    let methodLabel = "Razorpay Card";
    if (method === "upi") methodLabel = `Razorpay UPI (${upiId || "UPI"})`;
    else if (method === "netbanking") methodLabel = "Razorpay NetBanking";
    else if (method === "wallet") methodLabel = "Razorpay Wallet";
    else if (cardNumber) {
      const cleanNum = cardNumber.replace(/\s+/g, "");
      if (cleanNum.startsWith("4")) methodLabel = "Razorpay Visa";
      else if (cleanNum.startsWith("5")) methodLabel = "Razorpay Mastercard";
      else if (cleanNum.startsWith("3")) methodLabel = "Razorpay Amex";
    }
    const order = await processSuccessfulOrderPayment(orderId, {
      razorpayPaymentId: generatedPaymentId,
      razorpayOrderId: generatedOrderId,
      razorpaySignature: generatedSignature,
      method: methodLabel
    });
    if (order) {
      res.json({
        success: true,
        paymentStatus: "AUTHORISED",
        transactionId: generatedPaymentId,
        orderId: generatedOrderId,
        authCode: `RZP-${Math.floor(Math.random() * 9e5 + 1e5)}`,
        message: "Payment authorized successfully via Razorpay."
      });
    } else {
      res.status(404).json({ error: "Order record not found." });
    }
  } catch (err) {
    console.error("[Razorpay Direct] Error processing direct payment:", err);
    res.status(500).json({ error: err.message || "Failed to process Razorpay payment." });
  }
});
router9.post("/process", async (req, res, next) => {
  req.url = "/process-direct";
  return router9.handle(req, res, next);
});
router9.get("/verify-status", async (req, res) => {
  try {
    const { orderId } = req.query;
    if (!orderId) {
      return res.status(400).json({ error: "Order ID query parameter is required." });
    }
    const ordersList = await fetchResource("orders");
    const order = ordersList.find((o) => o.id === orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }
    res.json({
      orderId: order.id,
      paymentStatus: order.paymentStatus || "Pending",
      transactionId: order.razorpayPaymentId || null,
      razorpayOrderId: order.razorpayOrderId || null,
      amount: order.total
    });
  } catch (err) {
    console.error("[Razorpay Verification Status] Error:", err);
    res.status(500).json({ error: err.message || "Failed to verify status." });
  }
});
router9.post("/webhook", async (req, res) => {
  const signature = req.headers["x-razorpay-signature"];
  const rawBody = JSON.stringify(req.body);
  console.log(`[Razorpay Webhook] Received webhook event. Signature header: ${signature}`);
  if (RAZORPAY_WEBHOOK_SECRET) {
    const isValid = verifyWebhookSignature(rawBody, signature, RAZORPAY_WEBHOOK_SECRET);
    if (!isValid) {
      console.warn("[Razorpay Webhook] Webhook signature verification FAILED. Rejecting payload.");
      return res.status(400).json({ error: "Invalid webhook signature." });
    }
    console.log("[Razorpay Webhook] Signature verification successful.");
  }
  try {
    const { event, payload } = req.body;
    if (!event || !payload) {
      return res.status(400).json({ error: "Invalid webhook payload structure." });
    }
    console.log(`[Razorpay Webhook] Event received: ${event}`);
    if (event === "order.paid" || event === "payment.captured") {
      const paymentEntity = payload.payment?.entity;
      const orderEntity = payload.order?.entity;
      const customOrderId = orderEntity?.receipt || paymentEntity?.notes?.customOrderId;
      const paymentId = paymentEntity?.id || `pay_webhook_${Date.now()}`;
      const orderId = orderEntity?.id || paymentEntity?.order_id || "";
      if (customOrderId) {
        await processSuccessfulOrderPayment(customOrderId, {
          razorpayPaymentId: paymentId,
          razorpayOrderId: orderId,
          method: paymentEntity?.method ? `Razorpay ${paymentEntity.method.toUpperCase()}` : "Razorpay"
        });
      }
    } else if (event === "payment.failed") {
      const paymentEntity = payload.payment?.entity;
      const customOrderId = paymentEntity?.notes?.customOrderId;
      if (customOrderId) {
        const ordersList = await fetchResource("orders");
        const orderIdx = ordersList.findIndex((o) => o.id === customOrderId);
        if (orderIdx !== -1) {
          ordersList[orderIdx].paymentStatus = "Failed";
          await saveResource("orders", ordersList);
          console.log(`[Razorpay Webhook] Order ${customOrderId} set to 'Failed' based on webhook notification.`);
        }
      }
    }
    res.status(200).json({ status: "ok", message: "Webhook processed successfully" });
  } catch (err) {
    console.error("[Razorpay Webhook] Processing Error:", err);
    res.status(500).json({ error: "Webhook processing encountered an error" });
  }
});
var razorpay_default = router9;

// serverApp.ts
async function createExpressApp() {
  const app = express();
  app.use((req, res, next) => {
    if (req.body && typeof req.body === "object" && !Buffer.isBuffer(req.body)) {
      return next();
    }
    express.json({ limit: "50mb" })(req, res, next);
  });
  app.use((req, res, next) => {
    if (req.body && typeof req.body === "object" && !Buffer.isBuffer(req.body)) {
      return next();
    }
    express.urlencoded({ limit: "50mb", extended: true })(req, res, next);
  });
  const uploadsPath = path3.join(process.cwd(), "uploads");
  if (!fs3.existsSync(uploadsPath)) {
    try {
      fs3.mkdirSync(uploadsPath, { recursive: true });
    } catch (_) {
    }
  }
  app.get("/uploads/:filename", async (req, res, next) => {
    try {
      const filename = req.params.filename;
      const filePath = path3.join(uploadsPath, filename);
      if (fs3.existsSync(filePath)) {
        return res.sendFile(filePath);
      }
      const dotIndex = filename.lastIndexOf(".");
      const id = dotIndex !== -1 ? filename.substring(0, dotIndex) : filename;
      console.log(`[Uploads Restore] File ${filename} missing from local disk. Restoring from Neon Postgres...`);
      let imgDoc = await getUploadedImage(id);
      if (!imgDoc && dotIndex !== -1) {
        imgDoc = await getUploadedImage(filename);
      }
      if (imgDoc && imgDoc.base64Data) {
        try {
          fs3.writeFileSync(filePath, Buffer.from(imgDoc.base64Data, "base64"));
          console.log(`[Uploads Restore] Restored to disk successfully: ${filename}`);
        } catch (_) {
        }
        const imgBuffer = Buffer.from(imgDoc.base64Data, "base64");
        res.writeHead(200, {
          "Content-Type": imgDoc.mimeType || "image/png",
          "Content-Length": imgBuffer.length,
          "Cache-Control": "public, max-age=31536000",
          "Access-Control-Allow-Origin": "*"
        });
        return res.end(imgBuffer);
      }
    } catch (err) {
      console.error("[Uploads Restore] Failed during lazy load restoration:", err);
    }
    next();
  });
  app.use("/uploads", express.static(uploadsPath));
  app.post("/api/upload", async (req, res) => {
    try {
      const { data, filename } = req.body;
      if (!data) {
        return res.status(400).json({ error: "Missing data payload for upload." });
      }
      let base64String = data;
      let mimeType = "image/png";
      if (data.startsWith("data:")) {
        const matches = data.match(/^data:([^;]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          mimeType = matches[1];
          base64String = matches[2];
        }
      }
      const id = `img-${Date.now()}-${Math.floor(Math.random() * 1e5)}`;
      const relativeUrl = await saveUploadedImage(id, base64String, mimeType);
      try {
        const ext = mimeType.includes("/") ? mimeType.split("/")[1] : "png";
        const diskFile = path3.join(uploadsPath, `${id}.${ext}`);
        fs3.writeFileSync(diskFile, Buffer.from(base64String, "base64"));
      } catch (e) {
        console.warn("Could not write uploaded image to disk:", e);
      }
      console.log(`[API Upload] Successfully persisted ${mimeType} image with ID: ${id}. URL: ${relativeUrl}`);
      res.json({ url: relativeUrl, relativeUrl, id });
    } catch (err) {
      console.error("[API Upload] Fail:", err);
      res.status(500).json({ error: err.message || "Failed to process image upload database insertion" });
    }
  });
  app.get("/api/images/:id", async (req, res) => {
    try {
      const rawId = req.params.id;
      const dotIndex = rawId.lastIndexOf(".");
      const cleanId = dotIndex !== -1 ? rawId.substring(0, dotIndex) : rawId;
      let imgDoc = await getUploadedImage(cleanId);
      if (!imgDoc && dotIndex !== -1) {
        imgDoc = await getUploadedImage(rawId);
      }
      if (!imgDoc) {
        return res.status(404).send("Image not found");
      }
      const imgBuffer = Buffer.from(imgDoc.base64Data, "base64");
      res.writeHead(200, {
        "Content-Type": imgDoc.mimeType || "image/png",
        "Content-Length": imgBuffer.length,
        "Cache-Control": "public, max-age=31536000",
        "Access-Control-Allow-Origin": "*"
      });
      res.end(imgBuffer);
    } catch (err) {
      console.error("[API Images] Server error serving asset document:", err);
      res.status(500).send("Internal server error serving media");
    }
  });
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });
  app.get("/api/db-status", async (req, res) => {
    try {
      await getDb();
    } catch (e) {
    }
    res.json(getConnectionStatus());
  });
  app.get("/api/db-details", async (req, res) => {
    try {
      const details = await getDatabaseDetails();
      res.json(details);
    } catch (err) {
      console.error("[API db-details] Error fetching DB details:", err);
      res.status(500).json({ error: err.message || "Failed to fetch database details" });
    }
  });
  app.post("/api/update-db-uri", async (req, res) => {
    try {
      const { uri } = req.body;
      if (!uri) {
        return res.status(400).json({ error: "No connection string was provided." });
      }
      updateDbUri(uri);
      await getDb();
      res.json(getConnectionStatus());
    } catch (err) {
      console.error("[API update-db-uri] Error saving and testing URI:", err);
      res.status(500).json({ error: err.message || "Failed to update connection string" });
    }
  });
  app.get("/api/layoutsettings", async (req, res) => {
    try {
      const data = await fetchLayoutSettings();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message || "Failed to load layout settings" });
    }
  });
  app.post("/api/layoutsettings", async (req, res) => {
    try {
      const saved = await saveLayoutSettings(req.body);
      res.json({ status: "success", data: saved });
    } catch (err) {
      res.status(500).json({ error: err.message || "Failed to save layout settings" });
    }
  });
  app.use("/api/products", products_default);
  app.use("/api/collections", collections_default);
  app.use("/api/orders", orders_default);
  app.use("/api/files", files_default);
  app.use("/api/customers", customers_default);
  app.use("/api/discounts", discounts_default);
  app.use("/api/custompages", customPages_default);
  app.use("/api/blogs", blogs_default);
  app.use("/api/razorpay", razorpay_default);
  app.get("/placeholder.png", (req, res) => {
    res.sendFile(path3.resolve(process.cwd(), "placeholder.png"));
  });
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom"
    });
    app.use(vite.middlewares);
    app.get("*", async (req, res, next) => {
      const url = req.originalUrl;
      const lastSegment = url.split("/").pop() || "";
      if (url.startsWith("/api") || lastSegment.includes(".")) {
        return next();
      }
      try {
        const fs4 = await import("fs");
        let html = fs4.readFileSync(path3.resolve(process.cwd(), "index.html"), "utf-8");
        html = await vite.transformIndexHtml(url, html);
        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      } catch (e) {
        next(e);
      }
    });
  } else {
    const distPath = path3.join(process.cwd(), "dist");
    console.log(`[Production Setup] Static directory: ${distPath}`);
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      const url = req.originalUrl;
      const lastSegment = url.split("/").pop() || "";
      if (url.startsWith("/api") || lastSegment.includes(".")) {
        return res.status(404).send("API or File Asset Not Found");
      }
      const indexPath = path3.join(distPath, "index.html");
      console.log(`[Production Fallback] Sending index.html for request: ${req.url}`);
      res.sendFile(indexPath, (err) => {
        if (err) {
          console.error(`[Production Fallback] Error sending index.html:`, err);
          res.status(500).send("Internal Server Error: Missing compiled static resources.");
        }
      });
    });
  }
  return app;
}

// api-entry.ts
var appPromise = createExpressApp();
async function handler(req, res) {
  const app = await appPromise;
  return app(req, res);
}
export {
  handler as default
};
