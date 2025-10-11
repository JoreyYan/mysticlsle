# ChillFitRave 网站克隆项目 - 完整技术文档

## 📋 项目概述

### 项目名称
ChillFitRave 电商网站 1:1 克隆

### 项目描述
基于原网站 https://chillfitrave.com/ 进行完整复制，创建一个功能完整的节日时装电商平台。主要特色是销售"The 7 Signature range"系列产品，定位为高端手工制作的节日/派对服装。

### 目标用户
- 音乐节参与者
- 派对爱好者
- 节日时装消费者
- 追求个性化服装的年轻群体

### 核心价值主张
"You were born to stand out!" - 提供独特的节日时装和派对服装

## 🎯 功能需求分析

### 核心功能模块

#### 1. 用户管理系统
- **用户注册/登录**
  - 邮箱注册
  - 社交登录（Google, Facebook）
  - 密码重置
  - 邮箱验证

- **用户资料管理**
  - 个人信息编辑
  - 头像上传
  - 地址管理
  - 订单历史查看

#### 2. 产品展示系统
- **产品目录**
  - 产品分类浏览
  - 产品搜索功能
  - 筛选和排序
  - 分页加载

- **产品详情**
  - 多图展示（图片轮播）
  - 产品描述
  - 价格显示（原价/折扣价）
  - 库存状态
  - 尺寸选择
  - 颜色选择

- **产品管理**（管理员）
  - 产品CRUD操作
  - 图片上传管理
  - 库存管理
  - 分类管理

#### 3. 购物车系统
- **购物车功能**
  - 添加到购物车
  - 购物车商品管理
  - 数量修改
  - 商品删除
  - 购物车持久化

- **实时更新**
  - 库存实时检查
  - 价格实时更新
  - 购物车数量显示

#### 4. 订单管理系统
- **订单创建**
  - 商品确认
  - 配送地址选择
  - 支付方式选择
  - 订单备注

- **订单处理**
  - 订单状态跟踪
  - 支付处理
  - 发货通知
  - 订单取消

- **订单历史**
  - 订单列表查看
  - 订单详情查看
  - 重新订购
  - 订单评价

#### 5. 支付系统
- **支付方式**
  - "Buy now, Pay later" 功能
  - 信用卡支付
  - PayPal支付
  - 分期付款

- **支付安全**
  - SSL加密
  - 支付信息保护
  - 支付状态跟踪

#### 6. 内容管理
- **页面管理**
  - 首页轮播图
  - 促销活动页面
  - 关于我们页面
  - 联系我们页面

- **博客系统**（可选）
  - 时尚资讯
  - 穿搭指南
  - 活动报道

### 非功能性需求

#### 性能要求
- 页面加载时间 < 3秒
- 图片优化和懒加载
- CDN加速
- 数据库查询优化

#### 安全要求
- HTTPS全站加密
- 用户数据加密存储
- SQL注入防护
- XSS攻击防护
- CSRF保护

#### 可用性要求
- 响应式设计（移动端适配）
- 无障碍访问支持
- 浏览器兼容性
- SEO优化

#### 扩展性要求
- 微服务架构准备
- 水平扩展支持
- 缓存策略
- CDN集成

## 🏗️ 技术架构设计

### 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                        用户界面层                             │
├─────────────────────────────────────────────────────────────┤
│  Next.js 14 App Router + shadcn/ui + Tailwind CSS          │
│  - React Components                                         │
│  - TypeScript                                              │
│  - Zustand 状态管理                                          │
│  - React Hook Form                                         │
├─────────────────────────────────────────────────────────────┤
│                        API层                               │
├─────────────────────────────────────────────────────────────┤
│  Supabase (本地开发 + 云端部署)                               │
│  - 自动生成 RESTful API                                      │
│  - 实时数据同步                                              │
│  - 内置认证系统                                              │
│  - 文件存储服务                                              │
├─────────────────────────────────────────────────────────────┤
│                        数据层                               │
├─────────────────────────────────────────────────────────────┤
│  PostgreSQL (Supabase管理)                                 │
│  - 关系型数据存储                                            │
│  - JSONB支持                                               │
│  - 行级安全策略(RLS)                                         │
│  - 实时订阅                                                  │
├─────────────────────────────────────────────────────────────┤
│                      第三方服务                             │
├─────────────────────────────────────────────────────────────┤
│  - Stripe/PayPal (支付)                                     │
│  - Cloudflare/AWS S3 (CDN)                                │
│  - Google Analytics (分析)                                  │
│  - Facebook Pixel (广告)                                    │
└─────────────────────────────────────────────────────────────┘
```

### 技术栈选择理由

#### 前端技术栈
- **Next.js 14**:
  - 服务端渲染(SSR)提升SEO
  - 静态生成(SSG)提升性能
  - App Router提供现代化路由
  - 内置优化功能

- **shadcn/ui**:
  - 基于Radix UI的无障碍组件
  - 完全可定制
  - TypeScript原生支持
  - 现代设计系统

- **Tailwind CSS**:
  - 原子化CSS
  - 响应式设计简单
  - 构建体积小
  - 开发效率高

- **Zustand**:
  - 轻量级状态管理
  - TypeScript友好
  - 无样板代码
  - 性能优异

#### 后端技术栈
- **Supabase**:
  - 开源Firebase替代
  - PostgreSQL为基础
  - 内置认证和权限
  - 实时数据库
  - 自动API生成
  - 文件存储
  - 本地开发支持

#### 数据库选择
- **PostgreSQL**:
  - ACID事务支持
  - JSONB灵活数据存储
  - 全文搜索功能
  - 地理位置支持
  - 丰富的数据类型
  - 高性能查询

### 部署架构

#### 开发环境
```
本地机器
├── Supabase Local (Docker)
│   ├── PostgreSQL
│   ├── Auth Server
│   ├── Storage Server
│   └── Realtime Server
├── Next.js Dev Server (3000端口)
└── 开发工具
    ├── VS Code
    ├── Git
    └── Node.js
```

#### 生产环境
```
云端部署
├── Vercel/Netlify (前端)
│   ├── Next.js应用
│   ├── CDN加速
│   └── 自动部署
├── Supabase Cloud (后端)
│   ├── PostgreSQL数据库
│   ├── 认证服务
│   ├── 文件存储
│   └── 边缘函数
└── 第三方服务
    ├── Stripe (支付)
    ├── Cloudflare (CDN)
    └── 监控服务

## 🗄️ 数据库设计详解

### 数据库概述
使用PostgreSQL作为主数据库，通过Supabase进行管理。数据库设计遵循第三范式，确保数据一致性和完整性。

### 核心数据表设计

#### 1. 用户相关表

##### auth.users (Supabase内置认证表)
Supabase自动管理的用户认证表，包含基本认证信息。

