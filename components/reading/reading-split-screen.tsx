'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Clock,
  Send,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  Search,
  Highlighter,
  X,
  BookOpen,
  AlertCircle,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface Question {
  id: string
  type: 'multiple_choice' | 'true_false_ng' | 'short_answer' | 'matching'
  question: string
  options?: string[]
  correct: string | number
  explanation?: string
}

interface ReadingSplitScreenProps {
  test: {
    id: string
    title: string
    passage: string
    questions: Question[]
    timeLimit: number
  }
  userId: string
}

function scoreToBand(pct: number): number {
  if (pct >= 90) return 8.5
  if (pct >= 80) return 7.5
  if (pct >= 70) return 7.0
  if (pct >= 60) return 6.5
  if (pct >= 50) return 6.0
  if (pct >= 40) return 5.5
  if (pct >= 30) return 5.0
  return 4.0
}

export function ReadingSplitScreen({ test, userId }: ReadingSplitScreenProps) {
  const router = useRouter()
  const questions = test.questions

  // Timer
  const [timeLeft, setTimeLeft] = useState(test.timeLimit * 60)
  const [submitted, setSubmitted] = useState(false)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [score, setScore] = useState<number | null>(null)
  const [bandEstimate, setBandEstimate] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)

  // Passage features
  const [searchTerm, setSearchTerm] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [highlights, setHighlights] = useState<string[]>([])
  const [selectedPassageText, setSelectedPassageText] = useState('')

  // Resizable split
  const containerRef = useRef<HTMLDivElement>(null)
  const [leftWidth, setLeftWidth] = useState(50) // percent
  const isDragging = useRef(false)

  // Countdown timer
  useEffect(() => {
    if (submitted || timeLeft <= 0) return
    const t = setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) {
          clearInterval(t)
          handleSubmit()
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [submitted, timeLeft])

  // Drag to resize
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const pct = Math.min(70, Math.max(30, (x / rect.width) * 100))
    setLeftWidth(pct)
  }, [])

  const handleMouseUp = useCallback(() => {
    isDragging.current = false
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }, [])

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  const startDrag = () => {
    isDragging.current = true
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }

  // Text selection in passage -> highlight
  const handlePassageMouseUp = () => {
    const sel = window.getSelection()
    if (!sel || sel.isCollapsed) {
      setSelectedPassageText('')
      return
    }
    const text = sel.toString().trim()
    if (text.length > 1) {
      setSelectedPassageText(text)
    }
  }

  const addHighlight = () => {
    if (selectedPassageText && !highlights.includes(selectedPassageText)) {
      setHighlights((h) => [...h, selectedPassageText])
    }
    setSelectedPassageText('')
    window.getSelection()?.removeAllRanges()
  }

  const removeHighlight = (h: string) => {
    setHighlights((hs) => hs.filter((x) => x !== h))
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
  }

  const isCorrect = (q: Question) => {
    const ans = (answers[q.id] ?? '').toLowerCase().trim()
    const cor = String(q.correct).toLowerCase().trim()
    return ans === cor
  }

  const setAnswer = (qId: string, value: string) => {
    if (submitted) return
    setAnswers((prev) => ({ ...prev, [qId]: value }))
  }

  const handleSubmit = useCallback(async () => {
    if (submitted) return
    let correct = 0
    questions.forEach((q) => {
      if (isCorrect(q)) correct++
    })
    const pct = questions.length > 0 ? (correct / questions.length) * 100 : 0
    const band = scoreToBand(pct)
    setScore(correct)
    setBandEstimate(band)
    setSubmitted(true)

    setSaving(true)
    try {
      await fetch('/api/user/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: 'reading',
          lessonId: test.id,
          score: Math.round(pct),
          xp: 20,
        }),
      })
      await fetch('/api/user/test-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testType: 'reading',
          bandScore: band,
          details: { testId: test.id, correct, total: questions.length },
          duration: test.timeLimit * 60 - timeLeft,
        }),
      }).catch(() => {})
    } catch (e) {
      console.error('Failed to save', e)
    } finally {
      setSaving(false)
    }
  }, [submitted, questions, answers, test.id, timeLeft])

  const answered = Object.keys(answers).length

  // Render passage with highlights and search
  const renderPassage = () => {
    const paragraphs = test.passage.split('\n\n').filter(Boolean)
    return paragraphs.map((para, i) => {
      let content = para

      // Apply search highlight
      if (searchTerm && content.toLowerCase().includes(searchTerm.toLowerCase())) {
        return (
          <p key={i} className="mb-4 leading-relaxed text-sm">
            {content.split(new RegExp(`(${searchTerm})`, 'gi')).map((part, j) =>
              part.toLowerCase() === searchTerm.toLowerCase() ? (
                <mark key={j} className="bg-yellow-400/30 text-foreground rounded px-0.5">
                  {part}
                </mark>
              ) : (
                part
              )
            )}
          </p>
        )
      }

      // Apply user highlights
      if (highlights.length > 0) {
        const regex = new RegExp(
          `(${highlights.map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
          'gi'
        )
        const parts = content.split(regex)
        return (
          <p key={i} className="mb-4 leading-relaxed text-sm">
            {parts.map((part, j) =>
              highlights.some((h) => h.toLowerCase() === part.toLowerCase()) ? (
                <mark key={j} className="bg-blue-400/30 text-foreground rounded px-0.5">
                  {part}
                </mark>
              ) : (
                part
              )
            )}
          </p>
        )
      }

      return (
        <p key={i} className="mb-4 leading-relaxed text-sm text-foreground">
          {content}
        </p>
      )
    })
  }

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Top bar */}
      <div className="shrink-0 flex items-center justify-between px-4 py-2.5 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ChevronLeft className="w-4 h-4 mr-1" />
            Thoát
          </Button>
          <h1 className="text-sm font-semibold hidden sm:block truncate max-w-[200px]">
            {test.title}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {answered}/{questions.length}
          </span>
          <div className={cn(
            'flex items-center gap-1.5 text-sm font-mono font-bold',
            timeLeft < 300 && !submitted ? 'text-red-400 animate-pulse' : 'text-foreground'
          )}>
            <Clock className="w-4 h-4" />
            {formatTime(timeLeft)}
          </div>
          {!submitted ? (
            <Button
              variant="gradient"
              size="sm"
              onClick={handleSubmit}
              disabled={answered === 0}
              loading={saving}
            >
              <Send className="w-3.5 h-3.5 mr-1" />
              Nộp bài
            </Button>
          ) : (
            <Badge variant="success">Đã nộp</Badge>
          )}
        </div>
      </div>

      {/* Score banner */}
      <AnimatePresence>
        {submitted && score !== null && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="shrink-0 bg-gradient-to-r from-blue-600/20 to-teal-500/20 border-b border-blue-500/30 px-4 py-2"
          >
            <div className="flex items-center justify-between text-sm">
              <span>
                Kết quả:{' '}
                <strong className="text-foreground">{score}/{questions.length}</strong> câu đúng
                ({Math.round((score / questions.length) * 100)}%) — Band:{' '}
                <strong className="text-teal-400">{bandEstimate?.toFixed(1)}</strong>
              </span>
              {saving && <span className="text-xs text-muted-foreground">Đang lưu...</span>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Split content area */}
      <div
        ref={containerRef}
        className="flex flex-1 overflow-hidden"
        style={{ minHeight: 0 }}
      >
        {/* LEFT: Passage */}
        <div
          className="flex flex-col border-r border-border overflow-hidden"
          style={{ width: `${leftWidth}%`, minWidth: '30%' }}
        >
          {/* Passage toolbar */}
          <div className="shrink-0 flex items-center gap-2 px-3 py-2 border-b border-border bg-card/50">
            <BookOpen className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground flex-1">Bài đọc</span>
            <div className="flex items-center gap-1">
              {selectedPassageText && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs px-2 border-blue-500/50 text-blue-400"
                  onClick={addHighlight}
                >
                  <Highlighter className="w-3 h-3 mr-1" />
                  Đánh dấu
                </Button>
              )}
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={() => setShowSearch((s) => !s)}
                title="Tìm kiếm"
              >
                <Search className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {/* Search bar */}
          <AnimatePresence>
            {showSearch && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden shrink-0"
              >
                <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/30">
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm trong bài đọc..."
                    className="h-7 text-xs"
                    autoFocus
                  />
                  {searchTerm && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 shrink-0"
                      onClick={() => setSearchTerm('')}
                    >
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Highlights toolbar */}
          {highlights.length > 0 && (
            <div className="shrink-0 flex flex-wrap gap-1 px-3 py-2 border-b border-border bg-blue-500/5">
              {highlights.map((h, i) => (
                <button
                  key={i}
                  onClick={() => removeHighlight(h)}
                  className="flex items-center gap-1 text-xs bg-blue-400/20 text-blue-300 rounded px-1.5 py-0.5 hover:bg-blue-400/30 transition-colors"
                >
                  <span className="max-w-[100px] truncate">{h}</span>
                  <X className="w-2.5 h-2.5" />
                </button>
              ))}
            </div>
          )}

          {/* Passage text */}
          <div
            className="flex-1 overflow-y-auto p-4 md:p-6 selection:bg-blue-400/30"
            onMouseUp={handlePassageMouseUp}
          >
            {renderPassage()}
          </div>
        </div>

        {/* Resize handle */}
        <div
          onMouseDown={startDrag}
          className="w-1.5 shrink-0 cursor-col-resize bg-border hover:bg-blue-500/40 transition-colors active:bg-blue-500/60 relative group"
          title="Kéo để điều chỉnh"
        >
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-border group-hover:bg-blue-400 transition-colors" />
        </div>

        {/* RIGHT: Questions */}
        <div
          className="flex flex-col overflow-hidden"
          style={{ width: `${100 - leftWidth}%`, minWidth: '30%' }}
        >
          <div className="shrink-0 flex items-center justify-between px-3 py-2 border-b border-border bg-card/50">
            <span className="text-xs text-muted-foreground">
              Câu hỏi ({answered}/{questions.length} đã trả lời)
            </span>
            {timeLeft < 300 && !submitted && (
              <span className="text-xs text-red-400 flex items-center gap-1 animate-pulse">
                <AlertCircle className="w-3 h-3" />
                Sắp hết giờ
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-5">
              {questions.map((q, i) => {
                const correct = submitted ? isCorrect(q) : null
                return (
                  <div
                    key={q.id}
                    className={cn(
                      'rounded-xl border p-4 transition-all',
                      !submitted && 'border-border',
                      submitted && correct === true && 'border-emerald-500/50 bg-emerald-500/5',
                      submitted && correct === false && 'border-red-500/50 bg-red-500/5'
                    )}
                  >
                    <div className="flex items-start gap-2 mb-3">
                      <span className="text-xs font-bold text-muted-foreground w-5 shrink-0 pt-0.5">
                        {i + 1}.
                      </span>
                      <p className="text-sm font-medium leading-relaxed flex-1">{q.question}</p>
                      {submitted && (
                        correct
                          ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          : <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      )}
                    </div>

                    <div className="ml-5">
                      {q.type === 'multiple_choice' && q.options && (
                        <div className="space-y-1.5">
                          {q.options.map((opt, oi) => {
                            const isSelected = answers[q.id] === String(oi)
                            const isCorrectOpt = submitted && String(oi) === String(q.correct)
                            return (
                              <button
                                key={oi}
                                onClick={() => setAnswer(q.id, String(oi))}
                                disabled={submitted}
                                className={cn(
                                  'w-full text-left rounded-lg border px-3 py-2 text-xs transition-all',
                                  isSelected && !submitted && 'border-blue-500 bg-blue-500/10 text-blue-300',
                                  isSelected && submitted && correct && 'border-emerald-500 bg-emerald-500/10 text-emerald-300',
                                  isSelected && submitted && !correct && 'border-red-500 bg-red-500/10 text-red-300',
                                  isCorrectOpt && !isSelected && 'border-emerald-500/40 bg-emerald-500/5',
                                  !isSelected && !isCorrectOpt && 'border-border hover:border-muted-foreground cursor-pointer'
                                )}
                              >
                                <span className="font-medium mr-2">{String.fromCharCode(65 + oi)}.</span>
                                {opt}
                              </button>
                            )
                          })}
                        </div>
                      )}

                      {q.type === 'true_false_ng' && (
                        <div className="flex flex-wrap gap-1.5">
                          {['True', 'False', 'Not Given'].map((v) => {
                            const val = v.toLowerCase()
                            const isSelected = answers[q.id] === val
                            const isCorrectOpt = submitted && String(q.correct).toLowerCase() === val
                            return (
                              <button
                                key={v}
                                onClick={() => setAnswer(q.id, val)}
                                disabled={submitted}
                                className={cn(
                                  'rounded-lg border px-3 py-1.5 text-xs font-medium transition-all',
                                  isSelected && !submitted && 'border-blue-500 bg-blue-500/20 text-blue-300',
                                  isSelected && submitted && correct && 'border-emerald-500 bg-emerald-500/20 text-emerald-300',
                                  isSelected && submitted && !correct && 'border-red-500 bg-red-500/20 text-red-300',
                                  isCorrectOpt && !isSelected && 'border-emerald-500/40 bg-emerald-500/5 text-emerald-300',
                                  !isSelected && !isCorrectOpt && 'border-border hover:border-muted-foreground cursor-pointer'
                                )}
                              >
                                {v}
                              </button>
                            )
                          })}
                        </div>
                      )}

                      {q.type === 'short_answer' && (
                        <Input
                          value={answers[q.id] ?? ''}
                          onChange={(e) => setAnswer(q.id, e.target.value)}
                          placeholder="Nhập câu trả lời..."
                          disabled={submitted}
                          className={cn(
                            'text-xs h-8',
                            submitted && correct && 'border-emerald-500 text-emerald-400',
                            submitted && !correct && 'border-red-500 text-red-400'
                          )}
                        />
                      )}

                      {q.type === 'matching' && q.options && (
                        <select
                          value={answers[q.id] ?? ''}
                          onChange={(e) => setAnswer(q.id, e.target.value)}
                          disabled={submitted}
                          className={cn(
                            'w-full rounded-lg border border-border bg-input px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500',
                            submitted && correct && 'border-emerald-500',
                            submitted && !correct && 'border-red-500'
                          )}
                        >
                          <option value="">-- Chọn đáp án --</option>
                          {q.options.map((opt, oi) => (
                            <option key={oi} value={String(oi)}>
                              {String.fromCharCode(65 + oi)}. {opt}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    {submitted && (
                      <AnimatePresence>
                        {q.explanation && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-3 ml-5 overflow-hidden"
                          >
                            <div className={cn(
                              'rounded-lg px-3 py-2 text-xs',
                              correct ? 'bg-emerald-500/10 text-emerald-300' : 'bg-red-500/10 text-muted-foreground'
                            )}>
                              {q.explanation}
                              {!correct && (
                                <span className="text-emerald-400 ml-1 font-medium">
                                  Đáp án: {String(q.correct)}
                                </span>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                )
              })}

              {/* Submit button inside questions panel */}
              {!submitted && (
                <Button
                  onClick={handleSubmit}
                  variant="gradient"
                  className="w-full"
                  disabled={answered === 0}
                  loading={saving}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Nộp bài ({answered}/{questions.length})
                </Button>
              )}

              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-4 text-center"
                >
                  <p className="text-2xl font-bold text-foreground">
                    {score}/{questions.length}
                  </p>
                  <p className="text-sm text-muted-foreground mb-3">
                    Band ước tính: <span className="text-teal-400 font-medium">{bandEstimate?.toFixed(1)}</span>
                  </p>
                  <Button variant="outline" size="sm" onClick={() => router.push('/reading')}>
                    Bài tiếp theo
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
