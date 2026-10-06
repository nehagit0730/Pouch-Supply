import { Router } from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { uploadToCloudinary, isCloudinaryConfigured, getCloudinaryStatus, configureCloudinary } from "../services/cloudinaryService";
import { fetchResource, saveResource, fetchLayoutSettings, saveLayoutSettings } from "../../serverDb";
import { FileEntry } from "../../src/types";

const router = Router();
const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit for high-res images & video
});

// GET /api/cloudinary/status
router.get("/status", async (req, res) => {
  try {
    const { ensureCloudinaryConfigured } = await import("../services/cloudinaryService");
    await ensureCloudinaryConfigured();
    const status = getCloudinaryStatus();
    res.json(status);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to get Cloudinary status" });
  }
});

// POST /api/cloudinary/config
router.post("/config", async (req, res) => {
  try {
    let { cloudName, apiKey, apiSecret, cloudinaryUrl } = req.body;
    cloudName = cloudName ? String(cloudName).replace(/^@+/, '').trim() : '';
    apiKey = apiKey ? String(apiKey).trim() : '';
    apiSecret = apiSecret ? String(apiSecret).trim() : '';
    cloudinaryUrl = cloudinaryUrl ? String(cloudinaryUrl).trim() : '';
    
    // Test configuration
    const success = configureCloudinary({ cloudName, apiKey, apiSecret, cloudinaryUrl });
    if (!success) {
      return res.status(400).json({ error: "Please provide either a valid CLOUDINARY_URL or Cloud Name, API Key, and API Secret." });
    }

    // Verify connection by calling Cloudinary ping
    try {
      await cloudinary.api.ping();
    } catch (pingErr: any) {
      console.warn("[Cloudinary Config] Ping check failed with provided credentials:", pingErr.message);
    }

    // Persist to database layout_settings so it survives server restarts
    const currentSettings = await fetchLayoutSettings();
    const updatedSettings = {
      ...currentSettings,
      cloudinaryConfig: {
        cloudName,
        apiKey,
        apiSecret,
        cloudinaryUrl
      }
    };
    await saveLayoutSettings(updatedSettings);

    res.json({
      success: true,
      message: "Cloudinary credentials configured and saved successfully to database.",
      status: getCloudinaryStatus()
    });
  } catch (err: any) {
    console.error("[Cloudinary Config] Error saving config:", err);
    res.status(500).json({ error: err.message || "Failed to configure Cloudinary" });
  }
});

