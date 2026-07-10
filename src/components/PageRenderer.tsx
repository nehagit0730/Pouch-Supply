import React, { useState, useRef } from 'react';
import { CustomPage, PageSection, Product, Collection, Customer, BlogPost } from '../types';
import { 
  ArrowRight, ShoppingCart, Star, Heart, FileText, Check, 
  ChevronDown, ChevronUp, Play, Sparkles, TrendingUp, Plus, Minus, ShieldCheck, Award, Eye, Flame, ArrowUpRight, BookOpen, Layers,
  Truck, Zap, Shield, Clock, Package, HelpCircle, Globe, Tag, ChevronLeft, ChevronRight, Lock, Gift, RefreshCw
} from 'lucide-react';
import PremiumSlideshow from './PremiumSlideshow';

interface BrandsWeOfferSectionProps {
  sec: PageSection;
  handleLinkClick: (link?: string) => void;
}

function BrandsWeOfferSection({ sec, handleLinkClick }: BrandsWeOfferSectionProps) {
  const items = (sec.settings.brandItems || []).filter(b => b.imageUrl && b.imageUrl.trim() !== '');
  const [activeDot, setActiveDot] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, clientWidth, scrollWidth } = sliderRef.current;
    const totalWidth = scrollWidth - clientWidth;
    if (totalWidth <= 0) return;
    const percentage = Math.max(0, Math.min(1, scrollLeft / totalWidth));
    const dotCount = Math.min(items.length, 6);
    const idx = Math.min(Math.floor(percentage * dotCount), dotCount - 1);
    setActiveDot(idx);
  };

  const scrollToDot = (idx: number) => {
    if (!sliderRef.current) return;
    const { scrollWidth, clientWidth } = sliderRef.current;
    const totalWidth = scrollWidth - clientWidth;
    if (totalWidth <= 0) return;
    const dotCount = Math.min(items.length, 6);
    const targetScrollLeft = (idx / (dotCount - 1)) * totalWidth;
    sliderRef.current.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
    setActiveDot(idx);
  };

  const scrollLeft = () => {
    if (!sliderRef.current) return;
    sliderRef.current.scrollBy({ left: -260, behavior: 'smooth' });
  };

  const scrollRight = () => {
    if (!sliderRef.current) return;
    sliderRef.current.scrollBy({ left: 260, behavior: 'smooth' });
  };

  return (
    <div className="py-12 bg-white w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center space-y-3 mb-10 animate-fade-in">
        <div className="flex items-center justify-center gap-4">
          <div className="w-10 h-[1px] bg-[#D4AF37]" />
          <span className="block text-xs font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
            THE BRANDS YOU LOVE
          </span>
          <div className="w-10 h-[1px] bg-[#D4AF37]" />
        </div>
        {sec.settings.title && (
          <h2 
            className="text-3xl md:text-[42px] font-black uppercase tracking-tight text-slate-900 leading-none"
            style={{ color: sec.settings.headingColor || '#0C1017' }}
          >
            {sec.settings.title}
          </h2>
        )}
        {sec.settings.description && (
          <p 
            className="max-w-2xl mx-auto text-xs sm:text-sm leading-relaxed text-slate-500 font-medium opacity-85"
            style={{ color: sec.settings.textColor || '#64748B' }}
          >
            {sec.settings.description}
          </p>
        )}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-12">
        {/* Left Arrow Button */}
        {items.length > 0 && (
          <button 
            type="button"
            onClick={scrollLeft} 
            className="absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full border border-[#D4AF37] bg-white flex items-center justify-center text-[#D4AF37] hover:bg-amber-50/55 shadow-md transition-all duration-300 transform active:scale-95 cursor-pointer"
            aria-label="Previous Brand"
          >
            <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
          </button>
        )}

        {/* Brand Slider Container */}
        <div 
          ref={sliderRef}
          onScroll={handleScroll}
          className="flex gap-6 overflow-x-auto scrollbar-none py-6 px-4 scroll-smooth"
        >
          {items.map((b, idx) => (
            <div 
              key={idx} 
              onClick={() => b.linkUrl && handleLinkClick(b.linkUrl)}
              className="group flex flex-col items-center justify-center shrink-0 w-[160px] sm:w-[190px] aspect-square bg-white rounded-[24px] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_24px_50px_rgba(0,0,0,0.12)] border border-slate-50/50 transition-all duration-300 transform hover:-translate-y-1.5 select-none cursor-pointer"
            >
              {b.imageUrl ? (
                <img 
                  src={b.imageUrl} 
                  className="max-h-24 max-w-[140px] object-contain transition-transform duration-300 group-hover:scale-105" 
                  alt={b.title || 'Brand'} 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="text-sm font-black text-slate-800 uppercase tracking-tight truncate max-w-full group-hover:scale-105 transition-transform duration-300">
                  {b.title || 'Brand'}
                </span>
              )}
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-slate-400 italic text-center py-8 w-full text-xs">
              No brands found. Go to Admin Dashboard to upload brands!
            </div>
          )}
        </div>

        {/* Right Arrow Button */}
        {items.length > 0 && (
          <button 
            type="button"
            onClick={scrollRight} 
            className="absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full border border-[#D4AF37] bg-white flex items-center justify-center text-[#D4AF37] hover:bg-amber-50/55 shadow-md transition-all duration-300 transform active:scale-95 cursor-pointer"
            aria-label="Next Brand"
          >
            <ChevronRight className="h-5 w-5 stroke-[2.5]" />
          </button>
        )}
      </div>

      {/* Dot Indicators */}
      {items.length > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          {Array.from({ length: Math.min(items.length, 6) }).map((_, dIdx) => (
            <button
              key={dIdx}
              type="button"
              onClick={() => scrollToDot(dIdx)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                dIdx === activeDot ? 'bg-[#D4AF37] w-5' : 'bg-slate-200 hover:bg-slate-300'
              }`}
              aria-label={`Go to slide ${dIdx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface HowItWorksSectionProps {
  sec: PageSection;
  handleLinkClick: (link?: string) => void;
}

function HowItWorksSection({ sec, handleLinkClick }: HowItWorksSectionProps) {
  const steps = (sec.settings.stepItems && sec.settings.stepItems.length > 0) 
    ? sec.settings.stepItems 
    : [
        { number: 1, title: 'Choose Your Plan', description: 'Pick the plan that suits you best. Flexible. Simple. No commitment.' },
        { number: 2, title: 'Pick Your Favourite Brands', description: 'Mix and match from 20+ premium brands, flavours and strengths.' },
        { number: 3, title: 'Relax, We Handle The Rest', description: 'We pack and deliver to your door, automatically. You focus on life.' }
      ];

  const renderStepVisualMockup = (sidx: number, step: any) => {
    if (step.imageUrl && step.imageUrl !== '/placeholder.png' && step.imageUrl !== '') {
      return (
        <div className="w-full my-4 flex items-center justify-center overflow-hidden rounded-xl">
          <img 
            src={step.imageUrl} 
            className="w-full max-h-60 object-contain filter drop-shadow-md group-hover:scale-[1.03] transition-transform duration-500" 
            alt={step.title} 
            referrerPolicy="no-referrer"
          />
        </div>
      );
    }

    if (sidx === 0) {
      return (
        <div className="w-full bg-slate-50/50 rounded-2xl p-4 border border-slate-100 flex flex-col items-center my-4">
          <div className="grid grid-cols-4 gap-1 w-full">
            {/* LITE */}
            <div className="bg-white rounded-lg border border-slate-200/60 p-1.5 flex flex-col items-center justify-between text-center shadow-2xs h-32">
              <span className="text-[8px] font-black tracking-wider text-slate-400">LITE</span>
              <div className="my-1 text-center">
                <span className="block text-[11px] font-black text-slate-800 leading-tight">5 Cans</span>
                <span className="block text-[10px] font-bold text-[#D4AF37] leading-tight">£27.99</span>
                <span className="text-[7px] text-slate-400 block -mt-0.5">per month</span>
              </div>
            </div>
            
            {/* CORE */}
            <div className="bg-white rounded-lg border border-slate-200/60 p-1.5 flex flex-col items-center justify-between text-center shadow-2xs h-32">
              <span className="text-[8px] font-black tracking-wider text-slate-450">CORE</span>
              <div className="my-1 text-center">
                <span className="block text-[11px] font-black text-slate-800 leading-tight">8 Cans</span>
                <span className="block text-[10px] font-bold text-[#D4AF37] leading-tight">£35.99</span>
                <span className="text-[7px] text-slate-400 block -mt-0.5">per month</span>
              </div>
            </div>

            {/* PRO */}
            <div className="bg-[#0C1017] rounded-lg border border-[#D4AF37] p-1.5 flex flex-col items-center justify-between text-center shadow-sm h-32 relative overflow-hidden transform scale-105 z-10">
              <div className="absolute top-0 left-0 right-0 bg-[#D4AF37] text-[5px] font-black text-slate-950 py-0.5 uppercase tracking-wider text-center">
                MOST POPULAR
              </div>
              <span className="text-[8px] font-black tracking-wider text-white mt-1.5">PRO</span>
              <div className="my-1 text-center">
                <span className="block text-[11px] font-black text-white leading-tight">10 Cans</span>
                <span className="block text-[10px] font-bold text-[#D4AF37] leading-tight">£40.99</span>
                <span className="text-[7px] text-slate-350 block -mt-0.5">per month</span>
              </div>
              <span className="text-[4px] font-bold text-emerald-400 tracking-wider uppercase">FREE DEV</span>
            </div>

            {/* ULTIMATE */}
            <div className="bg-white rounded-lg border border-[#D4AF37]/50 p-1.5 flex flex-col items-center justify-between text-center shadow-2xs h-32">
              <span className="text-[8px] font-black tracking-wider text-slate-450">ULTIMATE</span>
              <div className="my-1 text-center">
                <span className="block text-[11px] font-black text-slate-800 leading-tight">12 Cans</span>
                <span className="block text-[10px] font-bold text-[#D4AF37] leading-tight">£46.99</span>
                <span className="text-[7px] text-slate-400 block -mt-0.5">per month</span>
              </div>
              <span className="text-[4px] font-bold text-[#D4AF37] tracking-wider uppercase">FREE DEV</span>
            </div>
          </div>
        </div>
      );
    }

    if (sidx === 1) {
      return (
        <div className="w-full h-40 relative my-4 flex items-center justify-center overflow-hidden">
          <div className="relative w-full max-w-[260px] h-full flex items-center justify-center">
            {/* CAN 1: ZYN */}
            <div className="absolute left-1 top-4 w-[64px] h-[64px] rounded-full bg-white border border-slate-200 shadow-md flex flex-col items-center justify-center p-0.5 transform -rotate-12 z-10 transition-transform duration-300 hover:scale-105">
              <div className="w-[56px] h-[56px] rounded-full border border-sky-400/30 flex flex-col items-center justify-center bg-sky-50/20">
                <span className="text-[9px] font-extrabold text-sky-600 tracking-tight leading-none">ZYN</span>
                <span className="text-[4px] font-bold text-sky-400 uppercase tracking-widest mt-0.5">COOL MINT</span>
              </div>
            </div>

            {/* CAN 2: VELO */}
            <div className="absolute right-1 top-4 w-[64px] h-[64px] rounded-full bg-white border border-slate-200 shadow-md flex flex-col items-center justify-center p-0.5 transform rotate-12 z-10 transition-transform duration-300 hover:scale-105">
              <div className="w-[56px] h-[56px] rounded-full border border-blue-500/30 flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600">
                <span className="text-[9px] font-extrabold text-white tracking-tight leading-none">VELO</span>
                <span className="text-[3px] font-bold text-sky-200 uppercase tracking-widest mt-0.5">FREEZE</span>
              </div>
            </div>

            {/* CAN 3: FUMI */}
            <div className="absolute left-9 bottom-2 w-[60px] h-[60px] rounded-full bg-white border border-slate-200 shadow-md flex flex-col items-center justify-center p-0.5 transform rotate-6 z-20 transition-transform duration-300 hover:scale-105">
              <div className="w-[52px] h-[52px] rounded-full border border-purple-500/20 flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 to-purple-700">
                <span className="text-[8px] font-extrabold text-white tracking-tight leading-none">FUMI</span>
                <span className="text-[3px] font-bold text-purple-200 uppercase tracking-widest mt-0.5">BERRY</span>
              </div>
            </div>

            {/* CAN 4: PABLO */}
            <div className="absolute right-9 bottom-2 w-[60px] h-[60px] rounded-full bg-white border border-slate-200 shadow-md flex flex-col items-center justify-center p-0.5 transform -rotate-6 z-20 transition-transform duration-300 hover:scale-105">
              <div className="w-[52px] h-[52px] rounded-full border border-red-650/30 flex flex-col items-center justify-center bg-slate-50">
                <span className="text-[8px] font-black text-red-650 tracking-tighter leading-none italic">PABLO</span>
                <span className="text-[3px] font-black text-slate-800 uppercase tracking-widest mt-0.5">EXCLUSIVE</span>
              </div>
            </div>

            {/* CAN 5: 77 */}
            <div className="absolute left-[38%] top-2 w-[70px] h-[70px] rounded-full bg-white border border-slate-200 shadow-lg flex flex-col items-center justify-center p-0.5 transform -translate-x-1/2 -rotate-3 z-30 transition-transform duration-300 hover:scale-105">
              <div className="w-[62px] h-[62px] rounded-full border border-slate-900 flex flex-col items-center justify-center bg-[#0C1017]">
                <span className="text-[14px] font-black text-white tracking-tighter leading-none">77</span>
                <span className="text-[3.5px] font-bold text-[#D4AF37] uppercase tracking-widest -mt-0.5">NICOTINE</span>
              </div>
            </div>

            {/* CAN 6: CUBA */}
            <div className="absolute right-[38%] top-2 w-[70px] h-[70px] rounded-full bg-white border border-slate-200 shadow-lg flex flex-col items-center justify-center p-0.5 transform translate-x-1/2 rotate-3 z-30 transition-transform duration-300 hover:scale-105">
              <div className="w-[62px] h-[62px] rounded-full border border-amber-500 flex flex-col items-center justify-center bg-slate-900">
                <span className="text-[11px] font-black text-amber-400 tracking-wider leading-none">CUBA</span>
                <span className="text-[3.5px] font-bold text-white uppercase tracking-widest mt-0.5">BLACK</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (sidx === 2) {
      return (
        <div className="w-full h-40 relative my-4 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
            <div className="w-40 h-20 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 blur-xl rounded-full" />
            <span className="text-emerald-500 text-sm absolute left-12 top-6 animate-pulse">🌿</span>
            <span className="text-emerald-500 text-xs absolute right-12 bottom-6 animate-pulse" style={{ animationDelay: '1s' }}>🌿</span>
          </div>

          <div className="w-48 h-28 bg-[#0C1017] rounded-xl border border-slate-800 shadow-[0_12px_24px_rgba(0,0,0,0.25)] relative overflow-hidden transform rotate-2 hover:rotate-0 transition-transform duration-500 flex flex-col justify-between p-2.5 select-none">
            <div className="absolute top-2 right-3 w-12 h-10 bg-white/95 rounded-sm p-0.5 shadow-2xs flex flex-col justify-between border-l border-b border-slate-200 text-slate-800">
              <div className="w-full h-0.5 bg-slate-400 rounded-2xs" />
              <div className="space-y-[1.5px]">
                <div className="w-6 h-[1.5px] bg-slate-300" />
                <div className="w-8 h-[1.5px] bg-slate-300" />
              </div>
              <div className="flex gap-[0.5px] h-2 items-end">
                <div className="w-[1px] h-full bg-slate-800" />
                <div className="w-[1.5px] h-full bg-slate-800" />
                <div className="w-[1px] h-[70%] bg-slate-800" />
                <div className="w-[1px] h-full bg-slate-800" />
              </div>
            </div>

            <div className="mt-1 space-y-0.5 text-left">
              <span className="block text-[11px] font-black tracking-[0.12em] text-[#D4AF37] leading-none">POUCH</span>
              <span className="block text-[11px] font-black tracking-[0.12em] text-[#D4AF37] leading-none">SUPPLY</span>
            </div>

            <div className="border-t border-slate-800/65 pt-1.5 flex items-center justify-between">
              <span className="text-[4.5px] font-bold text-slate-450 uppercase tracking-[0.18em]">NICOTINE ON AUTOPILOT</span>
              <div className="flex gap-0.5">
                <div className="w-0.5 h-0.5 rounded-full bg-slate-800" />
                <div className="w-0.5 h-0.5 rounded-full bg-slate-800" />
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="mt-8 w-36 h-36 flex items-center justify-center bg-slate-50/50 rounded-2xl p-4 shrink-0 border border-slate-100/50 group-hover:border-slate-200 group-hover:bg-white transition-all duration-300">
        {step.imageUrl ? (
          <img 
            src={step.imageUrl} 
            className="max-h-28 max-w-full object-contain filter drop-shadow-sm group-hover:scale-105 transition-transform duration-300" 
            alt={step.title} 
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">No Image Asset</span>
        )}
      </div>
    );
  };

  const renderStepCheckmarks = (sidx: number) => {
    const checkmarks = sidx === 0 
      ? ["Weekly, Fortnightly or Monthly", "Change anytime"]
      : sidx === 1 
      ? ["Change brands or flavours anytime"]
      : ["Automatic deliveries", "Skip or pause anytime"];

    return (
      <div className="mt-4 space-y-2 w-full text-left">
        {checkmarks.map((text, cidx) => (
          <div key={cidx} className="flex items-center gap-2 text-xs font-bold text-slate-850 justify-center">
            <div className="w-4 h-4 rounded-full bg-amber-50 border border-amber-250 text-[#D4AF37] flex items-center justify-center shrink-0">
              <Check className="h-2.5 w-2.5 stroke-[3]" />
            </div>
            <span className="text-[11.5px] text-slate-650 font-extrabold">{text}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div 
      className="py-16 w-full font-sans transition-all duration-300 overflow-hidden"
      style={{ backgroundColor: sec.settings.backgroundColor || '#F8FAFC' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto flex flex-col items-center">
          <div className="flex items-center justify-center gap-4 animate-fade-in">
            <div className="w-10 h-[1px] bg-[#D4AF37]" />
            <span className="text-xs font-black uppercase tracking-[0.25em] text-[#D4AF37]">
              HOW IT WORKS
            </span>
            <div className="w-10 h-[1px] bg-[#D4AF37]" />
          </div>
          
          <h2 
            className="text-3xl md:text-[42px] font-black uppercase tracking-tight text-[#0C1017] leading-none"
            style={{ color: sec.settings.headingColor || '#0C1017' }}
          >
            {sec.settings.title || 'Get Started In Under 60 Seconds'}
          </h2>
          
          {sec.settings.description && (
            <p 
              className="text-xs sm:text-sm leading-relaxed text-slate-550 font-semibold opacity-90"
              style={{ color: sec.settings.textColor || '#64748B' }}
            >
              {sec.settings.description}
            </p>
          )}

          {/* Reassuring timing badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50/75 border border-amber-100 text-[#D4AF37] text-xs font-black animate-fade-in">
            <Clock className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>Takes less than 60 seconds</span>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="relative max-w-6xl mx-auto pt-6">
          {/* Gold Connecting Dotted Line */}
          <div className="absolute top-[180px] left-[15%] right-[15%] h-[2px] border-t-2 border-dashed border-[#D4AF37]/45 hidden md:block z-0" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 relative z-10">
            {steps.map((step, sidx) => (
              <div 
                key={sidx}
                className="bg-white rounded-[24px] border border-slate-100 p-8 flex flex-col items-center justify-between text-center shadow-[0_15px_40px_rgba(147,197,253,0.1)] hover:shadow-[0_24px_50px_rgba(147,197,253,0.16)] hover:-translate-y-1.5 transition-all duration-500 min-h-[440px] group relative"
              >
                {/* Gold step circle overlapping border */}
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#D4AF37] text-white font-black text-base flex items-center justify-center shadow-md border-4 border-white transition-all duration-300 group-hover:scale-110">
                  {step.number || (sidx + 1)}
                </div>

                <div className="space-y-4 flex-1 flex flex-col items-center pt-3 w-full">
                  <h3 className="text-lg md:text-xl font-black text-slate-900 tracking-tight leading-snug">
                    {step.title || 'Step Title'}
                  </h3>
                  
                  <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed max-w-[250px] font-semibold">
                    {step.description || 'Step description details.'}
                  </p>

                  {/* Render High-Fidelity Custom Visual Mockups */}
                  {renderStepVisualMockup(sidx, step)}
                </div>

                {/* Render corresponding green checkmarks */}
                {renderStepCheckmarks(sidx)}
              </div>
            ))}
          </div>
        </div>

        {/* Reassurance Objections Grid */}
        <div className="max-w-6xl mx-auto pt-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-[0_12px_40px_rgba(147,197,253,0.04)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 lg:divide-y-0 lg:divide-x divide-slate-100">
            {/* CANCEL ANYTIME */}
            <div className="flex items-center gap-4 py-4 sm:py-2 md:px-4 first:pt-0 sm:first:pt-2 justify-center lg:justify-start">
              <div className="shrink-0 p-3 rounded-xl bg-slate-50 flex items-center justify-center text-slate-800 shadow-2xs">
                <ShieldCheck className="h-6 w-6 text-slate-800" />
              </div>
              <div className="text-left">
                <h4 className="text-[11px] font-black tracking-wider text-slate-900 uppercase">
                  CANCEL ANYTIME
                </h4>
                <p className="text-[11px] text-slate-400 font-bold leading-normal">
                  No ties, no fuss. You're in control.
                </p>
              </div>
            </div>

            {/* CHANGE ANYTIME */}
            <div className="flex items-center gap-4 py-4 sm:py-2 md:px-4 lg:pl-6 justify-center lg:justify-start">
              <div className="shrink-0 p-3 rounded-xl bg-slate-50 flex items-center justify-center text-slate-850 shadow-2xs">
                <RefreshCw className="h-6 w-6 text-slate-850 animate-spin" style={{ animationDuration: '8s' }} />
              </div>
              <div className="text-left">
                <h4 className="text-[11px] font-black tracking-wider text-slate-900 uppercase">
                  CHANGE ANYTIME
                </h4>
                <p className="text-[11px] text-slate-400 font-bold leading-normal">
                  Swap plans, brands or flavours.
                </p>
              </div>
            </div>

            {/* SKIP DELIVERIES */}
            <div className="flex items-center gap-4 py-4 sm:py-2 md:px-4 lg:pl-6 justify-center lg:justify-start">
              <div className="shrink-0 p-3 rounded-xl bg-slate-50 flex items-center justify-center text-slate-800 shadow-2xs">
                <Truck className="h-6 w-6 text-slate-800" />
              </div>
              <div className="text-left">
                <h4 className="text-[11px] font-black tracking-wider text-slate-900 uppercase">
                  SKIP DELIVERIES
                </h4>
                <p className="text-[11px] text-slate-400 font-bold leading-normal">
                  Skip, pause or delay anytime.
                </p>
              </div>
            </div>

            {/* NO CONTRACTS */}
            <div className="flex items-center gap-4 py-4 sm:py-2 md:px-4 lg:pl-6 last:pb-0 justify-center lg:justify-start">
              <div className="shrink-0 p-3 rounded-xl bg-slate-50 flex items-center justify-center text-slate-800 shadow-2xs">
                <Lock className="h-6 w-6 text-slate-800" />
              </div>
              <div className="text-left">
                <h4 className="text-[11px] font-black tracking-wider text-slate-900 uppercase">
                  NO CONTRACTS
                </h4>
                <p className="text-[11px] text-slate-400 font-bold leading-normal">
                  No commitments, cancel 1-click.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Conversion Area */}
        <div className="mt-12 flex flex-col items-center justify-center space-y-4 text-center pb-6">
          <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Ready to get started?</h4>
          <button
            type="button"
            onClick={() => handleLinkClick('/pages/subscribe')}
            className="px-8 py-4 bg-[#D4AF37] hover:bg-[#bfa032] active:scale-98 transition-all duration-300 text-white font-extrabold uppercase tracking-[0.2em] text-xs rounded-xl shadow-lg shadow-amber-500/10 cursor-pointer flex items-center gap-2"
          >
            Start your subscription
            <ArrowRight className="h-4 w-4 stroke-[2.5]" />
          </button>
          
          {/* Small secure badges */}
          <div className="flex items-center justify-center gap-3 text-[10px] text-slate-400 font-semibold">
            <span className="flex items-center gap-1">
              <Lock className="h-3 w-3 text-slate-400" />
              Secure checkout
            </span>
            <span>•</span>
            <span>18+ Age Verified</span>
            <span>•</span>
            <span>Your data is protected</span>
          </div>
        </div>
      </div>
    </div>
  );
}

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
    <div className="space-y-0 pb-24 font-sans">
      {page.sections && page.sections.length > 0 ? (
        page.sections.map((sec, idx) => {
          const sStyle = {
            backgroundColor: sec.settings.backgroundColor || '#FFFFFF',
            color: sec.settings.textColor || '#475569'
          };
          
          const isFullBleed = (sec.type === 'Slideshow' || sec.type === 'Image banner' || sec.type === 'Marquee text' || sec.type === 'Video banner') && sec.settings.fullWidth;
          const paddingClass = isFullBleed ? 'py-0' : 'py-3 sm:py-4 md:py-5';
          const containerClass = sec.settings.fullWidth ? 'w-full' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';

          return (
            <section
              key={sec.id || idx}
              style={sStyle}
              className={`${paddingClass} relative transition-all duration-300 w-full overflow-hidden`}
            >
              <div className={containerClass}>
                
                {/* 1. IMAGE BANNER */}
                {sec.type === 'Image banner' && (
                  sec.settings.fullWidth ? (
                    /* High-fidelity full-width image banner (Hero style with real-time text overlay protection) */
                    <div className="relative w-full min-h-[380px] sm:min-h-[480px] md:min-h-[560px] flex items-center overflow-hidden">
                      {/* Background Image & Overlay */}
                      <div className="absolute inset-0 z-0">
                        <img
                          src={sec.settings.imageUrl || '/placeholder.png'}
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
                          src={sec.settings.imageUrl || '/placeholder.png'}
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
                {sec.type === 'Video banner' && (() => {
                  const getYouTubeId = (url: string) => {
                    if (!url) return '';
                    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                    const match = url.match(regExp);
                    return (match && match[2].length === 11) ? match[2] : url;
                  };

                  const ytId = getYouTubeId(sec.settings.videoUrl || '');
                  const mp4Url = sec.settings.videoMp4Url || 'https://assets.mixkit.co/videos/preview/mixkit-laboratory-test-tubes-40436-large.mp4';

                  return (
                    <div className="relative w-full min-h-[420px] sm:min-h-[520px] md:min-h-[600px] flex items-center justify-center overflow-hidden bg-slate-950">
                      {/* Video Player Background (YouTube or MP4 upload) */}
                      <div className="absolute inset-0 z-0 w-full h-full pointer-events-none">
                        {ytId ? (
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] pointer-events-none scale-105">
                            <iframe
                              className="w-full h-full object-cover border-0"
                              src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&playlist=${ytId}&loop=1&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1&enablejsapi=1`}
                              title="Video Banner Background"
                              allow="autoplay; encrypted-media"
                              allowFullScreen
                            />
                          </div>
                        ) : (
                          <video
                            className="w-full h-full object-cover opacity-90"
                            autoPlay
                            muted
                            loop
                            playsInline
                            src={mp4Url}
                          />
                        )}
                        {/* Elegant semi-transparent overlay gradient protecting readability */}
                        <div className="absolute inset-0 bg-slate-950/60 sm:bg-slate-950/50" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/20" />
                      </div>

                      {/* Content Overlay */}
                      <div className="relative z-10 max-w-5xl mx-auto px-6 py-6 sm:py-8 text-center text-white space-y-4 flex flex-col items-center">
                        <span className="inline-flex items-center gap-1.5 bg-indigo-650/85 text-white font-extrabold uppercase tracking-widest text-[8px] sm:text-[9.5px] py-1 px-3.5 rounded-full border border-indigo-400/25">
                          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping mr-0.5" />
                          🎥 Laboratory Loop Showcase
                        </span>

                        <h2
                          className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-tight max-w-4xl text-white drop-shadow-sm font-sans"
                          style={{ color: '#FFFFFF' }}
                        >
                          {sec.settings.title || 'Watch Brand Highlights'}
                        </h2>

                        {sec.settings.description && (
                          <p className="text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto text-slate-200 opacity-95 font-medium drop-shadow-xs">
                            {sec.settings.description}
                          </p>
                        )}

                        {sec.settings.buttonText && (
                          <div className="pt-4">
                            <button
                              onClick={() => handleLinkClick(sec.settings.buttonLink || 'frontend-shop')}
                              className="bg-white hover:bg-slate-100 text-slate-950 font-black text-xs sm:text-sm py-4 px-10 rounded-xl shadow-lg transition-all duration-300 cursor-pointer flex items-center gap-2 uppercase tracking-widest group"
                            >
                              <span>{sec.settings.buttonText}</span>
                              <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* 3. IMAGE WITH TEXT */}
                {sec.type === 'Image with text' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center px-4 sm:px-6">
                    <div className="order-2 md:order-1 relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-indigo-500 rounded-3xl blur opacity-15 group-hover:opacity-20 transition duration-500" />
                      <div className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-50">
                        <img
                          src={sec.settings.imageUrl || '/placeholder.png'}
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
                        { title: 'Global Certified Lab Testing', desc: 'Every batch is sourced strictly from laboratory test lines adhering to absolute security and clean protocols.', img: '/placeholder.png', badge: 'LAB VERIFIED' },
                        { title: 'Preservative Free Aroma Boost', desc: 'Crafted using pure food-grade crystalline ingredients, delivering rich natural aromas and smooth fresh locks.', img: '/placeholder.png', badge: '100% TOBACCO-FREE' },
                        { title: 'Vacuum Sealed Freeze Guard', desc: 'Sealed instantly into high-density polymer canisters ensuring 100% cooling impact remains intact during shipping.', img: '/placeholder.png', badge: 'FRESHNESS LOCK' }
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
                  <div className="text-center max-w-3xl mx-auto space-y-4 py-4 px-4 sm:px-6">
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
                {sec.type === 'Marquee text' && (() => {
                  const rawText = sec.settings.title || 'DELIVERY // CANCEL ANYTIME // LOYALTY SCHEME // NEVER RUN OUT // DELIVERED ON YOUR SCHEDULE // SAVE VS. SHOP PRICES // DISCREET DELIVERY';
                  const items = rawText.includes('//') 
                    ? rawText.split('//').map(item => item.trim()).filter(Boolean)
                    : rawText.includes('•')
                    ? rawText.split('•').map(item => item.trim()).filter(Boolean)
                    : [rawText];
                  
                  // Duplicate items multiple times to create an absolute seamless continuous scroll loop
                  const doubledItems = items.length > 0 ? [...items, ...items, ...items, ...items] : [];
                  return (
                    <div 
                      className={`overflow-hidden py-3.5 border-y border-amber-500/10 relative w-full ${sec.settings.fullWidth ? '' : 'rounded-2xl'}`}
                      style={{ backgroundColor: sec.settings.backgroundColor || '#E8BE74' }}
                    >
                      <div className="marquee-container">
                        <div 
                          className="animate-marquee whitespace-nowrap flex gap-8 items-center font-sans font-black uppercase text-[11px] sm:text-xs tracking-wider leading-none"
                          style={{ color: sec.settings.textColor || '#1A1C1D' }}
                        >
                          {doubledItems.map((item, idx) => (
                            <React.Fragment key={idx}>
                              <span className="shrink-0">{item}</span>
                              <span className="text-[13px] opacity-80 shrink-0 select-none">•</span>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}

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
                      {(() => {
                        const targetCollectionId = sec.settings.selectedCollectionId;
                        const selectedColl = targetCollectionId ? allCollections.find(c => c.id === targetCollectionId) : null;
                        const filtered = allProducts
                          .filter(p => p.status === 'Active')
                          .filter(p => !targetCollectionId || selectedColl?.productIds.includes(p.id));
                        
                        return filtered.slice(0, sec.settings.itemsCount || 4).map(prod => {
                          const isWishlisted = loggedInCustomer?.wishlist.includes(prod.id);
                          return (
                            <div 
                              key={prod.id} 
                              onClick={() => onNavigate(`/products/${prod.id}`)}
                              className="bg-white border border-slate-150 rounded-2xl overflow-hidden p-4 space-y-4 group hover:shadow-xl hover:border-slate-300 transition-all relative flex flex-col justify-between cursor-pointer"
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
                        });
                      })()}
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
                                src={b.image || '/placeholder.png'} 
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
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6 py-4">
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

                {/* 17. BRANDS WE OFFER */}
                {sec.type === 'Brands we offer' && (
                  <BrandsWeOfferSection sec={sec} handleLinkClick={handleLinkClick} />
                )}

                {/* 18. HOW IT WORKS */}
                {sec.type === 'How it works' && (
                  <HowItWorksSection sec={sec} handleLinkClick={handleLinkClick} />
                )}

                {/* 16. ICON WITH TEXT */}
                {sec.type === 'Icon with text' && (() => {
                  const items = sec.settings.iconItems || [
                    { iconName: 'Truck', title: 'Delivered on your schedule', description: 'Flexible delivery, when you need it.', linkUrl: 'frontend-shop' },
                    { iconName: 'Zap', title: 'Save vs. shop prices', description: 'Better prices than retail stores.', linkUrl: 'frontend-shop' },
                    { iconName: 'Shield', title: 'Discreet delivery', description: 'Plain, private, and secure packaging.', linkUrl: 'frontend-shop' },
                    { iconName: 'Clock', title: 'Cancel anytime', description: 'No commitments, full control.', linkUrl: 'frontend-shop' },
                    { iconName: 'Award', title: 'Loyalty scheme', description: 'Earn rewards on every order.', linkUrl: 'frontend-shop' },
                    { iconName: 'Package', title: 'Never run out', description: 'Auto-refill and easy reordering.', linkUrl: 'frontend-shop' }
                  ];

                  return (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6 py-4">
                      <div className="text-center space-y-3">
                        {sec.settings.title && (
                          <h2 
                            className="text-3xl md:text-4xl font-black uppercase tracking-tight"
                            style={{ color: sec.settings.headingColor || sec.settings.textColor || '#0F172A' }}
                          >
                            {sec.settings.title}
                          </h2>
                        )}
                        {sec.settings.description && (
                          <p 
                            className="max-w-2xl mx-auto text-xs sm:text-sm leading-relaxed opacity-85"
                            style={{ color: sec.settings.textColor || '#475569' }}
                          >
                            {sec.settings.description}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8 text-center pt-4">
                        {items.map((item, iIdx) => {
                          const IconComp = (() => {
                            const iconStyle = { color: sec.settings.iconColor || '#4F46E5' };
                            switch (item.iconName) {
                              case 'Truck': return <Truck className="h-7 w-7 mx-auto" style={iconStyle} />;
                              case 'Zap': return <Zap className="h-7 w-7 mx-auto" style={iconStyle} />;
                              case 'Shield': return <ShieldCheck className="h-7 w-7 mx-auto" style={iconStyle} />;
                              case 'Clock': return <Clock className="h-7 w-7 mx-auto" style={iconStyle} />;
                              case 'Award': return <Award className="h-7 w-7 mx-auto" style={iconStyle} />;
                              case 'Package': return <Package className="h-7 w-7 mx-auto" style={iconStyle} />;
                              case 'Heart': return <Heart className="h-7 w-7 mx-auto" style={iconStyle} />;
                              case 'HelpCircle': return <HelpCircle className="h-7 w-7 mx-auto" style={iconStyle} />;
                              case 'Star': return <Star className="h-7 w-7 mx-auto" style={iconStyle} />;
                              default: return <Sparkles className="h-7 w-7 mx-auto" style={iconStyle} />;
                            }
                          })();

                          return (
                            <div 
                              key={iIdx} 
                              className="flex flex-col items-center space-y-3 p-4 group rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-300"
                            >
                              <div className="p-3 rounded-full bg-slate-500/10 mb-1 flex items-center justify-center transition-transform duration-350 group-hover:scale-110">
                                {IconComp}
                              </div>
                              <h3 
                                className="text-sm font-black uppercase tracking-tight"
                                style={{ color: sec.settings.headingColor || sec.settings.textColor || '#1E293B' }}
                              >
                                {item.title}
                              </h3>
                              <p 
                                className="text-xs max-w-xs leading-relaxed opacity-75 font-medium"
                                style={{ color: sec.settings.textColor || '#64748B' }}
                              >
                                {item.description}
                              </p>
                              {item.linkUrl && (
                                <button
                                  onClick={() => handleLinkClick(item.linkUrl)}
                                  className="text-[10px] font-black uppercase tracking-widest mt-2 hover:underline opacity-90 hover:opacity-100 flex items-center gap-1 transition-all cursor-pointer bg-transparent border-none outline-none"
                                  style={{ color: sec.settings.iconColor || sec.settings.textColor || '#4F46E5' }}
                                >
                                  <span>Learn more</span>
                                  <span className="text-xs">↗</span>
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

                {/* 18. TRUST BADGES */}
                {sec.type === 'Trust badges' && (() => {
                  const badges = sec.settings.trustBadges || [
                    { iconType: 'badge', title: '100% AUTHENTIC', description: 'Direct from official suppliers.' },
                    { iconType: 'shield', title: 'PREMIUM QUALITY', description: 'Only trusted, proven brands.' },
                    { iconType: 'globe', title: 'GLOBAL SELECTION', description: 'The best from around the world.' },
                    { iconType: 'tag', title: 'MEMBER PRICING', description: 'Better prices, always.' }
                  ];

                  return (
                    <div className="py-8 bg-white w-full">
                      <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 py-4 md:py-6 border-y border-slate-100 divide-y md:divide-y-0 md:divide-x divide-slate-150">
                          {badges.map((b, bIdx) => (
                            <div 
                              key={bIdx} 
                              className="flex items-center gap-4 py-4 md:py-2 md:px-6 first:pl-0 last:pr-0 justify-center md:justify-start first:pt-0 md:first:pt-2 last:pb-0 md:last:pb-2"
                            >
                              <div className="shrink-0 p-2 rounded-xl bg-slate-50 flex items-center justify-center shadow-2xs">
                                {b.iconType === 'badge' ? (
                                  <Award className="h-7 w-7 text-[#D4AF37]" />
                                ) : b.iconType === 'shield' ? (
                                  <ShieldCheck className="h-7 w-7 text-slate-800" />
                                ) : b.iconType === 'globe' ? (
                                  <Globe className="h-7 w-7 text-slate-800" />
                                ) : (
                                  <Tag className="h-7 w-7 text-slate-800" />
                                )}
                              </div>
                              <div className="text-left space-y-0.5">
                                <h4 className="text-xs font-black tracking-wide text-slate-900 uppercase">
                                  {b.title}
                                </h4>
                                <p className="text-[11px] text-slate-400 leading-normal font-medium">
                                  {b.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}

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
