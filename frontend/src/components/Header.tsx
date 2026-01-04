'use client'

import Link from 'next/link'
import { ShoppingBag, User, Menu, Search, X } from 'lucide-react'
import { FrontendLanguageSwitcher } from '@/components/FrontendLanguageSwitcher'
import { useLanguage } from '@/contexts/LanguageContext'
import { useStore } from '@/lib/store'

export function AnnouncementBar() {
  const { t } = useLanguage()

  return (
    <section className="bg-pink-100 py-2 text-center relative">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center">
          <div className="mr-5 flex">
            <X className="h-3 w-3 text-gray-600 cursor-pointer" />
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="animate-marquee whitespace-nowrap">
              <strong className="text-gray-800">{t.frontend.announcement}</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Header() {
  const { t } = useLanguage()
  const { cart, user } = useStore()
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between min-h-14">
          {/* Left - Menu + Logo */}
          <div className="flex items-center">
            <div className="lg:hidden mr-4">
              <Menu className="h-5 w-5 text-gray-600" />
            </div>
            <Link href="/" className="hidden lg:block">
              <div className="text-2xl font-bold text-pink-200">
                OpenME
              </div>
            </Link>
          </div>

          {/* ... (nav remains same) ... */}

          {/* Right - Icons */}
          <div className="flex items-center space-x-4">
            <FrontendLanguageSwitcher />
            <Search className="h-5 w-5 text-gray-600 cursor-pointer" />
            <div className="relative">
              <Link href="/cart">
                <ShoppingBag className="h-5 w-5 text-gray-600 cursor-pointer" />
                {cartCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                    {cartCount}
                  </div>
                )}
              </Link>
            </div>
            <Link href={user ? "/account" : "/login"}>
              <User className={`h-5 w-5 cursor-pointer ${user ? 'text-black' : 'text-gray-600'}`} />
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
