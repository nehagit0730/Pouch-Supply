import React, { useState } from 'react';
import { FileText, UserCheck, ShieldAlert, BadgeCheck, DollarSign, Eye, Truck, RefreshCw, Lock, AlertTriangle, Shield, RefreshCcw, Mail, ArrowRight, BookOpen, Clock } from 'lucide-react';

interface TermsConditionsProps {
  onNavigate: (tab: string) => void;
}

export default function TermsConditions({ onNavigate }: TermsConditionsProps) {
  const [activeTab, setActiveTab] = useState<number>(1);

  const termChapters = [
    {
      id: 1,
      title: '1. General',
      icon: BookOpen,
      content: (
        <div className="space-y-4">
          <p className="text-slate-650 leading-relaxed text-sm sm:text-base font-medium">
            Welcome to <strong className="text-slate-900 font-extrabold">Atelier Studio</strong>. By accessing, browsing, or utilizing this website, you explicitly consent to comply with and be bound by the following Terms & Conditions. These comprehensive terms govern all transactions, orders, and interactions executed through our platform.
          </p>
          <div className="bg-[#FAF9F5] border border-slate-150 p-4 rounded-xl text-xs font-semibold leading-relaxed text-slate-650">
            By issuing payments and finalizing checkouts on this store, you confirm that you have read, understood, and accepted these Terms, as well as our concurrent processing of personal information documented inside our <span onClick={() => onNavigate('privacy-policy')} className="text-slate-900 underline cursor-pointer hover:text-slate-700 font-bold">Privacy Policy</span>.
          </div>
          <p className="text-xs text-slate-500 font-medium">
            We reserve the right to update or adjust these terms at discretionary intervals. Any updates take effect immediately upon their publication on this page.
          </p>
        </div>
      )
    },
    {
      id: 2,
      title: '2. Eligibility & Account',
      icon: UserCheck,
      content: (
        <div className="space-y-4">
          <div className="bg-slate-50 border border-slate-200 p-4.5 rounded-2xl flex gap-3 text-slate-800">
            <BadgeCheck className="h-5 w-5 text-slate-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="block font-black text-xs uppercase tracking-wider text-slate-900">Account Eligibility</span>
              <p className="text-xs font-semibold leading-relaxed text-slate-650">
                You must possess the legal capacity to enter into binding contracts to make purchases on Atelier.
              </p>
            </div>
          </div>
          
          <div className="space-y-2 text-slate-650 text-xs sm:text-sm font-medium leading-relaxed">
            <p>By browsing this store or committing purchases, you declare that:</p>
            <ul className="space-y-1.5 pl-4 list-disc text-xs text-slate-550 font-sans">
              <li>All payment and contact information provided during checkout is authentic and accurate.</li>
              <li>You are authorized to utilize the specified credit card or alternative payment instruments.</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: '3. Orders & Agreement',
      icon: BadgeCheck,
      content: (
        <div className="space-y-3">
          <p className="text-slate-650 text-xs sm:text-sm leading-relaxed">
            Upon submitting checkout variables, you will automatically receive an automated order receipt email.
          </p>
          <div className="p-4 bg-slate-50 border border-[#E2E8F0] rounded-xl text-xs font-semibold text-slate-600 leading-relaxed">
            <p className="text-slate-800 font-extrabold uppercase text-[10px] tracking-wider mb-1">Contractual Formation Threshold</p>
            This initial communication confirms reception of order variables only and is not a guarantee of transaction acceptance. A formal binding sales agreement is established strictly when the parcel passes quality inspection at our atelier and is officially <strong className="text-slate-950">dispatched to the shipping carrier</strong>.
          </div>
          <p className="text-slate-650 text-xs leading-relaxed font-semibold">
            We retain rights to limit order quantities or cancel transactions suspected of commercial resale, bulk bot automation, or payment discrepancies.
          </p>
        </div>
      )
    },
    {
      id: 4,
      title: '4. Garment Care & Craftsmanship',
      icon: AlertTriangle,
      content: (
        <div className="space-y-3">
          <p className="text-slate-650 text-xs sm:text-sm leading-relaxed">
            Each garment and curated capsule piece is designed and tailored with premium natural fibers and artisanal textiles.
          </p>
          
          <div className="border border-slate-200 bg-slate-50 rounded-xl p-4 text-slate-800 text-xs leading-relaxed space-y-1.5 font-sans font-semibold">
            <p className="font-black text-[10px] tracking-wider uppercase text-slate-900">Fabric Care Guidelines</p>
            <p>Natural cottons, virgin wools, and fine silks require respectful laundering. Please follow all sewn care labels, wash in cold cycles or dry clean as specified to maintain structural integrity.</p>
            <p>Slight shade variations in naturally-dyed textiles are natural hallmarks of authentic artisanal processing.</p>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: '5. Pricing & Payments',
      icon: DollarSign,
      content: (
        <div className="space-y-4">
          <p className="text-slate-650 text-xs sm:text-sm leading-relaxed">
            All prices declared on the storefront reflect direct formulation laboratory rates and include regional VAT/tax matrices where legally mandatory:
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {[
              { t: 'Dynamic Charge Adjustments', d: 'We reserve full rights to adjust container prices at any point to mirror international supplier costs.' },
              { t: 'Excluding Shipping Tariffs', d: 'Dispatch fees are calculated at checkout and presented clearly inside your terminal order manifest.' },
              { t: 'Clerical Price Glitches', d: 'In the event of database errors, we maintain full rights to void purchases transacted at incorrect rates.' },
              { t: 'Secured Gateways Only', d: 'All payments must be completed via our certified, tokenized SSL processing systems before packing begins.' }
            ].map((rule, idx) => (
              <div key={idx} className="p-3 bg-[#FAF9F6] border rounded-xl space-y-0.5">
                <span className="block text-xs font-bold text-slate-800 uppercase tracking-tight">{rule.t}</span>
                <span className="block text-[11px] text-slate-500 font-medium leading-relaxed">{rule.d}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: '6. Age Verification Checks',
      icon: Shield,
      content: (
        <div className="space-y-3">
          <p className="text-slate-650 text-xs sm:text-sm leading-relaxed">
            By locking in checkout options, you authorize our platform to execute compliance verification sweeps:
          </p>
          <div className="p-4 border border-dashed rounded-xl space-y-2 text-xs font-semibold text-slate-605">
            <p>1. We utilize privacy-compliant background screening suites or direct photo ID handshakes to verify that you are at least 18 years of age.</p>
            <p>2. If verification is returned with discrepancies, we will hold package dispatch, request manual ledger uploads, and cancel the transaction if compliance is not acquired within 7 days.</p>
            <p className="text-rose-650 font-bold border-t pt-1.5">Falsifying your birth index or presenting forged documents is a punishable statutory offense and may result in immediate security reports to consumer protection registries.</p>
          </div>
        </div>
      )
    },
    {
      id: 7,
      title: '7. Delivery Parameters',
      icon: Truck,
      content: (
        <div className="space-y-3">
          <p className="text-slate-650 text-xs sm:text-sm leading-relaxed">
            We operate in concert with priority courier services to dispatch your garments securely. Please observe the following operational rules:
          </p>
          <ul className="space-y-1.5 text-xs text-slate-600 pl-4 list-disc font-medium font-sans">
            <li>Dispatch estimations represent calendar guidelines and are not contractual guarantees.</li>
            <li>We cannot assume logistical liabilities for delayed routes caused by carrier disruptions or customs inspections.</li>
            <li>Loss or delivery errors resulting from inaccurate postal entries entered at check-out remain the customer’s financial responsibility.</li>
          </ul>
        </div>
      )
    },
    {
      id: 8,
      title: '8. Returns & Exchanges',
      icon: RefreshCw,
      content: (
        <div className="space-y-3">
          <p className="text-slate-650 text-sm leading-relaxed">
            We offer 30-day returns and size exchanges on unworn garments with all tags intact:
          </p>
          <p className="text-xs text-slate-500 font-semibold bg-slate-50 p-3 rounded-lg border">
            Review our complete <span onClick={() => onNavigate('refund-policy')} className="text-slate-900 underline cursor-pointer hover:text-slate-700 font-bold">Return & Exchange Policy</span> for guidelines on initiating a size exchange or store return.
          </p>
        </div>
      )
    },
    {
      id: 9,
      title: '9. Account Protection Responsibility',
      icon: Lock,
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-650 leading-relaxed font-semibold">
          <p>
            If you create an active member account on Atelier:
          </p>
          <ul className="space-y-1 pl-4 list-disc text-xs text-slate-550 font-medium font-sans">
            <li>You accept sole responsibility for shielding your passcode, email links, and transaction tokens from third parties.</li>
            <li>You ensure that all address data, billing indicators, and phone numbers are kept current.</li>
            <li>Our support platform is exempt from any financial or data loss resulting from unauthorized logins or password leakages.</li>
          </ul>
        </div>
      )
    },
    {
      id: 10,
      title: '10. Limitation of Liability',
      icon: ShieldAlert,
      content: (
        <div className="space-y-3">
          <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 space-y-4">
            <h4 className="text-xs font-black uppercase text-amber-400 tracking-widest flex items-center gap-1.5 font-mono">
              <span className="h-2 w-2 bg-amber-400 rounded-full inline-block" />
              LIABILITY LIMITATION
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-semibold font-sans">
              To the maximum extent permitted by law, Atelier Studio and its fulfillment partners shall not be held liable for indirect, incidental, or consequential damages resulting from product use beyond the total purchase price paid for the affected goods.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 11,
      title: '11. Privacy Integration',
      icon: Eye,
      content: (
        <div className="space-y-4">
          <p className="text-slate-650 text-xs sm:text-sm leading-relaxed">
            All user registration details, financial checkout data, and browsing cookies are processed strictly as outlined within our active privacy disclosures.
          </p>
          <button
            onClick={() => onNavigate('privacy-policy')}
            className="inline-flex items-center gap-1 text-xs text-slate-900 hover:text-slate-700 font-bold hover:underline"
          >
            Review our active Privacy Policy <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      )
    },
    {
      id: 12,
      title: '12. Continuous Terms Tuning',
      icon: RefreshCw,
      content: (
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
          We preserve rights to calibrate or adjust any aspect of these Terms & Conditions without prior broadcast. Your continuous interaction with the Atelier platform following changes asserts your binding acceptance of renewed conditions.
        </p>
      )
    },
    {
      id: 13,
      title: '13. Atelier Concierge & Legal Desk',
      icon: Mail,
      content: (
        <div className="p-5 bg-[#FAF9F5] border border-slate-155 rounded-2xl space-y-3.5">
          <div>
            <span className="block text-[10px] font-black uppercase text-slate-900 tracking-wider mb-1">Contractual Registry Division</span>
            <h4 className="text-base font-black text-slate-900 leading-none font-sans">Atelier Concierge Desk</h4>
          </div>

          <p className="text-xs text-slate-500 font-medium leading-normal">
            For questions mapping these Terms, sizing queries, or commercial requests, route communication to:
          </p>
          
          <div className="text-xs font-bold text-slate-900">
            Email: <a href="mailto:concierge@atelier-studio.com" className="underline font-mono">concierge@atelier-studio.com</a>
          </div>

          <div className="pt-2 border-t border-slate-150 flex gap-2">
            <button
              onClick={() => onNavigate('contact')}
              className="bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase px-4 py-2 rounded-xl transition cursor-pointer tracking-wider"
            >
              Access Contact Desk
            </button>
            <button
              onClick={() => onNavigate('frontend-shop')}
              className="bg-white hover:bg-slate-50 border border-slate-205 text-slate-700 font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer"
            >
              Browse Shop
            </button>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-10 font-sans text-slate-800 animate-fade-in animate-duration-300">
      
      {/* Decorative top micro layout row */}
      <div className="h-1 bg-gradient-to-r from-teal-500 via-indigo-605 to-pink-500" />

      {/* Header Area */}
      <div className="bg-slate-900 text-white py-8 px-4 border-b border-slate-800 relative overflow-hidden">
        {/* Background ambient accents */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-550/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-12 bottom-0 w-64 h-64 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-6xl mx-auto space-y-4 relative z-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 bg-slate-850 border border-white/10 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-indigo-400">
            <FileText className="h-3 w-3 text-indigo-400" />
            <span>Statutory Purchasing Covenant</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            Terms & Conditions Agreement
          </h1>

          <div className="flex flex-col sm:flex-row items-center gap-4 text-slate-400 text-xs sm:text-sm font-medium pt-1">
            <span className="flex items-center gap-1.5 justify-center">
              <Clock className="h-4 w-4 text-slate-500" />
              Effective Date: <strong className="text-white">June 20, 2026</strong>
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="flex items-center gap-1.5 justify-center">
              <Lock className="h-4 w-4 text-slate-500" />
              Access Classification: <strong className="text-white">Public Standard</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sticky Anchor Navigation for desktop */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 space-y-4 hidden lg:block">
            <div className="p-4 border border-slate-150 rounded-2xl bg-[#FAF9F5] space-y-3 shadow-xs font-sans">
              <span className="text-[10px] uppercase font-black tracking-widest text-slate-450 block border-b pb-2">Agreement Chapters</span>
              
              <div className="space-y-1">
                {termChapters.map((sec) => {
                  const IconComponent = sec.icon;
                  const isActive = activeTab === sec.id;
                  return (
                    <a
                      key={sec.id}
                      href={`#terms-section-${sec.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab(sec.id);
                        const el = document.getElementById(`terms-section-${sec.id}`);
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
                  Explore Collection <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Detailed Sections Panel */}
          <div className="col-span-1 lg:col-span-8 space-y-8">
            
            {/* Storefront standard notice */}
            <div className="border border-slate-200 rounded-[22px] bg-slate-50 p-5 sm:p-6 space-y-3 shadow-xs">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 bg-white py-0.5 px-2.5 rounded-full inline-block border border-slate-200">TERMS OVERVIEW</span>
              <p className="text-slate-900 text-xs sm:text-sm font-extrabold uppercase tracking-tight leading-normal">
                "Craftsmanship, Transparency, and Elevated Wardrobe Staples."
              </p>
              <p className="text-slate-655 text-xs font-medium leading-relaxed">
                By entering or processing transactional purchases on Atelier Studio, you acknowledge that all orders are subject to availability, quality fulfillment standards, and our terms of sale.
              </p>
            </div>

            {/* Individual detailed terms segments */}
            <div className="space-y-6">
              {termChapters.map((sec) => {
                const IconComponent = sec.icon;
                const isActive = activeTab === sec.id;
                return (
                  <section
                    key={sec.id}
                    id={`terms-section-${sec.id}`}
                    onMouseEnter={() => setActiveTab(sec.id)}
                    className={`border rounded-2xl md:rounded-[24px] bg-white p-5 sm:p-6 md:p-8 space-y-4 transition-all duration-300 ${
                      isActive 
                        ? 'border-indigo-200 outline-none ring-1 ring-indigo-200/50 shadow-md' 
                        : 'border-slate-150 hover:border-slate-205 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                      <span className={`p-2 rounded-xl border shrink-0 transition-colors ${
                        isActive 
                          ? 'bg-indigo-50 border-indigo-100 text-indigo-650' 
                          : 'bg-slate-50 border-slate-100 text-slate-450'
                      }`}>
                        <IconComponent className="h-5 w-5" />
                      </span>
                      <h3 className="text-base sm:text-lg font-black text-slate-800 uppercase tracking-tight font-sans">
                        {sec.title}
                      </h3>
                    </div>

                    <div className="pt-1 font-sans">
                      {sec.content}
                    </div>
                  </section>
                );
              })}
            </div>

            {/* Bottom Support Call to Action Box */}
            <div className="bg-[#FAF9F5] border border-slate-205 rounded-[22px] p-6 text-center space-y-4">
              <div className="max-w-md mx-auto space-y-1">
                <span className="text-lg sm:text-xl font-bold text-slate-900 leading-tight block">Required further terms clarification?</span>
                <p className="text-xs sm:text-sm text-slate-500 font-medium font-sans">
                  Our regulatory compliance desk maintains full availability to clarify operational mandates. Contact our legal auditors directly.
                </p>
              </div>
              <button
                onClick={() => onNavigate('contact')}
                className="bg-indigo-650 hover:bg-indigo-750 text-white font-black text-xs uppercase px-6 py-3 rounded-xl transition cursor-pointer shadow-sm tracking-wider"
              >
                Inquire Compliance Desk
              </button>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
