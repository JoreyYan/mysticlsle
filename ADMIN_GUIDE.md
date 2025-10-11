# ChillFit Rave - 管理员使用指南

## 目录
1. [系统初始化](#系统初始化)
2. [管理后台登录](#管理后台登录)
3. [分类管理](#分类管理)
4. [商品管理](#商品管理)
5. [数据导入建议](#数据导入建议)

---

## 系统初始化

### 第一步：初始化数据库

1. 登录你的 Supabase 控制台
2. 进入 SQL Editor
3. 打开文件 `database/schema.sql`
4. 将整个 SQL 脚本复制并粘贴到 SQL Editor 中
5. 点击 **Run** 执行脚本

这将创建所有必要的数据表：
- `categories` - 商品分类
- `products` - 商品主表
- `product_images` - 商品图片
- `product_variants` - 商品变体（颜色、尺码等）
- `product_tags` - 标签
- `product_collections` - 商品合集
- `admins` - 管理员账户
- `site_settings` - 网站设置

**初始管理员账户自动创建：**
- Email: `admin@chillfitrave.com`
- Password: `admin123`

---

## 管理后台登录

### 访问管理后台

1. 打开浏览器，访问：`http://localhost:5000/admin/login`
2. 输入默认管理员账户：
   - Email: `admin@chillfitrave.com`
   - Password: `admin123`
3. 点击 "Sign In" 登录

登录成功后，你将进入管理后台 Dashboard

---

## 分类管理

### 创建分类

1. 在 Dashboard 点击 **"Manage Categories"**
2. 点击右上角的 **"Add Category"** 按钮
3. 填写分类信息：
   - **Category Name**: 分类名称（如 "New Arrivals", "Sets"）
   - **URL Slug**: URL 友好的名称（自动生成，可手动修改）
   - **Description**: 分类描述（可选）
   - **Sort Order**: 排序顺序（数字越小越靠前）
   - **Active**: 是否激活（勾选后前端可见）

4. 点击 **"Create Category"**

### 系统预设分类

数据库初始化时已经创建了以下分类：
- New Arrivals (slug: `new`)
- Sets (slug: `sets`)
- Halloween (slug: `halloween`)
- Tops (slug: `tops`)
- Bottoms (slug: `bottoms`)
- Sale (slug: `sale`)

你可以编辑或删除这些分类，也可以创建新的分类。

---

## 商品管理

### 上传新商品

1. 在 Dashboard 点击 **"Upload Products"**
2. 填写商品基本信息：

#### 基本信息
- **Product Name**: 商品名称（必填）
- **URL Slug**: 商品的 URL（自动生成）
- **SKU**: 商品编号（可选，如 CFR-001）
- **Short Description**: 简短描述（显示在商品卡片）
- **Full Description**: 完整描述（显示在商品详情页）
- **Category**: 选择商品分类

#### 价格和库存
- **Price**: 售价（必填）
- **Compare at Price**: 原价/对比价（可选，用于显示折扣）
- **Inventory Quantity**: 库存数量
- **Track inventory**: 是否跟踪库存（勾选后库存为 0 时不可购买）

#### 商品图片
- 点击 **"Add Image URL"** 添加图片链接
- 可以添加多张图片
- 第一张图片将作为主图显示
- 图片必须是公开可访问的 URL（建议上传到 Supabase Storage 或其他图床）

#### 商品变体（可选）
如果商品有多个颜色或尺码选项：
1. 勾选 **"Enable variants"**
2. 为每个变体填写：
   - **Color**: 颜色值（如 White, Pink, Blue）
   - **Size**: 尺码（如 XXS, XS, S, M, L, XL）
   - **Price**: 变体价格（可选，不填则使用主价格）
   - **Inventory**: 该变体的库存数量

3. 点击 **"Add Variant"** 添加更多变体

#### 状态设置
- **Product Status**:
  - `Draft`: 草稿（不显示在前端）
  - `Active`: 激活（显示在前端）
  - `Archived`: 归档（不显示）

- **Feature this product**: 勾选后商品将出现在首页的特色商品区域

3. 点击 **"Create Product"** 保存商品

---

## 数据导入建议

### 从爬虫数据导入商品

你已经有了爬虫数据在 `output/data/products.json`。建议按以下步骤处理：

#### 1. 分析爬虫数据

目前的爬虫数据包含：
- 商品链接
- 部分商品名称和价格
- 商品图片 URL

#### 2. 完善爬虫数据

建议修改爬虫脚本以获取：
- 完整的商品名称
- 准确的价格（原价和折扣价）
- 商品描述
- 所有商品图片
- 商品的颜色和尺码选项
- 库存信息
- 商品所属分类

#### 3. 批量导入数据

你可以创建一个脚本来批量导入数据到 Supabase：

```javascript
// 示例：批量导入脚本
import { createClient } from '@supabase/supabase-js'
import productsData from './output/data/products.json'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function importProducts() {
  for (const product of productsData) {
    // 1. 插入商品
    const { data: newProduct, error } = await supabase
      .from('products')
      .insert({
        name: product.name,
        slug: generateSlug(product.name),
        description: product.description,
        price: product.price,
        // ... 其他字段
      })
      .select()
      .single()

    // 2. 插入图片
    if (newProduct && product.images) {
      await supabase
        .from('product_images')
        .insert(
          product.images.map((img, index) => ({
            product_id: newProduct.id,
            url: img,
            sort_order: index
          }))
        )
    }

    // 3. 插入变体
    if (newProduct && product.variants) {
      await supabase
        .from('product_variants')
        .insert(
          product.variants.map((variant, index) => ({
            product_id: newProduct.id,
            option1_name: 'Color',
            option1_value: variant.color,
            option2_name: 'Size',
            option2_value: variant.size,
            inventory_quantity: variant.stock,
            sort_order: index
          }))
        )
    }
  }
}
```

---

## 前端展示

### 分类页面路由

商品会自动显示在对应的分类页面：
- 所有商品：`http://localhost:5000/collections/all`
- New Arrivals：`http://localhost:5000/collections/new`
- Sets：`http://localhost:5000/collections/sets`
- Halloween：`http://localhost:5000/collections/halloween`
- Tops：`http://localhost:5000/collections/tops`
- Bottoms：`http://localhost:5000/collections/bottoms`
- Sale：`http://localhost:5000/collections/sale`

### 商品详情页

每个商品都有独立的详情页：
- URL 格式：`http://localhost:5000/products/[商品slug]`
- 例如：`http://localhost:5000/products/neon-dreams-two-piece`

---

## 筛选功能（待实现）

下一步将添加左侧筛选栏功能，包括：
- **Sort**: 排序（价格、名称）
- **Stock Status**: 库存状态（全部、有货、预订）
- **Colors**: 按颜色筛选
- **Types**: 按类型筛选（Full Set, Top, Bottom, Accessories）
- **Sizes**: 按尺码筛选（Top size, Bottom size）

---

## 常见问题

### Q: 如何修改管理员密码？

A: 目前使用简单的密码验证。在生产环境中，你需要：
1. 使用 bcrypt 哈希密码
2. 在 Supabase 的 `admins` 表中更新 `password_hash` 字段

### Q: 图片上传到哪里？

A: 建议使用 Supabase Storage 或第三方图床：
1. Supabase Storage: 进入 Supabase 控制台 > Storage > 创建 bucket > 上传图片 > 获取公开 URL
2. 第三方图床: 如 Cloudinary, ImgBB 等

### Q: 如何设置商品顺序？

A: 在商品表中有 `sort_order` 字段。数字越小的商品排在前面。可以在数据库中直接修改或在后续版本中添加拖拽排序功能。

### Q: 如何备份数据？

A: 在 Supabase 控制台：
1. Database > 选择表
2. 使用 pg_dump 命令导出数据
3. 或使用 Supabase 的备份功能

---

## 下一步开发

待完成的功能：
1. ✅ 数据库结构
2. ✅ 管理后台登录
3. ✅ 商品上传页面
4. ✅ 分类管理页面
5. ⏳ 分类页面左侧筛选栏
6. ⏳ 商品卡片组件优化
7. ⏳ 商品详情页完善
8. ⏳ 购物车功能
9. ⏳ 订单管理

---

## 技术支持

如有问题，请查看：
- Supabase 文档：https://supabase.com/docs
- Next.js 文档：https://nextjs.org/docs
- 项目 README：查看项目根目录的 README.md

祝使用愉快！🎉
