'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useStore } from '@/lib/store'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, loadWishlist } = useStore()

  useEffect(() => {
    // 1. 检查当前会话
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          full_name: session.user.user_metadata?.full_name
        })
        loadWishlist()
      }
    }

    checkSession()

    // 2. 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event)

        if (event === 'SIGNED_IN' && session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            full_name: session.user.user_metadata?.full_name
          })
          loadWishlist()
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          // Token 刷新时保持登录状态
          setUser({
            id: session.user.id,
            email: session.user.email,
            full_name: session.user.user_metadata?.full_name
          })
        }
      }
    )

    // 清理订阅
    return () => {
      subscription.unsubscribe()
    }
  }, [setUser, loadWishlist])

  return <>{children}</>
}
