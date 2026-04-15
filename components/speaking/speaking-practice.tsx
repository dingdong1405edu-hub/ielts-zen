'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Mic,
  MicOff,
  Play,
  Square,
  Send,
  AlertCircle,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  TrendingUp,
  Volume2,
} from 'lucide-react'

type Question = {
  id: string
  part: number
  band: number
  question: string
  topic: string | null
  tips: string | null
}

type Criterion = {
  score: number
  feedback: string
  strengths: string[]
  improvements: string[]
}

type FeedbackResult = {
  overall: number
  fc: Criterion
  pronunciation: Criterion
  lr: Criterion
  gra: Criterion
  overallFeedback: string
  keyImprovements: string[]
  sampleAnswer: string
  transcript: string
}

type Props = {
  question: Question
  userId: string
}

function getBandColor(score: number) {
  if (score >= 8) return 'text-emerald-400'
  if (score >= 7) return 'text-blue-400'
  if (score >= 6) return 'text-yellow-400'
  return 'text-orange-400'
}

function getBandBadgeVariant(score: number): 'success' | 'default' | 'warning' | 'destructive' {
  if (score >= 7) return 'success'
  if (score >= 6) return 'default'
  if (score >= 5) return 'warning'
  return 'destructive'
}

function ScoreBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(score / 9) * 100}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${
            score >= 7 ? 'bg-emerald-500' : score >= 6 ? 'bg-blue-500' : score >= 5 ? 'bg-yellow-500' : 'bg-orange-500'
          }`}
        />
      </div>
      <span className={`text-sm font-bold w-8 text-right ${getBandColor(score)}`}>
        {score.toFixed(1)}
      </span>
    </div>
  )
}

function CriterionCard({ label, criterion }: { label: string; criterion: Criterion }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
        onClick={() => setExpanded((e) => !e)}
      >
        <div className="flex-1 text-left">
          <div className="flex items-center gap-3 mb-1.5">
            <span className="text-sm font-semibold">{label}</span>
            <Badge variant={getBandBadgeVariant(criterion.score)}>
              Band {criterion.score.toFixed(1)}
            </Badge>
          </div>
          <ScoreBar score={criterion.score} />
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 ml-3 flex-shrink-0 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 ml-3 flex-shrink-0 text-muted-foreground" />}
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3">
              <p className="text-sm text-muted-foreground">{criterion.feedback}</p>
              {criterion.strengths.length > 0 && (
                <div>
                  <div className="text-xs font-medium text-emerald-400 mb-1.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Strengths
                  </div>
                  <ul className="space-y-1">
                    {criterion.strengths.map((s, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                        <span className="text-emerald-400 mt-0.5">•</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {criterion.improvements.length > 0 && (
                <div>
                  <div className="text-xs font-medium text-blue-400 mb-1.5 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    To improve
                  </div>
                  <ul className="space-y-1">
                    {criterion.improvements.map((s, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                        <span className="text-blue-400 mt-0.5">•</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const CRITERIA_LABELS: Record<string, string> = {
  fc: 'Fluency & Coherence',
  pronunciation: 'Pronunciation',
  lr: 'Lexical Resource',
  gra: 'Grammatical Range & Accuracy',
}

export function SpeakingPractice({ question, userId }: Props) {
  const [status, setStatus] = useState<'idle' | 'recording' | 'recorded' | 'submitting' | 'done'>('idle')
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [showTips, setShowTips] = useState(false)
  const [lowTokens, setLowTokens] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animFrameRef = useRef<number>(0)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Check token balance
  useEffect(() => {
    fetch('/api/user/tokens')
      .then((r) => r.json())
      .then((d) => {
        if (d.tokens < 2 && !d.isPremium) setLowTokens(true)
      })
      .catch(() => {})
  }, [])

  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current
    const analyser = analyserRef.current
    if (!canvas || !analyser) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const draw = () => {
      animFrameRef.current = requestAnimationFrame(draw)
      analyser.getByteFrequencyData(dataArray)

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const barWidth = (canvas.width / bufferLength) * 2.5
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height * 0.8
        const hue = 220 + (dataArray[i] / 255) * 40
        ctx.fillStyle = `hsl(${hue}, 80%, 60%)`
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight)
        x += barWidth
      }
    }

    draw()
  }, [])

  const stopWaveform = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current)
      animFrameRef.current = 0
    }
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      ctx?.clearRect(0, 0, canvas.width, canvas.height)
    }
  }, [])

  const startRecording = async () => {
    setError(null)
    chunksRef.current = []
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      // Set up audio analyser for waveform
      const audioCtx = new AudioContext()
      const source = audioCtx.createMediaStreamSource(stream)
      const analyser = audioCtx.createAnalyser()
      analyser.fftSize = 256
      source.connect(analyser)
      analyserRef.current = analyser

      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' })
      mediaRecorderRef.current = recorder

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        setAudioUrl(URL.createObjectURL(blob))
        stream.getTracks().forEach((t) => t.stop())
        stopWaveform()
        audioCtx.close()
      }

      recorder.start(100)
      setStatus('recording')
      setRecordingTime(0)

      timerRef.current = setInterval(() => setRecordingTime((t) => t + 1), 1000)
      drawWaveform()
    } catch {
      setError('Cannot access microphone. Please check your browser permissions.')
    }
  }

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    mediaRecorderRef.current?.stop()
    setStatus('recorded')
  }

  const handleSubmit = async () => {
    if (!audioBlob) return
    setStatus('submitting')
    setError(null)

    const formData = new FormData()
    formData.append('audio', audioBlob, 'recording.webm')
    formData.append('question', question.question)
    formData.append('part', String(question.part))
    formData.append('questionId', question.id)
    formData.append('userId', userId)

    try {
      const res = await fetch('/api/ai/grade-speaking', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Grading failed')
      }

      const data = await res.json()
      // API returns { success, transcript, feedback } shape
      const fb = data.feedback ?? data
      setFeedback({ ...fb, transcript: data.transcript ?? fb.transcript ?? '' })
      setStatus('done')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred')
      setStatus('recorded')
    }
  }

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  const handleRetry = () => {
    setStatus('idle')
    setAudioUrl(null)
    setAudioBlob(null)
    setFeedback(null)
    setError(null)
    setRecordingTime(0)
  }

  return (
    <div className="space-y-6">
      {/* Question Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Badge variant="default">Part {question.part}</Badge>
              <Badge variant="secondary">Band {question.band.toFixed(1)}</Badge>
              {question.topic && <Badge variant="outline">{question.topic}</Badge>}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-base font-medium leading-relaxed text-foreground mb-4">
            {question.question}
          </p>
          {question.tips && (
            <div>
              <button
                className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                onClick={() => setShowTips((s) => !s)}
              >
                <Lightbulb className="w-3.5 h-3.5" />
                {showTips ? 'Hide tips' : 'Show tips'}
              </button>
              <AnimatePresence>
                {showTips && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="text-xs text-muted-foreground mt-2 p-3 bg-muted/50 rounded-lg border border-border">
                      {question.tips}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Token warning */}
      {lowTokens && status !== 'done' && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          Bạn còn ít token. Nâng cấp Premium để luyện tập không giới hạn.
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Recording controls */}
      {status !== 'done' && (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-5">
              {/* Waveform canvas */}
              <canvas
                ref={canvasRef}
                width={400}
                height={60}
                className={`w-full rounded-lg bg-muted/50 ${status !== 'recording' ? 'opacity-30' : ''}`}
              />

              {/* Timer */}
              {status === 'recording' && (
                <motion.div
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="flex items-center gap-2 text-red-400 font-mono text-sm"
                >
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  REC {formatTime(recordingTime)}
                </motion.div>
              )}

              {/* Record button */}
              <div className="relative">
                {status === 'recording' && (
                  <>
                    <motion.div
                      animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                      className="absolute inset-0 rounded-full bg-red-500/30"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.8], opacity: [0.4, 0] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }}
                      className="absolute inset-0 rounded-full bg-red-500/20"
                    />
                  </>
                )}
                <Button
                  size="xl"
                  variant={status === 'recording' ? 'destructive' : 'gradient'}
                  className="relative w-20 h-20 rounded-full text-white"
                  onClick={status === 'recording' ? stopRecording : startRecording}
                  disabled={status === 'submitting'}
                >
                  {status === 'recording' ? (
                    <Square className="w-6 h-6" />
                  ) : (
                    <Mic className="w-6 h-6" />
                  )}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                {status === 'idle' && 'Click to start recording'}
                {status === 'recording' && 'Click to stop recording'}
                {status === 'recorded' && 'Recording complete — review or submit'}
              </p>

              {/* Playback & submit */}
              {status === 'recorded' && audioUrl && (
                <div className="w-full space-y-4">
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border border-border">
                    <Volume2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <audio src={audioUrl} controls className="flex-1 h-8" />
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={handleRetry}>
                      <MicOff className="w-4 h-4" />
                      Re-record
                    </Button>
                    <Button
                      variant="gradient"
                      className="flex-1"
                      onClick={handleSubmit}
                      disabled={lowTokens}
                    >
                      <Send className="w-4 h-4" />
                      Submit for AI feedback
                    </Button>
                  </div>
                </div>
              )}

              {/* Loading skeleton */}
              {status === 'submitting' && (
                <div className="w-full space-y-3">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
                  <p className="text-xs text-muted-foreground text-center">Transcribing & grading your response…</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feedback Result */}
      <AnimatePresence>
        {status === 'done' && feedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            {/* Overall score */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold">Your Score</h2>
                    <p className="text-sm text-muted-foreground">AI Examiner Feedback</p>
                  </div>
                  <div className={`text-5xl font-bold ${getBandColor(feedback.overall)}`}>
                    {feedback.overall.toFixed(1)}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feedback.overallFeedback}
                </p>
              </CardContent>
            </Card>

            {/* Transcript */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-muted-foreground" />
                  Your Transcript
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  &ldquo;{feedback.transcript}&rdquo;
                </p>
              </CardContent>
            </Card>

            {/* Criteria */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide px-1">
                Criterion Breakdown
              </h3>
              <CriterionCard label={CRITERIA_LABELS.fc} criterion={feedback.fc} />
              <CriterionCard label={CRITERIA_LABELS.pronunciation} criterion={feedback.pronunciation} />
              <CriterionCard label={CRITERIA_LABELS.lr} criterion={feedback.lr} />
              <CriterionCard label={CRITERIA_LABELS.gra} criterion={feedback.gra} />
            </div>

            {/* Key improvements */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  Key Improvements
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2">
                  {feedback.keyImprovements.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-blue-400 font-bold flex-shrink-0 mt-0.5">{i + 1}.</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Sample answer */}
            <Card className="border-blue-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-blue-400">
                  <CheckCircle2 className="w-4 h-4" />
                  Model Answer
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feedback.sampleAnswer}
                </p>
              </CardContent>
            </Card>

            {/* Try again */}
            <Button variant="outline" className="w-full" onClick={handleRetry}>
              <Mic className="w-4 h-4" />
              Practice Again
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
