import React, { useState } from 'react';
import { 
  Phone, Mail, MapPin, Instagram, Twitter, Facebook, 
  ArrowUp, Check, ChevronUp 
} from 'lucide-react';
import { LayoutSettings } from '../types';
import { klaviyoTrackNewsletterSubscribe } from '../utils/klaviyo';

interface FooterProps {
  onNavigate?: (tab: string) => void;
  layoutSettings?: LayoutSettings;
}

export default function Footer({ onNavigate, layoutSettings }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    klaviyoTrackNewsletterSubscribe(email);
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else if (onNavigate) {
      onNavigate('frontend-home');
      setTimeout(() => {
        const target = document.getElementById(id);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <footer id="global-footer" className="bg-[#0e0e10] text-[#a0a0a5] border-t border-white/5 font-sans">
      
      {/* Main Footer Grid */}
      <div className="max-w-[1340px] mx-auto px-6 sm:px-10 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 sm:gap-16">
          
          {/* Column 1: Contact */}
          <div className="md:col-span-5 space-y-5">
            <h4 className="font-serif text-xl font-normal text-white tracking-wide">
              Contact
            </h4>

            <div className="space-y-3 text-xs text-[#8f8f94] font-light leading-relaxed">
              <p className="max-w-xs">
                {layoutSettings?.address || '0665 Broadway NY, New York 10001 United States of America'}
              </p>

              <div className="pt-2 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#b58d59] shrink-0">
                  <Phone className="h-3.5 w-3.5" />
                </div>
                <a 
                  href="tel:8001234444" 
                  className="font-serif text-lg font-normal text-white hover:text-[#b58d59] transition-colors"
                >
                  {layoutSettings?.phone || '800 123 4444'}
                </a>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#8f8f94]">
                <Mail className="h-3.5 w-3.5 text-[#b58d59]" />
                <a 
                  href={`mailto:${layoutSettings?.email || 'jade@tailorand.com'}`}
                  className="hover:text-white transition-colors"
                >
                  {layoutSettings?.email || 'jade@tailorand.com'}
                </a>
              </div>
            </div>

            {/* Social Icons matching design.png */}
            <div className="pt-3 flex items-center gap-3">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:border-[#b58d59] hover:bg-[#b58d59] hover:text-white text-white/70 flex items-center justify-center transition-all cursor-pointer"
                aria-label="Instagram"
              >
                <Instagram className="h-3.5 w-3.5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:border-[#b58d59] hover:bg-[#b58d59] hover:text-white text-white/70 flex items-center justify-center transition-all cursor-pointer"
                aria-label="Twitter"
              >
                <Twitter className="h-3.5 w-3.5" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:border-[#b58d59] hover:bg-[#b58d59] hover:text-white text-white/70 flex items-center justify-center transition-all cursor-pointer"
                aria-label="Facebook"
              >
                <Facebook className="h-3.5 w-3.5" />
              </a>
              <a 
                href="https://pinterest.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:border-[#b58d59] hover:bg-[#b58d59] hover:text-white text-white/70 flex items-center justify-center transition-all cursor-pointer text-xs font-serif font-bold"
                aria-label="Pinterest"
              >
                P
              </a>
            </div>
          </div>

          {/* Column 2: My Services */}
          <div className="md:col-span-3 space-y-5">
            <h4 className="font-serif text-xl font-normal text-white tracking-wide">
              My Services
            </h4>

            <ul className="space-y-2.5 text-xs text-[#8f8f94] font-light">
              <li>
                <button 
                  onClick={() => scrollToSection('services-section')}
                  className="hover:text-white hover:translate-x-1 transition-all cursor-pointer text-left"
                >
                  Personal Styling
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('services-section')}
                  className="hover:text-white hover:translate-x-1 transition-all cursor-pointer text-left"
                >
                  Wardrobe Styling
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('services-section')}
                  className="hover:text-white hover:translate-x-1 transition-all cursor-pointer text-left"
                >
                  Individual Consultation
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('pricing-section')}
                  className="hover:text-white hover:translate-x-1 transition-all cursor-pointer text-left"
                >
                  Personal Shopping
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('services-section')}
                  className="hover:text-white hover:translate-x-1 transition-all cursor-pointer text-left"
                >
                  Styling for Men
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('appointment-section')}
                  className="hover:text-white hover:translate-x-1 transition-all cursor-pointer text-left"
                >
                  Special Occasions
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Subscribe */}
          <div className="md:col-span-4 space-y-5">
            <h4 className="font-serif text-xl font-normal text-white tracking-wide">
              Subscribe
            </h4>

            <p className="text-xs text-[#8f8f94] font-light leading-relaxed">
              Subscribe to take advantage of our campaigns and gift certificates.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex items-center gap-0">
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[#18181b] border border-white/10 text-white placeholder-[#666666] text-xs focus:outline-none focus:border-[#b58d59] rounded-l-xs transition"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#b58d59] hover:bg-[#a17849] active:scale-95 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-r-xs shadow transition-all cursor-pointer shrink-0"
                >
                  SUBSCRIBE
                </button>
              </div>

              {subscribed && (
                <div className="flex items-center gap-1.5 text-xs text-[#b58d59] pt-1">
                  <Check className="h-3.5 w-3.5" />
                  <span>Thank you for subscribing!</span>
                </div>
              )}

              {errorMsg && (
                <p className="text-xs text-rose-400 pt-1">{errorMsg}</p>
              )}
            </form>
          </div>

        </div>
      </div>

      {/* Bottom Bar: Copyright & Scroll to Top */}
      <div className="border-t border-white/5 py-6 px-6 sm:px-10">
        <div className="max-w-[1340px] mx-auto flex items-center justify-between text-xs text-[#66666a]">
          <p className="text-[11px] font-light">
            © All Rights Reserved <span className="text-[#888888]">Jade Tailor</span>
          </p>

          <button
            onClick={scrollToTop}
            className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-[#b58d59] hover:bg-[#b58d59] text-white flex items-center justify-center transition-all cursor-pointer group shadow-sm"
            aria-label="Scroll to top"
          >
            <ChevronUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>

    </footer>
  );
}
