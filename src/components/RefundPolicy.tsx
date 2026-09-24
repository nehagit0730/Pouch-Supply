import React, { useState } from 'react';
import { RefreshCw, Clipboard, CheckCircle2, AlertTriangle, ShieldCheck, Mail, ShieldAlert, ArrowRight, Ban, FileText, Clock } from 'lucide-react';

interface RefundPolicyProps {
  onNavigate: (tab: string) => void;
}

export default function RefundPolicy({ onNavigate }: RefundPolicyProps) {
  const [activeTab, setActiveTab] = useState<number>(1);

  const policySections = [
    {
      id: 1,
      title: '1. Overview',
      icon: RefreshCw,
      content: (
        <div className="space-y-4">
          <p className="text-slate-650 leading-relaxed text-sm sm:text-base font-medium">
            At <strong className="text-slate-900 font-extrabold">Atelier Studio</strong>, we aim to provide exceptional artisanal garments and a seamless shopping experience. We offer straightforward 30-day returns and size exchanges on unworn items.
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex gap-3 text-slate-800">
            <CheckCircle2 className="h-5 w-5 text-slate-700 shrink-0 mt-0.5" />
            <p className="text-xs font-semibold leading-relaxed">
              By completing and checking out an order on our website, you agree to all terms and conditions set forth under this Return & Exchange Policy.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: '2. Returns Eligibility',
      icon: ShieldCheck,
      content: (
        <div className="space-y-4">
          <p className="text-slate-650 leading-relaxed text-sm">
            We accept returns and size exchanges under the following straightforward conditions:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { type: 'Size or Style Exchange', details: 'The garment does not fit as desired or you prefer an alternative colorway.' },
              { type: 'Damage or Defect on Arrival', details: 'A seam or fabric imperfection was detected upon initial unboxing.' },
              { type: 'Incorrect Item Received', details: 'The logistics courier dispatched items mismatched with your invoice.' }
            ].map((p, idx) => (
              <div key={idx} className="p-4 border rounded-xl bg-[#FAF9F6] space-y-1 hover:border-slate-300 transition-colors">
                <span className="block text-[10px] font-black uppercase text-slate-900 tracking-wider">CRITERIA {idx + 1}</span>
                <span className="block text-xs font-bold text-[#0F172A]">{p.type}</span>
                <span className="block text-[11px] text-slate-500 font-medium leading-relaxed">{p.details}</span>
              </div>
            ))}
          </div>

          <div className="border border-slate-150 rounded-xl p-4 space-y-2 bg-slate-50 text-xs font-bold text-slate-650">
            <span className="block text-[10px] uppercase font-black tracking-widest text-[#1E293B] border-b pb-1">Essential Return Standards</span>
            <ul className="space-y-1 list-disc pl-4 text-[11px] text-slate-500 font-semibold font-sans">
              <li>The garment must be strictly unworn, unwashed, and retain all original designer tags attached.</li>
              <li>Garments must remain free from perfume, makeup stains, alterations, or pet hair.</li>
              <li>You must initiate your return request within <strong className="text-slate-800 font-extrabold">30 days of delivery</strong>.</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: '3. Non-Returnable Items',
      icon: Ban,
      content: (
        <div className="space-y-3">
          <div className="bg-slate-50 border border-slate-200 p-4.5 rounded-2xl flex gap-3 text-slate-800">
            <ShieldAlert className="h-5 w-5 text-slate-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="block font-black text-xs uppercase tracking-wider text-slate-900">Non-Returnable Exceptions</span>
              <p className="text-xs font-semibold leading-relaxed text-slate-650">
                To maintain hygiene and fair atelier standards, we cannot accept returns for:
              </p>
            </div>
          </div>
          <div className="space-y-1.5 pl-1.5">
            {[
              { t: 'Worn or Washed Garments', d: 'Any clothing piece showing perfume scents, wear marks, or washed fibers.' },
              { t: 'Customized & Altered Pieces', d: 'Made-to-order tailored garments altered to personal measurements.' },
              { t: 'Final Archive Sale Items', d: 'Pieces purchased during clearance archive sales marked as final sale.' },
              { t: 'Intimates & Undergarments', d: 'Socks, base-layers, and intimates with removed protective packaging.' }
            ].map((exc, idx) => (
              <div key={idx} className="flex gap-2.5 items-start text-xs font-semibold">
                <span className="text-slate-500 mt-0.5 font-bold">•</span>
                <p className="text-slate-600">
                  <strong className="text-slate-900 font-extrabold">{exc.t}:</strong> {exc.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: '4. Refund Process',
      icon: Clipboard,
      content: (
        <div className="space-y-3">
          <p className="text-slate-650 text-xs sm:text-sm leading-relaxed">
            Upon receipt and quality inspection of your returned garments at our studio, we process refunds promptly:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            <div className="p-4 bg-slate-50 border rounded-2xl space-y-1">
              <span className="text-[10px] uppercase font-black tracking-widest text-emerald-600 block">Bank Gateway processing</span>
              <span className="text-base font-black text-slate-900 leading-none block">5–10 Business Days</span>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">Credits are immediately wire-refunded back to the original funding card. Speed relies entirely on your banking merchant guidelines.</p>
            </div>
            
            <div className="p-4 bg-slate-50 border rounded-2xl space-y-1">
              <span className="text-[10px] uppercase font-black tracking-widest text-[#4F46E5] block">Internal Alternative Schemes</span>
              <span className="text-base font-black text-slate-900 leading-none block">Express Credit / Exchange</span>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">At your request, we can issue an instant digital Store Credit or dispatch a factory compound replacement parcel directly.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: '5. Damaged or Mismatched Orders',
      icon: AlertTriangle,
      content: (
        <div className="space-y-3">
          <p className="text-slate-605 text-xs sm:text-sm leading-relaxed font-semibold">
            In the rare event of a factory packaging defect or shipping destruction, initiate a claim with our managers using the checklist below:
          </p>
          <div className="p-4 bg-[#FAF9F5] rounded-xl space-y-3 border border-slate-150">
            <div className="flex gap-2.5 items-start">
              <span className="p-1 rounded-lg bg-indigo-100 text-indigo-700 text-[10px] font-black h-5 w-5 flex items-center justify-center font-mono">1</span>
              <div>
                <span className="block text-xs font-bold text-slate-800 uppercase tracking-tight">Your Original Order ID</span>
                <span className="block text-[11px] text-slate-500 font-medium font-sans">For tracking order transaction logs.</span>
              </div>
            </div>
            <div className="flex gap-2.5 items-start">
              <span className="p-1 rounded-lg bg-slate-150 text-slate-900 text-[10px] font-black h-5 w-5 flex items-center justify-center font-mono">2</span>
              <div>
                <span className="block text-xs font-bold text-slate-800 uppercase tracking-tight">Photographic Documentation</span>
                <span className="block text-[11px] text-slate-500 font-medium font-sans">Clear images capturing the garment tags, seam defect or incorrect colorway/size.</span>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-slate-450 italic">
            * Our concierge team reviews exchange and return requests within 24 business hours.
          </p>
        </div>
      )
    },
    {
      id: 6,
      title: '6. Order Cancellations',
      icon: Clock,
      content: (
        <div className="space-y-3">
          <p className="text-slate-650 text-xs sm:text-sm leading-relaxed">
            Our fulfillment center operates quickly to dispatch garments on schedule. Order modification parameters:
          </p>
          <div className="bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A] p-4 rounded-xl text-xs font-semibold space-y-1.5 leading-relaxed">
            <p className="font-extrabold uppercase text-[10px] tracking-wider text-amber-900">Pre-Fulfillment Changes</p>
            <p>Orders can only be modified or cancelled if they have not yet been packed or assigned a tracking label.</p>
            <p>Once a shipment has departed our studio, please allow the parcel to arrive and request a complimentary exchange or return through our portal.</p>
          </div>
        </div>
      )
    },
    {
      id: 7,
      title: '7. Shipping Cost Policies',
      icon: FileText,
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-650 leading-relaxed font-semibold">
          <p>
            Excepting scenarios where we acknowledge incorrect or defective garment shipments:
          </p>
          <ul className="space-y-1.5 pl-4 list-disc text-xs text-slate-550 font-medium font-sans">
            <li>Primary priority shipping fees are non-refundable once courier service has executed transit.</li>
            <li>We offer pre-paid return labels for size exchanges on all domestic orders.</li>
            <li>For standard returns, return postage can be deducted directly from your refund amount.</li>
          </ul>
        </div>
      )
    },
    {
      id: 8,
      title: '8. Refused or Uncollected Parcels',
      icon: ShieldAlert,
      content: (
        <div className="space-y-3">
          <p className="text-slate-650 text-xs sm:text-sm leading-relaxed">
            If you reject parcel delivery or fail to collect a package from a local carrier depot:
          </p>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 leading-relaxed space-y-1">
            <span className="block font-black text-[10px] tracking-wider uppercase text-slate-900">Return Transit Processing</span>
            <p className="text-slate-600">Upon system return check-in of a rejected box, courier processing charges will be deducted from your final refund balance.</p>
          </div>
        </div>
      )
    },
    {
      id: 9,
      title: '9. Atelier Concierge Desk',
      icon: Mail,
      content: (
        <div className="p-5 bg-slate-900 text-white rounded-2xl space-y-4">
          <div>
            <span className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Direct Claims Inbound</span>
            <h4 className="text-lg font-black text-white leading-none">Atelier Concierge Desk</h4>
          </div>

          <p className="text-slate-300 text-xs leading-relaxed font-semibold">
            Our client support team handles size exchanges and return inquiries with complete care. Please specify your order number in your message.
          </p>
          
          <div className="text-xs font-mono text-slate-300 font-bold">
            Email: <a href="mailto:concierge@atelier-studio.com" className="underline hover:text-white">concierge@atelier-studio.com</a>
          </div>

          <div className="pt-2 border-t border-slate-800 flex gap-2">
            <button
              onClick={() => onNavigate('contact')}
              className="bg-white text-slate-900 hover:bg-slate-100 font-black text-xs px-4 py-2.5 rounded-xl transition cursor-pointer uppercase tracking-wider"
            >
              Contact Concierge
            </button>
            <button
              onClick={() => onNavigate('frontend-shop')}
              className="bg-white/10 hover:bg-white/15 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer"
            >
              Explore Collection
            </button>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-10 font-sans text-slate-800 animate-fade-in animate-duration-300">
      
      {/* Decorative top micro layout row */}
      <div className="h-1 bg-gradient-to-r from-pink-500 via-rose-500 to-indigo-650" />

      {/* Header Area */}
      <div className="bg-slate-900 text-white py-8 px-4 border-b border-slate-800 relative overflow-hidden">
        {/* Background ambient accents */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-pink-505/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-12 bottom-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-6xl mx-auto space-y-4 relative z-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 bg-pink-500/20 border border-pink-400/25 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-pink-400">
            <RefreshCw className="h-3 w-3 text-pink-400" />
            <span>Guaranteed Product Quality Audit</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            Exchange & Refund Policy
          </h1>

          <div className="flex flex-col sm:flex-row items-center gap-4 text-slate-400 text-xs sm:text-sm font-medium pt-1">
            <span className="flex items-center gap-1.5 justify-center">
              <Clock className="h-4 w-4 text-slate-500" />
              Effective Date: <strong className="text-white">June 20, 2026</strong>
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="flex items-center gap-1.5 justify-center">
              <ShieldCheck className="h-4 w-4 text-slate-500" />
              Restocking Safeguard: <strong className="text-white">Secure Auditing</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sticky Anchor Navigation for desktop */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 space-y-4 hidden lg:block">
            <div className="p-4 border border-slate-150 rounded-2xl bg-[#FAF9F5] space-y-3 shadow-xs">
              <span className="text-[10px] uppercase font-black tracking-widest text-slate-450 block border-b pb-2">Refund Sections</span>
              
              <div className="space-y-1">
                {policySections.map((sec) => {
                  const IconComponent = sec.icon;
                  const isActive = activeTab === sec.id;
                  return (
                    <a
                      key={sec.id}
                      href={`#refund-section-${sec.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab(sec.id);
                        const el = document.getElementById(`refund-section-${sec.id}`);
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                      }}
                      className={`flex items-center gap-2.5 p-2 rounded-xl text-xs font-extrabold uppercase transition-all duration-300 ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-sm translate-x-1'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <IconComponent className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span className="truncate">{sec.title}</span>
                    </a>
                  );
                })}
              </div>

              <div className="pt-2 border-t text-center">
                <button
                  onClick={() => onNavigate('frontend-shop')}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black uppercase text-[10px] tracking-wider py-2.5 rounded-xl cursor-pointer transition shadow-xs flex items-center justify-center gap-1.5"
                >
                  Return to Store <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Detailed Sections Panel */}
          <div className="col-span-1 lg:col-span-8 space-y-8">
            
            {/* Quick Summary card box */}
            <div className="border border-slate-200 rounded-[22px] bg-slate-50 p-5 sm:p-6 space-y-3 shadow-xs">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 bg-white py-0.5 px-2.5 rounded-full inline-block border border-slate-200">CLIENT PROMISE</span>
              <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">Simple Exchanges & Curated Quality</h3>
              <p className="text-slate-655 text-xs sm:text-sm font-medium leading-relaxed">
                Every garment is crafted to uncompromising quality benchmarks. If a style or fit doesn't meet your expectations, we provide simple size exchanges and full refunds on items returned in unworn condition within 30 days.
              </p>
            </div>

            {/* Individual detailed refund policy cards */}
            <div className="space-y-6">
              {policySections.map((sec) => {
                const IconComponent = sec.icon;
                const isActive = activeTab === sec.id;
                return (
                  <section
                    key={sec.id}
                    id={`refund-section-${sec.id}`}
                    onMouseEnter={() => setActiveTab(sec.id)}
                    className={`border rounded-2xl md:rounded-[24px] bg-white p-5 sm:p-6 md:p-8 space-y-4 transition-all duration-300 ${
                      isActive 
                        ? 'border-slate-400 outline-none ring-1 ring-slate-400/50 shadow-md' 
                        : 'border-slate-150 hover:border-slate-205 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                      <span className={`p-2 rounded-xl border shrink-0 transition-colors ${
                        isActive 
                          ? 'bg-slate-900 border-slate-900 text-white' 
                          : 'bg-slate-50 border-slate-100 text-slate-450'
                      }`}>
                        <IconComponent className="h-5 w-5" />
                      </span>
                      <h3 className="text-base sm:text-lg font-black text-slate-800 uppercase tracking-tight font-sans">
                        {sec.title}
                      </h3>
                    </div>

                    <div className="pt-1">
                      {sec.content}
                    </div>
                  </section>
                );
              })}
            </div>

            {/* Bottom Support Call to Action Box */}
            <div className="bg-[#FAF9F5] border border-slate-205 rounded-[22px] p-6 text-center space-y-4">
              <div className="max-w-md mx-auto space-y-1">
                <span className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">Need a Size Exchange?</span>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  We maintain swift response records. If you need an alternative size or fitting advice, reach out to our concierge team.
                </p>
              </div>
              <button
                onClick={() => onNavigate('contact')}
                className="bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase px-6 py-3 rounded-xl transition cursor-pointer shadow-sm tracking-wider font-semibold"
              >
                Request Size Exchange
              </button>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
