import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const userId = session.user.id

    // Mark the referral as firstUsed for this user
    const referral = await prisma.referral.findFirst({
      where: { refereeId: userId, firstUsed: false },
    })

    if (!referral) return NextResponse.json({ message: 'No pending referral' })

    await prisma.referral.update({
      where: { id: referral.id },
      data: { firstUsed: true },
    })

    // Check if referrer now has 5+ completed referrals
    const completedCount = await prisma.referral.count({
      where: { referrerId: referral.referrerId, firstUsed: true },
    })

    if (completedCount >= 5) {
      // Check if reward already given for this batch
      const alreadyRewarded = await prisma.referral.count({
        where: { referrerId: referral.referrerId, rewardGiven: true },
      })

      if (alreadyRewarded === 0) {
        // Grant 15 days premium
        const expiresAt = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
        await prisma.$transaction([
          prisma.user.update({
            where: { id: referral.referrerId },
            data: { isPremium: true, premiumExpiresAt: expiresAt },
          }),
          prisma.referral.updateMany({
            where: { referrerId: referral.referrerId },
            data: { rewardGiven: true },
          }),
        ])
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
