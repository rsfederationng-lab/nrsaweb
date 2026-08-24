#!/bin/bash
# Deploy backend with PM2

# Build backend
npm run build:server

# Start with PM2
pm2 start ecosystem.config.js

echo "Backend deployed with PM2!"