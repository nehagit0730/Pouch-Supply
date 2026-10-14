import React, { useState, useEffect, useMemo } from 'react';
import { Customer, Product, Order, Discount } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, LogIn, Heart, PlusCircle, Plus, Trash2, MapPin, Package, ShoppingBag, 
  Eye, X, Search, Truck, Check, Clock, Calendar, RefreshCw, Award, 
  Copy, Share2, HelpCircle, ShieldAlert, CreditCard, Star, ChevronRight, 
  CheckCircle2, AlertTriangle, ChevronDown, CheckCircle, Tag, LifeBuoy,
  Layout, LogOut, ArrowRight, Sparkles, Send, Phone, MessageSquare,
  Lock, ExternalLink, ShieldCheck, Download, SlidersHorizontal, ArrowUpRight,
  Info, Bell, Scissors, Compass, Shield
} from 'lucide-react';
import { formatPrice } from '../utils/currency';

export interface CustomerAccountProps {
  customers: Customer[];
  loggedInCustomer: Customer | null;
  onLogin: (customer: Customer) => void;
  onLogout: () => void;
  onUpdateWishlist: (productId: string, action: 'add' | 'remove') => void;
  allProducts: Product[];
  orders: Order[];
  onAddAddress: (address: string) => void;
  onRemoveAddress: (index: number) => void;
  onUpdateProfile?: (customer: Customer) => void;
  onUpdateOrder?: (order: Order) => void;
  discounts?: Discount[];
  initialSubTab?: string;
  onNavigateToTab?: (tab: string) => void;
}

export type AccountTabId = 
  | 'dashboard'
  | 'orders'
  | 'loyalty-rewards'
  | 'referrals'
  | 'payment-methods'
  | 'account-details'
  | 'delivery-addresses'
  | 'help';

interface SidebarNavItem {
  id: AccountTabId;
  slug: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  tag?: string;
  desc: string;
}

const SIDEBAR_NAV_ITEMS: SidebarNavItem[] = [
  { 
    id: 'dashboard', 
    slug: 'dashboard', 
    label: 'Dashboard', 
    icon: Layout, 
    desc: 'Atelier overview & active tailoring' 
  },
  { 
    id: 'orders', 
    slug: 'orders', 
    label: 'Orders', 
    icon: Package, 
    desc: 'Order history & live shipment track' 
  },
  { 
    id: 'loyalty-rewards', 
    slug: 'loyalty-rewards', 
    label: 'Loyalty Rewards', 
    icon: Award, 
    tag: 'VIP Tier',
    desc: 'Privilege tiers & boutique credits' 
  },
  { 
    id: 'referrals', 
    slug: 'referrals', 
    label: 'Referrals', 
    icon: Share2, 
    desc: 'Invite friends & receive store credit' 
  },
  { 
    id: 'payment-methods', 
    slug: 'payment-methods', 
    label: 'Payment Methods', 
    icon: CreditCard, 
    desc: 'Saved cards & billing preferences' 
  },
  { 
    id: 'account-details', 
    slug: 'account-details', 
    label: 'Account Details', 
    icon: User, 
    desc: 'Personal information & style sizing' 
  },
  { 
    id: 'delivery-addresses', 
    slug: 'delivery-addresses', 
    label: 'Delivery Addresses', 
    icon: MapPin, 
    desc: 'Shipping locations & default destination' 
  },
  { 
    id: 'help', 
    slug: 'help', 
    label: 'Help & Support', 
    icon: LifeBuoy, 
    desc: 'Stylist concierge & care assistance' 
  }
];

// Helper to deduce active tab from URL path
function getTabFromPathname(): AccountTabId {
  if (typeof window === 'undefined') return 'dashboard';
  const path = window.location.pathname.toLowerCase();
  if (path.includes('/pages/account/orders')) return 'orders';
  if (path.includes('/pages/account/loyalty-rewards') || path.includes('/pages/account/loyalty')) return 'loyalty-rewards';
  if (path.includes('/pages/account/referrals')) return 'referrals';
  if (path.includes('/pages/account/payment-methods') || path.includes('/pages/account/payments')) return 'payment-methods';
  if (path.includes('/pages/account/account-details') || path.includes('/pages/account/details')) return 'account-details';
  if (path.includes('/pages/account/delivery-addresses') || path.includes('/pages/account/addresses')) return 'delivery-addresses';
  if (path.includes('/pages/account/help') || path.includes('/pages/account/support')) return 'help';
  if (path.includes('/pages/account/dashboard') || path === '/pages/account' || path === '/pages/account/') return 'dashboard';
  return 'dashboard';
}

function isValidAccountTab(val: string): val is AccountTabId {
  return SIDEBAR_NAV_ITEMS.some(item => item.id === val || item.slug === val);
}

