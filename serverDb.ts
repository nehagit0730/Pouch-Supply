import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

import { 
  INITIAL_PRODUCTS, INITIAL_COLLECTIONS, INITIAL_ORDERS, INITIAL_FILES, 
  INITIAL_CUSTOMERS, INITIAL_DISCOUNTS, DEFAULT_PAGES, INITIAL_BLOGS 
} from './src/initialData';

import {
  ProductModel, CollectionModel, OrderModel, FileModel,
  CustomerModel, DiscountModel, CustomPageModel, BlogModel,
  UploadedImageModel, connectMongoose, getMongooseStatus, resetConnection, DbStatus
} from './mongooseDb';

// Re-export type if needed
export type { DbStatus };

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

function getModelForResource(resource: string) {
  switch (resource) {
    case 'products': return ProductModel;
    case 'collections': return CollectionModel;
    case 'orders': return OrderModel;
    case 'files': return FileModel;
    case 'customers': return CustomerModel;
    case 'discounts': return DiscountModel;
    case 'customPages':
    case 'custompages': return CustomPageModel;
    case 'blogs': return BlogModel;
    default: return null;
  }
}

async function seedIfEmpty() {
  const seedPairs = [
    { model: ProductModel, name: 'products', data: INITIAL_PRODUCTS },
    { model: CollectionModel, name: 'collections', data: INITIAL_COLLECTIONS },
    { model: OrderModel, name: 'orders', data: INITIAL_ORDERS },
    { model: FileModel, name: 'files', data: INITIAL_FILES },
    { model: CustomerModel, name: 'customers', data: INITIAL_CUSTOMERS },
    { model: DiscountModel, name: 'discounts', data: INITIAL_DISCOUNTS },
    { model: CustomPageModel, name: 'customPages', data: DEFAULT_PAGES },
    { model: BlogModel, name: 'blogs', data: INITIAL_BLOGS },
  ];

  for (const pair of seedPairs) {
    try {
      const model = pair.model as any;
      const count = await model.countDocuments();
      if (count === 0 && pair.data && pair.data.length > 0) {
        console.log(`[Mongoose Seeding] Collection "${pair.name}" is empty. Seeding with ${pair.data.length} default items...`);
        // We clean documents from _id and other Mongoose-specific things to perform a clean insertMany
        await model.insertMany(pair.data.map(item => ({ ...item })));
      }
    } catch (e) {
      console.error(`[Mongoose Seeding] Failed to seed ${pair.name}:`, e);
    }
  }
}

export function getConnectionStatus(): DbStatus {
  return getMongooseStatus();
}

export async function getDatabaseDetails(): Promise<any> {
  try {
    const status = getMongooseStatus();
    
    if (status.status !== 'connected') {
      try {
        await connectMongoose();
      } catch (e) {}
    }
    
    const currentStatus = getMongooseStatus();
    const readyState = mongoose.connection.readyState;
    
    const details: any = {
      status: currentStatus.status,
      uriHost: currentStatus.uriHost || 'N/A',
      error: currentStatus.error || null,
      readyState,
      readyStateLabel: getReadyStateLabel(readyState),
      dbName: mongoose.connection.name || 'N/A',
      collections: [],
      models: Object.keys(mongoose.models),
    };

    if (readyState === 1 && mongoose.connection.db) {
      try {
        const db = mongoose.connection.db;
        const collectionsList = await db.listCollections().toArray();
        const collectionsInfo = [];
        for (const col of collectionsList) {
          const count = await db.collection(col.name).countDocuments();
          collectionsInfo.push({
            name: col.name,
            count
          });
        }
        details.collections = collectionsInfo;
      } catch (err: any) {
        details.collectionError = err.message || String(err);
      }
    }

    return details;
  } catch (err: any) {
    console.error("[Database Info] Error inside getDatabaseDetails:", err);
    return {
      status: 'error',
      uriHost: 'N/A',
      error: err.message || String(err),
      readyState: mongoose.connection.readyState,
      readyStateLabel: getReadyStateLabel(mongoose.connection.readyState),
      dbName: 'N/A',
      collections: [],
      models: []
    };
  }
}

function getReadyStateLabel(state: number): string {
  switch (state) {
    case 0: return 'Disconnected';
    case 1: return 'Connected';
    case 2: return 'Connecting';
    case 3: return 'Disconnecting';
    default: return 'Unknown';
  }
}