##### public.user_profiles (用户资料扩展表)
```sql
CREATE TABLE public.user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    phone VARCHAR(20),
    avatar_url TEXT,
    date_of_birth DATE,
    gender VARCHAR(10),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_user_profiles_created_at ON public.user_profiles(created_at);

-- RLS策略
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);
```

##### public.user_addresses (用户地址表)
```sql
CREATE TABLE public.user_addresses (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('billing', 'shipping')),
    is_default BOOLEAN DEFAULT FALSE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    company VARCHAR(100),
    address_line_1 TEXT NOT NULL,
    address_line_2 TEXT,
    city VARCHAR(100) NOT NULL,
    state_province VARCHAR(100),
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'United States',
    phone VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_user_addresses_user_id ON public.user_addresses(user_id);
CREATE INDEX idx_user_addresses_type ON public.user_addresses(type);

-- RLS策略
ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own addresses" ON public.user_addresses
    USING (auth.uid() = user_id);
```

#### 2. 产品相关表

##### public.categories (产品分类表)
```sql
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

-- 索引
CREATE INDEX idx_categories_slug ON public.categories(slug);
CREATE INDEX idx_categories_parent_id ON public.categories(parent_id);
CREATE INDEX idx_categories_active ON public.categories(is_active) WHERE is_active = TRUE;

-- 函数：获取分类层级路径
CREATE OR REPLACE FUNCTION get_category_path(category_id BIGINT)
RETURNS TEXT AS $$
DECLARE
    path TEXT := '';
    current_id BIGINT := category_id;
    current_name TEXT;
    parent_id BIGINT;
BEGIN
    WHILE current_id IS NOT NULL LOOP
        SELECT name, parent_id INTO current_name, parent_id
        FROM public.categories
        WHERE id = current_id;

        IF path = '' THEN
            path := current_name;
        ELSE
            path := current_name || ' > ' || path;
        END IF;

        current_id := parent_id;
    END LOOP;

    RETURN path;
END;
$$ LANGUAGE plpgsql;
```

##### public.products (产品主表)
```sql
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

-- 索引
CREATE INDEX idx_products_slug ON public.products(slug);
CREATE INDEX idx_products_category_id ON public.products(category_id);
CREATE INDEX idx_products_sku ON public.products(sku);
CREATE INDEX idx_products_active ON public.products(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_products_featured ON public.products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_products_price ON public.products(price);
CREATE INDEX idx_products_created_at ON public.products(created_at DESC);

-- 全文搜索索引
CREATE INDEX idx_products_search ON public.products
USING GIN(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- 触发器：自动更新updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

##### public.product_images (产品图片表)
```sql
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

-- 索引
CREATE INDEX idx_product_images_product_id ON public.product_images(product_id);
CREATE INDEX idx_product_images_sort_order ON public.product_images(sort_order);
CREATE INDEX idx_product_images_primary ON public.product_images(is_primary) WHERE is_primary = TRUE;

-- 确保每个产品只有一个主图
CREATE UNIQUE INDEX idx_product_images_one_primary
ON public.product_images(product_id)
WHERE is_primary = TRUE;
```

##### public.product_variants (产品变体表)
```sql
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

