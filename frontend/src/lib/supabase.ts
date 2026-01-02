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