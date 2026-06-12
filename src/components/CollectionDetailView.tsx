import React, { useState, useMemo } from 'react';
import { Collection, Product } from '../types';
import { ArrowLeft, SlidersHorizontal, Eye, ShoppingCart, Heart, Grid, List } from 'lucide-react';

interface CollectionDetailViewProps {
  collection: Collection;
  allProducts: Product[];
  onAddToCart: (product: Product, qty: number) => void;
  onToggleWishlist: (productId: string) => void;
  onNavigate: (tab: string, arg?: string) => void;
}

export default function CollectionDetailView({
  collection,
  allProducts,
  onAddToCart,
  onToggleWishlist,
  onNavigate
}: CollectionDetailViewProps) {
  const [vendorFilter, setVendorFilter] = useState<string>('All');
  const [sortOrder, setSortOrder] = useState<string>('featured');

  // Filter products by collection matching list & brand filter
  const collectionProducts = useMemo(() => {
    let list = allProducts;
    
    // If not "all" collection, filter by designated productIds list
    if (collection.id !== 'all') {
      list = allProducts.filter(p => collection.productIds.includes(p.id));
    }

    if (vendorFilter !== 'All') {
      list = list.filter(p => p.vendor === vendorFilter);
    }

    // Apply sorting
    if (sortOrder === 'price-low-high') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'price-high-low') {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (sortOrder === 'title-asc') {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    }

    return list;
  }, [collection, allProducts, vendorFilter, sortOrder]);

  // Extract all available brands (vendors) for filters
  const availableVendors = useMemo(() => {
    const list = collection.id === 'all' 
      ? allProducts 
      : allProducts.filter(p => collection.productIds.includes(p.id));
    
    const brands = list.map(p => p.vendor);
    return ['All', ...Array.from(new Set(brands))];
  }, [collection, allProducts]);

  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
  };

  return (
    <div id="collection-detail-layout" className="bg-[#f6f6f7] min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Navigation back link */}
        <button
          onClick={() => {
            window.history.pushState({}, '', '/collections/all');
            onNavigate('frontend-shop');
          }}
          className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Collections</span>
        </button>

        {/* Curated Collection Header card */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs bg-slate-900 text-white min-h-[220px] flex items-center p-6 sm:p-10 lg:p-12">
          {collection.image && (
            <div className="absolute inset-0 z-0">
              <img 
                src={collection.image} 
                alt="" 
                className="w-full h-full object-cover opacity-25 filter blur-xs"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent" />
            </div>
          )}
          
          <div className="relative z-10 space-y-3 max-w-xl">
            <span className="text-[10px] text-indigo-400 font-black uppercase tracking-widest bg-indigo-500/10 border border-indigo-400/20 py-1 px-3.5 rounded-full inline-block">
              Curated Selection
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              {collection.title}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-sans">
              {collection.description || 'Discover our hand-picked portfolio of the finest crystal-freeze cans and refreshing pouch formulas available.'}
            </p>
            <div className="text-[10px] text-slate-400 font-extrabold uppercase bg-white/5 py-1 px-3 rounded-md w-fit">
              {collectionProducts.length} cans matching
            </div>
          </div>
        </div>

        {/* Filter / Sort control ribbon */}
        <div className="bg-white border border-slate-205 rounded-xl px-5 py-3.5 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs font-bold">
          
          {/* Brand/Vendor filter row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
              <SlidersHorizontal className="h-3.5 w-3.5" /> Filter Brand:
            </span>
            <div className="flex flex-wrap gap-1">
              {availableVendors.map(vendor => (
                <button
                  key={vendor}
                  onClick={() => setVendorFilter(vendor)}
                  className={`py-1 px-3 rounded-lg border text-[10px] uppercase font-black tracking-wider transition-all cursor-pointer ${
                    vendorFilter === vendor
                      ? 'bg-indigo-600 text-white border-indigo-650'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {vendor}
                </button>
              ))}
            </div>
          </div>

          {/* Sort order options dropdown */}
          <div className="flex items-center gap-2.5 w-full md:w-auto self-end md:self-auto justify-end">
            <span className="text-slate-400 uppercase tracking-wider text-[10px]">Sort by:</span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-slate-50 border border-slate-250 rounded-lg p-2 font-black text-[11px] uppercase text-slate-700 outline-none cursor-pointer focus:bg-white"
            >
              <option value="featured">Featured Picks</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="title-asc">Alphabetical (A-Z)</option>
            </select>
          </div>

        </div>

        {/* Curator Listing grid */}
        {collectionProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {collectionProducts.map(prod => (
              <div 
                key={prod.id} 
                onClick={() => {
                  window.history.pushState({}, '', `/products/${prod.id}`);
                  onNavigate('product-detail', prod.id);
                }}
                className="bg-white border hover:border-slate-350 p-4 rounded-xl space-y-4 cursor-pointer group hover:shadow-md transition-all flex flex-col justify-between"
              >
                {/* Image block thumbnail */}
                <div className="aspect-square rounded-lg bg-slate-50 border overflow-hidden relative p-4 flex items-center justify-center">
                  <img 
                    src={prod.image || 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=500&q=80'} 
                    className="max-h-full max-w-full object-contain transition-transform group-hover:scale-103 duration-300" 
                    alt={prod.title} 
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-2.5 left-2.5 bg-slate-900 border border-slate-800 text-white text-[9px] font-black uppercase py-0.5 px-2 rounded-full tracking-wider">
                    {prod.vendor}
                  </span>
                  
                  {prod.inventory === 0 && (
                    <span className="absolute top-2.5 right-2.5 bg-red-650 text-white text-[9px] font-black uppercase py-0.5 px-2 rounded-full">
                      Out of stock
                    </span>
                  )}
                </div>

                {/* Product Name & Pricing meta */}
                <div className="space-y-2 text-center mt-2 flex-grow">
                  <h4 className="text-xs font-black text-slate-800 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2 min-h-[32px]">
                    {prod.title}
                  </h4>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-[#1a1c1d] font-black text-xs">£{prod.price.toFixed(2)}</span>
                    {prod.compareAtPrice > prod.price && (
                      <span className="text-[10px] text-slate-400 line-through font-bold">
                        £{prod.compareAtPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action button triggers detail */}
                <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-[10px] font-extrabold uppercase">
                  <button
                    className="flex-1 py-1.5 px-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 rounded-lg flex items-center justify-center gap-1 transition-colors"
                  >
                    <Eye className="h-3 w-3" /> View Details
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (prod.inventory > 0) {
                        onAddToCart(prod, 1);
                      }
                    }}
                    disabled={prod.inventory === 0}
                    className={`p-2 rounded-lg border flex items-center justify-center transition-colors ${
                      prod.inventory > 0
                        ? 'bg-indigo-50 border-indigo-150 text-indigo-650 hover:bg-indigo-600 hover:text-white'
                        : 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed'
                    }`}
                    title="Add to Cart Hub"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border rounded-2xl p-16 text-center space-y-4 max-w-md mx-auto">
            <span className="text-5xl block">🥫</span>
            <h3 className="font-black text-slate-800 text-sm">No Matching Cans Found</h3>
            <p className="text-slate-450 text-xs leading-normal">
              There currently aren't any products loaded matching your brand or selection filter criteria under this collection catalog.
            </p>
            <button
              onClick={() => {
                setVendorFilter('All');
                setSortOrder('featured');
              }}
              className="py-2 px-4 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
