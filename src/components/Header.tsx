import React, { useState } from 'react';
import { Customer, CartItem, Product, Collection, LayoutSettings } from '../types';
import { ShoppingCart, Heart, User, Sparkles, LayoutDashboard, Menu, Store, Phone, HelpCircle, Search, X } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  loggedInCustomer: Customer | null;
  cartItems: CartItem[];
  onOpenCart: () => void;
  onOpenCustomer: () => void;
  onOpenWishlist: () => void;
  onOpenAdmin: () => void;
  isAdminActive: boolean;
  allProducts?: Product[];
  allCollections?: Collection[];
  onNavigateDetail?: (tab: string, productId?: string, collectionId?: string) => void;
  layoutSettings?: LayoutSettings;
}

export default function Header({
  currentTab,
  onTabChange,
  loggedInCustomer,
  cartItems,
  onOpenCart,
  onOpenCustomer,
  onOpenWishlist,
  onOpenAdmin,
  isAdminActive,
  allProducts = [],
  allCollections = [],
  onNavigateDetail,
  layoutSettings
}: HeaderProps) {
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = loggedInCustomer?.wishlist.length || 0;

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const filteredProducts = searchQuery.trim() === '' ? [] : allProducts.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
  ).slice(0, 5);

  const filteredCollections = searchQuery.trim() === '' ? [] : allCollections.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 3);

  return (
    <header className="border-b border-[#e1e3e5] bg-white relative">
      
      {/* Top micro promo bar */}
      <div className="bg-[#1a1c1d] text-white text-[10px] text-center py-2 px-4 uppercase tracking-widest font-bold flex items-center justify-center gap-1.5">
        <Sparkles className="h-3 w-3 text-amber-400" />
        <span>Free Priority Courier Shipping on all bulk orders over £40! Delivery within 2-4 working days</span>
      </div>

      {/* Slide-down Search Overlay */}
      {isSearchOpen && (
        <div className="absolute inset-x-0 top-full bg-white border-b border-slate-200 z-50 shadow-xl animate-fade-in font-sans">
          <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-4">
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-250 p-3.5 rounded-2xl">
              <Search className="h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search canisters, series types, strength grades, brand manufacturers..."
                value={searchQuery}
                autoFocus
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm font-semibold bg-transparent focus:outline-none placeholder-slate-400 text-slate-800"
              />
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                }}
                className="p-1 text-slate-400 hover:text-slate-650 cursor-pointer"
                title="Close Search"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Results pane */}
            {searchQuery.trim() !== '' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                
                {/* Product results */}
                <div className="md:col-span-2 space-y-3">
                  <h4 className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">Matching Products ({filteredProducts.length})</h4>
                  <div className="space-y-2">
                    {filteredProducts.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          onNavigateDetail?.('product-detail', p.slug || p.id);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="flex items-center gap-3 p-2 bg-slate-50 hover:bg-slate-100 rounded-xl cursor-pointer border border-transparent hover:border-slate-200/80 transition-all"
                      >
                        {p.image ? (
                          <img src={p.image} className="w-10 h-10 rounded-lg object-cover border shrink-0" alt="" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center shrink-0 text-slate-450 font-bold text-xs font-mono">P</div>
                        )}
                        <div className="truncate flex-1">
                          <span className="block text-[10px] font-extrabold uppercase text-slate-400 leading-none mb-0.5">{p.vendor}</span>
                          <span className="block text-xs font-black text-slate-755 truncate">{p.title}</span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[11px] font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">£{p.price.toFixed(2)}</span>
                          <span className="block text-[8px] font-semibold text-slate-400 mt-0.5">{p.category}</span>
                        </div>
                      </div>
                    ))}
                    {filteredProducts.length === 0 && (
                      <p className="text-xs text-slate-450 italic py-2">No products match your search query.</p>
                    )}
                  </div>
                </div>

                {/* Collection results */}
                <div className="space-y-3 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                  <h4 className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">Collections ({filteredCollections.length})</h4>
                  <div className="space-y-2">
                    {filteredCollections.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          onNavigateDetail?.('collection-detail', undefined, c.slug || c.id);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="p-2.5 bg-slate-50 hover:bg-indigo-50/50 rounded-xl cursor-pointer border border-transparent hover:border-indigo-100 transition-all font-sans"
                      >
                        <span className="block text-xs font-black text-slate-755 truncate">{c.title}</span>
                        <span className="block text-[9px] text-slate-400 line-clamp-1 mt-0.5">{c.description || 'Explore curated series canisters.'}</span>
                      </div>
                    ))}
                    {filteredCollections.length === 0 && (
                      <p className="text-xs text-slate-450 italic py-2">No categories found.</p>
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      )}

      {/* Main navigation menu */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
        
        {/* Left: Brand logo */}
        <div 
          onClick={() => {
            onTabChange('frontend-home');
          }}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0 animate-fade-in"
        >
          {layoutSettings?.headerLogoImage ? (
            <img 
              src={layoutSettings.headerLogoImage} 
              className="max-h-11 max-w-[150px] object-contain rounded-md" 
              alt={layoutSettings?.headerLogoText || 'Pouch Supply'} 
              referrerPolicy="no-referrer"
            />
          ) : (
            <>
              <div className="w-8 h-8 bg-[#008060] rounded flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[#1a1c1d] tracking-normal text-sm sm:text-base leading-none">
                  {layoutSettings?.headerLogoText || 'Pouch Supply'}
                </span>
                <span className="text-[8px] sm:text-[9px] text-[#707579] font-semibold uppercase tracking-widest mt-0.5">
                  {layoutSettings?.headerLogoSubtext || 'Premium Nicotine'}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Center: Navigation options (Desktop/Large screens only) */}
        <nav className="hidden lg:flex items-center gap-6">
          {(layoutSettings?.menuItems || [
            { id: '1', label: 'Home', tab: 'frontend-home', type: 'tab' },
            { id: '2', label: 'Subscribe', tab: 'frontend-subscribe', type: 'tab' },
            { id: '3', label: 'Shop Now', tab: 'frontend-shop', type: 'tab' },
            { id: '4', label: 'All Brands', tab: 'frontend-brands', type: 'tab' },
            { id: '5', label: 'About', tab: 'about', type: 'tab' }
          ]).map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.type === 'external' && item.url) {
                  window.open(item.url, '_blank');
                } else {
                  onTabChange(item.tab);
                }
              }}
              className={`text-xs font-black uppercase tracking-widest pb-1 transition-colors hover:text-indigo-600 cursor-pointer ${
                currentTab === item.tab && !isAdminActive ? 'text-indigo-650 border-b-2 border-indigo-600' : 'text-slate-500'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right: Actions block (Dashboard controller, customer logins, basket drawers) */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          
          {/* Extremely prominent Admin Dashboard Toggle - Hide on mobile, show on sm/md and up */}
          <button
            onClick={onOpenAdmin}
            className={`flex items-center gap-1.5 py-1.5 px-2.5 text-[10px] sm:text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
              isAdminActive 
                ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
            } hidden sm:flex`}
          >
            <LayoutDashboard className="h-3.5 w-3.5 shrink-0" />
            <span className="hidden md:inline">{isAdminActive ? 'Viewing Dashboard' : 'Admin Portal'}</span>
          </button>

          <span className="h-5 w-px bg-slate-200 hidden md:block" />

          {/* Search Trigger Button */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={`p-1.5 sm:p-2.5 rounded-full hover:bg-slate-100 cursor-pointer transition-colors ${isSearchOpen ? 'bg-indigo-50 text-indigo-650' : 'text-slate-605'}`}
            title="Search Website"
          >
            <Search className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-slate-500" />
          </button>

          {/* Wishlist Link bubble - Desktop/Tablet only */}
          <button
            onClick={onOpenWishlist}
            className="relative p-1.5 sm:p-2.5 rounded-full hover:bg-slate-100 text-slate-600 cursor-pointer transition-colors hidden md:block"
            title="View Wishlist"
          >
            <Heart className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-slate-500" />
            {wishlistCount > 0 && (
              <span className="absolute top-0 right-0 h-4 min-w-4 bg-red-400 text-white text-[8px] font-black rounded-full flex items-center justify-center px-1">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Customer accounts entry - PLACED DIRECTLY NEXT TO THE CART ICON - Desktop/Tablet only */}
          <button
            onClick={onOpenCustomer}
            className="hidden md:flex items-center gap-1.5 py-1.5 px-2.5 rounded-xl border border-slate-200/80 bg-slate-50 hover:bg-slate-100 transition-all hover:border-slate-350 cursor-pointer max-w-[110px] sm:max-w-[130px]"
            title="Customer Account Dashboard"
          >
            <User className="h-4 w-4 text-slate-600 shrink-0" />
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-700 truncate">
              {loggedInCustomer && loggedInCustomer.name ? loggedInCustomer.name.split(' ')[0] : 'Log In'}
            </span>
          </button>

          {/* Yoti global status badge in header */}
          {sessionStorage.getItem('yoti_verified') === 'true' && (
            <div className="hidden lg:flex items-center gap-1.5 py-1.5 px-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Yoti 18+ Verified</span>
            </div>
          )}

          {/* Cart Drawer triggers */}
          <button
            onClick={onOpenCart}
            className="relative p-2 sm:p-2.5 rounded-full bg-slate-900 border border-slate-900 text-white hover:bg-slate-800 transition-all cursor-pointer shadow-xs"
            title="Shopping Cart Drawer"
          >
            <ShoppingCart className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4.5 min-w-4.5 sm:h-5 sm:min-w-5 bg-indigo-600 text-white text-[8px] sm:text-[9px] font-black rounded-full flex items-center justify-center px-1 shadow-md animate-scale">
                {cartCount}
              </span>
            )}
          </button>

          {/* Hamburger Menu Icon for Mobile & Tablet (visible below lg) */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-750 cursor-pointer transition-colors lg:hidden"
            title="Open Mobile Navigation"
          >
            <Menu className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
          </button>

        </div>

      </div>

      {/* Slide-out Mobile Menu Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden font-sans">
          {/* Backdrop with blurring effect */}
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Slide-out Panel */}
          <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-2xl flex flex-col z-10 animate-slide-in-right">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                {layoutSettings?.headerLogoImage ? (
                  <img 
                    src={layoutSettings.headerLogoImage} 
                    className="max-h-8 max-w-[100px] object-contain rounded" 
                    alt="Logo" 
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <>
                    <div className="w-7 h-7 bg-[#008060] rounded flex items-center justify-center">
                      <div className="w-3.5 h-3.5 border-2 border-white rounded-xs"></div>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 text-xs leading-none">
                        {layoutSettings?.headerLogoText || 'Pouch Supply'}
                      </span>
                      <span className="text-[7px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                        {layoutSettings?.headerLogoSubtext || 'Premium Nicotine'}
                      </span>
                    </div>
                  </>
                )}
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-650 cursor-pointer rounded-lg hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Menu Links */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              <div className="space-y-1">
                <div className="text-[10px] font-black uppercase text-indigo-650 tracking-wider mb-2 px-2.5">Navigation Menu</div>
                {(layoutSettings?.menuItems || [
                  { id: '1', label: 'Home', tab: 'frontend-home', type: 'tab' },
                  { id: '2', label: 'Subscribe', tab: 'frontend-subscribe', type: 'tab' },
                  { id: '3', label: 'Shop Now', tab: 'frontend-shop', type: 'tab' },
                  { id: '4', label: 'All Brands', tab: 'frontend-brands', type: 'tab' },
                  { id: '5', label: 'About', tab: 'about', type: 'tab' }
                ]).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.type === 'external' && item.url) {
                        window.open(item.url, '_blank');
                      } else {
                        onTabChange(item.tab);
                      }
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left font-black uppercase tracking-wider text-xs py-3 px-3.5 rounded-xl transition-all cursor-pointer ${
                      currentTab === item.tab && !isAdminActive
                        ? 'bg-indigo-50 text-indigo-750'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Portal controls & account triggers */}
              <div className="space-y-2 border-t border-slate-100 pt-5">
                <div className="text-[10px] font-black uppercase text-indigo-650 tracking-wider mb-3 px-2.5">Portals & Accounts</div>
                
                {/* Admin Portal toggle */}
                <button
                  onClick={() => {
                    onOpenAdmin();
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 py-3 px-3.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                    isAdminActive 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'bg-slate-100 text-slate-700 border border-slate-200/80 hover:bg-slate-150'
                  }`}
                >
                  <LayoutDashboard className="h-4.5 w-4.5 shrink-0" />
                  <span>{isAdminActive ? 'Viewing Dashboard' : 'Admin Portal'}</span>
                </button>

                {/* Customer login trigger */}
                <button
                  onClick={() => {
                    onOpenCustomer();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 py-3 px-3.5 rounded-xl border border-slate-200/80 bg-slate-50 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-all cursor-pointer"
                >
                  <User className="h-4.5 w-4.5 text-slate-500 shrink-0" />
                  <span>{loggedInCustomer ? `Account: ${loggedInCustomer.name}` : 'Customer Account / Log In'}</span>
                </button>

                {/* Wishlist trigger */}
                <button
                  onClick={() => {
                    onOpenWishlist();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between py-3 px-3.5 rounded-xl border border-transparent hover:bg-slate-50 text-slate-700 font-bold text-xs transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Heart className="h-4.5 w-4.5 text-slate-500" />
                    <span>My Wishlist</span>
                  </div>
                  {wishlistCount > 0 && (
                    <span className="bg-red-400 text-white text-[10px] font-black rounded-full h-5 min-w-5 flex items-center justify-center px-1.5">
                      {wishlistCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Micro details Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-2.5 text-[10px] text-slate-405 font-bold tracking-wider">
              <div className="flex items-center gap-1.5 text-slate-500">
                <Store className="h-3.5 w-3.5" />
                <span>EU Official Supplier</span>
              </div>
              <div className="text-slate-450">• UK Tracked Courier Shipping</div>
              <div className="pt-1 text-[9px] text-slate-400/80 leading-relaxed font-semibold">
                ✉️ Support: Support@pouch-supply.com
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub menu micro links for customer convenience (Desktop & Tablet only) */}
      <div className="hidden sm:block bg-slate-50/50 border-t border-slate-150/70 h-10 flex items-center text-[10px] text-slate-400 font-bold px-4 tracking-wider">
        <div className="max-w-[1440px] mx-auto w-full flex justify-between items-center">
          <div className="flex gap-4">
            <span className="text-slate-500 flex items-center gap-1"><Store className="h-3 w-3" /> EU Official Supplier</span>
            <span className="hidden md:inline-block">• UK Tracked Courier Shipping</span>
          </div>
          <div className="flex gap-3">
            <span className="hover:text-slate-600 cursor-pointer"><HelpCircle className="h-3 w-3 inline-block" /> Quick FAQs</span>
            <span>📞 customer help desk: Support@pouch-supply.com</span>
          </div>
        </div>
      </div>

    </header>
  );
}
