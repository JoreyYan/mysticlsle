'use client'

import { LanguageProvider } from '@/contexts/LanguageContext'
import { AuthProvider } from '@/components/AuthProvider'
import { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider storageKey="site_language">
      <AuthProvider>
        {children}
      </AuthProvider>
    </LanguageProvider>
  )
}