export function updateMongoUri(newUri: string): DbStatus {
  const trimmedUri = newUri.trim();
  process.env.MONGODB_URI = trimmedUri;

  // Persist the new connection string in the local .env file
  try {
    const envPath = path.join(process.cwd(), '.env');
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }
    
    const regex = /^MONGODB_URI\s*=\s*.*$/m;
    if (regex.test(envContent)) {
      envContent = envContent.replace(regex, `MONGODB_URI="${trimmedUri}"`);
    } else {
      envContent = `${envContent.trim()}\nMONGODB_URI="${trimmedUri}"\n`;
    }
    fs.writeFileSync(envPath, envContent.trim() + '\n', 'utf8');
    console.log('[Database Info] Successfully persisted MONGODB_URI configuration to /.env file');
  } catch (err) {
    console.warn("[Database Info] Failed to save MONGODB_URI to /.env configuration file:", err);
  }

  // Reset existing connections to force reconnect upon the next db call
  resetConnection();
  return getMongooseStatus();
}

export async function getDb(): Promise<any | null> {
  const conn = await connectMongoose();
  if (conn) {
    await seedIfEmpty();
    return conn.connection.db;
  }
  return null;
}

// Global resource controllers that fetch from Mongoose DB or fallback to memory
export async function fetchResource(resource: string): Promise<any[]> {
  const mongoUri = process.env.MONGODB_URI;
  try {
    const conn = await connectMongoose();
    const Model = getModelForResource(resource) as any;
    if (conn && Model) {
      const docs = await Model.find({}).lean().exec();
      // Remove Mongoose/Mongo specific identifiers to map clean object models for the front-end
      return docs.map((doc: any) => {
        const { _id, __v, ...cleanDoc } = doc;
        return cleanDoc;
      });
    } else if (mongoUri) {
      throw new Error("MongoDB is configured but connection failed.");
    }
  } catch (error: any) {
    console.error(`[fetchResource] Error fetching "${resource}":`, error);
    if (mongoUri) {
      throw new Error(`Database fetch failed for ${resource}: ${error.message || error}`);
    }
  }
  return memoryCache[resource] || [];
}

export async function saveResource(resource: string, list: any[]): Promise<any[]> {
  // Synchronously update local fallback cache
  memoryCache[resource] = [...list];

  const mongoUri = process.env.MONGODB_URI;
  try {
    const conn = await connectMongoose();
    const Model = getModelForResource(resource) as any;
    if (conn && Model) {
      const currentIds = list.map(item => item.id).filter(Boolean);
      console.log(`[saveResource] Syncing ${resource} collection. Total items in payload: ${list.length}. Active IDs:`, currentIds);
      
      // Delete items no longer in client list
      const deleteResult = await Model.deleteMany({ id: { $nin: currentIds } });
      if (deleteResult.deletedCount > 0) {
        console.log(`[saveResource] Permanently deleted ${deleteResult.deletedCount} items from ${resource} not in active client list.`);
      }
      
      // Upsert current items using replaceOne to avoid duplicate or outdated structures
      for (const item of list) {
        if (!item.id) continue;
        // Strip out any _id or __v fields to prevent "Performing an update on the path '_id' would modify the immutable field '_id'" error
        const { _id, __v, ...cleanItem } = item;
        await Model.replaceOne({ id: item.id }, cleanItem, { upsert: true });
      }
      console.log(`[saveResource] Successfully upserted and synchronized all ${list.length} items to ${resource} collection.`);
      return list;
    } else if (mongoUri) {
      throw new Error("MongoDB is configured but connection failed during save.");
    }
  } catch (error: any) {
    console.error(`[saveResource] Error during database synchronization for "${resource}":`, error);
    if (mongoUri) {
      throw new Error(`Database save failed for ${resource}: ${error.message || error}`);
    }
  }
  return memoryCache[resource];
}

// Memory cache buffer for uploaded files when MongoDB is offline
const memoryImages: Record<string, { base64Data: string; mimeType: string }> = {};

export async function saveUploadedImage(id: string, base64Data: string, mimeType: string): Promise<string> {
  memoryImages[id] = { base64Data, mimeType };

  try {
    const conn = await connectMongoose();
    if (conn) {
      const UploadedModel = UploadedImageModel as any;
      await UploadedModel.replaceOne(
        { id },
        { id, base64Data, mimeType },
        { upsert: true }
      );
    }
  } catch (error) {
    console.error("[Mongoose Engine] Failed to save uploaded image in DB:", error);
  }

  return `/api/images/${id}`;
}

export async function getUploadedImage(id: string): Promise<{ base64Data: string; mimeType: string } | null> {
  try {
    const conn = await connectMongoose();
    if (conn) {
      const UploadedModel = UploadedImageModel as any;
      const doc = await UploadedModel.findOne({ id }).lean().exec();
      if (doc) {
        return {
          base64Data: doc.base64Data,
          mimeType: doc.mimeType
        };
      }
    }
  } catch (error) {
    console.error("[Mongoose Engine] Failed to load image from DB:", error);
  }

  return memoryImages[id] || null;
}
