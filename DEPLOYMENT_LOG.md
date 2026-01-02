# MysticIsle 项目部署日志

## 项目信息
- **项目名称**: MysticIsle E-commerce Platform
- **技术栈**: Next.js 15.5.4 + Supabase + Tailwind CSS
- **部署平台**: Vercel
- **GitHub仓库**: https://github.com/JoreyYan/mysticlsle
- **部署时间**: 2025-10-12

---

## 部署准备工作

### 1. Git配置
创建了两层 `.gitignore` 文件来保护敏感信息：

#### 根目录 `.gitignore` (`D:\code\missale\.gitignore`)
```gitignore
# Dependencies
node_modules/

# Environment variables
.env*
!.env.example

# Build outputs
.next/
out/
build/
dist/

# Scraped data and cloned sites (contains API keys)
chillfitrave-clone/
case/
```

#### Frontend `.gitignore` (`D:\code\missale\frontend\.gitignore`)
- 保持前端特定的忽略规则
- 允许 `.env.example` 被提交

### 2. 环境变量模板
创建 `.env.example` 文件作为环境变量模板：
```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# 应用配置
NEXT_PUBLIC_APP_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=MysticIsle
```

### 3. 敏感数据处理
**问题**: Git push 被 GitHub Push Protection 阻止，检测到 API keys
- Stripe Test API Secret Key
- Mailchimp API Key

**解决方案**:
```bash
# 添加包含敏感数据的文件夹到 .gitignore
chillfitrave-clone/
case/

# 从 Git 跟踪中移除
git rm -r --cached chillfitrave-clone case
git commit --amend
git push origin main --force
```

---

## 构建错误修复历程

### 错误 #1: Next.js 实验性配置废弃
**错误信息**:
```
⚠ The "experimental.esmExternals" option has been modified.
experimental.esmExternals is not recommended to be modified
```

**修复**: 移除 `next.config.js` 中的 `esmExternals: 'loose'`

**文件**: `frontend/next.config.js`
```javascript
experimental: {
  workerThreads: false,
  cpus: 1,
  forceSwcTransforms: false,
  // esmExternals: 'loose', // ← 已移除
},
```

---

### 错误 #2: TypeScript 空值类型错误
**错误信息**:
```
Type error: Type 'null' is not assignable to type 'number | undefined'.
./src/app/collections/[category]/page.tsx:26:5
cost_price: null,
```

**修复**: 将示例数据中的 `null` 改为 `undefined`

**文件**: `frontend/src/app/collections/[category]/page.tsx`
```typescript
// 修改前
sale_price: null,
cost_price: null,

// 修改后
sale_price: undefined,
cost_price: undefined,
```

---

### 错误 #3: 数据库字段名不匹配 ⚠️ 重要
**错误信息**:
```
Type error: Property 'sale_price' does not exist on type 'Product'.
```

**问题根源**: TypeScript 类型定义与实际 Supabase 数据库 schema 不匹配

**实际数据库字段** (用户提供):
```
sale_price          (不是 compare_at_price)
stock_quantity      (不是 inventory_quantity)
manage_stock        (不是 track_inventory)
is_active          (不是 status 字符串)
```

**修复**: 更新 `frontend/src/types/database.ts` 中的 `Product` 接口
```typescript
export interface Product {
  // 价格信息
  price: number
  sale_price?: number        // ✓ 正确字段名
  cost_price?: number

  // 库存信息
  stock_quantity: number     // ✓ 正确字段名
  manage_stock: boolean      // ✓ 正确字段名

  // 状态信息
  is_active: boolean         // ✓ 正确字段名
  is_featured: boolean
  is_digital: boolean

  // ... 其他字段
}
```

