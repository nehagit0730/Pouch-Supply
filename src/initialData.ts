import { Product, Collection, Order, FileEntry, Customer, Discount, CustomPage } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  // Brand: 77
  {
    id: '77-black-tea',
    title: '77 Black Tea 10.4 mg',
    description: 'A classic rich black tea flavor with premium tobacco-free nicotine pouches.',
    price: 4.99,
    compareAtPrice: 5.99,
    inventory: 154,
    sku: '77-BLK-TEA',
    category: 'Vitamins & Supplements', // styled similar to the screen
    vendor: '77',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1628114264219-5135347e3125?auto=format&fit=crop&w=500&q=80', // We can use custom modern pouch-like visuals
    weight: 12,
    tags: ['nicotine', 'standard', '77', 'tea']
  },
  {
    id: '77-cola-cherry',
    title: '77 Cola & Cherry 10.4 mg',
    description: 'A fizzy sweet cola taste blending perfectly with deep tart red cherries.',
    price: 4.99,
    compareAtPrice: 5.99,
    inventory: 85,
    sku: '77-COLA-CHE',
    category: 'Vitamins & Supplements',
    vendor: '77',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1543257580-7269da773bf5?auto=format&fit=crop&w=500&q=80',
    weight: 12,
    tags: ['nicotine', 'standard', '77', 'sweet', 'cola']
  },
  {
    id: '77-watermelon',
    title: '77 Watermelon 5.2 mg',
    description: 'Refreshing sweet watermelon nicotine pouches, moderate strength for a casual experience.',
    price: 4.29,
    compareAtPrice: 4.99,
    inventory: 232,
    sku: '77-WMLN-5',
    category: 'Vitamins & Supplements',
    vendor: '77',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?auto=format&fit=crop&w=500&q=80',
    weight: 12,
    tags: ['nicotine', 'mild', '77', 'fruit', 'watermelon']
  },
  {
    id: '77-raspberry',
    title: '77 Raspberry 5.2 mg',
    description: 'Slightly sour, juicy alpine raspberry flavor in an extra-slim white pouch.',
    price: 4.29,
    compareAtPrice: 4.99,
    inventory: 12,
    sku: '77-RASP-5',
    category: 'Vitamins & Supplements',
    vendor: '77',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1576186726115-4d51596775d1?auto=format&fit=crop&w=500&q=80',
    weight: 12,
    tags: ['nicotine', 'mild', '77', 'raspberry']
  },
  {
    id: '77-melon-mint',
    title: '77 Melon Mint 5.2 mg',
    description: 'Crisp green melon flavor blended with sweet spearmint cooling crystals.',
    price: 4.29,
    compareAtPrice: 4.99,
    inventory: 50,
    sku: '77-MEL-MNT',
    category: 'Vitamins & Supplements',
    vendor: '77',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=500&q=80',
    weight: 12,
    tags: ['nicotine', 'mild', '77', 'melon', 'mint']
  },
  {
    id: '77-ice-mint',
    title: '77 Ice Mint 20 mg',
    description: 'Extreme polar frost with deep peppermint delivery. For seasoned pouch veterans.',
    price: 4.99,
    compareAtPrice: 5.99,
    inventory: 200,
    sku: '77-ICE-20',
    category: 'Vitamins & Supplements',
    vendor: '77',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1550507992-eb63ffee0847?auto=format&fit=crop&w=500&q=80',
    weight: 12,
    tags: ['nicotine', 'extreme', '77', 'mint']
  },
  {
    id: '77-forest-fruits',
    title: '77 Forest Fruits 5.2 mg',
    description: 'Wild strawberry, blueberry, and blackberry notes coming together in perfect harmony.',
    price: 4.29,
    compareAtPrice: 4.99,
    inventory: 140,
    sku: '77-FOR-FRT',
    category: 'Vitamins & Supplements',
    vendor: '77',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=500&q=80',
    weight: 12,
    tags: ['nicotine', 'mild', '77', 'berry']
  },
  {
    id: '77-ghost-onion',
    title: '77 Ghost Onion 20 mg',
    description: 'Unique spicy formulation blending ghost pepper heat and subtle herbal onion elements.',
    price: 5.25,
    compareAtPrice: 6.00,
    inventory: 14,
    sku: '77-GHST-ON',
    category: 'Vitamins & Supplements',
    vendor: '77',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=500&q=80',
    weight: 12,
    tags: ['nicotine', 'extreme', '77', 'spicy']
  },

  // Brand: CUBA
  {
    id: 'cuba-watermelon',
    title: 'CUBA Watermelon 43 mg',
    description: 'Intense 43mg heavy hitter. Extreme fast release of sweet juicy watermelon aroma.',
    price: 5.50,
    compareAtPrice: 6.50,
    inventory: 90,
    sku: 'CUBA-WTR-43',
    category: 'Powdered Beverage Mixes',
    vendor: 'CUBA',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?auto=format&fit=crop&w=500&q=80',
    weight: 15,
    tags: ['cuba', 'watermelon', 'nicotine', 'ultra-strong']
  },
  {
    id: 'cuba-tropical',
    title: 'CUBA Tropical Fruit 43 mg',
    description: 'Vibrant pineapple, mango, and passionfruit blast with maximum pouch strength.',
    price: 5.50,
    compareAtPrice: 6.50,
    inventory: 110,
    sku: 'CUBA-TRO-43',
    category: 'Powdered Beverage Mixes',
    vendor: 'CUBA',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1511117496524-ec40f8069ff3?auto=format&fit=crop&w=500&q=80',
    weight: 15,
    tags: ['cuba', 'tropical', 'nicotine', 'ultra-strong']
  },
  {
    id: 'cuba-yoghurt',
    title: 'CUBA Yoghurt 43 mg',
    description: 'Uniquely smooth, sweet, and creamy beverage-inspired nicotine pouches.',
    price: 5.50,
    compareAtPrice: 6.50,
    inventory: 45,
    sku: 'CUBA-YOG-43',
    category: 'Powdered Beverage Mixes',
    vendor: 'CUBA',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=500&q=80',
    weight: 15,
    tags: ['cuba', 'yoghurt', 'nicotine', 'ultra-strong']
  },
  {
    id: 'cuba-double-fresh',
    title: 'CUBA Double Fresh 43 mg',
    description: 'Double cooling crystals with a distinct spearmint-menthol crash.',
    price: 5.50,
    compareAtPrice: 6.50,
    inventory: 120,
    sku: 'CUBA-DBL-FR',
    category: 'Powdered Beverage Mixes',
    vendor: 'CUBA',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1545601445-4d6a0a05d5f0?auto=format&fit=crop&w=500&q=80',
    weight: 15,
    tags: ['cuba', 'mint', 'nicotine', 'ultra-strong']
  },
  {
    id: 'cuba-cherry',
    title: 'CUBA Cherry 43 mg',
    description: 'Bold, tart sweet black cherry combined with extreme 43mg nicotine content.',
    price: 5.50,
    compareAtPrice: 6.50,
    inventory: 74,
    sku: 'CUBA-CHE-43',
    category: 'Powdered Beverage Mixes',
    vendor: 'CUBA',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=500&q=80',
    weight: 15,
    tags: ['cuba', 'cherry', 'nicotine', 'ultra-strong']
  },
  {
    id: 'cuba-banana-hit',
    title: 'CUBA Banana Hit 43 mg',
    description: 'Playful sweet banana candy profile packed into the famous dark CUBA pouch.',
    price: 5.75,
    compareAtPrice: 6.75,
    inventory: 33,
    sku: 'CUBA-BAN-43',
    category: 'Powdered Beverage Mixes',
    vendor: 'CUBA',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=500&q=80',
    weight: 15,
    tags: ['cuba', 'banana', 'nicotine', 'ultra-strong']
  },

  // Brand: CLEW
  {
    id: 'clew-watermelon',
    title: 'CLEW Watermelon 5 mg',
    description: 'Refreshing sweet slice of summer watermelon in a micro-size cozy fit format.',
    price: 3.99,
    compareAtPrice: 4.50,
    inventory: 340,
    sku: 'CLEW-WTR-5',
    category: 'Vitamins & Supplements',
    vendor: 'CLEW',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?auto=format&fit=crop&w=500&q=80',
    weight: 10,
    tags: ['clew', 'watermelon', 'nicotine', 'mild']
  },
  {
    id: 'clew-spearmint',
    title: 'CLEW Spearmint 5 mg',
    description: 'Delicate leaf-extracted spearmint giving a sweet, satisfying non-tobacco buzz.',
    price: 3.99,
    compareAtPrice: 4.50,
    inventory: 250,
    sku: 'CLEW-SPM-5',
    category: 'Vitamins & Supplements',
    vendor: 'CLEW',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1533243916-248d2cf7d7da?auto=format&fit=crop&w=500&q=80',
    weight: 10,
    tags: ['clew', 'mint', 'spearmint', 'nicotine', 'mild']
  },
  {
    id: 'clew-cool-mint',
    title: 'CLEW Cool Mint 20 mg',
    description: 'Stronger icy breath crystals delivering 20mg punch from a slim form factor.',
    price: 4.19,
    compareAtPrice: 4.99,
    inventory: 198,
    sku: 'CLEW-COOL-20',
    category: 'Vitamins & Supplements',
    vendor: 'CLEW',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1550507992-eb63ffee0847?auto=format&fit=crop&w=500&q=80',
    weight: 10,
    tags: ['clew', 'mint', 'nicotine', 'strong']
  },
  {
    id: 'clew-coffee',
    title: 'CLEW Coffee 5 mg',
    description: 'Fresh pulled espresso roast notes. A perfect companion for your morning routines.',
    price: 3.99,
    compareAtPrice: 4.50,
    inventory: 144,
    sku: 'CLEW-COF-5',
    category: 'Vitamins & Supplements',
    vendor: 'CLEW',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=500&q=80',
    weight: 10,
    tags: ['clew', 'coffee', 'nicotine', 'mild']
  },

  // Brand: KILLA
  {
    id: 'killa-cold-mint',
    title: 'KILLA Cold Mint 16 mg',
    description: 'World-famous Siberian style deep cold mint. Legendary kick with a classic touch.',
    price: 4.50,
    compareAtPrice: 5.50,
    inventory: 500,
    sku: 'KILLA-C-MNT',
    category: 'Vitamins & Supplements',
    vendor: 'KILLA',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?auto=format&fit=crop&w=500&q=80',
    weight: 12,
    tags: ['killa', 'cold-mint', 'nicotine', 'strong']
  },
  {
    id: 'killa-blueberry',
    title: 'KILLA Blueberry 16 mg',
    description: 'Sweet, full-bodied ripe blueberry juice paired with a hefty 16mg mint kick.',
    price: 4.50,
    compareAtPrice: 5.50,
    inventory: 140,
    sku: 'KILLA-BLUE',
    category: 'Vitamins & Supplements',
    vendor: 'KILLA',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=500&q=80',
    weight: 12,
    tags: ['killa', 'blueberry', 'nicotine', 'strong']
  },

  // Brand: VELO
  {
    id: 'velo-freeze',
    title: 'VELO Freeze Max 17 mg',
    description: 'Top-tier crisp peppermint combined with dry cooling eucalyptus crystals.',
    price: 4.80,
    compareAtPrice: 5.50,
    inventory: 85,
    sku: 'VELO-FRZ-MX',
    category: 'Nicotine Pouches',
    vendor: 'VELO',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=500&q=80',
    weight: 12,
    tags: ['velo', 'freeze', 'nicotine', 'strong']
  }
];

