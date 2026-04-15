import { requireAuth } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { GrammarLesson } from '@/components/grammar/grammar-lesson'

export async function generateMetadata({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId, section: 'grammar' } })
  if (!lesson) return { title: 'Not Found' }
  return { title: lesson.title }
}

export default async function GrammarLessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>
}) {
  const session = await requireAuth()
  const { lessonId } = await params

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId, section: 'grammar' },
  })

  if (!lesson) notFound()

  const content = lesson.content as {
    rule: string
    explanation: string
    examples: string[]
    exercises: Array<{
      question: string
      options: string[]
      correct: number
      explanation: string
    }>
  }

  return (
    <GrammarLesson
      lesson={{
        id: lesson.id,
        title: lesson.title,
        content,
        xpReward: lesson.xpReward,
      }}
      userId={session.user.id}
    />
  )
}
