import { MongoClient, Db } from 'mongodb';
import { 
  INITIAL_PRODUCTS, INITIAL_COLLECTIONS, INITIAL_ORDERS, INITIAL_FILES, 
  INITIAL_CUSTOMERS, INITIAL_DISCOUNTS, DEFAULT_PAGES, INITIAL_BLOGS 
} from './src/initialData';

let client: MongoClient | null = null;
let db: Db | null = null;
let isConnecting = false;

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
  if (isConnecting) {
    return null;
  }

  try {
    isConnecting = true;
    console.log("[MongoDB] Attempting lazy-connection to Atlas...");
    client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 4000,
    });
    await client.connect();
    db = client.db();
    console.log("[MongoDB] Connected to database: ", db.databaseName);
    await seedIfEmpty(db);
    return db;
  } catch (error) {
    console.warn("[MongoDB] Atlas integration: Connection refused or failed. Using Server memory cache instead.", error);
    client = null;
    db = null;
    return null;
  } finally {
    isConnecting = false;
  }
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
