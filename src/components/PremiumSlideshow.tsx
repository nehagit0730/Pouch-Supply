import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';

interface Slide {
  title: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
}

interface PremiumSlideshowProps {
  slides?: Slide[];
  fullWidth?: boolean;
  backgroundColor?: string;
  headingColor?: string;
  textColor?: string;
  onLinkClick: (link?: string) => void;
}

const DEFAULT_SLIDES: Slide[] = [
  {
    title: 'THE AUTUMN / WINTER ATELIER',
    description: 'Architectural tailoring, luxurious double-faced wool, and modern silhouettes crafted for enduring versatility.',
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1800&q=85',
    buttonText: 'SHOP NEW ARRIVALS',
    buttonLink: 'frontend-shop'
  },
  {
    title: 'MINIMALIST STREETWEAR',
    description: 'Heavyweight 450gsm organic cotton, dropped shoulder proportions, and relaxed monochrome palettes engineered for everyday comfort.',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1800&q=85',
    buttonText: 'EXPLORE THE DROP',
    buttonLink: 'frontend-shop'
  },
  {
    title: 'TIMELESS CONTEMPORARY TAILORING',
    description: 'Unstructured blazers, relaxed pleated trousers, and breathable linen-blend overshirts designed for effortless layering.',
    imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1800&q=85',
    buttonText: 'DISCOVER LOOKBOOK',
    buttonLink: 'frontend-shop'
  }
];

export default function PremiumSlideshow({
  slides = DEFAULT_SLIDES,
  fullWidth = true,
  backgroundColor = '#0F172A',
  headingColor = '#FFFFFF',
  textColor = '#E2E8F0',
  onLinkClick
}: PremiumSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoplayTimer = useRef<NodeJS.Timeout | null>(null);

  const activeSlides = slides && slides.length > 0 ? slides : DEFAULT_SLIDES;

  useEffect(() => {
    if (!isHovered && activeSlides.length > 1) {
      autoplayTimer.current = setInterval(() => {
        handleNext();
      }, 5500);
    }
    return () => {
      if (autoplayTimer.current) {
        clearInterval(autoplayTimer.current);
      }
    };
  }, [currentIndex, isHovered, activeSlides]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden transition-all duration-300 ${
        fullWidth 
          ? 'w-full h-[500px] sm:h-[600px] md:h-[680px] lg:h-[750px]' 
          : 'max-w-7xl mx-auto rounded-3xl border border-slate-200/60 shadow-md h-[460px] sm:h-[560px] md:h-[620px]'
      }`}
      style={{ backgroundColor }}
    >
      {/* Slides track */}
      <div className="w-full h-full relative">
        {activeSlides.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={idx}
              className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out flex items-center ${
                isActive 
                  ? 'opacity-100 translate-x-0 pointer-events-auto z-10' 
                  : 'opacity-0 translate-x-8 pointer-events-none z-0'
              }`}
            >
              {/* Background cover image with sleek gradient overlay */}
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={slide.imageUrl || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1800&q=85'}
                  alt={slide.title}
                  className={`w-full h-full object-cover transition-transform duration-10000 ease-out ${isActive ? 'scale-105' : 'scale-100'}`}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/50 to-transparent sm:block hidden" />
                <div className="absolute inset-0 bg-slate-950/70 sm:hidden" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/20" />
              </div>

              {/* Slide Content card */}
              <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16 w-full relative z-20 text-left text-white">
                <div className="max-w-2xl space-y-4 sm:space-y-6">
                  
                  {/* Subtle Top Badge */}
                  <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-white font-bold uppercase tracking-[0.25em] text-[9px] sm:text-[10px] py-1.5 px-4 rounded-full border border-white/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>NEW SEASON COLLECTION</span>
                  </div>

                  {/* High display elegant title */}
                  <h2 
                    className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-[1.05] text-white"
                    style={{ textShadow: '0 3px 6px rgba(0,0,0,0.5)' }}
                  >
                    {slide.title}
                  </h2>

                  {/* Description subtext */}
                  <p 
                    className="text-xs sm:text-base text-slate-200 leading-relaxed max-w-lg hidden sm:block font-normal"
                    style={{ textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}
                  >
                    {slide.description}
                  </p>
                  
                  {/* Mobile-only description */}
                  <p className="text-xs text-slate-200 leading-relaxed block sm:hidden">
                    {slide.description.substring(0, 110)}...
                  </p>

                  {/* Actions buttons */}
                  {slide.buttonText && (
                    <div className="pt-3 flex items-center gap-4">
                      <button
                        onClick={() => onLinkClick(slide.buttonLink || 'frontend-shop')}
                        className="bg-white hover:bg-slate-100 text-slate-950 font-black text-xs py-4 px-8 rounded-full shadow-2xl transition-all duration-300 cursor-pointer flex items-center gap-2 uppercase tracking-widest group hover:scale-[1.02] active:scale-95"
                      >
                        <span>{slide.buttonText}</span>
                        <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </button>
                      <button
                        onClick={() => onLinkClick('frontend-shop')}
                        className="bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border border-white/25 font-bold text-xs py-4 px-6 rounded-full transition-all duration-300 cursor-pointer hidden sm:flex items-center gap-2 uppercase tracking-wider"
                      >
                        VIEW LOOKBOOK
                      </button>
                    </div>
                  )}

                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Nav Controls - Left/Right arrows */}
      {activeSlides.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-md border border-white/20 transition-all z-20 cursor-pointer hidden sm:flex items-center justify-center hover:scale-105 active:scale-95"
            aria-label="Previous slide"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          
          <button
            onClick={handleNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-md border border-white/20 transition-all z-20 cursor-pointer hidden sm:flex items-center justify-center hover:scale-105 active:scale-95"
            aria-label="Next slide"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Bottom slide dots Indicators */}
      {activeSlides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
          {activeSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`transition-all duration-500 rounded-full cursor-pointer ${
                idx === currentIndex ? 'w-10 h-2 bg-white shadow-lg' : 'w-2 h-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}

    </div>
  );
}
