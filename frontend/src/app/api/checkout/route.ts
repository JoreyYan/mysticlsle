import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

// 懒加载 Stripe 客户端
function getStripeClient() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }
  return new Stripe(key)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, orderId, orderNumber, email, shippingAddress } = body

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items provided' },
        { status: 400 }
      )
    }

    // 构建 Stripe line items
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product_name,
          images: item.product_image ? [item.product_image] : [],
          metadata: {
            product_id: item.product_id,
            variant_id: item.variant_id || '',
          },
        },
        unit_amount: Math.round(item.unit_price * 100), // Stripe 使用最小货币单位（美分）
      },
      quantity: item.quantity,
    }))

    // 获取 Stripe 客户端
    const stripe = getStripeClient()

    // 创建 Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: email,
      metadata: {
        order_id: orderId,
        order_number: orderNumber,
      },
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'CN', 'JP'],
      },
      // 成功和取消 URL
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order=${orderNumber}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5000'}/checkout?cancelled=true`,
      // 自动计算税费（可选）
      // automatic_tax: { enabled: true },
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url
    })

  } catch (error: any) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
