import { requireAuth } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { SpeakingList } from './speaking-list'

export const metadata = { title: 'Speaking Practice' }

export default async function SpeakingPage() {
  await requireAuth()

  const questions = await prisma.speakingQuestion.findMany({
    orderBy: [{ part: 'asc' }, { band: 'asc' }],
  })

  const grouped = {
    1: questions.filter((q) => q.part === 1),
    2: questions.filter((q) => q.part === 2),
    3: questions.filter((q) => q.part === 3),
  }

  return <SpeakingList grouped={grouped} />
}
