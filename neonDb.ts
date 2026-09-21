import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { 
  INITIAL_PRODUCTS, INITIAL_COLLECTIONS, INITIAL_ORDERS, INITIAL_FILES, 
  INITIAL_CUSTOMERS, INITIAL_DISCOUNTS, DEFAULT_PAGES, INITIAL_BLOGS 
} from './src/initialData';

dotenv.config();

export interface DbStatus {
  status: 'connected' | 'error' | 'not-configured' | 'pending';
  error?: string;
  uriHost?: string;
  databaseType: 'Neon Postgres';
}

let lastStatus: DbStatus = { status: 'pending', databaseType: 'Neon Postgres' };
let tablesInitialized = false;

export function getNeonUri(): string {
  const uri = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || process.env.POSTGRES_URL || '';
  return cleanUri(uri);
}

export function cleanUri(uri: string): string {
  if (!uri) return '';
  let cleaned = uri.trim();
  if ((cleaned.startsWith('"') && cleaned.endsWith('"')) || (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
    cleaned = cleaned.substring(1, cleaned.length - 1).trim();
  }
  return cleaned;
}

export function getHostFromUri(uri: string): string {
  try {
    const cleaned = cleanUri(uri);
    const sIndex = cleaned.indexOf('://');
    if (sIndex === -1) return '';
    const part = cleaned.substring(sIndex + 3);
    const atIndex = part.lastIndexOf('@');
    const hostWithQuery = atIndex !== -1 ? part.substring(atIndex + 1) : part;
    const slashIndex = hostWithQuery.indexOf('/');
    const hostPlusPort = slashIndex !== -1 ? hostWithQuery.substring(0, slashIndex) : hostWithQuery;
    const quesIndex = hostPlusPort.indexOf('?');
    return quesIndex !== -1 ? hostPlusPort.substring(0, quesIndex) : hostPlusPort;
  } catch (e) {
    return '';
  }
}

export function getSqlClient(): any {
  const uri = getNeonUri();
  if (!uri) return null;
  return neon(uri);
}

// Map resource names to PostgreSQL table names
export function getTableName(resource: string): string | null {
  const r = resource.toLowerCase();
  switch (r) {
    case 'products': return 'products';
    case 'collections': return 'collections';
    case 'orders': return 'orders';
    case 'files': return 'files';
    case 'customers': return 'customers';
    case 'discounts': return 'discounts';
    case 'custompages':
    case 'custom_pages': return 'custom_pages';
    case 'blogs': return 'blogs';
    default: return null;
  }
}

// Ensures all necessary Neon Postgres tables exist
export async function initTables(): Promise<boolean> {
  const sql = getSqlClient();
  if (!sql) return false;

  try {
    await sql.transaction([
      sql`CREATE TABLE IF NOT EXISTS products (id TEXT PRIMARY KEY, data JSONB NOT NULL, updated_at TIMESTAMPTZ DEFAULT NOW());`,
      sql`CREATE TABLE IF NOT EXISTS collections (id TEXT PRIMARY KEY, data JSONB NOT NULL, updated_at TIMESTAMPTZ DEFAULT NOW());`,
      sql`CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, data JSONB NOT NULL, updated_at TIMESTAMPTZ DEFAULT NOW());`,
      sql`CREATE TABLE IF NOT EXISTS files (id TEXT PRIMARY KEY, data JSONB NOT NULL, updated_at TIMESTAMPTZ DEFAULT NOW());`,
      sql`CREATE TABLE IF NOT EXISTS customers (id TEXT PRIMARY KEY, data JSONB NOT NULL, updated_at TIMESTAMPTZ DEFAULT NOW());`,
      sql`CREATE TABLE IF NOT EXISTS discounts (id TEXT PRIMARY KEY, data JSONB NOT NULL, updated_at TIMESTAMPTZ DEFAULT NOW());`,
      sql`CREATE TABLE IF NOT EXISTS custom_pages (id TEXT PRIMARY KEY, data JSONB NOT NULL, updated_at TIMESTAMPTZ DEFAULT NOW());`,
      sql`CREATE TABLE IF NOT EXISTS blogs (id TEXT PRIMARY KEY, data JSONB NOT NULL, updated_at TIMESTAMPTZ DEFAULT NOW());`,
      sql`CREATE TABLE IF NOT EXISTS uploaded_images (id TEXT PRIMARY KEY, base64_data TEXT NOT NULL, mime_type TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW());`,
      sql`CREATE TABLE IF NOT EXISTS layout_settings (id TEXT PRIMARY KEY, data JSONB NOT NULL, updated_at TIMESTAMPTZ DEFAULT NOW());`
    ]);

    tablesInitialized = true;
    lastStatus = {
      status: 'connected',
      databaseType: 'Neon Postgres',
      uriHost: getHostFromUri(getNeonUri())
    };
    return true;
  } catch (error: any) {
    console.error('[Neon Postgres] Failed to initialize tables:', error);
    lastStatus = {
      status: 'error',
      databaseType: 'Neon Postgres',
      uriHost: getHostFromUri(getNeonUri()),
      error: error?.message || String(error)
    };
    return false;
  }
}

export async function seedIfEmpty(): Promise<void> {
  const sql = getSqlClient();
  if (!sql) return;

  const seeds: { table: string; data: any[] }[] = [
    { table: 'products', data: INITIAL_PRODUCTS },
    { table: 'collections', data: INITIAL_COLLECTIONS },
    { table: 'orders', data: INITIAL_ORDERS },
    { table: 'files', data: INITIAL_FILES },
    { table: 'customers', data: INITIAL_CUSTOMERS },
    { table: 'discounts', data: INITIAL_DISCOUNTS },
    { table: 'custom_pages', data: DEFAULT_PAGES },
    { table: 'blogs', data: INITIAL_BLOGS },
  ];

  for (const { table, data } of seeds) {
    if (!data || data.length === 0) continue;
    try {
      const countRes = await sql.query(`SELECT COUNT(*)::int as count FROM ${table}`);
      const count = countRes && countRes[0] ? countRes[0].count : 0;
      if (count === 0) {
        console.log(`[Neon Postgres Seeding] Table "${table}" is empty. Seeding ${data.length} initial records...`);
        for (const item of data) {
          if (!item.id) continue;
          await sql.query(
            `INSERT INTO ${table} (id, data, updated_at) VALUES ($1, $2, NOW()) ON CONFLICT (id) DO NOTHING`,
            [item.id, JSON.stringify(item)]
          );
        }
      }
    } catch (e) {
      console.warn(`[Neon Postgres Seeding] Skipped seeding for ${table}:`, e);
    }
  }
}

export async function testConnection(): Promise<DbStatus> {
  const uri = getNeonUri();
  if (!uri) {
    lastStatus = {
      status: 'not-configured',
      databaseType: 'Neon Postgres'
    };
    return lastStatus;
  }

  const sql = getSqlClient();
  if (!sql) {
    lastStatus = {
      status: 'error',
      databaseType: 'Neon Postgres',
      error: 'Failed to create Neon client'
    };
    return lastStatus;
  }

  try {
    const res = await sql`SELECT NOW() as server_time, current_database() as db_name, version() as pg_version`;
    if (!tablesInitialized) {
      await initTables();
      await seedIfEmpty();
    }

    lastStatus = {
      status: 'connected',
      databaseType: 'Neon Postgres',
      uriHost: getHostFromUri(uri)
    };
    return lastStatus;
  } catch (error: any) {
    lastStatus = {
      status: 'error',
      databaseType: 'Neon Postgres',
      uriHost: getHostFromUri(uri),
      error: error?.message || String(error)
    };
    return lastStatus;
  }
}

export function getNeonStatus(): DbStatus {
  const uri = getNeonUri();
  if (!uri) {
    return {
      status: 'not-configured',
      databaseType: 'Neon Postgres'
    };
  }
  return {
    ...lastStatus,
    uriHost: getHostFromUri(uri)
  };
}

export async function getNeonDetails(): Promise<any> {
  const uri = getNeonUri();
  const host = getHostFromUri(uri);

  if (!uri) {
    return {
      status: 'not-configured',
      databaseType: 'Neon Postgres',
      uriHost: 'N/A',
      error: 'No Neon connection string found in environment variables (DATABASE_URL or NEON_DATABASE_URL).',
      tables: [],
      latencyMs: null
    };
  }

  const sql = getSqlClient();
  if (!sql) {
    return {
      status: 'error',
      databaseType: 'Neon Postgres',
      uriHost: host,
      error: 'Unable to initialize Neon SQL client.',
      tables: []
    };
  }

  const startTime = Date.now();
  try {
    const pingRes = await sql`SELECT current_database() as db_name, version() as pg_version, NOW() as current_time`;
    const latencyMs = Date.now() - startTime;

    if (!tablesInitialized) {
      await initTables();
      await seedIfEmpty();
    }

    const tableNames = ['products', 'collections', 'orders', 'files', 'customers', 'discounts', 'custom_pages', 'blogs', 'uploaded_images', 'layout_settings'];
    const tablesInfo: { name: string; count: number }[] = [];

    for (const t of tableNames) {
      try {
        const res = await sql.query(`SELECT COUNT(*)::int as count FROM ${t}`);
        tablesInfo.push({
          name: t,
          count: res && res[0] ? res[0].count : 0
        });
      } catch (err) {
        tablesInfo.push({ name: t, count: 0 });
      }
    }

    const dbName = pingRes && pingRes[0] ? pingRes[0].db_name : 'neondb';
    const pgVersion = pingRes && pingRes[0] ? pingRes[0].pg_version : 'PostgreSQL';

    return {
      status: 'connected',
      databaseType: 'Neon Postgres',
      uriHost: host,
      dbName,
      pgVersion,
      latencyMs,
      tables: tablesInfo,
      error: null
    };
  } catch (err: any) {
    return {
      status: 'error',
      databaseType: 'Neon Postgres',
      uriHost: host,
      error: err?.message || String(err),
      tables: [],
      latencyMs: null
    };
  }
}

export function updateNeonUri(newUri: string): DbStatus {
  const trimmed = cleanUri(newUri);
  process.env.DATABASE_URL = trimmed;
  process.env.NEON_DATABASE_URL = trimmed;

  // Persist to .env file
  try {
    const envPath = path.join(process.cwd(), '.env');
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    const regexDbUrl = /^DATABASE_URL\s*=\s*.*$/m;
    if (regexDbUrl.test(envContent)) {
      envContent = envContent.replace(regexDbUrl, `DATABASE_URL="${trimmed}"`);
    } else {
      envContent = `${envContent.trim()}\nDATABASE_URL="${trimmed}"\n`;
    }

    const regexNeon = /^NEON_DATABASE_URL\s*=\s*.*$/m;
    if (regexNeon.test(envContent)) {
      envContent = envContent.replace(regexNeon, `NEON_DATABASE_URL="${trimmed}"`);
    } else {
      envContent = `${envContent.trim()}\nNEON_DATABASE_URL="${trimmed}"\n`;
    }

    fs.writeFileSync(envPath, envContent.trim() + '\n', 'utf8');
    console.log('[Neon Postgres] Successfully persisted DATABASE_URL to /.env file');
  } catch (err) {
    console.warn('[Neon Postgres] Failed to save DATABASE_URL to /.env file:', err);
  }

  tablesInitialized = false;
  lastStatus = {
    status: 'pending',
    databaseType: 'Neon Postgres',
    uriHost: getHostFromUri(trimmed)
  };

  return lastStatus;
}

// Fetch all rows for a resource
export async function fetchResourceFromNeon(resource: string): Promise<any[] | null> {
  const tableName = getTableName(resource);
  if (!tableName) return null;

  const sql = getSqlClient();
  if (!sql) return null;

  try {
    if (!tablesInitialized) {
      await initTables();
    }
    const rows = await sql.query(`SELECT data FROM ${tableName} ORDER BY updated_at DESC`);
    if (rows && Array.isArray(rows)) {
      return rows.map((r: any) => typeof r.data === 'string' ? JSON.parse(r.data) : r.data);
    }
    return [];
  } catch (err) {
    console.error(`[Neon Postgres] Error fetching "${resource}":`, err);
    return null;
  }
}

// Save/Synchronize a resource collection
export async function saveResourceToNeon(resource: string, list: any[]): Promise<boolean> {
  const tableName = getTableName(resource);
  if (!tableName) return false;

  const sql = getSqlClient();
  if (!sql) return false;

  try {
    if (!tablesInitialized) {
      await initTables();
    }

    const activeIds = list.map(item => item.id).filter(Boolean);

    // Remove deleted items
    if (activeIds.length > 0) {
      await sql.query(
        `DELETE FROM ${tableName} WHERE NOT (id = ANY($1::text[]))`,
        [activeIds]
      );
    } else {
      await sql.query(`DELETE FROM ${tableName}`);
    }

    // Upsert items
    for (const item of list) {
      if (!item.id) continue;
      await sql.query(
        `INSERT INTO ${tableName} (id, data, updated_at)
         VALUES ($1, $2, NOW())
         ON CONFLICT (id) DO UPDATE SET
           data = EXCLUDED.data,
           updated_at = NOW()`,
        [item.id, JSON.stringify(item)]
      );
    }

    console.log(`[Neon Postgres] Successfully synchronized ${list.length} records in table "${tableName}".`);
    return true;
  } catch (err) {
    console.error(`[Neon Postgres] Error saving resource "${resource}":`, err);
    return false;
  }
}

// Image upload and stream handling
export async function saveImageToNeon(id: string, base64Data: string, mimeType: string): Promise<boolean> {
  const sql = getSqlClient();
  if (!sql) return false;

  try {
    if (!tablesInitialized) {
      await initTables();
    }
    await sql.query(
      `INSERT INTO uploaded_images (id, base64_data, mime_type, created_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (id) DO UPDATE SET
         base64_data = EXCLUDED.base64_data,
         mime_type = EXCLUDED.mime_type`,
      [id, base64Data, mimeType]
    );
    return true;
  } catch (err) {
    console.error(`[Neon Postgres] Error saving uploaded image ${id}:`, err);
    return false;
  }
}

export async function getImageFromNeon(id: string): Promise<{ base64Data: string; mimeType: string } | null> {
  const sql = getSqlClient();
  if (!sql) return null;

  try {
    if (!tablesInitialized) {
      await initTables();
    }
    const result: any = await sql.query(
      `SELECT base64_data, mime_type FROM uploaded_images WHERE id = $1 LIMIT 1`,
      [id]
    );
    const rows = Array.isArray(result) ? result : (result?.rows || []);
    if (rows && rows.length > 0) {
      return {
        base64Data: rows[0].base64_data,
        mimeType: rows[0].mime_type
      };
    }
    return null;
  } catch (err) {
    console.error(`[Neon Postgres] Error retrieving image ${id}:`, err);
    return null;
  }
}

// Layout settings
export async function fetchLayoutSettingsFromNeon(): Promise<any | null> {
  const sql = getSqlClient();
  if (!sql) return null;

  try {
    if (!tablesInitialized) {
      await initTables();
    }
    const rows = await sql.query(`SELECT data FROM layout_settings WHERE id = 'layout_settings' LIMIT 1`);
    if (rows && rows.length > 0) {
      const data = rows[0].data;
      return typeof data === 'string' ? JSON.parse(data) : data;
    }
    return null;
  } catch (err) {
    console.error('[Neon Postgres] Error fetching layout settings:', err);
    return null;
  }
}

export async function saveLayoutSettingsToNeon(settings: any): Promise<boolean> {
  const sql = getSqlClient();
  if (!sql) return false;

  try {
    if (!tablesInitialized) {
      await initTables();
    }
    const payload = { ...settings, id: 'layout_settings' };
    await sql.query(
      `INSERT INTO layout_settings (id, data, updated_at)
       VALUES ('layout_settings', $1, NOW())
       ON CONFLICT (id) DO UPDATE SET
         data = EXCLUDED.data,
         updated_at = NOW()`,
      [JSON.stringify(payload)]
    );
    return true;
  } catch (err) {
    console.error('[Neon Postgres] Error saving layout settings:', err);
    return false;
  }
}
