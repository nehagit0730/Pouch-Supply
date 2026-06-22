import { MongoClient, Db } from 'mongodb';
import { 
  INITIAL_PRODUCTS, INITIAL_COLLECTIONS, INITIAL_ORDERS, INITIAL_FILES, 
  INITIAL_CUSTOMERS, INITIAL_DISCOUNTS, DEFAULT_PAGES, INITIAL_BLOGS 
} from './src/initialData';

let client: MongoClient | null = null;
let db: Db | null = null;
let connectPromise: Promise<Db | null> | null = null;

export interface DbStatus {
  status: 'connected' | 'error' | 'not-configured' | 'pending';
  error?: string;
  isSslAlert?: boolean;
}

let lastConnectionStatus: DbStatus = { status: 'pending' };

export function getConnectionStatus(): DbStatus {
  if (!process.env.MONGODB_URI) {
    return { status: 'not-configured' };
  }
  return lastConnectionStatus;
}

// In-Memory state fallback cache in case MongoDB is not connected
const memoryCache: Record<string, any[]> = {
  products: [...INITIAL_PRODUCTS],
  collections: [...INITIAL_COLLECTIONS],
  orders: [...INITIAL_ORDERS],
  files: [...INITIAL_FILES],
  customers: [...INITIAL_CUSTOMERS],
  discounts: [...INITIAL_DISCOUNTS],
  customPages: [...DEFAULT_PAGES],
  blogs: [...INITIAL_BLOGS],
};

async function seedIfEmpty(database: Db) {
  const seedPairs = [
    { key: 'products', colName: 'products', data: INITIAL_PRODUCTS },
    { key: 'collections', colName: 'collections', data: INITIAL_COLLECTIONS },
    { key: 'orders', colName: 'orders', data: INITIAL_ORDERS },
    { key: 'files', colName: 'files', data: INITIAL_FILES },
    { key: 'customers', colName: 'customers', data: INITIAL_CUSTOMERS },
    { key: 'discounts', colName: 'discounts', data: INITIAL_DISCOUNTS },
    { key: 'customPages', colName: 'customPages', data: DEFAULT_PAGES },
    { key: 'blogs', colName: 'blogs', data: INITIAL_BLOGS },
  ];

  for (const pair of seedPairs) {
    try {
      const collection = database.collection(pair.colName);
      const count = await collection.countDocuments();
      if (count === 0) {
        console.log(`[MongoDB Seeding] Connection is empty. Seeding collection "${pair.colName}" with default items...`);
        // Clean data of any custom fields and save to DB
        await collection.insertMany(pair.data.map(item => ({ ...item })));
      }
    } catch (e) {
      console.error(`[MongoDB Seeding] Failed to seed ${pair.colName}:`, e);
    }
  }
}

