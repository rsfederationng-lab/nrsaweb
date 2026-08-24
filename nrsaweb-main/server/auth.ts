import { Express } from "express";
import { supabase } from "./lib/supabase";
import { storage } from "./storage";

export function registerAuthRoutes(app: Express) {
  // Validate Supabase client initialization
  console.log('Supabase client validation:', {
    initialized: !!supabase,
    hasAuth: !!(supabase?.auth),
    hasFrom: !!(supabase?.from)
  });
  
  /**
   * Admin Login with Supabase
   */
  app.post("/api/admin/login", async (req, res) => {
    console.log("Login endpoint hit:", req.method, req.path);
    console.log("Content-Type:", req.headers['content-type']?.replace(/[\r\n]/g, ''));
    console.log("Request body keys:", Object.keys(req.body || {}));
    
    if (!supabase) {
      console.error("Supabase not configured");
      return res.status(500).json({ error: "Authentication service unavailable" });
    }
    
    const { email, password } = req.body;
    
    try {
      console.log("Attempting Supabase auth with:", { email: email?.replace(/[\r\n]/g, ''), password: password ? '[REDACTED]' : 'undefined' });
      // Supabase does ALL the hard work!
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      console.log("Supabase auth result:", { data: data ? 'success' : 'null', error: error?.message?.replace(/[\r\n]/g, '') });

      if (error) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Get additional admin info from your database using EMAIL (not ID)
      console.log("Querying admins table for email:", data.user.email);
      const adminData = await storage.getAdminByEmail(data.user.email!);

      console.log("Admin query result:", { adminData });

      if (!adminData) {
        console.error("Admin record not found for:", data.user.email);
        return res.status(403).json({ error: "Admin account not found in database" });
      }

      console.log("Login successful, sending JSON response");
      // Return everything to frontend
      res.json({
        token: data.session?.access_token, // JWT token from Supabase
        admin: {
          id: adminData.id, // Use the admins table ID (serial integer)
          email: data.user.email,
          name: adminData.name,
          role: adminData.role
        }
      });
      
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Server error" });
    }
  });

  /**
   * Verify Supabase environment variables
   */
  app.get("/api/env-check", (req, res) => {
    try {
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      const anonKey = process.env.SUPABASE_ANON_KEY;
      
      res.json({
        SUPABASE_URL: !!process.env.SUPABASE_URL,
        SUPABASE_SERVICE_ROLE_KEY: !!serviceKey,
        SUPABASE_ANON_KEY: !!anonKey,
        supabase_url_value: process.env.SUPABASE_URL?.substring(0, 20) + '...',
        service_key_valid: serviceKey ? serviceKey.split('.').length === 3 : false,
        anon_key_valid: anonKey ? anonKey.split('.').length === 3 : false,
        service_key_length: serviceKey?.length || 0,
        anon_key_length: anonKey?.length || 0
      });
    } catch (error: any) {
      console.error('Environment check error:', error.message);
      res.status(500).json({ error: 'Failed to check environment variables' });
    }
  });

  /**
   * Check Supabase authentication configuration
   */
  app.get("/api/auth-check", async (req, res) => {
    try {
      if (!supabase) {
        return res.json({ status: "error", message: "Supabase not configured" });
      }
      
      // Test auth service availability
      const { data, error } = await supabase.auth.getSession();
      res.json({
        status: "success",
        auth_service: "available",
        session_check: error ? error.message?.replace(/[\r\n]/g, '') : "working"
      });
    } catch (err: any) {
      console.error('Auth check error:', err.message);
      res.status(500).json({ status: "error", message: "Auth service check failed" });
    }
  });

  /**
   * Debug Supabase connection issues
   */
  app.get("/api/debug-supabase", async (req, res) => {
    const debug: any = {
      client_initialized: !!supabase,
      env_vars: {
        url: !!process.env.SUPABASE_URL,
        key: !!process.env.SUPABASE_SERVICE_ROLE_KEY
      },
      tests: {}
    };
    
    if (!supabase) {
      return res.json({ ...debug, error: "Supabase client not initialized" });
    }
    
    // Test 1: Basic connection
    try {
      const { error } = await supabase.from('admins').select('count').limit(0);
      (debug.tests as any).database = error ? error.message : "connected";
    } catch (err: any) {
      (debug.tests as any).database = `error: ${err.message}`;
    }
    
    // Test 2: Auth service
    try {
      const { error } = await supabase.auth.getSession();
      (debug.tests as any).auth = error ? error.message : "available";
    } catch (err: any) {
      (debug.tests as any).auth = `error: ${err.message}`;
    }
    
    res.json(debug);
  });

  /**
   * Check if user is logged in (middleware)
   */
  app.get("/api/admin/me", async (req, res) => {
    // Skip token validation in development
    if (process.env.NODE_ENV === 'development') {
      return res.json({ admin: { id: 1, email: 'admin@nrsa.com.ng', role: 'admin' } });
    }
    
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: "No token" });
    }

    if (!supabase) {
      return res.status(500).json({ error: "Authentication service unavailable" });
    }

    try {
      const { data, error } = await supabase.auth.getUser(token);
      if (error || !data.user) {
        return res.status(401).json({ error: "Invalid token" });
      }
      res.json({ admin: data.user });
    } catch (err: any) {
      console.error('Token validation error:', err?.message || err);
      return res.status(401).json({ error: "Token validation failed" });
    }
  });
}