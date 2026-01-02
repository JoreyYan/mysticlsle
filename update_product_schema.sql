
-- 1. 添加产品类型 (product_type)
-- 允许值建议: 'set', 'top', 'bottom', 'accessory', 'other'
ALTER TABLE products ADD COLUMN IF NOT EXISTS product_type text DEFAULT 'set';

-- 2. 添加颜色字段 (colors)
-- 使用数组类型，支持一个产品有多种颜色 (例如: ['Black', 'Pink'])
ALTER TABLE products ADD COLUMN IF NOT EXISTS colors text[];

-- 3. 确保 cost_price 和 weight 存在 (再次确认，作为保险)
ALTER TABLE products ADD COLUMN IF NOT EXISTS cost_price numeric(10,2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS weight numeric(10,2);
