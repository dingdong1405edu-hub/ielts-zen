import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { addXp } from '@/lib/tokens'

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { testType, bandScore, details, duration } = await req.json()

  if (!testType || bandScore == null) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const result = await prisma.testResult.create({
    data: {
      userId: session.user.id,
      testType,
      bandScore: parseFloat(bandScore),
      details: details ?? {},
      duration: duration ?? 0,
    },
  })

  await addXp(session.user.id, 10)

  return NextResponse.json({ ok: true, id: result.id })
}
