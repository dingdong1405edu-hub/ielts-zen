import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { tokens: true, isPremium: true, premiumExpiresAt: true },
  })

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const isPremiumActive = user.isPremium && user.premiumExpiresAt && user.premiumExpiresAt > new Date()

  return NextResponse.json({
    tokens: isPremiumActive ? null : user.tokens,
    isPremium: isPremiumActive,
    unlimited: isPremiumActive,
  })
}
