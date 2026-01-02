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
                OpenME
              </div>
            </Link>
          </div>

          {/* Center - Main Navigation */}
          <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            <Link href="/collections/lingerie" className="text-gray-700 hover:text-gray-900 font-semibold text-xs xl:text-sm uppercase whitespace-nowrap">
              {t.frontend.nav.lingerie}
            </Link>
            <Link href="/collections/teddies" className="text-gray-700 hover:text-gray-900 font-semibold text-xs xl:text-sm uppercase whitespace-nowrap">
              {t.frontend.nav.teddies}
            </Link>
            <Link href="/collections/nightwear" className="text-gray-700 hover:text-gray-900 font-semibold text-xs xl:text-sm uppercase whitespace-nowrap">
              {t.frontend.nav.nightwear}
            </Link>
            <Link href="/collections/sale" className="text-gray-700 hover:text-gray-900 font-semibold text-xs xl:text-sm uppercase whitespace-nowrap">
              {t.frontend.nav.sales}
            </Link>
            <Link href="/collections/roleplay" className="text-gray-700 hover:text-gray-900 font-semibold text-xs xl:text-sm uppercase whitespace-nowrap">
              {t.frontend.nav.roleplay}
            </Link>
            <Link href="/collections/panties" className="text-gray-700 hover:text-gray-900 font-semibold text-xs xl:text-sm uppercase whitespace-nowrap">
              {t.frontend.nav.panties}
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-gray-900 font-semibold text-xs xl:text-sm uppercase whitespace-nowrap">
              {t.frontend.nav.about}
            </Link>
          </nav>

          {/* Mobile Logo */}
          <Link href="/" className="lg:hidden">
            <div className="text-lg font-bold text-pink-200">
              OpenME
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
