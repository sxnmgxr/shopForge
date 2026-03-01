# 🛍️ ShopForge — 3-Tier E-Commerce Learning Project

A full-stack e-commerce application built for learning:
- ✅ Automation Testing (Playwright)
- ✅ CI/CD (GitHub Actions)
- ✅ DevSecOps (Security scanning)
- ✅ Docker & Kubernetes
- ✅ API Testing

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│  TIER 1 — FRONTEND                                  │
│  Next.js 14 · TypeScript · Tailwind CSS             │
│  Port: 3000                                         │
├─────────────────────────────────────────────────────┤
│  TIER 2 — BACKEND API                               │
│  Node.js · Express · TypeScript · JWT Auth          │
│  Port: 5000                                         │
├─────────────────────────────────────────────────────┤
│  TIER 3 — DATABASE                                  │
│  PostgreSQL 15 · Redis (sessions/cache)             │
│  Port: 5432 / 6379                                  │
└─────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
shopforge/
├── frontend/                   # Next.js 14 App Router
│   ├── src/
│   │   ├── app/                # Pages (App Router)
│   │   │   ├── page.tsx        # Homepage
│   │   │   ├── products/       # Product listing & detail
│   │   │   ├── cart/           # Shopping cart
│   │   │   ├── checkout/       # Checkout flow
│   │   │   ├── orders/         # Order history
│   │   │   ├── account/        # User profile
│   │   │   └── auth/           # Login / Register
│   │   ├── components/
│   │   │   ├── ui/             # Reusable UI (Button, Input, Modal)
│   │   │   ├── layout/         # Navbar, Footer, Sidebar
│   │   │   ├── product/        # ProductCard, ProductGrid
│   │   │   └── cart/           # CartItem, CartSummary
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # API client, utilities
│   │   ├── store/              # Zustand state management
│   │   └── types/              # TypeScript types
│   ├── tests/
│   │   ├── e2e/                # Playwright E2E tests
│   │   └── unit/               # Jest unit tests
│   └── playwright.config.ts
│
├── backend/                    # Express API
│   ├── src/
│   │   ├── controllers/        # Route handlers
│   │   ├── routes/             # API routes
│   │   ├── middleware/         # Auth, error, validation
│   │   ├── models/             # Database models
│   │   ├── services/           # Business logic
│   │   ├── utils/              # Helpers
│   │   └── config/             # DB, env config
│   ├── migrations/             # SQL migration files
│   └── tests/
│       ├── unit/               # Jest unit tests
│       └── integration/        # API integration tests
│
├── database/
│   ├── migrations/             # Database schema
│   └── seeds/                  # Sample data
│
├── .github/
│   └── workflows/
│       ├── ci.yml              # CI pipeline
│       ├── cd.yml              # CD pipeline
│       └── security.yml        # Security scans
│
└── docker-compose.yml          # Local dev environment
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 15 (or use Docker)

### 1. Clone & Install

```bash
git clone https://github.com/yourname/shopforge.git
cd shopforge

# Install backend deps
cd backend && npm install

# Install frontend deps
cd ../frontend && npm install
```

### 2. Start with Docker (Easiest)

```bash
# From root — starts everything
docker compose up -d

# Frontend → http://localhost:3000 (or 3001 when using Next's fast-refresh proxy)
# Backend  → http://localhost:5000
# pgAdmin  → http://localhost:5050
```

> **CORS note:** the API allows requests from origins listed in `FRONTEND_URL` (comma-separated) and any `localhost` on ports 3000, 3001, 3002 for local development. You can set `FRONTEND_URL` in `.env` before starting the backend.

### 3. Start Manually

```bash
# Terminal 1 — Database
docker compose up postgres redis -d

# Terminal 2 — Backend
cd backend
cp .env.example .env
npm run migrate
npm run seed
npm run dev

# Terminal 3 — Frontend
cd frontend
cp .env.example .env.local
npm run dev
```

---

## 🧪 Running Tests

```bash
# Backend unit tests
cd backend && npm test

# Backend integration tests
cd backend && npm run test:integration

# Frontend unit tests
cd frontend && npm test

# Playwright E2E tests
cd frontend
npx playwright install
npx playwright test

# Playwright UI mode (visual)
npx playwright test --ui

# Playwright headed (watch browser)
npx playwright test --headed
```

---

## 🔑 Default Test Users

| Role     | Email                    | Password    |
|----------|--------------------------|-------------|
| Admin    | admin@shopforge.com      | Admin123!   |
| Customer | customer@shopforge.com   | Customer123!|

---

## 📚 Learning Path

1. **Week 1** — Run the app locally, explore the code
2. **Week 2** — Write Playwright E2E tests (login, add to cart, checkout)
3. **Week 3** — Set up GitHub Actions CI pipeline
4. **Week 4** — Add security scanning (Trivy, Semgrep)
5. **Week 5** — Dockerize and deploy to staging
6. **Week 6** — Full DevSecOps pipeline end-to-end
