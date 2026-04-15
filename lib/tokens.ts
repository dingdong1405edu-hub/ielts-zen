import { prisma } from '@/lib/prisma'

export async function checkTokens(userId: string, required = 1): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { tokens: true, isPremium: true, premiumExpiresAt: true },
  })

  if (!user) return false

  const isPremiumActive = user.isPremium && user.premiumExpiresAt && user.premiumExpiresAt > new Date()
  if (isPremiumActive) return true

  return user.tokens >= required
}

export async function consumeTokens(userId: string, amount = 1): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isPremium: true, premiumExpiresAt: true },
  })

  if (!user) throw new Error('User not found')

  const isPremiumActive = user.isPremium && user.premiumExpiresAt && user.premiumExpiresAt > new Date()
  if (isPremiumActive) return // Premium users don't use tokens

  await prisma.user.update({
    where: { id: userId },
    data: { tokens: { decrement: amount } },
  })
}

export async function addXp(userId: string, xp: number): Promise<void> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        totalXp: { increment: xp },
        lastStudiedAt: new Date(),
      },
    }),
    prisma.activity.upsert({
      where: { userId_date: { userId, date: today } },
      create: { userId, date: today, xp, count: 1 },
      update: { xp: { increment: xp }, count: { increment: 1 } },
    }),
  ])
}
