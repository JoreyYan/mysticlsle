-- ChillFit Rave 示例数据
-- 请在执行database-schema.sql之后运行此文件

-- 插入示例商品数据
INSERT INTO products (name, slug, description, short_description, sku, price, compare_at_price, inventory_quantity, featured_image, images, status, is_featured, category_id, sort_order) VALUES

-- Halloween 系列
('Glitter Fairy Wings Set', 'glitter-fairy-wings-set',
'Transform into a mystical fairy with these stunning glitter wings. Perfect for Halloween parties, raves, and festivals. The set includes matching accessories for a complete magical look.',
'Mystical fairy wings with matching accessories - perfect for Halloween and festivals',
'CFR-FAIRY-001', 89.99, 129.99, 15,
'/images/products/fairy-wings-main.jpg',
'["/images/products/fairy-wings-1.jpg", "/images/products/fairy-wings-2.jpg", "/images/products/fairy-wings-3.jpg"]',
'active', true,
(SELECT id FROM categories WHERE slug = 'halloween'),
1),

('Dark Angel Costume', 'dark-angel-costume',
'Embrace your dark side with this stunning dark angel costume. Features intricate lace details, dramatic wings, and gothic accessories.',
'Dramatic dark angel costume with wings and gothic accessories',
'CFR-ANGEL-001', 149.99, 199.99, 8,
'/images/products/dark-angel-main.jpg',
'["/images/products/dark-angel-1.jpg", "/images/products/dark-angel-2.jpg"]',
'active', true,
(SELECT id FROM categories WHERE slug = 'halloween'),
2),

-- Sets 系列
('Neon Dreams Two-Piece', 'neon-dreams-two-piece',
'Light up the night with this electric two-piece set. UV reactive materials glow under blacklight for the ultimate rave experience.',
'Electric two-piece set with UV reactive glow-in-the-dark materials',
'CFR-NEON-001', 79.99, 99.99, 25,
'/images/products/neon-dreams-main.jpg',
'["/images/products/neon-dreams-1.jpg", "/images/products/neon-dreams-2.jpg"]',
'active', true,
(SELECT id FROM categories WHERE slug = 'sets'),
1),

('Holographic Goddess Set', 'holographic-goddess-set',
'Channel your inner goddess with this mesmerizing holographic set. Reflects rainbow colors in every light.',
'Stunning holographic set that reflects rainbow colors in every light',
'CFR-HOLO-001', 94.99, 119.99, 12,
'/images/products/holographic-main.jpg',
'["/images/products/holographic-1.jpg", "/images/products/holographic-2.jpg"]',
'active', false,
(SELECT id FROM categories WHERE slug = 'sets'),
2),

-- New Arrivals
('Crystal Mesh Body Chain', 'crystal-mesh-body-chain',
'Sparkle and shine with our new crystal mesh body chain. Adjustable sizing fits most body types.',
'New arrival! Sparkling crystal mesh body chain with adjustable sizing',
'CFR-CHAIN-001', 45.99, NULL, 30,
'/images/products/body-chain-main.jpg',
'["/images/products/body-chain-1.jpg"]',
'active', true,
(SELECT id FROM categories WHERE slug = 'new'),
1),

-- Limited Edition
('Aurora Borealis Jacket', 'aurora-borealis-jacket',
'Limited edition holographic jacket inspired by the Northern Lights. Only 50 pieces available worldwide.',
'LIMITED EDITION: Holographic jacket inspired by Aurora Borealis - only 50 made',
'CFR-AURORA-001', 299.99, 399.99, 3,
'/images/products/aurora-jacket-main.jpg',
'["/images/products/aurora-jacket-1.jpg", "/images/products/aurora-jacket-2.jpg"]',
'active', true,
(SELECT id FROM categories WHERE slug = 'limited'),
1),

-- Accessories
('LED Light-Up Choker', 'led-light-up-choker',
'Stand out from the crowd with this LED light-up choker. Multiple color modes and patterns.',
'LED choker with multiple color modes and flashing patterns',
'CFR-CHOKER-001', 29.99, 39.99, 50,
'/images/products/led-choker-main.jpg',
'["/images/products/led-choker-1.jpg"]',
'active', false,
(SELECT id FROM categories WHERE slug = 'accessories'),
1),

('Holographic Platform Boots', 'holographic-platform-boots',
'Step up your game with these stunning holographic platform boots. Comfortable and eye-catching.',
'Holographic platform boots - comfortable and absolutely show-stopping',
'CFR-BOOTS-001', 159.99, 199.99, 18,
'/images/products/platform-boots-main.jpg',
'["/images/products/platform-boots-1.jpg", "/images/products/platform-boots-2.jpg"]',
'active', true,
(SELECT id FROM categories WHERE slug = 'accessories'),
2),

