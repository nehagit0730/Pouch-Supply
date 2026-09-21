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

export async function createExpressApp() {
  const app = express();

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

  // API Route: Secure binary/base64 Image Storage
  app.post("/api/upload", async (req, res) => {
    try {
      const { data, filename } = req.body;
      if (!data) {
        return res.status(400).json({ error: "Missing data payload for upload." });
      }

      // Check if it's already a clean base64 dataURI
      let base64String = data;
      let mimeType = "image/png";

      if (data.startsWith("data:")) {
        const matches = data.match(/^data:([^;]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          mimeType = matches[1];
          base64String = matches[2];
        }
      }

      const id = `img-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
      const relativeUrl = await saveUploadedImage(id, base64String, mimeType);
      
      // Also write to disk cache if possible
      try {
        const ext = mimeType.includes('/') ? mimeType.split('/')[1] : 'png';
        const diskFile = path.join(uploadsPath, `${id}.${ext}`);
        fs.writeFileSync(diskFile, Buffer.from(base64String, 'base64'));
      } catch (e) {
        console.warn('Could not write uploaded image to disk:', e);
      }

      // Return relative URL /api/images/${id} so it renders seamlessly across ALL environments and domains
      console.log(`[API Upload] Successfully persisted ${mimeType} image with ID: ${id}. URL: ${relativeUrl}`);
      res.json({ url: relativeUrl, relativeUrl, id });
    } catch (err: any) {
      console.error("[API Upload] Fail:", err);
      res.status(500).json({ error: err.message || "Failed to process image upload database insertion" });
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