export async function getDb(): Promise<Db | null> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return null;
  }
  if (db) {
    return db;
  }
  if (connectPromise) {
    return connectPromise;
  }

  connectPromise = (async () => {
    try {
      console.log("[MongoDB] Attempting lazy-connection to Atlas...");
      client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 8000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
      });
      await client.connect();
      const connectedDb = client.db();
      console.log("[MongoDB] Connected to database: ", connectedDb.databaseName);
      await seedIfEmpty(connectedDb);
      db = connectedDb;
      lastConnectionStatus = { status: 'connected' };
      return db;
    } catch (error: any) {
      const errorStr = String(error);
      const isSslAlert = errorStr.includes("ssl3_read_bytes") || errorStr.includes("alert number 80") || errorStr.includes("ERR_SSL_");
      
      lastConnectionStatus = {
        status: 'error',
        error: errorStr,
        isSslAlert: isSslAlert
      };

      console.warn("\n============================================================");
      console.warn("[MongoDB] Atlas integration: Connection refused or failed. Using Server memory cache instead.");
      console.warn(`[MongoDB Error Detail]: ${errorStr}`);
      
      if (isSslAlert) {
        console.warn("\n⚠️  DETECTED MONGO ATLAS IP WHITELIST / TLS SECURITY ISSUE!");
        console.warn("This SSL 'alert number 80' or SSL alert internal error happens when MongoDB Atlas");
        console.warn("closes the connection because the client IP is not whitelisted.");
        console.warn("\n👉 TO FIX THIS:");
        console.warn("1. Log in to your MongoDB Atlas Dashboard.");
        console.warn("2. Go to 'Security' -> 'Network Access' on the left side menu.");
        console.warn("3. Click '+ Add IP Address'.");
        console.warn("4. Select 'ALLOW ACCESS FROM ANYWHERE' (adds 0.0.0.0/0) and click 'Confirm'.");
        console.warn("Wait 1 minute for Atlas to apply changes, then refresh/restart your app.");
      } else {
        console.warn("\nPlease verify your MONGODB_URI format in the environment config.");
      }
      console.warn("============================================================\n");
      
      client = null;
      db = null;
      connectPromise = null; // Clear so subsequent calls can retry the connection
      return null;
    }
  })();

  return connectPromise;
}

// Global resource controllers that fetch from DB or memory cache
export async function fetchResource(resource: string): Promise<any[]> {
  try {
    const database = await getDb();
    if (database) {
      const collection = database.collection(resource);
      const docs = await collection.find({}).toArray();
      // Remove mongo internal _id mapping to avoid issues on UI, keep pure client-facing objects
      return docs.map(doc => {
        const { _id, ...cleanDoc } = doc;
        return cleanDoc;
      });
    }
  } catch (error) {
    console.error(`[MongoDB] Error reading ${resource}:`, error);
  }
  return memoryCache[resource] || [];
}

export async function saveResource(resource: string, list: any[]): Promise<any[]> {
  // Always update our memoryCache copy as synchronous secondary layer
  memoryCache[resource] = [...list];

  try {
    const database = await getDb();
    if (database) {
      const collection = database.collection(resource);
      
      const currentIds = list.map(item => item.id).filter(Boolean);
      
      // Delete any items not in the incoming list
      await collection.deleteMany({ id: { $nin: currentIds } });
      
      // Bulk write matching items with upserts
      const bulkOps = list.map(item => ({
        replaceOne: {
          filter: { id: item.id },
          replacement: { ...item },
          upsert: true
        }
      }));

      if (bulkOps.length > 0) {
        await collection.bulkWrite(bulkOps);
      }
      return list;
    }
  } catch (error) {
    console.error(`[MongoDB] Error writing ${resource}:`, error);
  }
  return memoryCache[resource];
}

// In-Memory state fallback buffer for uploaded files when MongoDB is offline
const memoryImages: Record<string, { base64Data: string; mimeType: string }> = {};

export async function saveUploadedImage(id: string, base64Data: string, mimeType: string): Promise<string> {
  // Save in fallback memory
  memoryImages[id] = { base64Data, mimeType };

  try {
    const database = await getDb();
    if (database) {
      const collection = database.collection('uploaded_images');
      await collection.replaceOne(
        { id },
        { id, base64Data, mimeType },
        { upsert: true }
      );
    }
  } catch (error) {
    console.error("[MongoDB/saveUploadedImage] Failed to persist image in DB:", error);
  }

  return `/api/images/${id}`;
}

export async function getUploadedImage(id: string): Promise<{ base64Data: string; mimeType: string } | null> {
  try {
    const database = await getDb();
    if (database) {
      const collection = database.collection('uploaded_images');
      const doc = await collection.findOne({ id });
      if (doc) {
        return {
          base64Data: doc.base64Data,
          mimeType: doc.mimeType
        };
      }
    }
  } catch (error) {
    console.error("[MongoDB/getUploadedImage] Failed to read image from DB:", error);
  }

  return memoryImages[id] || null;
}

