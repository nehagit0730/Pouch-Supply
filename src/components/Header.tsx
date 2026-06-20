import React, { useState } from 'react';
import { Customer, CartItem, Product, Collection } from '../types';
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
  onNavigateDetail
}: HeaderProps) {
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = loggedInCustomer?.wishlist.length || 0;

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
                          onNavigateDetail?.('product-detail', p.id);
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
                          onNavigateDetail?.('collection-detail', undefined, c.id);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Left: Brand logo */}
        <div 
          onClick={() => {
            onTabChange('frontend-home');
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-8 h-8 bg-[#008060] rounded flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[#1a1c1d] tracking-normal text-base leading-none">Pouch Supply</span>
            <span className="text-[9px] text-[#707579] font-semibold uppercase tracking-widest mt-0.5">Premium Nicotine</span>
          </div>
        </div>

        {/* Center: Navigation options */}
        <nav className="hidden md:flex items-center gap-6">
          <button
            onClick={() => onTabChange('frontend-home')}
            className={`text-xs font-black uppercase tracking-widest pb-1 transition-colors hover:text-indigo-600 cursor-pointer ${
              currentTab === 'frontend-home' && !isAdminActive ? 'text-indigo-650 border-b-2 border-indigo-600' : 'text-slate-500'
            }`}
          >
            Home
          </button>
          
          <button
            onClick={() => onTabChange('frontend-subscribe')}
            className={`text-xs font-black uppercase tracking-widest pb-1 transition-colors hover:text-indigo-600 cursor-pointer ${
              currentTab === 'frontend-subscribe' && !isAdminActive ? 'text-indigo-650 border-b-2 border-indigo-600' : 'text-slate-500'
            }`}
          >
            Subscribe
          </button>

          <button
            onClick={() => onTabChange('frontend-shop')}
            className={`text-xs font-black uppercase tracking-widest pb-1 transition-colors hover:text-indigo-600 cursor-pointer ${
              currentTab === 'frontend-shop' && !isAdminActive ? 'text-indigo-650 border-b-2 border-indigo-600' : 'text-slate-500'
            }`}
          >
            Shop Now
          </button>

          <button
            onClick={() => onTabChange('frontend-brands')}
            className={`text-xs font-black uppercase tracking-widest pb-1 transition-colors hover:text-indigo-600 cursor-pointer ${
              currentTab === 'frontend-brands' && !isAdminActive ? 'text-indigo-650 border-b-2 border-indigo-600' : 'text-slate-500'
            }`}
          >
            All Brands
          </button>

          <button
            onClick={() => onTabChange('about')}
            className={`text-xs font-black uppercase tracking-widest pb-1 transition-colors hover:text-indigo-600 cursor-pointer ${
              currentTab === 'about' && !isAdminActive ? 'text-indigo-650 border-b-2 border-indigo-600' : 'text-slate-500'
            }`}
          >
            About
          </button>
        </nav>

        {/* Right: Actions block (Dashboard controller, customer logins, basket drawers) */}
        <div className="flex items-center gap-4">
          
          {/* Extremely prominent Admin Dashboard Toggle */}
          <button
            onClick={onOpenAdmin}
            className={`flex items-center gap-1.5 py-2 px-3 sm:px-4 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
              isAdminActive 
                ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
            }`}
          >
            <LayoutDashboard className="h-4 w-4 shrink-0" />
            <span>{isAdminActive ? 'Viewing Dashboard' : 'Admin Portal'}</span>
          </button>

          <span className="h-5 w-px bg-slate-200 hidden sm:block" />

          {/* Search Trigger Button */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={`p-2.5 rounded-full hover:bg-slate-100 cursor-pointer transition-colors ${isSearchOpen ? 'bg-indigo-50 text-indigo-650' : 'text-slate-605'}`}
            title="Search Website"
          >
            <Search className="h-4.5 w-4.5 text-slate-500" />
          </button>

          {/* Wishlist Link bubble */}
          <button
            onClick={onOpenWishlist}
            className="relative p-2.5 rounded-full hover:bg-slate-100 text-slate-600 cursor-pointer transition-colors"
            title="View Wishlist"
          >
            <Heart className="h-4.5 w-4.5 text-slate-500" />
            {wishlistCount > 0 && (
              <span className="absolute top-0 right-0 h-4.5 min-w-4.5 bg-red-400 text-white text-[9px] font-black rounded-full flex items-center justify-center px-1">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Customer accounts entry - PLACED DIRECTLY NEXT TO THE CART ICON */}
          <button
            onClick={onOpenCustomer}
            className="flex items-center gap-1.5 py-1.5 px-2.5 rounded-xl border border-slate-200/80 bg-slate-50 hover:bg-slate-100 transition-all hover:border-slate-350 cursor-pointer max-w-[130px]"
            title="Customer Account Dashboard"
          >
            <User className="h-4.5 w-4.5 text-slate-600 shrink-0" />
            <span className="text-[11px] font-bold text-slate-700 truncate">
              {loggedInCustomer ? loggedInCustomer.name.split(' ')[0] : 'Log In'}
            </span>
          </button>

          {/* Cart Drawer triggers */}
          <button
            onClick={onOpenCart}
            className="relative p-2.5 rounded-full bg-slate-900 border border-slate-900 text-white hover:bg-slate-800 transition-all cursor-pointer shadow-xs"
            title="Shopping Cart Drawer"
          >
            <ShoppingCart className="h-4.5 w-4.5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-5 min-w-5 bg-indigo-600 text-white text-[9px] font-black rounded-full flex items-center justify-center px-1 shadow-md animate-scale">
                {cartCount}
              </span>
            )}
          </button>

        </div>

      </div>

      {/* Sub menu micro links for customer convenience */}
      <div className="bg-slate-50/50 border-t border-slate-150/70 h-10 flex items-center text-[10px] text-slate-400 font-bold px-4 tracking-wider">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div className="flex gap-4">
            <span className="text-slate-500 flex items-center gap-1"><Store className="h-3 w-3" /> EU Official Supplier</span>
            <span className="hidden sm:inline-block">• UK Tracked Courier Shipping</span>
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
