import { notFound } from 'next/navigation'
import { requireAuth } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { WritingEditor } from '@/components/writing/writing-editor'

export const metadata = { title: 'Writing Practice' }

export default async function WritingTaskPage({
  params,
}: {
  params: Promise<{ taskId: string }>
}) {
  const { taskId } = await params
  const session = await requireAuth()

  const prompt = await prisma.writingPrompt.findUnique({
    where: { id: taskId },
  })

  if (!prompt) notFound()

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <WritingEditor prompt={prompt} userId={session.user.id} />
    </div>
  )
}