// GET /api/cloudinary/config
router.get("/config", async (req, res) => {
  try {
    const settings = await fetchLayoutSettings();
    const config = (settings && (settings as any).cloudinaryConfig) || {};
    res.json({
      cloudName: config.cloudName || process.env.CLOUDINARY_CLOUD_NAME || "",
      apiKey: config.apiKey || process.env.CLOUDINARY_API_KEY || "",
      hasApiSecret: Boolean(config.apiSecret || process.env.CLOUDINARY_API_SECRET),
      cloudinaryUrl: config.cloudinaryUrl ? "configured" : (process.env.CLOUDINARY_URL ? "configured" : ""),
      status: getCloudinaryStatus()
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to get Cloudinary config" });
  }
});

// POST /api/cloudinary/test
router.post("/test", async (req, res) => {
  try {
    let { cloudName, apiKey, apiSecret, cloudinaryUrl } = req.body;
    cloudName = cloudName ? String(cloudName).replace(/^@+/, '').trim() : undefined;
    apiKey = apiKey ? String(apiKey).trim() : undefined;
    apiSecret = apiSecret ? String(apiSecret).trim() : undefined;
    cloudinaryUrl = cloudinaryUrl ? String(cloudinaryUrl).trim() : undefined;

    if (cloudName || cloudinaryUrl || apiKey) {
      configureCloudinary({ cloudName, apiKey, apiSecret, cloudinaryUrl });
    } else {
      const { ensureCloudinaryConfigured } = await import("../services/cloudinaryService");
      await ensureCloudinaryConfigured();
    }

    const pingResult = await cloudinary.api.ping();
    res.json({
      success: true,
      message: "Successfully connected to Cloudinary CDN servers!",
      result: pingResult
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: err.message || "Cloudinary connection check failed. Verify your Cloud Name, API Key, and Secret."
    });
  }
});

// POST /api/cloudinary/disconnect
router.post("/disconnect", async (req, res) => {
  try {
    const currentSettings = await fetchLayoutSettings();
    const updatedSettings = { ...currentSettings };
    delete (updatedSettings as any).cloudinaryConfig;
    await saveLayoutSettings(updatedSettings);

    const { disconnectCloudinary } = await import("../services/cloudinaryService");
    disconnectCloudinary();

    res.json({
      success: true,
      message: "Cloudinary credentials disconnected. App will use database storage fallback.",
      status: getCloudinaryStatus()
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to disconnect Cloudinary" });
  }
});

// POST /api/cloudinary/upload (dedicated direct endpoint)
router.post("/upload", uploadMiddleware.single("file"), async (req, res) => {
  try {
    let fileBuffer: Buffer | null = null;
    let originalFilename = "";
    let mimeType = "image/png";
    let base64String = "";

    if (req.file) {
      fileBuffer = req.file.buffer;
      originalFilename = req.file.originalname || "asset";
      mimeType = req.file.mimetype || "image/png";
    } else if (req.body && req.body.data) {
      originalFilename = req.body.fileName || req.body.filename || "asset";
      const data = req.body.data;
      if (typeof data === "string" && data.startsWith("data:")) {
        const matches = data.match(/^data:([^;]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          mimeType = matches[1];
          base64String = matches[2];
          fileBuffer = Buffer.from(base64String, "base64");
        }
      } else {
        base64String = data;
        fileBuffer = Buffer.from(base64String, "base64");
      }
    } else {
      return res.status(400).json({ error: "Missing file or data parameter" });
    }

    const isVideo = mimeType.startsWith("video/") || 
      /\.(mp4|mov|webm|avi|mkv|flv|wmv|m4v|ogv)$/i.test(originalFilename) ||
      req.body?.resource_type === "video";
    const resourceType: "image" | "video" = isVideo ? "video" : "image";

    const uploadPayload = fileBuffer || Buffer.from(base64String, "base64");
    const result = await uploadToCloudinary(uploadPayload, {
      resourceType: isVideo ? "video" : "auto",
      fileName: originalFilename
    });

    if (!result) {
      return res.status(400).json({
        error: "Cloudinary is not configured. Please configure your Cloudinary credentials first."
      });
    }

    res.json({
      success: true,
      url: result.secure_url,
      secure_url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      resource_type: result.resource_type,
      bytes: result.bytes,
      isCloudinary: true
    });
  } catch (err: any) {
    console.error("[Cloudinary Route Upload] Error:", err);
    res.status(500).json({ error: err.message || "Cloudinary upload failed" });
  }
});

// POST /api/cloudinary/upload-url (Upload or migrate external URL into Cloudinary CDN)
router.post("/upload-url", async (req, res) => {
  try {
    const { url, folder, fileName } = req.body;
    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "Missing url parameter" });
    }

    if (url.includes("res.cloudinary.com")) {
      return res.json({
        success: true,
        url: url,
        secure_url: url,
        isCloudinary: true,
        message: "Already on Cloudinary CDN"
      });
    }

    const result = await uploadToCloudinary(url, {
      folder: folder || "jade_tailor_luxury_store",
      fileName: fileName || "migrated-asset"
    });

    if (!result) {
      return res.status(400).json({
        error: "Cloudinary is not configured. Please check your credentials in Development Mode."
      });
    }

    res.json({
      success: true,
      url: result.secure_url,
      secure_url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      resource_type: result.resource_type,
      isCloudinary: true
    });
  } catch (err: any) {
    console.error("[Cloudinary Upload URL] Error:", err);
    res.status(500).json({ error: err.message || "Failed to upload URL to Cloudinary" });
  }
});

export default router;
