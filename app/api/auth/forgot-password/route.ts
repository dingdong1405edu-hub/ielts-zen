import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(req: Request) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

  const user = await prisma.user.findUnique({ where: { email } })
  // Always return success to prevent email enumeration
  if (!user) return NextResponse.json({ ok: true })

  // Delete any existing reset tokens for this email
  await prisma.verificationToken.deleteMany({ where: { identifier: `reset:${email}` } })

  const token = crypto.randomBytes(32).toString('hex')
  const expires = new Date(Date.now() + 1000 * 60 * 60) // 1 hour

  await prisma.verificationToken.create({
    data: { identifier: `reset:${email}`, token, expires },
  })

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}&email=${encodeURIComponent(email)}`

  // In production, send via email service (Resend, SendGrid, etc.)
  // For now, log to console in dev
  if (process.env.NODE_ENV === 'development') {
    console.log(`\n🔑 Password reset link for ${email}:\n${resetUrl}\n`)
  }

  return NextResponse.json({ ok: true })
}
