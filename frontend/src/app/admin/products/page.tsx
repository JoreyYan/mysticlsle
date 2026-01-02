'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { checkAdminSession, createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { ArrowLeft, Edit, Trash2, Search, Plus, Eye, EyeOff } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

interface Product {
  id: string
  name: string
  slug: string
  sku: string
  price: number
  stock_quantity: number
  is_active: boolean
  is_featured: boolean
  created_at: string
  product_images?: Array<{
    image_url: string
    is_primary: boolean
  }>
  categories?: Array<{
    id: string
    name: string
  }>
}

export default function ProductsManagementPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')

  useEffect(() => {
    const session = checkAdminSession()
    if (!session) {
      router.push('/admin/login')
      return
    }
    loadProducts()
  }, [router])

  const loadProducts = async () => {
    try {
      setLoading(true)

      let query = supabase
        .from('products')
        .select(`
          id,
          name,
          slug,
          sku,
          price,
          stock_quantity,
          is_active,
          is_featured,
          created_at,
          product_images!product_images_product_id_fkey (
            image_url,
            is_primary
          )
        `)
        .order('created_at', { ascending: false })

      const { data, error } = await query

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error loading products:', error)
      alert('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const toggleProductStatus = async (productId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: !currentStatus })
        .eq('id', productId)

      if (error) throw error

      // Refresh products list
      loadProducts()
    } catch (error) {
      console.error('Error updating product status:', error)
      alert('Failed to update product status')
    }
  }

  const deleteProduct = async (productId: string) => {
    if (!confirm(t.productManagement?.confirmDelete || '确定要删除这个产品吗？')) {
      return
    }

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)

      if (error) throw error

      loadProducts()
      alert(t.productManagement?.deleteSuccess || '产品已删除')
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Failed to delete product')
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === 'all' ? true :
                         filterStatus === 'active' ? product.is_active :
                         !product.is_active

    return matchesSearch && matchesStatus
  })

  const getPrimaryImage = (product: Product) => {
    const primaryImage = product.product_images?.find(img => img.is_primary)
    return primaryImage?.image_url || product.product_images?.[0]?.image_url || '/placeholder-product.png'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link href="/admin/dashboard">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t.productManagement?.backToDashboard || '返回控制台'}
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {t.productManagement?.title || '产品管理'}
              </h1>
              <p className="text-gray-600 mt-2">
                {t.productManagement?.subtitle || '管理所有产品，编辑状态和分类'}
              </p>
            </div>
            <Link href="/admin/products/upload">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                <Plus className="h-4 w-4 mr-2" />
                {t.productManagement?.addProduct || '添加产品'}
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t.productManagement?.searchPlaceholder || '搜索产品名称或SKU...'}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('all')}
                size="sm"
              >
                {t.productManagement?.all || '全部'}
              </Button>
              <Button
                variant={filterStatus === 'active' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('active')}
                size="sm"
              >
                {t.productManagement?.active || '已激活'}
              </Button>
              <Button
                variant={filterStatus === 'inactive' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('inactive')}
                size="sm"
              >
                {t.productManagement?.inactive || '未激活'}
              </Button>
            </div>
          </div>
        </div>

        {/* Products List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">{t.productManagement?.loading || '加载中...'}</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 mb-4">
              {t.productManagement?.noProducts || '没有找到产品'}
            </p>
            <Link href="/admin/products/upload">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                {t.productManagement?.addFirstProduct || '添加第一个产品'}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.productManagement?.product || '产品'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.productManagement?.price || '价格'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.productManagement?.stock || '库存'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.productManagement?.status || '状态'}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.productManagement?.actions || '操作'}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 relative">
                          <Image
                            src={getPrimaryImage(product)}
                            alt={product.name}
                            fill
                            className="rounded object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          {product.is_featured && (
                            <span className="text-xs text-yellow-600">
                              ⭐ {t.productManagement?.featured || '精选'}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.sku || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.stock_quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleProductStatus(product.id, product.is_active)}
                        className={product.is_active ? 'text-green-600' : 'text-gray-400'}
                      >
                        {product.is_active ? (
                          <>
                            <Eye className="h-4 w-4 mr-1" />
                            {t.productManagement?.active || '已激活'}
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-4 w-4 mr-1" />
                            {t.productManagement?.inactive || '未激活'}
                          </>
                        )}
                      </Button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/products/${product.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteProduct(product.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Stats */}
        <div className="mt-6 bg-white rounded-lg shadow p-4">
          <div className="flex justify-between text-sm text-gray-600">
            <span>
              {t.productManagement?.totalProducts || '总产品数'}: {products.length}
            </span>
            <span>
              {t.productManagement?.activeProducts || '已激活'}: {products.filter(p => p.is_active).length}
            </span>
            <span>
              {t.productManagement?.inactiveProducts || '未激活'}: {products.filter(p => !p.is_active).length}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
