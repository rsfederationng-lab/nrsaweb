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
import { initializeSupabase } from "./lib/supabase";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";


// Create Express app
const app = express();
app.use(cors({
    origin: ['https://nrsa.com.ng', 'https://www.nrsa.com.ng', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors()); // Enable preflight for all routes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    if (req.path.startsWith('/api/')) {
        // Prevent ALL caching for API routes - critical for real-time data updates
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.setHeader('Surrogate-Control', 'no-store');
    }
    next();
});
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof SyntaxError && 'body' in err) {
        return res.status(400).json({ error: 'Invalid JSON payload' });
    }
    next(err);
});
app.set("trust proxy", 1);

// Rate limiter - more generous in development
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: process.env.NODE_ENV === 'production' ? 300 : 1000,
    standardHeaders: true,
    legacyHeaders: false,
}));

// Logging middleware
// ... (Logging middleware code is fine)
app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    let jsonResponse: any = null;

    // Keep original json method
    const originalJson = res.json.bind(res);

    // Override json
    res.json = function (body: any) {
        jsonResponse = body;
        return originalJson(body); // Only pass the body
    };

    res.on("finish", () => {
        if (req.path.startsWith("/api")) {
            let logLine = `${req.method} ${req.path} ${res.statusCode} in ${Date.now() - start}ms`;
            if (jsonResponse) logLine += ` :: ${JSON.stringify(jsonResponse)}`;
            if (logLine.length > 80) logLine = logLine.slice(0, 79) + "…";
            console.log(logLine);
        }
    });

    next();
});

// ... (All imports, app setup, rate limiter, and logging middleware are fine)

// API routes first
registerAuthRoutes(app);
registerUploadRoutes(app);
registerRoutes(app);

// Serve React build in production
if (process.env.NODE_ENV === "production") {
    // Add no-cache headers for HTML files to prevent stale content
    app.use((req, res, next) => {
        if (req.path === '/' || req.path.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
        }
        next();
    });
    serveStatic(app);
}

// Error handling last
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
});

// Create HTTP server (This line remains)
const server: Server = createServer(app);

// Start server - Replit uses port 5000 for web preview
const PORT = parseInt(process.env.PORT || "5000");

(async () => {
    try {
        await createTables();

        // Temporary Supabase Connection Check
        const checkUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
        const checkKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_KEY;

        if (checkUrl && checkKey) {
            try {
                const tempSupabase = createClient(checkUrl, checkKey);
                const { error } = await tempSupabase.from('news').select('id').limit(1);

                if (error) {
                    const msg = `❌ CRITICAL: Supabase connection failed. Check .env credentials. Error: ${error.message}`;
                    console.error(msg);
                    try { fs.writeFileSync(path.join(process.cwd(), 'startup_check.log'), msg); } catch (e) { }
                } else {
                    const msg = '✅ NRSA System Online: Supabase connection verified locally.';
                    console.log(msg);
                    try { fs.writeFileSync(path.join(process.cwd(), 'startup_check.log'), msg); } catch (e) { }
                }
            } catch (err: any) {
                const msg = '❌ CRITICAL: Supabase connection failed. Check .env credentials.';
                console.error(msg);
                try { fs.writeFileSync(path.join(process.cwd(), 'startup_check.log'), msg); } catch (e) { }
            }
        } else {
            const msg = '❌ CRITICAL: Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env';
            console.error(msg);
            try { fs.writeFileSync(path.join(process.cwd(), 'startup_check.log'), msg); } catch (e) { }
        }

        if (process.env.NODE_ENV === "development") {
            await setupVite(app, server);
        }

        server.listen(PORT, () => {
            log(`Server running on port ${PORT}`);
        });
    } catch (error: any) {
        console.error('Server startup error:', error.message);
        process.exit(1);
    }
})();

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Force server restart again.