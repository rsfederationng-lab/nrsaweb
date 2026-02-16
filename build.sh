#!/bin/bash
# Clear all caches
rm -rf node_modules/.vite
rm -rf dist
rm -rf .vite
# Fresh install and build
npm install --legacy-peer-deps
npm run build