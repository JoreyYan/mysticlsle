'use client'

import { useState, useId } from 'react'
import { supabase } from '@/lib/supabase'
import { Upload, X, Loader2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useLanguage } from '@/contexts/LanguageContext'
import Image from 'next/image'

interface ImageUploadProps {
  onImageUploaded: (url: string) => void
  onImagesUploaded?: (urls: string[]) => void // 支持多选回调
  onRemove?: () => void
  existingUrl?: string
  folder?: string
  multiple?: boolean
}

export function ImageUpload({ 
  onImageUploaded, 
  onImagesUploaded,
  onRemove, 
  existingUrl, 
  folder = 'products',
  multiple = false 
}: ImageUploadProps) {
  const { t } = useLanguage()
  const inputId = useId()
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(existingUrl || null)
  const [error, setError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  const uploadImages = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setError(null)
      const files = event.target.files
      if (!files || files.length === 0) return

      setUploading(true)
      setUploadProgress(0)

      const uploadPromises = Array.from(files).map(async (file, index) => {
        // 1. 验证
        if (!file.type.startsWith('image/')) throw new Error(`${file.name} is not an image`)
        if (file.size > 5 * 1024 * 1024) throw new Error(`${file.name} is too large (>5MB)`)

        // 2. 生成路径
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
        const filePath = `${folder}/${fileName}`

        // 3. 上传
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        // 4. 获取 URL
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath)

        return publicUrl
      })

      const urls = await Promise.all(uploadPromises)

      if (multiple && onImagesUploaded) {
        onImagesUploaded(urls)
      } else if (urls.length > 0) {
        setPreview(urls[0])
        onImageUploaded(urls[0])
      }

    } catch (err: any) {
      setError(err.message)
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    if (onRemove) onRemove()
  }

  return (
    <div className="space-y-2">
      {preview ? (
        <div className="relative w-full h-48 border-2 border-gray-200 rounded-lg overflow-hidden group">
          <Image src={preview} alt="Preview" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={handleRemove}
              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg"
              type="button"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={uploadImages}
            disabled={uploading}
            className="hidden"
            id={inputId}
            multiple={multiple}
          />
          <label
            htmlFor={inputId}
            className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-all ${uploading ? 'bg-gray-50' : 'bg-white'}`}
          >
            {uploading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
                <p className="mt-2 text-sm font-medium text-gray-600">{t.productUpload?.uploading || 'Uploading...'}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="p-3 bg-purple-50 rounded-full mb-3 text-purple-500">
                  <Plus className="h-6 w-6" />
                </div>
                <p className="text-sm font-bold text-gray-700">{t.productUpload?.clickToUpload || 'Upload Images'}</p>
                <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">{t.productUpload?.imageFormat || 'PNG, JPG max 5MB'}</p>
                {multiple && <Badge variant="secondary" className="mt-3 bg-purple-100 text-purple-700 hover:bg-purple-100">Supports Bulk Upload</Badge>}
              </div>
            )}
          </label>
        </div>
      )}
      {error && <p className="text-xs text-red-500 bg-red-50 p-2 rounded">{error}</p>}
    </div>
  )
}