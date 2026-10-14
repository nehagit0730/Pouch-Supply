import React, { useState, useEffect } from 'react';
import { Customer, Product, Order } from '../types';
import { 
  X, User, LogIn, Heart, MapPin, Package, ShoppingBag, 
  Plus, Trash2, Eye, ShieldCheck, Sparkles, ArrowRight,
  Truck, Check, Clock, Mail, ChevronRight, Star,
  Award, Share2, CreditCard, LifeBuoy, LogOut, CheckCircle2,
  ExternalLink, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatPrice } from '../utils/currency';

interface CustomerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  loggedInCustomer: Customer | null;
  onLogin: (customer: Customer) => void;
  onLogout: () => void;
  onUpdateWishlist: (productId: string, action: 'add' | 'remove') => void;
  onAddToCart: (product: Product, quantity: number) => void;
  allProducts: Product[];
  orders: Order[];
  onAddAddress: (address: string) => void;
  onRemoveAddress: (index: number) => void;
  onOpenCart: () => void;
  initialTab?: 'orders' | 'addresses' | 'wishlist' | 'emails';
  onNavigateToPortal?: (targetSlug?: string) => void;
}

const PORTAL_PAGES = [
  { slug: 'dashboard', label: 'Dashboard', icon: Sparkles },
  { slug: 'orders', label: 'Orders', icon: Package },
  { slug: 'loyalty-rewards', label: 'Loyalty Rewards', icon: Award },
  { slug: 'referrals', label: 'Referrals', icon: Share2 },
  { slug: 'payment-methods', label: 'Payment Methods', icon: CreditCard },
  { slug: 'account-details', label: 'Account Details', icon: User },
  { slug: 'delivery-addresses', label: 'Delivery Addresses', icon: MapPin },
  { slug: 'help', label: 'Help & Support', icon: LifeBuoy },
];

