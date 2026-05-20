import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getSupabaseAdmin } from '@/lib/supabase'
import { Resend } from 'resend'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    const customerEmail = session.customer_email || ''
    const customerName = session.customer_details?.name || 'Customer'
    const total = session.amount_total ? session.amount_total / 100 : 0

    // Save order to Supabase
    const { data: order } = await getSupabaseAdmin()
      .from('orders')
      .insert({
        customer_name: customerName,
        customer_email: customerEmail,
        type: 'shop',
        status: 'pending',
        total: total,
        notes: `Stripe session: ${session.id}`,
      })
      .select()
      .single()

    if (order) {
      // Add initial status update
      await getSupabaseAdmin()
        .from('order_status_updates')
        .insert({
          order_id: order.id,
          status: 'pending',
          message: 'Your order has been received and payment confirmed.',
        })

      // Send confirmation email
      await resend.emails.send({
        from: `LesmaTech <${process.env.ADMIN_EMAIL}>`,
        to: customerEmail,
        subject: 'Order Confirmed — LesmaTech',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ffffff; padding: 40px; border-radius: 12px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="background: #2563eb; width: 48px; height: 48px; border-radius: 10px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                <span style="color: white; font-weight: bold; font-size: 18px;">LT</span>
              </div>
              <h1 style="color: #ffffff; font-size: 24px; margin: 0;">LesmaTech</h1>
            </div>

            <h2 style="color: #ffffff; font-size: 20px; margin-bottom: 8px;">Order Confirmed!</h2>
            <p style="color: #a1a1aa; margin-bottom: 24px;">Hi ${customerName}, thank you for your order. We've received your payment of £${total.toFixed(2)}.</p>

            <div style="background: #2563eb; border-radius: 8px; padding: 16px; text-align: center; margin-bottom: 24px;">
              <span style="color: #ffffff; font-weight: bold; font-size: 18px;">Order Received ✓</span>
            </div>

            <p style="color: #a1a1aa; line-height: 1.6; margin-bottom: 24px;">We'll contact you shortly via WhatsApp or email to confirm the details of your order and provide updates.</p>

            <div style="border-top: 1px solid #27272a; padding-top: 24px; text-align: center;">
              <p style="color: #a1a1aa; font-size: 14px;">Track your order at <a href="https://lesmatech.vercel.app/track-order" style="color: #2563eb;">lesmatech.vercel.app/track-order</a></p>
              <p style="color: #a1a1aa; font-size: 12px; margin-top: 16px;">© 2026 LesmaTech. All rights reserved.</p>
            </div>
          </div>
        `,
      })
    }
  }

  return NextResponse.json({ received: true })
}