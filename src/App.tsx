import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Product, Collection, Order, FileEntry, Customer, Discount, CustomPage, CartItem, BlogPost 
} from './types';
import { 
  INITIAL_PRODUCTS, INITIAL_COLLECTIONS, INITIAL_ORDERS, INITIAL_FILES, INITIAL_CUSTOMERS, INITIAL_DISCOUNTS, DEFAULT_PAGES, INITIAL_BLOGS 
} from './initialData';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductsGrid from './components/ProductsGrid';
import SubscriptionBuilder from './components/SubscriptionBuilder';
import BrandList from './components/BrandList';
import CustomerAccount from './components/CustomerAccount';
import CartDrawer from './components/CartDrawer';
import CustomerDrawer from './components/CustomerDrawer';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import PageRenderer from './components/PageRenderer';
import PrivacyPolicy from './components/PrivacyPolicy';
import ShippingPolicy from './components/ShippingPolicy';
import RefundPolicy from './components/RefundPolicy';
import TermsConditions from './components/TermsConditions';
import ProductDetailView from './components/ProductDetailView';
import CollectionDetailView from './components/CollectionDetailView';
import CheckoutView from './components/CheckoutView';
import { WorldpayGatewaySimulator, PaymentSuccessScreen, PaymentFailedScreen, PaymentCancelledScreen } from './components/PaymentStatusScreens';
import { 
  Sparkles, ShieldCheck, Truck, RefreshCw, Star, ArrowRight, Package, ShoppingCart, Check, Heart, User, CheckCircle2, Save, AlertTriangle, Search, Undo, Mail, X
} from 'lucide-react';
import OrderWithdrawalModal from './components/OrderWithdrawalModal';

