import dotenv from "dotenv";
dotenv.config();
import { connectMongoose } from "./mongooseDb";
import mongoose from "mongoose";

async function run() {
  const conn = await connectMongoose();
  if (!conn) {
    console.error("DB connection failed.");
    return;
  }
  
  const adminDb = conn.connection.db?.admin();
  if (!adminDb) {
    console.error("Could not access admin db.");
    return;
  }

  try {
    const dbsList = await adminDb.listDatabases();
    console.log("=== DATABASES FOUND ON THE CLUSTER ===");
    
    for (const dbInfo of dbsList.databases) {
      const dbName = dbInfo.name;
      if (["admin", "local", "config"].includes(dbName)) continue;

      console.log(`Database name: [${dbName}]`);
      const tempConn = await mongoose.createConnection(process.env.MONGODB_URI!, { dbName }).asPromise();
      const collections = await tempConn.db?.listCollections().toArray();
      
      if (collections) {
        for (const col of collections) {
          const count = await tempConn.db?.collection(col.name).countDocuments();
          console.log(`  Collection: "${col.name}" -> Count: ${count}`);
          
          if (count > 0) {
            // Find just one document, but ONLY print keys and types, or title/name if it exists, never the full object!
            const doc = await tempConn.db?.collection(col.name).findOne();
            if (doc) {
              const summaryKeys: string[] = [];
              const details: any = {};
              for (const [k, v] of Object.entries(doc)) {
                if (k === "_id" || k === "id" || k === "title" || k === "name" || k === "email" || k === "label") {
                  details[k] = v;
                } else {
                  summaryKeys.push(`${k} (${typeof v})`);
                }
              }
              console.log(`    Keys in collection "${col.name}": ${summaryKeys.join(", ")}`);
              console.log(`    Identifying info:`, JSON.stringify(details));
            }
          }
        }
      }
      await tempConn.close();
    }
  } catch (e: any) {
    console.error("Error summarizing databases:", e.message || e);
  }

  process.exit(0);
}
run();
