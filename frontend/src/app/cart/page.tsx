'use client'

import { useStore } from '@/lib/store'
import { AnnouncementBar, Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, User } from 'lucide-react'
import Link from 'next/link'
import FallbackImage from '@/components/FallbackImage'

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, user } = useStore()

  const subtotal = cart.reduce((total, item) => {
    return total + (item.product_data?.price || 0) * item.quantity
  }, 0)

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
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-3xl font-light tracking-widest uppercase mb-10 text-center">Your Shopping Bag</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* List */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item.tempId} className="bg-white p-4 flex gap-4 border border-gray-100 shadow-sm">
                  <div className="w-24 h-32 flex-shrink-0 bg-gray-50 overflow-hidden">
                    <FallbackImage src={item.product_data?.image} alt={item.product_data?.name} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-sm font-medium uppercase tracking-wide">{item.product_data?.name}</h3>
                        <button onClick={() => removeFromCart(item.tempId)} className="text-gray-400 hover:text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {/* Show size info */}
                      <div className="mt-1 space-y-0.5">
                        {item.variant_id ? (
                           <p className="text-xs text-gray-500 uppercase">Size: {item.tempId.split('-')[1]}</p>
                        ) : (
                          <>
                            <p className="text-xs text-gray-500 uppercase font-bold text-purple-600">SET</p>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <div className="flex border border-gray-200 items-center">
                        <button onClick={() => updateQuantity(item.tempId, item.quantity - 1)} className="p-1.5 hover:bg-gray-50"><Minus className="w-3 h-3"/></button>
                        <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.tempId, item.quantity + 1)} className="p-1.5 hover:bg-gray-50"><Plus className="w-3 h-3"/></button>
                      </div>
                      <span className="text-sm font-bold text-gray-900">${(item.product_data?.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
              
              <Link href="/" className="inline-flex items-center text-xs uppercase tracking-widest font-bold hover:underline py-4 text-gray-500">
                <ArrowLeft className="w-3 h-3 mr-2" /> Continue Shopping
              </Link>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 border border-gray-100 shadow-sm space-y-6 sticky top-24">
                <h2 className="text-lg font-light tracking-widest uppercase border-b pb-4">Order Summary</h2>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-bold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span className="text-green-600 uppercase text-xs font-bold">Calculated at checkout</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-6">
                    <span className="uppercase tracking-widest text-xs font-bold">Estimated Total</span>
                    <span className="text-xl font-bold">${subtotal.toFixed(2)}</span>
                  </div>

                  {user ? (
                    <Link href="/checkout">
                      <Button className="w-full bg-black text-white h-12 uppercase tracking-widest font-bold hover:bg-gray-800 rounded-none">
                        Checkout Now
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link href="/login?redirect=/checkout">
                        <Button className="w-full bg-black text-white h-12 uppercase tracking-widest font-bold hover:bg-gray-800 rounded-none flex items-center justify-center gap-2">
                          <User className="w-4 h-4" />
                          Login to Checkout
                        </Button>
                      </Link>
                      <p className="text-xs text-gray-500 mt-3 text-center">
                        Please login or create an account to complete your purchase.
                      </p>
                    </>
                  )}

                  <p className="text-[10px] text-gray-400 mt-4 text-center leading-relaxed italic">
                    KLARNA AND AFTERPAY AVAILABLE AT NEXT STEP.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
