import { requireAuth } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { VocabularyGame } from '@/components/vocabulary/vocabulary-game'

export async function generateMetadata({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId, section: 'vocabulary' } })
  if (!lesson) return { title: 'Not Found' }
  return { title: lesson.title }
}

export default async function VocabularyLessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>
}) {
  const session = await requireAuth()
  const { lessonId } = await params

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId, section: 'vocabulary' },
  })

  if (!lesson) notFound()

  const content = lesson.content as {
    words: Array<{
      word: string
      phonetic: string
      definition: string
      vietnamese: string
      example: string
    }>
  }

  return (
    <VocabularyGame
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
