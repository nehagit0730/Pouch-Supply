import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

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
    case 'customPages': return CustomPageModel;
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
    }
  } catch (error) {
    console.error(`[Mongoose Engine] Reading ${resource} completed using fallback mechanism:`, error);
  }
  return memoryCache[resource] || [];
}

export async function saveResource(resource: string, list: any[]): Promise<any[]> {
  // Synchronously update local fallback cash
  memoryCache[resource] = [...list];

  try {
    const conn = await connectMongoose();
    const Model = getModelForResource(resource) as any;
    if (conn && Model) {
      const currentIds = list.map(item => item.id).filter(Boolean);
      
      // Delete items no longer in client list
      await Model.deleteMany({ id: { $nin: currentIds } });
      
      // Upsert current items using replaceOne to avoid duplicate or outdated structures
      for (const item of list) {
        if (!item.id) continue;
        await Model.replaceOne({ id: item.id }, { ...item }, { upsert: true });
      }
      return list;
    }
  } catch (error) {
    console.error(`[Mongoose Engine] Writing ${resource} completed using fallback mechanism:`, error);
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
