-- 更新产品图片的脚本
-- 如果你有ChillFit Rave的真实图片，可以用这个脚本批量替换

-- 示例：更新特定产品的图片
-- 将 'your-new-image-url' 替换为实际的图片URL

-- 更新蝴蝶翅膀套装的图片
UPDATE product_images
SET image_url = 'https://your-domain.com/images/butterfly-wings.jpg'
WHERE product_id = (SELECT id FROM products WHERE slug = 'glitter-butterfly-wings-set')
AND is_primary = true;

-- 更新霓虹套装的图片
UPDATE product_images
SET image_url = 'https://your-domain.com/images/neon-set.jpg'
WHERE product_id = (SELECT id FROM products WHERE slug = 'neon-dreams-two-piece')
AND is_primary = true;

-- 更新全息套装的图片
UPDATE product_images
SET image_url = 'https://your-domain.com/images/holographic-set.jpg'
WHERE product_id = (SELECT id FROM products WHERE slug = 'holographic-goddess-set')
AND is_primary = true;

-- 批量添加多张图片给一个产品的示例：
-- INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order)
-- SELECT
--     (SELECT id FROM products WHERE slug = 'neon-dreams-two-piece'),
--     unnest(ARRAY[
--         'https://your-domain.com/images/neon-1.jpg',
--         'https://your-domain.com/images/neon-2.jpg',
--         'https://your-domain.com/images/neon-3.jpg'
--     ]),
--     'Neon Dreams Set - Additional Image',
--     false,
--     generate_series(2, 4);

-- 查看当前所有产品和它们的图片
SELECT
    p.name,
    p.slug,
    pi.image_url,
    pi.is_primary
FROM products p
LEFT JOIN product_images pi ON p.id = pi.product_id
ORDER BY p.name, pi.sort_order;