import { Product, Collection, Order, FileEntry, Customer, Discount, CustomPage, BlogPost } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '77-black-tea',
    title: '77 Black Tea 10.4 mg',
    description: 'A robust and elegant blend of cured black tea leaves with a touch of deep botanical notes. Formulated with top-tier active compounds.',
    price: 4.80,
    compareAtPrice: 5.50,
    inventory: 154,
    sku: '77-BLK-TEA-10',
    category: 'Botanical',
    vendor: '77',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=400&q=80',
    weight: 15,
    tags: ['77', 'bestseller', 'black-tea', 'strong'],
    slug: '77-black-tea',
    variants: [
      { id: 'v1', name: 'Pack Size', values: ['Single Can', '5-Pack (Save 10%)', '10-Pack (Save 20%)'] }
    ]
  },
  {
    id: '77-cola-cherry',
    title: '77 Cola & Cherry 10.4 mg',
    description: 'Spirited, fizzy cola notes offset by sweet, ripe wild cherries. A nostalgic and refreshing sensory release.',
    price: 4.80,
    compareAtPrice: 5.50,
    inventory: 92,
    sku: '77-COLA-CHERRY-10',
    category: 'Fruit & Cola',
    vendor: '77',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80',
    weight: 15,
    tags: ['77', 'cola', 'cherry'],
    slug: '77-cola-cherry',
    variants: [
      { id: 'v2', name: 'Pack Size', values: ['Single Can', '5-Pack (Save 10%)', '10-Pack (Save 20%)'] }
    ]
  },
  {
    id: '77-watermelon',
    title: '77 Watermelon 5.2 mg',
    description: 'Crisp, summery watermelon with moderate active mg concentration. Pure sweetness with balanced moisture levels.',
    price: 4.50,
    compareAtPrice: 5.20,
    inventory: 240,
    sku: '77-WMLN-5',
    category: 'Fruit',
    vendor: '77',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=400&q=80',
    weight: 15,
    tags: ['77', 'watermelon', 'fruit'],
    slug: '77-watermelon',
    variants: [
      { id: 'v3', name: 'Pack Size', values: ['Single Can', '5-Pack (Save 10%)', '10-Pack (Save 20%)'] }
    ]
  },
  {
    id: '77-raspberry',
    title: '77 Raspberry 5.2 mg',
    description: 'Delectable and juicy field-grown raspberries with a soft throat bite. Perfect for daily active refreshment.',
    price: 4.50,
    compareAtPrice: 5.20,
    inventory: 110,
    sku: '77-RAS-5',
    category: 'Fruit',
    vendor: '77',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80',
    weight: 15,
    tags: ['77', 'raspberry', 'fruit'],
    slug: '77-raspberry',
    variants: [
      { id: 'v4', name: 'Pack Size', values: ['Single Can', '5-Pack (Save 10%)', '10-Pack (Save 20%)'] }
    ]
  },
  {
    id: '77-melon-mint',
    title: '77 Melon Mint 5.2 mg',
    description: 'A chilled fusion of sweet honeydew melon sliced with crisp peppermint crystals.',
    price: 4.60,
    compareAtPrice: 5.30,
    inventory: 185,
    sku: '77-MEL-MNT-5',
    category: 'Mint & Fruit',
    vendor: '77',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=400&q=80',
    weight: 15,
    tags: ['77', 'melon', 'mint'],
    slug: '77-melon-mint',
    variants: [
      { id: 'v5', name: 'Pack Size', values: ['Single Can', '5-Pack (Save 10%)', '10-Pack (Save 20%)'] }
    ]
  },
  {
    id: '77-ice-mint',
    title: '77 Ice Mint 20 mg',
    description: 'An aggressive, deep-freeze formulation of sub-zero menthol crystals designed for experienced consumers.',
    price: 4.90,
    compareAtPrice: 5.80,
    inventory: 310,
    sku: '77-ICE-MNT-20',
    category: 'Mint',
    vendor: '77',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1599305090598-615257902657?auto=format&fit=crop&w=400&q=80',
    weight: 15,
    tags: ['77', 'ice', 'mint', 'strong'],
    slug: '77-ice-mint',
    variants: [
      { id: 'v6', name: 'Pack Size', values: ['Single Can', '5-Pack (Save 10%)', '10-Pack (Save 20%)'] }
    ]
  },
  {
    id: '77-forest-fruits',
    title: '77 Forest Fruits 5.2 mg',
    description: 'Wild forest berries—redcurrants, blackberries, and blueberries—intertwined for an organic tart flavour.',
    price: 4.50,
    compareAtPrice: 5.20,
    inventory: 145,
    sku: '77-FRST-FRT-5',
    category: 'Fruit',
    vendor: '77',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80',
    weight: 15,
    tags: ['77', 'forest', 'fruit'],
    slug: '77-forest-fruits',
    variants: [
      { id: 'v7', name: 'Pack Size', values: ['Single Can', '5-Pack (Save 10%)', '10-Pack (Save 20%)'] }
    ]
  },
  {
    id: '77-ghost-onion',
    title: '77 Ghost Onion 20 mg',
    description: 'An intriguing, highly experimental compilation flavor combining trace onion essence with sweet, hot spice.',
    price: 5.20,
    compareAtPrice: 6.00,
    inventory: 45,
    sku: '77-GHST-ON-20',
    category: 'Savory & Unique',
    vendor: '77',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
    weight: 15,
    tags: ['77', 'onion', 'savory', 'new-arrivals'],
    slug: '77-ghost-onion',
    variants: [
      { id: 'v8', name: 'Pack Size', values: ['Single Can', '5-Pack (Save 10%)', '10-Pack (Save 20%)'] }
    ]
  },
  {
    id: 'cuba-watermelon',
    title: 'CUBA Watermelon 43 mg',
    description: 'Extreme-strength dark pouch formulation of deep watermelon candy notes. Intense release, strictly for heavy users.',
    price: 4.90,
    compareAtPrice: 5.90,
    inventory: 104,
    sku: 'CUBA-WMLN-43',
    category: 'Fruit & Strong',
    vendor: 'CUBA',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=400&q=80',
    weight: 18,
    tags: ['cuba', 'watermelon', 'bestseller', 'strong'],
    slug: 'cuba-watermelon',
    variants: [
      { id: 'v9', name: 'Pack Size', values: ['Single Can', '5-Pack (Save 10%)', '10-Pack (Save 20%)'] }
    ]
  },
  {
    id: 'cuba-tropical',
    title: 'CUBA Tropical Fruit 43 mg',
    description: 'Passion fruit, mango, and tangy pineapple pressed with heavy active mg elements. Rich tropical breeze.',
    price: 4.90,
    compareAtPrice: 5.90,
    inventory: 120,
    sku: 'CUBA-TRP-43',
    category: 'Fruit & Strong',
    vendor: 'CUBA',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=400&q=80',
    weight: 18,
    tags: ['cuba', 'tropical', 'strong'],
    slug: 'cuba-tropical',
    variants: [
      { id: 'v10', name: 'Pack Size', values: ['Single Can', '5-Pack (Save 10%)', '10-Pack (Save 20%)'] }
    ]
  },
  {
    id: 'cuba-yoghurt',
    title: 'CUBA Yoghurt 43 mg',
    description: 'A highly unusual, velvety compilation featuring greek yoghurt creaminess paired with cold high-intensity active compounds.',
    price: 5.00,
    compareAtPrice: 6.00,
    inventory: 74,
    sku: 'CUBA-YOG-43',
    category: 'Creamy & Strong',
    vendor: 'CUBA',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80',
    weight: 18,
    tags: ['cuba', 'yoghurt', 'creamy', 'strong'],
    slug: 'cuba-yoghurt',
    variants: [
      { id: 'v11', name: 'Pack Size', values: ['Single Can', '5-Pack (Save 10%)', '10-Pack (Save 20%)'] }
    ]
  },
  {
    id: 'cuba-double-fresh',
    title: 'CUBA Double Fresh 43 mg',
    description: 'Double shot of crisp wintergreen menthol paired with heavy active release. Maximum kick.',
    price: 4.90,
    compareAtPrice: 5.90,
    inventory: 195,
    sku: 'CUBA-DBL-43',
    category: 'Mint & Strong',
    vendor: 'CUBA',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1599305090598-615257902657?auto=format&fit=crop&w=400&q=80',
    weight: 18,
    tags: ['cuba', 'double', 'fresh', 'strong'],
    slug: 'cuba-double-fresh',
    variants: [
      { id: 'v12', name: 'Pack Size', values: ['Single Can', '5-Pack (Save 10%)', '10-Pack (Save 20%)'] }
    ]
  },
  {
    id: 'cuba-cherry',
    title: 'CUBA Cherry 43 mg',
    description: 'Sweet, rich dark cherries matching the heavy, slower salivary compounding standard of CUBA pouches.',
    price: 4.90,
    compareAtPrice: 5.90,
    inventory: 132,
    sku: 'CUBA-CHRY-43',
    category: 'Fruit & Strong',
    vendor: 'CUBA',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=400&q=80',
    weight: 18,
    tags: ['cuba', 'cherry', 'strong'],
    slug: 'cuba-cherry',
    variants: [
      { id: 'v13', name: 'Pack Size', values: ['Single Can', '5-Pack (Save 10%)', '10-Pack (Save 20%)'] }
    ]
  },
  {
    id: 'cuba-banana-hit',
    title: 'CUBA Banana Hit 43 mg',
    description: 'Creamy, sweet foam banana infusion with intensive extreme active vectors. A robust sweet treat.',
    price: 5.10,
    compareAtPrice: 6.20,
    inventory: 88,
    sku: 'CUBA-BANA-43',
    category: 'Fruit & Strong',
    vendor: 'CUBA',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80',
    weight: 18,
    tags: ['cuba', 'banana', 'strong', 'new-arrivals'],
    slug: 'cuba-banana-hit',
    variants: [
      { id: 'v14', name: 'Pack Size', values: ['Single Can', '5-Pack (Save 10%)', '10-Pack (Save 20%)'] }
    ]
  },
  {
    id: 'clew-watermelon',
    title: 'CLEW Watermelon 5 mg',
    description: 'Light, gentle active concentration wrapped in slim, soft-fibre organic bags. Clean fruit essence.',
    price: 3.90,
    compareAtPrice: 4.80,
    inventory: 250,
    sku: 'CLEW-WMLN-5',
    category: 'Fruit Lite',
    vendor: 'CLEW',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=400&q=80',
    weight: 12,
    tags: ['clew', 'watermelon', 'bestseller', 'light'],
    slug: 'clew-watermelon',
    variants: [
      { id: 'v15', name: 'Pack Size', values: ['Single Can', '5-Pack (Save 10%)', '10-Pack (Save 20%)'] }
    ]
  },
  {
    id: 'clew-spearmint',
    title: 'CLEW Spearmint 5 mg',
    description: 'Crisp spearmint leaves giving off a gentle sweet herbal coolness. Zero harshness.',
    price: 3.90,
    compareAtPrice: 4.80,
    inventory: 180,
    sku: 'CLEW-SPR-5',
    category: 'Mint Lite',
    vendor: 'CLEW',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80',
    weight: 12,
    tags: ['clew', 'spearmint', 'mint', 'light'],
    slug: 'clew-spearmint',
    variants: [
      { id: 'v16', name: 'Pack Size', values: ['Single Can', '5-Pack (Save 10%)', '10-Pack (Save 20%)'] }
    ]
  },
  {
    id: 'clew-cool-mint',
    title: 'CLEW Cool Mint 20 mg',
    description: 'The highest-intensity CLEW variant: a robust cooling peppermint blast in a slim clean pouch.',
    price: 4.10,
    compareAtPrice: 4.90,
    inventory: 164,
    sku: 'CLEW-MNT-20',
    category: 'Mint',
    vendor: 'CLEW',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1599305090598-615257902657?auto=format&fit=crop&w=400&q=80',
    weight: 12,
    tags: ['clew', 'cool', 'mint'],
    slug: 'clew-cool-mint',
    variants: [
      { id: 'v17', name: 'Pack Size', values: ['Single Can', '5-Pack (Save 10%)', '10-Pack (Save 20%)'] }
    ]
  },
  {
    id: 'clew-coffee',
    title: 'CLEW Coffee 5 mg',
    description: 'A smooth, rich dark-roasted espresso note with an elegant, velvety cream finish.',
    price: 4.00,
    compareAtPrice: 4.85,
    inventory: 90,
    sku: 'CLEW-COF-5',
    category: 'Savory & Unique',
    vendor: 'CLEW',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
    weight: 12,
    tags: ['clew', 'coffee', 'savory', 'new-arrivals'],
    slug: 'clew-coffee',
    variants: [
      { id: 'v18', name: 'Pack Size', values: ['Single Can', '5-Pack (Save 10%)', '10-Pack (Save 20%)'] }
    ]
  },
  {
    id: 'killa-cold-mint',
    title: 'KILLA Cold Mint 16 mg',
    description: 'The legendary premium menthol standard from Siberia. Consistent release, clean composition.',
    price: 4.60,
    compareAtPrice: 5.40,
    inventory: 410,
    sku: 'KLA-ICE-16',
    category: 'Mint Strong',
    vendor: 'KILLA',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1599305090598-615257902657?auto=format&fit=crop&w=400&q=80',
    weight: 16,
    tags: ['killa', 'cold', 'mint', 'strong'],
    slug: 'killa-cold-mint',
    variants: [
      { id: 'v19', name: 'Pack Size', values: ['Single Can', '5-Pack (Save 10%)', '10-Pack (Save 20%)'] }
    ]
  },
  {
    id: 'killa-blueberry',
    title: 'KILLA Blueberry 16 mg',
    description: 'Wild siberian blueberries blended with classic sub-zero cooling. Rich, sweet, and strong.',
    price: 4.60,
    compareAtPrice: 5.40,
    inventory: 230,
    sku: 'KLA-BLUE-16',
    category: 'Fruit Strong',
    vendor: 'KILLA',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=400&q=80',
    weight: 16,
    tags: ['killa', 'blueberry', 'strong'],
    slug: 'killa-blueberry',
    variants: [
      { id: 'v20', name: 'Pack Size', values: ['Single Can', '5-Pack (Save 10%)', '10-Pack (Save 20%)'] }
    ]
  },
  {
    id: 'velo-freeze',
    title: 'VELO Freeze Max 17 mg',
    description: 'Peppermint and freezing menthol paired with high bio-active release speeds. The premium UK favorite.',
    price: 5.50,
    compareAtPrice: 6.50,
    inventory: 350,
    sku: 'VELO-FRZ-17',
    category: 'Mint Strong',
    vendor: 'VELO',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=400&q=80',
    weight: 16,
    tags: ['velo', 'freeze', 'bestseller', 'strong'],
    slug: 'velo-freeze',
    variants: [
      { id: 'v21', name: 'Pack Size', values: ['Single Can', '5-Pack (Save 10%)', '10-Pack (Save 20%)'] }
    ]
  }
];

