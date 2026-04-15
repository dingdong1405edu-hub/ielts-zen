import { requireAuth } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { formatBand, bandToColor } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { GraduationCap, CheckCircle2, Zap, BookOpenCheck } from 'lucide-react'

export const metadata = { title: 'Grammar' }

const BAND_OPTIONS = [4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0]

export default async function GrammarPage({
  searchParams,
}: {
  searchParams: Promise<{ band?: string }>
}) {
  const session = await requireAuth()
  const userId = session.user.id
  const { band: bandParam } = await searchParams

  const selectedBand = bandParam ? parseFloat(bandParam) : null

  const [lessons, progressList] = await Promise.all([
    prisma.lesson.findMany({
      where: {
        section: 'grammar',
        ...(selectedBand !== null ? { band: selectedBand } : {}),
      },
      orderBy: [{ band: 'asc' }, { order: 'asc' }],
    }),
    prisma.progress.findMany({
      where: { userId, section: 'grammar' },
      select: { lessonId: true, completed: true, score: true, xp: true },
    }),
  ])

  const progressMap = new Map(progressList.map((p) => [p.lessonId, p]))

  const grouped = lessons.reduce<Record<string, typeof lessons>>((acc, lesson) => {
    const key = formatBand(lesson.band)
    if (!acc[key]) acc[key] = []
    acc[key].push(lesson)
    return acc
  }, {})

  const totalCompleted = progressList.filter((p) => p.completed).length
  const totalXpEarned = progressList.reduce((sum, p) => sum + p.xp, 0)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Grammar</h1>
          </div>
          <p className="text-muted-foreground">Nắm vững ngữ pháp tiếng Anh từ cơ bản đến nâng cao</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{lessons.length}</p>
              <p className="text-xs text-muted-foreground">Tổng bài học</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-emerald-400">{totalCompleted}</p>
              <p className="text-xs text-muted-foreground">Đã hoàn thành</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-yellow-400">{totalXpEarned}</p>
              <p className="text-xs text-muted-foreground">XP kiếm được</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-purple-400">
                {lessons.length > 0 ? Math.round((totalCompleted / lessons.length) * 100) : 0}%
              </p>
              <p className="text-xs text-muted-foreground">Hoàn thành</p>
            </CardContent>
          </Card>
        </div>

        {/* Band Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Link href="/grammar">
            <Button variant={selectedBand === null ? 'default' : 'outline'} size="sm">
              Tất cả
            </Button>
          </Link>
          {BAND_OPTIONS.map((band) => (
            <Link key={band} href={`/grammar?band=${band}`}>
              <Button
                variant={selectedBand === band ? 'default' : 'outline'}
                size="sm"
                className={selectedBand === band ? '' : bandToColor(band)}
              >
                Band {formatBand(band)}
              </Button>
            </Link>
          ))}
        </div>

        {/* Lesson Groups */}
        {Object.keys(grouped).length === 0 ? (
          <div className="text-center py-16">
            <GraduationCap className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg">Chưa có bài học nào</p>
          </div>
        ) : (
          <div className="space-y-10">
            {Object.entries(grouped).map(([bandLabel, bandLessons]) => {
              const bandNum = parseFloat(bandLabel)
              return (
                <section key={bandLabel}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`text-xl font-bold ${bandToColor(bandNum)}`}>
                      Band {bandLabel}
                    </span>
                    <div className="flex-1 h-px bg-border" />
                    <Badge variant="secondary">
                      {bandLessons.filter((l) => progressMap.get(l.id)?.completed).length}/{bandLessons.length} bài
                    </Badge>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {bandLessons.map((lesson) => {
                      const progress = progressMap.get(lesson.id)
                      const isCompleted = progress?.completed ?? false
                      const content = lesson.content as { exercises?: unknown[] }
                      const exerciseCount = Array.isArray(content?.exercises) ? content.exercises.length : 0

                      return (
                        <Link key={lesson.id} href={`/grammar/${lesson.id}`}>
                          <Card className={`group hover:border-purple-500/50 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/5 cursor-pointer ${isCompleted ? 'border-emerald-500/30' : ''}`}>
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between gap-2">
                                <CardTitle className="text-base leading-snug group-hover:text-purple-400 transition-colors">
                                  {lesson.title}
                                </CardTitle>
                                {isCompleted ? (
                                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                                ) : (
                                  <div className="w-5 h-5 rounded-full border-2 border-border shrink-0 mt-0.5" />
                                )}
                              </div>
                              {lesson.topic && (
                                <Badge variant="secondary" className="w-fit text-xs">
                                  {lesson.topic}
                                </Badge>
                              )}
                            </CardHeader>
                            <CardContent className="pt-0">
                              {lesson.description && (
                                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                  {lesson.description}
                                </p>
                              )}
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <BookOpenCheck className="w-3.5 h-3.5" />
                                  {exerciseCount} bài tập
                                </span>
                                <span className="flex items-center gap-1 text-yellow-400 font-medium">
                                  <Zap className="w-3.5 h-3.5" />
                                  +{lesson.xpReward} XP
                                </span>
                              </div>
                              {isCompleted && progress?.score != null && (
                                <div className="mt-2 text-xs text-emerald-400">
                                  Điểm: {progress.score}%
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </Link>
                      )
                    })}
                  </div>
                </section>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
