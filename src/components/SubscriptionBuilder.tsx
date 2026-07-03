import React, { useState, useEffect } from 'react';
import { Product, CartItem, Collection } from '../types';
import { Check, Info, RefreshCw, ShoppingCart, HelpCircle, Package, Sparkles, ArrowRight } from 'lucide-react';

interface SubscriptionBuilderProps {
  allProducts: Product[];
  collections: Collection[];
  onAddSubToCart: (packName: string, items: { product: Product; quantity: number }[], frequency: string, flatPrice: number) => void;
}

interface PlanConfig {
  slug: 'lite' | 'core' | 'pro' | 'ultimate';
  name: string;
  limit: number;
  price: number;
  perCan: string;
  extraLabel?: string;
  popular?: boolean;
}

const PLANS: PlanConfig[] = [
  {
    slug: 'lite',
    name: 'LITE',
    limit: 6,
    price: 27.99,
    perCan: '£4.67',
  },
  {
    slug: 'core',
    name: 'CORE',
    limit: 8,
    price: 35.99,
    perCan: '£4.50',
  },
  {
    slug: 'pro',
    name: 'PRO',
    limit: 10,
    price: 40.99,
    perCan: '£4.10',
    popular: true,
  },
  {
    slug: 'ultimate',
    name: 'ULTIMATE',
    limit: 12,
    price: 46.99,
    perCan: '£3.92',
    extraLabel: '£3.80 for any additional can',
  },
];

// Helper components for the high-fidelity pouch illustrations
const CanSVG = ({ brand, color }: { brand: string, color: string }) => {
  return (
    <div 
      className="w-10 h-10 rounded-full shrink-0 shadow-lg border border-white/40 flex items-center justify-center font-sans font-black text-[9px] text-white tracking-tighter select-none" 
      style={{ background: `radial-gradient(circle at 35% 35%, ${color} 0%, #0f172a 100%)` }}
    >
      {brand}
    </div>
  );
};

