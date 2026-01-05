#!/bin/sh
set -e

if [ -d /app/data ]; then
  chown -R nextjs:nodejs /app/data || true
fi

if [ -d /app/.next ]; then
  chown -R nextjs:nodejs /app/.next || true
fi

if [ -f /app/.env ]; then
  chown nextjs:nodejs /app/.env || true
fi

su-exec nextjs node /app/scripts/generate-admin-token.mjs --if-missing
exec su-exec nextjs node /app/node_modules/next/dist/bin/next start -H 0.0.0.0 -p "${PORT:-3000}"
