import React, { useState, useMemo } from 'react';
import { Product, Collection, Customer } from '../types';
import { 
  Search, Heart, ArrowUpDown, Tag, ShoppingCart, Info, Sparkles, 
  Grid, List, Check, CheckCircle2, ChevronRight, HelpCircle, 
  X, Award, ShieldCheck, Zap, Flame, RefreshCw, Compass, Filter,
  SlidersHorizontal, Scissors, Sparkle
} from 'lucide-react';

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
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedFits, setSelectedFits] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(600);
  
  // Custom Toggles
  const [inStockOnly, setInStockOnly] = useState(false);
  const [capsuleEligible, setCapsuleEligible] = useState(false);
  const [bestSellersOnly, setBestSellersOnly] = useState(false);
  const [newArrivalsOnly, setNewArrivalsOnly] = useState(false);

  // Layout & Sorting
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<string>('featured');

  // Sidebar expanders
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Local product quantities
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  // Style Quiz Modal State
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quizStep, setQuizStep] = useState(1);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizResult, setQuizResult] = useState<Product | null>(null);

  // Dynamic Brands & Counts from raw products list
  const allBrandsInStore = useMemo(() => {
    return Array.from(new Set(products.map(p => p.vendor))).filter(Boolean);
  }, [products]);

  // Dynamic Categories from raw products list
  const allCategoriesInStore = useMemo(() => {
    const cats = new Set<string>();
    products.forEach(p => {
      if (p.category) cats.add(p.category);
    });
    if (cats.size === 0) {
      ['Outerwear', 'Knitwear', 'Tops & Shirts', 'Tailoring', 'Accessories'].forEach(c => cats.add(c));
    }
    return Array.from(cats);
  }, [products]);

  // Helper to extract material
  const getProductMaterial = (p: Product): string => {
    const text = `${p.title} ${p.description || ''} ${(p.tags || []).join(' ')}`.toLowerCase();
    if (text.includes('cashmere')) return 'Cashmere';
    if (text.includes('wool') || text.includes('merino')) return 'Virgin Wool';
    if (text.includes('cotton')) return 'Organic Cotton';
    if (text.includes('denim')) return 'Japanese Denim';
    if (text.includes('leather')) return 'Italian Leather';
    if (text.includes('linen')) return 'Pure Linen';
    if (text.includes('silk')) return 'Mulberry Silk';
    return 'Artisanal Blend';
  };

  // Helper to extract fit
  const getProductFit = (p: Product): string => {
    const text = `${p.title} ${p.description || ''} ${(p.tags || []).join(' ')}`.toLowerCase();
    if (text.includes('oversized')) return 'Oversized';
    if (text.includes('relaxed')) return 'Relaxed Cut';
    if (text.includes('tailored') || text.includes('slim')) return 'Tailored Fit';
    return 'Classic Cut';
  };

  // Handle wishlist clicks safely
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

  // Checkbox helpers
  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const toggleMaterial = (mat: string) => {
    setSelectedMaterials(prev => 
      prev.includes(mat) ? prev.filter(m => m !== mat) : [...prev, mat]
    );
  };

  const toggleFit = (fit: string) => {
    setSelectedFits(prev => 
      prev.includes(fit) ? prev.filter(f => f !== fit) : [...prev, fit]
    );
  };

  const resetAllFilters = () => {
    setSearchTerm('');
    setSelectedBrands([]);
    setSelectedCategories([]);
    setSelectedMaterials([]);
    setSelectedFits([]);
    setPriceRange(600);
    setInStockOnly(false);
    setCapsuleEligible(false);
    setBestSellersOnly(false);
    setNewArrivalsOnly(false);
  };

  // Expand product variants into individual virtual products
  const expandedProducts = useMemo(() => {
    const list: Product[] = [];
    products.forEach(p => {
      if (p.status !== 'Active') return;
      if (p.concreteVariants && p.concreteVariants.length > 0) {
        p.concreteVariants.forEach(variant => {
          list.push({
            ...p,
            id: variant.id,
            title: `${p.title} - ${variant.name}`,
            price: variant.price !== undefined ? variant.price : p.price,
            description: variant.description || p.description,
            image: (variant.images && variant.images.length > 0) ? variant.images[0] : p.image,
            inventory: variant.inventory !== undefined ? variant.inventory : p.inventory,
            isVariantCard: true,
            concreteVariantId: variant.id,
            parentSlug: p.slug || p.id,
            parentId: p.id
          });
        });
      } else {
        list.push(p);
      }
    });

    const seen = new Set<string>();
    return list.filter(p => {
      if (!p.id) return false;
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });
  }, [products]);

  // Filtered list implementation
  const filteredProducts = useMemo(() => {
    let list = expandedProducts;

    // Filter by Active Collection selector (if not 'all')
    const currentCollection = collections.find(c => c.id === activeCollectionId) || collections[0];
    if (currentCollection && currentCollection.id !== 'all') {
      list = list.filter(p => {
        const checkId = p.parentId || p.id;
        return currentCollection.productIds.includes(checkId);
      });
    }

    // Search query filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.vendor.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Brand checkbox filter
    if (selectedBrands.length > 0) {
      list = list.filter(p => selectedBrands.includes(p.vendor));
    }

    // Category checkbox filter
    if (selectedCategories.length > 0) {
      list = list.filter(p => selectedCategories.includes(p.category));
    }

    // Material filter
    if (selectedMaterials.length > 0) {
      list = list.filter(p => selectedMaterials.includes(getProductMaterial(p)));
    }

    // Fit filter
    if (selectedFits.length > 0) {
      list = list.filter(p => selectedFits.includes(getProductFit(p)));
    }

    // Max Price slider filter
    list = list.filter(p => p.price <= priceRange);

    // Stock availability toggle
    if (inStockOnly) {
      list = list.filter(p => p.inventory > 0);
    }

    // Best Sellers / Featured toggle
    if (bestSellersOnly) {
      list = list.filter(p => p.tags.includes('best-seller') || p.tags.includes('featured') || p.compareAtPrice > p.price);
    }

    // New arrivals toggle
    if (newArrivalsOnly) {
      list = list.filter(p => p.tags.includes('new') || p.tags.includes('latest'));
    }

    // Sorting implementations
    if (sortBy === 'featured') {
      // Default sequence
    } else if (sortBy === 'price-asc') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'title-asc') {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'title-desc') {
      list = [...list].sort((a, b) => b.title.localeCompare(a.title));
    }

    return list;
  }, [
    expandedProducts, collections, activeCollectionId, searchTerm, 
    selectedBrands, selectedCategories, selectedMaterials, selectedFits,
    priceRange, inStockOnly, bestSellersOnly, newArrivalsOnly, sortBy
  ]);

  // Dynamic filter lists counting stats
  const filterCounts = useMemo(() => {
    const brandCounts: Record<string, number> = {};
    const categoryCounts: Record<string, number> = {};
    const materialCounts: Record<string, number> = {};
    const fitCounts: Record<string, number> = {};

    expandedProducts.forEach(p => {
      if (p.vendor) brandCounts[p.vendor] = (brandCounts[p.vendor] || 0) + 1;
      if (p.category) categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
      const mat = getProductMaterial(p);
      materialCounts[mat] = (materialCounts[mat] || 0) + 1;
      const fit = getProductFit(p);
      fitCounts[fit] = (fitCounts[fit] || 0) + 1;
    });

    return { brandCounts, categoryCounts, materialCounts, fitCounts };
  }, [expandedProducts]);

  // Quantity controllers per product card
  const handleQuantityChange = (productId: string, delta: number) => {
    setQuantities(prev => {
      const current = prev[productId] || 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [productId]: next };
    });
  };

  const getProductQuantity = (productId: string) => {
    return quantities[productId] || 1;
  };

  // Quiz controller
  const handleStartQuiz = () => {
    setIsQuizOpen(true);
    setQuizStep(1);
    setQuizAnswers({});
    setQuizResult(null);
  };

  const handleSelectQuizAnswer = (question: string, answer: string) => {
    const nextAnswers = { ...quizAnswers, [question]: answer };
    setQuizAnswers(nextAnswers);

    if (quizStep < 3) {
      setQuizStep(prev => prev + 1);
    } else {
      const preferredCategory = nextAnswers['category'];
      const preferredFit = nextAnswers['fit'];
      
      let match = products.find(p => {
        if (p.status !== 'Active') return false;
        const fits = getProductFit(p).toLowerCase();
        const cats = (p.category || '').toLowerCase();
        return (preferredCategory ? cats.includes(preferredCategory) : true) &&
               (preferredFit ? fits.includes(preferredFit) : true);
      });

      if (!match) {
        match = products.find(p => p.status === 'Active' && (p.category || '').toLowerCase().includes(preferredCategory || ''));
      }
      if (!match) {
        match = products.find(p => p.status === 'Active');
      }

      setQuizResult(match || null);
      setQuizStep(4);
    }
  };

  const handleAddQuizRecommendedToCart = () => {
    if (quizResult) {
      onAddToCart(quizResult, 1);
      setIsQuizOpen(false);
    }
  };

  return (
    <div id="shop-grids-page" className="w-full bg-[#FAF9F7] pb-16 animate-fade-in text-slate-900">
      
      {/* Top Value Assurance Bar */}
      <div className="bg-white border-b border-slate-200/80 py-2.5 px-4 text-[10px] sm:text-[11px] text-slate-600 font-semibold tracking-wider uppercase">
        <div className="max-w-[1440px] mx-auto w-full flex flex-wrap justify-between items-center gap-y-2 gap-x-6">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 mx-auto sm:mx-0">
            <span className="flex items-center gap-1.5">
              <span>🌿</span> 100% GOTS Organic Certified
            </span>
            <span className="flex items-center gap-1.5">
              <span>🧵</span> Heritage European Ateliers
            </span>
            <span className="flex items-center gap-1.5">
              <span>📦</span> Tracked Express Courier
            </span>
          </div>
          <div className="flex items-center gap-6 mx-auto sm:mx-0">
            <span className="flex items-center gap-1.5">
              <span>✨</span> 30-Day Complimentary Exchanges
            </span>
            <span className="flex items-center gap-1.5">
              <span>🔒</span> Encrypted Checkout
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        
        {/* Editorial Header Banner Block */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row justify-between items-stretch gap-6 shadow-xs relative overflow-hidden">
          
          {/* Left Column (Editorial Title & Philosophy) */}
          <div className="flex-1 flex flex-col justify-between space-y-5">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                AUTUMN / WINTER COLLECTION
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight leading-none uppercase">
                Curated Wardrobe & Apparel
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-xl leading-relaxed">
                Refined modern silhouettes tailored with virgin wool, organic cotton, and recycled cashmere. Crafted to endure beyond fleeting seasons.
              </p>
              
              {/* Category fast filters */}
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  onClick={() => onActiveCollectionChange('all')}
                  className={`text-[10px] font-bold uppercase tracking-wider py-1.5 px-3 rounded-full border transition-all cursor-pointer ${
                    activeCollectionId === 'all'
                      ? 'bg-slate-950 text-white border-slate-950'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  All Pieces ({products.length})
                </button>
                {collections.filter(c => c.id !== 'all').map(col => (
                  <button
                    key={col.id}
                    onClick={() => onActiveCollectionChange(col.id)}
                    className={`text-[10px] font-bold uppercase tracking-wider py-1.5 px-3 rounded-full border transition-all cursor-pointer ${
                      activeCollectionId === col.id
                        ? 'bg-slate-950 text-white border-slate-950'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    {col.title} ({col.productIds ? col.productIds.length : 0})
                  </button>
                ))}
              </div>
            </div>

            {/* Atelier Trust Metric */}
            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500 font-medium">
              <span className="text-slate-900 font-bold">Atelier Standard</span>
              <div className="flex items-center gap-0.5 text-amber-400">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
              <span>4.95/5 Client Satisfaction</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-700 font-semibold">Limited Small-Batch Production</span>
            </div>
          </div>

          {/* Right Column (Wardrobe Capsule Plan Promo) */}
          <div className="lg:w-[380px] bg-slate-950 text-white rounded-2xl p-6 flex flex-col justify-between gap-4 relative overflow-hidden group shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
            <div className="space-y-2 z-10">
              <span className="inline-flex items-center gap-1 text-[8.5px] font-extrabold tracking-widest text-amber-300 bg-amber-400/10 border border-amber-300/20 px-2.5 py-1 rounded-full uppercase">
                ✦ WARDROBE CAPSULE SERVICE
              </span>
              <h3 className="text-lg font-black tracking-tight leading-tight uppercase">
                Build your seasonal wardrobe & save 20%
              </h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Handpick signature outerwear, knitwear, and pants delivered on your terms with complimentary bespoke alterations.
              </p>
            </div>

            <div className="flex items-center justify-between z-10 pt-2 border-t border-white/10">
              <button 
                onClick={() => {
                  try {
                    window.history.pushState({}, '', '/subscribe');
                  } catch (e) {}
                  window.dispatchEvent(new Event('popstate'));
                }}
                className="bg-white hover:bg-slate-100 text-slate-950 font-black text-[11px] uppercase tracking-wider py-2.5 px-4 rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <span>Curate Capsule</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
              <span className="text-[10px] text-slate-400 font-mono font-bold">Cancel Anytime</span>
            </div>
          </div>

        </div>

        {/* Catalog Main Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* LEFT SIDEBAR - FILTER PANEL */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-6 shadow-xs">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-1.5">
                <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" /> FILTER PIECES
              </h2>
              {(selectedBrands.length > 0 || selectedCategories.length > 0 || selectedMaterials.length > 0 || selectedFits.length > 0 || priceRange < 600 || inStockOnly || bestSellersOnly || newArrivalsOnly) && (
                <button
                  onClick={resetAllFilters}
                  className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold uppercase tracking-wider cursor-pointer transition-colors"
                >
                  Reset all
                </button>
              )}
            </div>

            {/* Keyword search inside sidebar */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Search Catalog</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Overcoat, Cashmere, Pleated..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-xs p-2.5 pl-8 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-900 bg-slate-50/50"
                />
                <Search className="absolute left-2.5 top-3 h-3.5 w-3.5 text-slate-400" />
              </div>
            </div>

            {/* 1. CATEGORY CHECKBOX LIST */}
            <div className="space-y-2.5">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Garment Category</label>
              <div className="space-y-1.5">
                {allCategoriesInStore.slice(0, showAllCategories ? undefined : 6).map(cat => {
                  const count = filterCounts.categoryCounts[cat] || 0;
                  const isChecked = selectedCategories.includes(cat);
                  return (
                    <label key={cat} className="flex items-center justify-between text-xs text-slate-700 font-semibold hover:text-slate-950 cursor-pointer py-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleCategory(cat)}
                          className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 h-3.5 w-3.5"
                        />
                        <span>{cat}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono bg-slate-50 px-1.5 py-0.5 rounded">
                        {count}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 2. DESIGNER / ATELIER CHECKBOX LIST */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Atelier & Studio</label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {allBrandsInStore.slice(0, showAllBrands ? undefined : 6).map(brand => {
                  const count = filterCounts.brandCounts[brand] || 0;
                  const isChecked = selectedBrands.includes(brand);
                  return (
                    <label key={brand} className="flex items-center justify-between text-xs text-slate-700 font-semibold hover:text-slate-950 cursor-pointer py-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleBrand(brand)}
                          className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 h-3.5 w-3.5"
                        />
                        <span>{brand}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono bg-slate-50 px-1.5 py-0.5 rounded">
                        {count}
                      </span>
                    </label>
                  );
                })}
              </div>

              {allBrandsInStore.length > 6 && (
                <button
                  onClick={() => setShowAllBrands(!showAllBrands)}
                  className="text-[10px] text-slate-400 hover:text-slate-600 font-bold flex items-center gap-1 focus:outline-none"
                >
                  <span>{showAllBrands ? 'Show less' : 'Show more'}</span>
                  <span className="text-[8px]">{showAllBrands ? '▲' : '▼'}</span>
                </button>
              )}
            </div>

            {/* 3. MATERIAL / FABRIC LIST */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Fabric & Material</label>
              <div className="space-y-1.5">
                {[
                  { id: 'Organic Cotton', label: '100% Organic Cotton' },
                  { id: 'Virgin Wool', label: 'Virgin Wool & Merino' },
                  { id: 'Cashmere', label: 'Pure Cashmere' },
                  { id: 'Japanese Denim', label: 'Heavy Selvedge Denim' },
                  { id: 'Italian Leather', label: 'Full Grain Leather' }
                ].map(mat => {
                  const isChecked = selectedMaterials.includes(mat.id);
                  const count = filterCounts.materialCounts[mat.id] || 0;
                  return (
                    <label key={mat.id} className="flex items-center justify-between text-xs text-slate-700 font-semibold hover:text-slate-950 cursor-pointer py-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleMaterial(mat.id)}
                          className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 h-3.5 w-3.5"
                        />
                        <span>{mat.label}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono bg-slate-50 px-1.5 py-0.5 rounded">
                        {count}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 4. SILHOUETTE & FIT */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Cut & Silhouette</label>
              <div className="space-y-1.5">
                {[
                  { id: 'Relaxed Cut', label: 'Relaxed Cut' },
                  { id: 'Oversized', label: 'Oversized' },
                  { id: 'Tailored Fit', label: 'Tailored Slim' },
                  { id: 'Classic Cut', label: 'Classic Straight' }
                ].map(fit => {
                  const isChecked = selectedFits.includes(fit.id);
                  const count = filterCounts.fitCounts[fit.id] || 0;
                  return (
                    <label key={fit.id} className="flex items-center justify-between text-xs text-slate-700 font-semibold hover:text-slate-950 cursor-pointer py-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleFit(fit.id)}
                          className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 h-3.5 w-3.5"
                        />
                        <span>{fit.label}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono bg-slate-50 px-1.5 py-0.5 rounded">
                        {count}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 5. PRICE RANGE SLIDER */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <div className="flex justify-between items-center text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                <span>Maximum Price</span>
                <span className="text-slate-950 font-black text-xs font-mono">£{priceRange.toFixed(0)}</span>
              </div>
              <input
                type="range"
                min="30"
                max="600"
                step="10"
                value={priceRange}
                onChange={(e) => setPriceRange(parseFloat(e.target.value))}
                className="w-full accent-slate-950 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-bold font-mono">
                <span>£30</span>
                <span>£600+</span>
              </div>
            </div>

            {/* 6. AVAILABILITY CHECKBOX MATRIX */}
            <div className="space-y-1.5 pt-3 border-t border-slate-100">
              <label className="flex items-center gap-2 text-xs text-slate-700 font-semibold hover:text-slate-950 cursor-pointer py-1">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 h-3.5 w-3.5"
                />
                <span>In Stock Only</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-700 font-semibold hover:text-slate-950 cursor-pointer py-1">
                <input
                  type="checkbox"
                  checked={bestSellersOnly}
                  onChange={(e) => setBestSellersOnly(e.target.checked)}
                  className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 h-3.5 w-3.5"
                />
                <span>Best Sellers & Sale</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-700 font-semibold hover:text-slate-950 cursor-pointer py-1">
                <input
                  type="checkbox"
                  checked={newArrivalsOnly}
                  onChange={(e) => setNewArrivalsOnly(e.target.checked)}
                  className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 h-3.5 w-3.5"
                />
                <span>New Season Arrivals</span>
              </label>
            </div>

            {/* Style & Fit Quiz Promo Card */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-slate-900">
                <Scissors className="h-4 w-4" />
                <h4 className="text-xs font-black uppercase tracking-wider">Style & Fit Finder</h4>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Answer 3 quick questions to discover tailored pieces matched to your height and silhouette.
              </p>
              <button
                onClick={handleStartQuiz}
                className="w-full bg-white hover:bg-slate-100 text-slate-900 border border-slate-200 font-black text-[10px] uppercase tracking-wider py-2 rounded-lg transition-colors cursor-pointer"
              >
                Launch Style Finder
              </button>
            </div>

          </div>

          {/* RIGHT COLUMN - CATALOG RESULTS & SORTING */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Top Toolbar */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xs">
              <div className="text-xs text-slate-500 font-medium">
                Showing <strong className="text-slate-950 font-bold">{filteredProducts.length}</strong> of {products.length} curated pieces
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                {/* View toggle */}
                <div className="flex items-center border border-slate-200 rounded-xl p-0.5 bg-slate-50">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      viewMode === 'grid' ? 'bg-white shadow-xs text-slate-950' : 'text-slate-400 hover:text-slate-700'
                    }`}
                    title="Grid View"
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      viewMode === 'list' ? 'bg-white shadow-xs text-slate-950' : 'text-slate-400 hover:text-slate-700'
                    }`}
                    title="Editorial List View"
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>

                {/* Sort Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
                  >
                    <option value="featured">Featured Curation</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="title-asc">Designation: A to Z</option>
                    <option value="title-desc">Designation: Z to A</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4">
                <div className="h-14 w-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                  <Search className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">No Pieces Match Filter Criteria</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Try broadening your price range, clearing selected fabric tags, or searching for a different keyword.
                  </p>
                </div>
                <button
                  onClick={resetAllFilters}
                  className="bg-slate-950 text-white text-xs font-black uppercase tracking-wider py-2.5 px-5 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Reset Catalog Filters
                </button>
              </div>
            ) : (
              /* PRODUCTS DISPLAY */
              <div className={
                viewMode === 'grid' 
                  ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6" 
                  : "space-y-4"
              }>
                {filteredProducts.map(prod => {
                  const inWishlist = isProductInWishlist(prod.id);
                  const material = getProductMaterial(prod);
                  const fit = getProductFit(prod);
                  const localQty = getProductQuantity(prod.id);

                  return (
                    <div 
                      key={prod.id} 
                      className={`bg-white border border-slate-200 hover:border-slate-400 rounded-2xl overflow-hidden transition-all duration-300 group hover:shadow-xl relative flex ${
                        viewMode === 'grid' ? 'flex-col justify-between' : 'flex-col sm:flex-row items-stretch sm:items-center gap-6 p-4'
                      }`}
                    >
                      {/* Image Frame */}
                      <div 
                        onClick={() => {
                          try {
                            const navArg = prod.isVariantCard
                              ? `${prod.parentSlug || prod.parentId}?variant=${prod.concreteVariantId}`
                              : (prod.slug || prod.id);
                            window.history.pushState({}, '', `/products/${navArg}`);
                          } catch (e) {}
                          window.dispatchEvent(new Event('popstate'));
                        }}
                        className={`relative cursor-pointer overflow-hidden bg-slate-100 shrink-0 ${
                          viewMode === 'grid' ? 'w-full aspect-[4/5]' : 'w-full sm:w-48 aspect-[4/5] rounded-xl'
                        }`}
                      >
                        <img
                          src={prod.image}
                          alt={prod.title}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />

                        {/* Top Badges */}
                        <div className="absolute top-3.5 left-3.5 z-10 flex flex-col gap-1">
                          {prod.compareAtPrice > prod.price ? (
                            <span className="bg-rose-600 text-white text-[8px] font-black uppercase tracking-widest py-1 px-2.5 rounded-md shadow-xs">
                              SALE ARCHIVE
                            </span>
                          ) : prod.tags.includes('new') ? (
                            <span className="bg-slate-900 text-white text-[8px] font-black uppercase tracking-widest py-1 px-2.5 rounded-md shadow-xs">
                              NEW SEASON
                            </span>
                          ) : (
                            <span className="bg-white/90 backdrop-blur-xs text-slate-900 text-[8px] font-black uppercase tracking-widest py-1 px-2.5 rounded-md border border-slate-200 shadow-xs">
                              {prod.vendor}
                            </span>
                          )}
                        </div>

                        {/* Wishlist Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleHeartClick(prod.id);
                          }}
                          className={`absolute top-3.5 right-3.5 z-10 p-2 rounded-full border shadow-xs transition-transform hover:scale-110 cursor-pointer ${
                            inWishlist 
                              ? 'bg-white text-rose-600 border-rose-200 shadow-sm' 
                              : 'bg-white/80 backdrop-blur-xs text-slate-400 hover:text-slate-900 border-white/60'
                          }`}
                          title={inWishlist ? "Saved in Wishlist" : "Save to Wishlist"}
                        >
                          <Heart className={`h-4 w-4 ${inWishlist ? 'fill-rose-600 text-rose-600' : ''}`} />
                        </button>
                      </div>

                      {/* Content Details */}
                      <div className={`flex-1 flex flex-col justify-between ${viewMode === 'grid' ? 'p-5 space-y-4' : 'space-y-3'}`}>
                        <div className="space-y-2">
                          
                          {/* Fabric & Fit Pills */}
                          <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                            <span>{material}</span>
                            <span>•</span>
                            <span>{fit}</span>
                          </div>

                          {/* Title */}
                          <h3 
                            onClick={() => {
                              try {
                                const navArg = prod.isVariantCard
                                  ? `${prod.parentSlug || prod.parentId}?variant=${prod.concreteVariantId}`
                                  : (prod.slug || prod.id);
                                window.history.pushState({}, '', `/products/${navArg}`);
                              } catch (e) {}
                              window.dispatchEvent(new Event('popstate'));
                            }}
                            className="text-sm font-black text-slate-900 tracking-tight leading-snug hover:text-indigo-600 transition-colors cursor-pointer uppercase line-clamp-2"
                          >
                            {prod.title}
                          </h3>

                          {/* Pricing Row */}
                          <div className="flex items-baseline gap-2 pt-1">
                            <span className="text-base font-black text-slate-950 font-mono">
                              £{prod.price.toFixed(2)}
                            </span>
                            {prod.compareAtPrice > prod.price && (
                              <span className="text-xs text-slate-400 line-through font-mono">
                                £{prod.compareAtPrice.toFixed(2)}
                              </span>
                            )}
                            <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded ml-auto">
                              Capsule eligible
                            </span>
                          </div>
                        </div>

                        {/* Action CTA & Quantity */}
                        <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                          {/* Quantity Selector */}
                          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl h-9 px-1 shrink-0">
                            <button
                              onClick={() => handleQuantityChange(prod.id, -1)}
                              className="w-7 h-7 text-slate-500 hover:text-slate-900 font-extrabold flex items-center justify-center text-xs transition-colors cursor-pointer"
                            >
                              -
                            </button>
                            <span className="w-6 text-center text-xs font-black text-slate-800 font-mono">
                              {localQty}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(prod.id, 1)}
                              className="w-7 h-7 text-slate-500 hover:text-slate-900 font-extrabold flex items-center justify-center text-xs transition-colors cursor-pointer"
                            >
                              +
                            </button>
                          </div>

                          {/* Add to Bag Button */}
                          <button
                            onClick={() => {
                              onAddToCart(prod, localQty);
                              setQuantities(prev => ({ ...prev, [prod.id]: 1 }));
                            }}
                            className="flex-1 bg-slate-950 hover:bg-slate-850 text-white font-black py-2 px-3 text-[11px] rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer uppercase tracking-wider"
                          >
                            <ShoppingCart className="h-3.5 w-3.5 shrink-0" />
                            <span>Add to Bag</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Ethical Atelier Guarantee Banner */}
            <div className="bg-white border border-slate-200/80 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4 text-slate-700 shadow-xs">
              <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-800">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="text-xs space-y-0.5 flex-1">
                <span className="font-black text-slate-900 uppercase tracking-wide block">Ethical Craftsmanship & Sustainability Guarantee</span>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Every garment is patterned, cut, and assembled by skilled artisans under safe European labor agreements using renewable energy and organic plant fibers.
                </p>
              </div>
              <button 
                onClick={() => {
                  try {
                    window.history.pushState({}, '', '/pages/our-story');
                  } catch (e) {}
                  window.dispatchEvent(new Event('popstate'));
                }}
                className="text-[11px] font-black uppercase tracking-wider text-slate-900 hover:underline shrink-0 cursor-pointer"
              >
                Read Manifesto →
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* STYLE & FIT QUIZ DIALOG */}
      {isQuizOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-6">
            
            {/* Close */}
            <button 
              onClick={() => setIsQuizOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            {/* Quiz Heading */}
            <div className="text-center space-y-1.5">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                ✦ BESPOKE STYLING
              </span>
              <h3 className="text-lg font-black text-slate-950 uppercase tracking-tight">
                Style & Fit Matchmaker
              </h3>
              <p className="text-xs text-slate-500">
                Answer 3 quick preferences to find your ideal wardrobe cornerstone
              </p>
            </div>

            {/* STEP 1: Silhouette preference */}
            {quizStep === 1 && (
              <div className="space-y-3 animate-fade-in">
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider text-center">
                  Question 1 of 3
                </span>
                <p className="text-xs font-bold text-slate-800 text-center pb-1">
                  What silhouette or fit do you gravitate towards most?
                </p>
                <div className="space-y-2">
                  {[
                    { id: 'relaxed', title: 'Relaxed & Contemporary', desc: 'Slightly dropped shoulders, fluid drapery, everyday comfort' },
                    { id: 'oversized', title: 'Architectural Oversized', desc: 'Bold structured volume, generous layering room, statement presence' },
                    { id: 'tailored', title: 'Modern Tailored Slim', desc: 'Precise cuts, clean lines, sharp shoulder and waist geometry' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectQuizAnswer('fit', opt.id)}
                      className="w-full text-left p-3.5 border border-slate-200 hover:border-slate-950 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer space-y-0.5"
                    >
                      <span className="text-xs font-black text-slate-900 block uppercase">{opt.title}</span>
                      <span className="text-[10px] text-slate-500">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: Category priority */}
            {quizStep === 2 && (
              <div className="space-y-3 animate-fade-in">
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider text-center">
                  Question 2 of 3
                </span>
                <p className="text-xs font-bold text-slate-800 text-center pb-1">
                  Which wardrobe area are you looking to upgrade right now?
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'outerwear', label: '🧥 Outerwear & Coats' },
                    { id: 'knitwear', label: '🧶 Heavy Knitwear' },
                    { id: 'tailoring', label: '👖 Tailored Trousers' },
                    { id: 'tops', label: '👔 Shirts & Essentials' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectQuizAnswer('category', opt.id)}
                      className="p-3.5 text-center border border-slate-200 hover:border-slate-950 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer text-xs font-bold text-slate-800"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3: Fabric & Tone */}
            {quizStep === 3 && (
              <div className="space-y-3 animate-fade-in">
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider text-center">
                  Question 3 of 3
                </span>
                <p className="text-xs font-bold text-slate-800 text-center pb-1">
                  What fabric tactile texture suits your daily routine?
                </p>
                <div className="space-y-2">
                  {[
                    { id: 'wool', label: 'Heavy Virgin Wool & Recycled Cashmere (Crisp & Thermal)' },
                    { id: 'cotton', label: '100% Dense Organic Cotton Poplin (Breathable & Crisp)' },
                    { id: 'denim', label: 'Raw Japanese Selvedge Twill (Structured & Rigid)' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectQuizAnswer('fabric', opt.id)}
                      className="w-full text-left p-3.5 border border-slate-200 hover:border-slate-950 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer text-xs font-semibold text-slate-800"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 4: Results */}
            {quizStep === 4 && (
              <div className="space-y-4 text-center animate-fade-in">
                <span className="text-2xl block">✦ YOUR MATCH</span>
                
                {quizResult ? (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 flex flex-col items-center">
                    <img 
                      src={quizResult.image} 
                      alt={quizResult.title} 
                      className="w-28 h-36 object-cover rounded-xl shadow-xs" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                        {quizResult.vendor}
                      </span>
                      <h4 className="text-xs font-black text-slate-900 uppercase">
                        {quizResult.title}
                      </h4>
                      <p className="text-xs font-black text-slate-900 font-mono">
                        £{quizResult.price.toFixed(2)}
                      </p>
                    </div>

                    <button
                      onClick={handleAddQuizRecommendedToCart}
                      className="w-full bg-slate-950 hover:bg-slate-800 text-white font-black py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer uppercase tracking-wider"
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                      <span>Add Match to Bag</span>
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">Explore the full catalog to find your tailored piece.</p>
                )}
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