export const INITIAL_COLLECTIONS: Collection[] = [
  {
    id: 'all',
    title: 'Shop All Pouches',
    description: 'Browse the entire world-class compounding catalog of certified pouches.',
    type: 'Smart',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=500&q=80',
    productIds: [
      '77-black-tea', '77-cola-cherry', '77-watermelon', '77-raspberry', '77-melon-mint', '77-ice-mint', '77-forest-fruits', '77-ghost-onion',
      'cuba-watermelon', 'cuba-tropical', 'cuba-yoghurt', 'cuba-double-fresh', 'cuba-cherry', 'cuba-banana-hit',
      'clew-watermelon', 'clew-spearmint', 'clew-cool-mint', 'clew-coffee',
      'killa-cold-mint', 'killa-blueberry', 'velo-freeze'
    ],
    slug: 'all'
  },
  {
    id: '77',
    title: '77 Collection',
    description: 'Sleek and versatile botanical pouch compounds of varying active counts.',
    type: 'Manual',
    image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=500&q=80',
    productIds: ['77-black-tea', '77-cola-cherry', '77-watermelon', '77-raspberry', '77-melon-mint', '77-ice-mint', '77-forest-fruits', '77-ghost-onion'],
    slug: '77'
  },
  {
    id: 'cuba',
    title: 'CUBA Collection',
    description: 'High-intensity heavy compilation lines designed for extreme conditions.',
    type: 'Manual',
    image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=500&q=80',
    productIds: ['cuba-watermelon', 'cuba-tropical', 'cuba-yoghurt', 'cuba-double-fresh', 'cuba-cherry', 'cuba-banana-hit'],
    slug: 'cuba'
  },
  {
    id: 'clew',
    title: 'CLEW Collection',
    description: 'Light, organic, soft-acting compounds featuring delicate infusions.',
    type: 'Manual',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=500&q=80',
    productIds: ['clew-watermelon', 'clew-spearmint', 'clew-cool-mint', 'clew-coffee'],
    slug: 'clew'
  },
  {
    id: 'killa',
    title: 'KILLA & VELO Collection',
    description: 'Siberian cold line-ups and global bestseller high-strength standards.',
    type: 'Manual',
    image: 'https://images.unsplash.com/photo-1599305090598-615257902657?auto=format&fit=crop&w=500&q=80',
    productIds: ['killa-cold-mint', 'killa-blueberry', 'velo-freeze'],
    slug: 'killa'
  },
  {
    id: 'bestseller',
    title: 'Bestseller',
    description: 'Highly demanded, fastest circulating lines with exceptional customer scores.',
    type: 'Smart',
    image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=500&q=80',
    productIds: ['77-black-tea', 'cuba-watermelon', 'velo-freeze', 'clew-watermelon'],
    slug: 'bestseller'
  },
  {
    id: 'best-seller',
    title: 'Best Seller',
    description: 'Fast moving popular catalog items.',
    type: 'Smart',
    image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=500&q=80',
    productIds: ['77-black-tea', 'cuba-watermelon', 'velo-freeze', 'clew-watermelon'],
    slug: 'best-seller'
  },
  {
    id: 'new-arrivals',
    title: 'New Arrivals',
    description: 'Formulated and cataloged fresh compounds off the manufacturing floor.',
    type: 'Smart',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=500&q=80',
    productIds: ['77-ghost-onion', 'cuba-banana-hit', 'clew-coffee'],
    slug: 'new-arrivals'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'CT48884',
    customerName: 'Kayla Canty',
    customerEmail: 'kayla@pouchclub.co.uk',
    tags: ['Compounded Pouch', 'Loyalty Tier'],
    fulfillmentStatus: 'Delivered',
    total: 24.30,
    destination: 'United Kingdom',
    date: 'Jun 22, 2026 at 4:18 pm',
    deliveryMethod: 'Royal Mail Tracked 24',
    items: [
      {
        productId: 'velo-freeze',
        productTitle: 'VELO Freeze Max 17 mg',
        price: 5.50,
        quantity: 3,
        image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=150&q=80'
      },
      {
        productId: '77-black-tea',
        productTitle: '77 Black Tea 10.4 mg',
        price: 4.80,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=150&q=80'
      }
    ]
  }
];

