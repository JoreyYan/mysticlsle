-- 订单系统数据库表
-- 在 Supabase SQL Editor 中运行此脚本

-- ============================================
-- 1. 用户收货地址表
-- ============================================
CREATE TABLE IF NOT EXISTS shipping_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  phone VARCHAR(30),
  address_line1 VARCHAR(255) NOT NULL,
  address_line2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100),
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL DEFAULT 'United States',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shipping_addresses_user ON shipping_addresses(user_id);

-- ============================================
-- 2. 订单表
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(20) UNIQUE NOT NULL,
  user_id UUID,  -- 可为空（游客下单）
  email VARCHAR(255) NOT NULL,

  -- 订单状态
  status VARCHAR(30) DEFAULT 'pending' CHECK (status IN (
    'pending',      -- 待支付
    'paid',         -- 已支付
    'processing',   -- 处理中
    'shipped',      -- 已发货
    'delivered',    -- 已送达
    'cancelled',    -- 已取消
    'refunded'      -- 已退款
  )),

  -- 支付信息
  payment_status VARCHAR(30) DEFAULT 'unpaid' CHECK (payment_status IN (
    'unpaid', 'paid', 'refunded', 'failed'
  )),
  payment_method VARCHAR(50),
  payment_intent_id VARCHAR(255),  -- Stripe Payment Intent ID

  -- 金额
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  tax DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',

  -- 收货地址（冗余存储，防止地址修改影响历史订单）
  shipping_name VARCHAR(100) NOT NULL,
  shipping_phone VARCHAR(30),
  shipping_address_line1 VARCHAR(255) NOT NULL,
  shipping_address_line2 VARCHAR(255),
  shipping_city VARCHAR(100) NOT NULL,
  shipping_state VARCHAR(100),
  shipping_postal_code VARCHAR(20) NOT NULL,
  shipping_country VARCHAR(100) NOT NULL,

  -- 物流信息
  tracking_number VARCHAR(100),
  tracking_url VARCHAR(500),
  shipped_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,

  -- 备注
  customer_note TEXT,
  admin_note TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);

-- ============================================
-- 3. 订单商品表
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL,
  variant_id UUID,

  -- 商品信息快照
  product_name VARCHAR(255) NOT NULL,
  product_sku VARCHAR(100),
  product_image VARCHAR(500),
  variant_name VARCHAR(100),

  -- 价格和数量
  unit_price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  total_price DECIMAL(10,2) NOT NULL,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);

-- ============================================
-- 4. 触发器
-- ============================================
-- 订单更新时间触发器
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 收货地址更新时间触发器
DROP TRIGGER IF EXISTS update_shipping_addresses_updated_at ON shipping_addresses;
CREATE TRIGGER update_shipping_addresses_updated_at
  BEFORE UPDATE ON shipping_addresses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 5. 订单号生成函数
-- ============================================
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  exists_count INTEGER;
BEGIN
  LOOP
    -- 格式: OM + 年月日 + 4位随机数，如 OM2502050001
    new_number := 'OM' || TO_CHAR(NOW(), 'YYMMDDHH24MI') || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');

    SELECT COUNT(*) INTO exists_count FROM orders WHERE order_number = new_number;
    EXIT WHEN exists_count = 0;
  END LOOP;

  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 6. RLS 策略
-- ============================================
ALTER TABLE shipping_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 收货地址：用户只能访问自己的地址
DROP POLICY IF EXISTS "Users can manage own addresses" ON shipping_addresses;
CREATE POLICY "Users can manage own addresses" ON shipping_addresses
  FOR ALL TO anon, authenticated USING (true);

-- 订单：用户可以查看自己的订单，管理员可以查看所有订单
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow insert orders" ON orders;
CREATE POLICY "Allow insert orders" ON orders
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update orders" ON orders;
CREATE POLICY "Allow update orders" ON orders
  FOR UPDATE TO anon, authenticated USING (true);

-- 订单商品：跟随订单权限
DROP POLICY IF EXISTS "Users can view order items" ON order_items;
CREATE POLICY "Users can view order items" ON order_items
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow insert order items" ON order_items;
CREATE POLICY "Allow insert order items" ON order_items
  FOR INSERT TO anon, authenticated WITH CHECK (true);