-- 索引
CREATE INDEX idx_product_variants_product_id ON public.product_variants(product_id);
CREATE INDEX idx_product_variants_sku ON public.product_variants(sku);
CREATE INDEX idx_product_variants_attributes ON public.product_variants USING GIN(attributes);
```

##### public.product_attributes (产品属性定义表)
```sql
CREATE TABLE public.product_attributes (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE, -- color, size, material
    display_name VARCHAR(100) NOT NULL, -- Color, Size, Material
    type VARCHAR(50) NOT NULL CHECK (type IN ('text', 'color', 'image')),
    is_required BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 初始数据
INSERT INTO public.product_attributes (name, display_name, type, is_required, sort_order) VALUES
('color', 'Color', 'color', TRUE, 1),
('size', 'Size', 'text', TRUE, 2),
('material', 'Material', 'text', FALSE, 3);
```

##### public.product_attribute_values (属性值表)
```sql
CREATE TABLE public.product_attribute_values (
    id BIGSERIAL PRIMARY KEY,
    attribute_id BIGINT REFERENCES public.product_attributes(id) ON DELETE CASCADE,
    value VARCHAR(100) NOT NULL,
    display_value VARCHAR(100) NOT NULL,
    color_code VARCHAR(7), -- for color attributes like #FF0000
    image_url TEXT, -- for image attributes
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(attribute_id, value)
);

-- 初始数据
INSERT INTO public.product_attribute_values (attribute_id, value, display_value, color_code, sort_order) VALUES
(1, 'red', 'Red', '#FF0000', 1),
(1, 'blue', 'Blue', '#0000FF', 2),
(1, 'black', 'Black', '#000000', 3),
(2, 'xs', 'XS', NULL, 1),
(2, 's', 'S', NULL, 2),
(2, 'm', 'M', NULL, 3),
(2, 'l', 'L', NULL, 4),
(2, 'xl', 'XL', NULL, 5);
```

#### 3. 购物车相关表

##### public.cart_items (购物车表)
```sql
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

-- 索引
CREATE INDEX idx_cart_items_user_id ON public.cart_items(user_id);
CREATE INDEX idx_cart_items_product_id ON public.cart_items(product_id);

-- RLS策略
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own cart items" ON public.cart_items
    USING (auth.uid() = user_id);

-- 触发器：更新updated_at
CREATE TRIGGER trigger_cart_items_updated_at
    BEFORE UPDATE ON public.cart_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

#### 4. 订单相关表

##### public.orders (订单主表)
```sql
CREATE TABLE public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

    -- 订单状态
    status VARCHAR(50) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
    payment_status VARCHAR(50) NOT NULL DEFAULT 'pending'
        CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'partially_refunded')),

    -- 金额信息
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    shipping_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,

    -- 地址信息 (JSON格式存储快照)
    billing_address JSONB NOT NULL,
    shipping_address JSONB NOT NULL,

    -- 支付信息
    payment_method VARCHAR(50),
    payment_reference VARCHAR(255), -- 支付平台的交易ID

    -- 配送信息
    shipping_method VARCHAR(100),
    tracking_number VARCHAR(100),

    -- 备注
    customer_notes TEXT,
    admin_notes TEXT,

    -- 时间戳
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    shipped_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ
);

-- 索引
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX idx_orders_number ON public.orders(order_number);

-- 函数：生成订单号
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
    RETURN 'CF' || TO_CHAR(NOW(), 'YYYYMMDD') ||
           LPAD(NEXTVAL('order_number_seq')::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- 序列号
CREATE SEQUENCE order_number_seq START 1;

-- 触发器：自动生成订单号
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
        NEW.order_number := generate_order_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_order_number
    BEFORE INSERT ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION set_order_number();

-- RLS策略
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id);
```

##### public.order_items (订单项表)
```sql
CREATE TABLE public.order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    variant_id BIGINT REFERENCES public.product_variants(id) ON DELETE SET NULL,

    -- 商品快照信息 (避免商品信息变更影响历史订单)
    product_name VARCHAR(255) NOT NULL,
    product_sku VARCHAR(100) NOT NULL,
    variant_name VARCHAR(100),
    variant_sku VARCHAR(100),

    -- 价格和数量
    unit_price DECIMAL(10,2) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    total_price DECIMAL(10,2) NOT NULL,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_order_items_product_id ON public.order_items(product_id);

-- RLS策略
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own order items" ON public.order_items
    USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE id = order_id AND user_id = auth.uid()
        )
    );
```

#### 5. 营销相关表

##### public.coupons (优惠券表)
```sql
CREATE TABLE public.coupons (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,

    -- 折扣类型和值
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount')),
    discount_value DECIMAL(10,2) NOT NULL,

    -- 使用限制
    minimum_amount DECIMAL(10,2) DEFAULT 0,
    maximum_discount DECIMAL(10,2), -- 最大折扣金额(仅适用于百分比折扣)
    usage_limit INTEGER, -- 总使用次数限制
    usage_limit_per_user INTEGER DEFAULT 1, -- 每用户使用次数限制
    used_count INTEGER DEFAULT 0,

    -- 时间限制
    starts_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,

    -- 状态
    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_coupons_code ON public.coupons(code);
CREATE INDEX idx_coupons_active ON public.coupons(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_coupons_expires_at ON public.coupons(expires_at);
```

##### public.coupon_usage (优惠券使用记录)
```sql
CREATE TABLE public.coupon_usage (
    id BIGSERIAL PRIMARY KEY,
    coupon_id BIGINT REFERENCES public.coupons(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    discount_amount DECIMAL(10,2) NOT NULL,
    used_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(coupon_id, order_id)
);
```

### 数据库视图和函数

#### 产品统计视图
```sql
CREATE OR REPLACE VIEW product_stats AS
SELECT
    p.id,
    p.name,
    p.price,
    p.stock_quantity,
    COUNT(oi.id) as total_sold,
    COALESCE(SUM(oi.quantity), 0) as quantity_sold,
    COALESCE(SUM(oi.total_price), 0) as total_revenue
FROM public.products p
LEFT JOIN public.order_items oi ON p.id = oi.product_id
LEFT JOIN public.orders o ON oi.order_id = o.id AND o.status != 'cancelled'
GROUP BY p.id, p.name, p.price, p.stock_quantity;
```

#### 用户统计视图
```sql
CREATE OR REPLACE VIEW user_stats AS
SELECT
    u.id,
    u.email,
    up.first_name,
    up.last_name,
    COUNT(o.id) as total_orders,
    COALESCE(SUM(o.total_amount), 0) as total_spent,
    MAX(o.created_at) as last_order_date
FROM auth.users u
LEFT JOIN public.user_profiles up ON u.id = up.id
LEFT JOIN public.orders o ON u.id = o.user_id AND o.status != 'cancelled'
GROUP BY u.id, u.email, up.first_name, up.last_name;
```

### 数据库种子数据
```sql
-- 插入示例分类数据
INSERT INTO public.categories (name, slug, description) VALUES
('The 7 Signature', 'the-7-signature', 'Our signature collection of festival wear'),
('Festival Tops', 'festival-tops', 'Unique tops perfect for any music festival'),
('Party Bottoms', 'party-bottoms', 'Bottoms that make you stand out at parties'),
('Accessories', 'accessories', 'Complete your look with our accessories');

-- 插入示例产品数据
INSERT INTO public.products (name, slug, description, short_description, sku, price, category_id, is_featured) VALUES
(
    'Neon Dreams Festival Top',
    'neon-dreams-festival-top',
    'Stand out from the crowd with this vibrant neon festival top. Made with premium materials and designed for comfort during long festival days.',
    'Vibrant neon festival top for the ultimate party experience',
    'NDT001',
    89.99,
    2,
    TRUE
),
(
    'Holographic Party Shorts',
    'holographic-party-shorts',
    'These holographic shorts will make you shine under any light. Perfect for raves and night parties.',
    'Holographic shorts that shine under any light',
    'HPS002',
    74.99,
    3,
    TRUE
);
```

## ⚛️ 前端架构设计详解

### 项目结构
使用 Next.js 14 App Router 结构，结合现代化的开发工具和组件库。

```
frontend/
├── public/                          # 静态资源
│   ├── images/
│   │   ├── logo/
│   │   ├── products/
│   │   ├── banners/
│   │   └── icons/
│   ├── favicon.ico
│   └── robots.txt
│
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── globals.css            # 全局样式
│   │   ├── layout.tsx             # 根布局
│   │   ├── page.tsx              # 首页
│   │   ├── loading.tsx           # 全局加载组件
│   │   ├── error.tsx             # 全局错误组件
│   │   ├── not-found.tsx         # 404页面
│   │   │
│   │   ├── (auth)/               # 认证路由组
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── forgot-password/
│   │   │       └── page.tsx
│   │   │
│   │   ├── products/             # 产品路由
│   │   │   ├── page.tsx         # 产品列表
│   │   │   ├── [slug]/
│   │   │   │   └── page.tsx     # 产品详情
│   │   │   └── category/
│   │   │       └── [slug]/
│   │   │           └── page.tsx  # 分类页面
│   │   │
│   │   ├── cart/                 # 购物车
│   │   │   └── page.tsx
│   │   │
│   │   ├── checkout/             # 结账流程
│   │   │   ├── page.tsx         # 结账信息
│   │   │   ├── payment/
│   │   │   │   └── page.tsx     # 支付页面
│   │   │   └── success/
│   │   │       └── page.tsx     # 支付成功
│   │   │
│   │   ├── account/              # 用户账户
│   │   │   ├── page.tsx         # 账户首页
│   │   │   ├── profile/
│   │   │   │   └── page.tsx     # 个人资料
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx     # 订单列表
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx  # 订单详情
│   │   │   └── addresses/
│   │   │       └── page.tsx     # 地址管理
│   │   │
│   │   ├── about/                # 关于我们
│   │   │   └── page.tsx
│   │   │
│   │   ├── contact/              # 联系我们
│   │   │   └── page.tsx
│   │   │
│   │   └── api/                  # API路由 (如需要)
│   │       ├── auth/
│   │       └── webhooks/
│   │
│   ├── components/                # React组件
│   │   ├── ui/                   # shadcn/ui 基础组件
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── form.tsx
│   │   │   ├── label.tsx
│   │   │   ├── select.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── toast.tsx
│   │   │   └── ...
│   │   │
│   │   ├── layout/               # 布局组件
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── MobileMenu.tsx
│   │   │
│   │   ├── product/              # 产品相关组件
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── ProductList.tsx
│   │   │   ├── ProductDetail.tsx
│   │   │   ├── ProductGallery.tsx
│   │   │   ├── ProductReviews.tsx
│   │   │   ├── ProductVariants.tsx
│   │   │   ├── AddToCartButton.tsx
│   │   │   ├── ProductFilter.tsx
│   │   │   ├── ProductSort.tsx
│   │   │   └── ProductSearch.tsx
│   │   │
│   │   ├── cart/                 # 购物车组件
│   │   │   ├── CartDrawer.tsx
│   │   │   ├── CartItem.tsx
│   │   │   ├── CartSummary.tsx
│   │   │   ├── CartIcon.tsx
│   │   │   └── MiniCart.tsx
│   │   │
│   │   ├── checkout/             # 结账组件
│   │   │   ├── CheckoutForm.tsx
│   │   │   ├── AddressForm.tsx
│   │   │   ├── PaymentForm.tsx
│   │   │   ├── OrderSummary.tsx
│   │   │   └── ProgressSteps.tsx
│   │   │
│   │   ├── forms/                # 表单组件
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── ProfileForm.tsx
│   │   │   ├── AddressForm.tsx
│   │   │   └── ContactForm.tsx
│   │   │
│   │   ├── common/               # 通用组件
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── Breadcrumb.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── Newsletter.tsx
│   │   │   ├── ImageUpload.tsx
│   │   │   └── ConfirmDialog.tsx
│   │   │
│   │   └── providers/            # Context Providers
│   │       ├── AuthProvider.tsx
│   │       ├── CartProvider.tsx
│   │       ├── ThemeProvider.tsx
│   │       └── ToastProvider.tsx
│   │
│   ├── hooks/                    # 自定义Hooks
│   │   ├── useAuth.ts           # 认证相关
│   │   ├── useCart.ts           # 购物车逻辑
│   │   ├── useProducts.ts       # 产品数据
│   │   ├── useOrders.ts         # 订单管理
│   │   ├── useLocalStorage.ts   # 本地存储
│   │   ├── useDebounce.ts       # 防抖
│   │   ├── useInfiniteScroll.ts # 无限滚动
│   │   └── useSupabase.ts       # Supabase集成
│   │
│   ├── lib/                     # 工具函数和配置
│   │   ├── supabase.ts         # Supabase客户端
│   │   ├── database.types.ts   # 数据库类型定义
│   │   ├── utils.ts            # 通用工具函数
│   │   ├── constants.ts        # 常量定义
│   │   ├── validations.ts      # 表单验证规则
│   │   ├── formatters.ts       # 数据格式化
│   │   └── analytics.ts        # 分析跟踪
│   │
│   ├── store/                   # 状态管理 (Zustand)
│   │   ├── authStore.ts        # 认证状态
│   │   ├── cartStore.ts        # 购物车状态
│   │   ├── productStore.ts     # 产品状态
│   │   ├── uiStore.ts          # UI状态
│   │   └── index.ts            # Store导出
│   │
│   ├── types/                   # TypeScript类型定义
│   │   ├── auth.ts             # 认证相关类型
│   │   ├── product.ts          # 产品相关类型
│   │   ├── cart.ts             # 购物车类型
│   │   ├── order.ts            # 订单类型
│   │   ├── user.ts             # 用户类型
│   │   └── api.ts              # API响应类型
│   │
│   └── styles/                  # 样式文件
│       ├── globals.css         # 全局样式
│       ├── components.css      # 组件样式
│       └── variables.css       # CSS变量
│
├── components.json              # shadcn/ui配置
├── next.config.js              # Next.js配置
├── tailwind.config.js          # Tailwind配置
├── tsconfig.json               # TypeScript配置
├── package.json                # 项目依赖
└── .env.local                  # 环境变量
```

### 核心技术选择详解

#### 1. Next.js 14 App Router
```typescript
// app/layout.tsx - 根布局组件
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers/Providers'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ChillFit Rave - You were born to stand out!',
  description: 'Premium handcrafted festival fashion and party wear',
  keywords: 'festival fashion, party wear, rave clothing, music festival',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <Providers>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
```

#### 2. shadcn/ui 组件系统
```typescript
// components/ui/button.tsx - 按钮组件示例
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

### 响应式设计策略

#### Tailwind CSS 配置
```javascript
// tailwind.config.js
const { fontFamily } = require("tailwindcss/defaultTheme")

module.exports = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        // ... 其他颜色配置
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

## 🔗 Supabase API设计规范

### API架构概述
使用Supabase自动生成的RESTful API，结合Row Level Security (RLS)策略和自定义边缘函数。

### 核心API端点

#### 1. 认证相关API
Supabase内置认证系统，提供以下端点：

```typescript
// 用户注册
POST /auth/v1/signup
Content-Type: application/json
{
  "email": "user@example.com",
  "password": "password123",
  "data": {
    "first_name": "John",
    "last_name": "Doe"
  }
}

// 用户登录
POST /auth/v1/token?grant_type=password
Content-Type: application/json
{
  "email": "user@example.com",
  "password": "password123"
}

// 刷新Token
POST /auth/v1/token?grant_type=refresh_token
Content-Type: application/json
{
  "refresh_token": "refresh_token_here"
}

// 密码重置
POST /auth/v1/recover
Content-Type: application/json
{
  "email": "user@example.com"
}

// 登出
POST /auth/v1/logout
Authorization: Bearer jwt_token_here
```

#### 2. 产品管理API

##### 产品列表
```typescript
// 获取产品列表（支持分页、筛选、排序）
GET /rest/v1/products?select=*,category:categories(name,slug)&is_active=eq.true&order=created_at.desc&limit=20&offset=0

// 响应示例
{
  "data": [
    {
      "id": "uuid-here",
      "name": "Neon Dreams Festival Top",
      "slug": "neon-dreams-festival-top",
      "short_description": "Vibrant neon festival top",
      "price": 89.99,
      "sale_price": null,
      "stock_quantity": 15,
      "is_featured": true,
      "category": {
        "name": "Festival Tops",
        "slug": "festival-tops"
      },
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "count": 1
}
```

##### 产品详情
```typescript
// 获取单个产品详情（包含图片、变体等）
GET /rest/v1/products?select=*,images:product_images(*),variants:product_variants(*),category:categories(*)&slug=eq.neon-dreams-festival-top&single=true

// 响应示例
{
  "id": "uuid-here",
  "name": "Neon Dreams Festival Top",
  "slug": "neon-dreams-festival-top",
  "description": "Stand out from the crowd with this vibrant neon festival top...",
  "short_description": "Vibrant neon festival top",
  "price": 89.99,
  "sale_price": null,
  "stock_quantity": 15,
  "is_active": true,
  "is_featured": true,
  "category": {
    "id": 2,
    "name": "Festival Tops",
    "slug": "festival-tops"
  },
  "images": [
    {
      "id": 1,
      "image_url": "https://example.com/image1.jpg",
      "alt_text": "Neon Dreams Festival Top - Front View",
      "is_primary": true,
      "sort_order": 0
    }
  ],
  "variants": [
    {
      "id": 1,
      "name": "Red - Small",
      "sku": "NDT001-R-S",
      "price": 89.99,
      "stock_quantity": 5,
      "attributes": {
        "color": "red",
        "size": "s"
      }
    }
  ]
}
```

##### 产品搜索
```typescript
// 全文搜索产品
GET /rest/v1/rpc/search_products
Content-Type: application/json
{
  "search_term": "festival neon",
  "category_id": null,
  "min_price": null,
  "max_price": null,
  "limit": 20,
  "offset": 0
}

// 对应的数据库函数
CREATE OR REPLACE FUNCTION search_products(
  search_term TEXT DEFAULT '',
  category_id BIGINT DEFAULT NULL,
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
  FROM products p
  LEFT JOIN categories c ON p.category_id = c.id
  WHERE
    p.is_active = true
    AND (search_term = '' OR to_tsvector('english', p.name || ' ' || COALESCE(p.description, '')) @@ plainto_tsquery('english', search_term))
    AND (category_id IS NULL OR p.category_id = category_id)
    AND (min_price IS NULL OR p.price >= min_price)
    AND (max_price IS NULL OR p.price <= max_price)
  ORDER BY
    CASE WHEN search_term = '' THEN p.created_at ELSE NULL END DESC,
    CASE WHEN search_term != '' THEN rank ELSE NULL END DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;
```

#### 3. 购物车管理API

##### 购物车操作
```typescript
// 获取用户购物车
GET /rest/v1/cart_items?select=*,product:products(*),variant:product_variants(*)&user_id=eq.user_uuid

// 添加商品到购物车
POST /rest/v1/cart_items
Content-Type: application/json
Authorization: Bearer jwt_token
{
  "product_id": "product-uuid",
  "variant_id": 1,
  "quantity": 2
}

// 更新购物车商品数量
PATCH /rest/v1/cart_items?id=eq.cart_item_id
Content-Type: application/json
Authorization: Bearer jwt_token
{
  "quantity": 3
}

// 删除购物车商品
DELETE /rest/v1/cart_items?id=eq.cart_item_id
Authorization: Bearer jwt_token
```

#### 4. 订单管理API

##### 订单创建
```typescript
// 创建订单（使用数据库函数确保数据一致性）
POST /rest/v1/rpc/create_order
Content-Type: application/json
Authorization: Bearer jwt_token
{
  "billing_address": {
    "first_name": "John",
    "last_name": "Doe",
    "address_line_1": "123 Main St",
    "city": "New York",
    "postal_code": "10001",
    "country": "United States"
  },
  "shipping_address": {
    "first_name": "John",
    "last_name": "Doe",
    "address_line_1": "123 Main St",
    "city": "New York",
    "postal_code": "10001",
    "country": "United States"
  },
  "payment_method": "stripe",
  "shipping_method": "standard",
  "customer_notes": "Please handle with care"
}

// 对应的数据库函数
CREATE OR REPLACE FUNCTION create_order(
  billing_address JSONB,
  shipping_address JSONB,
  payment_method VARCHAR DEFAULT 'stripe',
  shipping_method VARCHAR DEFAULT 'standard',
  customer_notes TEXT DEFAULT NULL
)
RETURNS TABLE(order_id UUID, order_number VARCHAR, total_amount DECIMAL) AS $$
DECLARE
  new_order_id UUID;
  new_order_number VARCHAR;
  cart_total DECIMAL := 0;
  cart_item RECORD;
BEGIN
  -- 计算购物车总金额
  SELECT COALESCE(SUM(
    CASE
      WHEN pv.sale_price IS NOT NULL THEN pv.sale_price * ci.quantity
      WHEN pv.price IS NOT NULL THEN pv.price * ci.quantity
      WHEN p.sale_price IS NOT NULL THEN p.sale_price * ci.quantity
      ELSE p.price * ci.quantity
    END
  ), 0) INTO cart_total
  FROM cart_items ci
  JOIN products p ON ci.product_id = p.id
  LEFT JOIN product_variants pv ON ci.variant_id = pv.id
  WHERE ci.user_id = auth.uid();

  -- 创建订单
  INSERT INTO orders (
    user_id,
    subtotal,
    total_amount,
    billing_address,
    shipping_address,
    payment_method,
    shipping_method,
    customer_notes
  ) VALUES (
    auth.uid(),
    cart_total,
    cart_total, -- 简化版本，不包含税费和运费
    billing_address,
    shipping_address,
    payment_method,
    shipping_method,
    customer_notes
  ) RETURNING id, order_number INTO new_order_id, new_order_number;

  -- 创建订单项
  FOR cart_item IN
    SELECT
      ci.*,
      p.name as product_name,
      p.sku as product_sku,
      pv.name as variant_name,
      pv.sku as variant_sku,
      CASE
        WHEN pv.sale_price IS NOT NULL THEN pv.sale_price
        WHEN pv.price IS NOT NULL THEN pv.price
        WHEN p.sale_price IS NOT NULL THEN p.sale_price
        ELSE p.price
      END as unit_price
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    LEFT JOIN product_variants pv ON ci.variant_id = pv.id
    WHERE ci.user_id = auth.uid()
  LOOP
    INSERT INTO order_items (
      order_id,
      product_id,
      variant_id,
      product_name,
      product_sku,
      variant_name,
      variant_sku,
      unit_price,
      quantity,
      total_price
    ) VALUES (
      new_order_id,
      cart_item.product_id,
      cart_item.variant_id,
      cart_item.product_name,
      cart_item.product_sku,
      cart_item.variant_name,
      cart_item.variant_sku,
      cart_item.unit_price,
      cart_item.quantity,
      cart_item.unit_price * cart_item.quantity
    );

    -- 更新库存
    IF cart_item.variant_id IS NOT NULL THEN
      UPDATE product_variants
      SET stock_quantity = stock_quantity - cart_item.quantity
      WHERE id = cart_item.variant_id;
    ELSE
      UPDATE products
      SET stock_quantity = stock_quantity - cart_item.quantity
      WHERE id = cart_item.product_id;
    END IF;
  END LOOP;

  -- 清空购物车
  DELETE FROM cart_items WHERE user_id = auth.uid();

  RETURN QUERY SELECT new_order_id, new_order_number, cart_total;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

##### 订单查询
```typescript
// 获取用户订单列表
GET /rest/v1/orders?select=*&user_id=eq.user_uuid&order=created_at.desc

// 获取订单详情
GET /rest/v1/orders?select=*,items:order_items(*)&id=eq.order_uuid&single=true
```

### API响应格式规范

#### 成功响应
```typescript
// 标准成功响应
{
  "data": any, // 响应数据
  "status": "success",
  "message": "Operation completed successfully",
  "meta": { // 可选的元数据
    "total": 100,
    "page": 1,
    "limit": 20
  }
}
```

#### 错误响应
```typescript
// 标准错误响应
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "The request is invalid",
    "details": {
      "field": "email",
      "issue": "Email format is invalid"
    }
  },
  "status": "error"
}
```

### 实时功能设计

#### 购物车实时同步
```typescript
// 监听购物车变化
const cartSubscription = supabase
  .channel('cart_changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'cart_items',
      filter: `user_id=eq.${userId}`
    },
    (payload) => {
      console.log('Cart updated:', payload)
      // 更新本地状态
    }
  )
  .subscribe()