export const INITIAL_FILES: FileEntry[] = [
  {
    id: 'file-1',
    fileName: 'black-tea-box.png',
    altText: 'Sleek dark circular tea composite can',
    dateAdded: 'Jun 20, 2026',
    size: '142 KB',
    references: 'Used on 77 Black Tea product pages',
    url: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'file-2',
    fileName: 'cuba-watermelon.png',
    altText: 'Vivid red high concentration 43mg tin',
    dateAdded: 'Jun 22, 2026',
    size: '188 KB',
    references: 'Used on CUBA Watermelon product pages',
    url: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=400&q=80'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'James Mercer',
    email: 'james@pouch-supply.com',
    subscriptionStatus: 'Not subscribed',
    location: 'United Kingdom',
    ordersCount: 1,
    amountSpent: 24.00,
    addresses: ['12 Baker St, London NW1 6XE, United Kingdom'],
    wishlist: []
  },
  {
    id: 'cust-2',
    name: 'Clara Sterling',
    email: 'clara@pouch-supply.com',
    subscriptionStatus: 'Subscribed',
    location: 'United Kingdom',
    ordersCount: 3,
    amountSpent: 114.50,
    addresses: ['77 Princes St, Edinburgh EH2 2ER, United Kingdom'],
    wishlist: ['clew-spearmint']
  },
  {
    id: 'cust-3',
    name: 'Sarah Jenkins',
    email: 'sarah@pouch-supply.com',
    subscriptionStatus: 'Unsubscribed',
    location: 'United Kingdom',
    ordersCount: 0,
    amountSpent: 0.00,
    addresses: [],
    wishlist: []
  },
  {
    id: 'cust-4',
    name: 'Kayla Canty',
    email: 'kayla@pouchclub.co.uk',
    subscriptionStatus: 'Subscribed',
    location: 'United Kingdom',
    ordersCount: 4,
    amountSpent: 82.50,
    addresses: ['42 Primrose Lane, Birmingham B15 2QX, United Kingdom'],
    wishlist: ['velo-freeze', '77-black-tea']
  }
];

