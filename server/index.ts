import "./config";

import express, { Request, Response, NextFunction } from "express";
import { createServer, Server } from "http";
import rateLimit from "express-rate-limit";
import cors from "cors";
import compression from "compression";
import { registerAllRoutes as registerRoutes } from "./routes";
import { registerAuthRoutes } from "./auth";
import { registerUploadRoutes } from "./upload";
import { setupVite, serveStatic, log } from "./vite";
import { createTables } from "./db";
import dns from "dns";

// Prefer IPv4 on cloud providers
dns.setDefaultResultOrder("ipv4first");

const app = express();

app.use(
  cors({
    origin: ["https://nrsa.com.ng", "https://www.nrsa.com.ng", "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options("*", cors());
// Preserve the exact Paystack payload for HMAC signature verification.
app.use("/api/store/paystack/webhook", express.raw({ type: "application/json", limit: "1mb" }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(compression());

// Security headers + API cache prevention
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  if (req.path.startsWith("/api/")) {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
  }
  next();
});

app.set("trust proxy", 1);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: process.env.NODE_ENV === "production" ? 300 : 1000,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  let body: any = null;
  const originalJson = res.json.bind(res);
  res.json = function (data: any) {
    body = data;
    return originalJson(data);
  };
  res.on("finish", () => {
    if (req.path.startsWith("/api")) {
      let line = `${req.method} ${req.path} ${res.statusCode} in ${Date.now() - start}ms`;
      if (body) line += ` :: ${JSON.stringify(body)}`;
      if (line.length > 80) line = line.slice(0, 79) + "…";
      console.log(line);
    }
  });
  next();
});

// JSON parse error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({ error: "Invalid JSON payload" });
  }
  next(err);
});

// Routes
registerAuthRoutes(app);
registerUploadRoutes(app);
registerRoutes(app);

// Production static serving
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (req.path === "/" || req.path.endsWith(".html")) {
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
    }
    next();
  });
  serveStatic(app);
}

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

const server: Server = createServer(app);
const PORT = parseInt(process.env.PORT || "5000");

(async () => {
  try {
    if (
      process.env.NODE_ENV === "production" &&
      (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY)
    ) {
      throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required in production");
    }

    await createTables();

    if (process.env.NODE_ENV === "development") {
      await setupVite(app, server);
    }

    server.listen(PORT, () => {
      log(`NRSA server running on port ${PORT}`);
    });
  } catch (error: any) {
    console.error("Server startup error:", error.message);
    process.exit(1);
  }
})();

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});
