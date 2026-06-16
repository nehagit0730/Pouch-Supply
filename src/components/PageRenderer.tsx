import React from 'react';
import { CustomPage, PageSection, Product, Collection, Customer } from '../types';
import { ArrowRight, ShoppingCart, Star, Heart, FileText, Check } from 'lucide-react';
import PremiumSlideshow from './PremiumSlideshow';

interface PageRendererProps {
  page: CustomPage;
  allProducts: Product[];
  allCollections: Collection[];
  loggedInCustomer: Customer | null;
  onAddToCart: (product: Product, qty: number) => void;
  onToggleWishlist: (productId: string) => void;
  onNavigate: (tab: string, arg?: string) => void; // for shop, subscribe etc.
}

export default function PageRenderer({
  page,
  allProducts,
  allCollections,
  loggedInCustomer,
  onAddToCart,
  onToggleWishlist,
  onNavigate
}: PageRendererProps) {
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
      // Internal custom routing or smooth fallback
      onNavigate('frontend-shop');
    }
  };

  return (
    <div className="space-y-12 pb-20">
      {page.sections && page.sections.length > 0 ? (
        page.sections.map((sec, idx) => {
          const sStyle = {
            backgroundColor: sec.settings.backgroundColor || '#FFFFFF',
            color: sec.settings.textColor || '#4a4d50'
          };
          
          const isFullBleed = (sec.type === 'Slideshow' || sec.type === 'Image banner') && sec.settings.fullWidth;
          const maxContainerClass = sec.settings.fullWidth ? 'w-full' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';
          const paddingClass = isFullBleed ? 'py-0' : 'py-12 md:py-16';

          return (
            <section
              key={sec.id || idx}
              style={sStyle}
              className={`${paddingClass} ${sec.settings.fullWidth ? '' : 'rounded-3xl border border-[#e1e3e5]/60 shadow-md my-8 overflow-hidden'}`}
            >
              <div className={maxContainerClass}>
                
                {/* 1. IMAGE BANNER */}
                {sec.type === 'Image banner' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                    <div className="space-y-5">
                      {sec.settings.title && (
                        <h1 
                          className="text-4xl font-extrabold tracking-tight leading-tight"
                          style={{ color: sec.settings.headingColor || '#1a1c1d' }}
                        >
                          {sec.settings.title}
                        </h1>
                      )}
                      {sec.settings.description && (
                        <p className="text-sm leading-relaxed opacity-85">
                          {sec.settings.description}
                        </p>
                      )}
                      {sec.settings.buttonText && (
                        <button
                          onClick={() => handleLinkClick(sec.settings.buttonLink)}
                          className="bg-[#008060] hover:bg-[#006e52] text-white font-bold text-xs py-3.5 px-8 rounded-xl transition-all shadow-md inline-flex items-center gap-2 cursor-pointer uppercase tracking-wider"
                        >
                          <span>{sec.settings.buttonText}</span>
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <div>
                      <img
                        src={sec.settings.imageUrl || 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80'}
                        alt={sec.settings.title || 'Banner Media'}
                        className="rounded-2xl border border-[#e1e3e5] shadow-md object-cover h-80 w-full"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                )}

                {/* 2. VIDEO BANNER */}
                {sec.type === 'Video banner' && (
                  <div className="space-y-6 text-center max-w-3xl mx-auto">
                    <h2
                      className="text-2xl font-black tracking-tight"
                      style={{ color: sec.settings.headingColor || '#1a1c1d' }}
                    >
                      {sec.settings.title || 'Watch Brand Highlights'}
                    </h2>
                    {sec.settings.description && (
                      <p className="text-xs leading-relaxed opacity-80">{sec.settings.description}</p>
                    )}
                    <div className="relative rounded-2xl overflow-hidden shadow-lg border border-[#e1e3e5] aspect-video bg-[#101112] flex items-center justify-center">
                      {sec.settings.videoUrl || sec.settings.videoEmbed ? (
                        <iframe
                          className="w-full h-full"
                          src={sec.settings.videoEmbed || `https://www.youtube.com/embed/${sec.settings.videoUrl || 'dQw4w9WgXcQ'}`}
                          title="Video Player"
                          allowFullScreen
                        />
                      ) : (
                        <div className="text-center space-y-2 p-6">
                          <span className="text-4xl">🎬</span>
                          <p className="font-mono text-[11px] text-[#707579]">Simulated Laboratory Batch Video (Configure embed on settings)</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. IMAGE WITH TEXT */}
                {sec.type === 'Image with text' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                    <div className="order-2 md:order-1">
                      <img
                        src={sec.settings.imageUrl || 'https://images.unsplash.com/photo-1576186726115-4d51596775d1?auto=format&fit=crop&w=800&q=80'}
                        className="rounded-2xl shadow-sm border object-cover h-80 w-full"
                        alt=""
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="space-y-5 order-1 md:order-2">
                      <h2 
                        className="text-3xl font-extrabold tracking-tight"
                        style={{ color: sec.settings.headingColor || '#1a1c1d' }}
                      >
                        {sec.settings.title || 'Curate your package'}
                      </h2>
                      <p className="text-sm opacity-85 leading-relaxed">
                        {sec.settings.description || 'Flexible deliveries straight to your shop or door.'}
                      </p>
                      {sec.settings.buttonText && (
                        <button
                          onClick={() => handleLinkClick(sec.settings.buttonLink)}
                          className="text-xs text-[#008060] hover:text-[#006e52] font-black inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>{sec.settings.buttonText}</span>
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* 4. TEXT COLUMN WITH IMAGE */}
                {sec.type === 'Text column with image' && (
                  <div className="space-y-10">
                    <div className="text-center max-w-xl mx-auto space-y-2">
                      <h2 
                        className="text-2xl font-black"
                        style={{ color: sec.settings.headingColor || '#1a1c1d' }}
                      >
                        {sec.settings.title || 'Laboratory Certified Excellence'}
                      </h2>
                      <p className="text-xs opacity-80">{sec.settings.description}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      {[
                        { title: 'Global Certified Lab Testing', desc: 'Every tin is sourced strictly from laboratories adhering to strict safety protocols.', img: 'https://images.unsplash.com/photo-1576186726115-4d51596775d1?auto=format&fit=crop&w=400&q=80' },
                        { title: 'Preservative Free Aroma Boost', desc: 'Crafted using pure medical-grade nicotine crystals and plant fiber bases.', img: 'https://images.unsplash.com/photo-1550507992-eb63ffee0847?auto=format&fit=crop&w=400&q=80' },
                        { title: 'Vacuum Sealed Freeze Guard', desc: 'Sealed directly upon production ensuring 100% mint cooling strength is locked.', img: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=400&q=80' }
                      ].map((col, cIdx) => (
                        <div key={cIdx} className="bg-white border rounded-xl overflow-hidden p-4 space-y-3 shadow-xs">
                          <img src={col.img} className="h-40 w-full object-cover rounded-lg" alt="" referrerPolicy="no-referrer" />
                          <h4 className="font-bold text-slate-800 text-xs">{col.title}</h4>
                          <p className="text-[11px] text-slate-400 leading-normal">{col.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. RICH TEXT */}
                {sec.type === 'Rich text' && (
                  <div className="text-center max-w-2xl mx-auto space-y-4 py-8">
                    <h2
                      className="text-3xl font-extrabold tracking-tight"
                      style={{ color: sec.settings.headingColor || '#1a1c1d' }}
                    >
                      {sec.settings.title || 'Rich editorial showcase'}
                    </h2>
                    <p className="text-xs leading-relaxed opacity-85">
                      {sec.settings.description || 'Craft premium experiences under your own terms.'}
                    </p>
                    {sec.settings.buttonText && (
                      <button
                        onClick={() => handleLinkClick(sec.settings.buttonLink)}
                        className="bg-[#008060] hover:bg-[#006e52] text-white text-xs font-bold py-2.5 px-6 rounded-lg transition-colors cursor-pointer"
                      >
                        {sec.settings.buttonText}
                      </button>
                    )}
                  </div>
                )}

                {/* 6. MARQUEE TEXT */}
                {sec.type === 'Marquee text' && (
                  <div className="overflow-hidden bg-[#e3f5e9] py-3 rounded-xl border border-[#c8ebd3] relative text-center">
                    <div className="whitespace-nowrap inline-flex gap-8 items-center justify-center font-bold text-[#008060] text-[11px] uppercase tracking-widest leading-none">
                      <span className="flex items-center gap-2">⭐ {sec.settings.title || 'CRISP TOBACCO-FREE POUCHES DISPATCHED DAILY'} ⭐</span>
                      <span className="flex items-center gap-2">🔥 OFFICIALLY LICENSED EU DISTRIBUTOR 🔥</span>
                      <span className="flex items-center gap-2">📦 ORDER bulk quantities SAVE UP TO 25% 📦</span>
                    </div>
                  </div>
                )}

                {/* 7. MARQUEE IMAGES */}
                {sec.type === 'Marquee images' && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-center uppercase tracking-wider opacity-75">Visual Can Catalog Highlight</h4>
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none justify-center">
                      {allProducts.slice(0, 5).map(prod => (
                        <div key={prod.id} className="w-24 shrink-0 bg-white border p-1 rounded-lg text-center">
                          <img src={prod.image} className="h-16 w-16 object-cover rounded-md mx-auto" alt="" referrerPolicy="no-referrer" />
                          <p className="text-[9px] font-bold truncate text-slate-800 mt-1">{prod.title.split(' ')[0]}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 8. LOGO LIST */}
                {sec.type === 'Logo list' && (
                  <div className="text-center space-y-6">
                    <h3 
                      className="text-xs font-black uppercase tracking-widest"
                      style={{ color: sec.settings.headingColor || '#1a1c1d' }}
                    >
                      {sec.settings.title || 'OFFICIAL RESELLER PARTNERS'}
                    </h3>
                    <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-12">
                      {['77 Pouches', 'CUBA Power', 'CLEW White', 'KILLA Siberian', 'VELO Eucalyptus'].map((logo, lIdx) => (
                        <div 
                          key={lIdx} 
                          onClick={() => onNavigate('frontend-brands')}
                          className="bg-white border rounded-xl px-5 py-3 shadow-xs hover:border-[#008060] transition-colors cursor-pointer text-xs font-black tracking-widest text-[#4a4d50]"
                        >
                          {logo}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 9. COLLECTION LIST */}
                {sec.type === 'Collection list' && (
                  <div className="space-y-6">
                    <div className="text-center space-y-1">
                      <h3 
                        className="text-xs font-black uppercase tracking-widest"
                        style={{ color: sec.settings.headingColor || '#1a1c1d' }}
                      >
                        {sec.settings.title || 'EXPLORE BRAND COLLECTIONS'}
                      </h3>
                      {sec.settings.description && (
                        <p className="text-[11px] opacity-75">{sec.settings.description}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {allCollections.map(col => (
                        <div
                          key={col.id}
                          onClick={() => onNavigate('frontend-shop', col.id)}
                          className="bg-white border hover:border-[#008060] rounded-xl p-4 text-center cursor-pointer transition-shadow hover:shadow-xs group"
                        >
                          <div className="h-20 bg-slate-50 rounded-lg flex items-center justify-center mb-3">
                            <span className="text-3xl">🥫</span>
                          </div>
                          <h4 className="font-bold text-xs text-slate-800 group-hover:text-[#008060] transition-colors">{col.title}</h4>
                          <p className="text-[10px] text-slate-400 mt-1">{col.productIds.length} Products</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 10. FEATURED COLLECTION (Fully Interactive Grid!) */}
                {sec.type === 'Featured collection' && (
                  <div className="space-y-8">
                    <div className="flex justify-between items-end pb-3 border-b border-[#e1e3e5]/60">
                      <div>
                        <h2 
                          className="text-xl font-bold tracking-tight"
                          style={{ color: sec.settings.headingColor || '#1a1c1d' }}
                        >
                          {sec.settings.title || 'FEATURED BEST SELING PRODUCTS'}
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {sec.settings.description || 'Premium tins dispatched directly within vacuum dry packs.'}
                        </p>
                      </div>
                      <button
                        onClick={() => onNavigate('frontend-shop')}
                        className="text-xs font-bold text-[#008060] hover:underline cursor-pointer"
                      >
                        All Categories →
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                      {allProducts
                        .filter(p => p.status === 'Active')
                        .slice(0, sec.settings.itemsCount || 4)
                        .map(prod => {
                          const isWishlisted = loggedInCustomer?.wishlist.includes(prod.id);
                          return (
                            <div 
                              key={prod.id} 
                              className="bg-white border rounded-xl overflow-hidden p-3.5 space-y-3.5 group hover:shadow-md transition-shadow relative"
                            >
                              {/* Wishlist triggers */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggleWishlist(prod.id);
                                }}
                                className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/90 backdrop-blur-xs border shadow-xs text-slate-400 hover:text-red-500 transition-colors z-10"
                              >
                                <Heart className={`h-4 w-4 ${isWishlisted ? 'text-red-500 fill-red-500' : ''}`} />
                              </button>

                              <div className="h-44 bg-slate-50 rounded-lg overflow-hidden border relative">
                                <img
                                  src={prod.image}
                                  className="h-full w-full object-cover group-hover:scale-102 transition-transform"
                                  alt=""
                                  referrerPolicy="no-referrer"
                                />
                                <span className="absolute top-2.5 left-2.5 bg-[#1a1c1d] text-white text-[8px] font-bold tracking-widest uppercase py-0.5 px-2 rounded-full">
                                  {prod.vendor}
                                </span>
                              </div>

                              <div className="space-y-1">
                                <h4 className="font-extrabold text-xs text-slate-800 truncate">{prod.title}</h4>
                                <div className="flex items-center gap-1.5 pt-0.5">
                                  <span className="text-xs font-black text-[#008060]">£{prod.price.toFixed(2)}</span>
                                  {prod.compareAtPrice > prod.price && (
                                    <span className="text-[10px] text-slate-400 line-through">£{prod.compareAtPrice.toFixed(2)}</span>
                                  )}
                                </div>
                              </div>

                              <button
                                onClick={() => onAddToCart(prod, 1)}
                                className="w-full bg-[#1a1c1d] hover:bg-[#008060] text-white text-[10px] font-bold py-2 rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-colors"
                              >
                                <ShoppingCart className="h-3.5 w-3.5" />
                                <span>Add To Drawer</span>
                              </button>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}

                {/* 11. IMAGES GALLERY */}
                {sec.type === 'Images gallery' && (
                  <div className="space-y-6">
                    <h3 
                      className="text-center text-xs font-bold uppercase tracking-wider"
                      style={{ color: sec.settings.headingColor || '#1a1c1d' }}
                    >
                      {sec.settings.title || 'Laboratory & Dispatch Facility Gallery'}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        'https://images.unsplash.com/photo-1543257580-7269da773bf5?auto=format&fit=crop&w=400&q=80',
                        'https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?auto=format&fit=crop&w=400&q=80',
                        'https://images.unsplash.com/photo-1576186726115-4d51596775d1?auto=format&fit=crop&w=400&q=80',
                        'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=400&q=80'
                      ].map((imgUrl, galIdx) => (
                        <div key={galIdx} className="h-40 rounded-xl overflow-hidden border">
                          <img src={imgUrl} className="h-full w-full object-cover hover:scale-103 transition-transform" alt="" referrerPolicy="no-referrer" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 12. FAQS */}
                {sec.type === 'FAQs' && (
                  <div className="max-w-3xl mx-auto space-y-6">
                    <h2 
                      className="text-center text-2xl font-black"
                      style={{ color: sec.settings.headingColor || '#1a1c1d' }}
                    >
                      {sec.settings.title || 'Frequently Asked Questions'}
                    </h2>
                    <div className="space-y-4">
                      {[
                        { q: 'Is delivery fully tracked?', a: 'Yes, all orders over shipping thresholds generate free tracking details emailed instantly upon fulfillment.' },
                        { q: 'Are these pouches 100% tobacco-free?', a: 'Under all current EU & UK reseller regulations, our catalog consists strictly of tobacco-free plant fiber pouch variations.' },
                        { q: 'How long do subscriptions repeat?', a: 'Your customized orders renew automatically at your preferred week schedules. Pause, skip, edit canister flavors, or cancel anytime for free.' }
                      ].map((faq, fIdx) => (
                        <div key={fIdx} className="bg-white border rounded-xl p-5 space-y-1.5 shadow-xs">
                          <p className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                            <span className="text-[#008060]">Q:</span> {faq.q}
                          </p>
                          <p className="text-[11px] text-[#4a4d50] leading-relaxed pl-4">{faq.a}</p>
                        </div>
                      ))}
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

              </div>
            </section>
          );
        })
      ) : (
        <div className="text-center py-20 bg-white border rounded-2xl max-w-md mx-auto">
          <FileText className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <h2 className="text-sm font-bold text-slate-700">Page Empty</h2>
          <p className="text-xs text-slate-400 mt-1">This builder page currently template has no sections.</p>
        </div>
      )}
    </div>
  );
}
