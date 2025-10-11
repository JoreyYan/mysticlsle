-- ChillFit Rave 真实产品数据插入脚本（修复版）
-- 修复了SKU必填字段的问题

-- 首先确保有基础分类数据
INSERT INTO categories (name, slug, description, is_active) VALUES
('Sets', 'sets', 'Complete matching sets for festivals and raves', true),
('Tops', 'tops', 'Crop tops, bras, and upper body wear', true),
('Bottoms', 'bottoms', 'Shorts, pants, and lower body wear', true),
('Halloween', 'halloween', 'Spooky season special collection', true),
('New Arrivals', 'new', 'Latest drops and trending pieces', true),
('Sale', 'sale', 'Discounted items and clearance', true)
ON CONFLICT (slug) DO NOTHING;

-- 插入真实的 ChillFit Rave 风格产品（包含SKU）
INSERT INTO products (
    id, name, slug, description, short_description, sku,
    price, sale_price, stock_quantity, manage_stock,
    is_active, is_featured, category_id,
    meta_title, meta_description, created_at
) VALUES

-- Halloween 系列
(
    gen_random_uuid(),
    'Glitter Butterfly Wings Set',
    'glitter-butterfly-wings-set',
    'Transform into a magical butterfly with this stunning glitter wing set. Perfect for Halloween parties, festivals, and raves. Includes matching accessories and body jewels for a complete ethereal look.',
    '✨ 闪闪发光的蝴蝶翅膀套装，完美的万圣节造型',
    'CFR-BWS-001',
    89.99,
    NULL,
    15,
    true,
    true,
    true,
    (SELECT id FROM categories WHERE slug = 'halloween'),
    'Glitter Butterfly Wings Set - ChillFit Rave',
    'Magical butterfly wings perfect for Halloween and festivals',
    now()
),

(
    gen_random_uuid(),
    'Dark Angel Costume Complete',
    'dark-angel-costume-complete',
    'Embrace your dark side with this dramatic angel costume. Features black lace details, gothic accessories, and stunning dark wings. Complete with matching choker and arm cuffs.',
    '🖤 哥特风暗黑天使套装，戏剧化造型',
    'CFR-DAC-001',
    149.99,
    129.99,
    8,
    true,
    true,
    true,
    (SELECT id FROM categories WHERE slug = 'halloween'),
    'Dark Angel Costume - Gothic Halloween Outfit',
    'Dramatic dark angel costume with wings and gothic accessories',
    now()
),

-- Sets 系列
(
    gen_random_uuid(),
    'Neon Dreams Two-Piece',
    'neon-dreams-two-piece',
    'Light up the night with this electric neon two-piece set. UV reactive materials glow brilliantly under blacklight. Perfect for raves, festivals, and night parties. Comfortable stretch fabric.',
    '⚡ UV反光霓虹套装，在黑光下发光',
    'CFR-NDT-001',
    79.99,
    NULL,
    25,
    true,
    true,
    true,
    (SELECT id FROM categories WHERE slug = 'sets'),
    'Neon Dreams UV Reactive Set - ChillFit Rave',
    'Electric neon two-piece set with UV glow properties',
    now()
),

(
    gen_random_uuid(),
    'Holographic Goddess Set',
    'holographic-goddess-set',
    'Channel your inner goddess with this mesmerizing holographic set. Reflects rainbow colors in every light. High-quality iridescent fabric that shifts colors beautifully. Complete with matching accessories.',
    '🌈 全息女神套装，彩虹色反光效果',
    'CFR-HGS-001',
    94.99,
    84.99,
    12,
    true,
    true,
    false,
    (SELECT id FROM categories WHERE slug = 'sets'),
    'Holographic Goddess Set - Rainbow Iridescent',
    'Stunning holographic set that reflects rainbow colors',
    now()
),

-- Tops 系列
(
    gen_random_uuid(),
    'Crystal Mesh Crop Top',
    'crystal-mesh-crop-top',
    'Sparkle and shine in this crystal-embellished mesh crop top. Features genuine crystals and rhinestones. Perfect layering piece for festivals. Adjustable ties for perfect fit.',
    '💎 水晶网眼短上衣，可调节绑带',
    'CFR-CMC-001',
    45.99,
    NULL,
    30,
    true,
    true,
    true,
    (SELECT id FROM categories WHERE slug = 'tops'),
    'Crystal Mesh Crop Top - Festival Wear',
    'Sparkling crystal mesh crop top with adjustable fit',
    now()
),

(
    gen_random_uuid(),
    'Metallic Bandeau Bra',
    'metallic-bandeau-bra',
    'Classic metallic bandeau bra in shimmering finish. Comfortable stretch fabric with removable padding. Available in multiple metallic colors. Perfect for festivals and raves.',
    '✨ 金属色抹胸文胸，多色可选',
    'CFR-MBB-001',
    34.99,
    29.99,
    40,
    true,
    true,
    false,
    (SELECT id FROM categories WHERE slug = 'tops'),
    'Metallic Bandeau Bra - Rave Essentials',
    'Comfortable metallic bandeau in multiple colors',
    now()
),

-- Bottoms 系列
(
    gen_random_uuid(),
    'High-Waisted Booty Shorts',
    'high-waisted-booty-shorts',
    'Flattering high-waisted booty shorts in premium stretch fabric. Perfect fit and comfort for dancing all night. Available in solid colors and patterns.',
    '🍑 高腰热裤，舒适弹力面料',
    'CFR-HWB-001',
    39.99,
    NULL,
    35,
    true,
    true,
    false,
    (SELECT id FROM categories WHERE slug = 'bottoms'),
    'High-Waisted Booty Shorts - Dance Comfort',
    'Comfortable high-waisted shorts perfect for festivals',
    now()
),

