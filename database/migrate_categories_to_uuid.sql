-- 将 categories 表的 id 从 integer 改为 uuid
-- 警告：这会清空 categories 表的数据

-- 启用 uuid 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. 删除依赖 categories.id 的外键约束
ALTER TABLE IF EXISTS categories DROP CONSTRAINT IF EXISTS categories_parent_id_fkey;
ALTER TABLE IF EXISTS products DROP CONSTRAINT IF EXISTS products_category_id_fkey;

-- 2. 删除旧的 categories 表（如果需要保留数据，请先备份）
DROP TABLE IF EXISTS categories CASCADE;

-- 3. 重新创建 categories 表，使用 UUID
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 创建索引
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);

-- 5. 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. 修改 products 表的 category_id 字段类型
ALTER TABLE products DROP COLUMN IF EXISTS category_id;
ALTER TABLE products ADD COLUMN category_id UUID REFERENCES categories(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);

-- 7. 插入默认分类数据
INSERT INTO categories (name, slug, description, sort_order, is_active) VALUES
  ('New Arrivals', 'new', 'Latest drops and trending pieces', 1, true),
  ('Sets', 'sets', 'Complete matching sets perfect for festivals and raves', 2, true),
  ('Halloween', 'halloween', 'Spooky season special collection with mystical themes', 3, true),
  ('Tops', 'tops', 'Crop tops, bras, and upper body wear', 4, true),
  ('Bottoms', 'bottoms', 'Shorts, pants, and lower body wear', 5, true),
  ('Sale', 'sale', 'Discounted items and clearance', 6, true)
ON CONFLICT (slug) DO NOTHING;
