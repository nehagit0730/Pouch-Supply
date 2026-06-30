import { Product, Collection, Order, FileEntry, Customer, Discount, CustomPage, BlogPost } from './types';

export const INITIAL_PRODUCTS: Product[] = [];
export const INITIAL_COLLECTIONS: Collection[] = [];
export const INITIAL_ORDERS: Order[] = [];
export const INITIAL_FILES: FileEntry[] = [];
export const INITIAL_CUSTOMERS: Customer[] = [];
export const INITIAL_DISCOUNTS: Discount[] = [];
export const INITIAL_BLOGS: BlogPost[] = [];

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
