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
export function isHttpUrl(str = "") {
  return typeof str === "string" && (str.startsWith("http://") || str.startsWith("https://"));
}

/**
 * Returns a valid web image URL from product data or fallback
 */
export function resolveImageUrl(imageUrl = "") {
  if (isHttpUrl(imageUrl)) {
    return imageUrl;
  }
  return DEFAULT_FALLBACK_IMAGE;
}

