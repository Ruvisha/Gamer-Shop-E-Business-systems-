import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

/**
 * Default fallback image URL (high-quality gaming hardware photo)
 */
export const DEFAULT_FALLBACK_IMAGE = "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80";

/**
 * Validates if an image string is an HTTP/HTTPS URL
 */
/**
 * Validates if an image string is an HTTP/HTTPS URL
 */
export function isHttpUrl(str = "") {
  return typeof str === "string" && (str.startsWith("http://") || str.startsWith("https://"));
}

/**
 * Returns a valid web image URL from product data or fallback
 */
export function resolveImageUrl(imageUrl = "", fallback = "") {
  if (typeof imageUrl === "string" && imageUrl.trim()) {
    const trimmed = imageUrl.trim();
    if (
      trimmed.startsWith("/api/images/") ||
      trimmed.startsWith("/images/") ||
      trimmed.startsWith("http://") ||
      trimmed.startsWith("https://") ||
      trimmed.startsWith("data:")
    ) {
      return trimmed;
    }
  }
  if (typeof fallback === "string" && fallback.trim()) {
    return fallback.trim();
  }
  return DEFAULT_FALLBACK_IMAGE;
}

/**
 * Detects MIME content-type from file extension
 */
export function getContentTypeFromExt(filePathOrName = "", defaultType = "image/jpeg") {
  const ext = path.extname(filePathOrName).toLowerCase();
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml";
    case ".avif":
      return "image/avif";
    default:
      return defaultType;
  }
}


