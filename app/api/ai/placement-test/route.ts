import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { analyzePlacementTest } from '@/lib/gemini'
import { addXp } from '@/lib/tokens'
import { z } from 'zod'

const schema = z.object({
  answers: z.record(z.string(), z.string()),
  correct: z.record(z.string(), z.string()),
  duration: z.number(),
  manualBand: z.number().min(4).max(9).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const userId = session.user.id
    const body = schema.parse(await req.json())

    // If user manually chose their band, skip the test analysis
    if (body.manualBand != null) {
      await prisma.user.update({
        where: { id: userId },
        data: { bandScore: body.manualBand, currentBand: body.manualBand },
      })
      return NextResponse.json({ success: true, result: { band: body.manualBand, manual: true } })
    }

    const result = await analyzePlacementTest(body.answers, body.correct)

    await prisma.$transaction([
      prisma.testResult.create({
        data: {
          userId,
          testType: 'placement',
          bandScore: result.band,
          details: result,
          duration: body.duration,
        },
      }),
      prisma.user.update({
        where: { id: userId },
        data: { bandScore: result.band, currentBand: result.band },
      }),
    ])

    await addXp(userId, 20)
    return NextResponse.json({ success: true, result })
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.issues[0].message }, { status: 400 })
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
