'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Save, Plus, Edit, Trash2, Loader2, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLanguage } from '@/contexts/LanguageContext'
import { ImageUpload } from '@/components/ImageUpload'
import {
  checkAdminSession,
  supabase,
  getSiteSettings,
  updateSiteSettings,
  getPageVisuals,
  updatePageVisual,
  getAllHomepageSections,
  updateHomepageSection,
  createHomepageSection,
  deleteHomepageSection
} from '@/lib/supabase'

type TabType = 'banners' | 'sections' | 'settings'

interface PageVisual {
  id?: string
  page_name: string
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
  position: number
  is_active: boolean
}

interface HomepageSection {
  id?: string
  section_key: string
  title: string | null
  title_zh: string | null
  subtitle: string | null
  subtitle_zh: string | null
  content: string | null
  content_zh: string | null
  button_text: string | null
  button_text_zh: string | null
  button_link: string | null
  image_url: string | null
  bg_color: string
  text_color: string
  sort_order: number
  is_active: boolean
}

export default function HomepageConfigPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState<TabType>('banners')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Banners state
  const [banners, setBanners] = useState<Record<string, PageVisual>>({})

  // Sections state
  const [sections, setSections] = useState<HomepageSection[]>([])
  const [editingSection, setEditingSection] = useState<HomepageSection | null>(null)
  const [showSectionForm, setShowSectionForm] = useState(false)

  // Settings state
  const [settings, setSettings] = useState<Record<string, string>>({})

  useEffect(() => {
    const session = checkAdminSession()
    if (!session) {
      router.push('/admin/login')
      return
    }
    loadData()
  }, [router])

  const loadData = async () => {
    setLoading(true)
    try {
      // Load all data in parallel
      const [visualsData, sectionsData, settingsData] = await Promise.all([
        getPageVisuals('homepage'),
        getAllHomepageSections(),
        getSiteSettings()
      ])

      // Convert visuals array to object keyed by section
      const bannersObj: Record<string, PageVisual> = {}
      visualsData.forEach((v: any) => {
        bannersObj[v.section] = v
      })

      // Initialize default banners if not exist
      const defaultBanners = ['main_banner', 'secondary_banner', 'shipping_banner']
      defaultBanners.forEach((section, idx) => {
        if (!bannersObj[section]) {
          bannersObj[section] = {
            page_name: 'homepage',
            section,
            image_url: null,
            image_url_mobile: null,
            alt_text: null,
            alt_text_zh: null,
            link_url: null,
            button1_text: null,
            button1_text_zh: null,
            button1_link: null,
            button2_text: null,
            button2_text_zh: null,
            button2_link: null,
            position: idx + 1,
            is_active: true
          }
        }
      })

      setBanners(bannersObj)
      setSections(sectionsData || [])
      setSettings(settingsData || {})
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Banner handlers
  const updateBanner = (section: string, field: string, value: any) => {
    setBanners(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const saveBanners = async () => {
    setSaving(true)
    try {
      for (const [section, banner] of Object.entries(banners)) {
        await updatePageVisual('homepage', section, banner)
      }
      alert(t.homepage?.saveSuccess || 'Saved successfully!')
    } catch (error: any) {
      alert((t.homepage?.saveError || 'Save failed: ') + error.message)
    } finally {
      setSaving(false)
    }
  }

  // Section handlers
  const handleEditSection = (section: HomepageSection) => {
    setEditingSection({ ...section })
    setShowSectionForm(true)
  }

  const handleNewSection = () => {
    setEditingSection({
      section_key: '',
      title: '',
      title_zh: '',
      subtitle: '',
      subtitle_zh: '',
      content: '',
      content_zh: '',
      button_text: '',
      button_text_zh: '',
      button_link: '',
      image_url: '',
      bg_color: '#FFFFFF',
      text_color: '#000000',
      sort_order: sections.length,
      is_active: true
    })
    setShowSectionForm(true)
  }

  const saveSection = async () => {
    if (!editingSection) return
    setSaving(true)
    try {
      if (editingSection.id) {
        await updateHomepageSection(editingSection.section_key, editingSection)
      } else {
        await createHomepageSection(editingSection)
      }
      await loadData()
      setShowSectionForm(false)
      setEditingSection(null)
      alert(t.homepage?.saveSuccess || 'Saved successfully!')
    } catch (error: any) {
      alert((t.homepage?.saveError || 'Save failed: ') + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteSection = async (sectionKey: string) => {
    if (!confirm(t.homepage?.sections?.deleteConfirm || 'Are you sure you want to delete this section?')) return
    try {
      await deleteHomepageSection(sectionKey)
      await loadData()
    } catch (error: any) {
      alert((t.homepage?.saveError || 'Delete failed: ') + error.message)
    }
  }

  // Settings handlers
  const updateSetting = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      await updateSiteSettings(settings)
      alert(t.homepage?.saveSuccess || 'Saved successfully!')
    } catch (error: any) {
      alert((t.homepage?.saveError || 'Save failed: ') + error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link href="/admin/dashboard">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t.homepage?.backToDashboard || 'Back to Dashboard'}
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{t.homepage?.title || 'Homepage Configuration'}</h1>
          <p className="text-gray-600 mt-2">{t.homepage?.subtitle || 'Manage homepage banners, sections, and settings'}</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6 w-fit">
          {(['banners', 'sections', 'settings'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t.homepage?.tabs?.[tab] || tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Banners Tab */}
        {activeTab === 'banners' && (
          <div className="space-y-6">
            {/* Main Banner */}
            <BannerEditor
              title={t.homepage?.banners?.mainBanner || 'Main Banner'}
              banner={banners['main_banner']}
              onChange={(field, value) => updateBanner('main_banner', field, value)}
              showButtons={true}
              t={t}
            />

            {/* Secondary Banner */}
            <BannerEditor
              title={t.homepage?.banners?.secondaryBanner || 'Secondary Banner'}
              banner={banners['secondary_banner']}
              onChange={(field, value) => updateBanner('secondary_banner', field, value)}
              showButtons={false}
              t={t}
            />

            {/* Shipping Banner */}
            <BannerEditor
              title={t.homepage?.banners?.shippingBanner || 'Shipping Banner'}
              banner={banners['shipping_banner']}
              onChange={(field, value) => updateBanner('shipping_banner', field, value)}
              showButtons={false}
              t={t}
            />

            <div className="flex justify-end">
              <Button
                onClick={saveBanners}
                disabled={saving}
                className="bg-gradient-to-r from-purple-600 to-pink-600"
              >
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                {saving ? (t.homepage?.saving || 'Saving...') : (t.homepage?.saveChanges || 'Save Changes')}
              </Button>
            </div>
          </div>
        )}

        {/* Sections Tab */}
        {activeTab === 'sections' && (
          <div className="space-y-6">
            {!showSectionForm ? (
              <>
                <div className="flex justify-end">
                  <Button onClick={handleNewSection} className="bg-gradient-to-r from-purple-600 to-pink-600">
                    <Plus className="h-4 w-4 mr-2" />
                    {t.homepage?.sections?.addSection || 'Add Section'}
                  </Button>
                </div>

                {sections.length === 0 ? (
                  <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                    {t.homepage?.sections?.noSections || 'No sections yet. Click to add a new section.'}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sections.map((section) => (
                      <div key={section.section_key} className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <h3 className="text-lg font-semibold">{section.title || section.section_key}</h3>
                              <span className={`px-2 py-0.5 text-xs rounded-full ${
                                section.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                              }`}>
                                {section.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">Key: {section.section_key}</p>
                            {section.title_zh && <p className="text-sm text-gray-600 mt-1">{section.title_zh}</p>}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEditSection(section)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteSection(section.section_key)} className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <SectionEditor
                section={editingSection!}
                onChange={(field, value) => setEditingSection(prev => prev ? { ...prev, [field]: value } : null)}
                onSave={saveSection}
                onCancel={() => { setShowSectionForm(false); setEditingSection(null) }}
                saving={saving}
                t={t}
              />
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Announcement Settings */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">{t.homepage?.settings?.announcement || 'Announcement Bar'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.homepage?.settings?.announcementText || 'Announcement Text (English)'}
                  </label>
                  <Input
                    value={settings['announcement_text'] || ''}
                    onChange={(e) => updateSetting('announcement_text', e.target.value)}
                    placeholder="KLARNA AND AFTERPAY AVAILABLE"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.homepage?.settings?.announcementTextZh || 'Announcement Text (Chinese)'}
                  </label>
                  <Input
                    value={settings['announcement_text_zh'] || ''}
                    onChange={(e) => updateSetting('announcement_text_zh', e.target.value)}
                    placeholder="KLARNA 和 AFTERPAY 可用"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.homepage?.settings?.announcementBgColor || 'Background Color'}
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={settings['announcement_bg_color'] || '#FCE7F3'}
                      onChange={(e) => updateSetting('announcement_bg_color', e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={settings['announcement_bg_color'] || '#FCE7F3'}
                      onChange={(e) => updateSetting('announcement_bg_color', e.target.value)}
                      placeholder="#FCE7F3"
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings['announcement_enabled'] === 'true'}
                    onChange={(e) => updateSetting('announcement_enabled', e.target.checked ? 'true' : 'false')}
                    className="mr-2"
                    id="announcement_enabled"
                  />
                  <label htmlFor="announcement_enabled" className="text-sm text-gray-700">
                    {t.homepage?.settings?.announcementEnabled || 'Show Announcement Bar'}
                  </label>
                </div>
              </div>
            </div>

            {/* Contact Settings */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">{t.homepage?.settings?.contact || 'Contact Information'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.homepage?.settings?.contactEmail || 'Contact Email'}
                  </label>
                  <Input
                    type="email"
                    value={settings['contact_email'] || ''}
                    onChange={(e) => updateSetting('contact_email', e.target.value)}
                    placeholder="help@openme.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.homepage?.settings?.responseTime || 'Response Time (hours)'}
                  </label>
                  <Input
                    type="number"
                    value={settings['contact_response_time'] || '24'}
                    onChange={(e) => updateSetting('contact_response_time', e.target.value)}
                    placeholder="24"
                  />
                </div>
              </div>
            </div>

            {/* Social Media Settings */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">{t.homepage?.settings?.social || 'Social Media'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.homepage?.settings?.instagramUrl || 'Instagram URL'}
                  </label>
                  <Input
                    value={settings['instagram_url'] || ''}
                    onChange={(e) => updateSetting('instagram_url', e.target.value)}
                    placeholder="https://www.instagram.com/openme/"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.homepage?.settings?.tiktokUrl || 'TikTok URL'}
                  </label>
                  <Input
                    value={settings['tiktok_url'] || ''}
                    onChange={(e) => updateSetting('tiktok_url', e.target.value)}
                    placeholder="https://www.tiktok.com/@openme"
                  />
                </div>
              </div>
            </div>

            {/* Footer Settings */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">{t.homepage?.settings?.footer || 'Footer'}</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.homepage?.settings?.footerCopyright || 'Copyright Text'}
                </label>
                <Input
                  value={settings['footer_copyright'] || ''}
                  onChange={(e) => updateSetting('footer_copyright', e.target.value)}
                  placeholder="Copyright © 2025 OpenME Inc."
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={saveSettings}
                disabled={saving}
                className="bg-gradient-to-r from-purple-600 to-pink-600"
              >
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                {saving ? (t.homepage?.saving || 'Saving...') : (t.homepage?.saveChanges || 'Save Changes')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Banner Editor Component
function BannerEditor({
  title,
  banner,
  onChange,
  showButtons,
  t
}: {
  title: string
  banner: PageVisual
  onChange: (field: string, value: any) => void
  showButtons: boolean
  t: any
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Desktop Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.homepage?.banners?.desktopImage || 'Desktop Image'}
          </label>
          {banner.image_url ? (
            <div className="relative aspect-video border rounded-lg overflow-hidden group">
              <Image src={banner.image_url} alt={banner.alt_text || ''} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onChange('image_url', null)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <ImageUpload
              folder="banners"
              onImageUploaded={(url) => onChange('image_url', url)}
            />
          )}
        </div>

        {/* Mobile Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.homepage?.banners?.mobileImage || 'Mobile Image'}
          </label>
          {banner.image_url_mobile ? (
            <div className="relative aspect-video border rounded-lg overflow-hidden group">
              <Image src={banner.image_url_mobile} alt={banner.alt_text || ''} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onChange('image_url_mobile', null)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <ImageUpload
              folder="banners"
              onImageUploaded={(url) => onChange('image_url_mobile', url)}
            />
          )}
        </div>
      </div>

      {/* Alt Text & Link */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.homepage?.banners?.altText || 'Alt Text'} ({t.homepage?.english || 'English'})
          </label>
          <Input
            value={banner.alt_text || ''}
            onChange={(e) => onChange('alt_text', e.target.value)}
            placeholder={t.homepage?.banners?.altTextPlaceholder || 'Describe the image...'}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.homepage?.banners?.altText || 'Alt Text'} ({t.homepage?.chinese || 'Chinese'})
          </label>
          <Input
            value={banner.alt_text_zh || ''}
            onChange={(e) => onChange('alt_text_zh', e.target.value)}
            placeholder="描述图片内容..."
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.homepage?.banners?.linkUrl || 'Link URL'}
          </label>
          <Input
            value={banner.link_url || ''}
            onChange={(e) => onChange('link_url', e.target.value)}
            placeholder={t.homepage?.banners?.linkUrlPlaceholder || '/collections/halloween'}
          />
        </div>
      </div>

      {/* Buttons (for main banner) */}
      {showButtons && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 pt-4 border-t">
          {/* Button 1 */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">{t.homepage?.banners?.button1 || 'Button 1'}</h4>
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={banner.button1_text || ''}
                onChange={(e) => onChange('button1_text', e.target.value)}
                placeholder={t.homepage?.banners?.buttonTextPlaceholder || 'e.g., Shop Now'}
              />
              <Input
                value={banner.button1_text_zh || ''}
                onChange={(e) => onChange('button1_text_zh', e.target.value)}
                placeholder="中文"
              />
            </div>
            <Input
              value={banner.button1_link || ''}
              onChange={(e) => onChange('button1_link', e.target.value)}
              placeholder={t.homepage?.banners?.buttonLinkPlaceholder || '/collections/...'}
            />
          </div>

          {/* Button 2 */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">{t.homepage?.banners?.button2 || 'Button 2'}</h4>
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={banner.button2_text || ''}
                onChange={(e) => onChange('button2_text', e.target.value)}
                placeholder={t.homepage?.banners?.buttonTextPlaceholder || 'e.g., Shop Now'}
              />
              <Input
                value={banner.button2_text_zh || ''}
                onChange={(e) => onChange('button2_text_zh', e.target.value)}
                placeholder="中文"
              />
            </div>
            <Input
              value={banner.button2_link || ''}
              onChange={(e) => onChange('button2_link', e.target.value)}
              placeholder={t.homepage?.banners?.buttonLinkPlaceholder || '/collections/...'}
            />
          </div>
        </div>
      )}
    </div>
  )
}

// Section Editor Component
function SectionEditor({
  section,
  onChange,
  onSave,
  onCancel,
  saving,
  t
}: {
  section: HomepageSection
  onChange: (field: string, value: any) => void
  onSave: () => void
  onCancel: () => void
  saving: boolean
  t: any
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">
        {section.id ? (t.homepage?.sections?.editSection || 'Edit Section') : (t.homepage?.sections?.addSection || 'Add Section')}
      </h3>

      <div className="space-y-4">
        {/* Section Key */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.homepage?.sections?.sectionKey || 'Section Key'} *
          </label>
          <Input
            value={section.section_key}
            onChange={(e) => onChange('section_key', e.target.value)}
            placeholder={t.homepage?.sections?.sectionKeyPlaceholder || 'e.g., halloween_shop'}
            disabled={!!section.id}
          />
        </div>

        {/* Title */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.homepage?.sections?.title || 'Title'} ({t.homepage?.english || 'English'})
            </label>
            <Input
              value={section.title || ''}
              onChange={(e) => onChange('title', e.target.value)}
              placeholder={t.homepage?.sections?.titlePlaceholder || 'Section title'}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.homepage?.sections?.titleZh || 'Title (Chinese)'}
            </label>
            <Input
              value={section.title_zh || ''}
              onChange={(e) => onChange('title_zh', e.target.value)}
              placeholder="区块标题"
            />
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.homepage?.sections?.content || 'Content'} ({t.homepage?.english || 'English'})
            </label>
            <textarea
              value={section.content || ''}
              onChange={(e) => onChange('content', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={5}
              placeholder={t.homepage?.sections?.contentPlaceholder || 'Section content/poem...'}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.homepage?.sections?.contentZh || 'Content (Chinese)'}
            </label>
            <textarea
              value={section.content_zh || ''}
              onChange={(e) => onChange('content_zh', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={5}
              placeholder="区块内容..."
            />
          </div>
        </div>

        {/* Button */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.homepage?.sections?.buttonText || 'Button Text'}
            </label>
            <Input
              value={section.button_text || ''}
              onChange={(e) => onChange('button_text', e.target.value)}
              placeholder="SHOP NOW"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.homepage?.sections?.buttonTextZh || 'Button Text (Chinese)'}
            </label>
            <Input
              value={section.button_text_zh || ''}
              onChange={(e) => onChange('button_text_zh', e.target.value)}
              placeholder="立即购买"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.homepage?.sections?.buttonLink || 'Button Link'}
            </label>
            <Input
              value={section.button_link || ''}
              onChange={(e) => onChange('button_link', e.target.value)}
              placeholder="/collections/..."
            />
          </div>
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.homepage?.sections?.imageUrl || 'Image'}
          </label>
          {section.image_url ? (
            <div className="relative w-64 h-48 border rounded-lg overflow-hidden group">
              <Image src={section.image_url} alt={section.title || ''} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button variant="secondary" size="sm" onClick={() => onChange('image_url', null)}>
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <div className="w-64">
              <ImageUpload
                folder="sections"
                onImageUploaded={(url) => onChange('image_url', url)}
              />
            </div>
          )}
        </div>

        {/* Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.homepage?.sections?.bgColor || 'Background Color'}
            </label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={section.bg_color || '#FFFFFF'}
                onChange={(e) => onChange('bg_color', e.target.value)}
                className="w-16 h-10 p-1"
              />
              <Input
                value={section.bg_color || '#FFFFFF'}
                onChange={(e) => onChange('bg_color', e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.homepage?.sections?.sortOrder || 'Sort Order'}
            </label>
            <Input
              type="number"
              value={section.sort_order}
              onChange={(e) => onChange('sort_order', parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="flex items-center pt-8">
            <input
              type="checkbox"
              checked={section.is_active}
              onChange={(e) => onChange('is_active', e.target.checked)}
              className="mr-2"
              id="section_active"
            />
            <label htmlFor="section_active" className="text-sm text-gray-700">
              {t.homepage?.sections?.isActive || 'Active'}
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t">
          <Button onClick={onSave} disabled={saving} className="bg-purple-600 hover:bg-purple-700">
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            {saving ? (t.homepage?.saving || 'Saving...') : (t.homepage?.saveChanges || 'Save')}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            {t.cancel || 'Cancel'}
          </Button>
        </div>
      </div>
    </div>
  )
}
