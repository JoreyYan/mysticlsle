-- ChillFitRave 数据库完整结构和示例数据
-- 在 Supabase SQL Editor 中运行此脚本

-- 1. 创建分类表
CREATE TABLE public.categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    parent_id BIGINT REFERENCES public.categories(id) ON DELETE SET NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    meta_title VARCHAR(150),
    meta_description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 创建产品表
CREATE TABLE public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    short_description TEXT,
    sku VARCHAR(100) UNIQUE NOT NULL,

    -- 价格信息
    price DECIMAL(10,2) NOT NULL,
    sale_price DECIMAL(10,2),
    cost_price DECIMAL(10,2),

    -- 库存信息
    manage_stock BOOLEAN DEFAULT TRUE,
    stock_quantity INTEGER DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 5,

    -- 分类和状态
    category_id BIGINT REFERENCES public.categories(id),
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_digital BOOLEAN DEFAULT FALSE,

    -- 物理属性
    weight DECIMAL(8,2),
    dimensions JSONB, -- {length, width, height}

    -- SEO
    meta_title VARCHAR(150),
    meta_description TEXT,

    -- 时间戳
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 创建产品图片表
CREATE TABLE public.product_images (
    id BIGSERIAL PRIMARY KEY,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text VARCHAR(255),
    sort_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    file_size INTEGER, -- bytes
    width INTEGER,
    height INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 创建产品变体表
CREATE TABLE public.product_variants (
    id BIGSERIAL PRIMARY KEY,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- 如: "Red - Large"
    sku VARCHAR(100) UNIQUE NOT NULL,
    price DECIMAL(10,2),
    sale_price DECIMAL(10,2),
    stock_quantity INTEGER DEFAULT 0,

    -- 变体属性 (JSON格式存储)
    attributes JSONB NOT NULL, -- {"color": "Red", "size": "Large"}

    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 创建购物车表
CREATE TABLE public.cart_items (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    variant_id BIGINT REFERENCES public.product_variants(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- 确保用户不会重复添加相同的产品变体
    UNIQUE(user_id, product_id, variant_id)
);

-- 6. 创建索引以提升性能
CREATE INDEX idx_products_slug ON public.products(slug);
CREATE INDEX idx_products_category_id ON public.products(category_id);
CREATE INDEX idx_products_active ON public.products(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_products_featured ON public.products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_products_price ON public.products(price);
CREATE INDEX idx_products_created_at ON public.products(created_at DESC);

CREATE INDEX idx_product_images_product_id ON public.product_images(product_id);
CREATE INDEX idx_product_images_primary ON public.product_images(is_primary) WHERE is_primary = TRUE;

CREATE INDEX idx_categories_slug ON public.categories(slug);
CREATE INDEX idx_categories_active ON public.categories(is_active) WHERE is_active = TRUE;

-- 7. 全文搜索索引
CREATE INDEX idx_products_search ON public.products
USING GIN(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- 8. 插入示例分类数据
INSERT INTO public.categories (name, slug, description, sort_order) VALUES
('The 7 Signature', 'the-7-signature', 'Our signature collection of premium handcrafted festival wear', 1),
('Festival Tops', 'festival-tops', 'Unique tops perfect for any music festival and rave party', 2),
('Party Bottoms', 'party-bottoms', 'Bottoms that make you stand out at late-night parties', 3),
('Accessories', 'accessories', 'Complete your festival look with our premium accessories', 4),
('LED & Tech Wear', 'led-tech-wear', 'Battery-powered LED clothing that syncs with music', 5),
('Holographic Collection', 'holographic-collection', 'Shine bright under any light with holographic materials', 6);

-- 9. 插入示例产品数据 (ChillFitRave 节日时尚主题)
INSERT INTO public.products (name, slug, description, short_description, sku, price, sale_price, category_id, is_featured, stock_quantity) VALUES
(
    'Neon Dreams Festival Top',
    'neon-dreams-festival-top',
    'Stand out from the crowd with this vibrant neon festival top. Made with premium materials and designed for comfort during long festival days. Features UV-reactive colors that glow under blacklight, perfect for late-night raves and music festivals.',
    'Vibrant neon festival top with UV-reactive colors for the ultimate party experience',
    'NDT001',
    89.99,
    79.99,
    2,
    TRUE,
    15
),
(
    'Holographic Party Shorts',
    'holographic-party-shorts',
    'These holographic shorts will make you shine under any light. Perfect for raves and night parties. Made with high-quality holographic fabric that creates stunning rainbow effects as you move. Comfortable elastic waistband and breathable fabric.',
    'Holographic shorts that create stunning rainbow effects under any light',
    'HPS002',
    74.99,
    NULL,
    3,
    TRUE,
    20
),
(
    'Galaxy Print Crop Top',
    'galaxy-print-crop-top',
    'Journey through space with this stunning galaxy print crop top. Features a mesmerizing cosmic design with stars, nebulas, and galaxies. Made with soft, stretchy fabric that moves with you on the dance floor.',
    'Mesmerizing cosmic galaxy print crop top with stellar design',
    'GPT003',
    65.99,
    59.99,
    2,
    FALSE,
    12
),
(
    'Rainbow Mesh Tank',
    'rainbow-mesh-tank',
    'Light and airy mesh tank with rainbow gradient perfect for summer festivals. Ultra-breathable design keeps you cool while dancing. The rainbow gradient creates a beautiful spectrum effect in photos and under stage lights.',
    'Ultra-breathable rainbow gradient mesh tank for summer festivals',
    'RMT004',
    45.99,
    NULL,
    2,
    TRUE,
    25
),
(
    'LED Light Up Pants',
    'led-light-up-pants',
    'Battery-powered LED pants that sync with music. Be the center of attention with these incredible tech pants featuring 50+ LED lights that pulse and change colors to the beat. Rechargeable battery lasts up to 8 hours.',
    'Music-reactive LED pants with 50+ lights and 8-hour battery life',
    'LLP005',
    129.99,
    119.99,
    5,
    TRUE,
    8
),
(
    'Cosmic Bodysuit',
    'cosmic-bodysuit',
    'One-piece cosmic themed bodysuit with metallic finish and comfortable stretch fabric. Features constellation patterns and metallic accents that shimmer under lights. Perfect for festivals, raves, and costume parties.',
    'Metallic cosmic bodysuit with constellation patterns and shimmer effect',
    'CBS006',
    99.99,
    NULL,
    1,
    FALSE,
    18
),
(
    'Iridescent Crop Jacket',
    'iridescent-crop-jacket',
    'Futuristic crop jacket with iridescent finish that shifts colors as you move. Lightweight and perfect for layering over festival outfits. Features reflective details and a cropped silhouette for a modern rave aesthetic.',
    'Color-shifting iridescent crop jacket with reflective details',
    'ICJ007',
    85.99,
    75.99,
    1,
    TRUE,
    14
),
(
    'Glow Stick Accessories Set',
    'glow-stick-accessories-set',
    'Complete accessories set including LED bracelets, necklaces, and hair clips. All items are rechargeable and feature multiple color modes. Perfect for adding that extra glow to your festival look.',
    'Complete LED accessories set with rechargeable glow items',
    'GAS008',
    35.99,
    29.99,
    4,
    FALSE,
    30
);

-- 10. 插入产品图片数据 (使用高质量 Unsplash 图片)
INSERT INTO public.product_images (product_id, image_url, alt_text, is_primary, sort_order)
SELECT
    p.id,
    CASE
        WHEN p.sku = 'NDT001' THEN 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=800&fit=crop'
        WHEN p.sku = 'HPS002' THEN 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&h=800&fit=crop'
        WHEN p.sku = 'GPT003' THEN 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=800&fit=crop'
        WHEN p.sku = 'RMT004' THEN 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=800&fit=crop'
        WHEN p.sku = 'LLP005' THEN 'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=800&h=800&fit=crop'
        WHEN p.sku = 'CBS006' THEN 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=800&fit=crop'
        WHEN p.sku = 'ICJ007' THEN 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&h=800&fit=crop'
        ELSE 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=800&h=800&fit=crop'
    END,
    p.name || ' - Main Product Image',
    TRUE,
    0
FROM public.products p;

-- 11. 为每个产品添加额外的图片
INSERT INTO public.product_images (product_id, image_url, alt_text, is_primary, sort_order)
SELECT
    p.id,
    CASE
        WHEN p.sku = 'NDT001' THEN 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&h=800&fit=crop'
        WHEN p.sku = 'HPS002' THEN 'https://images.unsplash.com/photo-1558008258-3256797b43f3?w=800&h=800&fit=crop'
        WHEN p.sku = 'GPT003' THEN 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop'
        WHEN p.sku = 'RMT004' THEN 'https://images.unsplash.com/photo-1544829099-b9a0c5303bea?w=800&h=800&fit=crop'
        WHEN p.sku = 'LLP005' THEN 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&h=800&fit=crop'
        WHEN p.sku = 'CBS006' THEN 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=800&fit=crop'
        ELSE 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=800&h=800&fit=crop'
    END,
    p.name || ' - Alternative View',
    FALSE,
    1
FROM public.products p;

-- 12. 创建一些产品变体 (颜色和尺寸)
INSERT INTO public.product_variants (product_id, name, sku, price, sale_price, stock_quantity, attributes)
SELECT
    p.id,
    p.name || ' - ' || variant.name,
    p.sku || '-' || variant.sku_suffix,
    p.price,
    p.sale_price,
    FLOOR(RANDOM() * 10) + 3, -- 随机库存 3-12
    variant.attributes::jsonb
FROM public.products p
CROSS JOIN (
    VALUES
    ('Red Small', 'R-S', '{"color": "red", "size": "S"}'),
    ('Red Medium', 'R-M', '{"color": "red", "size": "M"}'),
    ('Red Large', 'R-L', '{"color": "red", "size": "L"}'),
    ('Blue Small', 'B-S', '{"color": "blue", "size": "S"}'),
    ('Blue Medium', 'B-M', '{"color": "blue", "size": "M"}'),
    ('Blue Large', 'B-L', '{"color": "blue", "size": "L"}')
) AS variant(name, sku_suffix, attributes)
WHERE p.sku IN ('NDT001', 'GPT003', 'CBS006'); -- 只为部分产品创建变体

-- 13. 设置 RLS (行级安全) 策略
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- 产品和分类对所有人可见
CREATE POLICY "Products are publicly readable" ON public.products
    FOR SELECT USING (true);

CREATE POLICY "Categories are publicly readable" ON public.categories
    FOR SELECT USING (true);

CREATE POLICY "Product images are publicly readable" ON public.product_images
    FOR SELECT USING (true);

CREATE POLICY "Product variants are publicly readable" ON public.product_variants
    FOR SELECT USING (true);

-- 购物车只能被用户自己访问
CREATE POLICY "Users can manage own cart items" ON public.cart_items
    USING (auth.uid() = user_id);

-- 14. 创建有用的视图
CREATE VIEW public.products_with_images AS
SELECT
    p.*,
    c.name as category_name,
    c.slug as category_slug,
    array_agg(
        json_build_object(
            'id', pi.id,
            'image_url', pi.image_url,
            'alt_text', pi.alt_text,
            'is_primary', pi.is_primary,
            'sort_order', pi.sort_order
        ) ORDER BY pi.sort_order
    ) as images
FROM public.products p
LEFT JOIN public.categories c ON p.category_id = c.id
LEFT JOIN public.product_images pi ON p.id = pi.product_id
GROUP BY p.id, c.name, c.slug;

-- 15. 创建全文搜索函数
CREATE OR REPLACE FUNCTION search_products(
    search_term TEXT DEFAULT '',
    category_slug TEXT DEFAULT NULL,
    min_price DECIMAL DEFAULT NULL,
    max_price DECIMAL DEFAULT NULL,
    limit_count INTEGER DEFAULT 20,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE(
    id UUID,
    name VARCHAR,
    slug VARCHAR,
    short_description TEXT,
    price DECIMAL,
    sale_price DECIMAL,
    stock_quantity INTEGER,
    is_featured BOOLEAN,
    category_name VARCHAR,
    category_slug VARCHAR,
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.name,
        p.slug,
        p.short_description,
        p.price,
        p.sale_price,
        p.stock_quantity,
        p.is_featured,
        c.name as category_name,
        c.slug as category_slug,
        ts_rank(to_tsvector('english', p.name || ' ' || COALESCE(p.description, '')),
                plainto_tsquery('english', search_term)) as rank
    FROM public.products p
    LEFT JOIN public.categories c ON p.category_id = c.id
    WHERE
        p.is_active = true
        AND (search_term = '' OR to_tsvector('english', p.name || ' ' || COALESCE(p.description, '')) @@ plainto_tsquery('english', search_term))
        AND (category_slug IS NULL OR c.slug = category_slug)
        AND (min_price IS NULL OR p.price >= min_price)
        AND (max_price IS NULL OR p.price <= max_price)
    ORDER BY
        CASE WHEN search_term = '' THEN p.created_at ELSE NULL END DESC,
        CASE WHEN search_term != '' THEN rank ELSE NULL END DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;

-- 完成！数据库结构和示例数据已创建
SELECT 'ChillFitRave 数据库设置完成！' as message,
       (SELECT COUNT(*) FROM public.categories) as categories_count,
       (SELECT COUNT(*) FROM public.products) as products_count,
       (SELECT COUNT(*) FROM public.product_images) as images_count,
       (SELECT COUNT(*) FROM public.product_variants) as variants_count;