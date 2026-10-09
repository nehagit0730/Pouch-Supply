import { Router } from "express";
import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import { 
  configureCloudinary, 
  isCloudinaryConfigured, 
  getCloudinaryStatus, 
  ensureCloudinaryConfigured 
} from "../services/cloudinaryService";
import { 
  fetchResource, 
  saveResource, 
  fetchLayoutSettings,
  saveLayoutSettings
} from "../../serverDb";
import { testConnection as testDbConnection } from "../../neonDb";
import nodemailer from "nodemailer";

const router = Router();
const DEV_SETTINGS_FILE = path.join(process.cwd(), "developer_settings.json");

export interface DeveloperSettingsData {
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
    // UPI & Payment Recipients
    upiPhoneNumber?: string;
    upiVpa?: string;
    upiPayeeName?: string;
    upiGPayId?: string;
    upiPhonePeId?: string;
    upiPaytmId?: string;
    upiEnabled?: boolean;
    // Store General Settings
    currency?: string;
    currencySymbol?: string;
    storeEmail?: string;
    storePhone?: string;
  };
  debugConsoleLogs: boolean;
  maintenanceBypassAdmins: boolean;
  updatedAt?: string;
}

const DEFAULT_DEV_SETTINGS: DeveloperSettingsData = {
  customCssEnabled: true,
  customCss: `/* ========================================================
   CUSTOM DEVELOPER CSS
   Injected across all storefront pages in real time
   ======================================================== */

/* Example: Luxury accent highlights */
.luxury-accent {
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

/* Example: Smooth transition for product cards */
.product-card-hover {
  transition: transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
}
`,
  customJsEnabled: true,
  customJs: `// ========================================================
// CUSTOM DEVELOPER JAVASCRIPT
// Executed safely across storefront pages
// ========================================================

console.log("[DevMode] Custom Developer JavaScript active on Jade Tailor Luxury Storefront.");

// Example: Custom event listener or analytics dispatch
window.addEventListener("DOMContentLoaded", () => {
  // Developer custom tracking or DOM enhancements here
});
`,
  siteProtectionMode: 'live',
  storePassword: 'fashion2026',
  comingSoonTitle: "Private Salon & Boutique Showroom",
  comingSoonSubtitle: "BESPOKE CAPSULES · PRIVATE CLIENTELE ONLY",
  comingSoonMessage: "We are currently preparing our exclusive Spring / Summer collection. Enter your client password below to unlock private showroom access.",
  comingSoonLaunchDate: "2026-11-01T00:00:00Z",
  comingSoonShowNewsletter: true,
  comingSoonShowSocials: true,
  comingSoonBackgroundUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=85",
  apiKeys: {
    cloudinaryCloudName: (process.env.CLOUDINARY_CLOUD_NAME || "").replace(/^@+/, ""),
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || "",
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET ? "configured" : "",
    cloudinaryUrl: process.env.CLOUDINARY_URL || "",
    databaseUrl: process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || "",
    razorpayKeyId: process.env.RAZORPAY_KEY_ID || "",
    razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET ? "configured" : "",
    razorpayWebhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET ? "configured" : "",
    emailHost: process.env.EMAIL_HOST || "smtp.ionos.co.uk",
    emailPort: process.env.EMAIL_PORT || "587",
    emailUser: process.env.EMAIL_USER || "Support@pouch-supply.com",
    emailPass: process.env.EMAIL_PASS ? "configured" : "",
    emailFrom: process.env.EMAIL_FROM || "Support <Support@pouch-supply.com>",
    geminiApiKey: process.env.GEMINI_API_KEY ? "configured" : "",
    googleAnalyticsId: "",
    metaPixelId: "",
    klaviyoPublicKey: "",
    appUrl: process.env.APP_URL || "http://localhost:3000",
    projectName: "Jade Tailor - Personal Stylist & Luxury Store",
    upiPhoneNumber: "8894030663",
    upiVpa: "8894030663@upi",
    upiPayeeName: "Jade Tailor Luxury Boutique",
    upiGPayId: "8894030663@okaxis",
    upiPhonePeId: "8894030663@ybl",
    upiPaytmId: "8894030663@paytm",
    upiEnabled: true,
    currency: "INR",
    currencySymbol: "₹",
    storeEmail: "jade@tailorand.com",
    storePhone: "+91 8894030663"
  },
  debugConsoleLogs: false,
  maintenanceBypassAdmins: true
};

