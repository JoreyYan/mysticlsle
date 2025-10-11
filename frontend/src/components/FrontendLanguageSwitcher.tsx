'use client'

import { Globe } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export function FrontendLanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === 'zh' ? 'en' : 'zh')
  }

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
      title={language === 'zh' ? '切换到英文' : 'Switch to Chinese'}
    >
      <Globe className="h-5 w-5" />
      <span className="text-sm font-medium">
        {language === 'zh' ? '中文' : 'EN'}
      </span>
    </button>
  )
}