-- New Arrivals
(
    gen_random_uuid(),
    'LED Light-Up Body Chain',
    'led-light-up-body-chain',
    'NEW! Stand out with this LED light-up body chain. Multiple flashing modes and color options. USB rechargeable battery. Adjustable sizing fits most body types.',
    '🔥 NEW! LED发光身体链，多种模式',
    'CFR-LBC-001',
    55.99,
    NULL,
    20,
    true,
    true,
    true,
    (SELECT id FROM categories WHERE slug = 'new'),
    'LED Body Chain - Light Up Accessory',
    'New LED light-up body chain with multiple modes',
    now()
),

-- Sale Items
(
    gen_random_uuid(),
    'Basic Mesh Tank Top',
    'basic-mesh-tank-top',
    'Classic mesh tank top in various colors. Comfortable and breathable. Perfect layering piece or worn alone. Great value basic piece.',
    '👕 基础款网眼背心，多色可选',
    'CFR-BMT-001',
    24.99,
    19.99,
    50,
    true,
    true,
    false,
    (SELECT id FROM categories WHERE slug = 'sale'),
    'Mesh Tank Top - Festival Basic',
    'Comfortable mesh tank top in multiple colors',
    now()
);

-- 为每个产品插入主图片
INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order)
SELECT
    p.id,
    CASE p.slug
        WHEN 'glitter-butterfly-wings-set' THEN 'https://images.unsplash.com/photo-1509909756405-be0199881695?w=800'
        WHEN 'dark-angel-costume-complete' THEN 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800'
        WHEN 'neon-dreams-two-piece' THEN 'https://images.unsplash.com/photo-1516834474-1ca7043096ea?w=800'
        WHEN 'holographic-goddess-set' THEN 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800'
        WHEN 'crystal-mesh-crop-top' THEN 'https://images.unsplash.com/photo-1583743089816-6be1ec6a2c86?w=800'
        WHEN 'metallic-bandeau-bra' THEN 'https://images.unsplash.com/photo-1564557287817-3785e38ec1f4?w=800'
        WHEN 'high-waisted-booty-shorts' THEN 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800'
        WHEN 'led-light-up-body-chain' THEN 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800'
        WHEN 'basic-mesh-tank-top' THEN 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800'
    END,
    p.name || ' - Main Image',
    true,
    1
FROM products p
WHERE p.slug IN (
    'glitter-butterfly-wings-set', 'dark-angel-costume-complete', 'neon-dreams-two-piece',
    'holographic-goddess-set', 'crystal-mesh-crop-top', 'metallic-bandeau-bra',
    'high-waisted-booty-shorts', 'led-light-up-body-chain', 'basic-mesh-tank-top'
);

-- 为部分产品添加变体（尺寸）
INSERT INTO product_variants (product_id, sku, price, sale_price, stock_quantity, attributes)
SELECT
    p.id,
    p.sku || '-' || size_info.size_code,
    p.price,
    p.sale_price,
    CASE size_info.size_code
        WHEN 'XS' THEN 3
        WHEN 'S' THEN 8
        WHEN 'M' THEN 10
        WHEN 'L' THEN 7
        WHEN 'XL' THEN 4
    END,
    ('{"size": "' || size_info.size_name || '"}')::jsonb
FROM products p
CROSS JOIN (
    VALUES
        ('XS', 'XS'),
        ('S', 'Small'),
        ('M', 'Medium'),
        ('L', 'Large'),
        ('XL', 'XL')
) AS size_info(size_code, size_name)
WHERE p.slug IN (
    'neon-dreams-two-piece', 'holographic-goddess-set', 'crystal-mesh-crop-top',
    'metallic-bandeau-bra', 'high-waisted-booty-shorts', 'basic-mesh-tank-top'
);

-- 为套装产品添加颜色变体
INSERT INTO product_variants (product_id, sku, price, sale_price, stock_quantity, attributes)
SELECT
    p.id,
    p.sku || '-' || color_info.color_code,
    p.price,
    p.sale_price,
    CASE color_info.color_code
        WHEN 'PK' THEN 5
        WHEN 'BL' THEN 6
        WHEN 'PR' THEN 4
        WHEN 'SL' THEN 8
    END,
    ('{"color": "' || color_info.color_name || '"}')::jsonb
FROM products p
CROSS JOIN (
    VALUES
        ('PK', 'Pink'),
        ('BL', 'Electric Blue'),
        ('PR', 'Purple'),
        ('SL', 'Silver')
) AS color_info(color_code, color_name)
WHERE p.slug IN (
    'glitter-butterfly-wings-set', 'dark-angel-costume-complete', 'led-light-up-body-chain'
);

-- 显示插入结果
SELECT 'Products inserted successfully! 🎉' as message;
SELECT COUNT(*) as total_products FROM products;
SELECT COUNT(*) as total_images FROM product_images;
SELECT COUNT(*) as total_variants FROM product_variants;

-- 显示新插入的产品列表
SELECT
    p.name as "产品名称",
    p.sku as "SKU编号",
    '$' || p.price::text as "价格",
    CASE WHEN p.sale_price IS NOT NULL THEN '$' || p.sale_price::text ELSE 'N/A' END as "特价",
    c.name as "分类"
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.sku LIKE 'CFR-%'
ORDER BY p.created_at DESC;