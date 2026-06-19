import React, { useState } from 'react';
import { Product, CartItem } from '../types';
import { Check, Info, RefreshCw, ShoppingCart, HelpCircle, Package, Sparkles } from 'lucide-react';

interface SubscriptionBuilderProps {
  allProducts: Product[];
  onAddSubToCart: (packName: string, items: { product: Product; quantity: number }[], frequency: string, flatPrice: number) => void;
}

export default function SubscriptionBuilder({ allProducts, onAddSubToCart }: SubscriptionBuilderProps) {
  const [selectedBrand, setSelectedBrand] = useState('77');
  const [allocatedItems, setAllocatedItems] = useState<{ [productId: string]: number }>({});
  const [frequency, setFrequency] = useState('Every 2 weeks');
  const [successAnimation, setSuccessAnimation] = useState(false);

  // Available brand tabs
  const brands = ['77', 'CUBA', 'CLEW', 'KILLA', 'VELO'];

  const filteredProducts = allProducts.filter(p => p.vendor === selectedBrand && p.status === 'Active');

  const totalSelectedCount = (Object.values(allocatedItems) as number[]).reduce((sum, count) => sum + count, 0);

  const handleAddProduct = (product: Product) => {
    if (totalSelectedCount >= 6) {
      alert("You have already selected 6 items. Please remove some items if you'd like to choose different ones.");
      return;
    }
    setAllocatedItems(prev => ({
      ...prev,
      [product.id]: (prev[product.id] || 0) + 1
    }));
  };

  const handleRemoveProduct = (productId: string) => {
    setAllocatedItems(prev => {
      const current = prev[productId] || 0;
      if (current <= 1) {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      }
      return {
        ...prev,
        [productId]: current - 1
      };
    });
  };

  const handleClearAllocation = () => {
    setAllocatedItems({});
  };

  const handleAddToCartClick = () => {
    if (totalSelectedCount !== 6) {
      alert("Please select exactly 6 products to complete your LITE pack subscription!");
      return;
    }

    const compiledItems = (Object.entries(allocatedItems) as [string, number][]).map(([id, quantity]) => {
      const product = allProducts.find(p => p.id === id)!;
      return { product, quantity };
    });

    // Flat rate subscription price for LITE plan: £24.99 (high value pack!)
    onAddSubToCart("LITE Subscription Pack", compiledItems, frequency, 24.99);
    
    setSuccessAnimation(true);
    setTimeout(() => {
      setSuccessAnimation(false);
      setAllocatedItems({});
    }, 2500);
  };

  return (
    <div id="subscription-pack-builder" className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Title block */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs bg-indigo-100 text-indigo-700 font-bold py-1 px-3.5 rounded-full uppercase tracking-widest inline-flex items-center gap-1">
          <Sparkles className="h-3 w-3" /> Subscription Box Builder
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mt-3 tracking-tight">LITE PACK BUILDER</h1>
        <p className="text-slate-500 text-sm mt-3">
          Curate your customized subscription of 6 premium nicotine/energy pouches. Swap flavors, pause deliveries, or cancel anytime instantly with no fees.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left main: Brand Tabs & Collection Display */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Choose Products: Brand Collections</h3>
            
            {/* Brands selector buttons */}
            <div className="flex flex-wrap gap-2 pb-4 border-b border-slate-100 mb-6">
              {brands.map(brand => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={`py-2 px-5 text-sm rounded-lg font-bold transition-all cursor-pointer ${
                    selectedBrand === brand 
                      ? 'bg-slate-900 border-slate-900 text-white shadow-sm' 
                      : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>

            {/* Display list of products belonging to selected brand */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.map(prod => {
                const countAllocated = allocatedItems[prod.id] || 0;
                return (
                  <div 
                    key={prod.id} 
                    className={`border rounded-xl p-4 flex flex-col justify-between transition-all ${
                      countAllocated > 0 
                        ? 'border-indigo-500 bg-indigo-50/20 shadow-xs' 
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="relative mb-3">
                      <img
                        src={prod.image}
                        alt={prod.title}
                        className="w-full h-44 object-cover rounded-lg bg-slate-50 border border-slate-100"
                        referrerPolicy="no-referrer"
                      />
                      {countAllocated > 0 && (
                        <div className="absolute top-2 right-2 bg-indigo-600 text-white text-xs font-black h-7 w-7 rounded-full flex items-center justify-center shadow-md animate-scale">
                          {countAllocated}
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase block">{prod.vendor}</span>
                        <h4 className="text-xs font-extrabold text-slate-800 leading-snug line-clamp-2">{prod.title}</h4>
                        <p className="text-[11px] text-slate-400 mt-1 pb-2 line-clamp-2">{(prod.description || '').replace(/<[^>]*>/g, '')}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
                        <span className="text-xs font-bold text-slate-900">£{prod.price.toFixed(2)} / each</span>
                        
                        <div className="flex items-center gap-1">
                          {countAllocated > 0 && (
                            <button
                              onClick={() => handleRemoveProduct(prod.id)}
                              className="h-7 w-7 text-xs bg-white border border-slate-300 text-slate-600 hover:bg-slate-50 rounded-md font-bold flex items-center justify-center cursor-pointer transition-colors"
                            >
                              -
                            </button>
                          )}
                          <button
                            onClick={() => handleAddProduct(prod)}
                            className={`h-7 px-3 text-xs rounded-md font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                              countAllocated > 0 
                                ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                                : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                            }`}
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column: Box Summary Panel (Floating Box state) */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm sticky top-6 space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-800 text-sm tracking-wide flex items-center gap-1.5">
                <Package className="h-4.5 w-4.5 text-indigo-600" /> Subscription Box
              </h3>
              {totalSelectedCount > 0 && (
                <button
                  onClick={handleClearAllocation}
                  className="text-[10px] text-slate-400 font-semibold hover:text-slate-600 cursor-pointer"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Custom choice slots counter (Choose 6 items) */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-600 mb-1.5">
                <span>Allocating: {totalSelectedCount} / 6 products</span>
                <span>{totalSelectedCount === 6 ? 'Complete!' : `${6 - totalSelectedCount} left`}</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-600 h-full rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min((totalSelectedCount / 6) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Allocated products checklist */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {totalSelectedCount === 0 ? (
                <div className="text-center py-8 text-slate-400 space-y-2">
                  <span className="text-2xl block">📦</span>
                  <p className="text-[11px]">Your premium pack box is currently empty.</p>
                  <p className="text-[10px] text-slate-400">Select any 6 items from the brand collections on the left.</p>
                </div>
              ) : (
                (Object.entries(allocatedItems) as [string, number][]).map(([id, quantity]) => {
                  const prod = allProducts.find(p => p.id === id)!;
                  return (
                    <div key={id} className="flex gap-2 justify-between items-center bg-slate-50 border border-slate-200/50 p-2 rounded-lg text-xs">
                      <div className="flex items-center gap-2 truncate flex-1">
                        <img src={prod.image} className="w-8 h-8 rounded bg-white border shrink-0" alt="" referrerPolicy="no-referrer" />
                        <span className="font-semibold text-slate-700 truncate">{prod.title}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleRemoveProduct(id)}
                          className="h-5 w-5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-500 rounded flex items-center justify-center font-bold text-[10px] cursor-pointer"
                        >
                          -
                        </button>
                        <span className="font-extrabold text-slate-800 text-xs w-4 text-center">{quantity}</span>
                        <button
                          onClick={() => handleAddProduct(prod)}
                          className="h-5 w-5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-500 rounded flex items-center justify-center font-bold text-[10px] cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Frequency Selection */}
            <div className="border-t border-slate-100 pt-4">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Delivery Frequency</label>
              <select
                id="sub-frequency"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full text-xs border border-slate-200 p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="Every week">Every week (Save 15%)</option>
                <option value="Every 2 weeks">Every 2 weeks (Most Popular)</option>
                <option value="Every month">Every month</option>
                <option value="Every 2 months">Every 2 months</option>
              </select>
            </div>

            {/* Total Subscription Box pricing */}
            <div className="border-t border-slate-100 pt-4 space-y-3 bg-slate-50 p-4 rounded-xl">
              <div className="flex justify-between items-center text-xs text-slate-600">
                <span>6 pouches flat rate</span>
                <span className="line-through text-slate-400">£29.94</span>
              </div>
              <div className="flex justify-between items-center font-extrabold text-slate-800">
                <span className="text-xs">Subscription rate</span>
                <span className="text-lg text-emerald-600">£24.99 <span className="text-[10px] text-slate-400 font-medium font-sans">/ cycle</span></span>
              </div>

              <button
                id="add-sub-box-btn"
                disabled={totalSelectedCount !== 6}
                onClick={handleAddToCartClick}
                className={`w-full py-3.5 px-4 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-2 border cursor-pointer ${
                  totalSelectedCount === 6
                    ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-md'
                    : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="h-4 w-4" /> 
                {successAnimation ? 'Box added successfully!' : 'Add Subscription Box To Cart'}
              </button>

              <div className="flex items-start gap-1.5 text-[10px] text-slate-400 leading-normal pt-1">
                <Info className="h-3 w-3 shrink-0 text-slate-400 mt-0.5" />
                <span>You will be billed £24.99 recursively based on frequency. Access swap, skips, or instant terminations anytime from your customer portal.</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
