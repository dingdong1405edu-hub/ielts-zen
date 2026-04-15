import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  referralCode: z.string().optional().nullable(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, password, referralCode } = schema.parse(body)

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return NextResponse.json({ error: 'Email đã được sử dụng' }, { status: 400 })

    const passwordHash = await bcrypt.hash(password, 12)

    // Find referrer if code provided
    let referrerId: string | null = null
    if (referralCode) {
      const referrer = await prisma.user.findUnique({ where: { referralCode } })
      if (referrer) referrerId = referrer.id
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        referredBy: referrerId,
      },
    })

    // Create referral record
    if (referrerId) {
      await prisma.referral.create({
        data: {
          referrerId,
          refereeEmail: email,
          refereeId: user.id,
        },
      })
    }

    return NextResponse.json({ success: true, userId: user.id })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 400 })
    }
    console.error(err)
    return NextResponse.json({ error: 'Đã có lỗi xảy ra' }, { status: 500 })
  }
}
