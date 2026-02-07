import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// 客户端 Supabase 实例 (单例模式)
const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)

export { supabase }

// 辅助函数：仅在服务端或特殊需要新实例时使用
export const createNewClient = () => createSupabaseClient(supabaseUrl, supabaseAnonKey)

// 获取产品列表
export const getProducts = async (limit = 20) => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(name, slug),
      images:product_images!product_images_product_id_fkey(image_url, alt_text, is_primary, sort_order)
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

// 获取特色产品
export const getFeaturedProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(name, slug),
      images:product_images!product_images_product_id_fkey(image_url, alt_text, is_primary, sort_order)
    `)
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(6)

  if (error) throw error
  return data
}

// 根据 slug 获取单个产品
export const getProductBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(name, slug),
      images:product_images!product_images_product_id_fkey(image_url, alt_text, is_primary, sort_order)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) throw error
  return data
}

// 根据分类获取产品
export const getProductsByCategory = async (categorySlug: string) => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories!inner(name, slug),
      images:product_images!product_images_product_id_fkey(image_url, alt_text, is_primary, sort_order)
    `)
    .eq('category.slug', categorySlug)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// 获取分类信息
export const getCategory = async (slug: string) => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) throw error
  return data
}

// 获取所有分类
export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')

  if (error) throw error
  return data
}

// 管理员认证相关函数
export async function loginAdmin(email: string, password: string) {
  try {
    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single()

    if (error || !admin) {
      return { success: false, error: 'Invalid credentials' }
    }

    // 验证密码（从数据库获取的密码哈希）
    // 注意：现在使用明文比较，生产环境应该：
    // 1. 在数据库中存储 bcrypt 哈希
    // 2. 创建 Supabase Edge Function 来验证密码
    // 3. 或使用 Supabase Auth 系统
    if (password !== admin.password_hash) {
      return { success: false, error: 'Invalid credentials' }
    }

    // 更新最后登录时间
    await supabase
      .from('admins')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', admin.id)

    // 不要将密码返回给前端
    return {
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    }
  } catch (error) {
    console.error('Login error:', error)
    return { success: false, error: 'Login failed' }
  }
}

// 检查管理员会话
export function checkAdminSession() {
  if (typeof window === 'undefined') return null
  const adminSession = localStorage.getItem('admin_session')
  if (!adminSession) return null
  try {
    return JSON.parse(adminSession)
  } catch {
    return null
  }
}

// 保存管理员会话
export function saveAdminSession(admin: any) {
  if (typeof window === 'undefined') return
  localStorage.setItem('admin_session', JSON.stringify(admin))
}

// 清除管理员会话
export function clearAdminSession() {
  if (typeof window === 'undefined') return
  localStorage.removeItem('admin_session')
}

// ============================================
// Homepage Configuration Functions
// ============================================

// 获取网站设置
export async function getSiteSettings() {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')

  if (error) {
    console.error('Error fetching site settings:', error)
    return {}
  }

  return data?.reduce((acc, item) => {
    acc[item.setting_key] = item.setting_value
    return acc
  }, {} as Record<string, string>) || {}
}

// 获取单个网站设置
export async function getSiteSetting(key: string) {
  const { data, error } = await supabase
    .from('site_settings')
    .select('setting_value')
    .eq('setting_key', key)
    .single()

  if (error) return null
  return data?.setting_value
}

// 更新网站设置
export async function updateSiteSetting(key: string, value: string) {
  const { error } = await supabase
    .from('site_settings')
    .upsert({
      setting_key: key,
      setting_value: value,
      updated_at: new Date().toISOString()
    }, { onConflict: 'setting_key' })

  if (error) throw error
  return true
}

// 批量更新网站设置
export async function updateSiteSettings(settings: Record<string, string>) {
  const updates = Object.entries(settings).map(([key, value]) => ({
    setting_key: key,
    setting_value: value,
    updated_at: new Date().toISOString()
  }))

  const { error } = await supabase
    .from('site_settings')
    .upsert(updates, { onConflict: 'setting_key' })

  if (error) throw error
  return true
}