**同时修复**: `frontend/src/app/products/[slug]/page.tsx`
```typescript
// 修改前
const getCurrentComparePrice = () => {
  return selectedVariant?.compare_at_price || product?.compare_at_price
}

const getAvailableQuantity = () => {
  return selectedVariant?.inventory_quantity || product?.inventory_quantity || 0
}

// 修改后
const getCurrentComparePrice = () => {
  return selectedVariant?.price || product?.sale_price
}

const getAvailableQuantity = () => {
  return selectedVariant?.inventory_quantity || product?.stock_quantity || 0
}
```

---

### 错误 #4: Supabase 客户端未导出
**错误信息**:
```
Type error: Module '"@/lib/supabase"' declares 'supabase' locally, but it is not exported.
./src/lib/api/products.ts:2:10
```

**修复**: 在 `frontend/src/lib/supabase.ts` 中添加导出
```typescript
// API 函数
const supabase = createClient()
export { supabase }  // ← 添加这一行
```

---

### 错误 #5: Count 类型不匹配
**错误信息**:
```
Type error: Type 'number | null' is not assignable to type 'number | undefined'.
./src/lib/api/products.ts:66:9
```

**修复**: 使用空值合并运算符转换类型

**文件**: `frontend/src/lib/api/products.ts`
```typescript
// 修改前
return {
  data: data || [],
  error: error?.message || null,
  count  // ← number | null
}

// 修改后
return {
  data: data || [],
  error: error?.message || null,
  count: count ?? undefined  // ← number | undefined
}
```

---

### 错误 #6: ESLint 配置不兼容
**错误信息**:
```
ESLint: Invalid Options:
- Unknown options: useEslintrc, extensions, resolvePluginsRelativeTo, rulePaths, ignorePath, reportUnusedDisableDirectives
- 'extensions' has been removed.
```

**原因**: Next.js 15.5.4 内部 ESLint 集成使用了与新版 ESLint 不兼容的配置选项

**临时解决方案**: 在构建时禁用 ESLint

**文件**: `frontend/next.config.js`
```javascript
// 临时禁用 ESLint 以通过 Vercel 构建
eslint: {
  ignoreDuringBuilds: true,
},
```

**影响说明**:
- ✓ 本地 ESLint 仍然正常工作
- ✓ TypeScript 类型检查仍然启用
- ⚠️ Vercel 构建时跳过 ESLint 检查

**长期解决方案** (可选):
1. 等待 Next.js 16 更新
2. 迁移到独立 ESLint 配置: `npx @next/codemod@canary next-lint-to-eslint-cli .`

---

### 错误 #7: i18n 对象字面量重复键
**错误信息**:
```
Type error: An object literal cannot have multiple properties with the same name.
./src/lib/i18n.ts:116:7
pricePlaceholder: '价格',
```

**问题根源**:
- Line 88: `pricePlaceholder: '79.99'` (基本商品信息区)
- Line 116: `pricePlaceholder: '价格'` (变体区) ← 重复键名

**解决方案**: 为变体区域的 placeholder 添加 `variant` 前缀

**文件**: `frontend/src/lib/i18n.ts`
```typescript
productUpload: {
  // 基本信息区 (保持原名)
  pricePlaceholder: '79.99',
  inventoryPlaceholder: '0',

  // 变体区 (添加 variant 前缀)
  variantColorPlaceholder: '颜色',
  variantSizePlaceholder: '尺码',
  variantPricePlaceholder: '价格',
  variantInventoryPlaceholder: '库存',
}
```

**同时更新**: `frontend/src/app/admin/products/upload/page.tsx`
```typescript
// 变体输入框使用新的 key
<Input placeholder={t.productUpload.variantColorPlaceholder} />
<Input placeholder={t.productUpload.variantSizePlaceholder} />
<Input placeholder={t.productUpload.variantPricePlaceholder} />
<Input placeholder={t.productUpload.variantInventoryPlaceholder} />
```

---

## 最终部署配置

### Vercel 设置
- **Root Directory**: `frontend`
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

