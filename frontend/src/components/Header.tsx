'use client'

import Link from 'next/link'
import { ShoppingBag, User, Menu, Search, X } from 'lucide-react'
import { FrontendLanguageSwitcher } from '@/components/FrontendLanguageSwitcher'
import { useLanguage } from '@/contexts/LanguageContext'
import { useStore } from '@/lib/store'
import { useState } from 'react'

interface AnnouncementBarProps {
  settings?: Record<string, string>
}

export function AnnouncementBar({ settings }: AnnouncementBarProps = {}) {
  const { t, language } = useLanguage()

  // Check if announcement is enabled (default to true if not set)
  const isEnabled = settings?.['announcement_enabled'] !== 'false'
  if (!isEnabled) return null

  // Get announcement text based on language
  const announcementText = language === 'zh'
    ? (settings?.['announcement_text_zh'] || settings?.['announcement_text'] || t.frontend.announcement)
    : (settings?.['announcement_text'] || t.frontend.announcement)

  // Get background color (default to pink-100)
  const bgColor = settings?.['announcement_bg_color'] || '#FCE7F3'

  return (
    <section className="py-2 text-center relative" style={{ backgroundColor: bgColor }}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center">
          <div className="flex-1 overflow-hidden">
            <div className="animate-marquee whitespace-nowrap">
              <strong className="text-gray-800">{announcementText}</strong>
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: '/collections/lingerie', label: t.frontend?.nav?.lingerie || 'Lingerie' },
    { href: '/collections/teddies', label: t.frontend?.nav?.teddies || 'Teddies' },
    { href: '/collections/nightwear', label: t.frontend?.nav?.nightwear || 'Nightwear' },
    { href: '/collections/sales', label: t.frontend?.nav?.sales || 'Sales' },
    { href: '/collections/roleplay', label: t.frontend?.nav?.roleplay || 'RolePlay' },
    { href: '/collections/panties', label: t.frontend?.nav?.panties || 'Panties' },
  ]

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left - Mobile Menu + Logo */}
          <div className="flex items-center">
            <button
              className="lg:hidden mr-4"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-600" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600" />
              )}
            </button>
            <Link href="/" className="text-2xl font-bold text-pink-400 hover:text-pink-500 transition-colors">
              OpenME
            </Link>
          </div>

          {/* Center - Navigation (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-pink-500 font-medium transition-colors text-sm uppercase tracking-wide"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right - Icons */}
          <div className="flex items-center space-x-4">
            <FrontendLanguageSwitcher />
            <Search className="h-5 w-5 text-gray-600 cursor-pointer hover:text-pink-500 transition-colors" />
            <div className="relative">
              <Link href="/cart">
                <ShoppingBag className="h-5 w-5 text-gray-600 cursor-pointer hover:text-pink-500 transition-colors" />
                {cartCount > 0 && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-pink-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                    {cartCount}
                  </div>
                )}
              </Link>
            </div>
            <Link href={user ? "/account" : "/login"}>
              <User className={`h-5 w-5 cursor-pointer hover:text-pink-500 transition-colors ${user ? 'text-pink-500' : 'text-gray-600'}`} />
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-700 hover:text-pink-500 font-medium py-2 text-sm uppercase tracking-wide"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
