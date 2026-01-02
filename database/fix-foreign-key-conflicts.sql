-- 修复外键冲突问题
-- 问题：Could not embed because more than one relationship was found
-- 原因：存在多个外键约束指向同一个关系
-- 解决：删除重复约束，只保留一个标准命名的外键

-- ========================================
-- 1. 清理 product_images 表的外键约束
-- ========================================

-- 删除所有可能存在的外键约束
ALTER TABLE product_images DROP CONSTRAINT IF EXISTS fk_product_images_product;
ALTER TABLE product_images DROP CONSTRAINT IF EXISTS product_images_product_id_fkey;
ALTER TABLE product_images DROP CONSTRAINT IF EXISTS product_images_product_id_fkey1;
ALTER TABLE product_images DROP CONSTRAINT IF EXISTS product_images_product_id_fkey2;

-- 重新创建唯一的标准命名外键
ALTER TABLE product_images
ADD CONSTRAINT product_images_product_id_fkey
FOREIGN KEY (product_id)
REFERENCES products(id)
ON DELETE CASCADE;

-- ========================================
-- 2. 清理 product_variants 表的外键约束
-- ========================================

-- 删除所有可能存在的外键约束
ALTER TABLE product_variants DROP CONSTRAINT IF EXISTS fk_product_variants_product;
ALTER TABLE product_variants DROP CONSTRAINT IF EXISTS product_variants_product_id_fkey;
ALTER TABLE product_variants DROP CONSTRAINT IF EXISTS product_variants_product_id_fkey1;
ALTER TABLE product_variants DROP CONSTRAINT IF EXISTS product_variants_product_id_fkey2;

-- 重新创建唯一的标准命名外键
ALTER TABLE product_variants
ADD CONSTRAINT product_variants_product_id_fkey
FOREIGN KEY (product_id)
REFERENCES products(id)
ON DELETE CASCADE;

-- ========================================
-- 3. 验证外键约束
-- ========================================

-- 查看 product_images 表的所有外键
SELECT
    conname AS constraint_name,
    conrelid::regclass AS table_name,
    confrelid::regclass AS referenced_table
FROM pg_constraint
WHERE conrelid = 'product_images'::regclass
  AND contype = 'f';

-- 查看 product_variants 表的所有外键
SELECT
    conname AS constraint_name,
    conrelid::regclass AS table_name,
    confrelid::regclass AS referenced_table
FROM pg_constraint
WHERE conrelid = 'product_variants'::regclass
  AND contype = 'f';

-- ========================================
-- 执行完成后请务必：
-- 1. 在 Supabase Dashboard -> Settings -> API
-- 2. 点击 "Reload schema cache" 按钮
-- 3. 等待几秒钟让缓存刷新
-- ========================================
