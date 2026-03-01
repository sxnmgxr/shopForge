-- ============================================================
-- ShopForge Database Schema
-- Run: psql -U shopforge -d shopforge -f 001_schema.sql
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─────────────────────────────────────────────
-- USERS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(255) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,
  role        VARCHAR(20) NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  avatar_url  TEXT,
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);

-- ─────────────────────────────────────────────
-- CATEGORIES
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        VARCHAR(100) NOT NULL,
  slug        VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  image_url   TEXT,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- PRODUCTS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         VARCHAR(200) NOT NULL,
  slug         VARCHAR(200) UNIQUE NOT NULL,
  description  TEXT,
  price        NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  stock        INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  image_url    TEXT,
  images       TEXT[],
  category_id  UUID REFERENCES categories(id) ON DELETE SET NULL,
  rating       NUMERIC(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  is_active    BOOLEAN DEFAULT true,
  created_at   TIMESTAMP DEFAULT NOW(),
  updated_at   TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug     ON products(slug);
CREATE INDEX idx_products_active   ON products(is_active);

-- ─────────────────────────────────────────────
-- CART ITEMS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cart_items (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity    INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at  TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- ─────────────────────────────────────────────
-- ORDERS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID NOT NULL REFERENCES users(id),
  status           VARCHAR(30) NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending','processing','shipped','delivered','cancelled')),
  total            NUMERIC(10,2) NOT NULL,
  shipping_address JSONB,
  payment_method   VARCHAR(50) DEFAULT 'card',
  payment_status   VARCHAR(20) DEFAULT 'pending'
                   CHECK (payment_status IN ('pending','paid','failed','refunded')),
  notes            TEXT,
  created_at       TIMESTAMP DEFAULT NOW(),
  updated_at       TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_orders_user   ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);

-- ─────────────────────────────────────────────
-- ORDER ITEMS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES products(id),
  quantity    INTEGER NOT NULL,
  price       NUMERIC(10,2) NOT NULL,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- REVIEWS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES users(id),
  rating      INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT,
  created_at  TIMESTAMP DEFAULT NOW(),
  UNIQUE(product_id, user_id)
);
