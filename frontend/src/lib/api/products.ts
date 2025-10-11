// 商品相关API服务
import { supabase } from '@/lib/supabase'
import { Product, ProductFilters, Category, ApiResponse } from '@/types/database'

export class ProductService {
  // 获取所有商品（支持筛选和排序）
  static async getProducts(filters: ProductFilters = {}): Promise<ApiResponse<Product[]>> {
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          variants:product_variants(*)
        `)
        .eq('is_active', true)

      // 应用筛选条件
      if (filters.category) {
        // 支持按分类slug筛选
        const { data: categoryData } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', filters.category)
          .single()

        if (categoryData) {
          query = query.eq('category_id', categoryData.id)
        }
      }

      if (filters.is_featured !== undefined) {
        query = query.eq('is_featured', filters.is_featured)
      }

      if (filters.price_min) {
        query = query.gte('price', filters.price_min)
      }

      if (filters.price_max) {
        query = query.lte('price', filters.price_max)
      }

      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }

      // 排序
      const sortBy = filters.sort_by || 'sort_order'
      const sortOrder = filters.sort_order || 'asc'
      query = query.order(sortBy, { ascending: sortOrder === 'asc' })

      // 分页
      if (filters.limit) {
        query = query.limit(filters.limit)
      }
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
      }

      const { data, error, count } = await query

      return {
        data: data || [],
        error: error?.message || null,
        count: count ?? undefined
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // 根据slug获取单个商品
  static async getProductBySlug(slug: string): Promise<ApiResponse<Product>> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          variants:product_variants(*)
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .single()

      return {
        data: data || null,
        error: error?.message || null
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // 获取推荐商品
  static async getFeaturedProducts(limit: number = 8): Promise<ApiResponse<Product[]>> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          variants:product_variants(*)
        `)
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('sort_order', { ascending: true })
        .limit(limit)

      return {
        data: data || [],
        error: error?.message || null
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // 获取相关商品（同类别）
  static async getRelatedProducts(productId: string, categoryId: string, limit: number = 4): Promise<ApiResponse<Product[]>> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          variants:product_variants(*)
        `)
        .eq('is_active', true)
        .eq('category_id', categoryId)
        .neq('id', productId)
        .order('sort_order', { ascending: true })
        .limit(limit)

      return {
        data: data || [],
        error: error?.message || null
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // 搜索商品
  static async searchProducts(searchTerm: string, limit: number = 20): Promise<ApiResponse<Product[]>> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          variants:product_variants(*)
        `)
        .eq('is_active', true)
        .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,short_description.ilike.%${searchTerm}%`)
        .order('sort_order', { ascending: true })
        .limit(limit)

      return {
        data: data || [],
        error: error?.message || null
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}

export class CategoryService {
  // 获取所有分类
  static async getCategories(): Promise<ApiResponse<Category[]>> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      return {
        data: data || [],
        error: error?.message || null
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // 根据slug获取分类
  static async getCategoryBySlug(slug: string): Promise<ApiResponse<Category>> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single()

      return {
        data: data || null,
        error: error?.message || null
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // 获取分类下的商品数量
  static async getCategoryProductCount(categorySlug: string): Promise<number> {
    try {
      const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', categorySlug)
        .single()

      if (!category) return 0

      const { count } = await supabase
        .from('products')
        .select('id', { count: 'exact' })
        .eq('category_id', category.id)
        .eq('is_active', true)

      return count || 0
    } catch (error) {
      return 0
    }
  }
}