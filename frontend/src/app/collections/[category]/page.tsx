'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import ProductCard from '@/components/ProductCard'
import { Button } from '@/components/ui/button'
import { Product } from '@/types/database'
import { AnnouncementBar, Header } from '@/components/Header'
import { ContactSection, Footer } from '@/components/Footer'
import { FilterSidebar } from '@/components/FilterSidebar'
import { createClient } from '@/lib/supabase'

const supabase = createClient()

// 静态示例数据作为后备
const SAMPLE_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Glitter Butterfly Wings Set',
    slug: 'glitter-butterfly-wings-set',
    description: 'Transform into a magical butterfly with this stunning glitter wing set. Perfect for Halloween parties, festivals, and raves.',
    short_description: '✨ 闪闪发光的蝴蝶翅膀套装，完美的万圣节造型',
    sku: 'CFR-BWS-001',
    price: 89.99,
    sale_price: undefined,
    cost_price: undefined,
    stock_quantity: 15,
    manage_stock: true,
    low_stock_threshold: 5,
    is_active: true,
    is_featured: true,
    is_digital: false,
    category_id: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    meta_title: 'Glitter Butterfly Wings Set - ChillFit Rave',
    meta_description: 'Magical butterfly wings perfect for Halloween and festivals'
  },
  {
    id: '2',
    name: 'Neon Dreams Two-Piece',
    slug: 'neon-dreams-two-piece',
    description: 'Light up the night with this electric neon two-piece set. UV reactive materials glow brilliantly under blacklight.',
    short_description: '⚡ UV反光霓虹套装，在黑光下发光',
    sku: 'CFR-NDT-001',
    price: 79.99,
    sale_price: undefined,
    cost_price: undefined,
    stock_quantity: 25,
    manage_stock: true,
    low_stock_threshold: 5,
    is_active: true,
    is_featured: true,
    is_digital: false,
    category_id: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    meta_title: 'Neon Dreams UV Reactive Set',
    meta_description: 'Electric neon two-piece set with UV glow properties'
  },
  {
    id: '3',
    name: 'Holographic Goddess Set',
    slug: 'holographic-goddess-set',
    description: 'Channel your inner goddess with this mesmerizing holographic set. Reflects rainbow colors in every light.',
    short_description: '🌈 全息女神套装，彩虹色反光效果',
    sku: 'CFR-HGS-001',
    price: 94.99,
    sale_price: 84.99,
    cost_price: undefined,
    stock_quantity: 12,
    manage_stock: true,
    low_stock_threshold: 5,
    is_active: true,
    is_featured: false,
    is_digital: false,
    category_id: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    meta_title: 'Holographic Goddess Set',
    meta_description: 'Stunning holographic set that reflects rainbow colors'
  },
  {
    id: '4',
    name: 'Crystal Mesh Crop Top',
    slug: 'crystal-mesh-crop-top',
    description: 'Sparkle and shine in this crystal-embellished mesh crop top. Features genuine crystals and rhinestones.',
    short_description: '💎 水晶网眼短上衣，可调节绑带',
    sku: 'CFR-CMC-001',
    price: 45.99,
    sale_price: undefined,
    cost_price: undefined,
    stock_quantity: 30,
    manage_stock: true,
    low_stock_threshold: 10,
    is_active: true,
    is_featured: true,
    is_digital: false,
    category_id: '2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    meta_title: 'Crystal Mesh Crop Top',
    meta_description: 'Sparkling crystal mesh crop top with adjustable fit'
  }
]

const CATEGORY_INFO: Record<string, { name: string; description: string }> = {
  sets: {
    name: 'Sets',
    description: 'Complete matching sets perfect for festivals and raves'
  },
  halloween: {
    name: 'Halloween',
    description: 'Spooky season special collection with mystical themes'
  },
  new: {
    name: 'New Arrivals',
    description: 'Latest drops and trending pieces'
  },
  tops: {
    name: 'Tops',
    description: 'Crop tops, bras, and upper body wear'
  },
  bottoms: {
    name: 'Bottoms',
    description: 'Shorts, pants, and lower body wear'
  },
  sale: {
    name: 'Sale',
    description: 'Discounted items and clearance'
  }
}

export default function CategoryPage() {
  const params = useParams()
  const categorySlug = params.category as string

  const [sortBy, setSortBy] = useState<string>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [filters, setFilters] = useState<Record<string, string[]>>({})
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS)
  const [loading, setLoading] = useState(true)

  // 从数据库加载产品
  useEffect(() => {
    loadProducts()
  }, [categorySlug])

  const loadProducts = async () => {
    try {
      setLoading(true)

      // 首先获取分类ID
      const { data: category, error: categoryError } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', categorySlug)
        .single()

      if (categoryError) {
        console.error('Error loading category:', categoryError)
        setProducts(SAMPLE_PRODUCTS)
        return
      }

      // 查询该分类下的所有 active 产品
      let query = supabase
        .from('products')
        .select(`
          *,
          product_images (
            id,
            image_url,
            alt_text,
            sort_order,
            is_primary
          )
        `)
        .eq('is_active', true)

      // 如果有分类，按分类筛选
      if (category) {
        query = query.eq('category_id', category.id)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading products:', error)
        setProducts(SAMPLE_PRODUCTS)
        return
      }

      setProducts(data || [])
    } catch (error) {
      console.error('Error loading products:', error)
      setProducts(SAMPLE_PRODUCTS)
    } finally {
      setLoading(false)
    }
  }

  // 排序产品
  const getSortedProducts = () => {
    let sorted = [...products]

    // 排序
    sorted.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Product]
      let bValue: any = b[sortBy as keyof Product]

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return sorted
  }

  const displayProducts = getSortedProducts()
  const categoryInfo = CATEGORY_INFO[categorySlug] || {
    name: categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1),
    description: 'Explore our collection'
  }

  return (
    <>
      <AnnouncementBar />
      <Header />

      <div className="min-h-screen bg-white flex">
        {/* Left Sidebar - Filter */}
        <FilterSidebar onFilterChange={setFilters} />

        {/* Main Content */}
        <div className="flex-1">
          <div className="container mx-auto px-4 py-8">
            {/* 页面头部 */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {categoryInfo.name}
              </h1>
              <p className="text-gray-600 text-lg">
                {categoryInfo.description}
              </p>
            </div>

            {/* 筛选和排序 */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {loading ? 'Loading...' : `${displayProducts.length} products found`}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <select
                  value={`${sortBy}_${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('_')
                    setSortBy(field)
                    setSortOrder(order as 'asc' | 'desc')
                  }}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="name_asc">Name: A-Z</option>
                  <option value="name_desc">Name: Z-A</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* 产品网格 */}
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading products...</p>
              </div>
            ) : displayProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                {displayProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    className="hover-effect"
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600">
                  We couldn't find any products in this category.
                </p>
                <Button
                  onClick={() => window.history.back()}
                  className="mt-4"
                >
                  Go Back
                </Button>
              </div>
            )}

            {/* 分类描述 */}
            <div className="mt-16 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About {categoryInfo.name}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {categoryInfo.description}. Each piece is carefully selected to ensure you look and feel amazing
                at any festival, rave, or special event.
              </p>
            </div>
          </div>
        </div>
      </div>

      <ContactSection />
      <Footer />
    </>
  )
}