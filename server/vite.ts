import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config.js";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const clientRoot = path.resolve(import.meta.dirname, "..", "client");
  
  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    root: clientRoot,
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "..", "client", "src"),
        "@shared": path.resolve(import.meta.dirname, "..", "shared"),
        "@assets": path.resolve(import.meta.dirname, "..", "attached_assets"),
      },
    },
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    if (req.originalUrl.startsWith("/api/")) {
      return next();
    }

    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

// Serve React build files and handle SPA routing
export function serveStatic(app: Express) {
    const distPath = path.resolve(process.cwd(), "public_html");

    // Serve static files with NO caching
    app.use(express.static(distPath, {
        etag: false,
        lastModified: false,
        maxAge: 0,
        cacheControl: false,
        setHeaders: (res, filePath) => {
            res.setHeader("Cache-Control", "no-store");
            if (filePath.endsWith(".js")) {
                res.setHeader("Content-Type", "application/javascript");
            } else if (filePath.endsWith(".css")) {
                res.setHeader("Content-Type", "text/css");
            }
        }
    }));

    // SPA fallback (also no caching)
    app.get("*", (req, res, next) => {
        if (req.path.startsWith("/api/")) {
            return next();
        }
        res.setHeader("Cache-Control", "no-store");
        res.sendFile(path.join(distPath, "index.html"));
    });
}