```

#### 库存实时更新
```typescript
// 监听产品库存变化
const stockSubscription = supabase
  .channel('stock_changes')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'products',
      filter: `id=in.(${productIds.join(',')})`
    },
    (payload) => {
      console.log('Stock updated:', payload)
      // 更新产品列表
    }
  )
  .subscribe()
```

### 文件上传API

#### 产品图片上传
```typescript
// 上传产品图片到Supabase Storage
const uploadProductImage = async (file: File, productId: string) => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${productId}/${Date.now()}.${fileExt}`

  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) throw error

  // 获取公共URL
  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(fileName)

  return publicUrl
}
```

### API性能优化

#### 查询优化
```sql
-- 索引优化建议
CREATE INDEX CONCURRENTLY idx_products_featured_active
ON products(is_featured, is_active)
WHERE is_featured = true AND is_active = true;

CREATE INDEX CONCURRENTLY idx_orders_user_status
ON orders(user_id, status, created_at DESC);

-- 视图优化
CREATE MATERIALIZED VIEW popular_products AS
SELECT
  p.*,
  COUNT(oi.product_id) as order_count,
  SUM(oi.quantity) as total_sold
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN orders o ON oi.order_id = o.id
WHERE o.status != 'cancelled'
  AND o.created_at >= NOW() - INTERVAL '30 days'
GROUP BY p.id
ORDER BY order_count DESC, total_sold DESC;

-- 刷新物化视图的函数
CREATE OR REPLACE FUNCTION refresh_popular_products()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW popular_products;
END;
$$ LANGUAGE plpgsql;
```

