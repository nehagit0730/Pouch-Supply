import React, { useState, useMemo } from 'react';
import { Product, Collection, Customer } from '../types';
import { Search, Heart, Filter, ArrowUpDown, Tag, ShoppingCart, SlidersHorizontal, Info, Sparkles } from 'lucide-react';

interface ProductsGridProps {
  products: Product[];
  collections: Collection[];
  activeCollectionId: string;
  onActiveCollectionChange: (id: string) => void;
  loggedInCustomer: Customer | null;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onOpenLoginModal?: () => void;
}

export default function ProductsGrid({
  products,
  collections,
  activeCollectionId,
  onActiveCollectionChange,
  loggedInCustomer,
  onToggleWishlist,
  onAddToCart,
  onOpenLoginModal
}: ProductsGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string | null>(null);
  const [selectedNicotineStrength, setSelectedNicotineStrength] = useState<string | null>(null); // 'mild', 'standard', 'strong', 'extreme'
  const [priceRange, setPriceRange] = useState<number>(6.00);
  const [sortBy, setSortBy] = useState<string>('featured');

  // Find current collection
  const currentCollection = useMemo(() => {
    return collections.find(c => c.id === activeCollectionId) || collections[0];
  }, [collections, activeCollectionId]);

  // Extract list of all unique brands / vendors in current products list
  const uniqueBrands = useMemo(() => {
    return Array.from(new Set(products.map(p => p.vendor)));
  }, [products]);

  // Filter current products based on active collection and current selections
  const filteredProducts = useMemo(() => {
    let list = products.filter(p => p.status === 'Active');

    // Filter by Active Collection product list
    if (currentCollection && currentCollection.id !== 'all') {
      list = list.filter(p => currentCollection.productIds.includes(p.id));
    }

    // Search term filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.vendor.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q)
      );
    }

    // Brand filter
    if (selectedBrandFilter) {
      list = list.filter(p => p.vendor === selectedBrandFilter);
    }

    // Nicotine strength filter (determined by tags or titles)
    if (selectedNicotineStrength) {
      list = list.filter(p => {
        const titleL = p.title.toLowerCase();
        if (selectedNicotineStrength === 'mild') {
          return titleL.includes('5 mg') || titleL.includes('5.2 mg') || p.tags.includes('mild');
        }
        if (selectedNicotineStrength === 'standard') {
          return titleL.includes('10 mg') || titleL.includes('10.4 mg') || p.tags.includes('standard');
        }
        if (selectedNicotineStrength === 'strong') {
          return titleL.includes('16 mg') || titleL.includes('17 mg') || p.tags.includes('strong');
        }
        if (selectedNicotineStrength === 'extreme') {
          return titleL.includes('20 mg') || titleL.includes('43 mg') || p.tags.includes('extreme') || p.tags.includes('ultra-strong');
        }
        return true;
      });
    }

    // Price range filter
    list = list.filter(p => p.price <= priceRange);

    // Sorting
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'title-asc') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'title-desc') {
      list.sort((a, b) => b.title.localeCompare(a.title));
    }

    return list;
  }, [products, currentCollection, searchTerm, selectedBrandFilter, selectedNicotineStrength, priceRange, sortBy]);

  const handleHeartClick = (pId: string) => {
    if (!loggedInCustomer) {
      if (onOpenLoginModal) {
        onOpenLoginModal();
      } else {
        alert("Wishlist feature is only accessible when logged in. Please sign in or register through the Account page first.");
      }
      return;
    }
    onToggleWishlist(pId);
  };

  const isProductInWishlist = (pId: string) => {
    if (!loggedInCustomer) return false;
    return loggedInCustomer.wishlist.includes(pId);
  };

  return (
    <div id="shop-grids-page" className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Banner / Category display */}
      <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-6 md:p-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden shadow-xs">
        <div className="relative z-10 max-w-xl">
          <span className="text-[10px] bg-slate-900 text-white font-bold tracking-widest py-1 px-3 rounded-full uppercase">Pouch Supply Catalog</span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 mt-3">{currentCollection?.title || 'Shop All products'}</h1>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">{currentCollection?.description || 'Browse premium filters sorted by top brands'}</p>
        </div>
        <div className="flex gap-2 shrink-0 z-10">
          <div className="text-xs font-bold text-slate-700 bg-white border border-slate-200 py-2 px-4 rounded-xl flex items-center gap-1.5">
            <Tag className="h-3.5 w-3.5 text-slate-400" /> {filteredProducts.length} Items Listed
          </div>
        </div>
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none blur-xl bg-indigo-500 h-64 w-64 rounded-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Collection listings selector */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest mb-3 pb-2 border-b border-slate-100 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-slate-400" /> Collections
            </h3>
            <div className="space-y-1">
              {collections.map(col => (
                <button
                  key={col.id}
                  onClick={() => onActiveCollectionChange(col.id)}
                  className={`w-full text-left text-xs font-bold py-2.5 px-3 rounded-lg transition-colors flex items-center justify-between ${
                    activeCollectionId === col.id 
                      ? 'bg-slate-900 border-slate-900 text-white' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className="truncate">{col.title}</span>
                  <span className={`text-[9px] py-0.5 px-2 rounded-full ${
                    activeCollectionId === col.id ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {col.id === 'all' ? products.length : col.productIds.length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-5">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
                <SlidersHorizontal className="h-4 w-4 text-slate-400" /> Custom Filters
              </h3>
              {(selectedBrandFilter || selectedNicotineStrength || searchTerm || priceRange < 6.00) && (
                <button
                  onClick={() => {
                    setSelectedBrandFilter(null);
                    setSelectedNicotineStrength(null);
                    setSearchTerm('');
                    setPriceRange(6.00);
                  }}
                  className="text-[10px] text-indigo-600 hover:text-indigo-800 font-extrabold cursor-pointer"
                >
                  Reset all
                </button>
              )}
            </div>

            {/* Keyword Search */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Search</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Filter name, sweet..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-xs p-2.5 pb-2.5 pl-8 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-500 bg-slate-50"
                />
                <Search className="absolute left-2.5 top-3 h-3.5 w-3.5 text-slate-400" />
              </div>
            </div>

            {/* Brands radio button selector */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Brands</label>
              <div className="space-y-1.5">
                <button
                  onClick={() => setSelectedBrandFilter(null)}
                  className={`w-full text-left text-xs py-1.5 px-2.5 rounded-md flex items-center justify-between ${
                    selectedBrandFilter === null ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>All Brands</span>
                </button>
                {uniqueBrands.map(b => (
                  <button
                    key={b}
                    onClick={() => setSelectedBrandFilter(b)}
                    className={`w-full text-left text-xs py-1.5 px-2.5 rounded-md flex items-center justify-between ${
                      selectedBrandFilter === b ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{b} Pouches</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Nicotine Strength filter buttons */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Nicotine Strength</label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'mild', label: 'Mild (≤ 5mg)' },
                  { id: 'standard', label: 'Standard (10mg)' },
                  { id: 'strong', label: 'Strong (16-17mg)' },
                  { id: 'extreme', label: 'Extreme (≥ 20mg)' }
                ].map(str => (
                  <button
                    key={str.id}
                    onClick={() => setSelectedNicotineStrength(selectedNicotineStrength === str.id ? null : str.id)}
                    className={`p-2 border text-[10px] font-semibold text-center rounded-lg transition-colors cursor-pointer ${
                      selectedNicotineStrength === str.id 
                        ? 'bg-slate-900 border-slate-900 text-white shadow-xs' 
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {str.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price boundary slider */}
            <div>
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                <span>Max price</span>
                <span className="text-slate-700 font-extrabold text-xs">£{priceRange.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="3.00"
                max="6.00"
                step="0.05"
                value={priceRange}
                onChange={(e) => setPriceRange(parseFloat(e.target.value))}
                className="w-full accent-slate-900 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
              />
            </div>

          </div>
        </div>

        {/* Catalog List section */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Header sorting option toolbar */}
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <span className="text-xs text-slate-500 font-medium pl-2">Showing {filteredProducts.length} of {products.length} products</span>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <select
                id="shop-sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs border border-slate-200 p-2 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-slate-500 w-full sm:w-auto font-semibold text-slate-600"
              >
                <option value="featured">Featured Collection</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="title-asc">Alphabetically: A-Z</option>
                <option value="title-desc">Alphabetically: Z-A</option>
              </select>
            </div>
          </div>

          {/* Catalog Listing Cards */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl p-8 space-y-4 shadow-xs">
              <span className="text-3xl block">🔍</span>
              <h3 className="font-extrabold text-slate-800 text-sm">No Products Found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">None of our active products match your combination of filters. Try clearing some selections or search for another keyword.</p>
              <button
                onClick={() => {
                  setSelectedBrandFilter(null);
                  setSelectedNicotineStrength(null);
                  setSearchTerm('');
                  setPriceRange(6.00);
                }}
                className="text-xs bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 px-5 rounded-lg cursor-pointer transition-colors"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.map(prod => {
                const inWishlist = isProductInWishlist(prod.id);
                return (
                  <div key={prod.id} className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-4 flex flex-col justify-between transition-all group hover:shadow-xs relative">
                    
                    {/* Heart wishlist top right */}
                    <button
                      onClick={() => handleHeartClick(prod.id)}
                      className={`absolute top-6 right-6 z-10 p-2 rounded-full border shadow-xs transition-transform hover:scale-105 cursor-pointer bg-white ${
                        inWishlist 
                          ? 'border-red-150 text-red-500 bg-red-50/10' 
                          : 'border-slate-100 text-slate-400 hover:text-slate-600'
                      }`}
                      title={inWishlist ? "Saved in your Wishlist" : "Save to Wishlist (Customer Login required)"}
                    >
                      <Heart className={`h-4.5 w-4.5 ${inWishlist ? 'fill-red-500' : ''}`} />
                    </button>

                    {/* Image visual wrapper */}
                    <div 
                      onClick={() => {
                        window.history.pushState({}, '', `/products/${prod.slug || prod.id}`);
                        window.dispatchEvent(new Event('popstate'));
                      }}
                      className="relative mb-4 overflow-hidden rounded-xl bg-slate-50 border border-slate-100 cursor-pointer"
                    >
                      <img
                        src={prod.image}
                        alt={prod.title}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-102"
                        referrerPolicy="no-referrer"
                      />
                      {prod.compareAtPrice > prod.price && (
                        <span className="absolute top-3 left-3 bg-red-500 text-white font-extrabold text-[9px] uppercase tracking-wider py-1 px-2.5 rounded-full shadow-sm">
                          Sale Saving
                        </span>
                      )}
                      {prod.inventory <= 15 && prod.inventory > 0 && (
                        <span className="absolute bottom-3 left-3 bg-amber-500 text-white font-extrabold text-[8px] uppercase tracking-widest py-1 px-2 rounded-md shadow-xs">
                          {prod.inventory} Left
                        </span>
                      )}
                    </div>

                    {/* Product Metadata Info */}
                    <div className="flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        {/* Brand tag indicator */}
                        <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest block mb-1">
                          {prod.vendor} Official
                        </span>
                        
                        {/* Main Title heading line */}
                        <h4 
                          onClick={() => {
                            window.history.pushState({}, '', `/products/${prod.slug || prod.id}`);
                            window.dispatchEvent(new Event('popstate'));
                          }}
                          className="text-xs font-extrabold text-slate-800 leading-normal tracking-tight hover:text-indigo-600 transition-colors cursor-pointer"
                        >
                          {prod.title}
                        </h4>

                        {/* Inventory stock state visual row */}
                        <div className="flex items-center gap-1.5 mt-1.5 text-[10px]">
                          <span className={`h-1.5 w-1.5 rounded-full ${prod.inventory > 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
                          <span className="text-slate-400 font-medium">
                            {prod.inventory > 0 ? `${prod.inventory} units available` : 'Temporarily Out of Stock'}
                          </span>
                        </div>
                      </div>

                      {/* Pricing and Action trigger row */}
                      <div className="pt-3 border-t border-slate-150/50 flex items-center justify-between gap-3 bg-slate-50/50 -mx-4 -mb-4 p-4 rounded-b-2xl">
                        <div className="space-y-0.5">
                          {prod.compareAtPrice > prod.price && (
                            <span className="text-[10px] line-through text-slate-400 block font-medium">
                              £{prod.compareAtPrice.toFixed(2)}
                            </span>
                          )}
                          <span className="text-sm font-black text-slate-900 block">
                            £{prod.price.toFixed(2)}
                          </span>
                        </div>

                        <button
                          onClick={() => onAddToCart(prod, 1)}
                          className="bg-slate-900 border border-slate-900 text-white hover:bg-slate-850 px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 flex items-center gap-1.5 transition-all shadow-xs group cursor-pointer"
                        >
                          <ShoppingCart className="h-3 w-3 shrink-0" />
                          <span>Add to Cart</span>
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Quick legal delivery disclaimer banner */}
          <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3 text-amber-800">
            <Info className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-bold block text-amber-900 leading-snug">Age Restricted Nicotine Pouches Policy</span>
              <p className="text-slate-500 leading-relaxed">
                By purchasing these items you strictly affirm you meet the full age criteria (18+/21+ depending on country regulations). Full verification triggers prior to any shipping handovers.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
