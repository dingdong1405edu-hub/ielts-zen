import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { gradeWriting } from '@/lib/gemini'
import { checkTokens, consumeTokens, addXp } from '@/lib/tokens'
import { z } from 'zod'

const schema = z.object({
  taskType: z.enum(['task1', 'task2']),
  prompt: z.string(),
  response: z.string().min(50),
})

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const userId = session.user.id
    const body = schema.parse(await req.json())

    const hasTokens = await checkTokens(userId, 1)
    if (!hasTokens) return NextResponse.json({ error: 'Không đủ token. Nâng cấp Premium để tiếp tục.' }, { status: 402 })

    const feedback = await gradeWriting(body.taskType, body.prompt, body.response)
    await consumeTokens(userId, 1)

    const wordCount = body.response.trim().split(/\s+/).length

    await prisma.writingSubmission.create({
      data: {
        userId,
        taskType: body.taskType,
        prompt: body.prompt,
        response: body.response,
        wordCount,
        bandScore: feedback.overall,
        feedback,
        tokensCost: 1,
      },
    })

    await addXp(userId, 15)
    return NextResponse.json({ success: true, feedback })
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.issues[0].message }, { status: 400 })
    console.error('grade-writing error:', err)
    return NextResponse.json({ error: 'Đã có lỗi khi chấm bài. Vui lòng thử lại.' }, { status: 500 })
  }
}
