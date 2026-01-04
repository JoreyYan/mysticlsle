import { ShoppingCart, Heart, Share, Star, Plus, Minus, ChevronDown, ChevronUp, Check, Loader2 } from 'lucide-react'
import { useStore } from '@/lib/store'

// 简单的展开/收起组件
const DetailSection = ({ title, content, defaultOpen = false }: { title: string, content: string | undefined, defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  
  if (!content) return null

  return (
    <div className="border-b border-gray-200">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 text-left font-medium text-gray-900 hover:text-purple-600 transition-colors"
      >
        <span className="uppercase text-sm tracking-wide">{title}</span>
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {isOpen && (
        <div className="pb-6 text-sm text-gray-600 leading-relaxed whitespace-pre-wrap animate-in fade-in slide-in-from-top-2 duration-200">
          {content}
        </div>
      )}
    </div>
  )
}

export default function ProductPage() {
  const params = useParams()
  const productSlug = params.slug as string
  const { addToCart, wishlist, toggleWishlist, user } = useStore()

  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  
  // 变体状态
  const [variantsTop, setVariantsTop] = useState<ProductVariant[]>([])
  const [variantsBottom, setVariantsBottom] = useState<ProductVariant[]>([])
  const [variantsMain, setVariantsMain] = useState<ProductVariant[]>([]) // For non-set products

  // 选中状态
  const [selectedTop, setSelectedTop] = useState<ProductVariant | null>(null)
  const [selectedBottom, setSelectedBottom] = useState<ProductVariant | null>(null)
  const [selectedMain, setSelectedMain] = useState<ProductVariant | null>(null)

  const [selectedImage, setSelectedImage] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

  useEffect(() => {
    loadProduct()
  }, [productSlug])

  const loadProduct = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await ProductService.getProductBySlug(productSlug)

      if (response.error || !response.data) {
        setError(response.error || 'Product not found')
        return
      }

      const productData = response.data
      setProduct(productData)
      
      // Image initialization
      let initialImage = ''
      if (productData.images && productData.images.length > 0) {
        const firstImage = productData.images[0]
        if (typeof firstImage === 'string') {
          initialImage = firstImage
        } else if (typeof firstImage === 'object' && firstImage.image_url) {
          const primary = productData.images.find((img: any) => img.is_primary)
          initialImage = primary ? primary.image_url : (firstImage as any).image_url
        }
      }
      setSelectedImage(initialImage)

      // Variants processing
      if (productData.variants && productData.variants.length > 0) {
        if (productData.product_type === 'set') {
          const tops = productData.variants.filter((v: any) => v.part === 'top')
          const bottoms = productData.variants.filter((v: any) => v.part === 'bottom')
          setVariantsTop(tops)
          setVariantsBottom(bottoms)
        } else {
          const mains = productData.variants.filter((v: any) => !v.part || v.part === 'main')
          setVariantsMain(mains)
          setSelectedMain(mains.find(v => v.inventory_quantity > 0) || mains[0])
        }
      }

      // Related products
      if (productData.category_id) {
        const relatedResponse = await ProductService.getRelatedProducts(
          productData.id,
          productData.category_id,
          4
        )
        if (relatedResponse.data) setRelatedProducts(relatedResponse.data)
      }

    } catch (err) {
      setError('Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!product) return
    setIsAdding(true)

    const cartItemBase = {
      product_id: product.id,
      quantity: quantity,
      product_data: {
        name: product.name,
        price: currentPrice,
        image: selectedImage
      }
    }

    if (product.product_type === 'set') {
      if (!selectedTop || !selectedBottom) {
        alert('Please select both Top and Bottom sizes')
        setIsAdding(false)
        return
      }
      addToCart({
        ...cartItemBase,
        top_variant_id: Number(selectedTop.id),
        bottom_variant_id: Number(selectedBottom.id)
      })
    } else {
      if (!selectedMain) {
        alert('Please select a size')
        setIsAdding(false)
        return
      }
      addToCart({
        ...cartItemBase,
        variant_id: Number(selectedMain.id)
      })
    }

    setAddedToCart(true)
    setIsAdding(false)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleWishlistToggle = () => {
    if (!product) return
    toggleWishlist(product.id)
  }

  const isWishlisted = product ? wishlist.includes(product.id) : false

  // Helper to determine pricing and availability
  const isSet = product?.product_type === 'set'
  
  const currentPrice = isSet 
    ? (product?.price || 0) // Set price usually fixed on product level
    : (selectedMain?.price || product?.price || 0)

  const currentComparePrice = product?.sale_price

  // Stock check
  const availableStock = isSet
    ? Math.min(selectedTop?.inventory_quantity || 0, selectedBottom?.inventory_quantity || 0)
    : (selectedMain?.inventory_quantity || product?.stock_quantity || 0)

  const isSoldOut = isSet 
    ? (!selectedTop || !selectedBottom || availableStock <= 0)
    : (!selectedMain || availableStock <= 0)

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>
  if (error || !product) return <div className="min-h-screen flex items-center justify-center">Product Not Found</div>

  const discountPercentage = currentComparePrice
    ? Math.round(((currentComparePrice - currentPrice) / currentComparePrice) * 100)
    : 0

  const details = product.details || {}
  const returnPolicy = product.is_final_sale 
    ? "THIS ITEM IS FINAL SALE; NO EXCHANGE OR RETURN PLEASE" 
    : "We accept returns within 30 days of delivery. Items must be unworn and tags attached."

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumbs */}
        <nav className="text-xs text-gray-500 mb-8 uppercase tracking-wide">
          <ol className="flex items-center space-x-2">
            <li><a href="/" className="hover:text-black">Home</a></li>
            <li>/</li>
            {product.category && (
              <>
                <li><a href={`/collections/${product.category.slug}`} className="hover:text-black">{product.category.name}</a></li>
                <li>/</li>
              </>
            )}
            <li className="text-black">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-20">
          
          {/* Left: Images */}
          <div className="space-y-4">
            <div className="aspect-[4/5] bg-gray-50 overflow-hidden">
              <FallbackImage
                src={selectedImage || '/images/placeholder-product.jpg'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {product.images.map((image: any, index: number) => {
                  const imageUrl = typeof image === 'string' ? image : image.image_url
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(imageUrl)}
                      className={`aspect-square overflow-hidden border transition-all ${selectedImage === imageUrl ? 'border-black opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <FallbackImage src={imageUrl} alt="" className="w-full h-full object-cover" />
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-light text-gray-900 mb-2 tracking-wide">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xl font-medium text-gray-900">${currentPrice.toFixed(2)}</span>
              {currentComparePrice && currentComparePrice > currentPrice && (
                <>
                  <span className="text-lg text-gray-400 line-through">${currentComparePrice.toFixed(2)}</span>
                  <Badge variant="destructive" className="rounded-none px-2 font-normal">
                    {discountPercentage}% OFF
                  </Badge>
                </>
              )}
            </div>

            {product.is_final_sale && (
              <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-800 text-xs tracking-wide leading-relaxed">
                <p className="font-bold mb-1">FINAL SALE NOTICE</p>
                <p>PLEASE KNOW THIS ITEM IS FINAL SALE WITH 30% OFF.</p>
                <p>NO EXCHANGE OR RETURN PLEASE, THANK YOU!</p>
              </div>
            )}

            {product.short_description && (
              <p className="text-sm text-gray-600 mb-8 leading-relaxed font-light">
                {product.short_description}
              </p>
            )}

            {/* VARIANTS SELECTOR */}
            <div className="mb-8 space-y-6">
              {isSet ? (
                <>
                  {/* TOP SIZE */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-xs font-bold uppercase tracking-wider">Top Size</label>
                      <span className="text-xs text-gray-500">{selectedTop ? selectedTop.size : 'Select Size'}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {variantsTop.map((variant) => (
                        <button
                          key={variant.id}
                          onClick={() => setSelectedTop(variant)}
                          disabled={variant.inventory_quantity <= 0}
                          className={`min-w-[3rem] px-3 py-2 border text-sm transition-all ${
                            selectedTop?.id === variant.id
                              ? 'border-black bg-black text-white'
                              : 'border-gray-200 text-gray-600 hover:border-gray-900'
                          } ${variant.inventory_quantity <= 0 ? 'opacity-40 cursor-not-allowed line-through' : ''}`}
                        >
                          {variant.option2_value || variant.size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* BOTTOM SIZE */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-xs font-bold uppercase tracking-wider">Bottom Size</label>
                      <span className="text-xs text-gray-500">{selectedBottom ? selectedBottom.size : 'Select Size'}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {variantsBottom.map((variant) => (
                        <button
                          key={variant.id}
                          onClick={() => setSelectedBottom(variant)}
                          disabled={variant.inventory_quantity <= 0}
                          className={`min-w-[3rem] px-3 py-2 border text-sm transition-all ${
                            selectedBottom?.id === variant.id
                              ? 'border-black bg-black text-white'
                              : 'border-gray-200 text-gray-600 hover:border-gray-900'
                          } ${variant.inventory_quantity <= 0 ? 'opacity-40 cursor-not-allowed line-through' : ''}`}
                        >
                          {variant.option2_value || variant.size}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                /* REGULAR SIZE SELECTOR */
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider">Size</label>
                    <span className="text-xs text-gray-500">{selectedMain?.option2_value || selectedMain?.size}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {variantsMain.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedMain(variant)}
                        disabled={variant.inventory_quantity <= 0}
                        className={`min-w-[3rem] px-3 py-2 border text-sm transition-all ${
                          selectedMain?.id === variant.id
                            ? 'border-black bg-black text-white'
                            : 'border-gray-200 text-gray-600 hover:border-gray-900'
                        } ${variant.inventory_quantity <= 0 ? 'opacity-40 cursor-not-allowed line-through' : ''}`}
                      >
                        {variant.option2_value || variant.size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ADD TO CART */}
            <div className="space-y-4 mb-10">
              <div className="flex gap-4">
                <div className="w-32 border border-gray-200 flex items-center justify-between px-3">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 text-gray-500 hover:text-black"><Minus className="w-3 h-3"/></button>
                  <span className="text-sm">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(availableStock || 99, quantity + 1))} className="p-2 text-gray-500 hover:text-black"><Plus className="w-3 h-3"/></button>
                </div>
                <Button
                  onClick={handleAddToCart}
                  disabled={isSoldOut || isAdding}
                  className={`flex-1 h-12 rounded-none uppercase tracking-widest text-xs font-bold transition-all ${
                    addedToCart ? 'bg-green-600 hover:bg-green-700' : 'bg-black text-white hover:bg-gray-800'
                  }`}
                >
                  {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                   addedToCart ? <><Check className="w-4 h-4 mr-2" /> Added</> :
                   isSoldOut ? 'Sold Out / Select Size' : 'Add to Cart'}
                </Button>
              </div>
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  className={`flex-1 h-10 rounded-none border-gray-200 text-xs uppercase tracking-wide transition-colors ${
                    isWishlisted ? 'text-pink-600 border-pink-100 bg-pink-50' : ''
                  }`}
                  onClick={handleWishlistToggle}
                >
                  <Heart className={`w-3 h-3 mr-2 ${isWishlisted ? 'fill-current' : ''}`} /> 
                  {isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}
                </Button>
              </div>
            </div>

            {/* Return Policy Sidebar */}
            <div className="mt-8 pt-8 border-t border-gray-100 text-xs text-gray-500 uppercase tracking-wide">
              <p className="font-bold mb-2">RETURN & EXCHANGE</p>
              <p>{returnPolicy}</p>
            </div>
          </div>
        </div>

        {/* ACCORDION DETAILS (FULL WIDTH) */}
        <div className="max-w-4xl mx-auto mb-20 border-t border-gray-200">
          <DetailSection title="DESIGN" content={details.design || product.description || ''} defaultOpen={true} />
          <DetailSection title="SHIPPING" content={details.shipping || "In stock: ships within 48 hours."} />
          <DetailSection title="FIT & FABRIC" content={details.fabric || "Please refer to size chart."} />
          <DetailSection title="CRAFTMANSHIP" content={details.craftsmanship || "Hand-finished details."} />
          <DetailSection title="CARING" content={details.caring || "Hand wash cold only."} />
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="pt-20 border-t border-gray-100">
            <h2 className="text-xl font-light text-center mb-12 uppercase tracking-widest">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}