// 获取页面视觉资源
export async function getPageVisuals(pageName: string) {
  const { data, error } = await supabase
    .from('page_visuals')
    .select('*')
    .eq('page_name', pageName)
    .order('position')

  if (error) {
    console.error('Error fetching page visuals:', error.message, error.code, error.details)
    return []
  }
  return data || []
}

// 获取单个页面视觉资源
export async function getPageVisual(pageName: string, section: string) {
  const { data, error } = await supabase
    .from('page_visuals')
    .select('*')
    .eq('page_name', pageName)
    .eq('section', section)
    .single()

  if (error) return null
  return data
}

// 更新页面视觉资源
export async function updatePageVisual(pageName: string, section: string, updates: Record<string, any>) {
  const { error } = await supabase
    .from('page_visuals')
    .upsert({
      page_name: pageName,
      section: section,
      ...updates,
      updated_at: new Date().toISOString()
    }, { onConflict: 'page_name,section' })

  if (error) throw error
  return true
}

// 获取首页区块
export async function getHomepageSections() {
  const { data, error } = await supabase
    .from('homepage_sections')
    .select('*')
    .order('sort_order')

  if (error) {
    console.error('Error fetching homepage sections:', error.message, error.code, error.details)
    return []
  }
  return data || []
}

// 获取所有首页区块（包括未激活的，用于管理后台）
export async function getAllHomepageSections() {
  const { data, error } = await supabase
    .from('homepage_sections')
    .select('*')
    .order('sort_order')

  if (error) throw error
  return data || []
}

// 获取单个首页区块
export async function getHomepageSection(sectionKey: string) {
  const { data, error } = await supabase
    .from('homepage_sections')
    .select('*')
    .eq('section_key', sectionKey)
    .single()

  if (error) return null
  return data
}

// 更新首页区块
export async function updateHomepageSection(sectionKey: string, updates: Record<string, any>) {
  const { error } = await supabase
    .from('homepage_sections')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('section_key', sectionKey)

  if (error) throw error
  return true
}

// 创建首页区块
export async function createHomepageSection(section: {
  section_key: string
  title?: string | null
  title_zh?: string | null
  content?: string | null
  content_zh?: string | null
  button_text?: string | null
  button_text_zh?: string | null
  button_link?: string | null
  image_url?: string | null
  bg_color?: string
  sort_order?: number
  is_active?: boolean
}) {
  const { data, error } = await supabase
    .from('homepage_sections')
    .insert(section)
    .select()
    .single()

  if (error) throw error
  return data
}

// 删除首页区块
export async function deleteHomepageSection(sectionKey: string) {
  const { error } = await supabase
    .from('homepage_sections')
    .delete()
    .eq('section_key', sectionKey)

  if (error) throw error
  return true
}

// ============================================
// 订单系统 API
// ============================================

// 生成订单号
function generateOrderNumber(): string {
  const now = new Date()
  const year = now.getFullYear().toString().slice(-2)
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const day = now.getDate().toString().padStart(2, '0')
  const hour = now.getHours().toString().padStart(2, '0')
  const min = now.getMinutes().toString().padStart(2, '0')
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `OM${year}${month}${day}${hour}${min}${random}`
}