-- Sale Items
('Metallic Crop Top', 'metallic-crop-top',
'Classic metallic crop top perfect for any rave or festival. Comfortable stretch fabric.',
'ON SALE: Classic metallic crop top in comfortable stretch fabric',
'CFR-CROP-001', 24.99, 44.99, 40,
'/images/products/metallic-crop-main.jpg',
'["/images/products/metallic-crop-1.jpg"]',
'active', false,
(SELECT id FROM categories WHERE slug = 'sale'),
1),

-- Tops
('Mesh Fishnet Top', 'mesh-fishnet-top',
'Edgy mesh fishnet top that pairs perfectly with any bottom. Available in multiple colors.',
'Edgy mesh fishnet top available in multiple colors',
'CFR-MESH-001', 34.99, NULL, 35,
'/images/products/fishnet-top-main.jpg',
'["/images/products/fishnet-top-1.jpg"]',
'active', false,
(SELECT id FROM categories WHERE slug = 'tops'),
1);

-- 插入商品变体（尺寸变体）
INSERT INTO product_variants (product_id, title, sku, price, inventory_quantity, option1_name, option1_value, sort_order) VALUES

-- Fairy Wings Set 变体
((SELECT id FROM products WHERE slug = 'glitter-fairy-wings-set'), 'One Size', 'CFR-FAIRY-001-OS', 89.99, 15, 'Size', 'One Size', 1),

-- Dark Angel Costume 变体
((SELECT id FROM products WHERE slug = 'dark-angel-costume'), 'Small', 'CFR-ANGEL-001-S', 149.99, 3, 'Size', 'Small', 1),
((SELECT id FROM products WHERE slug = 'dark-angel-costume'), 'Medium', 'CFR-ANGEL-001-M', 149.99, 3, 'Size', 'Medium', 2),
((SELECT id FROM products WHERE slug = 'dark-angel-costume'), 'Large', 'CFR-ANGEL-001-L', 149.99, 2, 'Size', 'Large', 3),

-- Neon Dreams Two-Piece 变体
((SELECT id FROM products WHERE slug = 'neon-dreams-two-piece'), 'XS', 'CFR-NEON-001-XS', 79.99, 5, 'Size', 'XS', 1),
((SELECT id FROM products WHERE slug = 'neon-dreams-two-piece'), 'S', 'CFR-NEON-001-S', 79.99, 8, 'Size', 'S', 2),
((SELECT id FROM products WHERE slug = 'neon-dreams-two-piece'), 'M', 'CFR-NEON-001-M', 79.99, 7, 'Size', 'M', 3),
((SELECT id FROM products WHERE slug = 'neon-dreams-two-piece'), 'L', 'CFR-NEON-001-L', 79.99, 5, 'Size', 'L', 4),

-- Holographic Platform Boots 变体
((SELECT id FROM products WHERE slug = 'holographic-platform-boots'), 'US 6', 'CFR-BOOTS-001-6', 159.99, 3, 'Size', 'US 6', 1),
((SELECT id FROM products WHERE slug = 'holographic-platform-boots'), 'US 7', 'CFR-BOOTS-001-7', 159.99, 4, 'Size', 'US 7', 2),
((SELECT id FROM products WHERE slug = 'holographic-platform-boots'), 'US 8', 'CFR-BOOTS-001-8', 159.99, 5, 'Size', 'US 8', 3),
((SELECT id FROM products WHERE slug = 'holographic-platform-boots'), 'US 9', 'CFR-BOOTS-001-9', 159.99, 4, 'Size', 'US 9', 4),
((SELECT id FROM products WHERE slug = 'holographic-platform-boots'), 'US 10', 'CFR-BOOTS-001-10', 159.99, 2, 'Size', 'US 10', 5);

-- 插入产品标签
INSERT INTO product_tags (name, slug) VALUES
('Holographic', 'holographic'),
('LED', 'led'),
('Glow', 'glow'),
('Rave', 'rave'),
('Festival', 'festival'),
('Halloween', 'halloween'),
('Wings', 'wings'),
('Costume', 'costume'),
('Neon', 'neon'),
('Platform', 'platform'),
('Mesh', 'mesh'),
('Crystal', 'crystal');

-- 关联产品和标签
INSERT INTO product_tag_relations (product_id, tag_id) VALUES
-- Fairy Wings Set
((SELECT id FROM products WHERE slug = 'glitter-fairy-wings-set'), (SELECT id FROM product_tags WHERE slug = 'wings')),
((SELECT id FROM products WHERE slug = 'glitter-fairy-wings-set'), (SELECT id FROM product_tags WHERE slug = 'halloween')),
((SELECT id FROM products WHERE slug = 'glitter-fairy-wings-set'), (SELECT id FROM product_tags WHERE slug = 'costume')),

