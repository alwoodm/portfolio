# syntax=docker/dockerfile:1.7

FROM node:20-alpine AS base
ENV NODE_ENV=production
WORKDIR /app
RUN apk add --no-cache libc6-compat \
    && corepack enable

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN apk add --no-cache su-exec \
    && addgroup -g 1001 nodejs \
    && adduser -S -u 1001 nextjs -G nodejs

# Copy standalone build (includes server.js and minimal node_modules)
COPY --from=builder /app/.next/standalone ./

# Copy static files (CRITICAL - fixes 404s for _next/static/*)
COPY --from=builder /app/.next/static ./.next/static

# Copy public assets
COPY --from=builder /app/public ./public

# Copy data files (will be overwritten by volume mount)
COPY --from=builder /app/data ./data

# Copy scripts for admin token generation
COPY --from=builder /app/scripts ./scripts

RUN chown -R nextjs:nodejs /app \
    && chmod +x /app/scripts/docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/app/scripts/docker-entrypoint.sh"]
