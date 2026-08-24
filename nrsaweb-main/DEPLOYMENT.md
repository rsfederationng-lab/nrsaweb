# Production Deployment Guide for cPanel

This guide provides step-by-step instructions for deploying the NRSA application to a cPanel hosting environment.

## Prerequisites

- cPanel hosting account with Node.js support (Node.js 20.x or higher)
- SSH access to your hosting account
- PostgreSQL database access
- Domain configured and pointing to your cPanel hosting

## Project Structure

The project consists of:
- **Backend**: Node.js + Express + TypeScript (compiled to `dist/`)
- **Frontend**: React + Vite (built to `dist/public/`)
- **Database**: PostgreSQL with Drizzle ORM

## Deployment Steps

### 1. Build the Application Locally

Before deploying, build both the backend and frontend:

```bash
# Build the backend (TypeScript → JavaScript)
npm run build:backend

# Build the frontend (React → Static files)
npm run build:frontend
```

This will create:
- `dist/` - Compiled backend JavaScript files
- `dist/public/` - Static frontend files (created during frontend build)

### 2. Prepare Your cPanel Environment

#### 2.1 Set Up Node.js Application in cPanel

1. Log into cPanel
2. Navigate to "Setup Node.js App"
3. Create new application with these settings:
   - **Node.js version**: 20.x (or latest LTS)
   - **Application mode**: Production
   - **Application root**: `/home/yourusername/nrsa` (or your preferred directory)
   - **Application URL**: Your domain (e.g., `nrsa.com.ng`)
   - **Application startup file**: `dist/index.js`
   - **Environment variables**: (Add these in the next step)

#### 2.2 Configure Environment Variables

In the Node.js App settings, add these environment variables:

```env
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
ADMIN_EMAIL=admin@nrsa.com.ng
ADMIN_PASSWORD=your-secure-password-here
ADMIN_NAME=Super Administrator
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
```

**Optional** (if using Supabase for file uploads):
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
VITE_SUPABASE_KEY=your-anon-public-key
```

> **Important**: Generate a strong JWT_SECRET (at least 32 characters). You can use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### 3. Upload Files to cPanel

#### Option A: Via File Manager

1. Compress your project folder (excluding `node_modules`)
2. Upload the zip file via cPanel File Manager
3. Extract in your application root directory

#### Option B: Via Git (Recommended)

1. SSH into your cPanel account
2. Clone your repository:
```bash
cd ~/nrsa
git clone https://github.com/yourusername/your-repo.git .
```

#### Option C: Via FTP/SFTP

Upload these folders/files:
- `dist/` (entire folder with backend and frontend)
- `node_modules/` (or run `npm install` on server)
- `package.json`
- `package-lock.json`
- `migrations/` (if using database migrations)
- `shared/` (shared TypeScript types)

### 4. Install Dependencies

SSH into your server and run:

```bash
cd ~/nrsa
npm install --production
```

> **Note**: The `--production` flag skips dev dependencies

### 5. Set Up PostgreSQL Database

#### 5.1 Create Database in cPanel

1. Navigate to "PostgreSQL Databases" in cPanel
2. Create a new database (e.g., `nrsa_db`)
3. Create a database user with a secure password
4. Add the user to the database with ALL PRIVILEGES

#### 5.2 Push Database Schema

SSH into your server and run:

```bash
cd ~/nrsa
npm run db:push --force
```

This will create all necessary tables and columns.

### 6. Start the Application

1. In cPanel Node.js App manager, click "Start" or "Restart"
2. The application will start on the configured port (10000 by default)
3. cPanel will automatically proxy requests from your domain to the Node.js app

### 7. Verify Deployment

#### 7.1 Test API Endpoints

```bash
# Test server is running
curl https://nrsa.com.ng/api/test

# Expected response:
{"message":"Routes working"}

# Test hero slides endpoint
curl https://nrsa.com.ng/api/hero-slides

# Expected response: JSON array (empty or with data)
```

#### 7.2 Test Admin Login

```bash
curl -X POST https://nrsa.com.ng/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@nrsa.com.ng","password":"your-admin-password"}'

# Expected response:
{"token":"jwt-token-here","admin":{"id":1,"name":"Super Administrator","email":"admin@nrsa.com.ng","role":"super-admin"}}
```

#### 7.3 Test Frontend

Open your browser and navigate to:
- Main site: `https://nrsa.com.ng`
- Admin login: `https://nrsa.com.ng/admin/login`

### 8. Troubleshooting

#### Server Not Starting

Check the application logs in cPanel Node.js App manager. Common issues:

1. **Missing environment variables**
   - Verify all required env vars are set
   - Check for typos in variable names

2. **Database connection failed**
   - Verify DATABASE_URL is correct
   - Ensure PostgreSQL user has proper permissions
   - Test connection: `psql -h localhost -U username -d database_name`

3. **Port already in use**
   - Change PORT in environment variables
   - Restart the application

#### Frontend Shows 404 Errors

1. Ensure `dist/public/` folder exists and contains `index.html`
2. Run `npm run build:frontend` before uploading
3. Restart the Node.js application

#### API Routes Return HTML Instead of JSON

This should be fixed in the latest code. The `vite.ts` file now correctly skips `/api/*` routes in the SPA fallback. If you still see this issue:

1. Verify you're running the latest code from `dist/index.js`
2. Check that API routes are registered before the static file middleware
3. Clear browser cache and test with curl

#### File Upload Not Working

If you see "Supabase credentials not found" warning:

1. File uploads require Supabase configuration
2. Add Supabase environment variables (see step 2.2)
3. Create a `nrsa-uploads` bucket in Supabase Storage (set to public)
4. Restart the application

## Maintenance

### Updating the Application

1. Build locally: `npm run build:backend && npm run build:frontend`
2. Upload new `dist/` folder to server
3. Restart the Node.js application in cPanel

### Database Migrations

When schema changes:

```bash
cd ~/nrsa
npm run db:push --force
```

### Monitoring Logs

1. Check Node.js App logs in cPanel
2. Monitor for errors and warnings
3. Set up email alerts for application errors (optional)

## Security Checklist

- ✅ Change default admin password
- ✅ Use strong JWT_SECRET (32+ characters)
- ✅ Enable HTTPS (should be automatic in cPanel)
- ✅ Keep Node.js and dependencies updated
- ✅ Restrict database user permissions
- ✅ Enable rate limiting (already configured)
- ✅ Regular backups of database

## Performance Optimization

The application includes:
- ✅ HTTP caching headers for static assets (1 year)
- ✅ Image lazy loading
- ✅ Rate limiting on API endpoints
- ✅ Production-optimized frontend build
- ✅ Gzip compression (enable in cPanel if not automatic)

## Support

For deployment issues specific to cPanel, consult your hosting provider's documentation or support team.

## Local Testing of Production Build

Before deploying, test the production build locally:

```bash
# Build everything
npm run build:backend
npm run build:frontend

# Start in production mode
npm run start

# Test endpoints
curl http://localhost:10000/api/test
curl http://localhost:10000/
```

The application should serve the frontend at root and API at `/api/*`.
