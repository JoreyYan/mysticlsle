import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from './supabase'

interface UserProfile {
  id: string
  email?: string
  full_name?: string
  avatar_url?: string
}

interface CartItem {
  id?: string // Supabase 中的 ID
  tempId: string // 本地唯一 ID
  product_id: string
  variant_id?: number
  top_variant_id?: number
  bottom_variant_id?: number
  quantity: number
  product_data?: any // 缓存的产品信息用于展示
}

interface AppState {
  // Auth
  user: UserProfile | null
  setUser: (user: UserProfile | null) => void
  
  // Cart
  cart: CartItem[]
  addToCart: (item: Omit<CartItem, 'tempId'>) => void
  removeFromCart: (tempId: string) => void
  updateQuantity: (tempId: string, quantity: number) => void
  clearCart: () => void
  syncCart: () => Promise<void>

  // Wishlist
  wishlist: string[] // product_ids
  toggleWishlist: (productId: string) => Promise<void>
  loadWishlist: () => Promise<void>
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),

      cart: [],
      addToCart: (newItem) => {
        const cart = get().cart
        const tempId = `${newItem.product_id}-${newItem.variant_id || ''}-${newItem.top_variant_id || ''}-${newItem.bottom_variant_id || ''}`
        
        const existingItemIndex = cart.findIndex(item => item.tempId === tempId)
        
        if (existingItemIndex > -1) {
          const updatedCart = [...cart]
          updatedCart[existingItemIndex].quantity += newItem.quantity
          set({ cart: updatedCart })
        } else {
          set({ cart: [...cart, { ...newItem, tempId }] })
        }
        
        // 如果已登录，同步到数据库 (逻辑稍后完善)
        get().syncCart()
      },

      removeFromCart: (tempId) => {
        set({ cart: get().cart.filter(item => item.tempId !== tempId) })
        get().syncCart()
      },

      updateQuantity: (tempId, quantity) => {
        if (quantity < 1) return
        set({
          cart: get().cart.map(item => 
            item.tempId === tempId ? { ...item, quantity } : item
          )
        })
        get().syncCart()
      },

      clearCart: () => set({ cart: [] }),

      syncCart: async () => {
        const { user, cart } = get()
        if (!user) return

        // 简化的同步逻辑：实际项目中建议在加购时直接调用 API
        // 这里可以实现将本地 cart 合并到 Supabase cart_items 的逻辑
      },

      wishlist: [],
      loadWishlist: async () => {
        const { user } = get()
        if (!user) return
        const { data } = await supabase.from('wishlists').select('product_id').eq('user_id', user.id)
        if (data) set({ wishlist: data.map(w => w.product_id) })
      },

      toggleWishlist: async (productId) => {
        const { user, wishlist } = get()
        if (!user) {
          alert('Please login to use wishlist')
          return
        }

        const isIncluded = wishlist.includes(productId)
        if (isIncluded) {
          await supabase.from('wishlists').delete().eq('user_id', user.id).eq('product_id', productId)
          set({ wishlist: wishlist.filter(id => id !== productId) })
        } else {
          await supabase.from('wishlists').insert({ user_id: user.id, product_id: productId })
          set({ wishlist: [...wishlist, productId] })
        }
      }
    }),
    {
      name: 'openme-storage',
      partialize: (state) => ({ cart: state.cart, wishlist: state.wishlist }), // 只持久化购物车和心愿单
    }
  )
)
