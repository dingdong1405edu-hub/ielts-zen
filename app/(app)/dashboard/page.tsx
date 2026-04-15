import { requireAuth } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { DashboardClient } from './dashboard-client'

export const metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const session = await requireAuth()
  const userId = session.user.id

  const [user, recentTests, activities, leaderboard] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true, bandScore: true, currentBand: true, streak: true,
        totalXp: true, tokens: true, isPremium: true, premiumExpiresAt: true,
        referralCode: true, createdAt: true,
      },
    }),
    prisma.testResult.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.activity.findMany({
      where: {
        userId,
        date: { gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) },
      },
      orderBy: { date: 'asc' },
    }),
    prisma.user.findMany({
      orderBy: { totalXp: 'desc' },
      take: 10,
      select: { id: true, name: true, totalXp: true, bandScore: true, avatar: true },
    }),
  ])

  const progressBySection = await prisma.progress.groupBy({
    by: ['section'],
    where: { userId, completed: true },
    _count: true,
  })

  return (
    <DashboardClient
      user={user}
      userId={userId}
      recentTests={recentTests}
      activities={activities}
      leaderboard={leaderboard}
      progressBySection={progressBySection}
    />
  )
}
