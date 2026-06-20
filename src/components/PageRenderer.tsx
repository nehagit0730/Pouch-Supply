import React, { useState } from 'react';
import { CustomPage, PageSection, Product, Collection, Customer, BlogPost } from '../types';
import { 
  ArrowRight, ShoppingCart, Star, Heart, FileText, Check, 
  ChevronDown, ChevronUp, Play, Sparkles, TrendingUp, Plus, Minus, ShieldCheck, Award, Eye, Flame, ArrowUpRight, BookOpen, Layers
} from 'lucide-react';
import PremiumSlideshow from './PremiumSlideshow';

interface PageRendererProps {
  page: CustomPage;
  allProducts: Product[];
  allCollections: Collection[];
  loggedInCustomer: Customer | null;
  onAddToCart: (product: Product, qty: number) => void;
  onToggleWishlist: (productId: string) => void;
  onNavigate: (tab: string, arg?: string) => void; // for shop, subscribe etc.
  allBlogs?: BlogPost[];
}

export default function PageRenderer({
  page,
  allProducts,
  allCollections,
  loggedInCustomer,
  onAddToCart,
  onToggleWishlist,
  onNavigate,
  allBlogs = []
}: PageRendererProps) {
  // Safe state for keeping track of active FAQs
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  // Safe parsing of custom links or routes
  const handleLinkClick = (link?: string) => {
    if (!link) return;
    if (link === 'frontend-shop' || link.includes('shop')) {
      onNavigate('frontend-shop');
    } else if (link === 'frontend-subscribe' || link.includes('subscribe')) {
      onNavigate('frontend-subscribe');
    } else if (link === 'frontend-brands' || link.includes('brands')) {
      onNavigate('frontend-brands');
    } else if (link.startsWith('/collections/')) {
      const slug = link.replace('/collections/', '');
      onNavigate('frontend-shop', slug);
    } else if (link.startsWith('/pages/')) {
      const slug = link.replace('/pages/', '');
      onNavigate(`page-${slug}`);
    } else {
      onNavigate('frontend-shop');
    }
  };

  const toggleFaq = (idx: number) => {
    setOpenFaqIdx(openFaqIdx === idx ? null : idx);
  };

  return (
    <div className="space-y-16 pb-24 font-sans">
      {page.sections && page.sections.length > 0 ? (
        page.sections.map((sec, idx) => {
          const sStyle = {
            backgroundColor: sec.settings.backgroundColor || '#FFFFFF',
            color: sec.settings.textColor || '#475569'
          };
          
          const isFullBleed = (sec.type === 'Slideshow' || sec.type === 'Image banner') && sec.settings.fullWidth;
          const maxContainerClass = sec.settings.fullWidth ? 'w-full' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';
          const paddingClass = isFullBleed ? 'py-0' : 'py-16 md:py-24';

          return (
            <section
              key={sec.id || idx}
              style={sStyle}
              className={`${paddingClass} relative transition-all duration-300 ${
                sec.settings.fullWidth 
                  ? '' 
                  : 'rounded-3xl border border-slate-200/60 shadow-xl my-10 mx-4 sm:mx-6 lg:mx-8 overflow-hidden bg-white hover:shadow-2xl'
              }`}
            >
              <div className={maxContainerClass}>
                
                {/* 1. IMAGE BANNER */}
                {sec.type === 'Image banner' && (
                  sec.settings.fullWidth ? (
                    /* High-fidelity full-width image banner (Hero style with real-time text overlay protection) */
                    <div className="relative w-full min-h-[380px] sm:min-h-[480px] md:min-h-[560px] flex items-center overflow-hidden">
                      {/* Background Image & Overlay */}
                      <div className="absolute inset-0 z-0">
                        <img
                          src={sec.settings.imageUrl || 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1400&q=80'}
                          alt={sec.settings.title || 'Brand Banner'}
                          className="w-full h-full object-cover origin-center scale-100 hover:scale-102 transition-transform duration-10000"
                          referrerPolicy="no-referrer"
                        />
                        {/* Dual protectant layer */}
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-transparent sm:block hidden" />
                        <div className="absolute inset-0 bg-slate-950/80 sm:hidden" />
                      </div>

                      {/* Content block aligned */}
                      <div className="max-w-7xl mx-auto w-full px-6 sm:px-12 md:px-16 relative z-10 text-white">
                        <div className="max-w-2xl space-y-4 sm:space-y-6">
                          <div className="inline-flex items-center gap-1.5 bg-indigo-600/90 text-white font-extrabold uppercase tracking-widest text-[8px] sm:text-[9px] py-1 px-3 rounded-full border border-indigo-400/30">
                            <Sparkles className="h-3 w-3 text-amber-300 animate-spin" />
                            <span>Exclusive Pouch Launch</span>
                          </div>

                          {sec.settings.title && (
                            <h1 
                              className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-none text-white drop-shadow-md"
                            >
                              {sec.settings.title}
                            </h1>
                          )}

                          {sec.settings.description && (
                            <p 
                              className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg drop-shadow-xs"
                            >
                              {sec.settings.description}
                            </p>
                          )}

                          {sec.settings.buttonText && (
                            <div className="pt-2">
                              <button
                                onClick={() => handleLinkClick(sec.settings.buttonLink)}
                                className="bg-white hover:bg-slate-100 text-slate-950 font-black text-[10px] sm:text-xs py-3.5 px-8 rounded-xl shadow-lg transition-all duration-300 cursor-pointer flex items-center gap-2 uppercase tracking-widest group"
                              >
                                <span>{sec.settings.buttonText}</span>
                                <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* High-fidelity boxed image banner (Side-by-side luxurious design with crisp margins) */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center p-6 sm:p-10 md:p-16">
                      <div className="space-y-6">
                        <div className="inline-flex items-center gap-1.5 text-indigo-600 font-extrabold uppercase tracking-widest text-[9px] bg-indigo-50 py-1 px-3 rounded-full">
                          <Award className="h-3 w-3" />
                          <span>Guaranteed Freshness</span>
                        </div>

                        {sec.settings.title && (
                          <h1 
                            className="text-3xl sm:text-4xl font-black uppercase tracking-tight leading-tight"
                            style={{ color: sec.settings.headingColor || '#0F172A' }}
                          >
                            {sec.settings.title}
                          </h1>
                        )}

                        {sec.settings.description && (
                          <p className="text-sm leading-relaxed opacity-90 text-slate-600">
                            {sec.settings.description}
                          </p>
                        )}

                        {sec.settings.buttonText && (
                          <div className="pt-2">
                            <button
                              onClick={() => handleLinkClick(sec.settings.buttonLink)}
                              className="bg-slate-900 hover:bg-slate-850 text-white font-extrabold text-xs py-3.5 px-8 rounded-xl transition-all shadow-md inline-flex items-center gap-2 cursor-pointer uppercase tracking-widest group"
                            >
                              <span>{sec.settings.buttonText}</span>
                              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="relative group overflow-hidden rounded-2xl border border-slate-200/80 shadow-lg aspect-4/3 md:aspect-square">
                        <img
                          src={sec.settings.imageUrl || 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80'}
                          alt={sec.settings.title || 'Banner Media'}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-103"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                      </div>
                    </div>
                  )
                )}

                {/* 2. VIDEO BANNER */}
                {sec.type === 'Video banner' && (
                  <div className="space-y-8 text-center max-w-4xl mx-auto px-4 sm:px-6">
                    <div className="space-y-3">
                      <span className="text-[10px] tracking-widest font-extrabold uppercase text-indigo-600 bg-indigo-50/85 py-1 px-3 rounded-full inline-block">
                        🎥 Laboratory Showcase
                      </span>
                      <h2
                        className="text-3xl sm:text-4xl font-black tracking-tight uppercase"
                        style={{ color: sec.settings.headingColor || '#000000' }}
                      >
                        {sec.settings.title || 'Watch Brand Highlights'}
                      </h2>
                      {sec.settings.description && (
                        <p className="text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto text-slate-500">{sec.settings.description}</p>
                      )}
                    </div>

                    <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-video bg-neutral-950 flex items-center justify-center max-w-3xl mx-auto group">
                      {sec.settings.videoUrl || sec.settings.videoEmbed ? (
                        <iframe
                          className="w-full h-full"
                          src={sec.settings.videoEmbed || `https://www.youtube.com/embed/${sec.settings.videoUrl || 'dQw4w9WgXcQ'}`}
                          title="Video Player"
                          allowFullScreen
                        />
                      ) : (
                        <div className="text-center p-12 space-y-4">
                          <div className="w-16 h-16 rounded-full bg-indigo-600/10 text-indigo-650 flex items-center justify-center mx-auto shadow-md border border-indigo-200">
                            <Play className="h-7 w-7 animate-pulse fill-indigo-650" />
                          </div>
                          <p className="font-mono text-[11px] text-slate-500">Pure Lab Grade Dispersion Quality (Configure URL in settings)</p>
                          <div className="text-[10px] text-slate-400 bg-slate-50 border border-slate-100 rounded-md py-1 px-3.5 inline-block">Ref: PLG-08206</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. IMAGE WITH TEXT */}
                {sec.type === 'Image with text' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center px-4 sm:px-6">
                    <div className="order-2 md:order-1 relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-indigo-500 rounded-3xl blur opacity-15 group-hover:opacity-20 transition duration-500" />
                      <div className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-50">
                        <img
                          src={sec.settings.imageUrl || 'https://images.unsplash.com/photo-1576186726115-4d51596775d1?auto=format&fit=crop&w=800&q=80'}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-102"
                          alt=""
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-6 order-1 md:order-2">
                      <div className="inline-flex items-center gap-1.5 bg-sky-50 text-sky-700 font-extrabold uppercase tracking-widest text-[9px] py-1 px-3 rounded-full">
                        <ShieldCheck className="h-3 w-3" />
                        <span>Premium Standard Guaranteed</span>
                      </div>
                      
                      <h2 
                        className="text-3xl font-black uppercase tracking-tight leading-tight"
                        style={{ color: sec.settings.headingColor || '#000000' }}
                      >
                        {sec.settings.title || 'Curate your package'}
                      </h2>
                      
                      <p className="text-sm opacity-90 leading-relaxed text-slate-600">
                        {sec.settings.description || 'Flexible deliveries straight to your shop or door.'}
                      </p>

                      {sec.settings.buttonText && (
                        <div className="pt-2">
                          <button
                            onClick={() => handleLinkClick(sec.settings.buttonLink)}
                            className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-3 px-6 rounded-xl transition-all shadow-md inline-flex items-center gap-2 cursor-pointer uppercase tracking-widest group"
                          >
                            <span>{sec.settings.buttonText}</span>
                            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 4. TEXT COLUMN WITH IMAGE */}
                {sec.type === 'Text column with image' && (
                  <div className="space-y-12 px-4 sm:px-6">
                    <div className="text-center max-w-2xl mx-auto space-y-3">
                      <span className="text-[10px] tracking-widest font-black uppercase text-indigo-600 bg-indigo-50/90 py-1 px-3.5 rounded-full inline-block">Our Foundations</span>
                      <h2 
                        className="text-3xl font-black uppercase tracking-tight"
                        style={{ color: sec.settings.headingColor || '#000000' }}
                      >
                        {sec.settings.title || 'Laboratory Certified Excellence'}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500">{sec.settings.description || 'Scientifically balanced plant extracts providing rich, uniform strength.'}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                      {[
                        { title: 'Global Certified Lab Testing', desc: 'Every batch is sourced strictly from laboratory test lines adhering to absolute security and clean protocols.', img: 'https://images.unsplash.com/photo-1576186726115-4d51596775d1?auto=format&fit=crop&w=400&q=80', badge: 'LAB VERIFIED' },
                        { title: 'Preservative Free Aroma Boost', desc: 'Crafted using pure food-grade crystalline ingredients, delivering rich natural aromas and smooth fresh locks.', img: 'https://images.unsplash.com/photo-1550507992-eb63ffee0847?auto=format&fit=crop&w=400&q=80', badge: '100% TOBACCO-FREE' },
                        { title: 'Vacuum Sealed Freeze Guard', desc: 'Sealed instantly into high-density polymer canisters ensuring 100% cooling impact remains intact during shipping.', img: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=400&q=80', badge: 'FRESHNESS LOCK' }
                      ].map((col, cIdx) => (
                        <div key={cIdx} className="bg-white border border-slate-100 rounded-2xl overflow-hidden p-4 space-y-4 shadow-sm hover:shadow-xl hover:border-slate-300/60 transition-all group flex flex-col justify-between">
                          <div className="space-y-3">
                            <div className="relative h-44 w-full rounded-xl overflow-hidden bg-slate-50">
                              <img src={col.img} className="h-full w-full object-cover group-hover:scale-102 transition-transform duration-300" alt="" referrerPolicy="no-referrer" />
                              <span className="absolute bottom-2 left-2 bg-slate-900/90 text-white text-[8px] font-bold py-0.5 px-2 rounded tracking-widest">{col.badge}</span>
                            </div>
                            <h4 className="font-extrabold text-slate-800 text-sm">{col.title}</h4>
                            <p className="text-[11px] text-slate-500 leading-relaxed">{col.desc}</p>
                          </div>
                          
                          <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-[9px] text-slate-450 font-mono">
                            <span>ISO STANDARDS COMPLIANT</span>
                            <span className="text-emerald-600 font-bold">✓ RECONSTRUCTED</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. RICH TEXT */}
                {sec.type === 'Rich text' && (
                  <div className="text-center max-w-3xl mx-auto space-y-6 py-10 px-4 sm:px-6">
                    <div className="inline-flex items-center gap-1.5 justify-center py-1 px-3 bg-teal-50 border border-teal-100 text-teal-800 rounded-full text-[9px] tracking-widest uppercase font-extrabold">
                      <TrendingUp className="h-3 w-3" />
                      <span>Certified Quality Standard</span>
                    </div>

                    <h2
                      className="text-3xl sm:text-4xl font-black uppercase tracking-tight leading-tight"
                      style={{ color: sec.settings.headingColor || '#000000' }}
                    >
                      {sec.settings.title || 'Rich editorial showcase'}
                    </h2>
                    
                    <p className="text-xs sm:text-sm leading-relaxed text-slate-500 max-w-2xl mx-auto">
                      {sec.settings.description || 'Craft premium experiences under your own terms.'}
                    </p>

                    {sec.settings.buttonText && (
                      <div className="pt-4">
                        <button
                          onClick={() => handleLinkClick(sec.settings.buttonLink)}
                          className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-black py-3.5 px-8 rounded-xl transition-all shadow-md cursor-pointer uppercase tracking-widest"
                        >
                          {sec.settings.buttonText}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* 6. MARQUEE TEXT */}
                {sec.type === 'Marquee text' && (
                  <div className="overflow-hidden bg-slate-900 py-4.5 rounded-2xl border border-slate-800 relative shadow-inner">
                    <div className="whitespace-nowrap flex gap-12 items-center justify-center font-mono font-bold text-white text-[10px] tracking-wider leading-none">
                      <span className="flex items-center gap-2 shrink-0">
                        <Flame className="h-3.5 w-3.5 text-amber-400 fill-amber-400" /> 
                        <span>QUALITY LABORATORY PACKED // TOBACCO-FREE</span>
                      </span>
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0" />
                      <span className="flex items-center gap-2 shrink-0">
                        ⭐ <span>OFFICIALLY LICENSED IN EUROPE AND UK CORES</span>
                      </span>
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0" />
                      <span className="flex items-center gap-2 shrink-0">
                        📦 <span>INSTANT DISPATCH ON BULK PACKS DISCOUNTS APPLIED</span>
                      </span>
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0" />
                      <span className="flex items-center gap-2 shrink-0 hidden sm:flex">
                        ✓ <span>VACUUM TESTED POUCHES FOR ABSOLUTE CRISPINESS</span>
                      </span>
                    </div>
                  </div>
                )}

                {/* 7. MARQUEE IMAGES */}
                {sec.type === 'Marquee images' && (
                  <div className="space-y-6 px-4">
                    <div className="flex items-center gap-1.5 justify-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
                      <h4 className="text-[10px] font-extrabold text-center uppercase tracking-widest text-slate-400">Fresh Stock Dispatch Reel</h4>
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none justify-start sm:justify-center">
                      {allProducts.slice(0, 6).map(prod => (
                        <div key={prod.id} className="w-28 shrink-0 bg-white border border-slate-100 p-2 rounded-xl text-center shadow-xs hover:shadow-md transition-shadow group">
                          <div className="h-20 w-20 bg-slate-50 hover:bg-slate-100 rounded-lg overflow-hidden mx-auto flex items-center justify-center transition-all">
                            <img src={prod.image} className="h-full w-full object-cover group-hover:scale-105 transition-transform" alt="" referrerPolicy="no-referrer" />
                          </div>
                          <p className="text-[9.5px] font-black truncate text-slate-800 mt-2.5">{prod.title.split(' ')[0]}</p>
                          <p className="text-[8px] font-bold text-slate-400">{prod.vendor}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 8. LOGO LIST */}
                {sec.type === 'Logo list' && (
                  <div className="text-center space-y-8 px-4">
                    <div className="space-y-1">
                      <h3 
                        className="text-xs font-black uppercase tracking-widest text-slate-400 block"
                        style={{ color: sec.settings.headingColor || '#94A3B8' }}
                      >
                        {sec.settings.title || 'OFFICIAL LAB PARTNER REGISTER'}
                      </h3>
                      <p className="text-[10px] text-slate-400">Clinically formulated nicotine lines distributed under licensing agreements</p>
                    </div>

                    <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
                      {['77 Pouches', 'CUBA Power', 'CLEW White', 'KILLA Siberian', 'VELO Eucalyptus', 'CRYOPOD Freeze'].map((logo, lIdx) => (
                        <div 
                          key={lIdx} 
                          onClick={() => onNavigate('frontend-brands')}
                          className="bg-white border border-slate-150 rounded-xl px-5 py-3 shadow-xs hover:border-slate-400 hover:shadow-md transition-all cursor-pointer text-xs font-extrabold tracking-wider text-slate-700 flex items-center gap-1.5"
                        >
                          <span className="text-indigo-600">●</span>
                          <span>{logo}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                 {/* 9. COLLECTION LIST */}
                 {sec.type === 'Collection list' && (() => {
                   const filteredCollections = sec.settings.selectedCollectionIds && sec.settings.selectedCollectionIds.length > 0
                     ? allCollections.filter(col => sec.settings.selectedCollectionIds!.includes(col.id))
                     : allCollections.slice(0, Math.min(sec.settings.itemsCount || 4, allCollections.length));
 
                   return (
                     <div className="space-y-8 px-4 sm:px-6">
                       <div className="text-center space-y-2">
                         <h3 
                           className="text-xs font-black uppercase tracking-widest text-[#0F172A]"
                           style={{ color: sec.settings.headingColor || '#0F172A' }}
                         >
                           {sec.settings.title || 'EXPLORE BRAND COLLECTIONS'}
                         </h3>
                         {sec.settings.description && (
                           <p className="text-xs text-slate-500 max-w-md mx-auto">{sec.settings.description}</p>
                         )}
                       </div>
 
                       {/* Highly responsive 2-col to 4-col display */}
                       <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                         {filteredCollections.map(col => (
                           <div
                             key={col.id}
                             onClick={() => onNavigate('frontend-shop', col.id)}
                             className="bg-white border border-slate-150 hover:border-slate-400 rounded-2xl p-5 text-center cursor-pointer transition-all hover:shadow-lg group flex flex-col justify-between overflow-hidden"
                           >
                             <div className="h-24 bg-slate-50 group-hover:bg-slate-100 rounded-xl flex items-center justify-center mb-4 transition-colors overflow-hidden relative">
                               {col.image ? (
                                 <img 
                                   src={col.image} 
                                   className="h-full w-full object-cover transform group-hover:scale-105 transition-transform" 
                                   alt={col.title}
                                   referrerPolicy="no-referrer"
                                 />
                               ) : (
                                 <span className="text-4xl transform group-hover:scale-108 transition-transform">🥫</span>
                               )}
                             </div>
                             <div>
                               <h4 className="font-extrabold text-xs text-slate-800 group-hover:text-indigo-650 transition-colors uppercase tracking-wide truncate">{col.title}</h4>
                               <p className="text-[10px] text-slate-400 mt-1 font-mono">{col.productIds.length} FLAVORS</p>
                             </div>
                           </div>
                         ))}
                       </div>
                     </div>
                   );
                 })()}

                {/* 10. FEATURED COLLECTION (Fully Interactive Masterclass Grid) */}
                {sec.type === 'Featured collection' && (
                  <div className="space-y-8 px-4 sm:px-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end pb-4 border-b border-slate-200">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Direct From Laboratories</span>
                        </div>
                        <h2 
                          className="text-2xl font-black uppercase tracking-tight text-[#0F172A]"
                          style={{ color: sec.settings.headingColor || '#0f172a' }}
                        >
                          {sec.settings.title || 'FEATURED COLLECTION'}
                        </h2>
                        {sec.settings.description && (
                          <p className="text-xs text-slate-500 max-w-xl">
                            {sec.settings.description}
                          </p>
                        )}
                      </div>
                      
                      <button
                        onClick={() => onNavigate('frontend-shop')}
                        className="text-xs font-black text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer pt-3 sm:pt-0 uppercase tracking-widest flex items-center gap-1.5"
                      >
                        <span>All Categories</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {allProducts
                        .filter(p => p.status === 'Active')
                        .slice(0, sec.settings.itemsCount || 4)
                        .map(prod => {
                          const isWishlisted = loggedInCustomer?.wishlist.includes(prod.id);
                          return (
                            <div 
                              key={prod.id} 
                              className="bg-white border border-slate-150 rounded-2xl overflow-hidden p-4 space-y-4 group hover:shadow-xl hover:border-slate-300 transition-all relative flex flex-col justify-between"
                            >
                              {/* Wishlist triggers */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggleWishlist(prod.id);
                                }}
                                className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 shadow-sm text-slate-400 hover:text-red-500 transition-colors z-10 cursor-pointer"
                              >
                                <Heart className={`h-4 w-4 ${isWishlisted ? 'text-red-500 fill-red-500' : ''}`} />
                              </button>

                              <div className="space-y-3">
                                <div className="h-48 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 relative shadow-inner">
                                  <img
                                    src={prod.image}
                                    className="h-full w-full object-cover group-hover:scale-102 transition-transform duration-500"
                                    alt=""
                                    referrerPolicy="no-referrer"
                                  />
                                  <span className="absolute top-2.5 left-2.5 bg-slate-900 text-white text-[8px] font-black tracking-widest uppercase py-0.5 px-2 rounded-md">
                                    {prod.vendor}
                                  </span>
                                  
                                  {prod.compareAtPrice > prod.price && (
                                    <span className="absolute bottom-2.5 left-2.5 bg-rose-650 text-white text-[8px] font-black tracking-widest uppercase py-0.5 px-2 rounded">
                                      SALE DISCOUNT
                                    </span>
                                  )}
                                </div>

                                <div className="space-y-1">
                                  <div className="flex items-center gap-1 text-[8.5px] font-bold text-slate-400 uppercase tracking-widest">
                                    <span>Suppled Lab Grade</span>
                                    <span>•</span>
                                    <span>Fresh Locks</span>
                                  </div>
                                  <h4 className="font-extrabold text-xs text-slate-800 truncate uppercase tracking-tight">{prod.title}</h4>
                                  
                                  <div className="flex items-center gap-1 text-amber-500 pb-1">
                                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                                    <span className="text-[9px] text-slate-400 font-mono ml-1 font-bold">5.0 (48)</span>
                                  </div>

                                  {/* Beautiful medical specification specs list */}
                                  <div className="bg-slate-50/70 py-1.5 px-2 rounded-lg border border-slate-100 space-y-1">
                                    <div className="flex justify-between text-[8px] text-slate-450 font-bold uppercase font-mono">
                                      <span>Strength Aroma</span>
                                      <span className="text-slate-800 font-black">X-Strong Freeze</span>
                                    </div>
                                    <div className="flex justify-between text-[8px] text-slate-450 font-bold uppercase font-mono">
                                      <span>Dispatch Type</span>
                                      <span className="text-indigo-650 font-black">Laboratory Fresh</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2 pt-2 border-t border-slate-50">
                                <div className="flex items-center justify-between">
                                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wide">Single Tin</span>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-black text-slate-900 font-mono">£{prod.price.toFixed(2)}</span>
                                    {prod.compareAtPrice > prod.price && (
                                      <span className="text-[9.5px] text-slate-405 line-through font-mono">£{prod.compareAtPrice.toFixed(2)}</span>
                                    )}
                                  </div>
                                </div>

                                <button
                                  onClick={() => onAddToCart(prod, 1)}
                                  className="w-full bg-slate-900 hover:bg-indigo-600 text-white text-[10px] font-black py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors uppercase tracking-widest shadow-xs"
                                >
                                  <ShoppingCart className="h-3.5 w-3.5" />
                                  <span>Add to Cart</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}

                {/* 11. IMAGES GALLERY */}
                {sec.type === 'Images gallery' && (
                  <div className="space-y-8 px-4 sm:px-6">
                    <div className="text-center space-y-2">
                      <span className="text-[10px] tracking-widest font-black uppercase text-indigo-600 bg-indigo-50/90 py-1 px-3.5 rounded-full inline-block">Visual Verification</span>
                      <h3 
                        className="text-center text-2xl font-black uppercase tracking-tight text-[#0F172A]"
                        style={{ color: sec.settings.headingColor || '#0F172A' }}
                      >
                        {sec.settings.title || 'Laboratory & Dispatch Facility Gallery'}
                      </h3>
                      <p className="text-xs text-slate-500 max-w-md mx-auto">Inspected clean-room assembly lines yielding high-density plant-fiber purity.</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                      {[
                        'https://images.unsplash.com/photo-1543257580-7269da773bf5?auto=format&fit=crop&w=400&q=80',
                        'https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?auto=format&fit=crop&w=400&q=80',
                        'https://images.unsplash.com/photo-1576186726115-4d51596775d1?auto=format&fit=crop&w=400&q=80',
                        'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=400&q=80'
                      ].map((imgUrl, galIdx) => (
                        <div key={galIdx} className="h-44 rounded-2xl overflow-hidden border border-slate-150 shadow-sm relative group bg-slate-50">
                          <img src={imgUrl} className="h-full w-full object-cover hover:scale-103 transition-transform duration-500" alt="" referrerPolicy="no-referrer" />
                          <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="bg-white/90 backdrop-blur-xs text-[9px] font-black uppercase tracking-widest py-1 px-3.5 text-slate-900 rounded-lg shadow-sm">View Facility</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 12. FAQS (Interactive premium Toggles) */}
                {sec.type === 'FAQs' && (
                  <div className="max-w-3xl mx-auto space-y-8 px-4 sm:px-6">
                    <div className="text-center space-y-2">
                      <span className="text-[10px] tracking-widest font-black uppercase text-indigo-600 bg-indigo-50/90 py-1 px-3.5 rounded-full inline-block">Answered Live</span>
                      <h2 
                        className="text-3xl font-black uppercase tracking-tight text-[#0F172A]"
                        style={{ color: sec.settings.headingColor || '#0F172A' }}
                      >
                        {sec.settings.title || 'Frequently Asked Questions'}
                      </h2>
                      <p className="text-xs text-slate-500">Instant validation regarding formulation standards, tracking, and deliveries.</p>
                    </div>

                    <div className="space-y-4">
                      {[
                        { q: 'Is delivery fully tracked?', a: 'Yes, all orders over shipping thresholds generate functional, real-time Royal Mail / European carrier tracking codes emailed instantly upon fulfillment lines dispatch.' },
                        { q: 'Are these pouches 100% tobacco-free?', a: 'Under all current EU & UK reseller regulations, our catalog consists strictly of plant-fiber pouch variants utilizing medical crystalline formats.' },
                        { q: 'How long do subscriptions repeat?', a: 'Your tailored canister bundles renew automatically at your specific week layouts. Pause, skip custom flavors, or cancel anytime for free in the account dashboard.' },
                        { q: 'Where are the canisters formulated?', a: 'Formulated in certified European laboratories under strict vacuum sterile protocols, ensuring consistent aroma and maximum flavor lock.' }
                      ].map((faq, fIdx) => {
                        const isChosen = openFaqIdx === fIdx;
                        return (
                          <div 
                            key={fIdx} 
                            className="bg-white border border-slate-150 rounded-2xl p-4.5 sm:p-5 transition-all shadow-xs cursor-pointer hover:border-slate-300"
                            onClick={() => toggleFaq(fIdx)}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-xs sm:text-xs text-slate-800 flex items-center gap-2 pr-4">
                                <span className={isChosen ? 'text-indigo-600 font-black' : 'text-slate-400 font-bold'}>Q:</span> 
                                <span>{faq.q}</span>
                              </span>
                              <div className="shrink-0 p-1 bg-slate-50 rounded-lg text-slate-500 border border-slate-100 group">
                                {isChosen ? <ChevronUp className="h-3.5 w-3.5 text-indigo-650" /> : <ChevronDown className="h-3.5 w-3.5" />}
                              </div>
                            </div>
                            
                            {/* Smooth accordion expanded logic */}
                            <div className={`transition-all duration-300 overflow-hidden ${isChosen ? 'max-h-32 mt-3 opacity-100 border-t border-slate-50 pt-3' : 'max-h-0 opacity-0'}`}>
                              <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed pl-2">
                                {faq.a}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 13. SLIDESHOW */}
                {sec.type === 'Slideshow' && (
                  <PremiumSlideshow
                    slides={sec.settings.slides}
                    fullWidth={sec.settings.fullWidth}
                    backgroundColor={sec.settings.backgroundColor}
                    headingColor={sec.settings.headingColor}
                    textColor={sec.settings.textColor}
                    onLinkClick={handleLinkClick}
                  />
                )}

                {/* 14. BLOG POST */}
                {sec.type === 'Blog post' && (() => {
                  const desktopCols = sec.settings.columnsDesktop || 3;
                  const mobileCols = sec.settings.columnsMobile || 1;
                  const desktopColsClass = desktopCols === 1 ? 'lg:grid-cols-1' : desktopCols === 2 ? 'lg:grid-cols-2' : desktopCols === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4';
                  const mobileColsClass = mobileCols === 1 ? 'grid-cols-1' : 'grid-cols-2';

                  // retrieve active articles or fallbacks
                  const activeBlogs = allBlogs && allBlogs.length > 0
                    ? allBlogs.filter(b => b.status === 'Active')
                    : [];

                  const displayBlogs = activeBlogs.length > 0 
                    ? activeBlogs 
                    : [
                        { id: '1', title: 'Swedish Pouch Manufacturing Regulations', category: 'Standards', date: 'June 19, 2026', image: 'https://images.unsplash.com/photo-1543257580-7269da773bf5?auto=format&fit=crop&w=400&q=80', excerpt: 'Behind the clinical clean rooms compounding sterile medical fiber pouches under modern Scandinavian compliance.', author: 'Dr. Anders' },
                        { id: '2', title: 'Why Sterile Medical Fiber is Better', category: 'Science', date: 'June 18, 2026', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80', excerpt: 'Traditional pouches use coarse paper. Our laboratory leverages vacuum plant cellulose fibers for smooth flavor dispersion.', author: 'Sara Storm' },
                        { id: '3', title: 'Understanding Nicotine Salt Deliveries', category: 'Formulas', date: 'June 17, 2026', image: 'https://images.unsplash.com/photo-1576186726115-4d51596775d1?auto=format&fit=crop&w=400&q=80', excerpt: 'An in-depth breakdown of molecular compounding and how sub-zero cooling agents trigger persistent fresh releases.', author: 'Nils Vance' }
                      ];

                  return (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 py-4">
                      <div className="text-center space-y-2">
                        <span className="text-[10px] tracking-widest font-black uppercase text-white bg-indigo-600/90 py-1 px-3.5 rounded-full inline-block">Pouch Journal</span>
                        <h2 
                          className="text-3xl font-black uppercase tracking-tight text-slate-900"
                          style={{ color: sec.settings.headingColor || '#0F172A' }}
                        >
                          {sec.settings.title || 'Latest From Our Journal'}
                        </h2>
                        {sec.settings.description && (
                          <p className="text-xs text-slate-500 max-w-2xl mx-auto leading-relaxed">{sec.settings.description}</p>
                        )}
                      </div>

                      <div className={`grid ${mobileColsClass} sm:grid-cols-2 ${desktopColsClass} gap-6`}>
                        {displayBlogs.map((b, idx) => (
                          <article 
                            key={b.id || idx}
                            onClick={() => b.slug ? onNavigate('blog-detail', b.slug) : onNavigate('blogs')}
                            className="group bg-white rounded-2xl overflow-hidden border border-slate-150 p-2 hover:border-slate-350 cursor-pointer transition-all flex flex-col h-full"
                          >
                            <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-50 relative">
                              <img 
                                src={b.image || 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80'} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                alt=""
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs text-[9px] font-black uppercase px-2.5 py-1 rounded-md text-indigo-650 border border-slate-100 shadow-sm">
                                {b.category || 'Article'}
                              </div>
                            </div>
                            <div className="p-3.5 flex flex-col justify-between flex-1 space-y-3">
                              <div className="space-y-1.5">
                                <span className="text-[10px] font-bold text-slate-400">{b.date}</span>
                                <h3 className="font-extrabold text-base text-slate-850 group-hover:text-indigo-650 transition-colors line-clamp-2 leading-tight">
                                  {b.title}
                                </h3>
                                {b.excerpt && (
                                  <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
                                    {b.excerpt}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-850 group-hover:translate-x-1 transition-transform">
                                <span>Read Article</span>
                                <ArrowRight className="h-4 w-4" />
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* 15. BRAND LIST */}
                {sec.type === 'Brand list' && (
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10 py-12">
                    <div className="text-center space-y-3">
                      <span className="text-[10px] tracking-widest font-black uppercase text-indigo-650 bg-indigo-50 px-3 py-1 rounded-full inline-block font-sans">
                        Compounding Series Catalog
                      </span>
                      <h2 
                        className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-slate-900"
                        style={{ color: sec.settings.headingColor || '#0C1017' }}
                      >
                        {sec.settings.title || 'Official Brands Directory'}
                      </h2>
                      {sec.settings.description && (
                        <p className="text-slate-500 max-w-2xl mx-auto text-xs sm:text-sm leading-relaxed">{sec.settings.description}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
                      {(sec.settings.brandItems || []).map((b, bidx) => (
                        <div 
                          key={bidx} 
                          onClick={() => handleLinkClick(b.linkUrl)}
                          className="aspect-square relative rounded-2xl md:rounded-[24px] overflow-hidden group cursor-pointer border border-slate-100 bg-[#FAF9F5] shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-all duration-500 hover:shadow-[0_20px_48px_rgba(0,0,0,0.10)] hover:-translate-y-1.5 flex flex-col justify-end"
                        >
                          {/* Image Layer */}
                          {b.imageUrl ? (
                            <img 
                              src={b.imageUrl} 
                              className="absolute inset-0 w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out" 
                              alt={b.title} 
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-tr from-slate-100 to-slate-200 flex items-center justify-center">
                              <Layers className="h-8 w-8 text-slate-300" />
                            </div>
                          )}

                          {/* Gradient Overlay Layer */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-300" />

                          {/* Top Tag or Badge */}
                          <div className="absolute top-4 left-4 bg-black/30 backdrop-blur-md border border-white/10 text-[8px] font-black tracking-widest text-white px-2.5 py-1 rounded-lg uppercase leading-none shadow-sm">
                            {(bidx % 3 === 0) ? 'SWEDISH LABS' : (bidx % 3 === 1) ? 'AWARD NOMINEE' : 'EXCLUSIVE DEPOT'}
                          </div>

                          {/* Active Hover Arrow Accent */}
                          <div className="absolute top-4 right-4 bg-white text-slate-900 rounded-full p-1.5 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 shadow-md">
                            <ArrowRight className="h-3 w-3" />
                          </div>

                          {/* Text Content Block */}
                          <div className="p-5 sm:p-6 relative z-10 translate-y-1 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                            <span className="block text-[9px] font-bold text-indigo-400 uppercase tracking-widest font-mono mb-1">
                              Collection #{bidx + 1}
                            </span>
                            <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white leading-tight uppercase font-sans tracking-tight">
                              {b.title || 'Brand'}
                            </h3>
                            
                            <div className="h-0 group-hover:h-5 opacity-0 group-hover:opacity-100 overflow-hidden transition-all duration-500 ease-out mt-1">
                              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                Explore collection 
                                <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
                              </span>
                            </div>
                          </div>

                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </section>
          );
        })
      ) : (
        <div className="text-center py-24 bg-white border border-slate-150 rounded-3xl max-w-md mx-auto shadow-sm p-6 space-y-4">
          <div className="h-14 w-14 rounded-full bg-slate-50 border text-slate-300 flex items-center justify-center mx-auto">
            <FileText className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xs font-black uppercase text-slate-700 tracking-wider">No Active Page Sections</h2>
            <p className="text-[10px] text-slate-400 leading-relaxed">This custom canvas currently contains no sections. Create or drag new sections inside the admin editor.</p>
          </div>
        </div>
      )}
    </div>
  );
}
