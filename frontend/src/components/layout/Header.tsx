import Link from 'next/link'
import { ShoppingBag, User, Menu, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
              MysticIsle
            </span>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/products"
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200"
            >
              All Products
            </Link>
            <Link
              href="/category/the-7-signature"
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200"
            >
              Signature Collection
            </Link>
            <Link
              href="/category/festival-tops"
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200"
            >
              Festival Tops
            </Link>
            <Link
              href="/category/party-bottoms"
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200"
            >
              Party Bottoms
            </Link>
            <Link
              href="/category/led-tech-wear"
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200"
            >
              LED & Tech
            </Link>
          </nav>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>

            {/* Account */}
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <User className="h-5 w-5" />
              <span className="hidden lg:ml-2 lg:inline">Account</span>
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="sm" className="relative">
              <ShoppingBag className="h-5 w-5" />
              <span className="hidden lg:ml-2 lg:inline">Cart</span>
              {/* Cart count badge */}
              <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Button>

            {/* Mobile menu */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200 py-4">
          <nav className="flex flex-col space-y-2">
            <Link
              href="/products"
              className="text-gray-700 hover:text-purple-600 font-medium py-2"
            >
              All Products
            </Link>
            <Link
              href="/category/the-7-signature"
              className="text-gray-700 hover:text-purple-600 font-medium py-2"
            >
              Signature Collection
            </Link>
            <Link
              href="/category/festival-tops"
              className="text-gray-700 hover:text-purple-600 font-medium py-2"
            >
              Festival Tops
            </Link>
            <Link
              href="/category/party-bottoms"
              className="text-gray-700 hover:text-purple-600 font-medium py-2"
            >
              Party Bottoms
            </Link>
            <Link
              href="/category/led-tech-wear"
              className="text-gray-700 hover:text-purple-600 font-medium py-2"
            >
              LED & Tech
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}