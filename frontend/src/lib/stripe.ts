import { loadStripe, Stripe } from '@stripe/stripe-js'

// Stripe 公钥 (可以安全地暴露在前端)
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''

let stripePromise: Promise<Stripe | null>

export const getStripe = () => {
  if (!stripePromise && stripePublishableKey) {
    stripePromise = loadStripe(stripePublishableKey)
  }
  return stripePromise
}

// 格式化金额为 Stripe 需要的格式（最小货币单位，如美分）
export const formatAmountForStripe = (amount: number, currency: string = 'usd'): number => {
  const numberFormat = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
  })
  const parts = numberFormat.formatToParts(amount)
  let zeroDecimalCurrency = true
  for (const part of parts) {
    if (part.type === 'decimal') {
      zeroDecimalCurrency = false
    }
  }
  return zeroDecimalCurrency ? amount : Math.round(amount * 100)
}

// 格式化 Stripe 金额为显示金额
export const formatAmountFromStripe = (amount: number, currency: string = 'usd'): number => {
  const zeroDecimalCurrencies = ['JPY', 'KRW', 'VND']
  if (zeroDecimalCurrencies.includes(currency.toUpperCase())) {
    return amount
  }
  return amount / 100
}