### 环境变量 (在 Vercel Dashboard 配置)
```
NEXT_PUBLIC_SUPABASE_URL=你的Supabase项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase匿名密钥
NEXT_PUBLIC_APP_URL=https://mysticlsle.vercel.app
NEXT_PUBLIC_APP_NAME=MysticIsle
```

---

## 部署成功 ✅

### 访问地址
- **前台**: https://mysticlsle.vercel.app
- **管理后台**: https://mysticlsle.vercel.app/admin/login

### 默认管理员账号
- **邮箱**: admin@mysticisle.com
- **密码**: admin123

---

## Git 提交历史

```bash
# 1. 初始部署准备
git commit -m "Add deployment configuration files (.env.example, README.md)"

# 2. 保护敏感数据
git commit -m "Add root .gitignore to protect entire project"
git commit -m "Remove sensitive files from git tracking"

# 3. 修复 Next.js 配置
git commit -m "Fix: Remove deprecated esmExternals from next.config.js"

# 4. 修复类型错误
git commit -m "Fix: Change null to undefined in sample product data"

# 5. 对齐数据库 schema
git commit -m "Fix: Update Product type to match actual Supabase database schema"

# 6. 修复导出问题
git commit -m "Fix: Export supabase client from @/lib/supabase"

# 7. 修复 count 类型
git commit -m "Fix: Convert count from null to undefined using nullish coalescing"

# 8. 禁用 ESLint 构建检查
git commit -m "Fix: Disable ESLint during builds to bypass compatibility issues"

# 9. 修复 i18n 重复键
git commit -m "Fix: Rename duplicate placeholder keys in i18n variants section"

# 10. 更新 upload 页面
git commit -m "Fix: Update upload page to use correct variant placeholder keys"
```

---

## 关键经验总结

### 1. 数据库 Schema 对齐的重要性
**教训**: 始终先检查实际数据库 schema，再更新 TypeScript 类型定义

用户反馈: **"我建议你更新之前查看一下数据库 别瞎更新"**

**正确流程**:
1. 查询数据库实际字段名
2. 更新 TypeScript 类型
3. 更新所有使用这些类型的代码

### 2. Null vs Undefined
- Supabase 返回 `null`
- TypeScript 可选属性默认是 `undefined`
- 使用空值合并 `??` 进行转换: `count ?? undefined`

### 3. 对象字面量键名冲突
- TypeScript 不允许对象中有重复的键名
- 使用命名约定区分 (如 `variant` 前缀)

### 4. 敏感数据保护
- 分层 `.gitignore` (根目录 + 子目录)
- GitHub Push Protection 会扫描 API keys
- 使用 `git rm --cached` 移除已跟踪的敏感文件

### 5. Next.js + ESLint 兼容性
- Next.js 15.5.4 的 ESLint 集成有兼容性问题
- 临时方案: `eslint.ignoreDuringBuilds: true`
- 长期方案: 等待更新或迁移到独立配置

---

## 下一步建议

### 1. 安全性改进
- [ ] 使用 bcrypt 哈希密码 (当前使用明文比较)
- [ ] 实现 Supabase Edge Function 进行服务端密码验证
- [ ] 或迁移到 Supabase Auth 系统

### 2. ESLint 配置
- [ ] 监控 Next.js 更新，恢复 ESLint 构建检查
- [ ] 或运行: `npx @next/codemod@canary next-lint-to-eslint-cli .`

### 3. 代码清理
- [ ] 移除 ProductCard.tsx 中的 debug 代码
  - 图片计数器 overlay
  - console.log 语句

### 4. 功能测试
- [ ] 测试商品上传功能
- [ ] 测试分类管理
- [ ] 测试商品变体
- [ ] 测试图片上传到 Supabase Storage

---

## 技术栈版本

```json
{
  "next": "15.5.4",
  "@supabase/supabase-js": "^2.39.0",
  "react": "^19.0.0",
  "tailwindcss": "^3.4.1",
  "typescript": "^5"
}
```

---

**文档生成时间**: 2025-10-12
**最后更新**: 成功部署到 Vercel
