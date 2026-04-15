import { notFound } from 'next/navigation'
import { requireAuth } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { SpeakingPractice } from '@/components/speaking/speaking-practice'

export const metadata = { title: 'Speaking Practice' }

export default async function SpeakingTaskPage({
  params,
}: {
  params: Promise<{ taskId: string }>
}) {
  const { taskId } = await params
  const session = await requireAuth()

  const question = await prisma.speakingQuestion.findUnique({
    where: { id: taskId },
  })

  if (!question) notFound()

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <SpeakingPractice question={question} userId={session.user.id} />
    </div>
  )
}
