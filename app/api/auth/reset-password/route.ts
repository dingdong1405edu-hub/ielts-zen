import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  const { token, email, password } = await req.json()

  if (!token || !email || !password || password.length < 8) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const record = await prisma.verificationToken.findUnique({
    where: { identifier_token: { identifier: `reset:${email}`, token } },
  })

  if (!record || record.expires < new Date()) {
    return NextResponse.json({ error: 'Link đặt lại đã hết hạn hoặc không hợp lệ' }, { status: 400 })
  }

  const hashed = await bcrypt.hash(password, 12)

  await prisma.$transaction([
    prisma.user.update({ where: { email }, data: { passwordHash: hashed } }),
    prisma.verificationToken.delete({ where: { identifier_token: { identifier: `reset:${email}`, token } } }),
  ])

  return NextResponse.json({ ok: true })
}
