#!/bin/sh
echo "window.__CLERK_PUBLISHABLE_KEY = \"${VITE_CLERK_PUBLISHABLE_KEY}\";" > /usr/share/nginx/html/config.js
echo "[startup] config.js generated, key length: ${#VITE_CLERK_PUBLISHABLE_KEY}"
nginx -g 'daemon off;'
