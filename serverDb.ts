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
  getNeonStatus, testConnection, getNeonDetails, updateNeonUri,
  fetchResourceFromNeon, saveResourceToNeon,
  saveImageToNeon, getImageFromNeon,
  fetchLayoutSettingsFromNeon, saveLayoutSettingsToNeon,
  DbStatus
} from './neonDb';

// Re-export type
export type { DbStatus };

// In-Memory state fallback cache in case Neon Postgres is not connected or configuring
const memoryCache: Record<string, any[]> = {
  products: [...INITIAL_PRODUCTS],
  collections: [...INITIAL_COLLECTIONS],
  orders: [...INITIAL_ORDERS],
  files: [...INITIAL_FILES],
  customers: [...INITIAL_CUSTOMERS],
  discounts: [...INITIAL_DISCOUNTS],
  customPages: [...DEFAULT_PAGES],
  custompages: [...DEFAULT_PAGES],
  blogs: [...INITIAL_BLOGS],
};

export function getConnectionStatus(): DbStatus {
  return getNeonStatus();
}

export async function getDatabaseDetails(): Promise<any> {
  return getNeonDetails();
}

export function updateDbUri(newUri: string): DbStatus {
  return updateNeonUri(newUri);
}

// Backward compatibility alias for any existing caller
export function updateMongoUri(newUri: string): DbStatus {
  return updateNeonUri(newUri);
}

export async function getDb(): Promise<any | null> {
  const status = await testConnection();
  return status.status === 'connected' ? status : null;
}

// Global resource controllers that fetch from Neon Postgres or fallback to memory
export async function fetchResource(resource: string): Promise<any[]> {
  try {
    const neonData = await fetchResourceFromNeon(resource);
    if (neonData && Array.isArray(neonData)) {
      // Clean up legacy pouch / cans branding if present in custom pages
      let cleanedData = neonData;
      if (resource.toLowerCase() === 'custompages') {
        const jsonStr = JSON.stringify(neonData)
          .replace(/Pouch Supply Storefront/gi, 'Modern Storefront')
          .replace(/Pouch Supply/gi, 'StoreFront')
          .replace(/(\d+)\s+premium cans/gi, '$1 premium items')
          .replace(/price per can/gi, 'price per item')
          .replace(/additional can/gi, 'additional item')
          .replace(/extra can/gi, 'extra item')
          .replace(/FOR ANY ADDITIONAL CAN/gi, 'FOR ANY ADDITIONAL ITEM')
          .replace(/certified compounding premium brands/gi, 'certified premium brands');
        cleanedData = JSON.parse(jsonStr);
      }
      // Sync memory cache
      memoryCache[resource] = [...cleanedData];
      return cleanedData;
    }
  } catch (error: any) {
    console.error(`[fetchResource] Error fetching "${resource}" from Neon Postgres:`, error);
  }
  return memoryCache[resource] || [];
}

export async function saveResource(resource: string, list: any[]): Promise<any[]> {
  // Update local memory cache immediately
  memoryCache[resource] = [...list];

  try {
    await saveResourceToNeon(resource, list);
  } catch (error: any) {
    console.error(`[saveResource] Error saving "${resource}" to Neon Postgres:`, error);
  }
  return memoryCache[resource];
}

// Memory cache buffer for uploaded files when Neon Postgres is offline
const memoryImages: Record<string, { base64Data: string; mimeType: string }> = {};

export async function saveUploadedImage(id: string, base64Data: string, mimeType: string): Promise<string> {
  // Store in memory cache fallback
  memoryImages[id] = { base64Data, mimeType };

  // Sync to Neon Postgres database if connected
  try {
    await saveImageToNeon(id, base64Data, mimeType);
    console.log(`[Neon Postgres Sync] Successfully saved image to database for ID: ${id}`);
  } catch (error) {
    console.error("[Neon Postgres] Failed to save uploaded image in DB:", error);
  }

  // Return the direct streaming API URL
  return `/api/images/${id}`;
}

