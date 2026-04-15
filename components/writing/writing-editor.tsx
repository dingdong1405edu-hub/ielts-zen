'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Send,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  FileText,
  Sparkles,
  Coins,
} from 'lucide-react'

type Prompt = {
  id: string
  taskType: string
  band: number
  prompt: string
  topic: string | null
}

type Criterion = {
  score: number
  feedback: string
  strengths: string[]
  improvements: string[]
}

type FeedbackResult = {
  overall: number
  ta: Criterion
  cc: Criterion
  lr: Criterion
  gra: Criterion
  overallFeedback: string
  keyImprovements: string[]
  improvedSample: string
}

type Props = {
  prompt: Prompt
  userId: string
}

const MIN_WORDS = { task1: 150, task2: 250 }
const IDEAL_WORDS = { task1: 200, task2: 300 }

const CRITERION_LABELS: Record<string, string> = {
  ta: 'Task Achievement / Task Response',
  cc: 'Coherence & Cohesion',
  lr: 'Lexical Resource',
  gra: 'Grammatical Range & Accuracy',
}

function countWords(text: string) {
  return text.trim() === '' ? 0 : text.trim().split(/\s+/).length
}

function getBandColor(score: number) {
  if (score >= 8) return 'text-emerald-400'
  if (score >= 7) return 'text-blue-400'
  if (score >= 6) return 'text-yellow-400'
  return 'text-orange-400'
}

function getBandBg(score: number) {
  if (score >= 8) return 'bg-emerald-500/15 border-emerald-500/40'
  if (score >= 7) return 'bg-blue-500/15 border-blue-500/40'
  if (score >= 6) return 'bg-yellow-500/15 border-yellow-500/40'
  return 'bg-orange-500/15 border-orange-500/40'
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
        className="w-full p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors text-left"
        onClick={() => setExpanded((e) => !e)}
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium mb-1.5">{label}</p>
          <ScoreBar score={criterion.score} />
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        )}
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

export function WritingEditor({ prompt, userId }: Props) {
  const [text, setText] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done'>('idle')
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const minWords = MIN_WORDS[prompt.taskType as 'task1' | 'task2'] ?? 150
  const idealWords = IDEAL_WORDS[prompt.taskType as 'task1' | 'task2'] ?? 250
  const wordCount = countWords(text)
  const isUnderMin = wordCount < minWords && wordCount > 0
  const isGood = wordCount >= minWords
  const wordCountColor = wordCount === 0
    ? 'text-muted-foreground'
    : isUnderMin
    ? 'text-red-400'
    : wordCount >= idealWords
    ? 'text-emerald-400'
    : 'text-yellow-400'

  const handleSubmit = async () => {
    if (wordCount < minWords) return
    setStatus('submitting')
    setError(null)

    try {
      const res = await fetch('/api/ai/grade-writing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskType: prompt.taskType,
          prompt: prompt.prompt,
          response: text,
          userId,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Grading failed')
      }

      const data = await res.json()
      // API returns { success, feedback } shape
      setFeedback(data.feedback ?? data)
      setStatus('done')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred')
      setStatus('idle')
    }
  }

  const handleReset = () => {
    setStatus('idle')
    setFeedback(null)
    setError(null)
    setText('')
  }

  return (
    <div className="space-y-6">
      {/* Task prompt */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="default">
              {prompt.taskType === 'task1' ? 'Task 1' : 'Task 2'}
            </Badge>
            <Badge variant="secondary">Band {prompt.band.toFixed(1)}+</Badge>
            {prompt.topic && <Badge variant="outline">{prompt.topic}</Badge>}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm leading-relaxed text-foreground whitespace-pre-line">
            {prompt.prompt}
          </p>
          <p className="text-xs text-muted-foreground mt-3">
            Minimum {minWords} words &bull; Recommended {idealWords}+ words
          </p>
        </CardContent>
      </Card>

      {/* Editor + Results layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Editor column */}
        <div className={`flex-1 transition-all duration-300 ${status === 'done' ? 'lg:w-1/2' : 'w-full'}`}>
          <Card>
            <CardContent className="p-0">
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={`Start writing your ${prompt.taskType === 'task1' ? 'Task 1' : 'Task 2'} response here...`}
                disabled={status === 'submitting' || status === 'done'}
                className="w-full min-h-[400px] p-4 bg-transparent text-foreground placeholder:text-muted-foreground resize-none focus:outline-none text-sm leading-relaxed rounded-xl"
              />
              <div className="px-4 pb-4 flex items-center justify-between border-t border-border pt-3 mt-0">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className={`text-sm font-medium tabular-nums ${wordCountColor}`}>
                    {wordCount} / {minWords} words
                  </span>
                  {isGood && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                  {isUnderMin && (
                    <span className="text-xs text-red-400">
                      {minWords - wordCount} more needed
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {status === 'done' ? (
                    <Button variant="outline" size="sm" onClick={handleReset}>
                      Write again
                    </Button>
                  ) : (
                    <Button
                      variant="gradient"
                      size="sm"
                      onClick={handleSubmit}
                      disabled={wordCount < minWords || status === 'submitting'}
                      loading={status === 'submitting'}
                    >
                      <Send className="w-4 h-4" />
                      <Coins className="w-3.5 h-3.5 opacity-80" />
                      Grade (1 token)
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error */}
          {error && (
            <div className="mt-3 flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Loading skeleton */}
          {status === 'submitting' && (
            <div className="mt-3 space-y-2 p-4 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
                AI examiner is grading your response…
              </div>
              {[100, 80, 90, 70].map((w, i) => (
                <div key={i} className={`h-3 bg-muted rounded animate-pulse`} style={{ width: `${w}%` }} />
              ))}
            </div>
          )}
        </div>

        {/* Results column (slides in on desktop) */}
        <AnimatePresence>
          {status === 'done' && feedback && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="flex-1 space-y-4"
            >
              {/* Overall score */}
              <div className={`p-5 rounded-2xl border ${getBandBg(feedback.overall)} flex items-center justify-between`}>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Overall Band Score
                  </div>
                  <div className={`text-5xl font-bold ${getBandColor(feedback.overall)}`}>
                    {feedback.overall.toFixed(1)}
                  </div>
                </div>
                <Sparkles className="w-8 h-8 text-muted-foreground opacity-50" />
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed px-1">
                {feedback.overallFeedback}
              </p>

              {/* Criteria */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Criterion Breakdown
                </h3>
                {(['ta', 'cc', 'lr', 'gra'] as const).map((key) => (
                  <CriterionCard key={key} label={CRITERION_LABELS[key]} criterion={feedback[key]} />
                ))}
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
                        <span className="text-blue-400 font-bold mt-0.5">{i + 1}.</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Improved sample */}
              <Card className="border-blue-500/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2 text-blue-400">
                    <CheckCircle2 className="w-4 h-4" />
                    Improved Opening Paragraph
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feedback.improvedSample}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
