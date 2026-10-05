import React, { useState, useEffect } from 'react';
import { Cloud, CheckCircle2, AlertCircle, Key, Lock, Globe, RefreshCw, Unlink, ShieldCheck, Database, Video, Image as ImageIcon, Sparkles } from 'lucide-react';

interface CloudinarySettingsCardProps {
  onConfigChanged?: () => void;
  className?: string;
  compact?: boolean;
}

export default function CloudinarySettingsCard({
  onConfigChanged,
  className = '',
  compact = false
}: CloudinarySettingsCardProps) {
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  const [status, setStatus] = useState<{
    configured: boolean;
    cloudName: string | null;
    hasApiKey: boolean;
    hasApiSecret: boolean;
    hasUrl: boolean;
  }>({
    configured: false,
    cloudName: null,
    hasApiKey: false,
    hasApiSecret: false,
    hasUrl: false
  });

  const [cloudName, setCloudName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [cloudinaryUrl, setCloudinaryUrl] = useState('');
  const [useUrlMode, setUseUrlMode] = useState(false);

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cloudinary/status');
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
        if (data.cloudName) {
          setCloudName(data.cloudName);
        }
      }
      // Also fetch saved config if available
      const cfgRes = await fetch('/api/cloudinary/config');
      if (cfgRes.ok) {
        const cfgData = await cfgRes.json();
        if (cfgData.cloudName) setCloudName(cfgData.cloudName);
        if (cfgData.apiKey) setApiKey(cfgData.apiKey);
        if (cfgData.cloudinaryUrl && cfgData.cloudinaryUrl !== 'configured') {
          setCloudinaryUrl(cfgData.cloudinaryUrl);
        }
      }
    } catch (err: any) {
      console.warn('[CloudinaryCard] Failed to fetch status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const handleTestConnection = async () => {
    setTesting(true);
    setFeedback(null);
    try {
      const payload: any = {};
      if (useUrlMode && cloudinaryUrl.trim()) {
        payload.cloudinaryUrl = cloudinaryUrl.trim();
      } else {
        if (!cloudName.trim() && !status.configured) {
          throw new Error('Please enter your Cloudinary Cloud Name');
        }
        payload.cloudName = cloudName.trim();
        payload.apiKey = apiKey.trim();
        payload.apiSecret = apiSecret.trim();
      }

      const res = await fetch('/api/cloudinary/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Connection check failed. Verify credentials.');
      }
      setFeedback({ type: 'success', message: '✓ Successfully pinged Cloudinary CDN! Credentials are valid.' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Connection test failed' });
    } finally {
      setTesting(false);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const payload: any = {};
      if (useUrlMode) {
        if (!cloudinaryUrl.trim()) {
          throw new Error('Please enter your CLOUDINARY_URL');
        }
        payload.cloudinaryUrl = cloudinaryUrl.trim();
      } else {
        if (!cloudName.trim()) {
          throw new Error('Please provide your Cloud Name');
        }
        if (!apiKey.trim()) {
          throw new Error('Please provide your API Key');
        }
        if (!apiSecret.trim() && !status.hasApiSecret) {
          throw new Error('Please provide your API Secret');
        }
        payload.cloudName = cloudName.trim();
        payload.apiKey = apiKey.trim();
        if (apiSecret.trim()) {
          payload.apiSecret = apiSecret.trim();
        }
      }

      const res = await fetch('/api/cloudinary/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save Cloudinary configuration');
      }

      setFeedback({ type: 'success', message: '✓ Cloudinary credentials saved to database! Global CDN media upload is active.' });
      setStatus(data.status || { configured: true, cloudName, hasApiKey: true, hasApiSecret: true, hasUrl: false });
      if (onConfigChanged) onConfigChanged();
      setTimeout(loadStatus, 500);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to save configuration' });
    } finally {
      setSaving(false);
    }
  };

  const handleDisconnect = async () => {
    if (!window.confirm('Disconnect Cloudinary? All new uploads will be stored in your Neon Postgres database directly.')) {
      return;
    }
    setDisconnecting(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/cloudinary/disconnect', { method: 'POST' });
      if (res.ok) {
        setCloudName('');
        setApiKey('');
        setApiSecret('');
        setCloudinaryUrl('');
        setStatus({ configured: false, cloudName: null, hasApiKey: false, hasApiSecret: false, hasUrl: false });
        setFeedback({ type: 'success', message: 'Cloudinary disconnected. Database storage fallback is active.' });
        if (onConfigChanged) onConfigChanged();
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to disconnect' });
    } finally {
      setDisconnecting(false);
    }
  };

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden text-left ${className}`}>
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-sky-50/40 via-white to-indigo-50/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white flex items-center justify-center shadow-sm">
            <Cloud className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Cloudinary Media Storage & CDN
              </h3>
              {status.configured ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                  Active CDN
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200">
                  <Database className="h-3 w-3 text-amber-600" />
                  Database Fallback Active
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              High-speed Cloudinary image & video hosting with permanent storage in your database
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadStatus}
            disabled={loading}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Refresh status"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
          </button>
          {status.configured && (
            <button
              type="button"
              onClick={handleDisconnect}
              disabled={disconnecting}
              className="text-xs font-bold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Unlink className="h-3.5 w-3.5" />
              <span>Disconnect</span>
            </button>
          )}
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-3.5 px-5 text-xs font-semibold flex items-center gap-2 border-b ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Body */}
      <div className="p-6 space-y-5">
        {/* Status Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Cloud className="h-3 w-3 text-sky-600" /> Cloud Name
            </div>
            <div className="text-xs font-black text-slate-800 font-mono truncate">
              {status.cloudName || 'Not configured'}
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Video className="h-3 w-3 text-indigo-600" /> Video & Image Support
            </div>
            <div className="text-xs font-black text-slate-800">
              {status.configured ? 'Ultra HD & MP4 CDN' : 'Database Storage'}
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Database className="h-3 w-3 text-emerald-600" /> Database Backup
            </div>
            <div className="text-xs font-black text-emerald-700">
              Auto-persisted to Neon DB
            </div>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSaveConfig} className="space-y-4">
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs font-bold text-slate-700">Cloudinary API Credentials</span>
            <button
              type="button"
              onClick={() => setUseUrlMode(!useUrlMode)}
              className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
            >
              {useUrlMode ? 'Switch to Cloud Name / API Key fields' : 'Switch to CLOUDINARY_URL string'}
            </button>
          </div>

          {useUrlMode ? (
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Cloudinary Connection URL
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="cloudinary://API_KEY:API_SECRET@CLOUD_NAME"
                  value={cloudinaryUrl}
                  onChange={(e) => setCloudinaryUrl(e.target.value)}
                  className="w-full text-xs font-mono p-2.5 pl-8 border border-slate-250 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <Globe className="absolute left-2.5 top-3 h-3.5 w-3.5 text-slate-400" />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Copy from Cloudinary Dashboard &gt; API Keys &gt; Connection string.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Cloud Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. dxyz1234"
                    value={cloudName}
                    onChange={(e) => setCloudName(e.target.value)}
                    className="w-full text-xs font-mono p-2.5 pl-8 border border-slate-250 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <Cloud className="absolute left-2.5 top-3 h-3.5 w-3.5 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  API Key
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. 123456789012345"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full text-xs font-mono p-2.5 pl-8 border border-slate-250 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <Key className="absolute left-2.5 top-3 h-3.5 w-3.5 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  API Secret {status.hasApiSecret && <span className="text-emerald-600">(Stored)</span>}
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder={status.hasApiSecret ? '••••••••••••••••' : 'Enter API secret'}
                    value={apiSecret}
                    onChange={(e) => setApiSecret(e.target.value)}
                    className="w-full text-xs font-mono p-2.5 pl-8 border border-slate-250 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <Lock className="absolute left-2.5 top-3 h-3.5 w-3.5 text-slate-400" />
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Credentials are encrypted and stored in database layout settings.</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testing}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${testing ? 'animate-spin text-sky-600' : ''}`} />
                <span>{testing ? 'Testing...' : 'Test Connection'}</span>
              </button>

              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <Cloud className="h-3.5 w-3.5 text-sky-400" />
                <span>{saving ? 'Saving to Database...' : 'Save & Enable Cloudinary'}</span>
              </button>
            </div>
          </div>
        </form>

        {/* Informative Feature Bullets */}
        <div className="p-3.5 bg-sky-50/50 border border-sky-100 rounded-xl text-xs text-slate-600 space-y-1.5">
          <div className="font-bold text-sky-900 flex items-center gap-1 text-[11px]">
            <Sparkles className="h-3.5 w-3.5 text-sky-600" />
            Where Cloudinary is used in your Atelier store:
          </div>
          <ul className="text-[10px] space-y-1 text-slate-600 list-disc list-inside">
            <li><strong>Products & Variants:</strong> All product images and gallery media</li>
            <li><strong>Page Builder & Sections:</strong> Hero banners, Slideshows, Video banner, Testimonials, About sections</li>
            <li><strong>Files Media Manager:</strong> Upload any image or MP4/WebM video file directly to Cloudinary CDN and keep track of it in the files table</li>
            <li><strong>Collections & Blog:</strong> Featured covers, banner artwork, and logos</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