### 安全策略

#### Row Level Security (RLS) 策略
```sql
-- 用户只能访问自己的订单
CREATE POLICY "Users can only see their own orders" ON orders
  FOR ALL USING (auth.uid() = user_id);

-- 用户只能管理自己的购物车
CREATE POLICY "Users can only manage their own cart" ON cart_items
  FOR ALL USING (auth.uid() = user_id);

-- 产品对所有人可见，但只有管理员能修改
CREATE POLICY "Products are publicly readable" ON products
  FOR SELECT USING (true);

CREATE POLICY "Only admins can modify products" ON products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );
```

## 🛠️ 开发环境配置指南

### 系统要求

#### 开发机器配置
- **操作系统**: Windows 10/11, macOS 10.15+, 或 Linux (Ubuntu 20.04+)
- **内存**: 至少 8GB RAM (推荐 16GB)
- **硬盘**: 至少 20GB 可用空间
- **网络**: 稳定的互联网连接

#### 必需软件
- **Node.js**: 版本 18.17.0 或更高
- **npm**: 版本 9.0.0 或更高 (或使用 pnpm, yarn)
- **Git**: 最新版本
- **VS Code**: 推荐的代码编辑器
- **Docker**: 用于本地数据库 (可选，推荐使用 Supabase CLI)