// Helper: Read stored developer settings
export async function loadDeveloperSettings(): Promise<DeveloperSettingsData> {
  let settings: DeveloperSettingsData = { ...DEFAULT_DEV_SETTINGS };

  // 1. Try reading from database
  try {
    const list = await fetchResource("developer_settings");
    if (Array.isArray(list) && list.length > 0 && list[0]) {
      const stored = list[0];
      const mergedKeys = {
        ...DEFAULT_DEV_SETTINGS.apiKeys,
        ...(stored.apiKeys || {}),
        upiPhoneNumber: (stored.apiKeys?.upiPhoneNumber && stored.apiKeys.upiPhoneNumber.trim() !== "") 
          ? stored.apiKeys.upiPhoneNumber 
          : DEFAULT_DEV_SETTINGS.apiKeys.upiPhoneNumber,
        upiVpa: (stored.apiKeys?.upiVpa && stored.apiKeys.upiVpa.trim() !== "") 
          ? stored.apiKeys.upiVpa 
          : DEFAULT_DEV_SETTINGS.apiKeys.upiVpa,
        upiPayeeName: stored.apiKeys?.upiPayeeName || DEFAULT_DEV_SETTINGS.apiKeys.upiPayeeName,
        upiGPayId: stored.apiKeys?.upiGPayId || DEFAULT_DEV_SETTINGS.apiKeys.upiGPayId,
        upiPhonePeId: stored.apiKeys?.upiPhonePeId || DEFAULT_DEV_SETTINGS.apiKeys.upiPhonePeId,
        upiPaytmId: stored.apiKeys?.upiPaytmId || DEFAULT_DEV_SETTINGS.apiKeys.upiPaytmId,
        upiEnabled: stored.apiKeys?.upiEnabled !== undefined ? stored.apiKeys.upiEnabled : true,
      };

      settings = {
        ...DEFAULT_DEV_SETTINGS,
        ...stored,
        apiKeys: mergedKeys
      };
      return settings;
    }
  } catch (_) {}

  // 2. Try reading from local file
  try {
    if (fs.existsSync(DEV_SETTINGS_FILE)) {
      const content = fs.readFileSync(DEV_SETTINGS_FILE, "utf-8");
      const parsed = JSON.parse(content);
      const mergedKeys = {
        ...DEFAULT_DEV_SETTINGS.apiKeys,
        ...(parsed.apiKeys || {}),
        upiPhoneNumber: (parsed.apiKeys?.upiPhoneNumber && parsed.apiKeys.upiPhoneNumber.trim() !== "") 
          ? parsed.apiKeys.upiPhoneNumber 
          : DEFAULT_DEV_SETTINGS.apiKeys.upiPhoneNumber,
        upiVpa: (parsed.apiKeys?.upiVpa && parsed.apiKeys.upiVpa.trim() !== "") 
          ? parsed.apiKeys.upiVpa 
          : DEFAULT_DEV_SETTINGS.apiKeys.upiVpa,
        upiPayeeName: parsed.apiKeys?.upiPayeeName || DEFAULT_DEV_SETTINGS.apiKeys.upiPayeeName,
        upiGPayId: parsed.apiKeys?.upiGPayId || DEFAULT_DEV_SETTINGS.apiKeys.upiGPayId,
        upiPhonePeId: parsed.apiKeys?.upiPhonePeId || DEFAULT_DEV_SETTINGS.apiKeys.upiPhonePeId,
        upiPaytmId: parsed.apiKeys?.upiPaytmId || DEFAULT_DEV_SETTINGS.apiKeys.upiPaytmId,
        upiEnabled: parsed.apiKeys?.upiEnabled !== undefined ? parsed.apiKeys.upiEnabled : true,
      };

      settings = {
        ...DEFAULT_DEV_SETTINGS,
        ...parsed,
        apiKeys: mergedKeys
      };
      return settings;
    }
  } catch (_) {}

  return settings;
}