export default function App() {
  // Helper for safe JSON parsing from LocalStorage
  const safeLoadFromLocalStorage = <T,>(key: string, defaultValue: T): T => {
    try {
      const saved = localStorage.getItem(key);
      if (!saved) return defaultValue;
      const parsed = JSON.parse(saved);
      if (parsed === null || parsed === undefined) return defaultValue;
      return parsed as T;
    } catch (e) {
      console.warn(`[LocalStorage] Failed to parse key "${key}", reverting to default.`, e);
      return defaultValue;
    }
  };

  // Helper to safely write to LocalStorage
  const safeSaveToLocalStorage = (key: string, value: any) => {
    try {
      localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    } catch (e) {
      console.warn(`[LocalStorage] Failed to write key "${key}" to localStorage:`, e);
    }
  };

  // --- Persistent Storage State Initialization ---
  const [products, setProducts] = useState<Product[]>(() => {
    return safeLoadFromLocalStorage<Product[]>('ps_products', INITIAL_PRODUCTS);
  });

  const [collections, setCollections] = useState<Collection[]>(() => {
    return safeLoadFromLocalStorage<Collection[]>('ps_collections', INITIAL_COLLECTIONS);
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    return safeLoadFromLocalStorage<Order[]>('ps_orders', INITIAL_ORDERS);
  });

  const [files, setFiles] = useState<FileEntry[]>(() => {
    return safeLoadFromLocalStorage<FileEntry[]>('ps_files', INITIAL_FILES);
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    return safeLoadFromLocalStorage<Customer[]>('ps_customers', INITIAL_CUSTOMERS);
  });

  const [discounts, setDiscounts] = useState<Discount[]>(() => {
    return safeLoadFromLocalStorage<Discount[]>('ps_discounts', INITIAL_DISCOUNTS);
  });

  const [blogs, setBlogs] = useState<BlogPost[]>(() => {
    return safeLoadFromLocalStorage<BlogPost[]>('ps_blogs', INITIAL_BLOGS);
  });

  const [selectedBlogSlug, setSelectedBlogSlug] = useState<string | null>(null);
  const [frontendBlogQuery, setFrontendBlogQuery] = useState('');
  const [selectedFrontCategory, setSelectedFrontCategory] = useState('All');

  const [customPages, setCustomPages] = useState<CustomPage[]>(() => {
    const loaded = safeLoadFromLocalStorage<CustomPage[]>('ps_custom_pages', DEFAULT_PAGES);
    const guaranteedList = (Array.isArray(loaded) ? loaded : DEFAULT_PAGES)
      .filter((p: any) => p && p.slug !== 'subscribe' && p.id !== 'subscribe');
    // Guaranteed presence check for Homepage in Pages list
    if (!guaranteedList.some((p: any) => p && p.isHomepage)) {
      const defaultHome = DEFAULT_PAGES.find((p: any) => p.isHomepage);
      if (defaultHome) {
        return [defaultHome, ...guaranteedList];
      }
    }
    return guaranteedList;
  });

  // Shopping Cart & User session statuses
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    return safeLoadFromLocalStorage<CartItem[]>('ps_cart', []);
  });

  const [loggedInCustomer, setLoggedInCustomer] = useState<Customer | null>(() => {
    try {
      const saved = localStorage.getItem('ps_logged_in_customer');
      if (!saved || saved === 'undefined') return null;
      const parsed = JSON.parse(saved);
      return parsed && parsed.id ? parsed : null;
    } catch (e) {
      console.warn('[LocalStorage] Failed to read ps_logged_in_customer:', e);
      return null;
    }
  });

  const [isInitialLoadDone, setIsInitialLoadDone] = useState(false);
  const [isDbOffline, setIsDbOffline] = useState<boolean>(false);

  // Reusable, highly robust sync engine that checks database connectivity headers
  const syncToApi = async (resource: string, payload: any[]) => {
    try {
      const res = await fetch(`/api/${resource}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const offlineHeader = res.headers.get("X-Database-Offline");
        if (offlineHeader === "true") {
          setIsDbOffline(true);
        } else {
          setIsDbOffline(false);
        }
      }
    } catch (err) {
      console.error(`[Sync Engine] Failed to sync ${resource}:`, err);
    }
  };

  // Load all central database arrays on mount
  useEffect(() => {
    async function loadDataFromDb() {
      try {
        // Fetch store data
        const [
          prodsRes, collsRes, ordersRes, filesRes,
          custsRes, discsRes, pagesRes, blogsRes
        ] = await Promise.all([
          fetch('/api/products').then(r => r.ok ? r.json() : null),
          fetch('/api/collections').then(r => r.ok ? r.json() : null),
          fetch('/api/orders').then(r => r.ok ? r.json() : null),
          fetch('/api/files').then(r => r.ok ? r.json() : null),
          fetch('/api/customers').then(r => r.ok ? r.json() : null),
          fetch('/api/discounts').then(r => r.ok ? r.json() : null),
          fetch('/api/custompages').then(r => r.ok ? r.json() : null),
          fetch('/api/blogs').then(r => r.ok ? r.json() : null),
        ]);

        if (Array.isArray(prodsRes)) setProducts(prodsRes);
        if (Array.isArray(collsRes)) setCollections(collsRes);
        if (Array.isArray(ordersRes)) setOrders(ordersRes);
        if (Array.isArray(filesRes)) setFiles(filesRes);
        if (Array.isArray(custsRes)) setCustomers(custsRes);
        if (Array.isArray(discsRes)) setDiscounts(discsRes);
        if (Array.isArray(pagesRes)) setCustomPages(pagesRes);
        if (Array.isArray(blogsRes)) setBlogs(blogsRes);
      } catch (err) {
        console.error("[State Loader] Failed to connect to backend MongoDB API. Using local backup state.", err);
      } finally {
        setIsInitialLoadDone(true);
      }
    }
    loadDataFromDb();
  }, []);

  // App Routing Navigation
  const [currentTab, setCurrentTab] = useState<string>('frontend-home');
  const [activeCollectionId, setActiveCollectionId] = useState<string>('all');
  const [isAdminActive, setIsAdminActive] = useState<boolean>(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('ps_admin_authenticated') === 'true';
  });
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [customerDrawerOpen, setCustomerDrawerOpen] = useState<boolean>(false);
  const [customerDrawerTab, setCustomerDrawerTab] = useState<'orders' | 'addresses' | 'wishlist' | 'emails'>('orders');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [emailToast, setEmailToast] = useState<{ to: string; subject: string; refund: number } | null>(null);

  // Worldpay checkout persistent states
  const [checkoutDiscount, setCheckoutDiscount] = useState<Discount | null>(null);
  const [checkoutTotal, setCheckoutTotal] = useState<number>(0);
  const [isWithdrawalOpen, setIsWithdrawalOpen] = useState<boolean>(false);

  // Unified SPA navigation helper mapping state shifts to matching browser URLs
  const navigateToTab = (tab: string, productId?: string, collectionId?: string) => {
    let url = '/';
    if (tab === 'frontend-home') {
      url = '/';
    } else if (tab === 'frontend-shop') {
      url = '/collections/all';
    } else if (tab === 'frontend-brands') {
      url = '/pages/brands';
    } else if (tab === 'frontend-subscribe') {
      url = '/pages/subscribe';
    } else if (tab === 'frontend-account') {
      url = '/pages/account';
    } else if (tab === 'frontend-checkout') {
      url = '/pages/checkout';
    } else if (tab === 'blogs') {
      url = '/blogs';
    } else if (tab === 'blog-detail' && productId) {
      url = `/blogs/${productId}`;
    } else if (tab === 'product-detail' && productId) {
      const prod = products.find(p => p.id === productId || p.slug === productId);
      url = `/products/${prod?.slug || productId}`;
    } else if (tab === 'collection-detail' && collectionId) {
      const col = collections.find(c => c.id === collectionId || c.slug === collectionId);
      url = `/collections/${col?.slug || collectionId}`;
    } else {
      url = `/pages/${tab}`;
    }

    let currentPathname = '';
    try {
      currentPathname = window.location.pathname;
    } catch (e) {
      console.warn('[History] Failed to read location pathname:', e);
    }

    if (currentPathname !== url) {
      try {
        window.history.pushState({}, '', url);
      } catch (e) {
        console.warn('[History] Failed to pushState (sandboxed iframe constraint):', e);
      }
    }
    
    setCurrentTab(tab);
    if (tab === 'blog-detail' && productId) {
      setSelectedBlogSlug(productId);
    }
    if (productId !== undefined) {
      setSelectedProductId(productId);
    }
    if (collectionId !== undefined) {
      setActiveCollectionId(collectionId);
    }
    setIsAdminActive(false);
  };

  // Unsaved changes sync dialog states
  const [isAdminDirty, setIsAdminDirty] = useState<boolean>(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState<boolean>(false);
  const [pendingNavAction, setPendingNavAction] = useState<{
    type: 'toggle-admin' | 'change-tab';
    payload?: string;
  } | null>(null);
  const [adminActionTrigger, setAdminActionTrigger] = useState<{
    action: 'save' | 'discard';
    timestamp: number;
  } | null>(null);

  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
  };
  
  // Checkout Successful Indicator modal
  const [checkoutSuccessful, setCheckoutSuccessful] = useState<{ id: string; amount: number } | null>(null);

  // Synchronize path and load links successfully in iframe/new tab
  useEffect(() => {
    const handleLocationChange = () => {
      let path = '';
      try {
        path = window.location.pathname;
      } catch (e) {
        console.warn('[History] Failed to read location pathname:', e);
      }

      if (path === '/admin-dashboard' || path.startsWith('/admin-dashboard/')) {
        setIsAdminActive(true);
        return;
      } else {
        setIsAdminActive(false);
      }

      if (path.startsWith('/payment/')) {
        const sub = path.replace('/payment/', '');
        if (sub.startsWith('worldpay-gateway')) {
          setCurrentTab('payment-worldpay-gateway');
        } else if (sub.startsWith('success')) {
          setCartItems([]);
          localStorage.removeItem('ps_cart');
          setCurrentTab('payment-success');
        } else if (sub.startsWith('failed')) {
          setCurrentTab('payment-failed');
        } else if (sub.startsWith('cancelled')) {
          setCurrentTab('payment-cancelled');
        }
        return;
      }

      if (path === '/' || path === '') {
        setCurrentTab('frontend-home');
      } else if (path === '/blogs' || path === '/blogs/') {
        setCurrentTab('blogs');
      } else if (path.startsWith('/blogs/')) {
        const slug = path.replace('/blogs/', '');
        setSelectedBlogSlug(slug);
        setCurrentTab('blog-detail');
      } else if (path.startsWith('/pages/')) {
        const slug = path.replace('/pages/', '');
        if (slug === 'subscribe' || slug.startsWith('subscribe/')) {
          setCurrentTab('frontend-subscribe');
        } else if (slug === 'brands') {
          setCurrentTab('frontend-brands');
        } else if (slug === 'account') {
          setCurrentTab('frontend-account');
        } else if (slug === 'checkout') {
          setCurrentTab('frontend-checkout');
        } else {
          setCurrentTab(slug);
        }
      } else if (path.startsWith('/collections/')) {
        const colId = path.replace('/collections/', '');
        const matchedCol = collections.find(c => c.id === colId || slugify(c.title) === colId);
        if (matchedCol) {
          setActiveCollectionId(matchedCol.id);
          setCurrentTab('collection-detail');
        } else {
          setActiveCollectionId('all');
          setCurrentTab('frontend-shop');
        }
      } else if (path.startsWith('/products/')) {
        const prodId = path.replace('/products/', '');
        setSelectedProductId(decodeURIComponent(prodId));
        setCurrentTab('product-detail');
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, [collections]);

  // Synchronize browser URL when isAdminActive state changes in React UI
  useEffect(() => {
    let path = '';
    try {
      path = window.location.pathname;
    } catch (e) {
      console.warn('[History] Failed to read location pathname:', e);
    }

    if (isAdminActive) {
      if (!path.startsWith('/admin-dashboard')) {
        try {
          window.history.pushState({}, '', '/admin-dashboard/analytics');
        } catch (e) {
          console.warn('[History] Failed to pushState (sandboxed iframe constraint):', e);
        }
      }
    } else {
      if (path.startsWith('/admin-dashboard')) {
        // Switch back to matching URL for the currently active tab
        let url = '/';
        if (currentTab === 'frontend-home') {
          url = '/';
        } else if (currentTab === 'frontend-shop') {
          url = '/collections/all';
        } else if (currentTab === 'frontend-brands') {
          url = '/pages/brands';
        } else if (currentTab === 'frontend-subscribe') {
          url = '/pages/subscribe';
        } else if (currentTab === 'frontend-account') {
          url = '/pages/account';
        } else if (currentTab === 'blogs') {
          url = '/blogs';
        } else if (currentTab === 'blog-detail' && selectedBlogSlug) {
          url = `/blogs/${selectedBlogSlug}`;
        } else if (currentTab === 'product-detail' && selectedProductId) {
          const prod = products.find(p => p.id === selectedProductId || p.slug === selectedProductId);
          url = `/products/${prod?.slug || selectedProductId}`;
        } else if (currentTab === 'collection-detail' && activeCollectionId) {
          const col = collections.find(c => c.id === activeCollectionId || c.slug === activeCollectionId);
          url = `/collections/${col?.slug || activeCollectionId}`;
        } else {
          url = `/pages/${currentTab}`;
        }
        try {
          window.history.pushState({}, '', url);
        } catch (e) {
          console.warn('[History] Failed to pushState (sandboxed iframe constraint):', e);
        }
      }
    }
  }, [isAdminActive]);

  // Listen for image uploads/URL entries across components and auto-add to files list
  useEffect(() => {
    const handleImageUploaded = (event: Event) => {
      const customEvent = event as CustomEvent<{ url: string; fileName: string }>;
      const { url, fileName } = customEvent.detail;
      if (!url) return;

      setFiles((prevFiles) => {
        const exists = prevFiles.some((f) => f.url === url);
        if (exists) return prevFiles;

        const cleanName = fileName || 'Uploaded Image';
        const fileEntry: FileEntry = {
          id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          fileName: cleanName.endsWith('.png') || cleanName.endsWith('.jpg') || cleanName.endsWith('.jpeg') || cleanName.endsWith('.webp') || cleanName.endsWith('.svg') ? cleanName : `${cleanName}.png`,
          altText: 'Uploaded via Product/Collection/Page Editor',
          dateAdded: 'Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          size: `${(Math.random() * 400 + 40).toFixed(2)} KB`,
          references: 'Used in Editor',
          url: url
        };

        return [fileEntry, ...prevFiles];
      });
    };

    window.addEventListener('app-image-uploaded', handleImageUploaded);
    return () => {
      window.removeEventListener('app-image-uploaded', handleImageUploaded);
    };
  }, []);

  // --- Write to LocalStorage AND MongoDB Database on Changes ---
  useEffect(() => {
    safeSaveToLocalStorage('ps_products', products);
    if (isInitialLoadDone) {
      syncToApi('products', products);
    }
  }, [products, isInitialLoadDone]);

  useEffect(() => {
    safeSaveToLocalStorage('ps_collections', collections);
    if (isInitialLoadDone) {
      syncToApi('collections', collections);
    }
  }, [collections, isInitialLoadDone]);

  useEffect(() => {
    safeSaveToLocalStorage('ps_orders', orders);
    if (isInitialLoadDone) {
      syncToApi('orders', orders);
    }
  }, [orders, isInitialLoadDone]);

  useEffect(() => {
    safeSaveToLocalStorage('ps_files', files);
    if (isInitialLoadDone) {
      syncToApi('files', files);
    }
  }, [files, isInitialLoadDone]);

  useEffect(() => {
    safeSaveToLocalStorage('ps_customers', customers);
    if (isInitialLoadDone) {
      syncToApi('customers', customers);
    }
  }, [customers, isInitialLoadDone]);

  useEffect(() => {
    safeSaveToLocalStorage('ps_discounts', discounts);
    if (isInitialLoadDone) {
      syncToApi('discounts', discounts);
    }
  }, [discounts, isInitialLoadDone]);

  useEffect(() => {
    safeSaveToLocalStorage('ps_custom_pages', customPages);
    if (isInitialLoadDone) {
      syncToApi('custompages', customPages);
    }
  }, [customPages, isInitialLoadDone]);

  useEffect(() => {
    safeSaveToLocalStorage('ps_blogs', blogs);
    if (isInitialLoadDone) {
      syncToApi('blogs', blogs);
    }
  }, [blogs, isInitialLoadDone]);

  useEffect(() => {
    safeSaveToLocalStorage('ps_cart', cartItems);
  }, [cartItems]);

  useEffect(() => {
    safeSaveToLocalStorage('ps_logged_in_customer', loggedInCustomer);
    if (loggedInCustomer) {
      // Keep customer object in the master listing synced as well
      setCustomers(prev => prev.map(c => c.id === loggedInCustomer.id ? loggedInCustomer : c));
    }
  }, [loggedInCustomer]);

  // --- Cart actions handlers ---
  const handleAddToCart = (product: Product, quantity: number) => {
    setCartItems(prev => {
      const idx = prev.findIndex(item => item.productId === product.id);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx].quantity += quantity;
        return copy;
      } else {
        return [...prev, {
          productId: product.id,
          productTitle: product.title,
          price: product.price,
          image: product.image,
          quantity,
          vendor: product.vendor
        }];
      }
    });
    setCartOpen(true);
  };

  // Add customized subscription pack package directly to cart
  const handleAddSubBoxToCart = (
    packName: string, 
    items: { product: Product; quantity: number }[], 
    frequency: string,
    flatPrice: number
  ) => {
    const listSummary = items.map(i => {
      const vendorName = i.product.vendor || '';
      const productTitle = i.product.title || '';
      let cleanTitle = productTitle;
      if (vendorName && productTitle.toLowerCase().startsWith(vendorName.toLowerCase())) {
        cleanTitle = productTitle.substring(vendorName.length).trim();
      }
      return `${cleanTitle} (Qty:${i.quantity})`;
    }).join(', ');
    const desc = `${packName} [${frequency}] - (${listSummary})`;

    setCartItems(prev => [
      ...prev,
      {
        productId: `sub-pack-${Date.now()}`,
        productTitle: desc,
        price: flatPrice,
        image: '/placeholder.png',
        quantity: 1,
        vendor: 'Subscription Pack'
      }
    ]);
    setCartOpen(true);
  };

  const handleUpdateCartQty = (productId: string, action: 'inc' | 'dec') => {
    setCartItems(prev => {
      return prev.map(item => {
        if (item.productId === productId) {
          const newQty = action === 'inc' ? item.quantity + 1 : item.quantity - 1;
          return { ...item, quantity: Math.max(newQty, 1) };
        }
        return item;
      });
    });
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.productId !== productId));
  };

  // --- Wishlist handlers ---
  const handleToggleWishlist = (productId: string) => {
    if (!loggedInCustomer) return;
    setLoggedInCustomer(prev => {
      if (!prev) return null;
      const copy = { ...prev };
      if (copy.wishlist.includes(productId)) {
        copy.wishlist = copy.wishlist.filter(id => id !== productId);
      } else {
        copy.wishlist = [...copy.wishlist, productId];
      }
      return copy;
    });
  };

  const handleUpdateWishlistAction = (productId: string, action: 'add' | 'remove') => {
    if (!loggedInCustomer) return;
    setLoggedInCustomer(prev => {
      if (!prev) return null;
      const copy = { ...prev };
      if (action === 'remove') {
        copy.wishlist = copy.wishlist.filter(id => id !== productId);
      } else if (!copy.wishlist.includes(productId)) {
        copy.wishlist = [...copy.wishlist, productId];
      }
      return copy;
    });
  };

  // --- Customer login and details update ---
  const handleCustomerLogin = (customer: Customer) => {
    setLoggedInCustomer(customer);
  };

  const handleCustomerLogout = () => {
    setLoggedInCustomer(null);
  };

  const handleUpdateProfile = (updated: Customer) => {
    setLoggedInCustomer(updated);
    setCustomers(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  const handleAddAddress = (address: string) => {
    if (!loggedInCustomer) return;
    setLoggedInCustomer(prev => {
      if (!prev) return null;
      return {
        ...prev,
        addresses: [...prev.addresses, address]
      };
    });
  };

  const handleRemoveAddress = (index: number) => {
    if (!loggedInCustomer) return;
    setLoggedInCustomer(prev => {
      if (!prev) return null;
      return {
        ...prev,
        addresses: prev.addresses.filter((_, idx) => idx !== index)
      };
    });
  };

  // --- Checkout sequence logic ---
  const handleTriggerCheckout = (discountApplied: Discount | null, finalTotal: number) => {
    setCheckoutDiscount(discountApplied);
    setCheckoutTotal(finalTotal);
    setCartOpen(false);
    navigateToTab('frontend-checkout');
  };

  const handleCompleteCheckout = (paymentDetails: {
    orderId: string;
    customerName: string;
    customerEmail: string;
    address: string;
    total: number;
    discountApplied: Discount | null;
    items: { productId: string; productTitle: string; price: number; quantity: number; image?: string; }[];
    worldpayTxId: string;
    worldpayAuthCode: string;
    cardBrand: string;
  }) => {
    // Construct order
    const newOrder: Order = {
      id: paymentDetails.orderId,
      customerName: paymentDetails.customerName,
      customerEmail: paymentDetails.customerEmail,
      tags: paymentDetails.discountApplied ? ['coupon', paymentDetails.discountApplied.title] : [],
      fulfillmentStatus: 'Unfulfilled',
      paymentStatus: 'Paid',
      worldpayTxId: paymentDetails.worldpayTxId,
      worldpayAuthCode: paymentDetails.worldpayAuthCode,
      cardBrand: paymentDetails.cardBrand,
      total: paymentDetails.total,
      destination: paymentDetails.address,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      deliveryMethod: 'Priority Courier Shipping via Worldpay | Tracked',
      items: paymentDetails.items
    };

    setOrders(prev => [newOrder, ...prev]);

    // Handle coupon used increase
    if (paymentDetails.discountApplied) {
      setDiscounts(prev => prev.map(d => d.id === paymentDetails.discountApplied!.id ? { ...d, used: d.used + 1 } : d));
    }

    // Handle spent stats inside customers profile
    if (loggedInCustomer) {
      const updatedCust = {
        ...loggedInCustomer,
        ordersCount: loggedInCustomer.ordersCount + 1,
        amountSpent: loggedInCustomer.amountSpent + paymentDetails.total
      };
      setLoggedInCustomer(updatedCust);
      setCustomers(prev => prev.map(c => c.id === loggedInCustomer.id ? updatedCust : c));
    }

    // Clear cart
    setCartItems([]);
    setCartOpen(false);
  };

  const handleConfirmWithdrawal = (orderId: string, email: string, name: string, selectedItems: string[]) => {
    setOrders(prevOrders => {
      return prevOrders.map(o => {
        if (o.id === orderId) {
          const currentTags = Array.isArray(o.tags) ? [...o.tags] : [];
          if (!currentTags.includes('Withdrawal Requested')) {
            currentTags.push('Withdrawal Requested');
          }
          const itemSpecTag = `Withdraw: ${selectedItems.length} item(s)`;
          if (!currentTags.includes(itemSpecTag)) {
            currentTags.push(itemSpecTag);
          }
          return {
            ...o,
            tags: currentTags,
            paymentStatus: 'Refunded' // Display Refunded status for completed withdrawal request
          };
        }
        return o;
      });
    });

    // Generate simulated HTML email copy and save to simulated logs
    const targetOrder = orders.find(o => o.id === orderId);
    if (targetOrder) {
      const withdrawnProducts = targetOrder.items.filter(i => selectedItems.includes(i.productId));
      const totalRefund = withdrawnProducts.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      const itemsHtml = withdrawnProducts.map(item => `
        <div style="display: flex; justify-content: space-between; font-size: 13px; padding: 6px 0; border-bottom: 1px solid #f1f5f9;">
          <span style="color: #334155; font-weight: 600;">${item.productTitle} &times; ${item.quantity}</span>
          <span style="font-family: monospace; font-weight: bold; color: #1e293b;">£${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      `).join('');

      const emailHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); color: #334155;">
          <div style="background-color: #0d1117; padding: 25px 20px; text-align: center;">
            <span style="font-size: 18px; font-weight: 900; color: #ffffff; letter-spacing: 2px;">PERFUME SAMPLER</span>
            <div style="font-size: 9px; font-weight: bold; color: #cbd5e1; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 4px;">Order withdrawal receipt</div>
          </div>
          
          <div style="padding: 24px; text-align: left;">
            <p style="font-size: 13px; font-weight: bold; color: #0f172a; margin-top: 0;">Hi ${name || targetOrder.customerName || 'Value Member'},</p>
            <p style="font-size: 12.5px; color: #475569; line-height: 1.6; margin-bottom: 20px;">
              Your formal request to withdraw products from Order <strong>#${orderId}</strong> has been successfully registered. Our team has received this request and is manually reviewing it to match transactions quickly.
            </p>

            <div style="background-color: #f8fafc; border: 1px solid #f1f5f9; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
              <div style="font-size: 9.5px; font-weight: bold; text-transform: uppercase; color: #94a3b8; border-bottom: 1px solid #f1f5f9; padding-bottom: 6px; margin-bottom: 10px; letter-spacing: 0.5px;">
                Withdrawn Products Summary
              </div>
              
              <div style="margin-bottom: 12px;">
                ${itemsHtml}
              </div>

              <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: bold; color: #e11d48; padding-top: 8px;">
                <span>Total Estimated Credit:</span>
                <span>£${totalRefund.toFixed(2)}</span>
              </div>
            </div>

            <div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 12px; padding: 14px; margin-bottom: 20px; font-size: 11.5px; line-height: 1.5; color: #b45309;">
              <strong>Manual Verification Status:</strong><br/>
              No manual action is required from you! An administrator will review your withdrawal list, adjust shipping parameters, and process any transaction balance back onto your primary card brand.
            </div>

            <p style="font-size: 11.5px; color: #64748b; line-height: 1.5;">
              If you have any questions, please visit your account dashboard online or reach out to our Customer Operations Desk.
            </p>
          </div>
          
          <div style="background-color: #f8fafc; padding: 15px; border-top: 1px solid #f1f5f9; text-align: center; font-size: 10px; color: #94a3b8;">
            Thank you for shopping with PerfumeSampler.
          </div>
        </div>
      `;

      const newEmail = {
        to: email || targetOrder.customerEmail,
        subject: `Order Withdrawal Confirmation - #${orderId}`,
        preview: `Your request to withdraw products from Order #${orderId} is registered. Estimated Credit: £${totalRefund.toFixed(2)}.`,
        body: emailHtml,
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      try {
        const stored = localStorage.getItem('ps_simulated_emails');
        const emails = stored ? JSON.parse(stored) : [];
        localStorage.setItem('ps_simulated_emails', JSON.stringify([newEmail, ...emails]));
      } catch (err) {
        console.error("Failed to save simulated email", err);
      }

      // Dispatch real-time global listener alert
      window.dispatchEvent(new CustomEvent('ps-emails-updated'));

      // Show beautiful interactive notification banner
      setEmailToast({
        to: email || targetOrder.customerEmail,
        subject: `Order Withdrawal Confirmation - #${orderId}`,
        refund: totalRefund
      });
    }
  };

  if (!isInitialLoadDone) {
    return (
      <div className="min-h-screen bg-[#f6f6f7] flex flex-col items-center justify-center p-6" id="app-loading-state">
        <div className="space-y-4 max-w-md w-full text-center flex flex-col items-center">
          <div className="h-10 w-10 text-indigo-650 animate-spin border-4 border-[#e1e2e6] border-t-indigo-600 rounded-full mb-1"></div>
          <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest animate-pulse font-mono">Connecting to Atlas Database...</p>
          <div className="h-0.5 w-24 bg-slate-200 rounded-full overflow-hidden relative">
            <div className="absolute top-0 left-0 bottom-0 bg-indigo-600 rounded-full animate-[shimmer_1.5s_infinite]" style={{ width: '40%' }}></div>
          </div>
          <p className="text-[10.5px] text-slate-500 font-bold leading-relaxed max-w-xs">
            Synchronizing live products, collection hierarchies, customer order histories, and inventories...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f6f7] text-slate-800 flex flex-col font-sans">
      
      {isDbOffline && !isAdminActive && (
        <div className="bg-amber-600 text-white px-4 py-2.5 text-center text-[11px] font-bold flex flex-col sm:flex-row items-center justify-center gap-2 relative z-50 shadow-md">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-white animate-ping shrink-0" />
            <span>⚠️ MongoDB Connection Offline (Pending IP Whitelist):</span>
          </div>
          <span className="opacity-95">Your Atlas firewall is blocking server connection. To save permanently, allow any IP address (0.0.0.0/0) inside your Atlas Network Access console.</span>
          <button 
            type="button"
            onClick={() => setIsAdminActive(true)}
            className="underline hover:text-slate-100 font-black cursor-pointer text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded border border-white/30 hover:border-white transition-colors shrink-0"
          >
            Open Portal
          </button>
        </div>
      )}

      {/* Universal header layout */}
      {!isAdminActive && (
        <Header
          currentTab={currentTab}
          onTabChange={(tab) => {
            if (isAdminDirty) {
              setPendingNavAction({ type: 'change-tab', payload: tab });
              setShowUnsavedModal(true);
            } else {
              navigateToTab(tab);
            }
          }}
          loggedInCustomer={loggedInCustomer}
          cartItems={cartItems}
          onOpenCart={() => setCartOpen(true)}
          onOpenCustomer={() => {
            setCustomerDrawerTab('orders');
            setCustomerDrawerOpen(true);
          }}
          onOpenWishlist={() => {
            setCustomerDrawerTab('wishlist');
            setCustomerDrawerOpen(true);
          }}
          onOpenAdmin={() => {
            if (isAdminActive && isAdminDirty) {
              setPendingNavAction({ type: 'toggle-admin' });
              setShowUnsavedModal(true);
            } else {
              setIsAdminActive(!isAdminActive);
            }
          }}
          isAdminActive={isAdminActive}
          allProducts={products}
          allCollections={collections}
          onNavigateDetail={navigateToTab}
        />
      )}

      {/* Primary view content sandbox */}
      <main className="flex-1">
        {isAdminActive ? (
          !isAdminAuthenticated ? (
            <AdminLogin
              onLoginSuccess={() => {
                setIsAdminAuthenticated(true);
                sessionStorage.setItem('ps_admin_authenticated', 'true');
              }}
              onCancel={() => {
                setIsAdminActive(false);
              }}
            />
          ) : (
            /* VIEW 1: ADMIN REPLICA DASHBOARD */
            <AdminDashboard
              products={products}
              onUpdateProducts={setProducts}
              collections={collections}
              onUpdateCollections={setCollections}
              orders={orders}
              onUpdateOrders={setOrders}
              files={files}
              onUpdateFiles={setFiles}
              customers={customers}
              onUpdateCustomers={setCustomers}
              discounts={discounts}
              onUpdateDiscounts={setDiscounts}
              customPages={customPages}
              onUpdateCustomPages={setCustomPages}
              blogs={blogs}
              onUpdateBlogs={setBlogs}
              onDirtyChange={setIsAdminDirty}
              adminActionTrigger={adminActionTrigger}
              onAdminActionComplete={(actionHandled) => {
                setIsAdminDirty(false);
                setAdminActionTrigger(null);
                setShowUnsavedModal(false);

                if (pendingNavAction) {
                  if (pendingNavAction.type === 'toggle-admin') {
                    setIsAdminActive(!isAdminActive);
                  } else if (pendingNavAction.type === 'change-tab' && pendingNavAction.payload) {
                    const tab = pendingNavAction.payload;
                    navigateToTab(tab);
                  }
                  setPendingNavAction(null);
                }
              }}
              onExitAdmin={() => {
                if (isAdminDirty) {
                  setPendingNavAction({ type: 'toggle-admin' });
                  setShowUnsavedModal(true);
                } else {
                  setIsAdminActive(false);
                }
              }}
              onLogoutAdmin={() => {
                setIsAdminAuthenticated(false);
                sessionStorage.removeItem('ps_admin_authenticated');
                setIsAdminActive(false);
              }}
            />
          )
        ) : (
          
          /* VIEW 2: FRONTEND VIEW NAVIGATION */
          <>
            {/* FRONTEND VIEW - HOME */}
            {currentTab === 'frontend-home' && (() => {
              const hp = customPages.find(p => p.isHomepage);
              if (hp) {
                return (
                  <PageRenderer 
                    page={hp} 
                    allProducts={products}
                    allCollections={collections}
                    loggedInCustomer={loggedInCustomer}
                    onAddToCart={handleAddToCart} 
                    onToggleWishlist={handleToggleWishlist}
                    allBlogs={blogs}
                    onNavigate={(target, arg) => {
                      if (target === 'frontend-shop' || target === 'frontend-subscribe' || target === 'frontend-brands') {
                        navigateToTab(target);
                      } else if (target.startsWith('/pages/') || target.startsWith('page-')) {
                        const slug = target.replace('/pages/', '').replace('page-', '');
                        navigateToTab(slug);
                      } else if (target.startsWith('/collections/') || target.startsWith('collection-')) {
                        const colId = target.replace('/collections/', '').replace('collection-', '');
                        navigateToTab('collection-detail', undefined, colId);
                      } else if (target.startsWith('/products/') || target.startsWith('product-')) {
                        const prodId = target.replace('/products/', '').replace('product-', '');
                        navigateToTab('product-detail', prodId);
                      } else {
                        navigateToTab(target);
                      }
                    }} 
                  />
                );
              }
              return (
                <div className="space-y-16 pb-16">
                  
                  {/* Hero section */}
                  <section className="bg-slate-900 text-white min-h-[50vh] flex items-center relative overflow-hidden px-6 lg:px-12 py-16">
                    <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
                      <div className="space-y-6">
                        <span className="text-xs bg-indigo-600 text-white font-extrabold py-1 px-3.5 rounded-full uppercase tracking-widest inline-flex items-center gap-1.5 animate-pulse">
                          <Sparkles className="h-3 w-3" /> OFFICIAL IMPORT RESELLERS
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none text-white">
                          THE FINEST FLAVOR <br />POUCHES AT SCALE
                        </h1>
                        <p className="text-sm text-slate-300 leading-relaxed max-w-md font-sans">
                          Sourced globally from premium certified laboratories. Settle for nothing but the crispest breath freeze crystal cans delivered straight to your door step.
                        </p>
                        
                        <div className="pt-2 flex flex-wrap gap-4 text-xs font-bold leading-normal">
                          <button
                            onClick={() => navigateToTab('frontend-shop')}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 px-8 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                          >
                            Shop Now (All Brands) <ArrowRight className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => navigateToTab('frontend-subscribe')}
                            className="bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 py-3.5 px-8 rounded-xl cursor-pointer"
                          >
                            Subscription Box 📦
                          </button>
                        </div>
                      </div>

                      <div className="hidden md:flex justify-end relative">
                        <div className="relative h-72 w-72 rounded-full bg-indigo-500/10 flex items-center justify-center p-6 border border-slate-800/80 shadow-2xl animate-spin-slow">
                          <span className="text-6xl">📦</span>
                          <div className="absolute inset-0 border-2 border-dashed border-indigo-500/20 rounded-full" />
                        </div>
                      </div>
                    </div>

                    {/* Aesthetic Background design */}
                    <div className="absolute inset-0 bg-radial-gradient from-indigo-950/20 to-transparent pointer-events-none" />
                  </section>

                  {/* Popular Brands Row */}
                  <section className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-8">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Our Premium Partner directory</h3>
                    </div>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-75">
                      {['77 Pouches', 'CUBA Power', 'CLEW White', 'KILLA Siberian', 'VELO Eucalyptus'].map((bLabel, index) => (
                        <span 
                          key={index} 
                          onClick={() => {
                            navigateToTab('frontend-brands');
                          }}
                          className="text-sm font-black tracking-widest text-slate-500 hover:text-indigo-600 cursor-pointer capitalize transition-colors border-b border-transparent hover:border-indigo-650 pb-1"
                        >
                          {bLabel}
                        </span>
                      ))}
                    </div>
                  </section>

                  {/* Welcome Highlights */}
                  <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <img
                      src="/placeholder.png"
                      alt="Canisters"
                      className="rounded-2xl shadow-md border object-cover h-80 w-full"
                      referrerPolicy="no-referrer"
                    />
                    <div className="space-y-4">
                      <span className="text-xs text-indigo-650 font-bold uppercase tracking-wider">High performance Can packaging</span>
                      <h2 className="text-2xl font-black text-slate-900">Custom Subscription Box: Curate your customized flavor bundle saving 15%</h2>
                      <p className="text-slate-500 leading-normal text-xs">
                        No more constant ordering pipelines. Set up your bespoke recurring deliveries of 6 cans, tweak frequencies automatically, cancel or edit anything from your user account.
                      </p>
                      <button
                        onClick={() => navigateToTab('frontend-subscribe')}
                        className="text-xs text-indigo-600 hover:text-indigo-805 font-bold flex items-center gap-1 cursor-pointer pt-2"
                      >
                        Configure LITE plan boxes <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </section>

                  {/* Top Seller canisters */}
                  <section className="max-w-7xl mx-auto px-6">
                    <div className="flex justify-between items-end mb-8">
                      <div>
                        <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider">curated picks</h4>
                        <h2 className="text-2xl font-black text-slate-900 mt-1">BEST SELLING CANISTERS TODAY</h2>
                      </div>
                      <button
                        onClick={() => navigateToTab('frontend-shop')}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-extrabold cursor-pointer"
                      >
                        Browse full catalog →
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                      {products.slice(0, 4).map(prod => (
                        <div 
                          key={prod.id} 
                          onClick={() => {
                            navigateToTab('frontend-shop');
                          }}
                          className="bg-white border hover:border-slate-350 p-4 rounded-xl space-y-3 cursor-pointer group hover:shadow-xs transition-shadow"
                        >
                          <div className="h-44 rounded-lg bg-slate-50 border overflow-hidden relative">
                            <img src={prod.image} className="w-full h-full object-cover transition-transform group-hover:scale-102" alt="" referrerPolicy="no-referrer" />
                            <span className="absolute top-2.5 left-2.5 bg-slate-900 text-white text-[9px] font-bold uppercase py-0.5 px-2 rounded-full">
                              {prod.vendor}
                            </span>
                          </div>
                          <div className="space-y-1 text-center">
                            <h4 className="text-xs font-bold text-slate-800 truncate">{prod.title}</h4>
                            <p className="text-slate-900 font-black text-xs">£{prod.price.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                </div>
              );
            })()}

            {/* FRONTEND VIEW - CUSTOMIZABLE BUILDER SUBPAGES */}
            {customPages.some(p => p.slug === currentTab && !p.isHomepage) && (() => {
              const matchedPage = customPages.find(p => p.slug === currentTab);
              if (!matchedPage) return null;
              return (
                <PageRenderer 
                  page={matchedPage} 
                  allProducts={products}
                  allCollections={collections}
                  loggedInCustomer={loggedInCustomer}
                  onAddToCart={handleAddToCart} 
                  onToggleWishlist={handleToggleWishlist}
                  allBlogs={blogs}
                  onNavigate={(target, arg) => {
                    if (target === 'frontend-shop' || target === 'frontend-subscribe' || target === 'frontend-brands') {
                      navigateToTab(target);
                    } else if (target.startsWith('/pages/') || target.startsWith('page-')) {
                      const slug = target.replace('/pages/', '').replace('page-', '');
                      navigateToTab(slug);
                    } else if (target.startsWith('/collections/') || target.startsWith('collection-')) {
                      const colId = target.replace('/collections/', '').replace('collection-', '');
                      navigateToTab('collection-detail', undefined, colId);
                    } else if (target.startsWith('/products/') || target.startsWith('product-')) {
                      const prodId = target.replace('/products/', '').replace('product-', '');
                      navigateToTab('product-detail', prodId);
                    } else {
                      navigateToTab(target);
                    }
                  }} 
                />
              );
            })()}

            {/* FRONTEND VIEW - PRODUCT DETAIL PAGE */}
            {currentTab === 'product-detail' && (() => {
              const matchedProduct = products.find(p => p.id === selectedProductId || p.slug === selectedProductId || slugify(p.title) === selectedProductId);
              if (!matchedProduct) {
                return (
                  <div className="max-w-6xl mx-auto py-24 px-4 text-center space-y-6">
                    <span className="text-7xl block">🔍</span>
                    <div className="space-y-1.5">
                      <span className="text-[10px] bg-red-100 text-red-700 font-extrabold py-1 px-3 rounded-full uppercase tracking-widest inline-block">
                        Error 404 - Product Not Found
                      </span>
                      <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Canister Not Found</h1>
                    </div>
                    <p className="text-slate-500 max-w-sm mx-auto text-xs leading-relaxed">
                      We couldn't locate the premium nicotine canister you requested. It might have been unlisted, archived, or deleted.
                    </p>
                    <button
                      onClick={() => navigateToTab('frontend-shop')}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 px-8 rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer shadow-xs"
                    >
                      Back to Catalog
                    </button>
                  </div>
                );
              }
              return (
                <ProductDetailView
                  product={matchedProduct}
                  allProducts={products}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  onNavigate={(target, arg) => {
                    if (target === 'product-detail' && arg) {
                      navigateToTab('product-detail', arg);
                    } else if (target === 'collection-detail' && arg) {
                      navigateToTab('collection-detail', undefined, arg);
                    } else {
                      navigateToTab(target);
                    }
                  }}
                />
              );
            })()}

            {/* FRONTEND VIEW - COLLECTION DETAIL PAGE */}
            {currentTab === 'collection-detail' && (() => {
              const matchedCollection = collections.find(c => c.id === activeCollectionId || c.slug === activeCollectionId || slugify(c.title) === activeCollectionId);
              if (!matchedCollection) {
                return (
                  <div className="max-w-6xl mx-auto py-24 px-4 text-center space-y-6">
                    <span className="text-7xl block">📦</span>
                    <div className="space-y-1.5">
                      <span className="text-[10px] bg-red-100 text-red-700 font-extrabold py-1 px-3 rounded-full uppercase tracking-widest inline-block">
                        Error 404 - Collection Not Found
                      </span>
                      <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Collection Not Found</h1>
                    </div>
                    <p className="text-slate-500 max-w-sm mx-auto text-xs leading-relaxed">
                      The curated collection category you requested doesn't exist, or has been unregistered from the vendor portfolio.
                    </p>
                    <button
                      onClick={() => navigateToTab('frontend-shop')}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 px-8 rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer shadow-xs"
                    >
                      Back to Catalog
                    </button>
                  </div>
                );
              }
              return (
                <CollectionDetailView
                  collection={matchedCollection}
                  allProducts={products}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  onNavigate={(target, arg) => {
                    if (arg) {
                      navigateToTab('product-detail', arg);
                    } else {
                      navigateToTab(target);
                    }
                  }}
                />
              );
            })()}

            {/* FRONTEND VIEW - SUBSCRIBE BUILDER */}
            {currentTab === 'frontend-subscribe' && (
              <SubscriptionBuilder
                allProducts={products}
                collections={collections}
                onAddSubToCart={handleAddSubBoxToCart}
              />
            )}

            {/* FRONTEND VIEW - SHOP/CATALOG */}
            {currentTab === 'frontend-shop' && (
              <ProductsGrid
                products={products}
                collections={collections}
                activeCollectionId={activeCollectionId}
                onActiveCollectionChange={setActiveCollectionId}
                loggedInCustomer={loggedInCustomer}
                onToggleWishlist={handleToggleWishlist}
                onAddToCart={handleAddToCart}
                onOpenLoginModal={() => navigateToTab('frontend-account')}
              />
            )}

            {/* FRONTEND VIEW - BRANDS DIRECTORY */}
            {currentTab === 'frontend-brands' && (() => {
              const matchedPage = customPages.find(p => p.slug === 'brands');
              if (matchedPage) {
                return (
                  <PageRenderer 
                    page={matchedPage} 
                    allProducts={products}
                    allCollections={collections}
                    loggedInCustomer={loggedInCustomer}
                    onAddToCart={handleAddToCart} 
                    onToggleWishlist={handleToggleWishlist}
                    allBlogs={blogs}
                    onNavigate={(target, arg) => {
                      if (target === 'frontend-shop' || target === 'frontend-subscribe' || target === 'frontend-brands') {
                        navigateToTab(target);
                      } else if (target.startsWith('/pages/') || target.startsWith('page-')) {
                        const slug = target.replace('/pages/', '').replace('page-', '');
                        navigateToTab(slug);
                      } else if (target.startsWith('/collections/') || target.startsWith('collection-')) {
                        const colId = target.replace('/collections/', '').replace('collection-', '');
                        navigateToTab('collection-detail', undefined, colId);
                      } else if (target.startsWith('/products/') || target.startsWith('product-')) {
                        const prodId = target.replace('/products/', '').replace('product-', '');
                        navigateToTab('product-detail', prodId);
                      } else {
                        navigateToTab(target);
                      }
                    }}
                  />
                );
              }
              return (
                <BrandList
                  collections={collections}
                  onBrandClick={(colId) => {
                    navigateToTab('collection-detail', undefined, colId);
                  }}
                />
              );
            })()}

            {/* FRONTEND VIEW - CUSTOMER ACCOUNT */}
            {currentTab === 'frontend-account' && (
              <CustomerAccount
                customers={customers}
                loggedInCustomer={loggedInCustomer}
                onLogin={handleCustomerLogin}
                onLogout={handleCustomerLogout}
                onUpdateWishlist={handleUpdateWishlistAction}
                allProducts={products}
                orders={orders}
                onAddAddress={handleAddAddress}
                onRemoveAddress={handleRemoveAddress}
                onUpdateProfile={handleUpdateProfile}
              />
            )}

            {/* FRONTEND VIEW - SECURE WORLDPAY CHECKOUT */}
            {currentTab === 'frontend-checkout' && (
              <CheckoutView
                cartItems={cartItems}
                discountApplied={checkoutDiscount}
                totalAmount={checkoutTotal}
                loggedInCustomer={loggedInCustomer}
                onNavigate={navigateToTab}
                onCompleteCheckout={handleCompleteCheckout}
              />
            )}

            {/* FRONTEND VIEW - WORLDPAY SECURE GATEWAY */}
            {currentTab === 'payment-worldpay-gateway' && (
              <WorldpayGatewaySimulator 
                onReturnToShop={() => {
                  window.history.pushState({}, '', '/collections/all');
                  window.dispatchEvent(new Event('popstate'));
                }}
              />
            )}

            {/* FRONTEND VIEW - SECURE PAYMENT SUCCESS */}
            {currentTab === 'payment-success' && (
              <PaymentSuccessScreen 
                onReturnToShop={() => {
                  window.history.pushState({}, '', '/collections/all');
                  window.dispatchEvent(new Event('popstate'));
                }}
              />
            )}

            {/* FRONTEND VIEW - SECURE PAYMENT FAILED */}
            {currentTab === 'payment-failed' && (
              <PaymentFailedScreen 
                onReturnToCheckout={() => {
                  window.history.pushState({}, '', '/pages/checkout');
                  window.dispatchEvent(new Event('popstate'));
                }}
              />
            )}

            {/* FRONTEND VIEW - SECURE PAYMENT CANCELLED */}
            {currentTab === 'payment-cancelled' && (
              <PaymentCancelledScreen 
                onReturnToCheckout={() => {
                  window.history.pushState({}, '', '/pages/checkout');
                  window.dispatchEvent(new Event('popstate'));
                }}
              />
            )}

            {/* FRONTEND VIEW - CURATED STORES BLOG/MAGAZINE HUB */}
            {currentTab === 'blogs' && (() => {
              const activeBlogs = blogs.filter(b => b.status === 'Active');
              
              // Filter active articles by query & category
              const filteredFrontBlogs = activeBlogs.filter(blog => {
                const matchesQuery = blog.title.toLowerCase().includes(frontendBlogQuery.toLowerCase()) || 
                                     blog.excerpt.toLowerCase().includes(frontendBlogQuery.toLowerCase()) ||
                                     blog.tags.some(t => t.toLowerCase().includes(frontendBlogQuery.toLowerCase()));
                const matchesCategory = selectedFrontCategory === 'All' || blog.category === selectedFrontCategory;
                return matchesQuery && matchesCategory;
              });

              const featuredBlog = activeBlogs[0]; // Take latest active blog as hero header article

              return (
                <div className="bg-slate-50 min-h-screen">
                  
                  {/* Hero Banner Header */}
                  <div className="bg-slate-900 text-white relative py-16 px-4 overflow-hidden">
                    <div className="absolute inset-0 opacity-15 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-slate-200 via-slate-900 to-black pointer-events-none" />
                    <div className="max-w-6xl mx-auto space-y-4 relative z-10 text-center sm:text-left">
                      <span className="text-[10px] bg-slate-800 text-slate-300 font-extrabold uppercase tracking-widest py-1.5 px-3 rounded-full border border-slate-700">
                        Editorial & Education
                      </span>
                      <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">The Pouch Science Journal</h1>
                      <p className="text-slate-400 max-w-lg text-xs sm:text-sm leading-relaxed">
                        Fascinating breakdowns, organic chemistry, clinical guides, and strategic brand reviews compiled by industry clinicians.
                      </p>
                    </div>
                  </div>

                  {/* Filter Toolbar & Category Chips */}
                  <div className="max-w-6xl mx-auto py-8 px-4">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white border p-4 rounded-2xl shadow-xs">
                      
                      {/* Search Bar */}
                      <div className="relative w-full md:w-80">
                        <input
                          type="text"
                          placeholder="Search articles & themes..."
                          value={frontendBlogQuery}
                          onChange={(e) => setFrontendBlogQuery(e.target.value)}
                          className="w-full text-xs p-2.5 pb-2.5 pl-9 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-500 bg-slate-50"
                        />
                        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      </div>

                      {/* Categories chips list */}
                      <div className="flex flex-wrap gap-1.5 w-full md:w-auto overflow-x-auto scrollbar-none">
                        {['All', 'Chemistry & Science', 'Buying Guides', 'Tips & Hacks', 'Industry Trends', 'General'].map(cat => (
                          <button
                            key={cat}
                            onClick={() => setSelectedFrontCategory(cat)}
                            className={`text-[10px] font-black uppercase tracking-wider px-3.5 py-2.5 rounded-full border transition cursor-pointer shrink-0 ${
                              selectedFrontCategory === cat 
                                ? 'bg-slate-900 border-slate-900 text-white shadow-xs' 
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>

                    </div>

                    {/* Featured Article Hero Panel (if matches 'All' or matches its category, and not searching) */}
                    {featuredBlog && !frontendBlogQuery && selectedFrontCategory === 'All' && (
                      <div className="mt-10 bg-white border border-slate-150 rounded-3xl overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12 hover:shadow-md transition duration-350 group">
                        
                        <div className="lg:col-span-7 h-64 sm:h-96 overflow-hidden relative border-b lg:border-b-0 lg:border-r">
                          <img 
                            src={featuredBlog.image} 
                            alt={featuredBlog.title} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103" 
                          />
                          <span className="absolute top-4 left-4 bg-slate-900 text-white font-extrabold text-[9px] uppercase px-3 py-1 rounded-full shadow-md tracking-wider">
                            Latest Article
                          </span>
                        </div>

                        <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between space-y-6 text-left">
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] text-slate-400 font-extrabold uppercase bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                                {featuredBlog.category}
                              </span>
                              <span className="text-[10px] text-slate-500 font-medium">{featuredBlog.publishedAt}</span>
                            </div>

                            <h2 
                              onClick={() => navigateToTab('blog-detail', featuredBlog.slug)}
                              className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight leading-tight hover:text-indigo-650 transition cursor-pointer"
                            >
                              {featuredBlog.title}
                            </h2>

                            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{featuredBlog.excerpt}</p>
                            
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {featuredBlog.tags.map((t, idx) => (
                                <span key={idx} className="bg-slate-50 text-[10px] text-slate-500 rounded px-2 py-0.5 border">#{t}</span>
                              ))}
                            </div>
                          </div>

                          <div className="pt-6 border-t flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-black text-xs uppercase shadow-sm">
                                {featuredBlog.author ? featuredBlog.author.charAt(0) : 'A'}
                              </div>
                              <div>
                                <h5 className="text-[11px] font-black text-slate-800">{featuredBlog.author || 'Pouch Science'}</h5>
                                <p className="text-[9px] text-slate-400">{featuredBlog.readTime || '5 min read'}</p>
                              </div>
                            </div>

                            <button 
                              onClick={() => navigateToTab('blog-detail', featuredBlog.slug)}
                              className="bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-wider py-2.5 px-4 rounded-xl cursor-pointer"
                            >
                              Read Full Story
                            </button>
                          </div>
                        </div>

                      </div>
                    )}

                    {/* Standard Search Results grid */}
                    <div className="mt-10 space-y-4">
                      {frontendBlogQuery || selectedFrontCategory !== 'All' ? (
                        <h3 className="text-xs text-slate-500 font-bold uppercase tracking-widest text-left">
                          Search found {filteredFrontBlogs.length} articles
                        </h3>
                      ) : (
                        <h3 className="text-xs text-slate-500 font-bold uppercase tracking-widest text-left mt-8 mb-6">
                          Recent Publications
                        </h3>
                      )}

                      {filteredFrontBlogs.length === 0 ? (
                        <div className="bg-white border rounded-2xl py-16 px-4 text-center space-y-4">
                          <span className="text-5xl block">🗒️</span>
                          <h4 className="font-bold text-slate-800 text-sm">No Publications Match Filter Criteria</h4>
                          <p className="text-slate-400 text-xs max-w-sm mx-auto">Try resetting categories or typing a different keyword to browse our research pouch index.</p>
                          <button
                            onClick={() => {
                              setFrontendBlogQuery('');
                              setSelectedFrontCategory('All');
                            }}
                            className="bg-slate-900 text-white text-[10px] font-black uppercase px-4 py-2.5 rounded-xl cursor-pointer"
                          >
                            Reset Filters
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                          {filteredFrontBlogs.map(blog => (
                            <div 
                              key={blog.id} 
                              className="bg-white border border-slate-150 rounded-2xl overflow-hidden hover:shadow-md transition duration-300 flex flex-col group"
                            >
                              <div className="h-48 overflow-hidden relative shrink-0 border-b">
                                <img 
                                  src={blog.image} 
                                  alt={blog.title} 
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102" 
                                />
                                <span className="absolute top-3 left-3 bg-white/95 text-slate-800 font-extrabold text-[9px] uppercase px-2.5 py-0.5 rounded shadow-sm border">
                                  {blog.category}
                                </span>
                              </div>

                              <div className="p-5 flex-1 flex flex-col justify-between space-y-5">
                                <div className="space-y-2.5">
                                  <span className="text-[9px] text-slate-400 font-semibold block">{blog.publishedAt}</span>
                                  
                                  <h4 
                                    onClick={() => navigateToTab('blog-detail', blog.slug)}
                                    className="text-sm font-black text-slate-900 group-hover:text-indigo-650 transition cursor-pointer line-clamp-2 leading-snug uppercase tracking-tight"
                                  >
                                    {blog.title}
                                  </h4>

                                  <p className="text-slate-500 text-xs line-clamp-3 leading-relaxed">{blog.excerpt}</p>
                                </div>

                                <div className="pt-4 border-t flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-black text-[9px] uppercase border">
                                      {blog.author ? blog.author.charAt(0) : 'A'}
                                    </div>
                                    <div>
                                      <h5 className="text-[9px] font-bold text-slate-700">{blog.author}</h5>
                                      <p className="text-[8px] text-slate-400 font-medium">{blog.readTime}</p>
                                    </div>
                                  </div>

                                  <button
                                    onClick={() => navigateToTab('blog-detail', blog.slug)}
                                    className="text-[10px] font-black text-slate-900 group-hover:text-indigo-650 flex items-center gap-1 transition cursor-pointer"
                                  >
                                    Read Article <ArrowRight className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>

                </div>
              );
            })()}

            {/* FRONTEND VIEW - SINGLE EDITORIAL BLOG POST READER */}
            {currentTab === 'blog-detail' && (() => {
              const matchedBlog = blogs.find(b => b.slug === selectedBlogSlug);
              
              if (!matchedBlog) {
                return (
                  <div className="max-w-6xl mx-auto py-24 px-4 text-center space-y-6">
                    <span className="text-7xl block">📝</span>
                    <div className="space-y-1.5">
                      <span className="text-[10px] bg-red-100 text-red-700 font-extrabold py-1 px-3 rounded-full uppercase tracking-widest inline-block">
                        Error 404 - Article Not Found
                      </span>
                      <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Article Not Found</h1>
                    </div>
                    <p className="text-slate-500 max-w-sm mx-auto text-xs leading-relaxed">
                      This specific scientific or buying article does not exist, or has been temporarily unpublished by the store administrators.
                    </p>
                    <button
                      onClick={() => navigateToTab('blogs')}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 px-8 rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer shadow-xs"
                    >
                      View All Articles
                    </button>
                  </div>
                );
              }

              // Custom quick markdown paragraphs formatter helper
              const renderMarkdown = (text: string) => {
                if (!text) return null;
                return text.split('\n\n').map((paragraph, index) => {
                  const trimmed = paragraph.trim();
                  if (!trimmed) return null;

                  if (trimmed.startsWith('### ')) {
                    return <h3 key={index} className="text-sm sm:text-base font-black text-slate-900 mt-6 mb-3 uppercase tracking-tight">{trimmed.replace('### ', '')}</h3>;
                  }
                  if (trimmed.startsWith('## ')) {
                    return <h2 key={index} className="text-base sm:text-lg font-black text-slate-900 mt-8 mb-4 uppercase tracking-tight border-b-2 pb-2 border-slate-100">{trimmed.replace('## ', '')}</h2>;
                  }
                  if (trimmed.startsWith('# ')) {
                    return <h1 key={index} className="text-lg sm:text-2xl font-black text-slate-900 mt-10 mb-4 uppercase tracking-tight">{trimmed.replace('# ', '')}</h1>;
                  }
                  if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                    const listItems = trimmed.split('\n').map(item => item.replace(/^[-*]\s+/, ''));
                    return (
                      <ul key={index} className="list-disc pl-5 my-3 text-slate-650 space-y-1.5">
                        {listItems.map((item, i) => (
                          <li key={i} dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>') }} />
                        ))}
                      </ul>
                    );
                  }
                  
                  let cleanHTML = trimmed
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>');
                    
                  return (
                    <p 
                      key={index}
                      className="mb-4 text-xs sm:text-sm leading-relaxed text-slate-650"
                      dangerouslySetInnerHTML={{ __html: cleanHTML }}
                    />
                  );
                });
              };

              // Fetch 3 recent other articles
              const otherArticles = blogs
                .filter(b => b.status === 'Active' && b.id !== matchedBlog.id)
                .slice(0, 3);

              return (
                <div className="bg-slate-50 min-h-screen py-10 px-4">
                  <div className="max-w-4xl mx-auto">
                    
                    {/* Breadcrumbs */}
                    <button 
                      onClick={() => navigateToTab('blogs')}
                      className="text-slate-500 hover:text-slate-900 text-xs font-bold uppercase tracking-wider mb-8 flex items-center gap-1.5 transition cursor-pointer"
                    >
                      ← Back to Journal Index
                    </button>

                    {/* Main White Reader Box Container */}
                    <article className="bg-white border rounded-3xl overflow-hidden shadow-xs text-left">
                      
                      {/* Image cover photo */}
                      <div className="h-64 sm:h-96 relative w-full">
                        <img 
                          src={matchedBlog.image} 
                          alt={matchedBlog.title} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent pointer-events-none" />
                        <div className="absolute bottom-6 left-6 right-6 text-white text-left">
                          <span className="text-[9px] bg-indigo-650 text-white font-extrabold uppercase py-1 px-2.5 rounded-md border border-indigo-500 mr-3">
                            {matchedBlog.category}
                          </span>
                          <span className="text-xs text-slate-200 font-medium">{matchedBlog.publishedAt}</span>
                        </div>
                      </div>

                      {/* Post Header Meta details */}
                      <div className="p-6 sm:p-10 pb-4 border-b border-slate-100">
                        <h1 className="text-xl sm:text-3xl font-black text-slate-900 leading-tight uppercase tracking-tight">
                          {matchedBlog.title}
                        </h1>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-6">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-xs uppercase border shadow-xs">
                              {matchedBlog.author ? matchedBlog.author.charAt(0) : 'A'}
                            </div>
                            <div>
                              <h4 className="text-xs font-black text-slate-800">{matchedBlog.author || 'Store Owner'}</h4>
                              <p className="text-[9px] text-slate-400">Published Article • {matchedBlog.readTime || '5 min read'}</p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {matchedBlog.tags.map((t, idx) => (
                              <span key={idx} className="bg-slate-50 text-[9px] text-slate-500 font-bold px-2 py-0.5 rounded border">#{t}</span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Excerpt spotlight */}
                      <div className="mx-6 sm:mx-10 mt-6 p-4 rounded-xl border-l-4 border-slate-900 bg-slate-50 text-xs sm:text-sm text-slate-650 font-medium leading-relaxed">
                        {matchedBlog.excerpt}
                      </div>

                      {/* Article Story Box */}
                      <div className="p-6 sm:p-10 pt-4">
                        {renderMarkdown(matchedBlog.content)}
                      </div>

                    </article>

                    {/* Footer Sidebar Relevant articles */}
                    {otherArticles.length > 0 && (
                      <div className="mt-14 space-y-6">
                        <div className="border-b pb-3 flex justify-between items-center text-left">
                          <h3 className="text-xs text-slate-500 font-black uppercase tracking-widest">More From Pouch Journal</h3>
                          <button onClick={() => navigateToTab('blogs')} className="text-[10px] text-slate-800 font-black uppercase hover:underline">View All</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                          {otherArticles.map(blog => (
                            <div 
                              key={blog.id} 
                              onClick={() => navigateToTab('blog-detail', blog.slug)}
                              className="bg-white border rounded-xl overflow-hidden hover:shadow-sm cursor-pointer transition group"
                            >
                              <div className="h-32 overflow-hidden border-b relative">
                                <img src={blog.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102" alt="" referrerPolicy="no-referrer" />
                              </div>
                              <div className="p-4 space-y-2">
                                <span className="text-[9px] text-slate-400 font-bold block">{blog.publishedAt}</span>
                                <h4 className="text-xs font-black text-slate-800 group-hover:text-indigo-650 truncate uppercase tracking-tight">{blog.title}</h4>
                                <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">{blog.excerpt}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              );
            })()}

            {/* FRONTEND VIEW - PRIVACY POLICY */}
            {currentTab === 'privacy-policy' && (
              <PrivacyPolicy onNavigate={navigateToTab} />
            )}

            {/* FRONTEND VIEW - SHIPPING POLICY */}
            {currentTab === 'shipping-policy' && (
              <ShippingPolicy onNavigate={navigateToTab} />
            )}

            {/* FRONTEND VIEW - REFUND POLICY */}
            {currentTab === 'refund-policy' && (
              <RefundPolicy onNavigate={navigateToTab} />
            )}

            {/* FRONTEND VIEW - TERMS & CONDITIONS */}
            {currentTab === 'terms-conditions' && (
              <TermsConditions onNavigate={navigateToTab} />
            )}

            {/* FRONTEND VIEW - 404 NOT FOUND FOR NONEXISTENT PAGES */}
            {!['frontend-home', 'frontend-shop', 'frontend-brands', 'frontend-subscribe', 'frontend-account', 'product-detail', 'collection-detail', 'blogs', 'blog-detail', 'privacy-policy', 'shipping-policy', 'refund-policy', 'terms-conditions'].includes(currentTab) && !customPages.some(p => p.slug === currentTab) && (
              <div className="max-w-6xl mx-auto py-24 px-4 text-center space-y-6">
                <span className="text-7xl block">🔍</span>
                <div className="space-y-1.5">
                  <span className="text-[10px] bg-red-100 text-red-700 font-extrabold py-1 px-3 rounded-full uppercase tracking-widest inline-block">
                    Error 404 - Page Not Found
                  </span>
                  <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">This page does not exist</h1>
                </div>
                <p className="text-slate-500 max-w-sm mx-auto text-xs leading-relaxed">
                  We searched far and wide, but the custom page or theme layout you linked doesn't exist inside our merchant records.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={() => navigateToTab('frontend-home')}
                    className="bg-slate-900 hover:bg-black text-white font-black py-3 px-6 rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer shadow-xs"
                  >
                    Go Back Home
                  </button>
                  <button
                    onClick={() => navigateToTab('frontend-shop')}
                    className="bg-white border hover:bg-slate-50 text-slate-700 font-extrabold py-3 px-6 rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer"
                  >
                    Shop Canisters
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Global Shopping Cart slide out drawer panel */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        activeDiscounts={discounts}
        onTriggerCheckout={handleTriggerCheckout}
      />

      {/* Global Customer Dashboard slide out drawer panel */}
      <CustomerDrawer
        isOpen={customerDrawerOpen}
        onClose={() => setCustomerDrawerOpen(false)}
        customers={customers}
        loggedInCustomer={loggedInCustomer}
        onLogin={handleCustomerLogin}
        onLogout={handleCustomerLogout}
        onUpdateWishlist={handleUpdateWishlistAction}
        onAddToCart={handleAddToCart}
        allProducts={products}
        orders={orders}
        onAddAddress={handleAddAddress}
        onRemoveAddress={handleRemoveAddress}
        onOpenCart={() => setCartOpen(true)}
        initialTab={customerDrawerTab}
        onNavigateToPortal={() => {
          setCustomerDrawerOpen(false);
          navigateToTab('frontend-account');
        }}
      />

      {/* Checkout Successful Modal */}
      {checkoutSuccessful && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border rounded-2xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl relative">
            
            <div className="h-14 w-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl font-bold animate-bounce mt-2">
              <Check className="h-8 w-8" />
            </div>

            <h2 className="text-xl font-black text-slate-850">Checkout Successful!</h2>
            <p className="text-xs text-slate-400">Order ID: <span className="font-mono font-bold text-slate-800">{checkoutSuccessful.id}</span></p>
            
            <div className="bg-slate-50 border p-4 rounded-xl text-left space-y-1 text-xs">
              <div className="flex justify-between font-bold text-slate-700">
                <span>Shipping Method</span>
                <span>Tracked courier courier</span>
              </div>
              <div className="flex justify-between font-bold text-slate-705 pt-2 border-t mt-2">
                <span>Charged Amount</span>
                <span className="text-emerald-700">£{checkoutSuccessful.amount.toFixed(2)}</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-400">Your mock order was registered within our active database. Toggle to the **Admin Portal** to fulfill this order and check revenue updates!</p>

            <button
              onClick={() => {
                setCheckoutSuccessful(null);
                navigateToTab('frontend-account');
              }}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-3 rounded-lg cursor-pointer transition-colors"
            >
              Check My Orders History
            </button>
          </div>
        </div>
      )}

      {/* Unsaved Changes Confirmation Modal */}
      {showUnsavedModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl relative">
            <div className="h-12 w-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto text-xl font-bold animate-pulse mt-2">
              <AlertTriangle className="h-6 w-6" />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-900">You have unsaved changes.</h3>
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                You modified content, settings, layout or sections inside the current session. Your updates will be lost if you leave without saving.
              </p>
            </div>

            <div className="space-y-2 pt-2 text-xs">
              <button
                onClick={() => {
                  setAdminActionTrigger({ action: 'save', timestamp: Date.now() });
                }}
                className="w-full bg-[#008060] hover:bg-[#006e52] text-white font-black py-2.5 rounded-xl uppercase tracking-widest transition cursor-pointer flex items-center justify-center gap-2 shadow-xs"
              >
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </button>

              <button
                onClick={() => {
                  setAdminActionTrigger({ action: 'discard', timestamp: Date.now() });
                }}
                className="w-full bg-red-50 text-red-700 hover:bg-red-100 font-extrabold py-2.5 rounded-xl uppercase tracking-widest transition cursor-pointer border border-red-150"
              >
                Discard Changes
              </button>

              <button
                onClick={() => {
                  setShowUnsavedModal(false);
                  setPendingNavAction(null);
                }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-650 font-bold py-2 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Universal Footer layout */}
      {!isAdminActive && <Footer onNavigate={navigateToTab} />}

      {/* Floating Order Withdrawal Button (Bottom Left) */}
      {!isAdminActive && (
        <div className="fixed bottom-6 left-6 z-40 select-none">
          <button
            onClick={() => setIsWithdrawalOpen(true)}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white border border-slate-700/60 p-3 px-4 rounded-full text-xs font-black uppercase tracking-wider shadow-lg hover:shadow-xl active:scale-95 hover:scale-105 transition-all cursor-pointer"
            title="Request Order Withdrawal"
          >
            <Undo className="h-4 w-4" />
            <span>Order Withdrawal</span>
          </button>
        </div>
      )}

      {/* Order Withdrawal Modal popup */}
      <OrderWithdrawalModal
        isOpen={isWithdrawalOpen}
        onClose={() => setIsWithdrawalOpen(false)}
        orders={orders}
        onConfirmWithdrawal={handleConfirmWithdrawal}
      />

      {/* Interactive Simulated Email Dispatch Toast */}
      <AnimatePresence>
        {emailToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-900 text-white border border-slate-700/80 p-4 rounded-2xl shadow-2xl flex gap-3.5 items-start font-sans"
          >
            <div className="p-2.5 bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 rounded-xl shrink-0 mt-0.5 animate-pulse">
              <Mail className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="flex justify-between items-start">
                <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400">Sandbox Mail Dispatched</span>
                <button 
                  onClick={() => setEmailToast(null)}
                  className="p-0.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <h4 className="font-extrabold text-xs text-white mt-1">Order Withdrawal Confirmation</h4>
              <p className="text-[10.5px] text-slate-300 leading-normal mt-1">
                A sandbox email for refund value <strong>£{emailToast.refund.toFixed(2)}</strong> has been sent to <strong>{emailToast.to}</strong>!
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => {
                    setEmailToast(null);
                    setCustomerDrawerTab('emails');
                    setCustomerDrawerOpen(true);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-[8.5px] tracking-wider py-1.5 px-3 rounded-lg transition-colors cursor-pointer"
                >
                  Open Inbox 📬
                </button>
                <button
                  onClick={() => setEmailToast(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold uppercase text-[8.5px] tracking-wider py-1.5 px-3 rounded-lg transition-colors cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
