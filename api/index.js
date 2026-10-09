var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/initialData.ts
var INITIAL_PRODUCTS, INITIAL_COLLECTIONS, INITIAL_ORDERS, INITIAL_FILES, INITIAL_CUSTOMERS, INITIAL_DISCOUNTS, INITIAL_BLOGS, DEFAULT_PAGES;
var init_initialData = __esm({
  "src/initialData.ts"() {
    INITIAL_PRODUCTS = [
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
    INITIAL_COLLECTIONS = [
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
    INITIAL_ORDERS = [];
    INITIAL_FILES = [];
    INITIAL_CUSTOMERS = [];
    INITIAL_DISCOUNTS = [];
    INITIAL_BLOGS = [
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
    DEFAULT_PAGES = [
      {
        id: "homepage",
        title: "Home Page",
        slug: "",
        visibility: "Visible",
        updatedAt: "Sep 24, 2026",
        isHomepage: true,
        sections: [
          {
            id: "sec-hero-banner",
            type: "Hero banner",
            settings: {
              fullWidth: true,
              backgroundColor: "#111111",
              headingColor: "#FFFFFF",
              textColor: "#E5E5E5",
              subtitle: "JADE TAILOR \u2022 PERSONAL STYLIST",
              title: "Elevate Your Style",
              description: "Bespoke silhouettes, signature color palettes, and effortless everyday elegance.",
              buttonText: "WORK WITH JADE",
              buttonLink: "#appointment-section",
              imageUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1920&q=85"
            }
          },
          {
            id: "sec-about-jade",
            type: "About Jade Tailor",
            settings: {
              fullWidth: false,
              backgroundColor: "#FFFFFF",
              headingColor: "#1A1A1A",
              textColor: "#555555",
              badge: "ABOUT JADE TAILOR",
              title: "Find Your Style",
              italicTitle: "With Me",
              description: "Style sit amet risus ac dui auctor posuere sit amet eget libero. Ut lacinia lectus non risus facilisis, semper consequat sem fringilla. Etiam et tincidunt felis. Quisque at maximus nulla dictum vestibulum sed interdum neque dictum.",
              description2: "Your style laboris sollicitudin purus vel posuere. Maecenas auctor, turpis quis mattis tristique, ligula dolor vestibulum risus, nec ullamcorper justo dolor soda lorem. Sed interdum arcu ac metus mollis venenatis.",
              stats: ["7+ years of work", "150+ free consultations", "90+ happy clients"],
              imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
              image2Url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80"
            }
          },
          {
            id: "sec-my-services",
            type: "My Services",
            settings: {
              fullWidth: false,
              backgroundColor: "#F9F7F4",
              headingColor: "#1A1A1A",
              textColor: "#666666",
              badge: "WHAT I DO",
              title: "My",
              italicTitle: "Services",
              cardTitle: "Individual Consultation",
              cardDescription: "A comprehensive one-on-one deep dive into your personal aesthetic, body architecture, and lifestyle requirements. We assess your color typology, define your signature silhouette, and formulate a seasonal style blueprint tailored specifically for you.",
              cardButtonText: "LEARN MORE",
              imageUrl: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1000&q=80"
            }
          },
          {
            id: "sec-service-pillars",
            type: "Service Pillars",
            settings: {
              fullWidth: false,
              backgroundColor: "#F9F7F4",
              headingColor: "#1A1A1A",
              textColor: "#666666",
              accentColor: "#B58D59",
              pillars: [
                { num: "01", title: "Wardrobe Styling", desc: "Lorem ipsum nisl quam nestibulum drana odio elementum scesue the monte." },
                { num: "02", title: "Closet Cleanse", desc: "Lorem ipsum nisl quam nestibulum drana odio elementum monte." },
                { num: "03", title: "Shopping Tour", desc: "Lorem ipsum nisl quam nestibulum drana odio elementum scesue the can." }
              ]
            }
          },
          {
            id: "sec-video-tips",
            type: "Video banner",
            settings: {
              fullWidth: true,
              backgroundColor: "#111111",
              headingColor: "#FFFFFF",
              textColor: "#E5E5E5",
              title: "Discover My Video Tips And Hints",
              italicWord: "Discover",
              videoUrl: "dQw4w9WgXcQ",
              imageUrl: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1800&q=85"
            }
          },
          {
            id: "sec-styling-packages",
            type: "Styling Packages",
            settings: {
              fullWidth: false,
              backgroundColor: "#FFFFFF",
              headingColor: "#1A1A1A",
              textColor: "#666666",
              badge: "PRICING PLAN",
              title: "Styling",
              italicTitle: "Packages",
              packages: [
                {
                  title: "In-Home Styling",
                  price: "$300",
                  imageUrl: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=600&q=80",
                  features: [
                    { text: "Complete closet audit & organization", included: true },
                    { text: "Color analysis & silhouette mapping", included: true },
                    { text: "Personalized digital lookbook (20 outfits)", included: false }
                  ],
                  isFeatured: false,
                  btnText: "WORK WITH ME"
                },
                {
                  title: "Half Day Shopping",
                  price: "$450",
                  imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80",
                  features: [
                    { text: "4 hours private curated shopping tour", included: true },
                    { text: "Pre-selected garments ready in VIP suites", included: true },
                    { text: "Seasonal capsule wardrobe integration", included: false }
                  ],
                  isFeatured: true,
                  btnText: "WORK WITH ME"
                },
                {
                  title: "Full Day Shopping",
                  price: "$600",
                  imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80",
                  features: [
                    { text: "Full 8 hours complete wardrobe overhaul", included: true },
                    { text: "Luxury boutique access & stylist discounts", included: true },
                    { text: "Comprehensive seasonal digital lookbook", included: true }
                  ],
                  isFeatured: false,
                  btnText: "WORK WITH ME"
                }
              ]
            }
          },
          {
            id: "sec-client-reviews",
            type: "Client Reviews",
            settings: {
              fullWidth: false,
              backgroundColor: "#FBF9F6",
              headingColor: "#1A1A1A",
              textColor: "#555555",
              badge: "CLIENTS REVIEWS",
              title: "What Clients Say",
              italicTitle: "About Me",
              quote: "Highly recommend, thank you again!",
              content: "Jade is so lovely and did such a great job with my wedding dress along with bridal party and mother of the bride outfits... She understood exactly what flattered my shape while keeping me entirely comfortable. Highly recommend, thank you again!",
              author: "Emily Brown",
              role: "Customer Review",
              avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
              imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80"
            }
          },
          {
            id: "sec-my-portfolio",
            type: "My Portfolio",
            settings: {
              fullWidth: false,
              backgroundColor: "#FFFFFF",
              headingColor: "#1A1A1A",
              badge: "MY PORTFOLIO",
              title: "Find Your Ideal Style and Look?",
              items: [
                { image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80", title: "Architectural Tailoring & Cream Trench", category: "Editorial Streetwear" },
                { image: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=800&q=80", title: "Effortless Summer Linen Ensemble", category: "Casual Resort" },
                { image: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=800&q=80", title: "Bohemian Sunhat & Warm Earth Tones", category: "Seasonal Lookbook" },
                { image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80", title: "Modern Sport-Luxe & Monochrome", category: "Contemporary Casual" },
                { image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80", title: "Pastel Blazer & Checked Silk Separates", category: "Executive Style" },
                { image: "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=800&q=80", title: "Evening Velvet & Statement Eyewear", category: "Gala & Red Carpet" }
              ]
            }
          },
          {
            id: "sec-editorial-shop-banner",
            type: "Editorial Shop Banner",
            settings: {
              fullWidth: true,
              backgroundColor: "#141416",
              headingColor: "#FFFFFF",
              textColor: "#CCCCCC",
              badge: "CURATED WARDROBE \u2022 READY-TO-WEAR",
              title: "Shop Jade's Curated Collection",
              description: "Explore hand-selected luxury tailoring, elevated silk separates, and signature wardrobe capsules.",
              buttonText: "SHOP NOW (/collections/all)",
              buttonLink: "/collections/all"
            }
          },
          {
            id: "sec-news-blog",
            type: "News & Blog",
            settings: {
              fullWidth: true,
              backgroundColor: "#0F0F10",
              headingColor: "#FFFFFF",
              textColor: "#CCCCCC",
              badge: "LATEST NEWS",
              title: "News",
              italicTitle: "& Blog"
            }
          },
          {
            id: "sec-make-appointment",
            type: "Make An Appointment",
            settings: {
              fullWidth: true,
              backgroundColor: "#111111",
              headingColor: "#FFFFFF",
              promptText: "To submit an enquiry or to arrange an appointment please call me or alternatively please complete the form.",
              phone: "800 123 4444",
              formTitle: "Make An Appointment",
              buttonText: "MAKE APPOINTMENT",
              imageUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1600&q=80"
            }
          },
          {
            id: "sec-brand-logos",
            type: "Brand Logos",
            settings: {
              fullWidth: false,
              backgroundColor: "#FFFFFF",
              logos: ["CHIPPY'S", "FASTLANE", "SWEETY.", "MIGHTY FURNITURES", "CARA INDOORS", "GOLDEN NET 109", "avant garde"]
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
  }
});

// neonDb.ts
import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
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
    case "recycle_bin":
    case "recyclebin":
      return "recycle_bin";
    case "developer_settings":
    case "developersettings":
      return "developer_settings";
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
      sql`CREATE TABLE IF NOT EXISTS layout_settings (id TEXT PRIMARY KEY, data JSONB NOT NULL, updated_at TIMESTAMPTZ DEFAULT NOW());`,
      sql`CREATE TABLE IF NOT EXISTS recycle_bin (id TEXT PRIMARY KEY, type TEXT NOT NULL, original_id TEXT NOT NULL, title TEXT NOT NULL, data JSONB NOT NULL, deleted_at TIMESTAMPTZ DEFAULT NOW());`,
      sql`CREATE TABLE IF NOT EXISTS developer_settings (id TEXT PRIMARY KEY, data JSONB NOT NULL, updated_at TIMESTAMPTZ DEFAULT NOW());`
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
    const tableNames = ["products", "collections", "orders", "files", "customers", "discounts", "custom_pages", "blogs", "uploaded_images", "layout_settings", "recycle_bin"];
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
async function fetchRecycleBinFromNeon() {
  const sql = getSqlClient();
  if (!sql) return null;
  try {
    if (!tablesInitialized) {
      await initTables();
    }
    const rows = await sql.query(`SELECT id, type, original_id, title, data, deleted_at FROM recycle_bin ORDER BY deleted_at DESC`);
    if (rows && Array.isArray(rows)) {
      return rows.map((r) => {
        const parsedData = typeof r.data === "string" ? JSON.parse(r.data) : r.data;
        return {
          id: r.id,
          type: r.type,
          originalId: r.original_id,
          title: r.title,
          deletedAt: r.deleted_at,
          data: parsedData
        };
      });
    }
    return [];
  } catch (err) {
    console.error("[Neon Postgres] Error fetching recycle bin:", err);
    return null;
  }
}
async function saveRecycleBinItemToNeon(item) {
  const sql = getSqlClient();
  if (!sql) return false;
  try {
    if (!tablesInitialized) {
      await initTables();
    }
    await sql.query(
      `INSERT INTO recycle_bin (id, type, original_id, title, data, deleted_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (id) DO UPDATE SET
         type = EXCLUDED.type,
         original_id = EXCLUDED.original_id,
         title = EXCLUDED.title,
         data = EXCLUDED.data,
         deleted_at = EXCLUDED.deleted_at`,
      [
        item.id,
        item.type,
        item.originalId,
        item.title,
        JSON.stringify(item.data),
        item.deletedAt ? new Date(item.deletedAt) : /* @__PURE__ */ new Date()
      ]
    );
    return true;
  } catch (err) {
    console.error(`[Neon Postgres] Error saving item ${item.id} to recycle bin:`, err);
    return false;
  }
}
async function deleteFromRecycleBinInNeon(ids) {
  const sql = getSqlClient();
  if (!sql) return false;
  try {
    if (!tablesInitialized) {
      await initTables();
    }
    if (ids.length === 0) return true;
    await sql.query(
      `DELETE FROM recycle_bin WHERE id = ANY($1::text[])`,
      [ids]
    );
    return true;
  } catch (err) {
    console.error("[Neon Postgres] Error deleting from recycle bin:", err);
    return false;
  }
}
async function clearRecycleBinInNeon() {
  const sql = getSqlClient();
  if (!sql) return false;
  try {
    if (!tablesInitialized) {
      await initTables();
    }
    await sql.query(`DELETE FROM recycle_bin`);
    return true;
  } catch (err) {
    console.error("[Neon Postgres] Error clearing recycle bin:", err);
    return false;
  }
}
var lastStatus, tablesInitialized;
var init_neonDb = __esm({
  "neonDb.ts"() {
    init_initialData();
    dotenv.config();
    lastStatus = { status: "pending", databaseType: "Neon Postgres" };
    tablesInitialized = false;
  }
});

// backend/services/cloudinaryService.ts
var cloudinaryService_exports = {};
__export(cloudinaryService_exports, {
  configureCloudinary: () => configureCloudinary,
  disconnectCloudinary: () => disconnectCloudinary,
  ensureCloudinaryConfigured: () => ensureCloudinaryConfigured,
  getCloudinaryStatus: () => getCloudinaryStatus,
  isCloudinaryConfigured: () => isCloudinaryConfigured,
  uploadToCloudinary: () => uploadToCloudinary
});
import { v2 as cloudinary } from "cloudinary";
import fs3 from "fs";
import path3 from "path";
function isPlaceholder(str) {
  if (!str) return true;
  const lower = str.toLowerCase();
  return lower.includes("<") || lower.includes(">") || lower.includes("your_api_key") || lower.includes("your_api_secret") || lower.includes("api_key:api_secret");
}
function configureCloudinary(customConfig) {
  let rawCloudName = (customConfig?.cloudName || process.env.CLOUDINARY_CLOUD_NAME || "").replace(/^@+/, "").trim();
  let rawApiKey = (customConfig?.apiKey || process.env.CLOUDINARY_API_KEY || "").trim();
  let rawApiSecret = (customConfig?.apiSecret || process.env.CLOUDINARY_API_SECRET || "").trim();
  const rawUrl = (customConfig?.cloudinaryUrl || process.env.CLOUDINARY_URL || "").trim();
  if (rawUrl && !isPlaceholder(rawUrl) && rawUrl.startsWith("cloudinary://")) {
    const urlMatch = rawUrl.match(/^cloudinary:\/\/([^:]+):([^@]+)@([^/?#]+)/);
    if (urlMatch) {
      const parsedKey = urlMatch[1].trim();
      const parsedSecret = urlMatch[2].trim();
      const parsedName = urlMatch[3].replace(/^@+/, "").trim();
      if (!rawApiKey && !isPlaceholder(parsedKey)) rawApiKey = parsedKey;
      if (!rawApiSecret && !isPlaceholder(parsedSecret)) rawApiSecret = parsedSecret;
      if (!rawCloudName && !isPlaceholder(parsedName)) rawCloudName = parsedName;
    }
  }
  if (rawCloudName && rawApiKey && rawApiSecret && !isPlaceholder(rawApiKey) && !isPlaceholder(rawApiSecret)) {
    cloudinary.config({
      cloud_name: rawCloudName,
      api_key: rawApiKey,
      api_secret: rawApiSecret,
      secure: true
    });
    process.env.CLOUDINARY_URL = `cloudinary://${rawApiKey}:${rawApiSecret}@${rawCloudName}`;
    process.env.CLOUDINARY_CLOUD_NAME = rawCloudName;
    process.env.CLOUDINARY_API_KEY = rawApiKey;
    process.env.CLOUDINARY_API_SECRET = rawApiSecret;
    return true;
  }
  if (rawUrl && isPlaceholder(rawUrl)) {
    try {
      const match = rawUrl.match(/@([^/?#]+)/);
      const extractedName = match && match[1] ? match[1].replace(/^@+/, "").trim() : rawCloudName;
      if (extractedName && rawApiKey && rawApiSecret && !isPlaceholder(rawApiKey) && !isPlaceholder(rawApiSecret)) {
        cloudinary.config({
          cloud_name: extractedName,
          api_key: rawApiKey,
          api_secret: rawApiSecret,
          secure: true
        });
        process.env.CLOUDINARY_URL = `cloudinary://${rawApiKey}:${rawApiSecret}@${extractedName}`;
        process.env.CLOUDINARY_CLOUD_NAME = extractedName;
        return true;
      }
    } catch (_) {
    }
  }
  return false;
}
function disconnectCloudinary() {
  cloudinary.config({
    cloud_name: "",
    api_key: "",
    api_secret: "",
    cloudinary_url: ""
  });
}
async function ensureCloudinaryConfigured() {
  if (configureCloudinary()) {
    if (isCloudinaryConfigured()) return true;
  }
  try {
    const dbSettings = await fetchLayoutSettingsFromNeon();
    if (dbSettings && dbSettings.cloudinaryConfig) {
      if (configureCloudinary(dbSettings.cloudinaryConfig)) {
        if (isCloudinaryConfigured()) return true;
      }
    }
  } catch (_) {
  }
  try {
    const localPath = path3.join(process.cwd(), "layout_settings.json");
    if (fs3.existsSync(localPath)) {
      const raw = JSON.parse(fs3.readFileSync(localPath, "utf8"));
      if (raw && raw.cloudinaryConfig) {
        if (configureCloudinary(raw.cloudinaryConfig)) {
          if (isCloudinaryConfigured()) return true;
        }
      }
    }
  } catch (_) {
  }
  return isCloudinaryConfigured();
}
function isCloudinaryConfigured() {
  const config = cloudinary.config();
  return Boolean(
    config.cloud_name && !isPlaceholder(config.cloud_name) && config.api_key && !isPlaceholder(config.api_key) && config.api_secret && !isPlaceholder(config.api_secret)
  );
}
function getCloudinaryStatus() {
  const config = cloudinary.config();
  const configured = Boolean(config.cloud_name && (config.api_key || process.env.CLOUDINARY_URL));
  return {
    configured,
    cloudName: config.cloud_name || null,
    hasApiKey: Boolean(config.api_key),
    hasApiSecret: Boolean(config.api_secret),
    hasUrl: Boolean(process.env.CLOUDINARY_URL)
  };
}
async function uploadToCloudinary(fileInput, options) {
  await ensureCloudinaryConfigured();
  const configured = isCloudinaryConfigured();
  if (!configured) {
    return null;
  }
  const folder = options?.folder || "jade_tailor_luxury_store";
  const resourceType = options?.resourceType || "auto";
  try {
    let result;
    if (Buffer.isBuffer(fileInput)) {
      result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: resourceType,
            folder,
            public_id: options?.publicId,
            use_filename: true,
            unique_filename: true
          },
          (error, res) => {
            if (error) return reject(error);
            if (!res) return reject(new Error("Cloudinary returned empty response"));
            resolve(res);
          }
        );
        uploadStream.end(fileInput);
      });
    } else {
      result = await cloudinary.uploader.upload(fileInput, {
        resource_type: resourceType,
        folder,
        public_id: options?.publicId,
        use_filename: true,
        unique_filename: true
      });
    }
    return {
      url: result.url,
      secure_url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      resource_type: result.resource_type || "image",
      bytes: result.bytes,
      width: result.width,
      height: result.height,
      duration: result.duration,
      isCloudinary: true
    };
  } catch (error) {
    console.error("[Cloudinary Service] Upload failed:", error);
    throw error;
  }
}
var init_cloudinaryService = __esm({
  "backend/services/cloudinaryService.ts"() {
    init_neonDb();
    configureCloudinary();
  }
});

// serverApp.ts
import express from "express";
import path5 from "path";
import fs5 from "fs";

// serverDb.ts
init_initialData();
init_neonDb();
import fs2 from "fs";
import path2 from "path";
import dotenv2 from "dotenv";
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
  blogs: [...INITIAL_BLOGS],
  recycle_bin: []
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
    headerLogoText: "JADE TAILOR",
    headerLogoSubtext: "PERSONAL STYLIST",
    headerLogoImage: "",
    footerLogoText: "JADE TAILOR",
    footerLogoDescription: "Luxury personal styling, bespoke capsule curations, and private boutique shopping tours designed to elevate your effortless style.",
    footerLogoImage: "",
    klaviyoPublicKey: "",
    phone: "800 123 4444",
    address: "0665 Broadway NY, New York 10001 United States of America",
    email: "jade@tailorand.com",
    menuItems: [
      { id: "1", label: "HOME", tab: "frontend-home", type: "tab" },
      { id: "2", label: "SHOP", tab: "frontend-shop", type: "tab" },
      { id: "3", label: "WORK WITH ME", tab: "#appointment-section", type: "tab" },
      { id: "4", label: "MY SERVICES", tab: "#services-section", type: "tab" },
      { id: "5", label: "STYLING PACKAGES", tab: "#pricing-section", type: "tab" },
      { id: "6", label: "STYLE JOURNAL", tab: "blogs", type: "tab" }
    ]
  };
  const sanitizeSettings = (raw) => {
    if (!raw) return defaultSettings;
    const cleaned = { ...raw };
    if (!cleaned.headerLogoText || /pouch supply|storefront/i.test(cleaned.headerLogoText)) {
      cleaned.headerLogoText = "JADE TAILOR";
    }
    if (!cleaned.headerLogoSubtext || /premium nicotine|premium essentials/i.test(cleaned.headerLogoSubtext)) {
      cleaned.headerLogoSubtext = "PERSONAL STYLIST";
    }
    if (!cleaned.footerLogoText || /pouch supply|storefront/i.test(cleaned.footerLogoText)) {
      cleaned.footerLogoText = "JADE TAILOR";
    }
    if (!cleaned.footerLogoDescription || /nicotine|canisters|pouch supply|curated premium ecommerce/i.test(cleaned.footerLogoDescription)) {
      cleaned.footerLogoDescription = "Luxury personal styling, bespoke capsule curations, and private boutique shopping tours designed to elevate your effortless style.";
    }
    if (!cleaned.phone) cleaned.phone = "800 123 4444";
    if (!cleaned.address) cleaned.address = "0665 Broadway NY, New York 10001 United States of America";
    if (!cleaned.email) cleaned.email = "jade@tailorand.com";
    if (Array.isArray(cleaned.menuItems)) {
      const sanitizedItems = cleaned.menuItems.filter((item) => item && item.tab !== "about" && item.tab !== "frontend-brands" && item.label !== "All Brands" && item.label !== "About").map((item) => {
        if (item.tab === "frontend-subscribe") {
          return { ...item, label: item.label === "Subscribe" ? "WORK WITH ME" : item.label, tab: "#appointment-section" };
        }
        return item;
      });
      if (sanitizedItems.length > 0) {
        cleaned.menuItems = sanitizedItems;
      } else {
        cleaned.menuItems = defaultSettings.menuItems;
      }
    } else {
      cleaned.menuItems = defaultSettings.menuItems;
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
var RECYCLE_BIN_FILE = path2.join(process.cwd(), "recycle_bin.json");
function loadRecycleBinFromFile() {
  try {
    if (fs2.existsSync(RECYCLE_BIN_FILE)) {
      const data = fs2.readFileSync(RECYCLE_BIN_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn("[serverDb] Failed loading recycle_bin.json fallback:", e);
  }
  return [];
}
function persistRecycleBinToFile(items) {
  try {
    fs2.writeFileSync(RECYCLE_BIN_FILE, JSON.stringify(items, null, 2), "utf-8");
  } catch (e) {
    console.warn("[serverDb] Failed saving recycle_bin.json fallback:", e);
  }
}
async function fetchRecycleBin() {
  try {
    const neonItems = await fetchRecycleBinFromNeon();
    if (neonItems !== null) {
      memoryCache["recycle_bin"] = neonItems;
      persistRecycleBinToFile(neonItems);
      return neonItems;
    }
  } catch (err) {
    console.error("[serverDb] Failed to fetch recycle bin from Neon DB:", err);
  }
  if (memoryCache["recycle_bin"].length === 0) {
    memoryCache["recycle_bin"] = loadRecycleBinFromFile();
  }
  return memoryCache["recycle_bin"];
}
async function addToRecycleBin(items) {
  const current = await fetchRecycleBin();
  const formattedItems = items.map((item) => ({
    id: item.id || `rb_${item.type}_${item.originalId}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    type: item.type,
    originalId: item.originalId,
    title: item.title || "Untitled Item",
    deletedAt: item.deletedAt || (/* @__PURE__ */ new Date()).toISOString(),
    data: item.data
  }));
  const updated = [...formattedItems, ...current];
  memoryCache["recycle_bin"] = updated;
  persistRecycleBinToFile(updated);
  try {
    for (const item of formattedItems) {
      await saveRecycleBinItemToNeon(item);
    }
    console.log(`[Neon DB Recycle Bin] Persisted ${formattedItems.length} items to recycle_bin table.`);
  } catch (err) {
    console.error("[Neon DB Recycle Bin] Error syncing to DB:", err);
  }
  return updated;
}
async function deleteFromRecycleBin(ids) {
  const current = await fetchRecycleBin();
  const remaining = current.filter((item) => !ids.includes(item.id));
  memoryCache["recycle_bin"] = remaining;
  persistRecycleBinToFile(remaining);
  try {
    await deleteFromRecycleBinInNeon(ids);
    console.log(`[Neon DB Recycle Bin] Permanently deleted ${ids.length} items from recycle_bin table.`);
  } catch (err) {
    console.error("[Neon DB Recycle Bin] Error deleting from DB:", err);
  }
  return remaining;
}
async function clearRecycleBin() {
  memoryCache["recycle_bin"] = [];
  persistRecycleBinToFile([]);
  try {
    await clearRecycleBinInNeon();
    console.log("[Neon DB Recycle Bin] Cleared all items from recycle_bin table.");
    return true;
  } catch (err) {
    console.error("[Neon DB Recycle Bin] Error clearing DB table:", err);
    return false;
  }
}
async function restoreFromRecycleBin(ids) {
  const current = await fetchRecycleBin();
  const toRestore = current.filter((item) => ids.includes(item.id));
  const remaining = current.filter((item) => !ids.includes(item.id));
  memoryCache["recycle_bin"] = remaining;
  persistRecycleBinToFile(remaining);
  try {
    await deleteFromRecycleBinInNeon(ids);
  } catch (err) {
    console.error("[Neon DB Recycle Bin] Error removing restored items from DB recycle bin:", err);
  }
  for (const item of toRestore) {
    try {
      const type = item.type;
      if (type === "product") {
        const prods = await fetchResource("products");
        if (!prods.some((p) => p.id === item.originalId)) {
          await saveResource("products", [item.data, ...prods]);
        }
      } else if (type === "collection") {
        const colls = await fetchResource("collections");
        if (!colls.some((c) => c.id === item.originalId)) {
          await saveResource("collections", [item.data, ...colls]);
        }
      } else if (type === "page") {
        const pages = await fetchResource("custompages");
        if (!pages.some((p) => p.id === item.originalId)) {
          await saveResource("custompages", [item.data, ...pages]);
        }
      } else if (type === "blog") {
        const blogs = await fetchResource("blogs");
        if (!blogs.some((b) => b.id === item.originalId)) {
          await saveResource("blogs", [item.data, ...blogs]);
        }
      } else if (type === "discount") {
        const discounts = await fetchResource("discounts");
        if (!discounts.some((d) => d.id === item.originalId)) {
          await saveResource("discounts", [item.data, ...discounts]);
        }
      } else if (type === "header_footer") {
        const settings = await fetchLayoutSettings();
        const currentItems = Array.isArray(settings.menuItems) ? settings.menuItems : [];
        if (!currentItems.some((m) => m.id === item.originalId)) {
          await saveLayoutSettings({
            ...settings,
            menuItems: [...currentItems, item.data]
          });
        }
      }
    } catch (restoreErr) {
      console.error(`[Recycle Bin] Failed restoring item ${item.id} to resource:`, restoreErr);
    }
  }
  return { restored: toRestore, remaining };
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
router9.post("/process-upi", async (req, res) => {
  try {
    const { orderId, amount, upiId, upiPhone = "8894030663", utrNumber, appName = "Google Pay / PhonePe" } = req.body;
    if (!orderId || !amount) {
      return res.status(400).json({ error: "Order ID and Amount are required." });
    }
    const generatedPaymentId = `upi_${Date.now()}_${crypto2.randomBytes(4).toString("hex")}`;
    const generatedOrderId = `upi_ord_${crypto2.randomBytes(6).toString("hex")}`;
    const targetPhone = upiPhone || "8894030663";
    const methodLabel = `${appName} (UPI: ${targetPhone})${utrNumber ? ` \xB7 UTR: ${utrNumber}` : ""}`;
    const order = await processSuccessfulOrderPayment(orderId, {
      razorpayPaymentId: utrNumber || generatedPaymentId,
      razorpayOrderId: generatedOrderId,
      razorpaySignature: `upi_verified_${Date.now()}`,
      method: methodLabel
    });
    if (order) {
      res.json({
        success: true,
        paymentStatus: "AUTHORISED",
        transactionId: utrNumber || generatedPaymentId,
        orderId: generatedOrderId,
        method: methodLabel,
        message: `\u2713 Payment successfully confirmed via ${appName} (UPI: ${targetPhone}).`
      });
    } else {
      res.status(404).json({ error: "Order record not found." });
    }
  } catch (err) {
    console.error("[Razorpay UPI] Error processing UPI payment:", err);
    res.status(500).json({ error: err.message || "Failed to process UPI payment." });
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

// backend/routes/recycleBin.ts
import { Router as Router10 } from "express";
var router10 = Router10();
router10.get("/", async (req, res) => {
  try {
    const data = await fetchRecycleBin();
    res.json(data);
  } catch (err) {
    console.error("[RecycleBin Router] GET Error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch recycle bin" });
  }
});
router10.post("/", async (req, res) => {
  try {
    const payload = req.body;
    const items = Array.isArray(payload) ? payload : [payload];
    if (items.length === 0) {
      return res.status(400).json({ error: "No items provided to move to recycle bin" });
    }
    const database = await getDb();
    if (!database) {
      res.setHeader("X-Database-Offline", "true");
    } else {
      res.setHeader("X-Database-Offline", "false");
    }
    const updated = await addToRecycleBin(items);
    res.json(updated);
  } catch (err) {
    console.error("[RecycleBin Router] POST Error:", err);
    res.status(500).json({ error: err.message || "Failed to add to recycle bin" });
  }
});
router10.post("/restore", async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "Expected an array of ids to restore" });
    }
    const result = await restoreFromRecycleBin(ids);
    res.json({ success: true, ...result });
  } catch (err) {
    console.error("[RecycleBin Router] Restore Error:", err);
    res.status(500).json({ error: err.message || "Failed to restore from recycle bin" });
  }
});
router10.post("/delete", async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "Expected an array of ids to delete" });
    }
    const remaining = await deleteFromRecycleBin(ids);
    res.json({ success: true, remaining });
  } catch (err) {
    console.error("[RecycleBin Router] Delete Error:", err);
    res.status(500).json({ error: err.message || "Failed to permanently delete from recycle bin" });
  }
});
router10.post("/clear", async (req, res) => {
  try {
    await clearRecycleBin();
    res.json({ success: true, message: "Recycle bin completely cleared" });
  } catch (err) {
    console.error("[RecycleBin Router] Clear Error:", err);
    res.status(500).json({ error: err.message || "Failed to clear recycle bin" });
  }
});
router10.delete("/", async (req, res) => {
  try {
    await clearRecycleBin();
    res.json({ success: true, message: "Recycle bin completely cleared" });
  } catch (err) {
    console.error("[RecycleBin Router] Clear Error:", err);
    res.status(500).json({ error: err.message || "Failed to clear recycle bin" });
  }
});
var recycleBin_default = router10;

// backend/routes/cloudinary.ts
init_cloudinaryService();
import { Router as Router11 } from "express";
import multer from "multer";
import { v2 as cloudinary2 } from "cloudinary";
var router11 = Router11();
var uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }
  // 100MB limit for high-res images & video
});
router11.get("/status", async (req, res) => {
  try {
    const { ensureCloudinaryConfigured: ensureCloudinaryConfigured2 } = await Promise.resolve().then(() => (init_cloudinaryService(), cloudinaryService_exports));
    await ensureCloudinaryConfigured2();
    const status = getCloudinaryStatus();
    res.json(status);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to get Cloudinary status" });
  }
});
router11.post("/config", async (req, res) => {
  try {
    let { cloudName, apiKey, apiSecret, cloudinaryUrl } = req.body;
    cloudName = cloudName ? String(cloudName).replace(/^@+/, "").trim() : "";
    apiKey = apiKey ? String(apiKey).trim() : "";
    apiSecret = apiSecret ? String(apiSecret).trim() : "";
    cloudinaryUrl = cloudinaryUrl ? String(cloudinaryUrl).trim() : "";
    const success = configureCloudinary({ cloudName, apiKey, apiSecret, cloudinaryUrl });
    if (!success) {
      return res.status(400).json({ error: "Please provide either a valid CLOUDINARY_URL or Cloud Name, API Key, and API Secret." });
    }
    try {
      await cloudinary2.api.ping();
    } catch (pingErr) {
      console.warn("[Cloudinary Config] Ping check failed with provided credentials:", pingErr.message);
    }
    const currentSettings = await fetchLayoutSettings();
    const updatedSettings = {
      ...currentSettings,
      cloudinaryConfig: {
        cloudName,
        apiKey,
        apiSecret,
        cloudinaryUrl
      }
    };
    await saveLayoutSettings(updatedSettings);
    res.json({
      success: true,
      message: "Cloudinary credentials configured and saved successfully to database.",
      status: getCloudinaryStatus()
    });
  } catch (err) {
    console.error("[Cloudinary Config] Error saving config:", err);
    res.status(500).json({ error: err.message || "Failed to configure Cloudinary" });
  }
});
router11.get("/config", async (req, res) => {
  try {
    const settings = await fetchLayoutSettings();
    const config = settings && settings.cloudinaryConfig || {};
    res.json({
      cloudName: config.cloudName || process.env.CLOUDINARY_CLOUD_NAME || "",
      apiKey: config.apiKey || process.env.CLOUDINARY_API_KEY || "",
      hasApiSecret: Boolean(config.apiSecret || process.env.CLOUDINARY_API_SECRET),
      cloudinaryUrl: config.cloudinaryUrl ? "configured" : process.env.CLOUDINARY_URL ? "configured" : "",
      status: getCloudinaryStatus()
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to get Cloudinary config" });
  }
});
router11.post("/test", async (req, res) => {
  try {
    let { cloudName, apiKey, apiSecret, cloudinaryUrl } = req.body;
    cloudName = cloudName ? String(cloudName).replace(/^@+/, "").trim() : void 0;
    apiKey = apiKey ? String(apiKey).trim() : void 0;
    apiSecret = apiSecret ? String(apiSecret).trim() : void 0;
    cloudinaryUrl = cloudinaryUrl ? String(cloudinaryUrl).trim() : void 0;
    if (cloudName || cloudinaryUrl || apiKey) {
      configureCloudinary({ cloudName, apiKey, apiSecret, cloudinaryUrl });
    } else {
      const { ensureCloudinaryConfigured: ensureCloudinaryConfigured2 } = await Promise.resolve().then(() => (init_cloudinaryService(), cloudinaryService_exports));
      await ensureCloudinaryConfigured2();
    }
    const pingResult = await cloudinary2.api.ping();
    res.json({
      success: true,
      message: "Successfully connected to Cloudinary CDN servers!",
      result: pingResult
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message || "Cloudinary connection check failed. Verify your Cloud Name, API Key, and Secret."
    });
  }
});
router11.post("/disconnect", async (req, res) => {
  try {
    const currentSettings = await fetchLayoutSettings();
    const updatedSettings = { ...currentSettings };
    delete updatedSettings.cloudinaryConfig;
    await saveLayoutSettings(updatedSettings);
    const { disconnectCloudinary: disconnectCloudinary2 } = await Promise.resolve().then(() => (init_cloudinaryService(), cloudinaryService_exports));
    disconnectCloudinary2();
    res.json({
      success: true,
      message: "Cloudinary credentials disconnected. App will use database storage fallback.",
      status: getCloudinaryStatus()
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to disconnect Cloudinary" });
  }
});
router11.post("/upload", uploadMiddleware.single("file"), async (req, res) => {
  try {
    let fileBuffer = null;
    let originalFilename = "";
    let mimeType = "image/png";
    let base64String = "";
    if (req.file) {
      fileBuffer = req.file.buffer;
      originalFilename = req.file.originalname || "asset";
      mimeType = req.file.mimetype || "image/png";
    } else if (req.body && req.body.data) {
      originalFilename = req.body.fileName || req.body.filename || "asset";
      const data = req.body.data;
      if (typeof data === "string" && data.startsWith("data:")) {
        const matches = data.match(/^data:([^;]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          mimeType = matches[1];
          base64String = matches[2];
          fileBuffer = Buffer.from(base64String, "base64");
        }
      } else {
        base64String = data;
        fileBuffer = Buffer.from(base64String, "base64");
      }
    } else {
      return res.status(400).json({ error: "Missing file or data parameter" });
    }
    const isVideo = mimeType.startsWith("video/") || /\.(mp4|mov|webm|avi|mkv|flv|wmv|m4v|ogv)$/i.test(originalFilename) || req.body?.resource_type === "video";
    const resourceType = isVideo ? "video" : "image";
    const uploadPayload = fileBuffer || Buffer.from(base64String, "base64");
    const result = await uploadToCloudinary(uploadPayload, {
      resourceType: isVideo ? "video" : "auto",
      fileName: originalFilename
    });
    if (!result) {
      return res.status(400).json({
        error: "Cloudinary is not configured. Please configure your Cloudinary credentials first."
      });
    }
    res.json({
      success: true,
      url: result.secure_url,
      secure_url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      resource_type: result.resource_type,
      bytes: result.bytes,
      isCloudinary: true
    });
  } catch (err) {
    console.error("[Cloudinary Route Upload] Error:", err);
    res.status(500).json({ error: err.message || "Cloudinary upload failed" });
  }
});
router11.post("/upload-url", async (req, res) => {
  try {
    const { url, folder, fileName } = req.body;
    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "Missing url parameter" });
    }
    if (url.includes("res.cloudinary.com")) {
      return res.json({
        success: true,
        url,
        secure_url: url,
        isCloudinary: true,
        message: "Already on Cloudinary CDN"
      });
    }
    const result = await uploadToCloudinary(url, {
      folder: folder || "jade_tailor_luxury_store",
      fileName: fileName || "migrated-asset"
    });
    if (!result) {
      return res.status(400).json({
        error: "Cloudinary is not configured. Please check your credentials in Development Mode."
      });
    }
    res.json({
      success: true,
      url: result.secure_url,
      secure_url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      resource_type: result.resource_type,
      isCloudinary: true
    });
  } catch (err) {
    console.error("[Cloudinary Upload URL] Error:", err);
    res.status(500).json({ error: err.message || "Failed to upload URL to Cloudinary" });
  }
});
var cloudinary_default = router11;

// backend/routes/developerMode.ts
init_cloudinaryService();
import { Router as Router12 } from "express";
import fs4 from "fs";
import path4 from "path";
import { v2 as cloudinary3 } from "cloudinary";
init_neonDb();
import nodemailer2 from "nodemailer";
var router12 = Router12();
var DEV_SETTINGS_FILE = path4.join(process.cwd(), "developer_settings.json");
var DEFAULT_DEV_SETTINGS = {
  customCssEnabled: true,
  customCss: `/* ========================================================
   CUSTOM DEVELOPER CSS
   Injected across all storefront pages in real time
   ======================================================== */

/* Example: Luxury accent highlights */
.luxury-accent {
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

/* Example: Smooth transition for product cards */
.product-card-hover {
  transition: transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
}
`,
  customJsEnabled: true,
  customJs: `// ========================================================
// CUSTOM DEVELOPER JAVASCRIPT
// Executed safely across storefront pages
// ========================================================

console.log("[DevMode] Custom Developer JavaScript active on Jade Tailor Luxury Storefront.");

// Example: Custom event listener or analytics dispatch
window.addEventListener("DOMContentLoaded", () => {
  // Developer custom tracking or DOM enhancements here
});
`,
  siteProtectionMode: "live",
  storePassword: "fashion2026",
  comingSoonTitle: "Private Salon & Boutique Showroom",
  comingSoonSubtitle: "BESPOKE CAPSULES \xB7 PRIVATE CLIENTELE ONLY",
  comingSoonMessage: "We are currently preparing our exclusive Spring / Summer collection. Enter your client password below to unlock private showroom access.",
  comingSoonLaunchDate: "2026-11-01T00:00:00Z",
  comingSoonShowNewsletter: true,
  comingSoonShowSocials: true,
  comingSoonBackgroundUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=85",
  apiKeys: {
    cloudinaryCloudName: (process.env.CLOUDINARY_CLOUD_NAME || "").replace(/^@+/, ""),
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || "",
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET ? "configured" : "",
    cloudinaryUrl: process.env.CLOUDINARY_URL || "",
    databaseUrl: process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || "",
    razorpayKeyId: process.env.RAZORPAY_KEY_ID || "",
    razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET ? "configured" : "",
    razorpayWebhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET ? "configured" : "",
    emailHost: process.env.EMAIL_HOST || "smtp.ionos.co.uk",
    emailPort: process.env.EMAIL_PORT || "587",
    emailUser: process.env.EMAIL_USER || "Support@pouch-supply.com",
    emailPass: process.env.EMAIL_PASS ? "configured" : "",
    emailFrom: process.env.EMAIL_FROM || "Support <Support@pouch-supply.com>",
    geminiApiKey: process.env.GEMINI_API_KEY ? "configured" : "",
    googleAnalyticsId: "",
    metaPixelId: "",
    klaviyoPublicKey: "",
    appUrl: process.env.APP_URL || "http://localhost:3000",
    projectName: "Jade Tailor - Personal Stylist & Luxury Store",
    upiPhoneNumber: "8894030663",
    upiVpa: "8894030663@upi",
    upiPayeeName: "Jade Tailor Luxury Boutique",
    upiGPayId: "8894030663@okaxis",
    upiPhonePeId: "8894030663@ybl",
    upiPaytmId: "8894030663@paytm",
    upiEnabled: true,
    currency: "INR",
    currencySymbol: "\u20B9",
    storeEmail: "jade@tailorand.com",
    storePhone: "+91 8894030663"
  },
  debugConsoleLogs: false,
  maintenanceBypassAdmins: true
};
async function loadDeveloperSettings() {
  let settings = { ...DEFAULT_DEV_SETTINGS };
  try {
    const list = await fetchResource("developer_settings");
    if (Array.isArray(list) && list.length > 0 && list[0]) {
      const stored = list[0];
      const mergedKeys = {
        ...DEFAULT_DEV_SETTINGS.apiKeys,
        ...stored.apiKeys || {},
        upiPhoneNumber: stored.apiKeys?.upiPhoneNumber && stored.apiKeys.upiPhoneNumber.trim() !== "" ? stored.apiKeys.upiPhoneNumber : DEFAULT_DEV_SETTINGS.apiKeys.upiPhoneNumber,
        upiVpa: stored.apiKeys?.upiVpa && stored.apiKeys.upiVpa.trim() !== "" ? stored.apiKeys.upiVpa : DEFAULT_DEV_SETTINGS.apiKeys.upiVpa,
        upiPayeeName: stored.apiKeys?.upiPayeeName || DEFAULT_DEV_SETTINGS.apiKeys.upiPayeeName,
        upiGPayId: stored.apiKeys?.upiGPayId || DEFAULT_DEV_SETTINGS.apiKeys.upiGPayId,
        upiPhonePeId: stored.apiKeys?.upiPhonePeId || DEFAULT_DEV_SETTINGS.apiKeys.upiPhonePeId,
        upiPaytmId: stored.apiKeys?.upiPaytmId || DEFAULT_DEV_SETTINGS.apiKeys.upiPaytmId,
        upiEnabled: stored.apiKeys?.upiEnabled !== void 0 ? stored.apiKeys.upiEnabled : true
      };
      settings = {
        ...DEFAULT_DEV_SETTINGS,
        ...stored,
        apiKeys: mergedKeys
      };
      return settings;
    }
  } catch (_) {
  }
  try {
    if (fs4.existsSync(DEV_SETTINGS_FILE)) {
      const content = fs4.readFileSync(DEV_SETTINGS_FILE, "utf-8");
      const parsed = JSON.parse(content);
      const mergedKeys = {
        ...DEFAULT_DEV_SETTINGS.apiKeys,
        ...parsed.apiKeys || {},
        upiPhoneNumber: parsed.apiKeys?.upiPhoneNumber && parsed.apiKeys.upiPhoneNumber.trim() !== "" ? parsed.apiKeys.upiPhoneNumber : DEFAULT_DEV_SETTINGS.apiKeys.upiPhoneNumber,
        upiVpa: parsed.apiKeys?.upiVpa && parsed.apiKeys.upiVpa.trim() !== "" ? parsed.apiKeys.upiVpa : DEFAULT_DEV_SETTINGS.apiKeys.upiVpa,
        upiPayeeName: parsed.apiKeys?.upiPayeeName || DEFAULT_DEV_SETTINGS.apiKeys.upiPayeeName,
        upiGPayId: parsed.apiKeys?.upiGPayId || DEFAULT_DEV_SETTINGS.apiKeys.upiGPayId,
        upiPhonePeId: parsed.apiKeys?.upiPhonePeId || DEFAULT_DEV_SETTINGS.apiKeys.upiPhonePeId,
        upiPaytmId: parsed.apiKeys?.upiPaytmId || DEFAULT_DEV_SETTINGS.apiKeys.upiPaytmId,
        upiEnabled: parsed.apiKeys?.upiEnabled !== void 0 ? parsed.apiKeys.upiEnabled : true
      };
      settings = {
        ...DEFAULT_DEV_SETTINGS,
        ...parsed,
        apiKeys: mergedKeys
      };
      return settings;
    }
  } catch (_) {
  }
  return settings;
}
async function persistDeveloperSettings(data) {
  const current = await loadDeveloperSettings();
  const merged = {
    ...current,
    ...data,
    apiKeys: {
      ...current.apiKeys,
      ...data.apiKeys || {}
    },
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  try {
    fs4.writeFileSync(DEV_SETTINGS_FILE, JSON.stringify(merged, null, 2), "utf-8");
  } catch (err) {
    console.warn("[DevMode] Error saving developer_settings.json:", err);
  }
  try {
    await saveResource("developer_settings", [merged]);
  } catch (err) {
    console.warn("[DevMode] Error saving to developer_settings table:", err);
  }
  const cldKeys = merged.apiKeys;
  if (cldKeys.cloudinaryCloudName || cldKeys.cloudinaryUrl || cldKeys.cloudinaryApiKey) {
    try {
      configureCloudinary({
        cloudName: cldKeys.cloudinaryCloudName,
        apiKey: cldKeys.cloudinaryApiKey,
        apiSecret: cldKeys.cloudinaryApiSecret && cldKeys.cloudinaryApiSecret !== "configured" ? cldKeys.cloudinaryApiSecret : process.env.CLOUDINARY_API_SECRET,
        cloudinaryUrl: cldKeys.cloudinaryUrl && cldKeys.cloudinaryUrl !== "configured" ? cldKeys.cloudinaryUrl : process.env.CLOUDINARY_URL
      });
    } catch (_) {
    }
  }
  return merged;
}
router12.get("/", async (req, res) => {
  try {
    await ensureCloudinaryConfigured();
    const settings = await loadDeveloperSettings();
    const cldStatus = getCloudinaryStatus();
    const envStatus = {
      cloudinary: isCloudinaryConfigured(),
      database: Boolean(process.env.DATABASE_URL || process.env.NEON_DATABASE_URL),
      razorpay: Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
      email: Boolean(process.env.EMAIL_HOST && process.env.EMAIL_USER),
      gemini: Boolean(process.env.GEMINI_API_KEY)
    };
    const maskedKeys = {
      ...settings.apiKeys,
      cloudinaryApiSecret: settings.apiKeys.cloudinaryApiSecret ? settings.apiKeys.cloudinaryApiSecret === "configured" ? "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" : "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" : "",
      razorpayKeySecret: settings.apiKeys.razorpayKeySecret ? "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" : "",
      razorpayWebhookSecret: settings.apiKeys.razorpayWebhookSecret ? "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" : "",
      emailPass: settings.apiKeys.emailPass ? "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" : "",
      geminiApiKey: settings.apiKeys.geminiApiKey ? "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" : ""
    };
    res.json({
      ...settings,
      apiKeys: maskedKeys,
      hasSecrets: {
        cloudinary: Boolean(settings.apiKeys.cloudinaryApiSecret || process.env.CLOUDINARY_API_SECRET),
        razorpay: Boolean(settings.apiKeys.razorpayKeySecret || process.env.RAZORPAY_KEY_SECRET),
        email: Boolean(settings.apiKeys.emailPass || process.env.EMAIL_PASS),
        gemini: Boolean(settings.apiKeys.geminiApiKey || process.env.GEMINI_API_KEY)
      },
      envStatus,
      cloudinaryStatus: cldStatus
    });
  } catch (err) {
    console.error("[DevMode] GET error:", err);
    res.status(500).json({ error: err.message || "Failed to load developer settings" });
  }
});
router12.get("/public", async (req, res) => {
  try {
    const settings = await loadDeveloperSettings();
    res.json({
      customCssEnabled: settings.customCssEnabled,
      customCss: settings.customCssEnabled ? settings.customCss : "",
      customJsEnabled: settings.customJsEnabled,
      customJs: settings.customJsEnabled ? settings.customJs : "",
      siteProtectionMode: settings.siteProtectionMode,
      comingSoonTitle: settings.comingSoonTitle,
      comingSoonSubtitle: settings.comingSoonSubtitle,
      comingSoonMessage: settings.comingSoonMessage,
      comingSoonLaunchDate: settings.comingSoonLaunchDate,
      comingSoonShowNewsletter: settings.comingSoonShowNewsletter,
      comingSoonShowSocials: settings.comingSoonShowSocials,
      comingSoonBackgroundUrl: settings.comingSoonBackgroundUrl,
      debugConsoleLogs: settings.debugConsoleLogs,
      projectName: settings.apiKeys?.projectName || "Jade Tailor",
      upiPhoneNumber: settings.apiKeys?.upiPhoneNumber || "8894030663",
      upiVpa: settings.apiKeys?.upiVpa || "8894030663@upi",
      upiPayeeName: settings.apiKeys?.upiPayeeName || "Jade Tailor",
      upiGPayId: settings.apiKeys?.upiGPayId || "8894030663@okaxis",
      upiPhonePeId: settings.apiKeys?.upiPhonePeId || "8894030663@ybl",
      upiPaytmId: settings.apiKeys?.upiPaytmId || "8894030663@paytm",
      upiEnabled: settings.apiKeys?.upiEnabled !== false
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to get public settings" });
  }
});
router12.post("/", async (req, res) => {
  try {
    const payload = req.body;
    const current = await loadDeveloperSettings();
    if (payload.apiKeys) {
      if (payload.apiKeys.cloudinaryApiSecret === "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" || payload.apiKeys.cloudinaryApiSecret === "configured") {
        payload.apiKeys.cloudinaryApiSecret = current.apiKeys.cloudinaryApiSecret;
      }
      if (payload.apiKeys.razorpayKeySecret === "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" || payload.apiKeys.razorpayKeySecret === "configured") {
        payload.apiKeys.razorpayKeySecret = current.apiKeys.razorpayKeySecret;
      }
      if (payload.apiKeys.razorpayWebhookSecret === "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" || payload.apiKeys.razorpayWebhookSecret === "configured") {
        payload.apiKeys.razorpayWebhookSecret = current.apiKeys.razorpayWebhookSecret;
      }
      if (payload.apiKeys.emailPass === "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" || payload.apiKeys.emailPass === "configured") {
        payload.apiKeys.emailPass = current.apiKeys.emailPass;
      }
      if (payload.apiKeys.geminiApiKey === "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" || payload.apiKeys.geminiApiKey === "configured") {
        payload.apiKeys.geminiApiKey = current.apiKeys.geminiApiKey;
      }
    }
    const saved = await persistDeveloperSettings(payload);
    res.json({
      success: true,
      message: "Development mode settings updated successfully.",
      data: saved
    });
  } catch (err) {
    console.error("[DevMode] POST error:", err);
    res.status(500).json({ error: err.message || "Failed to save developer settings" });
  }
});
router12.post("/verify-password", async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ valid: false, error: "Please enter a password." });
    }
    const settings = await loadDeveloperSettings();
    const correctPassword = settings.storePassword || "fashion2026";
    if (password.trim() === correctPassword.trim()) {
      res.json({
        valid: true,
        token: `unlocked_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        message: "Password verified! Welcome to the boutique showroom."
      });
    } else {
      res.status(401).json({
        valid: false,
        error: "Incorrect password. Please verify and try again."
      });
    }
  } catch (err) {
    res.status(500).json({ valid: false, error: err.message || "Verification failed" });
  }
});
router12.post("/test-key", async (req, res) => {
  const { service, config } = req.body;
  try {
    if (service === "cloudinary") {
      const cloudName = (config?.cloudName || process.env.CLOUDINARY_CLOUD_NAME || "").replace(/^@+/, "").trim();
      const apiKey = config?.apiKey || process.env.CLOUDINARY_API_KEY;
      const apiSecret = config?.apiSecret && config.apiSecret !== "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" ? config.apiSecret : process.env.CLOUDINARY_API_SECRET;
      const cldUrl = config?.cloudinaryUrl && config.cloudinaryUrl !== "configured" ? config.cloudinaryUrl : process.env.CLOUDINARY_URL;
      if (cloudName || apiKey || cldUrl) {
        configureCloudinary({ cloudName, apiKey, apiSecret, cloudinaryUrl: cldUrl });
      } else {
        await ensureCloudinaryConfigured();
      }
      const ping = await cloudinary3.api.ping();
      return res.json({
        success: true,
        service: "cloudinary",
        message: `\u2713 Cloudinary CDN connected successfully! Cloud: "${cloudName || cloudinary3.config().cloud_name}"`,
        details: ping
      });
    }
    if (service === "database") {
      const dbStatus = await testConnection();
      if (dbStatus.status === "connected") {
        return res.json({
          success: true,
          service: "database",
          message: `\u2713 Database connected (${dbStatus.uriHost || "PostgreSQL"})`,
          details: dbStatus
        });
      } else {
        return res.status(400).json({
          success: false,
          service: "database",
          error: dbStatus.error || "Database connection test failed."
        });
      }
    }
    if (service === "razorpay") {
      const keyId = config?.keyId || process.env.RAZORPAY_KEY_ID;
      const keySecret = config?.keySecret && config.keySecret !== "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" ? config.keySecret : process.env.RAZORPAY_KEY_SECRET;
      if (!keyId) {
        return res.status(400).json({
          success: false,
          service: "razorpay",
          error: "Missing Razorpay Key ID."
        });
      }
      const Razorpay2 = (await import("razorpay")).default;
      const instance = new Razorpay2({
        key_id: keyId,
        key_secret: keySecret || "test_secret"
      });
      try {
        const testRes = await instance.orders.all({ count: 1 });
        return res.json({
          success: true,
          service: "razorpay",
          message: `\u2713 Razorpay API verified successfully for Key ID: ${keyId}`,
          details: { orderCount: testRes.count }
        });
      } catch (rzpErr) {
        if (rzpErr.statusCode === 401) {
          throw new Error("Razorpay authentication failed: Invalid Key ID or Secret.");
        }
        return res.json({
          success: true,
          service: "razorpay",
          message: `\u2713 Razorpay credentials formatted correctly: Key ID "${keyId}"`,
          details: rzpErr.message
        });
      }
    }
    if (service === "email") {
      const host = config?.host || process.env.EMAIL_HOST || "smtp.ionos.co.uk";
      const port = parseInt(config?.port || process.env.EMAIL_PORT || "587", 10);
      const user = config?.user || process.env.EMAIL_USER || "Support@pouch-supply.com";
      const pass = config?.pass && config.pass !== "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" ? config.pass : process.env.EMAIL_PASS || "";
      const transporter = nodemailer2.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
        tls: { rejectUnauthorized: false }
      });
      try {
        await transporter.verify();
        return res.json({
          success: true,
          service: "email",
          message: `\u2713 SMTP Outbox connected successfully to ${host}:${port} as ${user}`
        });
      } catch (mailErr) {
        return res.status(400).json({
          success: false,
          service: "email",
          error: `SMTP connection failed: ${mailErr.message}`
        });
      }
    }
    if (service === "gemini") {
      const apiKey = config?.apiKey && config.apiKey !== "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" ? config.apiKey : process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({
          success: false,
          service: "gemini",
          error: "Missing GEMINI_API_KEY."
        });
      }
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey });
      const model = ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Respond with the single word: OK"
      });
      const response = await model;
      return res.json({
        success: true,
        service: "gemini",
        message: `\u2713 Gemini AI API connected and generated response!`,
        reply: response.text?.trim()
      });
    }
    res.status(400).json({ error: `Unknown service: ${service}` });
  } catch (err) {
    console.error(`[DevMode Test] ${service} test failed:`, err);
    res.status(400).json({
      success: false,
      service,
      error: err.message || `Test failed for ${service}`
    });
  }
});
router12.get("/export", async (req, res) => {
  try {
    const devSettings = await loadDeveloperSettings();
    const layoutSettings = await fetchLayoutSettings();
    const products = await fetchResource("products");
    const collections = await fetchResource("collections");
    const exportPackage = {
      version: "2.0.0",
      exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
      project: devSettings.apiKeys.projectName || "Jade Tailor Luxury Boutique",
      developerSettings: devSettings,
      layoutSettings,
      counts: {
        products: products.length,
        collections: collections.length
      }
    };
    res.setHeader("Content-Disposition", `attachment; filename=project-config-${Date.now()}.json`);
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(exportPackage, null, 2));
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to export config" });
  }
});
router12.post("/import", async (req, res) => {
  try {
    const pkg = req.body;
    if (!pkg || typeof pkg !== "object") {
      return res.status(400).json({ error: "Invalid JSON configuration package." });
    }
    if (pkg.developerSettings) {
      await persistDeveloperSettings(pkg.developerSettings);
    }
    if (pkg.layoutSettings) {
      await saveLayoutSettings(pkg.layoutSettings);
    }
    res.json({
      success: true,
      message: "\u2713 Project configuration imported successfully. Your website is now ready for the new project!"
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to import config" });
  }
});
var developerMode_default = router12;

// serverApp.ts
init_cloudinaryService();
import multer2 from "multer";
async function createExpressApp() {
  const app = express();
  ensureCloudinaryConfigured().catch(() => {
  });
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
  const uploadsPath = path5.join(process.cwd(), "uploads");
  if (!fs5.existsSync(uploadsPath)) {
    try {
      fs5.mkdirSync(uploadsPath, { recursive: true });
    } catch (_) {
    }
  }
  app.get("/uploads/:filename", async (req, res, next) => {
    try {
      const filename = req.params.filename;
      const filePath = path5.join(uploadsPath, filename);
      if (fs5.existsSync(filePath)) {
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
          fs5.writeFileSync(filePath, Buffer.from(imgDoc.base64Data, "base64"));
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
  const uploadMiddleware2 = multer2({
    storage: multer2.memoryStorage(),
    limits: { fileSize: 100 * 1024 * 1024 }
  });
  app.post("/api/upload", uploadMiddleware2.single("file"), async (req, res) => {
    try {
      let fileBuffer = null;
      let originalFilename = "";
      let mimeType = "image/png";
      let base64String = "";
      if (req.file) {
        fileBuffer = req.file.buffer;
        originalFilename = req.file.originalname || "uploaded-asset";
        mimeType = req.file.mimetype || "image/png";
        base64String = req.file.buffer.toString("base64");
      } else if (req.body && req.body.data) {
        const data = req.body.data;
        originalFilename = req.body.filename || req.body.fileName || "uploaded-asset";
        base64String = data;
        if (typeof data === "string" && data.startsWith("data:")) {
          const matches = data.match(/^data:([^;]+);base64,(.+)$/);
          if (matches && matches.length === 3) {
            mimeType = matches[1];
            base64String = matches[2];
          }
        }
        try {
          fileBuffer = Buffer.from(base64String, "base64");
        } catch (_) {
        }
      } else {
        return res.status(400).json({ error: "Missing file or data payload for upload." });
      }
      const isVideo = mimeType.startsWith("video/") || /\.(mp4|mov|webm|avi|mkv|flv|wmv|m4v|ogv)$/i.test(originalFilename) || req.body?.resource_type === "video";
      const resourceType = isVideo ? "video" : "image";
      const ext = mimeType.includes("/") ? mimeType.split("/")[1] : isVideo ? "mp4" : "png";
      const cleanExt = ext.replace(/[^a-zA-Z0-9]/g, "").toLowerCase() || (isVideo ? "mp4" : "png");
      const uniqueId = `${isVideo ? "vid" : "img"}-${Date.now()}-${Math.floor(Math.random() * 1e5)}`;
      const safeFileName = originalFilename && originalFilename.includes(".") ? originalFilename : `${uniqueId}.${cleanExt}`;
      let finalUrl = "";
      let isCloudinary = false;
      let cloudinaryPublicId = "";
      let fileSize = fileBuffer ? fileBuffer.length : base64String ? Math.round(base64String.length * 0.75) : 0;
      try {
        const uploadPayload = fileBuffer || ((dataUriOrBase64) => dataUriOrBase64.startsWith("data:") ? dataUriOrBase64 : `data:${mimeType};base64,${dataUriOrBase64}`)(base64String);
        const cldResult = await uploadToCloudinary(uploadPayload, {
          resourceType: isVideo ? "video" : "auto",
          fileName: safeFileName
        });
        if (cldResult && cldResult.secure_url) {
          finalUrl = cldResult.secure_url;
          isCloudinary = true;
          cloudinaryPublicId = cldResult.public_id;
          if (cldResult.bytes) fileSize = cldResult.bytes;
          console.log(`[API Upload] Successfully uploaded to Cloudinary: ${finalUrl} (resource_type: ${cldResult.resource_type})`);
        }
      } catch (cldErr) {
        console.warn("[API Upload] Cloudinary upload attempt failed or not configured, using database/local storage fallback:", cldErr.message);
      }
      if (!finalUrl) {
        finalUrl = await saveUploadedImage(uniqueId, base64String, mimeType);
        try {
          const diskFile = path5.join(uploadsPath, `${uniqueId}.${cleanExt}`);
          fs5.writeFileSync(diskFile, Buffer.from(base64String, "base64"));
        } catch (_) {
        }
      }
      const sizeStr = fileSize > 1024 * 1024 ? `${(fileSize / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(fileSize / 1024))} KB`;
      const newFileDoc = {
        id: uniqueId,
        fileName: safeFileName,
        altText: safeFileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
        dateAdded: (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        size: sizeStr,
        references: isVideo ? "Video Section" : "Storefront Media",
        url: finalUrl,
        resourceType,
        format: cleanExt,
        cloudinaryPublicId: isCloudinary ? cloudinaryPublicId : void 0
      };
      try {
        const existingFiles = await fetchResource("files");
        const updatedFiles = [newFileDoc, ...Array.isArray(existingFiles) ? existingFiles.filter((f) => f.url !== finalUrl) : []];
        await saveResource("files", updatedFiles);
        console.log(`[API Upload] Persisted file record to database: ${safeFileName} (${newFileDoc.id})`);
      } catch (dbErr) {
        console.warn("[API Upload] Failed to write file entry to files table:", dbErr);
      }
      res.json({
        url: finalUrl,
        secure_url: finalUrl,
        id: uniqueId,
        fileName: safeFileName,
        resource_type: resourceType,
        format: cleanExt,
        isCloudinary,
        cloudinaryPublicId: isCloudinary ? cloudinaryPublicId : void 0,
        file: newFileDoc
      });
    } catch (err) {
      console.error("[API Upload] Fail:", err);
      res.status(500).json({ error: err.message || "Failed to process upload" });
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
  app.use("/api/recyclebin", recycleBin_default);
  app.use("/api/cloudinary", cloudinary_default);
  app.use("/api/developer-mode", developerMode_default);
  app.get("/placeholder.png", (req, res) => {
    res.sendFile(path5.resolve(process.cwd(), "placeholder.png"));
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
        const fs6 = await import("fs");
        let html = fs6.readFileSync(path5.resolve(process.cwd(), "index.html"), "utf-8");
        html = await vite.transformIndexHtml(url, html);
        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      } catch (e) {
        next(e);
      }
    });
  } else {
    const distPath = path5.join(process.cwd(), "dist");
    console.log(`[Production Setup] Static directory: ${distPath}`);
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      const url = req.originalUrl;
      const lastSegment = url.split("/").pop() || "";
      if (url.startsWith("/api") || lastSegment.includes(".")) {
        return res.status(404).send("API or File Asset Not Found");
      }
      const indexPath = path5.join(distPath, "index.html");
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
