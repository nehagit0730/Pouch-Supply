import React, { useState, useEffect } from 'react';
import { 
  Code, Shield, Key, Eye, EyeOff, Save, Check, RefreshCw, AlertCircle, Copy, 
  ExternalLink, Sparkles, Download, Upload, Trash2, Globe, Database, Cloud, 
  Mail, Cpu, Play, Terminal, Layers, HelpCircle, Lock, Unlock, CheckCircle2,
  Settings, ChevronRight, Zap, ArrowRight, Laptop, Sliders
} from 'lucide-react';
import ImageUploadInput from './ImageUploadInput';
import PasswordProtectionGate from './PasswordProtectionGate';

interface DevSettings {
  customCssEnabled: boolean;
  customCss: string;
  customJsEnabled: boolean;
  customJs: string;
  siteProtectionMode: 'live' | 'password_protected';
  storePassword: string;
  comingSoonTitle: string;
  comingSoonSubtitle: string;
  comingSoonMessage: string;
  comingSoonLaunchDate: string;
  comingSoonShowNewsletter: boolean;
  comingSoonShowSocials: boolean;
  comingSoonBackgroundUrl: string;
  apiKeys: {
    cloudinaryUrl?: string;
    cloudinaryCloudName?: string;
    cloudinaryApiKey?: string;
    cloudinaryApiSecret?: string;
    databaseUrl?: string;
    razorpayKeyId?: string;
    razorpayKeySecret?: string;
    razorpayWebhookSecret?: string;
    emailHost?: string;
    emailPort?: string;
    emailUser?: string;
    emailPass?: string;
    emailFrom?: string;
    geminiApiKey?: string;
    googleAnalyticsId?: string;
    metaPixelId?: string;
    klaviyoPublicKey?: string;
    appUrl?: string;
    projectName?: string;
  };
  debugConsoleLogs: boolean;
  maintenanceBypassAdmins: boolean;
}