export const INITIAL_COLLECTIONS: Collection[] = [
  {
    id: 'all',
    title: 'Shop All Pouches',
    description: 'Browse our entire selection of top-notch tobacco-free nicotine and energy pouches.',
    type: 'Smart',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=500&q=80',
    productIds: INITIAL_PRODUCTS.map(p => p.id),
    productConditions: 'Price is greater than -9999'
  },
  {
    id: '77',
    title: '77 Collection',
    description: 'Premium, modern nicotine thin pouches from iconic brand 77.',
    type: 'Manual',
    image: 'https://images.unsplash.com/photo-1628114264219-5135347e3125?auto=format&fit=crop&w=500&q=80',
    productIds: INITIAL_PRODUCTS.filter(p => p.vendor === '77').map(p => p.id)
  },
  {
    id: 'cuba',
    title: 'CUBA Collection',
    description: 'Extremely strong dark pouches designed for maximum flavor and punch.',
    type: 'Manual',
    image: 'https://images.unsplash.com/photo-1511117496524-ec40f8069ff3?auto=format&fit=crop&w=500&q=80',
    productIds: INITIAL_PRODUCTS.filter(p => p.vendor === 'CUBA').map(p => p.id)
  },
  {
    id: 'clew',
    title: 'CLEW Collection',
    description: 'Fresh, compact, clean white pouches with natural flavorings.',
    type: 'Manual',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=500&q=80',
    productIds: INITIAL_PRODUCTS.filter(p => p.vendor === 'CLEW').map(p => p.id)
  },
  {
    id: 'killa',
    title: 'KILLA & VELO Collection',
    description: 'The world-famous heavy hitters you know and trust.',
    type: 'Manual',
    image: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?auto=format&fit=crop&w=500&q=80',
    productIds: INITIAL_PRODUCTS.filter(p => ['KILLA', 'VELO'].includes(p.vendor)).map(p => p.id)
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'CT48884',
    customerName: 'Hannah Warner',
    customerEmail: 'hannah.warner@gmail.com',
    tags: ['first_time'],
    fulfillmentStatus: 'Unfulfilled',
    total: 111.60,
    destination: 'Seattle, WA, US',
    date: 'Today at 10:28 pm',
    deliveryMethod: 'Free Shipping over $75 | 3-7+ Days',
    items: [
      { productId: '77-black-tea', productTitle: '77 Black Tea 10.4 mg', price: 4.99, quantity: 12 },
      { productId: '77-cola-cherry', productTitle: '77 Cola & Cherry 10.4 mg', price: 4.99, quantity: 10 }
    ]
  },
  {
    id: 'CT48882',
    customerName: 'Kayla Canty',
    customerEmail: 'kayla.canty@yahoo.com',
    tags: ['Subscription', 'Subscription Recurring Order'],
    fulfillmentStatus: 'Unfulfilled',
    total: 44.49,
    destination: 'Nahant, MA, US',
    date: 'Today at 9:09 pm',
    deliveryMethod: 'Standard Courier (3.99)',
    items: [
      { productId: 'clew-watermelon', productTitle: 'CLEW Watermelon 5 mg', price: 3.99, quantity: 10 }
    ]
  },
  {
    id: 'CT48880',
    customerName: 'Anna Martin',
    customerEmail: 'anna_martin@gmail.com',
    tags: ['Subscription', 'Subscription Recurring Order'],
    fulfillmentStatus: 'Unfulfilled',
    total: 40.50,
    destination: 'Seattle, WA, US',
    date: 'Today at 9:09 pm',
    deliveryMethod: 'Free Shipping over $75 | 3-7+ Days',
    items: [
      { productId: 'clew-spearmint', productTitle: 'CLEW Spearmint 5 mg', price: 3.99, quantity: 10 }
    ]
  },
  {
    id: 'CT48881',
    customerName: 'Autana Hogan',
    customerEmail: 'autana_h@hotmail.com',
    tags: ['Subscription', 'Subscription Recurring Order'],
    fulfillmentStatus: 'Unfulfilled',
    total: 54.49,
    destination: 'Missouri City, TX, US',
    date: 'Today at 9:09 pm',
    deliveryMethod: 'Shipping under $75 | 3-7+ Days',
    items: [
      { productId: 'cuba-watermelon', productTitle: 'CUBA Watermelon 43 mg', price: 5.50, quantity: 10 }
    ]
  },
  {
    id: 'CT48883',
    customerName: 'Kirsteen Jocson',
    customerEmail: 'kirsteen@outlook.com',
    tags: ['Subscription', 'Subscription Recurring Order'],
    fulfillmentStatus: 'Unfulfilled',
    total: 59.32,
    destination: 'Diamond Bar, CA, US',
    date: 'Today at 9:09 pm',
    deliveryMethod: 'Shipping under $75 | 3-7+ Days',
    items: [
      { productId: '77-ice-mint', productTitle: '77 Ice Mint 20 mg', price: 4.99, quantity: 12 }
    ]
  },
  {
    id: 'CT48879',
    customerName: 'Lora Watts',
    customerEmail: 'lorawatts88@gmail.com',
    tags: ['Subscription', 'Subscription Recurring Order'],
    fulfillmentStatus: 'Unfulfilled',
    total: 87.68,
    destination: 'San Antonio, TX, US',
    date: 'Today at 9:09 pm',
    deliveryMethod: 'Free Courier Flat rate',
    items: [
      { productId: 'cuba-yoghurt', productTitle: 'CUBA Yoghurt 43 mg', price: 5.50, quantity: 16 }
    ]
  },
  {
    id: 'CT48878',
    customerName: 'Elle Awai',
    customerEmail: 'elle_awai@me.com',
    tags: [],
    fulfillmentStatus: 'Unfulfilled',
    total: 227.17,
    destination: 'Kailua, HI, US',
    date: 'Today at 9:02 pm',
    deliveryMethod: 'Outer Zone Shipping',
    items: [
      { productId: 'velo-freeze', productTitle: 'VELO Freeze Max 17 mg', price: 4.80, quantity: 45 }
    ]
  },
  {
    id: 'CT48877',
    customerName: 'Kathy Smith',
    customerEmail: 'kathysmith@yahoo.com',
    tags: ['first_time', 'Lantern Quiz'],
    fulfillmentStatus: 'Unfulfilled',
    total: 90.00,
    destination: 'Bolton, NC, US',
    date: 'Today at 9:02 pm',
    deliveryMethod: 'Free Shipping over $75 | 3-7+ Days',
    items: [
      { productId: 'killa-cold-mint', productTitle: 'KILLA Cold Mint 16 mg', price: 4.50, quantity: 20 }
    ]
  },
  {
    id: 'CT48876',
    customerName: 'Renee Davis',
    customerEmail: 'reneedavis9@gmail.com',
    tags: ['Subscription', 'Subscription First Order'],
    fulfillmentStatus: 'Fulfilled',
    total: 49.04,
    destination: 'La Quinta, CA, US',
    date: 'Yesterday at 8:41 pm',
    deliveryMethod: 'Shipping under $75 | 3-7+ Days',
    items: [
      { productId: '77-watermelon', productTitle: '77 Watermelon 5.2 mg', price: 4.29, quantity: 11 }
    ]
  }
];

