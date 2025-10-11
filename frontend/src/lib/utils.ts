import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 格式化价格
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

// 计算折扣百分比
export function calculateDiscountPercentage(originalPrice: number, salePrice: number): number {
  return Math.round((1 - salePrice / originalPrice) * 100)
}

// 生成产品 URL
export function getProductUrl(slug: string): string {
  return `/products/${slug}`
}

// 生成分类 URL
export function getCategoryUrl(slug: string): string {
  return `/category/${slug}`
}

// 获取主图片
export function getPrimaryImage(images: any[]): string {
  const primaryImage = images?.find(img => img.is_primary)
  return primaryImage?.image_url || images?.[0]?.image_url || '/placeholder.jpg'
}

// 检查是否有折扣
export function hasDiscount(price: number, salePrice: number | null): boolean {
  return !!(salePrice && salePrice < price)
}

// 计算节省金额
export function getSavingsAmount(price: number, salePrice: number | null): number {
  if (!salePrice || salePrice >= price) return 0
  return price - salePrice
}

// 获取最终价格 (考虑销售价)
export function getFinalPrice(price: number, salePrice: number | null): number {
  return salePrice && salePrice < price ? salePrice : price
}