### 开发工具安装

#### 1. Node.js 和 npm 安装
```bash
# 检查当前版本
node --version
npm --version

# 如果需要安装或升级，推荐使用 nvm (Node Version Manager)
# macOS/Linux
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# Windows - 使用 nvm-windows
# 下载并安装: https://github.com/coreybutler/nvm-windows
nvm install 18.17.0
nvm use 18.17.0
```

#### 2. Supabase CLI 安装
```bash
# 使用 npm 安装
npm install -g @supabase/cli

# 或使用 Homebrew (macOS)
brew install supabase/tap/supabase

# 验证安装
supabase --version
```

#### 3. VS Code 扩展推荐
创建 `.vscode/extensions.json` 文件：
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-eslint",
    "supabase.supabase-vscode",
    "ms-vscode.vscode-json",
    "pflannery.vscode-versionlens"
  ]
}
```

### 项目初始化步骤

#### Step 1: 创建项目目录结构
```bash
# 创建主项目目录
mkdir chillfitrave-clone
cd chillfitrave-clone

# 初始化 Git 仓库
git init
```

#### Step 2: 初始化 Supabase 本地环境
```bash
# 在项目根目录初始化 Supabase
supabase init

# 启动本地 Supabase 服务
supabase start

# 查看本地服务状态
supabase status
```

成功启动后，你会看到类似输出：
```
API URL: http://localhost:54321
GraphQL URL: http://localhost:54321/graphql/v1
DB URL: postgresql://postgres:postgres@localhost:54322/postgres
Studio URL: http://localhost:54323
Inbucket URL: http://localhost:54324
JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
anon key: your-anon-key
service_role key: your-service-role-key
```

#### Step 3: 创建前端项目
```bash
# 创建 Next.js 项目
npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# 进入前端目录
cd frontend

# 安装核心依赖
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install zustand immer
npm install react-hook-form @hookform/resolvers zod
npm install lucide-react class-variance-authority clsx tailwind-merge

# 安装开发依赖
npm install -D @types/node
```

#### Step 4: 配置 shadcn/ui
```bash
# 在 frontend 目录下初始化 shadcn/ui
npx shadcn-ui@latest init

# 安装常用组件
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add form
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add select
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add skeleton
```

### 配置文件设置

#### 1. 环境变量配置
创建 `frontend/.env.local` 文件：
```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-from-supabase-status

# 应用配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=ChillFit Rave

