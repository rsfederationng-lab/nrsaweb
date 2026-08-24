# cPanel/VPS Backend Deployment

## Steps:

1. **Build the backend:**
   ```bash
   npm run build:server
   ```

2. **Upload files to server:**
   - Upload `app.js` to root directory
   - Upload `dist/` folder
   - Upload `package.json`
   - Upload `.env` file with production values

3. **Install dependencies on server:**
   ```bash
   npm install --production
   ```

4. **Start the application:**
   ```bash
   node app.js
   ```

## For PM2 (recommended):
```bash
npm install -g pm2
pm2 start app.js --name "nrsa-api"
pm2 startup
pm2 save
```