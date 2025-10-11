import { LanguageProvider } from '@/contexts/LanguageContext'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <LanguageProvider>{children}</LanguageProvider>
}
