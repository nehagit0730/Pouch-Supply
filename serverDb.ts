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
  fetchRecycleBinFromNeon, saveRecycleBinItemToNeon, deleteFromRecycleBinInNeon, clearRecycleBinInNeon,
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
  recycle_bin: [],
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
  const resKey = resource.toLowerCase();
  try {
    const neonData = await fetchResourceFromNeon(resource);
    if (neonData && Array.isArray(neonData) && neonData.length > 0) {
      let cleanedData = neonData;
      if (resKey === 'custompages') {
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

        // Ensure homepage has full aesthetic clothing sections requested by user
        const hpIdx = cleanedData.findIndex((p: any) => p.isHomepage || p.id === 'homepage' || p.slug === '');
        const defaultHp = DEFAULT_PAGES.find(p => p.isHomepage) || DEFAULT_PAGES[0];
        
        let needsSave = false;
        if (hpIdx === -1) {
          cleanedData.unshift(defaultHp);
          needsSave = true;
        } else {
          const hp = cleanedData[hpIdx];
          // If homepage has legacy single section or outdated placeholder, upgrade with default aesthetic clothing sections
          if (!hp.sections || hp.sections.length <= 1 || hp.sections.some((s: any) => s.settings?.title?.toLowerCase().includes('pouch supply') || s.settings?.title?.toLowerCase().includes('modern storefront'))) {
            cleanedData[hpIdx] = {
              ...hp,
              sections: [...defaultHp.sections]
            };
            needsSave = true;
          }
        }

        if (needsSave) {
          saveResourceToNeon(resource, cleanedData).catch(() => {});
        }
      }

      // Sync memory cache
      memoryCache[resource] = [...cleanedData];
      return cleanedData;
    } else {
      // If neonData is empty, fallback to initial aesthetic data and seed Neon
      if (resKey === 'products' && INITIAL_PRODUCTS.length > 0) {
        saveResourceToNeon(resource, INITIAL_PRODUCTS).catch(() => {});
        memoryCache[resource] = [...INITIAL_PRODUCTS];
        return INITIAL_PRODUCTS;
      }
      if (resKey === 'collections' && INITIAL_COLLECTIONS.length > 0) {
        saveResourceToNeon(resource, INITIAL_COLLECTIONS).catch(() => {});
        memoryCache[resource] = [...INITIAL_COLLECTIONS];
        return INITIAL_COLLECTIONS;
      }
      if (resKey === 'custompages' && DEFAULT_PAGES.length > 0) {
        saveResourceToNeon(resource, DEFAULT_PAGES).catch(() => {});
        memoryCache[resource] = [...DEFAULT_PAGES];
        return DEFAULT_PAGES;
      }
      if (resKey === 'blogs' && INITIAL_BLOGS.length > 0) {
        saveResourceToNeon(resource, INITIAL_BLOGS).catch(() => {});
        memoryCache[resource] = [...INITIAL_BLOGS];
        return INITIAL_BLOGS;
      }
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
    headerLogoText: 'JADE TAILOR',
    headerLogoSubtext: 'PERSONAL STYLIST',
    headerLogoImage: '',
    footerLogoText: 'JADE TAILOR',
    footerLogoDescription: 'Luxury personal styling, bespoke capsule curations, and private boutique shopping tours designed to elevate your effortless style.',
    footerLogoImage: '',
    klaviyoPublicKey: '',
    phone: '800 123 4444',
    address: '0665 Broadway NY, New York 10001 United States of America',
    email: 'jade@tailorand.com',
    menuItems: [
      { id: '1', label: 'HOME', tab: 'frontend-home', type: 'tab' },
      { id: '2', label: 'SHOP', tab: 'frontend-shop', type: 'tab' },
      { id: '3', label: 'WORK WITH ME', tab: '#appointment-section', type: 'tab' },
      { id: '4', label: 'MY SERVICES', tab: '#services-section', type: 'tab' },
      { id: '5', label: 'STYLING PACKAGES', tab: '#pricing-section', type: 'tab' },
      { id: '6', label: 'STYLE JOURNAL', tab: 'blogs', type: 'tab' }
    ]
  };

  const sanitizeSettings = (raw: any) => {
    if (!raw) return defaultSettings;
    const cleaned = { ...raw };
    if (!cleaned.headerLogoText || /pouch supply|storefront/i.test(cleaned.headerLogoText)) {
      cleaned.headerLogoText = 'JADE TAILOR';
    }
    if (!cleaned.headerLogoSubtext || /premium nicotine|premium essentials/i.test(cleaned.headerLogoSubtext)) {
      cleaned.headerLogoSubtext = 'PERSONAL STYLIST';
    }
    if (!cleaned.footerLogoText || /pouch supply|storefront/i.test(cleaned.footerLogoText)) {
      cleaned.footerLogoText = 'JADE TAILOR';
    }
    if (!cleaned.footerLogoDescription || /nicotine|canisters|pouch supply|curated premium ecommerce/i.test(cleaned.footerLogoDescription)) {
      cleaned.footerLogoDescription = 'Luxury personal styling, bespoke capsule curations, and private boutique shopping tours designed to elevate your effortless style.';
    }
    if (!cleaned.phone) cleaned.phone = '800 123 4444';
    if (!cleaned.address) cleaned.address = '0665 Broadway NY, New York 10001 United States of America';
    if (!cleaned.email) cleaned.email = 'jade@tailorand.com';

    // Filter out obsolete/fake placeholder links like 'frontend-brands', 'about', etc.
    if (Array.isArray(cleaned.menuItems)) {
      const sanitizedItems = cleaned.menuItems
        .filter((item: any) => item && item.tab !== 'about' && item.tab !== 'frontend-brands' && item.label !== 'All Brands' && item.label !== 'About')
        .map((item: any) => {
          if (item.tab === 'frontend-subscribe') {
            return { ...item, label: item.label === 'Subscribe' ? 'WORK WITH ME' : item.label, tab: '#appointment-section' };
          }
          return item;
        });

      if (sanitizedItems.length > 0) {
        cleaned.menuItems = sanitizedItems;
      } else {
        cleaned.menuItems = defaultSettings.menuItems;
      }
    } else {
      cleaned.menuItems = defaultSettings.menuItems;
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

// ----------------------------------------------------
// RECYCLE BIN CONTROLLERS (Neon DB + Local fallback)
// ----------------------------------------------------
const RECYCLE_BIN_FILE = path.join(process.cwd(), "recycle_bin.json");

function loadRecycleBinFromFile(): any[] {
  try {
    if (fs.existsSync(RECYCLE_BIN_FILE)) {
      const data = fs.readFileSync(RECYCLE_BIN_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn("[serverDb] Failed loading recycle_bin.json fallback:", e);
  }
  return [];
}

function persistRecycleBinToFile(items: any[]) {
  try {
    fs.writeFileSync(RECYCLE_BIN_FILE, JSON.stringify(items, null, 2), 'utf-8');
  } catch (e) {
    console.warn("[serverDb] Failed saving recycle_bin.json fallback:", e);
  }
}

export async function fetchRecycleBin(): Promise<any[]> {
  try {
    const neonItems = await fetchRecycleBinFromNeon();
    if (neonItems !== null) {
      memoryCache['recycle_bin'] = neonItems;
      persistRecycleBinToFile(neonItems);
      return neonItems;
    }
  } catch (err) {
    console.error("[serverDb] Failed to fetch recycle bin from Neon DB:", err);
  }

  // Fallback to disk / memory cache
  if (memoryCache['recycle_bin'].length === 0) {
    memoryCache['recycle_bin'] = loadRecycleBinFromFile();
  }
  return memoryCache['recycle_bin'];
}

export async function addToRecycleBin(items: Array<{
  id?: string;
  type: string;
  originalId: string;
  title: string;
  data: any;
  deletedAt?: string;
}>): Promise<any[]> {
  const current = await fetchRecycleBin();
  const formattedItems = items.map(item => ({
    id: item.id || `rb_${item.type}_${item.originalId}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    type: item.type,
    originalId: item.originalId,
    title: item.title || 'Untitled Item',
    deletedAt: item.deletedAt || new Date().toISOString(),
    data: item.data
  }));

  // Update in-memory & file
  const updated = [...formattedItems, ...current];
  memoryCache['recycle_bin'] = updated;
  persistRecycleBinToFile(updated);

  // Sync each item to Neon DB
  try {
    for (const item of formattedItems) {
      await saveRecycleBinItemToNeon(item);
    }
    console.log(`[Neon DB Recycle Bin] Persisted ${formattedItems.length} items to recycle_bin table.`);
  } catch (err) {
    console.error("[Neon DB Recycle Bin] Error syncing to DB:", err);
  }

  return updated;
}

export async function deleteFromRecycleBin(ids: string[]): Promise<any[]> {
  const current = await fetchRecycleBin();
  const remaining = current.filter(item => !ids.includes(item.id));
  memoryCache['recycle_bin'] = remaining;
  persistRecycleBinToFile(remaining);

  try {
    await deleteFromRecycleBinInNeon(ids);
    console.log(`[Neon DB Recycle Bin] Permanently deleted ${ids.length} items from recycle_bin table.`);
  } catch (err) {
    console.error("[Neon DB Recycle Bin] Error deleting from DB:", err);
  }

  return remaining;
}

export async function clearRecycleBin(): Promise<boolean> {
  memoryCache['recycle_bin'] = [];
  persistRecycleBinToFile([]);

  try {
    await clearRecycleBinInNeon();
    console.log("[Neon DB Recycle Bin] Cleared all items from recycle_bin table.");
    return true;
  } catch (err) {
    console.error("[Neon DB Recycle Bin] Error clearing DB table:", err);
    return false;
  }
}

export async function restoreFromRecycleBin(ids: string[]): Promise<{ restored: any[]; remaining: any[] }> {
  const current = await fetchRecycleBin();
  const toRestore = current.filter(item => ids.includes(item.id));
  const remaining = current.filter(item => !ids.includes(item.id));

  // Remove from recycle bin
  memoryCache['recycle_bin'] = remaining;
  persistRecycleBinToFile(remaining);

  try {
    await deleteFromRecycleBinInNeon(ids);
  } catch (err) {
    console.error("[Neon DB Recycle Bin] Error removing restored items from DB recycle bin:", err);
  }

  // Restore each item to its respective resource table
  for (const item of toRestore) {
    try {
      const type = item.type;
      if (type === 'product') {
        const prods = await fetchResource('products');
        if (!prods.some(p => p.id === item.originalId)) {
          await saveResource('products', [item.data, ...prods]);
        }
      } else if (type === 'collection') {
        const colls = await fetchResource('collections');
        if (!colls.some(c => c.id === item.originalId)) {
          await saveResource('collections', [item.data, ...colls]);
        }
      } else if (type === 'page') {
        const pages = await fetchResource('custompages');
        if (!pages.some(p => p.id === item.originalId)) {
          await saveResource('custompages', [item.data, ...pages]);
        }
      } else if (type === 'blog') {
        const blogs = await fetchResource('blogs');
        if (!blogs.some(b => b.id === item.originalId)) {
          await saveResource('blogs', [item.data, ...blogs]);
        }
      } else if (type === 'discount') {
        const discounts = await fetchResource('discounts');
        if (!discounts.some(d => d.id === item.originalId)) {
          await saveResource('discounts', [item.data, ...discounts]);
        }
      } else if (type === 'header_footer') {
        const settings = await fetchLayoutSettings();
        const currentItems = Array.isArray(settings.menuItems) ? settings.menuItems : [];
        if (!currentItems.some((m: any) => m.id === item.originalId)) {
          await saveLayoutSettings({
            ...settings,
            menuItems: [...currentItems, item.data]
          });
        }
      }
    } catch (restoreErr) {
      console.error(`[Recycle Bin] Failed restoring item ${item.id} to resource:`, restoreErr);
    }
  }

  return { restored: toRestore, remaining };
}

