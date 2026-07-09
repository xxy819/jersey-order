# Supabase SQL Schema Reference

Full SQL to initialize the database for the ordering platform.

## Orders Table

```sql
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT DEFAULT '',
  customer_country TEXT DEFAULT '',
  customer_region TEXT DEFAULT '',
  customer_city TEXT DEFAULT '',
  customer_address TEXT NOT NULL,
  customer_postal_code TEXT DEFAULT '',
  items JSONB NOT NULL,
  payment_screenshot TEXT DEFAULT '',
  subtotal DECIMAL(10,2) DEFAULT 0,
  shipping DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  note TEXT DEFAULT '',
  status TEXT DEFAULT 'pending',
  tracking_number TEXT DEFAULT '',
  user_id UUID DEFAULT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_customer_name ON orders(customer_name);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
```

## Users Table

```sql
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL
);
```

## Storage RLS Policies

```sql
CREATE POLICY "anon_upload" ON storage.objects
  FOR INSERT TO anon
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "anon_select" ON storage.objects
  FOR SELECT TO anon
  USING (bucket_id = 'product-images');
```

## Migration: Add Columns to Existing Table

```sql
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_number TEXT DEFAULT '';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id UUID DEFAULT NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_screenshot TEXT DEFAULT '';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10,2) DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping DECIMAL(10,2) DEFAULT 0;
```
