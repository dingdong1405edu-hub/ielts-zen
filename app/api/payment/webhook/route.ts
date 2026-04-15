import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder')

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature') || ''

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder')
  } catch (err) {
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const { userId, plan, days } = session.metadata || {}

    if (!userId || !days) return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })

    const daysNum = parseInt(days)
    const expiresAt = new Date(Date.now() + daysNum * 24 * 60 * 60 * 1000)

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { isPremium: true, premiumExpiresAt: expiresAt, tokens: 9999 },
      }),
      prisma.subscription.create({
        data: {
          userId,
          plan: plan || 'monthly',
          amount: session.amount_total || 0,
          stripeId: session.id,
          status: 'active',
          expiresAt,
        },
      }),
    ])
  }

  return NextResponse.json({ received: true })
}
