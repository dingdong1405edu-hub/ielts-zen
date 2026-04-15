import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Sidebar } from '@/components/layout/sidebar'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { tokens: true, streak: true, totalXp: true, isPremium: true, premiumExpiresAt: true },
  })

  const isPremiumActive = !!(user?.isPremium && user.premiumExpiresAt && user.premiumExpiresAt > new Date())

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        tokens={user?.tokens ?? 30}
        streak={user?.streak ?? 0}
        xp={user?.totalXp ?? 0}
        isPremium={isPremiumActive}
      />
      <main className="flex-1 overflow-y-auto md:pt-0 pt-14">
        {children}
      </main>
    </div>
  )
}