export const INITIAL_FILES: FileEntry[] = [
  {
    id: 'f1',
    fileName: 'Pictures_77_Black_Tea_Pouch.png',
    altText: '77 Black Tea Premium Can',
    dateAdded: 'Yesterday at 9:24 am',
    size: '386.71 KB',
    references: '1 product',
    url: 'https://images.unsplash.com/photo-1628114264219-5135347e3125?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'f2',
    fileName: 'Pictures_CUBA_Watermelon.png',
    altText: 'CUBA Watermelon 43mg Can Original Dark Pouch',
    dateAdded: 'Yesterday at 9:24 am',
    size: '372.78 KB',
    references: '1 product',
    url: 'https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'f3',
    fileName: 'banner_pouches_promo.jpg',
    altText: 'Pouch supply central display banner',
    dateAdded: 'Monday at 3:21 am',
    size: '4.12 MB',
    references: '2 themes',
    url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'f4',
    fileName: 'brand_77_logo.png',
    altText: '77 Brand emblem circle design',
    dateAdded: 'Thursday at 11:26 pm',
    size: '62.26 KB',
    references: '1 theme',
    url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=300&q=80'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust1',
    name: 'Hannah Warner',
    email: 'hannah.warner@gmail.com',
    subscriptionStatus: 'Not subscribed',
    location: 'Seattle WA, United States',
    ordersCount: 1,
    amountSpent: 111.60,
    addresses: ['1034 Pine Street, Seattle, WA, 98101, US'],
    wishlist: ['77-black-tea']
  },
  {
    id: 'cust2',
    name: 'Sandra Kaneshiro',
    email: 'sandra.k@gmail.com',
    subscriptionStatus: 'Subscribed',
    location: 'Honolulu HI, United States',
    ordersCount: 0,
    amountSpent: 0.00,
    addresses: ['454 Kalakaua Highway, Honolulu, HI, 96815, US'],
    wishlist: []
  },
  {
    id: 'cust3',
    name: 'Nhat Nguyen',
    email: 'nhat.nguyen@yahoo.com',
    subscriptionStatus: 'Subscribed',
    location: 'Affton MO, United States',
    ordersCount: 1,
    amountSpent: 49.09,
    addresses: ['8809 Gravois Road, Affton, MO, 63123, US'],
    wishlist: ['clew-cool-mint']
  },
  {
    id: 'cust4',
    name: 'Kayla Canty',
    email: 'kayla.canty@yahoo.com',
    subscriptionStatus: 'Subscribed',
    location: 'Nahant MA, United States',
    ordersCount: 53,
    amountSpent: 2261.20,
    addresses: ['42 Castle Road, Nahant, MA, 01908, US'],
    wishlist: ['clew-watermelon', 'cuba-watermelon']
  },
  {
    id: 'cust5',
    name: 'Lora Watts',
    email: 'lorawatts88@gmail.com',
    subscriptionStatus: 'Subscribed',
    location: 'San Antonio TX, United States',
    ordersCount: 25,
    amountSpent: 1766.59,
    addresses: ['1208 San Pedro Ave, San Antonio, TX, 78212, US'],
    wishlist: []
  }
];

