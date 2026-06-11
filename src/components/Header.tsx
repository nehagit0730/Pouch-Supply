import React from 'react';
import { Customer, CartItem } from '../types';
import { ShoppingCart, Heart, User, Sparkles, LayoutDashboard, Menu, Store, Phone, HelpCircle } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  loggedInCustomer: Customer | null;
  cartItems: CartItem[];
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  isAdminActive: boolean;
}

export default function Header({
  currentTab,
  onTabChange,
  loggedInCustomer,
  cartItems,
  onOpenCart,
  onOpenAdmin,
  isAdminActive
}: HeaderProps) {
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = loggedInCustomer?.wishlist.length || 0;

  return (
    <header className="border-b border-[#e1e3e5] bg-white">
      
      {/* Top micro promo bar */}
      <div className="bg-[#1a1c1d] text-white text-[10px] text-center py-2 px-4 uppercase tracking-widest font-bold flex items-center justify-center gap-1.5">
        <Sparkles className="h-3 w-3 text-amber-400" />
        <span>Free Priority Courier Shipping on all bulk orders over £40! Delivery within 2-4 working days</span>
      </div>

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
            Subscribe Builder 📦
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
            All Brands Directory
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
            <span>{isAdminActive ? 'Viewing Dashboard' : 'Shopify Admin'}</span>
          </button>

          <span className="h-5 w-px bg-slate-200 hidden sm:block" />

          {/* Customer accounts entry */}
          <button
            onClick={() => onTabChange('frontend-account')}
            className={`flex items-center gap-1.5 text-xs font-bold transition-all hover:text-indigo-600 cursor-pointer ${
              currentTab === 'frontend-account' && !isAdminActive ? 'text-indigo-650' : 'text-slate-600'
            }`}
          >
            <User className="h-4.5 w-4.5 text-slate-500 shrink-0" />
            <span className="hidden sm:inline-block truncate max-w-[80px]">
              {loggedInCustomer ? loggedInCustomer.name.split(' ')[0] : 'Sign In'}
            </span>
          </button>

          {/* Wishlist Link bubble */}
          <button
            onClick={() => onTabChange('frontend-account')}
            className="relative p-2.5 rounded-full hover:bg-slate-100 text-slate-600 cursor-pointer transition-colors"
            title="View Wishlist (Login needed)"
          >
            <Heart className="h-4.5 w-4.5 text-slate-500" />
            {wishlistCount > 0 && (
              <span className="absolute top-0 right-0 h-4.5 min-w-4.5 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center px-1">
                {wishlistCount}
              </span>
            )}
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
