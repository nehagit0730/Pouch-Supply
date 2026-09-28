import dotenv from "dotenv";
dotenv.config();

import { createExpressApp } from "./serverApp";

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "production";
}

const PORT = Number(process.env.PORT) || 3000;

async function start() {
  const app = await createExpressApp();
  
  // Pre-load database connection tests on startup to seed/connect immediately
  import("./serverDb").then(({ getDb }) => {
    getDb().catch(() => {});
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server", err);
});
