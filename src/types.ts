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
}

export interface Collection {
  id: string;
  title: string;
  description: string;
  type: 'Manual' | 'Smart';
  image: string;
  productIds: string[];
  productConditions?: string; // string explaining the conditions
}

export interface Order {
  id: string; // e.g. CT48884
  customerName: string;
  customerEmail: string;
  tags: string[];
  fulfillmentStatus: 'Unfulfilled' | 'Fulfilled' | 'Delivered';
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
  type: 'Image banner' | 'Video banner' | 'Image with text' | 'Text column with image' | 'Rich text' | 'Marquee text' | 'Marquee images' | 'Logo list' | 'Collection list' | 'Featured collection' | 'Images gallery' | 'FAQs' | 'Slideshow';
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