-- Dark Angel Costume
((SELECT id FROM products WHERE slug = 'dark-angel-costume'), (SELECT id FROM product_tags WHERE slug = 'wings')),
((SELECT id FROM products WHERE slug = 'dark-angel-costume'), (SELECT id FROM product_tags WHERE slug = 'halloween')),
((SELECT id FROM products WHERE slug = 'dark-angel-costume'), (SELECT id FROM product_tags WHERE slug = 'costume')),

-- Neon Dreams
((SELECT id FROM products WHERE slug = 'neon-dreams-two-piece'), (SELECT id FROM product_tags WHERE slug = 'neon')),
((SELECT id FROM products WHERE slug = 'neon-dreams-two-piece'), (SELECT id FROM product_tags WHERE slug = 'glow')),
((SELECT id FROM products WHERE slug = 'neon-dreams-two-piece'), (SELECT id FROM product_tags WHERE slug = 'rave')),

-- Holographic Goddess Set
((SELECT id FROM products WHERE slug = 'holographic-goddess-set'), (SELECT id FROM product_tags WHERE slug = 'holographic')),
((SELECT id FROM products WHERE slug = 'holographic-goddess-set'), (SELECT id FROM product_tags WHERE slug = 'rave')),

-- LED Choker
((SELECT id FROM products WHERE slug = 'led-light-up-choker'), (SELECT id FROM product_tags WHERE slug = 'led')),
((SELECT id FROM products WHERE slug = 'led-light-up-choker'), (SELECT id FROM product_tags WHERE slug = 'glow')),

-- Platform Boots
((SELECT id FROM products WHERE slug = 'holographic-platform-boots'), (SELECT id FROM product_tags WHERE slug = 'holographic')),
((SELECT id FROM products WHERE slug = 'holographic-platform-boots'), (SELECT id FROM product_tags WHERE slug = 'platform'));

-- 更新现有的Instagram展示数据
INSERT INTO social_showcase (platform, username, external_link, image_url, caption, display_order, is_active) VALUES
('instagram', '@judygrr', 'https://www.instagram.com/p/DI0jMP0xu9y/', '/images/instagram/judy.png', 'Stunning in our Fairy Wings Set! ✨', 1, true),
('instagram', '@elseanapanzer', 'https://www.instagram.com/p/DH9R_COSeJz/', '/images/instagram/elsea.png', 'Neon Dreams bringing the energy! 🌈', 2, true),
('instagram', '@meganmarieee_', 'https://www.instagram.com/p/DGgOTSmPyN_/', '/images/instagram/megan.png', 'Holographic goddess vibes ✨', 3, true),
('instagram', '@terrx.duonx', 'https://www.instagram.com/p/DKfU0SKSpC_/', '/images/instagram/terr.png', 'Festival ready in CFR! 🎪', 4, true),
('instagram', '@katiepacini', 'https://www.instagram.com/p/DKU1ffsO0dv/', '/images/instagram/katie.png', 'Platform boots hit different 👠', 5, true),
('instagram', '@sarachaee', 'https://www.instagram.com/p/DKIDpdmJwFV/', '/images/instagram/sara.png', 'LED accessories stealing the show ✨', 6, true),
('instagram', '@hachiekiss', 'https://www.instagram.com/p/DKAeLPZSwsW/', '/images/instagram/hachie.png', 'Dark angel energy 🖤', 7, true),
('instagram', '@emilythebearrr', 'https://www.instagram.com/p/DJ2zE9CsQg5/', '/images/instagram/emily.png', 'Aurora jacket is everything! 🌙', 8, true);

-- 更新页面视觉资源
INSERT INTO page_visuals (page_name, section, resource_key, title, url, alt_text, link_url, position, is_active) VALUES
('homepage', 'hero_banner', 'main_banner', 'Boo-tiful Looks, Killer Vibes', '/images/halloween-banner.webp', 'Halloween collection banner', '/collections/halloween', 1, true),
('homepage', 'secondary_banner', 'main_character_desktop', 'For Main Characters Only', '/images/main-character-banner.png', 'Main character collection', '/collections/sets', 2, true),
('homepage', 'secondary_banner', 'main_character_mobile', 'Only Main Character Vibes', '/images/main-character-mobile.png', 'Main character collection mobile', '/collections/sets', 3, true),
('homepage', 'halloween_shop', 'side_image', 'Halloween Model', '/images/halloween-girl.webp', 'Halloween costume model', '/collections/halloween', 4, true),
('homepage', 'shipping_banner', 'desktop_banner', 'We Ship Global', '/images/we-ship-global.png', 'Global shipping banner', '/shipping', 5, true),
('homepage', 'shipping_banner', 'mobile_banner', 'We Ship Global', '/images/we-ship-global-mobile.png', 'Global shipping banner mobile', '/shipping', 6, true);