'use client'

import { useState, useEffect } from 'react'

interface FallbackImageProps {
  src: string
  alt: string
  className?: string
  fallbackSrc?: string
}

export default function FallbackImage({
  src,
  alt,
  className = '',
  fallbackSrc
}: FallbackImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setImgSrc(src)
    setHasError(false)
  }, [src])

  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      if (fallbackSrc) {
        setImgSrc(fallbackSrc)
      } else {
        // Use a default fallback - use URL encoding instead of base64 to support UTF-8
        const width = className.includes('w-full') ? '800' : '400'
        const height = '300'
        // Remove alt text from SVG to avoid encoding issues
        const svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="${width}" height="${height}" fill="#f3f4f6"/>
            <text x="50%" y="50%" font-size="16" fill="#6b7280" text-anchor="middle" dy=".3em">Image</text>
          </svg>`
        setImgSrc(`data:image/svg+xml,${encodeURIComponent(svg)}`)
      }
    }
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
    />
  )
}