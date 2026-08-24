# NRSA Website Deployment to Render

## Prerequisites
1. GitHub repository with your code
2. Render account
3. Domain nrsa.com.ng configured

## Deployment Steps

### 1. Environment Variables (Set in Render Dashboard)
```
NODE_ENV=production
JWT_SECRET=cH/Wxyt4BAFNjDX2SH3+DORtmLujHILTH3JePhxuth/gOfU7w5/nFqmbmVeDjajC+DC6BjZ9Ftapm2RDKC9QXA==
SUPABASE_URL=https://jrijjoszmlupeljifedk.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpyaWpqb3N6bWx1cGVsamlmZWRrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjk1OTY0NCwiZXhwIjoyMDc4MzE5NjQ0fQ.aeu4qY6PciJfNd95Z-zTSHcSJYrixiTVlkRlUycGYvY
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpyaWpqb3N6bWx1cGVsamlmZWRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NTk2NDQsImV4cCI6MjA3ODMxOTY0NH0.b0L7IYH0iYtPkXuH-R5WOgU_R3ifFNaQjKR7-WJJfH4
DATABASE_URL=postgresql://postgres:Holiness%232025%21@db.jrijjoszmlupeljifedk.supabase.co:5432/postgres
ADMIN_EMAIL=admin@nrsa.com.ng
ADMIN_PASSWORD=adminnrsa.passme5@00121
ADMIN_NAME=NRSA Administrator
```

### 2. Render Service Configuration
- **Service Type**: Web Service
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Node Version**: 20.x
- **Plan**: Starter (can upgrade later)

### 3. Custom Domain Setup
1. In Render Dashboard → Settings → Custom Domains
2. Add: `nrsa.com.ng`
3. Add: `www.nrsa.com.ng`
4. Configure DNS records at your domain provider:
   ```
   Type: CNAME
   Name: www
   Value: nrsa-website.onrender.com
   
   Type: A
   Name: @
   Value: 216.24.57.1
   ```

### 4. Deploy
1. Connect GitHub repository
2. Set environment variables
3. Deploy from main branch
4. Verify deployment at https://nrsa.com.ng

## Post-Deployment
1. Test all functionality
2. Verify admin login works
3. Check file uploads
4. Test contact form
5. Verify SSL certificate