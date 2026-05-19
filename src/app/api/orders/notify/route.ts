import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const statusMessages: Record<string, string> = {
  pending: 'We have received your order and are reviewing it.',
  parts_ordered: 'Great news! We have ordered all the components for your build.',
  in_assembly: 'Your PC is now being assembled by our team.',
  quality_check: 'Your PC has been assembled and is now going through our quality check.',
  shipped: 'Your order is on its way! We will send you a tracking number shortly.',
  delivered: 'Your order has been delivered. Enjoy your new PC!',
  cancelled: 'Your order has been cancelled. Please contact us if you have any questions.',
}

const statusLabels: Record<string, string> = {
  pending: 'Order Received',
  parts_ordered: 'Parts Ordered',
  in_assembly: 'In Assembly',
  quality_check: 'Quality Check',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

export async function POST(req: NextRequest) {
  try {
    const { orderId, customerEmail, customerName, status, message } = await req.json()

    const statusLabel = statusLabels[status] || status
    const defaultMessage = statusMessages[status] || ''
    const finalMessage = message || defaultMessage

    await resend.emails.send({
      from: 'LesmaTech <onboarding@resend.dev>',
      to: customerEmail,
      subject: `Order Update: ${statusLabel} — LesmaTech`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ffffff; padding: 40px; border-radius: 12px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="background: #2563eb; width: 48px; height: 48px; border-radius: 10px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
              <span style="color: white; font-weight: bold; font-size: 18px;">LT</span>
            </div>
            <h1 style="color: #ffffff; font-size: 24px; margin: 0;">LesmaTech</h1>
          </div>

          <h2 style="color: #ffffff; font-size: 20px; margin-bottom: 8px;">Order Update</h2>
          <p style="color: #a1a1aa; margin-bottom: 24px;">Hi ${customerName}, here's an update on your order.</p>

          <div style="background: #2563eb; border-radius: 8px; padding: 16px; text-align: center; margin-bottom: 24px;">
            <span style="color: #ffffff; font-weight: bold; font-size: 18px;">${statusLabel}</span>
          </div>

          <p style="color: #a1a1aa; line-height: 1.6; margin-bottom: 24px;">${finalMessage}</p>

          <div style="border-top: 1px solid #27272a; padding-top: 24px; text-align: center;">
            <p style="color: #a1a1aa; font-size: 14px;">Questions? Reply to this email or contact us on WhatsApp.</p>
            <p style="color: #a1a1aa; font-size: 12px; margin-top: 16px;">© 2026 LesmaTech. All rights reserved.</p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 })
  }
}