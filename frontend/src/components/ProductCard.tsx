'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Product } from '@/types/database'
import FallbackImage from '@/components/FallbackImage'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Heart, ChevronLeft, ChevronRight } from 'lucide-react'

interface ProductCardProps {
  product: Product
  className?: string
}

export default function ProductCard({ product, className = '' }: ProductCardProps) {
  // Handle both compare_at_price and sale_price field names
  const salePrice = (product as any).sale_price || (product as any).compare_at_price
  const discountPercentage = salePrice && salePrice < product.price
    ? Math.round(((product.price - salePrice) / product.price) * 100)
    : 0

  const displayPrice = (salePrice && salePrice < product.price) ? salePrice : product.price

  // Get all product images
  const getProductImages = () => {
    const images: string[] = []

    // 1. First check product.images (API v2 standard)
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      product.images.forEach((img: any) => {
        if (typeof img === 'string') {
          images.push(img)
        } else if (img && img.image_url) {
          images.push(img.image_url)
        }
      })
    }
    
    // 2. Fallback to product.product_images (Legacy or direct DB relation)
    else if (product.product_images && Array.isArray(product.product_images) && product.product_images.length > 0) {
      // Sort by is_primary first, then by sort_order
      const sortedImages = [...product.product_images].sort((a: any, b: any) => {
        if (a.is_primary && !b.is_primary) return -1
        if (!a.is_primary && b.is_primary) return 1
        return (a.sort_order || 0) - (b.sort_order || 0)
      })

      sortedImages.forEach((img: any) => {
        if (img.image_url) images.push(img.image_url)
      })
    }

    // Fallback to featured_image if available
    if (images.length === 0 && product.featured_image) {
      images.push(product.featured_image)
    }

    // Last resort: placeholder
    if (images.length === 0) {
      images.push('/images/placeholder-product.jpg')
    }

    return images
  }

  const productImages = getProductImages()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const hasMultipleImages = productImages.length > 1

  // Preload all images
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>(new Array(productImages.length).fill(false))

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isTransitioning) return

    const newIndex = (currentImageIndex + 1) % productImages.length
    console.log('Next image clicked:', {
      current: currentImageIndex,
      next: newIndex,
      totalImages: productImages.length,
      currentUrl: productImages[currentImageIndex],
      nextUrl: productImages[newIndex]
    })

    setIsTransitioning(true)
    setCurrentImageIndex(newIndex)
    setTimeout(() => setIsTransitioning(false), 300)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isTransitioning) return

    const newIndex = (currentImageIndex - 1 + productImages.length) % productImages.length
    console.log('Previous image clicked:', {
      current: currentImageIndex,
      previous: newIndex,
      totalImages: productImages.length,
      currentUrl: productImages[currentImageIndex],
      prevUrl: productImages[newIndex]
    })

    setIsTransitioning(true)
    setCurrentImageIndex(newIndex)
    setTimeout(() => setIsTransitioning(false), 300)
  }

  return (
    <div className={`group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 ${className}`}>
      {/* 商品图片 */}
      <div className="aspect-[3/4] relative overflow-hidden bg-gray-100">
        <Link href={`/products/${product.slug}`}>
          <div className="relative w-full h-full">
            <FallbackImage
              key={currentImageIndex}
              src={productImages[currentImageIndex]}
              alt={`${product.name} - Image ${currentImageIndex + 1}`}
              className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${
                isTransitioning ? 'opacity-70' : 'opacity-100'
              }`}
            />
            {/* Debug: Current image info */}
            <div className="absolute top-0 right-0 bg-black/50 text-white text-xs px-2 py-1 z-30">
              {currentImageIndex + 1}/{productImages.length}
            </div>
            {/* Loading indicator */}
            {isTransitioning && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        </Link>

        {/* Preload other images */}
        <div className="hidden">
          {productImages.map((img, idx) => (
            idx !== currentImageIndex && (
              <img
                key={idx}
                src={img}
                alt=""
                onLoad={() => {
                  const newLoaded = [...imagesLoaded]
                  newLoaded[idx] = true
                  setImagesLoaded(newLoaded)
                }}
              />
            )
          ))}
        </div>

        {/* 折扣标签 */}
        {discountPercentage > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded z-10">
            -{discountPercentage}%
          </div>
        )}

        {/* 新品标签 */}
        {product.is_featured && (
          <div className="absolute top-3 right-3 bg-pink-500 text-white px-2 py-1 text-xs font-bold rounded z-10">
            FEATURED
          </div>
        )}

        {/* 图片导航箭头 - 只在有多张图片时显示 */}
        {hasMultipleImages && (
          <>
            {/* 左箭头 */}
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 shadow-lg"
              aria-label="Previous image"
              type="button"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* 右箭头 */}
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 shadow-lg"
              aria-label="Next image"
              type="button"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* 图片指示器 */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
              {productImages.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    if (isTransitioning) return

                    setIsTransitioning(true)
                    setCurrentImageIndex(index)
                    setTimeout(() => setIsTransitioning(false), 300)
                  }}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    index === currentImageIndex
                      ? 'bg-white w-4'
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {/* 悬停时的快速操作按钮 */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
          <div className="flex gap-2 pointer-events-auto">
            <Button
              size="sm"
              className="bg-white text-black hover:bg-gray-100"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-white/90 hover:bg-white"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
            >
              <Heart className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* 商品信息 */}
      <div className="p-4">
        {/* 分类 */}
        {product.category && (
          <Link
            href={`/collections/${product.category.slug}`}
            className="text-xs text-gray-500 hover:text-gray-700 uppercase font-medium"
          >
            {product.category.name}
          </Link>
        )}

        {/* 商品名称 */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="mt-1 text-sm font-medium text-gray-900 hover:text-pink-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* 简短描述 */}
        {product.short_description && (
          <p className="mt-1 text-xs text-gray-600 line-clamp-2">
            {product.short_description}
          </p>
        )}

        {/* 价格 */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">
            ${displayPrice.toFixed(2)}
          </span>
          {salePrice && salePrice < product.price && (
            <span className="text-sm text-gray-500 line-through">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* 库存状态 */}
        <div className="mt-2">
          {((product as any).stock_quantity || (product as any).inventory_quantity || 0) > 0 ? (
            ((product as any).stock_quantity || (product as any).inventory_quantity || 0) <= ((product as any).low_stock_threshold || 5) ? (
              <span className="text-xs text-yellow-600 font-medium">
                Low Stock ({(product as any).stock_quantity || (product as any).inventory_quantity} left)
              </span>
            ) : (
              <span className="text-xs text-green-600 font-medium">In Stock</span>
            )
          ) : (
            <span className="text-xs text-red-600 font-medium">Out of Stock</span>
          )}
        </div>

        {/* 添加到购物车按钮 */}
        <Button
          className="w-full mt-3 bg-black text-white hover:bg-gray-800 text-sm py-2"
          disabled={((product as any).stock_quantity || (product as any).inventory_quantity || 0) <= 0}
        >
          {((product as any).stock_quantity || (product as any).inventory_quantity || 0) > 0 ? 'Add to Cart' : 'Sold Out'}
        </Button>
      </div>
    </div>
  )
}