// 商品相关API服务
import { supabase } from '@/lib/supabase'
import { Product, ProductFilters, Category, ApiResponse } from '@/types/database'

export class ProductService {
  // 获取所有商品（支持筛选和排序）
  static async getProducts(filters: ProductFilters & { categoryId?: string } = {}): Promise<ApiResponse<Product[]>> {
    try {
      // 1. 基础查询 (不包含 category 联表，避免 400 错误)
      let query = supabase
        .from('products')
        .select('*')
        .eq('is_active', true)

      // 2. 应用筛选条件
      
      // 如果传入了 categoryId (UUID)，直接过滤
      if (filters.categoryId) {
        query = query.eq('category_id', filters.categoryId)
      }
      // 否则如果传入了 category (slug)，先查 ID 再过滤
      else if (filters.category) {
        const { data: categoryData } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', filters.category)
          .single()

        if (categoryData) {
          query = query.eq('category_id', categoryData.id)
        } else {
          // 分类不存在，直接返回空
          return { data: [], count: 0, error: null }
        }
      }

      if (filters.is_featured !== undefined) query = query.eq('is_featured', filters.is_featured)
      if (filters.price_min) query = query.gte('price', filters.price_min)
      if (filters.price_max) query = query.lte('price', filters.price_max)
      if (filters.search) query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)

      const sortBy = filters.sort_by || 'sort_order'
      const sortOrder = filters.sort_order || 'asc'
      query = query.order(sortBy, { ascending: sortOrder === 'asc' })

      if (filters.limit) query = query.limit(filters.limit)
      if (filters.offset) query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)

      const { data, error, count } = await query
      if (error) throw error

      // 3. 批量获取关联数据 (Category, Images, Variants)
      if (data && data.length > 0) {
        const productIds = data.map(p => p.id)
        
        // 获取所有涉及的 category_ids
        const categoryIds = [...new Set(data.map(p => p.category_id).filter(Boolean))] as string[]

        // 并行查询关联表
        const [imagesRes, variantsRes, categoriesRes] = await Promise.all([
          supabase.from('product_images').select('*').in('product_id', productIds).order('sort_order'),
          supabase.from('product_variants').select('*').in('product_id', productIds).order('sort_order'),
          categoryIds.length > 0 ? supabase.from('categories').select('*').in('id', categoryIds) : { data: [] }
        ])

        // 组装数据
        const enrichedData = data.map(p => ({
          ...p,
          images: imagesRes.data?.filter(img => img.product_id === p.id) || [],
          variants: variantsRes.data?.filter(v => v.product_id === p.id) || [],
          category: categoriesRes.data?.find(c => c.id === p.category_id) || null
        }))

        return { data: enrichedData, count: count ?? undefined, error: null }
      }

      return { data: data || [], count: count ?? undefined, error: null }
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // 根据slug获取单个商品 (分步查询)
  static async getProductBySlug(slug: string): Promise<ApiResponse<Product>> {
    try {
      // 1. 获取主商品
      const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single()

      if (error) throw error
      if (!product) return { data: null, error: 'Product not found' }

      // 2. 获取关联数据
      const [imagesRes, variantsRes, categoryRes] = await Promise.all([
        supabase.from('product_images').select('*').eq('product_id', product.id).order('sort_order'),
        supabase.from('product_variants').select('*').eq('product_id', product.id).order('sort_order'),
        product.category_id 
          ? supabase.from('categories').select('*').eq('id', product.category_id).single() 
          : { data: null }
      ])

      // 3. 组装
      return {
        data: {
          ...product,
          images: imagesRes.data || [],
          variants: variantsRes.data || [],
          category: categoryRes.data || null
        },
        error: null
      }
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // 获取推荐商品
  static async getFeaturedProducts(limit: number = 8): Promise<ApiResponse<Product[]>> {
    return this.getProducts({ is_featured: true, limit })
  }

  // 获取相关商品 (已修正: 传入 categoryId)
  static async getRelatedProducts(productId: string, categoryId: string, limit: number = 4): Promise<ApiResponse<Product[]>> {
    // 使用新增加的 categoryId 参数
    return this.getProducts({ categoryId, limit })
  }

  // 搜索商品
  static async searchProducts(searchTerm: string, limit: number = 20): Promise<ApiResponse<Product[]>> {
    return this.getProducts({ search: searchTerm, limit })
  }
}

export class CategoryService {
  static async getCategories(): Promise<ApiResponse<Category[]>> {
    try {
      const { data, error } = await supabase.from('categories').select('*').eq('is_active', true).order('sort_order', { ascending: true })
      return { data: data || [], error: error?.message || null }
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  static async getCategoryBySlug(slug: string): Promise<ApiResponse<Category>> {
    try {
      const { data, error } = await supabase.from('categories').select('*').eq('slug', slug).eq('is_active', true).single()
      return { data: data || null, error: error?.message || null }
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  static async getCategoryProductCount(categorySlug: string): Promise<number> {
    try {
      const { data: category } = await supabase.from('categories').select('id').eq('slug', categorySlug).single()
      if (!category) return 0
      const { count } = await supabase.from('products').select('id', { count: 'exact' }).eq('category_id', category.id).eq('is_active', true)
      return count || 0
    } catch (error) { return 0 }
  }
}