export const INITIAL_DISCOUNTS: Discount[] = [
  {
    id: 'disc-1',
    title: 'CRUSHCLUB15',
    status: 'Active',
    method: 'Code',
    eligibility: 'All customers',
    type: 'Amount off products',
    used: 42,
    details: '15% off subscription boxes and standard pouch packs'
  },
  {
    id: 'disc-2',
    title: 'FREESHIP',
    status: 'Active',
    method: 'Code',
    eligibility: 'All customers',
    type: 'Free shipping',
    used: 120,
    details: 'Free tracked delivery for order weights above 100g'
  }
];

export const INITIAL_BLOGS: BlogPost[] = [
  {
    id: 'b1',
    title: 'The Science of pH in Compounding Nicotine Pouches',
    slug: 'the-science-of-ph-in-compounding-nicotine-pouches',
    excerpt: 'How alkaline modifiers like sodium carbonate affect bioavailability and sensory release parameters.',
    content: `Nicotine absorption through oral mucosa relies heavily on pH levels. Raw nicotine salts are typically acidic, which slows physiological uptake. 

By strategically introducing safe, food-grade alkaline modifiers—such as sodium carbonate and sodium bicarbonate—manufacturers balance compound stability. This chemistry stabilizes chemical vectors and ensures a premium, controlled salivary absorption curve.

### Cellular Transport Mechanism
Our research indicates that freebase structures cross mucosal barriers around 400% more rapidly than ionized counterparts. Maintaining a steady compound pH of 7.8 to 8.2 yields an optimal sensorial release without chemical deterioration of natural organic materials inside the pouch.`,
    category: 'Chemistry & Science',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=500&q=80',
    author: 'Dr. Marcus Vance',
    publishedAt: 'Jun 20, 2026',
    readTime: '6 min read',
    tags: ['pH balance', 'bioavailability', 'organic-chemistry']
  },
  {
    id: 'b2',
    title: 'Which Nicotine Strength is Right for You? A Clinician Guide',
    slug: 'which-nicotine-strength-is-right-for-you-a-clinician-guide',
    excerpt: 'Navigating active mg counts from soft 5mg CLEW pouches to extreme 43mg CUBA canisters safely.',
    content: `Selecting the right compounds can make an immense difference in your long-term success of vaping/smoking cessation models.

For light social patterns, we highly advise starting with lighter formulations (e.g., 5.0 mg to 10.0 mg counts typical of CLEW and 77 entry-level lines). These lighter formulations deliver clean organic flavor notes without sudden salivary saturation peaks.

### High Strength Parameters
Advanced clients accustomed to high-count compounds typically navigate toward KILLA (16.0 mg) or premium CUBA (43.0 mg) canisters. However, high active counts require disciplined holding times and proper salivation controls to avoid throat bite.`,
    category: 'Buying Guides',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=500&q=80',
    author: 'Clara Oswald, RPh',
    publishedAt: 'Jun 18, 2026',
    readTime: '8 min read',
    tags: ['buying-advice', 'cuba-strength', 'pouch-science']
  }
];

