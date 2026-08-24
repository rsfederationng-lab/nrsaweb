#!/bin/bash
# Build and deploy client to cPanel public_html

# Build the client
cd client
npm run build

# Copy build files to public_html (adjust path as needed)
cp -r dist/* ../public_html/

echo "Deployment to cPanel complete!"