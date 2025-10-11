'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { checkAdminSession, createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { ArrowLeft, Plus, X, Upload as UploadIcon, ChevronUp, ChevronDown, Star } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { ImageUpload } from '@/components/ImageUpload'

const supabase = createClient()

interface ProductVariant {
  option1_name: string
  option1_value: string
  option2_name: string
  option2_value: string
  price: string
  inventory_quantity: number
}

export default function ProductUploadPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<any[]>([])

  // 基本信息
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [sku, setSku] = useState('')
  const [categoryId, setCategoryId] = useState('')

  // 价格和库存
  const [price, setPrice] = useState('')
  const [comparePrice, setComparePrice] = useState('')
  const [inventoryQuantity, setInventoryQuantity] = useState('0')
  const [trackInventory, setTrackInventory] = useState(true)

  // 状态
  const [status, setStatus] = useState<'draft' | 'active' | 'archived'>('active')
  const [isFeatured, setIsFeatured] = useState(false)

  // 图片
  const [imageUrls, setImageUrls] = useState<string[]>([''])
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0)

  // 变体
  const [hasVariants, setHasVariants] = useState(false)
  const [variants, setVariants] = useState<ProductVariant[]>([
    {
      option1_name: 'Color',
      option1_value: '',
      option2_name: 'Size',
      option2_value: '',
      price: '',
      inventory_quantity: 0
    }
  ])

  useEffect(() => {
    const session = checkAdminSession()
    if (!session) {
      router.push('/admin/login')
      return
    }
    loadCategories()
  }, [router])

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order')

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim()
  }

  const handleNameChange = (value: string) => {
    setName(value)
    // 不自动生成slug了，让用户在提交时决定
  }

  const addImageUrl = () => {
    setImageUrls([...imageUrls, ''])
  }

  const updateImageUrl = (index: number, value: string) => {
    const newUrls = [...imageUrls]
    newUrls[index] = value
    setImageUrls(newUrls)
  }

  const removeImageUrl = (index: number) => {
    const newUrls = imageUrls.filter((_, i) => i !== index)
    setImageUrls(newUrls)
    // 如果删除的是主图，将第一张设为主图
    if (index === primaryImageIndex) {
      setPrimaryImageIndex(0)
    } else if (index < primaryImageIndex) {
      setPrimaryImageIndex(primaryImageIndex - 1)
    }
  }

  const moveImageUp = (index: number) => {
    if (index === 0) return
    const newUrls = [...imageUrls]
    ;[newUrls[index - 1], newUrls[index]] = [newUrls[index], newUrls[index - 1]]
    setImageUrls(newUrls)

    // 更新主图索引
    if (primaryImageIndex === index) {
      setPrimaryImageIndex(index - 1)
    } else if (primaryImageIndex === index - 1) {
      setPrimaryImageIndex(index)
    }
  }

  const moveImageDown = (index: number) => {
    if (index === imageUrls.length - 1) return
    const newUrls = [...imageUrls]
    ;[newUrls[index], newUrls[index + 1]] = [newUrls[index + 1], newUrls[index]]
    setImageUrls(newUrls)

    // 更新主图索引
    if (primaryImageIndex === index) {
      setPrimaryImageIndex(index + 1)
    } else if (primaryImageIndex === index + 1) {
      setPrimaryImageIndex(index)
    }
  }

  const addVariant = () => {
    setVariants([...variants, {
      option1_name: 'Color',
      option1_value: '',
      option2_name: 'Size',
      option2_value: '',
      price: '',
      inventory_quantity: 0
    }])
  }

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index))
  }

  const updateVariant = (index: number, field: keyof ProductVariant, value: any) => {
    const newVariants = [...variants]
    newVariants[index] = { ...newVariants[index], [field]: value }
    setVariants(newVariants)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 如果用户没填slug，自动生成：优先使用SKU，其次使用商品名称
      let finalSlug = slug.trim()
      if (!finalSlug) {
        if (sku.trim()) {
          finalSlug = generateSlug(sku)
        } else {
          finalSlug = generateSlug(name)
        }
      }

      // 插入主商品 (使用现有数据库字段名)
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          name,
          slug: finalSlug,
          description,
          short_description: shortDescription,
          sku: sku || `CFR-${Date.now()}`,
          price: parseFloat(price),
          sale_price: comparePrice ? parseFloat(comparePrice) : null,
          stock_quantity: parseInt(inventoryQuantity),
          manage_stock: trackInventory,
          low_stock_threshold: 5,
          is_active: status === 'active',
          is_featured: isFeatured,
          is_digital: false,
          category_id: categoryId || null
        })
        .select()
        .single()

      if (productError) throw productError

      // 插入商品图片 (使用现有表结构字段名)
      const validImageUrls = imageUrls.filter(url => url.trim() !== '')
      if (validImageUrls.length > 0 && product) {
        const imageInserts = validImageUrls.map((url, index) => ({
          product_id: product.id,
          image_url: url,
          alt_text: name,
          sort_order: index,
          is_primary: index === primaryImageIndex
        }))

        const { error: imagesError } = await supabase
          .from('product_images')
          .insert(imageInserts)

        if (imagesError) console.error('Error inserting images:', imagesError)
      }

      // 插入变体（如果有）
      if (hasVariants && variants.length > 0 && product) {
        const validVariants = variants.filter(v => v.option1_value || v.option2_value)
        if (validVariants.length > 0) {
          const variantInserts = validVariants.map((v, index) => ({
            product_id: product.id,
            title: `${v.option1_value || ''} ${v.option2_value || ''}`.trim(),
            sku: `${sku}-${index + 1}`,
            price: v.price ? parseFloat(v.price) : parseFloat(price),
            inventory_quantity: v.inventory_quantity,
            option1_name: v.option1_name,
            option1_value: v.option1_value,
            option2_name: v.option2_name,
            option2_value: v.option2_value,
            sort_order: index
          }))

          const { error: variantsError } = await supabase
            .from('product_variants')
            .insert(variantInserts)

          if (variantsError) console.error('Error inserting variants:', variantsError)
        }
      }

      alert('Product created successfully!')
      router.push('/admin/dashboard')
    } catch (error: any) {
      console.error('Error creating product:', error)
      alert(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/admin/dashboard">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t.productUpload.backToDashboard}
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{t.productUpload.title}</h1>
          <p className="text-gray-600 mt-2">{t.productUpload.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">{t.productUpload.basicInfo}</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.productUpload.productName} *
                </label>
                <Input
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder={t.productUpload.productNamePlaceholder}
                  className="placeholder:text-gray-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.productUpload.urlSlug}
                </label>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder={t.productUpload.urlSlugPlaceholder}
                  className="placeholder:text-gray-400"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {t.productUpload.urlSlugHint || '可选。如果留空，将自动使用SKU或商品名称生成'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.productUpload.sku}
                </label>
                <Input
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder={t.productUpload.skuPlaceholder}
                  className="placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.productUpload.shortDescription}
                </label>
                <Input
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder={t.productUpload.shortDescPlaceholder}
                  className="placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.productUpload.fullDescription}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder:text-gray-400"
                  rows={4}
                  placeholder={t.productUpload.fullDescPlaceholder}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.productUpload.category}
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">{t.productUpload.selectCategory}</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">{t.productUpload.pricingInventory}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.productUpload.price} *
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder={t.productUpload.pricePlaceholder}
                  className="placeholder:text-gray-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.productUpload.comparePrice}
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={comparePrice}
                  onChange={(e) => setComparePrice(e.target.value)}
                  placeholder={t.productUpload.comparePricePlaceholder}
                  className="placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.productUpload.inventoryQuantity}
                </label>
                <Input
                  type="number"
                  value={inventoryQuantity}
                  onChange={(e) => setInventoryQuantity(e.target.value)}
                  placeholder={t.productUpload.inventoryPlaceholder}
                  className="placeholder:text-gray-400"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={trackInventory}
                  onChange={(e) => setTrackInventory(e.target.checked)}
                  className="mr-2"
                />
                <label className="text-sm text-gray-700">{t.productUpload.trackInventory}</label>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">{t.productUpload.productImages}</h2>

            <div className="space-y-4">
              {imageUrls.map((url, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex gap-4">
                    {/* Image Upload */}
                    <div className="flex-1">
                      <ImageUpload
                        existingUrl={url}
                        onImageUploaded={(newUrl) => updateImageUrl(index, newUrl)}
                        onRemove={() => removeImageUrl(index)}
                        folder="products"
                      />
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col gap-2">
                      {/* Set as Primary */}
                      <Button
                        type="button"
                        variant={primaryImageIndex === index ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPrimaryImageIndex(index)}
                        className="whitespace-nowrap"
                        title={t.productUpload.setPrimary || '设为主图'}
                      >
                        <Star className={`h-4 w-4 ${primaryImageIndex === index ? 'fill-current' : ''}`} />
                      </Button>

                      {/* Move Up */}
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => moveImageUp(index)}
                          title={t.productUpload.moveUp || '上移'}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                      )}

                      {/* Move Down */}
                      {index < imageUrls.length - 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => moveImageDown(index)}
                          title={t.productUpload.moveDown || '下移'}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Primary Image Indicator */}
                  {primaryImageIndex === index && (
                    <div className="mt-2 text-sm text-green-600 font-medium flex items-center gap-1">
                      <Star className="h-4 w-4 fill-current" />
                      {t.productUpload.primaryImage || '主图'}
                    </div>
                  )}

                  {/* Image Order Indicator */}
                  <div className="mt-2 text-xs text-gray-500">
                    {t.productUpload.imageOrder || '图片顺序'}: {index + 1}
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addImageUrl}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t.productUpload.addImage}
              </Button>
            </div>
          </div>

          {/* Variants */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{t.productUpload.productVariants}</h2>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={hasVariants}
                  onChange={(e) => setHasVariants(e.target.checked)}
                  className="mr-2"
                />
                <label className="text-sm text-gray-700">{t.productUpload.enableVariants}</label>
              </div>
            </div>

            {hasVariants && (
              <div className="space-y-4">
                {variants.map((variant, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <Input
                        placeholder={t.productUpload.variantColorPlaceholder}
                        value={variant.option1_value}
                        onChange={(e) => updateVariant(index, 'option1_value', e.target.value)}
                        className="placeholder:text-gray-400"
                      />
                      <Input
                        placeholder={t.productUpload.variantSizePlaceholder}
                        value={variant.option2_value}
                        onChange={(e) => updateVariant(index, 'option2_value', e.target.value)}
                        className="placeholder:text-gray-400"
                      />
                      <Input
                        type="number"
                        step="0.01"
                        placeholder={t.productUpload.variantPricePlaceholder}
                        value={variant.price}
                        onChange={(e) => updateVariant(index, 'price', e.target.value)}
                        className="placeholder:text-gray-400"
                      />
                      <Input
                        type="number"
                        placeholder={t.productUpload.variantInventoryPlaceholder}
                        value={variant.inventory_quantity}
                        onChange={(e) => updateVariant(index, 'inventory_quantity', parseInt(e.target.value))}
                        className="placeholder:text-gray-400"
                      />
                      {variants.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeVariant(index)}
                        >
                          {t.productUpload.remove}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addVariant}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t.productUpload.addVariant}
                </Button>
              </div>
            )}
          </div>

          {/* Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">{t.productUpload.status}</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.productUpload.productStatus}
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="draft">{t.productUpload.draft}</option>
                  <option value="active">{t.productUpload.active}</option>
                  <option value="archived">{t.productUpload.archived}</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="mr-2"
                />
                <label className="text-sm text-gray-700">{t.productUpload.featureProduct}</label>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {loading ? t.productUpload.creating : t.productUpload.createProduct}
            </Button>
            <Link href="/admin/dashboard" className="flex-1">
              <Button type="button" variant="outline" className="w-full">
                {t.productUpload.cancel}
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
