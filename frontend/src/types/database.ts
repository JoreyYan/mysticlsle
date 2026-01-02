// Supabase数据库类型定义

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image_url?: string
  parent_id?: string
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description?: string
  short_description?: string
  sku?: string

  // 价格信息
  price: number
  sale_price?: number
  cost_price?: number

  // 库存信息
  stock_quantity: number
  manage_stock: boolean
  low_stock_threshold?: number

  // 物理属性
  weight?: number
  dimensions?: string

  // 图片信息
  featured_image?: string
  images?: string[]

  // SEO信息
  meta_title?: string
  meta_description?: string

  // 状态信息
  is_active: boolean
  is_featured: boolean
  is_digital: boolean
  is_final_sale?: boolean // 新增: 是否最终销售

  // 详细描述 (JSONB)
  details?: {
    design?: string
    shipping?: string
    fabric?: string
    craftsmanship?: string
    caring?: string
  }

  // 分类关联
  category_id?: string
  category?: Category

  created_at: string
  updated_at: string

  // 关联数据
  product_images?: ProductImage[]
  variants?: ProductVariant[]
  tags?: ProductTag[]
}

export interface ProductImage {
  id: string
  product_id: string
  image_url: string
  alt_text?: string
  sort_order: number
  is_primary: boolean
  created_at: string
}

export interface ProductVariant {
  id: string
  product_id: string

  // 变体信息
  title: string
  sku?: string

  // 变体特定的价格和库存
  price?: number
  compare_at_price?: number
  inventory_quantity: number

  // 变体选项
  option1_name?: string
  option1_value?: string
  option2_name?: string
  option2_value?: string
  option3_name?: string
  option3_value?: string

  // 变体图片
  image_url?: string

  // 重量和尺寸
  weight?: number
  requires_shipping: boolean

  sort_order: number
  created_at: string
  updated_at: string
}

export interface ProductTag {
  id: string
  name: string
  slug: string
  created_at: string
}

export interface ProductCollection {
  id: string
  title: string
  slug: string
  description?: string
  image_url?: string
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface PageVisual {
  id: string
  page_name: string
  section: string
  resource_key: string
  title?: string
  url: string
  alt_text?: string
  link_url?: string
  position: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SocialShowcase {
  id: string
  platform: 'instagram' | 'xiaohongshu' | 'tiktok'
  username: string
  external_link?: string
  image_url: string
  caption?: string
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SiteSetting {
  id: string
  setting_key: string
  setting_value: string
  setting_type: 'text' | 'image' | 'json' | 'number' | 'boolean'
  group_name?: string
  description?: string
  updated_at: string
}

// API响应类型
export interface ApiResponse<T> {
  data: T | null
  error: string | null
  count?: number
}

// 产品查询参数
export interface ProductFilters {
  category?: string
  tags?: string[]
  price_min?: number
  price_max?: number
  sort_by?: 'name' | 'price' | 'created_at' | 'sort_order'
  sort_order?: 'asc' | 'desc'
  limit?: number
  offset?: number
  search?: string
  status?: 'draft' | 'active' | 'archived'
  is_featured?: boolean
}

// 购物车项目类型
export interface CartItem {
  product_id: string
  variant_id?: string
  quantity: number
  product: Product
  variant?: ProductVariant
}

// 订单相关类型（为未来扩展预留）
export interface Order {
  id: string
  user_id?: string
  email: string
  total_price: number
  subtotal_price: number
  tax_price: number
  shipping_price: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  created_at: string
  updated_at: string
}