export const DEFAULT_PAGES: CustomPage[] = [
  {
    id: 'homepage',
    title: 'Home Page',
    slug: '',
    visibility: 'Visible',
    updatedAt: 'Jun 23, 2026',
    isHomepage: true,
    sections: [
      {
        id: 'h-s1',
        type: 'Image banner',
        settings: {
          fullWidth: true,
          backgroundColor: '#111827',
          headingColor: '#FFFFFF',
          textColor: '#E5E7EB',
          title: 'Pouch Supply Storefront',
          description: 'Start managing your products, collections, and page sections inside the Admin Dashboard.',
          buttonText: 'View Store Catalog',
          buttonLink: 'frontend-shop',
          imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=80'
        }
      }
    ]
  },
  {
    id: 'subscribe',
    title: 'Subscription Builder',
    slug: 'subscribe',
    visibility: 'Visible',
    updatedAt: 'Jun 23, 2026',
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
          description: 'Access premium rates on your favorite products. Create a customized subscription box, select your automatic replenishment frequency, and modify or cancel anytime.',
        }
      }
    ]
  },
  {
    id: 'brands',
    title: 'Brands Directory',
    slug: 'brands',
    visibility: 'Visible',
    updatedAt: 'Jun 23, 2026',
    sections: [
      {
        id: 's2',
        type: 'Rich text',
        settings: {
          fullWidth: false,
          backgroundColor: '#FFFFFF',
          headingColor: '#1E293B',
          textColor: '#64748B',
          title: 'Official Brands Matrix',
          description: 'Explore our catalog of certified compounding premium brands retrieved directly from our synchronized database.',
        }
      }
    ]
  }
];
