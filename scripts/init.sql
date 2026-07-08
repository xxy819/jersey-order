-- ============================================
-- Supabase 初始化脚本
-- 在 Supabase Dashboard > SQL Editor 中执行
-- ============================================

-- 1. 创建订单表
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
  status TEXT DEFAULT 'pending'
);

-- 2. 创建索引方便搜索
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_customer_name ON orders(customer_name);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);

-- 3. 创建图片存储桶
-- 在 Dashboard > Storage > New bucket
-- Name: product-images
-- Public bucket: ON
