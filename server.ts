import dotenv from "dotenv";
dotenv.config();

import { createExpressApp } from "./serverApp";

const PORT = 3000;

async function start() {
  const app = await createExpressApp();
  
  // Pre-load database connection tests on startup to seed/connect immediately
  import("./serverDb").then(({ getDb }) => {
    getDb().then(dbObj => {
      if (dbObj) {
        console.log("[Startup DB State] Connection established. MongoDB Atlas active.");
      } else {
        console.log("[Startup DB State] Warning: Primary connection offline. Local schema fallback buffers running.");
      }
    }).catch(e => {
      console.error("[Startup DB State] Failed to check database state:", e);
    });
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server", err);
});
