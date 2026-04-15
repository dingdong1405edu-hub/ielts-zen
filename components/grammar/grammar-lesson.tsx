'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  CheckCircle2,
  XCircle,
  ArrowLeft,
  ArrowRight,
  Trophy,
  Zap,
  BookOpen,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Lightbulb,
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface Exercise {
  question: string
  options: string[]
  correct: number
  explanation: string
}

interface GrammarLessonProps {
  lesson: {
    id: string
    title: string
    content: {
      rule: string
      explanation: string
      examples: string[]
      exercises: Exercise[]
    }
    xpReward: number
  }
  userId: string
}

type Phase = 'theory' | 'exercises' | 'result'

export function GrammarLesson({ lesson, userId }: GrammarLessonProps) {
  const { rule, explanation, examples, exercises } = lesson.content
  const [phase, setPhase] = useState<Phase>('theory')
  const [showExamples, setShowExamples] = useState(true)

  // Exercise state
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(exercises.length).fill(null)
  )
  const [showExplanation, setShowExplanation] = useState(false)
  const [saving, setSaving] = useState(false)

  const currentExercise = exercises[currentIndex]
  const currentAnswer = answers[currentIndex]
  const isAnswered = currentAnswer !== null

  const correctCount = answers.filter((a, i) => a === exercises[i]?.correct).length
  const score = exercises.length > 0 ? Math.round((correctCount / exercises.length) * 100) : 0
  const xpEarned = Math.round(lesson.xpReward * (score / 100))

  const handleAnswer = (optionIndex: number) => {
    if (isAnswered) return
    const updated = [...answers]
    updated[currentIndex] = optionIndex
    setAnswers(updated)
    setShowExplanation(true)
  }

  const handleNext = () => {
    setShowExplanation(false)
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex((i) => i + 1)
    } else {
      finishLesson()
    }
  }

  const finishLesson = async () => {
    setPhase('result')
    setSaving(true)
    try {
      await fetch('/api/user/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: 'grammar',
          lessonId: lesson.id,
          score,
          xp: xpEarned,
        }),
      })
    } catch (e) {
      console.error('Failed to save progress', e)
    } finally {
      setSaving(false)
    }
  }

  const restart = () => {
    setPhase('theory')
    setCurrentIndex(0)
    setAnswers(Array(exercises.length).fill(null))
    setShowExplanation(false)
  }

  const progressPct =
    phase === 'theory'
      ? 0
      : phase === 'exercises'
        ? Math.round(((currentIndex + (isAnswered ? 1 : 0)) / exercises.length) * 100)
        : 100

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3 mb-2">
            <Link href="/grammar">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{lesson.title}</p>
            </div>
            <Badge variant={phase === 'theory' ? 'default' : phase === 'exercises' ? 'secondary' : 'success'}>
              {phase === 'theory' ? 'Lý thuyết' : phase === 'exercises' ? `${currentIndex + 1}/${exercises.length}` : 'Xong'}
            </Badge>
          </div>
          <Progress value={progressPct} className="h-1.5" indicatorClassName="bg-purple-500" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* THEORY PHASE */}
          {phase === 'theory' && (
            <motion.div
              key="theory"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Rule Card with flip hint */}
              <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-purple-400" />
                    <CardTitle className="text-purple-400">Quy tắc ngữ pháp</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 rounded-lg p-4 mb-4">
                    <p className="text-foreground font-mono text-sm leading-relaxed">{rule}</p>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{explanation}</p>
                </CardContent>
              </Card>

              {/* Examples */}
              {examples && examples.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <button
                      onClick={() => setShowExamples((s) => !s)}
                      className="flex items-center justify-between w-full"
                    >
                      <CardTitle className="text-base flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-blue-400" />
                        Ví dụ ({examples.length})
                      </CardTitle>
                      {showExamples ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  </CardHeader>
                  <AnimatePresence>
                    {showExamples && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <CardContent className="pt-0">
                          <ul className="space-y-2">
                            {examples.map((ex, i) => (
                              <li key={i} className="flex gap-3 text-sm">
                                <span className="text-purple-400 shrink-0 font-medium">{i + 1}.</span>
                                <span className="text-foreground italic">{ex}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              )}

              <Button
                onClick={() => setPhase('exercises')}
                className="w-full"
                variant="gradient"
                size="lg"
                disabled={exercises.length === 0}
              >
                {exercises.length === 0 ? 'Không có bài tập' : 'Bắt đầu luyện tập'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          )}

          {/* EXERCISES PHASE */}
          {phase === 'exercises' && currentExercise && (
            <motion.div
              key={`exercise-${currentIndex}`}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div>
                <p className="text-xs text-muted-foreground mb-3">
                  Câu {currentIndex + 1} / {exercises.length}
                </p>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-foreground font-medium text-base leading-relaxed mb-6">
                      {currentExercise.question}
                    </p>

                    <div className="space-y-3">
                      {currentExercise.options.map((option, i) => {
                        const isSelected = currentAnswer === i
                        const isCorrect = i === currentExercise.correct
                        const showResult = isAnswered

                        return (
                          <motion.button
                            key={i}
                            onClick={() => handleAnswer(i)}
                            whileHover={!isAnswered ? { scale: 1.01 } : {}}
                            whileTap={!isAnswered ? { scale: 0.99 } : {}}
                            className={cn(
                              'w-full text-left p-4 rounded-xl border transition-all duration-200 text-sm',
                              !showResult && 'border-border bg-card hover:border-purple-500/50 hover:bg-purple-500/5 cursor-pointer',
                              showResult && isCorrect && 'border-emerald-500 bg-emerald-500/10',
                              showResult && isSelected && !isCorrect && 'border-red-500 bg-red-500/10',
                              showResult && !isSelected && !isCorrect && 'border-border bg-card opacity-50'
                            )}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <span className={cn(
                                  'w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0',
                                  showResult && isCorrect ? 'border-emerald-500 text-emerald-400' :
                                  showResult && isSelected && !isCorrect ? 'border-red-500 text-red-400' :
                                  'border-border text-muted-foreground'
                                )}>
                                  {String.fromCharCode(65 + i)}
                                </span>
                                <span className={cn(
                                  showResult && isCorrect && 'text-emerald-400',
                                  showResult && isSelected && !isCorrect && 'text-red-400'
                                )}>
                                  {option}
                                </span>
                              </div>
                              {showResult && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                              {showResult && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
                            </div>
                          </motion.button>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Explanation */}
              <AnimatePresence>
                {showExplanation && isAnswered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Card className={cn(
                      'border',
                      answers[currentIndex] === currentExercise.correct
                        ? 'border-emerald-500/30 bg-emerald-500/5'
                        : 'border-red-500/30 bg-red-500/5'
                    )}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          {answers[currentIndex] === currentExercise.correct ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <p className={cn(
                              'text-sm font-medium mb-1',
                              answers[currentIndex] === currentExercise.correct ? 'text-emerald-400' : 'text-red-400'
                            )}>
                              {answers[currentIndex] === currentExercise.correct ? 'Chính xác!' : 'Chưa đúng'}
                            </p>
                            <p className="text-sm text-muted-foreground">{currentExercise.explanation}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {isAnswered && (
                <Button onClick={handleNext} className="w-full" variant="gradient">
                  {currentIndex < exercises.length - 1 ? (
                    <>
                      Câu tiếp theo
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    <>
                      Xem kết quả
                      <Trophy className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </motion.div>
          )}

          {/* RESULT PHASE */}
          {phase === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, type: 'spring' }}
              className="space-y-6"
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: score >= 70 ? [0, -10, 10, -10, 0] : [0, 5, -5, 0] }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{
                    background: score >= 70 ? 'rgba(234,179,8,0.1)' : 'rgba(239,68,68,0.1)'
                  }}
                >
                  <Trophy className={cn('w-12 h-12', score >= 70 ? 'text-yellow-400' : 'text-red-400')} />
                </motion.div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {score >= 90 ? 'Xuất sắc!' : score >= 70 ? 'Tốt lắm!' : score >= 50 ? 'Khá ổn!' : 'Cần ôn thêm!'}
                </h2>
                <p className="text-muted-foreground">Bạn đã hoàn thành &quot;{lesson.title}&quot;</p>
              </div>

              {/* Score ring */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-around">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-foreground">{score}%</p>
                      <p className="text-sm text-muted-foreground">Điểm số</p>
                    </div>
                    <div className="text-center">
                      <p className="text-4xl font-bold text-emerald-400">{correctCount}</p>
                      <p className="text-sm text-muted-foreground">Câu đúng</p>
                    </div>
                    <div className="text-center">
                      <p className="text-4xl font-bold text-red-400">{exercises.length - correctCount}</p>
                      <p className="text-sm text-muted-foreground">Câu sai</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-yellow-500/20 bg-yellow-500/5">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <span className="text-foreground font-medium">XP kiếm được</span>
                  </div>
                  <span className="text-2xl font-bold text-yellow-400">+{xpEarned}</span>
                </CardContent>
              </Card>

              {/* Review answers */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Xem lại đáp án
                </h3>
                {exercises.map((ex, i) => {
                  const userAnswer = answers[i]
                  const isCorrect = userAnswer === ex.correct
                  return (
                    <Card key={i} className={cn(
                      'border',
                      isCorrect ? 'border-emerald-500/20' : 'border-red-500/20'
                    )}>
                      <CardContent className="p-4">
                        <div className="flex gap-3">
                          {isCorrect ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground mb-1">{ex.question}</p>
                            <p className="text-xs text-emerald-400">
                              Đáp án: {ex.options[ex.correct]}
                            </p>
                            {!isCorrect && userAnswer !== null && (
                              <p className="text-xs text-red-400">
                                Bạn chọn: {ex.options[userAnswer]}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              <div className="flex flex-col gap-3">
                <Button onClick={restart} variant="outline" className="w-full">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Làm lại
                </Button>
                <Link href="/grammar" className="block">
                  <Button className="w-full" variant="gradient">
                    Bài học tiếp theo
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>

              {saving && (
                <p className="text-center text-xs text-muted-foreground">Đang lưu tiến trình...</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
