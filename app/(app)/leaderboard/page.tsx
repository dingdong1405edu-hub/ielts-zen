import { requireAuth } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { LeaderboardClient } from './leaderboard-client'

export const metadata = { title: 'Leaderboard – IELTS ZEN' }

export default async function LeaderboardPage() {
  const session = await requireAuth()
  const userId = session.user.id

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [allTimeUsers, monthlyUsers] = await Promise.all([
    prisma.user.findMany({
      orderBy: { totalXp: 'desc' },
      take: 50,
      select: {
        id: true,
        name: true,
        avatar: true,
        totalXp: true,
        bandScore: true,
        currentBand: true,
        streak: true,
      },
    }),
    prisma.user.findMany({
      where: {
        activities: {
          some: { date: { gte: startOfMonth } },
        },
      },
      orderBy: { totalXp: 'desc' },
      take: 50,
      select: {
        id: true,
        name: true,
        avatar: true,
        totalXp: true,
        bandScore: true,
        currentBand: true,
        streak: true,
      },
    }),
  ])

  return (
    <LeaderboardClient
      allTimeUsers={allTimeUsers}
      monthlyUsers={monthlyUsers}
      currentUserId={userId}
    />
  )
}
