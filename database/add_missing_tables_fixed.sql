-- 添加缺失的表（修复版 - 兼容 UUID）
-- 假设 products.id 是 UUID 类型

-- 启用 UUID 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 先删除可能存在的表（如果之前创建失败）
DROP TABLE IF EXISTS product_tag_relations CASCADE;
DROP TABLE IF EXISTS product_collection_relations CASCADE;
DROP TABLE IF EXISTS product_variants CASCADE;
DROP TABLE IF EXISTS product_tags CASCADE;
DROP TABLE IF EXISTS product_collections CASCADE;
DROP TABLE IF EXISTS admins CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;

-- 商品变体表 (product_id 使用 UUID)
CREATE TABLE product_variants (
  id SERIAL PRIMARY KEY,
  product_id UUID NOT NULL,
  title TEXT NOT NULL,
  sku TEXT UNIQUE,
  price DECIMAL(10,2),
  compare_at_price DECIMAL(10,2),
  inventory_quantity INTEGER DEFAULT 0,
  option1_name TEXT,
  option1_value TEXT,
  option2_name TEXT,
  option2_value TEXT,
  option3_name TEXT,
  option3_value TEXT,
  image_url TEXT,
  weight DECIMAL(10,2),
  requires_shipping BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 标签表
CREATE TABLE product_tags (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 商品-标签关联表 (product_id 使用 UUID)
CREATE TABLE product_tag_relations (
  product_id UUID NOT NULL,
  tag_id INTEGER NOT NULL REFERENCES product_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, tag_id)
);

-- 合集表
CREATE TABLE product_collections (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 商品-合集关联表 (product_id 使用 UUID)
CREATE TABLE product_collection_relations (
  product_id UUID NOT NULL,
  collection_id INTEGER NOT NULL REFERENCES product_collections(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0,
  PRIMARY KEY (product_id, collection_id)
);

-- 管理员表
CREATE TABLE admins (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 网站设置表
CREATE TABLE site_settings (
  id SERIAL PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  setting_type TEXT DEFAULT 'text' CHECK (setting_type IN ('text', 'image', 'json', 'number', 'boolean')),
  group_name TEXT,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 为新表添加更新时间触发器
CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON product_variants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_collections_updated_at BEFORE UPDATE ON product_collections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 创建索引以提高查询性能
CREATE INDEX idx_product_variants_product ON product_variants(product_id);
CREATE INDEX idx_product_tag_relations_product ON product_tag_relations(product_id);
CREATE INDEX idx_product_tag_relations_tag ON product_tag_relations(tag_id);
CREATE INDEX idx_product_collections_slug ON product_collections(slug);
CREATE INDEX idx_product_collection_relations_product ON product_collection_relations(product_id);
CREATE INDEX idx_product_collection_relations_collection ON product_collection_relations(collection_id);

-- 插入默认管理员账户 (密码: admin123)
INSERT INTO admins (email, password_hash, name, role, is_active)
VALUES (
  'admin@chillfitrave.com',
  'admin123',
  'Admin User',
  'super_admin',
  true
) ON CONFLICT (email) DO NOTHING;
