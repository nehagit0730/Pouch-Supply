import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not set.");
    process.exit(1);
  }
  
  try {
    const conn = await mongoose.connect(uri);
    const adminDb = conn.connection.db?.admin();
    if (!adminDb) {
      console.error("No admin DB.");
      process.exit(1);
    }
    const dbsList = await adminDb.listDatabases();
    console.log("ALL DATABASES:");
    for (const d of dbsList.databases) {
      console.log(`Database name: [${d.name}], sizeOnDisk: ${d.sizeOnDisk}`);
      const tempConn = await mongoose.createConnection(uri, { dbName: d.name }).asPromise();
      const collections = await tempConn.db?.listCollections().toArray();
      console.log(`  Collections:`, collections?.map(c => c.name));
      await tempConn.close();
    }
  } catch (err: any) {
    console.error("Error:", err.message || err);
  }
  process.exit(0);
}
run();
