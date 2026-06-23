import React, { useState, useEffect } from 'react';
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
import PageRenderer from './components/PageRenderer';
import PrivacyPolicy from './components/PrivacyPolicy';
import ShippingPolicy from './components/ShippingPolicy';
import RefundPolicy from './components/RefundPolicy';
import TermsConditions from './components/TermsConditions';
import ProductDetailView from './components/ProductDetailView';
import CollectionDetailView from './components/CollectionDetailView';
import { 
  Sparkles, ShieldCheck, Truck, RefreshCw, Star, ArrowRight, Package, ShoppingCart, Check, Heart, User, CheckCircle2, Save, AlertTriangle, Search
} from 'lucide-react';

export default function App() {
  // --- Persistent Storage State Initialization ---
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('ps_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [collections, setCollections] = useState<Collection[]>(() => {
    const saved = localStorage.getItem('ps_collections');
    return saved ? JSON.parse(saved) : INITIAL_COLLECTIONS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('ps_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [files, setFiles] = useState<FileEntry[]>(() => {
    const saved = localStorage.getItem('ps_files');
    return saved ? JSON.parse(saved) : INITIAL_FILES;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('ps_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [discounts, setDiscounts] = useState<Discount[]>(() => {
    const saved = localStorage.getItem('ps_discounts');
    return saved ? JSON.parse(saved) : INITIAL_DISCOUNTS;
  });

  const [blogs, setBlogs] = useState<BlogPost[]>(() => {
    const saved = localStorage.getItem('ps_blogs');
    return saved ? JSON.parse(saved) : INITIAL_BLOGS;
  });

  const [selectedBlogSlug, setSelectedBlogSlug] = useState<string | null>(null);
  const [frontendBlogQuery, setFrontendBlogQuery] = useState('');
  const [selectedFrontCategory, setSelectedFrontCategory] = useState('All');

  const [customPages, setCustomPages] = useState<CustomPage[]>(() => {
    const saved = localStorage.getItem('ps_custom_pages');
    const loaded = saved ? JSON.parse(saved) : DEFAULT_PAGES;
    // Guaranteed presence check for Homepage in Pages list
    if (!loaded.some((p: any) => p.isHomepage)) {
      const defaultHome = DEFAULT_PAGES.find((p: any) => p.isHomepage);
      if (defaultHome) {
        return [defaultHome, ...loaded];
      }
    }
    return loaded;
  });

  // Shopping Cart & User session statuses
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('ps_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [loggedInCustomer, setLoggedInCustomer] = useState<Customer | null>(() => {
    const saved = localStorage.getItem('ps_logged_in_customer');
    return saved ? JSON.parse(saved) : (INITIAL_CUSTOMERS[3] || null); // Keep Kayla Canty logged in
  });

  const [isInitialLoadDone, setIsInitialLoadDone] = useState(false);

  // Load all central database arrays on mount
  useEffect(() => {
    // Clear old static mock-data from your browser storage if it is cached
    const savedProds = localStorage.getItem('ps_products');
    if (savedProds && savedProds.includes('77-black-tea')) {
      console.log("[Migration] Wiping old cached static mockup products for a clean database slate...");
      localStorage.removeItem('ps_products');
      localStorage.removeItem('ps_collections');
      localStorage.removeItem('ps_orders');
      localStorage.removeItem('ps_files');
      localStorage.removeItem('ps_customers');
      localStorage.removeItem('ps_discounts');
      localStorage.removeItem('ps_blogs');
      localStorage.removeItem('ps_custom_pages');
      localStorage.removeItem('ps_logged_in_customer');
      window.location.reload();
      return;
    }

    async function loadDataFromDb() {
      try {
        console.log("[State Loader] Fetching store data from MongoDB Atlas database...");
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

        console.log("[State Loader] Store data updated from MongoDB.");
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
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [customerDrawerOpen, setCustomerDrawerOpen] = useState<boolean>(false);
  const [customerDrawerTab, setCustomerDrawerTab] = useState<'orders' | 'addresses' | 'wishlist'>('orders');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

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

    if (window.location.pathname !== url) {
      window.history.pushState({}, '', url);
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
      if (isAdminActive) {
        // If we are currently in admin mode, do NOT let collection/product
        // updates trigger frontend tab changes or deactivate admin mode!
        return;
      }
      const path = window.location.pathname;
      if (path === '/' || path === '') {
        setCurrentTab('frontend-home');
        setIsAdminActive(false);
      } else if (path === '/blogs' || path === '/blogs/') {
        setCurrentTab('blogs');
        setIsAdminActive(false);
      } else if (path.startsWith('/blogs/')) {
        const slug = path.replace('/blogs/', '');
        setSelectedBlogSlug(slug);
        setCurrentTab('blog-detail');
        setIsAdminActive(false);
      } else if (path.startsWith('/pages/')) {
        const slug = path.replace('/pages/', '');
        setCurrentTab(slug);
        setIsAdminActive(false);
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
        setIsAdminActive(false);
      } else if (path.startsWith('/products/')) {
        const prodId = path.replace('/products/', '');
        setSelectedProductId(decodeURIComponent(prodId));
        setCurrentTab('product-detail');
        setIsAdminActive(false);
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, [collections, isAdminActive]);

  // --- Write to LocalStorage AND MongoDB Database on Changes ---
  useEffect(() => {
    localStorage.setItem('ps_products', JSON.stringify(products));
    if (isInitialLoadDone) {
      fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(products)
      }).catch(err => console.error("Error syncing products to DB:", err));
    }
  }, [products, isInitialLoadDone]);

  useEffect(() => {
    localStorage.setItem('ps_collections', JSON.stringify(collections));
    if (isInitialLoadDone) {
      fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(collections)
      }).catch(err => console.error("Error syncing collections to DB:", err));
    }
  }, [collections, isInitialLoadDone]);

  useEffect(() => {
    localStorage.setItem('ps_orders', JSON.stringify(orders));
    if (isInitialLoadDone) {
      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orders)
      }).catch(err => console.error("Error syncing orders to DB:", err));
    }
  }, [orders, isInitialLoadDone]);

  useEffect(() => {
    localStorage.setItem('ps_files', JSON.stringify(files));
    if (isInitialLoadDone) {
      fetch('/api/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(files)
      }).catch(err => console.error("Error syncing files to DB:", err));
    }
  }, [files, isInitialLoadDone]);

  useEffect(() => {
    localStorage.setItem('ps_customers', JSON.stringify(customers));
    if (isInitialLoadDone) {
      fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customers)
      }).catch(err => console.error("Error syncing customers to DB:", err));
    }
  }, [customers, isInitialLoadDone]);

  useEffect(() => {
    localStorage.setItem('ps_discounts', JSON.stringify(discounts));
    if (isInitialLoadDone) {
      fetch('/api/discounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(discounts)
      }).catch(err => console.error("Error syncing discounts to DB:", err));
    }
  }, [discounts, isInitialLoadDone]);

  useEffect(() => {
    localStorage.setItem('ps_custom_pages', JSON.stringify(customPages));
    if (isInitialLoadDone) {
      fetch('/api/custompages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customPages)
      }).catch(err => console.error("Error syncing custom pages to DB:", err));
    }
  }, [customPages, isInitialLoadDone]);

  useEffect(() => {
    localStorage.setItem('ps_blogs', JSON.stringify(blogs));
    if (isInitialLoadDone) {
      fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blogs)
      }).catch(err => console.error("Error syncing blogs to DB:", err));
    }
  }, [blogs, isInitialLoadDone]);

  useEffect(() => {
    localStorage.setItem('ps_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('ps_logged_in_customer', JSON.stringify(loggedInCustomer));
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
    const listSummary = items.map(i => `${i.product.vendor} ${i.product.title.split(' ')[1]} (Qty:${i.quantity})`).join(', ');
    const desc = `${packName} [${frequency}] - (${listSummary})`;

    setCartItems(prev => [
      ...prev,
      {
        productId: `sub-pack-${Date.now()}`,
        productTitle: desc,
        price: flatPrice,
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=500&q=80',
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
    const orderId = `CT${Math.floor(Math.random() * 90000 + 10000)}`;
    const lineItems = cartItems.map(item => ({
      productId: item.productId,
      productTitle: item.productTitle,
      price: item.price,
      quantity: item.quantity
    }));

    // Construct order
    const newOrder: Order = {
      id: orderId,
      customerName: loggedInCustomer ? loggedInCustomer.name : 'Guest User Checkout',
      customerEmail: loggedInCustomer ? loggedInCustomer.email : 'guest@pouch-supply.com',
      tags: discountApplied ? ['coupon', discountApplied.title] : [],
      fulfillmentStatus: 'Unfulfilled',
      total: finalTotal,
      destination: loggedInCustomer && loggedInCustomer.addresses[0] ? loggedInCustomer.addresses[0] : 'United Kingdom',
      date: 'Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      deliveryMethod: 'Priority Courier Shipping over £40 | Tracked',
      items: lineItems
    };

    setOrders(prev => [newOrder, ...prev]);

    // Handle coupon used increase
    if (discountApplied) {
      setDiscounts(prev => prev.map(d => d.id === discountApplied.id ? { ...d, used: d.used + 1 } : d));
    }

    // Handle spent stats inside customers profile
    if (loggedInCustomer) {
      setLoggedInCustomer(prev => {
        if (!prev) return null;
        return {
          ...prev,
          ordersCount: prev.ordersCount + 1,
          amountSpent: prev.amountSpent + finalTotal
        };
      });
    }

    setCartItems([]);
    setCartOpen(false);
    setCheckoutSuccessful({ id: orderId, amount: finalTotal });
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
          />
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
                      src="https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80"
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
      <Footer onNavigate={navigateToTab} />

    </div>
  );
}
