-- 为管理后台配置 RLS 策略
-- 这是更安全的方法，允许匿名用户（使用 anon key）进行操作

-- Products 表策略
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 允许所有人读取激活的商品
CREATE POLICY "Allow public read active products" ON products
    FOR SELECT
    USING (is_active = true);

-- 允许使用 service role 或 anon key 的用户进行所有操作
CREATE POLICY "Allow anon all on products" ON products
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Product Images 表策略
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read product images" ON product_images
    FOR SELECT
    USING (true);

CREATE POLICY "Allow anon all on product_images" ON product_images
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Product Variants 表策略
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read product variants" ON product_variants
    FOR SELECT
    USING (true);

CREATE POLICY "Allow anon all on product_variants" ON product_variants
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Categories 表策略
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read active categories" ON categories
    FOR SELECT
    USING (is_active = true);

CREATE POLICY "Allow anon all on categories" ON categories
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Product Tags 表策略
ALTER TABLE product_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read tags" ON product_tags
    FOR SELECT
    USING (true);

CREATE POLICY "Allow anon all on product_tags" ON product_tags
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Product Tag Relations 表策略
ALTER TABLE product_tag_relations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read tag relations" ON product_tag_relations
    FOR SELECT
    USING (true);

CREATE POLICY "Allow anon all on product_tag_relations" ON product_tag_relations
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Product Collections 表策略
ALTER TABLE product_collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read active collections" ON product_collections
    FOR SELECT
    USING (is_active = true);

CREATE POLICY "Allow anon all on product_collections" ON product_collections
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Product Collection Relations 表策略
ALTER TABLE product_collection_relations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read collection relations" ON product_collection_relations
    FOR SELECT
    USING (true);

CREATE POLICY "Allow anon all on product_collection_relations" ON product_collection_relations
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Admins 表策略
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon all on admins" ON admins
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Site Settings 表策略
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read site settings" ON site_settings
    FOR SELECT
    USING (true);

CREATE POLICY "Allow anon all on site_settings" ON site_settings
    FOR ALL
    USING (true)
    WITH CHECK (true);
