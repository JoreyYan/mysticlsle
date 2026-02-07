'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { AnnouncementBar, Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { CheckCircle, Loader2, Package } from 'lucide-react'
import { getOrderByNumber } from '@/lib/supabase'
import { useStore } from '@/lib/store'

interface Order {
  id: string
  order_number: string
  email: string
  status: string
  total: number
  items: Array<{
    product_name: string
    quantity: number
    unit_price: number
  }>
}

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('order')
  const sessionId = searchParams.get('session_id')

  const { clearCart, user } = useStore()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 清空购物车
    clearCart()

    // 加载订单详情
    if (orderNumber) {
      loadOrder()
    } else {
      setLoading(false)
    }
  }, [orderNumber])

  const loadOrder = async () => {
    try {
      const orderData = await getOrderByNumber(orderNumber!)
      setOrder(orderData)
    } catch (error) {
      console.error('Error loading order:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <>
        <AnnouncementBar />
        <Header />
        <div className="min-h-[70vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <AnnouncementBar />
      <Header />
      <div className="min-h-[70vh] bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white p-8 md:p-12 border border-gray-200 text-center">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />

            <h1 className="text-3xl font-light tracking-widest uppercase mb-4">
              Thank You!
            </h1>

            <p className="text-xl text-gray-600 mb-2">
              Your order has been confirmed.
            </p>

            {orderNumber && (
              <div className="bg-gray-50 rounded-lg p-4 my-6">
                <p className="text-sm text-gray-500 mb-1">Order Number</p>
                <p className="text-2xl font-bold tracking-wider">{orderNumber}</p>
              </div>
            )}

            {order && (
              <div className="text-left border-t pt-6 mt-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order Details
                </h3>

                <div className="space-y-3">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.product_name} x {item.quantity}
                      </span>
                      <span className="font-medium">
                        ${(item.unit_price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t mt-4 pt-4 flex justify-between font-bold">
                  <span>Total</span>
                  <span>${order.total?.toFixed(2)}</span>
                </div>

                <p className="text-sm text-gray-500 mt-4">
                  A confirmation email has been sent to <strong>{order.email}</strong>
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link href="/">
                <Button className="bg-black text-white px-8 h-12 uppercase tracking-widest font-bold w-full sm:w-auto">
                  Continue Shopping
                </Button>
              </Link>

              {user && (
                <Link href="/account">
                  <Button variant="outline" className="px-8 h-12 uppercase tracking-widest font-bold w-full sm:w-auto">
                    View Orders
                  </Button>
                </Link>
              )}
            </div>

            <p className="text-xs text-gray-400 mt-8">
              Questions about your order? Contact us at help@openme.com
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <>
        <AnnouncementBar />
        <Header />
        <div className="min-h-[70vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
        <Footer />
      </>
    }>
      <SuccessContent />
    </Suspense>
  )
}