# 第三方服务配置 (生产环境使用)
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
# STRIPE_SECRET_KEY=sk_test_...
# NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-...
```

### 数据库配置

#### 1. 创建数据库迁移
在项目根目录执行：
```bash
# 创建初始迁移文件
supabase migration new initial_schema

# 编辑迁移文件 (在 supabase/migrations/ 目录中)
# 将之前设计的数据库 SQL 代码粘贴到迁移文件中

# 应用迁移
supabase db push

# 重置数据库 (如需要)
supabase db reset
```

#### 2. 生成 TypeScript 类型
```bash
# 生成数据库类型定义
supabase gen types typescript --local > frontend/src/lib/database.types.ts
```

### 开发工作流程

#### 1. 日常开发命令
```bash
# 启动开发环境
# Terminal 1: 启动 Supabase (如果没有运行)
supabase start

# Terminal 2: 启动前端开发服务器
cd frontend
npm run dev
```

#### 2. 数据库管理命令
```bash
# 查看 Supabase 状态
supabase status

# 访问数据库管理界面
# 浏览器打开: http://localhost:54323

# 重置本地数据库
supabase db reset

# 生成新的迁移
supabase migration new migration_name

# 应用迁移
supabase db push
```

## 📅 项目实施计划和里程碑

### 项目时间线概览

整个项目预计耗时 **3-4 周**，分为 5 个主要阶段：

```
Week 1: 基础设施搭建 + 核心功能开发
├── Phase 1: 环境搭建 (2 天)
└── Phase 2: 核心后端开发 (5 天)

Week 2: 前端开发 + 基础集成
├── Phase 3: 前端核心开发 (7 天)

Week 3: 集成测试 + 高级功能
├── Phase 4: 前后端集成 + 测试 (4 天)
└── Phase 5: 高级功能开发 (3 天)