export async function getUploadedImage(rawId: string): Promise<{ base64Data: string; mimeType: string } | null> {
  if (!rawId) return null;
  // Handle paths like /api/images/img-123 or /uploads/img-123.png
  let id = rawId;
  if (id.includes('/')) {
    id = id.substring(id.lastIndexOf('/') + 1);
  }
  const dotIndex = id.lastIndexOf('.');
  const cleanId = dotIndex !== -1 ? id.substring(0, dotIndex) : id;

  // 1. Check local in-memory cache first
  if (memoryImages[id]) {
    return memoryImages[id];
  }
  if (memoryImages[cleanId]) {
    return memoryImages[cleanId];
  }

  // 2. Check Neon Postgres database
  try {
    let neonImage = await getImageFromNeon(id);
    if (!neonImage && cleanId !== id) {
      neonImage = await getImageFromNeon(cleanId);
    }
    if (neonImage) {
      memoryImages[id] = neonImage;
      memoryImages[cleanId] = neonImage;
      return neonImage;
    }
  } catch (error) {
    console.error("[Neon Postgres] Failed to load image from DB:", error);
  }

  // 3. Check local uploads folder on disk as a tertiary fallback
  try {
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      const matchedFile = files.find(f => f === id || f === cleanId || f.startsWith(cleanId + '.') || f.startsWith(id + '.'));
      if (matchedFile) {
        const filePath = path.join(uploadsDir, matchedFile);
        const buffer = fs.readFileSync(filePath);
        const base64Data = buffer.toString('base64');
        
        let mimeType = 'image/png';
        if (matchedFile.endsWith('.jpg') || matchedFile.endsWith('.jpeg')) mimeType = 'image/jpeg';
        else if (matchedFile.endsWith('.webp')) mimeType = 'image/webp';
        else if (matchedFile.endsWith('.svg')) mimeType = 'image/svg+xml';
        else if (matchedFile.endsWith('.gif')) mimeType = 'image/gif';
        else if (matchedFile.endsWith('.mp4')) mimeType = 'video/mp4';
        else if (matchedFile.endsWith('.webm')) mimeType = 'video/webm';

        const result = { base64Data, mimeType };
        memoryImages[id] = result;
        memoryImages[cleanId] = result;
        return result;
      }
    }
  } catch (err) {
    console.error("[Local Storage] Error reading file from disk fallback:", err);
  }

  return null;
}

export async function fetchLayoutSettings(): Promise<any> {
  const defaultSettings = {
    id: "layout_settings",
    headerLogoText: 'STOREFRONT',
    headerLogoSubtext: 'Premium Essentials',
    headerLogoImage: '',
    footerLogoText: 'STOREFRONT',
    footerLogoDescription: 'Curated premium eCommerce store delivering high-quality essentials directly to your door. Seamless online shopping, flexible subscriptions, and express tracked shipping.',
    footerLogoImage: '',
    klaviyoPublicKey: '',
    menuItems: [
      { id: '1', label: 'Home', tab: 'frontend-home', type: 'tab' },
      { id: '2', label: 'Subscribe', tab: 'frontend-subscribe', type: 'tab' },
      { id: '3', label: 'Shop Now', tab: 'frontend-shop', type: 'tab' },
      { id: '4', label: 'All Brands', tab: 'frontend-brands', type: 'tab' },
      { id: '5', label: 'About', tab: 'about', type: 'tab' }
    ]
  };

  const sanitizeSettings = (raw: any) => {
    if (!raw) return defaultSettings;
    const cleaned = { ...raw };
    if (!cleaned.headerLogoText || /pouch supply/i.test(cleaned.headerLogoText)) {
      cleaned.headerLogoText = 'STOREFRONT';
    }
    if (!cleaned.headerLogoSubtext || /premium nicotine/i.test(cleaned.headerLogoSubtext)) {
      cleaned.headerLogoSubtext = 'Premium Essentials';
    }
    if (!cleaned.footerLogoText || /pouch supply/i.test(cleaned.footerLogoText)) {
      cleaned.footerLogoText = 'STOREFRONT';
    }
    if (!cleaned.footerLogoDescription || /nicotine|canisters|pouch supply/i.test(cleaned.footerLogoDescription)) {
      cleaned.footerLogoDescription = 'Curated premium eCommerce store delivering high-quality essentials directly to your door. Seamless online shopping, flexible subscriptions, and express tracked shipping.';
    }
    return cleaned;
  };

  try {
    const fromNeon = await fetchLayoutSettingsFromNeon();
    if (fromNeon) {
      const sanitized = sanitizeSettings(fromNeon);
      if (sanitized.headerLogoText !== fromNeon.headerLogoText || sanitized.footerLogoDescription !== fromNeon.footerLogoDescription) {
        saveLayoutSettingsToNeon(sanitized).catch(() => {});
      }
      return sanitized;
    }
  } catch (error) {
    console.error("[serverDb] Failed to fetch layout settings from Neon, falling back to local file:", error);
  }

  // Fallback to reading file
  const filePath = path.join(process.cwd(), "layout_settings.json");
  if (fs.existsSync(filePath)) {
    try {
      const content = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(content);
      const sanitized = sanitizeSettings(parsed);
      saveLayoutSettingsToNeon(sanitized).catch(() => {});
      return sanitized;
    } catch (e) {
      console.warn("[serverDb] Failed fallback load of layout_settings.json:", e);
    }
  }

  return defaultSettings;
}

export async function saveLayoutSettings(settings: any): Promise<any> {
  const payload = { ...settings, id: "layout_settings" };
  
  // Write to local file as fallback
  try {
    const filePath = path.join(process.cwd(), "layout_settings.json");
    fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), "utf-8");
  } catch (e) {
    console.warn("[serverDb] Failed writing to layout_settings.json:", e);
  }

  try {
    await saveLayoutSettingsToNeon(payload);
    console.log("[serverDb] Successfully saved layout settings to Neon Postgres.");
  } catch (error) {
    console.error("[serverDb] Failed to save layout settings to Neon DB:", error);
  }

  return payload;
}