// 创建订单
export async function createOrder(orderData: {
  user_id?: string
  email: string
  items: Array<{
    product_id: string
    variant_id?: string
    product_name: string
    product_sku?: string
    product_image?: string
    variant_name?: string
    unit_price: number
    quantity: number
  }>
  shipping: {
    full_name: string
    phone?: string
    address_line1: string
    address_line2?: string
    city: string
    state?: string
    postal_code: string
    country: string
  }
  subtotal: number
  shipping_cost?: number
  tax?: number
  discount?: number
  total: number
  customer_note?: string
  payment_method?: string
}) {
  const orderNumber = generateOrderNumber()

  // 创建订单
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      user_id: orderData.user_id || null,
      email: orderData.email,
      status: 'pending',
      payment_status: 'unpaid',
      payment_method: orderData.payment_method || 'card',
      subtotal: orderData.subtotal,
      shipping_cost: orderData.shipping_cost || 0,
      tax: orderData.tax || 0,
      discount: orderData.discount || 0,
      total: orderData.total,
      shipping_name: orderData.shipping.full_name,
      shipping_phone: orderData.shipping.phone,
      shipping_address_line1: orderData.shipping.address_line1,
      shipping_address_line2: orderData.shipping.address_line2,
      shipping_city: orderData.shipping.city,
      shipping_state: orderData.shipping.state,
      shipping_postal_code: orderData.shipping.postal_code,
      shipping_country: orderData.shipping.country,
      customer_note: orderData.customer_note
    })
    .select()
    .single()

  if (orderError) throw orderError

  // 创建订单商品
  const orderItems = orderData.items.map(item => ({
    order_id: order.id,
    product_id: item.product_id,
    variant_id: item.variant_id || null,
    product_name: item.product_name,
    product_sku: item.product_sku,
    product_image: item.product_image,
    variant_name: item.variant_name,
    unit_price: item.unit_price,
    quantity: item.quantity,
    total_price: item.unit_price * item.quantity
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)

  if (itemsError) throw itemsError

  return order
}

// 获取用户订单列表
export async function getUserOrders(userId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      items:order_items(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

// 通过邮箱获取订单（游客查询）
export async function getOrdersByEmail(email: string) {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      items:order_items(*)
    `)
    .eq('email', email)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

// 获取单个订单详情
export async function getOrderById(orderId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      items:order_items(*)
    `)
    .eq('id', orderId)
    .single()

  if (error) throw error
  return data
}

// 通过订单号获取订单
export async function getOrderByNumber(orderNumber: string) {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      items:order_items(*)
    `)
    .eq('order_number', orderNumber)
    .single()

  if (error) throw error
  return data
}

// 更新订单状态
export async function updateOrderStatus(orderId: string, status: string) {
  const updates: any = { status }

  if (status === 'shipped') {
    updates.shipped_at = new Date().toISOString()
  } else if (status === 'delivered') {
    updates.delivered_at = new Date().toISOString()
  }

  const { error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', orderId)

  if (error) throw error
  return true
}

// 更新支付状态
export async function updatePaymentStatus(orderId: string, paymentStatus: string, paymentIntentId?: string) {
  const updates: any = { payment_status: paymentStatus }

  if (paymentIntentId) {
    updates.payment_intent_id = paymentIntentId
  }

  if (paymentStatus === 'paid') {
    updates.status = 'paid'
  }

  const { error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', orderId)

  if (error) throw error
  return true
}

// ============================================
// 收货地址 API
// ============================================

// 获取用户收货地址列表
export async function getUserAddresses(userId: string) {
  const { data, error } = await supabase
    .from('shipping_addresses')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

// 创建收货地址
export async function createAddress(address: {
  user_id: string
  full_name: string
  phone?: string
  address_line1: string
  address_line2?: string
  city: string
  state?: string
  postal_code: string
  country: string
  is_default?: boolean
}) {
  // 如果设为默认，先取消其他默认地址
  if (address.is_default) {
    await supabase
      .from('shipping_addresses')
      .update({ is_default: false })
      .eq('user_id', address.user_id)
  }

  const { data, error } = await supabase
    .from('shipping_addresses')
    .insert(address)
    .select()
    .single()

  if (error) throw error
  return data
}

// 更新收货地址
export async function updateAddress(addressId: string, updates: Record<string, any>) {
  const { error } = await supabase
    .from('shipping_addresses')
    .update(updates)
    .eq('id', addressId)

  if (error) throw error
  return true
}

// 删除收货地址
export async function deleteAddress(addressId: string) {
  const { error } = await supabase
    .from('shipping_addresses')
    .delete()
    .eq('id', addressId)

  if (error) throw error
  return true
}

// 获取所有订单（管理后台用）
export async function getAllOrders(limit = 50, offset = 0) {
  const { data, error, count } = await supabase
    .from('orders')
    .select('*, items:order_items(*)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error
  return { orders: data || [], total: count || 0 }
}