import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShoppingBag } from 'lucide-react'
import { formatPrice, getPrimaryImage, hasDiscount, getFinalPrice, getSavingsAmount } from '@/lib/utils'

interface ProductImage {
  image_url: string
  alt_text: string | null
  is_primary: boolean
  sort_order: number
}

interface Category {
  name: string
  slug: string
}

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    short_description: string | null
    price: number
    sale_price: number | null
    stock_quantity: number
    is_featured: boolean
    category: Category | null
    images: ProductImage[]
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImageUrl = getPrimaryImage(product.images)
  const hasDiscount_ = hasDiscount(product.price, product.sale_price)
  const finalPrice = getFinalPrice(product.price, product.sale_price)
  const savingsAmount = getSavingsAmount(product.price, product.sale_price)

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-0 bg-white">
      <CardContent className="p-0">
        <Link href={`/products/${product.slug}`}>
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={primaryImageUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.is_featured && (
                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 shadow-lg">
                  ✨ Featured
                </Badge>
              )}
              {hasDiscount_ && (
                <Badge variant="destructive" className="shadow-lg">
                  Save {formatPrice(savingsAmount)}
                </Badge>
              )}
            </div>

            {/* Stock indicator */}
            {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
              <div className="absolute top-3 right-3">
                <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                  Only {product.stock_quantity} left
                </Badge>
              </div>
            )}

            {product.stock_quantity === 0 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <Badge variant="outline" className="bg-red-50 text-red-800 border-red-200 text-lg px-4 py-2">
                  Out of Stock
                </Badge>
              </div>
            )}

            {/* Quick add to cart overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
              {product.stock_quantity > 0 && (
                <Button
                  size="sm"
                  className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                  onClick={(e) => {
                    e.preventDefault()
                    // Add to cart logic here
                    console.log('Add to cart:', product.id)
                  }}
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Quick Add
                </Button>
              )}
            </div>
          </div>
        </Link>

        <div className="p-4">
          <Link href={`/products/${product.slug}`}>
            <div className="mb-2">
              <p className="text-sm text-purple-600 font-medium">
                {product.category?.name}
              </p>
              <h3 className="font-bold text-lg text-gray-900 group-hover:text-purple-600 transition-colors duration-200 line-clamp-2">
                {product.name}
              </h3>
            </div>

            {product.short_description && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {product.short_description}
              </p>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {hasDiscount_ ? (
                  <>
                    <span className="font-bold text-xl text-purple-600">
                      {formatPrice(finalPrice)}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(product.price)}
                    </span>
                  </>
                ) : (
                  <span className="font-bold text-xl text-purple-600">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>

              {/* Stock status */}
              <div className="text-sm">
                {product.stock_quantity > 0 ? (
                  <span className="text-green-600 font-medium">✓ In Stock</span>
                ) : (
                  <span className="text-red-600 font-medium">✗ Out of Stock</span>
                )}
              </div>
            </div>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}