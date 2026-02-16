# cPanel Production Deployment Guide
## NRSA (Nigeria Rope Skipping Association) - Split Frontend/Backend Deployment

This guide provides step-by-step instructions for deploying the NRSA application on cPanel with a **separated architecture**:
- **Frontend** (React/Vite static files) → `public_html` on main domain (`nrsa.com.ng`)
- **Backend** (Node.js/Express API) → Subdomain with Node.js App Manager (`api.nrsa.com.ng`)

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Deployment Architecture](#deployment-architecture)
3. [Step 1: Prepare Application for Production](#step-1-prepare-application-for-production)
4. [Step 2: Deploy Backend to Subdomain](#step-2-deploy-backend-to-subdomain)
5. [Step 3: Deploy Frontend to Main Domain](#step-3-deploy-frontend-to-main-domain)
6. [Step 4: Configure Environment Variables](#step-4-configure-environment-variables)
7. [Step 5: Initialize Database and Admin Account](#step-5-initialize-database-and-admin-account)
8. [Troubleshooting](#troubleshooting)
9. [Post-Deployment Checklist](#post-deployment-checklist)

---

## Prerequisites

Before starting deployment, ensure you have:

- ✅ cPanel account with **Node.js support** (CloudLinux-based hosting)
- ✅ Domain configured: `nrsa.com.ng`
- ✅ Ability to create subdomains (for `api.nrsa.com.ng`)
- ✅ SSH access (recommended but not required)
- ✅ PostgreSQL database created in cPanel
- ✅ Supabase account with storage bucket configured
- ✅ All environment variable values ready (see `.env.example`)

**Required cPanel Features:**
- Setup Node.js App (for backend)
- File Manager or FTP access
- PostgreSQL Database Manager
- DNS Zone Editor (for subdomain)

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      nrsa.com.ng                            │
│              (Main Domain - Frontend)                       │
│                                                             │
│  ┌──────────────────────────────────────┐                 │
│  │   public_html/                       │                 │
│  │   ├── index.html                     │                 │
│  │   ├── assets/                        │                 │
│  │   │   ├── index-xyz.js               │                 │
│  │   │   ├── index-abc.css              │                 │
│  │   │   └── logo.png                   │                 │
│  │   └── [Static React build files]     │                 │
│  └──────────────────────────────────────┘                 │
└─────────────────────────────────────────────────────────────┘
                         │
                         │ API Calls to:
                         │ https://api.nrsa.com.ng/api/*
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  api.nrsa.com.ng                            │
│             (Subdomain - Backend API)                       │
│                                                             │
│  ┌──────────────────────────────────────┐                 │
│  │   ~/nrsa-backend/                    │                 │
│  │   ├── dist/                          │                 │
│  │   │   └── server/                    │                 │
│  │   │       ├── index.js (entry)       │                 │
│  │   │       ├── routes.js              │                 │
│  │   │       ├── auth.js                │                 │
│  │   │       └── [Compiled backend]     │                 │
│  │   ├── package.json                   │                 │
│  │   ├── node_modules/ (server only)    │                 │
│  │   └── .env (environment secrets)     │                 │
│  └──────────────────────────────────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

**Key Points:**
- Frontend makes API requests to: `https://api.nrsa.com.ng/api/*`
- Backend runs on Node.js App Manager (Passenger-powered)
- Database and file storage are external (PostgreSQL + Supabase)

---

## Step 1: Prepare Application for Production

### 1.1 Update Frontend API Configuration

**CRITICAL:** The frontend must be configured to call the backend at the absolute URL.

Edit `client/src/lib/queryClient.ts`:

```typescript
// client/src/lib/queryClient.ts
import { QueryClient } from "@tanstack/react-query";

// ✅ PRODUCTION FIX: Use absolute API URL for split deployment
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? "https://api.nrsa.com.ng"  // Production: Backend subdomain
    : ""  // Development: Same origin (proxy)
  );

async function apiRequest(url: string, options?: RequestInit) {
  // Prepend API_BASE_URL for production
  const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url}`;
  
  // Retrieve JWT token from localStorage
  const token = localStorage.getItem("authToken");
  
  const response = await fetch(fullUrl, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

export { apiRequest };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const url = queryKey[0] as string;
        return apiRequest(url);
      },
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});
```

**Key Changes:**
- Added `API_BASE_URL` constant that uses `https://api.nrsa.com.ng` in production
- API requests now use the full URL instead of relative paths
- Supports optional `VITE_API_URL` environment variable for flexibility

### 1.2 Build Production Files

Run the build command on your local machine or development environment:

```bash
# Clean install dependencies
npm install

# Build frontend and backend
npm run build

# This creates:
# - dist/public/   (Frontend static files)
# - dist/server/   (Backend compiled JS)
```

**Output:**
- `dist/public/` → Deploy to `public_html/`
- `dist/server/` → Deploy to `~/nrsa-backend/dist/server/`

### 1.3 Create Deployment Package

**Backend Package (for subdomain):**
```bash
# Create backend deployment package
zip -r nrsa-backend.zip \
  dist/server/ \
  package.json \
  package-lock.json \
  .env.example \
  -x "node_modules/*"
```

**Frontend Package (for main domain):**
```bash
# Create frontend deployment package
cd dist/public
zip -r ../../nrsa-frontend.zip *
cd ../..
```

---

## Step 2: Deploy Backend to Subdomain

### 2.1 Create Subdomain for Backend API

1. **Login to cPanel**
2. Go to **Domains** → **Subdomains**
3. Click **Create A New Subdomain**
4. Configure:
   - Subdomain: `api`
   - Domain: `nrsa.com.ng`
   - Document Root: `/home/username/api.nrsa.com.ng` (auto-filled)
5. Click **Create**

**Result:** Subdomain `api.nrsa.com.ng` is now available.

### 2.2 Upload Backend Files

**Option A - File Manager (Recommended):**

1. Go to cPanel → **File Manager**
2. Navigate to `/home/username/` (home directory, NOT public_html)
3. Create new folder: `nrsa-backend`
4. Navigate into `nrsa-backend/`
5. Click **Upload** → Select `nrsa-backend.zip`
6. After upload, right-click ZIP → **Extract**
7. Delete the ZIP file after extraction

**Option B - FTP/SFTP:**
```bash
# Using FileZilla or similar FTP client
# Connect to: ftp.nrsa.com.ng
# Navigate to: /home/username/nrsa-backend/
# Upload: package.json, package-lock.json, dist/server/ folder
```

**Option C - SSH (Advanced):**
```bash
# Upload via SCP
scp nrsa-backend.zip username@nrsa.com.ng:~/nrsa-backend.zip

# SSH into server
ssh username@nrsa.com.ng
cd ~/nrsa-backend
unzip nrsa-backend.zip
rm nrsa-backend.zip
```

### 2.3 Configure Node.js Application in cPanel

1. **Go to cPanel → Software → Setup Node.js App**
2. Click **Create Application**
3. **Configure Application:**

| Field | Value | Notes |
|-------|-------|-------|
| **Node.js Version** | `20.x` or `18.x` | Use latest available LTS |
| **Application Mode** | `Production` | Critical for performance |
| **Application Root** | `/home/username/nrsa-backend` | OUTSIDE public_html |
| **Application URL** | `api.nrsa.com.ng` | Your backend subdomain |
| **Application Startup File** | `dist/server/index.js` | Compiled entry point |
| **Passenger Log File** | Default | For debugging |

4. Click **Create**

### 2.4 Install Backend Dependencies

**Via cPanel Interface:**

1. In **Setup Node.js App**, find your application
2. Click **Edit** (pencil icon)
3. Scroll down to **Detected configuration files**
4. Click **Run NPM Install** button
5. Wait for green success message (may take 2-5 minutes)

**Via SSH (Alternative):**
```bash
# SSH into server
ssh username@nrsa.com.ng

# Activate Node.js environment (replace with your actual path)
source /home/username/nodevenv/nrsa-backend/20/bin/activate

# Install production dependencies
cd ~/nrsa-backend
npm install --production
```

### 2.5 Verify Backend Deployment

1. In cPanel **Setup Node.js App**, check status shows **Running**
2. Test API endpoint in browser:
   ```
   https://api.nrsa.com.ng/api/hero-slides
   ```
3. Should return JSON array (empty `[]` or with data)

---

## Step 3: Deploy Frontend to Main Domain

### 3.1 Upload Frontend Files to public_html

1. **Go to cPanel → File Manager**
2. Navigate to `/home/username/public_html/`
3. **IMPORTANT:** Backup or delete existing files
4. Upload `nrsa-frontend.zip`
5. Right-click → **Extract**
6. Ensure files are extracted **directly** into `public_html/` (not a subfolder)

**Expected Structure:**
```
/home/username/public_html/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── logo-[hash].png
└── favicon.ico
```

### 3.2 Configure .htaccess for React Router

React Router requires all routes to be served through `index.html`. Create/edit `.htaccess`:

```apache
# /home/username/public_html/.htaccess

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Don't rewrite files or directories
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  
  # Rewrite everything else to index.html for React Router
  RewriteRule ^ index.html [L]
</IfModule>

# Cache static assets (1 year)
<FilesMatch "\.(jpg|jpeg|png|gif|ico|css|js|woff|woff2|ttf|svg)$">
  Header set Cache-Control "max-age=31536000, public"
</FilesMatch>

# Disable caching for HTML
<FilesMatch "\.(html)$">
  Header set Cache-Control "no-cache, no-store, must-revalidate"
  Header set Pragma "no-cache"
  Header set Expires 0
</FilesMatch>
```

### 3.3 Enable HTTPS (SSL Certificate)

1. Go to cPanel → **Security** → **SSL/TLS Status**
2. Select both domains:
   - `nrsa.com.ng`
   - `api.nrsa.com.ng`
3. Click **Run AutoSSL**
4. Wait for certificate installation (1-5 minutes)

**Verify:**
- Visit `https://nrsa.com.ng` (should load without warnings)
- Visit `https://api.nrsa.com.ng/api/hero-slides` (should return JSON)

---

## Step 4: Configure Environment Variables

### 4.1 Backend Environment Variables (api.nrsa.com.ng)

**Via cPanel Node.js App Manager:**

1. Go to **Setup Node.js App** → Click **Edit** on your backend app
2. Scroll to **Environment Variables** section
3. Add all required variables:

| Variable Name | Example Value | Description |
|--------------|---------------|-------------|
| `NODE_ENV` | `production` | **Required** - Enables production optimizations |
| `PORT` | `Auto-assigned` | Managed by Passenger automatically |
| `DATABASE_URL` | `postgresql://user:pass@localhost/nrsa_db` | PostgreSQL connection string |
| `JWT_SECRET` | `your-secure-random-string-here` | **Change this!** - Used for JWT tokens |
| `SUPABASE_URL` | `https://jrijjoszmlupeljifedk.supabase.co` | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGci...` | Backend Supabase key (service role) |
| `SUPABASE_ANON_KEY` | `eyJhbGci...` | Public Supabase key (optional for backend) |
| `ADMIN_EMAIL` | `admin@nrsa.com.ng` | Default admin account email |
| `ADMIN_PASSWORD` | `YourSecurePassword123!` | **Required** - Default admin password |
| `ADMIN_NAME` | `NRSA Administrator` | Default admin display name |

**Via .env File (SSH Alternative):**

```bash
# Create .env file in /home/username/nrsa-backend/
cat > .env << 'EOF'
NODE_ENV=production
DATABASE_URL=postgresql://user:password@localhost:5432/nrsa_db
JWT_SECRET=change-this-to-a-random-64-character-string
SUPABASE_URL=https://jrijjoszmlupeljifedk.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
ADMIN_EMAIL=admin@nrsa.com.ng
ADMIN_PASSWORD=SecurePassword123!
ADMIN_NAME=NRSA Administrator
EOF
```

**Security Notes:**
- ⚠️ **Never commit .env to Git**
- ⚠️ **Change JWT_SECRET** to a random 64+ character string
- ⚠️ **Use strong ADMIN_PASSWORD** (12+ characters, mixed case, numbers, symbols)

### 4.2 Frontend Environment Variables (Optional)

If you need to override the API URL, create `.env.production` before building:

```bash
# .env.production (in project root, before npm run build)
VITE_API_URL=https://api.nrsa.com.ng
```

Then rebuild:
```bash
npm run build
```

---

## Step 5: Initialize Database and Admin Account

### 5.1 Create PostgreSQL Database in cPanel

1. Go to cPanel → **Databases** → **PostgreSQL Databases**
2. **Create New Database:**
   - Database Name: `nrsa_production`
   - Click **Create Database**
3. **Create Database User:**
   - Username: `nrsa_user`
   - Password: (generate strong password)
   - Click **Create User**
4. **Add User to Database:**
   - Select user: `nrsa_user`
   - Select database: `nrsa_production`
   - Click **Add**
   - **Grant ALL PRIVILEGES** → Submit

5. **Get Connection String:**
   - Host: `localhost` (usually)
   - Port: `5432` (default)
   - Database: `cpanel_username_nrsa_production`
   - User: `cpanel_username_nrsa_user`
   - Password: (from step 3)

**Final DATABASE_URL:**
```
postgresql://cpanel_username_nrsa_user:password@localhost:5432/cpanel_username_nrsa_production
```

### 5.2 Push Database Schema

**Via SSH:**

```bash
# SSH into server
ssh username@nrsa.com.ng

# Activate Node.js environment
source /home/username/nodevenv/nrsa-backend/20/bin/activate

# Navigate to backend directory
cd ~/nrsa-backend

# Install Drizzle CLI if not in package.json
npm install -g drizzle-kit

# Push schema to database
npm run db:push

# If you get errors, force push
npm run db:push --force
```

**Expected Output:**
```
✓ Applying schema changes...
✓ Changes applied successfully!
```

### 5.3 Create Super Admin Account

**Via SSH (Recommended):**

```bash
# Ensure environment variables are set (especially ADMIN_PASSWORD)
export ADMIN_PASSWORD="YourSecurePassword123!"
export ADMIN_EMAIL="admin@nrsa.com.ng"
export ADMIN_NAME="NRSA Administrator"

# Run admin creation script
node dist/server/createAdmin.js
```

**Expected Output:**
```
✅ Super-admin account created successfully
   Email: admin@nrsa.com.ng
   Name: NRSA Administrator
```

**Verify Admin Login:**
1. Visit `https://nrsa.com.ng/admin/login`
2. Enter credentials:
   - Email: `admin@nrsa.com.ng`
   - Password: (the one you set in ADMIN_PASSWORD)
3. Should redirect to admin dashboard

---

## Step 6: Test Deployment

### 6.1 Frontend Tests

**Homepage:**
```
Visit: https://nrsa.com.ng
Expected: Hero section loads with images
```

**Navigation:**
- Click through: About, Events, Players, Clubs, News, Media, Contact
- All pages should load without errors

**Browser Console:**
- Open DevTools (F12) → Console
- Should have **NO red errors**
- API requests should go to `https://api.nrsa.com.ng/api/*`

### 6.2 Backend API Tests

**Public Endpoints (no auth required):**
```bash
curl https://api.nrsa.com.ng/api/hero-slides
curl https://api.nrsa.com.ng/api/news
curl https://api.nrsa.com.ng/api/events
curl https://api.nrsa.com.ng/api/players
```

**Expected:** JSON arrays (empty `[]` or with data)

**Admin Endpoints (requires auth):**
```bash
# Login and get token
curl -X POST https://api.nrsa.com.ng/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@nrsa.com.ng","password":"YourPassword"}'

# Should return:
# {"token":"eyJhbGci...","admin":{"id":1,"name":"NRSA Administrator",...}}
```

### 6.3 File Upload Test

1. Login to admin panel: `https://nrsa.com.ng/admin/login`
2. Go to **Media** section
3. Upload an image
4. Verify it appears in Supabase Storage bucket `nrsa-uploads`
5. Check if image displays on public media gallery

---

## Troubleshooting

### Issue: Frontend Loads But Shows 404 for API Requests

**Cause:** Frontend is still calling relative `/api/*` URLs instead of absolute `https://api.nrsa.com.ng/api/*`

**Solution:**
1. Verify `client/src/lib/queryClient.ts` has the updated code (see Step 1.1)
2. Rebuild frontend: `npm run build`
3. Re-upload `dist/public/` to `public_html/`
4. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

### Issue: Backend Returns "Cannot find package '@shared/schema'"

**Cause:** Path aliases not resolved at runtime.

**Solution:** Verify `package.json` start script:
```json
{
  "scripts": {
    "start": "cross-env NODE_ENV=production node -r tsconfig-paths/register dist/server/index.js"
  }
}
```

If `tsconfig-paths` is missing:
```bash
npm install --save-dev tsconfig-paths
```

### Issue: CORS Errors in Browser Console

**Cause:** Backend not allowing requests from frontend domain.

**Solution:** Add CORS middleware to backend (should already be configured):

```javascript
// server/index.ts (already included)
import cors from "cors";

app.use(cors({
  origin: ["https://nrsa.com.ng", "https://www.nrsa.com.ng"],
  credentials: true
}));
```

Rebuild and redeploy backend.

### Issue: Database Connection Failed

**Causes:**
1. Incorrect DATABASE_URL
2. Database user lacks permissions
3. PostgreSQL not running

**Solutions:**

**Check DATABASE_URL format:**
```
postgresql://username:password@host:port/database
```

**Test connection via SSH:**
```bash
psql "$DATABASE_URL"
```

**Grant permissions again in cPanel:**
- PostgreSQL Databases → Manage User Privileges → Grant ALL

### Issue: Node.js App Shows "Stopped" in cPanel

**Causes:**
1. Syntax error in compiled code
2. Missing environment variables
3. Port conflict

**Solutions:**

**Check Passenger log:**
1. cPanel → Setup Node.js App → Edit your app
2. Click **Show log file** link
3. Read error messages

**Restart application:**
1. Click **Restart** button (circular arrow)
2. Watch status change to "Running"

**View logs via SSH:**
```bash
tail -f ~/nrsa-backend/logs/passenger.log
```

### Issue: Admin Login Returns "Invalid credentials"

**Causes:**
1. Admin account not created
2. Wrong password
3. Database schema not pushed

**Solutions:**

**Recreate admin account:**
```bash
cd ~/nrsa-backend
export ADMIN_PASSWORD="NewSecurePassword123!"
node dist/server/createAdmin.js
```

**Verify database has admins table:**
```bash
psql "$DATABASE_URL" -c "SELECT email, role FROM admins;"
```

### Issue: File Uploads Return 503 Error

**Cause:** Supabase environment variables not set.

**Solution:**

1. Verify in cPanel Node.js App → Environment Variables:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
2. Restart Node.js application
3. Test upload again

**Create Supabase bucket if missing:**
1. Login to Supabase Dashboard
2. Go to **Storage**
3. Create new bucket: `nrsa-uploads`
4. Set **Public** access
5. Save

---

## Post-Deployment Checklist

### Security

- [ ] SSL certificates active for both domains
- [ ] `JWT_SECRET` changed from default
- [ ] `ADMIN_PASSWORD` is strong and unique
- [ ] `.env` file has correct permissions (600): `chmod 600 .env`
- [ ] Database user has minimum required privileges
- [ ] Supabase service role key secured (never exposed in frontend)

### Functionality

- [ ] Frontend loads at `https://nrsa.com.ng`
- [ ] All navigation links work
- [ ] Admin login works at `/admin/login`
- [ ] API endpoints respond at `https://api.nrsa.com.ng/api/*`
- [ ] File upload works (test in admin panel)
- [ ] Database queries return data
- [ ] Forms submit successfully

### Performance

- [ ] Static assets load from CDN or with cache headers
- [ ] Images are optimized (WebP format where possible)
- [ ] Gzip compression enabled in cPanel
- [ ] Browser console shows no errors
- [ ] Page load time < 3 seconds

### Monitoring

- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)
- [ ] Configure email alerts for downtime
- [ ] Schedule regular database backups
- [ ] Review Passenger logs weekly
- [ ] Monitor disk space usage

---

## Maintenance & Updates

### Updating Backend

1. Make changes locally
2. Run `npm run build` to compile
3. Upload new `dist/server/` to server
4. Restart Node.js app in cPanel
5. Test API endpoints

### Updating Frontend

1. Make changes locally
2. Update API URL if changed (client/src/lib/queryClient.ts)
3. Run `npm run build` to compile
4. Upload new `dist/public/` to `public_html/`
5. Hard refresh browser to see changes

### Database Migrations

```bash
# SSH into server
cd ~/nrsa-backend
source /home/username/nodevenv/nrsa-backend/20/bin/activate

# Run migration
npm run db:push
```

---

## Summary

**Frontend (nrsa.com.ng):**
- Located in: `/home/username/public_html/`
- Built with: `npm run build` → `dist/public/`
- Serves: Static React files
- Makes API calls to: `https://api.nrsa.com.ng/api/*`

**Backend (api.nrsa.com.ng):**
- Located in: `/home/username/nrsa-backend/`
- Entry point: `dist/server/index.js`
- Runs on: Node.js App Manager (Passenger)
- Serves: RESTful API endpoints
- Requires: Environment variables, PostgreSQL database

**Critical Connection:**
The frontend `queryClient.ts` file **MUST** use the absolute backend URL in production:
```typescript
const API_BASE_URL = import.meta.env.PROD 
  ? "https://api.nrsa.com.ng" 
  : "";
```

**Support:**
- Replit Environment: Development and testing
- cPanel Environment: Production hosting
- Database: PostgreSQL (cPanel) + Supabase Storage

---

**Last Updated:** November 10, 2025
**Version:** 1.0.0
**Author:** NRSA Development Team
