import { requireAuth } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { PremiumClient } from './premium-client'

export const metadata = { title: 'Premium – IELTS ZEN' }

export default async function PremiumPage() {
  const session = await requireAuth()
  const userId = session.user.id

  const [user, subscriptions] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        isPremium: true,
        premiumExpiresAt: true,
        tokens: true,
      },
    }),
    prisma.subscription.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        plan: true,
        amount: true,
        status: true,
        startsAt: true,
        expiresAt: true,
        createdAt: true,
      },
    }),
  ])

  const isPremiumActive = !!(
    user?.isPremium &&
    user.premiumExpiresAt &&
    new Date(user.premiumExpiresAt) > new Date()
  )

  return (
    <PremiumClient
      isPremiumActive={isPremiumActive}
      premiumExpiresAt={user?.premiumExpiresAt ?? null}
      tokens={user?.tokens ?? 0}
      subscriptions={subscriptions}
    />
  )
}
