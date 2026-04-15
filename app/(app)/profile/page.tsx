import { requireAuth } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { ProfileClient } from './profile-client'

export const metadata = { title: 'Hồ sơ – IELTS ZEN' }

export default async function ProfilePage() {
  const session = await requireAuth()
  const userId = session.user.id

  const [user, recentTests, wordBank] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bandScore: true,
        currentBand: true,
        streak: true,
        totalXp: true,
        isPremium: true,
        premiumExpiresAt: true,
        createdAt: true,
        _count: {
          select: {
            testResults: true,
            progress: { where: { completed: true } },
          },
        },
      },
    }),
    prisma.testResult.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        testType: true,
        bandScore: true,
        duration: true,
        createdAt: true,
      },
    }),
    prisma.wordBank.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        word: true,
        definition: true,
        nextReview: true,
      },
    }),
  ])

  return (
    <ProfileClient
      user={user}
      recentTests={recentTests}
      wordBank={wordBank}
    />
  )
}
