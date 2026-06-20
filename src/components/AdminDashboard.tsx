import React, { useState, useMemo } from 'react';
import { Product, Collection, Order, FileEntry, Customer, Discount, CustomPage, PageSection, BlogPost } from '../types';
import { 
  TrendingUp, BarChart3, Package, Users, Tag, FileCode, HardDrive, Percent, 
  Search, Plus, Eye, CheckCircle2, Clipboard, ArrowUpDown, ChevronRight, 
  Trash2, Filter, Save, Sparkles, Building, Settings, Image as ImageIcon, 
  X, MoveUp, MoveDown, Layout, Globe, Mail, DollarSign, ShoppingBag, EyeOff, RefreshCw,
  Columns, Grid, Video, HelpCircle, FolderHeart, Layers, Award, PlaySquare, Compass,
  ChevronDown, ChevronUp, Star, Heart, FileText, BookOpen, LayoutGrid
} from 'lucide-react';
import ImageUploadInput from './ImageUploadInput';
import CollectionEditor from './CollectionEditor';
import ProductEditor from './ProductEditor';

export const AVAILABLE_SECTION_TEMPLATES = [
  { type: 'Image banner', label: 'Image Banner', desc: 'Hero banner with centered headline overlay & CTA buttons', icon: 'ImageIcon' },
  { type: 'Image with text', label: 'Image with Text', desc: 'Beautifully-aligned structural image with side description', icon: 'Columns' },
  { type: 'Text column with image', label: 'Text Grid with Images', desc: 'Three-column display grid showing core brand standards', icon: 'Grid' },
  { type: 'Featured collection', label: 'Featured Products', desc: 'Interactive storefront product card grid with live data', icon: 'ShoppingBag' },
  { type: 'Collection list', label: 'Collection Grid', desc: 'Display all available categorized nicotine canister series', icon: 'FolderHeart' },
  { type: 'Slideshow', label: 'Slideshow Slider', desc: 'Smooth horizontal multi-slide sliding carousel banner', icon: 'PlaySquare' },
  { type: 'Video banner', label: 'Video Showcase', desc: 'Cinematic YouTube player showcasing laboratory workflows', icon: 'Video' },
  { type: 'Rich text', label: 'Rich Editorial Details', desc: 'Focussed header with spacious text for brand newsletters', icon: 'FileText' },
  { type: 'Marquee text', label: 'Scrolling News Ribbon', desc: 'Fast, animated horizontal news marquee with key notices', icon: 'Sparkles' },
  { type: 'Marquee images', label: 'Active Product Reel', desc: 'Dynamic ticker reel demonstrating recently stocked canisters', icon: 'Layers' },
  { type: 'Logo list', label: 'Clinical Partners Registry', desc: 'Official partnered distributors and reseller banners', icon: 'Award' },
  { type: 'Images gallery', label: 'Production Facility Gallery', desc: 'Scenic four-column gallery of clean compounding rooms', icon: 'Layout' },
  { type: 'FAQs', label: 'Accordion FAQs', desc: 'Collapsible answered support questions', icon: 'HelpCircle' },
  { type: 'Blog post', label: 'Blog Posts Grid', desc: 'Display a beautiful list/grid of live Pouch Journal articles with columns control', icon: 'BookOpen' },
  { type: 'Brand list', label: 'Brand List with Images', desc: 'Scenic brand logo matrix with interactive links to collections', icon: 'LayoutGrid' }
] as const;

export const getSectionIcon = (type: string) => {
  switch (type) {
    case 'Image banner': return <ImageIcon className="h-4 w-4 text-teal-600" />;
    case 'Image with text': return <Columns className="h-4 w-4 text-emerald-500" />;
    case 'Text column with image': return <Grid className="h-4 w-4 text-sky-500" />;
    case 'Featured collection': return <ShoppingBag className="h-4 w-4 text-indigo-650" />;
    case 'Collection list': return <FolderHeart className="h-4 w-4 text-purple-600" />;
    case 'Slideshow': return <PlaySquare className="h-4 w-4 text-blue-500" />;
    case 'Video banner': return <Video className="h-4 w-4 text-rose-500" />;
    case 'Rich text': return <FileText className="h-4 w-4 text-slate-500" />;
    case 'Marquee text': return <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />;
    case 'Marquee images': return <Layers className="h-4 w-4 text-indigo-500" />;
    case 'Logo list': return <Award className="h-4 w-4 text-cyan-500" />;
    case 'Images gallery': return <Layout className="h-4 w-4 text-sky-600" />;
    case 'FAQs': return <HelpCircle className="h-4 w-4 text-violet-500" />;
    case 'Blog post': return <BookOpen className="h-4 w-4 text-orange-600" />;
    case 'Brand list': return <LayoutGrid className="h-4 w-4 text-pink-500" />;
    default: return <FileCode className="h-4 w-4 text-slate-400" />;
  }
};

interface AdminDashboardProps {
  products: Product[];
  onUpdateProducts: (newProds: Product[]) => void;
  collections: Collection[];
  onUpdateCollections: (newColls: Collection[]) => void;
  orders: Order[];
  onUpdateOrders: (newOrders: Order[]) => void;
  files: FileEntry[];
  onUpdateFiles: (newFiles: FileEntry[]) => void;
  customers: Customer[];
  onUpdateCustomers: (newCusts: Customer[]) => void;
  discounts: Discount[];
  onUpdateDiscounts: (newDiscs: Discount[]) => void;
  customPages: CustomPage[];
  onUpdateCustomPages: (newPages: CustomPage[]) => void;
  blogs: BlogPost[];
  onUpdateBlogs: (newBlogs: BlogPost[]) => void;
  onDirtyChange?: (dirty: boolean) => void;
  adminActionTrigger?: { action: 'save' | 'discard'; timestamp: number } | null;
  onAdminActionComplete?: (action: 'save' | 'discard') => void;
  onExitAdmin?: () => void;
}

type SidebarTab = 'analytics' | 'orders' | 'collections' | 'products' | 'pages' | 'blogs' | 'files' | 'customers' | 'discounts';

