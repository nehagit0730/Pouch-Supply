import React, { useState, useMemo } from 'react';
import { Product, Collection, Order, FileEntry, Customer, Discount, CustomPage, PageSection, BlogPost } from '../types';
import { 
  TrendingUp, BarChart3, Package, Users, Tag, FileCode, HardDrive, Percent, 
  Search, Plus, Eye, CheckCircle2, Clipboard, ArrowUpDown, ChevronRight, 
  Trash2, Filter, Save, Sparkles, Building, Settings, Image as ImageIcon, 
  X, MoveUp, MoveDown, Layout, Globe, Mail, DollarSign, ShoppingBag, EyeOff, RefreshCw
} from 'lucide-react';

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
  onAdminActionComplete
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

  // Sync edits wrapper overrides so existing handlers automatically write to drafts
  const onUpdateProducts = (updatedProds: Product[]) => {
    setLocalProducts(updatedProds);
    setHasUnsavedChanges(true);
    if (onDirtyChange) onDirtyChange(true);
  };

  const onUpdateCollections = (updatedColls: Collection[]) => {
    setLocalCollections(updatedColls);
    setHasUnsavedChanges(true);
    if (onDirtyChange) onDirtyChange(true);
  };

  const onUpdateCustomPages = (updatedPages: CustomPage[]) => {
    setLocalPages(updatedPages);
    setHasUnsavedChanges(true);
    if (onDirtyChange) onDirtyChange(true);
  };

  const onUpdateDiscounts = (updatedDiscs: Discount[]) => {
    setLocalDiscounts(updatedDiscs);
    setHasUnsavedChanges(true);
    if (onDirtyChange) onDirtyChange(true);
  };

  const onUpdateOrders = (updatedOrders: Order[]) => {
    setLocalOrders(updatedOrders);
    setHasUnsavedChanges(true);
    if (onDirtyChange) onDirtyChange(true);
  };

  const onUpdateFiles = (updatedFiles: FileEntry[]) => {
    setLocalFiles(updatedFiles);
    setHasUnsavedChanges(true);
    if (onDirtyChange) onDirtyChange(true);
  };

  const onUpdateCustomers = (updatedCusts: Customer[]) => {
    setLocalCustomers(updatedCusts);
    setHasUnsavedChanges(true);
    if (onDirtyChange) onDirtyChange(true);
  };

  const onUpdateBlogs = (updatedBlogs: BlogPost[]) => {
    setLocalBlogs(updatedBlogs);
    setHasUnsavedChanges(true);
    if (onDirtyChange) onDirtyChange(true);
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
    const newSection: PageSection = {
      id: `sec-${Date.now()}`,
      type: sectionType,
      settings: {
        fullWidth: false,
        backgroundColor: '#FFFFFF',
        headingColor: '#1E293B',
        textColor: '#64748B',
        title: `Custom ${sectionType}`,
        description: 'Edit option elements inside options sidebar',
        buttonText: 'Shop New Packs',
        buttonLink: '#',
        marqueeSpeed: 3
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
            
            {/* Header action menu */}
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-450 font-bold">List of store collections</span>
              <button
                onClick={() => setShowAddCollection(true)}
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
                          setShowAddCollection(true);
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

            {/* Creation Form Modal side slide */}
            {showAddCollection && (
              <div className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-sm w-full shadow-2xl">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
                    <h3 className="font-extrabold text-slate-800 text-sm">
                      {editingCollection ? 'Edit Collection Details' : 'Add New Collection Form'}
                    </h3>
                    <button 
                      onClick={() => {
                        setShowAddCollection(false);
                        setEditingCollection(null);
                        setNewCollectionForm({ title: '', description: '', type: 'Manual', image: '', productIds: [] });
                      }} 
                      className="text-slate-400 hover:text-slate-650 cursor-pointer text-xs font-bold"
                    >
                      Close
                    </button>
                  </div>

                  <form onSubmit={handleCreateCollection} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-600 uppercase tracking-widest text-[9px] mb-1">Collection Title</label>
                      <input
                        id="col-form-title"
                        type="text"
                        placeholder="e.g. Nicotine fruit punches"
                        required
                        value={newCollectionForm.title}
                        onChange={(e) => setNewCollectionForm({ ...newCollectionForm, title: e.target.value })}
                        className="w-full border p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-600 uppercase tracking-widest text-[9px] mb-1">Description</label>
                      <textarea
                        id="col-form-desc"
                        placeholder="e.g. Curated range of sweet berry tins..."
                        value={newCollectionForm.description}
                        onChange={(e) => setNewCollectionForm({ ...newCollectionForm, description: e.target.value })}
                        className="w-full border p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-500 h-20"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-600 uppercase tracking-widest text-[9px] mb-1">Collection Cover Image Link</label>
                      <input
                        id="col-form-img"
                        type="text"
                        placeholder="https://images.unsplash.com/..."
                        value={newCollectionForm.image}
                        onChange={(e) => setNewCollectionForm({ ...newCollectionForm, image: e.target.value })}
                        className="w-full border p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-600 uppercase tracking-widest text-[9px] mb-1">Collection Type</label>
                      <select
                        id="col-form-type"
                        value={newCollectionForm.type}
                        onChange={(e) => setNewCollectionForm({ ...newCollectionForm, type: e.target.value as any })}
                        className="w-full border p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-500"
                      >
                        <option value="Manual">Manual</option>
                        <option value="Smart">Smart Rules</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-lg cursor-pointer"
                    >
                      Save Collection
                    </button>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

        {/* 4. PRODUCTS BLOCK */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            
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
                            }`}>
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

            {/* Add / Edit Product Dynamic Slide block */}
            {showAddProduct && (
              <div className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl border border-slate-205 p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
                    <h3 className="font-extrabold text-slate-800 text-sm">
                      {editingProduct ? `Edit Product Profile: ${editingProduct.title}` : 'Add New Nicotine / Energy Product Can'}
                    </h3>
                    <button
                      onClick={() => {
                        setShowAddProduct(false);
                        setEditingProduct(null);
                      }}
                      className="text-slate-400 hover:text-slate-650 cursor-pointer text-xs font-bold"
                    >
                      Close Form
                    </button>
                  </div>

                  <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-600 uppercase tracking-widest text-[9px] mb-1">Product Title name</label>
                        <input
                          id="prod-form-title"
                          type="text"
                          required
                          placeholder="e.g. 77 Cherry Coke 10.4 mg"
                          value={newProductForm.title}
                          onChange={(e) => setNewProductForm({ ...newProductForm, title: e.target.value })}
                          className="w-full border p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-500"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-600 uppercase tracking-widest text-[9px] mb-1">Brand (Vendor Partner)</label>
                        <select
                          id="prod-form-vendor"
                          value={newProductForm.vendor}
                          onChange={(e) => setNewProductForm({ ...newProductForm, vendor: e.target.value })}
                          className="w-full border p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-500"
                        >
                          <option value="77">77</option>
                          <option value="CUBA">CUBA</option>
                          <option value="CLEW">CLEW</option>
                          <option value="KILLA">KILLA</option>
                          <option value="VELO">VELO</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-600 uppercase tracking-widest text-[9px] mb-1">Product Canister Description</label>
                      <textarea
                        id="prod-form-desc"
                        rows={3}
                        placeholder="Flavor highlights, cooling crystals, nicotine strength guides..."
                        value={newProductForm.description}
                        onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                        className="w-full border p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-500 resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block font-bold text-slate-600 uppercase tracking-widest text-[9px] mb-1">Selling Price (£)</label>
                        <input
                          id="prod-form-price"
                          type="number"
                          step="0.01"
                          required
                          value={newProductForm.price}
                          onChange={(e) => setNewProductForm({ ...newProductForm, price: parseFloat(e.target.value) })}
                          className="w-full border p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-500"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-600 uppercase tracking-widest text-[9px] mb-1">Compare Price (£)</label>
                        <input
                          id="prod-form-compare"
                          type="number"
                          step="0.01"
                          value={newProductForm.compareAtPrice}
                          onChange={(e) => setNewProductForm({ ...newProductForm, compareAtPrice: parseFloat(e.target.value) })}
                          className="w-full border p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-500"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-600 uppercase tracking-widest text-[9px] mb-1">Category Classification</label>
                        <select
                          id="prod-form-cat"
                          value={newProductForm.category}
                          onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                          className="w-full border p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-500"
                        >
                          <option value="Vitamins & Supplements">Vitamins & Supplements</option>
                          <option value="Powdered Beverage Mixes">Powdered Beverage Mixes</option>
                          <option value="Nicotine Pouches">Nicotine Pouches</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block font-bold text-slate-600 uppercase tracking-widest text-[9px] mb-1">Stock count</label>
                        <input
                          id="prod-form-stock"
                          type="number"
                          required
                          value={newProductForm.inventory}
                          onChange={(e) => setNewProductForm({ ...newProductForm, inventory: parseInt(e.target.value) })}
                          className="w-full border p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-500"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-600 uppercase tracking-widest text-[9px] mb-1">Uniquely Generated SKU</label>
                        <input
                          id="prod-form-sku"
                          type="text"
                          placeholder="e.g. 77-CHY-COKE"
                          value={newProductForm.sku}
                          onChange={(e) => setNewProductForm({ ...newProductForm, sku: e.target.value })}
                          className="w-full border p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-500"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-600 uppercase tracking-widest text-[9px] mb-1">Canister Status</label>
                        <select
                          id="prod-form-status"
                          value={newProductForm.status}
                          onChange={(e) => setNewProductForm({ ...newProductForm, status: e.target.value as any })}
                          className="w-full border p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-500"
                        >
                          <option value="Active">Active</option>
                          <option value="Draft">Draft</option>
                          <option value="Archived">Archived</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-600 uppercase tracking-widest text-[9px] mb-1">High-Res Canister Image link</label>
                      <input
                        id="prod-form-img-url"
                        type="text"
                        placeholder="https://images.unsplash.com/..."
                        value={newProductForm.image}
                        onChange={(e) => setNewProductForm({ ...newProductForm, image: e.target.value })}
                        className="w-full border p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-slate-900 border-slate-900 hover:bg-slate-800 py-3 text-white font-extrabold rounded-lg shadow-sm transition-colors text-xs"
                    >
                      {editingProduct ? 'Save Product Profile Changes' : 'Publish Product Canister'}
                    </button>
                  </form>
                </div>
              </div>
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
                    <div className="space-y-2">
                      {currentlyEditingPage?.sections.map((sec, idx) => (
                        <div 
                          key={sec.id}
                          onClick={() => setSelectedBuilderSectionId(sec.id)}
                          className={`p-2.5 rounded-lg border text-xs font-bold flex justify-between items-center transition-all cursor-pointer ${
                            selectedBuilderSectionId === sec.id 
                              ? 'border-indigo-650 bg-indigo-50/20 text-slate-800' 
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
                          }`}
                        >
                          <div className="truncate pr-2">
                            <span className="text-[9px] text-indigo-500 block">Section {idx+1}</span>
                            <span className="truncate">{sec.type}</span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              disabled={idx === 0}
                              onClick={(e) => { e.stopPropagation(); handleMoveSection(idx, 'up'); }}
                              className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-700 cursor-pointer disabled:opacity-30"
                            >
                              <MoveUp className="h-3 w-3" />
                            </button>
                            <button
                              disabled={idx === (currentlyEditingPage.sections.length - 1)}
                              onClick={(e) => { e.stopPropagation(); handleMoveSection(idx, 'down'); }}
                              className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-700 cursor-pointer disabled:opacity-30"
                            >
                              <MoveDown className="h-3 w-3" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleRemoveSectionFromPage(sec.id); }}
                              className="p-1 hover:bg-red-100 text-slate-400 hover:text-red-650 rounded cursor-pointer"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add Section toolbar dropdown */}
                    <div className="border-t border-slate-100 pt-3">
                      <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wide mb-2">Add New Module Section</label>
                      <div className="grid grid-cols-1 gap-1.5">
                        {[
                          'Image banner', 'Video banner', 'Rich text', 'Marquee text', 'Logo list', 'Collection list', 'Featured collection', 'FAQs'
                        ].map(type => (
                          <button
                            key={type}
                            onClick={() => handleAddSectionToPage(type as any)}
                            className="text-[10px] text-left p-2 border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 text-slate-700 rounded-lg font-bold cursor-pointer flex items-center justify-between transition-colors"
                          >
                            <span>+ {type} Section</span>
                            <ChevronRight className="h-3 w-3 text-slate-400" />
                          </button>
                        ))}
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
                              className={`relative group p-6 rounded-xl border border-slate-100 shadow-inner hover:border-indigo-650 transition-all ${
                                isFocused ? 'ring-2 ring-indigo-500 border-indigo-500 shadow-md scale-[1.01]' : ''
                              }`}
                              style={sStyle}
                            >
                              {/* Overlay tag indicator */}
                              <span className="absolute top-2.5 right-2.5 bg-slate-900 text-white text-[8px] font-black tracking-widest uppercase py-0.5 px-1.5 rounded-md pointer-events-none opacity-60">
                                {sec.type} {isFocused ? '• EDITING' : ''}
                              </span>

                              {/* Different visual layouts */}
                              
                              {/* IMAGE BANNER */}
                              {sec.type === 'Image banner' && (
                                <div className="text-center space-y-3 py-6">
                                  <div className="relative h-28 w-full rounded-lg bg-slate-100 overflow-hidden border">
                                    <img 
                                      src={sec.settings.imageUrl || 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80'} 
                                      className="h-full w-full object-cover" 
                                      alt="" 
                                      referrerPolicy="no-referrer"
                                    />
                                    <div className="absolute inset-0 bg-black/30" />
                                  </div>
                                  <h3 className="text-lg font-black" style={{ color: sec.settings.headingColor || '#1E293B' }}>
                                    {sec.settings.title || 'Click to change Heading Title'}
                                  </h3>
                                  <p className="text-xs leading-relaxed max-w-sm mx-auto">{sec.settings.description || 'Banner details...'}</p>
                                  {sec.settings.buttonText && (
                                    <button className="bg-slate-900 text-white font-extrabold text-[10px] py-1.5 px-4 rounded-md uppercase tracking-wider">
                                      {sec.settings.buttonText}
                                    </button>
                                  )}
                                </div>
                              )}

                              {/* VIDEO BANNER */}
                              {sec.type === 'Video banner' && (
                                <div className="text-center space-y-3 py-4">
                                  <div className="relative h-28 w-full rounded-lg bg-indigo-950 flex items-center justify-center border text-white font-black text-xs uppercase tracking-widest">
                                    🎬 Active YouTube Embed / MP4 Player Simulated
                                  </div>
                                  <p className="font-extrabold text-xs" style={{ color: sec.settings.headingColor || '#1E293B' }}>
                                    {sec.settings.title || 'Video highlights'}
                                  </p>
                                </div>
                              )}

                              {/* MARQUEE TEXT */}
                              {sec.type === 'Marquee text' && (
                                <div className="overflow-hidden bg-indigo-10/40 p-3 rounded border text-center relative">
                                  <p className="animate-pulse flex items-center justify-center gap-1.5 font-bold text-indigo-700 text-[10px] uppercase tracking-widest">
                                    <span>⚡ {sec.settings.title || 'FREE PRIORITY SHIPPING OVER £40!'} ⚡</span>
                                    <span>{sec.settings.title || 'FREE PRIORITY SHIPPING OVER £40!'}</span>
                                  </p>
                                </div>
                              )}

                              {/* RICH TEXT */}
                              {sec.type === 'Rich text' && (
                                <div className="text-center space-y-2 py-4">
                                  <h3 className="text-sm font-black" style={{ color: sec.settings.headingColor || '#1E293B' }}>
                                    {sec.settings.title}
                                  </h3>
                                  <p className="text-xs leading-relaxed max-w-sm mx-auto">{sec.settings.description}</p>
                                </div>
                              )}

                              {/* FAQS */}
                              {sec.type === 'FAQs' && (
                                <div className="space-y-2.5 py-4 text-[11px] leading-normal font-sans">
                                  <h3 className="text-xs font-black uppercase text-center mb-2" style={{ color: sec.settings.headingColor || '#1E293B' }}>
                                    {sec.settings.title || 'Frequently Asked Questions'}
                                  </h3>
                                  <div className="bg-slate-50 p-2.5 rounded border border-slate-150">
                                    <p className="font-bold text-slate-800">Q: When does shipping dispatch? </p>
                                    <p className="text-slate-500 mt-1">A: Standard couriers dispatch every weekday at 10 am GMT.</p>
                                  </div>
                                </div>
                              )}

                              {/* LOGO LIST */}
                              {sec.type === 'Logo list' && (
                                <div className="py-4 text-center space-y-3">
                                  <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: sec.settings.headingColor || '#1E293B' }}>
                                    {sec.settings.title || 'Official Partners'}
                                  </p>
                                  <div className="flex gap-2.5 justify-center flex-wrap">
                                    {['77', 'CUBA', 'CLEW', 'KILLA'].map(logo => (
                                      <span key={logo} className="bg-slate-200 text-slate-600 font-extrabold text-[10px] py-1 px-3 rounded">
                                        {logo}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* COLLECTION LIST */}
                              {sec.type === 'Collection list' && (
                                <div className="py-4 text-center space-y-3">
                                  <p className="text-[10px] font-black uppercase" style={{ color: sec.settings.headingColor || '#1E293B' }}>
                                    {sec.settings.title || 'Our Popular collections'}
                                  </p>
                                  <div className="flex gap-2 justify-center">
                                    {collections.slice(1, 4).map(c => (
                                      <span key={c.id} className="border bg-white text-[9px] font-bold p-1 px-2.5 rounded shadow-xs text-indigo-650">
                                        {c.title}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* FEATURED COLLECTION */}
                              {sec.type === 'Featured collection' && (
                                <div className="py-4 text-center space-y-3">
                                  <p className="text-[10px] font-black uppercase" style={{ color: sec.settings.headingColor || '#1E293B' }}>
                                    {sec.settings.title || 'Featured Collection Highlights'}
                                  </p>
                                  <div className="bg-indigo-50/20 border border-dashed border-indigo-200 p-4 rounded-lg flex items-center justify-center gap-1 md:gap-3">
                                    <span className="text-[9px] font-bold bg-white border p-1 rounded">Visual Can canister mockup</span>
                                    <span className="text-[9px] font-bold bg-white border p-1 rounded">Watermelon 5mg</span>
                                  </div>
                                </div>
                              )}

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

                        {/* Title text input options */}
                        {currentlyEditingSection.settings.title !== undefined && (
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
                        {currentlyEditingSection.settings.description !== undefined && (
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
                        {currentlyEditingSection.settings.buttonText !== undefined && (
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
                        {currentlyEditingSection.settings.buttonLink !== undefined && (
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

                        {/* Image asset url selector */}
                        {currentlyEditingSection.settings.imageUrl !== undefined && (
                          <div>
                            <label className="block text-slate-650 font-bold uppercase tracking-wider text-[9px] mb-1">Cover Image URL</label>
                            <input
                              type="text"
                              placeholder="https://images.unsplash..."
                              value={currentlyEditingSection.settings.imageUrl}
                              onChange={(e) => handleUpdateSectionSettings('imageUrl', e.target.value)}
                              className="w-full text-xs border p-2 rounded bg-slate-50 focus:outline-none"
                            />
                            
                            <p className="text-[10px] text-slate-400 mt-1 inline-block">Use urls from the Files Manager list!</p>
                          </div>
                        )}

                        {/* Width checkbox options */}
                        <div className="flex items-center gap-2 pt-2">
                          <input
                            type="checkbox"
                            id="builder-fullwidth"
                            checked={currentlyEditingSection.settings.fullWidth}
                            onChange={(e) => handleUpdateSectionSettings('fullWidth', e.target.checked)}
                            className="accent-indigo-600 rounded"
                          />
                          <label htmlFor="builder-fullwidth" className="font-bold text-slate-650 text-[10px]">Display Full page width</label>
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
                      <div>
                        <label className="block font-bold text-slate-600 uppercase tracking-wider text-[9px] mb-1">Cover Image URL</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="https://images.unsplash.com/..."
                            value={newBlogForm.image}
                            onChange={(e) => setNewBlogForm({ ...newBlogForm, image: e.target.value })}
                            className="w-full border p-2 rounded-lg focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              // Set a premium default pouch placeholder
                              const randoms = [
                                'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=800&q=80',
                                'https://images.unsplash.com/photo-1518152002797-94ce700236a2?auto=format&fit=crop&w=800&q=80',
                                'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=800&q=80',
                                'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=800&q=80'
                              ];
                              const r = randoms[Math.floor(Math.random() * randoms.length)];
                              setNewBlogForm({ ...newBlogForm, image: r });
                            }}
                            className="bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 px-2 rounded-lg shrink-0 cursor-pointer text-[10px]"
                          >
                            Suggest Photo
                          </button>
                        </div>
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
