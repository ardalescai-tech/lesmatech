import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, budget, components, total } = body

    if (!name || !email || !budget) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Save order to Supabase
    const { data: order, error } = await getSupabaseAdmin()
      .from('orders')
      .insert({
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        type: 'custom_pc',
        status: 'pending',
        total: total,
        notes: JSON.stringify({ budget, components }),
      })
      .select()
      .single()

    if (error) throw error

    // Send email
    const componentsList = Object.entries(components)
      .map(([cat, comp]: [string, any]) => `<li><strong>${cat}:</strong> ${comp.name} — £${comp.price}</li>`)
      .join('')

    await resend.emails.send({
      from: 'LesmaTech <onboarding@resend.dev>',
      to: 'arda16lescai@gmail.com',
      subject: `New Custom PC Build — ${name}`,
      html: `
        <h2>New Custom PC Build Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Budget Tier:</strong> ${budget}</p>
        <h3>Components:</h3>
        <ul>${componentsList}</ul>
        <p><strong>Total (components):</strong> £${total}</p>
        <p><em>Contact the customer via WhatsApp or email to confirm the build.</em></p>
      `,
    })

    return NextResponse.json({ success: true, orderId: order.id })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}