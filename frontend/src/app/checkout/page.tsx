'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useStore } from '@/lib/store'
import { createOrder } from '@/lib/supabase'
import { AnnouncementBar, Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Loader2, CheckCircle, ShoppingBag, CreditCard, Lock } from 'lucide-react'
import FallbackImage from '@/components/FallbackImage'

// 主要内容组件（需要 Suspense 因为使用 useSearchParams）
function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { cart, user, clearCart } = useStore()
  const [loading, setLoading] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [error, setError] = useState('')

  // 检查是否从 Stripe 取消返回
  const cancelled = searchParams.get('cancelled')

  // 表单状态
  const [email, setEmail] = useState('')
  const [shippingForm, setShippingForm] = useState({
    full_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'United States'
  })

  // 计算金额
  const subtotal = cart.reduce((total, item) => {
    return total + (item.product_data?.price || 0) * item.quantity
  }, 0)
  const shippingCost = subtotal >= 100 ? 0 : 9.99
  const tax = 0 // 可以根据地区计算
  const total = subtotal + shippingCost + tax

  useEffect(() => {
    // 必须登录才能结账
    if (!user) {
      router.push('/login?redirect=/checkout')
      return
    }
    // 如果购物车为空且不是订单完成状态，跳转回购物车
    if (cart.length === 0 && !orderComplete) {
      router.push('/cart')
    }
    // 预填邮箱
    if (user?.email) {
      setEmail(user.email)
    }
  }, [cart, router, orderComplete, user])

  const updateShipping = (field: string, value: string) => {
    setShippingForm(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address')
      return false
    }
    if (!shippingForm.full_name) {
      setError('Please enter your full name')
      return false
    }
    if (!shippingForm.address_line1) {
      setError('Please enter your address')
      return false
    }
    if (!shippingForm.city) {
      setError('Please enter your city')
      return false
    }
    if (!shippingForm.postal_code) {
      setError('Please enter your postal code')
      return false
    }
    return true
  }

  const handlePlaceOrder = async () => {
    setError('')

    if (!validateForm()) return

    setLoading(true)

    try {
      // 1. 先创建订单
      const orderItems = cart.map(item => ({
        product_id: item.product_id,
        variant_id: item.variant_id?.toString(),
        product_name: item.product_data?.name || 'Product',
        product_sku: item.product_data?.sku,
        product_image: item.product_data?.image,
        variant_name: item.variant_id ? `Size: ${item.tempId.split('-')[1]}` : undefined,
        unit_price: item.product_data?.price || 0,
        quantity: item.quantity
      }))

      const order = await createOrder({
        user_id: user?.id,
        email,
        items: orderItems,
        shipping: shippingForm,
        subtotal,
        shipping_cost: shippingCost,
        tax,
        total,
        payment_method: 'card'
      })

      // 2. 创建 Stripe Checkout Session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: orderItems,
          orderId: order.id,
          orderNumber: order.order_number,
          email,
          shippingAddress: shippingForm
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // 3. 跳转到 Stripe Checkout 页面
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL received')
      }

    } catch (err: any) {
      console.error('Order error:', err)
      setError(err.message || 'Failed to create order. Please try again.')
      setLoading(false)
    }
  }

  // 订单完成页面
  if (orderComplete) {
    return (
      <>
        <AnnouncementBar />
        <Header />
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
          <CheckCircle className="w-20 h-20 text-green-500 mb-6" />
          <h1 className="text-3xl font-light tracking-widest uppercase mb-4">Order Confirmed!</h1>
          <p className="text-gray-600 mb-2">Thank you for your order.</p>
          <p className="text-lg font-bold mb-8">Order Number: {orderNumber}</p>
          <p className="text-sm text-gray-500 mb-8 text-center max-w-md">
            We've sent a confirmation email to <strong>{email}</strong>.
            You can track your order status using your order number.
          </p>
          <div className="flex gap-4">
            <Link href="/">
              <Button className="bg-black text-white px-8 h-12 uppercase tracking-widest font-bold">
                Continue Shopping
              </Button>
            </Link>
            {user && (
              <Link href="/account">
                <Button variant="outline" className="px-8 h-12 uppercase tracking-widest font-bold">
                  View Orders
                </Button>
              </Link>
            )}
          </div>
        </div>
        <Footer />
      </>
    )
  }

  // 购物车为空
  if (cart.length === 0) {
    return (
      <>
        <AnnouncementBar />
        <Header />
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
          <ShoppingBag className="w-16 h-16 text-gray-200" />
          <h1 className="text-2xl font-light tracking-widest uppercase">Your Cart is Empty</h1>
          <Link href="/">
            <Button className="bg-black text-white px-8 h-12 uppercase tracking-widest font-bold">
              Shop New Arrivals
            </Button>
          </Link>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <AnnouncementBar />
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Back link */}
          <Link href="/cart" className="inline-flex items-center text-sm text-gray-600 hover:text-black mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Link>

          <h1 className="text-3xl font-light tracking-widest uppercase mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left - Form */}
            <div className="space-y-8">
              {/* Contact */}
              <div className="bg-white p-6 border border-gray-200">
                <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-2">
                  We'll send your order confirmation and shipping updates to this email.
                </p>
              </div>

              {/* Shipping Address */}
              <div className="bg-white p-6 border border-gray-200">
                <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
                <div className="space-y-4">
                  <Input
                    placeholder="Full name *"
                    value={shippingForm.full_name}
                    onChange={(e) => updateShipping('full_name', e.target.value)}
                  />
                  <Input
                    placeholder="Phone (optional)"
                    value={shippingForm.phone}
                    onChange={(e) => updateShipping('phone', e.target.value)}
                  />
                  <Input
                    placeholder="Address line 1 *"
                    value={shippingForm.address_line1}
                    onChange={(e) => updateShipping('address_line1', e.target.value)}
                  />
                  <Input
                    placeholder="Address line 2 (optional)"
                    value={shippingForm.address_line2}
                    onChange={(e) => updateShipping('address_line2', e.target.value)}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="City *"
                      value={shippingForm.city}
                      onChange={(e) => updateShipping('city', e.target.value)}
                    />
                    <Input
                      placeholder="State / Province"
                      value={shippingForm.state}
                      onChange={(e) => updateShipping('state', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Postal code *"
                      value={shippingForm.postal_code}
                      onChange={(e) => updateShipping('postal_code', e.target.value)}
                    />
                    <select
                      value={shippingForm.country}
                      onChange={(e) => updateShipping('country', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                      <option value="China">China</option>
                      <option value="Japan">Japan</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-white p-6 border border-gray-200">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment
                </h2>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-700 font-medium">
                        Secure checkout powered by Stripe
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        You'll be redirected to Stripe's secure payment page to complete your purchase.
                        We accept credit cards, Apple Pay, and Google Pay.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment logos */}
                <div className="flex items-center gap-3 mt-4 text-gray-400">
                  <span className="text-xs font-medium border px-2 py-1 rounded">VISA</span>
                  <span className="text-xs font-medium border px-2 py-1 rounded">Mastercard</span>
                  <span className="text-xs font-medium border px-2 py-1 rounded">AMEX</span>
                  <span className="text-xs font-medium border px-2 py-1 rounded">Apple Pay</span>
                </div>

                {/* Cancelled payment notice */}
                {cancelled && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
                    Payment was cancelled. Your cart has been preserved - you can try again.
                  </div>
                )}
              </div>
            </div>

            {/* Right - Order Summary */}
            <div>
              <div className="bg-white p-6 border border-gray-200 sticky top-24">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

                {/* Items */}
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.tempId} className="flex gap-4">
                      <div className="w-16 h-20 flex-shrink-0 bg-gray-50 overflow-hidden">
                        <FallbackImage
                          src={item.product_data?.image}
                          alt={item.product_data?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium">{item.product_data?.name}</h3>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-sm font-bold">
                        ${((item.product_data?.price || 0) * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span>{shippingCost === 0 ? <span className="text-green-600">FREE</span> : `$${shippingCost.toFixed(2)}`}</span>
                  </div>
                  {tax > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Free shipping notice */}
                {subtotal < 100 && (
                  <p className="text-xs text-gray-500 mt-4 text-center">
                    Add ${(100 - subtotal).toFixed(2)} more for FREE shipping!
                  </p>
                )}

                {/* Error message */}
                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                    {error}
                  </div>
                )}

                {/* Place Order Button */}
                <Button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="w-full mt-6 bg-black text-white h-12 uppercase tracking-widest font-bold hover:bg-gray-800 rounded-none flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Redirecting to Payment...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Pay ${total.toFixed(2)}
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-400 mt-4 text-center">
                  By placing your order, you agree to our Terms & Conditions and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

// 导出的页面组件，包装 Suspense
export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <>
        <AnnouncementBar />
        <Header />
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
        <Footer />
      </>
    }>
      <CheckoutContent />
    </Suspense>
  )
}
