import React from 'react';

interface PlansCanOverlayProps {
  type: 'lite' | 'core' | 'pro' | 'ultimate' | string;
  className?: string;
}

export default function PlansCanOverlay({ type, className = '' }: PlansCanOverlayProps) {
  const lower = type.toLowerCase();

  // Garment count and style colors
  const count = lower.includes('ultimate') ? 8 : lower.includes('pro') ? 6 : lower.includes('core') ? 5 : 3;

  return (
    <div className={`relative h-32 w-full bg-transparent rounded-2xl flex items-center justify-center py-2 overflow-hidden ${className}`}>
      {/* Subtle Glow */}
      <div className="absolute inset-0 bg-radial-gradient from-slate-400/10 to-transparent pointer-events-none" />

      {/* Modern Fashion Capsule Visual Stack */}
      <div className="relative w-48 h-24 flex items-center justify-center">
        {/* Layer 1 - Folded Knit / Base */}
        <div 
          className="absolute bottom-2 w-36 h-10 rounded-lg bg-slate-800 border border-slate-700 shadow-md flex items-center justify-between px-3 transform -rotate-1 transition-transform group-hover:rotate-0"
        >
          <span className="text-[7px] font-bold tracking-widest text-slate-400 uppercase">HEAVYWEIGHT COTTON</span>
          <span className="text-[7px] font-mono text-emerald-400">450GSM</span>
        </div>

        {/* Layer 2 - Folded Tailoring */}
        <div 
          className="absolute bottom-5 w-32 h-10 rounded-lg bg-slate-100 border border-slate-300 shadow-lg flex items-center justify-between px-3 transform rotate-2 transition-transform group-hover:rotate-0"
        >
          <span className="text-[7px] font-bold tracking-widest text-slate-800 uppercase">VIRGIN WOOL</span>
          <span className="text-[7px] font-mono text-slate-600">STRUCTURE</span>
        </div>

        {/* Layer 3 - Top Atelier Capsule Card */}
        <div 
          className="absolute bottom-8 w-28 h-9 rounded-md bg-[#0F172A] border border-amber-500/60 shadow-xl flex items-center justify-between px-2.5 transform -rotate-2 transition-transform group-hover:rotate-0 z-10"
        >
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[8px] font-black tracking-widest text-white uppercase">CAPSULE</span>
          </div>
          <span className="text-[8px] font-black text-amber-400 tracking-wider uppercase">
            {count} PIECES
          </span>
        </div>
      </div>
    </div>
  );
}
