import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { addXp } from '@/lib/tokens'
import { z } from 'zod'

const schema = z.object({
  section: z.string(),
  lessonId: z.string(),
  score: z.number().optional(),
  xp: z.number().default(10),
})

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const userId = session.user.id
    const body = schema.parse(await req.json())

    const progress = await prisma.progress.upsert({
      where: { userId_section_lessonId: { userId, section: body.section, lessonId: body.lessonId } },
      create: {
        userId,
        section: body.section,
        lessonId: body.lessonId,
        completed: true,
        score: body.score,
        xp: body.xp,
        completedAt: new Date(),
      },
      update: {
        completed: true,
        score: body.score,
        xp: { increment: body.xp },
        completedAt: new Date(),
      },
    })

    await addXp(userId, body.xp)

    // Track referral first use
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/referral/track`, {
      method: 'POST',
      headers: { Cookie: req.headers.get('cookie') || '' },
    }).catch(() => {}) // Non-blocking

    return NextResponse.json({ success: true, progress })
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.issues[0].message }, { status: 400 })
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const progress = await prisma.progress.findMany({
    where: { userId: session.user.id },
    orderBy: { completedAt: 'desc' },
  })

  return NextResponse.json(progress)
}
