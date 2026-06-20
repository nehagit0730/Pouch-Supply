import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { fetchResource, saveResource, saveUploadedImage, getUploadedImage, getConnectionStatus } from "./serverDb";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Set limits for payload uploads since products or media arrays can be large
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Logging middleware to inspect all incoming traffic
  app.use((req, res, next) => {
    console.log(`[Server Logging] ${req.method} ${req.url} | headers: ${JSON.stringify(req.headers['accept'] || '')}`);
    next();
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

  app.get("/api/db-status", (req, res) => {
    res.json(getConnectionStatus());
  });

  // Explicit mappings for all storefront and admin entities to keep the database and frontend fully synced
  const endpoints = [
    { name: "products", path: "/api/products" },
    { name: "collections", path: "/api/collections" },
    { name: "orders", path: "/api/orders" },
    { name: "files", path: "/api/files" },
    { name: "customers", path: "/api/customers" },
    { name: "discounts", path: "/api/discounts" },
    { name: "customPages", path: "/api/custompages" },
    { name: "blogs", path: "/api/blogs" }
  ];

  endpoints.forEach(({ name, path: routePath }) => {
    // Read route
    app.get(routePath, async (req, res) => {
      try {
        const data = await fetchResource(name);
        res.json(data);
      } catch (err: any) {
        console.error(`[API Server] Error routing GET for ${name}:`, err);
        res.status(500).json({ error: err.message || "Failed to fetch resource" });
      }
    });

    // Write/Sync route
    app.post(routePath, async (req, res) => {
      try {
        const payload = req.body;
        if (!Array.isArray(payload)) {
          return res.status(400).json({ error: "API expects schema to be an array of documents" });
        }
        const updated = await saveResource(name, payload);
        res.json(updated);
      } catch (err: any) {
        console.error(`[API Server] Error routing POST for ${name}:`, err);
        res.status(500).json({ error: err.message || "Failed to persist resource" });
      }
    });
  });

  // Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== "production") {
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server", err);
});
