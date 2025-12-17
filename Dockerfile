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

# Use non-root user for runtime
RUN addgroup -g 1001 nodejs && adduser -S -u 1001 nextjs -G nodejs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.ts ./next.config.ts

USER nextjs

EXPOSE 3000

CMD ["sh", "-c", "node node_modules/next/dist/bin/next start -H 0.0.0.0 -p ${PORT:-3000}"]