// Helper: Save developer settings
export async function persistDeveloperSettings(data: Partial<DeveloperSettingsData>): Promise<DeveloperSettingsData> {
  const current = await loadDeveloperSettings();
  const merged: DeveloperSettingsData = {
    ...current,
    ...data,
    apiKeys: {
      ...current.apiKeys,
      ...(data.apiKeys || {})
    },
    updatedAt: new Date().toISOString()
  };

  // Write to local disk
  try {
    fs.writeFileSync(DEV_SETTINGS_FILE, JSON.stringify(merged, null, 2), "utf-8");
  } catch (err) {
    console.warn("[DevMode] Error saving developer_settings.json:", err);
  }

  // Write to database
  try {
    await saveResource("developer_settings", [merged]);
  } catch (err) {
    console.warn("[DevMode] Error saving to developer_settings table:", err);
  }

  // If Cloudinary keys are supplied or updated, reconfigure Cloudinary
  const cldKeys = merged.apiKeys;
  if (cldKeys.cloudinaryCloudName || cldKeys.cloudinaryUrl || cldKeys.cloudinaryApiKey) {
    try {
      configureCloudinary({
        cloudName: cldKeys.cloudinaryCloudName,
        apiKey: cldKeys.cloudinaryApiKey,
        apiSecret: cldKeys.cloudinaryApiSecret && cldKeys.cloudinaryApiSecret !== "configured" ? cldKeys.cloudinaryApiSecret : process.env.CLOUDINARY_API_SECRET,
        cloudinaryUrl: cldKeys.cloudinaryUrl && cldKeys.cloudinaryUrl !== "configured" ? cldKeys.cloudinaryUrl : process.env.CLOUDINARY_URL
      });
    } catch (_) {}
  }

  return merged;
}

// GET /api/developer-mode (Admin view with secret masks)
router.get("/", async (req, res) => {
  try {
    await ensureCloudinaryConfigured();
    const settings = await loadDeveloperSettings();
    const cldStatus = getCloudinaryStatus();

    // Check environment indicators
    const envStatus = {
      cloudinary: isCloudinaryConfigured(),
      database: Boolean(process.env.DATABASE_URL || process.env.NEON_DATABASE_URL),
      razorpay: Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
      email: Boolean(process.env.EMAIL_HOST && process.env.EMAIL_USER),
      gemini: Boolean(process.env.GEMINI_API_KEY)
    };

    // Mask sensitive keys for secure view
    const maskedKeys = {
      ...settings.apiKeys,
      cloudinaryApiSecret: settings.apiKeys.cloudinaryApiSecret ? (settings.apiKeys.cloudinaryApiSecret === "configured" ? "••••••••••••••••" : "••••••••••••••••") : "",
      razorpayKeySecret: settings.apiKeys.razorpayKeySecret ? "••••••••••••••••" : "",
      razorpayWebhookSecret: settings.apiKeys.razorpayWebhookSecret ? "••••••••••••••••" : "",
      emailPass: settings.apiKeys.emailPass ? "••••••••••••••••" : "",
      geminiApiKey: settings.apiKeys.geminiApiKey ? "••••••••••••••••" : ""
    };

    res.json({
      ...settings,
      apiKeys: maskedKeys,
      hasSecrets: {
        cloudinary: Boolean(settings.apiKeys.cloudinaryApiSecret || process.env.CLOUDINARY_API_SECRET),
        razorpay: Boolean(settings.apiKeys.razorpayKeySecret || process.env.RAZORPAY_KEY_SECRET),
        email: Boolean(settings.apiKeys.emailPass || process.env.EMAIL_PASS),
        gemini: Boolean(settings.apiKeys.geminiApiKey || process.env.GEMINI_API_KEY)
      },
      envStatus,
      cloudinaryStatus: cldStatus
    });
  } catch (err: any) {
    console.error("[DevMode] GET error:", err);
    res.status(500).json({ error: err.message || "Failed to load developer settings" });
  }
});

