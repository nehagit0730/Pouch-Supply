import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { fetchLayoutSettingsFromNeon, saveResourceToNeon, fetchResourceFromNeon } from '../../neonDb';

import fs from 'fs';
import path from 'path';

// Check for Cloudinary configuration from process.env or database settings
export function configureCloudinary(customConfig?: { cloudName?: string; apiKey?: string; apiSecret?: string; cloudinaryUrl?: string }) {
  const cloudinaryUrl = customConfig?.cloudinaryUrl || process.env.CLOUDINARY_URL;
  const cloudName = customConfig?.cloudName || process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = customConfig?.apiKey || process.env.CLOUDINARY_API_KEY;
  const apiSecret = customConfig?.apiSecret || process.env.CLOUDINARY_API_SECRET;

  if (cloudinaryUrl && cloudinaryUrl.trim() !== '') {
    cloudinary.config({
      cloudinary_url: cloudinaryUrl.trim()
    });
    return true;
  }

  if (cloudName && apiKey && apiSecret) {
    cloudinary.config({
      cloud_name: cloudName.trim(),
      api_key: apiKey.trim(),
      api_secret: apiSecret.trim(),
      secure: true
    });
    return true;
  }

  return false;
}

export function disconnectCloudinary() {
  cloudinary.config({
    cloud_name: '',
    api_key: '',
    api_secret: '',
    cloudinary_url: ''
  });
}

export async function ensureCloudinaryConfigured(): Promise<boolean> {
  if (isCloudinaryConfigured()) return true;

  // 1. Try env vars
  if (configureCloudinary()) return true;

  // 2. Try fetching from Neon Postgres database
  try {
    const dbSettings = await fetchLayoutSettingsFromNeon();
    if (dbSettings && dbSettings.cloudinaryConfig) {
      if (configureCloudinary(dbSettings.cloudinaryConfig)) return true;
    }
  } catch (_) {}

  // 3. Try reading local layout_settings.json
  try {
    const localPath = path.join(process.cwd(), 'layout_settings.json');
    if (fs.existsSync(localPath)) {
      const raw = JSON.parse(fs.readFileSync(localPath, 'utf8'));
      if (raw && raw.cloudinaryConfig) {
        if (configureCloudinary(raw.cloudinaryConfig)) return true;
      }
    }
  } catch (_) {}

  return false;
}

// Initial configuration attempt from env
configureCloudinary();

export interface CloudinaryUploadResult {
  url: string;
  secure_url: string;
  public_id: string;
  format: string;
  resource_type: 'image' | 'video' | 'raw';
  bytes: number;
  width?: number;
  height?: number;
  duration?: number;
  isCloudinary: boolean;
}

export function isCloudinaryConfigured(): boolean {
  const config = cloudinary.config();
  return Boolean(config.cloud_name && (config.api_key || process.env.CLOUDINARY_URL));
}

export function getCloudinaryStatus() {
  const config = cloudinary.config();
  const configured = Boolean(config.cloud_name && (config.api_key || process.env.CLOUDINARY_URL));
  return {
    configured,
    cloudName: config.cloud_name || null,
    hasApiKey: Boolean(config.api_key),
    hasApiSecret: Boolean(config.api_secret),
    hasUrl: Boolean(process.env.CLOUDINARY_URL)
  };
}

/**
 * Uploads a file (base64 data URI, buffer, or remote URL) to Cloudinary.
 * If Cloudinary is not configured, it throws an informative error or returns null
 * so the caller can fall back to local/Neon Postgres database storage.
 */
export async function uploadToCloudinary(
  fileInput: string | Buffer,
  options?: {
    resourceType?: 'auto' | 'image' | 'video' | 'raw';
    folder?: string;
    publicId?: string;
    fileName?: string;
  }
): Promise<CloudinaryUploadResult | null> {
  await ensureCloudinaryConfigured();
  const configured = isCloudinaryConfigured();
  if (!configured) {
    return null;
  }

  const folder = options?.folder || 'jade_tailor_luxury_store';
  const resourceType = options?.resourceType || 'auto';

  try {
    let result: UploadApiResponse;

    if (Buffer.isBuffer(fileInput)) {
      // Stream buffer upload
      result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: resourceType,
            folder,
            public_id: options?.publicId,
            use_filename: true,
            unique_filename: true
          },
          (error, res) => {
            if (error) return reject(error);
            if (!res) return reject(new Error('Cloudinary returned empty response'));
            resolve(res);
          }
        );
        uploadStream.end(fileInput);
      });
    } else {
      // Base64 string or remote URL upload
      result = await cloudinary.uploader.upload(fileInput, {
        resource_type: resourceType,
        folder,
        public_id: options?.publicId,
        use_filename: true,
        unique_filename: true
      });
    }

    return {
      url: result.url,
      secure_url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      resource_type: (result.resource_type as any) || 'image',
      bytes: result.bytes,
      width: result.width,
      height: result.height,
      duration: result.duration,
      isCloudinary: true
    };
  } catch (error: any) {
    console.error('[Cloudinary Service] Upload failed:', error);
    throw error;
  }
}
