import { requireAuth } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ReadingSplitScreen } from '@/components/reading/reading-split-screen'

export async function generateMetadata({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = await params
  const test = await prisma.readingTest.findUnique({ where: { id: testId } })
  if (!test) return { title: 'Not Found' }
  return { title: test.title }
}

export default async function ReadingTestPage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = await params
  const session = await requireAuth()
  const test = await prisma.readingTest.findUnique({ where: { id: testId } })
  if (!test) notFound()

  const typedTest = {
    id: test.id,
    title: test.title,
    passage: test.passage,
    questions: test.questions as Array<{
      id: string
      type: 'multiple_choice' | 'true_false_ng' | 'short_answer' | 'matching'
      question: string
      options?: string[]
      correct: string | number
      explanation?: string
    }>,
    timeLimit: test.timeLimit,
  }

  return <ReadingSplitScreen test={typedTest} userId={session.user.id} />
}