export default function DevelopmentModePanel() {
  const [activeSubTab, setActiveSubTab] = useState<'scripts' | 'protection' | 'apikeys' | 'diagnostics'>('scripts');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Settings State
  const [settings, setSettings] = useState<DevSettings>({
    customCssEnabled: true,
    customCss: '',
    customJsEnabled: true,
    customJs: '',
    siteProtectionMode: 'live',
    storePassword: 'fashion2026',
    comingSoonTitle: "Private Salon & Boutique Showroom",
    comingSoonSubtitle: "BESPOKE CAPSULES · PRIVATE CLIENTELE ONLY",
    comingSoonMessage: "We are currently preparing our exclusive Spring / Summer collection. Enter your client password below to unlock private showroom access.",
    comingSoonLaunchDate: "2026-11-01T00:00:00Z",
    comingSoonShowNewsletter: true,
    comingSoonShowSocials: true,
    comingSoonBackgroundUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=85",
    apiKeys: {},
    debugConsoleLogs: false,
    maintenanceBypassAdmins: true
  });

  // Secrets visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({});

  // Testing states
  const [testResults, setTestResults] = useState<{ [key: string]: { loading?: boolean; success?: boolean; message?: string; error?: string } }>({});

  // Preview Modal
  const [showComingSoonPreview, setShowComingSoonPreview] = useState(false);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/developer-mode');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (err: any) {
      console.warn('[DevMode] Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (customPayload?: Partial<DevSettings>) => {
    setSaving(true);
    try {
      const toSave = customPayload ? { ...settings, ...customPayload } : settings;
      const res = await fetch('/api/developer-mode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toSave)
      });

      if (res.ok) {
        const data = await res.json();
        triggerToast('✓ Development mode settings saved and synced!');
        if (data.data) {
          setSettings(data.data);
        }
        // Broadcast custom css/js change to storefront
        window.dispatchEvent(new CustomEvent('devmode-settings-updated', { detail: toSave }));
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (err: any) {
      triggerToast('⚠ Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleTestKey = async (service: 'cloudinary' | 'database' | 'razorpay' | 'email' | 'gemini', config?: any) => {
    setTestResults(prev => ({ ...prev, [service]: { loading: true } }));
    try {
      const res = await fetch('/api/developer-mode/test-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service, config })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTestResults(prev => ({
          ...prev,
          [service]: { loading: false, success: true, message: data.message }
        }));
      } else {
        setTestResults(prev => ({
          ...prev,
          [service]: { loading: false, success: false, error: data.error || 'Connection failed' }
        }));
      }
    } catch (err: any) {
      setTestResults(prev => ({
        ...prev,
        [service]: { loading: false, success: false, error: err.message || 'Test failed' }
      }));
    }
  };

  const handleInsertCssSnippet = (snippet: string) => {
    setSettings(prev => ({
      ...prev,
      customCss: (prev.customCss ? prev.customCss + '\n\n' : '') + snippet
    }));
    triggerToast('Added CSS snippet to editor');
  };

  const handleInsertJsSnippet = (snippet: string) => {
    setSettings(prev => ({
      ...prev,
      customJs: (prev.customJs ? prev.customJs + '\n\n' : '') + snippet
    }));
    triggerToast('Added JavaScript snippet to editor');
  };

  const handleExportProject = async () => {
    try {
      window.location.href = '/api/developer-mode/export';
      triggerToast('Downloading project configuration backup (.json)...');
    } catch (err: any) {
      triggerToast('Export failed: ' + err.message);
    }
  };

  const handleImportProject = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        const res = await fetch('/api/developer-mode/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(parsed)
        });
        const data = await res.json();
        if (res.ok && data.success) {
          triggerToast('✓ Project configuration imported successfully!');
          loadSettings();
        } else {
          throw new Error(data.error || 'Import failed');
        }
      } catch (err: any) {
        alert('Failed to parse and import project configuration: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const toggleShowKey = (k: string) => {
    setShowKeys(prev => ({ ...prev, [k]: !prev[k] }));
  };

  const generateRandomPassword = () => {
    const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
    let pass = 'jade-';
    for (let i = 0; i < 6; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setSettings(prev => ({ ...prev, storePassword: pass }));
    triggerToast(`Generated password: ${pass}`);
  };

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3">
        <div className="w-8 h-8 border-3 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Loading Developer Environment...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans text-slate-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-950 text-white border border-slate-700 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold font-mono animate-fadeIn">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-indigo-900/30 via-slate-800/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Terminal className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                Administrator Developer Console
              </span>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Live Server
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Development Mode & Multi-Project Whitelabel
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Inject working custom CSS & JavaScript, switch between Live and Password Protected coming-soon mode, and configure all API keys so anyone can rebrand and launch for their own project.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleExportProject}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Export complete configuration for cloning to another project"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Config</span>
            </button>

            <label className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Import Config</span>
              <input type="file" accept=".json" onChange={handleImportProject} className="hidden" />
            </label>

            <button
              type="button"
              onClick={() => handleSave()}
              disabled={saving}
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
            </button>
          </div>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800/80 overflow-x-auto">
          {[
            { id: 'scripts', label: 'Custom CSS & JavaScript', icon: Code },
            { id: 'protection', label: 'Website Status & Password Gate', icon: Lock, badge: settings.siteProtectionMode === 'password_protected' ? 'Private' : 'Live' },
            { id: 'apikeys', label: 'API Keys & Multi-Project Setup', icon: Key },
            { id: 'diagnostics', label: 'System Health & Tools', icon: Cpu }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                    tab.badge === 'Private' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* SUBTAB 1: SCRIPTS & CUSTOM CODE */}
      {activeSubTab === 'scripts' && (
        <div className="space-y-6">
          {/* Quick Notice Card */}
          <div className="bg-indigo-50/70 border border-indigo-150 rounded-xl p-4 flex items-start gap-3">
            <Zap className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
            <div className="text-xs text-indigo-950 space-y-0.5">
              <span className="font-bold">Real-time Frontend Injection Active</span>
              <p className="text-indigo-900/80 leading-relaxed">
                Code written here is compiled and injected dynamically across all storefront pages without rebuilding the application. Perfect for custom typography, luxury animations, tracking tags, and bespoke styling overrides.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1. CUSTOM CSS BLOCK */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded bg-indigo-100 text-indigo-700 font-mono font-bold text-[10px]">CSS</span>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">Custom CSS Stylesheet</h3>
                    <p className="text-[10px] text-slate-500">Injected into storefront &lt;head&gt; style tag</p>
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-[10px] font-bold text-slate-600">
                    {settings.customCssEnabled ? 'Active' : 'Disabled'}
                  </span>
                  <input
                    type="checkbox"
                    checked={settings.customCssEnabled}
                    onChange={(e) => setSettings(prev => ({ ...prev, customCssEnabled: e.target.checked }))}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                </label>
              </div>

              {/* Quick Snippets Bar */}
              <div className="p-2.5 bg-slate-100/70 border-b border-slate-200/60 flex items-center gap-1.5 overflow-x-auto text-[10px]">
                <span className="text-slate-400 font-bold uppercase text-[9px] px-1">Snippets:</span>
                <button
                  type="button"
                  onClick={() => handleInsertCssSnippet(`/* Luxury Typography Override */\nbody, .font-serif {\n  letter-spacing: -0.01em;\n  text-rendering: optimizeLegibility;\n}`)}
                  className="px-2 py-0.5 bg-white border border-slate-200 hover:border-indigo-400 rounded text-slate-700 font-medium hover:text-indigo-600 transition-colors whitespace-nowrap cursor-pointer"
                >
                  + Luxury Typography
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertCssSnippet(`/* Gold Highlight Accent */\n.luxury-gold-button {\n  background: linear-gradient(135deg, #d4af37, #aa7c11) !important;\n  color: #fff !important;\n  box-shadow: 0 4px 14px rgba(212, 175, 55, 0.3);\n}`)}
                  className="px-2 py-0.5 bg-white border border-slate-200 hover:border-indigo-400 rounded text-slate-700 font-medium hover:text-indigo-600 transition-colors whitespace-nowrap cursor-pointer"
                >
                  + Gold Button
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertCssSnippet(`/* Glassmorphism Header */\nheader, nav {\n  backdrop-filter: blur(12px) !important;\n  background-color: rgba(255, 255, 255, 0.85) !important;\n}`)}
                  className="px-2 py-0.5 bg-white border border-slate-200 hover:border-indigo-400 rounded text-slate-700 font-medium hover:text-indigo-600 transition-colors whitespace-nowrap cursor-pointer"
                >
                  + Glass Header
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertCssSnippet(`/* Dark Mode Tint */\nbody {\n  background-color: #0b0f17 !important;\n  color: #f1f5f9 !important;\n}`)}
                  className="px-2 py-0.5 bg-white border border-slate-200 hover:border-indigo-400 rounded text-slate-700 font-medium hover:text-indigo-600 transition-colors whitespace-nowrap cursor-pointer"
                >
                  + Dark Canvas
                </button>
              </div>

              {/* Code Editor Area */}
              <div className="relative flex-1 bg-slate-950 p-3">
                <textarea
                  value={settings.customCss}
                  onChange={(e) => setSettings(prev => ({ ...prev, customCss: e.target.value }))}
                  placeholder="/* Write custom CSS rules here... */"
                  rows={16}
                  className="w-full h-full bg-transparent font-mono text-xs text-emerald-400 focus:outline-none resize-y selection:bg-emerald-900 selection:text-white leading-relaxed"
                  spellCheck={false}
                />
              </div>

              <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-400 font-mono">
                  {settings.customCss.length} characters · {settings.customCss.split('\n').length} lines
                </span>
                <button
                  type="button"
                  onClick={() => handleSave()}
                  disabled={saving}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Save className="w-3 h-3" />
                  <span>Apply CSS</span>
                </button>
              </div>
            </div>

            {/* 2. CUSTOM JAVASCRIPT BLOCK */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded bg-amber-100 text-amber-700 font-mono font-bold text-[10px]">JS</span>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">Custom JavaScript Engine</h3>
                    <p className="text-[10px] text-slate-500">Safely runs on client load across storefront pages</p>
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-[10px] font-bold text-slate-600">
                    {settings.customJsEnabled ? 'Active' : 'Disabled'}
                  </span>
                  <input
                    type="checkbox"
                    checked={settings.customJsEnabled}
                    onChange={(e) => setSettings(prev => ({ ...prev, customJsEnabled: e.target.checked }))}
                    className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                  />
                </label>
              </div>

              {/* Quick Snippets Bar */}
              <div className="p-2.5 bg-slate-100/70 border-b border-slate-200/60 flex items-center gap-1.5 overflow-x-auto text-[10px]">
                <span className="text-slate-400 font-bold uppercase text-[9px] px-1">Snippets:</span>
                <button
                  type="button"
                  onClick={() => handleInsertJsSnippet(`// Google Analytics Event Tracker\nconsole.log("[GA4] Custom analytics initialization hook active.");`)}
                  className="px-2 py-0.5 bg-white border border-slate-200 hover:border-amber-400 rounded text-slate-700 font-medium hover:text-amber-600 transition-colors whitespace-nowrap cursor-pointer"
                >
                  + GA4 Logger
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertJsSnippet(`// Custom VIP Toast Alert\nsetTimeout(() => {\n  console.log("VIP Stylist Concierge available for chat.");\n}, 2000);`)}
                  className="px-2 py-0.5 bg-white border border-slate-200 hover:border-amber-400 rounded text-slate-700 font-medium hover:text-amber-600 transition-colors whitespace-nowrap cursor-pointer"
                >
                  + VIP Prompt
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertJsSnippet(`// Custom currency or geo helper\nwindow.__storeMeta = {\n  project: "${settings.apiKeys.projectName || 'Jade Tailor'}",\n  loadedAt: new Date().toISOString()\n};`)}
                  className="px-2 py-0.5 bg-white border border-slate-200 hover:border-amber-400 rounded text-slate-700 font-medium hover:text-amber-600 transition-colors whitespace-nowrap cursor-pointer"
                >
                  + Store Meta
                </button>
              </div>

              {/* Code Editor Area */}
              <div className="relative flex-1 bg-slate-950 p-3">
                <textarea
                  value={settings.customJs}
                  onChange={(e) => setSettings(prev => ({ ...prev, customJs: e.target.value }))}
                  placeholder="// Write custom JavaScript statements here..."
                  rows={16}
                  className="w-full h-full bg-transparent font-mono text-xs text-sky-400 focus:outline-none resize-y selection:bg-sky-900 selection:text-white leading-relaxed"
                  spellCheck={false}
                />
              </div>

              <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-400 font-mono">
                  {settings.customJs.length} characters · {settings.customJs.split('\n').length} lines
                </span>
                <button
                  type="button"
                  onClick={() => handleSave()}
                  disabled={saving}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Save className="w-3 h-3" />
                  <span>Apply JavaScript</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: WEBSITE STATUS & PASSWORD PROTECTION */}
      {activeSubTab === 'protection' && (
        <div className="space-y-6">
          {/* Status Switcher Banner */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Storefront Access Mode</h3>
                <p className="text-xs text-slate-500">
                  Control whether the website is open to public visitors or password-protected with a Coming Soon gate.
                </p>
              </div>

              {/* Segmented Control */}
              <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200/80">
                <button
                  type="button"
                  onClick={() => {
                    setSettings(prev => ({ ...prev, siteProtectionMode: 'live' }));
                    handleSave({ siteProtectionMode: 'live' });
                  }}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    settings.siteProtectionMode === 'live'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Website Live (Public)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSettings(prev => ({ ...prev, siteProtectionMode: 'password_protected' }));
                    handleSave({ siteProtectionMode: 'password_protected' });
                  }}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    settings.siteProtectionMode === 'password_protected'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Password Protected (Private)</span>
                </button>
              </div>
            </div>

            {settings.siteProtectionMode === 'password_protected' ? (
              <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-4 text-xs text-amber-900 flex items-start gap-3">
                <Shield className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <p className="font-bold">Password Protection Gate is currently ACTIVE on the website</p>
                  <p className="text-amber-800 leading-relaxed">
                    All visitors visiting your homepage or shop will see the luxury Coming Soon page. Only visitors who enter the correct password below can unlock and view the storefront. Administrators can always access the dashboard.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-4 text-xs text-emerald-900 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <p className="font-bold">Your website is LIVE and accessible to all public visitors</p>
                  <p className="text-emerald-800 leading-relaxed">
                    The online store, products, styling appointments, and checkout are accessible without restrictions.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Password & Coming Soon Configuration Form */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Password & Coming Soon Page Setup</h3>
                <p className="text-xs text-slate-500">Configure client access credentials and customized launch visuals.</p>
              </div>

              <button
                type="button"
                onClick={() => setShowComingSoonPreview(true)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview Coming Soon Page</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Store Password */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Store Access Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={settings.storePassword}
                    onChange={(e) => setSettings(prev => ({ ...prev, storePassword: e.target.value }))}
                    placeholder="Set secret store password..."
                    className="w-full text-xs font-mono p-2.5 pr-20 border border-slate-300 rounded-xl focus:ring-1 focus:ring-slate-900 focus:outline-none bg-slate-50"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                      title={showPassword ? "Hide" : "Show"}
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={generateRandomPassword}
                      className="text-[10px] font-bold text-indigo-650 hover:underline px-1 cursor-pointer"
                      title="Generate random password"
                    >
                      Random
                    </button>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400">
                  Share this password with clients or testers to let them access the store during development.
                </p>
              </div>

              {/* Target Launch Date (Countdown) */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Target Launch Date (Countdown Timer)
                </label>
                <input
                  type="datetime-local"
                  value={settings.comingSoonLaunchDate ? settings.comingSoonLaunchDate.slice(0, 16) : ''}
                  onChange={(e) => setSettings(prev => ({ ...prev, comingSoonLaunchDate: e.target.value ? new Date(e.target.value).toISOString() : '' }))}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-1 focus:ring-slate-900 focus:outline-none bg-slate-50"
                />
                <p className="text-[10px] text-slate-400">
                  Renders a live luxury countdown clock on the coming soon screen.
                </p>
              </div>

              {/* Headline */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Page Headline / Title
                </label>
                <input
                  type="text"
                  value={settings.comingSoonTitle}
                  onChange={(e) => setSettings(prev => ({ ...prev, comingSoonTitle: e.target.value }))}
                  placeholder="e.g. Private Salon & Boutique Showroom"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              {/* Subtitle */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Subtitle / Brand Kicker
                </label>
                <input
                  type="text"
                  value={settings.comingSoonSubtitle}
                  onChange={(e) => setSettings(prev => ({ ...prev, comingSoonSubtitle: e.target.value }))}
                  placeholder="e.g. BESPOKE CAPSULES · PRIVATE CLIENTELE ONLY"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              {/* Message */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Announcement Message / Description
                </label>
                <textarea
                  rows={3}
                  value={settings.comingSoonMessage}
                  onChange={(e) => setSettings(prev => ({ ...prev, comingSoonMessage: e.target.value }))}
                  placeholder="Describe your upcoming collection or private invitation instructions..."
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              {/* Background Cover Image with ImageUploadInput */}
              <div className="space-y-2 md:col-span-2">
                <ImageUploadInput
                  label="Coming Soon Luxury Background Wallpaper (Images & Videos)"
                  value={settings.comingSoonBackgroundUrl}
                  onChange={(url) => setSettings(prev => ({ ...prev, comingSoonBackgroundUrl: url }))}
                  placeholder="Paste background image URL or upload high-res luxury photograph..."
                />
              </div>

              {/* Toggles */}
              <div className="md:col-span-2 flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.comingSoonShowNewsletter}
                    onChange={(e) => setSettings(prev => ({ ...prev, comingSoonShowNewsletter: e.target.checked }))}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-700">Display VIP Newsletter / Early Access Waitlist</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.maintenanceBypassAdmins}
                    onChange={(e) => setSettings(prev => ({ ...prev, maintenanceBypassAdmins: e.target.checked }))}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-700">Automatically bypass gate when logged into Admin Dashboard</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => handleSave()}
                disabled={saving}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Password Protection Settings</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: ALL API KEYS & MULTI-PROJECT WHITELABEL */}
      {activeSubTab === 'apikeys' && (
        <div className="space-y-6">
          <div className="bg-indigo-50/70 border border-indigo-150 rounded-xl p-4 flex items-start gap-3">
            <Key className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
            <div className="text-xs text-indigo-950 space-y-0.5">
              <span className="font-bold">Multi-Project Ready & Whitelabel Credentials</span>
              <p className="text-indigo-900/80 leading-relaxed">
                Configure your own third-party API keys below. If you hand this dashboard over to someone else, they can simply enter their own keys here to launch a completely independent project without modifying source files.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* 1. CLOUDINARY MEDIA CLOUD */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
                    <Cloud className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Cloudinary Media Cloud (Images & Videos)</h3>
                    <p className="text-[10px] text-slate-500">Stores collection covers, product galleries, and streaming video banners</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleTestKey('cloudinary', {
                    cloudName: settings.apiKeys.cloudinaryCloudName,
                    apiKey: settings.apiKeys.cloudinaryApiKey,
                    apiSecret: settings.apiKeys.cloudinaryApiSecret,
                    cloudinaryUrl: settings.apiKeys.cloudinaryUrl
                  })}
                  disabled={testResults['cloudinary']?.loading}
                  className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${testResults['cloudinary']?.loading ? 'animate-spin' : ''}`} />
                  <span>Test Connection</span>
                </button>
              </div>

              {testResults['cloudinary'] && (
                <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  testResults['cloudinary'].success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                  {testResults['cloudinary'].success ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                  <span>{testResults['cloudinary'].message || testResults['cloudinary'].error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    Full CLOUDINARY_URL (Quick Single-String Setup)
                  </label>
                  <input
                    type="text"
                    value={settings.apiKeys.cloudinaryUrl || ''}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      apiKeys: { ...prev.apiKeys, cloudinaryUrl: e.target.value }
                    }))}
                    placeholder="cloudinary://API_KEY:API_SECRET@CLOUD_NAME"
                    className="w-full text-xs font-mono p-2.5 border border-slate-300 rounded-xl focus:ring-1 focus:ring-slate-900 focus:outline-none bg-slate-50"
                  />
                  <p className="text-[9.5px] text-slate-400">
                    Format: <code className="text-slate-600">cloudinary://API_KEY:API_SECRET@CLOUD_NAME</code> from your Cloudinary dashboard.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    Cloud Name
                  </label>
                  <input
                    type="text"
                    value={settings.apiKeys.cloudinaryCloudName || ''}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      apiKeys: { ...prev.apiKeys, cloudinaryCloudName: e.target.value.replace(/^@+/, '') }
                    }))}
                    placeholder="e.g. my-brand-cloud"
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-1 focus:ring-slate-900 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    API Key
                  </label>
                  <input
                    type="text"
                    value={settings.apiKeys.cloudinaryApiKey || ''}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      apiKeys: { ...prev.apiKeys, cloudinaryApiKey: e.target.value }
                    }))}
                    placeholder="e.g. 123456789012345"
                    className="w-full text-xs font-mono p-2.5 border border-slate-300 rounded-xl focus:ring-1 focus:ring-slate-900 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    API Secret
                  </label>
                  <div className="relative">
                    <input
                      type={showKeys['cld_secret'] ? 'text' : 'password'}
                      value={settings.apiKeys.cloudinaryApiSecret || ''}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        apiKeys: { ...prev.apiKeys, cloudinaryApiSecret: e.target.value }
                      }))}
                      placeholder="••••••••••••••••"
                      className="w-full text-xs font-mono p-2.5 pr-10 border border-slate-300 rounded-xl focus:ring-1 focus:ring-slate-900 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowKey('cld_secret')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      {showKeys['cld_secret'] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. NEON / POSTGRES DATABASE */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">PostgreSQL / Neon Database Connection</h3>
                    <p className="text-[10px] text-slate-500">Persistent database for products, orders, collections, and settings</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleTestKey('database')}
                  disabled={testResults['database']?.loading}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${testResults['database']?.loading ? 'animate-spin' : ''}`} />
                  <span>Test DB Ping</span>
                </button>
              </div>

              {testResults['database'] && (
                <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  testResults['database'].success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                  {testResults['database'].success ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                  <span>{testResults['database'].message || testResults['database'].error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                  DATABASE_URL (Connection String)
                </label>
                <div className="relative">
                  <input
                    type={showKeys['db_url'] ? 'text' : 'password'}
                    value={settings.apiKeys.databaseUrl || ''}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      apiKeys: { ...prev.apiKeys, databaseUrl: e.target.value }
                    }))}
                    placeholder="postgresql://user:password@ep-name.region.aws.neon.tech/neondb?sslmode=require"
                    className="w-full text-xs font-mono p-2.5 pr-10 border border-slate-300 rounded-xl focus:ring-1 focus:ring-slate-900 focus:outline-none bg-slate-50"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShowKey('db_url')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    {showKeys['db_url'] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* 3. RAZORPAY PAYMENT GATEWAY */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Razorpay Payment Gateway</h3>
                    <p className="text-[10px] text-slate-500">Live checkout, cards, UPI, and webhook processing</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleTestKey('razorpay', {
                    keyId: settings.apiKeys.razorpayKeyId,
                    keySecret: settings.apiKeys.razorpayKeySecret
                  })}
                  disabled={testResults['razorpay']?.loading}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${testResults['razorpay']?.loading ? 'animate-spin' : ''}`} />
                  <span>Verify Razorpay</span>
                </button>
              </div>

              {testResults['razorpay'] && (
                <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  testResults['razorpay'].success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                  {testResults['razorpay'].success ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                  <span>{testResults['razorpay'].message || testResults['razorpay'].error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    RAZORPAY_KEY_ID
                  </label>
                  <input
                    type="text"
                    value={settings.apiKeys.razorpayKeyId || ''}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      apiKeys: { ...prev.apiKeys, razorpayKeyId: e.target.value }
                    }))}
                    placeholder="rzp_live_..."
                    className="w-full text-xs font-mono p-2.5 border border-slate-300 rounded-xl focus:ring-1 focus:ring-slate-900 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    RAZORPAY_KEY_SECRET
                  </label>
                  <div className="relative">
                    <input
                      type={showKeys['rzp_sec'] ? 'text' : 'password'}
                      value={settings.apiKeys.razorpayKeySecret || ''}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        apiKeys: { ...prev.apiKeys, razorpayKeySecret: e.target.value }
                      }))}
                      placeholder="••••••••••••••••"
                      className="w-full text-xs font-mono p-2.5 pr-10 border border-slate-300 rounded-xl focus:ring-1 focus:ring-slate-900 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowKey('rzp_sec')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      {showKeys['rzp_sec'] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    Webhook Endpoint URL (Add in Razorpay Dashboard)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={`${window.location.origin}/api/razorpay/webhook`}
                      className="w-full text-xs font-mono p-2.5 border border-slate-200 rounded-xl bg-slate-100 text-slate-600 select-all"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/api/razorpay/webhook`);
                        triggerToast('Copied Webhook URL!');
                      }}
                      className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold cursor-pointer shrink-0"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. SMTP EMAIL OUTBOX */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Email Outbox (SMTP / Nodemailer)</h3>
                    <p className="text-[10px] text-slate-500">Order receipts, client styling appointments, and dispatch notifications</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleTestKey('email', {
                    host: settings.apiKeys.emailHost,
                    port: settings.apiKeys.emailPort,
                    user: settings.apiKeys.emailUser,
                    pass: settings.apiKeys.emailPass
                  })}
                  disabled={testResults['email']?.loading}
                  className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${testResults['email']?.loading ? 'animate-spin' : ''}`} />
                  <span>Verify SMTP Server</span>
                </button>
              </div>

              {testResults['email'] && (
                <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  testResults['email'].success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                  {testResults['email'].success ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                  <span>{testResults['email'].message || testResults['email'].error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    SMTP Host
                  </label>
                  <input
                    type="text"
                    value={settings.apiKeys.emailHost || ''}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      apiKeys: { ...prev.apiKeys, emailHost: e.target.value }
                    }))}
                    placeholder="smtp.ionos.co.uk"
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-1 focus:ring-slate-900 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    SMTP Port
                  </label>
                  <input
                    type="text"
                    value={settings.apiKeys.emailPort || ''}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      apiKeys: { ...prev.apiKeys, emailPort: e.target.value }
                    }))}
                    placeholder="587"
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-1 focus:ring-slate-900 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    Username / Address
                  </label>
                  <input
                    type="text"
                    value={settings.apiKeys.emailUser || ''}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      apiKeys: { ...prev.apiKeys, emailUser: e.target.value }
                    }))}
                    placeholder="support@domain.com"
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-1 focus:ring-slate-900 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showKeys['mail_pass'] ? 'text' : 'password'}
                      value={settings.apiKeys.emailPass || ''}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        apiKeys: { ...prev.apiKeys, emailPass: e.target.value }
                      }))}
                      placeholder="••••••••••••••••"
                      className="w-full text-xs font-mono p-2.5 pr-10 border border-slate-300 rounded-xl focus:ring-1 focus:ring-slate-900 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowKey('mail_pass')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      {showKeys['mail_pass'] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    From Header
                  </label>
                  <input
                    type="text"
                    value={settings.apiKeys.emailFrom || ''}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      apiKeys: { ...prev.apiKeys, emailFrom: e.target.value }
                    }))}
                    placeholder="Concierge <concierge@domain.com>"
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-1 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 5. GOOGLE GEMINI AI API */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Google Gemini AI API Key</h3>
                    <p className="text-[10px] text-slate-500">Powers AI style advice, lookbook recommendations, and auto descriptions</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleTestKey('gemini', {
                    apiKey: settings.apiKeys.geminiApiKey
                  })}
                  disabled={testResults['gemini']?.loading}
                  className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${testResults['gemini']?.loading ? 'animate-spin' : ''}`} />
                  <span>Test Gemini AI</span>
                </button>
              </div>

              {testResults['gemini'] && (
                <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  testResults['gemini'].success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                  {testResults['gemini'].success ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                  <span>{testResults['gemini'].message || testResults['gemini'].error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                  GEMINI_API_KEY
                </label>
                <div className="relative">
                  <input
                    type={showKeys['gem_key'] ? 'text' : 'password'}
                    value={settings.apiKeys.geminiApiKey || ''}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      apiKeys: { ...prev.apiKeys, geminiApiKey: e.target.value }
                    }))}
                    placeholder="AIzaSy..."
                    className="w-full text-xs font-mono p-2.5 pr-10 border border-slate-300 rounded-xl focus:ring-1 focus:ring-slate-900 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShowKey('gem_key')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    {showKeys['gem_key'] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* 6. ANALYTICS & PROJECT BRANDING */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
                Analytics Tracking & Project Metadata
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    Google Analytics ID
                  </label>
                  <input
                    type="text"
                    value={settings.apiKeys.googleAnalyticsId || ''}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      apiKeys: { ...prev.apiKeys, googleAnalyticsId: e.target.value }
                    }))}
                    placeholder="G-XXXXXXXXXX"
                    className="w-full text-xs font-mono p-2.5 border border-slate-300 rounded-xl focus:ring-1 focus:ring-slate-900 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    Meta / Facebook Pixel ID
                  </label>
                  <input
                    type="text"
                    value={settings.apiKeys.metaPixelId || ''}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      apiKeys: { ...prev.apiKeys, metaPixelId: e.target.value }
                    }))}
                    placeholder="1234567890"
                    className="w-full text-xs font-mono p-2.5 border border-slate-300 rounded-xl focus:ring-1 focus:ring-slate-900 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    Project / Store Name
                  </label>
                  <input
                    type="text"
                    value={settings.apiKeys.projectName || ''}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      apiKeys: { ...prev.apiKeys, projectName: e.target.value }
                    }))}
                    placeholder="e.g. Jade Tailor Luxury Store"
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-1 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => handleSave()}
                disabled={saving}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest rounded-xl flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>Save All API Credentials</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: DIAGNOSTICS & SYSTEM TOOLS */}
      {activeSubTab === 'diagnostics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quick Actions Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Developer Actions & Cache Tools</h3>
              <p className="text-xs text-slate-500">Quickly clear client cache, test endpoints, and backup store state.</p>

              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    localStorage.clear();
                    sessionStorage.clear();
                    triggerToast('✓ Cleared browser localStorage & session cache!');
                  }}
                  className="w-full p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-between transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <Trash2 className="w-4 h-4 text-slate-500" />
                    <div>
                      <span className="block">Purge Browser LocalStorage</span>
                      <span className="text-[10px] text-slate-400 font-normal">Forces fresh data pull from the database</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sessionStorage.removeItem('storefront_unlocked');
                    triggerToast('Lock re-enabled! Next visitor session will show the password gate.');
                  }}
                  className="w-full p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-between transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <Lock className="w-4 h-4 text-slate-500" />
                    <div>
                      <span className="block">Reset Storefront Password Session</span>
                      <span className="text-[10px] text-slate-400 font-normal">Re-locks your current browser session to test the gate</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-between transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <ExternalLink className="w-4 h-4 text-slate-500" />
                    <div>
                      <span className="block">Open Storefront in New Window</span>
                      <span className="text-[10px] text-slate-400 font-normal">View public storefront or coming soon screen</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </a>
              </div>
            </div>

            {/* Endpoints & Technical Info */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">API Webhooks & Routes</h3>
              <p className="text-xs text-slate-500">Live API routes operational on this instance.</p>

              <div className="space-y-2 pt-2 text-xs font-mono">
                {[
                  { method: 'POST', path: '/api/upload', desc: 'Direct Cloudinary & Postgres Media Uploader' },
                  { method: 'POST', path: '/api/cloudinary/upload-url', desc: 'Remote URL to Cloudinary CDN Syncer' },
                  { method: 'POST', path: '/api/razorpay/webhook', desc: 'Razorpay Payment Event Webhook' },
                  { method: 'GET', path: '/api/developer-mode/public', desc: 'Public Client Config & CSS/JS Delivery' },
                  { method: 'POST', path: '/api/developer-mode/verify-password', desc: 'Store Password Verification' },
                  { method: 'GET', path: '/api/developer-mode/export', desc: 'Full JSON Project Packaging' }
                ].map((item, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 border border-slate-150 rounded-lg flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                          item.method === 'POST' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {item.method}
                        </span>
                        <span className="text-slate-800 font-semibold">{item.path}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-sans">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FULL-SCREEN LIVE PREVIEW MODAL */}
      {showComingSoonPreview && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col">
          <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-white px-6">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider">Coming Soon Page Live Preview</span>
            </div>
            <button
              type="button"
              onClick={() => setShowComingSoonPreview(false)}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold text-slate-300 cursor-pointer"
            >
              Exit Preview ✕
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <PasswordProtectionGate
              title={settings.comingSoonTitle}
              subtitle={settings.comingSoonSubtitle}
              message={settings.comingSoonMessage}
              launchDate={settings.comingSoonLaunchDate}
              showNewsletter={settings.comingSoonShowNewsletter}
              backgroundUrl={settings.comingSoonBackgroundUrl}
              projectName={settings.apiKeys.projectName || 'Jade Tailor'}
              onUnlocked={() => {
                alert('Success! Password entered matches. Store would now unlock for visitor.');
                setShowComingSoonPreview(false);
              }}
              onAdminLoginClick={() => setShowComingSoonPreview(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
