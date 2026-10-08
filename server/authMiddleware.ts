import { Request, Response, NextFunction } from "express";
import { supabase } from "./lib/supabase.js";
import { storage } from "./storage.js";

export interface AdminRequest extends Request {
  adminId?: number;
  adminRole?: string;
}

export const requireAdmin = async (
  req: AdminRequest,
  res: Response,
  next: NextFunction,
) => authenticateAdmin(req, res, next, false);

export const requireSuperAdmin = async (
  req: AdminRequest,
  res: Response,
  next: NextFunction,
) => authenticateAdmin(req, res, next, true);

async function authenticateAdmin(
  req: AdminRequest,
  res: Response,
  next: NextFunction,
  superAdminOnly: boolean,
) {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length).trim()
    : "";

  if (!token) return res.status(401).json({ error: "Authentication required" });
  if (!supabase) return res.status(503).json({ error: "Authentication service unavailable" });

  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user?.email) {
      return res.status(401).json({ error: "Invalid authentication token" });
    }

    const admin = await storage.getAdminByEmail(data.user.email);
    if (!admin || (superAdminOnly && admin.role !== "super-admin")) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    req.adminId = admin.id;
    req.adminRole = admin.role;
    return next();
  } catch (error: any) {
    console.error("Admin authentication error:", error.message);
    return res.status(401).json({ error: "Authentication failed" });
  }
}