export default function CustomerAccount({
  customers,
  loggedInCustomer,
  onLogin,
  onLogout,
  onUpdateWishlist,
  allProducts,
  orders,
  onAddAddress,
  onRemoveAddress,
  onUpdateProfile,
  onUpdateOrder,
  discounts = [],
  initialSubTab,
  onNavigateToTab
}: CustomerAccountProps) {
  // Navigation active tab with synchronized URL path
  const [activeTab, setActiveTab] = useState<AccountTabId>(() => {
    if (initialSubTab && isValidAccountTab(initialSubTab)) {
      return initialSubTab as AccountTabId;
    }
    return getTabFromPathname();
  });

  // Sync when initialSubTab prop changes
  useEffect(() => {
    if (initialSubTab && isValidAccountTab(initialSubTab)) {
      setActiveTab(initialSubTab as AccountTabId);
    }
  }, [initialSubTab]);

  // Listen for browser popstate (back/forward)
  useEffect(() => {
    const handlePopState = () => {
      setActiveTab(getTabFromPathname());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update browser URL seamlessly when tab changes
  const handleSelectTab = (tabId: AccountTabId) => {
    setActiveTab(tabId);
    const item = SIDEBAR_NAV_ITEMS.find(n => n.id === tabId);
    const targetSlug = item ? item.slug : tabId;
    const targetUrl = `/pages/account/${targetSlug}`;
    try {
      if (typeof window !== 'undefined' && window.location.pathname !== targetUrl) {
        window.history.pushState({}, '', targetUrl);
      }
    } catch (e) {
      console.warn('[CustomerAccount] pushState restricted:', e);
    }
    if (onNavigateToTab) {
      onNavigateToTab(`account/${targetSlug}`);
    }
  };

  // Sync initial URL if on /pages/account or /pages/account/
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname;
      if (p === '/pages/account' || p === '/pages/account/') {
        try {
          window.history.replaceState({}, '', '/pages/account/dashboard');
        } catch (_) {}
      }
    }
  }, []);

  // Local synchronized state for logged-in customer profile
  const [custState, setCustState] = useState<Customer | null>(loggedInCustomer);
  useEffect(() => {
    setCustState(loggedInCustomer);
  }, [loggedInCustomer]);

  // Auth form states (for unauthenticated guests)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [referredByCodeInput, setReferredByCodeInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Address modal form states
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addrStreet, setAddrStreet] = useState('');
  const [addrApt, setAddrApt] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('');
  const [addrZip, setAddrZip] = useState('');
  const [addrCountry, setAddrCountry] = useState('United Kingdom');
  const [addressToast, setAddressToast] = useState<string | null>(null);

  // Order Details modal
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'unfulfilled' | 'shipped' | 'delivered'>('all');

  // Guest & Live Tracker state
  const [trackerInput, setTrackerInput] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [trackerError, setTrackerError] = useState('');

  // Profile Edit states
  const [editName, setEditName] = useState(loggedInCustomer?.name || '');
  const [editEmail, setEditEmail] = useState(loggedInCustomer?.email || '');
  const [editPhone, setEditPhone] = useState(loggedInCustomer?.phone || '+44 20 7946 0921');
  const [editStyleFit, setEditStyleFit] = useState('Bespoke Slim');
  const [editSuitSize, setEditSuitSize] = useState('40R (Regular)');
  const [editTrouserWaist, setEditTrouserWaist] = useState('32 Waist · 32 Inseam');
  const [editFavFabric, setEditFavFabric] = useState('Super 160s Virgin Wool & Cashmere');
  const [profileSuccessToast, setProfileSuccessToast] = useState(false);

  // Payment methods local states
  const [savedCards, setSavedCards] = useState<Array<{
    id: string;
    brand: string;
    last4: string;
    holder: string;
    exp: string;
    isDefault: boolean;
    cardType: string;
  }>>(() => {
    try {
      const stored = localStorage.getItem('ps_saved_cards');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [];
  });

  const handleRemoveCard = (cardId: string) => {
    setSavedCards(prev => {
      const updated = prev.filter(c => c.id !== cardId);
      try {
        localStorage.setItem('ps_saved_cards', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [newCardHolder, setNewCardHolder] = useState('');
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardExp, setNewCardExp] = useState('');
  const [newCardCvv, setNewCardCvv] = useState('');

  // Concierge Help Form
  const [conciergeMsg, setConciergeMsg] = useState('');
  const [conciergeSubject, setConciergeSubject] = useState('Bespoke Consultation Inquiry');
  const [conciergeSent, setConciergeSent] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);
  const [copiedReferral, setCopiedReferral] = useState(false);

  // Filter customer's own orders
  const myOrders = useMemo(() => {
    if (!loggedInCustomer) return [];
    return orders.filter(
      o => o.customerEmail.toLowerCase().trim() === loggedInCustomer.email.toLowerCase().trim()
    );
  }, [orders, loggedInCustomer]);

  const ordersCount = myOrders.length;

  // Star Progress & Tier Logic
  const getTierInfo = (count: number) => {
    if (count >= 30) {
      return {
        level: 4,
        name: 'Haute Platinum Patron',
        color: 'text-amber-300',
        badgeBg: 'bg-gradient-to-r from-amber-600 to-amber-400 text-slate-950',
        progress: 100,
        nextTier: 'Max Tier Achieved',
        pointsNeeded: 0
      };
    } else if (count >= 15) {
      return {
        level: 3,
        name: 'Haute Gold Member',
        color: 'text-[#C5A880]',
        badgeBg: 'bg-[#C5A880] text-slate-950',
        progress: Math.min(100, Math.round(((count - 15) / 15) * 100)),
        nextTier: 'Haute Platinum Patron',
        pointsNeeded: 30 - count
      };
    } else if (count >= 5) {
      return {
        level: 2,
        name: 'Silver Atelier Client',
        color: 'text-slate-300',
        badgeBg: 'bg-slate-300 text-slate-950',
        progress: Math.min(100, Math.round(((count - 5) / 10) * 100)),
        nextTier: 'Haute Gold Member',
        pointsNeeded: 15 - count
      };
    }
    return {
      level: 1,
      name: 'Bronze Atelier Client',
      color: 'text-[#B58D59]',
      badgeBg: 'bg-[#B58D59] text-white',
      progress: Math.min(100, Math.round((count / 5) * 100)),
      nextTier: 'Silver Atelier Client',
      pointsNeeded: 5 - count
    };
  };

  const tierInfo = getTierInfo(ordersCount);

  // Sync edit profile form when customer changes
  useEffect(() => {
    if (loggedInCustomer) {
      setEditName(loggedInCustomer.name);
      setEditEmail(loggedInCustomer.email);
      setEditPhone(loggedInCustomer.phone || '+44 20 7946 0921');
    }
  }, [loggedInCustomer]);

  // Handle Login & Signup
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      if (authMode === 'login') {
        const found = customers.find(
          c => c.email.toLowerCase().trim() === emailInput.toLowerCase().trim()
        );
        if (found) {
          onLogin(found);
        } else {
          // If customer not found, create new customer account on the fly for smooth previewing
          const cleanName = emailInput.split('@')[0].replace(/[._-]/g, ' ');
          const formattedName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
          const newCust: Customer = {
            id: `cust-${Date.now()}`,
            name: formattedName || 'Valued Client',
            email: emailInput,
            amountSpent: 0,
            ordersCount: 0,
            location: 'London, UK',
            subscriptionStatus: 'Subscribed',
            tags: ['Atelier Member'],
            addresses: ['Mayfair Residences, London W1J, United Kingdom'],
            wishlist: [],
            referralCode: `REF-JT-${formattedName.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`
          };
          onLogin(newCust);
        }
      } else {
        // Sign up new account
        const exists = customers.some(
          c => c.email.toLowerCase().trim() === emailInput.toLowerCase().trim()
        );
        if (exists) {
          setErrorMsg('An account with this email address already exists. Please sign in.');
          setIsSubmitting(false);
          return;
        }

        const newCust: Customer = {
          id: `cust-${Date.now()}`,
          name: nameInput.trim() || 'New Client',
          email: emailInput.trim(),
          amountSpent: 0,
          ordersCount: 0,
          location: 'London, UK',
          subscriptionStatus: 'Subscribed',
          tags: ['Private Client'],
          addresses: ['Mayfair Residences, London W1J, United Kingdom'],
          wishlist: [],
          referralCode: `REF-JT-${nameInput.slice(0, 3).toUpperCase() || 'VIP'}-${Math.floor(1000 + Math.random() * 9000)}`
        };
        onLogin(newCust);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Guest order tracking
  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setTrackerError('');
    setTrackedOrder(null);
    const query = trackerInput.trim().toUpperCase();
    if (!query) {
      setTrackerError('Please provide a valid Order ID reference.');
      return;
    }
    const matched = orders.find(o => o.id.toUpperCase() === query || o.id.includes(query));
    if (matched) {
      setTrackedOrder(matched);
    } else {
      setTrackerError(`No atelier commission found matching "${trackerInput}". Please check the ID on your invoice.`);
    }
  };

  // Handle Profile Update Save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loggedInCustomer) return;
    const updated: Customer = {
      ...loggedInCustomer,
      name: editName,
      email: editEmail,
      phone: editPhone
    };
    setCustState(updated);
    onUpdateProfile?.(updated);
    setProfileSuccessToast(true);
    setTimeout(() => setProfileSuccessToast(false), 3000);
  };

  // Handle Adding Address
  const handleAddAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrStreet || !addrCity) return;
    const formatted = `${addrStreet}${addrApt ? `, ${addrApt}` : ''}, ${addrCity}, ${addrState} ${addrZip}, ${addrCountry}`;
    onAddAddress(formatted);
    setShowAddressModal(false);
    setAddrStreet('');
    setAddrApt('');
    setAddrCity('');
    setAddrState('');
    setAddrZip('');
    setAddressToast('Delivery residence added to your atelier profile.');
    setTimeout(() => setAddressToast(null), 3000);
  };

  // Handle Adding New Payment Card
  const handleAddCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardNumber || !newCardHolder) return;
    const last4 = newCardNumber.replace(/\s+/g, '').slice(-4) || '9981';
    const brand = newCardNumber.startsWith('4') ? 'VISA' : newCardNumber.startsWith('5') ? 'MASTERCARD' : 'AMEX';
    const newCard = {
      id: `card-${Date.now()}`,
      brand,
      last4,
      holder: newCardHolder.toUpperCase(),
      exp: newCardExp || '12/28',
      isDefault: savedCards.length === 0,
      cardType: 'Atelier Preferred'
    };
    setSavedCards(prev => {
      const updated = [...prev, newCard];
      try {
        localStorage.setItem('ps_saved_cards', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    setShowAddCardModal(false);
    setNewCardHolder('');
    setNewCardNumber('');
    setNewCardExp('');
    setNewCardCvv('');
  };

  // Filtered orders for the orders tab
  const filteredOrders = useMemo(() => {
    let result = myOrders;
    if (orderSearchQuery.trim()) {
      const q = orderSearchQuery.toLowerCase();
      result = result.filter(o => 
        o.id.toLowerCase().includes(q) ||
        o.items.some(i => i.productTitle.toLowerCase().includes(q))
      );
    }
    if (orderStatusFilter === 'delivered') {
      result = result.filter(o => o.fulfillmentStatus === 'Delivered');
    } else if (orderStatusFilter === 'shipped') {
      result = result.filter(o => o.fulfillmentStatus === 'Fulfilled');
    } else if (orderStatusFilter === 'unfulfilled') {
      result = result.filter(o => o.fulfillmentStatus === 'Unfulfilled');
    }
    return result;
  }, [myOrders, orderSearchQuery, orderStatusFilter]);

  // =========================================================================
  // VIEW A: GUEST & UNREGISTERED CLIENT EXPERIENCE
  // =========================================================================
  if (!custState) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-slate-900 font-sans py-12 px-4 sm:px-6 lg:px-8 selection:bg-[#C5A880] selection:text-white">
        <div className="max-w-5xl mx-auto space-y-10">
          
          {/* Header Monogram & Title */}
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#141416] to-[#25252A] border border-[#C5A880]/30 mx-auto flex items-center justify-center font-serif text-2xl font-bold text-[#C5A880] shadow-md">
              JT
            </div>
            <span className="text-[10px] uppercase font-bold tracking-[0.24em] text-[#8C6B3E] block">
              Jade Tailor Atelier · Private Client Suite
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-slate-950 tracking-tight">
              Bespoke Client Sign In
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
              Sign in to manage bespoke commissions, schedule fittings, view tailoring progress, and access exclusive loyalty tiers.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 7 Cols: Auth Card */}
            <div className="lg:col-span-7 bg-white border border-[#E6E0D6] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              
              {/* Mode Toggle */}
              <div className="flex border-b border-[#E6E0D6] pb-3 justify-between items-center">
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => { setAuthMode('login'); setErrorMsg(''); }}
                    className={`text-xs font-bold uppercase tracking-wider pb-1 transition-colors cursor-pointer relative ${
                      authMode === 'login' ? 'text-slate-950' : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    Client Sign In
                    {authMode === 'login' && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C5A880]" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAuthMode('signup'); setErrorMsg(''); }}
                    className={`text-xs font-bold uppercase tracking-wider pb-1 transition-colors cursor-pointer relative ${
                      authMode === 'signup' ? 'text-slate-950' : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    Register Suite
                    {authMode === 'signup' && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C5A880]" />
                    )}
                  </button>
                </div>
                <span className="text-[9px] uppercase font-bold tracking-widest text-[#8C6B3E] bg-[#FAF8F5] px-2.5 py-1 rounded-full border border-[#E6E0D6] hidden sm:inline-block">
                  256-Bit Encrypted
                </span>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {authMode === 'signup' && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Full Legal Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Valentina Gomez"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="w-full text-xs font-medium bg-[#FAF8F5] border border-[#DCD5C9] text-slate-900 p-3.5 rounded-xl focus:border-[#C5A880] focus:outline-none transition-colors"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="client@luxury.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full text-xs font-medium bg-[#FAF8F5] border border-[#DCD5C9] text-slate-900 p-3.5 rounded-xl focus:border-[#C5A880] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full text-xs font-medium bg-[#FAF8F5] border border-[#DCD5C9] text-slate-900 p-3.5 rounded-xl focus:border-[#C5A880] focus:outline-none transition-colors"
                  />
                </div>

                {authMode === 'signup' && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      VIP Invitation Code (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. REF-JT-VIP-8840"
                      value={referredByCodeInput}
                      onChange={(e) => setReferredByCodeInput(e.target.value)}
                      className="w-full text-xs font-mono uppercase bg-[#FAF8F5] border border-[#DCD5C9] text-slate-900 p-3.5 rounded-xl focus:border-[#C5A880] focus:outline-none"
                    />
                  </div>
                )}

                {errorMsg && (
                  <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 p-3 rounded-xl font-medium">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#141416] hover:bg-[#25252A] disabled:bg-slate-400 text-white font-bold text-xs uppercase tracking-[0.18em] py-4 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <RefreshCw className="h-4 w-4 animate-spin text-[#C5A880]" />
                  ) : (
                    <Lock className="h-4 w-4 text-[#C5A880]" />
                  )}
                  <span>{authMode === 'login' ? 'Unlock Private Suite' : 'Create Client Account'}</span>
                </button>
              </form>

            </div>

            {/* Right 5 Cols: Guest Order Shipment Tracker */}
            <div className="lg:col-span-5 bg-white border border-[#E6E0D6] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E2DBD0] flex items-center justify-center text-[#8C6B3E]">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-normal text-slate-950">Guest Order Lookup</h3>
                  <p className="text-[11px] text-slate-500">Track shipment status without logging in</p>
                </div>
              </div>

              <form onSubmit={handleTrackOrder} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Order Reference ID
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. PS48884"
                      value={trackerInput}
                      onChange={(e) => setTrackerInput(e.target.value)}
                      className="w-full text-xs font-mono font-bold bg-[#FAF8F5] border border-[#DCD5C9] text-slate-900 p-3.5 pr-10 rounded-xl focus:border-[#C5A880] focus:outline-none uppercase"
                    />
                    <Search className="absolute right-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  </div>
                </div>

                {trackerError && (
                  <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 p-2.5 rounded-xl">
                    {trackerError}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#141416] hover:bg-[#25252A] text-white font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Search className="h-3.5 w-3.5 text-[#C5A880]" />
                  <span>Inspect Shipment Status</span>
                </button>
              </form>

              {trackedOrder && (
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E2DBD0] space-y-2.5 animate-in fade-in">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono font-bold text-slate-950">{trackedOrder.id}</span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {trackedOrder.fulfillmentStatus}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700">
                    Recipient: <strong>{trackedOrder.customerName}</strong>
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Courier: <strong>{trackedOrder.carrier || 'White-Glove Atelier Courier'}</strong>
                  </p>
                  <div className="pt-2 border-t border-[#E6E0D6] text-xs text-slate-600 flex justify-between">
                    <span>Total: {formatPrice(trackedOrder.total)}</span>
                    <span className="text-[#8C6B3E] font-medium">Status: Active Transit</span>
                  </div>
                </div>
              )}

              {/* Assurances Box */}
              <div className="pt-4 border-t border-[#E6E0D6] space-y-2 text-xs text-slate-500">
                <div className="flex items-center gap-2 text-slate-800 font-semibold">
                  <ShieldCheck className="h-4 w-4 text-[#8C6B3E]" />
                  <span>Jade Tailor Client Assurances</span>
                </div>
                <p className="leading-relaxed text-[11px]">
                  All bespoke commissions include complimentary post-delivery fitting refinements within 30 days of receipt.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW B: AUTHENTICATED PRIVATE CLIENT SUITE (REDESIGNED LUXURY PORTAL)
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 font-sans selection:bg-[#C5A880] selection:text-white pb-24">
      
      {/* Top Luxury Client Bar */}
      <header className="bg-[#141416] text-white border-b border-[#25252A] py-3.5 px-4 sm:px-8 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          
          {/* Atelier Brand Title & Monogram */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C5A880] to-[#8C6B3E] flex items-center justify-center text-slate-950 font-serif font-black text-xs shadow-sm">
              JT
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-base tracking-wide text-white">
                  Jade Tailor
                </span>
                <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-[#C5A880] border border-[#C5A880]/30 px-1.5 py-0.5 rounded-sm">
                  Private Client Suite
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                Atelier ID: {custState.id} · {tierInfo.name}
              </span>
            </div>
          </div>

          {/* Client Welcome & Quick Header Controls */}
          <div className="flex items-center flex-wrap gap-2.5 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 hidden lg:inline">Private Client:</span>
              <span className="font-semibold text-white flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {custState.name}
              </span>
            </div>

            <div className="h-4 w-px bg-slate-700 hidden sm:block mx-1" />

            <button
              onClick={() => handleSelectTab('orders')}
              className="px-3 py-1.5 rounded-lg bg-[#222226] hover:bg-[#2F2F34] text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-[#2D2D32]"
              title="Track Active Shipment"
            >
              <Truck className="h-3.5 w-3.5 text-[#C5A880]" />
              <span className="hidden sm:inline">Track Orders</span>
            </button>

            <button
              onClick={() => handleSelectTab('help')}
              className="px-3 py-1.5 rounded-lg bg-[#C5A880] hover:bg-[#D5B890] text-slate-950 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Sparkles className="h-3.5 w-3.5 text-slate-950" />
              <span>Concierge</span>
            </button>

            <button
              onClick={onLogout}
              className="px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-rose-800/40"
              title="Sign Out"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Horizontal Navigation Scroller */}
      <div className="lg:hidden bg-white border-b border-[#E6E0D6] px-4 py-2.5 overflow-x-auto scrollbar-none sticky top-14 z-30 shadow-2xs">
        <div className="flex items-center gap-1.5 min-w-max">
          {SIDEBAR_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#141416] text-[#C5A880] shadow-xs'
                    : 'bg-[#F2EDE4] text-slate-700 hover:bg-[#EAE3D6]'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-[#C5A880]' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Suite Scaffold */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ================================================================= */}
          {/* LEFT COLUMN: BESPOKE ATELIER SIDEBAR (EXACT REQUESTED TABS)       */}
          {/* ================================================================= */}
          <aside className="hidden lg:block lg:col-span-4 xl:col-span-3 space-y-5 shrink-0 sticky top-20">
            
            {/* Client Identity Mini Card */}
            <div className="bg-[#141416] text-white p-5 rounded-2xl border border-[#25252A] shadow-sm space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#222226] border border-[#34343A] flex items-center justify-center font-serif text-base font-bold text-[#C5A880] shrink-0">
                  {custState.name.split(' ').map(n => n[0]).join('').slice(0, 2) || 'JT'}
                </div>
                <div className="min-w-0">
                  <h3 className="font-serif text-sm font-normal text-white truncate">
                    {custState.name}
                  </h3>
                  <p className="text-[10.5px] text-slate-400 font-mono truncate">{custState.email}</p>
                </div>
              </div>

              {/* VIP Tier Badge with Star Emblem */}
              <div className="pt-2 border-t border-[#25252A] flex items-center justify-between text-xs">
                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${tierInfo.badgeBg} flex items-center gap-1`}>
                  <Star className="h-2.5 w-2.5 fill-current" />
                  <span>{tierInfo.name}</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {myOrders.length} Commissions
                </span>
              </div>
            </div>

            {/* Sidebar Navigation Items list (Exactly matching user prompt requirements) */}
            <div className="bg-white border border-[#E6E0D6] rounded-2xl p-2.5 shadow-3xs space-y-1">
              <div className="px-3 py-1.5 text-[9.5px] uppercase font-bold tracking-[0.2em] text-slate-400 border-b border-[#F0EAE1]">
                Atelier Client Suite
              </div>

              <nav className="space-y-1 pt-1">
                {SIDEBAR_NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectTab(item.id)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all cursor-pointer group ${
                        isActive
                          ? 'bg-[#141416] text-white shadow-sm font-bold'
                          : 'hover:bg-[#FAF8F5] text-slate-700 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`p-1.5 rounded-lg transition-colors shrink-0 ${
                          isActive
                            ? 'bg-[#222226] text-[#C5A880]'
                            : 'bg-[#F2EDE4] text-slate-500 group-hover:text-slate-900'
                        }`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="truncate">
                          <span className={`block text-xs uppercase tracking-wider truncate ${
                            isActive ? 'text-white' : 'text-slate-900'
                          }`}>
                            {item.label}
                          </span>
                          <span className={`block text-[10px] line-clamp-1 ${
                            isActive ? 'text-slate-400' : 'text-slate-400'
                          }`}>
                            {item.desc}
                          </span>
                        </div>
                      </div>

                      {item.tag && !isActive && (
                        <span className="text-[8.5px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
                          {item.tag}
                        </span>
                      )}

                      {isActive && (
                        <ChevronRight className="h-3.5 w-3.5 text-[#C5A880] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Stylist Concierge Desk Card */}
            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E6E0D6] space-y-2.5 text-xs">
              <div className="flex items-center gap-2 text-[#8C6B3E]">
                <Sparkles className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Personal Stylist Desk
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed font-light">
                Direct styling inquiries on seasonal wardrobe capsules or private fittings are prioritized within 2 hours.
              </p>
              <button
                type="button"
                onClick={() => handleSelectTab('help')}
                className="w-full bg-[#141416] hover:bg-[#25252A] text-white font-bold text-[10.5px] uppercase tracking-wider py-2 rounded-xl transition-colors cursor-pointer text-center block"
              >
                Inquire With Jade Tailor
              </button>
            </div>

          </aside>

          {/* ================================================================= */}
          {/* RIGHT COLUMN: DYNAMIC CLIENT PORTAL PAGES                         */}
          {/* ================================================================= */}
          <main className="lg:col-span-8 xl:col-span-9 space-y-6">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="space-y-6"
              >

                {/* ------------------------------------------------------------- */}
                {/* 1. DASHBOARD (/pages/account/dashboard)                       */}
                {/* ------------------------------------------------------------- */}
                {activeTab === 'dashboard' && (
                  <div className="space-y-6">
                    
                    {/* Welcome Banner Card */}
                    <div className="bg-[#141416] text-white p-7 rounded-3xl border border-[#25252A] shadow-md relative overflow-hidden">
                      <div className="relative z-10 space-y-2">
                        <span className="text-[9.5px] uppercase font-bold tracking-[0.24em] text-[#C5A880] block">
                          Atelier Client Summary
                        </span>
                        <h2 className="font-serif text-2xl sm:text-3xl font-normal text-white">
                          Welcome, {custState.name}
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-light leading-relaxed">
                          Your private styling dashboard provides real-time oversight of garments in tailoring, boutique reward credits, and saved sizing profiles.
                        </p>
                      </div>
                    </div>

                    {/* 4 High-Impact Metric Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      
                      <div className="bg-white p-4 rounded-2xl border border-[#E6E0D6] shadow-3xs space-y-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                          Commissions
                        </span>
                        <div className="text-xl font-serif font-bold text-slate-950">
                          {myOrders.length}
                        </div>
                        <p className="text-[10.5px] text-emerald-700 font-medium">All Lifetime Orders</p>
                      </div>

                      <div className="bg-white p-4 rounded-2xl border border-[#E6E0D6] shadow-3xs space-y-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                          Boutique Credit
                        </span>
                        <div className="text-xl font-serif font-bold text-[#8C6B3E]">
                          {formatPrice(custState.amountSpent ? Math.floor(custState.amountSpent * 0.05) : 0)}
                        </div>
                        <p className="text-[10.5px] text-slate-500 font-medium">Available to apply</p>
                      </div>

                      <div className="bg-white p-4 rounded-2xl border border-[#E6E0D6] shadow-3xs space-y-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                          Sizing Fit
                        </span>
                        <div className="text-xl font-serif font-bold text-slate-950 truncate">
                          {editSuitSize.split(' ')[0]}
                        </div>
                        <p className="text-[10.5px] text-slate-500 font-medium truncate">{editStyleFit}</p>
                      </div>

                      <div className="bg-white p-4 rounded-2xl border border-[#E6E0D6] shadow-3xs space-y-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                          Privilege Tier
                        </span>
                        <div className="text-xl font-serif font-bold text-slate-950 truncate">
                          {tierInfo.name.split(' ')[0]}
                        </div>
                        <p className="text-[10.5px] text-[#8C6B3E] font-medium">{tierInfo.name}</p>
                      </div>

                    </div>

                    {/* Active Order Spotlight */}
                    {myOrders.length > 0 && (
                      <div className="bg-white border border-[#E6E0D6] rounded-3xl p-6 shadow-3xs space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-[#8C6B3E]" />
                            <h3 className="font-serif text-base font-semibold text-slate-950">
                              Latest Tailoring Commission
                            </h3>
                          </div>
                          <button
                            onClick={() => handleSelectTab('orders')}
                            className="text-xs font-bold text-[#8C6B3E] hover:text-slate-950 underline underline-offset-4 cursor-pointer"
                          >
                            View All Orders →
                          </button>
                        </div>

                        {(() => {
                          const latest = myOrders[0];
                          return (
                            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E6E0D6] space-y-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="font-mono font-bold text-xs text-slate-900">{latest.id}</span>
                                  <p className="text-[10.5px] text-slate-500">{latest.date} · {latest.items.length} garments</p>
                                </div>
                                <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                  {latest.fulfillmentStatus}
                                </span>
                              </div>

                              <div className="flex items-center gap-3">
                                {latest.items.slice(0, 3).map((item, idx) => (
                                  <div key={idx} className="flex items-center gap-2 text-xs bg-white p-2 rounded-xl border border-[#E6E0D6]">
                                    <img src={item.image} alt="" className="w-8 h-8 rounded-lg object-contain bg-[#FAF8F5]" />
                                    <span className="font-medium text-slate-900 truncate max-w-[120px]">{item.productTitle}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {/* Quick Access Action Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { label: 'View Orders', sub: 'Shipment tracking', tab: 'orders' as AccountTabId, icon: Package },
                        { label: 'Boutique Rewards', sub: 'VIP tier perks', tab: 'loyalty-rewards' as AccountTabId, icon: Award },
                        { label: 'Payment Cards', sub: 'Billing vault', tab: 'payment-methods' as AccountTabId, icon: CreditCard },
                        { label: 'Delivery Points', sub: 'Saved residences', tab: 'delivery-addresses' as AccountTabId, icon: MapPin },
                      ].map((card, idx) => {
                        const Icon = card.icon;
                        return (
                          <button
                            key={idx}
                            onClick={() => handleSelectTab(card.tab)}
                            className="p-4 rounded-2xl bg-white hover:bg-[#FAF8F5] border border-[#E6E0D6] hover:border-[#C5A880] transition-all text-left cursor-pointer group shadow-3xs"
                          >
                            <Icon className="h-5 w-5 text-[#8C6B3E] mb-2 group-hover:scale-110 transition-transform" />
                            <h4 className="font-serif text-sm font-semibold text-slate-900">{card.label}</h4>
                            <p className="text-[10.5px] text-slate-400 mt-0.5">{card.sub}</p>
                          </button>
                        );
                      })}
                    </div>

                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* 2. ORDERS (/pages/account/orders)                             */}
                {/* ------------------------------------------------------------- */}
                {activeTab === 'orders' && (
                  <div className="space-y-6">
                    
                    {/* Header Bar */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <h2 className="font-serif text-2xl font-normal text-slate-950">
                          Tailoring Commissions & Orders
                        </h2>
                        <p className="text-xs text-slate-500">
                          Live tracking and historical invoices for all bespoke commissions
                        </p>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-600 bg-white border border-[#E6E0D6] px-3 py-1.5 rounded-xl">
                        {myOrders.length} Commissions Recorded
                      </span>
                    </div>

                    {/* Filters & Search */}
                    <div className="bg-white p-3 rounded-2xl border border-[#E6E0D6] shadow-3xs flex flex-col sm:flex-row gap-2 justify-between items-center">
                      <div className="relative w-full sm:w-72">
                        <input
                          type="text"
                          placeholder="Search orders or items..."
                          value={orderSearchQuery}
                          onChange={(e) => setOrderSearchQuery(e.target.value)}
                          className="w-full text-xs bg-[#FAF8F5] border border-[#DCD5C9] pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#C5A880]"
                        />
                        <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                      </div>

                      <div className="flex gap-1 w-full sm:w-auto overflow-x-auto">
                        {[
                          { id: 'all', label: 'All Orders' },
                          { id: 'unfulfilled', label: 'In Tailoring' },
                          { id: 'shipped', label: 'Dispatched' },
                          { id: 'delivered', label: 'Delivered' },
                        ].map((btn) => (
                          <button
                            key={btn.id}
                            onClick={() => setOrderStatusFilter(btn.id as any)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                              orderStatusFilter === btn.id
                                ? 'bg-[#141416] text-white'
                                : 'bg-[#FAF8F5] text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Orders List */}
                    {filteredOrders.length === 0 ? (
                      <div className="bg-white border border-dashed border-[#DCD5C9] rounded-3xl p-12 text-center space-y-3">
                        <Package className="h-10 w-10 text-slate-300 mx-auto" />
                        <h3 className="font-serif text-lg font-semibold text-slate-800">No Orders Found</h3>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                          {orderSearchQuery ? `No commissions matched "${orderSearchQuery}".` : 'You have not placed any bespoke garment orders yet.'}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredOrders.map((order) => (
                          <div 
                            key={order.id} 
                            className="bg-white border border-[#E6E0D6] rounded-3xl p-6 shadow-3xs space-y-4 hover:border-[#C5A880] transition-colors"
                          >
                            {/* Card Header */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#F0EAE1] pb-3">
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-bold text-sm text-slate-950">{order.id}</span>
                                  <span className={`text-[9.5px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                    order.fulfillmentStatus === 'Delivered'
                                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                      : 'bg-amber-50 text-amber-900 border border-amber-200'
                                  }`}>
                                    {order.fulfillmentStatus}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-400 font-mono">Commission Placed: {order.date}</p>
                              </div>

                              <div className="text-right sm:text-right">
                                <span className="font-serif text-base font-bold text-slate-950">
                                  {formatPrice(order.total)}
                                </span>
                                <span className="text-[10px] text-slate-400 block font-mono">Paid via Razorpay</span>
                              </div>
                            </div>

                            {/* Shipment Status Bar */}
                            <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#E6E0D6] space-y-2">
                              <div className="flex justify-between items-center text-xs">
                                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                                  <Truck className="h-3.5 w-3.5 text-[#8C6B3E]" />
                                  <span>Courier: {order.carrier || 'White-Glove Atelier Courier'}</span>
                                </span>
                                <span className="font-mono text-slate-500 text-[11px]">
                                  Destination: {order.destination || 'Mayfair Residence, London'}
                                </span>
                              </div>

                              {/* Multi-step Timeline */}
                              <div className="grid grid-cols-4 gap-2 pt-2">
                                {[
                                  { label: 'Commission Confirmed', done: true },
                                  { label: 'Hand-Tailoring', done: true },
                                  { label: 'Dispatched', done: order.fulfillmentStatus === 'Fulfilled' || order.fulfillmentStatus === 'Delivered' },
                                  { label: 'Delivered', done: order.fulfillmentStatus === 'Delivered' },
                                ].map((step, sIdx) => (
                                  <div key={sIdx} className="text-center space-y-1">
                                    <div className={`h-1.5 rounded-full ${step.done ? 'bg-[#C5A880]' : 'bg-[#E0DAD0]'}`} />
                                    <span className="text-[9.5px] font-medium text-slate-600 block truncate">{step.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Items List */}
                            <div className="space-y-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                Commissioned Garments ({order.items.length})
                              </span>
                              <div className="divide-y divide-[#F0EAE1] border border-[#E6E0D6] rounded-2xl overflow-hidden bg-white">
                                {order.items.map((item, idx) => (
                                  <div key={idx} className="p-3 flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-3 min-w-0">
                                      <img src={item.image} alt="" className="w-10 h-10 rounded-xl object-contain bg-[#FAF8F5] border border-[#E6E0D6]" />
                                      <div className="min-w-0">
                                        <p className="font-semibold text-slate-900 truncate">{item.productTitle}</p>
                                        <p className="text-[10px] text-slate-400 font-mono">Qty: {item.quantity} · {formatPrice(item.price)} each</p>
                                      </div>
                                    </div>
                                    <span className="font-bold text-slate-950 font-serif">
                                      {formatPrice(item.price * item.quantity)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Card Footer Actions */}
                            <div className="flex justify-end gap-2 pt-2">
                              <button
                                onClick={() => setSelectedOrderDetails(order)}
                                className="px-3.5 py-2 rounded-xl bg-[#141416] hover:bg-[#25252A] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                              >
                                View Order Details & Invoice
                              </button>
                            </div>

                          </div>
                        ))}
                      </div>
                    )}

                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* 3. LOYALTY REWARDS (/pages/account/loyalty-rewards)           */}
                {/* ------------------------------------------------------------- */}
                {activeTab === 'loyalty-rewards' && (
                  <div className="space-y-6">
                    
                    {/* VIP Privilege Card */}
                    <div className="bg-gradient-to-br from-[#141416] to-[#25252A] text-white p-8 rounded-3xl border border-[#3A3A40] shadow-md space-y-6 relative overflow-hidden">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-[0.24em] text-[#C5A880] block">
                            Atelier Privilege Membership
                          </span>
                          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-white mt-1">
                            {tierInfo.name}
                          </h2>
                          <p className="text-xs text-slate-300 font-mono mt-0.5">
                            Client Code: {custState.referralCode}
                          </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-[#C5A880]/20 border border-[#C5A880]/40 flex items-center justify-center text-[#C5A880]">
                          <Award className="h-6 w-6" />
                        </div>
                      </div>

                      {/* Tier Progress Meter */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-slate-300">
                          <span>Next Tier: <strong>{tierInfo.nextTier}</strong></span>
                          <span>{tierInfo.pointsNeeded > 0 ? `${tierInfo.pointsNeeded} more commissions needed` : 'Highest Level Achieved'}</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[#C5A880] to-[#E5CCA0] transition-all" style={{ width: `${tierInfo.progress}%` }} />
                        </div>
                      </div>

                      {/* VIP Privileges Matrix */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#33333A] text-xs">
                        <div className="space-y-1">
                          <span className="text-[#C5A880] font-bold block">Complimentary Fittings</span>
                          <p className="text-[11px] text-slate-400">Unlimited bespoke adjustments</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[#C5A880] font-bold block">Private Stylist</span>
                          <p className="text-[11px] text-slate-400">Direct concierge appointment</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[#C5A880] font-bold block">Pre-Collection Access</span>
                          <p className="text-[11px] text-slate-400">48h advance capsule orders</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[#C5A880] font-bold block">White-Glove Courier</span>
                          <p className="text-[11px] text-slate-400">Complimentary express delivery</p>
                        </div>
                      </div>
                    </div>

                    {/* Available Boutique Credits & Vouchers */}
                    <div className="bg-white border border-[#E6E0D6] rounded-3xl p-6 shadow-3xs space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-serif text-lg font-semibold text-slate-950">
                          Active Store Vouchers & Privileges
                        </h3>
                        <span className="text-xs font-bold text-[#8C6B3E] font-mono">
                          {discounts.length} Active Codes
                        </span>
                      </div>

                      {discounts.length === 0 ? (
                        <div className="p-6 bg-[#FAF8F5] rounded-2xl border border-dashed border-[#DCD5C9] text-center space-y-1">
                          <p className="text-xs font-semibold text-slate-700">No active promotional vouchers</p>
                          <p className="text-[11px] text-slate-400">Exclusive member rewards will be automatically credited to your account upon completing fittings.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {discounts.map((discount, idx) => (
                            <div key={idx} className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E6E0D6] flex justify-between items-center">
                              <div className="space-y-1">
                                <span className="font-mono font-bold text-xs text-slate-950 tracking-wider block">{discount.title}</span>
                                <p className="font-semibold text-xs text-slate-800">
                                  {discount.details || (discount.valueAmount ? `${discount.valueAmount}% Off` : 'Atelier Privilege')}
                                </p>
                                <span className="text-[10px] text-slate-400 block">{discount.type || 'Privilege Code'}</span>
                              </div>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(discount.title);
                                  setCopiedCoupon(discount.title);
                                  setTimeout(() => setCopiedCoupon(null), 2500);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-[#141416] text-white text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[#25252A] transition-colors"
                              >
                                {copiedCoupon === discount.title ? 'Copied!' : 'Copy'}
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* 4. REFERRALS (/pages/account/referrals)                       */}
                {/* ------------------------------------------------------------- */}
                {activeTab === 'referrals' && (
                  <div className="space-y-6">
                    
                    <div className="bg-white border border-[#E6E0D6] rounded-3xl p-8 shadow-3xs space-y-6">
                      <div className="text-center max-w-lg mx-auto space-y-2">
                        <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-[#E2DBD0] mx-auto flex items-center justify-center text-[#8C6B3E]">
                          <Share2 className="h-6 w-6" />
                        </div>
                        <span className="text-[10px] uppercase font-bold tracking-[0.24em] text-[#8C6B3E] block">
                          Atelier Introductions
                        </span>
                        <h2 className="font-serif text-2xl font-normal text-slate-950">
                          Introduce Friends to Jade Tailor
                        </h2>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Gift a colleague £50 towards their first bespoke commission. When they complete their fitting, receive £50 boutique credit in your account.
                        </p>
                      </div>

                      {/* Code Share Box */}
                      <div className="max-w-md mx-auto bg-[#FAF8F5] border border-[#DCD5C9] p-4 rounded-2xl flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <span className="text-[9.5px] uppercase font-bold text-slate-400 block">Your Exclusive Referral Code</span>
                          <span className="font-mono font-bold text-sm text-slate-950 tracking-wider truncate block">
                            {custState.referralCode}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(custState.referralCode);
                            setCopiedReferral(true);
                            setTimeout(() => setCopiedReferral(false), 2500);
                          }}
                          className="px-4 py-2 bg-[#141416] hover:bg-[#25252A] text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer flex items-center gap-1.5 shrink-0"
                        >
                          <Copy className="h-3.5 w-3.5 text-[#C5A880]" />
                          <span>{copiedReferral ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>

                      {/* Referral Stats */}
                      <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto text-center border-t border-[#F0EAE1] pt-6">
                        <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E6E0D6]">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Introductions</span>
                          <span className="text-lg font-serif font-bold text-slate-950 block mt-1">0</span>
                        </div>
                        <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E6E0D6]">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Completed</span>
                          <span className="text-lg font-serif font-bold text-emerald-700 block mt-1">0</span>
                        </div>
                        <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E6E0D6]">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Earned</span>
                          <span className="text-lg font-serif font-bold text-[#8C6B3E] block mt-1">{formatPrice(0)}</span>
                        </div>
                      </div>

                    </div>

                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* 5. PAYMENT METHODS (/pages/account/payment-methods)           */}
                {/* ------------------------------------------------------------- */}
                {activeTab === 'payment-methods' && (
                  <div className="space-y-6">
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="font-serif text-2xl font-normal text-slate-950">
                          Payment Methods & Vault
                        </h2>
                        <p className="text-xs text-slate-500">
                          Saved cards for seamless checkout and bespoke deposits
                        </p>
                      </div>
                      <button
                        onClick={() => setShowAddCardModal(true)}
                        className="px-4 py-2 bg-[#141416] hover:bg-[#25252A] text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer flex items-center gap-1.5"
                      >
                        <Plus className="h-3.5 w-3.5 text-[#C5A880]" />
                        <span>Add New Card</span>
                      </button>
                    </div>

                    {/* Saved Cards Showcase */}
                    {savedCards.length === 0 ? (
                      <div className="bg-white border border-dashed border-[#DCD5C9] rounded-3xl p-10 text-center space-y-3">
                        <CreditCard className="h-10 w-10 text-slate-300 mx-auto" />
                        <h3 className="font-serif text-lg font-semibold text-slate-800">No Payment Cards Saved</h3>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                          Click "Add New Card" to save a payment method for fast, secure bespoke commission deposits.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {savedCards.map((card) => (
                          <div 
                            key={card.id} 
                            className="bg-gradient-to-br from-[#141416] to-[#24242A] text-white p-6 rounded-3xl border border-[#3A3A40] shadow-sm space-y-5 relative group"
                          >
                            <div className="flex justify-between items-start">
                              <span className="font-mono font-bold text-xs tracking-widest text-[#C5A880]">
                                {card.brand}
                              </span>
                              <div className="flex items-center gap-2">
                                {card.isDefault && (
                                  <span className="text-[9px] uppercase font-bold tracking-widest bg-[#C5A880]/20 text-[#C5A880] border border-[#C5A880]/30 px-2 py-0.5 rounded-full">
                                    Default Card
                                  </span>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveCard(card.id)}
                                  className="text-slate-400 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                                  title="Remove card"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>

                            <div className="font-mono text-base tracking-widest text-slate-200">
                              •••• •••• •••• {card.last4}
                            </div>

                            <div className="flex justify-between items-end text-xs text-slate-400">
                              <div>
                                <span className="text-[8.5px] uppercase block tracking-wider text-slate-500">Cardholder</span>
                                <span className="font-medium text-white">{card.holder}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-[8.5px] uppercase block tracking-wider text-slate-500">Expires</span>
                                <span className="font-mono text-white">{card.exp}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Security Notice */}
                    <div className="bg-white p-4 rounded-2xl border border-[#E6E0D6] flex items-center gap-3 text-xs text-slate-600">
                      <ShieldCheck className="h-5 w-5 text-[#8C6B3E] shrink-0" />
                      <p>
                        Your payment information is stored in an encrypted PCI-DSS Level 1 compliant vault with tokenized Razorpay gateway security.
                      </p>
                    </div>

                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* 6. ACCOUNT DETAILS (/pages/account/account-details)           */}
                {/* ------------------------------------------------------------- */}
                {activeTab === 'account-details' && (
                  <div className="space-y-6">
                    
                    <div className="bg-white border border-[#E6E0D6] rounded-3xl p-6 sm:p-8 shadow-3xs space-y-6">
                      <div className="border-b border-[#F0EAE1] pb-4">
                        <h2 className="font-serif text-2xl font-normal text-slate-950">
                          Personal Details & Sizing Profile
                        </h2>
                        <p className="text-xs text-slate-500">
                          Manage your atelier contact details, bespoke suit sizing, and fabric preferences
                        </p>
                      </div>

                      <form onSubmit={handleSaveProfile} className="space-y-5">
                        
                        {/* Personal Info Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10.5px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                              Full Legal Name
                            </label>
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full text-xs font-medium bg-[#FAF8F5] border border-[#DCD5C9] p-3 rounded-xl focus:outline-none focus:border-[#C5A880]"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-[10.5px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                              Email Address
                            </label>
                            <input
                              type="email"
                              value={editEmail}
                              onChange={(e) => setEditEmail(e.target.value)}
                              className="w-full text-xs font-medium bg-[#FAF8F5] border border-[#DCD5C9] p-3 rounded-xl focus:outline-none focus:border-[#C5A880]"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-[10.5px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                              Phone Number
                            </label>
                            <input
                              type="text"
                              value={editPhone}
                              onChange={(e) => setEditPhone(e.target.value)}
                              className="w-full text-xs font-medium bg-[#FAF8F5] border border-[#DCD5C9] p-3 rounded-xl focus:outline-none focus:border-[#C5A880]"
                            />
                          </div>

                          <div>
                            <label className="block text-[10.5px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                              Tailoring Fit Preference
                            </label>
                            <select
                              value={editStyleFit}
                              onChange={(e) => setEditStyleFit(e.target.value)}
                              className="w-full text-xs font-medium bg-[#FAF8F5] border border-[#DCD5C9] p-3 rounded-xl focus:outline-none focus:border-[#C5A880]"
                            >
                              <option value="Bespoke Slim">Bespoke Slim (Savile Row Cut)</option>
                              <option value="Classic Tailored">Classic Tailored (Balanced Drape)</option>
                              <option value="Contemporary Relaxed">Contemporary Relaxed</option>
                            </select>
                          </div>
                        </div>

                        {/* Sizing & Measurements */}
                        <div className="pt-4 border-t border-[#F0EAE1] space-y-4">
                          <h3 className="font-serif text-base font-semibold text-slate-900">
                            Atelier Sizing & Wardrobe Specifications
                          </h3>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                                Jacket / Suit Chest Size
                              </label>
                              <select
                                value={editSuitSize}
                                onChange={(e) => setEditSuitSize(e.target.value)}
                                className="w-full text-xs font-medium bg-[#FAF8F5] border border-[#DCD5C9] p-2.5 rounded-xl focus:outline-none focus:border-[#C5A880]"
                              >
                                <option value="38R (Small)">38R (Small)</option>
                                <option value="40R (Regular)">40R (Regular)</option>
                                <option value="42R (Large)">42R (Large)</option>
                                <option value="44L (Long)">44L (Long)</option>
                                <option value="Custom Bespoke">Custom Measurement File</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                                Trouser Waist & Length
                              </label>
                              <input
                                type="text"
                                value={editTrouserWaist}
                                onChange={(e) => setEditTrouserWaist(e.target.value)}
                                className="w-full text-xs font-medium bg-[#FAF8F5] border border-[#DCD5C9] p-2.5 rounded-xl focus:outline-none focus:border-[#C5A880]"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                                Preferred Atelier Fabric
                              </label>
                              <input
                                type="text"
                                value={editFavFabric}
                                onChange={(e) => setEditFavFabric(e.target.value)}
                                className="w-full text-xs font-medium bg-[#FAF8F5] border border-[#DCD5C9] p-2.5 rounded-xl focus:outline-none focus:border-[#C5A880]"
                              />
                            </div>
                          </div>
                        </div>

                        {profileSuccessToast && (
                          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            <span>Your profile and sizing preferences have been successfully updated.</span>
                          </div>
                        )}

                        <div className="flex justify-end pt-2">
                          <button
                            type="submit"
                            className="px-6 py-3 bg-[#141416] hover:bg-[#25252A] text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer"
                          >
                            Save Client Specifications
                          </button>
                        </div>

                      </form>
                    </div>

                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* 7. DELIVERY ADDRESSES (/pages/account/delivery-addresses)     */}
                {/* ------------------------------------------------------------- */}
                {activeTab === 'delivery-addresses' && (
                  <div className="space-y-6">
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="font-serif text-2xl font-normal text-slate-950">
                          Delivery Residences
                        </h2>
                        <p className="text-xs text-slate-500">
                          Saved destinations for white-glove atelier deliveries
                        </p>
                      </div>
                      <button
                        onClick={() => setShowAddressModal(true)}
                        className="px-4 py-2 bg-[#141416] hover:bg-[#25252A] text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer flex items-center gap-1.5"
                      >
                        <Plus className="h-3.5 w-3.5 text-[#C5A880]" />
                        <span>Add Residence</span>
                      </button>
                    </div>

                    {addressToast && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium">
                        {addressToast}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {custState.addresses.map((address, idx) => (
                        <div 
                          key={idx} 
                          className="bg-white border border-[#E6E0D6] hover:border-[#C5A880] p-5 rounded-3xl transition-all shadow-3xs space-y-3"
                        >
                          <div className="flex justify-between items-start">
                            <span className="text-[9.5px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#FAF8F5] border border-[#E6E0D6] text-[#8C6B3E]">
                              {idx === 0 ? 'Primary Destination' : 'Alternative Residence'}
                            </span>
                            {idx > 0 && (
                              <button
                                onClick={() => onRemoveAddress(idx)}
                                className="text-rose-500 hover:text-rose-700 p-1 rounded-lg cursor-pointer"
                                title="Remove address"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>

                          <p className="font-medium text-xs text-slate-800 leading-relaxed">
                            {address}
                          </p>
                        </div>
                      ))}
                    </div>

                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* 8. HELP & SUPPORT (/pages/account/help)                       */}
                {/* ------------------------------------------------------------- */}
                {activeTab === 'help' && (
                  <div className="space-y-6">
                    
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      
                      {/* Left 7 Cols: Concierge Request Form */}
                      <div className="lg:col-span-7 bg-white border border-[#E6E0D6] rounded-3xl p-6 sm:p-8 shadow-3xs space-y-5">
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#8C6B3E] block">
                            Direct Concierge Desk
                          </span>
                          <h2 className="font-serif text-2xl font-normal text-slate-950 mt-1">
                            Stylist Assistance & Inquiries
                          </h2>
                          <p className="text-xs text-slate-500">
                            Contact Jade Tailor regarding fitting appointments, custom fabric swatches, or urgent adjustments.
                          </p>
                        </div>

                        {conciergeSent ? (
                          <div className="p-6 bg-[#FAF8F5] border border-[#C5A880] rounded-2xl text-center space-y-2 animate-in fade-in">
                            <CheckCircle2 className="h-8 w-8 text-[#8C6B3E] mx-auto" />
                            <h3 className="font-serif text-base font-bold text-slate-950">Inquiry Transmitted</h3>
                            <p className="text-xs text-slate-600">
                              Your dedicated stylist concierge has received your request and will reply within 2 business hours.
                            </p>
                            <button
                              onClick={() => setConciergeSent(false)}
                              className="text-xs font-bold text-[#8C6B3E] underline cursor-pointer pt-2"
                            >
                              Send Another Inquiry
                            </button>
                          </div>
                        ) : (
                          <form 
                            onSubmit={(e) => {
                              e.preventDefault();
                              if (!conciergeMsg.trim()) return;
                              setConciergeSent(true);
                              setConciergeMsg('');
                            }}
                            className="space-y-4"
                          >
                            <div>
                              <label className="block text-[10.5px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                                Subject
                              </label>
                              <select
                                value={conciergeSubject}
                                onChange={(e) => setConciergeSubject(e.target.value)}
                                className="w-full text-xs font-medium bg-[#FAF8F5] border border-[#DCD5C9] p-3 rounded-xl focus:outline-none focus:border-[#C5A880]"
                              >
                                <option value="Bespoke Consultation Inquiry">Bespoke Consultation Inquiry</option>
                                <option value="Garment Alteration Request">Garment Alteration Request</option>
                                <option value="Order Tracking & Transit Assistance">Order Tracking & Transit Assistance</option>
                                <option value="Fabric Swatches Request">Fabric Swatches Request</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-[10.5px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                                Message to Jade Tailor
                              </label>
                              <textarea
                                rows={4}
                                placeholder="Describe your question, fitting request, or commission specifications..."
                                value={conciergeMsg}
                                onChange={(e) => setConciergeMsg(e.target.value)}
                                className="w-full text-xs font-medium bg-[#FAF8F5] border border-[#DCD5C9] p-3 rounded-xl focus:outline-none focus:border-[#C5A880]"
                                required
                              />
                            </div>

                            <button
                              type="submit"
                              className="w-full bg-[#141416] hover:bg-[#25252A] text-white text-xs font-bold uppercase tracking-wider py-3.5 px-4 rounded-xl cursor-pointer flex items-center justify-center gap-2"
                            >
                              <Send className="h-3.5 w-3.5 text-[#C5A880]" />
                              <span>Transmit Inquiry to Stylist</span>
                            </button>
                          </form>
                        )}
                      </div>

                      {/* Right 5 Cols: FAQ & Direct Contacts */}
                      <div className="lg:col-span-5 space-y-4">
                        
                        <div className="bg-white border border-[#E6E0D6] rounded-3xl p-6 shadow-3xs space-y-4">
                          <h3 className="font-serif text-base font-semibold text-slate-950">
                            Atelier Channels
                          </h3>

                          <div className="space-y-3 text-xs">
                            <div className="flex items-center gap-3 text-slate-700">
                              <Phone className="h-4 w-4 text-[#8C6B3E]" />
                              <span>+44 20 7946 0921 (Savile Row Studio)</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-700">
                              <MessageSquare className="h-4 w-4 text-[#8C6B3E]" />
                              <span>WhatsApp VIP Concierge (+44 7700 900142)</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-700">
                              <MapPin className="h-4 w-4 text-[#8C6B3E]" />
                              <span>Mayfair & Savile Row, London W1S</span>
                            </div>
                          </div>
                        </div>

                        {/* FAQs */}
                        <div className="bg-white border border-[#E6E0D6] rounded-3xl p-6 shadow-3xs space-y-3 text-xs">
                          <h3 className="font-serif text-base font-semibold text-slate-950">
                            Frequently Inquired
                          </h3>

                          <div className="space-y-2 text-slate-600">
                            <details className="group border-b border-[#F0EAE1] pb-2">
                              <summary className="font-semibold text-slate-900 cursor-pointer list-none flex justify-between items-center">
                                <span>What is the standard tailoring turnaround?</span>
                                <ChevronDown className="h-3.5 w-3.5 group-open:rotate-180 transition-transform" />
                              </summary>
                              <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                                Handcrafted garments require 14 to 21 business days from pattern drafting to final hand pressing.
                              </p>
                            </details>

                            <details className="group border-b border-[#F0EAE1] pb-2">
                              <summary className="font-semibold text-slate-900 cursor-pointer list-none flex justify-between items-center">
                                <span>Are alterations complimentary?</span>
                                <ChevronDown className="h-3.5 w-3.5 group-open:rotate-180 transition-transform" />
                              </summary>
                              <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                                Yes. All client suite members receive complimentary fitting alterations within 30 days of delivery.
                              </p>
                            </details>
                          </div>
                        </div>

                      </div>

                    </div>

                  </div>
                )}

              </motion.div>
            </AnimatePresence>

          </main>

        </div>
      </div>

      {/* ===================================================================== */}
      {/* MODAL 1: ADD DELIVERY RESIDENCE                                       */}
      {/* ===================================================================== */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 bg-[#0c0d10]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E6E0D6] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative animate-in fade-in">
            <div className="flex justify-between items-center border-b border-[#F0EAE1] pb-3">
              <h3 className="font-serif text-lg font-normal text-slate-950">Add Delivery Residence</h3>
              <button 
                onClick={() => setShowAddressModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddAddressSubmit} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Street Address</label>
                <input
                  type="text"
                  placeholder="e.g. 14 Berkeley Square"
                  value={addrStreet}
                  onChange={(e) => setAddrStreet(e.target.value)}
                  className="w-full text-xs bg-[#FAF8F5] border border-[#DCD5C9] p-2.5 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Apartment / Suite</label>
                <input
                  type="text"
                  placeholder="e.g. Flat 4B"
                  value={addrApt}
                  onChange={(e) => setAddrApt(e.target.value)}
                  className="w-full text-xs bg-[#FAF8F5] border border-[#DCD5C9] p-2.5 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">City</label>
                  <input
                    type="text"
                    placeholder="London"
                    value={addrCity}
                    onChange={(e) => setAddrCity(e.target.value)}
                    className="w-full text-xs bg-[#FAF8F5] border border-[#DCD5C9] p-2.5 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Postal Code</label>
                  <input
                    type="text"
                    placeholder="W1J 5AE"
                    value={addrZip}
                    onChange={(e) => setAddrZip(e.target.value)}
                    className="w-full text-xs bg-[#FAF8F5] border border-[#DCD5C9] p-2.5 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="px-4 py-2 bg-[#FAF8F5] text-slate-600 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#141416] text-white text-xs font-bold uppercase tracking-wider rounded-xl"
                >
                  Save Residence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 2: ADD PAYMENT CARD                                             */}
      {/* ===================================================================== */}
      {showAddCardModal && (
        <div className="fixed inset-0 z-50 bg-[#0c0d10]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E6E0D6] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative animate-in fade-in">
            <div className="flex justify-between items-center border-b border-[#F0EAE1] pb-3">
              <h3 className="font-serif text-lg font-normal text-slate-950">Add Payment Method</h3>
              <button 
                onClick={() => setShowAddCardModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddCardSubmit} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="e.g. VALENTINA GOMEZ"
                  value={newCardHolder}
                  onChange={(e) => setNewCardHolder(e.target.value)}
                  className="w-full text-xs uppercase bg-[#FAF8F5] border border-[#DCD5C9] p-2.5 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Card Number</label>
                <input
                  type="text"
                  placeholder="•••• •••• •••• ••••"
                  value={newCardNumber}
                  onChange={(e) => setNewCardNumber(e.target.value)}
                  className="w-full text-xs font-mono bg-[#FAF8F5] border border-[#DCD5C9] p-2.5 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    placeholder="12/28"
                    value={newCardExp}
                    onChange={(e) => setNewCardExp(e.target.value)}
                    className="w-full text-xs font-mono bg-[#FAF8F5] border border-[#DCD5C9] p-2.5 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">CVV / CVC</label>
                  <input
                    type="password"
                    placeholder="•••"
                    value={newCardCvv}
                    onChange={(e) => setNewCardCvv(e.target.value)}
                    className="w-full text-xs font-mono bg-[#FAF8F5] border border-[#DCD5C9] p-2.5 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCardModal(false)}
                  className="px-4 py-2 bg-[#FAF8F5] text-slate-600 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#141416] text-white text-xs font-bold uppercase tracking-wider rounded-xl"
                >
                  Save Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 3: VIEW ORDER DETAILS & INVOICE                                 */}
      {/* ===================================================================== */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 bg-[#0c0d10]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E6E0D6] rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative animate-in fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-[#F0EAE1] pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#8C6B3E] block">
                  Commission Receipt
                </span>
                <h3 className="font-serif text-xl font-normal text-slate-950 mt-0.5">
                  Order {selectedOrderDetails.id}
                </h3>
                <span className="text-xs text-slate-400 font-mono">Date: {selectedOrderDetails.date}</span>
              </div>
              <button 
                onClick={() => setSelectedOrderDetails(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Itemized Tailoring Garments
              </span>
              <div className="divide-y divide-[#F0EAE1] border border-[#E6E0D6] rounded-2xl overflow-hidden bg-[#FAF8F5]">
                {selectedOrderDetails.items.map((item, idx) => (
                  <div key={idx} className="p-3 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-semibold text-slate-900">{item.productTitle}</p>
                      <p className="text-[10px] text-slate-400 font-mono">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                    </div>
                    <span className="font-serif font-bold text-slate-950">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial summary */}
            <div className="pt-2 border-t border-[#F0EAE1] space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>{formatPrice(selectedOrderDetails.total)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>White-Glove Courier Delivery</span>
                <span className="text-emerald-700 font-semibold">Complimentary</span>
              </div>
              <div className="flex justify-between font-serif text-base font-bold text-slate-950 pt-2 border-t border-[#F0EAE1]">
                <span>Total Amount Paid</span>
                <span>{formatPrice(selectedOrderDetails.total)}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="px-5 py-2.5 bg-[#141416] text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
