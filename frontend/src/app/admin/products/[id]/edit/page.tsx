'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { checkAdminSession, createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { ArrowLeft, Plus, ChevronUp, ChevronDown, Star, RefreshCw, Trash2 } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { ImageUpload } from '@/components/ImageUpload'
import { supabase } from '@/lib/supabase'

// 预定义常量
const PREDEFINED_COLORS = [
  { label: 'Black', value: 'Black', hex: '#000000' },
  { label: 'Pink', value: 'Pink', hex: '#FFC0CB' },
  { label: 'Purple', value: 'Purple', hex: '#800080' },
  { label: 'Blue', value: 'Blue', hex: '#0000FF' },
  { label: 'Green', value: 'Green', hex: '#008000' },
  { label: 'White', value: 'White', hex: '#FFFFFF', border: true },
  { label: 'Silver', value: 'Silver', hex: '#C0C0C0' },
  { label: 'Gold', value: 'Gold', hex: '#FFD700' },
]

const SIZES_TOP = ['ONE SIZE', 'XXS', 'XS', 'S', 'M', 'L', 'XL']
const SIZES_BOTTOM = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL']

const PRODUCT_TYPES = [
  { label: 'Set (Top + Bottom)', value: 'set' },
  { label: 'Top', value: 'top' },
  { label: 'Bottom', value: 'bottom' },
  { label: 'Accessory', value: 'accessory' },
  { label: 'Other', value: 'other' },
]

interface ProductVariant {
  id?: string
  color: string
  size: string
  price: string
  inventory_quantity: number
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default function ProductEditPage({ params }: PageProps) {
  const { id: productId } = use(params)
  const router = useRouter()
  const { t } = useLanguage()
  
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)
  const [categories, setCategories] = useState<any[]>([])

  // --- 基本信息 ---
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [sku, setSku] = useState('')
  const [description, setDescription] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  
  // --- 属性 ---
  const [productType, setProductType] = useState('set')
  const [color, setColor] = useState('Black')
  const [costPrice, setCostPrice] = useState('')
  const [weight, setWeight] = useState('')

  // --- 价格和状态 ---
  const [price, setPrice] = useState('')
  const [comparePrice, setComparePrice] = useState('')
  const [trackInventory, setTrackInventory] = useState(true)
  const [status, setStatus] = useState<'draft' | 'active' | 'archived'>('active')
  const [isFeatured, setIsFeatured] = useState(false)

