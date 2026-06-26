import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { fetchResource, saveResource, saveUploadedImage, getUploadedImage, getConnectionStatus, updateMongoUri, getDb, getDatabaseDetails } from "./serverDb";

// Import modular routers for products, collections, customers, orders, files, discounts, custom pages, and blogs
import productsRouter from "./backend/routes/products";
import collectionsRouter from "./backend/routes/collections";
import ordersRouter from "./backend/routes/orders";
import filesRouter from "./backend/routes/files";
import customersRouter from "./backend/routes/customers";
import discountsRouter from "./backend/routes/discounts";
import customPagesRouter from "./backend/routes/customPages";
import blogsRouter from "./backend/routes/blogs";

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
      const imageUrl = await saveUploadedImage(id, base64String, mimeType);
      
      console.log(`[API Upload] Successfully persisted ${mimeType} image into MongoDB Atlas. ID: ${id}`);
      res.json({ url: imageUrl, id });
    } catch (err: any) {
      console.error("[API Upload] Fail:", err);
      res.status(500).json({ error: err.message || "Failed to process image upload database insertion" });
    }
  });

  // API Route: Image Provider / Streamer
  app.get("/api/images/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const imgDoc = await getUploadedImage(id);
      if (!imgDoc) {
        return res.status(404).send("Image not found");
      }

      const imgBuffer = Buffer.from(imgDoc.base64Data, "base64");
      res.writeHead(200, {
        "Content-Type": imgDoc.mimeType,
        "Content-Length": imgBuffer.length,
        "Cache-Control": "public, max-age=31536000" // Persistent browser caching
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
      // Re-initialize with new Mongo URI
      updateMongoUri(uri);
      
      // Attempt immediate connection check
      await getDb();
      
      res.json(getConnectionStatus());
    } catch (err: any) {
      console.error("[API update-db-uri] Error saving and testing URI:", err);
      res.status(500).json({ error: err.message || "Failed to update connection string" });
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

  // Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
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
