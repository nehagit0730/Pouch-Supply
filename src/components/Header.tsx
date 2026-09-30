import React, { useState } from 'react';
import { Customer, CartItem, Product, Collection, LayoutSettings, MenuItem } from '../types';
import { 
  ShoppingCart, Heart, User, Sparkles, LayoutDashboard, Menu, 
  Phone, HelpCircle, Search, X, ChevronRight, ChevronDown, 
  Home, ShoppingBag, Award, Info, MapPin, Clock 
} from 'lucide-react';

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
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const filteredProducts = searchQuery.trim() === '' ? [] : allProducts.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
  ).slice(0, 5);

  const filteredCollections = searchQuery.trim() === '' ? [] : allCollections.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 3);

  const scrollToSection = (id: string) => {
    if (currentTab !== 'frontend-home') {
      onTabChange('frontend-home');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const dynamicMenuItems: MenuItem[] = (layoutSettings?.menuItems && layoutSettings.menuItems.length > 0)
    ? layoutSettings.menuItems
    : [
        { id: '1', label: 'HOME', tab: 'frontend-home', type: 'tab' as const },
        { id: '2', label: 'SHOP', tab: 'frontend-shop', type: 'tab' as const },
        { id: '3', label: 'WORK WITH ME', tab: '#appointment-section', type: 'tab' as const },
        { id: '4', label: 'MY SERVICES', tab: '#services-section', type: 'tab' as const },
        { id: '5', label: 'STYLING PACKAGES', tab: '#pricing-section', type: 'tab' as const },
        { id: '6', label: 'STYLE JOURNAL', tab: 'blogs', type: 'tab' as const },
      ];

  const handleNavClick = (item: MenuItem) => {
    if (item.type === 'external' && item.url) {
      if (item.url.startsWith('/')) {
        if (item.url === '/collections/all' || item.url === '/shop' || item.url.startsWith('/collections/')) {
          onTabChange('frontend-shop');
        } else if (item.url.startsWith('/pages/')) {
          onTabChange(item.url.replace('/pages/', ''));
        } else if (item.url.startsWith('#')) {
          scrollToSection(item.url.replace('#', ''));
        } else {
          window.location.href = item.url;
        }
      } else {
        window.open(item.url, '_blank', 'noopener,noreferrer');
      }
      return;
    }

    const tab = item.tab || '';
    if (tab === 'frontend-shop' || tab === '/collections/all' || tab === 'shop' || tab.toLowerCase().includes('collection')) {
      onTabChange('frontend-shop');
    } else if (tab.startsWith('#')) {
      scrollToSection(tab.replace('#', ''));
    } else if (tab.startsWith('/collections/')) {
      const colId = tab.replace('/collections/', '');
      if (colId === 'all') {
        onTabChange('frontend-shop');
      } else if (onNavigateDetail) {
        onNavigateDetail('collection-detail', undefined, colId);
      } else {
        onTabChange(tab);
      }
    } else if (tab.startsWith('collection-')) {
      const colId = tab.replace('collection-', '');
      if (colId === 'all') {
        onTabChange('frontend-shop');
      } else if (onNavigateDetail) {
        onNavigateDetail('collection-detail', undefined, colId);
      } else {
        onTabChange(tab);
      }
    } else if (tab.startsWith('/pages/')) {
      const slug = tab.replace('/pages/', '');
      onTabChange(`page-${slug}`);
    } else if (tab.startsWith('page-')) {
      onTabChange(tab);
    } else {
      onTabChange(tab);
    }
  };

  const isNavActive = (item: MenuItem) => {
    if (isAdminActive) return false;
    if (item.type === 'tab') {
      if (item.tab === 'frontend-home' && currentTab === 'frontend-home') return true;
      if ((item.tab === 'frontend-shop' || item.tab === '/collections/all') && currentTab === 'frontend-shop') return true;
      if (item.tab === currentTab) return true;
      if (item.tab.startsWith('page-') && currentTab === item.tab.replace('page-', '')) return true;
    }
    return false;
  };

  const getHref = (item: MenuItem): string => {
    if (item.type === 'external' && item.url) return item.url;
    const tab = item.tab || '';
    if (tab === 'frontend-shop' || tab === '/collections/all' || tab === 'shop' || item.label.toUpperCase() === 'SHOP') {
      return '/collections/all';
    }
    if (tab === 'frontend-home' || tab === '/' || tab === '') {
      return '/';
    }
    if (tab.startsWith('#')) {
      return tab;
    }
    if (tab.startsWith('/collections/')) {
      return tab;
    }
    if (tab === 'blogs') {
      return '/blogs';
    }
    if (tab.startsWith('page-')) {
      return `/pages/${tab.replace('page-', '')}`;
    }
    return `/${tab}`;
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] border-b border-[#f0ece5] transition-all">
      
      {/* 1. TOP MICRO BAR (DARK LUXURY) */}
      <div className="bg-[#111111] text-[#cccccc] text-[11px] py-2 px-4 sm:px-8 border-b border-white/5">
        <div className="max-w-[1340px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          
          {/* Left: Address & Phone */}
          <div className="flex items-center gap-4 sm:gap-6 text-[10.5px] font-sans tracking-wider">
            <div className="flex items-center gap-1.5 text-white/80">
              <MapPin className="h-3 w-3 text-[#b58d59]" />
              <span>{layoutSettings?.address || '0665 Broadway, NYC'}</span>
            </div>
            <div className="hidden sm:block text-white/30">•</div>
            <a 
              href="tel:8001234444" 
              className="flex items-center gap-1.5 text-white/90 hover:text-[#b58d59] transition-colors"
            >
              <Phone className="h-3 w-3 text-[#b58d59]" />
              <span>{layoutSettings?.phone || '800 123 4444'}</span>
            </a>
          </div>

          {/* Right: Opening Hours */}
          <div className="flex items-center gap-1.5 text-[10.5px] font-sans tracking-wider text-white/80">
            <Clock className="h-3 w-3 text-[#b58d59]" />
            <span>Opening: Mon-Fri 10.00 - 20.00</span>
          </div>

        </div>
      </div>

      {/* Slide-down Search Overlay */}
      {isSearchOpen && (
        <div className="absolute inset-x-0 top-full bg-white border-b border-[#ece7de] z-50 shadow-2xl animate-fade-in font-sans">
          <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-4">
            <div className="flex items-center gap-3 bg-[#fdfcfb] border border-[#e5dfd5] p-3 rounded-lg">
              <Search className="h-5 w-5 text-[#999999]" />
              <input
                type="text"
                placeholder="Search styling services, lookbooks, dresses, outerwear, tailoring..."
                value={searchQuery}
                autoFocus
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm bg-transparent focus:outline-none placeholder-[#999999] text-[#1a1a1a]"
              />
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                }}
                className="p-1 text-[#999999] hover:text-[#1a1a1a] cursor-pointer"
                title="Close Search"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Results pane */}
            {searchQuery.trim() !== '' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div className="md:col-span-2 space-y-3">
                  <h4 className="text-[10px] font-bold uppercase text-[#b58d59] tracking-widest">
                    Matching Products ({filteredProducts.length})
                  </h4>
                  <div className="space-y-2">
                    {filteredProducts.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          onNavigateDetail?.('product-detail', p.slug || p.id);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="flex items-center gap-3 p-2 bg-[#fdfcfb] hover:bg-[#f6f2ea] rounded-lg cursor-pointer border border-transparent hover:border-[#ebd9bd] transition-all"
                      >
                        {p.image ? (
                          <img src={p.image} className="w-10 h-10 rounded object-cover border shrink-0" alt="" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-10 h-10 rounded bg-slate-200 flex items-center justify-center shrink-0 text-slate-400 font-bold text-xs">P</div>
                        )}
                        <div className="truncate flex-1">
                          <span className="block text-[9px] font-bold uppercase text-[#888888] leading-none mb-0.5">{p.vendor}</span>
                          <span className="block text-xs font-semibold text-[#1a1a1a] truncate">{p.title}</span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[11px] font-bold text-[#b58d59]">£{p.price.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                    {filteredProducts.length === 0 && (
                      <p className="text-xs text-[#888888] italic py-2">No matching products found.</p>
                    )}
                  </div>
                </div>

                <div className="space-y-3 border-t md:border-t-0 md:border-l border-[#ece7de] pt-4 md:pt-0 md:pl-6">
                  <h4 className="text-[10px] font-bold uppercase text-[#b58d59] tracking-widest">
                    Collections ({filteredCollections.length})
                  </h4>
                  <div className="space-y-2">
                    {filteredCollections.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          onNavigateDetail?.('collection-detail', undefined, c.slug || c.id);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="p-2.5 bg-[#fdfcfb] hover:bg-[#f6f2ea] rounded-lg cursor-pointer border border-transparent hover:border-[#ebd9bd] transition-all"
                      >
                        <span className="block text-xs font-bold text-[#1a1a1a] truncate">{c.title}</span>
                      </div>
                    ))}
                    {filteredCollections.length === 0 && (
                      <p className="text-xs text-[#888888] italic py-2">No categories found.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. MAIN HEADER NAVIGATION BAR */}
      <div className="max-w-[1340px] mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo (Serif Luxury Branding) */}
        <div 
          onClick={() => onTabChange('frontend-home')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          {layoutSettings?.headerLogoImage ? (
            <img 
              src={layoutSettings.headerLogoImage} 
              className="max-h-12 max-w-[160px] object-contain transition-transform group-hover:scale-102" 
              alt={layoutSettings?.headerLogoText || 'JADE TAILOR'} 
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex flex-col text-left">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-[0.22em] text-[#1a1a1a] uppercase leading-tight transition-colors group-hover:text-[#b58d59]">
                {layoutSettings?.headerLogoText || 'JADE TAILOR'}
              </span>
              <span className="text-[8px] sm:text-[9px] font-sans font-semibold tracking-[0.38em] text-[#b58d59] uppercase -mt-0.5">
                {layoutSettings?.headerLogoSubtext || 'PERSONAL STYLIST'}
              </span>
            </div>
          )}
        </div>

        {/* Center: Desktop Navigation Links (dynamic from Header & Footer Settings) */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 font-sans">
          {dynamicMenuItems.map((item) => {
            const active = isNavActive(item);
            const href = getHref(item);
            return (
              <a
                key={item.id}
                href={href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item);
                }}
                className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-all py-1 cursor-pointer border-b-2 ${
                  active
                    ? 'border-[#b58d59] text-[#1a1a1a]'
                    : 'border-transparent text-[#444444] hover:text-[#b58d59]'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Right: Actions Block (Search, Wishlist, Account, Cart, Admin toggle, Mobile Menu) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 text-[#444444] hover:text-[#b58d59] transition cursor-pointer"
            title="Search Website"
          >
            <Search className="h-4.5 w-4.5" />
          </button>

          {/* Wishlist Link */}
          <button
            onClick={onOpenWishlist}
            className="relative p-2 text-[#444444] hover:text-[#b58d59] transition cursor-pointer hidden md:block"
            title="View Wishlist"
          >
            <Heart className={`h-4.5 w-4.5 ${wishlistCount > 0 ? 'text-[#b58d59] fill-[#b58d59]' : ''}`} />
            {wishlistCount > 0 && (
              <span className="absolute 0 top-0.5 right-0.5 h-4 min-w-4 bg-[#b58d59] text-white text-[8px] font-bold rounded-full flex items-center justify-center px-1">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Customer Account Button */}
          <button
            onClick={onOpenCustomer}
            className="hidden md:flex items-center gap-1.5 p-2 text-[#444444] hover:text-[#b58d59] transition cursor-pointer"
            title="Customer Account"
          >
            <User className="h-4.5 w-4.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#333333]">
              {loggedInCustomer?.name ? loggedInCustomer.name.split(' ')[0] : 'Log In'}
            </span>
          </button>

          {/* Cart Bag Button (Editorial aesthetic) */}
          <button
            onClick={onOpenCart}
            className="relative p-2 sm:px-3 sm:py-2 bg-[#111111] hover:bg-[#222222] text-white rounded-xs shadow transition-all duration-200 cursor-pointer flex items-center gap-2"
            title="Shopping Bag"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">Bag</span>
            {cartCount > 0 && (
              <span className="h-4 min-w-4 bg-[#b58d59] text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
                {cartCount}
              </span>
            )}
          </button>

          {/* Admin Dashboard Entry Button */}
          <button
            onClick={onOpenAdmin}
            className="p-2 text-[#666666] hover:text-[#111111] transition cursor-pointer rounded-xs hover:bg-[#f4efe6]"
            title="Admin Dashboard Portal"
          >
            <LayoutDashboard className="h-4 w-4" />
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-[#222222] hover:text-[#b58d59] transition cursor-pointer lg:hidden"
            title="Open Mobile Navigation"
          >
            <Menu className="h-5 w-5" />
          </button>

        </div>

      </div>

      {/* Slide-out Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden font-sans">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-2xl flex flex-col z-10 animate-slide-in-right">
            <div className="p-5 border-b border-[#eee9df] flex items-center justify-between bg-[#fbf9f6]">
              <div className="flex flex-col text-left">
                <span className="font-serif text-lg font-bold tracking-[0.2em] text-[#1a1a1a] uppercase leading-tight">
                  {layoutSettings?.headerLogoText || 'JADE TAILOR'}
                </span>
                <span className="text-[8px] font-sans font-semibold tracking-[0.35em] text-[#b58d59] uppercase">
                  {layoutSettings?.headerLogoSubtext || 'PERSONAL STYLIST'}
                </span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 text-[#777777] hover:text-[#111111] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
              <div className="space-y-1">
                {dynamicMenuItems.map((item) => {
                  const active = isNavActive(item);
                  const href = getHref(item);
                  return (
                    <a
                      key={item.id}
                      href={href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(item);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full text-left py-2.5 px-3 text-xs font-bold uppercase tracking-widest rounded transition cursor-pointer flex items-center justify-between ${
                        active
                          ? 'bg-[#fbf9f6] text-[#b58d59] font-black'
                          : 'text-[#222222] hover:text-[#b58d59] hover:bg-[#fbf9f6]'
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronRight className="h-3 w-3 opacity-40" />
                    </a>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-[#eee9df] space-y-2">
                <button
                  onClick={() => {
                    onOpenCustomer();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-3 bg-[#fbf9f6] rounded text-xs text-[#222222] font-semibold"
                >
                  <span>{loggedInCustomer?.name ? `Account: ${loggedInCustomer.name}` : 'Log In / Register'}</span>
                  <User className="h-4 w-4 text-[#888888]" />
                </button>

                <button
                  onClick={() => {
                    onOpenWishlist();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-3 bg-[#fbf9f6] rounded text-xs text-[#222222] font-semibold"
                >
                  <span>My Wishlist ({wishlistCount})</span>
                  <Heart className="h-4 w-4 text-[#888888]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </header>
  );
}