  // --- 图片 ---
  const [imageUrls, setImageUrls] = useState<string[]>([''])
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0)

  // --- 变体 (库存) ---
  const [variants, setVariants] = useState<ProductVariant[]>([])

  useEffect(() => {
    if (!checkAdminSession()) {
      router.push('/admin/login')
      return
    }
    loadInitialData()
  }, [router, productId])

  // 当 Type 或 Color 改变时，确保 variants 列表正确
  useEffect(() => {
    if (dataLoading) return;
    
    const targetSizes = productType === 'bottom' ? SIZES_BOTTOM : SIZES_TOP;
    
    const newVariants = targetSizes.map(size => {
      const existing = variants.find(v => v.size === size);
      return {
        id: existing?.id,
        color: color,
        size: size,
        price: existing?.price || '',
        inventory_quantity: existing?.inventory_quantity || 0
      };
    });
    
    // 只在结构真正改变时更新，防止死循环
    const isDifferent = JSON.stringify(newVariants.map(v => v.size)) !== JSON.stringify(variants.map(v => v.size)) || 
                        variants.some(v => v.color !== color);
    
    if (isDifferent) {
      setVariants(newVariants);
    }
  }, [productType, color, dataLoading]);

  const loadInitialData = async () => {
    try {
      setDataLoading(true)
      
      const { data: categoriesData } = await supabase.from('categories').select('*').order('sort_order')
      setCategories(categoriesData || [])

      const { data: product, error: productError } = await supabase.from('products').select('*').eq('id', productId).single()
      if (productError) throw productError

      if (product) {
        setName(product.name)
        setSlug(product.slug)
        setSku(product.sku)
        setDescription(product.description || '')
        setShortDescription(product.short_description || '')
        setCategoryId(product.category_id || '')
        setPrice(product.price?.toString() || '')
        setComparePrice(product.sale_price?.toString() || '')
        setCostPrice(product.cost_price?.toString() || '')
        setWeight(product.weight?.toString() || '')
        setTrackInventory(product.manage_stock)
        setStatus(product.is_active ? 'active' : 'draft')
        setIsFeatured(product.is_featured)
        setProductType(product.product_type || 'set')
        // 处理颜色单选 (如果存的是数组，取第一个)
        setColor(Array.isArray(product.colors) ? product.colors[0] : (product.colors || 'Black'))

        const { data: images } = await supabase.from('product_images').select('*').eq('product_id', productId).order('sort_order')
        if (images && images.length > 0) {
          setImageUrls(images.map((img: any) => img.image_url))
          const pIndex = images.findIndex((img: any) => img.is_primary)
          setPrimaryImageIndex(pIndex >= 0 ? pIndex : 0)
        }

        const { data: vData } = await supabase.from('product_variants').select('*').eq('product_id', productId)
        if (vData && vData.length > 0) {
          setVariants(vData.map((v: any) => ({
            id: v.id,
            color: v.option1_value,
            size: v.option2_value,
            price: v.price?.toString() || '',
            inventory_quantity: v.inventory_quantity
          })))
        }
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setDataLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const totalStock = variants.reduce((sum, v) => sum + (v.inventory_quantity || 0), 0)

      const { error: productError } = await supabase.from('products').update({
        name, slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        sku, description, short_description: shortDescription,
        category_id: categoryId || null,
        price: parseFloat(price),
        sale_price: comparePrice ? parseFloat(comparePrice) : null,
        cost_price: costPrice ? parseFloat(costPrice) : null,
        weight: weight ? parseFloat(weight) : null,
        product_type: productType,
        colors: [color], // 存为数组以保持兼容性
        stock_quantity: totalStock,
        manage_stock: trackInventory,
        is_active: status === 'active',
        is_featured: isFeatured,
        updated_at: new Date().toISOString()
      }).eq('id', productId)

      if (productError) throw productError

      // Images
      await supabase.from('product_images').delete().eq('product_id', productId)
      const validImages = imageUrls.filter(u => u.trim())
      if (validImages.length > 0) {
        await supabase.from('product_images').insert(validImages.map((url, idx) => ({
          product_id: productId, image_url: url, sort_order: idx, is_primary: idx === primaryImageIndex
        })))
      }

      // Variants
      await supabase.from('product_variants').delete().eq('product_id', productId)
      if (variants.length > 0) {
        await supabase.from('product_variants').insert(variants.map((v, idx) => ({
          product_id: productId,
          sku: `${sku}-${v.size}`,
          price: v.price ? parseFloat(v.price) : parseFloat(price),
          inventory_quantity: v.inventory_quantity,
          option1_name: 'Color', option1_value: color,
          option2_name: 'Size', option2_value: v.size,
          sort_order: idx
        })))
      }

      alert('Product updated successfully!')
      router.push('/admin/dashboard')
    } catch (error: any) {
      alert(`Update failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (dataLoading) return <div className="p-8 text-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <Link href="/admin/dashboard" className="text-sm text-gray-500 hover:text-gray-700 flex items-center mb-2">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
          </div>
          <Button onClick={handleSubmit} disabled={loading} className="bg-green-600 hover:bg-green-700 h-12 px-8">
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Main Info */}
            <div className="lg:col-span-2 space-y-6">
              
              <div className="bg-white rounded-lg shadow p-6 space-y-4">
                <h2 className="text-lg font-semibold border-b pb-2">General Information</h2>
                <div>
                  <label className="block text-sm font-medium mb-1">Product Name *</label>
                  <Input value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">SKU (Stock Keeping Unit)</label>
                  <Input value={sku} onChange={e => setSku(e.target.value)} placeholder="e.g. CFR-NDT-001" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">URL Slug</label>
                  <Input value={slug} onChange={e => setSlug(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Short Description</label>
                  <Input value={shortDescription} onChange={e => setShortDescription(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Full Description</label>
                  <textarea 
                    className="w-full p-2 border border-gray-200 rounded-md text-sm" 
                    rows={6}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                  />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 space-y-4">
                <h2 className="text-lg font-semibold border-b pb-2">Inventory by Size</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left">Size</th>
                        <th className="px-4 py-2 text-left w-32">Stock</th>
                        <th className="px-4 py-2 text-left">Price Override (Optional)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {variants.map((v, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-3 font-medium text-gray-700">{v.size}</td>
                          <td className="px-4 py-3">
                            <Input 
                              type="number" 
                              value={v.inventory_quantity}
                              onChange={e => {
                                const newV = [...variants];
                                newV[idx].inventory_quantity = parseInt(e.target.value) || 0;
                                setVariants(newV);
                              }}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <Input 
                              type="number" 
                              placeholder={`Default: ${price}`}
                              value={v.price}
                              onChange={e => {
                                const newV = [...variants];
                                newV[idx].price = e.target.value;
                                setVariants(newV);
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column: Settings & Sidebar */}
            <div className="space-y-6">
              
              <div className="bg-white rounded-lg shadow p-6 space-y-4">
                <h2 className="text-lg font-semibold border-b pb-2">Product Attributes</h2>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select className="w-full h-10 border rounded-md px-2 text-sm" value={categoryId} onChange={e => setCategoryId(e.target.value)}>
                    <option value="">None</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select className="w-full h-10 border rounded-md px-2 text-sm" value={productType} onChange={e => setProductType(e.target.value)}>
                    {PRODUCT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Color (Single Choice)</label>
                  <div className="grid grid-cols-4 gap-2">
                    {PREDEFINED_COLORS.map(c => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setColor(c.value)}
                        className={`w-full aspect-square rounded-md border-2 transition-all flex flex-col items-center justify-center gap-1
                          ${color === c.value ? 'border-purple-600 bg-purple-50' : 'border-gray-100 hover:border-gray-200'}
                        `}
                      >
                        <div className={`w-5 h-5 rounded-full ${c.border ? 'border border-gray-300' : ''}`} style={{ backgroundColor: c.hex }} />
                        <span className="text-[10px] font-medium">{c.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 space-y-4">
                <h2 className="text-lg font-semibold border-b pb-2">Pricing & Logistics</h2>
                <div>
                  <label className="block text-sm font-medium mb-1">Main Price ($) *</label>
                  <Input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Compare at Price ($)</label>
                  <Input type="number" step="0.01" value={comparePrice} onChange={e => setComparePrice(e.target.value)} placeholder="0.00" />
                  <p className="text-xs text-gray-500 mt-1">Shows as crossed-out original price</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Cost Price ($)</label>
                  <Input type="number" step="0.01" value={costPrice} onChange={e => setCostPrice(e.target.value)} placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Weight (kg)</label>
                  <Input type="number" value={weight} onChange={e => setWeight(e.target.value)} />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} />
                  <label className="text-sm font-medium">Featured Product</label>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold border-b pb-2 mb-4">Product Images</h2>
                <div className="space-y-4">
                  {imageUrls.map((url, idx) => (
                    <div key={idx} className={`border p-2 rounded relative ${primaryImageIndex === idx ? 'border-purple-500 bg-purple-50' : ''}`}>
                      <ImageUpload existingUrl={url} onImageUploaded={u => {
                        const newU = [...imageUrls]; newU[idx] = u; setImageUrls(newU);
                      }} onRemove={() => {
                        const newU = imageUrls.filter((_, i) => i !== idx); setImageUrls(newU);
                      }} folder="products" />
                      <button type="button" onClick={() => setPrimary(idx)} className="mt-1 text-[10px] uppercase font-bold text-purple-600">
                        {primaryImageIndex === idx ? '★ Main Image' : 'Set as Main'}
                      </button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" className="w-full text-xs" onClick={() => setImageUrls([...imageUrls, ''])}>
                    + Add Image
                  </Button>
                </div>
              </div>

            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
