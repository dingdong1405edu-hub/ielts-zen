import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getVocabHint } from '@/lib/groq'
import { checkTokens, consumeTokens } from '@/lib/tokens'
import { z } from 'zod'

const schema = z.object({
  word: z.string().min(1),
  context: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const userId = session.user.id
    const body = schema.parse(await req.json())

    const hasTokens = await checkTokens(userId, 1)
    if (!hasTokens) return NextResponse.json({ error: 'Không đủ token' }, { status: 402 })

    const hint = await getVocabHint(body.word, body.context)
    await consumeTokens(userId, 1)

    return NextResponse.json({ hint })
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.issues[0].message }, { status: 400 })
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
