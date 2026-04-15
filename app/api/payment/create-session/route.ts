import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import Stripe from 'stripe'
import { z } from 'zod'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder')

const plans = {
  monthly: { amount: 300000, days: 30, name: 'IELTS ZEN Premium 1 Tháng' },
  bimonthly: { amount: 540000, days: 60, name: 'IELTS ZEN Premium 2 Tháng' },
  quarterly: { amount: 720000, days: 90, name: 'IELTS ZEN Premium 3 Tháng' },
}

const schema = z.object({ plan: z.enum(['monthly', 'bimonthly', 'quarterly']) })

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { plan } = schema.parse(await req.json())
    const planInfo = plans[plan]
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'vnd',
          product_data: { name: planInfo.name },
          unit_amount: planInfo.amount, // VND is zero-decimal
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${appUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/premium`,
      metadata: { userId: session.user.id, plan, days: String(planInfo.days) },
    })

    return NextResponse.json({ url: stripeSession.url })
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.issues[0].message }, { status: 400 })
    console.error('stripe error:', err)
    return NextResponse.json({ error: 'Payment session creation failed' }, { status: 500 })
  }
}
