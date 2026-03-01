# ─────────────────────────────────────────────
# STAGE 1: Builder
# ─────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ─────────────────────────────────────────────
# STAGE 2: Production
# ─────────────────────────────────────────────
FROM node:20-alpine AS production

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY --from=builder --chown=appuser:appgroup /app/.next/standalone ./
COPY --from=builder --chown=appuser:appgroup /app/.next/static ./.next/static
COPY --from=builder --chown=appuser:appgroup /app/public ./public

USER appuser
EXPOSE 3000
ENV PORT=3000 HOSTNAME="0.0.0.0"

HEALTHCHECK --interval=30s --timeout=5s CMD wget -qO- http://localhost:3000 || exit 1
CMD ["node", "server.js"]
