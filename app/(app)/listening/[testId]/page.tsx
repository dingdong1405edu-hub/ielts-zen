import { requireAuth } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ListeningTestClient } from '@/components/listening/listening-test'

export async function generateMetadata({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = await params
  const test = await prisma.listeningTest.findUnique({ where: { id: testId } })
  if (!test) return { title: 'Not Found' }
  return { title: test.title }
}

export default async function ListeningTestPage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = await params
  const session = await requireAuth()
  const test = await prisma.listeningTest.findUnique({ where: { id: testId } })
  if (!test) notFound()

  const typedTest = {
    id: test.id,
    title: test.title,
    audioUrl: test.audioUrl,
    questions: test.questions as Array<{
      id: string
      type: 'multiple_choice' | 'short_answer' | 'matching' | 'true_false_ng'
      question: string
      options?: string[]
      correct: string | number
      explanation?: string
    }>,
    timeLimit: test.timeLimit,
  }

  return <ListeningTestClient test={typedTest} userId={session.user.id} />
}
