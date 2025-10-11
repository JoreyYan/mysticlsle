'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { ProductService } from '@/lib/api/products'
import { Product, ProductVariant } from '@/types/database'
import FallbackImage from '@/components/FallbackImage'
import ProductCard from '@/components/ProductCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Heart, Share, Star, Truck, Shield, RotateCcw } from 'lucide-react'

export default function ProductPage() {
  const params = useParams()
  const productSlug = params.slug as string

  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [selectedImage, setSelectedImage] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadProduct()
  }, [productSlug])

  const loadProduct = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await ProductService.getProductBySlug(productSlug)

      if (response.error) {
        setError(response.error)
        return
      }

      if (!response.data) {
        setError('Product not found')
        return
      }

      const productData = response.data
      setProduct(productData)
      setSelectedImage(productData.featured_image || '')

      if (productData.variants && productData.variants.length > 0) {
        setSelectedVariant(productData.variants[0])
      }

      // 加载相关产品
      if (productData.category_id) {
        const relatedResponse = await ProductService.getRelatedProducts(
          productData.id,
          productData.category_id,
          4
        )
        if (relatedResponse.data) {
          setRelatedProducts(relatedResponse.data)
        }
      }

    } catch (err) {
      setError('Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    // TODO: 实现添加到购物车功能
    console.log('Add to cart:', { product, variant: selectedVariant, quantity })
  }

  const getCurrentPrice = () => {
    return selectedVariant?.price || product?.price || 0
  }

  const getCurrentComparePrice = () => {
    return selectedVariant?.compare_at_price || product?.compare_at_price
  }

  const getAvailableQuantity = () => {
    return selectedVariant?.inventory_quantity || product?.inventory_quantity || 0
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 图片骨架 */}
              <div className="space-y-4">
                <div className="aspect-square bg-gray-200 rounded-lg"></div>
                <div className="flex gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="aspect-square w-20 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>

              {/* 信息骨架 */}
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-12 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'The product you\'re looking for doesn\'t exist.'}</p>
          <Button onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const discountPercentage = getCurrentComparePrice()
    ? Math.round(((getCurrentComparePrice()! - getCurrentPrice()) / getCurrentComparePrice()!) * 100)
    : 0

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* 面包屑 */}
        <nav className="text-sm text-gray-600 mb-8">
          <ol className="flex items-center space-x-2">
            <li><a href="/" className="hover:text-gray-900">Home</a></li>
            <li>/</li>
            {product.category && (
              <>
                <li>
                  <a href={`/collections/${product.category.slug}`} className="hover:text-gray-900">
                    {product.category.name}
                  </a>
                </li>
                <li>/</li>
              </>
            )}
            <li className="text-gray-900">{product.name}</li>
          </ol>
        </nav>

        {/* 主要产品信息 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* 产品图片 */}
          <div className="space-y-4">
            {/* 主图 */}
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <FallbackImage
                src={selectedImage || product.featured_image || '/images/placeholder-product.jpg'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* 缩略图 */}
            {product.images && product.images.length > 0 && (
              <div className="flex gap-2 overflow-x-auto">
                {[product.featured_image, ...(product.images || [])].filter(Boolean).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(image!)}
                    className={`flex-shrink-0 aspect-square w-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === image ? 'border-pink-500' : 'border-gray-200'
                    }`}
                  >
                    <FallbackImage
                      src={image!}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 产品信息 */}
          <div className="space-y-6">
            {/* 标题和价格 */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-900">
                    ${getCurrentPrice().toFixed(2)}
                  </span>
                  {getCurrentComparePrice() && getCurrentComparePrice()! > getCurrentPrice() && (
                    <>
                      <span className="text-lg text-gray-500 line-through">
                        ${getCurrentComparePrice()!.toFixed(2)}
                      </span>
                      <Badge variant="destructive" className="text-xs">
                        -{discountPercentage}% OFF
                      </Badge>
                    </>
                  )}
                </div>
              </div>

              {/* 评级（模拟） */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(24 reviews)</span>
              </div>
            </div>

            {/* 产品描述 */}
            {product.short_description && (
              <p className="text-gray-600 leading-relaxed">
                {product.short_description}
              </p>
            )}

            {/* 变体选择 */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-4">
                {/* 尺寸选择 */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Size: {selectedVariant?.option1_value}
                  </label>
                  <div className="flex gap-2">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-4 py-2 border rounded-md text-sm font-medium ${
                          selectedVariant?.id === variant.id
                            ? 'border-pink-500 bg-pink-50 text-pink-700'
                            : 'border-gray-300 hover:border-gray-400'
                        } ${
                          variant.inventory_quantity <= 0
                            ? 'opacity-50 cursor-not-allowed'
                            : ''
                        }`}
                        disabled={variant.inventory_quantity <= 0}
                      >
                        {variant.option1_value}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 数量选择 */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <div className="flex border border-gray-300 rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 border-r border-gray-300 hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 min-w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(getAvailableQuantity(), quantity + 1))}
                    className="px-3 py-2 border-l border-gray-300 hover:bg-gray-50"
                    disabled={quantity >= getAvailableQuantity()}
                  >
                    +
                  </button>
                </div>

                <span className="text-sm text-gray-600">
                  {getAvailableQuantity() > 0
                    ? `${getAvailableQuantity()} available`
                    : 'Out of stock'
                  }
                </span>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="space-y-3">
              <Button
                onClick={handleAddToCart}
                disabled={getAvailableQuantity() <= 0}
                className="w-full bg-black text-white hover:bg-gray-800 py-3 text-lg"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {getAvailableQuantity() > 0 ? 'Add to Cart' : 'Sold Out'}
              </Button>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Heart className="w-4 h-4 mr-2" />
                  Add to Wishlist
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* 保证信息 */}
            <div className="border-t pt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Truck className="w-5 h-5" />
                <span>Free shipping on orders over $100</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <RotateCcw className="w-5 h-5" />
                <span>Free returns within 30 days</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Shield className="w-5 h-5" />
                <span>1 year warranty included</span>
              </div>
            </div>
          </div>
        </div>

        {/* 产品详细描述 */}
        {product.description && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Details</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          </div>
        )}

        {/* 相关产品 */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">You might also like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  className="hover-effect"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}