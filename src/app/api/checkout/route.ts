import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { rateLimit } from '@/lib/ratelimit'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown'
  if (!rateLimit(ip, 5, 60000)) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
  }

  try {
    const body = await req.json()
    const { items, customerEmail, delivery, shippingDetails } = body

    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'gbp',
        product_data: {
          name: item.name,
          ...(item.description && { description: item.description }),
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity || 1,
    }))

    if (delivery && delivery > 0) {
      lineItems.push({
        price_data: {
          currency: 'gbp',
          product_data: { name: 'Delivery' },
          unit_amount: Math.round(delivery * 100),
        },
        quantity: 1,
      })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: customerEmail,
      metadata: {
        fullName: shippingDetails?.fullName || '',
        phone: shippingDetails?.phone || '',
        address: shippingDetails?.address || '',
        city: shippingDetails?.city || '',
        postcode: shippingDetails?.postcode || '',
        notes: shippingDetails?.notes || '',
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}