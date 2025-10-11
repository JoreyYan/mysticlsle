-- ChillFit Rave 数据库结构设计
-- 为Supabase设计的完整电商数据库

-- 1. 商品分类表
CREATE TABLE categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name varchar(100) NOT NULL,
  slug varchar(100) UNIQUE NOT NULL, -- 用于URL: 'sets', 'new', 'limited', 'halloween'
  description text,
  image_url varchar,
  parent_id uuid REFERENCES categories(id), -- 支持子分类
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- 2. 商品主表
CREATE TABLE products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name varchar(255) NOT NULL,
  slug varchar(255) UNIQUE NOT NULL, -- URL友好的产品标识
  description text,
  short_description varchar(500),
  sku varchar(100) UNIQUE, -- 产品编码

  -- 价格信息
  price decimal(10,2) NOT NULL,
  compare_at_price decimal(10,2), -- 原价（用于显示折扣）
  cost_price decimal(10,2), -- 成本价

  -- 库存信息
  inventory_quantity integer DEFAULT 0,
  track_inventory boolean DEFAULT true,
  allow_backorder boolean DEFAULT false,

  -- 图片信息
  featured_image varchar, -- 主图
  images jsonb, -- 多图数组 ['url1', 'url2', ...]

  -- SEO信息
  meta_title varchar(255),
  meta_description text,

  -- 状态信息
  status varchar(20) DEFAULT 'draft', -- 'draft', 'active', 'archived'
  is_featured boolean DEFAULT false, -- 是否推荐商品

  -- 分类关联
  category_id uuid REFERENCES categories(id),

  -- 权重和排序
  sort_order integer DEFAULT 0,

  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- 3. 商品变体表（尺寸、颜色等）
CREATE TABLE product_variants (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,

  -- 变体信息
  title varchar(255) NOT NULL, -- 如 "Small / Red"
  sku varchar(100) UNIQUE,

  -- 变体特定的价格和库存
  price decimal(10,2),
  compare_at_price decimal(10,2),
  inventory_quantity integer DEFAULT 0,

  -- 变体选项
  option1_name varchar(50), -- 如 "Size"
  option1_value varchar(50), -- 如 "Small"
  option2_name varchar(50), -- 如 "Color"
  option2_value varchar(50), -- 如 "Red"
  option3_name varchar(50),
  option3_value varchar(50),

  -- 变体图片
  image_url varchar,

  -- 重量和尺寸（用于运费计算）
  weight decimal(8,2),
  requires_shipping boolean DEFAULT true,

  sort_order integer DEFAULT 0,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- 4. 商品标签表
CREATE TABLE product_tags (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name varchar(100) UNIQUE NOT NULL,
  slug varchar(100) UNIQUE NOT NULL,
  created_at timestamp DEFAULT now()
);

-- 5. 商品标签关联表
CREATE TABLE product_tag_relations (
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES product_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, tag_id)
);

-- 6. 商品收藏表
CREATE TABLE product_collections (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title varchar(255) NOT NULL,
  slug varchar(255) UNIQUE NOT NULL,
  description text,
  image_url varchar,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- 7. 商品收藏关联表
CREATE TABLE product_collection_relations (
  collection_id uuid REFERENCES product_collections(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  sort_order integer DEFAULT 0,
  PRIMARY KEY (collection_id, product_id)
);

-- 8. 页面视觉资源表（首页banner等）
CREATE TABLE page_visuals (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  page_name varchar(50) NOT NULL, -- 'homepage', 'about', 'category'
  section varchar(50) NOT NULL,   -- 'hero_banner', 'halloween_shop', 'shipping_banner'
  resource_key varchar(50) NOT NULL, -- 'main_banner', 'mobile_banner'
  title varchar(255),
  url varchar NOT NULL,
  alt_text varchar(255),
  link_url varchar, -- 点击跳转链接
  position integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- 9. Instagram展示表
CREATE TABLE social_showcase (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  platform varchar(20) NOT NULL, -- 'instagram', 'xiaohongshu', 'tiktok'
  username varchar(100) NOT NULL,
  external_link varchar,
  image_url varchar NOT NULL,
  caption text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- 10. 网站设置表
CREATE TABLE site_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key varchar(100) UNIQUE NOT NULL,
  setting_value text NOT NULL,
  setting_type varchar(20) DEFAULT 'text', -- 'text', 'image', 'json', 'number', 'boolean'
  group_name varchar(50), -- 'general', 'seo', 'payment', 'shipping'
  description text,
  updated_at timestamp DEFAULT now()
);

-- 创建索引提升查询性能
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_product_variants_product ON product_variants(product_id);
CREATE INDEX idx_page_visuals_page_section ON page_visuals(page_name, section);
CREATE INDEX idx_social_showcase_platform ON social_showcase(platform);

-- 插入基础分类数据
INSERT INTO categories (name, slug, description, sort_order) VALUES
('Sets', 'sets', 'Complete outfit sets for the perfect rave look', 1),
('New Arrivals', 'new', 'Latest additions to our collection', 2),
('Limited Edition', 'limited', 'Exclusive limited edition pieces', 3),
('Halloween', 'halloween', 'Special Halloween collection', 4),
('Accessories', 'accessories', 'Complete your look with accessories', 5),
('Sale', 'sale', 'Discounted items - grab them while they last!', 6),
('Tops', 'tops', 'Stylish tops for every occasion', 7),
('Bottoms', 'bottoms', 'Bottoms that make a statement', 8),
('Skirts', 'skirts', 'Flirty and fun skirts', 9);

-- 插入基础网站设置
INSERT INTO site_settings (setting_key, setting_value, setting_type, group_name, description) VALUES
('site_title', 'ChillFit Rave', 'text', 'general', 'Website title'),
('site_description', 'Premium rave and festival fashion', 'text', 'general', 'Website description'),
('contact_email', 'help@chillfitrave.com', 'text', 'general', 'Contact email address'),
('instagram_url', 'https://www.instagram.com/chillfitrave/', 'text', 'social', 'Instagram profile URL'),
('tiktok_url', 'https://www.tiktok.com/@chillfitrave', 'text', 'social', 'TikTok profile URL');