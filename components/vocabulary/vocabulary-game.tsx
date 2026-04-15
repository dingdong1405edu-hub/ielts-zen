'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  CheckCircle2,
  XCircle,
  ChevronRight,
  RotateCcw,
  Zap,
  Trophy,
  Brain,
  PenLine,
  BookOpen,
  ArrowLeft,
  Volume2,
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface Word {
  word: string
  phonetic: string
  definition: string
  vietnamese: string
  example: string
}

interface VocabularyGameProps {
  lesson: {
    id: string
    title: string
    content: { words: Word[] }
    xpReward: number
  }
  userId: string
}

type Phase = 'study' | 'quiz' | 'fill' | 'result'

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function generateChoices(words: Word[], correct: Word): string[] {
  const others = shuffleArray(words.filter((w) => w.word !== correct.word)).slice(0, 3)
  return shuffleArray([correct.definition, ...others.map((w) => w.definition)])
}

export function VocabularyGame({ lesson, userId }: VocabularyGameProps) {
  const words = lesson.content.words ?? []
  const [phase, setPhase] = useState<Phase>('study')
  const [studyIndex, setStudyIndex] = useState(0)
  const [remembered, setRemembered] = useState<Set<string>>(new Set())
  const [flipped, setFlipped] = useState(false)

  // Quiz phase
  const [quizWords, setQuizWords] = useState<Word[]>([])
  const [quizIndex, setQuizIndex] = useState(0)
  const [quizChoices, setQuizChoices] = useState<string[]>([])
  const [quizSelected, setQuizSelected] = useState<string | null>(null)
  const [quizCorrect, setQuizCorrect] = useState(0)

  // Fill phase
  const [fillWords, setFillWords] = useState<Word[]>([])
  const [fillIndex, setFillIndex] = useState(0)
  const [fillInput, setFillInput] = useState('')
  const [fillResult, setFillResult] = useState<'correct' | 'wrong' | null>(null)
  const [fillCorrectCount, setFillCorrectCount] = useState(0)

  // Result
  const [totalXpEarned, setTotalXpEarned] = useState(0)
  const [confetti, setConfetti] = useState(false)
  const [saving, setSaving] = useState(false)

  const speakWord = (word: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utt = new SpeechSynthesisUtterance(word)
      utt.lang = 'en-US'
      window.speechSynthesis.speak(utt)
    }
  }

  const startQuiz = useCallback(() => {
    const shuffled = shuffleArray(words)
    setQuizWords(shuffled)
    setQuizIndex(0)
    setQuizCorrect(0)
    setQuizSelected(null)
    if (shuffled.length > 0) {
      setQuizChoices(generateChoices(words, shuffled[0]))
    }
    setPhase('quiz')
  }, [words])

  const startFill = useCallback(() => {
    const shuffled = shuffleArray(words)
    setFillWords(shuffled)
    setFillIndex(0)
    setFillCorrectCount(0)
    setFillInput('')
    setFillResult(null)
    setPhase('fill')
  }, [words])

  const handleStudyNext = (didRemember: boolean) => {
    if (didRemember) {
      setRemembered((prev) => new Set([...prev, words[studyIndex].word]))
    }
    setFlipped(false)
    if (studyIndex < words.length - 1) {
      setTimeout(() => setStudyIndex((i) => i + 1), 150)
    } else {
      startQuiz()
    }
  }

  const handleQuizSelect = (choice: string) => {
    if (quizSelected !== null) return
    setQuizSelected(choice)
    const isCorrect = choice === quizWords[quizIndex].definition
    if (isCorrect) setQuizCorrect((c) => c + 1)
    setTimeout(() => {
      const next = quizIndex + 1
      if (next < quizWords.length) {
        setQuizIndex(next)
        setQuizSelected(null)
        setQuizChoices(generateChoices(words, quizWords[next]))
      } else {
        startFill()
      }
    }, 1000)
  }

  const handleFillSubmit = () => {
    if (fillResult !== null) return
    const correct = fillWords[fillIndex].word.toLowerCase().trim()
    const answer = fillInput.toLowerCase().trim()
    const isCorrect = answer === correct
    setFillResult(isCorrect ? 'correct' : 'wrong')
    if (isCorrect) setFillCorrectCount((c) => c + 1)
    setTimeout(async () => {
      const next = fillIndex + 1
      if (next < fillWords.length) {
        setFillIndex(next)
        setFillInput('')
        setFillResult(null)
      } else {
        // Calculate XP
        const quizScore = quizCorrect / (quizWords.length || 1)
        const fillScore = (fillCorrectCount + (isCorrect ? 1 : 0)) / (fillWords.length || 1)
        const avgScore = (quizScore + fillScore) / 2
        const xp = Math.round(lesson.xpReward * avgScore)
        setTotalXpEarned(xp)
        setPhase('result')
        setConfetti(true)
        setTimeout(() => setConfetti(false), 3000)

        // Save progress
        setSaving(true)
        try {
          await fetch('/api/user/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              section: 'vocabulary',
              lessonId: lesson.id,
              score: Math.round(avgScore * 100),
              xp,
            }),
          })
        } catch (e) {
          console.error('Failed to save progress', e)
        } finally {
          setSaving(false)
        }
      }
    }, 1200)
  }

  const restart = () => {
    setPhase('study')
    setStudyIndex(0)
    setRemembered(new Set())
    setFlipped(false)
  }

  // Progress across all phases
  const totalSteps = words.length * 3
  const currentStep =
    phase === 'study'
      ? studyIndex
      : phase === 'quiz'
        ? words.length + quizIndex
        : phase === 'fill'
          ? words.length * 2 + fillIndex
          : totalSteps

  const progressPct = totalSteps > 0 ? Math.round((currentStep / totalSteps) * 100) : 0

  if (words.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Bài học này chưa có từ vựng</p>
          <Link href="/vocabulary">
            <Button className="mt-4" variant="outline">
              Quay lại
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3 mb-2">
            <Link href="/vocabulary">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground truncate">{lesson.title}</p>
            </div>
            <Badge variant="secondary" className="shrink-0">
              {phase === 'study' ? (
                <><BookOpen className="w-3 h-3 mr-1" />Học</>
              ) : phase === 'quiz' ? (
                <><Brain className="w-3 h-3 mr-1" />Trắc nghiệm</>
              ) : phase === 'fill' ? (
                <><PenLine className="w-3 h-3 mr-1" />Điền từ</>
              ) : (
                <><Trophy className="w-3 h-3 mr-1" />Kết quả</>
              )}
            </Badge>
          </div>
          <Progress value={progressPct} className="h-1.5" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* PHASE 1: Study */}
          {phase === 'study' && (
            <motion.div
              key={`study-${studyIndex}`}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
            >
              <div className="text-center mb-6">
                <p className="text-sm text-muted-foreground">
                  {studyIndex + 1} / {words.length} từ
                </p>
              </div>

              {/* Flashcard */}
              <div
                className="relative cursor-pointer"
                style={{ perspective: '1000px' }}
                onClick={() => setFlipped((f) => !f)}
              >
                <motion.div
                  animate={{ rotateY: flipped ? 180 : 0 }}
                  transition={{ duration: 0.5 }}
                  style={{ transformStyle: 'preserve-3d' }}
                  className="relative"
                >
                  {/* Front */}
                  <Card
                    className="min-h-[280px] flex flex-col justify-center"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <CardContent className="p-8 text-center">
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <h2 className="text-4xl font-bold text-foreground">
                          {words[studyIndex].word}
                        </h2>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            speakWord(words[studyIndex].word)
                          }}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Volume2 className="w-5 h-5" />
                        </button>
                      </div>
                      {words[studyIndex].phonetic && (
                        <p className="text-blue-400 text-lg mb-4">{words[studyIndex].phonetic}</p>
                      )}
                      <p className="text-sm text-muted-foreground">Nhấn để xem nghĩa</p>
                    </CardContent>
                  </Card>

                  {/* Back */}
                  <Card
                    className="min-h-[280px] flex flex-col justify-center absolute inset-0"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                  >
                    <CardContent className="p-8 text-center space-y-4">
                      <h2 className="text-2xl font-bold text-foreground">{words[studyIndex].word}</h2>
                      <div className="space-y-1">
                        <p className="text-base text-foreground">{words[studyIndex].definition}</p>
                        <p className="text-emerald-400 font-medium">{words[studyIndex].vietnamese}</p>
                      </div>
                      {words[studyIndex].example && (
                        <div className="bg-muted/50 rounded-lg p-3">
                          <p className="text-sm text-muted-foreground italic">
                            &ldquo;{words[studyIndex].example}&rdquo;
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10"
                  onClick={() => handleStudyNext(false)}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Chưa nhớ
                </Button>
                <Button
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => handleStudyNext(true)}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Đã nhớ
                </Button>
              </div>

              <p className="text-center text-xs text-muted-foreground mt-4">
                Nhấn vào thẻ để xem nghĩa
              </p>
            </motion.div>
          )}

          {/* PHASE 2: Multiple choice quiz */}
          {phase === 'quiz' && quizWords.length > 0 && (
            <motion.div
              key={`quiz-${quizIndex}`}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
            >
              <div className="text-center mb-6">
                <p className="text-sm text-muted-foreground mb-1">
                  Câu {quizIndex + 1} / {quizWords.length}
                </p>
                <h2 className="text-3xl font-bold text-foreground mb-1">
                  {quizWords[quizIndex].word}
                </h2>
                {quizWords[quizIndex].phonetic && (
                  <p className="text-blue-400">{quizWords[quizIndex].phonetic}</p>
                )}
              </div>

              <p className="text-center text-muted-foreground mb-6">Chọn đúng nghĩa của từ này:</p>

              <div className="space-y-3">
                {quizChoices.map((choice, i) => {
                  const isSelected = quizSelected === choice
                  const isCorrect = choice === quizWords[quizIndex].definition
                  const showResult = quizSelected !== null

                  return (
                    <motion.button
                      key={i}
                      onClick={() => handleQuizSelect(choice)}
                      className={cn(
                        'w-full text-left p-4 rounded-xl border transition-all duration-200',
                        !showResult && 'hover:border-blue-500/50 hover:bg-blue-500/5',
                        showResult && isCorrect && 'border-emerald-500 bg-emerald-500/10 text-emerald-400',
                        showResult && isSelected && !isCorrect && 'border-red-500 bg-red-500/10 text-red-400',
                        !showResult ? 'border-border bg-card' : '',
                        !showResult && 'cursor-pointer'
                      )}
                      whileHover={!showResult ? { scale: 1.01 } : {}}
                      whileTap={!showResult ? { scale: 0.99 } : {}}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{choice}</span>
                        {showResult && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        {showResult && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-400" />}
                      </div>
                    </motion.button>
                  )
                })}
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Điểm: <span className="text-emerald-400 font-medium">{quizCorrect}</span> / {quizIndex}
                </p>
              </div>
            </motion.div>
          )}

          {/* PHASE 3: Fill in the blank */}
          {phase === 'fill' && fillWords.length > 0 && (
            <motion.div
              key={`fill-${fillIndex}`}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
            >
              <div className="text-center mb-6">
                <p className="text-sm text-muted-foreground mb-1">
                  Câu {fillIndex + 1} / {fillWords.length}
                </p>
                <Badge variant="secondary" className="mb-3">Điền từ vào chỗ trống</Badge>
              </div>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Nghĩa tiếng Anh:</p>
                    <p className="text-foreground font-medium">{fillWords[fillIndex].definition}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Tiếng Việt:</p>
                    <p className="text-emerald-400 font-medium">{fillWords[fillIndex].vietnamese}</p>
                  </div>
                  {fillWords[fillIndex].example && (
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-sm text-muted-foreground mb-1">Ví dụ:</p>
                      <p className="text-sm italic">
                        {fillWords[fillIndex].example.replace(
                          new RegExp(fillWords[fillIndex].word, 'gi'),
                          '___'
                        )}
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Input
                      value={fillInput}
                      onChange={(e) => setFillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && fillResult === null && fillInput.trim()) {
                          handleFillSubmit()
                        }
                      }}
                      placeholder="Nhập từ tiếng Anh..."
                      disabled={fillResult !== null}
                      className={cn(
                        fillResult === 'correct' && 'border-emerald-500 text-emerald-400',
                        fillResult === 'wrong' && 'border-red-500 text-red-400'
                      )}
                    />
                    {fillResult !== null && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          'text-sm font-medium flex items-center gap-2',
                          fillResult === 'correct' ? 'text-emerald-400' : 'text-red-400'
                        )}
                      >
                        {fillResult === 'correct' ? (
                          <><CheckCircle2 className="w-4 h-4" />Chính xác!</>
                        ) : (
                          <><XCircle className="w-4 h-4" />Đáp án đúng: <strong>{fillWords[fillIndex].word}</strong></>
                        )}
                      </motion.div>
                    )}
                  </div>

                  {fillResult === null && (
                    <Button
                      onClick={handleFillSubmit}
                      disabled={!fillInput.trim()}
                      className="w-full"
                    >
                      Kiểm tra
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* PHASE 4: Result */}
          {phase === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, type: 'spring' }}
            >
              {/* Confetti */}
              {confetti && (
                <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
                  {Array.from({ length: 50 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][
                          Math.floor(Math.random() * 5)
                        ],
                      }}
                      initial={{ y: -20, opacity: 1 }}
                      animate={{
                        y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 20,
                        opacity: 0,
                        rotate: Math.random() * 720,
                      }}
                      transition={{
                        duration: 2 + Math.random() * 2,
                        delay: Math.random() * 0.5,
                        ease: 'easeIn',
                      }}
                    />
                  ))}
                </div>
              )}

              <div className="text-center space-y-6">
                <motion.div
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <div className="w-24 h-24 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto">
                    <Trophy className="w-12 h-12 text-yellow-400" />
                  </div>
                </motion.div>

                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Hoàn thành!</h2>
                  <p className="text-muted-foreground">Bạn đã học xong bài &quot;{lesson.title}&quot;</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-yellow-400 flex items-center justify-center gap-1">
                        <Zap className="w-5 h-5" />
                        {totalXpEarned}
                      </p>
                      <p className="text-xs text-muted-foreground">XP kiếm được</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-emerald-400">{remembered.size}</p>
                      <p className="text-xs text-muted-foreground">Từ đã nhớ</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-blue-400">{words.length}</p>
                      <p className="text-xs text-muted-foreground">Tổng từ vựng</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex flex-col gap-3">
                  <Button onClick={restart} variant="outline" className="w-full">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Học lại
                  </Button>
                  <Link href="/vocabulary" className="block">
                    <Button className="w-full" variant="gradient">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Bài học tiếp theo
                    </Button>
                  </Link>
                </div>

                {saving && (
                  <p className="text-xs text-muted-foreground">Đang lưu tiến trình...</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
