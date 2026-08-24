// server/registerRoutes.ts
import { Express } from "express";
import { registerAllRoutes } from "./routes.js";

/**
 * Main route registration function.
 * Registers all API routes including CRUD operations for all entities.
 * This is called from server/index.ts during application startup.
 */
export function registerRoutes(app: Express): void {
  registerAllRoutes(app);
  
  app.get("/api/test", (_req, res) => {
    res.json({ message: "Routes working" });
  });
}