export const INITIAL_DISCOUNTS: Discount[] = [
  {
    id: 'disc1',
    title: 'IG-EMAIL-2KGTGY7W',
    status: 'Active',
    method: '1 code',
    eligibility: 'Megan Matsuoka',
    type: 'Amount off order',
    used: 0,
    details: '15% off one-time purchase products'
  },
  {
    id: 'disc2',
    title: 'CRUSHCLUB15',
    status: 'Active',
    method: 'Code',
    eligibility: 'All customers',
    type: 'Amount off order',
    used: 12,
    details: '15% off one-time purchase products'
  },
  {
    id: 'disc3',
    title: 'FB-EMAIL-T5BUAMU3',
    status: 'Active',
    method: '1 code',
    eligibility: 'yang_joua@yahoo.com',
    type: 'Amount off order',
    used: 0,
    details: '15% off one-time purchase products'
  },
  {
    id: 'disc4',
    title: 'FB-EMAIL-W2CITL93',
    status: 'Active',
    method: '1 code',
    eligibility: 'nora_nume@hotmail.com',
    type: 'Amount off order',
    used: 0,
    details: '15% off one-time purchase products'
  }
];

export const DEFAULT_PAGES: CustomPage[] = [
  {
    id: 'subscribe',
    title: 'Subscribe Package Builder',
    slug: 'subscribe',
    visibility: 'Visible',
    updatedAt: 'Jun 10, 2026',
    sections: [
      {
        id: 's1',
        type: 'Rich text',
        settings: {
          fullWidth: false,
          backgroundColor: '#FFFFFF',
          headingColor: '#1E293B',
          textColor: '#64748B',
          title: 'Custom Subscription Plans',
          description: 'Access premium rates on your favorite nicotine pouches. Create a subscription box, pick your frequency, and modify or cancel anytime.',
        }
      }
    ]
  },
  {
    id: 'brands',
    title: 'All Brands Directory',
    slug: 'brands',
    visibility: 'Visible',
    updatedAt: 'Jun 8, 2026',
    sections: [
      {
        id: 's2',
        type: 'Logo list',
        settings: {
          fullWidth: false,
          backgroundColor: '#F8FAFC',
          headingColor: '#0F172A',
          textColor: '#334155',
          title: 'Official Partners & Brands',
          description: 'Explore curated collection boxes from premium high-grade nicotine/energy pouch producers.'
        }
      }
    ]
  }
];
