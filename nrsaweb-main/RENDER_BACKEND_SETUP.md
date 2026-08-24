# Render.com Backend Deployment

## Steps:

1. **Push code to GitHub repository**

2. **Create new Web Service on Render:**
   - Connect GitHub repo
   - Build Command: `npm run build:server`
   - Start Command: `node app.js`
   - Environment: Node

3. **Add Environment Variables:**
   ```
   NODE_ENV=production
   PORT=10000
   JWT_SECRET=your-jwt-secret
   SUPABASE_URL=https://jrijjoszmlupeljifedk.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-key
   SUPABASE_ANON_KEY=your-anon-key
   DATABASE_URL=your-database-url
   ADMIN_EMAIL=admin@nrsa.com.ng
   ADMIN_PASSWORD=your-password
   ADMIN_NAME=NRSA Administrator
   ```

4. **Add Custom Domain:**
   - Go to Settings → Custom Domains
   - Add: `api.nrsa.com.ng`
   - Update DNS CNAME record: `api.nrsa.com.ng` → `your-app.onrender.com`

5. **Deploy**