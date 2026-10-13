import React, { useState, useEffect, useMemo } from 'react';
import { Customer, Product, Order, Discount } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, LogIn, Heart, PlusCircle, Trash2, MapPin, Package, ShoppingBag, 
  Eye, X, Search, Truck, Check, Clock, Calendar, RefreshCw, Award, 
  Copy, Share2, HelpCircle, ShieldAlert, CreditCard, Star, ChevronRight, 
  CheckCircle2, AlertTriangle, ChevronDown, CheckCircle, Tag, LifeBuoy,
  Layout, LogOut, ArrowRight, Sparkles, Send, Phone, MessageSquare,
  Lock, ExternalLink, ShieldCheck, Download, SlidersHorizontal, ArrowUpRight
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
  onNavigateToTab
}: CustomerAccountProps) {
  // Navigation active tab with synchronized URL path
  const [activeTab, setActiveTab] = useState<AccountTabId>(() => getTabFromPathname());

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
  const [addrCountry, setAddrCountry] = useState('India');
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
  const [editPhone, setEditPhone] = useState(loggedInCustomer?.phone || '+91 98765 43210');
  const [editStyleFit, setEditStyleFit] = useState('Bespoke Tailored');
  const [editSuitSize, setEditSuitSize] = useState('40R (Medium)');
  const [editFavFabric, setEditFavFabric] = useState('Virgin Wool & Cashmere');
  const [profileSuccessToast, setProfileSuccessToast] = useState(false);

  // Payment methods local states
  const [savedCards, setSavedCards] = useState([
    {
      id: 'card-1',
      brand: 'VISA',
      last4: '4242',
      holder: loggedInCustomer?.name || 'VALENTINA GOMEZ',
      exp: '09/28',
      isDefault: true,
      cardType: 'Privilege Signature'
    },
    {
      id: 'card-2',
      brand: 'MASTERCARD',
      last4: '8839',
      holder: loggedInCustomer?.name || 'VALENTINA GOMEZ',
      exp: '11/27',
      isDefault: false,
      cardType: 'World Elite Card'
    }
  ]);
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
        color: 'text-[#d4af37]',
        badgeBg: 'bg-[#d4af37] text-slate-950',
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
      color: 'text-[#b58d59]',
      badgeBg: 'bg-[#b58d59] text-white',
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
      setEditPhone(loggedInCustomer.phone || '+91 98765 43210');
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
            location: 'Mumbai, India',
            subscriptionStatus: 'Subscribed',
            tags: ['Atelier Member'],
            addresses: ['Flat 402, Signature Palms, Bandra West, Mumbai 400050'],
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
          location: 'Delhi, India',
          subscriptionStatus: 'Subscribed',
          tags: ['Private Client'],
          addresses: ['Villa 12, Amaltas Enclave, New Delhi 110021'],
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
      setTrackerError(`No atelier order found matching "${trackerInput}". Please check the ID on your invoice.`);
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
    setAddressToast('Delivery address added to your atelier profile.');
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
    setSavedCards(prev => [...prev, newCard]);
    setShowAddCardModal(false);
    setNewCardHolder('');
    setNewCardNumber('');
    setNewCardExp('');
    setNewCardCvv('');
  };

  // =========================================================================
  // VIEW A: UNAUTHENTICATED GUEST (LOGIN, REGISTER & GUEST TRACKER)
  // =========================================================================
  if (!loggedInCustomer || !custState) {
    return (
      <div className="min-h-screen bg-[#0d0d0f] text-slate-100 py-12 px-4 md:px-8 font-sans selection:bg-[#b58d59] selection:text-white">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Top Brand Banner */}
          <div className="text-center space-y-3 pt-6">
            <span className="text-[10px] uppercase font-bold tracking-[0.35em] text-[#b58d59] block">
              JADE TAILOR • BESPOKE ATELIER
            </span>
            <h1 className="text-3xl md:text-5xl font-serif font-normal tracking-tight text-white">
              Private Client Portal
            </h1>
            <p className="text-xs md:text-sm text-slate-400 max-w-md mx-auto font-light leading-relaxed">
              Access your bespoke wardrobe allocations, order progression, and exclusive personal stylist privileges.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 7 Cols: Auth Card */}
            <div className="lg:col-span-7 bg-[#16161a] border border-[#2a2a32] rounded-3xl p-8 md:p-10 shadow-2xl space-y-8">
              <div className="flex border-b border-[#2a2a32] pb-4 justify-between items-center">
                <div className="flex gap-6">
                  <button
                    onClick={() => { setAuthMode('login'); setErrorMsg(''); }}
                    className={`text-xs md:text-sm font-bold uppercase tracking-wider transition-colors pb-2 relative cursor-pointer ${
                      authMode === 'login' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Client Sign In
                    {authMode === 'login' && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#b58d59]" />
                    )}
                  </button>
                  <button
                    onClick={() => { setAuthMode('signup'); setErrorMsg(''); }}
                    className={`text-xs md:text-sm font-bold uppercase tracking-wider transition-colors pb-2 relative cursor-pointer ${
                      authMode === 'signup' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Register Atelier Suite
                    {authMode === 'signup' && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#b58d59]" />
                    )}
                  </button>
                </div>
                <span className="text-[9px] uppercase font-extrabold tracking-widest text-[#b58d59] bg-[#b58d59]/10 px-2.5 py-1 rounded-full border border-[#b58d59]/20 hidden sm:inline-block">
                  Atelier Security 256-Bit
                </span>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-5">
                {authMode === 'signup' && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1.5">
                      Full Legal Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Valentina Gomez"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="w-full text-xs font-medium bg-[#1e1e24] border border-[#2e2e38] text-white p-3.5 rounded-xl focus:border-[#b58d59] focus:outline-none transition-colors"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="client@luxury.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full text-xs font-medium bg-[#1e1e24] border border-[#2e2e38] text-white p-3.5 rounded-xl focus:border-[#b58d59] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                      Password
                    </label>
                    <span className="text-[10px] text-slate-400 hover:text-[#b58d59] cursor-pointer">
                      Forgot Password?
                    </span>
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full text-xs font-medium bg-[#1e1e24] border border-[#2e2e38] text-white p-3.5 rounded-xl focus:border-[#b58d59] focus:outline-none transition-colors"
                  />
                </div>

                {authMode === 'signup' && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1.5">
                      VIP Invitation Code (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. REF-JT-VIP-8840"
                      value={referredByCodeInput}
                      onChange={(e) => setReferredByCodeInput(e.target.value)}
                      className="w-full text-xs font-mono bg-[#1e1e24] border border-[#2e2e38] text-amber-300 p-3.5 rounded-xl focus:border-[#b58d59] focus:outline-none uppercase"
                    />
                  </div>
                )}

                {errorMsg && (
                  <p className="text-xs text-rose-400 bg-rose-950/40 border border-rose-800/50 p-3 rounded-xl font-medium">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#b58d59] hover:bg-[#c99d66] disabled:bg-slate-700 text-slate-950 font-black text-xs uppercase tracking-[0.2em] py-4 px-6 rounded-xl transition-all shadow-lg shadow-[#b58d59]/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <RefreshCw className="h-4 w-4 animate-spin text-slate-950" />
                  ) : (
                    <Lock className="h-4 w-4 text-slate-950" />
                  )}
                  <span>{authMode === 'login' ? 'Unlock Private Suite' : 'Create Client Account'}</span>
                </button>
              </form>

              {/* Quick One-Click Demo Logins */}
              <div className="pt-6 border-t border-[#2a2a32] space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
                  Quick Access Profiles (One-Click)
                </span>
                <div className="flex flex-wrap gap-2">
                  {customers.slice(0, 4).map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setEmailInput(c.email);
                        setPasswordInput('atelier2026');
                        onLogin(c);
                      }}
                      className="text-[11px] font-semibold text-slate-300 hover:text-white bg-[#1e1e24] hover:bg-[#282832] border border-[#2e2e38] py-1.5 px-3 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <User className="h-3 w-3 text-[#b58d59]" />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 5 Cols: Guest Order Shipment Tracker */}
            <div className="lg:col-span-5 bg-[#16161a] border border-[#2a2a32] rounded-3xl p-8 shadow-2xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#b58d59]/15 border border-[#b58d59]/30 flex items-center justify-center text-[#b58d59]">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-normal text-white">Guest Order Lookup</h3>
                  <p className="text-[11px] text-slate-400">Track shipment status without logging in</p>
                </div>
              </div>

              <form onSubmit={handleTrackOrder} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1.5">
                    Order Reference ID
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. PS48884"
                      value={trackerInput}
                      onChange={(e) => setTrackerInput(e.target.value)}
                      className="w-full text-xs font-mono font-bold bg-[#1e1e24] border border-[#2e2e38] text-white p-3.5 pr-10 rounded-xl focus:border-[#b58d59] focus:outline-none uppercase"
                    />
                    <Search className="absolute right-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  </div>
                </div>

                {trackerError && (
                  <p className="text-xs text-rose-400 bg-rose-950/40 border border-rose-800/40 p-2.5 rounded-xl">
                    {trackerError}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#1e1e24] hover:bg-[#282832] text-white border border-[#3a3a46] hover:border-[#b58d59] font-bold text-xs uppercase tracking-widest py-3.5 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Search className="h-3.5 w-3.5 text-[#b58d59]" />
                  <span>Inspect Shipment Status</span>
                </button>
              </form>

              {trackedOrder && (
                <div className="p-4 rounded-2xl bg-[#1e1e24] border border-[#2e2e38] space-y-3 animate-in fade-in">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono font-bold text-amber-300">{trackedOrder.id}</span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                      {trackedOrder.fulfillmentStatus}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Recipient: <strong className="text-white">{trackedOrder.customerName}</strong>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Courier: <strong className="text-slate-200">{trackedOrder.carrier || 'Express Atelier Courier'}</strong>
                  </p>
                  <div className="pt-2 border-t border-[#2e2e38] text-[10.5px] text-slate-400 flex justify-between">
                    <span>Total Amount: {formatPrice(trackedOrder.totalAmount)}</span>
                    <span className="text-[#b58d59]">Status: Active Transit</span>
                  </div>
                </div>
              )}

              {/* Atelier Guarantees Box */}
              <div className="pt-4 border-t border-[#2a2a32] space-y-2 text-[11px] text-slate-400">
                <div className="flex items-center gap-2 text-slate-300 font-semibold">
                  <ShieldCheck className="h-4 w-4 text-[#b58d59]" />
                  <span>Jade Tailor Client Assurances</span>
                </div>
                <p className="leading-relaxed text-[10.5px]">
                  All bespoke garments include complimentary post-delivery adjustments within 30 days of receipt.
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
    <div className="min-h-screen bg-[#faf8f5] text-slate-900 font-sans selection:bg-[#b58d59] selection:text-white pb-24">
      
      {/* Top Luxury Client Bar */}
      <header className="bg-[#111111] text-white border-b border-[#222222] py-4 px-4 sm:px-8 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          
          {/* Atelier Brand Title & Monogram */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#b58d59] to-[#8d693c] flex items-center justify-center text-slate-950 font-serif font-black text-sm shadow-md">
              JT
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg tracking-wide text-white">
                  Jade Tailor
                </span>
                <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-[#b58d59] border border-[#b58d59]/40 px-1.5 py-0.5 rounded-sm">
                  Private Client Suite
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                Atelier ID: {custState.id} • {tierInfo.name}
              </span>
            </div>
          </div>

          {/* Client Welcome & Quick Header Controls */}
          <div className="flex items-center flex-wrap gap-2.5 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 hidden lg:inline">Private Client:</span>
              <span className="font-bold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {custState.name}
              </span>
            </div>

            <div className="h-4 w-px bg-slate-700 hidden sm:block mx-1" />

            <button
              onClick={() => handleSelectTab('orders')}
              className="px-3 py-1.5 rounded-lg bg-[#222222] hover:bg-[#333333] text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-[#333333]"
              title="Track Active Shipment"
            >
              <Truck className="h-3.5 w-3.5 text-[#b58d59]" />
              <span className="hidden sm:inline">Track Orders</span>
            </button>

            <button
              onClick={() => handleSelectTab('help')}
              className="px-3 py-1.5 rounded-lg bg-[#b58d59] hover:bg-[#c99d66] text-slate-950 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
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
      <div className="lg:hidden bg-white border-b border-[#e5e0d8] px-4 py-2.5 overflow-x-auto scrollbar-none sticky top-16 z-30 shadow-2xs">
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
                    ? 'bg-[#111111] text-[#b58d59] shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-[#b58d59]' : 'text-slate-500'}`} />
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
          <aside className="hidden lg:block lg:col-span-4 xl:col-span-3 space-y-6 shrink-0 sticky top-24">
            
            {/* Client Identity Mini Card */}
            <div className="bg-[#111111] text-white p-6 rounded-3xl border border-[#2a2a2a] shadow-lg space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#222222] border border-[#383838] flex items-center justify-center font-serif text-lg font-bold text-[#b58d59] shrink-0 shadow-inner">
                  {custState.name.split(' ').map(n => n[0]).join('').slice(0, 2) || 'JT'}
                </div>
                <div className="min-w-0">
                  <h3 className="font-serif text-base font-normal text-white truncate">
                    {custState.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono truncate">{custState.email}</p>
                </div>
              </div>

              {/* VIP Tier Badge with Star Emblem */}
              <div className="pt-2 border-t border-[#222222] flex items-center justify-between">
                <span className={`text-[9.5px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${tierInfo.badgeBg} flex items-center gap-1 shadow-xs`}>
                  <Star className="h-3 w-3 fill-current" />
                  <span>{tierInfo.name}</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono font-bold">
                  {myOrders.length} Completed Orders
                </span>
              </div>
            </div>

            {/* Sidebar Navigation Items list (Exactly matching user prompt requirements) */}
            <div className="bg-white border border-[#e8e4dc] rounded-3xl p-3 shadow-xs space-y-1">
              <div className="px-3 py-2 text-[10px] uppercase font-extrabold tracking-[0.2em] text-slate-400 border-b border-slate-100">
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
                      className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all cursor-pointer group ${
                        isActive
                          ? 'bg-[#111111] text-white shadow-md font-bold'
                          : 'hover:bg-[#f7f5f0] text-slate-700 font-semibold'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-1.5 rounded-xl transition-colors shrink-0 ${
                          isActive
                            ? 'bg-[#222222] text-[#b58d59]'
                            : 'bg-slate-100 text-slate-500 group-hover:text-slate-900 group-hover:bg-slate-200'
                        }`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="truncate">
                          <span className={`block text-xs uppercase tracking-wider truncate ${
                            isActive ? 'text-white' : 'text-slate-800'
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
                        <span className="text-[8.5px] uppercase font-black px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                          {item.tag}
                        </span>
                      )}

                      {isActive && (
                        <ChevronRight className="h-4 w-4 text-[#b58d59] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Stylist Concierge Assistance Callout */}
            <div className="bg-gradient-to-br from-[#16161a] to-[#202026] text-white p-5 rounded-3xl border border-[#2e2e38] shadow-md space-y-3">
              <div className="flex items-center gap-2 text-[#b58d59]">
                <Sparkles className="h-4 w-4" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#b58d59]">
                  Personal Stylist Desk
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed font-light">
                Need guidance on seasonal wardrobe capsules or private fittings? Direct styling inquiries are prioritized within 2 hours.
              </p>
              <button
                type="button"
                onClick={() => handleSelectTab('help')}
                className="w-full bg-[#b58d59] hover:bg-[#c99d66] text-slate-950 font-bold text-[10.5px] uppercase tracking-wider py-2.5 rounded-xl transition-colors cursor-pointer text-center block shadow-sm"
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >

                {/* ------------------------------------------------------------- */}
                {/* 1. DASHBOARD (/pages/account/dashboard)                       */}
                {/* ------------------------------------------------------------- */}
                {activeTab === 'dashboard' && (
                  <div className="space-y-6">
                    
                    {/* Welcome Banner Card */}
                    <div className="bg-[#111111] text-white p-8 rounded-3xl border border-[#222222] shadow-xl relative overflow-hidden">
                      <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#b58d59]/10 to-transparent pointer-events-none" />
                      <div className="relative z-10 space-y-2">
                        <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#b58d59] block">
                          ATELIER CLIENT SUMMARY
                        </span>
                        <h2 className="font-serif text-2xl sm:text-3xl font-normal text-white">
                          Welcome, {custState.name}
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-light leading-relaxed">
                          Your private styling dashboard provides real-time oversight of garments in production, accumulated boutique points, and tailor fittings.
                        </p>
                      </div>

                      {/* Tier Progress bar */}
                      <div className="mt-6 pt-6 border-t border-[#262626] space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-medium text-slate-300">
                            Tier Status: <strong className="text-white">{tierInfo.name}</strong>
                          </span>
                          <span className="text-[#b58d59] font-mono text-[11px] font-bold">
                            {tierInfo.nextTier === 'Max Tier Achieved' ? 'Max Tier Reached' : `${tierInfo.pointsNeeded} Orders until ${tierInfo.nextTier}`}
                          </span>
                        </div>
                        <div className="h-2 w-full bg-[#262626] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#b58d59] to-[#dfba89] rounded-full transition-all duration-700"
                            style={{ width: `${tierInfo.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Bento Stat Counters */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                      
                      {/* Stat 1: Completed Orders */}
                      <div 
                        onClick={() => handleSelectTab('orders')}
                        className="bg-white p-5 rounded-3xl border border-[#e8e4dc] shadow-xs hover:shadow-md transition-all cursor-pointer group"
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Total Orders</span>
                          <div className="p-2 rounded-xl bg-slate-100 text-slate-700 group-hover:bg-[#111111] group-hover:text-[#b58d59] transition-colors">
                            <Package className="h-4 w-4" />
                          </div>
                        </div>
                        <div className="mt-3">
                          <span className="text-2xl font-serif font-bold text-slate-900">{myOrders.length}</span>
                          <span className="block text-[11px] text-slate-500 mt-0.5">
                            {myOrders.filter(o => o.fulfillmentStatus !== 'Delivered').length} in active production
                          </span>
                        </div>
                      </div>

                      {/* Stat 2: Boutique Credits */}
                      <div 
                        onClick={() => handleSelectTab('loyalty-rewards')}
                        className="bg-white p-5 rounded-3xl border border-[#e8e4dc] shadow-xs hover:shadow-md transition-all cursor-pointer group"
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Atelier Points</span>
                          <div className="p-2 rounded-xl bg-amber-50 text-amber-700 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                            <Award className="h-4 w-4" />
                          </div>
                        </div>
                        <div className="mt-3">
                          <span className="text-2xl font-serif font-bold text-slate-900">
                            {myOrders.length * 150 + 250} pts
                          </span>
                          <span className="block text-[11px] text-amber-700 font-semibold mt-0.5">
                            {formatPrice((myOrders.length * 150 + 250) * 0.1)} credit value
                          </span>
                        </div>
                      </div>

                      {/* Stat 3: Referral Credits */}
                      <div 
                        onClick={() => handleSelectTab('referrals')}
                        className="bg-white p-5 rounded-3xl border border-[#e8e4dc] shadow-xs hover:shadow-md transition-all cursor-pointer group"
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Referral Wallet</span>
                          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                            <Share2 className="h-4 w-4" />
                          </div>
                        </div>
                        <div className="mt-3">
                          <span className="text-2xl font-serif font-bold text-slate-900">
                            {formatPrice(75)}
                          </span>
                          <span className="block text-[11px] text-emerald-700 font-semibold mt-0.5">
                            3 friends joined via your code
                          </span>
                        </div>
                      </div>

                      {/* Stat 4: Saved Addresses */}
                      <div 
                        onClick={() => handleSelectTab('delivery-addresses')}
                        className="bg-white p-5 rounded-3xl border border-[#e8e4dc] shadow-xs hover:shadow-md transition-all cursor-pointer group"
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Destinations</span>
                          <div className="p-2 rounded-xl bg-sky-50 text-sky-700 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                            <MapPin className="h-4 w-4" />
                          </div>
                        </div>
                        <div className="mt-3">
                          <span className="text-2xl font-serif font-bold text-slate-900">
                            {custState.addresses?.length || 1}
                          </span>
                          <span className="block text-[11px] text-slate-500 mt-0.5">
                            Verified delivery addresses
                          </span>
                        </div>
                      </div>

                    </div>

                    {/* Active Order Spotlight Card */}
                    {myOrders.length > 0 && (
                      <div className="bg-white border border-[#e8e4dc] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#f0ede6] pb-4">
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-[#b58d59] block">
                              MOST RECENT ATELIER ALLOCATION
                            </span>
                            <h3 className="font-serif text-xl font-normal text-slate-900">
                              Order #{myOrders[0].id}
                            </h3>
                          </div>
                          <span className={`text-[10px] uppercase font-black px-3 py-1 rounded-full border ${
                            myOrders[0].fulfillmentStatus === 'Delivered'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200 animate-pulse'
                          }`}>
                            {myOrders[0].fulfillmentStatus.toUpperCase()}
                          </span>
                        </div>

                        {/* Interactive 5-Step Tailoring Timeline */}
                        <div className="space-y-3">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                            Live Garment Progression Timeline
                          </span>
                          <div className="grid grid-cols-5 gap-2 text-center text-[10px]">
                            {[
                              { label: 'Order Placed', done: true },
                              { label: 'Fabric Cut', done: true },
                              { label: 'Hand-Tailored', done: myOrders[0].fulfillmentStatus !== 'Unfulfilled' },
                              { label: 'Quality Pressed', done: myOrders[0].fulfillmentStatus === 'Delivered' },
                              { label: 'Delivered', done: myOrders[0].fulfillmentStatus === 'Delivered' }
                            ].map((step, sIdx) => (
                              <div key={sIdx} className="space-y-1.5">
                                <div className={`h-2 rounded-full ${
                                  step.done ? 'bg-[#b58d59]' : 'bg-slate-200'
                                }`} />
                                <span className={`block font-medium ${step.done ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
                                  {step.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-4 border-t border-[#f0ede6] text-xs">
                          <span className="text-slate-500">
                            Total Valuation: <strong className="text-slate-900 font-bold">{formatPrice(myOrders[0].totalAmount)}</strong>
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedOrderDetails(myOrders[0]);
                              handleSelectTab('orders');
                            }}
                            className="bg-[#111111] hover:bg-[#b58d59] text-white font-bold text-xs uppercase tracking-wider py-2.5 px-5 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <span>Inspect Order Specs</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Member Privileges Grid */}
                    <div className="bg-white border border-[#e8e4dc] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                      <h3 className="font-serif text-lg font-normal text-slate-900">
                        Atelier Client Privileges
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#eee9df] space-y-2">
                          <span className="text-[#b58d59] font-bold text-sm block">01 / Alterations</span>
                          <h4 className="font-serif font-bold text-slate-900">Complimentary Fit Alterations</h4>
                          <p className="text-slate-600 text-[11px] leading-relaxed">
                            Bespoke sleeve and hem adjustments on any ready-to-wear silhouette within 30 days.
                          </p>
                        </div>
                        <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#eee9df] space-y-2">
                          <span className="text-[#b58d59] font-bold text-sm block">02 / Concierge</span>
                          <h4 className="font-serif font-bold text-slate-900">Direct WhatsApp Styling</h4>
                          <p className="text-slate-600 text-[11px] leading-relaxed">
                            Message Jade Tailor directly for outfit pairing and seasonal lookbook consultations.
                          </p>
                        </div>
                        <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#eee9df] space-y-2">
                          <span className="text-[#b58d59] font-bold text-sm block">03 / Previews</span>
                          <h4 className="font-serif font-bold text-slate-900">Private Trunk Show Previews</h4>
                          <p className="text-slate-600 text-[11px] leading-relaxed">
                            Access seasonal capsules 48 hours prior to public release with pre-order allocation.
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* 2. ORDERS (/pages/account/orders)                             */}
                {/* ------------------------------------------------------------- */}
                {activeTab === 'orders' && (
                  <div className="space-y-6">
                    
                    <div className="bg-white border border-[#e8e4dc] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-widest text-[#b58d59] block">
                            CLIENT WARDROBE ARCHIVE
                          </span>
                          <h2 className="font-serif text-2xl font-normal text-slate-900">
                            Atelier Orders ({myOrders.length})
                          </h2>
                        </div>

                        {/* Search and filter bar */}
                        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                          <div className="relative flex-1 md:w-60">
                            <input
                              type="text"
                              placeholder="Search order ID or garment..."
                              value={orderSearchQuery}
                              onChange={(e) => setOrderSearchQuery(e.target.value)}
                              className="w-full text-xs bg-slate-50 border border-slate-200 py-2 pl-8 pr-3 rounded-xl focus:outline-none focus:border-[#b58d59]"
                            />
                            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                          </div>

                          <div className="flex items-center gap-1 text-[11px]">
                            {(['all', 'unfulfilled', 'delivered'] as const).map(st => (
                              <button
                                key={st}
                                onClick={() => setOrderStatusFilter(st)}
                                className={`px-2.5 py-1.5 rounded-lg font-bold capitalize transition-colors cursor-pointer ${
                                  orderStatusFilter === st
                                    ? 'bg-[#111111] text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Orders Listing */}
                      <div className="space-y-4">
                        {myOrders
                          .filter(o => {
                            if (orderStatusFilter === 'unfulfilled') return o.fulfillmentStatus !== 'Delivered';
                            if (orderStatusFilter === 'delivered') return o.fulfillmentStatus === 'Delivered';
                            return true;
                          })
                          .filter(o => {
                            if (!orderSearchQuery.trim()) return true;
                            const q = orderSearchQuery.toLowerCase();
                            return o.id.toLowerCase().includes(q) || 
                              o.items.some(i => i.productTitle.toLowerCase().includes(q));
                          })
                          .map((order) => (
                            <div
                              key={order.id}
                              className="bg-[#faf8f5] border border-[#eee9df] rounded-2xl p-5 hover:border-[#b58d59] transition-all space-y-4"
                            >
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#e8e4dc] pb-3 text-xs">
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono font-bold text-slate-900 text-sm">#{order.id}</span>
                                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                                      order.fulfillmentStatus === 'Delivered'
                                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                        : 'bg-amber-50 text-amber-800 border-amber-200'
                                    }`}>
                                      {order.fulfillmentStatus}
                                    </span>
                                  </div>
                                  <span className="text-[11px] text-slate-500 font-mono">
                                    Placed on {order.createdAt || 'Sep 24, 2026'} • Courier: {order.carrier || 'Express Atelier Courier'}
                                  </span>
                                </div>

                                <div className="text-right flex items-center gap-3">
                                  <div>
                                    <span className="text-sm font-serif font-bold text-slate-900 block">
                                      {formatPrice(order.totalAmount)}
                                    </span>
                                    <span className="text-[10px] text-slate-500">
                                      {order.items?.length || 1} garment item{(order.items?.length || 1) > 1 ? 's' : ''}
                                    </span>
                                  </div>
                                  <button
                                    onClick={() => setSelectedOrderDetails(order)}
                                    className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-700 hover:text-slate-900 cursor-pointer transition-colors shadow-2xs"
                                    title="View Invoice & Specs"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>

                              {/* Order items thumbnails */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                {order.items.map((item, iIdx) => (
                                  <div key={iIdx} className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-100">
                                    <img
                                      src={item.productImage || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80'}
                                      alt={item.productTitle}
                                      className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0"
                                    />
                                    <div className="min-w-0">
                                      <h5 className="font-serif font-bold text-xs text-slate-800 truncate">
                                        {item.productTitle}
                                      </h5>
                                      <span className="text-[11px] text-slate-500 block">
                                        Qty: {item.quantity} • {formatPrice(item.price)}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}

                        {myOrders.length === 0 && (
                          <div className="text-center py-16 space-y-3 bg-[#faf8f5] rounded-2xl border border-dashed border-[#ddd8ce]">
                            <Package className="h-8 w-8 text-slate-400 mx-auto" />
                            <h4 className="font-serif text-base font-bold text-slate-800">No Atelier Orders Yet</h4>
                            <p className="text-xs text-slate-500 max-w-sm mx-auto">
                              When you acquire garments from our ready-to-wear collections or book a styling package, orders will display here.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Order Details Modal */}
                    {selectedOrderDetails && (
                      <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                            <div>
                              <span className="text-[10px] uppercase font-bold tracking-widest text-[#b58d59] block">
                                ATELIER ORDER INVOICE
                              </span>
                              <h3 className="font-serif text-xl font-bold text-slate-900">
                                #{selectedOrderDetails.id}
                              </h3>
                            </div>
                            <button
                              onClick={() => setSelectedOrderDetails(null)}
                              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>

                          <div className="space-y-3 text-xs">
                            <div className="flex justify-between py-1 border-b border-slate-100">
                              <span className="text-slate-500">Fulfillment Status:</span>
                              <span className="font-bold text-slate-900">{selectedOrderDetails.fulfillmentStatus}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-100">
                              <span className="text-slate-500">Shipping Courier:</span>
                              <span className="font-bold text-slate-900">{selectedOrderDetails.carrier || 'Express Air Courier'}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-100">
                              <span className="text-slate-500">Delivery Address:</span>
                              <span className="font-medium text-slate-800 text-right max-w-xs">{selectedOrderDetails.shippingAddress}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-100">
                              <span className="text-slate-500">Payment Status:</span>
                              <span className="font-bold text-emerald-700">{selectedOrderDetails.paymentStatus}</span>
                            </div>
                          </div>

                          {/* Garments breakdown */}
                          <div className="space-y-2">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                              Ordered Items
                            </span>
                            <div className="divide-y divide-slate-100">
                              {selectedOrderDetails.items.map((it, idx) => (
                                <div key={idx} className="py-2.5 flex justify-between items-center text-xs">
                                  <div>
                                    <span className="font-serif font-bold text-slate-800 block">{it.productTitle}</span>
                                    <span className="text-[11px] text-slate-500">Qty: {it.quantity}</span>
                                  </div>
                                  <span className="font-mono font-bold text-slate-900">
                                    {formatPrice(it.price * it.quantity)}
                                  </span>
                                </div>
                              ))}
                            </div>
                            <div className="pt-3 border-t border-slate-200 flex justify-between text-sm font-serif font-bold text-slate-900">
                              <span>Total Invoice Value:</span>
                              <span className="text-[#b58d59]">{formatPrice(selectedOrderDetails.totalAmount)}</span>
                            </div>
                          </div>

                          <div className="pt-2 flex gap-3">
                            <button
                              onClick={() => {
                                alert(`Atelier Invoice #${selectedOrderDetails.id} downloaded successfully.`);
                              }}
                              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                            >
                              <Download className="h-4 w-4" />
                              <span>Download PDF</span>
                            </button>
                            <button
                              onClick={() => setSelectedOrderDetails(null)}
                              className="flex-1 bg-[#111111] hover:bg-[#b58d59] text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-colors cursor-pointer"
                            >
                              Close Invoice
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* 3. LOYALTY REWARDS (/pages/account/loyalty-rewards)           */}
                {/* ------------------------------------------------------------- */}
                {activeTab === 'loyalty-rewards' && (
                  <div className="space-y-6">
                    
                    {/* Haute VIP Membership Card */}
                    <div className="bg-gradient-to-br from-[#1a1a1a] via-[#242424] to-[#111111] text-white p-8 rounded-3xl border border-[#333333] shadow-xl relative overflow-hidden space-y-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#b58d59]">
                            ATELIER PRIVILEGE CLUB
                          </span>
                          <h2 className="font-serif text-3xl font-normal text-white">
                            {tierInfo.name}
                          </h2>
                          <p className="text-xs text-slate-400 font-mono">
                            Member Card #{custState.id}
                          </p>
                        </div>
                        <div className="p-3 bg-[#b58d59]/15 border border-[#b58d59]/30 rounded-2xl text-[#b58d59]">
                          <Award className="h-8 w-8" />
                        </div>
                      </div>

                      {/* Tier Milestones Progress */}
                      <div className="space-y-2 pt-4 border-t border-[#333333]">
                        <div className="flex justify-between text-xs text-slate-300">
                          <span>Progress to {tierInfo.nextTier}</span>
                          <span className="text-[#b58d59] font-bold font-mono">{tierInfo.progress}%</span>
                        </div>
                        <div className="h-2 w-full bg-[#333333] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#b58d59] to-[#d4af37] rounded-full transition-all duration-700"
                            style={{ width: `${tierInfo.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Available Promo Vouchers */}
                    <div className="bg-white border border-[#e8e4dc] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                      <h3 className="font-serif text-xl font-normal text-slate-900">
                        Available Boutique Vouchers & Credits
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          {
                            code: 'JADE-VIP-15',
                            discount: '15% Off Any Atelier Capsule',
                            exp: 'Valid through Dec 2026',
                            minSpend: 'No minimum order'
                          },
                          {
                            code: 'COMP-BESPOKE-FIT',
                            discount: 'Free Tailoring Consultation',
                            exp: 'Permanent VIP Benefit',
                            minSpend: 'Includes 1-on-1 virtual fitting'
                          },
                          {
                            code: 'EXPRESS-WHITE-GLOVE',
                            discount: 'Complimentary Express Courier',
                            exp: 'Valid for next 3 allocations',
                            minSpend: 'Applies automatically at checkout'
                          },
                          {
                            code: 'SILHOUETTE-GIFT-50',
                            discount: '$50 Boutique Credit',
                            exp: 'Unlocked at Gold Member tier',
                            minSpend: 'On orders over $250'
                          }
                        ].map((voucher, vIdx) => (
                          <div
                            key={vIdx}
                            className="p-5 rounded-2xl bg-[#faf8f5] border border-[#eee9df] flex justify-between items-center gap-4 hover:border-[#b58d59] transition-all"
                          >
                            <div className="space-y-1">
                              <span className="text-xs font-serif font-bold text-slate-900 block">
                                {voucher.discount}
                              </span>
                              <span className="text-[10.5px] text-slate-500 block font-mono">
                                {voucher.exp} • {voucher.minSpend}
                              </span>
                              <span className="text-xs font-mono font-black text-[#b58d59] bg-[#b58d59]/10 px-2.5 py-0.5 rounded-md inline-block">
                                {voucher.code}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(voucher.code);
                                setCopiedCoupon(voucher.code);
                                setTimeout(() => setCopiedCoupon(null), 2500);
                              }}
                              className="px-3.5 py-2 bg-[#111111] hover:bg-[#b58d59] text-white font-bold text-[10px] uppercase tracking-wider rounded-xl transition-colors cursor-pointer shrink-0"
                            >
                              {copiedCoupon === voucher.code ? 'Copied!' : 'Copy Code'}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tier Benefits Table */}
                    <div className="bg-white border border-[#e8e4dc] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                      <h3 className="font-serif text-lg font-normal text-slate-900">
                        Atelier Tier Privilege Comparison
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-slate-200 text-slate-500 text-[10px] uppercase tracking-wider">
                              <th className="py-2.5">Tier Level</th>
                              <th className="py-2.5">Boutique Discount</th>
                              <th className="py-2.5">Stylist Consults</th>
                              <th className="py-2.5">Alterations</th>
                              <th className="py-2.5">Shipping</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-700">
                            <tr>
                              <td className="py-3 font-bold text-amber-800">Bronze</td>
                              <td className="py-3">5% on capsules</td>
                              <td className="py-3">Standard email</td>
                              <td className="py-3">Standard rates</td>
                              <td className="py-3">Standard</td>
                            </tr>
                            <tr>
                              <td className="py-3 font-bold text-slate-600">Silver</td>
                              <td className="py-3">10% on capsules</td>
                              <td className="py-3">Bi-monthly</td>
                              <td className="py-3">50% waiver</td>
                              <td className="py-3">Express courier</td>
                            </tr>
                            <tr className="bg-amber-50/50 font-semibold">
                              <td className="py-3 font-bold text-[#b58d59]">Haute Gold (Current)</td>
                              <td className="py-3">15% on all items</td>
                              <td className="py-3">Unlimited WhatsApp</td>
                              <td className="py-3">Complimentary</td>
                              <td className="py-3">Priority White Glove</td>
                            </tr>
                            <tr>
                              <td className="py-3 font-bold text-slate-950">Haute Platinum</td>
                              <td className="py-3">20% on all items</td>
                              <td className="py-3">In-person VIP suite</td>
                              <td className="py-3">Bespoke custom cut</td>
                              <td className="py-3">Same-day courier</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* 4. REFERRALS (/pages/account/referrals)                       */}
                {/* ------------------------------------------------------------- */}
                {activeTab === 'referrals' && (
                  <div className="space-y-6">
                    
                    {/* Referral Highlight Banner */}
                    <div className="bg-[#111111] text-white p-8 rounded-3xl border border-[#222222] shadow-xl space-y-6">
                      <div className="space-y-2">
                        <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#b58d59] block">
                          BESPOKE INVITATION PROGRAM
                        </span>
                        <h2 className="font-serif text-2xl sm:text-3xl font-normal text-white">
                          Invite Friends & Receive $50 Atelier Credit
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-light leading-relaxed">
                          Introduce fellow style connoisseurs to Jade Tailor. Your invited guest receives 15% off their debut capsule, and you receive $50 store credit upon their order completion.
                        </p>
                      </div>

                      {/* Referral Code Box */}
                      <div className="bg-[#1a1a1a] p-4 rounded-2xl border border-[#333333] flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase tracking-widest block">
                            Your Personal Invitation Code
                          </span>
                          <span className="font-mono text-lg font-black text-amber-300 select-all tracking-wider">
                            {custState.referralCode || `REF-JT-${custState.name.slice(0, 3).toUpperCase()}-9941`}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <button
                            type="button"
                            onClick={() => {
                              const code = custState.referralCode || `REF-JT-${custState.name.slice(0, 3).toUpperCase()}-9941`;
                              navigator.clipboard.writeText(code);
                              setCopiedReferral(true);
                              setTimeout(() => setCopiedReferral(false), 2500);
                            }}
                            className="flex-1 sm:flex-none px-4 py-2.5 bg-[#b58d59] hover:bg-[#c99d66] text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                          >
                            <Copy className="h-3.5 w-3.5 text-slate-950" />
                            <span>{copiedReferral ? 'Copied Code!' : 'Copy Code'}</span>
                          </button>

                          <a
                            href={`https://wa.me/?text=${encodeURIComponent(`Explore bespoke styling and luxury tailoring by Jade Tailor. Use my exclusive invitation code ${custState.referralCode} for 15% off your first wardrobe allocation: ${typeof window !== 'undefined' ? window.location.origin : ''}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2"
                          >
                            <Share2 className="h-3.5 w-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* How It Works 3-Step */}
                    <div className="bg-white border border-[#e8e4dc] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                      <h3 className="font-serif text-xl font-normal text-slate-900">
                        How The Referral Program Works
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div className="p-5 rounded-2xl bg-[#faf8f5] border border-[#eee9df] space-y-2">
                          <span className="w-7 h-7 rounded-full bg-[#111111] text-[#b58d59] flex items-center justify-center font-bold text-xs">1</span>
                          <h4 className="font-serif font-bold text-slate-900 text-sm">Share Invitation</h4>
                          <p className="text-slate-600 text-[11px] leading-relaxed">
                            Send your personalized referral code or link to friends, family, or professional peers.
                          </p>
                        </div>
                        <div className="p-5 rounded-2xl bg-[#faf8f5] border border-[#eee9df] space-y-2">
                          <span className="w-7 h-7 rounded-full bg-[#111111] text-[#b58d59] flex items-center justify-center font-bold text-xs">2</span>
                          <h4 className="font-serif font-bold text-slate-900 text-sm">Guest Receives 15%</h4>
                          <p className="text-slate-600 text-[11px] leading-relaxed">
                            Your guest applies the code at checkout and receives an immediate 15% inaugural discount.
                          </p>
                        </div>
                        <div className="p-5 rounded-2xl bg-[#faf8f5] border border-[#eee9df] space-y-2">
                          <span className="w-7 h-7 rounded-full bg-[#111111] text-[#b58d59] flex items-center justify-center font-bold text-xs">3</span>
                          <h4 className="font-serif font-bold text-slate-900 text-sm">You Earn $50 Credit</h4>
                          <p className="text-slate-600 text-[11px] leading-relaxed">
                            Upon fulfillment of their allocation, $50 store credit is added directly to your atelier balance.
                          </p>
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
                    
                    <div className="bg-white border border-[#e8e4dc] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-widest text-[#b58d59] block">
                            PAYMENT PREFERENCES
                          </span>
                          <h2 className="font-serif text-2xl font-normal text-slate-900">
                            Saved Payment Methods
                          </h2>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowAddCardModal(true)}
                          className="bg-[#111111] hover:bg-[#b58d59] text-white font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                        >
                          <PlusCircle className="h-4 w-4" />
                          <span>Add New Card</span>
                        </button>
                      </div>

                      {/* Virtual Payment Cards Rendering */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {savedCards.map((card) => (
                          <div
                            key={card.id}
                            className="bg-gradient-to-br from-[#1c1c1f] via-[#2a2a30] to-[#141416] text-white p-6 rounded-3xl border border-[#3a3a42] shadow-lg space-y-6 relative overflow-hidden"
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-mono text-sm font-bold text-[#b58d59]">
                                {card.brand}
                              </span>
                              {card.isDefault && (
                                <span className="text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#b58d59] text-slate-950 font-sans">
                                  Default Method
                                </span>
                              )}
                            </div>

                            <div className="space-y-1">
                              <span className="text-[9px] uppercase tracking-widest text-slate-400 block">Card Number</span>
                              <span className="font-mono text-lg tracking-widest text-white block">
                                •••• •••• •••• {card.last4}
                              </span>
                            </div>

                            <div className="flex justify-between items-end text-xs pt-2 border-t border-[#3a3a42]">
                              <div>
                                <span className="text-[9px] text-slate-400 uppercase tracking-widest block">Cardholder</span>
                                <span className="font-serif tracking-wider text-slate-200">{card.holder}</span>
                              </div>
                              <div>
                                <span className="text-[9px] text-slate-400 uppercase tracking-widest block">Expires</span>
                                <span className="font-mono text-slate-300">{card.exp}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Security Guarantees */}
                      <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#eee9df] flex items-center gap-3 text-xs text-slate-600">
                        <ShieldCheck className="h-5 w-5 text-[#b58d59] shrink-0" />
                        <p className="leading-relaxed text-[11px]">
                          Payment credentials are encrypted with 256-bit bank-grade TLS encryption and processed via certified PCI-DSS Level 1 compliant gateway. Card numbers are never stored in plain text.
                        </p>
                      </div>
                    </div>

                    {/* Add Card Modal */}
                    {showAddCardModal && (
                      <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl">
                          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                            <h3 className="font-serif text-xl font-bold text-slate-900">Add Payment Card</h3>
                            <button
                              onClick={() => setShowAddCardModal(false)}
                              className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>

                          <form onSubmit={handleAddCardSubmit} className="space-y-4 text-xs">
                            <div>
                              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">Cardholder Name</label>
                              <input
                                type="text"
                                required
                                placeholder="VALENTINA GOMEZ"
                                value={newCardHolder}
                                onChange={(e) => setNewCardHolder(e.target.value)}
                                className="w-full border p-3 rounded-xl focus:border-[#b58d59] focus:outline-none uppercase"
                              />
                            </div>
                            <div>
                              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">Card Number</label>
                              <input
                                type="text"
                                required
                                maxLength={19}
                                placeholder="4242 4242 4242 4242"
                                value={newCardNumber}
                                onChange={(e) => setNewCardNumber(e.target.value)}
                                className="w-full border p-3 rounded-xl focus:border-[#b58d59] focus:outline-none font-mono"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">Expiry (MM/YY)</label>
                                <input
                                  type="text"
                                  placeholder="12/28"
                                  maxLength={5}
                                  value={newCardExp}
                                  onChange={(e) => setNewCardExp(e.target.value)}
                                  className="w-full border p-3 rounded-xl focus:border-[#b58d59] focus:outline-none font-mono"
                                />
                              </div>
                              <div>
                                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">CVV / CVC</label>
                                <input
                                  type="password"
                                  placeholder="•••"
                                  maxLength={4}
                                  value={newCardCvv}
                                  onChange={(e) => setNewCardCvv(e.target.value)}
                                  className="w-full border p-3 rounded-xl focus:border-[#b58d59] focus:outline-none font-mono"
                                />
                              </div>
                            </div>

                            <button
                              type="submit"
                              className="w-full bg-[#111111] hover:bg-[#b58d59] text-white font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl transition-colors cursor-pointer shadow-sm"
                            >
                              Save Card Securely
                            </button>
                          </form>
                        </div>
                      </div>
                    )}

                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* 6. ACCOUNT DETAILS (/pages/account/account-details)           */}
                {/* ------------------------------------------------------------- */}
                {activeTab === 'account-details' && (
                  <div className="space-y-6">
                    
                    <div className="bg-white border border-[#e8e4dc] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-[#b58d59] block">
                          CLIENT PROFILE & PREFERENCES
                        </span>
                        <h2 className="font-serif text-2xl font-normal text-slate-900">
                          Account Details
                        </h2>
                      </div>

                      {profileSuccessToast && (
                        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                          <Check className="h-4 w-4 text-emerald-600" />
                          <span>Profile & styling preferences updated successfully!</span>
                        </div>
                      )}

                      <form onSubmit={handleSaveProfile} className="space-y-6 text-xs">
                        {/* Personal Information */}
                        <div className="space-y-4">
                          <h4 className="font-serif text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                            Personal Information
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                Full Name
                              </label>
                              <input
                                type="text"
                                required
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="w-full border border-slate-200 p-3 rounded-xl focus:border-[#b58d59] focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                Email Address
                              </label>
                              <input
                                type="email"
                                required
                                value={editEmail}
                                onChange={(e) => setEditEmail(e.target.value)}
                                className="w-full border border-slate-200 p-3 rounded-xl focus:border-[#b58d59] focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                Phone Number
                              </label>
                              <input
                                type="tel"
                                value={editPhone}
                                onChange={(e) => setEditPhone(e.target.value)}
                                className="w-full border border-slate-200 p-3 rounded-xl focus:border-[#b58d59] focus:outline-none font-mono"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Bespoke Styling Preferences */}
                        <div className="space-y-4 pt-4 border-t border-slate-100">
                          <h4 className="font-serif text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                            Atelier Sizing & Fabric Typology
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                Preferred Garment Fit
                              </label>
                              <select
                                value={editStyleFit}
                                onChange={(e) => setEditStyleFit(e.target.value)}
                                className="w-full border border-slate-200 p-3 rounded-xl focus:border-[#b58d59] focus:outline-none bg-white"
                              >
                                <option value="Bespoke Tailored">Bespoke Tailored</option>
                                <option value="Slim Editorial Cut">Slim Editorial Cut</option>
                                <option value="Relaxed Capsule">Relaxed Capsule</option>
                                <option value="Oversized Runway">Oversized Runway</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                Sizing Benchmark
                              </label>
                              <input
                                type="text"
                                value={editSuitSize}
                                onChange={(e) => setEditSuitSize(e.target.value)}
                                placeholder="e.g. 40R / Medium"
                                className="w-full border border-slate-200 p-3 rounded-xl focus:border-[#b58d59] focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                Preferred Textiles
                              </label>
                              <input
                                type="text"
                                value={editFavFabric}
                                onChange={(e) => setEditFavFabric(e.target.value)}
                                placeholder="e.g. Cashmere, Virgin Wool"
                                className="w-full border border-slate-200 p-3 rounded-xl focus:border-[#b58d59] focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="pt-2">
                          <button
                            type="submit"
                            className="bg-[#111111] hover:bg-[#b58d59] text-white font-bold text-xs uppercase tracking-widest py-3.5 px-8 rounded-xl transition-all cursor-pointer shadow-sm"
                          >
                            Save Client Profile
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
                    
                    <div className="bg-white border border-[#e8e4dc] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-widest text-[#b58d59] block">
                            SHIPPING DESTINATIONS
                          </span>
                          <h2 className="font-serif text-2xl font-normal text-slate-900">
                            Delivery Addresses ({custState.addresses?.length || 1})
                          </h2>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowAddressModal(true)}
                          className="bg-[#111111] hover:bg-[#b58d59] text-white font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                        >
                          <PlusCircle className="h-4 w-4" />
                          <span>Add New Address</span>
                        </button>
                      </div>

                      {addressToast && (
                        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                          <Check className="h-4 w-4 text-emerald-600" />
                          <span>{addressToast}</span>
                        </div>
                      )}

                      {/* Addresses List Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(custState.addresses || ['Flat 402, Signature Palms, Bandra West, Mumbai 400050, India']).map((addr, idx) => (
                          <div
                            key={idx}
                            className="p-5 rounded-2xl bg-[#faf8f5] border border-[#eee9df] space-y-4 hover:border-[#b58d59] transition-all relative"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2">
                                <span className="p-1.5 rounded-lg bg-slate-200 text-slate-700">
                                  <MapPin className="h-4 w-4" />
                                </span>
                                <h4 className="font-serif font-bold text-slate-900 text-sm">
                                  {idx === 0 ? 'Primary Atelier Address' : `Address #${idx + 1}`}
                                </h4>
                              </div>
                              {idx === 0 && (
                                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-[#b58d59] text-white">
                                  Default
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-slate-600 leading-relaxed font-medium">
                              {addr}
                            </p>

                            <div className="pt-2 border-t border-[#e8e4dc] flex justify-between items-center text-xs">
                              <span className="text-[11px] text-slate-400">Recipient: {custState.name}</span>
                              {idx !== 0 && (
                                <button
                                  type="button"
                                  onClick={() => onRemoveAddress(idx)}
                                  className="text-rose-600 hover:text-rose-800 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  <span>Remove</span>
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Add Address Modal */}
                    {showAddressModal && (
                      <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl">
                          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                            <h3 className="font-serif text-xl font-bold text-slate-900">Add Delivery Address</h3>
                            <button
                              onClick={() => setShowAddressModal(false)}
                              className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>

                          <form onSubmit={handleAddAddressSubmit} className="space-y-4 text-xs">
                            <div>
                              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">Street Address</label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. 104 Heritage Boulevard"
                                value={addrStreet}
                                onChange={(e) => setAddrStreet(e.target.value)}
                                className="w-full border p-3 rounded-xl focus:border-[#b58d59] focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">Apt, Suite, Unit (Optional)</label>
                              <input
                                type="text"
                                placeholder="e.g. Suite 4B"
                                value={addrApt}
                                onChange={(e) => setAddrApt(e.target.value)}
                                className="w-full border p-3 rounded-xl focus:border-[#b58d59] focus:outline-none"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">City</label>
                                <input
                                  type="text"
                                  required
                                  placeholder="Mumbai"
                                  value={addrCity}
                                  onChange={(e) => setAddrCity(e.target.value)}
                                  className="w-full border p-3 rounded-xl focus:border-[#b58d59] focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">State / Province</label>
                                <input
                                  type="text"
                                  placeholder="Maharashtra"
                                  value={addrState}
                                  onChange={(e) => setAddrState(e.target.value)}
                                  className="w-full border p-3 rounded-xl focus:border-[#b58d59] focus:outline-none"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">PIN / Postal Code</label>
                                <input
                                  type="text"
                                  placeholder="400050"
                                  value={addrZip}
                                  onChange={(e) => setAddrZip(e.target.value)}
                                  className="w-full border p-3 rounded-xl focus:border-[#b58d59] focus:outline-none font-mono"
                                />
                              </div>
                              <div>
                                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">Country</label>
                                <input
                                  type="text"
                                  value={addrCountry}
                                  onChange={(e) => setAddrCountry(e.target.value)}
                                  className="w-full border p-3 rounded-xl focus:border-[#b58d59] focus:outline-none"
                                />
                              </div>
                            </div>

                            <button
                              type="submit"
                              className="w-full bg-[#111111] hover:bg-[#b58d59] text-white font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl transition-colors cursor-pointer shadow-sm"
                            >
                              Save Address
                            </button>
                          </form>
                        </div>
                      </div>
                    )}

                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* 8. HELP & SUPPORT (/pages/account/help)                       */}
                {/* ------------------------------------------------------------- */}
                {activeTab === 'help' && (
                  <div className="space-y-6">
                    
                    {/* Priority Concierge Header */}
                    <div className="bg-[#111111] text-white p-8 rounded-3xl border border-[#222222] shadow-xl space-y-4">
                      <div className="flex items-center gap-2 text-[#b58d59]">
                        <Sparkles className="h-4 w-4" />
                        <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#b58d59]">
                          DEDICATED ATELIER ASSISTANCE
                        </span>
                      </div>
                      <h2 className="font-serif text-2xl sm:text-3xl font-normal text-white">
                        Personal Stylist Concierge Desk
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-light leading-relaxed">
                        Have questions about garment tailoring, sizing adjustments, or private consultation booking? Contact Jade Tailor directly via phone, WhatsApp, or the priority message desk.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                        <a
                          href="tel:+919876543210"
                          className="p-4 rounded-2xl bg-[#1e1e24] border border-[#2e2e38] hover:border-[#b58d59] transition-colors flex items-center gap-3 text-xs"
                        >
                          <Phone className="h-5 w-5 text-[#b58d59]" />
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase tracking-widest block">Atelier Hotline</span>
                            <span className="font-bold text-white font-mono">+91 98765 43210</span>
                          </div>
                        </a>
                        <a
                          href="https://wa.me/919876543210"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-4 rounded-2xl bg-[#1e1e24] border border-[#2e2e38] hover:border-emerald-500 transition-colors flex items-center gap-3 text-xs"
                        >
                          <MessageSquare className="h-5 w-5 text-emerald-400" />
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase tracking-widest block">WhatsApp Styling</span>
                            <span className="font-bold text-emerald-400">Direct Chat</span>
                          </div>
                        </a>
                        <div className="p-4 rounded-2xl bg-[#1e1e24] border border-[#2e2e38] flex items-center gap-3 text-xs">
                          <Clock className="h-5 w-5 text-[#b58d59]" />
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase tracking-widest block">Consultation Hours</span>
                            <span className="font-bold text-slate-200">10:00 AM – 7:00 PM IST</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Inquiry Message Form & FAQs */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      
                      {/* Left 7 Cols: Inquiry Message Box */}
                      <div className="lg:col-span-7 bg-white border border-[#e8e4dc] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                        <h3 className="font-serif text-lg font-bold text-slate-900">
                          Submit Priority Client Inquiry
                        </h3>

                        {conciergeSent ? (
                          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 space-y-1">
                            <h4 className="font-bold text-xs">Inquiry Dispatched to Stylist Desk</h4>
                            <p className="text-[11px] text-emerald-700">
                              Jade Tailor will personally review your request and get in touch within 2 hours.
                            </p>
                          </div>
                        ) : (
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              if (!conciergeMsg) return;
                              setConciergeSent(true);
                              setTimeout(() => {
                                setConciergeMsg('');
                                setConciergeSent(false);
                              }, 4000);
                            }}
                            className="space-y-4 text-xs"
                          >
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                Subject
                              </label>
                              <select
                                value={conciergeSubject}
                                onChange={(e) => setConciergeSubject(e.target.value)}
                                className="w-full border border-slate-200 p-3 rounded-xl focus:border-[#b58d59] focus:outline-none bg-white"
                              >
                                <option value="Bespoke Consultation Inquiry">Bespoke Consultation Inquiry</option>
                                <option value="Garment Alterations & Fitting">Garment Alterations & Fitting</option>
                                <option value="Active Order Progression">Active Order Progression</option>
                                <option value="Styling Package Booking">Styling Package Booking</option>
                                <option value="Other Concierge Service">Other Concierge Service</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                Your Message
                              </label>
                              <textarea
                                required
                                rows={4}
                                placeholder="Describe your request or fitting inquiry..."
                                value={conciergeMsg}
                                onChange={(e) => setConciergeMsg(e.target.value)}
                                className="w-full border border-slate-200 p-3 rounded-xl focus:border-[#b58d59] focus:outline-none"
                              />
                            </div>

                            <button
                              type="submit"
                              className="w-full bg-[#111111] hover:bg-[#b58d59] text-white font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                            >
                              <Send className="h-3.5 w-3.5" />
                              <span>Dispatch Inquiry</span>
                            </button>
                          </form>
                        )}
                      </div>

                      {/* Right 5 Cols: Accordion FAQs */}
                      <div className="lg:col-span-5 bg-white border border-[#e8e4dc] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                        <h3 className="font-serif text-lg font-bold text-slate-900">
                          Frequently Answered
                        </h3>

                        <div className="space-y-3 text-xs text-slate-700">
                          {[
                            {
                              q: 'How do alterations work?',
                              a: 'All garments include complimentary hem and sleeve alterations. Request an adjustment through this portal and our courier will collect the item.'
                            },
                            {
                              q: 'What are shipping lead times?',
                              a: 'Ready-to-wear orders dispatch within 2 business days. Bespoke tailoring takes 7–10 days from pattern cut to final hand pressing.'
                            },
                            {
                              q: 'Can I swap a size after ordering?',
                              a: 'Yes, if your order is still in Fabric Cut or Pattern phase, you can request an instant size adjustment with zero fee.'
                            }
                          ].map((faq, fIdx) => (
                            <details key={fIdx} className="group p-3 rounded-xl bg-[#faf8f5] border border-[#eee9df]">
                              <summary className="font-serif font-bold text-slate-900 cursor-pointer flex justify-between items-center">
                                <span>{faq.q}</span>
                                <ChevronDown className="h-4 w-4 text-slate-400 group-open:rotate-180 transition-transform" />
                              </summary>
                              <p className="mt-2 text-[11px] text-slate-600 leading-relaxed font-light">
                                {faq.a}
                              </p>
                            </details>
                          ))}
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

    </div>
  );
}
