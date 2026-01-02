'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { checkAdminSession, createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { ArrowLeft, Plus, ChevronUp, ChevronDown, Star, RefreshCw, Trash2, Shirt, Scissors } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { ImageUpload } from '@/components/ImageUpload'
import { supabase } from '@/lib/supabase'
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
  id?: string
  color: string
  size: string
  price: string
  inventory_quantity: number
  part: 'main' | 'top' | 'bottom'
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
    loadInitialData()
  }, [router, productId])

  useEffect(() => {
    if (dataLoading) return;

    if (productType === 'set') {
      const newTop = SIZES_TOP.map(size => {
        const existing = variantsTop.find(v => v.size === size);
        return {
          id: existing?.id,
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
          id: existing?.id,
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
          id: existing?.id,
          color: color,
          size: size,
          price: existing?.price || '',
          inventory_quantity: existing?.inventory_quantity || 0,
          part: 'main' as const
        };
      });

      if (JSON.stringify(newMain) !== JSON.stringify(variantsMain)) setVariantsMain(newMain);
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
        setShortDescription(product.short_description || '')
        setCategoryId(product.category_id || '')
        
        const details = product.details || {}
        setDetailDesign(details.design || product.description || '') 
        setDetailShipping(details.shipping || '')
        setDetailFabric(details.fabric || '')
        setDetailCraftsmanship(details.craftsmanship || '')
        setDetailCaring(details.caring || '')

        setPrice(product.price?.toString() || '')
        setComparePrice(product.sale_price?.toString() || '')
        setCostPrice(product.cost_price?.toString() || '')
        setWeight(product.weight?.toString() || '')
        setTrackInventory(product.manage_stock)
        setStatus(product.is_active ? 'active' : 'draft')
        setIsFeatured(product.is_featured)
        setIsFinalSale(product.is_final_sale || false)
        
        setProductType(product.product_type || 'set')
        setColor(Array.isArray(product.colors) ? product.colors[0] : (product.colors || 'Black'))

        const { data: images } = await supabase.from('product_images').select('*').eq('product_id', productId).order('sort_order')
        if (images && images.length > 0) {
          setImageUrls(images.map((img: any) => img.image_url))
          const pIndex = images.findIndex((img: any) => img.is_primary)
          setPrimaryImageIndex(pIndex >= 0 ? pIndex : 0)
        }

        const { data: vData } = await supabase.from('product_variants').select('*').eq('product_id', productId)
        if (vData && vData.length > 0) {
          const loadedVariants = vData.map((v: any) => ({
            id: v.id,
            color: v.option1_value,
            size: v.option2_value,
            price: v.price?.toString() || '',
            inventory_quantity: v.inventory_quantity,
            part: v.part || 'main'
          }))

          setVariantsTop(loadedVariants.filter((v: any) => v.part === 'top'))
          setVariantsBottom(loadedVariants.filter((v: any) => v.part === 'bottom'))
          setVariantsMain(loadedVariants.filter((v: any) => v.part === 'main' || !v.part))
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
      // Determine which variants to save
      let finalVariants: ProductVariant[] = []
      
      // Safety check: regenerate if empty to ensure we save SOMETHING
      if (productType === 'set') {
        if (variantsTop.length === 0) {
           const newTop = SIZES_TOP.map(size => ({ color, size, price: '', inventory_quantity: 0, part: 'top' as const }))
           finalVariants = [...finalVariants, ...newTop]
        } else {
           finalVariants = [...finalVariants, ...variantsTop]
        }
        
        if (variantsBottom.length === 0) {
           const newBottom = SIZES_BOTTOM.map(size => ({ color, size, price: '', inventory_quantity: 0, part: 'bottom' as const }))
           finalVariants = [...finalVariants, ...newBottom]
        } else {
           finalVariants = [...finalVariants, ...variantsBottom]
        }
      } else {
        if (variantsMain.length === 0) {
           const targetSizes = productType === 'bottom' ? SIZES_BOTTOM : SIZES_TOP;
           const newMain = targetSizes.map(size => ({ color, size, price: '', inventory_quantity: 0, part: 'main' as const }))
           finalVariants = newMain
        } else {
           finalVariants = [...variantsMain]
        }
      }

      console.log('Submitting variants:', finalVariants)

      const totalStock = finalVariants.reduce((sum, v) => sum + (v.inventory_quantity || 0), 0)

      const details = {
        design: detailDesign,
        shipping: detailShipping,
        fabric: detailFabric,
        craftsmanship: detailCraftsmanship,
        caring: detailCaring
      }

      const { error: productError } = await supabase.from('products').update({
        name, slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        sku, short_description: shortDescription,
        details: details, description: detailDesign,
        category_id: categoryId || null,
        price: parseFloat(price),
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
        updated_at: new Date().toISOString()
      }).eq('id', productId)

      if (productError) throw productError

      // 3. Update Images
      await supabase.from('product_images').delete().eq('product_id', productId)
      const validImages = imageUrls.filter(u => u.trim())
      if (validImages.length > 0) {
        const { error: imgError } = await supabase.from('product_images').insert(
          validImages.map((url, idx) => ({
            product_id: productId, image_url: url, sort_order: idx, is_primary: idx === primaryImageIndex
          }))
        )
        if (imgError) throw new Error(`Image Upload Error: ${imgError.message}`)
      }

      // 4. Update Variants (CRITICAL FIX)
      console.log('Final stage: Deleting old variants...')
      await supabase.from('product_variants').delete().eq('product_id', productId)
      
      if (finalVariants.length > 0) {
        console.log('Inserting variants:', finalVariants)
        const { data: vData, error: vError } = await supabase.from('product_variants').insert(
          finalVariants.map((v, idx) => ({
            product_id: productId,
            title: `${color} / ${v.size} (${v.part})`,
            sku: `${sku}-${v.part}-${v.size}`,
            price: v.price ? parseFloat(v.price) : parseFloat(price),
            inventory_quantity: v.inventory_quantity,
            option1_name: 'Color', option1_value: color,
            option2_name: 'Size', option2_value: v.size,
            part: v.part,
            sort_order: idx,
            requires_shipping: true // Add explicitly
          }))
        ).select()

        if (vError) {
          console.error('Variant Insert Error:', vError)
          throw new Error(`Variant Save Failed: ${vError.message} (${vError.details})`)
        }
        console.log('Variants saved successfully!', vData)
      }

      alert(t.productUpload.updateSuccess)
      router.push('/admin/dashboard')
    } catch (error: any) {
      console.error('CRITICAL SUBMIT ERROR:', error)
      alert(`CRITICAL ERROR: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // --- UI Constants with Translation ---
  const PRODUCT_TYPES_TRANSLATED = [
    { label: t.productUpload.setType, value: 'set' },
    { label: 'Top', value: 'top' },
    { label: 'Bottom', value: 'bottom' },
    { label: 'Accessory', value: 'accessory' },
    { label: 'Other', value: 'other' },
  ]

  if (dataLoading) return <div className="p-8 text-center">{t.loading}</div>

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <Link href="/admin/dashboard" className="text-sm text-gray-500 hover:text-gray-700 flex items-center mb-2">
              <ArrowLeft className="h-4 w-4 mr-1" /> {t.productUpload.backToDashboard}
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">{t.productUpload.editTitle}</h1>
          </div>
          <Button onClick={handleSubmit} disabled={loading} className="bg-green-600 hover:bg-green-700 h-12 px-8 shadow-sm">
            {loading ? t.productUpload.saving : t.productUpload.updateProduct}
          </Button>
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-2 space-y-8">
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
                <h2 className="text-lg font-semibold border-b pb-2">{t.productUpload.generalInfo}</h2>
                <div>
                  <label className="block text-sm font-medium mb-1">{t.productUpload.productName} *</label>
                  <Input value={name} onChange={e => setName(e.target.value)} required placeholder={t.productUpload.productNamePlaceholder} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t.productUpload.sku}</label>
                  <Input value={sku} onChange={e => setSku(e.target.value)} placeholder={t.productUpload.skuPlaceholder} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t.productUpload.urlSlug}</label>
                  <Input value={slug} onChange={e => setSlug(e.target.value)} placeholder={t.productUpload.urlSlugPlaceholder} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t.productUpload.shortDescription}</label>
                  <Input value={shortDescription} onChange={e => setShortDescription(e.target.value)} placeholder={t.productUpload.shortDescPlaceholder} />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
                <h2 className="text-lg font-semibold border-b pb-2">{t.productUpload.detailedInfo}</h2>
                
                <div>
                  <label className="block text-sm font-medium mb-1">{t.productUpload.design}</label>
                  <textarea 
                    className="w-full p-2 border border-gray-200 rounded-md text-sm min-h-[80px]" 
                    rows={4}
                    value={detailDesign}
                    onChange={e => setDetailDesign(e.target.value)}
                    placeholder={t.productUpload.designPlaceholder}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">{t.productUpload.shipping}</label>
                  <textarea 
                    className="w-full p-2 border border-gray-200 rounded-md text-sm" 
                    rows={2}
                    value={detailShipping}
                    onChange={e => setDetailShipping(e.target.value)}
                    placeholder={t.productUpload.shippingPlaceholder}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">{t.productUpload.fitFabric}</label>
                  <textarea 
                    className="w-full p-2 border border-gray-200 rounded-md text-sm" 
                    rows={4}
                    value={detailFabric}
                    onChange={e => setDetailFabric(e.target.value)}
                    placeholder={t.productUpload.fitFabricPlaceholder}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">{t.productUpload.craftsmanship}</label>
                  <textarea 
                    className="w-full p-2 border border-gray-200 rounded-md text-sm" 
                    rows={2}
                    value={detailCraftsmanship}
                    onChange={e => setDetailCraftsmanship(e.target.value)}
                    placeholder={t.productUpload.craftsmanshipPlaceholder}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">{t.productUpload.caring}</label>
                  <textarea 
                    className="w-full p-2 border border-gray-200 rounded-md text-sm" 
                    rows={3}
                    value={detailCaring}
                    onChange={e => setDetailCaring(e.target.value)}
                    placeholder={t.productUpload.caringPlaceholder}
                  />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold border-b pb-4 mb-4 flex items-center justify-between">
                  <span>{t.productUpload.inventoryManagement}</span>
                  <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {t.productUpload.type}: {productType.toUpperCase()}
                  </span>
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

            {/* Right Column: Settings & Sidebar */}
            <div className="space-y-6">
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold border-b pb-2 mb-4">{t.productUpload.productImages}</h2>
                <div className="space-y-4">
                  {imageUrls.map((url, idx) => (
                    <div key={idx} className={`border p-2 rounded relative ${primaryImageIndex === idx ? 'border-purple-500 bg-purple-50' : ''}`}>
                      <ImageUpload existingUrl={url} onImageUploaded={u => {
                        const newU = [...imageUrls]; newU[idx] = u; setImageUrls(newU);
                      }} onRemove={() => {
                        const newU = imageUrls.filter((_, i) => i !== idx); setImageUrls(newU);
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
                  {productType === 'set' && <p className="text-xs text-purple-600 mt-1">{t.productUpload.setHint}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t.productUpload.color}</label>
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

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
                <h2 className="text-lg font-semibold border-b pb-2">{t.productUpload.pricingLogistics}</h2>
                <div>
                  <label className="block text-sm font-medium mb-1">{t.productUpload.mainPrice}</label>
                  <Input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t.productUpload.comparePrice}</label>
                  <Input type="number" step="0.01" value={comparePrice} onChange={e => setComparePrice(e.target.value)} placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t.productUpload.costPrice}</label>
                  <Input type="number" step="0.01" value={costPrice} onChange={e => setCostPrice(e.target.value)} placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t.productUpload.weight}</label>
                  <Input type="number" step="0.01" value={weight} onChange={e => setWeight(e.target.value)} placeholder="0.00" />
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