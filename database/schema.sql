-- ChillFit Rave 数据库架构
-- 使用 Supabase 时，在 SQL Editor 中运行此脚本

-- 启用必要的扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 分类表
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 商品表
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  short_description TEXT,
  sku TEXT UNIQUE,

  -- 价格信息
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),
  cost_price DECIMAL(10,2),

  -- 库存信息
  inventory_quantity INTEGER DEFAULT 0,
  track_inventory BOOLEAN DEFAULT true,
  allow_backorder BOOLEAN DEFAULT false,

  -- 图片信息
  featured_image TEXT,

  -- SEO信息
  meta_title TEXT,
  meta_description TEXT,

  -- 状态信息
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  is_featured BOOLEAN DEFAULT false,

  -- 分类关联
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,

  -- 权重和排序
  sort_order INTEGER DEFAULT 0,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 商品图片表
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 商品变体表
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,

  -- 变体信息
  title TEXT NOT NULL,
  sku TEXT UNIQUE,

  -- 变体特定的价格和库存
  price DECIMAL(10,2),
  compare_at_price DECIMAL(10,2),
  inventory_quantity INTEGER DEFAULT 0,

  -- 变体选项 (如颜色、尺码等)
  option1_name TEXT,
  option1_value TEXT,
  option2_name TEXT,
  option2_value TEXT,
  option3_name TEXT,
  option3_value TEXT,

  -- 变体图片
  image_url TEXT,

  -- 重量和尺寸
  weight DECIMAL(10,2),
  requires_shipping BOOLEAN DEFAULT true,

  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 标签表
CREATE TABLE IF NOT EXISTS product_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 商品-标签关联表
CREATE TABLE IF NOT EXISTS product_tag_relations (
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES product_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, tag_id)
);

-- 合集表
CREATE TABLE IF NOT EXISTS product_collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 商品-合集关联表
CREATE TABLE IF NOT EXISTS product_collection_relations (
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  collection_id UUID NOT NULL REFERENCES product_collections(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0,
  PRIMARY KEY (product_id, collection_id)
);

-- 管理员表
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  setting_type TEXT DEFAULT 'text' CHECK (setting_type IN ('text', 'image', 'json', 'number', 'boolean')),
  group_name TEXT,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_product_variants_product ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 为相关表添加更新时间触发器
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON product_variants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_collections_updated_at BEFORE UPDATE ON product_collections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 插入默认管理员账户 (密码: admin123)
-- 注意：这是使用 bcrypt 哈希的密码，实际使用时应该使用更强的密码
INSERT INTO admins (email, password_hash, name, role, is_active)
VALUES (
  'admin@chillfitrave.com',
  '$2a$10$rYvKp8Z.yJLUJ2PL5vZF5.dWqF0F1CRYqHj5QEKxrxPJzQJ1YqY8G',
  'Admin User',
  'super_admin',
  true
) ON CONFLICT (email) DO NOTHING;

-- 插入示例分类
INSERT INTO categories (name, slug, description, sort_order, is_active) VALUES
  ('New Arrivals', 'new', 'Latest drops and trending pieces', 1, true),
  ('Sets', 'sets', 'Complete matching sets perfect for festivals and raves', 2, true),
  ('Halloween', 'halloween', 'Spooky season special collection with mystical themes', 3, true),
  ('Tops', 'tops', 'Crop tops, bras, and upper body wear', 4, true),
  ('Bottoms', 'bottoms', 'Shorts, pants, and lower body wear', 5, true),
  ('Sale', 'sale', 'Discounted items and clearance', 6, true)
ON CONFLICT (slug) DO NOTHING;

-- 启用行级安全 (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_tag_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_collection_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- 创建公开读取策略（所有用户可以读取激活的内容）
CREATE POLICY "Public can view active categories" ON categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active products" ON products
  FOR SELECT USING (status = 'active');

CREATE POLICY "Public can view product images" ON product_images
  FOR SELECT USING (true);

CREATE POLICY "Public can view product variants" ON product_variants
  FOR SELECT USING (true);

CREATE POLICY "Public can view tags" ON product_tags
  FOR SELECT USING (true);

CREATE POLICY "Public can view tag relations" ON product_tag_relations
  FOR SELECT USING (true);

CREATE POLICY "Public can view active collections" ON product_collections
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view collection relations" ON product_collection_relations
  FOR SELECT USING (true);

-- 管理员策略（需要通过应用层认证）
-- 这里我们暂时允许所有操作，实际应该通过 JWT 来限制
CREATE POLICY "Admins can do everything on categories" ON categories
  FOR ALL USING (true);

CREATE POLICY "Admins can do everything on products" ON products
  FOR ALL USING (true);

CREATE POLICY "Admins can do everything on product_images" ON product_images
  FOR ALL USING (true);

CREATE POLICY "Admins can do everything on product_variants" ON product_variants
  FOR ALL USING (true);

CREATE POLICY "Admins can do everything on product_tags" ON product_tags
  FOR ALL USING (true);

CREATE POLICY "Admins can do everything on product_tag_relations" ON product_tag_relations
  FOR ALL USING (true);

CREATE POLICY "Admins can do everything on product_collections" ON product_collections
  FOR ALL USING (true);

CREATE POLICY "Admins can do everything on product_collection_relations" ON product_collection_relations
  FOR ALL USING (true);

CREATE POLICY "Admins can read own data" ON admins
  FOR SELECT USING (true);

CREATE POLICY "Super admins can manage admins" ON admins
  FOR ALL USING (true);

CREATE POLICY "Admins can manage settings" ON site_settings
  FOR ALL USING (true);
