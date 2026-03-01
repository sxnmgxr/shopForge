-- ============================================================
-- ShopForge Seed Data
-- Run: psql -U shopforge -d shopforge -f 002_seed.sql
-- ============================================================

-- ─────────────────────────────────────────────
-- USERS (passwords: Admin123! and Customer123!)
-- bcrypt hash of Admin123!
-- ─────────────────────────────────────────────
INSERT INTO users (id, name, email, password, role) VALUES
  ('11111111-1111-1111-1111-111111111111',
   'Admin User', 'admin@shopforge.com',
   '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQyCkHjHx7hR5aMzNlnfHHMqO',
   'admin'),
  ('22222222-2222-2222-2222-222222222222',
   'John Customer', 'customer@shopforge.com',
   '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi6',
   'customer')
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────
-- CATEGORIES
-- ─────────────────────────────────────────────
INSERT INTO categories (id, name, slug, description) VALUES
  ('aaaa0001-0000-0000-0000-000000000001', 'Electronics',    'electronics',    'Gadgets, phones, laptops'),
  ('aaaa0001-0000-0000-0000-000000000002', 'Clothing',       'clothing',       'Fashion for everyone'),
  ('aaaa0001-0000-0000-0000-000000000003', 'Books',          'books',          'Fiction, non-fiction, learning'),
  ('aaaa0001-0000-0000-0000-000000000004', 'Home & Garden',  'home-garden',    'Everything for your home'),
  ('aaaa0001-0000-0000-0000-000000000005', 'Sports',         'sports',         'Equipment and apparel')
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────
-- PRODUCTS
-- ─────────────────────────────────────────────
INSERT INTO products (name, slug, description, price, stock, category_id, image_url, rating, review_count) VALUES
  -- Electronics
  ('Wireless Headphones Pro',   'wireless-headphones-pro',
   'Premium noise-cancelling wireless headphones with 40hr battery.',
   129.99, 50, 'aaaa0001-0000-0000-0000-000000000001',
   'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 4.5, 124),

  ('Mechanical Keyboard RGB',   'mechanical-keyboard-rgb',
   'Tactile mechanical keyboard with per-key RGB lighting.',
   89.99, 30, 'aaaa0001-0000-0000-0000-000000000001',
   'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500', 4.7, 89),

  ('USB-C Hub 7-in-1',          'usb-c-hub-7in1',
   'Expand your laptop with 7 ports including 4K HDMI.',
   49.99, 100, 'aaaa0001-0000-0000-0000-000000000001',
   'https://images.unsplash.com/photo-1625961332771-3f40b0e2bdcf?w=500', 4.3, 45),

  ('Smartphone Stand Magnetic', 'smartphone-stand-magnetic',
   'Adjustable magnetic stand for phones and small tablets.',
   24.99, 200, 'aaaa0001-0000-0000-0000-000000000001',
   'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500', 4.1, 67),

  -- Clothing
  ('Classic White Tee',         'classic-white-tee',
   '100% organic cotton unisex t-shirt. Soft, durable, timeless.',
   29.99, 500, 'aaaa0001-0000-0000-0000-000000000002',
   'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', 4.4, 201),

  ('Slim Fit Chinos',           'slim-fit-chinos',
   'Modern slim-fit chinos in stretch cotton blend.',
   59.99, 150, 'aaaa0001-0000-0000-0000-000000000002',
   'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500', 4.2, 88),

  ('Merino Wool Sweater',       'merino-wool-sweater',
   'Lightweight merino wool crewneck, perfect for layering.',
   89.99, 75, 'aaaa0001-0000-0000-0000-000000000002',
   'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500', 4.6, 55),

  -- Books
  ('Clean Code',                'clean-code-robert-martin',
   'A handbook of agile software craftsmanship by Robert C. Martin.',
   35.99, 80, 'aaaa0001-0000-0000-0000-000000000003',
   'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500', 4.8, 312),

  ('The Pragmatic Programmer',  'pragmatic-programmer',
   'Your journey to mastery — must-read for every developer.',
   39.99, 60, 'aaaa0001-0000-0000-0000-000000000003',
   'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=500', 4.9, 445),

  -- Home
  ('Bamboo Desk Organizer',     'bamboo-desk-organizer',
   'Eco-friendly bamboo organizer with 6 compartments.',
   34.99, 120, 'aaaa0001-0000-0000-0000-000000000004',
   'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=500', 4.3, 78),

  ('Pour-Over Coffee Set',      'pour-over-coffee-set',
   'Glass pour-over dripper with stainless steel filter and stand.',
   44.99, 90, 'aaaa0001-0000-0000-0000-000000000004',
   'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500', 4.7, 156),

  -- Sports
  ('Yoga Mat Premium',          'yoga-mat-premium',
   'Non-slip 6mm thick yoga mat with carrying strap.',
   39.99, 200, 'aaaa0001-0000-0000-0000-000000000005',
   'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500', 4.5, 234),

  ('Resistance Bands Set',      'resistance-bands-set',
   'Set of 5 resistance bands for strength and flexibility training.',
   19.99, 300, 'aaaa0001-0000-0000-0000-000000000005',
   'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500', 4.4, 189)
ON CONFLICT DO NOTHING;
