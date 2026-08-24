// vite.config.vercel.js
// Builds the Express server as a single bundle for Vercel serverless function
// Output goes to api/server.js which api/index.js re-exports

import { defineConfig } from "vite";
import path from "path";

process.env.NODE_ENV = "production";
const rootDir = process.cwd();

const allServerExternals = [
  // Core Node modules
  "fs", "path", "url", "http", "https", "stream", "zlib", "events", "os",
  "crypto", "buffer", "util", "net", "tls", "dns", "child_process", "worker_threads",
  // Native / Database Modules
  "fsevents", "pg", "pg-native", "pg-pool", "drizzle-orm", "drizzle-orm/node-postgres",
  "bcrypt", "bcryptjs",
  // NPM packages to stay external (present in node_modules on Vercel)
  "express", "express-rate-limit", "cors", "compression", "multer", "multer-s3",
  "jsonwebtoken", "dotenv", "@supabase/supabase-js", "resend",
  "@google/generative-ai", "@aws-sdk/client-s3",
  "connect-pg-simple", "express-session", "passport", "passport-local",
  "nodemailer", "drizzle-zod", "zod", "drizzle-kit",
];

export default defineConfig({
  ssr: {
    noExternal: [/@shared\/.*/],
  },
  resolve: {
    alias: {
      "@shared": path.resolve(rootDir, "shared"),
    },
  },
  build: {
    outDir: path.resolve(rootDir, "api"),
    emptyOutDir: false, // Don't wipe api/index.ts!
    ssr: true,
    lib: {
      entry: path.resolve(rootDir, "server", "index.ts"),
      formats: ["es"],
      fileName: () => "server.js",
    },
    rollupOptions: {
      external: allServerExternals,
      onwarn(warning, warn) {
        if (
          warning.code === "MODULE_PERFORMANCE_CHECK" ||
          warning.message.includes("externalized for browser compatibility") ||
          warning.message.includes("../pkg")
        ) return;
        warn(warning);
      },
    },
  },
});
