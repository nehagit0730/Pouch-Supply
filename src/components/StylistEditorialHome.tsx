import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, Check, X, Phone, Play, Star, 
  Sparkles, Calendar, Clock, MapPin, ArrowRight, User, Heart, 
  ShoppingBag, CheckCircle2, MessageSquare, Mail
} from 'lucide-react';
import { Product, Collection, BlogPost } from '../types';

interface StylistEditorialHomeProps {
  onNavigate?: (tab: string, arg?: string) => void;
  onAddToCart?: (product: Product, quantity?: number) => void;
  allProducts?: Product[];
  allCollections?: Collection[];
  allBlogs?: BlogPost[];
}

export default function StylistEditorialHome({
  onNavigate,
  onAddToCart,
  allProducts = [],
  allCollections = [],
  allBlogs = []
}: StylistEditorialHomeProps) {
  // Hero slide state
  const [heroSlide, setHeroSlide] = useState(0);

  // Video modal state
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Appointment Form state
  const [appointmentName, setAppointmentName] = useState('');
  const [appointmentPhone, setAppointmentPhone] = useState('');
  const [appointmentEmail, setAppointmentEmail] = useState('');
  const [appointmentSubject, setAppointmentSubject] = useState('');
  const [appointmentMessage, setAppointmentMessage] = useState('');
  const [appointmentSubmitted, setAppointmentSubmitted] = useState(false);

  // Services slider state
  const [serviceSlide, setServiceSlide] = useState(0);

  // Review slider state
  const [reviewSlide, setReviewSlide] = useState(0);

  // Lightbox portfolio modal state
  const [selectedPortfolioImage, setSelectedPortfolioImage] = useState<string | null>(null);

  // Packages booking toast state
  const [packageBookedToast, setPackageBookedToast] = useState<string | null>(null);

  const heroSlides = [
    {
      subtitle: 'JADE TAILOR • PERSONAL STYLIST',
      title: 'Elevate Your Style',
      ctaText: 'WORK WITH JADE',
      image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1920&q=85',
      caption: 'Bespoke silhouettes, signature color palettes, and effortless everyday elegance.'
    },
    {
      subtitle: 'CURATED WARDROBES • CAPSULE ESSENTIALS',
      title: 'Redefine Elegance',
      ctaText: 'EXPLORE SERVICES',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=85',
      caption: 'Transformative personal consultations designed to bring out your natural confidence.'
    }
  ];

  const services = [
    {
      title: 'Individual Consultation',
      description: 'A comprehensive one-on-one deep dive into your personal aesthetic, body architecture, and lifestyle requirements. We assess your color typology, define your signature silhouette, and formulate a seasonal style blueprint tailored specifically for you.',
      image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1000&q=80',
      action: 'Book Consultation'
    },
    {
      title: 'Wardrobe Curation & Edit',
      description: 'An editorial audit of your existing wardrobe to identify gaps, purge outdated garments, and build multi-functional capsule combinations that turn getting dressed into an effortless joy.',
      image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=80',
      action: 'Learn More'
    },
    {
      title: 'Personal VIP Shopping Tour',
      description: 'Private, pre-pulled boutique shopping sessions tailored to your exact budget and aesthetic goals. Skip the retail overwhelm with a curated dressing room waiting for your arrival.',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=80',
      action: 'Reserve Tour'
    }
  ];

  const packages = [
    {
      id: 'pkg-1',
      title: 'In-Home Styling',
      price: '$300',
      image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=600&q=80',
      features: [
        { text: 'Complete closet audit & organization', included: true },
        { text: 'Color analysis & silhouette mapping', included: true },
        { text: 'Personalized digital lookbook (20 outfits)', included: false }
      ],
      isFeatured: false,
      btnText: 'WORK WITH ME'
    },
    {
      id: 'pkg-2',
      title: 'Half Day Shopping',
      price: '$450',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80',
      features: [
        { text: '4 hours private curated shopping tour', included: true },
        { text: 'Pre-selected garments ready in VIP suites', included: true },
        { text: 'Seasonal capsule wardrobe integration', included: false }
      ],
      isFeatured: true,
      btnText: 'WORK WITH ME'
    },
    {
      id: 'pkg-3',
      title: 'Full Day Shopping',
      price: '$600',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80',
      features: [
        { text: 'Full 8 hours complete wardrobe overhaul', included: true },
        { text: 'Luxury boutique access & stylist discounts', included: true },
        { text: 'Comprehensive seasonal digital lookbook', included: true }
      ],
      isFeatured: false,
      btnText: 'WORK WITH ME'
    }
  ];

  const reviews = [
    {
      quote: "Highly recommend, thank you again!",
      content: "Jade is so lovely and did such a great job with my wedding dress along with bridal party and mother of the bride outfits... She understood exactly what flattered my shape while keeping me entirely comfortable. Highly recommend, thank you again!",
      author: "Emily Brown",
      role: "Customer Review",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80"
    },
    {
      quote: "Completely transformed my morning routine!",
      content: "Working with Jade completely revitalized my professional style. I went from spending 30 minutes in frustration every morning to having a cohesive, sophisticated wardrobe where every piece works seamlessly together.",
      author: "Sarah Jenkins",
      role: "Creative Director",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80"
    }
  ];

  const portfolioItems = [
    {
      image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
      title: 'Architectural Tailoring & Cream Trench',
      category: 'Editorial Streetwear'
    },
    {
      image: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=800&q=80',
      title: 'Effortless Summer Linen Ensemble',
      category: 'Casual Resort'
    },
    {
      image: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=800&q=80',
      title: 'Bohemian Sunhat & Warm Earth Tones',
      category: 'Seasonal Lookbook'
    },
    {
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
      title: 'Modern Sport-Luxe & Monochrome',
      category: 'Contemporary Casual'
    },
    {
      image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80',
      title: 'Pastel Blazer & Checked Silk Separates',
      category: 'Executive Style'
    },
    {
      image: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=800&q=80',
      title: 'Evening Velvet & Statement Eyewear',
      category: 'Gala & Red Carpet'
    }
  ];

  const handleAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointmentName || !appointmentEmail) return;
    setAppointmentSubmitted(true);
    setTimeout(() => {
      setAppointmentName('');
      setAppointmentPhone('');
      setAppointmentEmail('');
      setAppointmentSubject('');
      setAppointmentMessage('');
      setAppointmentSubmitted(false);
    }, 4500);
  };

  const handleBookPackage = (pkgTitle: string) => {
    setPackageBookedToast(`You selected "${pkgTitle}". Opening booking scheduler...`);
    const appointmentSection = document.getElementById('appointment-section');
    if (appointmentSection) {
      appointmentSection.scrollIntoView({ behavior: 'smooth' });
      setAppointmentSubject(`Booking Request: ${pkgTitle}`);
    }
    setTimeout(() => setPackageBookedToast(null), 4000);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-[#fdfcfb] text-[#1a1a1a] selection:bg-[#b58d59] selection:text-white">

      {/* Toast Notification */}
      {packageBookedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111111] text-white px-5 py-3.5 rounded-xl shadow-2xl border border-[#b58d59]/40 flex items-center gap-3 animate-fade-in text-xs font-medium">
          <Sparkles className="h-4 w-4 text-[#b58d59] shrink-0" />
          <span>{packageBookedToast}</span>
        </div>
      )}

      {/* 1. HERO SLIDER BANNER */}
      <section className="relative w-full h-[75vh] min-h-[580px] max-h-[820px] overflow-hidden bg-[#111111]">
        {/* Background Image with warm overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform scale-102"
          style={{ backgroundImage: `url(${heroSlides[heroSlide].image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/40" />
          <div className="absolute inset-0 bg-[#b58d59]/10 mix-blend-color" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 h-full max-w-5xl mx-auto px-6 flex flex-col items-center justify-center text-center text-white">
          <span className="text-[11px] sm:text-xs tracking-[0.35em] uppercase font-sans font-semibold text-white/90 mb-3 drop-shadow-sm">
            {heroSlides[heroSlide].subtitle}
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-white mb-6 drop-shadow-md leading-[1.1]">
            {heroSlides[heroSlide].title}
          </h1>
          <p className="text-sm sm:text-base text-white/80 max-w-lg mb-8 font-sans font-light leading-relaxed">
            {heroSlides[heroSlide].caption}
          </p>

          <button
            onClick={() => scrollToSection('appointment-section')}
            className="px-8 py-3.5 bg-[#b58d59] hover:bg-[#a17849] active:scale-95 text-white text-[11px] font-sans font-bold uppercase tracking-[0.25em] rounded-xs shadow-lg transition-all duration-300 cursor-pointer"
          >
            {heroSlides[heroSlide].ctaText}
          </button>
        </div>

        {/* Delicate Left & Right Arrow Controls */}
        <button
          onClick={() => setHeroSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1))}
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-white/40 bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-all duration-300 backdrop-blur-xs cursor-pointer group"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
        </button>

        <button
          onClick={() => setHeroSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1))}
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-white/40 bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-all duration-300 backdrop-blur-xs cursor-pointer group"
          aria-label="Next Slide"
        >
          <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
        </button>

        {/* Hero Slide indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroSlide(i)}
              className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                i === heroSlide ? 'w-8 bg-[#b58d59]' : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 2. ABOUT JADE TAILOR / FIND YOUR STYLE WITH ME */}
      <section id="about-section" className="py-20 md:py-28 px-6 max-w-[1240px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Text & Accolades */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] tracking-[0.3em] font-sans font-bold uppercase text-[#888888] block">
              ABOUT JADE TAILOR
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[#1a1a1a] leading-tight">
              Find Your Style <span className="font-editorial-italic font-normal">With Me</span>
            </h2>

            <div className="space-y-4 text-xs sm:text-[13px] text-[#555555] font-sans leading-relaxed">
              <p>
                Style sit amet risus ac dui auctor posuere sit amet eget libero. Ut lacinia lectus non risus facilisis, semper consequat sem fringilla. Etiam et tincidunt felis. Quisque at maximus nulla dictum vestibulum sed interdum neque dictum.
              </p>
              <p>
                Your style laboris sollicitudin purus vel posuere. Maecenas auctor, turpis quis mattis tristique, ligula dolor vestibulum risus, nec ullamcorper justo dolor soda lorem. Sed interdum arcu ac metus mollis venenatis.
              </p>
            </div>

            {/* Checkmark stats */}
            <div className="pt-2 space-y-2.5 text-xs font-sans text-[#333333]">
              <div className="flex items-center gap-2.5">
                <span className="text-[#b58d59] font-bold text-sm">✓</span>
                <span className="font-medium">7+ years of work</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-[#b58d59] font-bold text-sm">✓</span>
                <span className="font-medium">150+ free consultations</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-[#b58d59] font-bold text-sm">✓</span>
                <span className="font-medium">90+ happy clients</span>
              </div>
            </div>
          </div>

          {/* Right Column: Overlapping Duo of Images */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            {/* Main upper photo */}
            <div className="relative w-[65%] sm:w-[280px] aspect-[4/5] rounded-xs overflow-hidden shadow-xl z-10 border border-white">
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80" 
                alt="Jade Tailor - Personal Stylist"
                className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Offset lower right photo */}
            <div className="relative w-[60%] sm:w-[260px] aspect-[4/5] rounded-xs overflow-hidden shadow-2xl -ml-12 sm:-ml-16 mt-16 sm:mt-24 z-20 border-4 border-[#fdfcfb]">
              <img 
                src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80" 
                alt="Client in tailored knitwear"
                className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

        </div>
      </section>

      {/* 3. WHAT I DO / MY SERVICES (FEATURED SHOWCASE) */}
      <section id="services-section" className="py-16 md:py-24 bg-[#f9f7f4] border-y border-[#ece7de]">
        <div className="max-w-[1240px] mx-auto px-6">
          
          {/* Section Heading */}
          <div className="text-center mb-12 space-y-2">
            <span className="text-[10px] tracking-[0.35em] font-sans font-bold uppercase text-[#888888] block">
              WHAT I DO
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#1a1a1a]">
              My <span className="font-editorial-italic font-normal">Services</span>
            </h2>
          </div>

          {/* Featured Service Card Slider */}
          <div className="relative max-w-4xl mx-auto bg-white shadow-xl rounded-xs overflow-hidden border border-[#eee9df]">
            <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
              
              {/* Studio photo */}
              <div className="md:col-span-7 h-64 md:h-auto min-h-[360px] relative overflow-hidden">
                <img 
                  src={services[serviceSlide].image} 
                  alt={services[serviceSlide].title}
                  className="w-full h-full object-cover object-center transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Description card */}
              <div className="md:col-span-5 p-8 md:p-10 flex flex-col justify-center bg-white">
                <h3 className="font-serif text-2xl font-normal text-[#1a1a1a] mb-4">
                  {services[serviceSlide].title}
                </h3>
                <p className="text-xs text-[#666666] font-sans leading-relaxed mb-6">
                  {services[serviceSlide].description}
                </p>
                <div>
                  <button
                    onClick={() => scrollToSection('appointment-section')}
                    className="px-6 py-2.5 bg-[#b58d59] hover:bg-[#a17849] active:scale-95 text-white text-[10px] font-sans font-bold uppercase tracking-[0.2em] rounded-xs shadow transition-all cursor-pointer"
                  >
                    LEARN MORE
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Pagination dots beneath */}
          <div className="flex justify-center items-center gap-2 mt-8">
            {services.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setServiceSlide(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === serviceSlide ? 'bg-[#b58d59] scale-125' : 'bg-[#d6cebf] hover:bg-[#b58d59]/60'
                }`}
                aria-label={`View service ${idx + 1}`}
              />
            ))}
          </div>

          {/* 3 Numbered Pillars: 01, 02, 03 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mt-16 pt-16 border-t border-[#e8e2d5]">
            <div className="flex gap-4 items-start">
              <span className="font-serif text-4xl sm:text-5xl font-light text-[#b58d59] leading-none shrink-0">
                01
              </span>
              <div className="space-y-1.5">
                <h4 className="font-serif text-lg font-normal text-[#1a1a1a]">Wardrobe Styling</h4>
                <p className="text-xs text-[#666666] font-sans leading-relaxed">
                  Lorem ipsum nisl quam nestibulum drana odio elementum scesue the monte.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <span className="font-serif text-4xl sm:text-5xl font-light text-[#b58d59] leading-none shrink-0">
                02
              </span>
              <div className="space-y-1.5">
                <h4 className="font-serif text-lg font-normal text-[#1a1a1a]">Closet Cleanse</h4>
                <p className="text-xs text-[#666666] font-sans leading-relaxed">
                  Lorem ipsum nisl quam nestibulum drana odio elementum monte.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <span className="font-serif text-4xl sm:text-5xl font-light text-[#b58d59] leading-none shrink-0">
                03
              </span>
              <div className="space-y-1.5">
                <h4 className="font-serif text-lg font-normal text-[#1a1a1a]">Shopping Tour</h4>
                <p className="text-xs text-[#666666] font-sans leading-relaxed">
                  Lorem ipsum nisl quam nestibulum drana odio elementum scesue the can.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. VIDEO BANNER / INSPIRATION */}
      <section className="relative w-full h-[48vh] min-h-[360px] overflow-hidden bg-[#111111] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1800&q=85')` }}
        >
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 bg-[#b58d59]/15 mix-blend-overlay" />
        </div>

        <div className="relative z-10 text-center text-white px-6 space-y-6">
          <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-white leading-tight">
            <span className="font-editorial-italic text-[#caa26c]">Discover</span> My Video Tips<br className="hidden sm:block" /> And Hints
          </h2>

          <div>
            <button
              onClick={() => setIsVideoModalOpen(true)}
              className="w-16 h-16 rounded-full border border-white/70 bg-white/10 hover:bg-white/25 text-white flex items-center justify-center mx-auto transition-all duration-300 transform hover:scale-110 shadow-2xl cursor-pointer group"
              aria-label="Play Styling Video"
            >
              <Play className="h-6 w-6 fill-white text-white translate-x-0.5 transition-transform group-hover:scale-105" />
            </button>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl bg-[#111111] rounded-xl overflow-hidden shadow-2xl border border-white/10">
            <div className="p-4 border-b border-white/10 flex items-center justify-between text-white">
              <span className="font-serif text-base">Styling Masterclass with Jade Tailor</span>
              <button 
                onClick={() => setIsVideoModalOpen(false)}
                className="text-white/60 hover:text-white p-1 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="aspect-video w-full bg-black flex items-center justify-center">
              <iframe 
                className="w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="Styling Masterclass"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* 5. PRICING PLAN / STYLING PACKAGES */}
      <section id="pricing-section" className="py-20 md:py-28 px-6 max-w-[1240px] mx-auto">
        <div className="text-center mb-16 space-y-2">
          <span className="text-[10px] tracking-[0.35em] font-sans font-bold uppercase text-[#888888] block">
            PRICING PLAN
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#1a1a1a]">
            Styling <span className="font-editorial-italic font-normal">Packages</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <div 
              key={pkg.id} 
              className={`bg-white rounded-xs border transition-all duration-300 hover:shadow-xl flex flex-col justify-between overflow-hidden ${
                pkg.isFeatured ? 'border-[#b58d59] shadow-lg ring-1 ring-[#b58d59]/20' : 'border-[#e8e4dc]'
              }`}
            >
              <div>
                {/* Package Thumbnail Image */}
                <div className="h-48 w-full overflow-hidden bg-slate-100">
                  <img 
                    src={pkg.image} 
                    alt={pkg.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="p-8 text-center space-y-4">
                  <h3 className="font-serif text-xl font-normal text-[#1a1a1a]">
                    {pkg.title}
                  </h3>

                  <div className="flex items-baseline justify-center gap-1.5">
                    <span className="text-xs text-[#777777] font-sans font-light">starting at</span>
                    <span className="font-serif text-3xl font-light text-[#b58d59]">{pkg.price}</span>
                  </div>

                  {/* Checklist */}
                  <div className="pt-4 border-t border-[#f0ece5] space-y-2.5 text-left text-xs text-[#666666]">
                    {pkg.features.map((f, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2">
                        {f.included ? (
                          <span className="text-[#b58d59] font-bold text-sm leading-none shrink-0">✓</span>
                        ) : (
                          <span className="text-[#999999] text-xs leading-none shrink-0">✕</span>
                        )}
                        <span className={f.included ? 'text-[#444444]' : 'text-[#888888] line-through'}>
                          {f.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-8 pt-0">
                <button
                  onClick={() => handleBookPackage(pkg.title)}
                  className={`w-full py-3 text-[10px] font-sans font-bold uppercase tracking-[0.2em] rounded-xs transition-all duration-200 cursor-pointer shadow-sm ${
                    pkg.isFeatured 
                      ? 'bg-[#b58d59] hover:bg-[#a17849] text-white' 
                      : 'bg-[#1a1a1a] hover:bg-black text-white'
                  }`}
                >
                  {pkg.btnText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CLIENTS REVIEWS / WHAT CLIENTS SAY ABOUT ME */}
      <section id="reviews-section" className="py-20 md:py-28 bg-[#fbf9f6] border-y border-[#ece7de]">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="text-center mb-16 space-y-2">
            <span className="text-[10px] tracking-[0.35em] font-sans font-bold uppercase text-[#888888] block">
              CLIENTS REVIEWS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#1a1a1a]">
              What Clients Say <span className="font-editorial-italic font-normal">About Me</span>
            </h2>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              {/* Photo */}
              <div className="md:col-span-5 h-[380px] rounded-xs overflow-hidden shadow-xl border border-white">
                <img 
                  src={reviews[reviewSlide].image} 
                  alt="Client portrait"
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Floating review card with quote mark */}
              <div className="md:col-span-7 bg-white p-8 sm:p-12 shadow-xl rounded-xs border border-[#eee9df] relative">
                <span className="text-5xl font-serif text-[#ebd9bd] absolute top-4 right-6 select-none opacity-80">
                  “
                </span>

                <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#1a1a1a] mb-4">
                  "{reviews[reviewSlide].quote}"
                </h3>

                <p className="text-xs sm:text-sm text-[#555555] font-sans leading-relaxed mb-6 font-light">
                  {reviews[reviewSlide].content}
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-[#f0ece5]">
                  <img 
                    src={reviews[reviewSlide].avatar} 
                    alt={reviews[reviewSlide].author}
                    className="w-10 h-10 rounded-full object-cover border border-[#b58d59]"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="font-serif text-sm font-semibold text-[#1a1a1a]">
                      {reviews[reviewSlide].author}
                    </h4>
                    <span className="text-[10px] text-[#888888] font-sans uppercase tracking-wider block">
                      {reviews[reviewSlide].role}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Slider dots */}
            <div className="flex justify-center items-center gap-2 mt-8">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setReviewSlide(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    i === reviewSlide ? 'bg-[#b58d59] scale-125' : 'bg-[#d6cebf]'
                  }`}
                  aria-label={`View review ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. MY PORTFOLIO / FIND YOUR IDEAL STYLE AND LOOK? */}
      <section id="portfolio-section" className="py-20 md:py-28 px-6 max-w-[1240px] mx-auto">
        <div className="text-center mb-16 space-y-2">
          <span className="text-[10px] tracking-[0.35em] font-sans font-bold uppercase text-[#888888] block">
            MY PORTFOLIO
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#1a1a1a]">
            Find Your Ideal Style<br />and Look?
          </h2>
        </div>

        {/* 6-Photo Masonry / Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {portfolioItems.map((item, idx) => (
            <div 
              key={idx}
              onClick={() => setSelectedPortfolioImage(item.image)}
              className="group relative aspect-[3/4] rounded-xs overflow-hidden bg-slate-100 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <img 
                src={item.image} 
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#dec196] font-sans font-bold">
                  {item.category}
                </span>
                <h4 className="font-serif text-base font-normal mt-1 leading-snug">
                  {item.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Portfolio Lightbox */}
      {selectedPortfolioImage && (
        <div 
          onClick={() => setSelectedPortfolioImage(null)}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-3xl max-h-[85vh]">
            <img 
              src={selectedPortfolioImage} 
              alt="Enlarged Portfolio" 
              className="max-h-[85vh] w-auto object-contain rounded shadow-2xl" 
            />
            <button 
              onClick={() => setSelectedPortfolioImage(null)}
              className="absolute -top-10 right-0 text-white/70 hover:text-white p-2"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}

      {/* 8. LATEST NEWS / NEWS & BLOG (DARK LUXURY SECTION) */}
      <section id="blog-section" className="py-20 md:py-28 bg-[#0f0f10] text-white">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="text-center mb-16 space-y-2">
            <span className="text-[10px] tracking-[0.35em] font-sans font-bold uppercase text-[#888888] block">
              LATEST NEWS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-white">
              News <span className="font-editorial-italic text-[#caa26c]">& Blog</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Blog Post 1 */}
            <div 
              onClick={() => onNavigate?.('blogs')}
              className="bg-[#18181a] border border-white/10 rounded-xs overflow-hidden group cursor-pointer hover:border-[#b58d59]/50 transition-all duration-300"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80" 
                  alt="Whimsical Wardrobe"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-white/95 text-[#1a1a1a] px-3 py-1.5 text-center shadow-md">
                  <span className="block text-[8px] uppercase tracking-wider font-bold text-[#777777]">DEC</span>
                  <span className="block font-serif text-lg font-bold leading-none text-[#b58d59]">29</span>
                </div>
              </div>
              <div className="p-6 space-y-2">
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#caa26c] font-sans font-bold">
                  FASHION STYLE
                </span>
                <h3 className="font-serif text-xl font-normal text-white group-hover:text-[#caa26c] transition-colors leading-snug">
                  How To Elevate Your Whimsical Wardrobe
                </h3>
              </div>
            </div>

            {/* Blog Post 2 */}
            <div 
              onClick={() => onNavigate?.('blogs')}
              className="bg-[#18181a] border border-white/10 rounded-xs overflow-hidden group cursor-pointer hover:border-[#b58d59]/50 transition-all duration-300"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=800&q=80" 
                  alt="Women's Business Formal"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-white/95 text-[#1a1a1a] px-3 py-1.5 text-center shadow-md">
                  <span className="block text-[8px] uppercase tracking-wider font-bold text-[#777777]">DEC</span>
                  <span className="block font-serif text-lg font-bold leading-none text-[#b58d59]">27</span>
                </div>
              </div>
              <div className="p-6 space-y-2">
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#caa26c] font-sans font-bold">
                  BUSINESS STYLE
                </span>
                <h3 className="font-serif text-xl font-normal text-white group-hover:text-[#caa26c] transition-colors leading-snug">
                  Women's Business Formal Attire To Promote Your Style
                </h3>
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center gap-2 mt-8">
            <span className="w-2 h-2 rounded-full bg-[#caa26c]" />
            <span className="w-2 h-2 rounded-full bg-white/20" />
          </div>
        </div>
      </section>

      {/* 9. MAKE AN APPOINTMENT (SPLIT BANNER & FORM) */}
      <section 
        id="appointment-section" 
        className="relative py-20 md:py-28 px-6 bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1600&q=80')` }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

        <div className="relative z-10 max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-white">
          
          {/* Left Text & Call Prompt */}
          <div className="lg:col-span-6 space-y-6">
            <p className="font-serif italic text-xl sm:text-2xl text-white/90 leading-relaxed font-light">
              To submit an enquiry or to arrange an appointment please call me or alternatively please complete the form.
            </p>

            <div className="pt-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#b58d59] flex items-center justify-center text-white shadow-lg shrink-0">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <span className="block text-[10px] tracking-[0.25em] uppercase text-white/70 font-sans font-bold">
                  GET IN TOUCH
                </span>
                <a 
                  href="tel:8001234444" 
                  className="font-serif text-2xl sm:text-3xl font-normal text-white hover:text-[#caa26c] transition-colors"
                >
                  800 123 4444
                </a>
              </div>
            </div>
          </div>

          {/* Right Floating White Booking Card */}
          <div className="lg:col-span-6 bg-white text-[#1a1a1a] p-8 sm:p-10 rounded-xs shadow-2xl border border-white/20">
            <h3 className="font-serif text-2xl font-normal text-center mb-6 text-[#1a1a1a]">
              Make An Appointment
            </h3>

            {appointmentSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="h-12 w-12 text-[#b58d59] mx-auto animate-bounce" />
                <h4 className="font-serif text-xl text-[#1a1a1a]">Appointment Requested!</h4>
                <p className="text-xs text-[#666666] font-sans max-w-xs mx-auto">
                  Thank you! Jade Tailor's studio concierge will contact you within 24 hours to confirm your styling session.
                </p>
              </div>
            ) : (
              <form onSubmit={handleAppointmentSubmit} className="space-y-4 font-sans text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <input 
                      type="text"
                      placeholder="Name"
                      required
                      value={appointmentName}
                      onChange={(e) => setAppointmentName(e.target.value)}
                      className="w-full p-3 bg-[#fbf9f6] border border-[#e5dfd5] text-[#1a1a1a] placeholder-[#999999] focus:outline-none focus:border-[#b58d59] rounded-xs transition"
                    />
                  </div>
                  <div>
                    <input 
                      type="tel"
                      placeholder="Phone"
                      value={appointmentPhone}
                      onChange={(e) => setAppointmentPhone(e.target.value)}
                      className="w-full p-3 bg-[#fbf9f6] border border-[#e5dfd5] text-[#1a1a1a] placeholder-[#999999] focus:outline-none focus:border-[#b58d59] rounded-xs transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <input 
                      type="email"
                      placeholder="e-Mail"
                      required
                      value={appointmentEmail}
                      onChange={(e) => setAppointmentEmail(e.target.value)}
                      className="w-full p-3 bg-[#fbf9f6] border border-[#e5dfd5] text-[#1a1a1a] placeholder-[#999999] focus:outline-none focus:border-[#b58d59] rounded-xs transition"
                    />
                  </div>
                  <div>
                    <input 
                      type="text"
                      placeholder="Subject"
                      value={appointmentSubject}
                      onChange={(e) => setAppointmentSubject(e.target.value)}
                      className="w-full p-3 bg-[#fbf9f6] border border-[#e5dfd5] text-[#1a1a1a] placeholder-[#999999] focus:outline-none focus:border-[#b58d59] rounded-xs transition"
                    />
                  </div>
                </div>

                <div>
                  <textarea 
                    rows={4}
                    placeholder="Message"
                    value={appointmentMessage}
                    onChange={(e) => setAppointmentMessage(e.target.value)}
                    className="w-full p-3 bg-[#fbf9f6] border border-[#e5dfd5] text-[#1a1a1a] placeholder-[#999999] focus:outline-none focus:border-[#b58d59] rounded-xs transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#b58d59] hover:bg-[#a17849] active:scale-98 text-white text-[10px] font-bold uppercase tracking-[0.25em] rounded-xs shadow transition-all cursor-pointer"
                >
                  MAKE APPOINTMENT
                </button>
              </form>
            )}
          </div>

        </div>
      </section>

      {/* 10. BRAND LOGOS ROW */}
      <section className="py-12 bg-[#ffffff] border-b border-[#ece7de] overflow-hidden">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="flex flex-wrap items-center justify-between gap-8 md:gap-12 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="font-serif text-lg tracking-[0.25em] font-bold uppercase text-[#333333]">
              CHIPPY'S
            </span>
            <div className="flex items-center gap-1.5 font-sans font-black tracking-widest text-sm text-[#222222]">
              <span className="h-4 w-1 bg-[#1a1a1a] inline-block" />
              <span>FASTLANE</span>
            </div>
            <span className="font-serif italic text-xl tracking-wider text-[#444444]">
              SWEETY.
            </span>
            <div className="flex flex-col text-center font-sans">
              <span className="text-[10px] font-black tracking-[0.3em] uppercase text-[#1a1a1a]">MIGHTY</span>
              <span className="text-[8px] tracking-[0.2em] uppercase text-[#666666]">FURNITURES</span>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold tracking-widest text-[#333333]">
              <span>CARA</span>
              <span className="text-[9px] text-[#b58d59]">INDOORS</span>
            </div>
            <span className="font-serif text-sm tracking-[0.2em] uppercase text-[#222222]">
              GOLDEN NET 109
            </span>
            <span className="font-serif text-base tracking-[0.2em] uppercase font-light text-[#111111]">
              avant garde
            </span>
          </div>
        </div>
      </section>

    </div>
  );
}
