import { requireAuth } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { formatBand, bandToColor } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { FileText, Clock, CheckCircle2, BookMarked, ChevronRight } from 'lucide-react'

export const metadata = { title: 'Reading' }

const BAND_OPTIONS = [4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0]

export default async function ReadingPage({
  searchParams,
}: {
  searchParams: Promise<{ band?: string }>
}) {
  const session = await requireAuth()
  const userId = session.user.id
  const { band: bandParam } = await searchParams

  const selectedBand = bandParam ? parseFloat(bandParam) : null

  const [tests, testResults, progressList] = await Promise.all([
    prisma.readingTest.findMany({
      where: selectedBand !== null ? { band: selectedBand } : {},
      orderBy: [{ band: 'asc' }, { createdAt: 'desc' }],
    }),
    prisma.testResult.findMany({
      where: { userId, testType: 'reading' },
      orderBy: { createdAt: 'desc' },
      select: { details: true, bandScore: true },
    }),
    prisma.progress.findMany({
      where: { userId, section: 'reading' },
      select: { lessonId: true, completed: true, score: true },
    }),
  ])

  // Map testId -> best band from test results
  const resultMap = new Map<string, { bandScore: number }>()
  for (const r of testResults) {
    const details = r.details as { testId?: string }
    if (details?.testId && !resultMap.has(details.testId)) {
      resultMap.set(details.testId, { bandScore: r.bandScore })
    }
  }

  // Also track from progress
  const progressMap = new Map(progressList.map((p) => [p.lessonId, p]))

  const doneIds = new Set([
    ...Array.from(resultMap.keys()),
    ...progressList.filter((p) => p.completed).map((p) => p.lessonId),
  ])

  const grouped = tests.reduce<Record<string, typeof tests>>((acc, test) => {
    const key = formatBand(test.band)
    if (!acc[key]) acc[key] = []
    acc[key].push(test)
    return acc
  }, {})

  const avgBand =
    testResults.length > 0
      ? (testResults.reduce((s, r) => s + r.bandScore, 0) / testResults.length).toFixed(1)
      : null

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
              <BookMarked className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Reading</h1>
          </div>
          <p className="text-muted-foreground">Luyện đọc hiểu IELTS với bài thi thực tế</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{tests.length}</p>
              <p className="text-xs text-muted-foreground">Tổng bài thi</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-emerald-400">{doneIds.size}</p>
              <p className="text-xs text-muted-foreground">Đã làm</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-teal-400">{testResults.length}</p>
              <p className="text-xs text-muted-foreground">Lượt luyện thi</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-400">{avgBand ?? '--'}</p>
              <p className="text-xs text-muted-foreground">Band TB</p>
            </CardContent>
          </Card>
        </div>

        {/* Band Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Link href="/reading">
            <Button variant={selectedBand === null ? 'default' : 'outline'} size="sm">
              Tất cả
            </Button>
          </Link>
          {BAND_OPTIONS.map((band) => (
            <Link key={band} href={`/reading?band=${band}`}>
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

        {/* Test Groups */}
        {Object.keys(grouped).length === 0 ? (
          <div className="text-center py-16">
            <BookMarked className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg">Chưa có bài thi nào</p>
          </div>
        ) : (
          <div className="space-y-10">
            {Object.entries(grouped).map(([bandLabel, bandTests]) => {
              const bandNum = parseFloat(bandLabel)
              return (
                <section key={bandLabel}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`text-xl font-bold ${bandToColor(bandNum)}`}>
                      Band {bandLabel}
                    </span>
                    <div className="flex-1 h-px bg-border" />
                    <Badge variant="secondary">
                      {bandTests.filter((t) => doneIds.has(t.id)).length}/{bandTests.length} bài
                    </Badge>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {bandTests.map((test) => {
                      const isDone = doneIds.has(test.id)
                      const result = resultMap.get(test.id)
                      const progress = progressMap.get(test.id)
                      const questions = test.questions as unknown[]

                      return (
                        <Card
                          key={test.id}
                          className={`group transition-all duration-200 hover:shadow-lg hover:shadow-teal-500/5 ${isDone ? 'border-emerald-500/30' : 'hover:border-teal-500/50'}`}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-2">
                              <CardTitle className="text-base leading-snug group-hover:text-teal-400 transition-colors">
                                {test.title}
                              </CardTitle>
                              {isDone ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                              ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-border shrink-0 mt-0.5" />
                              )}
                            </div>
                            {test.topic && (
                              <Badge variant="secondary" className="w-fit text-xs">
                                {test.topic}
                              </Badge>
                            )}
                          </CardHeader>
                          <CardContent className="pt-0 space-y-3">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <FileText className="w-3.5 h-3.5" />
                                {Array.isArray(questions) ? questions.length : 0} câu hỏi
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {test.timeLimit} phút
                              </span>
                            </div>
                            {result && (
                              <p className="text-xs text-emerald-400">
                                Band đạt: {result.bandScore.toFixed(1)}
                              </p>
                            )}
                            {!result && progress?.score != null && (
                              <p className="text-xs text-blue-400">
                                Điểm: {progress.score}%
                              </p>
                            )}
                            <Button
                              variant={isDone ? 'outline' : 'gradient'}
                              size="sm"
                              className="w-full"
                              asChild
                            >
                              <Link href={`/reading/${test.id}`}>
                                {isDone ? 'Làm lại' : 'Bắt đầu'}
                                <ChevronRight className="w-3.5 h-3.5 ml-1" />
                              </Link>
                            </Button>
                          </CardContent>
                        </Card>
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
