import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

/**
 * Resolves an image file from various disk locations.
 * Supports:
 * - Full path in originalUrl (e.g. C:\Users\MSI\Downloads\asus rtx 4090.jpg)
 * - Directory in originalUrl + filename (e.g. C:\Users\MSI\Downloads + asus rtx 4090.jpg)
 * - Full path in filename
 * - Filename in Downloads, Desktop, Pictures, or project Client/public, Server/uploads
 */
export function resolveLocalImage(originalUrl = "", filename = "") {
  const userProfile = process.env.USERPROFILE || "C:\\Users\\MSI";

  const candidates = [];

  const dataSubfolders = [
    "graphic cards", "processors", "memory", "motherboards",
    "storage", "liquid cooling", "power supplies", "pc cases"
  ];

  // 1. originalUrl + filename combined
  if (originalUrl && filename) {
    candidates.push(path.resolve(originalUrl, filename));
    candidates.push(path.join(originalUrl, filename));
  }

  // 2. originalUrl as a standalone path
  if (originalUrl && !originalUrl.startsWith("http://") && !originalUrl.startsWith("https://")) {
    candidates.push(path.resolve(originalUrl));
  }

  // 3. filename as an absolute or relative path
  if (filename) {
    candidates.push(path.resolve(filename));
    // Data directory subfolders
    for (const sub of dataSubfolders) {
      candidates.push(path.resolve(projectRoot, "..", "Data", sub, filename));
      candidates.push(path.resolve(projectRoot, "Data", sub, filename));
    }
    candidates.push(path.resolve(projectRoot, "..", "Data", filename));
    // Standard user folders
    candidates.push(path.join(userProfile, "Downloads", filename));
    candidates.push(path.join(userProfile, "Desktop", filename));
    candidates.push(path.join(userProfile, "Pictures", filename));
    // Workspace folders
    candidates.push(path.resolve(projectRoot, "Client", "public", filename));
    candidates.push(path.resolve(projectRoot, "Client", "public", "images", filename));
    candidates.push(path.resolve(projectRoot, "Client", "public", "images", `${filename}.jpg`));
    candidates.push(path.resolve(projectRoot, "Client", "public", "images", `${filename}.png`));
    candidates.push(path.resolve(projectRoot, "Server", "uploads", filename));
    candidates.push(path.resolve(projectRoot, "Server", "data", filename));
    candidates.push(path.resolve(projectRoot, filename));
  }

  for (const candidate of candidates) {
    if (!candidate) continue;
    try {
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
        return candidate;
      }
    } catch {
      // Ignore filesystem permission errors on individual candidate paths
    }
  }

  return null;
}

/**
 * Detects MIME content-type from file extension or fallback.
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
    case ".ico":
      return "image/x-icon";
    case ".bmp":
      return "image/bmp";
    default:
      return defaultType;
  }
}

/**
 * Downloads image buffer from HTTP/HTTPS URL
 */
export async function fetchRemoteImage(url) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (res.ok) {
      const arrayBuffer = await res.arrayBuffer();
      const contentType = res.headers.get("content-type") || getContentTypeFromExt(url, "image/jpeg");
      return { buffer: Buffer.from(arrayBuffer), contentType };
    }
  } catch (err) {
    console.warn(`[Image Helper] Failed to fetch image from URL (${url}):`, err.message);
  }
  return null;
}
