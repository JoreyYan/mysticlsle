'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Language, translations } from '@/lib/i18n'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: typeof translations.en | typeof translations.zh
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children, storageKey = 'site_language' }: { children: ReactNode; storageKey?: string }) {
  const [language, setLang] = useState<Language>('en')

  // 在客户端初始化语言
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(storageKey) as Language
      if (saved) {
        setLang(saved)
      }
    }
  }, [storageKey])

  const setLanguage = (lang: Language) => {
    setLang(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, lang)
    }
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
