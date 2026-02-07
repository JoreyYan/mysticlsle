'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { checkAdminSession, clearAdminSession } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Package, FolderTree, Upload, LogOut, BarChart3, LayoutDashboard } from 'lucide-react'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { useLanguage } from '@/contexts/LanguageContext'

export default function AdminDashboard() {
  const router = useRouter()
  const { t } = useLanguage()
  const [admin, setAdmin] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const session = checkAdminSession()
    if (!session) {
      router.push('/admin/login')
    } else {
      setAdmin(session)
      setLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    clearAdminSession()
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                {t.dashboard.title}
              </h1>
              <p className="text-sm text-gray-600 mt-1">{t.dashboard.welcome}, {admin?.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <Link href="/" target="_blank">
                <Button variant="outline" size="sm">
                  {t.dashboard.viewSite}
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                {t.dashboard.logout}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t.dashboard.stats.totalProducts}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">--</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t.dashboard.stats.categories}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">--</p>
              </div>
              <div className="bg-pink-100 p-3 rounded-lg">
                <FolderTree className="h-6 w-6 text-pink-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t.dashboard.stats.activeProducts}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">--</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t.dashboard.stats.lowStock}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">--</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Package className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Products Management */}
          <Link href="/admin/products/upload">
            <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 cursor-pointer group">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-purple-100 group-hover:bg-purple-200 transition-colors p-3 rounded-lg">
                  <Upload className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{t.dashboard.uploadProducts}</h3>
              </div>
              <p className="text-gray-600 text-sm">
                {t.dashboard.uploadProductsDesc}
              </p>
            </div>
          </Link>

          {/* Products List */}
          <Link href="/admin/products">
            <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 cursor-pointer group">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-pink-100 group-hover:bg-pink-200 transition-colors p-3 rounded-lg">
                  <Package className="h-6 w-6 text-pink-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{t.dashboard.manageProducts}</h3>
              </div>
              <p className="text-gray-600 text-sm">
                {t.dashboard.manageProductsDesc}
              </p>
            </div>
          </Link>

          {/* Categories Management */}
          <Link href="/admin/categories">
            <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 cursor-pointer group">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-orange-100 group-hover:bg-orange-200 transition-colors p-3 rounded-lg">
                  <FolderTree className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{t.dashboard.manageCategories}</h3>
              </div>
              <p className="text-gray-600 text-sm">
                {t.dashboard.manageCategoriesDesc}
              </p>
            </div>
          </Link>

          {/* Homepage Configuration */}
          <Link href="/admin/homepage">
            <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 cursor-pointer group">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-blue-100 group-hover:bg-blue-200 transition-colors p-3 rounded-lg">
                  <LayoutDashboard className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{t.dashboard.homepageConfig || 'Homepage Config'}</h3>
              </div>
              <p className="text-gray-600 text-sm">
                {t.dashboard.homepageConfigDesc || 'Customize banners, sections, and site settings for the homepage.'}
              </p>
            </div>
          </Link>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">{t.dashboard.gettingStarted}</h3>
          <ul className="space-y-2 text-blue-800 text-sm">
            <li>{t.dashboard.step1}</li>
            <li>{t.dashboard.step2}</li>
            <li>{t.dashboard.step3}</li>
            <li>{t.dashboard.step4}</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
