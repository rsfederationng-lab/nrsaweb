# Production Deployment Checklist

## Railway Backend:
- [ ] Environment variables added
- [ ] Custom domain `api.nrsa.com.ng` configured
- [ ] DNS CNAME record: `api.nrsa.com.ng` → `your-app.up.railway.app`
- [ ] SSL certificate validated
- [ ] Health check: `https://api.nrsa.com.ng/health`

## Frontend:
- [ ] Run `npm run build:client`
- [ ] Upload `dist/public/*` to `public_html/`
- [ ] Upload `.htaccess` file
- [ ] Test API connection

## Test Commands:
```bash
node check-api.js
curl https://api.nrsa.com.ng/health
```