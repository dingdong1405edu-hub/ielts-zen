'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  Volume2,
  VolumeX,
  AlertTriangle,
  Headphones,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface Question {
  id: string
  type: 'multiple_choice' | 'short_answer' | 'matching' | 'true_false_ng'
  question: string
  options?: string[]
  correct: string | number
  explanation?: string
}

interface ListeningTestProps {
  test: {
    id: string
    title: string
    audioUrl: string
    questions: Question[]
    timeLimit: number
  }
  userId: string
}

const SPEEDS = [0.75, 1.0, 1.25] as const
type SpeedType = typeof SPEEDS[number]

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

export function ListeningTestClient({ test, userId }: ListeningTestProps) {
  const router = useRouter()
  const audioRef = useRef<HTMLAudioElement>(null)

  const questions = test.questions

  // Audio state
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [speed, setSpeed] = useState<SpeedType>(1.0)
  const [muted, setMuted] = useState(false)
  const [playCount, setPlayCount] = useState(0)
  const [hasStartedOnce, setHasStartedOnce] = useState(false)
  const [audioReady, setAudioReady] = useState(false)
  const [audioError, setAudioError] = useState(false)
  const MAX_PLAYS = 2

  // Test state
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState<number | null>(null)
  const [bandEstimate, setBandEstimate] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(test.timeLimit * 60)
  const [saving, setSaving] = useState(false)

  // Ref to avoid stale closure in timer
  const handleSubmitRef = useRef<() => void>(() => {})

  // Timer countdown
  useEffect(() => {
    if (submitted || timeLeft <= 0) return
    const t = setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) {
          clearInterval(t)
          handleSubmitRef.current()
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [submitted])

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onDurationChange = () => {
      if (isFinite(audio.duration)) setDuration(audio.duration)
    }
    const onCanPlay = () => setAudioReady(true)
    const onPlay = () => {
      setIsPlaying(true)
      if (!hasStartedOnce) {
        setHasStartedOnce(true)
        setPlayCount((c) => c + 1)
      }
    }
    const onPause = () => setIsPlaying(false)
    const onEnded = () => {
      setIsPlaying(false)
    }
    const onError = () => setAudioError(true)

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('durationchange', onDurationChange)
    audio.addEventListener('canplay', onCanPlay)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('error', onError)

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('durationchange', onDurationChange)
      audio.removeEventListener('canplay', onCanPlay)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('error', onError)
    }
  }, [hasStartedOnce])

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = speed
  }, [speed])

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted
  }, [muted])

  const canPlay = playCount < MAX_PLAYS || isPlaying

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      if (playCount >= MAX_PLAYS) return
      // If ended, restart for second play
      if (audio.ended || audio.currentTime === audio.duration) {
        if (playCount >= MAX_PLAYS) return
        audio.currentTime = 0
      }
      audio.play().catch(() => setAudioError(true))
    }
  }

  const replayFromStart = () => {
    const audio = audioRef.current
    if (!audio || playCount >= MAX_PLAYS) return
    audio.currentTime = 0
    setPlayCount((c) => c + 1)
    audio.play().catch(() => setAudioError(true))
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio || !duration) return
    const t = (parseFloat(e.target.value) / 100) * duration
    audio.currentTime = t
    setCurrentTime(t)
  }

  const rewind10 = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = Math.max(0, audio.currentTime - 10)
  }

  const cycleSpeed = () => {
    const idx = SPEEDS.indexOf(speed)
    setSpeed(SPEEDS[(idx + 1) % SPEEDS.length])
  }

  const formatTime = (s: number) => {
    if (!isFinite(s) || isNaN(s)) return '0:00'
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const formatCountdown = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
  }

  const setAnswer = (qId: string, value: string) => {
    if (submitted) return
    setAnswers((prev) => ({ ...prev, [qId]: value }))
  }

  const isCorrect = useCallback((q: Question) => {
    const ans = (answers[q.id] ?? '').toLowerCase().trim()
    const cor = String(q.correct).toLowerCase().trim()
    return ans === cor
  }, [answers])

  const handleSubmit = useCallback(async () => {
    if (submitted) return
    let correct = 0
    questions.forEach((q) => {
      const ans = (answers[q.id] ?? '').toLowerCase().trim()
      const cor = String(q.correct).toLowerCase().trim()
      if (ans === cor) correct++
    })
    const pct = questions.length > 0 ? (correct / questions.length) * 100 : 0
    const band = scoreToBand(pct)
    setScore(correct)
    setBandEstimate(band)
    setSubmitted(true)

    audioRef.current?.pause()

    setSaving(true)
    try {
      await fetch('/api/user/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: 'listening',
          lessonId: test.id,
          score: Math.round(pct),
          xp: 20,
        }),
      })
      await fetch('/api/user/test-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testType: 'listening',
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

  // Keep ref updated
  useEffect(() => {
    handleSubmitRef.current = handleSubmit
  }, [handleSubmit])

  const answered = Object.keys(answers).length
  const progressPct = questions.length > 0 ? Math.round((answered / questions.length) * 100) : 0
  const audioProgress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <audio ref={audioRef} src={test.audioUrl} preload="metadata" />

      {/* Top bar */}
      <div className="shrink-0 border-b border-border bg-card px-4 py-2.5">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ChevronLeft className="w-4 h-4 mr-1" />
              Thoát
            </Button>
            <h1 className="text-sm font-semibold hidden sm:block truncate max-w-[220px]">
              {test.title}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">
              {answered}/{questions.length}
            </span>
            <div className={cn(
              'flex items-center gap-1.5 text-sm font-mono font-bold',
              timeLeft < 300 && !submitted ? 'text-red-400' : 'text-foreground'
            )}>
              <Clock className="w-4 h-4" />
              {formatCountdown(timeLeft)}
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
      </div>

      {/* Result banner */}
      <AnimatePresence>
        {submitted && score !== null && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="shrink-0 bg-gradient-to-r from-blue-600/20 to-cyan-500/20 border-b border-blue-500/30 px-4 py-2"
          >
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <span className="text-sm">
                Kết quả:{' '}
                <strong className="text-foreground">{score}/{questions.length}</strong> câu đúng
                ({Math.round((score / questions.length) * 100)}%) — Band:{' '}
                <strong className="text-blue-400">{bandEstimate?.toFixed(1)}</strong>
              </span>
              {saving && <span className="text-xs text-muted-foreground">Đang lưu...</span>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

          {/* Audio Player Card */}
          <Card className={cn(
            'border-2 transition-colors',
            playCount >= MAX_PLAYS && !submitted ? 'border-red-500/30' : 'border-green-500/20'
          )}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Headphones className="w-5 h-5 text-green-400" />
                  <CardTitle className="text-base">Bài nghe</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  {playCount >= MAX_PLAYS && !submitted ? (
                    <Badge variant="destructive" className="text-xs">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Hết lượt nghe ({MAX_PLAYS}/{MAX_PLAYS})
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      Còn {MAX_PLAYS - playCount} lượt nghe
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {audioError ? (
                <div className="text-center py-6 text-muted-foreground text-sm">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                  <p>Không thể tải audio.</p>
                  <p className="text-xs mt-1">Kiểm tra đường dẫn: {test.audioUrl}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Audio waveform visual */}
                  <div className="flex items-center gap-px h-10 justify-center overflow-hidden">
                    {Array.from({ length: 60 }).map((_, i) => {
                      const h = 15 + Math.abs(Math.sin(i * 0.8) * 20 + Math.cos(i * 0.3) * 15)
                      const isActive = duration > 0 && (i / 60) <= (currentTime / duration)
                      return (
                        <div
                          key={i}
                          className={cn(
                            'w-1 rounded-sm transition-all duration-75',
                            isPlaying && isActive ? 'bg-green-400' : isActive ? 'bg-green-600' : 'bg-border'
                          )}
                          style={{ height: `${Math.max(3, Math.min(40, h))}px` }}
                        />
                      )
                    })}
                  </div>

                  {/* Seek slider */}
                  <div className="space-y-1">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={0.1}
                      value={audioProgress}
                      onChange={handleSeek}
                      className="w-full h-1.5 appearance-none rounded-full cursor-pointer bg-border accent-green-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-400 [&::-webkit-slider-thumb]:cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  {/* Controls row */}
                  <div className="flex items-center justify-between">
                    {/* Left: mute */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setMuted((m) => !m)}
                      title={muted ? 'Bật tiếng' : 'Tắt tiếng'}
                    >
                      {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>

                    {/* Center: rewind + play + speed */}
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={rewind10}
                        title="Tua lại 10 giây"
                        className="h-8 px-2 text-xs"
                      >
                        <RotateCcw className="w-3.5 h-3.5 mr-1" />
                        -10s
                      </Button>

                      <Button
                        size="icon"
                        className={cn(
                          'w-12 h-12 rounded-full',
                          playCount >= MAX_PLAYS && !isPlaying
                            ? 'bg-muted text-muted-foreground cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        )}
                        onClick={togglePlay}
                        disabled={(!audioReady && !audioError) || (playCount >= MAX_PLAYS && !isPlaying)}
                      >
                        {!audioReady && !audioError ? (
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : isPlaying ? (
                          <Pause className="w-5 h-5" />
                        ) : (
                          <Play className="w-5 h-5" />
                        )}
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={cycleSpeed}
                        title="Thay đổi tốc độ phát"
                        className="h-8 px-2 text-xs"
                      >
                        <FastForward className="w-3.5 h-3.5 mr-1" />
                        {speed}x
                      </Button>
                    </div>

                    {/* Right: replay */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={replayFromStart}
                      disabled={playCount >= MAX_PLAYS}
                      className="text-xs"
                      title="Nghe lại từ đầu"
                    >
                      <RotateCcw className="w-3.5 h-3.5 mr-1" />
                      Lại
                    </Button>
                  </div>

                  {playCount > 0 && !submitted && (
                    <div className="text-center">
                      <div className="flex justify-center gap-2">
                        {Array.from({ length: MAX_PLAYS }).map((_, i) => (
                          <div
                            key={i}
                            className={cn(
                              'w-2 h-2 rounded-full',
                              i < playCount ? 'bg-green-400' : 'bg-border'
                            )}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {playCount}/{MAX_PLAYS} lượt nghe đã dùng
                        {playCount >= MAX_PLAYS && ' — Không thể nghe thêm'}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Answer progress */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Tiến độ làm bài</span>
              <span>{answered}/{questions.length} câu</span>
            </div>
            <Progress value={progressPct} className="h-1.5" indicatorClassName="bg-green-500" />
          </div>

          {/* Questions */}
          <div className="space-y-4">
            {questions.map((q, i) => {
              const correct = submitted ? isCorrect(q) : null
              return (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.025 }}
                >
                  <Card className={cn(
                    'border transition-colors',
                    submitted && correct === true && 'border-emerald-500/50 bg-emerald-500/5',
                    submitted && correct === false && 'border-red-500/50 bg-red-500/5',
                    !submitted && answers[q.id] && 'border-green-500/20'
                  )}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-2 mb-3">
                        <span className="text-xs font-bold text-muted-foreground w-6 shrink-0 pt-0.5">
                          {i + 1}.
                        </span>
                        <p className="text-sm font-medium leading-relaxed flex-1">{q.question}</p>
                        {submitted && (
                          correct
                            ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            : <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        )}
                      </div>

                      <div className="ml-6">
                        {q.type === 'multiple_choice' && q.options && (
                          <div className="space-y-2">
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
                                  <span className="font-semibold mr-2 text-muted-foreground">
                                    {String.fromCharCode(65 + oi)}.
                                  </span>
                                  {opt}
                                </button>
                              )
                            })}
                          </div>
                        )}

                        {q.type === 'true_false_ng' && (
                          <div className="flex flex-wrap gap-2">
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
                                    'rounded-lg border px-4 py-1.5 text-xs font-medium transition-all',
                                    isSelected && !submitted && 'border-blue-500 bg-blue-500/20 text-blue-300',
                                    isSelected && submitted && correct && 'border-emerald-500 bg-emerald-500/20 text-emerald-300',
                                    isSelected && submitted && !correct && 'border-red-500 bg-red-500/20 text-red-300',
                                    isCorrectOpt && !isSelected && 'border-emerald-500/40 bg-emerald-500/5 text-emerald-400',
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
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !submitted) e.currentTarget.blur()
                            }}
                            placeholder="Nhập câu trả lời..."
                            disabled={submitted}
                            className={cn(
                              'text-sm',
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
                              'w-full rounded-lg border border-border bg-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70',
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

                      {submitted && q.explanation && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-3 ml-6 overflow-hidden"
                        >
                          <div className={cn(
                            'rounded-lg px-3 py-2 text-xs',
                            correct
                              ? 'bg-emerald-500/10 text-emerald-300'
                              : 'bg-muted text-muted-foreground'
                          )}>
                            {q.explanation}
                            {!correct && (
                              <span className="text-emerald-400 ml-1 font-medium">
                                Đáp án đúng: {String(q.correct)}
                              </span>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          {/* Submit */}
          {!submitted && (
            <Button
              onClick={handleSubmit}
              variant="gradient"
              size="lg"
              className="w-full"
              disabled={answered === 0}
              loading={saving}
            >
              <Send className="w-4 h-4 mr-2" />
              Nộp bài ({answered}/{questions.length} câu đã trả lời)
            </Button>
          )}

          {submitted && score !== null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-green-500/20 bg-gradient-to-br from-green-500/5 to-transparent">
                <CardContent className="p-6 text-center space-y-3">
                  <p className="text-4xl font-extrabold text-foreground">
                    {score}/{questions.length}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {Math.round((score / questions.length) * 100)}% — Band ước tính:{' '}
                    <span className="text-green-400 font-semibold">{bandEstimate?.toFixed(1)}</span>
                  </p>
                  <Button variant="outline" onClick={() => router.push('/listening')}>
                    Bài tiếp theo
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
