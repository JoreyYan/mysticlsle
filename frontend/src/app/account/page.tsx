'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useStore } from '@/lib/store'
import { getUserOrders, getUserAddresses, deleteAddress, getOrdersByEmail } from '@/lib/supabase'
import { AnnouncementBar, Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Package, MapPin, User, LogOut, ChevronRight,
  Loader2, Truck, CheckCircle, Clock, XCircle, Search
} from 'lucide-react'
import FallbackImage from '@/components/FallbackImage'

type TabType = 'orders' | 'addresses' | 'profile'

interface Order {
  id: string
  order_number: string
  status: string
  payment_status: string
  total: number
  created_at: string
  items: Array<{
    product_name: string
    product_image: string
    quantity: number
    unit_price: number
  }>
}

export default function AccountPage() {
  const router = useRouter()
  const { user, setUser } = useStore()
  const [activeTab, setActiveTab] = useState<TabType>('orders')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  // 游客查询订单
  const [guestEmail, setGuestEmail] = useState('')
  const [searchingOrders, setSearchingOrders] = useState(false)

  useEffect(() => {
    if (user) {
      loadUserData()
    } else {
      setLoading(false)
    }
  }, [user])

  const loadUserData = async () => {
    if (!user?.id) return
    setLoading(true)
    try {
      const ordersData = await getUserOrders(user.id)
      setOrders(ordersData)
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGuestOrderSearch = async () => {
    if (!guestEmail || !guestEmail.includes('@')) return
    setSearchingOrders(true)
    try {
      const ordersData = await getOrdersByEmail(guestEmail)
      setOrders(ordersData)
    } catch (error) {
      console.error('Error searching orders:', error)
    } finally {
      setSearchingOrders(false)
    }
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('openme-storage')
    router.push('/')
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'shipped':
        return <Truck className="w-4 h-4 text-blue-500" />
      case 'cancelled':
      case 'refunded':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />
    }
  }

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'Pending Payment',
      paid: 'Paid',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      refunded: 'Refunded'
    }
    return statusMap[status] || status
  }

  // 未登录状态 - 显示游客查询订单
  if (!user) {
    return (
      <>
        <AnnouncementBar />
        <Header />
        <div className="min-h-[70vh] bg-gray-50 py-12">
          <div className="container mx-auto px-4 max-w-md">
            <div className="bg-white p-8 border border-gray-200 text-center">
              <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h1 className="text-2xl font-light tracking-widest uppercase mb-4">My Account</h1>
              <p className="text-gray-600 mb-6">Sign in to view your orders and manage your account.</p>

              <Link href="/login">
                <Button className="w-full bg-black text-white h-12 uppercase tracking-widest font-bold mb-4">
                  Sign In / Register
                </Button>
              </Link>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">or</span>
                </div>
              </div>

              {/* 游客查询订单 */}
              <div className="text-left">
                <h3 className="text-sm font-semibold mb-3">Track Your Order</h3>
                <p className="text-xs text-gray-500 mb-3">
                  Enter your email to find orders placed as a guest.
                </p>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGuestOrderSearch()}
                  />
                  <Button
                    onClick={handleGuestOrderSearch}
                    disabled={searchingOrders}
                    variant="outline"
                  >
                    {searchingOrders ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* 游客订单列表 */}
              {orders.length > 0 && (
                <div className="mt-6 text-left">
                  <h3 className="text-sm font-semibold mb-3">Your Orders</h3>
                  <div className="space-y-3">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-gray-200 p-3 rounded">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{order.order_number}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(order.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <div className="flex items-center gap-1">
                            {getStatusIcon(order.status)}
                            <span className="text-xs">{getStatusText(order.status)}</span>
                          </div>
                          <span className="text-sm font-bold">${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
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
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-light tracking-widest uppercase">My Account</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user.full_name || user.email}</p>
            </div>
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 ${
                    activeTab === 'orders' ? 'bg-gray-50 border-l-4 border-black' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5" />
                    <span className="font-medium">Orders</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 border-t ${
                    activeTab === 'addresses' ? 'bg-gray-50 border-l-4 border-black' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5" />
                    <span className="font-medium">Addresses</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 border-t ${
                    activeTab === 'profile' ? 'bg-gray-50 border-l-4 border-black' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5" />
                    <span className="font-medium">Profile</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="bg-white border border-gray-200 p-12 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
              ) : (
                <>
                  {/* Orders Tab */}
                  {activeTab === 'orders' && (
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold">Order History</h2>

                      {orders.length === 0 ? (
                        <div className="bg-white border border-gray-200 p-12 text-center">
                          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
                          <Link href="/">
                            <Button className="bg-black text-white">Start Shopping</Button>
                          </Link>
                        </div>
                      ) : (
                        orders.map((order) => (
                          <div key={order.id} className="bg-white border border-gray-200 p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <div className="flex items-center gap-3">
                                  <span className="font-bold">{order.order_number}</span>
                                  <div className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded text-xs">
                                    {getStatusIcon(order.status)}
                                    <span>{getStatusText(order.status)}</span>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                  {new Date(order.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </p>
                              </div>
                              <span className="text-lg font-bold">${order.total.toFixed(2)}</span>
                            </div>

                            {/* Order Items Preview */}
                            <div className="flex gap-3 overflow-x-auto pb-2">
                              {order.items?.slice(0, 4).map((item, idx) => (
                                <div key={idx} className="flex-shrink-0 w-16 h-20 bg-gray-50 overflow-hidden">
                                  <FallbackImage
                                    src={item.product_image}
                                    alt={item.product_name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                              {order.items?.length > 4 && (
                                <div className="flex-shrink-0 w-16 h-20 bg-gray-100 flex items-center justify-center text-sm text-gray-500">
                                  +{order.items.length - 4}
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* Addresses Tab */}
                  {activeTab === 'addresses' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Saved Addresses</h2>
                        <Button variant="outline" size="sm">Add New Address</Button>
                      </div>

                      <div className="bg-white border border-gray-200 p-12 text-center">
                        <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No saved addresses yet.</p>
                        <p className="text-sm text-gray-400 mt-2">
                          Addresses will be saved when you place an order.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Profile Tab */}
                  {activeTab === 'profile' && (
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold">Profile Information</h2>

                      <div className="bg-white border border-gray-200 p-6">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm text-gray-500 mb-1">Email</label>
                            <p className="font-medium">{user.email}</p>
                          </div>
                          <div>
                            <label className="block text-sm text-gray-500 mb-1">Full Name</label>
                            <p className="font-medium">{user.full_name || 'Not set'}</p>
                          </div>
                        </div>

                        <div className="mt-6 pt-6 border-t">
                          <Button variant="outline" disabled>
                            Edit Profile (Coming Soon)
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
