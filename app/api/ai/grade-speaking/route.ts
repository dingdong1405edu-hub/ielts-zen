import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { gradeSpeaking } from '@/lib/gemini'
import { transcribeAudio } from '@/lib/deepgram'
import { checkTokens, consumeTokens, addXp } from '@/lib/tokens'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const userId = session.user.id

    const hasTokens = await checkTokens(userId, 1)
    if (!hasTokens) return NextResponse.json({ error: 'Không đủ token. Nâng cấp Premium để tiếp tục.' }, { status: 402 })

    const formData = await req.formData()
    const audio = formData.get('audio') as File | null
    const question = formData.get('question') as string
    const part = parseInt(formData.get('part') as string) || 1
    const questionId = formData.get('questionId') as string

    if (!audio || !question) return NextResponse.json({ error: 'Missing audio or question' }, { status: 400 })

    const buffer = Buffer.from(await audio.arrayBuffer())
    const transcript = await transcribeAudio(buffer, audio.type || 'audio/webm')
    const feedback = await gradeSpeaking(part, question, transcript)

    await consumeTokens(userId, 1)

    await prisma.speakingSubmission.create({
      data: {
        userId,
        part,
        question,
        transcript,
        bandScore: feedback.overall,
        feedback,
        tokensCost: 1,
      },
    })

    await addXp(userId, 15)
    return NextResponse.json({ success: true, transcript, feedback })
  } catch (err) {
    console.error('grade-speaking error:', err)
    return NextResponse.json({ error: 'Đã có lỗi khi chấm bài. Vui lòng thử lại.' }, { status: 500 })
  }
}
