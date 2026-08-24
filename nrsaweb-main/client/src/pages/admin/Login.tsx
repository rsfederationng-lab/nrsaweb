import React from "react";
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

/**
 * Admin Login Component
 * 
 * Handles administrator authentication using JWT tokens.
 * 
 * Default Admin Credentials (auto-created on server startup):
 * - Email: admin@nrsa.com.ng
 * - Password: adminnrsa.passme5@00121
 * 
 * Authentication Flow:
 * 1. User enters email and password
 * 2. Sends POST request to /api/admin/login
 * 3. Backend validates credentials and returns JWT token (see server/auth.ts)
 * 4. Token is stored in localStorage as 'adminToken'
 * 5. Redirects to /admin-nrsa-dashboard
 * 6. AdminLayout checks for token on protected routes
 */
export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      console.log('Making request to: /api/admin/login');
      const res = await fetch('/api/admin/login', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const contentType = res.headers.get("content-type");
      const isJson = contentType?.includes("application/json");
      
      if (!res.ok) {
        if (isJson) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Login failed");
        } else {
          throw new Error(`Server error (${res.status}): ${res.statusText}`);
        }
      }
      
      if (!isJson) {
        throw new Error("Server returned invalid response format");
      }
      
      const data = await res.json();
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("admin", JSON.stringify(data.admin));
      window.location.href = "/admin-nrsa-dashboard";
    } catch (err: any) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError("Network error. Please check your connection.");
      } else {
        setError(err.message || "Invalid credentials. Please try again.");
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-32 p-6 border rounded-lg shadow-lg bg-card">
      <h1 className="text-2xl font-bold mb-4 text-foreground">Admin Login</h1>
      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded mb-4" role="alert">
          <p className="font-medium">Login Failed</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
            data-testid="input-admin-email"
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password" 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            data-testid="input-admin-password"
          />
        </div>
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
          data-testid="button-admin-login"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </Button>
      </form>
    </div>
  );
}