// GET /api/developer-mode/public (Safe storefront config for visitors)
router.get("/public", async (req, res) => {
  try {
    const settings = await loadDeveloperSettings();
    res.json({
      customCssEnabled: settings.customCssEnabled,
      customCss: settings.customCssEnabled ? settings.customCss : "",
      customJsEnabled: settings.customJsEnabled,
      customJs: settings.customJsEnabled ? settings.customJs : "",
      siteProtectionMode: settings.siteProtectionMode,
      comingSoonTitle: settings.comingSoonTitle,
      comingSoonSubtitle: settings.comingSoonSubtitle,
      comingSoonMessage: settings.comingSoonMessage,
      comingSoonLaunchDate: settings.comingSoonLaunchDate,
      comingSoonShowNewsletter: settings.comingSoonShowNewsletter,
      comingSoonShowSocials: settings.comingSoonShowSocials,
      comingSoonBackgroundUrl: settings.comingSoonBackgroundUrl,
      debugConsoleLogs: settings.debugConsoleLogs,
      projectName: settings.apiKeys?.projectName || "Jade Tailor",
      upiPhoneNumber: settings.apiKeys?.upiPhoneNumber || "8894030663",
      upiVpa: settings.apiKeys?.upiVpa || "8894030663@upi",
      upiPayeeName: settings.apiKeys?.upiPayeeName || "Jade Tailor",
      upiGPayId: settings.apiKeys?.upiGPayId || "8894030663@okaxis",
      upiPhonePeId: settings.apiKeys?.upiPhonePeId || "8894030663@ybl",
      upiPaytmId: settings.apiKeys?.upiPaytmId || "8894030663@paytm",
      upiEnabled: settings.apiKeys?.upiEnabled !== false
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to get public settings" });
  }
});

// POST /api/developer-mode (Save settings)
router.post("/", async (req, res) => {
  try {
    const payload = req.body;
    const current = await loadDeveloperSettings();

    // Preserve existing secrets if masked string was sent back
    if (payload.apiKeys) {
      if (payload.apiKeys.cloudinaryApiSecret === "••••••••••••••••" || payload.apiKeys.cloudinaryApiSecret === "configured") {
        payload.apiKeys.cloudinaryApiSecret = current.apiKeys.cloudinaryApiSecret;
      }
      if (payload.apiKeys.razorpayKeySecret === "••••••••••••••••" || payload.apiKeys.razorpayKeySecret === "configured") {
        payload.apiKeys.razorpayKeySecret = current.apiKeys.razorpayKeySecret;
      }
      if (payload.apiKeys.razorpayWebhookSecret === "••••••••••••••••" || payload.apiKeys.razorpayWebhookSecret === "configured") {
        payload.apiKeys.razorpayWebhookSecret = current.apiKeys.razorpayWebhookSecret;
      }
      if (payload.apiKeys.emailPass === "••••••••••••••••" || payload.apiKeys.emailPass === "configured") {
        payload.apiKeys.emailPass = current.apiKeys.emailPass;
      }
      if (payload.apiKeys.geminiApiKey === "••••••••••••••••" || payload.apiKeys.geminiApiKey === "configured") {
        payload.apiKeys.geminiApiKey = current.apiKeys.geminiApiKey;
      }
    }

    const saved = await persistDeveloperSettings(payload);
    res.json({
      success: true,
      message: "Development mode settings updated successfully.",
      data: saved
    });
  } catch (err: any) {
    console.error("[DevMode] POST error:", err);
    res.status(500).json({ error: err.message || "Failed to save developer settings" });
  }
});

// POST /api/developer-mode/verify-password
router.post("/verify-password", async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ valid: false, error: "Please enter a password." });
    }

    const settings = await loadDeveloperSettings();
    const correctPassword = settings.storePassword || "fashion2026";

    if (password.trim() === correctPassword.trim()) {
      res.json({
        valid: true,
        token: `unlocked_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        message: "Password verified! Welcome to the boutique showroom."
      });
    } else {
      res.status(401).json({
        valid: false,
        error: "Incorrect password. Please verify and try again."
      });
    }
  } catch (err: any) {
    res.status(500).json({ valid: false, error: err.message || "Verification failed" });
  }
});

// POST /api/developer-mode/test-key (Real live testing for all service integrations)
router.post("/test-key", async (req, res) => {
  const { service, config } = req.body;

  try {
    if (service === "cloudinary") {
      const cloudName = (config?.cloudName || process.env.CLOUDINARY_CLOUD_NAME || "").replace(/^@+/, "").trim();
      const apiKey = config?.apiKey || process.env.CLOUDINARY_API_KEY;
      const apiSecret = config?.apiSecret && config.apiSecret !== "••••••••••••••••" ? config.apiSecret : process.env.CLOUDINARY_API_SECRET;
      const cldUrl = config?.cloudinaryUrl && config.cloudinaryUrl !== "configured" ? config.cloudinaryUrl : process.env.CLOUDINARY_URL;

      if (cloudName || apiKey || cldUrl) {
        configureCloudinary({ cloudName, apiKey, apiSecret, cloudinaryUrl: cldUrl });
      } else {
        await ensureCloudinaryConfigured();
      }

      const ping = await cloudinary.api.ping();
      return res.json({
        success: true,
        service: "cloudinary",
        message: `✓ Cloudinary CDN connected successfully! Cloud: "${cloudName || (cloudinary.config().cloud_name)}"`,
        details: ping
      });
    }

    if (service === "database") {
      const dbStatus = await testDbConnection();
      if (dbStatus.status === "connected") {
        return res.json({
          success: true,
          service: "database",
          message: `✓ Database connected (${dbStatus.uriHost || 'PostgreSQL'})`,
          details: dbStatus
        });
      } else {
        return res.status(400).json({
          success: false,
          service: "database",
          error: dbStatus.error || "Database connection test failed."
        });
      }
    }

    if (service === "razorpay") {
      const keyId = config?.keyId || process.env.RAZORPAY_KEY_ID;
      const keySecret = config?.keySecret && config.keySecret !== "••••••••••••••••" ? config.keySecret : process.env.RAZORPAY_KEY_SECRET;

      if (!keyId) {
        return res.status(400).json({
          success: false,
          service: "razorpay",
          error: "Missing Razorpay Key ID."
        });
      }

      // Initialize Razorpay SDK client and make a test call
      const Razorpay = (await import("razorpay")).default;
      const instance = new Razorpay({
        key_id: keyId,
        key_secret: keySecret || "test_secret"
      });

      // Try fetching orders list or items to verify key authentication
      try {
        const testRes = await instance.orders.all({ count: 1 });
        return res.json({
          success: true,
          service: "razorpay",
          message: `✓ Razorpay API verified successfully for Key ID: ${keyId}`,
          details: { orderCount: testRes.count }
        });
      } catch (rzpErr: any) {
        // Even if permissions limit list access, a 401 is an error; otherwise key is recognized
        if (rzpErr.statusCode === 401) {
          throw new Error("Razorpay authentication failed: Invalid Key ID or Secret.");
        }
        return res.json({
          success: true,
          service: "razorpay",
          message: `✓ Razorpay credentials formatted correctly: Key ID "${keyId}"`,
          details: rzpErr.message
        });
      }
    }

    if (service === "email") {
      const host = config?.host || process.env.EMAIL_HOST || "smtp.ionos.co.uk";
      const port = parseInt(config?.port || process.env.EMAIL_PORT || "587", 10);
      const user = config?.user || process.env.EMAIL_USER || "Support@pouch-supply.com";
      const pass = config?.pass && config.pass !== "••••••••••••••••" ? config.pass : (process.env.EMAIL_PASS || "");

      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
        tls: { rejectUnauthorized: false }
      });

      try {
        await transporter.verify();
        return res.json({
          success: true,
          service: "email",
          message: `✓ SMTP Outbox connected successfully to ${host}:${port} as ${user}`
        });
      } catch (mailErr: any) {
        return res.status(400).json({
          success: false,
          service: "email",
          error: `SMTP connection failed: ${mailErr.message}`
        });
      }
    }

    if (service === "gemini") {
      const apiKey = config?.apiKey && config.apiKey !== "••••••••••••••••" ? config.apiKey : process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({
          success: false,
          service: "gemini",
          error: "Missing GEMINI_API_KEY."
        });
      }

      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey });
      const model = ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Respond with the single word: OK"
      });

      const response = await model;
      return res.json({
        success: true,
        service: "gemini",
        message: `✓ Gemini AI API connected and generated response!`,
        reply: response.text?.trim()
      });
    }

    res.status(400).json({ error: `Unknown service: ${service}` });
  } catch (err: any) {
    console.error(`[DevMode Test] ${service} test failed:`, err);
    res.status(400).json({
      success: false,
      service,
      error: err.message || `Test failed for ${service}`
    });
  }
});

// POST /api/developer-mode/export (Export complete project config package)
router.get("/export", async (req, res) => {
  try {
    const devSettings = await loadDeveloperSettings();
    const layoutSettings = await fetchLayoutSettings();
    const products = await fetchResource("products");
    const collections = await fetchResource("collections");

    const exportPackage = {
      version: "2.0.0",
      exportedAt: new Date().toISOString(),
      project: devSettings.apiKeys.projectName || "Jade Tailor Luxury Boutique",
      developerSettings: devSettings,
      layoutSettings: layoutSettings,
      counts: {
        products: products.length,
        collections: collections.length
      }
    };

    res.setHeader("Content-Disposition", `attachment; filename=project-config-${Date.now()}.json`);
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(exportPackage, null, 2));
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to export config" });
  }
});

// POST /api/developer-mode/import (Import project config package)
router.post("/import", async (req, res) => {
  try {
    const pkg = req.body;
    if (!pkg || typeof pkg !== "object") {
      return res.status(400).json({ error: "Invalid JSON configuration package." });
    }

    if (pkg.developerSettings) {
      await persistDeveloperSettings(pkg.developerSettings);
    }
    if (pkg.layoutSettings) {
      await saveLayoutSettings(pkg.layoutSettings);
    }

    res.json({
      success: true,
      message: "✓ Project configuration imported successfully. Your website is now ready for the new project!"
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to import config" });
  }
});

export default router;
