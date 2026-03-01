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
# STAGE 2: Production (minimal)
# ─────────────────────────────────────────────
FROM node:20-alpine AS production

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY --from=builder --chown=appuser:appgroup /app/dist ./dist

USER appuser
EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:5000/health || exit 1

CMD ["node", "dist/index.js"]
