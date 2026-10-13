import mongoose from "mongoose";

const candidateURIs = [
  process.env.MONGODB_URI,
  "mongodb://127.0.0.1:27017/gamer_shop",
  "mongodb://localhost:27017/gamer_shop",
  "mongodb://0.0.0.0:27017/gamer_shop"
].filter(Boolean);

// Remove duplicates
const uniqueURIs = [...new Set(candidateURIs)];

let isConnecting = false;
let retryTimer = null;
let onConnectCallback = null;

export const setOnConnectCallback = (cb) => {
  onConnectCallback = cb;
};

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return true;
  }
  if (isConnecting) return false;
  isConnecting = true;

  for (const uri of uniqueURIs) {
    try {
      console.log(`[MongoDB] Attempting to connect to ${uri}...`);
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 4000,
        connectTimeoutMS: 5000,
        family: 4 // Prefer IPv4 to avoid Windows ::1 resolution conflicts
      });

      console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
      isConnecting = false;

      if (retryTimer) {
        clearInterval(retryTimer);
        retryTimer = null;
      }

      if (onConnectCallback) {
        try {
          await onConnectCallback();
        } catch (e) {
          console.warn("[MongoDB] onConnect callback error:", e.message);
        }
      }

      return true;
    } catch (err) {
      console.warn(`[MongoDB] Connection to ${uri} failed: ${err.message}`);
    }
  }

  isConnecting = false;
  console.error("[MongoDB] Could not connect to any candidate MongoDB URI.");
  console.warn("[MongoDB] Server running in resilient in-memory & local-image fallback mode.");

  // Schedule auto-retry in the background
  if (!retryTimer) {
    retryTimer = setInterval(() => {
      if (mongoose.connection.readyState !== 1 && !isConnecting) {
        console.log("[MongoDB] Background reconnect attempt...");
        connectDB();
      }
    }, 8000);
  }

  return false;
};

// Monitor connection state
mongoose.connection.on("disconnected", () => {
  console.warn("[MongoDB] Connection disconnected. Will attempt reconnect...");
  if (!retryTimer) {
    retryTimer = setInterval(() => {
      if (mongoose.connection.readyState !== 1 && !isConnecting) {
        connectDB();
      }
    }, 8000);
  }
});

mongoose.connection.on("error", (err) => {
  console.error("[MongoDB] Connection error event:", err.message);
});
