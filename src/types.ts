export interface ProductVariant {
  id: string;
  name: string; // e.g. "Size", "Strength"
  values: string[]; // e.g. ["Medium", "Large"]
}

export interface VariantDetail {
  id: string; // Every product variant should have its own unique Product ID
  name: string; // Combination name, e.g. "Tropical Punch"
  price: number;
  inventory: number;
  description: string;
  images: string[]; // Upload different images for each variant
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  compareAtPrice: number;
  inventory: number;
  sku: string;
  category: string;
  vendor: string; // Brand name (e.g. 77, CUBA, CLEW, etc.)
  status: 'Active' | 'Draft' | 'Archived' | 'Unlisted';
  image: string;
  weight: number;
  tags: string[];
  media?: string[]; // Multiple media URLs
  variants?: ProductVariant[]; // Option list matching Shopify-style variants
  concreteVariants?: VariantDetail[]; // Custom physical variant details
  barcode?: string;
  weightUnit?: string; // 'g' | 'kg' | 'oz' | 'lb'
  slug?: string;
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Collection {
  id: string;
  title: string;
  description: string;
  type: 'Manual' | 'Smart';
  image: string;
  productIds: string[];
  productConditions?: string; // string explaining the conditions
  slug?: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Order {
  id: string; // e.g. CT48884
  customerName: string;
  customerEmail: string;
  tags: string[];
  fulfillmentStatus: 'Unfulfilled' | 'Fulfilled' | 'Delivered';
  paymentStatus?: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
  worldpayTxId?: string;
  worldpayAuthCode?: string;
  cardBrand?: string;
  total: number;
  destination: string;
  date: string; // e.g. Today at 10:28 pm
  deliveryMethod: string;
  items: {
    productId: string;
    productTitle: string;
    price: number;
    quantity: number;
    image?: string;
  }[];
}

export interface FileEntry {
  id: string;
  fileName: string;
  altText: string;
  dateAdded: string;
  size: string;
  references: string;
  url: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  subscriptionStatus: 'Subscribed' | 'Not subscribed' | 'Unsubscribed';
  location: string;
  ordersCount: number;
  amountSpent: number;
  addresses: string[];
  wishlist: string[]; // Product IDs
}

export interface Discount {
  id: string;
  title: string; // Code name, e.g. CRUSHCLUB15
  status: 'Active' | 'Expired';
  method: string; // e.g. "Code", "1 code"
  eligibility: string; // e.g. "All customers", email
  type: 'Amount off products' | 'Buy X get Y' | 'Amount off order' | 'Free shipping';
  used: number;
  details: string; // e.g. "15% off one-time purchase products"
}

export interface PageSection {
  id: string;
  type: 'Image banner' | 'Video banner' | 'Image with text' | 'Text column with image' | 'Rich text' | 'Marquee text' | 'Marquee images' | 'Logo list' | 'Collection list' | 'Featured collection' | 'Images gallery' | 'FAQs' | 'Slideshow' | 'Blog post' | 'Brand list';
  settings: {
    fullWidth: boolean;
    backgroundColor: string; // hex
    headingColor: string; // hex
    textColor: string; // hex
    title?: string;
    description?: string;
    buttonText?: string;
    buttonLink?: string;
    imageUrl?: string;
    videoUrl?: string;
    videoEmbed?: string;
    marqueeSpeed?: number;
    itemsCount?: number;
    selectedCollectionId?: string;
    selectedCollectionIds?: string[];
    columnsDesktop?: number;
    columnsMobile?: number;
    brandItems?: {
      imageUrl: string;
      linkUrl: string;
      title?: string;
    }[];
    slides?: {
      title: string;
      description: string;
      imageUrl: string;
      buttonText: string;
      buttonLink: string;
    }[];
  };
  blocks?: any[]; // for columns, items, faqs etc.
}

export interface CustomPage {
  id: string;
  title: string;
  slug: string;
  visibility: 'Visible' | 'Hidden';
  updatedAt: string;
  sections: PageSection[];
  isHomepage?: boolean;
}

export interface CartItem {
  productId: string;
  productTitle: string;
  price: number;
  image: string;
  quantity: number;
  vendor: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  category: string;
  status: 'Active' | 'Draft' | 'Archived';
  publishedAt: string;
  readTime: string;
  tags: string[];
}
