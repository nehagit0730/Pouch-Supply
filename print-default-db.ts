import dotenv from "dotenv";
dotenv.config();
import { connectMongoose } from "./mongooseDb";

async function run() {
  const conn = await connectMongoose();
  if (conn) {
    console.log("Connected to database name:", conn.connection.name);
  } else {
    console.log("Failed to connect");
  }
  process.exit(0);
}
run();