Week 4: 优化部署 + 上线
├── 性能优化 (2 天)
├── 部署配置 (2 天)
└── 上线测试 (3 天)
```

### Phase 1: 基础设施搭建 (第1-2天)

#### 目标
搭建完整的开发环境和项目基础架构

#### 具体任务

##### Day 1: 环境准备
- [ ] **开发环境搭建**
  - 安装 Node.js, Supabase CLI
  - 配置 VS Code 和必要扩展
  - 创建项目目录结构
  - 初始化 Git 仓库

- [ ] **Supabase 本地环境**
  - 初始化 Supabase 项目
  - 启动本地 Supabase 服务
  - 验证数据库连接
  - 配置环境变量

##### Day 2: 项目框架搭建
- [ ] **前端项目初始化**
  - 创建 Next.js 项目
  - 配置 TypeScript 和 ESLint
  - 安装和配置 shadcn/ui
  - 设置 Tailwind CSS

- [ ] **数据库初始设计**
  - 创建数据库迁移文件
  - 实施核心表结构 (users, products, categories)
  - 配置 RLS 策略
  - 生成 TypeScript 类型定义

#### 交付物
- ✅ 完整的开发环境
- ✅ 运行的 Supabase 本地实例
- ✅ Next.js 项目框架
- ✅ 基础数据库结构

#### 验收标准
- 开发环境能够正常启动
- Supabase Studio 可以访问
- Next.js 开发服务器运行正常
- 数据库表结构创建成功

---

### Phase 2: 核心后端开发 (第3-7天)

#### 目标
实现完整的数据库设计和核心 API 功能

#### 具体任务

##### Day 3: 用户认证系统
- [ ] **Supabase Auth 配置**
  - 配置邮箱认证
  - 设置用户资料扩展表
  - 实现用户地址管理
  - 创建 RLS 安全策略

- [ ] **基础 API 测试**
  - 测试用户注册/登录
  - 验证 JWT token 生成
  - 测试密码重置功能

##### Day 4: 产品管理系统
- [ ] **产品数据模型**
  - 完善产品表结构
  - 创建产品图片关联
  - 实现产品变体系统
  - 设置产品属性管理

- [ ] **产品 CRUD API**
  - 产品列表查询 (分页、筛选、排序)
  - 产品详情查询
  - 产品搜索功能
  - 分类管理 API

##### Day 5: 购物车系统
- [ ] **购物车数据模型**
  - 购物车表设计
  - 用户购物车关联
  - 购物车持久化策略

- [ ] **购物车 API**
  - 添加商品到购物车
  - 更新购物车数量
  - 删除购物车商品
  - 获取购物车列表

##### Day 6: 订单管理系统
- [ ] **订单数据模型**
  - 订单表设计
  - 订单项关联
  - 订单状态管理
  - 地址信息存储

- [ ] **订单处理功能**
  - 创建订单 API
  - 订单状态更新
  - 库存扣减逻辑
  - 订单查询接口

##### Day 7: 高级功能和优化
- [ ] **高级 API 功能**
  - 实现全文搜索功能
  - 创建物化视图优化
  - 批量操作支持
  - 数据统计接口

- [ ] **性能优化**
  - 数据库索引优化
  - 查询性能调优
  - 缓存策略实施
  - API 响应时间优化

#### 交付物
- ✅ 完整的用户认证系统
- ✅ 产品管理 CRUD API
- ✅ 购物车管理功能
- ✅ 订单处理系统
- ✅ 搜索和筛选功能

#### 验收标准
- 所有 API 端点正常工作
- 数据库查询性能符合要求
- RLS 安全策略生效
- API 响应时间 < 500ms

---

### Phase 3: 前端核心开发 (第8-14天)

#### 目标
构建完整的用户界面和核心交互功能

#### 具体任务

##### Day 8-9: 基础布局和组件
- [ ] **布局组件**
  - Header 导航栏
  - Footer 页脚
  - 侧边导航菜单
  - 移动端适配

- [ ] **基础 UI 组件**
  - 按钮、输入框、卡片等
  - 加载状态组件
  - 错误处理组件
  - Toast 通知组件

- [ ] **页面路由设置**
  - 配置 Next.js App Router
  - 创建基础页面组件
  - 设置页面元数据
  - 404 错误页面

##### Day 10-11: 产品展示功能
- [ ] **产品展示组件**
  - ProductCard 产品卡片
  - ProductGrid 产品网格
  - ProductGallery 图片轮播
  - ProductDetail 详情页面

- [ ] **产品交互功能**
  - 产品筛选器
  - 排序功能
  - 搜索框
  - 分页组件

- [ ] **产品页面实现**
  - 产品列表页 (/products)
  - 产品详情页 (/products/[slug])
  - 分类页面 (/category/[slug])

##### Day 12: 用户认证界面
- [ ] **认证表单**
  - 登录表单组件
  - 注册表单组件
  - 密码重置表单
  - 表单验证逻辑

- [ ] **认证页面**
  - 登录页面 (/login)
  - 注册页面 (/register)
  - 忘记密码页面
  - 邮箱验证页面

##### Day 13: 购物车功能
- [ ] **购物车组件**
  - CartDrawer 购物车抽屉
  - CartItem 购物车项
  - CartSummary 购物车摘要
  - AddToCartButton 添加按钮

- [ ] **购物车页面**
  - 购物车页面 (/cart)
  - 购物车图标显示
  - 实时数量更新
  - 购物车持久化

##### Day 14: 用户账户功能
- [ ] **账户管理组件**
  - 个人资料表单
  - 地址管理组件
  - 订单历史列表
  - 订单详情展示

- [ ] **账户页面**
  - 账户首页 (/account)
  - 个人资料 (/account/profile)
  - 地址管理 (/account/addresses)
  - 订单历史 (/account/orders)

#### 交付物
- ✅ 完整的页面布局系统
- ✅ 产品展示和搜索功能
- ✅ 用户认证界面
- ✅ 购物车管理界面
- ✅ 用户账户管理

#### 验收标准
- 所有页面响应式适配
- 交互功能正常工作
- 表单验证符合要求
- UI/UX 符合设计规范

---

### Phase 4: 前后端集成与测试 (第15-18天)

#### 目标
实现前后端完整集成和全面测试

#### 具体任务

##### Day 15: 数据集成
- [ ] **API 客户端集成**
  - 配置 Supabase 客户端
  - 实现 API 调用封装
  - 错误处理机制
  - 加载状态管理

- [ ] **状态管理集成**
  - Zustand store 配置
  - 认证状态管理
  - 购物车状态同步
  - 产品数据缓存

##### Day 16: 功能测试
- [ ] **核心功能测试**
  - 用户注册/登录流程
  - 产品浏览和搜索
  - 购物车添加/更新/删除
  - 订单创建流程

- [ ] **数据同步测试**
  - 实时数据更新
  - 购物车跨设备同步
  - 库存状态更新
  - 用户会话管理

##### Day 17: 结账流程开发
- [ ] **结账界面**
  - 结账页面 (/checkout)
  - 地址选择/输入
  - 支付方式选择
  - 订单确认页面

- [ ] **结账逻辑**
  - 订单创建流程
  - 地址验证
  - 库存检查
  - 支付前置检查

##### Day 18: 性能优化
- [ ] **前端性能优化**
  - 图片懒加载
  - 代码分割
  - 缓存策略
  - Bundle 大小优化

- [ ] **用户体验优化**
  - 加载状态改进
  - 错误提示优化
  - 交互反馈增强
  - 无障碍性改进

#### 交付物
- ✅ 完整的前后端集成
- ✅ 全功能测试通过
- ✅ 结账流程实现
- ✅ 性能优化完成

#### 验收标准
- 所有核心功能正常工作
- 前后端数据同步正确
- 页面加载时间 < 3 秒
- 无阻塞性错误

---

### Phase 5: 高级功能与部署 (第19-21天)

#### 目标
实现高级功能并准备生产部署

#### 具体任务

##### Day 19: 高级功能开发
- [ ] **支付集成准备**
  - Stripe 测试环境配置
  - 支付表单组件
  - 支付成功/失败处理
  - Webhook 处理准备

- [ ] **营销功能**
  - 优惠券系统界面
  - 促销横幅展示
  - 推荐产品算法
  - Newsletter 订阅

##### Day 20: 生产环境准备
- [ ] **环境配置**
  - 生产环境变量配置
  - Supabase 云端项目设置
  - 域名和 SSL 配置
  - CDN 配置准备

- [ ] **安全加固**
  - RLS 策略审查
  - API 速率限制
  - 输入验证加强
  - 安全头部配置

##### Day 21: 部署与上线
- [ ] **部署流程**
  - Vercel/Netlify 部署配置
  - 自动化部署流水线
  - 数据库迁移
  - 域名绑定

- [ ] **上线检查**
  - 功能完整性测试
  - 性能监控设置
  - 错误监控配置
  - 备份策略实施

#### 交付物
- ✅ 高级功能实现
- ✅ 生产环境就绪
- ✅ 部署流程配置
- ✅ 监控体系建立

#### 验收标准
- 生产环境稳定运行
- 所有功能正常可用
- 监控和报警正常
- 性能指标符合要求

---

### 风险管理和应对策略

#### 技术风险
| 风险 | 概率 | 影响 | 应对策略 |
|------|------|------|----------|
| Supabase 本地环境问题 | 中 | 高 | 准备 Docker 备用方案 |
| 数据库性能问题 | 低 | 中 | 提前进行性能测试 |
| 前端兼容性问题 | 中 | 中 | 使用成熟的组件库 |
| API 集成问题 | 低 | 高 | 详细的 API 文档和测试 |

#### 时间风险
| 风险 | 概率 | 影响 | 应对策略 |
|------|------|------|----------|
| 功能需求变更 | 中 | 高 | 冻结核心功能范围 |
| 技术学习曲线 | 中 | 中 | 提前技术调研 |
| 测试时间不足 | 高 | 中 | 并行开发测试 |
| 部署延迟 | 低 | 中 | 提前准备部署环境 |

### 质量保证计划

#### 代码质量
- **代码审查**: 所有代码都需要经过审查
- **静态分析**: 使用 ESLint 和 TypeScript 检查
- **单元测试**: 核心业务逻辑测试覆盖率 > 70%
- **集成测试**: 主要用户流程端到端测试

#### 性能标准
- **首屏加载时间**: < 3 秒
- **API 响应时间**: < 500ms
- **SEO 得分**: > 90 分
- **无障碍性**: WCAG 2.1 AA 级别

### 团队分工建议

#### 前端开发者 (1-2人)
- React/Next.js 组件开发
- UI/UX 实现
- 状态管理
- 性能优化

#### 后端开发者 (1人)
- Supabase 配置
- 数据库设计
- API 开发
- 安全策略

#### 全栈开发者 (1人)
- 前后端集成
- 部署配置
- 测试实施
- 问题解决

### 验收标准清单

#### 功能性要求
- [ ] 用户可以注册和登录
- [ ] 用户可以浏览和搜索产品
- [ ] 用户可以添加商品到购物车
- [ ] 用户可以创建和查看订单
- [ ] 管理员可以管理产品
- [ ] 支付流程可以正常工作

#### 非功能性要求
- [ ] 网站支持移动端访问
- [ ] 页面加载时间符合标准
- [ ] 数据安全得到保障
- [ ] 网站可以正常部署上线
- [ ] 错误处理机制完善
- [ ] 用户体验流畅自然

这个详细的实施计划为项目提供了清晰的时间线和具体的执行步骤。每个阶段都有明确的目标、任务分解和验收标准，确保项目能够按时高质量完成。