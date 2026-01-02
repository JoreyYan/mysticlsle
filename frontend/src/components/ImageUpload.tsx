'use client'

import { useState, useId } from 'react'
import { supabase } from '@/lib/supabase'
import { Upload, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/LanguageContext'
import Image from 'next/image'

interface ImageUploadProps {
  onImageUploaded: (url: string) => void
  onRemove?: () => void
  existingUrl?: string
  folder?: string
}

export function ImageUpload({ onImageUploaded, onRemove, existingUrl, folder = 'products' }: ImageUploadProps) {
  const { t } = useLanguage()
  const inputId = useId()
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(existingUrl || null)
  const [error, setError] = useState<string | null>(null)

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setError(null)
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]

      // 验证文件类型
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image')
      }

      // 验证文件大小（最大5MB）
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        throw new Error('Image must be less than 5MB')
      }

      // 生成唯一文件名
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
      const filePath = `${folder}/${fileName}`

      // 上传到 Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        throw uploadError
      }

      // 获取公开URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath)

      setPreview(publicUrl)
      onImageUploaded(publicUrl)
    } catch (error: any) {
      setError(error.message)
      console.error('Error uploading image:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    if (onRemove) {
      onRemove()
    }
  }

  return (
    <div className="space-y-2">
      {preview ? (
        <div className="relative w-full h-48 border-2 border-gray-200 rounded-lg overflow-hidden">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover"
          />
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={uploadImage}
            disabled={uploading}
            className="hidden"
            id={inputId}
          />
          <label
            htmlFor={inputId}
            className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
          >
            {uploading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">{t.productUpload.uploading}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="h-8 w-8 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">{t.productUpload.clickToUpload}</p>
                <p className="text-xs text-gray-400">{t.productUpload.imageFormat}</p>
              </div>
            )}
          </label>
        </div>
      )}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}