export default function CustomerDrawer({
  isOpen,
  onClose,
  customers,
  loggedInCustomer,
  onLogin,
  onLogout,
  onUpdateWishlist,
  onAddToCart,
  allProducts,
  orders,
  onAddAddress,
  onRemoveAddress,
  onOpenCart,
  initialTab = 'orders',
  onNavigateToPortal
}: CustomerDrawerProps) {
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'wishlist' | 'emails'>(initialTab);
  const [emailsList, setEmailsList] = useState<any[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<any | null>(null);

  const loadEmails = () => {
    try {
      const stored = localStorage.getItem('ps_simulated_emails');
      if (stored) {
        setEmailsList(JSON.parse(stored));
      } else {
        setEmailsList([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadEmails();
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  useEffect(() => {
    window.addEventListener('ps-emails-updated', loadEmails);
    return () => {
      window.removeEventListener('ps-emails-updated', loadEmails);
    };
  }, []);

  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Addresses States
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newStreetAddress, setNewStreetAddress] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newPostal, setNewPostal] = useState('');

  // Expandable Order details Accordion
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Quick Tracker for guest
  const [guestOrderQuery, setGuestOrderQuery] = useState('');
  const [guestTrackedOrder, setGuestTrackedOrder] = useState<Order | null>(null);
  const [guestTrackerErr, setGuestTrackerErr] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (authMode === 'signup' && !nameInput.trim()) {
      setErrorMsg('Please provide your full legal name.');
      return;
    }
    if (!emailInput.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    if (!passwordInput) {
      setErrorMsg('Please enter your password.');
      return;
    }
    if (authMode === 'signup' && passwordInput !== confirmPasswordInput) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    
    setIsSubmitting(true);

    try {
      const email = emailInput.toLowerCase().trim();
      const endpoint = authMode === 'signup' ? '/api/customers/signup' : '/api/customers/login';
      const bodyPayload = authMode === 'signup' 
        ? { name: nameInput.trim(), email, password: passwordInput }
        : { email, password: passwordInput };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload)
      });

      const data = await response.json();

      if (response.ok) {
        onLogin(data.customer);
        setErrorMsg('');
        setEmailInput('');
        setPasswordInput('');
        setNameInput('');
        setConfirmPasswordInput('');
      } else {
        // Fallback to local demo list match if server is mock
        const localMatch = customers.find(c => c.email.toLowerCase() === email);
        if (localMatch) {
          onLogin(localMatch);
          setErrorMsg('');
        } else {
          // If signup locally
          if (authMode === 'signup') {
            const newCust: Customer = {
              id: `cust-${Date.now()}`,
              name: nameInput.trim(),
              email,
              amountSpent: 0,
              ordersCount: 0,
              location: 'London, UK',
              subscriptionStatus: 'Subscribed',
              tags: ['Private Client'],
              addresses: ['Mayfair Residences, London W1J, United Kingdom'],
              wishlist: [],
              referralCode: `REF-JT-${nameInput.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`
            };
            onLogin(newCust);
          } else {
            throw new Error(data.error || 'Authentication failed. Please verify credentials.');
          }
        }
      }
    } catch (err: any) {
      // Local fallback for smooth testing
      const localMatch = customers.find(c => c.email.toLowerCase() === emailInput.toLowerCase().trim());
      if (localMatch) {
        onLogin(localMatch);
      } else {
        setErrorMsg(err.message || 'Unable to sign in. Please verify your email.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const myOrders = loggedInCustomer 
    ? orders.filter(o => o.customerEmail.toLowerCase().trim() === loggedInCustomer.email.toLowerCase().trim()) 
    : [];

  const handleAddAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreetAddress.trim()) return;
    const full = `${newStreetAddress.trim()}${newCity ? `, ${newCity}` : ''}${newState ? `, ${newState}` : ''}${newPostal ? ` ${newPostal}` : ''}`;
    onAddAddress(full);
    setNewStreetAddress('');
    setNewCity('');
    setNewState('');
    setNewPostal('');
    setShowAddressForm(false);
  };

  const handleQuickLogin = (cust: Customer) => {
    setEmailInput(cust.email);
    setPasswordInput('password123');
    onLogin(cust);
  };

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const handleGuestTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setGuestTrackerErr('');
    setGuestTrackedOrder(null);
    const q = guestOrderQuery.trim().toUpperCase();
    if (!q) {
      setGuestTrackerErr('Enter an order ID (e.g. PS48884).');
      return;
    }
    const found = orders.find(o => o.id.toUpperCase() === q || o.id.includes(q));
    if (found) {
      setGuestTrackedOrder(found);
    } else {
      setGuestTrackerErr(`No atelier commission found with reference "${guestOrderQuery}".`);
    }
  };

  // Star & VIP Tier
  const getTierName = (count: number) => {
    if (count >= 30) return 'Haute Platinum Patron';
    if (count >= 15) return 'Haute Gold Member';
    if (count >= 5) return 'Silver Atelier Client';
    return 'Bronze Atelier Client';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Dark backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-[#0c0d10]/70 backdrop-blur-xs cursor-pointer"
            onClick={onClose}
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
            {/* Slide-in customer drawer panel */}
            <motion.div 
              id="customer-drawer-panel" 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              className="w-screen max-w-md bg-[#FAF8F5] text-slate-900 flex flex-col h-full shadow-2xl border-l border-[#E6E0D6] relative z-10"
            >
              {/* Luxury Atelier Drawer Header */}
              <div className="px-5 py-4 border-b border-[#E6E0D6] flex items-center justify-between bg-[#141416] text-white shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C5A880] to-[#8C6B3E] flex items-center justify-center text-slate-950 font-serif font-black text-xs shadow-sm">
                    JT
                  </div>
                  <div>
                    <h2 className="text-xs font-bold tracking-[0.18em] uppercase text-white font-sans">
                      Jade Tailor
                    </h2>
                    <p className="text-[10px] text-[#C5A880] font-serif italic">
                      {loggedInCustomer ? 'Private Client Suite' : 'Atelier Client Access'}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg bg-[#222226] hover:bg-[#2F2F34] text-slate-400 hover:text-white transition-colors cursor-pointer border border-[#2D2D32]"
                  title="Close Client Drawer"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Drawer Body content */}
              <div className="flex-1 overflow-y-auto min-h-0 flex flex-col">
                {!loggedInCustomer ? (
                  /* ========================================================= */
                  /* GUEST LOGIN & ONBOARDING EXPERIENCE                       */
                  /* ========================================================= */
                  <div className="p-6 flex flex-col justify-between min-h-full space-y-6">
                    <div className="space-y-6">
                      
                      {/* Editorial Welcome Card */}
                      <div className="bg-[#141416] text-white p-5 rounded-2xl border border-[#2A2A2E] space-y-2 shadow-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-[9.5px] uppercase font-bold tracking-[0.2em] text-[#C5A880]">
                            Bespoke Client Privilege
                          </span>
                          <Sparkles className="h-3.5 w-3.5 text-[#C5A880]" />
                        </div>
                        <h3 className="font-serif text-lg font-normal text-white">
                          Welcome to the Atelier
                        </h3>
                        <p className="text-[11.5px] text-slate-300 leading-relaxed font-light">
                          Sign in to monitor active garment tailoring, manage delivery residences, and view VIP boutique loyalty privileges.
                        </p>
                      </div>

                      {/* Mode Toggle Switcher */}
                      <div className="grid grid-cols-2 p-1 bg-[#ECE7DE] rounded-xl border border-[#DFD9CD]">
                        <button
                          type="button"
                          onClick={() => { setAuthMode('login'); setErrorMsg(''); }}
                          className={`py-2 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer text-center ${
                            authMode === 'login'
                              ? 'bg-white text-slate-950 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Sign In
                        </button>
                        <button
                          type="button"
                          onClick={() => { setAuthMode('signup'); setErrorMsg(''); }}
                          className={`py-2 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer text-center ${
                            authMode === 'signup'
                              ? 'bg-white text-slate-950 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Register Suite
                        </button>
                      </div>

                      {/* Form */}
                      <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                        {authMode === 'signup' && (
                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                              Full Legal Name
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Valentina Gomez"
                              value={nameInput}
                              onChange={(e) => setNameInput(e.target.value)}
                              className="w-full text-xs font-medium border border-[#DCD5C9] bg-white p-3 rounded-xl focus:outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880]"
                              required
                            />
                          </div>
                        )}

                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            placeholder="client@luxury.com"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            className="w-full text-xs font-medium border border-[#DCD5C9] bg-white p-3 rounded-xl focus:outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880]"
                            required
                          />
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                              Password
                            </label>
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="text-[10px] text-slate-500 hover:text-slate-800"
                            >
                              {showPassword ? 'Hide' : 'Show'}
                            </button>
                          </div>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••••••"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            className="w-full text-xs font-medium border border-[#DCD5C9] bg-white p-3 rounded-xl focus:outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880]"
                            required
                          />
                        </div>

                        {authMode === 'signup' && (
                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                              Confirm Password
                            </label>
                            <input
                              type={showPassword ? 'text' : 'password'}
                              placeholder="••••••••••••"
                              value={confirmPasswordInput}
                              onChange={(e) => setConfirmPasswordInput(e.target.value)}
                              className="w-full text-xs font-medium border border-[#DCD5C9] bg-white p-3 rounded-xl focus:outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880]"
                              required
                            />
                          </div>
                        )}

                        {errorMsg && (
                          <p className="text-[11px] text-rose-700 bg-rose-50 border border-rose-200 p-2.5 rounded-xl font-medium">
                            {errorMsg}
                          </p>
                        )}

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-[#141416] hover:bg-[#25252A] disabled:bg-slate-400 text-white font-bold text-xs uppercase tracking-[0.16em] py-3.5 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-1"
                        >
                          {isSubmitting ? (
                            <span>Authenticating Client...</span>
                          ) : (
                            <>
                              <LogIn className="h-3.5 w-3.5 text-[#C5A880]" />
                              <span>{authMode === 'login' ? 'Unlock Private Suite' : 'Create Client Suite'}</span>
                            </>
                          )}
                        </button>
                      </form>

                      {/* Guest Order Lookup */}
                      <div className="p-4 rounded-2xl bg-white border border-[#E2DBD0] space-y-3 shadow-3xs">
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-[#C5A880]" />
                          <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-800">
                            Guest Shipment Lookup
                          </span>
                        </div>
                        <form onSubmit={handleGuestTrack} className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Order ID (e.g. PS48884)"
                            value={guestOrderQuery}
                            onChange={(e) => setGuestOrderQuery(e.target.value)}
                            className="flex-1 text-xs font-mono uppercase bg-[#FAF8F5] border border-[#DCD5C9] p-2.5 rounded-xl focus:outline-none focus:border-[#C5A880]"
                          />
                          <button
                            type="submit"
                            className="px-3.5 py-2.5 bg-[#141416] hover:bg-[#2A2A2E] text-white text-xs font-bold rounded-xl cursor-pointer"
                          >
                            <Search className="h-3.5 w-3.5" />
                          </button>
                        </form>

                        {guestTrackerErr && (
                          <p className="text-[10px] text-rose-600 font-medium">{guestTrackerErr}</p>
                        )}

                        {guestTrackedOrder && (
                          <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E6E0D6] space-y-1 text-xs">
                            <div className="flex justify-between items-center">
                              <span className="font-mono font-bold text-slate-900">{guestTrackedOrder.id}</span>
                              <span className="text-[9.5px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                {guestTrackedOrder.fulfillmentStatus}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600">
                              Recipient: <strong>{guestTrackedOrder.customerName}</strong>
                            </p>
                            <p className="text-[11px] text-slate-500">
                              Total: <strong>{formatPrice(guestTrackedOrder.total)}</strong>
                            </p>
                          </div>
                        )}
                      </div>

                    </div>

                    {/* Security Footer */}
                    <div className="pt-4 border-t border-[#E6E0D6] flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-medium">
                      <ShieldCheck className="h-3.5 w-3.5 text-[#C5A880]" />
                      <span>256-Bit Encrypted Jade Tailor Client Vault</span>
                    </div>

                  </div>
                ) : (
                  /* ========================================================= */
                  /* AUTHENTICATED PRIVATE CLIENT SUITE DRAWER                 */
                  /* ========================================================= */
                  <div className="flex flex-col h-full">
                    
                    {/* Client Header Card */}
                    <div className="p-5 bg-[#141416] text-white border-b border-[#2A2A2E] space-y-4 shrink-0 shadow-md">
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-[#242428] border border-[#3A3A40] flex items-center justify-center font-serif text-sm font-bold text-[#C5A880] shrink-0">
                            {loggedInCustomer.name.split(' ').map(n => n[0]).join('').slice(0, 2) || 'JT'}
                          </div>
                          <div className="min-w-0">
                            <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-[#C5A880] block">
                              {getTierName(loggedInCustomer.ordersCount)}
                            </span>
                            <h3 className="font-serif text-sm sm:text-base font-normal text-white truncate">
                              {loggedInCustomer.name}
                            </h3>
                            <p className="font-mono text-[10px] text-slate-400 truncate">
                              {loggedInCustomer.email}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={onLogout}
                          className="text-[10px] bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 text-rose-300 font-bold py-1.5 px-2.5 rounded-lg cursor-pointer transition-all shrink-0 flex items-center gap-1"
                          title="Sign Out"
                        >
                          <LogOut className="h-3 w-3" />
                          <span>Exit</span>
                        </button>
                      </div>

                      {/* Client Key Metrics Row */}
                      <div className="grid grid-cols-3 gap-2 border-t border-[#2A2A2E] pt-3 text-center">
                        <div className="bg-[#1C1C20] p-2 rounded-xl border border-[#2E2E34]">
                          <span className="text-[8.5px] uppercase tracking-wider text-slate-400 block font-medium">Commissions</span>
                          <span className="text-xs font-bold text-white block mt-0.5">{myOrders.length} orders</span>
                        </div>
                        <div className="bg-[#1C1C20] p-2 rounded-xl border border-[#2E2E34]">
                          <span className="text-[8.5px] uppercase tracking-wider text-slate-400 block font-medium">Investment</span>
                          <span className="text-xs font-bold text-[#C5A880] block mt-0.5">{formatPrice(loggedInCustomer.amountSpent)}</span>
                        </div>
                        <div className="bg-[#1C1C20] p-2 rounded-xl border border-[#2E2E34]">
                          <span className="text-[8.5px] uppercase tracking-wider text-slate-400 block font-medium">Boutique Tier</span>
                          <span className="text-[10px] font-bold text-emerald-400 block mt-0.5 truncate">Active VIP</span>
                        </div>
                      </div>

                      {/* Main CTA to Open Full Portal */}
                      <button
                        onClick={() => {
                          if (onNavigateToPortal) {
                            onNavigateToPortal('dashboard');
                          }
                        }}
                        className="w-full bg-[#C5A880] hover:bg-[#D5B890] text-slate-950 font-bold text-xs uppercase tracking-[0.16em] py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:scale-[1.01] active:scale-[0.99]"
                      >
                        <span>Open Customer Portal</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>

                      {/* Direct Portal Page Quick-Links Grid */}
                      <div className="pt-2 border-t border-[#2A2A2E]">
                        <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400 block mb-2">
                          Portal Pages Quick-Jump
                        </span>
                        <div className="grid grid-cols-4 gap-1.5">
                          {PORTAL_PAGES.map((page) => {
                            const Icon = page.icon;
                            return (
                              <button
                                key={page.slug}
                                onClick={() => {
                                  if (onNavigateToPortal) {
                                    onNavigateToPortal(page.slug);
                                  }
                                }}
                                className="p-1.5 rounded-lg bg-[#1F1F24] hover:bg-[#2B2B32] text-slate-300 hover:text-white border border-[#2D2D34] transition-all text-center cursor-pointer flex flex-col items-center gap-1 group"
                                title={`Open /pages/account/${page.slug}`}
                              >
                                <Icon className="h-3.5 w-3.5 text-[#C5A880] group-hover:scale-110 transition-transform" />
                                <span className="text-[8.5px] font-medium leading-tight truncate w-full block">
                                  {page.label}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                    </div>

                    {/* Navigation Tabs for the Account drawer */}
                    <div className="flex border-b border-[#E6E0D6] bg-[#F2EDE4] p-1.5 gap-1 shrink-0 overflow-x-auto">
                      <button
                        onClick={() => setActiveTab('orders')}
                        className={`flex-1 min-w-[75px] py-2 px-2 text-center text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                          activeTab === 'orders' 
                            ? 'bg-white text-slate-950 shadow-xs border border-[#DFD9CD]' 
                            : 'text-slate-600 hover:text-slate-900 hover:bg-[#ECE6DC]'
                        }`}
                      >
                        <Package className="h-3 w-3 inline-block mr-1 -mt-0.5 text-slate-500" />
                        Orders ({myOrders.length})
                      </button>
                      <button
                        onClick={() => setActiveTab('addresses')}
                        className={`flex-1 min-w-[75px] py-2 px-2 text-center text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                          activeTab === 'addresses' 
                            ? 'bg-white text-slate-950 shadow-xs border border-[#DFD9CD]' 
                            : 'text-slate-600 hover:text-slate-900 hover:bg-[#ECE6DC]'
                        }`}
                      >
                        <MapPin className="h-3 w-3 inline-block mr-1 -mt-0.5 text-slate-500" />
                        Addresses
                      </button>
                      <button
                        onClick={() => setActiveTab('wishlist')}
                        className={`flex-1 min-w-[75px] py-2 px-2 text-center text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                          activeTab === 'wishlist' 
                            ? 'bg-white text-slate-950 shadow-xs border border-[#DFD9CD]' 
                            : 'text-slate-600 hover:text-slate-900 hover:bg-[#ECE6DC]'
                        }`}
                      >
                        <Heart className="h-3 w-3 inline-block mr-1 -mt-0.5 text-slate-500" />
                        Wishlist
                      </button>
                      <button
                        onClick={() => setActiveTab('emails')}
                        className={`flex-1 min-w-[75px] py-2 px-2 text-center text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                          activeTab === 'emails' 
                            ? 'bg-white text-slate-950 shadow-xs border border-[#DFD9CD]' 
                            : 'text-slate-600 hover:text-slate-900 hover:bg-[#ECE6DC]'
                        }`}
                      >
                        <Mail className="h-3 w-3 inline-block mr-1 -mt-0.5 text-slate-500" />
                        Inbox
                      </button>
                    </div>

                    {/* Tab contents */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      
                      {/* 1. ORDERS TAB */}
                      {activeTab === 'orders' && (
                        <div className="space-y-3">
                          {myOrders.length === 0 ? (
                            <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-[#DCD5C9] p-6 space-y-2">
                              <Package className="h-8 w-8 text-slate-300 mx-auto" />
                              <p className="text-xs text-slate-700 font-bold uppercase tracking-wider">No Active Commissions</p>
                              <p className="text-[11px] text-slate-500 max-w-xs mx-auto leading-relaxed">
                                Your tailoring commissions and garment purchases will appear here with live tracking.
                              </p>
                            </div>
                          ) : (
                            myOrders.map((order) => {
                              const isExpanded = expandedOrderId === order.id;
                              return (
                                <div 
                                  key={order.id} 
                                  className="bg-white border border-[#E4DDD2] hover:border-[#C5A880] rounded-2xl p-4 transition-all shadow-3xs"
                                >
                                  {/* Order Header Summary Row */}
                                  <div className="flex justify-between items-start gap-2">
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2">
                                        <span className="font-mono font-bold text-xs text-slate-950">{order.id}</span>
                                        <span className={`text-[8.5px] font-bold uppercase py-0.5 px-2 rounded-full leading-none ${
                                          order.fulfillmentStatus === 'Fulfilled' || order.fulfillmentStatus === 'Delivered'
                                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                                            : 'bg-amber-50 text-amber-900 border border-amber-200'
                                        }`}>
                                          {order.fulfillmentStatus}
                                        </span>
                                      </div>
                                      <p className="text-[10px] text-slate-400 font-mono">{order.date}</p>
                                    </div>

                                    <div className="text-right space-y-1">
                                      <div className="text-xs font-bold text-slate-950">{formatPrice(order.total)}</div>
                                      <button
                                        onClick={() => toggleOrderExpand(order.id)}
                                        className="text-[10px] font-bold text-[#8C6B3E] hover:text-slate-900 uppercase tracking-wider flex items-center gap-1 cursor-pointer ml-auto"
                                      >
                                        <Eye className="h-3 w-3" />
                                        <span>{isExpanded ? 'Hide' : 'Track'}</span>
                                      </button>
                                    </div>
                                  </div>

                                  {/* Expandable Order Detail Accordion */}
                                  <AnimatePresence>
                                    {isExpanded && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                      >
                                        <div className="pt-3.5 mt-3.5 border-t border-[#EFEAE2] space-y-3 text-xs">
                                          
                                          {/* Fulfillment details */}
                                          <div className="space-y-1 text-[11px] bg-[#FAF8F5] p-3 rounded-xl border border-[#EAE4D9]">
                                            <p className="text-slate-700">📍 Destination: {order.destination || 'Primary Residence'}</p>
                                            <p className="text-slate-500">🚚 Courier: {order.deliveryMethod || 'White-Glove Atelier Courier'}</p>
                                          </div>

                                          {/* Live Timeline Tracker */}
                                          <div className="bg-[#FAF8F5] border border-[#EAE4D9] p-3.5 rounded-xl space-y-3">
                                            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                                              <Truck className="h-3 w-3 text-[#C5A880]" />
                                              Live Shipment Tracker
                                            </span>

                                            <div className="relative pl-5 space-y-3 before:absolute before:left-1.5 before:top-1 before:bottom-1 before:w-0.5 before:bg-[#DCD5C9]">
                                              {[
                                                { label: 'Commission Confirmed', date: order.date, completed: true },
                                                { label: 'Atelier Tailoring & Prep', date: 'In Progress', completed: true },
                                                { label: 'Dispatched via Courier', date: order.fulfillmentStatus === 'Delivered' ? 'Completed' : 'Pending', completed: order.fulfillmentStatus === 'Delivered' },
                                                { label: 'Delivered at Residence', date: order.fulfillmentStatus === 'Delivered' ? 'Delivered' : 'Estimated soon', completed: order.fulfillmentStatus === 'Delivered' }
                                              ].map((step, idx) => (
                                                <div key={idx} className="relative">
                                                  <div className={`absolute -left-[18.5px] top-1 h-2.5 w-2.5 rounded-full border-2 ${
                                                    step.completed ? 'bg-[#C5A880] border-[#C5A880]' : 'bg-white border-slate-300'
                                                  }`} />
                                                  <div className="leading-tight">
                                                    <span className="text-[10px] font-bold text-slate-900 block">{step.label}</span>
                                                    <span className="text-[9px] text-slate-400 font-mono">{step.date}</span>
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          </div>

                                          {/* Item list */}
                                          <div className="space-y-1.5">
                                            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                                              Garments in Commission ({order.items.length})
                                            </span>
                                            <div className="divide-y divide-[#EFEAE2] border border-[#EAE4D9] rounded-xl overflow-hidden bg-white">
                                              {order.items.map((item, idx) => {
                                                const matched = allProducts.find(p => p.id === item.productId);
                                                return (
                                                  <div key={idx} className="p-2.5 flex items-center justify-between text-xs">
                                                    <div className="flex items-center gap-2.5 min-w-0">
                                                      <img 
                                                        src={matched?.image || item.image} 
                                                        alt="" 
                                                        className="w-9 h-9 rounded-lg object-contain bg-[#FAF8F5] border border-[#EAE4D9] shrink-0" 
                                                      />
                                                      <div className="min-w-0">
                                                        <p className="font-semibold text-slate-900 truncate">{item.productTitle}</p>
                                                        <p className="text-[10px] text-slate-400 font-mono">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                                                      </div>
                                                    </div>
                                                    <span className="font-bold text-slate-950 shrink-0">
                                                      {formatPrice(item.price * item.quantity)}
                                                    </span>
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          </div>

                                          {/* Link to full portal order page */}
                                          {onNavigateToPortal && (
                                            <button
                                              onClick={() => onNavigateToPortal('orders')}
                                              className="w-full py-2 text-center text-[10.5px] font-bold text-[#8C6B3E] hover:text-slate-950 underline underline-offset-4 cursor-pointer"
                                            >
                                              Open in Full Portal Orders Page →
                                            </button>
                                          )}

                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              );
                            })
                          )}
                        </div>
                      )}

                      {/* 2. ADDRESSES TAB */}
                      {activeTab === 'addresses' && (
                        <div className="space-y-3">
                          <div className="flex justify-between items-center bg-white p-3.5 rounded-2xl border border-[#E2DBD0]">
                            <span className="text-[10.5px] text-slate-600 font-bold uppercase tracking-wider">
                              Registered Residences
                            </span>
                            <button
                              onClick={() => setShowAddressForm(!showAddressForm)}
                              className="text-[10.5px] text-[#8C6B3E] hover:text-slate-950 font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                            >
                              <Plus className="h-3.5 w-3.5" />
                              <span>{showAddressForm ? 'Cancel' : 'Add Residence'}</span>
                            </button>
                          </div>

                          {showAddressForm && (
                            <form 
                              onSubmit={handleAddAddressSubmit} 
                              className="bg-white p-4 rounded-2xl border border-[#C5A880] space-y-3 animate-in fade-in"
                            >
                              <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-900">
                                Add Delivery Destination
                              </h4>
                              <input
                                type="text"
                                placeholder="Street / Residence / Suite"
                                value={newStreetAddress}
                                onChange={(e) => setNewStreetAddress(e.target.value)}
                                className="w-full text-xs border border-[#DCD5C9] p-2.5 rounded-xl bg-[#FAF8F5] focus:outline-none focus:border-[#C5A880]"
                                required
                              />
                              <div className="grid grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  placeholder="City (e.g. London)"
                                  value={newCity}
                                  onChange={(e) => setNewCity(e.target.value)}
                                  className="w-full text-xs border border-[#DCD5C9] p-2.5 rounded-xl bg-[#FAF8F5] focus:outline-none focus:border-[#C5A880]"
                                />
                                <input
                                  type="text"
                                  placeholder="Postal Code"
                                  value={newPostal}
                                  onChange={(e) => setNewPostal(e.target.value)}
                                  className="w-full text-xs border border-[#DCD5C9] p-2.5 rounded-xl bg-[#FAF8F5] focus:outline-none focus:border-[#C5A880]"
                                />
                              </div>
                              <div className="flex justify-end gap-2 text-xs">
                                <button
                                  type="button"
                                  onClick={() => setShowAddressForm(false)}
                                  className="bg-[#FAF8F5] text-slate-600 font-semibold py-1.5 px-3 rounded-lg text-[10px] uppercase cursor-pointer"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  className="bg-[#141416] text-white font-bold py-1.5 px-4 rounded-lg text-[10px] uppercase tracking-wider cursor-pointer"
                                >
                                  Save Address
                                </button>
                              </div>
                            </form>
                          )}

                          <div className="space-y-2">
                            {loggedInCustomer.addresses.length === 0 ? (
                              <p className="text-xs text-slate-400 text-center py-6 bg-white rounded-2xl border border-dashed border-[#DCD5C9]">
                                No delivery addresses recorded. Add one above!
                              </p>
                            ) : (
                              loggedInCustomer.addresses.map((address, idx) => (
                                <div 
                                  key={idx} 
                                  className="bg-white border border-[#E2DBD0] hover:border-[#C5A880] p-3.5 rounded-2xl transition-all flex justify-between gap-3 items-start"
                                >
                                  <div className="space-y-1">
                                    <span className="text-[8.5px] font-bold uppercase tracking-widest text-[#8C6B3E] bg-[#FAF8F5] border border-[#EAE4D9] px-2 py-0.5 rounded">
                                      {idx === 0 ? 'Primary Destination' : 'Alternative Residence'}
                                    </span>
                                    <p className="text-xs font-medium text-slate-800 leading-relaxed pt-1">{address}</p>
                                  </div>

                                  {idx > 0 && (
                                    <button
                                      onClick={() => onRemoveAddress(idx)}
                                      className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                                      title="Remove address"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  )}
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      )}

                      {/* 3. WISHLIST TAB */}
                      {activeTab === 'wishlist' && (
                        <div className="space-y-3">
                          {loggedInCustomer.wishlist.length === 0 ? (
                            <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-[#DCD5C9] p-6 space-y-2">
                              <Heart className="h-8 w-8 text-slate-300 mx-auto" />
                              <p className="text-xs text-slate-700 font-bold uppercase tracking-wider">Wishlist Empty</p>
                              <p className="text-[11px] text-slate-500 max-w-xs mx-auto leading-relaxed">
                                Save curated bespoke pieces and sartorial inspirations by clicking the heart on any product.
                              </p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 gap-2.5">
                              {loggedInCustomer.wishlist.map((productId) => {
                                const prod = allProducts.find(p => p.id === productId);
                                if (!prod) return null;
                                return (
                                  <div 
                                    key={prod.id} 
                                    className="bg-white border border-[#E2DBD0] p-3 rounded-2xl flex gap-3 items-center justify-between"
                                  >
                                    <div className="flex gap-2.5 items-center min-w-0">
                                      <img 
                                        src={prod.image} 
                                        alt="" 
                                        className="w-11 h-11 object-contain border border-[#EAE4D9] bg-[#FAF8F5] shrink-0 rounded-xl" 
                                      />
                                      <div className="min-w-0">
                                        <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">{prod.vendor || 'Jade Tailor'}</p>
                                        <p className="font-semibold text-slate-900 text-xs truncate">{prod.title}</p>
                                        <p className="text-xs text-[#8C6B3E] font-bold mt-0.5">{formatPrice(prod.price)}</p>
                                      </div>
                                    </div>

                                    <div className="flex flex-col gap-1 items-end shrink-0">
                                      <button
                                        onClick={() => {
                                          onAddToCart(prod, 1);
                                          onClose();
                                          setTimeout(() => onOpenCart(), 300);
                                        }}
                                        className="text-[9.5px] font-bold uppercase bg-[#141416] hover:bg-[#25252A] text-white py-1 px-2.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                                      >
                                        <ShoppingBag className="h-2.5 w-2.5 text-[#C5A880]" />
                                        <span>Bag</span>
                                      </button>
                                      
                                      <button
                                        onClick={() => onUpdateWishlist(prod.id, 'remove')}
                                        className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1 rounded-lg transition-colors cursor-pointer"
                                        title="Remove from wishlist"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}

                      {/* 4. EMAILS / CONCIERGE INBOX */}
                      {activeTab === 'emails' && (
                        <div className="space-y-3">
                          {(() => {
                            const myEmails = emailsList.filter(e => e.to.toLowerCase() === loggedInCustomer.email.toLowerCase());
                            return myEmails.length === 0 ? (
                              <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-[#DCD5C9] p-6 space-y-2">
                                <Mail className="h-8 w-8 text-slate-300 mx-auto" />
                                <p className="text-xs text-slate-700 font-bold uppercase tracking-wider">Inbox Clear</p>
                                <p className="text-[11px] text-slate-500 max-w-xs mx-auto leading-relaxed">
                                  Order confirmations, tailoring dispatch alerts, and stylist notifications appear here in real time.
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-2.5">
                                <div className="p-3 bg-[#F2EDE4] border border-[#DFD9CD] rounded-xl text-[10px] text-slate-700 leading-relaxed font-medium">
                                  📬 <strong>Atelier Client Correspondence</strong>: Real-time transactional updates and notifications for your private account.
                                </div>
                                {myEmails.map((email, idx) => (
                                  <div 
                                    key={idx} 
                                    onClick={() => setSelectedEmail(email)}
                                    className="bg-white border border-[#E2DBD0] hover:border-[#C5A880] p-3.5 rounded-xl cursor-pointer transition-all shadow-3xs flex gap-3 items-start"
                                  >
                                    <div className="p-2 bg-[#FAF8F5] rounded-lg text-[#8C6B3E] border border-[#EAE4D9] shrink-0 mt-0.5">
                                      <Mail className="h-3.5 w-3.5" />
                                    </div>
                                    <div className="flex-1 min-w-0 text-left">
                                      <div className="flex justify-between items-baseline">
                                        <span className="text-[9px] font-bold text-[#8C6B3E] uppercase tracking-wider">Jade Tailor Concierge</span>
                                        <span className="text-[8.5px] font-mono text-slate-400">{email.date || 'Today'}</span>
                                      </div>
                                      <h4 className="font-semibold text-slate-900 text-xs mt-0.5 truncate">{email.subject}</h4>
                                      <p className="text-[10px] text-slate-500 truncate mt-0.5">{email.preview || 'Click to view notification details.'}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            );
                          })()}
                        </div>
                      )}

                    </div>

                  </div>
                )}
              </div>

              {/* Drawer Bottom Bar */}
              <div className="px-5 py-3 border-t border-[#E6E0D6] bg-white flex items-center justify-between text-[10.5px] text-slate-400 shrink-0">
                <span className="font-serif italic text-slate-500">Jade Tailor · Savile Row & Mumbai</span>
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#8C6B3E]">Private Client</span>
              </div>

            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
