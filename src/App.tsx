import React, { useState, useEffect } from 'react';
import { 
  Product, Collection, Order, FileEntry, Customer, Discount, CustomPage, CartItem 
} from './types';
import { 
  INITIAL_PRODUCTS, INITIAL_COLLECTIONS, INITIAL_ORDERS, INITIAL_FILES, INITIAL_CUSTOMERS, INITIAL_DISCOUNTS, DEFAULT_PAGES 
} from './initialData';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductsGrid from './components/ProductsGrid';
import SubscriptionBuilder from './components/SubscriptionBuilder';
import BrandList from './components/BrandList';
import CustomerAccount from './components/CustomerAccount';
import CartDrawer from './components/CartDrawer';
import AdminDashboard from './components/AdminDashboard';
import { 
  Sparkles, ShieldCheck, Truck, RefreshCw, Star, ArrowRight, Package, ShoppingCart, Check, Heart, User, CheckCircle2 
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

  const [customPages, setCustomPages] = useState<CustomPage[]>(() => {
    const saved = localStorage.getItem('ps_custom_pages');
    return saved ? JSON.parse(saved) : DEFAULT_PAGES;
  });

  // Shopping Cart & User session statuses
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('ps_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [loggedInCustomer, setLoggedInCustomer] = useState<Customer | null>(() => {
    const saved = localStorage.getItem('ps_logged_in_customer');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS[3]; // Pre-login with Demo Customer "Kayla Canty" for immediate full capability!
  });

  // App Routing Navigation
  const [currentTab, setCurrentTab] = useState<string>('frontend-home');
  const [activeCollectionId, setActiveCollectionId] = useState<string>('all');
  const [isAdminActive, setIsAdminActive] = useState<boolean>(false);
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  
  // Checkout Successful Indicator modal
  const [checkoutSuccessful, setCheckoutSuccessful] = useState<{ id: string; amount: number } | null>(null);

  // --- Write to LocalStorage on Changes ---
  useEffect(() => {
    localStorage.setItem('ps_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('ps_collections', JSON.stringify(collections));
  }, [collections]);

  useEffect(() => {
    localStorage.setItem('ps_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('ps_files', JSON.stringify(files));
  }, [files]);

  useEffect(() => {
    localStorage.setItem('ps_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('ps_discounts', JSON.stringify(discounts));
  }, [discounts]);

  useEffect(() => {
    localStorage.setItem('ps_custom_pages', JSON.stringify(customPages));
  }, [customPages]);

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

  return (
    <div className="min-h-screen bg-[#f6f6f7] text-slate-800 flex flex-col font-sans">
      
      {/* Universal header layout */}
      <Header
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          setIsAdminActive(false);
        }}
        loggedInCustomer={loggedInCustomer}
        cartItems={cartItems}
        onOpenCart={() => setCartOpen(true)}
        onOpenAdmin={() => setIsAdminActive(!isAdminActive)}
        isAdminActive={isAdminActive}
      />

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
          />
        ) : (
          
          /* VIEW 2: FRONTEND VIEW NAVIGATION */
          <>
            {/* FRONTEND VIEW - HOME */}
            {currentTab === 'frontend-home' && (
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
                          onClick={() => setCurrentTab('frontend-shop')}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 px-8 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                        >
                          Shop Now (All Brands) <ArrowRight className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setCurrentTab('frontend-subscribe')}
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
                          setCurrentTab('frontend-brands');
                          setIsAdminActive(false);
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
                      onClick={() => setCurrentTab('frontend-subscribe')}
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
                      onClick={() => setCurrentTab('frontend-shop')}
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
                          setCurrentTab('frontend-shop');
                          setIsAdminActive(false);
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
            )}

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
                onOpenLoginModal={() => setCurrentTab('frontend-account')}
              />
            )}

            {/* FRONTEND VIEW - BRANDS DIRECTORY */}
            {currentTab === 'frontend-brands' && (
              <BrandList
                collections={collections}
                onBrandClick={(colId) => {
                  setActiveCollectionId(colId);
                  setCurrentTab('frontend-shop');
                }}
              />
            )}

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

            <p className="text-[10px] text-slate-400">Your mock order was registered within our active database. Toggle to the **Shopify Admin** portal to fulfill this order and check revenue updates!</p>

            <button
              onClick={() => {
                setCheckoutSuccessful(null);
                setCurrentTab('frontend-account');
              }}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-3 rounded-lg cursor-pointer transition-colors"
            >
              Check My Orders History
            </button>
          </div>
        </div>
      )}

      {/* Universal Footer layout */}
      <Footer />

    </div>
  );
}
