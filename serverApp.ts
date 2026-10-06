import express from "express";
import path from "path";
import fs from "fs";
import { fetchResource, saveResource, saveUploadedImage, getUploadedImage, getConnectionStatus, updateDbUri, getDb, getDatabaseDetails, fetchLayoutSettings, saveLayoutSettings } from "./serverDb";

// Import modular routers for products, collections, customers, orders, files, discounts, custom pages, and blogs
import productsRouter from "./backend/routes/products";
import collectionsRouter from "./backend/routes/collections";
import ordersRouter from "./backend/routes/orders";
import filesRouter from "./backend/routes/files";
import customersRouter from "./backend/routes/customers";
import discountsRouter from "./backend/routes/discounts";
import customPagesRouter from "./backend/routes/customPages";
import blogsRouter from "./backend/routes/blogs";
import razorpayRouter from "./backend/routes/razorpay";
import recycleBinRouter from "./backend/routes/recycleBin";
import cloudinaryRouter from "./backend/routes/cloudinary";
import developerModeRouter from "./backend/routes/developerMode";
import multer from "multer";
import { uploadToCloudinary, ensureCloudinaryConfigured } from "./backend/services/cloudinaryService";
import { FileEntry } from "./src/types";

export async function createExpressApp() {
  const app = express();

  // Initialize Cloudinary configuration asynchronously
  ensureCloudinaryConfigured().catch(() => {});

  // Set limits for payload uploads since products or media arrays can be large
  // Vercel serverless functions pre-parse req.body. To prevent hanging on the streams,
  // we check if req.body is already parsed, and if so, skip express.json() / express.urlencoded()
  app.use((req, res, next) => {
    if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
      return next();
    }
    express.json({ limit: "50mb" })(req, res, next);
  });

  app.use((req, res, next) => {
    if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
      return next();
    }
    express.urlencoded({ limit: "50mb", extended: true })(req, res, next);
  });



  // Serves /uploads with lazy loading fallback from Neon Postgres database!
  const uploadsPath = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadsPath)) {
    try {
      fs.mkdirSync(uploadsPath, { recursive: true });
    } catch (_) {}
  }

  app.get("/uploads/:filename", async (req, res, next) => {
    try {
      const filename = req.params.filename;
      const filePath = path.join(uploadsPath, filename);
      
      if (fs.existsSync(filePath)) {
        return res.sendFile(filePath);
      }
      
      // If the file is missing from disk, lazy-load from Neon Postgres database!
      const dotIndex = filename.lastIndexOf(".");
      const id = dotIndex !== -1 ? filename.substring(0, dotIndex) : filename;
      
      console.log(`[Uploads Restore] File ${filename} missing from local disk. Restoring from Neon Postgres...`);
      let imgDoc = await getUploadedImage(id);
      if (!imgDoc && dotIndex !== -1) {
        imgDoc = await getUploadedImage(filename);
      }

      if (imgDoc && imgDoc.base64Data) {
        // Cache to disk if filesystem is writable
        try {
          fs.writeFileSync(filePath, Buffer.from(imgDoc.base64Data, "base64"));
          console.log(`[Uploads Restore] Restored to disk successfully: ${filename}`);
        } catch (_) {}

        // Stream image directly to client
        const imgBuffer = Buffer.from(imgDoc.base64Data, "base64");
        res.writeHead(200, {
          "Content-Type": imgDoc.mimeType || "image/png",
          "Content-Length": imgBuffer.length,
          "Cache-Control": "public, max-age=31536000",
          "Access-Control-Allow-Origin": "*"
        });
        return res.end(imgBuffer);
      }
    } catch (err) {
      console.error("[Uploads Restore] Failed during lazy load restoration:", err);
    }
    next();
  });

  // Serve static uploaded files locally from disk as a fallback for standard directory requests
  app.use("/uploads", express.static(uploadsPath));

  const uploadMiddleware = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 100 * 1024 * 1024 }
  });

  // API Route: Cloudinary & Database Image and Video Upload
  app.post("/api/upload", uploadMiddleware.single("file"), async (req, res) => {
    try {
      let fileBuffer: Buffer | null = null;
      let originalFilename = "";
      let mimeType = "image/png";
      let base64String = "";

      if (req.file) {
        fileBuffer = req.file.buffer;
        originalFilename = req.file.originalname || "uploaded-asset";
        mimeType = req.file.mimetype || "image/png";
        base64String = req.file.buffer.toString("base64");
      } else if (req.body && req.body.data) {
        const data = req.body.data;
        originalFilename = req.body.filename || req.body.fileName || "uploaded-asset";
        base64String = data;

        if (typeof data === 'string' && data.startsWith("data:")) {
          const matches = data.match(/^data:([^;]+);base64,(.+)$/);
          if (matches && matches.length === 3) {
            mimeType = matches[1];
            base64String = matches[2];
          }
        }
        try {
          fileBuffer = Buffer.from(base64String, "base64");
        } catch (_) {}
      } else {
        return res.status(400).json({ error: "Missing file or data payload for upload." });
      }

      // Detect if video or image
      const isVideo = mimeType.startsWith("video/") || 
        /\.(mp4|mov|webm|avi|mkv|flv|wmv|m4v|ogv)$/i.test(originalFilename) ||
        req.body?.resource_type === "video";
      const resourceType: 'image' | 'video' = isVideo ? "video" : "image";

      const ext = mimeType.includes('/') ? mimeType.split('/')[1] : (isVideo ? 'mp4' : 'png');
      const cleanExt = ext.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || (isVideo ? 'mp4' : 'png');
      const uniqueId = `${isVideo ? 'vid' : 'img'}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
      const safeFileName = originalFilename && originalFilename.includes('.') ? originalFilename : `${uniqueId}.${cleanExt}`;

      let finalUrl = "";
      let isCloudinary = false;
      let cloudinaryPublicId = "";
      let fileSize = fileBuffer ? fileBuffer.length : (base64String ? Math.round(base64String.length * 0.75) : 0);

      // 1. Try uploading to Cloudinary
      try {
        const uploadPayload = fileBuffer || (dataUriOrBase64 => dataUriOrBase64.startsWith('data:') ? dataUriOrBase64 : `data:${mimeType};base64,${dataUriOrBase64}`)(base64String);
        const cldResult = await uploadToCloudinary(uploadPayload, {
          resourceType: isVideo ? "video" : "auto",
          fileName: safeFileName
        });

        if (cldResult && cldResult.secure_url) {
          finalUrl = cldResult.secure_url;
          isCloudinary = true;
          cloudinaryPublicId = cldResult.public_id;
          if (cldResult.bytes) fileSize = cldResult.bytes;
          console.log(`[API Upload] Successfully uploaded to Cloudinary: ${finalUrl} (resource_type: ${cldResult.resource_type})`);
        }
      } catch (cldErr: any) {
        console.warn("[API Upload] Cloudinary upload attempt failed or not configured, using database/local storage fallback:", cldErr.message);
      }

      // 2. Fallback to database/local disk storage if Cloudinary wasn't used or unavailable
      if (!finalUrl) {
        finalUrl = await saveUploadedImage(uniqueId, base64String, mimeType);
        // Write to uploads disk cache if writable
        try {
          const diskFile = path.join(uploadsPath, `${uniqueId}.${cleanExt}`);
          fs.writeFileSync(diskFile, Buffer.from(base64String, 'base64'));
        } catch (_) {}
      }

      // 3. PERSIST FILE RECORD TO DATABASE ('files' table in Neon Postgres)
      const sizeStr = fileSize > 1024 * 1024
        ? `${(fileSize / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.max(1, Math.round(fileSize / 1024))} KB`;

      const newFileDoc: FileEntry = {
        id: uniqueId,
        fileName: safeFileName,
        altText: safeFileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
        dateAdded: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        size: sizeStr,
        references: isVideo ? 'Video Section' : 'Storefront Media',
        url: finalUrl,
        resourceType: resourceType,
        format: cleanExt,
        cloudinaryPublicId: isCloudinary ? cloudinaryPublicId : undefined
      };

      try {
        const existingFiles = await fetchResource("files");
        const updatedFiles = [newFileDoc, ...(Array.isArray(existingFiles) ? existingFiles.filter(f => f.url !== finalUrl) : [])];
        await saveResource("files", updatedFiles);
        console.log(`[API Upload] Persisted file record to database: ${safeFileName} (${newFileDoc.id})`);
      } catch (dbErr) {
        console.warn("[API Upload] Failed to write file entry to files table:", dbErr);
      }

      res.json({
        url: finalUrl,
        secure_url: finalUrl,
        id: uniqueId,
        fileName: safeFileName,
        resource_type: resourceType,
        format: cleanExt,
        isCloudinary,
        cloudinaryPublicId: isCloudinary ? cloudinaryPublicId : undefined,
        file: newFileDoc
      });
    } catch (err: any) {
      console.error("[API Upload] Fail:", err);
      res.status(500).json({ error: err.message || "Failed to process upload" });
    }
  });

  // API Route: Image Provider / Streamer
  app.get("/api/images/:id", async (req, res) => {
    try {
      const rawId = req.params.id;
      const dotIndex = rawId.lastIndexOf(".");
      const cleanId = dotIndex !== -1 ? rawId.substring(0, dotIndex) : rawId;

      let imgDoc = await getUploadedImage(cleanId);
      if (!imgDoc && dotIndex !== -1) {
        imgDoc = await getUploadedImage(rawId);
      }

      if (!imgDoc) {
        return res.status(404).send("Image not found");
      }

      const imgBuffer = Buffer.from(imgDoc.base64Data, "base64");
      res.writeHead(200, {
        "Content-Type": imgDoc.mimeType || "image/png",
        "Content-Length": imgBuffer.length,
        "Cache-Control": "public, max-age=31536000",
        "Access-Control-Allow-Origin": "*"
      });
      res.end(imgBuffer);
    } catch (err: any) {
      console.error("[API Images] Server error serving asset document:", err);
      res.status(500).send("Internal server error serving media");
    }
  });

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/db-status", async (req, res) => {
    try {
      await getDb();
    } catch (e) {}
    res.json(getConnectionStatus());
  });

  app.get("/api/db-details", async (req, res) => {
    try {
      const details = await getDatabaseDetails();
      res.json(details);
    } catch (err: any) {
      console.error("[API db-details] Error fetching DB details:", err);
      res.status(500).json({ error: err.message || "Failed to fetch database details" });
    }
  });

  app.post("/api/update-db-uri", async (req, res) => {
    try {
      const { uri } = req.body;
      if (!uri) {
        return res.status(400).json({ error: "No connection string was provided." });
      }
      // Re-initialize with new DB URI
      updateDbUri(uri);
      
      // Attempt immediate connection check
      await getDb();
      
      res.json(getConnectionStatus());
    } catch (err: any) {
      console.error("[API update-db-uri] Error saving and testing URI:", err);
      res.status(500).json({ error: err.message || "Failed to update connection string" });
    }
  });

  // API Route: GET /api/layoutsettings
  app.get("/api/layoutsettings", async (req, res) => {
    try {
      const data = await fetchLayoutSettings();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to load layout settings" });
    }
  });

  // API Route: POST /api/layoutsettings
  app.post("/api/layoutsettings", async (req, res) => {
    try {
      const saved = await saveLayoutSettings(req.body);
      res.json({ status: "success", data: saved });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to save layout settings" });
    }
  });

  // Mount modular backend routers to handle storefront and admin entities properly
  app.use("/api/products", productsRouter);
  app.use("/api/collections", collectionsRouter);
  app.use("/api/orders", ordersRouter);
  app.use("/api/files", filesRouter);
  app.use("/api/customers", customersRouter);
  app.use("/api/discounts", discountsRouter);
  app.use("/api/custompages", customPagesRouter);
  app.use("/api/blogs", blogsRouter);
  app.use("/api/razorpay", razorpayRouter);
  app.use("/api/recyclebin", recycleBinRouter);
  app.use("/api/cloudinary", cloudinaryRouter);
  app.use("/api/developer-mode", developerModeRouter);

  // Serve placeholder.png directly from root workspace to handle all environments smoothly
  app.get("/placeholder.png", (req, res) => {
    res.sendFile(path.resolve(process.cwd(), "placeholder.png"));
  });

  // Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    const { createServer: createViteServer } = await import("vite");
    // Using "custom" appType so we can explicitly handle SPA fallback ourselves without Vite intercepting and returning 404s
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);

    // Fallback all other requests during development to index.html to support SPA routes
    app.get("*", async (req, res, next) => {
      const url = req.originalUrl;
      // Skip api paths and files with extensions (e.g. .js, .css, .png, etc.)
      const lastSegment = url.split('/').pop() || '';
      if (url.startsWith("/api") || lastSegment.includes(".")) {
        return next();
      }
      try {
        const fs = await import("fs");
        let html = fs.readFileSync(path.resolve(process.cwd(), "index.html"), "utf-8");
        html = await vite.transformIndexHtml(url, html);
        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      } catch (e) {
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    console.log(`[Production Setup] Static directory: ${distPath}`);
    app.use(express.static(distPath));
    
    // Fallback all other production requests to index.html to support SPA routing
    app.get('*', (req, res) => {
      const url = req.originalUrl;
      const lastSegment = url.split('/').pop() || '';
      if (url.startsWith("/api") || lastSegment.includes(".")) {
        return res.status(404).send("API or File Asset Not Found");
      }
      
      const indexPath = path.join(distPath, 'index.html');
      console.log(`[Production Fallback] Sending index.html for request: ${req.url}`);
      res.sendFile(indexPath, (err) => {
        if (err) {
          console.error(`[Production Fallback] Error sending index.html:`, err);
          res.status(500).send("Internal Server Error: Missing compiled static resources.");
        }
      });
    });
  }

  return app;
}
