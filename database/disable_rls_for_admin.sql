-- 禁用所有表的行级安全策略（开发环境）
-- 注意：生产环境应该配置适当的 RLS 策略而不是完全禁用

-- 禁用 products 表的 RLS
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- 禁用 product_images 表的 RLS
ALTER TABLE product_images DISABLE ROW LEVEL SECURITY;

-- 禁用 product_variants 表的 RLS
ALTER TABLE product_variants DISABLE ROW LEVEL SECURITY;

-- 禁用 categories 表的 RLS
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;

-- 禁用 product_tags 表的 RLS
ALTER TABLE product_tags DISABLE ROW LEVEL SECURITY;

-- 禁用 product_tag_relations 表的 RLS
ALTER TABLE product_tag_relations DISABLE ROW LEVEL SECURITY;

-- 禁用 product_collections 表的 RLS
ALTER TABLE product_collections DISABLE ROW LEVEL SECURITY;

-- 禁用 product_collection_relations 表的 RLS
ALTER TABLE product_collection_relations DISABLE ROW LEVEL SECURITY;

-- 禁用 admins 表的 RLS
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;

-- 禁用 site_settings 表的 RLS
ALTER TABLE site_settings DISABLE ROW LEVEL SECURITY;

-- 验证状态
SELECT
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
    AND tablename IN (
        'products',
        'product_images',
        'product_variants',
        'categories',
        'product_tags',
        'product_tag_relations',
        'product_collections',
        'product_collection_relations',
        'admins',
        'site_settings'
    );
