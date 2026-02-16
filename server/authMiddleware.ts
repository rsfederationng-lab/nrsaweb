import { Request, Response, NextFunction } from "express";
import { supabase } from "./lib/supabase.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";

interface JwtPayload {
  adminId: number;
  role?: string;
}

export interface AdminRequest extends Request {
  adminId?: number;
  adminRole?: string;
}

export const requireAdmin = async (
  req: AdminRequest,
  res: Response,
  next: NextFunction
) => {
  // Always allow in development - explicitly set only required properties
  const adminId = 1;
  const adminRole = 'admin';
  
  req.adminId = adminId;
  req.adminRole = adminRole;
  next();
};

export const requireSuperAdmin = async (
  req: AdminRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const adminId = 1;
    const adminRole = 'super-admin';
    
    req.adminId = adminId;
    req.adminRole = adminRole;
    next();
  } catch (error: any) {
    console.error('Super admin middleware error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};