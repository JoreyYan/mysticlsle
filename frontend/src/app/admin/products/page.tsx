'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { checkAdminSession, supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { ArrowLeft, Edit, Trash2, Search, Plus, Eye, EyeOff, CheckSquare, Square, MoreHorizontal } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import Image from 'next/image'

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
  
  // 批量选择状态
  const [selectedIds, setSelectedIds] = useState<string[]>([])

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
      // 清空选中状态
      setSelectedIds([])

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

  // --- 批量操作逻辑 ---

  const handleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredProducts.map(p => p.id))
    }
  }

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(itemId => itemId !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  const handleBulkActivate = async (isActive: boolean) => {
    if (selectedIds.length === 0) return
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: isActive })
        .in('id', selectedIds)

      if (error) throw error
      loadProducts() // 重新加载以刷新状态
    } catch (error) {
      alert('Batch update failed')
    }
  }

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} products? This cannot be undone.`)) return

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .in('id', selectedIds)

      if (error) throw error
      loadProducts()
    } catch (error) {
      alert('Batch delete failed')
    }
  }

  // --- 单个操作逻辑 ---

  const toggleProductStatus = async (productId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: !currentStatus })
        .eq('id', productId)

      if (error) throw error
      loadProducts()
    } catch (error) {
      alert('Failed to update product status')
    }
  }

  const deleteProduct = async (productId: string) => {
    if (!confirm(t.productManagement?.confirmDelete || 'Are you sure?')) return
    try {
      const { error } = await supabase.from('products').delete().eq('id', productId)
      if (error) throw error
      loadProducts()
    } catch (error) {
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
              {t.productManagement?.backToDashboard || 'Dashboard'}
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {t.productManagement?.title || 'Product Management'}
              </h1>
              <p className="text-gray-600 mt-2">
                Manage products, inventory, and categories
              </p>
            </div>
            <Link href="/admin/products/upload">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                <Plus className="h-4 w-4 mr-2" />
                {t.productManagement?.addProduct || 'Add Product'}
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters & Bulk Actions */}
        <div className="bg-white rounded-lg shadow p-4 mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            
            {/* Search & Filter */}
            <div className="flex-1 w-full flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or SKU..."
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('all')}
                  size="sm"
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === 'active' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('active')}
                  size="sm"
                >
                  Active
                </Button>
                <Button
                  variant={filterStatus === 'inactive' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('inactive')}
                  size="sm"
                >
                  Draft
                </Button>
              </div>
            </div>
          </div>

          {/* Bulk Actions Bar */}
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-md border border-purple-100 animate-in fade-in slide-in-from-top-1">
              <span className="text-sm font-medium text-purple-900 px-2">
                {selectedIds.length} selected
              </span>
              <div className="h-4 w-px bg-purple-200 mx-2" />
              <Button size="sm" variant="outline" className="bg-white text-green-600 hover:text-green-700 border-green-200 hover:bg-green-50" onClick={() => handleBulkActivate(true)}>
                <Eye className="h-4 w-4 mr-2" /> Activate
              </Button>
              <Button size="sm" variant="outline" className="bg-white text-orange-600 hover:text-orange-700 border-orange-200 hover:bg-orange-50" onClick={() => handleBulkActivate(false)}>
                <EyeOff className="h-4 w-4 mr-2" /> Deactivate
              </Button>
              <div className="flex-1" />
              <Button size="sm" variant="destructive" onClick={handleBulkDelete}>
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </Button>
            </div>
          )}
        </div>

        {/* Products Table */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 mb-4">No products found</p>
            <Link href="/admin/products/upload">
              <Button>Add First Product</Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 w-10">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 h-4 w-4"
                      checked={selectedIds.length === filteredProducts.length && filteredProducts.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className={`hover:bg-gray-50 ${selectedIds.includes(product.id) ? 'bg-purple-50/30' : ''}`}>
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 h-4 w-4"
                        checked={selectedIds.includes(product.id)}
                        onChange={() => handleSelectOne(product.id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 relative border rounded bg-gray-100">
                          <Image
                            src={getPrimaryImage(product)}
                            alt={product.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          {product.is_featured && <span className="text-xs text-yellow-600">⭐ Featured</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sku || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.price.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock_quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.is_active ? 'Active' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/products/${product.id}/edit`}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          onClick={() => deleteProduct(product.id)}
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

        {/* Stats Footer */}
        <div className="mt-6 bg-white rounded-lg shadow p-4">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Total: {products.length}</span>
            <span>Active: {products.filter(p => p.is_active).length}</span>
            <span>Draft: {products.filter(p => !p.is_active).length}</span>
          </div>
        </div>
      </div>
    </div>
  )
}