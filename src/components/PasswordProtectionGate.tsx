import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Sparkles, Mail, Check, AlertCircle } from 'lucide-react';

interface PasswordProtectionGateProps {
  title?: string;
  subtitle?: string;
  message?: string;
  launchDate?: string;
  showNewsletter?: boolean;
  backgroundUrl?: string;
  projectName?: string;
  onUnlocked: () => void;
  onAdminLoginClick?: () => void;
}

export default function PasswordProtectionGate({
  title = "Private Salon & Boutique Showroom",
  subtitle = "BESPOKE CAPSULES · PRIVATE CLIENTELE ONLY",
  message = "We are currently preparing our exclusive Spring / Summer collection. Enter your client password below to unlock private showroom access.",
  launchDate,
  showNewsletter = true,
  backgroundUrl = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=85",
  projectName = "Jade Tailor",
  onUnlocked,
  onAdminLoginClick
}: PasswordProtectionGateProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  
  // Newsletter state
  const [email, setEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    if (!launchDate) return;

    const calculateTime = () => {
      const target = new Date(launchDate).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft(null);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [launchDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter the store password');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/developer-mode/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password.trim() })
      });

      const data = await res.json();
      if (res.ok && data.valid) {
        // Save unlock token
        sessionStorage.setItem('storefront_unlocked', 'true');
        if (data.token) {
          sessionStorage.setItem('storefront_unlock_token', data.token);
        }
        onUnlocked();
      } else {
        setError(data.error || 'Incorrect password. Please try again.');
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    } catch (_) {
      // Local fallback: default password is fashion2026
      if (password.trim() === 'fashion2026') {
        sessionStorage.setItem('storefront_unlocked', 'true');
        onUnlocked();
      } else {
        setError('Incorrect password. Please try again.');
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setNewsletterSubscribed(true);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 font-sans overflow-hidden bg-slate-950 text-white selection:bg-amber-400 selection:text-slate-950">
      {/* Background with luxury parallax feel & darkened gradient */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-10000"
        style={{ backgroundImage: `url('${backgroundUrl}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-900/80 backdrop-blur-sm" />
      
      {/* Subtle decorative grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}
      />

      {/* Main Glassmorphic Container */}
      <div className="relative z-10 w-full max-w-xl mx-auto text-center space-y-8 animate-fadeIn">
        {/* Brand Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-300 text-[10px] font-bold tracking-widest uppercase mb-1">
            <Lock className="w-3 h-3 text-amber-400" />
            <span>Private Access Mode</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white uppercase font-serif">
            {projectName}
          </h1>
          <p className="text-xs sm:text-sm font-semibold tracking-[0.25em] text-slate-400 uppercase">
            {subtitle}
          </p>
        </div>

        {/* Headline & Description Card */}
        <div className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
              {message}
            </p>
          </div>

          {/* Countdown Clock (if target date provided) */}
          {timeLeft && (
            <div className="pt-2 pb-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                Expected Public Launch
              </div>
              <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-sm mx-auto">
                {[
                  { label: 'DAYS', val: timeLeft.days },
                  { label: 'HOURS', val: timeLeft.hours },
                  { label: 'MINUTES', val: timeLeft.minutes },
                  { label: 'SECONDS', val: timeLeft.seconds }
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-950/70 border border-slate-800 rounded-xl p-2.5 sm:p-3 text-center">
                    <span className="block text-lg sm:text-2xl font-black text-white font-mono tracking-tight">
                      {String(item.val).padStart(2, '0')}
                    </span>
                    <span className="block text-[8px] sm:text-[9px] font-bold text-slate-400 tracking-wider">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Password Input Form */}
          <form onSubmit={handleSubmit} className={`space-y-4 pt-1 max-w-md mx-auto ${shake ? 'animate-shake' : ''}`}>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Enter client access password..."
                className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-4 py-3.5 pr-11 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all font-mono"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <div className="flex items-center justify-center gap-1.5 text-rose-400 text-xs font-semibold bg-rose-950/40 border border-rose-800/50 rounded-lg py-2 px-3">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-widest transition-all shadow-lg hover:shadow-amber-400/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Enter Storefront</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Newsletter / Early Access Waitlist */}
          {showNewsletter && (
            <div className="pt-4 border-t border-slate-800/80 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Don't have a password? Request VIP invite
              </span>

              {newsletterSubscribed ? (
                <div className="bg-emerald-950/50 border border-emerald-800/60 rounded-xl p-3 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>You're on the exclusive VIP guest list! We will notify you upon launch.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2 max-w-md mx-auto">
                  <div className="relative flex-1">
                    <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address..."
                      className="w-full bg-slate-950/70 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0"
                  >
                    Join Waitlist
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer Admin Switcher */}
        <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
          <span>Are you the store administrator?</span>
          <button
            type="button"
            onClick={onAdminLoginClick || (() => { window.location.href = '/admin-dashboard'; })}
            className="text-amber-400 hover:text-amber-300 font-bold underline transition-colors cursor-pointer"
          >
            Sign In to Admin Dashboard →
          </button>
        </div>
      </div>
    </div>
  );
}