export default function SubscriptionBuilder({ allProducts, collections, onAddSubToCart }: SubscriptionBuilderProps) {
  const userCollections = collections.filter(c => c.id !== 'all');

  const [selectedCollectionId, setSelectedCollectionId] = useState<string>(() => {
    return userCollections.length > 0 ? userCollections[0].id : '';
  });

  // State to track selected variant ID per product ID
  const [selectedVariantIdForProduct, setSelectedVariantIdForProduct] = useState<{ [productId: string]: string }>({});

  // key format is "productId::variantId" (or "productId::main" if no variant)
  const [allocatedItems, setAllocatedItems] = useState<{ [key: string]: number }>({});
  const [frequency, setFrequency] = useState('Every 2 weeks');
  const [successAnimation, setSuccessAnimation] = useState(false);

  // Parse path to set active plan state
  const [activePlanSlug, setActivePlanSlug] = useState<'lite' | 'core' | 'pro' | 'ultimate' | null>(() => {
    let p = '';
    try {
      p = window.location.pathname;
    } catch (e) {}
    if (p.includes('/subscribe/lite')) return 'lite';
    if (p.includes('/subscribe/core')) return 'core';
    if (p.includes('/subscribe/pro')) return 'pro';
    if (p.includes('/subscribe/ultimate')) return 'ultimate';
    return null;
  });

  // URL Change synchronizer
  useEffect(() => {
    const handlePopState = () => {
      let p = '';
      try {
        p = window.location.pathname;
      } catch (e) {}
      if (p.includes('/subscribe/lite')) {
        setActivePlanSlug('lite');
      } else if (p.includes('/subscribe/core')) {
        setActivePlanSlug('core');
      } else if (p.includes('/subscribe/pro')) {
        setActivePlanSlug('pro');
      } else if (p.includes('/subscribe/ultimate')) {
        setActivePlanSlug('ultimate');
      } else if (p.includes('/subscribe')) {
        setActivePlanSlug(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const selectPlan = (slug: 'lite' | 'core' | 'pro' | 'ultimate' | null) => {
    setActivePlanSlug(slug);
    const newUrl = slug ? `/pages/subscribe/${slug}` : '/pages/subscribe';
    try {
      window.history.pushState({}, '', newUrl);
    } catch (e) {
      console.warn('[Subscription] pushState failed:', e);
    }
    // Reset selections when switching to avoid carry over
    setAllocatedItems({});
  };

  const activePlan = PLANS.find(p => p.slug === activePlanSlug);
  const activeLimit = activePlan ? activePlan.limit : 6;
  const activePrice = activePlan ? activePlan.price : 27.99;

  // Automatically select a default collection if selectedCollectionId is empty
  const activeCollection = userCollections.find(c => c.id === selectedCollectionId) || userCollections[0];

  const filteredProducts = activeCollection 
    ? allProducts.filter(p => activeCollection.productIds.includes(p.id) && p.status === 'Active')
    : [];

  const totalSelectedCount = (Object.values(allocatedItems) as number[]).reduce((sum, count) => sum + count, 0);

  const getSelectedVariantId = (prod: Product) => {
    if (!prod.concreteVariants || prod.concreteVariants.length === 0) {
      return 'main';
    }
    return selectedVariantIdForProduct[prod.id] || prod.concreteVariants[0].id;
  };

  const handleAddProduct = (product: Product, forcedVariantId?: string) => {
    if (totalSelectedCount >= activeLimit) {
      alert(`You have already selected ${activeLimit} items. Please remove some items if you'd like to choose different ones.`);
      return;
    }
    const vid = forcedVariantId || getSelectedVariantId(product);
    const key = `${product.id}::${vid}`;
    setAllocatedItems(prev => ({
      ...prev,
      [key]: (prev[key] || 0) + 1
    }));
  };

  const handleRemoveProductKey = (key: string) => {
    setAllocatedItems(prev => {
      const current = prev[key] || 0;
      if (current <= 1) {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      }
      return {
        ...prev,
        [key]: current - 1
      };
    });
  };

  const handleClearAllocation = () => {
    setAllocatedItems({});
  };

  const handleAddToCartClick = () => {
    if (totalSelectedCount !== activeLimit) {
      alert(`Please select exactly ${activeLimit} products to complete your ${activePlan?.name || 'custom'} pack subscription!`);
      return;
    }

    const compiledItems = (Object.entries(allocatedItems) as [string, number][]).map(([key, quantity]) => {
      const [prodId, variantId] = key.split('::');
      const prod = allProducts.find(p => p.id === prodId)!;

      const variant = variantId !== 'main' 
        ? prod.concreteVariants?.find(v => v.id === variantId) 
        : null;

      const finalProduct: Product = {
        ...prod,
        id: variant ? variant.id : prod.id,
        title: variant ? `${prod.title} ${variant.name}` : prod.title,
        price: variant ? variant.price : prod.price,
        image: (variant && variant.images && variant.images.length > 0 && variant.images[0])
          ? variant.images[0]
          : prod.image
      };

      return { product: finalProduct, quantity };
    });

    onAddSubToCart(`${activePlan?.name || 'Custom'} Subscription Pack`, compiledItems, frequency, activePrice);
    
    setSuccessAnimation(true);
    setTimeout(() => {
      setSuccessAnimation(false);
      setAllocatedItems({});
    }, 2500);
  };

  // --- RENDERING PLAN CHOICE SCREEN (plan.jpg equivalent) ---
  if (!activePlanSlug) {
    return (
      <div className="bg-[#0f172a] text-white min-h-[85vh] py-16 px-4">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase">
              Choose Your Plan
            </h1>
            <p className="text-slate-400 text-sm max-w-lg mx-auto">
              Select one of our ultra-flexible automated subscription plans. Tailor your box size, swap flavors easily, and unlock Scandinavan lab fresh releases.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {PLANS.map((plan) => {
              const isPro = plan.slug === 'pro';
              return (
                <div 
                  key={plan.slug} 
                  className={`bg-white text-slate-900 rounded-3xl p-6 flex flex-col justify-between relative shadow-2xl transition-all duration-300 hover:scale-[1.03] ${
                    isPro ? 'ring-4 ring-[#dfb55a]' : 'border border-slate-800/10'
                  }`}
                >
                  {/* "Most Popular" floating label */}
                  {isPro && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#dfb55a] text-slate-950 font-black text-[10px] tracking-widest uppercase px-4 py-1.5 rounded-full shadow-lg">
                      Most Popular
                    </div>
                  )}

                  <div className="space-y-6 text-center">
                    {/* Plan name */}
                    <h3 className="text-2xl font-black tracking-widest text-slate-900 mt-2 uppercase">{plan.name}</h3>

                    {/* SVG Illustration of cans on gold shelf / cardboard box */}
                    {plan.slug !== 'ultimate' ? (
                      <div className="relative h-28 w-full bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden flex items-center justify-center py-4 shadow-inner">
                        {/* Shelf */}
                        <div className="absolute inset-x-3 bottom-3 h-8 bg-gradient-to-t from-[#8c6d2d] to-[#b58d3d] border-t border-[#dfb55a] rounded-b-md shadow-md flex items-center justify-center">
                          <div className="w-full h-0.5 bg-white/20 absolute top-0" />
                        </div>
                        {/* Pouch Cans */}
                        <div className="flex gap-1 z-10 -mt-1.5 scale-90 px-2 overflow-hidden justify-center w-full">
                          <CanSVG brand="77" color="#dc2626" />
                          <CanSVG brand="SNU" color="#0284c7" />
                          <CanSVG brand="VEL" color="#16a34a" />
                          {plan.limit >= 8 && <CanSVG brand="FUM" color="#4f46e5" />}
                          {plan.limit >= 10 && <CanSVG brand="XQS" color="#ea580c" />}
                        </div>
                      </div>
                    ) : (
                      <div className="relative h-28 w-full bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden flex items-center justify-center py-4 shadow-inner">
                        {/* Cardboard Box */}
                        <div className="absolute inset-x-4 bottom-2 top-2 bg-amber-100/40 border-2 border-amber-800/30 rounded-lg shadow-inner p-2 flex flex-wrap gap-1 justify-center items-center content-center">
                          <div className="grid grid-cols-6 gap-0.5 scale-[0.8]">
                            <CanSVG brand="77" color="#dc2626" />
                            <CanSVG brand="CLE" color="#0284c7" />
                            <CanSVG brand="CUB" color="#16a34a" />
                            <CanSVG brand="FUM" color="#4f46e5" />
                            <CanSVG brand="KIL" color="#ea580c" />
                            <CanSVG brand="MAG" color="#8b5cf6" />
                            <CanSVG brand="NOR" color="#e11d48" />
                            <CanSVG brand="PAB" color="#d97706" />
                            <CanSVG brand="SNU" color="#059669" />
                            <CanSVG brand="VEL" color="#475569" />
                            <CanSVG brand="FOX" color="#db2777" />
                            <CanSVG brand="XQS" color="#2563eb" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Stats List */}
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <div className="text-slate-500 font-extrabold uppercase tracking-wider text-[11px]">
                        QTY(Tubs) - {plan.limit}
                      </div>

                      <div className="text-3xl font-black text-slate-900 tracking-tight">
                        £{plan.price.toFixed(2)}
                      </div>

                      <div className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                        PER CAN(INC VAT) - {plan.perCan}
                      </div>
                    </div>
                  </div>

                  {/* Red optional note / choose action */}
                  <div className="mt-8 space-y-3">
                    {plan.extraLabel ? (
                      <div className="text-center py-1 bg-red-50 text-red-600 font-extrabold text-[10px] tracking-wide uppercase rounded-full border border-red-100">
                        {plan.extraLabel}
                      </div>
                    ) : (
                      <div className="h-6" /> // Placeholder for equal sizing
                    )}

                    <button
                      onClick={() => selectPlan(plan.slug)}
                      className={`w-full py-3 px-6 rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-md cursor-pointer ${
                        isPro 
                          ? 'bg-[#dfb55a] text-slate-950 hover:bg-[#cf9e42]' 
                          : 'bg-black text-white hover:bg-slate-800'
                      }`}
                    >
                      Choose Plan
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    );
  }

  // --- RENDERING BUILDER VIEW (topbar.jpg equivalent) ---
  return (
    <div id="subscription-pack-builder" className="max-w-7xl mx-auto px-4 py-8">
      
      {/* 1. TOPBAR SECTION (topbar.jpg equivalent) */}
      <div className="flex flex-col items-center mb-10 space-y-6">
        
        {/* Rounded Pill Container Topbar */}
        <div className="bg-slate-100 p-1.5 rounded-full flex flex-wrap justify-center items-center gap-1.5 shadow-md border border-slate-200/80 max-w-2xl">
          {PLANS.map((plan) => {
            const isSelected = plan.slug === activePlanSlug;
            return (
              <div key={plan.slug} className="relative">
                {/* Float tag for Pro popular badge */}
                {plan.slug === 'pro' && (
                  <span className="absolute -top-3.5 right-2 bg-[#dfb55a] text-slate-950 text-[7.5px] font-black uppercase px-2 py-0.5 rounded-md shadow-xs border border-white/60">
                    Most Popular
                  </span>
                )}
                <button
                  onClick={() => selectPlan(plan.slug)}
                  className={`py-2 px-5 text-[10px] md:text-xs font-black uppercase tracking-wider rounded-full transition-all duration-300 cursor-pointer ${
                    isSelected 
                      ? 'bg-slate-900 text-white shadow-lg' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {plan.name} ({plan.limit} Tubs)
                </button>
              </div>
            );
          })}
          {/* Back Button to Choose Plan view */}
          <button
            onClick={() => selectPlan(null)}
            className="py-2 px-4 text-[10px] md:text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-full transition-all cursor-pointer border-l border-slate-200 pl-3.5 ml-1"
          >
            ← View Plans
          </button>
        </div>

        {/* Big centered title of active plan */}
        <div className="text-center">
          <h2 className="text-4xl font-black text-slate-900 tracking-widest uppercase mb-1">
            {activePlan.name}
          </h2>
          <p className="text-indigo-600 font-extrabold text-sm tracking-wide">
            Choose {activeLimit}
          </p>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left main: Brand Tabs & Collection Display */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-6 shadow-xs">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Choose Products: Brand Collections</h3>
            
            {/* Brands/Collections selector buttons */}
            {userCollections.length > 0 ? (
              <div className="flex flex-wrap gap-2 pb-4 border-b border-slate-100 mb-6">
                {userCollections.map(col => (
                  <button
                    key={col.id}
                    onClick={() => setSelectedCollectionId(col.id)}
                    className={`py-2 px-5 text-sm rounded-lg font-bold transition-all cursor-pointer ${
                      selectedCollectionId === col.id 
                        ? 'bg-slate-900 border-slate-900 text-white shadow-sm' 
                        : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {col.title}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-slate-50 border border-slate-150 rounded-xl mb-6">
                <p className="text-xs text-slate-500 font-medium">No collections found. Create collections in your Admin Dashboard first.</p>
              </div>
            )}

            {/* Display list of products belonging to selected brand/collection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(prod => {
                  const hasVariants = prod.concreteVariants && prod.concreteVariants.length > 0;
                  const currentVariantId = hasVariants 
                    ? (selectedVariantIdForProduct[prod.id] || prod.concreteVariants![0].id) 
                    : 'main';
                  
                  const currentVariant = hasVariants 
                    ? prod.concreteVariants!.find(v => v.id === currentVariantId) 
                    : null;

                  const currentPrice = currentVariant ? currentVariant.price : prod.price;
                  const key = `${prod.id}::${currentVariantId}`;
                  const countAllocated = allocatedItems[key] || 0;

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
                          src={(currentVariant && currentVariant.images && currentVariant.images.length > 0) ? currentVariant.images[0] : prod.image}
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

                      <div className="space-y-2.5 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase block">{prod.vendor}</span>
                          <h4 className="text-xs font-extrabold text-slate-800 leading-snug line-clamp-2">
                            {prod.title}
                            {currentVariant && (
                              <span className="text-indigo-600 font-extrabold ml-1">
                                ({currentVariant.name})
                              </span>
                            )}
                          </h4>
                          <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                            {currentVariant && currentVariant.description 
                              ? currentVariant.description.replace(/<[^>]*>/g, '') 
                              : (prod.description || '').replace(/<[^>]*>/g, '')}
                          </p>
                           {/* Variant Selector Dropdown if variants exist */}
                          {hasVariants && (
                            <div className="mt-2 text-left">
                              <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">
                                Select Variant / Option
                              </label>
                              <select
                                value={currentVariantId}
                                onChange={(e) => setSelectedVariantIdForProduct(prev => ({ ...prev, [prod.id]: e.target.value }))}
                                className="w-full text-xs font-bold border border-slate-200 bg-slate-50/50 p-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                              >
                                {prod.concreteVariants!.map(v => (
                                  <option key={v.id} value={v.id}>
                                    {v.name} - £{v.price.toFixed(2)}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}

                          {/* Beautiful allocated variants breakdown list for this product */}
                          {(() => {
                            const allocatedForThisProduct = Object.entries(allocatedItems)
                              .filter(([allocKey]) => allocKey.split('::')[0] === prod.id)
                              .map(([allocKey, qty]) => {
                                const vid = allocKey.split('::')[1];
                                const v = vid !== 'main' ? prod.concreteVariants?.find(x => x.id === vid) : null;
                                return { vid, qty, name: v ? v.name : 'Standard' };
                              });

                            if (allocatedForThisProduct.length === 0) return null;

                            return (
                              <div className="mt-3 p-2.5 bg-indigo-50/20 rounded-lg border border-indigo-100/50 text-[10px] space-y-1">
                                <span className="font-extrabold text-indigo-700 uppercase tracking-wider block text-[8px]">In Your Pack Box:</span>
                                {allocatedForThisProduct.map(item => (
                                  <div key={item.vid} className="flex justify-between items-center text-slate-700 font-semibold">
                                    <span>• {item.name}</span>
                                    <span className="bg-indigo-600 text-white font-extrabold px-2 py-0.5 rounded-full text-[9px] min-w-4 text-center">{item.qty}</span>
                                  </div>
                                ))}
                              </div>
                            );
                          })()}
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
                          <span className="text-xs font-bold text-slate-900">£{currentPrice.toFixed(2)} / each</span>
                          
                          <div className="flex items-center gap-1">
                            {countAllocated > 0 && (
                              <button
                                onClick={() => handleRemoveProductKey(key)}
                                className="h-7 w-7 text-xs bg-white border border-slate-300 text-slate-600 hover:bg-slate-50 rounded-md font-bold flex items-center justify-center cursor-pointer transition-colors"
                              >
                                -
                              </button>
                            )}
                            <button
                              onClick={() => handleAddProduct(prod, currentVariantId)}
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
                })
              ) : (
                <div className="col-span-full text-center py-12 text-slate-400">
                  <p className="text-sm font-medium">No active products inside this collection.</p>
                </div>
              )}
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

            {/* Custom choice slots counter (Choose 6 items etc) */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-600 mb-1.5">
                <span>Allocated: {totalSelectedCount} / {activeLimit} products</span>
                <span>{totalSelectedCount === activeLimit ? 'Complete!' : `${activeLimit - totalSelectedCount} left`}</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-600 h-full rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min((totalSelectedCount / activeLimit) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Allocated products checklist */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {totalSelectedCount === 0 ? (
                <div className="text-center py-8 text-slate-400 space-y-2">
                  <span className="text-2xl block">📦</span>
                  <p className="text-[11px]">Your premium pack box is currently empty.</p>
                  <p className="text-[10px] text-slate-400">Select any {activeLimit} items from the brand collections on the left.</p>
                </div>
              ) : (
                (Object.entries(allocatedItems) as [string, number][]).map(([key, quantity]) => {
                  const [prodId, variantId] = key.split('::');
                  const prod = allProducts.find(p => p.id === prodId);
                  if (!prod) return null;

                  const variant = variantId !== 'main' 
                    ? prod.concreteVariants?.find(v => v.id === variantId) 
                    : null;

                  const displayName = variant 
                    ? `${prod.title} (${variant.name})` 
                    : prod.title;

                  const displayImg = (variant && variant.images && variant.images.length > 0)
                    ? variant.images[0]
                    : prod.image;

                  return (
                    <div key={key} className="flex gap-2 justify-between items-center bg-slate-50 border border-slate-200/50 p-2 rounded-lg text-xs">
                      <div className="flex items-center gap-2 flex-1">
                        <img src={displayImg} className="w-8 h-8 rounded bg-white border shrink-0" alt="" referrerPolicy="no-referrer" />
                        <span className="font-semibold text-slate-700" title={displayName}>{displayName}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleRemoveProductKey(key)}
                          className="h-5 w-5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-500 rounded flex items-center justify-center font-bold text-[10px] cursor-pointer"
                        >
                          -
                        </button>
                        <span className="font-extrabold text-slate-800 text-xs w-4 text-center">{quantity}</span>
                        <button
                          onClick={() => handleAddProduct(prod, variantId)}
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
                <span>{activeLimit} pouches flat rate</span>
                <span className="line-through text-slate-400">£{(activePrice * 1.2).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center font-extrabold text-slate-800">
                <span className="text-xs">Subscription rate</span>
                <span className="text-lg text-emerald-600">£{activePrice.toFixed(2)} <span className="text-[10px] text-slate-400 font-medium font-sans">/ cycle</span></span>
              </div>

              {activePlan.slug === 'ultimate' && (
                <div className="text-[10px] text-red-600 font-extrabold uppercase text-center py-1 bg-red-50 border border-red-100 rounded-lg">
                  £3.80 for any additional can
                </div>
              )}

              <button
                id="add-sub-box-btn"
                disabled={totalSelectedCount !== activeLimit}
                onClick={handleAddToCartClick}
                className={`w-full py-3.5 px-4 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-2 border cursor-pointer ${
                  totalSelectedCount === activeLimit
                    ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-md animate-pulse'
                    : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="h-4 w-4" /> 
                {successAnimation ? 'Box added successfully!' : `Add ${activePlan.name} Box To Cart`}
              </button>

              <div className="flex items-start gap-1.5 text-[10px] text-slate-400 leading-normal pt-1">
                <Info className="h-3 w-3 shrink-0 text-slate-400 mt-0.5" />
                <span>You will be billed £{activePrice.toFixed(2)} recursively based on frequency. Access swap, skips, or instant terminations anytime from your customer portal.</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