export default function AdminDashboard({
  products: parentProducts,
  onUpdateProducts: parentOnUpdateProducts,
  collections: parentCollections,
  onUpdateCollections: parentOnUpdateCollections,
  orders: parentOrders,
  onUpdateOrders: parentOnUpdateOrders,
  files: parentFiles,
  onUpdateFiles: parentOnUpdateFiles,
  customers: parentCustomers,
  onUpdateCustomers: parentOnUpdateCustomers,
  discounts: parentDiscounts,
  onUpdateDiscounts: parentOnUpdateDiscounts,
  customPages: parentCustomPages,
  onUpdateCustomPages: parentOnUpdateCustomPages,
  blogs: parentBlogs,
  onUpdateBlogs: parentOnUpdateBlogs,
  onDirtyChange,
  adminActionTrigger,
  onAdminActionComplete,
  onExitAdmin
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<SidebarTab>('analytics');

  // --- Draft State Hooks for unified safe saves ---
  const [localProducts, setLocalProducts] = useState<Product[]>(parentProducts);
  const [localCollections, setLocalCollections] = useState<Collection[]>(parentCollections);
  const [localPages, setLocalPages] = useState<CustomPage[]>(parentCustomPages);
  const [localDiscounts, setLocalDiscounts] = useState<Discount[]>(parentDiscounts);
  const [localOrders, setLocalOrders] = useState<Order[]>(parentOrders);
  const [localFiles, setLocalFiles] = useState<FileEntry[]>(parentFiles);
  const [localCustomers, setLocalCustomers] = useState<Customer[]>(parentCustomers);
  const [localBlogs, setLocalBlogs] = useState<BlogPost[]>(parentBlogs);

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Sync edits wrapper overrides so existing handlers automatically write to drafts and sync to the parent App context immediately
  const onUpdateProducts = (updatedProds: Product[]) => {
    setLocalProducts(updatedProds);
    parentOnUpdateProducts(updatedProds);
    setHasUnsavedChanges(false);
    if (onDirtyChange) onDirtyChange(false);
  };

  const onUpdateCollections = (updatedColls: Collection[]) => {
    setLocalCollections(updatedColls);
    parentOnUpdateCollections(updatedColls);
    setHasUnsavedChanges(false);
    if (onDirtyChange) onDirtyChange(false);
  };

  const onUpdateCustomPages = (updatedPages: CustomPage[]) => {
    setLocalPages(updatedPages);
    parentOnUpdateCustomPages(updatedPages);
    setHasUnsavedChanges(false);
    if (onDirtyChange) onDirtyChange(false);
  };

  const onUpdateDiscounts = (updatedDiscs: Discount[]) => {
    setLocalDiscounts(updatedDiscs);
    parentOnUpdateDiscounts(updatedDiscs);
    setHasUnsavedChanges(false);
    if (onDirtyChange) onDirtyChange(false);
  };

  const onUpdateOrders = (updatedOrders: Order[]) => {
    setLocalOrders(updatedOrders);
    parentOnUpdateOrders(updatedOrders);
    setHasUnsavedChanges(false);
    if (onDirtyChange) onDirtyChange(false);
  };

  const onUpdateFiles = (updatedFiles: FileEntry[]) => {
    setLocalFiles(updatedFiles);
    parentOnUpdateFiles(updatedFiles);
    setHasUnsavedChanges(false);
    if (onDirtyChange) onDirtyChange(false);
  };

  const onUpdateCustomers = (updatedCusts: Customer[]) => {
    setLocalCustomers(updatedCusts);
    parentOnUpdateCustomers(updatedCusts);
    setHasUnsavedChanges(false);
    if (onDirtyChange) onDirtyChange(false);
  };

  const onUpdateBlogs = (updatedBlogs: BlogPost[]) => {
    setLocalBlogs(updatedBlogs);
    parentOnUpdateBlogs(updatedBlogs);
    setHasUnsavedChanges(false);
    if (onDirtyChange) onDirtyChange(false);
  };

  // Global Save & Discard triggers
  const handleGlobalSave = () => {
    parentOnUpdateProducts(localProducts);
    parentOnUpdateCollections(localCollections);
    parentOnUpdateCustomPages(localPages);
    parentOnUpdateDiscounts(localDiscounts);
    parentOnUpdateOrders(localOrders);
    parentOnUpdateFiles(localFiles);
    parentOnUpdateCustomers(localCustomers);
    parentOnUpdateBlogs(localBlogs);

    setHasUnsavedChanges(false);
    if (onDirtyChange) onDirtyChange(false);
    if (onAdminActionComplete) onAdminActionComplete('save');
  };

  const handleGlobalDiscard = () => {
    setLocalProducts(parentProducts);
    setLocalCollections(parentCollections);
    setLocalPages(parentCustomPages);
    setLocalDiscounts(parentDiscounts);
    setLocalOrders(parentOrders);
    setLocalFiles(parentFiles);
    setLocalCustomers(parentCustomers);
    setLocalBlogs(parentBlogs);

    setHasUnsavedChanges(false);
    if (onDirtyChange) onDirtyChange(false);
    if (onAdminActionComplete) onAdminActionComplete('discard');
  };

  // Sync draft states when external database updates occur (when not dirty)
  React.useEffect(() => {
    if (!hasUnsavedChanges) {
      setLocalProducts(parentProducts);
      setLocalCollections(parentCollections);
      setLocalPages(parentCustomPages);
      setLocalDiscounts(parentDiscounts);
      setLocalOrders(parentOrders);
      setLocalFiles(parentFiles);
      setLocalCustomers(parentCustomers);
      setLocalBlogs(parentBlogs);
    }
  }, [parentProducts, parentCollections, parentCustomPages, parentDiscounts, parentOrders, parentFiles, parentCustomers, parentBlogs, hasUnsavedChanges]);

  // Listen to external modal command requests (from App.tsx confirm triggers)
  React.useEffect(() => {
    if (adminActionTrigger) {
      if (adminActionTrigger.action === 'save') {
        handleGlobalSave();
      } else if (adminActionTrigger.action === 'discard') {
        handleGlobalDiscard();
      }
    }
  }, [adminActionTrigger]);

  // Expose standard namespace variables to keep all existing loops intact
  const products = localProducts;
  const collections = localCollections;
  const customPages = localPages;
  const discounts = localDiscounts;
  const orders = localOrders;
  const files = localFiles;
  const customers = localCustomers;
  const blogs = localBlogs;

  // Search, filter, edit states
  const [orderQuery, setOrderQuery] = useState('');

  // Blog Post management states
  const [blogQuery, setBlogQuery] = useState('');
  const [blogStatusFilter, setBlogStatusFilter] = useState<'All' | 'Active' | 'Draft' | 'Archived'>('All');
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [showAddBlog, setShowAddBlog] = useState(false);
  const [newBlogForm, setNewBlogForm] = useState<Partial<BlogPost>>({
    title: '', excerpt: '', content: '', image: '',
    author: 'Admin', category: 'General', status: 'Active',
    publishedAt: '', readTime: '5 min read', tags: []
  });
  const [blogTagsInput, setBlogTagsInput] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'All' | 'Unfulfilled' | 'Fulfilled'>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [productQuery, setProductQuery] = useState('');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProductForm, setNewProductForm] = useState<Partial<Product>>({
    title: '', description: '', price: 4.99, compareAtPrice: 5.99,
    inventory: 50, sku: '', category: 'Vitamins & Supplements',
    vendor: '77', status: 'Active', image: '', weight: 12, tags: []
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [showAddCollection, setShowAddCollection] = useState(false);
  const [newCollectionForm, setNewCollectionForm] = useState<Partial<Collection>>({
    title: '', description: '', type: 'Manual', image: '', productIds: []
  });

  const [showAddPage, setShowAddPage] = useState(false);
  const [newPageForm, setNewPageForm] = useState({ title: '', slug: '' });
  const [selectedBuilderPageId, setSelectedBuilderPageId] = useState<string | null>(null);
  const [selectedBuilderSectionId, setSelectedBuilderSectionId] = useState<string | null>(null);
  const [activeSlideEditIndex, setActiveSlideEditIndex] = useState<number>(0);
  const [moduleSearchQuery, setModuleSearchQuery] = useState('');

  // Draft page & collection builder custom states
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);

  // Clean title-to-slug utility
  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-');        // Replace multiple - with single -
  };

  // Pages management handlers
  const handleDuplicatePage = (page: CustomPage) => {
    let count = 1;
    let baseSlug = page.slug || 'slug';
    if (baseSlug.match(/-\d+$/)) {
      baseSlug = baseSlug.replace(/-\d+$/, '');
    }
    let newSlug = `${baseSlug}-${count}`;
    while (localPages.some(p => p.slug === newSlug)) {
      count++;
      newSlug = `${baseSlug}-${count}`;
    }
    const duplicated: CustomPage = {
      ...JSON.parse(JSON.stringify(page)),
      id: `page-${Date.now()}`,
      title: `${page.title} (Copy)`,
      slug: newSlug,
      isHomepage: false,
      updatedAt: 'Just Now'
    };
    const updated = [...localPages, duplicated];
    setLocalPages(updated);
    onUpdateCustomPages(updated);
  };

  const handleSetPageAsHomepage = (id: string) => {
    const updated = localPages.map(p => {
      if (p.id === id) {
        return { ...p, isHomepage: true, slug: '' };
      }
      return { ...p, isHomepage: false };
    });
    setLocalPages(updated);
    onUpdateCustomPages(updated);
  };

  const handlePreviewPage = (page: CustomPage) => {
    const url = page.isHomepage ? '/' : `/pages/${page.slug}`;
    window.open(url, '_blank');
  };

  const [fileQuery, setFileQuery] = useState('');
  const [showAddFile, setShowAddFile] = useState(false);
  const [newFileForm, setNewFileForm] = useState({ fileName: '', altText: '', url: '' });

  const [customerQuery, setCustomerQuery] = useState('');
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [newCustomerForm, setNewCustomerForm] = useState({ name: '', email: '', location: '', subscriptionStatus: 'Subscribed' as any });

  const [discountQuery, setDiscountQuery] = useState('');
  const [showAddDiscount, setShowAddDiscount] = useState(false);
  const [newDiscountForm, setNewDiscountForm] = useState<Partial<Discount>>({
    title: '', type: 'Amount off order', details: '', eligibility: 'All customers', status: 'Active'
  });

  // Calculate high-fidelity partner portal metrics
  const stats = useMemo(() => {
    const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
    const completedOrders = orders.length;
    const avgOrderValue = completedOrders > 0 ? totalSales / completedOrders : 0;
    const productsInDraft = products.filter(p => p.status === 'Draft').length;
    const lowStockCount = products.filter(p => p.status === 'Active' && p.inventory <= 15).length;
    
    return {
      totalSales,
      completedOrders,
      avgOrderValue,
      productsInDraft,
      lowStockCount
    };
  }, [orders, products]);

  // Handle Order fulfillment
  const handleFulfillOrder = (orderId: string) => {
    const updated = orders.map(o => {
      if (o.id === orderId) {
        return { ...o, fulfillmentStatus: 'Fulfilled' as const };
      }
      return o;
    });
    onUpdateOrders(updated);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, fulfillmentStatus: 'Fulfilled' });
    }
  };

  // Add/Edit Product handlers
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductForm.title) return;

    if (editingProduct) {
      const updated = products.map(p => {
        if (p.id === editingProduct.id) {
          return { ...p, ...newProductForm } as Product;
        }
        return p;
      });
      onUpdateProducts(updated);
      setEditingProduct(null);
    } else {
      const item: Product = {
        id: `prod-${Date.now()}`,
        title: newProductForm.title,
        description: newProductForm.description || '',
        price: Number(newProductForm.price) || 0,
        compareAtPrice: Number(newProductForm.compareAtPrice) || 0,
        inventory: Number(newProductForm.inventory) || 0,
        sku: newProductForm.sku || `SKU-${Math.floor(Math.random() * 10000)}`,
        category: newProductForm.category || 'Vitamins & Supplements',
        vendor: newProductForm.vendor || '77',
        status: (newProductForm.status as any) || 'Active',
        image: newProductForm.image || 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=500&q=80',
        weight: Number(newProductForm.weight) || 12,
        tags: newProductForm.tags || []
      };
      onUpdateProducts([item, ...products]);
    }

    // Reset forms
    setShowAddProduct(false);
    setNewProductForm({
      title: '', description: '', price: 4.99, compareAtPrice: 5.99,
      inventory: 50, sku: '', category: 'Vitamins & Supplements',
      vendor: '77', status: 'Active', image: '', weight: 12, tags: []
    });
  };

  const handleEditProductClick = (prod: Product) => {
    setEditingProduct(prod);
    setNewProductForm(prod);
    setShowAddProduct(true);
  };

  const handleDuplicateProduct = (prod: Product) => {
    let count = 1;
    let baseId = prod.id;
    if (baseId.match(/-\d+$/)) {
      baseId = baseId.replace(/-\d+$/, '');
    }
    let newId = `${baseId}-${count}`;
    while (products.some(p => p.id === newId)) {
      count++;
      newId = `${baseId}-${count}`;
    }
    const duplicated: Product = {
      ...JSON.parse(JSON.stringify(prod)),
      id: newId,
      sku: prod.sku ? `${prod.sku}-COPY` : '',
      title: `${prod.title} (Copy)`
    };
    onUpdateProducts([...products, duplicated]);
  };

  const handlePreviewProduct = (prod: Product) => {
    window.open(`/products/${prod.id}`, '_blank');
  };

  const handleDeleteProduct = (pId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      const updated = products.filter(p => p.id !== pId);
      onUpdateProducts(updated);
    }
  };

  // Create & Edit Collection
  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionForm.title) return;

    if (editingCollection) {
      const updated = collections.map(c => 
        c.id === editingCollection.id 
          ? { 
              ...c, 
              title: newCollectionForm.title!, 
              description: newCollectionForm.description || '', 
              type: newCollectionForm.type || 'Manual',
              image: newCollectionForm.image || c.image
            } 
          : c
      );
      onUpdateCollections(updated);
      setEditingCollection(null);
    } else {
      const item: Collection = {
        id: slugify(newCollectionForm.title),
        title: newCollectionForm.title,
        description: newCollectionForm.description || '',
        type: (newCollectionForm.type as any) || 'Manual',
        image: newCollectionForm.image || 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=500&q=80',
        productIds: []
      };
      onUpdateCollections([...collections, item]);
    }

    setShowAddCollection(false);
    setNewCollectionForm({ title: '', description: '', type: 'Manual', image: '', productIds: [] });
  };

  const handleDuplicateCollection = (col: Collection) => {
    let count = 1;
    let baseId = col.id;
    if (baseId.match(/-\d+$/)) {
      baseId = baseId.replace(/-\d+$/, '');
    }
    let newId = `${baseId}-${count}`;
    while (collections.some(c => c.id === newId)) {
      count++;
      newId = `${baseId}-${count}`;
    }
    const duplicated: Collection = {
      ...JSON.parse(JSON.stringify(col)),
      id: newId,
      title: `${col.title} (Copy)`
    };
    onUpdateCollections([...collections, duplicated]);
  };

  const handlePreviewCollection = (col: Collection) => {
    window.open(`/collections/${col.id}`, '_blank');
  };

  const handleDeleteCollection = (id: string) => {
    if (confirm("Are you sure you want to delete this collection?")) {
      onUpdateCollections(collections.filter(c => c.id !== id));
    }
  };

  // Pages & Section Builder Handlers
  const handleAddPageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageForm.title) return;

    const slug = newPageForm.slug.trim() ? slugify(newPageForm.slug) : slugify(newPageForm.title);
    const page: CustomPage = {
      id: `page-${Date.now()}`,
      title: newPageForm.title,
      slug,
      visibility: 'Visible',
      updatedAt: 'Just now',
      sections: [
        {
          id: `sec-${Date.now()}`,
          type: 'Rich text',
          settings: {
            fullWidth: false,
            backgroundColor: '#FFFFFF',
            headingColor: '#1E293B',
            textColor: '#64748B',
            title: newPageForm.title,
            description: 'Custom sections will display below here.'
          }
        }
      ]
    };

    const updatedPages = [...localPages, page];
    setLocalPages(updatedPages);
    onUpdateCustomPages(updatedPages);
    setShowAddPage(false);
    setNewPageForm({ title: '', slug: '' });
  };

  // Section builder editing
  const currentlyEditingPage = localPages.find(p => p.id === selectedBuilderPageId);
  const currentlyEditingSection = currentlyEditingPage?.sections.find(s => s.id === selectedBuilderSectionId);

  const handleAddSectionToPage = (sectionType: PageSection['type']) => {
    if (!selectedBuilderPageId) return;
    
    // Banner and Slideshow should be full width by default!
    const isFullWidthByDefault = sectionType === 'Image banner' || sectionType === 'Slideshow';
    
    const newSection: PageSection = {
      id: `sec-${Date.now()}`,
      type: sectionType,
      settings: {
        fullWidth: isFullWidthByDefault,
        backgroundColor: '#FFFFFF',
        headingColor: '#1E293B',
        textColor: '#64748B',
        title: sectionType === 'Image banner' ? 'Exclusive Pouch Launch' 
             : sectionType === 'Image with text' ? 'Curate Your Premium Package'
             : sectionType === 'Text column with image' ? 'Our Laboratory Certified Foundations'
             : sectionType === 'Featured collection' ? 'Featured Collection Highlights'
             : sectionType === 'Collection list' ? 'Explore Brand Collections'
             : sectionType === 'Images gallery' ? 'Laboratory & Dispatch Facility Gallery'
             : sectionType === 'Marquee text' ? 'FREE PRIOR SHIPPING OVER £40! // 100% TOBACCO-FREE // BULK SAVINGS ACTIVE'
             : sectionType === 'Marquee images' ? 'Fresh Stock Dispatch Reel'
             : sectionType === 'Logo list' ? 'Official Lab Partner Register'
             : sectionType === 'FAQs' ? 'Frequently Answered Questions'
             : sectionType === 'Blog post' ? 'Latest From Our Journal'
             : sectionType === 'Brand list' ? 'Shop Premium Brands'
             : `Custom ${sectionType}`,
        description: sectionType === 'Image with text' ? 'Our plant-fiber formulations are packed under sterile medical conditions for persistent, smooth boosts.'
                 : sectionType === 'Text column with image' ? 'Every single canister batch is vacuum-sealed inside high-density polymer tubes guaranteeing pristine flavor locks.'
                 : sectionType === 'Featured collection' ? 'Sourced cleanly from European chemical compounding centers with direct-to-door courier dispatch.'
                 : sectionType === 'Collection list' ? 'Select from your favorite pouch strengths, cooling impacts, or specific lab series.'
                 : sectionType === 'FAQs' ? 'Find quick validations regarding shipping rules, subscriptions, and formulation safety standards.'
                 : sectionType === 'Blog post' ? 'Scientific reports, dosage guides, and news bulletins straight from Scandinavia.'
                 : sectionType === 'Brand list' ? 'Check our collection of premium, laboratory-certified brand canisters.'
                 : 'Edit option elements inside options sidebar',
        columnsDesktop: sectionType === 'Blog post' ? 3 : undefined,
        columnsMobile: sectionType === 'Blog post' ? 1 : undefined,
        brandItems: sectionType === 'Brand list' ? [
          { imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=150&q=80', linkUrl: 'frontend-shop', title: '77 Slim' },
          { imageUrl: 'https://images.unsplash.com/photo-1527018601619-a508a2be00cd?auto=format&fit=crop&w=150&q=80', linkUrl: 'frontend-shop', title: 'Cuba Black' },
          { imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=150&q=80', linkUrl: 'frontend-shop', title: 'Velo Ice' }
        ] : undefined,
        buttonText: (sectionType === 'Image banner' || sectionType === 'Image with text' || sectionType === 'Rich text') ? 'Purchase Packs' : undefined,
        buttonLink: (sectionType === 'Image banner' || sectionType === 'Image with text' || sectionType === 'Rich text') ? 'frontend-shop' : undefined,
        marqueeSpeed: 3,
        itemsCount: (sectionType === 'Featured collection' || sectionType === 'Marquee images' || sectionType === 'Collection list') ? 4 : undefined,
        imageUrl: (sectionType === 'Image banner' || sectionType === 'Image with text') ? 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80' : undefined,
        slides: sectionType === 'Slideshow' ? [
          {
            title: 'Precision-Engineered Pouch Purity',
            description: 'Sourced directly from certified laboratories utilizing medical-grade plant fiber and vacuum-fresh locks.',
            imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=80',
            buttonText: 'View Laboratory Journal',
            buttonLink: 'blogs'
          },
          {
            title: 'Extreme Mint Cryo Freeze',
            description: 'Sub-zero locking technology delivering an immediate, absolute sensory refreshing experience.',
            imageUrl: 'https://images.unsplash.com/photo-1576186726115-4d51596775d1?auto=format&fit=crop&w=1200&q=80',
            buttonText: 'Explore Sub-Zero Bundles',
            buttonLink: 'frontend-shop'
          }
        ] : undefined
      }
    };

    const updated = localPages.map(page => {
      if (page.id === selectedBuilderPageId) {
        return {
          ...page,
          sections: [...page.sections, newSection]
        };
      }
      return page;
    });
    setLocalPages(updated);
    setHasUnsavedChanges(true);
    setSelectedBuilderSectionId(newSection.id);
  };

  const handleRemoveSectionFromPage = (sectionId: string) => {
    if (!selectedBuilderPageId) return;
    const updated = localPages.map(page => {
      if (page.id === selectedBuilderPageId) {
        return {
          ...page,
          sections: page.sections.filter(s => s.id !== sectionId)
        };
      }
      return page;
    });
    setLocalPages(updated);
    setHasUnsavedChanges(true);
    if (selectedBuilderSectionId === sectionId) {
      setSelectedBuilderSectionId(null);
    }
  };

  const handleUpdateSectionSettings = (settingsKey: string, val: any) => {
    if (!selectedBuilderPageId || !selectedBuilderSectionId) return;
    const updated = localPages.map(page => {
      if (page.id === selectedBuilderPageId) {
        return {
          ...page,
          sections: page.sections.map(s => {
            if (s.id === selectedBuilderSectionId) {
              return {
                ...s,
                settings: {
                  ...s.settings,
                  [settingsKey]: val
                }
              };
            }
            return s;
          })
        };
      }
      return page;
    });
    setLocalPages(updated);
    setHasUnsavedChanges(true);
  };

  // Move Section Up/Down
  const handleMoveSection = (idx: number, direction: 'up' | 'down') => {
    if (!selectedBuilderPageId) return;
    const page = localPages.find(p => p.id === selectedBuilderPageId);
    if (!page) return;
    const sections = [...page.sections];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return;

    // Swap
    const temp = sections[idx];
    sections[idx] = sections[targetIdx];
    sections[targetIdx] = temp;

    const updated = localPages.map(p => {
      if (p.id === selectedBuilderPageId) {
        return { ...p, sections };
      }
      return p;
    });
    setLocalPages(updated);
    setHasUnsavedChanges(true);
  };

  // Add Mock File Upload
  const handleAddFileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileForm.fileName || !newFileForm.url) return;

    const file: FileEntry = {
      id: `file-${Date.now()}`,
      fileName: newFileForm.fileName.endsWith('.png') || newFileForm.fileName.endsWith('.jpg') ? newFileForm.fileName : `${newFileForm.fileName}.png`,
      altText: newFileForm.altText || 'Media File Asset description text',
      dateAdded: 'Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      size: `${(Math.random() * 400 + 40).toFixed(2)} KB`,
      references: 'Unused / Builder',
      url: newFileForm.url
    };

    onUpdateFiles([file, ...files]);
    setShowAddFile(false);
    setNewFileForm({ fileName: '', altText: '', url: '' });
  };

  const handleDeleteFile = (id: string) => {
    if (confirm("Are you sure you want to delete this media file?")) {
      onUpdateFiles(files.filter(f => f.id !== id));
    }
  };

  // Add Customer
  const handleAddCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerForm.name || !newCustomerForm.email) return;

    const cust: Customer = {
      id: `cust-${Date.now()}`,
      name: newCustomerForm.name,
      email: newCustomerForm.email,
      subscriptionStatus: newCustomerForm.subscriptionStatus,
      location: newCustomerForm.location || 'United Kingdom',
      ordersCount: 0,
      amountSpent: 0.00,
      addresses: [newCustomerForm.location || 'United Kingdom'],
      wishlist: []
    };

    onUpdateCustomers([cust, ...customers]);
    setShowAddCustomer(false);
    setNewCustomerForm({ name: '', email: '', location: '', subscriptionStatus: 'Subscribed' });
  };

  // Create discount code
  const handleCreateDiscountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDiscountForm.title) return;

    const disc: Discount = {
      id: `disc-${Date.now()}`,
      title: newDiscountForm.title.toUpperCase().replace(/\s+/g, ''),
      status: 'Active',
      method: 'Code',
      eligibility: newDiscountForm.eligibility || 'All customers',
      type: (newDiscountForm.type as any) || 'Amount off order',
      used: 0,
      details: newDiscountForm.details || '15% off standard purchases'
    };

    onUpdateDiscounts([...discounts, disc]);
    setShowAddDiscount(false);
    setNewDiscountForm({ title: '', type: 'Amount off order', details: '', eligibility: 'All customers' });
  };

  const handleToggleDiscountStatus = (id: string) => {
    const updated = discounts.map(d => {
      if (d.id === id) {
        return { ...d, status: d.status === 'Active' ? 'Expired' as const : 'Active' as const };
      }
      return d;
    });
    onUpdateDiscounts(updated);
  };

  const handleDeleteDiscount = (id: string) => {
    if (confirm("Are you sure you want to delete this promotional code?")) {
      onUpdateDiscounts(discounts.filter(d => d.id !== id));
    }
  };

  const handleCreateBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlogForm.title) return;
    const slug = newBlogForm.slug || slugify(newBlogForm.title);
    
    if (blogs.some(b => b.slug === slug)) {
      alert("A blog post with this slug already exists! Slugs must be unique.");
      return;
    }

    const tags = blogTagsInput.split(',').map(t => t.trim()).filter(Boolean);

    const createdBlog: BlogPost = {
      id: 'blog-' + Date.now(),
      title: newBlogForm.title,
      slug: slug,
      excerpt: newBlogForm.excerpt || '',
      content: newBlogForm.content || '',
      image: newBlogForm.image || 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=800&q=80',
      author: newBlogForm.author || 'Store Owner',
      category: newBlogForm.category || 'General',
      status: (newBlogForm.status as 'Active' | 'Draft' | 'Archived') || 'Active',
      publishedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      readTime: newBlogForm.readTime || '5 min read',
      tags: tags.length > 0 ? tags : ['General']
    };

    onUpdateBlogs([createdBlog, ...blogs]);
    setShowAddBlog(false);
    setNewBlogForm({
      title: '', excerpt: '', content: '', image: '',
      author: 'Admin', category: 'General', status: 'Active',
      publishedAt: '', readTime: '5 min read', tags: []
    });
    setBlogTagsInput('');
  };

  const handleUpdateBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBlog) return;
    const updatedSlug = selectedBlog.slug || slugify(selectedBlog.title);
    
    if (blogs.some(b => b.slug === updatedSlug && b.id !== selectedBlog.id)) {
      alert("A blog post with this slug already exists! Slugs must be unique.");
      return;
    }

    const tags = blogTagsInput.split(',').map(t => t.trim()).filter(Boolean);

    const updatedBlog: BlogPost = {
      ...selectedBlog,
      slug: updatedSlug,
      tags: tags
    };

    onUpdateBlogs(blogs.map(b => b.id === selectedBlog.id ? updatedBlog : b));
    setSelectedBlog(null);
    setBlogTagsInput('');
  };

  const handleDeleteBlog = (blogId: string) => {
    if (confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) {
      onUpdateBlogs(blogs.filter(b => b.id !== blogId));
    }
  };


  // Filters listings
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchQuery = o.id.toLowerCase().includes(orderQuery.toLowerCase()) || 
                         o.customerName.toLowerCase().includes(orderQuery.toLowerCase()) ||
                         o.customerEmail.toLowerCase().includes(orderQuery.toLowerCase());
      
      if (orderStatusFilter === 'All') return matchQuery;
      return matchQuery && o.fulfillmentStatus === orderStatusFilter;
    });
  }, [orders, orderQuery, orderStatusFilter]);

  const filteredProductsAdmin = useMemo(() => {
    return products.filter(p => 
      p.title.toLowerCase().includes(productQuery.toLowerCase()) ||
      p.vendor.toLowerCase().includes(productQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(productQuery.toLowerCase())
    );
  }, [products, productQuery]);

  const filteredFiles = useMemo(() => {
    return files.filter(f => 
      f.fileName.toLowerCase().includes(fileQuery.toLowerCase()) ||
      f.altText.toLowerCase().includes(fileQuery.toLowerCase())
    );
  }, [files, fileQuery]);

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => 
      c.name.toLowerCase().includes(customerQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(customerQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(customerQuery.toLowerCase())
    );
  }, [customers, customerQuery]);

  const filteredDiscounts = useMemo(() => {
    return discounts.filter(d => 
      d.title.toLowerCase().includes(discountQuery.toLowerCase()) ||
      d.details.toLowerCase().includes(discountQuery.toLowerCase())
    );
  }, [discounts, discountQuery]);

  const filteredBlogs = useMemo(() => {
    return blogs.filter(b => {
      const matchesSearch = b.title.toLowerCase().includes(blogQuery.toLowerCase()) || 
                            b.excerpt.toLowerCase().includes(blogQuery.toLowerCase()) ||
                            b.tags.some(t => t.toLowerCase().includes(blogQuery.toLowerCase()));
      const matchesStatus = blogStatusFilter === 'All' || b.status === blogStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [blogs, blogQuery, blogStatusFilter]);

  return (
    <div id="partner-admin-scaffold" className="flex flex-col lg:flex-row min-h-screen bg-[#f6f6f7] text-slate-800 font-sans">
      
      {/* Left sidebar Navigation */}
      {!selectedBuilderPageId && (
        <aside className="w-full lg:w-60 bg-[#ebebeb] text-[#4a4d50] shrink-0 border-r border-[#e1e3e5] p-3.5 flex flex-col justify-between">
          <div className="space-y-6">
            
            {/* Dashboard Head */}
            <div className="flex items-center gap-3 pb-4 border-b border-[#e1e3e5]">
              <div className="w-8 h-8 bg-[#008060] rounded flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#1a1c1d]">Pouch Supply</h2>
                <span className="bg-gray-100 text-[9px] px-1.5 py-0.5 rounded border border-gray-200 text-gray-500 uppercase font-bold tracking-tighter">Admin</span>
              </div>
            </div>

            {/* Nav Links */}
            <nav className="space-y-1 block">
              {[
                { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                { id: 'orders', label: 'Orders', icon: Package, badge: orders.filter(o => o.fulfillmentStatus === 'Unfulfilled').length },
                { id: 'collections', label: 'Collections', icon: Building },
                { id: 'products', label: 'Products', icon: ShoppingBag },
                { id: 'pages', label: 'Page Builder', icon: FileCode },
                { id: 'blogs', label: 'Blog Posts', icon: Layout },
                { id: 'files', label: 'Files Manager', icon: HardDrive },
                { id: 'customers', label: 'Customers', icon: Users },
                { id: 'discounts', label: 'Discounts', icon: Percent },
              ].map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as SidebarTab);
                      setSelectedBuilderPageId(null);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-md text-[13px] font-medium transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-[#edeeef] text-[#1a1c1d] font-semibold shadow-xs' 
                        : 'hover:bg-[#edeeef] text-[#4a4d50]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 rounded select-none">
                      <Icon className={`h-4 w-4 ${isActive ? 'text-[#1a1c1d]' : 'text-slate-500'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="bg-[#e3f5e9] text-[#008060] font-bold text-[10px] py-0.5 px-2 rounded-full border border-[#c8ebd3]">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* View Online Store main button */}
            {onExitAdmin && (
              <button
                type="button"
                onClick={onExitAdmin}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-[#008060] hover:bg-[#006e52] px-3.5 py-2.5 rounded-xl text-white font-black text-[11px] uppercase tracking-wider shadow-sm transition-colors cursor-pointer select-none"
              >
                <Globe className="h-4 w-4 shrink-0" />
                <span>View Online Store</span>
              </button>
            )}
          </div>

          {/* Foot of sidebar */}
          <div className="pt-4 border-t border-[#e1e3e5] text-[10px] text-[#707579]">
            <p>Running: Merchant v4.12</p>
            <p className="mt-1">Cloud Engine Active</p>
          </div>
        </aside>
      )}

      {/* Main Panel space */}
      <main className={selectedBuilderPageId ? "w-full p-4 lg:p-6" : "flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6 overflow-x-hidden"}>
        
        {/* Global panel header with stats glance info */}
        {!selectedBuilderPageId && (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-250">
            <div>
              <span className="text-[10px] text-indigo-600 bg-indigo-50 font-black uppercase py-1 px-3 rounded-full border border-indigo-100">Pouch Supply Partner Portal</span>
              <h1 className="text-2xl font-black text-slate-900 mt-2 capitalize flex items-center gap-2">
                {activeTab} Management Panel
              </h1>
            </div>
            
            {/* Quick Metrics display */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              {/* Draft Status Indicator */}
              <div className="flex items-center gap-2 bg-white border border-slate-250 px-4 py-2.5 rounded-xl shadow-xs">
                <span className={`h-2.5 w-2.5 rounded-full ${hasUnsavedChanges ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                <span className="font-extrabold text-[10px] text-slate-700 uppercase tracking-widest whitespace-nowrap">
                  {hasUnsavedChanges ? 'Unsaved Edits Present' : 'All Changes Saved'}
                </span>
              </div>

              {/* Save changes button */}
              <button
                onClick={handleGlobalSave}
                disabled={!hasUnsavedChanges}
                className={`py-2.5 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all shadow-xs border ${
                  hasUnsavedChanges
                    ? 'bg-[#008060] hover:bg-[#006e52] text-white border-[#008060] cursor-pointer ring-2 ring-emerald-405'
                    : 'bg-slate-100 text-slate-350 border-slate-200 cursor-not-allowed select-none'
                }`}
              >
                <Save className="h-4 w-4 shrink-0" />
                <span>Save Changes</span>
              </button>

              {/* Discard button */}
              {hasUnsavedChanges && (
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to discard all unsaved edits made during this session? This action cannot be undone.")) {
                      handleGlobalDiscard();
                    }
                  }}
                  className="py-2.5 px-3.5 bg-red-50 text-red-700 hover:bg-red-100 border border-red-150 rounded-xl text-[10px] uppercase font-black tracking-widest transition-all cursor-pointer"
                  title="Discard All Draft Changes"
                >
                  Discard
                </button>
              )}

              {/* View Online Store Button */}
              {onExitAdmin && (
                <button
                  type="button"
                  onClick={onExitAdmin}
                  className="py-2.5 px-4 bg-white hover:bg-slate-150 text-[#008060] border border-slate-250 hover:border-slate-350 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all shadow-xs cursor-pointer select-none"
                  title="Return to Customer Online Store"
                >
                  <Globe className="h-4 w-4 shrink-0 text-[#008060]" />
                  <span>View Online Store</span>
                </button>
              )}

              <div className="bg-white border border-slate-250 px-4 py-2.5 rounded-xl shadow-xs">
                <span className="text-slate-400 block text-[9px] font-bold uppercase tracking-wider">Gross Sales</span>
                <span className="font-extrabold text-slate-950 text-sm">£{stats.totalSales.toFixed(2)}</span>
              </div>
              <div className="bg-white border border-slate-250 px-4 py-2.5 rounded-xl shadow-xs">
                <span className="text-slate-400 block text-[9px] font-bold uppercase tracking-wider">Unfulfilled</span>
                <span className="font-extrabold text-amber-500 text-sm">{orders.filter(o => o.fulfillmentStatus === 'Unfulfilled').length} Orders</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab content conditionals */}
        
        {/* 1. ANALYTICS BLOCK */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Metric sales card */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs relative">
                <TrendingUp className="absolute top-5 right-5 text-indigo-600 h-5 w-5" />
                <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Total Revenue Today</span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">£{(stats.totalSales).toFixed(2)}</h3>
                <div className="text-[11px] text-emerald-600 font-bold mt-2 flex items-center gap-0.5">
                  <span>↑ 54.3%</span> <span className="text-slate-400 font-medium">vs yesterday stats</span>
                </div>
              </div>

              {/* Metric conversion card */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs relative">
                <Users className="absolute top-5 right-5 text-indigo-600 h-5 w-5" />
                <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Conversion rate</span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">32.4%</h3>
                <p className="text-[10px] text-slate-400 mt-1">Sessions converted to checkouts successfully</p>
                <div className="w-full bg-slate-100 h-1.5 mt-3 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full w-[32%]" />
                </div>
              </div>

              {/* Metric AOV card */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs relative">
                <HardDrive className="absolute top-5 right-5 text-indigo-600 h-5 w-5" />
                <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Average Order Value</span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">£{stats.avgOrderValue.toFixed(2)}</h3>
                <p className="text-[10px] text-slate-400 mt-1">Average cart check size</p>
              </div>

            </div>

            {/* Pure SVG Animated High contrast charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Chart 1: Revenue Trends */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                <h4 className="font-extrabold text-slate-800 text-sm mb-4">Gross Revenue Chart over Time</h4>
                <div className="relative h-60 bg-slate-50 rounded-lg border border-slate-100 p-4 flex items-end">
                  <div className="absolute inset-x-0 bottom-0 top-10 flex flex-col justify-between py-2 text-[9px] text-slate-400 pointer-events-none px-4">
                    <div className="border-b border-dashed border-slate-200/80 w-full pt-1">£800.00</div>
                    <div className="border-b border-dashed border-slate-200/80 w-full pt-1">£600.00</div>
                    <div className="border-b border-dashed border-slate-200/80 w-full pt-1">£400.00</div>
                    <div className="border-b border-dashed border-slate-200/80 w-full pt-1">£200.00</div>
                  </div>

                  {/* SVG Line path for high aesthetic fidelity */}
                  <svg className="absolute inset-0 h-full w-full p-10 overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path 
                      d="M 0 95 Q 20 60 40 40 T 80 15 T 100 2" 
                      fill="none" 
                      stroke="#4f46e5" 
                      strokeWidth="3.5" 
                      strokeLinecap="round"
                    />
                    <path 
                      d="M 0 95 Q 20 60 40 40 T 80 15 T 100 2 L 100 100 L 0 100 Z" 
                      fill="url(#rev-grad)" 
                      opacity="0.08"
                    />
                    <defs>
                      <linearGradient id="rev-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#4f46e5" />
                        <stop offset="100%" stopColor="#ffffff" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* SVG chart dots */}
                  <div className="relative z-10 w-full flex justify-between px-6 text-[8px] text-slate-400 font-bold uppercase tracking-widest leading-none pt-4">
                    <span>9:00 am</span>
                    <span>1:00 pm</span>
                    <span>5:00 pm</span>
                    <span>9:00 pm</span>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-3 text-[10px] text-slate-500">
                  <span>Metric source: Secure checkout logs</span>
                  <span>Trend State: <span className="text-emerald-600 font-bold">Excellent</span></span>
                </div>
              </div>

              {/* Chart 2: Regional Sessions Breakdown */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                <h4 className="font-extrabold text-slate-800 text-sm mb-4">Top Geographic Customer Locations</h4>
                <div className="space-y-4">
                  {[
                    { country: 'United Kingdom 🇬🇧', percentage: 74, sessionCount: 1540 },
                    { country: 'United States 🇺🇸', percentage: 15, sessionCount: 312 },
                    { country: 'Germany 🇩🇪', percentage: 7, sessionCount: 145 },
                    { country: 'Poland 🇵🇱', percentage: 4, sessionCount: 88 }
                  ].map((loc, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                        <span>{loc.country}</span>
                        <span>{loc.sessionCount} sessions ({loc.percentage}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-slate-900 h-full rounded-full" style={{ width: `${loc.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 2. ORDERS BLOCK */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            
            {/* Table actions header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
              <div className="flex flex-wrap gap-1">
                {(['All', 'Unfulfilled', 'Fulfilled'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setOrderStatusFilter(tab)}
                    className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      orderStatusFilter === tab 
                        ? 'bg-slate-900 border-slate-900 text-white' 
                        : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {tab} ({tab === 'All' ? orders.length : orders.filter(o => o.fulfillmentStatus === tab).length})
                  </button>
                ))}
              </div>

              {/* Query filter input */}
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Filter ID, customers..."
                  value={orderQuery}
                  onChange={(e) => setOrderQuery(e.target.value)}
                  className="w-full text-xs p-2 pb-2 pl-8 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-500 bg-slate-50"
                />
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              </div>
            </div>

            {/* Orders list Table */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/75 border-b border-slate-200 text-[10px] text-slate-450 font-black uppercase tracking-widest">
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Created Date</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4 text-center">Fulfillment Status</th>
                      <th className="p-4 text-right">Invoice Total</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-slate-400">No matching orders found.</td>
                      </tr>
                    ) : (
                      filteredOrders.map(order => (
                        <tr key={order.id} className="hover:bg-slate-50/50">
                          <td className="p-4 font-extrabold text-slate-900">{order.id}</td>
                          <td className="p-4 text-slate-500">{order.date}</td>
                          <td className="p-4">
                            <p className="font-bold text-slate-850">{order.customerName}</p>
                            <p className="text-[10px] text-slate-400">{order.customerEmail}</p>
                          </td>
                          <td className="p-4 text-center">
                            <span className={`inline-block text-[10px] uppercase font-bold py-0.5 px-2 rounded-full tracking-wider ${
                              order.fulfillmentStatus === 'Fulfilled' 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-150' 
                                : 'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}>
                              {order.fulfillmentStatus}
                            </span>
                          </td>
                          <td className="p-4 text-right font-extrabold text-slate-900">£{order.total.toFixed(2)}</td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="text-xs bg-slate-100 hover:bg-slate-200 border border-slate-250 hover:text-slate-900 text-slate-600 py-1 px-2.5 rounded-lg font-bold flex items-center gap-1 mx-auto cursor-pointer"
                            >
                              <Eye className="h-3 w-3" /> View Details
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Selected Order Detailed Drawer Modal side panel */}
            {selectedOrder && (
              <div className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
                    <div>
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Order Receipt: {selectedOrder.id}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Purchased on {selectedOrder.date}</p>
                    </div>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-6 text-xs text-slate-650">
                    
                    {/* Customer info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-1">Customer Delivery Name</span>
                        <p className="font-extrabold text-slate-800">{selectedOrder.customerName}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{selectedOrder.customerEmail}</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-1">Shipping Destination</span>
                        <p className="font-semibold text-slate-700 leading-normal">{selectedOrder.destination}</p>
                      </div>
                    </div>

                    {/* Order items */}
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-2">Item Package Details</span>
                      <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100">
                        {selectedOrder.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center p-3 bg-white">
                            <div>
                              <p className="font-extrabold text-slate-850">{item.productTitle}</p>
                              <p className="text-[11px] text-slate-400 mt-0.5">Unit price: £{item.price.toFixed(2)} • Qty: {item.quantity}</p>
                            </div>
                            <p className="font-black text-slate-900">£{(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Fulfillment Action bar */}
                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                      <div>
                        <span className="text-[9px] font-bold text-slate-405 block uppercase tracking-wider">Fulfillment state</span>
                        <p className={`font-bold mt-0.5 uppercase tracking-wide text-xs ${selectedOrder.fulfillmentStatus === 'Fulfilled' ? 'text-emerald-600' : 'text-amber-500'}`}>
                          {selectedOrder.fulfillmentStatus}
                        </p>
                      </div>

                      {selectedOrder.fulfillmentStatus === 'Unfulfilled' ? (
                        <button
                          onClick={() => handleFulfillOrder(selectedOrder.id)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm text-xs"
                        >
                          <CheckCircle2 className="h-4 w-4" /> Ship & Fulfill Items
                        </button>
                      ) : (
                        <span className="text-emerald-600 font-bold bg-emerald-50 py-1.5 px-3.5 border border-emerald-100 rounded-md flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4" /> Order Fulfilled
                        </span>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* 3. COLLECTIONS BLOCK */}
        {activeTab === 'collections' && (
          <div className="space-y-6">
            {editingCollection ? (
              <CollectionEditor
                collection={editingCollection.id === 'new_temp_draft_col' ? null : editingCollection}
                allProducts={products}
                onSave={(savedCol) => {
                  const cleanedCol: Collection = {
                    ...savedCol,
                    id: editingCollection.id === 'new_temp_draft_col' ? savedCol.id : editingCollection.id
                  };
                  const exists = collections.some(c => c.id === cleanedCol.id);
                  let updatedColls;
                  if (exists) {
                    updatedColls = collections.map(c => c.id === cleanedCol.id ? cleanedCol : c);
                  } else {
                    let finalId = cleanedCol.id;
                    while (collections.some(c => c.id === finalId)) {
                      finalId = `${finalId}-${Math.floor(Math.random() * 100)}`;
                    }
                    updatedColls = [...collections, { ...cleanedCol, id: finalId }];
                  }
                  onUpdateCollections(updatedColls);
                  setEditingCollection(null);
                }}
                onCancel={() => {
                  setEditingCollection(null);
                }}
                onDelete={(deletedId) => {
                  const updatedColls = collections.filter(c => c.id !== deletedId);
                  onUpdateCollections(updatedColls);
                  setEditingCollection(null);
                }}
              />
            ) : (
              <>
                {/* Header action menu */}
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-450 font-bold">List of store collections</span>
                  <button
                    onClick={() => setEditingCollection({
                      id: 'new_temp_draft_col',
                      title: '',
                      description: '',
                      type: 'Manual',
                      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=500&q=80',
                      productIds: []
                    })}
                    className="bg-slate-900 hover:bg-slate-800 text-white p-2.5 px-4 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Plus className="h-4 w-4" /> Create Collection Box
                  </button>
                </div>

                {/* Collection tiles list wrapper */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {collections.map(col => (
                    <div key={col.id} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between hover:shadow-xs transition-shadow">
                      <div>
                        <img
                          src={col.image}
                          alt={col.title}
                          className="w-full h-36 object-cover rounded-lg border border-slate-100 bg-slate-50 mb-3"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex items-center justify-between">
                          <h4 className="font-black text-slate-800 text-xs uppercase tracking-wide">{col.title}</h4>
                          <span className="text-[10px] text-indigo-600 bg-indigo-50 font-bold py-0.5 px-2 rounded-full border border-indigo-150">
                            {col.type} Collection
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">{col.description}</p>
                        {col.productConditions && (
                          <p className="text-[10px] text-slate-400 mt-2 bg-slate-50 p-2 border rounded font-mono">
                            Rule: {col.productConditions}
                          </p>
                        )}
                      </div>

                      <div className="pt-3 border-t border-slate-100 mt-4 flex justify-between items-center text-[11px] gap-2">
                        <span className="text-slate-400 block">Products: <span className="font-extrabold text-slate-700">{col.id === 'all' ? products.length : col.productIds.length}</span></span>
                        
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setEditingCollection(col);
                              setNewCollectionForm(col);
                            }}
                            className="text-indigo-600 hover:text-indigo-800 font-extrabold cursor-pointer"
                            title="Edit collection details"
                          >
                            Edit
                          </button>
                          <span className="text-slate-200">|</span>
                          <button
                            onClick={() => handleDuplicateCollection(col)}
                            className="text-teal-600 hover:text-teal-850 font-extrabold cursor-pointer"
                            title="Duplicate collection"
                          >
                            Dup
                          </button>
                          <span className="text-slate-200">|</span>
                          <button
                            onClick={() => handlePreviewCollection(col)}
                            className="text-sky-650 hover:text-sky-800 font-extrabold cursor-pointer"
                            title="Preview collection"
                          >
                            View
                          </button>
                          {col.id !== 'all' && (
                            <>
                              <span className="text-slate-200">|</span>
                              <button
                                onClick={() => handleDeleteCollection(col.id)}
                                className="text-red-500 hover:text-red-700 font-extrabold cursor-pointer"
                                title="Delete collection"
                              >
                                Del
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* 4. PRODUCTS BLOCK */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {editingProduct || showAddProduct ? (
              <ProductEditor
                product={editingProduct}
                allCollections={collections}
                onCancel={() => {
                  setEditingProduct(null);
                  setShowAddProduct(false);
                }}
                onSave={(savedProduct, selectedCollectionIds) => {
                  const isNew = !products.some(p => p.id === savedProduct.id);
                  let updatedProducts;
                  if (isNew) {
                    updatedProducts = [savedProduct, ...products];
                  } else {
                    updatedProducts = products.map(p => p.id === savedProduct.id ? savedProduct : p);
                  }
                  onUpdateProducts(updatedProducts);

                  // Synchronize Collection Memberships
                  const updatedCollections = collections.map(col => {
                    const belongs = selectedCollectionIds.includes(col.id);
                    const alreadyHas = col.productIds.includes(savedProduct.id);

                    if (belongs && !alreadyHas) {
                      return { ...col, productIds: [...col.productIds, savedProduct.id] };
                    } else if (!belongs && alreadyHas) {
                      return { ...col, productIds: col.productIds.filter(id => id !== savedProduct.id) };
                    }
                    return col;
                  });
                  onUpdateCollections(updatedCollections);

                  setEditingProduct(null);
                  setShowAddProduct(false);
                }}
                onDelete={(productId) => {
                  const updated = products.filter(p => p.id !== productId);
                  onUpdateProducts(updated);

                  // Clean up collection references
                  const updatedColls = collections.map(c => ({
                    ...c,
                    productIds: c.productIds.filter(id => id !== productId)
                  }));
                  onUpdateCollections(updatedColls);

                  setEditingProduct(null);
                  setShowAddProduct(false);
                }}
              />
            ) : (
              <>
                {/* Header menu filter */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="Seach products via titles, vendors..."
                      value={productQuery}
                      onChange={(e) => setProductQuery(e.target.value)}
                      className="w-full text-xs p-2 pb-2 pl-8 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-500 bg-slate-50"
                    />
                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  </div>

                  <button
                    onClick={() => {
                      setEditingProduct(null);
                      setShowAddProduct(true);
                    }}
                    className="bg-slate-900 hover:bg-slate-850 font-bold p-2.5 px-4 rounded-xl text-xs text-white flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <Plus className="h-4 w-4" /> Add Product Item
                  </button>
                </div>

                {/* Products Inventory Grid table */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50/75 border-b border-slate-200 text-[10px] text-slate-450 font-semibold uppercase tracking-widest">
                          <th className="p-4">Image</th>
                          <th className="p-4">Product Title</th>
                          <th className="p-4">Brand</th>
                          <th className="p-4 text-center">Status</th>
                          <th className="p-4 text-center">In Stock Inventory</th>
                          <th className="p-4 text-right">Selling Price</th>
                          <th className="p-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150/70">
                        {filteredProductsAdmin.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="text-center py-12 text-slate-400">No products configured yet.</td>
                          </tr>
                        ) : (
                          filteredProductsAdmin.map(prod => (
                            <tr key={prod.id} className="hover:bg-slate-50/60">
                              <td className="p-4 shrink-0">
                                <img
                                  src={prod.image}
                                  alt=""
                                  className="w-10 h-10 object-cover rounded-md bg-slate-50 border border-slate-100"
                                  referrerPolicy="no-referrer"
                                />
                              </td>
                              <td className="p-4 font-bold text-slate-900 leading-normal max-w-xs">{prod.title}</td>
                              <td className="p-4 font-bold text-indigo-650">{prod.vendor}</td>
                              <td className="p-4 text-center">
                                <span className={`inline-block py-0.5 px-2 rounded-full font-black text-[9px] uppercase tracking-wider ${
                                  prod.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-150' : 'bg-slate-100 text-slate-500'
                                }}`}>
                                  {prod.status}
                                </span>
                              </td>
                              <td className="p-4 text-center">
                                <span className={`font-black text-xs ${prod.inventory <= 15 ? 'text-rose-500' : 'text-slate-800'}`}>
                                  {prod.inventory} units {prod.inventory <= 15 ? '⚠️ low' : ''}
                                </span>
                              </td>
                              <td className="p-4 text-right font-extrabold text-slate-900">£{prod.price.toFixed(2)}</td>
                              <td className="p-4 text-center text-xs space-x-1.5 whitespace-nowrap">
                                <button
                                  onClick={() => handleEditProductClick(prod)}
                                  className="hover:text-indigo-600 font-bold cursor-pointer"
                                  title="Edit product"
                                >
                                  Edit
                                </button>
                                <span className="text-slate-350">|</span>
                                <button
                                  onClick={() => handleDuplicateProduct(prod)}
                                  className="text-teal-650 hover:text-teal-850 font-bold cursor-pointer"
                                  title="Duplicate product"
                                >
                                  Dup
                                </button>
                                <span className="text-slate-350">|</span>
                                <button
                                  onClick={() => handlePreviewProduct(prod)}
                                  className="text-sky-650 hover:text-sky-850 font-bold cursor-pointer"
                                  title="Preview product"
                                >
                                  View
                                </button>
                                <span className="text-slate-350">|</span>
                                <button
                                  onClick={() => handleDeleteProduct(prod.id)}
                                  className="text-red-500 hover:text-red-700 font-bold cursor-pointer"
                                  title="Delete product"
                                >
                                  Del
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* 5. PAGES & SECTION BUILDER BLOCK */}
        {activeTab === 'pages' && (
          <div className="space-y-6">
            
            {/* If no page is selected for editing/building, list customizable pages */}
            {!selectedBuilderPageId ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 font-bold">List of builder pages</span>
                  <button
                    onClick={() => setShowAddPage(true)}
                    className="bg-slate-900 hover:bg-slate-850 text-white font-bold text-xs p-2.5 px-4 rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Plus className="h-4 w-4" /> Add Page Template
                  </button>
                </div>

                <div className="bg-white border rounded-xl divide-y divide-slate-100 shadow-xs">
                  {localPages.map(page => (
                    <div key={page.id} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 hover:bg-slate-50/50">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                            {page.title}
                          </h4>
                          <span className={`text-[8px] py-0.5 px-1.5 font-bold uppercase tracking-widest rounded ${
                            page.visibility === 'Visible' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'
                          }`}>
                            {page.visibility}
                          </span>
                          {page.isHomepage && (
                            <span className="text-[8px] py-0.5 px-1.5 font-black uppercase tracking-widest rounded bg-amber-500 text-white flex items-center gap-1">
                              🏠 Active Homepage
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">
                          Route URL: <span className="font-mono bg-slate-100 px-1 rounded">{page.isHomepage ? '/' : `/pages/${page.slug}`}</span> • Last updated {page.updatedAt || 'Just Now'}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-[11px]">
                        {!page.isHomepage && (
                          <button
                            onClick={() => handleSetPageAsHomepage(page.id)}
                            className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-extrabold py-1.5 px-3 rounded-lg border border-indigo-100 cursor-pointer"
                          >
                            Set as Homepage
                          </button>
                        )}
                        {/* Customize Layout (Settings Icon) */}
                        <div className="relative group/tooltip">
                          <button
                            onClick={() => setSelectedBuilderPageId(page.id)}
                            className="p-2.5 bg-teal-50 hover:bg-teal-100 hover:scale-105 text-teal-800 border border-teal-150 rounded-xl transition-all cursor-pointer flex items-center justify-center animate-hover"
                            aria-label="Customize Layout"
                          >
                            <Settings className="h-4.5 w-4.5" />
                          </button>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[9px] font-black rounded shadow-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30">
                            Customize Layout
                          </div>
                        </div>

                        {/* Duplicate (Duplicate Icon) */}
                        <div className="relative group/tooltip">
                          <button
                            onClick={() => handleDuplicatePage(page)}
                            className="p-2.5 bg-slate-100 hover:bg-slate-200 hover:scale-105 text-slate-700 border border-slate-200 rounded-xl transition-all cursor-pointer flex items-center justify-center animate-hover"
                            aria-label="Duplicate"
                          >
                            <Clipboard className="h-4.5 w-4.5" />
                          </button>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#1a1c1d] text-white text-[9px] font-black rounded shadow-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30">
                            Duplicate Page
                          </div>
                        </div>

                        {/* Preview (Eye/Preview Icon) */}
                        <div className="relative group/tooltip">
                          <button
                            onClick={() => handlePreviewPage(page)}
                            className="p-2.5 bg-sky-50 hover:bg-sky-100 hover:scale-105 text-sky-800 border border-sky-150 rounded-xl transition-all cursor-pointer flex items-center justify-center animate-hover"
                            aria-label="Preview"
                          >
                            <Eye className="h-4.5 w-4.5" />
                          </button>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[9px] font-black rounded shadow-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30">
                            Preview Page
                          </div>
                        </div>

                        {/* Delete (Trash Icon - disable if active homepage for safety) */}
                        <div className="relative group/tooltip">
                          <button
                            disabled={page.isHomepage}
                            onClick={() => {
                              if (confirm(`Are you sure you want to permanently delete "${page.title}"?`)) {
                                const updated = localPages.filter(p => p.id !== page.id);
                                setLocalPages(updated);
                                onUpdateCustomPages(updated);
                              }
                            }}
                            className={`p-2.5 border rounded-xl transition-all flex items-center justify-center ${
                              page.isHomepage
                                ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed opacity-50'
                                : 'bg-red-50 text-red-600 hover:text-white hover:bg-red-600 hover:scale-105 border-red-150 cursor-pointer'
                            }`}
                            aria-label="Delete"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[9px] font-black rounded shadow-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30">
                            {page.isHomepage ? 'Homepage Cannot Be Deleted' : 'Delete Page'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Page Modal */}
                {showAddPage && (
                  <div className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-sm w-full shadow-2xl">
                      <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
                        <h3 className="font-extrabold text-slate-800 text-sm">Create Customizable Page</h3>
                        <button onClick={() => setShowAddPage(false)} className="text-slate-400 cursor-pointer text-xs font-bold">Close</button>
                      </div>

                      <form onSubmit={handleAddPageSubmit} className="space-y-4 text-xs">
                        <div>
                          <label className="block font-bold text-slate-600 uppercase tracking-widest text-[9px] mb-1">Page Name</label>
                          <input
                            id="page-form-title"
                            type="text"
                            required
                            placeholder="e.g. Summer Promos"
                            value={newPageForm.title}
                            onChange={(e) => setNewPageForm({ ...newPageForm, title: e.target.value })}
                            className="w-full border p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-500"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-600 uppercase tracking-widest text-[9px] mb-1">Route Slug parameter</label>
                          <input
                            id="page-form-slug"
                            type="text"
                            placeholder="e.g. summer-promotions"
                            value={newPageForm.slug}
                            onChange={(e) => setNewPageForm({ ...newPageForm, slug: e.target.value })}
                            className="w-full border p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-500"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-slate-900 text-white font-bold py-2 rounded-lg cursor-pointer"
                        >
                          Create Page Container
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // ----------------------------------------------------
              // THE EXQUISITE VISUAL SECTION LAYOUT BUILDER SCREEN
              // ----------------------------------------------------
              <div className="space-y-4">
                {/* Save Options Action Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900 text-white p-3.5 px-4 rounded-xl shadow-md border border-slate-800 gap-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        if (hasUnsavedChanges && !confirm("You have unsaved adjustments! Exit anyway and discard modifications?")) {
                          return;
                        }
                        setSelectedBuilderPageId(null);
                        setSelectedBuilderSectionId(null);
                        setHasUnsavedChanges(false);
                      }}
                      className="text-white hover:text-slate-300 cursor-pointer text-xs font-bold flex items-center gap-1.5 bg-slate-800 hover:bg-slate-750 p-2 py-1 rounded-lg border border-slate-700 transition"
                    >
                      ← Exit Builder
                    </button>
                    <div>
                      <span className="text-xs font-black uppercase tracking-widest block">{currentlyEditingPage?.title}</span>
                      <div className="flex items-center gap-1.5 mt-0.5 select-none">
                        <span className={`h-2 w-2 rounded-full ${hasUnsavedChanges ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`} />
                        <span className="text-[9px] text-slate-300 font-bold">
                          {hasUnsavedChanges ? 'Unsaved Customizations' : 'All Changes Saved & Live'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    {hasUnsavedChanges && (
                      <button
                        onClick={() => {
                          if (confirm("Revert layout to the last saved state?")) {
                            handleGlobalDiscard();
                            setSelectedBuilderSectionId(null);
                          }
                        }}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[10px] py-1.5 px-3 rounded-lg border border-slate-700 cursor-pointer transition"
                      >
                        Revert Draft
                      </button>
                    )}
                    <button
                      onClick={handleGlobalSave}
                      className="bg-[#008060] hover:bg-[#006e52] text-white font-bold text-[10px] py-1.5 px-3.5 rounded-lg flex items-center gap-1.5 cursor-pointer uppercase tracking-wider transition shadow-sm"
                    >
                      <Save className="h-3.5 w-3.5" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 bg-slate-100 p-5 rounded-2xl border border-slate-250">
                  
                  {/* 1. Left controls column: Section stacking */}
                  <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white border rounded-xl p-4 shadow-xs space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                        <h4 className="font-black text-slate-700 uppercase tracking-wide text-xs">Page Sections</h4>
                        <button
                          onClick={() => {
                            if (hasUnsavedChanges && !confirm("You have unsaved adjustments! Exit anyway and discard modifications?")) {
                              return;
                            }
                            setSelectedBuilderPageId(null);
                            setSelectedBuilderSectionId(null);
                            setHasUnsavedChanges(false);
                          }}
                          className="text-[10px] text-slate-400 font-semibold hover:text-slate-600"
                        >
                          ← Exit
                        </button>
                      </div>

                    {/* Section stacking list */}
                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                      {currentlyEditingPage?.sections.map((sec, idx) => (
                        <div 
                          key={sec.id}
                          onClick={() => setSelectedBuilderSectionId(sec.id)}
                          className={`p-2 rounded-xl border text-xs flex justify-between items-center transition-all cursor-pointer ${
                            selectedBuilderSectionId === sec.id 
                              ? 'border-indigo-600 bg-indigo-50/30 text-slate-900 shadow-sm' 
                              : 'bg-slate-50 border-slate-200/70 hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate pr-1">
                            <div className="shrink-0 p-1 bg-white border border-slate-200 rounded-lg shadow-2xs">
                              {getSectionIcon(sec.type)}
                            </div>
                            <div className="truncate text-left font-bold text-slate-800">
                              <span className="text-[8px] text-slate-400 block font-mono uppercase leading-none mb-0.5">Sec {idx + 1}</span>
                              <span className="truncate block leading-tight">{sec.type}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-0.5 shrink-0">
                            <button
                              disabled={idx === 0}
                              type="button"
                              onClick={(e) => { e.stopPropagation(); handleMoveSection(idx, 'up'); }}
                              className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-755 cursor-pointer disabled:opacity-30"
                            >
                              <MoveUp className="h-3 w-3" />
                            </button>
                            <button
                              disabled={idx === (currentlyEditingPage.sections.length - 1)}
                              type="button"
                              onClick={(e) => { e.stopPropagation(); handleMoveSection(idx, 'down'); }}
                              className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-755 cursor-pointer disabled:opacity-30"
                            >
                              <MoveDown className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); handleRemoveSectionFromPage(sec.id); }}
                              className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg cursor-pointer"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                      {(!currentlyEditingPage?.sections || currentlyEditingPage.sections.length === 0) && (
                        <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl bg-slate-50">
                          <p className="text-[10px] text-slate-400">No layout modules created yet.</p>
                        </div>
                      )}
                    </div>

                    {/* Add Section toolbar dropdown */}
                    <div className="border-t border-slate-100 pt-4 space-y-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wide mb-1.5">Add Layout Module</label>
                        <div className="relative">
                          <input 
                            type="text"
                            placeholder="Search layout modules..."
                            value={moduleSearchQuery}
                            onChange={(e) => setModuleSearchQuery(e.target.value)}
                            className="w-full text-[11px] p-1.5 pb-2 pl-7 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-650 font-medium"
                          />
                          <Search className="absolute left-2.5 top-2.5 h-3 w-3 text-slate-400" />
                          {moduleSearchQuery && (
                            <button 
                              type="button"
                              onClick={() => setModuleSearchQuery('')}
                              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-605"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="max-h-[260px] overflow-y-auto pr-1 space-y-1.5 scrollbar-thin">
                        {AVAILABLE_SECTION_TEMPLATES.filter(item => 
                          item.label.toLowerCase().includes(moduleSearchQuery.toLowerCase()) ||
                          item.desc.toLowerCase().includes(moduleSearchQuery.toLowerCase()) ||
                          item.type.toLowerCase().includes(moduleSearchQuery.toLowerCase())
                        ).map(item => (
                          <button
                            key={item.type}
                            type="button"
                            onClick={() => handleAddSectionToPage(item.type as any)}
                            className="w-full text-left p-1.5 border border-slate-200 bg-slate-50 hover:bg-indigo-50/40 hover:border-indigo-250 hover:shadow-2xs rounded-xl cursor-pointer flex items-start gap-2.5 transition-all group"
                          >
                            <div className="shrink-0 p-1 rounded-lg bg-white border border-slate-200 group-hover:border-indigo-200 transition-colors shadow-2xs">
                              {getSectionIcon(item.type)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-extrabold text-slate-800 group-hover:text-indigo-650 transition-colors uppercase tracking-tight">{item.label}</span>
                                <Plus className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0" />
                              </div>
                              <p className="text-[9px] text-slate-450 leading-tight mt-0.5 line-clamp-1">{item.desc}</p>
                            </div>
                          </button>
                        ))}
                        {AVAILABLE_SECTION_TEMPLATES.filter(item => 
                          item.label.toLowerCase().includes(moduleSearchQuery.toLowerCase()) ||
                          item.desc.toLowerCase().includes(moduleSearchQuery.toLowerCase()) ||
                          item.type.toLowerCase().includes(moduleSearchQuery.toLowerCase())
                        ).length === 0 && (
                          <p className="text-[10px] text-slate-400 text-center py-4">No matching modules found.</p>
                        )}
                      </div>
                    </div>

                  </div>
                </div>

                {/* 2. Middle Visual Template Previewer (Interactive Sandbox canvas!) */}
                <div className="lg:col-span-2">
                  <div className="bg-white border rounded-xl shadow-md min-h-[60vh] overflow-hidden">
                    
                    {/* Simulator browser Header Mockup */}
                    <div className="bg-slate-100 border-b border-slate-200 p-3 px-4 flex justify-between items-center text-[10px] text-slate-400 font-bold tracking-wider">
                      <div className="flex gap-1.5 items-center">
                        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                      </div>
                      <div className="bg-white border rounded py-1 px-8 text-center text-slate-500 w-64 truncate">
                        pouch-supply.com/pages/{currentlyEditingPage?.slug}
                      </div>
                      <Globe className="h-3.5 w-3.5" />
                    </div>

                    {/* Rendering the Page builder canvas content directly */}
                    <div className="p-4 space-y-6">
                      
                      {currentlyEditingPage?.sections.length === 0 ? (
                        <div className="text-center py-24 text-slate-400">
                          <p>Empty page template. Add section blocks on the left menu.</p>
                        </div>
                      ) : (
                        currentlyEditingPage?.sections.map((sec, sIdx) => {
                          const sStyle = {
                            backgroundColor: sec.settings.backgroundColor || '#FFFFFF',
                            color: sec.settings.textColor || '#64748B'
                          };
                          const isFocused = selectedBuilderSectionId === sec.id;

                          return (
                            <div 
                              key={sec.id}
                              onClick={() => setSelectedBuilderSectionId(sec.id)}
                              className={`relative group p-6 rounded-2xl border transition-all cursor-pointer ${
                                isFocused 
                                  ? 'ring-2 ring-indigo-600 border-indigo-600 bg-white shadow-md scale-[1.01]' 
                                  : 'border-slate-200/55 hover:border-slate-400 bg-slate-50/20 hover:bg-white shadow-2xs'
                              }`}
                              style={sStyle}
                            >
                              {/* Floating action tools overlay */}
                              <div className="absolute right-3 top-2.5 z-30 opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity bg-slate-900/90 backdrop-blur-md p-1 px-1.5 rounded-lg shadow-lg border border-slate-700">
                                <button
                                  disabled={sIdx === 0}
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); handleMoveSection(sIdx, 'up'); }}
                                  className="p-1 hover:bg-slate-800 rounded-md text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                                  title="Move Section Up"
                                >
                                  <MoveUp className="h-3 w-3" />
                                </button>
                                <button
                                  disabled={sIdx === (currentlyEditingPage.sections.length - 1)}
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); handleMoveSection(sIdx, 'down'); }}
                                  className="p-1 hover:bg-slate-800 rounded-md text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                                  title="Move Section Down"
                                >
                                  <MoveDown className="h-3 w-3" />
                                </button>
                                <div className="w-px h-3 bg-slate-700 mx-0.5" />
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); handleRemoveSectionFromPage(sec.id); }}
                                  className="p-1 hover:bg-red-950 rounded-md text-slate-400 hover:text-red-500 cursor-pointer"
                                  title="Remove Section"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>

                              {/* Overlay tag indicator */}
                              <span className="absolute top-2.5 left-3 bg-slate-900 text-white text-[8px] font-black tracking-widest uppercase py-0.5 px-1.5 rounded-md pointer-events-none opacity-80">
                                {sec.type} {isFocused ? '• EDITING' : ''}
                              </span>

                              {/* Different visual layouts */}
                              <div className="pt-3">
                                
                                {/* 1. IMAGE BANNER */}
                                {sec.type === 'Image banner' && (
                                  <div className="text-center space-y-3 py-4">
                                    <div className="relative h-28 w-full rounded-xl bg-slate-100 overflow-hidden border">
                                      <img 
                                        src={sec.settings.imageUrl || 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80'} 
                                        className="h-full w-full object-cover" 
                                        alt="" 
                                        referrerPolicy="no-referrer"
                                      />
                                      <div className="absolute inset-0 bg-black/40" />
                                    </div>
                                    <h3 className="text-sm font-black uppercase" style={{ color: sec.settings.headingColor || '#1E293B' }}>
                                      {sec.settings.title || 'Exclusive Pouch Launch'}
                                    </h3>
                                    <p className="text-[10px] leading-relaxed max-w-sm mx-auto text-slate-500">{sec.settings.description || 'Banner details...'}</p>
                                    {sec.settings.buttonText && (
                                      <button type="button" className="bg-slate-900 text-white font-extrabold text-[8px] py-1 px-3.5 rounded-md uppercase tracking-wider">
                                        {sec.settings.buttonText}
                                      </button>
                                    )}
                                  </div>
                                )}

                                {/* 2. IMAGE WITH TEXT */}
                                {sec.type === 'Image with text' && (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center py-4 text-left">
                                    <div className="h-28 w-full rounded-xl bg-slate-50 border overflow-hidden relative shadow-inner">
                                      <img 
                                        src={sec.settings.imageUrl || 'https://images.unsplash.com/photo-1576186726115-4d51596775d1?auto=format&fit=crop&w=800&q=80'} 
                                        className="h-full w-full object-cover" 
                                        alt="" 
                                        referrerPolicy="no-referrer"
                                      />
                                    </div>
                                    <div className="space-y-1.5">
                                      <h4 className="font-extrabold text-xs" style={{ color: sec.settings.headingColor || '#1E293B' }}>
                                        {sec.settings.title || 'Curate Your Premium Package'}
                                      </h4>
                                      <p className="text-[9.5px] text-slate-500 leading-snug line-clamp-3">{sec.settings.description}</p>
                                      {sec.settings.buttonText && (
                                        <span className="inline-block bg-slate-950 text-white font-black text-[8px] py-1 px-3 rounded-lg uppercase tracking-wide">
                                          {sec.settings.buttonText}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* 3. TEXT COLUMN WITH IMAGE */}
                                {sec.type === 'Text column with image' && (
                                  <div className="space-y-3 py-4 text-center">
                                    <h4 className="font-extrabold text-xs uppercase tracking-tight" style={{ color: sec.settings.headingColor || '#1E293B' }}>
                                      {sec.settings.title || 'Our Laboratory Certified Foundations'}
                                    </h4>
                                    <p className="text-[9.5px] text-slate-450 max-w-md mx-auto leading-snug">{sec.settings.description}</p>
                                    <div className="grid grid-cols-3 gap-2 pt-2">
                                      {[
                                        { label: 'Global Testing', badge: 'LAB VERIFIED', img: 'https://images.unsplash.com/photo-1576186726115-4d51596775d1?auto=format&fit=crop&w=150&q=80' },
                                        { label: 'Aroma Boost', badge: '100% FREE', img: 'https://images.unsplash.com/photo-1550507992-eb63ffee0847?auto=format&fit=crop&w=150&q=80' },
                                        { label: 'Vacuum Sealed', badge: 'FRESH LOCK', img: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=150&q=80' }
                                      ].map((col, cIdx) => (
                                        <div key={cIdx} className="bg-slate-50 border border-slate-200/60 rounded-xl p-2 text-center text-[9px] hover:shadow-2xs transition-shadow">
                                          <div className="h-10 bg-slate-200 min-w-full rounded-md mb-1 bg-cover bg-center overflow-hidden">
                                            <img src={col.img} className="h-full w-full object-cover" alt="" referrerPolicy="no-referrer" />
                                          </div>
                                          <span className="font-extrabold text-slate-800 leading-tight block truncate text-[8.5px]">{col.label}</span>
                                          <span className="text-[7px] text-indigo-700 bg-indigo-50 border border-indigo-100 rounded px-1 inline-block mt-0.5 tracking-wider font-extrabold font-mono uppercase">{col.badge}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* 4. VIDEO BANNER */}
                                {sec.type === 'Video banner' && (
                                  <div className="text-center space-y-2 py-3">
                                    <div className="relative h-28 w-full rounded-xl bg-slate-900 flex flex-col items-center justify-center border text-white font-mono text-[9px] uppercase tracking-widest gap-1 p-4 shadow-inner">
                                      <PlaySquare className="h-6 w-6 text-indigo-400 animate-pulse" />
                                      <span className="text-white font-extrabold">Active YouTube Video Simulated</span>
                                      {sec.settings.videoUrl ? (
                                        <span className="text-slate-400 font-normal text-[8px] max-w-xs truncate">Source: Youtube (ID: {sec.settings.videoUrl})</span>
                                      ) : (
                                        <span className="text-slate-500 font-normal text-[8px]">Using standard laboratory playlist loop template</span>
                                      )}
                                    </div>
                                    <p className="font-extrabold text-xs text-slate-700" style={{ color: sec.settings.headingColor || '#1E293B' }}>
                                      {sec.settings.title || 'Laboratory Showcase Highlights'}
                                    </p>
                                  </div>
                                )}

                                {/* 5. RICH TEXT */}
                                {sec.type === 'Rich text' && (
                                  <div className="text-center space-y-2 py-4">
                                    <h3 className="text-sm font-black uppercase" style={{ color: sec.settings.headingColor || '#1E293B' }}>
                                      {sec.settings.title || 'Editorial Showcase'}
                                    </h3>
                                    <p className="text-[10px] leading-relaxed max-w-sm mx-auto text-slate-500 font-medium">{sec.settings.description || 'Craft premium experiences under your own terms.'}</p>
                                  </div>
                                )}

                                {/* 6. MARQUEE TEXT */}
                                {sec.type === 'Marquee text' && (
                                  <div className="overflow-hidden bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center relative shadow-inner">
                                    <p className="animate-pulse flex items-center justify-center gap-1.5 font-bold text-teal-400 text-[8.5px] uppercase tracking-widest font-mono">
                                      <span>⚡ {sec.settings.title || 'FREE PRIORITY SHIPPING OVER £40!'} ⚡</span>
                                    </p>
                                  </div>
                                )}

                                {/* 7. MARQUEE IMAGES */}
                                {sec.type === 'Marquee images' && (
                                  <div className="space-y-2 py-3 text-center">
                                    <p className="text-[9.5px] font-black tracking-widest uppercase text-slate-400">
                                      🎬 {sec.settings.title || 'Fresh Stock Dispatch Reel'} 🎬
                                    </p>
                                    <div className="flex gap-2 overflow-x-auto py-2 justify-center">
                                      {localProducts.slice(0, Math.min(sec.settings.itemsCount || 5, 5)).map(prod => (
                                        <div key={prod.id} className="w-14 shrink-0 bg-white border border-slate-200/70 p-1.5 rounded-lg text-[8px] text-center shadow-3xs flex flex-col justify-between">
                                          <img src={prod.image} className="h-8 w-8 object-cover mx-auto rounded-md shadow-inner" alt="" referrerPolicy="no-referrer" />
                                          <p className="truncate font-extrabold text-slate-700 mt-1">{prod.title.split(' ')[0]}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* 8. LOGO LIST */}
                                {sec.type === 'Logo list' && (
                                  <div className="py-4 text-center space-y-3">
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-[#94A3B8]" style={{ color: sec.settings.headingColor || '#94A3B8' }}>
                                      {sec.settings.title || 'OFFICIAL LAB PARTNER REGISTER'}
                                    </p>
                                    <div className="flex gap-2 justify-center flex-wrap">
                                      {['77 Pouches', 'CUBA Power', 'CLEW White', 'KILLA Siberian'].map(logo => (
                                        <span key={logo} className="border border-slate-200 bg-white text-slate-700 font-extrabold text-[8.5px] py-1 px-2.5 rounded-lg shadow-3xs flex items-center gap-1 leading-none">
                                          <span className="text-indigo-600">●</span>
                                          <span>{logo}</span>
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* 9. COLLECTION LIST */}
                                {sec.type === 'Collection list' && (() => {
                                  const filteredLocal = sec.settings.selectedCollectionIds && sec.settings.selectedCollectionIds.length > 0
                                    ? localCollections.filter(c => sec.settings.selectedCollectionIds!.includes(c.id))
                                    : localCollections.slice(0, Math.min(sec.settings.itemsCount || 4, 4));

                                  return (
                                    <div className="py-4 space-y-3">
                                      <div className="text-center font-black uppercase text-[10px] text-slate-700 border-b pb-1">
                                        {sec.settings.title || 'Explore Brand Collections'}
                                      </div>
                                      {filteredLocal.length === 0 ? (
                                        <div className="text-center py-4 text-[10px] text-slate-400 border border-dashed rounded-xl bg-slate-50">
                                          No collections selected. Use layout editor to choose.
                                        </div>
                                      ) : (
                                        <div className="grid grid-cols-4 gap-2">
                                          {filteredLocal.map(c => (
                                            <div key={c.id} className="bg-white border text-center p-2 rounded-xl shadow-3xs overflow-hidden">
                                              <div className="h-10 bg-slate-50 rounded-lg flex items-center justify-center text-sm mb-1 overflow-hidden relative border border-slate-100">
                                                {c.image ? (
                                                  <img 
                                                    src={c.image} 
                                                    className="h-full w-full object-cover" 
                                                    alt={c.title} 
                                                    referrerPolicy="no-referrer"
                                                  />
                                                ) : (
                                                  <span>🥫</span>
                                                )}
                                              </div>
                                              <h5 className="text-[8.5px] font-black uppercase text-slate-800 truncate leading-none">{c.title}</h5>
                                              <span className="text-[7px] font-bold text-indigo-600 tracking-wider block mt-1 uppercase leading-none font-mono">{c.productIds.length} FLAVORS</span>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })()}

                                {/* 10. FEATURED COLLECTION (Fully interactive template preview grid) */}
                                {sec.type === 'Featured collection' && (() => {
                                  const selectedColl = localCollections.find(c => c.id === sec.settings.selectedCollectionId);
                                  const displayedProducts = localProducts
                                    .filter(p => !sec.settings.selectedCollectionId || selectedColl?.productIds.includes(p.id))
                                    .slice(0, Math.min(sec.settings.itemsCount || 3, 3));

                                  return (
                                    <div className="py-4 space-y-3 text-center">
                                      <div className="flex justify-between items-end border-b border-slate-100 pb-1">
                                        <div className="text-left">
                                          <span className="text-[7.5px] font-bold uppercase text-slate-400">Live Storefront Grid Demonstration</span>
                                          <h4 className="text-[10px] font-black uppercase text-slate-800" style={{ color: sec.settings.headingColor || '#1E293B' }}>
                                            {sec.settings.title || 'Featured Collection Highlights'}
                                          </h4>
                                        </div>
                                        <span className="text-[8px] text-indigo-700 font-extrabold uppercase font-mono bg-indigo-50/70 border border-indigo-100 rounded px-1.5 py-0.5 max-w-[120px] truncate">
                                          Series: {selectedColl?.title || 'All Active'}
                                        </span>
                                      </div>

                                      {displayedProducts.length === 0 ? (
                                        <div className="bg-slate-50 border border-dashed rounded-lg p-5 text-center text-[9px] text-slate-400">
                                          No active products are categorized in selected collection profile. Create products inside product tab first.
                                        </div>
                                      ) : (
                                        <div className="grid grid-cols-3 gap-2">
                                          {displayedProducts.map(p => (
                                            <div key={p.id} className="bg-white border text-left p-2 rounded-xl space-y-1 block relative overflow-hidden shadow-3xs flex flex-col justify-between">
                                              <div>
                                                <div className="h-14 bg-slate-50 rounded-lg overflow-hidden border border-slate-150 relative">
                                                  <img src={p.image} className="h-full w-full object-cover" alt="" referrerPolicy="no-referrer" />
                                                </div>
                                                <p className="text-[9px] text-slate-800 font-extrabold truncate mt-1 leading-snug">{p.title}</p>
                                                <div className="flex gap-0.5 text-amber-500 text-[6px]">★★★★★</div>
                                              </div>
                                              <div className="flex justify-between items-center pt-1 border-t border-slate-100 mt-1 leading-none">
                                                <span className="text-[9px] font-extrabold text-slate-900 font-mono">£{p.price.toFixed(2)}</span>
                                                <span className="text-[6.5px] font-black text-indigo-700 tracking-wider">ADD</span>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })()}

                                {/* 11. IMAGES GALLERY */}
                                {sec.type === 'Images gallery' && (
                                  <div className="space-y-3 py-4 text-center">
                                    <h4 className="font-extrabold text-xs uppercase" style={{ color: sec.settings.headingColor || '#1E293B' }}>
                                      {sec.settings.title || 'Laboratory & Dispatch Facility Gallery'}
                                    </h4>
                                    <div className="grid grid-cols-4 gap-2">
                                      {[
                                        'https://images.unsplash.com/photo-1543257580-7269da773bf5?auto=format&fit=crop&w=200&q=80',
                                        'https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?auto=format&fit=crop&w=200&q=80',
                                        'https://images.unsplash.com/photo-1576186726115-4d51596775d1?auto=format&fit=crop&w=200&q=80',
                                        'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=200&q=80'
                                      ].map((url, galIdx) => (
                                        <div key={galIdx} className="h-10 rounded-lg bg-slate-50 border overflow-hidden">
                                          <img src={url} className="h-full w-full object-cover" alt="" referrerPolicy="no-referrer" />
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* 12. FAQS */}
                                {sec.type === 'FAQs' && (
                                  <div className="space-y-2 py-3 font-sans">
                                    <h3 className="text-xs font-black uppercase text-center mb-1.5" style={{ color: sec.settings.headingColor || '#1E293B' }}>
                                      {sec.settings.title || 'Frequently Answered Questions'}
                                    </h3>
                                    <div className="space-y-1.5 text-[9.5px]">
                                      {[
                                        { q: 'Is delivery fully tracked?', a: 'Yes, royal mail tracking lines generate instantly email alerts.' },
                                        { q: 'Are these pouches tobacco-free?', a: 'Formulated completely on plant fiber with medical pure crystalline extract.' }
                                      ].map((faq, fIdx) => (
                                        <div key={fIdx} className="bg-slate-50 p-2 rounded-xl border border-slate-200/90 leading-snug">
                                          <div className="font-extrabold text-slate-800 flex justify-between items-center">
                                            <span>Q: {faq.q}</span>
                                            <ChevronDown className="h-3 w-3 text-slate-400 shrink-0" />
                                          </div>
                                          <p className="text-slate-500 mt-1 pt-1 border-t border-slate-100 text-[8.5px]">A: {faq.a}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* 13. SLIDESHOW */}
                                {sec.type === 'Slideshow' && (
                                  <div className="py-5 text-center space-y-3 relative overflow-hidden rounded-xl bg-slate-900 border min-h-[140px] flex flex-col justify-center items-center select-none text-white shadow-md">
                                    {/* background cover Image */}
                                    <div className="absolute inset-0 z-0">
                                      <img 
                                        src={sec.settings.slides?.[activeSlideEditIndex]?.imageUrl || sec.settings.imageUrl || 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80'} 
                                        className="w-full h-full object-cover opacity-50" 
                                        alt="" 
                                        referrerPolicy="no-referrer"
                                      />
                                      <div className="absolute inset-0 bg-black/45" />
                                    </div>

                                    {/* Content inside slide */}
                                    <div className="relative z-10 p-2 space-y-1.5 w-full">
                                      {/* Visual Arrow toggles synced */}
                                      <div className="flex justify-between items-center px-2.5 absolute top-1/2 left-0 right-0 -translate-y-1/2 z-20">
                                        <button 
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            const count = (sec.settings.slides || []).length;
                                            if (count > 0) {
                                              setActiveSlideEditIndex((activeSlideEditIndex - 1 + count) % count);
                                            }
                                          }}
                                          className="p-1 bg-white/10 hover:bg-white/30 text-white rounded-full text-[9px] font-extrabold cursor-pointer border border-white/10 shadow"
                                        >
                                          ←
                                        </button>
                                        <button 
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            const count = (sec.settings.slides || []).length;
                                            if (count > 0) {
                                              setActiveSlideEditIndex((activeSlideEditIndex + 1) % count);
                                            }
                                          }}
                                          className="p-1 bg-white/10 hover:bg-white/30 text-white rounded-full text-[9px] font-extrabold cursor-pointer border border-white/10 shadow"
                                        >
                                          →
                                        </button>
                                      </div>

                                      <span className="text-[7.5px] tracking-widest font-black uppercase bg-indigo-600/95 text-white py-0.5 px-2 rounded-full inline-block leading-none">Slideshow [Active Slide {activeSlideEditIndex + 1}]</span>
                                      <h4 className="text-xs font-black uppercase text-white px-5 leading-tight">
                                        {sec.settings.slides?.[activeSlideEditIndex]?.title || sec.settings.title || 'Precision-Engineered Purity'}
                                      </h4>
                                      <p className="text-[9.5px] text-slate-350 max-w-xs mx-auto truncate px-5">
                                        {sec.settings.slides?.[activeSlideEditIndex]?.description || 'Direct laboratory dispatch. Sourced from certified facilities.'}
                                      </p>
                                      <div className="flex gap-1.5 justify-center pt-1 z-10 relative">
                                        {(sec.settings.slides || [1, 2]).map((_, slId) => (
                                          <button
                                            key={slId}
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setActiveSlideEditIndex(slId);
                                            }}
                                            className={`h-2 w-2 rounded-full transition-all border ${slId === activeSlideEditIndex ? 'bg-white border-white scale-110 shadow-sm' : 'bg-white/30 border-transparent'}`}
                                          />
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* 14. BLOG POST */}
                                {sec.type === 'Blog post' && (
                                  <div className="py-4 space-y-3 font-sans">
                                    <div className="text-center">
                                      <h3 className="text-xs font-black uppercase tracking-tight text-slate-850" style={{ color: sec.settings.headingColor || '#1E293B' }}>
                                        {sec.settings.title || 'Latest From Our Journal'}
                                      </h3>
                                      {sec.settings.description && (
                                        <p className="text-[9px] text-slate-400 mt-0.5">{sec.settings.description}</p>
                                      )}
                                    </div>
                                    <div className="grid gap-2" style={{
                                      gridTemplateColumns: `repeat(${sec.settings.columnsDesktop || 3}, minmax(0, 1fr))`
                                    }}>
                                      {(blogs && blogs.length > 0 ? blogs.slice(0, sec.settings.columnsDesktop || 3) : [
                                        { id: '1', title: 'Swedish Pouch Manufacturing Regulations', category: 'Standards', date: 'June 19, 2026', image: 'https://images.unsplash.com/photo-1543257580-7269da773bf5?auto=format&fit=crop&w=200&q=80' },
                                        { id: '2', title: 'Why Sterile Medical Fiber is Better', category: 'Science', date: 'June 18, 2026', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=200&q=80' },
                                        { id: '3', title: 'Understanding Nicotine Salt Deliveries', category: 'Formulas', date: 'June 17, 2026', image: 'https://images.unsplash.com/photo-1576186726115-4d51596775d1?auto=format&fit=crop&w=200&q=80' }
                                      ].slice(0, sec.settings.columnsDesktop || 3)).map((item, bidx) => (
                                        <div key={item.id || bidx} className="bg-white border rounded-lg p-2 flex flex-col justify-between shadow-xs text-left">
                                          {item.image && (
                                            <img src={item.image} className="h-16 w-full object-cover rounded-md mb-1.5" alt="" referrerPolicy="no-referrer" />
                                          )}
                                          <div>
                                            <span className="text-[7.5px] uppercase text-indigo-650 font-extrabold tracking-widest">{item.category || 'Article'}</span>
                                            <h4 className="font-extrabold text-[9.5px] leading-tight text-slate-850 line-clamp-2 mt-0.5">{item.title}</h4>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* 15. BRAND LIST */}
                                {sec.type === 'Brand list' && (
                                  <div className="py-4 space-y-3 font-sans">
                                    <div className="text-center">
                                      <h3 className="text-xs font-black uppercase tracking-tight text-slate-850" style={{ color: sec.settings.headingColor || '#1E293B' }}>
                                        {sec.settings.title || 'Shop Premium Brands'}
                                      </h3>
                                      {sec.settings.description && (
                                        <p className="text-[9px] text-slate-400 mt-0.5">{sec.settings.description}</p>
                                      )}
                                    </div>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                      {(sec.settings.brandItems || []).map((b, bidx) => (
                                        <div key={bidx} className="bg-white border hover:border-indigo-150 rounded-xl p-2 flex flex-col items-center justify-center text-center shadow-xs cursor-pointer transition-all">
                                          {b.imageUrl ? (
                                            <img src={b.imageUrl} className="h-10 w-full object-contain mb-1 rounded" alt="" referrerPolicy="no-referrer" />
                                          ) : (
                                            <div className="h-10 w-full bg-slate-100 rounded mb-1 flex items-center justify-center text-slate-400 font-bold text-[8px]">No Logo</div>
                                          )}
                                          <span className="text-[8px] font-black uppercase tracking-wider text-slate-600 truncate max-w-full">{b.title || 'Brand'}</span>
                                        </div>
                                      ))}
                                      {(sec.settings.brandItems || []).length === 0 && (
                                        <p className="text-[9px] text-slate-400 text-center py-2 col-span-full">No brand items added yet.</p>
                                      )}
                                    </div>
                                  </div>
                                )}

                              </div>

                            </div>
                          );
                        })
                      )}

                    </div>
                  </div>
                </div>

                {/* 3. Right properties column: Content Customizer Sidebar */}
                <div className="lg:col-span-1 space-y-4">
                  <div className="bg-white border rounded-xl p-4 shadow-xs sticky top-4">
                    <div className="border-b border-slate-100 pb-2 mb-3">
                      <h4 className="font-extrabold text-slate-800 text-xs">Section customizer option</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Settings for selected module</p>
                    </div>

                    {currentlyEditingSection ? (
                      <div className="space-y-4 text-[11px] leading-normal font-sans">
                        
                        <div className="bg-slate-50 p-2.5 rounded border border-slate-200/55 mb-2 flex items-center justify-between">
                          <span className="font-bold text-indigo-700 capitalize">{currentlyEditingSection.type}</span>
                          <span className="text-[9px] text-slate-400 font-mono">ID: {currentlyEditingSection.id.substring(4, 8)}</span>
                        </div>

                        {/* If it is a Slideshow section */}
                        {currentlyEditingSection.type === 'Slideshow' && (
                          <div className="space-y-4 border-b border-dashed border-slate-100 pb-3">
                            <span className="block text-slate-600 font-bold uppercase tracking-wider text-[9px]">Slides list ({(currentlyEditingSection.settings.slides || []).length})</span>
                            <div className="flex flex-wrap gap-1">
                              {(currentlyEditingSection.settings.slides || []).map((_, sIdx) => (
                                <button
                                  key={sIdx}
                                  onClick={() => setActiveSlideEditIndex(sIdx)}
                                  className={`text-[9.5px] font-black px-2 py-1 rounded cursor-pointer transition-all ${
                                    activeSlideEditIndex === sIdx
                                      ? 'bg-indigo-600 text-white shadow-xs'
                                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                  }`}
                                >
                                  Slide {sIdx + 1}
                                </button>
                              ))}
                              <button
                                onClick={() => {
                                  const list = currentlyEditingSection.settings.slides || [];
                                  const newSlide = {
                                    title: 'Precision-Engineered Purity',
                                    description: 'Direct laboratory dispatch. Clinically tested 100% tobacco-free.',
                                    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=805&q=80',
                                    buttonText: 'Purchase Packs',
                                    buttonLink: 'frontend-shop'
                                  };
                                  handleUpdateSectionSettings('slides', [...list, newSlide]);
                                  setActiveSlideEditIndex(list.length);
                                }}
                                className="text-[9.5px] font-black px-2 py-1 rounded bg-teal-50 border border-teal-200 text-teal-700 hover:bg-teal-100 cursor-pointer"
                              >
                                + Add Slide
                              </button>
                            </div>

                            {/* Active Slide Form Fields */}
                            {(currentlyEditingSection.settings.slides || []).length > 0 && (
                              <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200/60 space-y-3 mt-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-[9px] font-black text-slate-500 uppercase">Editing Slide {activeSlideEditIndex + 1} Settings</span>
                                  {(currentlyEditingSection.settings.slides || []).length > 1 && (
                                    <button
                                      onClick={() => {
                                        const list = currentlyEditingSection.settings.slides || [];
                                        const updatedList = list.filter((_, idx) => idx !== activeSlideEditIndex);
                                        handleUpdateSectionSettings('slides', updatedList);
                                        setActiveSlideEditIndex(0);
                                      }}
                                      className="text-[8px] text-red-600 hover:underline cursor-pointer font-bold uppercase"
                                    >
                                      Delete Slide
                                    </button>
                                  )}
                                </div>

                                <div className="space-y-2.5">
                                  <div>
                                    <label className="block text-slate-650 font-bold uppercase tracking-wider text-[8px] mb-0.5">Slide Title</label>
                                    <input
                                      type="text"
                                      value={currentlyEditingSection.settings.slides?.[activeSlideEditIndex]?.title || ''}
                                      onChange={(e) => {
                                        const list = currentlyEditingSection.settings.slides || [];
                                        const updatedList = list.map((sl, index) => index === activeSlideEditIndex ? { ...sl, title: e.target.value } : sl);
                                        handleUpdateSectionSettings('slides', updatedList);
                                      }}
                                      className="w-full text-[10px] font-semibold border p-1.5 rounded bg-white focus:outline-none"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-slate-650 font-bold uppercase tracking-wider text-[8px] mb-0.5">Slide Subtext Description</label>
                                    <textarea
                                      rows={2}
                                      value={currentlyEditingSection.settings.slides?.[activeSlideEditIndex]?.description || ''}
                                      onChange={(e) => {
                                        const list = currentlyEditingSection.settings.slides || [];
                                        const updatedList = list.map((sl, index) => index === activeSlideEditIndex ? { ...sl, description: e.target.value } : sl);
                                        handleUpdateSectionSettings('slides', updatedList);
                                      }}
                                      className="w-full text-[10px] border p-1.5 rounded bg-white focus:outline-none resize-none"
                                    />
                                  </div>

                                  <ImageUploadInput
                                    label="Slide Image asset"
                                    value={currentlyEditingSection.settings.slides?.[activeSlideEditIndex]?.imageUrl || ''}
                                    onChange={(base64) => {
                                      const list = currentlyEditingSection.settings.slides || [];
                                      const updatedList = list.map((sl, index) => index === activeSlideEditIndex ? { ...sl, imageUrl: base64 } : sl);
                                      handleUpdateSectionSettings('slides', updatedList);
                                    }}
                                  />

                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="block text-slate-650 font-bold uppercase tracking-wider text-[8px] mb-0.5">Button text</label>
                                      <input
                                        type="text"
                                        value={currentlyEditingSection.settings.slides?.[activeSlideEditIndex]?.buttonText || ''}
                                        onChange={(e) => {
                                          const list = currentlyEditingSection.settings.slides || [];
                                          const updatedList = list.map((sl, index) => index === activeSlideEditIndex ? { ...sl, buttonText: e.target.value } : sl);
                                          handleUpdateSectionSettings('slides', updatedList);
                                        }}
                                        className="w-full text-[10px] border p-1.5 rounded bg-white focus:outline-none"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-slate-650 font-bold uppercase tracking-wider text-[8px] mb-0.5">button action link</label>
                                      <input
                                        type="text"
                                        value={currentlyEditingSection.settings.slides?.[activeSlideEditIndex]?.buttonLink || ''}
                                        onChange={(e) => {
                                          const list = currentlyEditingSection.settings.slides || [];
                                          const updatedList = list.map((sl, index) => index === activeSlideEditIndex ? { ...sl, buttonLink: e.target.value } : sl);
                                          handleUpdateSectionSettings('slides', updatedList);
                                        }}
                                        className="w-full text-[10px] border p-1.5 rounded bg-white focus:outline-none"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Title text input options */}
                        {currentlyEditingSection.settings.title !== undefined && currentlyEditingSection.type !== 'Slideshow' && (
                          <div>
                            <label className="block text-slate-650 font-bold uppercase tracking-wider text-[9px] mb-1">Heading Title Text</label>
                            <input
                              type="text"
                              value={currentlyEditingSection.settings.title}
                              onChange={(e) => handleUpdateSectionSettings('title', e.target.value)}
                              className="w-full text-xs font-semibold border p-2 rounded bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-650"
                            />
                          </div>
                        )}

                        {/* Description paragraphs input */}
                        {currentlyEditingSection.settings.description !== undefined && currentlyEditingSection.type !== 'Slideshow' && (
                          <div>
                            <label className="block text-slate-650 font-bold uppercase tracking-wider text-[9px] mb-1">Body/Info Text</label>
                            <textarea
                              rows={3}
                              value={currentlyEditingSection.settings.description}
                              onChange={(e) => handleUpdateSectionSettings('description', e.target.value)}
                              className="w-full text-xs border p-2 rounded bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-650 resize-none leading-relaxed"
                            />
                          </div>
                        )}

                        {/* Button text option */}
                        {currentlyEditingSection.settings.buttonText !== undefined && currentlyEditingSection.type !== 'Slideshow' && (
                          <div>
                            <label className="block text-slate-650 font-bold uppercase tracking-wider text-[9px] mb-1">Banner Button Text</label>
                            <input
                              type="text"
                              value={currentlyEditingSection.settings.buttonText}
                              onChange={(e) => handleUpdateSectionSettings('buttonText', e.target.value)}
                              className="w-full text-xs border p-2 rounded bg-slate-50 focus:outline-none focus:ring-1"
                            />
                          </div>
                        )}

                        {/* Action link */}
                        {currentlyEditingSection.settings.buttonLink !== undefined && currentlyEditingSection.type !== 'Slideshow' && (
                          <div>
                            <label className="block text-slate-650 font-bold uppercase tracking-wider text-[9px] mb-1">Button redirect link</label>
                            <input
                              type="text"
                              value={currentlyEditingSection.settings.buttonLink}
                              onChange={(e) => handleUpdateSectionSettings('buttonLink', e.target.value)}
                              className="w-full text-xs border p-2 rounded bg-slate-50 focus:outline-none focus:ring-1"
                            />
                          </div>
                        )}

                        {/* CUSTOM COLLECTION PICKER FOR FEATURED COLLECTION */}
                        {currentlyEditingSection.type === 'Featured collection' && (
                          <div className="space-y-3 pt-1">
                            <div>
                              <label className="block text-slate-650 font-bold uppercase tracking-wider text-[8.5px] mb-1">Target Product Collection</label>
                              <select
                                value={currentlyEditingSection.settings.selectedCollectionId || ''}
                                onChange={(e) => handleUpdateSectionSettings('selectedCollectionId', e.target.value)}
                                className="w-full text-xs font-semibold border p-2 rounded bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-650 cursor-pointer"
                              >
                                <option value="">-- All Active Products (De-categorized) --</option>
                                {collections.map(c => (
                                  <option key={c.id} value={c.id}>{c.title}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <label className="block text-slate-650 font-bold uppercase tracking-wider text-[8.5px]">Products To Display</label>
                                <span className="font-mono text-[9px] font-bold text-indigo-700 bg-indigo-50 px-1.5 rounded">{currentlyEditingSection.settings.itemsCount || 3} items</span>
                              </div>
                              <input 
                                type="range" 
                                min={2} 
                                max={12} 
                                value={currentlyEditingSection.settings.itemsCount || 3}
                                onChange={(e) => handleUpdateSectionSettings('itemsCount', parseInt(e.target.value))}
                                className="w-full h-1 text-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 bg-slate-200"
                              />
                            </div>
                          </div>
                        )}

                        {/* CUSTOM COLLECTION LIST COUNTER LIMIT */}
                        {currentlyEditingSection.type === 'Collection list' && (
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <label className="block text-slate-650 font-bold uppercase tracking-wider text-[8.5px]">Collections To Display</label>
                                <span className="font-mono text-[9px] font-bold text-indigo-700 bg-indigo-50 px-1.5 rounded">{currentlyEditingSection.settings.itemsCount || 4} categories</span>
                              </div>
                              <input 
                                type="range" 
                                min={1} 
                                max={12} 
                                value={currentlyEditingSection.settings.itemsCount || 4}
                                onChange={(e) => handleUpdateSectionSettings('itemsCount', parseInt(e.target.value))}
                                className="w-full h-1 text-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 bg-slate-200"
                              />
                            </div>

                            <div className="pt-3 border-t border-slate-100">
                              <label className="block text-slate-650 font-bold uppercase tracking-wider text-[8.5px] mb-1.5">Selected Collections</label>
                              <div className="space-y-1.5 max-h-[160px] overflow-y-auto border border-slate-200 p-2.5 rounded-xl bg-slate-50 shadow-inner scrollbar-thin">
                                {collections.map(c => {
                                  const selectedIds = currentlyEditingSection.settings.selectedCollectionIds || [];
                                  const isSelected = selectedIds.includes(c.id);
                                  return (
                                    <label key={c.id} className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer hover:text-slate-900 transition-colors py-0.5">
                                      <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => {
                                          let updatedIds;
                                          if (isSelected) {
                                            updatedIds = selectedIds.filter(id => id !== c.id);
                                          } else {
                                            updatedIds = [...selectedIds, c.id];
                                          }
                                          handleUpdateSectionSettings('selectedCollectionIds', updatedIds);
                                        }}
                                        className="rounded border-slate-300 text-indigo-650 focus:ring-indigo-500 h-3.5 w-3.5 cursor-pointer"
                                      />
                                      <span className="truncate flex-1 text-[11px] leading-none">{c.title}</span>
                                      {c.image && (
                                        <img src={c.image} className="w-5 h-5 rounded object-cover border border-slate-200 shrink-0" alt="" referrerPolicy="no-referrer" />
                                      )}
                                    </label>
                                  );
                                })}
                                {collections.length === 0 && (
                                  <p className="text-[10px] text-slate-400 text-center py-2">No collections registered.</p>
                                )}
                              </div>
                              <p className="text-[8.5px] text-slate-400 mt-1.5 leading-tight">By default (if none are selected), the component queries and renders all available database categories up to the listing limit.</p>
                            </div>
                          </div>
                        )}

                        {/* CUSTOM MARQUEE IMAGES COUNTER LIMIT */}
                        {currentlyEditingSection.type === 'Marquee images' && (
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <label className="block text-slate-650 font-bold uppercase tracking-wider text-[8.5px]">Images Carousel Limit</label>
                              <span className="font-mono text-[9px] font-bold text-indigo-700 bg-indigo-50 px-1.5 rounded">{currentlyEditingSection.settings.itemsCount || 5} slide items</span>
                            </div>
                            <input 
                              type="range" 
                              min={3} 
                              max={10} 
                              value={currentlyEditingSection.settings.itemsCount || 5}
                              onChange={(e) => handleUpdateSectionSettings('itemsCount', parseInt(e.target.value))}
                              className="w-full h-1 text-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 bg-slate-200"
                            />
                          </div>
                        )}

                        {/* CUSTOM VIDEO BANNER LINK SOURCE CODE */}
                        {currentlyEditingSection.type === 'Video banner' && (
                          <div>
                            <label className="block text-slate-650 font-bold uppercase tracking-wider text-[8.5px] mb-1">YouTube Video ID / URL Resource</label>
                            <input
                              type="text"
                              placeholder="e.g. dQw4w9WgXcQ"
                              value={currentlyEditingSection.settings.videoUrl || ''}
                              onChange={(e) => handleUpdateSectionSettings('videoUrl', e.target.value)}
                              className="w-full text-xs font-semibold border p-2 rounded bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-650"
                            />
                            <p className="text-[8.5px] text-slate-400 mt-1">Provide the Youtube 11-character video ID to loop laboratory showcase media.</p>
                          </div>
                        )}

                        {/* BLOG POST EDITING SETTINGS */}
                        {currentlyEditingSection.type === 'Blog post' && (
                          <div className="space-y-3 pt-1">
                            <div>
                              <label className="block text-slate-650 font-bold uppercase tracking-wider text-[8.5px] mb-1">Columns in Desktop</label>
                              <select
                                value={currentlyEditingSection.settings.columnsDesktop || 3}
                                onChange={(e) => handleUpdateSectionSettings('columnsDesktop', parseInt(e.target.value))}
                                className="w-full text-xs font-semibold border p-2 rounded bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-650 cursor-pointer"
                              >
                                <option value={1}>1 Column</option>
                                <option value={2}>2 Columns</option>
                                <option value={3}>3 Columns</option>
                                <option value={4}>4 Columns</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-slate-650 font-bold uppercase tracking-wider text-[8.5px] mb-1">Columns in Mobile</label>
                              <select
                                value={currentlyEditingSection.settings.columnsMobile || 1}
                                onChange={(e) => handleUpdateSectionSettings('columnsMobile', parseInt(e.target.value))}
                                className="w-full text-xs font-semibold border p-2 rounded bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-650 cursor-pointer"
                              >
                                <option value={1}>1 Column</option>
                                <option value={2}>2 Columns</option>
                              </select>
                            </div>
                          </div>
                        )}

                        {/* BRAND LIST EDITING SETTINGS */}
                        {currentlyEditingSection.type === 'Brand list' && (
                          <div className="space-y-4 pt-1">
                            <div className="flex justify-between items-center">
                              <label className="block text-slate-650 font-bold uppercase tracking-wider text-[9px]">Brand Logos Matrix</label>
                              <button
                                type="button"
                                onClick={() => {
                                  const list = currentlyEditingSection.settings.brandItems || [];
                                  const updated = [...list, { imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=150&q=80', linkUrl: 'frontend-shop', title: 'New Brand' }];
                                  handleUpdateSectionSettings('brandItems', updated);
                                }}
                                className="text-[9px] bg-indigo-50 text-indigo-700 hover:bg-indigo-100 p-1 px-2 rounded-md font-bold transition-all cursor-pointer uppercase tracking-wider"
                              >
                                + Add Brand
                              </button>
                            </div>

                            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1 scrollbar-thin">
                              {(currentlyEditingSection.settings.brandItems || []).map((b, idx) => (
                                <div key={idx} className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg space-y-2 relative">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const list = [...(currentlyEditingSection.settings.brandItems || [])];
                                      list.splice(idx, 1);
                                      handleUpdateSectionSettings('brandItems', list);
                                    }}
                                    className="absolute top-1.5 right-1.5 text-slate-400 hover:text-rose-500 cursor-pointer p-0.5"
                                    title="Delete Brand Logo"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>

                                  <div className="text-[9px] font-black uppercase text-indigo-650 mb-1">Brand #{idx + 1}</div>

                                  <div>
                                    <label className="block text-[8px] font-bold text-slate-405 uppercase mb-0.5">Brand Name</label>
                                    <input
                                      type="text"
                                      value={b.title || ''}
                                      onChange={(e) => {
                                        const list = [...(currentlyEditingSection.settings.brandItems || [])];
                                        list[idx] = { ...list[idx], title: e.target.value };
                                        handleUpdateSectionSettings('brandItems', list);
                                      }}
                                      className="w-full text-[10px] border p-1 rounded bg-white focus:outline-none"
                                      placeholder="e.g. VELO Freeze"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-[8px] font-bold text-slate-405 uppercase mb-0.5">Redirect Link (URL/Slug)</label>
                                    <input
                                      type="text"
                                      value={b.linkUrl || ''}
                                      onChange={(e) => {
                                        const list = [...(currentlyEditingSection.settings.brandItems || [])];
                                        list[idx] = { ...list[idx], linkUrl: e.target.value };
                                        handleUpdateSectionSettings('brandItems', list);
                                      }}
                                      className="w-full text-[10px] border p-1 rounded bg-white focus:outline-none font-mono"
                                      placeholder="e.g. frontend-shop / collections /pages/brands"
                                    />
                                  </div>

                                  <ImageUploadInput
                                    label="Upload Brand Logo Asset"
                                    value={b.imageUrl}
                                    onChange={(base64) => {
                                      const list = [...(currentlyEditingSection.settings.brandItems || [])];
                                      list[idx] = { ...list[idx], imageUrl: base64 };
                                      handleUpdateSectionSettings('brandItems', list);
                                    }}
                                  />
                                </div>
                              ))}
                              {(currentlyEditingSection.settings.brandItems || []).length === 0 && (
                                <p className="text-[10px] text-slate-400 text-center py-4">No brands in the list. Click "+ Add Brand" above.</p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Image asset url selector */}
                        {currentlyEditingSection.settings.imageUrl !== undefined && currentlyEditingSection.type !== 'Slideshow' && (
                          <ImageUploadInput
                            label="Cover Image asset"
                            value={currentlyEditingSection.settings.imageUrl}
                            onChange={(base64) => handleUpdateSectionSettings('imageUrl', base64)}
                          />
                        )}

                        {/* Width toggle controls - Premium Selector Button Group */}
                        <div className="space-y-1.5 pt-2">
                          <label className="block text-slate-650 font-bold uppercase tracking-wider text-[8px]">Section container width</label>
                          <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/60">
                            <button
                              type="button"
                              onClick={() => handleUpdateSectionSettings('fullWidth', false)}
                              className={`text-[9.5px] font-extrabold py-1.5 px-2 rounded-md transition-all cursor-pointer text-center ${
                                !currentlyEditingSection.settings.fullWidth
                                  ? 'bg-white text-indigo-650 shadow-xs border border-slate-250/20'
                                  : 'text-slate-500 hover:text-slate-850'
                              }`}
                            >
                              Page Bounded
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateSectionSettings('fullWidth', true)}
                              className={`text-[9.5px] font-extrabold py-1.5 px-2 rounded-md transition-all cursor-pointer text-center ${
                                currentlyEditingSection.settings.fullWidth
                                  ? 'bg-white text-indigo-650 shadow-xs border border-slate-250/20'
                                  : 'text-slate-500 hover:text-slate-850'
                              }`}
                            >
                              Edge-to-Edge Wide
                            </button>
                          </div>
                        </div>

                        {/* Colors setting options */}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <div>
                            <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">BG Hex Color</label>
                            <input
                              type="color"
                              value={currentlyEditingSection.settings.backgroundColor}
                              onChange={(e) => handleUpdateSectionSettings('backgroundColor', e.target.value)}
                              className="w-full h-8 border rounded cursor-pointer bg-slate-50"
                            />
                          </div>
                          <div>
                            <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1 font-sans">Title Text Hex</label>
                            <input
                              type="color"
                              value={currentlyEditingSection.settings.headingColor}
                              onChange={(e) => handleUpdateSectionSettings('headingColor', e.target.value)}
                              className="w-full h-8 border rounded cursor-pointer bg-slate-50"
                            />
                          </div>
                        </div>

                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400 py-6 text-center">Click on any module section inside simulator preview to load options.</p>
                    )}

                  </div>
                </div>

              </div>
              </div>
            )}

          </div>
        )}

        {/* 6. FILES MANAGER BLOCK */}
        {activeTab === 'files' && (
          <div className="space-y-6">
            
            {/* Header controls filter */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Filter media files..."
                  value={fileQuery}
                  onChange={(e) => setFileQuery(e.target.value)}
                  className="w-full text-xs p-2 pb-2 pl-8 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-500 bg-slate-50"
                />
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              </div>

              <button
                onClick={() => setShowAddFile(true)}
                className="bg-slate-900 hover:bg-slate-850 text-white font-bold text-xs p-2.5 px-4 rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Upload Custom Image Asset
              </button>
            </div>

            {/* List files layout table */}
            <div className="bg-white border rounded-xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/75 border-b border-slate-200 text-[10px] text-slate-450 font-bold uppercase tracking-widest">
                      <th className="p-4">Media Thumbnail</th>
                      <th className="p-4">File Name Name</th>
                      <th className="p-4">Alternative Alt Text</th>
                      <th className="p-4">Date Uploaded</th>
                      <th className="p-4">Size</th>
                      <th className="p-4">Linked Reference</th>
                      <th className="p-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredFiles.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-slate-400">No media assets configured.</td>
                      </tr>
                    ) : (
                      filteredFiles.map(file => (
                        <tr key={file.id} className="hover:bg-slate-50/50">
                          <td className="p-4 shrink-0">
                            <img
                              src={file.url}
                              alt={file.altText}
                              className="w-12 h-12 object-cover rounded-md bg-slate-50 border border-slate-100"
                              referrerPolicy="no-referrer"
                            />
                          </td>
                          <td className="p-4 text-slate-905 max-w-xs font-mono font-bold leading-normal text-[11px] truncate">{file.fileName}</td>
                          <td className="p-4 text-slate-500 max-w-xs truncate">{file.altText}</td>
                          <td className="p-4 text-slate-400">{file.dateAdded}</td>
                          <td className="p-4 font-semibold text-slate-700">{file.size}</td>
                          <td className="p-4 text-indigo-600 font-bold">{file.references}</td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => handleDeleteFile(file.id)}
                              className="text-red-500 hover:text-red-700 font-extrabold cursor-pointer"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Upload File Modal */}
            {showAddFile && (
              <div className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-sm w-full shadow-2xl animate-scale">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
                    <h3 className="font-extrabold text-slate-800 text-sm">Upload Mock File Link</h3>
                    <button onClick={() => setShowAddFile(false)} className="text-slate-400 hover:text-slate-650 cursor-pointer text-xs font-bold">Close</button>
                  </div>

                  <form onSubmit={handleAddFileSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-600 uppercase tracking-widest text-[9px] mb-1">File Name</label>
                      <input
                        id="file-form-name"
                        type="text"
                        required
                        placeholder="e.g. Clew_Spearmint_pack.png"
                        value={newFileForm.fileName}
                        onChange={(e) => setNewFileForm({ ...newFileForm, fileName: e.target.value })}
                        className="w-full border p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-500"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-600 uppercase tracking-widest text-[9px] mb-1">Alternative Alt Description</label>
                      <input
                        id="file-form-alt"
                        type="text"
                        required
                        placeholder="e.g. CLEW 5mg Minty canisters on display banner"
                        value={newFileForm.altText}
                        onChange={(e) => setNewFileForm({ ...newFileForm, altText: e.target.value })}
                        className="w-full border p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-500"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-600 uppercase tracking-widest text-[9px] mb-1">Image Cloud Asset URL</label>
                      <input
                        id="file-form-url"
                        type="text"
                        required
                        placeholder="https://images.unsplash.com/..."
                        value={newFileForm.url}
                        onChange={(e) => setNewFileForm({ ...newFileForm, url: e.target.value })}
                        className="w-full border p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-lg cursor-pointer"
                    >
                      Save Media file Asset
                    </button>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

        {/* 7. CUSTOMERS BLOCK */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            
            {/* Header control toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Filter client files, names..."
                  value={customerQuery}
                  onChange={(e) => setCustomerQuery(e.target.value)}
                  className="w-full text-xs p-2 pb-2 pl-8 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-500 bg-slate-50"
                />
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              </div>

              <button
                onClick={() => setShowAddCustomer(true)}
                className="bg-slate-900 hover:bg-slate-850 text-white font-bold text-xs p-2.5 px-4 rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Add Register Customer Profile
              </button>
            </div>

            {/* Customers details list */}
            <div className="bg-white border rounded-xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/75 border-b border-slate-200 text-[10px] text-slate-450 font-bold uppercase tracking-widest">
                      <th className="p-4">Customer Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Delivery Location</th>
                      <th className="p-4 text-center">Subscription Status</th>
                      <th className="p-4 text-center">Total Orders Count</th>
                      <th className="p-4 text-right font-sans">Total Spent Amount</th>
                      <th className="p-4 text-center">Reference profile</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCustomers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-slate-400">No Customers configured on store directory.</td>
                      </tr>
                    ) : (
                      filteredCustomers.map(cust => (
                        <tr key={cust.id} className="hover:bg-slate-50/50">
                          <td className="p-4 font-black text-slate-900">{cust.name}</td>
                          <td className="p-4 text-slate-500">{cust.email}</td>
                          <td className="p-4 text-slate-700">{cust.location}</td>
                          <td className="p-4 text-center">
                            <span className={`inline-block py-0.5 px-2 rounded-full font-bold text-[9px] uppercase tracking-wider ${
                              cust.subscriptionStatus === 'Subscribed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-150' : 'bg-slate-100 text-slate-400'
                            }`}>
                              {cust.subscriptionStatus}
                            </span>
                          </td>
                          <td className="p-4 text-center font-bold text-slate-800">{cust.ordersCount} buys</td>
                          <td className="p-4 text-right font-extrabold text-slate-950">£{cust.amountSpent.toFixed(2)}</td>
                          <td className="p-4 text-center font-bold text-[10px] text-slate-400 uppercase">Registered</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Add Customer Modal */}
            {showAddCustomer && (
              <div className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-sm w-full shadow-2xl animate-scale">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
                    <h3 className="font-extrabold text-slate-800 text-sm">Register Custom Client Profile</h3>
                    <button onClick={() => setShowAddCustomer(false)} className="text-slate-400 hover:text-slate-650 cursor-pointer text-xs font-bold">Close</button>
                  </div>

                  <form onSubmit={handleAddCustomerSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-600 uppercase tracking-widest text-[9px] mb-1">Full Name</label>
                      <input
                        id="cust-form-name"
                        type="text"
                        required
                        placeholder="e.g. Sandra Kaneshiro"
                        value={newCustomerForm.name}
                        onChange={(e) => setNewCustomerForm({ ...newCustomerForm, name: e.target.value })}
                        className="w-full border p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-500"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-600 uppercase tracking-widest text-[9px] mb-1">Email Address</label>
                      <input
                        id="cust-form-email"
                        type="email"
                        required
                        placeholder="e.g. sandra.k@gmail.com"
                        value={newCustomerForm.email}
                        onChange={(e) => setNewCustomerForm({ ...newCustomerForm, email: e.target.value })}
                        className="w-full border p-2.5 rounded-lg focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-600 uppercase tracking-widest text-[9px] mb-1">Delivery address country</label>
                      <input
                        id="cust-form-loc"
                        type="text"
                        placeholder="e.g. Honolulu HI, United States"
                        value={newCustomerForm.location}
                        onChange={(e) => setNewCustomerForm({ ...newCustomerForm, location: e.target.value })}
                        className="w-full border p-2.5 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-600 uppercase tracking-widest text-[9px] mb-1">Subscription plan status</label>
                      <select
                        id="cust-form-subs"
                        value={newCustomerForm.subscriptionStatus}
                        onChange={(e) => setNewCustomerForm({ ...newCustomerForm, subscriptionStatus: e.target.value as any })}
                        className="w-full border p-2.5 rounded-lg focus:outline-none"
                      >
                        <option value="Subscribed">Subscribed (Active Plans)</option>
                        <option value="Not subscribed">Not subscribed</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-lg cursor-pointer"
                    >
                      Publish Client Record
                    </button>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

        {/* 8. DISCOUNTS BLOCK */}
        {activeTab === 'discounts' && (
          <div className="space-y-6">
            
            {/* Header controls select */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Filter coupons codes..."
                  value={discountQuery}
                  onChange={(e) => setDiscountQuery(e.target.value)}
                  className="w-full text-xs p-2 pb-2 pl-8 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-500 bg-slate-50"
                />
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              </div>

              <button
                onClick={() => setShowAddDiscount(true)}
                className="bg-slate-900 hover:bg-slate-850 text-white font-bold text-xs p-2.5 px-4 rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Create Discount coupon
              </button>
            </div>

            {/* Discounts List database table */}
            <div className="bg-white border rounded-xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/75 border-b border-slate-200 text-[10px] text-slate-450 font-bold uppercase tracking-widest">
                      <th className="p-4">Promo code</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Eligibility Method</th>
                      <th className="p-4">Discount Type</th>
                      <th className="p-4 text-center">Usage Count</th>
                      <th className="p-4">Rule summary details</th>
                      <th className="p-4 text-center">Toggle / Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredDiscounts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-slate-400">No promo discount campaigns configured.</td>
                      </tr>
                    ) : (
                      filteredDiscounts.map(disc => (
                        <tr key={disc.id} className="hover:bg-slate-50/50">
                          <td className="p-4 font-mono font-black text-slate-950 text-xs tracking-wider uppercase bg-slate-50/45 inline-block my-2 border rounded border-dashed px-2 border-slate-300 ml-4">{disc.title}</td>
                          <td className="p-4">
                            <span className={`inline-block py-0.5 px-2 rounded-full font-black text-[9px] uppercase tracking-wide border ${
                              disc.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-150' : 'bg-rose-50 text-rose-700 border-rose-150'
                            }`}>
                              {disc.status}
                            </span>
                          </td>
                          <td className="p-4 font-bold text-slate-700">{disc.eligibility}</td>
                          <td className="p-4 text-indigo-650 font-bold">{disc.type}</td>
                          <td className="p-4 text-center font-extrabold text-slate-800">{disc.used} redeemed</td>
                          <td className="p-4 text-slate-500 max-w-xs truncate">{disc.details}</td>
                          <td className="p-4 text-center text-xs space-x-1.5 whitespace-nowrap">
                            <button
                              onClick={() => handleToggleDiscountStatus(disc.id)}
                              className="text-indigo-600 hover:text-indigo-850 font-extrabold cursor-pointer"
                            >
                              {disc.status === 'Active' ? 'Disable' : 'Enable'}
                            </button>
                            <span className="text-slate-300">|</span>
                            <button
                              onClick={() => handleDeleteDiscount(disc.id)}
                              className="text-red-500 hover:text-red-700 font-extrabold cursor-pointer"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Create Discount Modal */}
            {showAddDiscount && (
              <div className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl border border-slate-220 p-6 max-w-sm w-full shadow-2xl animate-scale">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
                    <h3 className="font-extrabold text-slate-850 text-sm">Generate Discount Code Coupon</h3>
                    <button onClick={() => setShowAddDiscount(false)} className="text-slate-400 hover:text-slate-650 cursor-pointer text-xs font-bold">Close</button>
                  </div>

                  <form onSubmit={handleCreateDiscountSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-600 uppercase tracking-widest text-[9px] mb-1">Coupon code tag name</label>
                      <input
                        id="disc-form-name"
                        type="text"
                        required
                        placeholder="e.g. CRUSHCLUB15"
                        value={newDiscountForm.title}
                        onChange={(e) => setNewDiscountForm({ ...newDiscountForm, title: e.target.value })}
                        className="w-full border p-2.5 rounded-lg focus:outline-none text-xs font-bold tracking-wider placeholder:normal-case uppercase"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-600 uppercase tracking-widest text-[9px] mb-1">Discount Type category</label>
                      <select
                        id="disc-form-type"
                        value={newDiscountForm.type}
                        onChange={(e) => setNewDiscountForm({ ...newDiscountForm, type: e.target.value as any })}
                        className="w-full border p-2.5 rounded-lg focus:outline-none"
                      >
                        <option value="Amount off products">Amount off products</option>
                        <option value="Buy X get Y">Buy X get Y</option>
                        <option value="Amount off order">Amount off order</option>
                        <option value="Free shipping">Free shipping</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-600 uppercase tracking-widest text-[9px] mb-1">Rule Summary & Details text</label>
                      <input
                        id="disc-form-details"
                        type="text"
                        required
                        placeholder="e.g. 15% off one-time purchase products"
                        value={newDiscountForm.details}
                        onChange={(e) => setNewDiscountForm({ ...newDiscountForm, details: e.target.value })}
                        className="w-full border p-2.5 rounded-lg focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-600 uppercase tracking-widest text-[9px] mb-1">Customer Eligibility</label>
                      <select
                        id="disc-form-eligibility"
                        value={newDiscountForm.title}
                        onChange={(e) => setNewDiscountForm({ ...newDiscountForm, eligibility: e.target.value })}
                        className="w-full border p-2.5 rounded-lg focus:outline-none"
                      >
                        <option value="All customers">All customers</option>
                        <option value="Megan Matsuoka">Megan Matsuoka (Custom)</option>
                        <option value="Subscribed members only">Subscribed members only</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-lg cursor-pointer"
                    >
                      Publish Discount coupon
                    </button>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

        {/* 9. BLOGS BLOCK */}
        {activeTab === 'blogs' && (
          <div className="space-y-6">
            
            {/* Header controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Search blogs by title or tag..."
                    value={blogQuery}
                    onChange={(e) => setBlogQuery(e.target.value)}
                    className="w-full text-xs p-2 pb-2 pl-8 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-500 bg-slate-50"
                  />
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                </div>

                <select
                  value={blogStatusFilter}
                  onChange={(e) => setBlogStatusFilter(e.target.value as any)}
                  className="text-xs p-2 border border-slate-200 rounded-lg focus:outline-none bg-slate-50 cursor-pointer min-w-[120px]"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <button
                onClick={() => {
                  setNewBlogForm({
                    title: '', excerpt: '', content: '', image: '',
                    author: 'Admin', category: 'General', status: 'Active',
                    publishedAt: '', readTime: '5 min read', tags: []
                  });
                  setBlogTagsInput('');
                  setShowAddBlog(true);
                }}
                className="bg-slate-900 hover:bg-slate-850 text-white font-bold text-xs p-2.5 px-4 rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Create Blog Post
              </button>
            </div>

            {/* Blogs list table */}
            <div className="bg-white border rounded-xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/75 border-b border-slate-200 text-[10px] text-slate-450 font-bold uppercase tracking-widest">
                      <th className="p-4">Article</th>
                      <th className="p-4">Author & Category</th>
                      <th className="p-4">Slug / Route</th>
                      <th className="p-4">Stats</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Published At</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredBlogs.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-slate-400">No blog posts found matching criteria.</td>
                      </tr>
                    ) : (
                      filteredBlogs.map(blog => (
                        <tr key={blog.id} className="hover:bg-slate-50/50">
                          <td className="p-4">
                            <div className="flex items-center gap-3 min-w-[280px]">
                              <img 
                                src={blog.image} 
                                alt={blog.title} 
                                referrerPolicy="no-referrer"
                                className="w-12 h-12 object-cover rounded-lg border border-slate-150 shrink-0" 
                              />
                              <div>
                                <h4 className="font-bold text-slate-900 text-xs hover:text-indigo-650 transition cursor-pointer" onClick={() => {
                                  setSelectedBlog(blog);
                                  setBlogTagsInput(blog.tags.join(', '));
                                }}>{blog.title}</h4>
                                <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 max-w-xs">{blog.excerpt}</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {blog.tags.map((t, idx) => (
                                    <span key={idx} className="bg-slate-50 text-[9px] text-slate-500 rounded px-1.5 font-medium border border-slate-150">#{t}</span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-semibold text-slate-800">{blog.author}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">{blog.category}</div>
                          </td>
                          <td className="p-4 font-mono text-[10px] text-slate-500">
                            /blogs/{blog.slug}
                          </td>
                          <td className="p-4 text-slate-500">
                            <div className="font-semibold text-slate-700">{blog.readTime}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">{blog.content ? blog.content.split(/\s+/).length : 0} words</div>
                          </td>
                          <td className="p-4">
                            <span className={`inline-block py-0.5 px-2 rounded-full font-black text-[9px] uppercase tracking-wide border ${
                              blog.status === 'Active' 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-150' 
                                : blog.status === 'Draft' 
                                ? 'bg-gray-100 text-gray-700 border-gray-200' 
                                : 'bg-amber-50 text-amber-700 border-amber-150'
                            }`}>
                              {blog.status}
                            </span>
                          </td>
                          <td className="p-4 text-slate-500 font-semibold text-[11px]">
                            {blog.publishedAt}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                onClick={() => {
                                  setSelectedBlog(blog);
                                  setBlogTagsInput(blog.tags.join(', '));
                                }}
                                className="p-1 px-1.5 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-md border border-slate-200 transition cursor-pointer"
                                title="Edit Article"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDeleteBlog(blog.id)}
                                className="p-1 text-rose-600 hover:text-rose-900 hover:bg-rose-50 rounded-md transition cursor-pointer"
                                title="Delete Article"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ADD BLOG MODAL */}
            {showAddBlog && (
              <div className="fixed inset-0 bg-slate-905/45 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl border border-slate-150 overflow-hidden flex flex-col max-h-[90vh]">
                  
                  {/* Modal Header */}
                  <div className="p-5 border-b flex justify-between items-center bg-slate-50">
                    <div>
                      <h3 className="font-black text-slate-800 text-sm">Create New Editorial Post</h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">Publish an article to keep your clients informed & engaged.</p>
                    </div>
                    <button onClick={() => setShowAddBlog(false)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Modal Body Form */}
                  <form onSubmit={handleCreateBlog} className="p-6 overflow-y-auto space-y-4 flex-1 text-left text-xs">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-600 uppercase tracking-wider text-[9px] mb-1">Article Title *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 5 Pouch Hacks for Winter"
                          value={newBlogForm.title}
                          onChange={(e) => {
                            const title = e.target.value;
                            setNewBlogForm({ 
                              ...newBlogForm, 
                              title,
                              slug: slugify(title)
                            });
                          }}
                          className="w-full border p-2 rounded-lg focus:ring-1 focus:ring-slate-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-600 uppercase tracking-wider text-[9px] mb-1">Slug Route (Unique URL) *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 5-pouch-hacks-for-winter"
                          value={newBlogForm.slug}
                          onChange={(e) => setNewBlogForm({ ...newBlogForm, slug: slugify(e.target.value) })}
                          className="w-full border p-2 rounded-lg focus:ring-1 focus:ring-slate-400 focus:outline-none font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-bold text-slate-600 uppercase tracking-wider text-[9px] mb-1">Author Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Store Owner"
                          value={newBlogForm.author}
                          onChange={(e) => setNewBlogForm({ ...newBlogForm, author: e.target.value })}
                          className="w-full border p-2 rounded-lg focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-600 uppercase tracking-wider text-[9px] mb-1">Category</label>
                        <select
                          value={newBlogForm.category}
                          onChange={(e) => setNewBlogForm({ ...newBlogForm, category: e.target.value })}
                          className="w-full border p-2 rounded-lg focus:outline-none bg-white cursor-pointer"
                        >
                          <option value="Chemistry & Science">Chemistry & Science</option>
                          <option value="Buying Guides">Buying Guides</option>
                          <option value="Tips & Hacks">Tips & Hacks</option>
                          <option value="Industry Trends">Industry Trends</option>
                          <option value="General">General</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-600 uppercase tracking-wider text-[9px] mb-1">Status</label>
                        <select
                          value={newBlogForm.status}
                          onChange={(e) => setNewBlogForm({ ...newBlogForm, status: e.target.value as any })}
                          className="w-full border p-2 rounded-lg focus:outline-none bg-white cursor-pointer"
                        >
                          <option value="Active">Active (Visible)</option>
                          <option value="Draft">Draft (Hidden)</option>
                          <option value="Archived">Archived</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col justify-end">
                        <ImageUploadInput
                          label="Cover Image"
                          value={newBlogForm.image || ''}
                          onChange={(base64) => setNewBlogForm({ ...newBlogForm, image: base64 })}
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-600 uppercase tracking-wider text-[9px] mb-1">Read Duration (e.g. '5 min read')</label>
                        <input
                          type="text"
                          value={newBlogForm.readTime}
                          onChange={(e) => setNewBlogForm({ ...newBlogForm, readTime: e.target.value })}
                          className="w-full border p-2 rounded-lg focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-600 uppercase tracking-wider text-[9px] mb-1">Tags (Comma-separated)</label>
                      <input
                        type="text"
                        placeholder="e.g. Science, Organic, Winter, 77"
                        value={blogTagsInput}
                        onChange={(e) => setBlogTagsInput(e.target.value)}
                        className="w-full border p-2 rounded-lg focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-600 uppercase tracking-wider text-[9px] mb-1">Post Excerpt / Brief Summary *</label>
                      <textarea
                        required
                        rows={2}
                        placeholder="Provide a clicky scannable 2-sentence hook for cards selection layout."
                        value={newBlogForm.excerpt}
                        onChange={(e) => setNewBlogForm({ ...newBlogForm, excerpt: e.target.value })}
                        className="w-full border p-2 rounded-lg focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-600 uppercase tracking-wider text-[9px] mb-1">Rich Markdown Content *</label>
                      <textarea
                        required
                        rows={6}
                        placeholder="Write article details. Supports markdown headers, **bold**, and bullet lists."
                        value={newBlogForm.content}
                        onChange={(e) => setNewBlogForm({ ...newBlogForm, content: e.target.value })}
                        className="w-full border p-2 rounded-lg focus:outline-none font-mono text-[11px]"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-lg cursor-pointer"
                      >
                        Publish Blog Article Draft
                      </button>
                    </div>

                  </form>
                </div>
              </div>
            )}

            {/* EDIT BLOG MODAL */}
            {selectedBlog && (
              <div className="fixed inset-0 bg-slate-905/45 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl border border-slate-150 overflow-hidden flex flex-col max-h-[90vh]">
                  
                  {/* Modal Header */}
                  <div className="p-5 border-b flex justify-between items-center bg-slate-50">
                    <div>
                      <h3 className="font-black text-slate-800 text-sm">Modify Editorial Post</h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">Updating: {selectedBlog.title}</p>
                    </div>
                    <button onClick={() => setSelectedBlog(null)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Modal Body Form */}
                  <form onSubmit={handleUpdateBlog} className="p-6 overflow-y-auto space-y-4 flex-1 text-left text-xs">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-600 uppercase tracking-wider text-[9px] mb-1">Article Title *</label>
                        <input
                          type="text"
                          required
                          value={selectedBlog.title}
                          onChange={(e) => setSelectedBlog({ ...selectedBlog, title: e.target.value, slug: slugify(e.target.value) })}
                          className="w-full border p-2 rounded-lg focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-600 uppercase tracking-wider text-[9px] mb-1">Slug Route (Unique URL) *</label>
                        <input
                          type="text"
                          required
                          value={selectedBlog.slug}
                          onChange={(e) => setSelectedBlog({ ...selectedBlog, slug: slugify(e.target.value) })}
                          className="w-full border p-2 rounded-lg focus:outline-none font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-bold text-slate-600 uppercase tracking-wider text-[9px] mb-1">Author Name</label>
                        <input
                          type="text"
                          value={selectedBlog.author}
                          onChange={(e) => setSelectedBlog({ ...selectedBlog, author: e.target.value })}
                          className="w-full border p-2 rounded-lg focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-600 uppercase tracking-wider text-[9px] mb-1">Category</label>
                        <select
                          value={selectedBlog.category}
                          onChange={(e) => setSelectedBlog({ ...selectedBlog, category: e.target.value })}
                          className="w-full border p-2 rounded-lg focus:outline-none bg-white cursor-pointer"
                        >
                          <option value="Chemistry & Science">Chemistry & Science</option>
                          <option value="Buying Guides">Buying Guides</option>
                          <option value="Tips & Hacks">Tips & Hacks</option>
                          <option value="Industry Trends">Industry Trends</option>
                          <option value="General">General</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-600 uppercase tracking-wider text-[9px] mb-1">Status</label>
                        <select
                          value={selectedBlog.status}
                          onChange={(e) => setSelectedBlog({ ...selectedBlog, status: e.target.value as any })}
                          className="w-full border p-2 rounded-lg focus:outline-none bg-white cursor-pointer"
                        >
                          <option value="Active">Active (Visible)</option>
                          <option value="Draft">Draft (Hidden)</option>
                          <option value="Archived">Archived</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-600 uppercase tracking-wider text-[9px] mb-1">Cover Image URL</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={selectedBlog.image}
                            onChange={(e) => setSelectedBlog({ ...selectedBlog, image: e.target.value })}
                            className="w-full border p-2 rounded-lg focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const randoms = [
                                'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=800&q=80',
                                'https://images.unsplash.com/photo-1518152002797-94ce700236a2?auto=format&fit=crop&w=800&q=80',
                                'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=800&q=80',
                                'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=800&q=80'
                              ];
                              const r = randoms[Math.floor(Math.random() * randoms.length)];
                              setSelectedBlog({ ...selectedBlog, image: r });
                            }}
                            className="bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 px-2 rounded-lg shrink-0 cursor-pointer text-[10px]"
                          >
                            Suggest Photo
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-600 uppercase tracking-wider text-[9px] mb-1">Read Duration</label>
                        <input
                          type="text"
                          value={selectedBlog.readTime}
                          onChange={(e) => setSelectedBlog({ ...selectedBlog, readTime: e.target.value })}
                          className="w-full border p-2 rounded-lg focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-600 uppercase tracking-wider text-[9px] mb-1">Tags (Comma-separated)</label>
                      <input
                        type="text"
                        value={blogTagsInput}
                        onChange={(e) => setBlogTagsInput(e.target.value)}
                        className="w-full border p-2 rounded-lg focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-600 uppercase tracking-wider text-[9px] mb-1">Post Excerpt / Brief Summary *</label>
                      <textarea
                        required
                        rows={2}
                        value={selectedBlog.excerpt}
                        onChange={(e) => setSelectedBlog({ ...selectedBlog, excerpt: e.target.value })}
                        className="w-full border p-2 rounded-lg focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-600 uppercase tracking-wider text-[9px] mb-1">Rich Markdown Content *</label>
                      <textarea
                        required
                        rows={6}
                        value={selectedBlog.content}
                        onChange={(e) => setSelectedBlog({ ...selectedBlog, content: e.target.value })}
                        className="w-full border p-2 rounded-lg focus:outline-none font-mono text-[11px]"
                      />
                    </div>

                    <div className="pt-2 flex gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedBlog(null)}
                        className="w-1/3 border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold py-2.5 rounded-lg cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="w-2/3 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-lg cursor-pointer"
                      >
                        Keep Blog Post Adjustments
                      </button>
                    </div>

                  </form>
                </div>
              </div>
            )}

          </div>
        )}

      </main>

    </div>
  );
}
