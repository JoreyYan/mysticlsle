'use client'

import Link from 'next/link'
import { ShoppingBag, User, Menu, Search, X } from 'lucide-react'
import { FrontendLanguageSwitcher } from '@/components/FrontendLanguageSwitcher'
import { useLanguage } from '@/contexts/LanguageContext'

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
                MysticIsle
              </div>
            </Link>
          </div>

          {/* Center - Main Navigation */}
          <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            <Link href="/collections/sets" className="text-gray-700 hover:text-gray-900 font-semibold text-xs xl:text-sm uppercase whitespace-nowrap">
              {t.frontend.nav.sets}
            </Link>
            <Link href="/collections/new" className="text-gray-700 hover:text-gray-900 font-semibold text-xs xl:text-sm uppercase whitespace-nowrap">
              {t.frontend.nav.new}
            </Link>
            <Link href="/collections/limited" className="text-gray-700 hover:text-gray-900 font-semibold text-xs xl:text-sm uppercase whitespace-nowrap">
              {t.frontend.nav.limited}
            </Link>
            <Link href="/collections/halloween" className="text-gray-700 font-semibold text-xs xl:text-sm uppercase cursor-pointer hover:opacity-80 whitespace-nowrap">
              <span className="text-green-500">H</span>
              <span className="text-red-500">A</span>
              <span className="text-blue-500">L</span>
              <span className="text-red-500">L</span>
              <span className="text-yellow-500">O</span>
              <span className="text-green-500">W</span>
              <span className="text-red-500">E</span>
              <span className="text-blue-500">E</span>
              <span className="text-red-500">N</span>
            </Link>
            <Link href="/collections/accessories" className="text-gray-700 hover:text-gray-900 font-semibold text-xs xl:text-sm uppercase whitespace-nowrap">
              {t.frontend.nav.accessories}
            </Link>
            <Link href="/collections/sale" className="text-gray-700 hover:text-gray-900 font-semibold text-xs xl:text-sm uppercase whitespace-nowrap">
              {t.frontend.nav.sale}
            </Link>
            <Link href="/collections/tops" className="text-gray-700 hover:text-gray-900 font-semibold text-xs xl:text-sm uppercase whitespace-nowrap">
              {t.frontend.nav.tops}
            </Link>
            <Link href="/collections/bottoms" className="text-gray-700 hover:text-gray-900 font-semibold text-xs xl:text-sm uppercase whitespace-nowrap">
              {t.frontend.nav.bottoms}
            </Link>
            <Link href="/collections/skirts" className="text-gray-700 hover:text-gray-900 font-semibold text-xs xl:text-sm uppercase whitespace-nowrap">
              {t.frontend.nav.skirts}
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-gray-900 font-semibold text-xs xl:text-sm uppercase whitespace-nowrap">
              {t.frontend.nav.about}
            </Link>
          </nav>

          {/* Mobile Logo */}
          <Link href="/" className="lg:hidden">
            <div className="text-lg font-bold text-pink-200">
              MysticIsle
            </div>
          </Link>

          {/* Right - Icons */}
          <div className="flex items-center space-x-4">
            <FrontendLanguageSwitcher />
            <Search className="h-5 w-5 text-gray-600 cursor-pointer" />
            <div className="relative">
              <ShoppingBag className="h-5 w-5 text-gray-600 cursor-pointer" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-black rounded-full"></div>
            </div>
            <User className="h-5 w-5 text-gray-600 cursor-pointer" />
          </div>
        </div>
      </div>
    </header>
  )
}
