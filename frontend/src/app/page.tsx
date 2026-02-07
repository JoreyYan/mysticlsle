'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import FallbackImage from '@/components/FallbackImage'
import { AnnouncementBar, Header } from '@/components/Header'
import { ContactSection, Footer } from '@/components/Footer'
import { useLanguage } from '@/contexts/LanguageContext'
import { getPageVisuals, getHomepageSections, getSiteSettings } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'

interface PageVisual {
  section: string
  image_url: string | null
  image_url_mobile: string | null
  alt_text: string | null
  alt_text_zh: string | null
  link_url: string | null
  button1_text: string | null
  button1_text_zh: string | null
  button1_link: string | null
  button2_text: string | null
  button2_text_zh: string | null
  button2_link: string | null
}

interface HomepageSection {
  section_key: string
  title: string | null
  title_zh: string | null
  content: string | null
  content_zh: string | null
  button_text: string | null
  button_text_zh: string | null
  button_link: string | null
  image_url: string | null
  bg_color: string
}

// Main Banner Section
function MainBanner({ banner, language }: { banner?: PageVisual; language: string }) {
  // Fallback to hardcoded values if no data
  const imageUrl = banner?.image_url || '/images/halloween-banner.webp'
  const mobileImageUrl = banner?.image_url_mobile || imageUrl
  const altText = language === 'zh' ? (banner?.alt_text_zh || banner?.alt_text || 'Boo-tiful looks, killer vibes') : (banner?.alt_text || 'Boo-tiful looks, killer vibes')
  const button1Text = language === 'zh' ? (banner?.button1_text_zh || banner?.button1_text) : banner?.button1_text
  const button2Text = language === 'zh' ? (banner?.button2_text_zh || banner?.button2_text) : banner?.button2_text

  return (
    <section className="relative">
      {/* Desktop Banner */}
      <div className="hidden md:block">
        <div className="relative">
          <FallbackImage
            src={imageUrl}
            alt={altText}
            className="w-full h-auto object-cover"
          />
          {(button1Text || button2Text) && (
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="text-center space-x-4">
                {button1Text && (
                  <Link href={banner?.button1_link || '#'}>
                    <Button className="bg-black text-white px-8 py-3 text-sm font-semibold mr-4 mb-4">
                      {button1Text}
                    </Button>
                  </Link>
                )}
                {button2Text && (
                  <Link href={banner?.button2_link || '#'}>
                    <Button className="bg-black text-white px-8 py-3 text-sm font-semibold mb-4">
                      {button2Text}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Banner */}
      <div className="md:hidden">
        <div className="relative">
          <FallbackImage
            src={mobileImageUrl}
            alt={altText}
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    </section>
  )
}

// Secondary Banner
function SecondaryBanner({ banner, language }: { banner?: PageVisual; language: string }) {
  const imageUrl = banner?.image_url || '/images/main-character-banner.png'
  const mobileImageUrl = banner?.image_url_mobile || '/images/main-character-mobile.png'
  const altText = language === 'zh' ? (banner?.alt_text_zh || '只为主角准备') : (banner?.alt_text || 'For main characters only')
  const linkUrl = banner?.link_url || '/collections/sets'

  return (
    <section className="my-8">
      {/* Desktop */}
      <div className="hidden md:block">
        <Link href={linkUrl}>
          <FallbackImage
            src={imageUrl}
            alt={altText}
            className="w-full h-auto object-cover"
          />
        </Link>
      </div>
      {/* Mobile */}
      <div className="md:hidden">
        <Link href={linkUrl}>
          <FallbackImage
            src={mobileImageUrl}
            alt={altText}
            className="w-full h-auto object-cover"
          />
        </Link>
      </div>
    </section>
  )
}

// Dynamic Section Component
function DynamicSection({ section, language }: { section: HomepageSection; language: string }) {
  const title = language === 'zh' ? (section.title_zh || section.title) : section.title
  const content = language === 'zh' ? (section.content_zh || section.content) : section.content
  const buttonText = language === 'zh' ? (section.button_text_zh || section.button_text) : section.button_text

  // Halloween Shop style section (with image on right)
  if (section.section_key === 'halloween_shop') {
    return (
      <section className="py-16" style={{ backgroundColor: section.bg_color }}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Left - Text Content */}
            <div className="lg:w-1/2 text-center lg:text-left">
              <div className="max-w-md mx-auto lg:mx-0">
                {title && (
                  <h3 className="text-2xl lg:text-3xl font-bold mb-6 text-center">
                    {title}
                  </h3>
                )}
                {content && (
                  <div className="text-gray-700 leading-relaxed mb-8 space-y-2">
                    {content.split('\n').map((line, idx) => (
                      <p key={idx}>{line || <br />}</p>
                    ))}
                  </div>
                )}
                {buttonText && section.button_link && (
                  <div className="text-center">
                    <Link href={section.button_link}>
                      <Button className="bg-black text-white px-8 py-3 font-medium">
                        {buttonText}
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Right - Image */}
            {section.image_url && (
              <div className="lg:w-1/2">
                <FallbackImage
                  src={section.image_url}
                  alt={title || ''}
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        </div>
      </section>
    )
  }

  // Legwear style section (centered with link)
  if (section.section_key === 'legwear') {
    return (
      <section className="py-16" style={{ backgroundColor: section.bg_color }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            {title && <h3 className="text-3xl font-bold mb-4">{title}</h3>}
            {buttonText && section.button_link && (
              <Link href={section.button_link} className="text-gray-600 hover:text-gray-900 underline">
                {buttonText}
              </Link>
            )}
          </div>
          {/* Placeholder for slider - would need actual product data */}
          <div className="text-center py-8 text-gray-500">
            <p>Leg wear products carousel would go here</p>
          </div>
        </div>
      </section>
    )
  }

  // Default section layout
  return (
    <section className="py-16" style={{ backgroundColor: section.bg_color }}>
      <div className="container mx-auto px-4">
        <div className="text-center">
          {title && <h3 className="text-3xl font-bold mb-4">{title}</h3>}
          {content && (
            <div className="text-gray-700 leading-relaxed mb-8 max-w-2xl mx-auto">
              {content.split('\n').map((line, idx) => (
                <p key={idx}>{line || <br />}</p>
              ))}
            </div>
          )}
          {buttonText && section.button_link && (
            <Link href={section.button_link}>
              <Button className="bg-black text-white px-8 py-3 font-medium">
                {buttonText}
              </Button>
            </Link>
          )}
          {section.image_url && (
            <div className="mt-8 max-w-lg mx-auto">
              <FallbackImage
                src={section.image_url}
                alt={title || ''}
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// We Ship Global Banner
function GlobalShippingBanner({ banner, language }: { banner?: PageVisual; language: string }) {
  const imageUrl = banner?.image_url || '/images/we-ship-global.png'
  const mobileImageUrl = banner?.image_url_mobile || '/images/we-ship-global-mobile.png'
  const altText = language === 'zh' ? (banner?.alt_text_zh || '全球配送') : (banner?.alt_text || 'We ship global')
  const linkUrl = banner?.link_url || '/collections/sets'

  return (
    <section className="my-8">
      {/* Desktop */}
      <div className="hidden md:block">
        <Link href={linkUrl}>
          <FallbackImage
            src={imageUrl}
            alt={altText}
            className="w-full h-auto object-cover"
          />
        </Link>
      </div>
      {/* Mobile */}
      <div className="md:hidden">
        <Link href={linkUrl}>
          <FallbackImage
            src={mobileImageUrl}
            alt={altText}
            className="w-full h-auto object-cover"
          />
        </Link>
      </div>
    </section>
  )
}

export default function HomePage() {
  const { language } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [banners, setBanners] = useState<Record<string, PageVisual>>({})
  const [sections, setSections] = useState<HomepageSection[]>([])
  const [settings, setSettings] = useState<Record<string, string>>({})

  useEffect(() => {
    loadHomepageData()
  }, [])

  const loadHomepageData = async () => {
    try {
      const [visualsData, sectionsData, settingsData] = await Promise.all([
        getPageVisuals('homepage'),
        getHomepageSections(),
        getSiteSettings()
      ])

      // Convert visuals array to object keyed by section
      const bannersObj: Record<string, PageVisual> = {}
      visualsData.forEach((v: any) => {
        bannersObj[v.section] = v
      })
      setBanners(bannersObj)
      setSections(sectionsData || [])
      setSettings(settingsData || {})
    } catch (error) {
      console.error('Error loading homepage data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Show minimal loading state - content will render with fallbacks
  if (loading) {
    return (
      <>
        <AnnouncementBar />
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <AnnouncementBar settings={settings} />
      <Header />
      <MainBanner banner={banners['main_banner']} language={language} />
      <SecondaryBanner banner={banners['secondary_banner']} language={language} />

      {/* Dynamic Sections */}
      {sections.map((section) => (
        <DynamicSection key={section.section_key} section={section} language={language} />
      ))}

      <GlobalShippingBanner banner={banners['shipping_banner']} language={language} />
      <ContactSection settings={settings} />
      <Footer settings={settings} />
    </>
  )
}
