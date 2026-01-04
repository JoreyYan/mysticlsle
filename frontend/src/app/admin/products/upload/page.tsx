'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { checkAdminSession, supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { ArrowLeft, Plus, Star, Shirt, Scissors } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { ImageUpload } from '@/components/ImageUpload'
import { InventoryTable } from '@/components/admin/InventoryTable'

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

const SIZES_TOP = ['ONE SIZE', 'XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL']
const SIZES_BOTTOM = ['ONE SIZE', 'XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL']

interface ProductVariant {
  color: string
  size: string
  price: string
  inventory_quantity: number
  part: 'main' | 'top' | 'bottom'
}

export default function ProductUploadPage() {
  const router = useRouter()
  const { t } = useLanguage()
  
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<any[]>([])

  // --- 基本信息 ---
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [sku, setSku] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  
  // --- 详细描述 (JSONB) ---
  const [detailDesign, setDetailDesign] = useState('')
  const [detailShipping, setDetailShipping] = useState('')
  const [detailFabric, setDetailFabric] = useState('')
  const [detailCraftsmanship, setDetailCraftsmanship] = useState('')
  const [detailCaring, setDetailCaring] = useState('')

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
  const [isFinalSale, setIsFinalSale] = useState(false)

  // --- 图片 ---
  const [imageUrls, setImageUrls] = useState<string[]>([''])
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0)

  // --- 变体 (库存) ---
  const [variantsMain, setVariantsMain] = useState<ProductVariant[]>([])
  const [variantsTop, setVariantsTop] = useState<ProductVariant[]>([])
  const [variantsBottom, setVariantsBottom] = useState<ProductVariant[]>([])

  useEffect(() => {
    if (!checkAdminSession()) {
      router.push('/admin/login')
      return
    }
    loadCategories()
  }, [router])

  // 核心逻辑：根据 Type 和 Color 初始化变体表格
  useEffect(() => {
    if (productType === 'set') {
      const newTop = SIZES_TOP.map(size => {
        const existing = variantsTop.find(v => v.size === size);
        return {
          color: color,
          size: size,
          price: existing?.price || '',
          inventory_quantity: existing?.inventory_quantity || 0,
          part: 'top' as const
        };
      });
      const newBottom = SIZES_BOTTOM.map(size => {
        const existing = variantsBottom.find(v => v.size === size);
        return {
          color: color,
          size: size,
          price: existing?.price || '',
          inventory_quantity: existing?.inventory_quantity || 0,
          part: 'bottom' as const
        };
      });

      if (JSON.stringify(newTop) !== JSON.stringify(variantsTop)) setVariantsTop(newTop);
      if (JSON.stringify(newBottom) !== JSON.stringify(variantsBottom)) setVariantsBottom(newBottom);
      
    } else {
      const targetSizes = productType === 'bottom' ? SIZES_BOTTOM : SIZES_TOP;
      const newMain = targetSizes.map(size => {
        const existing = variantsMain.find(v => v.size === size);
        return {
          color: color,
          size: size,
          price: existing?.price || '',
          inventory_quantity: existing?.inventory_quantity || 0,
          part: 'main' as const
        };
      });

      if (JSON.stringify(newMain) !== JSON.stringify(variantsMain)) setVariantsMain(newMain);
    }
  }, [productType, color]);

  const loadCategories = async () => {
    try {
      const { data } = await supabase.from('categories').select('*').order('sort_order')
      setCategories(data || [])
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const generateSlug = (text: string) => {
    return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/--+/g, '-').trim()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) return alert('Please enter product name')
    setLoading(true)

    try {
      const finalSlug = slug.trim() || generateSlug(name)
      
      let finalVariants: ProductVariant[] = []
      if (productType === 'set') {
        finalVariants = [...variantsTop, ...variantsBottom]
      } else {
        finalVariants = [...variantsMain]
      }

      const totalStock = finalVariants.reduce((sum, v) => sum + (v.inventory_quantity || 0), 0)

      const details = {
        design: detailDesign,
        shipping: detailShipping,
        fabric: detailFabric,
        craftsmanship: detailCraftsmanship,
        caring: detailCaring
      }

      // 1. Insert Product
      const { data: product, error: productError } = await supabase.from('products').insert({
        name, slug: finalSlug, sku, 
        short_description: shortDescription,
        details: details, description: detailDesign,
        category_id: categoryId || null,
        price: parseFloat(price) || 0,
        sale_price: comparePrice ? parseFloat(comparePrice) : null,
        cost_price: costPrice ? parseFloat(costPrice) : null,
        weight: weight ? parseFloat(weight) : null,
        product_type: productType,
        colors: [color],
        stock_quantity: totalStock,
        manage_stock: trackInventory,
        is_active: status === 'active',
        is_featured: isFeatured,
        is_final_sale: isFinalSale,
      }).select().single()

      if (productError) throw productError

      // 2. Insert Images
      const validImages = imageUrls.filter(u => u.trim())
      if (validImages.length > 0 && product) {
        await supabase.from('product_images').insert(validImages.map((url, idx) => ({
          product_id: product.id, image_url: url, sort_order: idx, is_primary: idx === primaryImageIndex
        })))
      }

      // 3. Insert Variants
      if (finalVariants.length > 0 && product) {
        const { error: vError } = await supabase.from('product_variants').insert(finalVariants.map((v, idx) => ({
          product_id: product.id,
          title: `${color} / ${v.size} (${v.part})`, // Required title
          sku: `${sku || 'SKU'}-${v.part}-${v.size}`,
          price: v.price ? parseFloat(v.price) : parseFloat(price) || 0,
          inventory_quantity: v.inventory_quantity,
          option1_name: 'Color', option1_value: color,
          option2_name: 'Size', option2_value: v.size,
          part: v.part,
          requires_shipping: true,
          sort_order: idx
        })))
        if (vError) throw new Error(`Variant Insert Error: ${vError.message}`)
      }

      alert(t.productUpload.uploadSuccess)
      router.push('/admin/dashboard')
    } catch (error: any) {
      alert(`${t.productUpload.error} ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const updateImageUrl = (index: number, value: string) => {
    const newUrls = [...imageUrls]
    newUrls[index] = value
    setImageUrls(newUrls)
  }

  const removeImageUrl = (index: number) => {
    const newUrls = imageUrls.filter((_, i) => i !== index)
    setImageUrls(newUrls.length ? newUrls : [''])
    if (index === primaryImageIndex) setPrimaryImageIndex(0)
    else if (index < primaryImageIndex) setPrimaryImageIndex(primaryImageIndex - 1)
  }

  const setPrimary = (index: number) => setPrimaryImageIndex(index)

  const PRODUCT_TYPES_TRANSLATED = [
    { label: t.productUpload.setType, value: 'set' },
    { label: 'Top', value: 'top' },
    { label: 'Bottom', value: 'bottom' },
    { label: 'Accessory', value: 'accessory' },
    { label: 'Other', value: 'other' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <Link href="/admin/dashboard" className="text-sm text-gray-500 hover:text-gray-700 flex items-center mb-2">
              <ArrowLeft className="h-4 w-4 mr-1" /> {t.productUpload.backToDashboard}
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">{t.productUpload.title}</h1>
          </div>
          <Button onClick={handleSubmit} disabled={loading} className="bg-gradient-to-r from-purple-600 to-pink-600 h-12 px-8 shadow-sm">
            {loading ? t.productUpload.creating : t.productUpload.createProduct}
          </Button>
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
                <h2 className="text-lg font-semibold border-b pb-2">{t.productUpload.generalInfo}</h2>
                <div>
                  <label className="block text-sm font-medium mb-1">{t.productUpload.productName} *</label>
                  <Input value={name} onChange={e => setName(e.target.value)} required placeholder={t.productUpload.productNamePlaceholder} className="placeholder:text-gray-300" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t.productUpload.sku}</label>
                  <Input value={sku} onChange={e => setSku(e.target.value)} placeholder={t.productUpload.skuPlaceholder} className="placeholder:text-gray-300" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t.productUpload.urlSlug}</label>
                  <Input value={slug} onChange={e => setSlug(e.target.value)} placeholder={t.productUpload.urlSlugPlaceholder} className="placeholder:text-gray-300" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t.productUpload.shortDescription}</label>
                  <Input value={shortDescription} onChange={e => setShortDescription(e.target.value)} placeholder={t.productUpload.shortDescPlaceholder} className="placeholder:text-gray-300" />
                </div>
              </div>

              {/* Detailed Information Sections */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
                <h2 className="text-lg font-semibold border-b pb-2">{t.productUpload.detailedInfo}</h2>
                {['DESIGN', 'SHIPPING', 'FIT & FABRIC', 'CRAFTMANSHIP', 'CARING'].map(section => (
                    <div key={section}>
                      <label className="block text-xs font-bold text-gray-500 mb-1">{section}</label>
                      <textarea 
                        className="w-full p-2 border border-gray-200 rounded-md text-sm min-h-[80px] placeholder:text-gray-300" 
                        placeholder={
                          section === 'DESIGN' ? t.productUpload.designPlaceholder :
                          section === 'SHIPPING' ? t.productUpload.shippingPlaceholder :
                          section === 'FIT & FABRIC' ? t.productUpload.fitFabricPlaceholder :
                          section === 'CRAFTMANSHIP' ? t.productUpload.craftsmanshipPlaceholder : t.productUpload.caringPlaceholder
                        }
                        onChange={e => {
                          const val = e.target.value;
                          if (section === 'DESIGN') setDetailDesign(val);
                          else if (section === 'SHIPPING') setDetailShipping(val);
                          else if (section === 'FIT & FABRIC') setDetailFabric(val);
                          else if (section === 'CRAFTMANSHIP') setDetailCraftsmanship(val);
                          else setDetailCaring(val);
                        }}
                      />
                    </div>
                  ))}
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold border-b pb-4 mb-4 flex items-center justify-between">
                  <span>{t.productUpload.inventoryManagement}</span>
                </h2>
                {productType === 'set' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InventoryTable title="Top" variants={variantsTop} setVariants={setVariantsTop} />
                    <InventoryTable title="Bottom" variants={variantsBottom} setVariants={setVariantsBottom} />
                  </div>
                ) : (
                  <InventoryTable title="Main" variants={variantsMain} setVariants={setVariantsMain} />
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Image Section is NOW AT TOP */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold border-b pb-2 mb-4">{t.productUpload.productImages}</h2>
                <div className="space-y-4">
                  {imageUrls.map((url, idx) => (
                    <div key={idx} className={`border p-2 rounded relative ${primaryImageIndex === idx ? 'border-purple-500 bg-purple-50' : ''}`}>
                      <ImageUpload existingUrl={url} onImageUploaded={u => {
                        const newU = [...imageUrls]; newU[idx] = u; setImageUrls(newU);
                      }} onRemove={() => {
                        const newU = imageUrls.filter((_, i) => i !== idx); setImageUrls(newU.length ? newU : ['']);
                      }} folder="products" />
                      <button type="button" onClick={() => setPrimaryImageIndex(idx)} className="mt-1 text-[10px] uppercase font-bold text-purple-600">
                        {primaryImageIndex === idx ? `★ ${t.productUpload.mainImage}` : t.productUpload.setPrimary}
                      </button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" className="w-full text-xs" onClick={() => setImageUrls([...imageUrls, ''])}>
                    <Plus className="mr-2 h-3 w-3" /> {t.productUpload.addImage}
                  </Button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
                <h2 className="text-lg font-semibold border-b pb-2">{t.productUpload.attributes}</h2>
                <div>
                  <label className="block text-sm font-medium mb-1">{t.productUpload.category}</label>
                  <select className="w-full h-10 border rounded-md px-2 text-sm" value={categoryId} onChange={e => setCategoryId(e.target.value)}>
                    <option value="">{t.productUpload.selectCategory}</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t.productUpload.type}</label>
                  <select className="w-full h-10 border rounded-md px-2 text-sm bg-purple-50 border-purple-200" value={productType} onChange={e => setProductType(e.target.value)}>
                    {PRODUCT_TYPES_TRANSLATED.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t.productUpload.color}</label>
                  <div className="grid grid-cols-4 gap-2">
                    {PREDEFINED_COLORS.map(c => (
                      <button key={c.value} type="button" onClick={() => setColor(c.value)} className={`w-full aspect-square rounded-md border-2 transition-all flex flex-col items-center justify-center gap-1 ${color === c.value ? 'border-purple-600 bg-purple-50' : 'border-gray-100 hover:border-gray-200'}`}>
                        <div className={`w-5 h-5 rounded-full ${c.border ? 'border border-gray-300' : ''}`} style={{ backgroundColor: c.hex }} />
                        <span className="text-[10px] font-medium">{c.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
                <h2 className="text-lg font-semibold border-b pb-2">{t.productUpload.pricingLogistics}</h2>
                <div>
                  <label className="block text-sm font-medium mb-1">{t.productUpload.mainPrice}</label>
                  <Input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t.productUpload.comparePrice}</label>
                  <Input type="number" step="0.01" value={comparePrice} onChange={e => setComparePrice(e.target.value)} placeholder="0.00" className="placeholder:text-gray-300" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t.productUpload.costPrice}</label>
                  <Input type="number" step="0.01" value={costPrice} onChange={e => setCostPrice(e.target.value)} placeholder="0.00" className="placeholder:text-gray-300" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t.productUpload.weight}</label>
                  <Input type="number" step="0.01" value={weight} onChange={e => setWeight(e.target.value)} placeholder="0.00" className="placeholder:text-gray-300" />
                </div>
                
                <div className="border-t pt-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="isFeatured" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} />
                    <label htmlFor="isFeatured" className="text-sm font-medium cursor-pointer">{t.productUpload.featureProduct}</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="isFinalSale" checked={isFinalSale} onChange={e => setIsFinalSale(e.target.checked)} />
                    <label htmlFor="isFinalSale" className="text-sm font-medium text-red-600 cursor-pointer">{t.productUpload.finalSale}</label>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  )
}
