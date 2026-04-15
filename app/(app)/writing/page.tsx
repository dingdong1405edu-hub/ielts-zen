import { requireAuth } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { WritingList } from './writing-list'

export const metadata = { title: 'Writing Practice' }

export default async function WritingPage() {
  await requireAuth()

  const prompts = await prisma.writingPrompt.findMany({
    orderBy: [{ taskType: 'asc' }, { band: 'asc' }],
  })

  const task1 = prompts.filter((p) => p.taskType === 'task1')
  const task2 = prompts.filter((p) => p.taskType === 'task2')

  return <WritingList task1={task1} task2={task2} />
}
