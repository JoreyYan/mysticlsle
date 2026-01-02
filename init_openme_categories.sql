
-- 1. 清理旧分类 (可选，为了干净起见，如果不想删旧的可以注释掉)
-- 注意：这会将现有商品的 category_id 置为 NULL，但不会删除商品
UPDATE products SET category_id = NULL;
DELETE FROM categories;

-- 2. 插入 OpenME 的新分类结构
INSERT INTO categories (name, slug, description, sort_order, is_active) VALUES
('Lingerie', 'lingerie', 'Elegant and sexy lingerie for every occasion', 10, true),
('Teddies', 'teddies', 'One-piece wonders that captivate', 20, true),
('Nightwear', 'nightwear', 'Comfort meets seduction', 30, true),
('Sales', 'sale', 'Exclusive deals on premium items', 40, true),
('RolePlay', 'roleplay', 'Fantasy costumes and accessories', 50, true),
('Panties', 'panties', 'Essential bottoms in various styles', 60, true),
('The 7 Signature', 'the-7-signature', 'Our exclusive signature collection', 70, true),
('Festival Tops', 'festival-tops', 'Stand out with our festival tops', 80, true),
('Party Bottoms', 'party-bottoms', 'Bottoms designed for the party', 90, true),
('LED & Tech Wear', 'led-tech-wear', 'Light up the night', 100, true);

-- 3. (可选) 尝试将一些旧商品分配给新分类，避免前台完全空白
-- 这里只是简单的示例匹配，实际还需人工在后台调整
-- 假设把所有原来的 "Top" 分配给 "Festival Tops"
UPDATE products 
SET category_id = (SELECT id FROM categories WHERE slug = 'festival-tops')
WHERE name ILIKE '%top%';

-- 假设把所有原来的 "Shorts" 或 "Pants" 分配给 "Party Bottoms"
UPDATE products 
SET category_id = (SELECT id FROM categories WHERE slug = 'party-bottoms')
WHERE name ILIKE '%shorts%' OR name ILIKE '%pants%';
