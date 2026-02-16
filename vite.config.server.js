// vite.config.server.js

import { defineConfig } from "vite";
import path from "path";

// Force NODE_ENV to be set properly (instead of using .env)
process.env.NODE_ENV = process.env.NODE_ENV === "production" ? "production" : "development";

// Define the root directory
const rootDir = process.cwd();

// 🚀 Comprehensive Externalization List
// Keeps native Node modules and heavy libraries (like pg) out of the Vite bundle.
const allServerExternals = [
  // 🧱 Core Node Modules
  "fs", "path", "url", "http", "https", "stream", "zlib", "events",

  // ⚙️ Native / Database Modules (often cause ../pkg issues)
  "fsevents",
  "pg",
  "pg-native",
  "drizzle-orm/node-postgres",
  "bcrypt",

  // 📦 Third-Party Modules to stay externalized
  "express",
  "express-rate-limit",
  "jsonwebtoken",
  "multer",
  "dotenv",
];

// ✅ Server Config
export default defineConfig({
  // 🧠 SSR: Tell Vite this is a Node build
  ssr: {
    // Only include internal shared modules
    noExternal: [/@shared\/.*/],
  },

  // 🔗 Resolve Aliases
  resolve: {
    alias: {
      "@shared": path.resolve(rootDir, "shared"),
    },
  },

  // ⚙️ Build Settings
  build: {
    outDir: path.resolve(rootDir, "dist", "server"),
    emptyOutDir: true,
    ssr: true, // Explicitly mark this as a server build
    lib: {
      entry: path.resolve(rootDir, "server", "index.ts"),
      formats: ["es"],
      fileName: () => "index.js",
    },
    rollupOptions: {
      // 🚫 Externalize all problematic deps
      external: allServerExternals,

      // ⚡️ Handle the ../pkg issue gracefully
      onwarn(warning, warn) {
        // Ignore harmless warnings
        if (
          warning.code === "MODULE_PERFORMANCE_CHECK" ||
          warning.message.includes("externalized for browser compatibility") ||
          warning.message.includes("../pkg")
        ) {
          return;
        }
        warn(warning);
      },
    },
  },
});
