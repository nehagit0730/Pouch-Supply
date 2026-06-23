import dotenv from "dotenv";
dotenv.config();

import { createExpressApp } from "./serverApp";

const PORT = 3000;

async function start() {
  const app = await createExpressApp();
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server", err);
});
