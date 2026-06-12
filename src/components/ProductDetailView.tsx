import React, { useState } from 'react';
import { Product, Customer } from '../types';
import { ArrowLeft, ShoppingCart, Heart, Shield, RotateCcw, Truck, Check, Sparkles } from 'lucide-react';

interface ProductDetailViewProps {
  product: Product;
  allProducts?: Product[];
  onAddToCart: (product: Product, qty: number) => void;
  onToggleWishlist: (productId: string) => void;
  onNavigate: (tab: string, arg?: string) => void;
}

export default function ProductDetailView({
  product,
  allProducts = [],
  onAddToCart,
  onToggleWishlist,
  onNavigate
}: ProductDetailViewProps) {
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleAddToCartClick = () => {
    onAddToCart(product, quantity);
    setAddedMessage(true);
    setTimeout(() => {
      setAddedMessage(false);
    }, 2500);
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    onToggleWishlist(product.id);
  };

  // Find related products (from same vendor/brand, excluding current product)
  const relatedProducts = allProducts
    .filter(p => p.vendor === product.vendor && p.id !== product.id)
    .slice(0, 4);

  return (
    <div id="product-detail-layout" className="bg-[#f6f6f7] min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Navigation Breadcrumb & Back action */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => {
              window.history.pushState({}, '', '/collections/all');
              onNavigate('frontend-shop');
            }}
            className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to All Products</span>
          </button>
          
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
            <span className="hover:text-slate-600 cursor-pointer" onClick={() => onNavigate('frontend-home')}>Home</span>
            <span>/</span>
            <span className="hover:text-slate-600 cursor-pointer" onClick={() => onNavigate('frontend-shop')}>Shop</span>
            <span>/</span>
            <span className="text-slate-600 truncate max-w-[150px]">{product.title}</span>
          </div>
        </div>

        {/* Core Product Sandbox */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 p-6 sm:p-8 lg:p-10">
          
          {/* Left Column: Premium Canvas Image Box */}
          <div className="space-y-4">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden aspect-square flex items-center justify-center p-6 relative group">
              <img
                src={product.image || 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80'}
                alt={product.title}
                className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-4 left-4 bg-indigo-600 text-white text-[9px] font-black uppercase py-1 px-3 rounded-full border border-indigo-500 tracking-wider">
                {product.vendor}
              </span>
              {product.inventory < 10 && product.inventory > 0 && (
                <span className="absolute top-4 right-4 bg-amber-500 text-slate-950 text-[9px] font-black uppercase py-1 px-3 rounded-full">
                  Only {product.inventory} Left
                </span>
              )}
              {product.inventory === 0 && (
                <span className="absolute top-4 right-4 bg-red-650 text-white text-[9px] font-black uppercase py-1 px-3 rounded-full">
                  Sold Out
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 text-center space-y-1">
                <span className="text-slate-400 block text-[8px] font-black uppercase tracking-wider">SKU Code</span>
                <span className="font-mono font-extrabold text-[#1a1c1d] text-[10px] block">{product.sku || 'N/A'}</span>
              </div>
              <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 text-center space-y-1">
                <span className="text-slate-400 block text-[8px] font-black uppercase tracking-wider">Weight</span>
                <span className="font-extrabold text-[#1a1c1d] text-xs block">{product.weight || 12}g</span>
              </div>
              <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 text-center space-y-1">
                <span className="text-slate-400 block text-[8px] font-black uppercase tracking-wider">Category</span>
                <span className="font-extrabold text-[#1a1c1d] text-xs truncate block">{product.category || 'Supplements'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Product Detail and Operations */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <span className="text-[10px] text-indigo-650 font-black uppercase tracking-widest block">{product.vendor} Pouches</span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">{product.title}</h1>
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-amber-400">
                    {'★★★★★'.split('').map((char, i) => (
                      <span key={i} className="text-xs">★</span>
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase">(5.0 Rating • Verified Merchant)</span>
                </div>
              </div>

              {/* Price Row */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-150/80 flex items-baseline gap-4">
                <span className="text-2xl font-black text-slate-900">£{product.price.toFixed(2)}</span>
                {product.compareAtPrice > product.price && (
                  <>
                    <span className="text-xs text-slate-400 line-through font-medium">£{product.compareAtPrice.toFixed(2)}</span>
                    <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 uppercase tracking-wide">
                      Save £{(product.compareAtPrice - product.price).toFixed(2)}
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Description</h3>
                <p className="text-slate-500 text-xs leading-relaxed font-sans font-medium whitespace-pre-line">
                  {product.description || 'No description provided for this premium item canister. Formulated in high precision labs for crystal freeze mouth refreshes.'}
                </p>
              </div>
            </div>

            {/* Addition panel actions */}
            <div className="space-y-4 pt-4 border-t border-slate-150">
              
              {/* Quantity selector */}
              {product.inventory > 0 && (
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-slate-700 uppercase tracking-wider">Quantity:</span>
                  <div className="flex items-center border border-slate-205 rounded-xl bg-slate-50 overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3.5 py-2 hover:bg-slate-200 text-slate-600 font-bold transition-colors cursor-pointer select-none"
                    >
                      -
                    </button>
                    <span className="px-5 font-extrabold text-xs text-slate-800 min-w-[40px] text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.inventory, quantity + 1))}
                      className="px-3.5 py-2 hover:bg-slate-200 text-slate-600 font-bold transition-colors cursor-pointer select-none"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase">({product.inventory} available)</span>
                </div>
              )}

              {/* Action Buttons row */}
              <div className="flex gap-3">
                {product.inventory > 0 ? (
                  <button
                    onClick={handleAddToCartClick}
                    className="flex-1 bg-[#1a1c1d] hover:bg-black text-white py-3.5 px-6 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer active:scale-98"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>Add to Cart</span>
                  </button>
                ) : (
                  <button
                    disabled
                    className="flex-1 bg-slate-100 text-slate-400 border border-slate-200 py-3.5 px-6 rounded-xl font-black text-xs uppercase tracking-widest cursor-not-allowed text-center"
                  >
                    Sold Out canister
                  </button>
                )}

                <button
                  onClick={handleToggleFavorite}
                  className={`p-3.5 rounded-xl border transition-all flex items-center justify-center cursor-pointer ${
                    isFavorite 
                      ? 'bg-red-50 text-red-600 border-red-200 shadow-xs' 
                      : 'bg-white hover:bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-600'
                  }`}
                  title="Add to Wishlist"
                >
                  <Heart className={`h-4.5 w-4.5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Toast response message feedback */}
              {addedMessage && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 flex items-center gap-2 animate-fade-in">
                  <div className="h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold leading-none">
                    <Check className="h-3 w-3" />
                  </div>
                  <span className="text-xs font-black tracking-wide">Successfully added {quantity} item(s) to your drawer cart!</span>
                </div>
              )}

              {/* Shipping and Trust badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-[10px] text-slate-500">
                <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <Truck className="h-4 w-4 text-indigo-600 shrink-0" />
                  <span className="font-medium">Free UK dispatch over £15</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <Shield className="h-4 w-4 text-indigo-600 shrink-0" />
                  <span className="font-medium">100% Certified Lab Pure</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <RotateCcw className="h-4 w-4 text-indigo-600 shrink-0" />
                  <span className="font-medium">Easy 30-Day Returns</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Related Products Panel Section */}
        {relatedProducts.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="h-4.5 w-4.5 text-indigo-600" />
              <span>More cans from {product.vendor}</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map(rel => (
                <div
                  key={rel.id}
                  onClick={() => {
                    setQuantity(1);
                    window.history.pushState({}, '', `/products/${rel.id}`);
                    onNavigate('product-detail', rel.id);
                  }}
                  className="bg-white border border-slate-200 hover:border-slate-350 p-4 rounded-xl space-y-3 cursor-pointer group hover:shadow-md transition-all text-center flex flex-col justify-between"
                >
                  <div className="h-36 rounded-lg bg-slate-50 border overflow-hidden relative flex items-center justify-center p-3">
                    <img src={rel.image} className="max-h-full max-w-full object-contain transition-transform group-hover:scale-102" alt="" referrerPolicy="no-referrer" />
                  </div>
                  <div className="space-y-1 mt-2">
                    <h4 className="text-[11px] font-black text-slate-800 truncate">{rel.title}</h4>
                    <p className="text-slate-900 font-extrabold text-[11px]">£{rel.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
