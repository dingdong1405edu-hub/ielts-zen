'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  CheckCircle2,
  Clock,
  BookOpen,
  Target,
  ChevronRight,
  Trophy,
  Zap,
  Star,
} from 'lucide-react'

// 40 IELTS-style multiple choice questions
const QUESTIONS = [
  // Vocabulary (1-20)
  {
    id: 'q1',
    text: 'The scientist made a significant _____ to the field of molecular biology.',
    options: ['contribution', 'distribution', 'attribution', 'retribution'],
    correct: 'contribution',
    category: 'vocabulary',
  },
  {
    id: 'q2',
    text: 'The new policy will _____ the way companies report their financial data.',
    options: ['transform', 'conform', 'inform', 'reform'],
    correct: 'transform',
    category: 'vocabulary',
  },
  {
    id: 'q3',
    text: 'Despite the _____ evidence, the jury remained unconvinced.',
    options: ['compelling', 'repelling', 'expelling', 'dispelling'],
    correct: 'compelling',
    category: 'vocabulary',
  },
  {
    id: 'q4',
    text: 'The government must _____ immediate action to address climate change.',
    options: ['implement', 'supplement', 'complement', 'increment'],
    correct: 'implement',
    category: 'vocabulary',
  },
  {
    id: 'q5',
    text: 'The report _____ several key factors contributing to urban poverty.',
    options: ['identified', 'specified', 'notified', 'rectified'],
    correct: 'identified',
    category: 'vocabulary',
  },
  {
    id: 'q6',
    text: 'The company\'s rapid expansion was _____ by a lack of skilled workers.',
    options: ['hampered', 'tempered', 'pampered', 'tampered'],
    correct: 'hampered',
    category: 'vocabulary',
  },
  {
    id: 'q7',
    text: 'Researchers have found a strong _____ between diet and cognitive function.',
    options: ['correlation', 'deliberation', 'exaggeration', 'moderation'],
    correct: 'correlation',
    category: 'vocabulary',
  },
  {
    id: 'q8',
    text: 'The treaty was _____ after months of intense negotiation.',
    options: ['ratified', 'sanctified', 'dignified', 'pacified'],
    correct: 'ratified',
    category: 'vocabulary',
  },
  {
    id: 'q9',
    text: 'The museum\'s new exhibit will _____ ancient artifacts from Egypt.',
    options: ['showcase', 'foreclose', 'disclose', 'enclose'],
    correct: 'showcase',
    category: 'vocabulary',
  },
  {
    id: 'q10',
    text: 'The _____ of the new law was met with mixed reactions from the public.',
    options: ['implementation', 'imagination', 'implication', 'importation'],
    correct: 'implementation',
    category: 'vocabulary',
  },
  {
    id: 'q11',
    text: 'The professor gave a _____ lecture on the history of the Roman Empire.',
    options: ['comprehensive', 'apprehensive', 'reprehensive', 'inexpensive'],
    correct: 'comprehensive',
    category: 'vocabulary',
  },
  {
    id: 'q12',
    text: 'The _____ effects of pollution on marine life are becoming more apparent.',
    options: ['devastating', 'elevating', 'motivating', 'liberating'],
    correct: 'devastating',
    category: 'vocabulary',
  },
  {
    id: 'q13',
    text: 'The team worked _____ to meet the project deadline.',
    options: ['diligently', 'negligently', 'indulgently', 'delinquently'],
    correct: 'diligently',
    category: 'vocabulary',
  },
  {
    id: 'q14',
    text: 'The new bridge will _____ transport links between the two cities.',
    options: ['enhance', 'enance', 'entance', 'expanse'],
    correct: 'enhance',
    category: 'vocabulary',
  },
  {
    id: 'q15',
    text: 'Scientists are _____ the potential benefits of gene therapy.',
    options: ['investigating', 'invigorating', 'instigating', 'intimidating'],
    correct: 'investigating',
    category: 'vocabulary',
  },
  {
    id: 'q16',
    text: 'The _____ of renewable energy sources is crucial for a sustainable future.',
    options: ['proliferation', 'consideration', 'deliberation', 'exaggeration'],
    correct: 'proliferation',
    category: 'vocabulary',
  },
  {
    id: 'q17',
    text: 'The new drug has shown _____ results in clinical trials.',
    options: ['promising', 'comprising', 'surprising', 'appraising'],
    correct: 'promising',
    category: 'vocabulary',
  },
  {
    id: 'q18',
    text: 'The architect\'s design was praised for its _____ use of natural light.',
    options: ['innovative', 'provocative', 'evocative', 'imitative'],
    correct: 'innovative',
    category: 'vocabulary',
  },
  {
    id: 'q19',
    text: 'The charity relies on _____ donations from the local community.',
    options: ['generous', 'ominous', 'harmonious', 'notorious'],
    correct: 'generous',
    category: 'vocabulary',
  },
  {
    id: 'q20',
    text: 'The _____ of the ancient temple attracted thousands of tourists each year.',
    options: ['magnificence', 'indifference', 'confidence', 'correspondence'],
    correct: 'magnificence',
    category: 'vocabulary',
  },
  // Grammar (21-40)
  {
    id: 'q21',
    text: 'By the time the rescue team arrived, the survivors _____ for three days.',
    options: ['had been waiting', 'were waiting', 'have been waiting', 'waited'],
    correct: 'had been waiting',
    category: 'grammar',
  },
  {
    id: 'q22',
    text: 'If the government _____ more funding to education, literacy rates would improve.',
    options: ['allocated', 'allocates', 'would allocate', 'has allocated'],
    correct: 'allocated',
    category: 'grammar',
  },
  {
    id: 'q23',
    text: 'The research paper, _____ by three scientists, was published last month.',
    options: ['co-authored', 'co-authoring', 'co-author', 'co-authors'],
    correct: 'co-authored',
    category: 'grammar',
  },
  {
    id: 'q24',
    text: 'Not only _____ the project on time, but they also exceeded expectations.',
    options: ['did they complete', 'they completed', 'they did complete', 'completed they'],
    correct: 'did they complete',
    category: 'grammar',
  },
  {
    id: 'q25',
    text: 'The data _____ collected over a period of ten years before being analysed.',
    options: ['were', 'was', 'had', 'have'],
    correct: 'were',
    category: 'grammar',
  },
  {
    id: 'q26',
    text: 'Despite _____ extensively about the topic, she felt underprepared.',
    options: ['having read', 'reading', 'having been read', 'read'],
    correct: 'having read',
    category: 'grammar',
  },
  {
    id: 'q27',
    text: 'The committee recommended that the policy _____ immediately.',
    options: ['be revised', 'is revised', 'was revised', 'were revised'],
    correct: 'be revised',
    category: 'grammar',
  },
  {
    id: 'q28',
    text: 'It was not until the experiment was repeated _____ the error became clear.',
    options: ['that', 'when', 'which', 'where'],
    correct: 'that',
    category: 'grammar',
  },
  {
    id: 'q29',
    text: 'The number of students enrolled in STEM programmes _____ dramatically.',
    options: ['has increased', 'have increased', 'had increase', 'are increasing'],
    correct: 'has increased',
    category: 'grammar',
  },
  {
    id: 'q30',
    text: 'Neither the manager nor the employees _____ aware of the policy change.',
    options: ['were', 'was', 'are being', 'is'],
    correct: 'were',
    category: 'grammar',
  },
  {
    id: 'q31',
    text: 'The findings suggest that further research _____ to confirm these results.',
    options: ['is needed', 'needs', 'are needed', 'need'],
    correct: 'is needed',
    category: 'grammar',
  },
  {
    id: 'q32',
    text: 'Rarely _____ such a dramatic improvement in air quality in so short a time.',
    options: ['has there been', 'there has been', 'has been there', 'been has there'],
    correct: 'has there been',
    category: 'grammar',
  },
  {
    id: 'q33',
    text: 'The study, _____ last year, has since been cited over 500 times.',
    options: ['published', 'which published', 'publishing', 'that published'],
    correct: 'published',
    category: 'grammar',
  },
  {
    id: 'q34',
    text: 'She is known for her ability to _____ complex ideas in simple terms.',
    options: ['articulate', 'articulation', 'articulating', 'articulated'],
    correct: 'articulate',
    category: 'grammar',
  },
  {
    id: 'q35',
    text: 'The more resources _____ to the project, the faster it will be completed.',
    options: ['are devoted', 'devote', 'devoted', 'is devoted'],
    correct: 'are devoted',
    category: 'grammar',
  },
  {
    id: 'q36',
    text: 'Had the scientists _____ the data correctly, they would have reached different conclusions.',
    options: ['interpreted', 'been interpreting', 'interpret', 'interpreting'],
    correct: 'interpreted',
    category: 'grammar',
  },
  {
    id: 'q37',
    text: 'The results of the survey _____ that consumer confidence is rising.',
    options: ['indicate', 'indicates', 'indicated', 'is indicating'],
    correct: 'indicate',
    category: 'grammar',
  },
  {
    id: 'q38',
    text: 'It is imperative that every citizen _____ their right to vote.',
    options: ['exercise', 'exercises', 'exercised', 'is exercising'],
    correct: 'exercise',
    category: 'grammar',
  },
  {
    id: 'q39',
    text: 'The CEO, along with her board members, _____ the merger proposal.',
    options: ['has approved', 'have approved', 'are approving', 'were approving'],
    correct: 'has approved',
    category: 'grammar',
  },
  {
    id: 'q40',
    text: 'Only after all safety checks _____ can construction begin.',
    options: ['have been completed', 'are completed', 'were completed', 'will be completed'],
    correct: 'have been completed',
    category: 'grammar',
  },
]

const CORRECT_MAP: Record<string, string> = QUESTIONS.reduce(
  (acc, q) => ({ ...acc, [q.id]: q.correct }),
  {}
)

const BAND_OPTIONS = [4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0]

function getBandColor(band: number) {
  if (band >= 8) return 'text-emerald-400'
  if (band >= 7) return 'text-blue-400'
  if (band >= 6) return 'text-yellow-400'
  return 'text-orange-400'
}

function getBandBg(band: number) {
  if (band >= 8) return 'bg-emerald-500/20 border-emerald-500/40'
  if (band >= 7) return 'bg-blue-500/20 border-blue-500/40'
  if (band >= 6) return 'bg-yellow-500/20 border-yellow-500/40'
  return 'bg-orange-500/20 border-orange-500/40'
}

function ConfettiPiece({ index }: { index: number }) {
  const colors = ['#3b82f6', '#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']
  const color = colors[index % colors.length]
  const left = `${(index * 7.3) % 100}%`
  const delay = `${(index * 0.1) % 1}s`
  const duration = `${0.8 + (index % 5) * 0.2}s`

  return (
    <motion.div
      className="absolute w-2 h-2 rounded-sm"
      style={{ left, top: '-10px', backgroundColor: color }}
      animate={{ y: ['0vh', '110vh'], rotate: [0, 720], opacity: [1, 0] }}
      transition={{ duration: parseFloat(duration), delay: parseFloat(delay), ease: 'easeIn' }}
    />
  )
}

export default function PlacementTestPage() {
  const router = useRouter()
  const [step, setStep] = useState<'welcome' | 'band-select' | 'test' | 'submitting' | 'result'>('welcome')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentQ, setCurrentQ] = useState(0)
  const [timeLeft, setTimeLeft] = useState(45 * 60)
  const [result, setResult] = useState<{ band: number; correct: number; total: number; percentage: number; recommendation: string } | null>(null)
  const [selectedBand, setSelectedBand] = useState<number | null>(null)
  const [startTime, setStartTime] = useState<number>(0)
  const [showConfetti, setShowConfetti] = useState(false)

  const handleSubmit = useCallback(async () => {
    setStep('submitting')
    const duration = Math.round((Date.now() - startTime) / 1000)
    try {
      const res = await fetch('/api/ai/placement-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, correct: CORRECT_MAP, duration }),
      })
      const data = await res.json()
      // API returns { success, result } shape
      setResult(data.result ?? data)
      setStep('result')
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 4000)
    } catch {
      setStep('test')
    }
  }, [answers, startTime])

  useEffect(() => {
    if (step !== 'test') return
    if (timeLeft <= 0) {
      handleSubmit()
      return
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearInterval(timer)
  }, [step, timeLeft, handleSubmit])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const handleAnswer = (questionId: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }))
  }

  const handleNext = () => {
    if (currentQ < QUESTIONS.length - 1) setCurrentQ((q) => q + 1)
  }

  const handlePrev = () => {
    if (currentQ > 0) setCurrentQ((q) => q - 1)
  }

  const handleBandSelect = async (band: number) => {
    setSelectedBand(band)
    try {
      await fetch('/api/ai/placement-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: {}, correct: {}, duration: 0, manualBand: band }),
      })
    } catch {
      // ignore errors, still redirect
    }
    router.push('/dashboard')
  }

  const answeredCount = Object.keys(answers).length
  const progress = (answeredCount / QUESTIONS.length) * 100

  // Welcome screen
  if (step === 'welcome') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg w-full"
        >
          <Card className="border-border">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-blue-600/20 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-blue-400" />
              </div>
              <CardTitle className="text-2xl">Placement Test</CardTitle>
              <p className="text-muted-foreground mt-2">
                Hãy làm bài kiểm tra 40 câu để xác định band điểm IELTS của bạn. Thời gian 45 phút.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-muted rounded-lg p-3">
                  <div className="text-lg font-bold text-foreground">40</div>
                  <div className="text-xs text-muted-foreground">Câu hỏi</div>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="text-lg font-bold text-foreground">45</div>
                  <div className="text-xs text-muted-foreground">Phút</div>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="text-lg font-bold text-foreground">4-9</div>
                  <div className="text-xs text-muted-foreground">Band</div>
                </div>
              </div>
              <Button
                variant="gradient"
                size="lg"
                className="w-full"
                onClick={() => {
                  setStep('test')
                  setStartTime(Date.now())
                }}
              >
                <Zap className="w-5 h-5" />
                Bắt đầu làm bài
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => setStep('band-select')}
              >
                <Target className="w-5 h-5" />
                Tự chọn band điểm
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  // Band selector
  if (step === 'band-select') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Chọn band điểm hiện tại</CardTitle>
              <p className="text-sm text-muted-foreground">
                Bạn đã biết trình độ của mình? Chọn band điểm để bắt đầu luyện tập phù hợp.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-2">
                {BAND_OPTIONS.map((band) => (
                  <motion.button
                    key={band}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleBandSelect(band)}
                    className={`p-3 rounded-lg border text-sm font-semibold transition-all ${
                      selectedBand === band
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-border hover:border-blue-500 hover:bg-blue-500/10'
                    }`}
                  >
                    {band.toFixed(1)}
                  </motion.button>
                ))}
              </div>
              <Button
                variant="ghost"
                className="w-full mt-4"
                onClick={() => setStep('welcome')}
              >
                Quay lại
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  // Test screen
  if (step === 'test') {
    const q = QUESTIONS[currentQ]
    const isAnswered = !!answers[q.id]

    return (
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b border-border px-4 py-3">
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                {currentQ + 1}/{QUESTIONS.length}
              </span>
              <span>đã trả lời: {answeredCount}</span>
            </div>
            <div className={`flex items-center gap-1.5 font-mono font-semibold ${timeLeft < 300 ? 'text-red-400' : 'text-foreground'}`}>
              <Clock className="w-4 h-4" />
              {formatTime(timeLeft)}
            </div>
          </div>
          <div className="max-w-2xl mx-auto mt-2">
            <Progress value={progress} className="h-1.5" />
          </div>
        </div>

        {/* Question */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={q.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-2 flex items-center gap-2">
                  <Badge variant={q.category === 'vocabulary' ? 'default' : 'secondary'}>
                    {q.category === 'vocabulary' ? 'Vocabulary' : 'Grammar'}
                  </Badge>
                  <span className="text-xs text-muted-foreground">Câu {currentQ + 1}</span>
                </div>
                <p className="text-lg font-medium mb-6 leading-relaxed">{q.text}</p>
                <div className="space-y-3">
                  {q.options.map((option, i) => {
                    const isSelected = answers[q.id] === option
                    const label = String.fromCharCode(65 + i)
                    return (
                      <motion.button
                        key={option}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAnswer(q.id, option)}
                        className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 ${
                          isSelected
                            ? 'border-blue-500 bg-blue-500/15 text-blue-300'
                            : 'border-border hover:border-blue-500/50 hover:bg-blue-500/5'
                        }`}
                      >
                        <span className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold ${
                          isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-border'
                        }`}>
                          {label}
                        </span>
                        <span>{option}</span>
                      </motion.button>
                    )
                  })}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <Button variant="outline" onClick={handlePrev} disabled={currentQ === 0}>
                Trước
              </Button>
              <div className="flex gap-1 max-w-xs overflow-x-auto">
                {QUESTIONS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentQ(i)}
                    className={`w-6 h-6 rounded text-xs flex-shrink-0 ${
                      i === currentQ
                        ? 'bg-blue-600 text-white'
                        : answers[QUESTIONS[i].id]
                        ? 'bg-blue-600/30 text-blue-300'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              {currentQ < QUESTIONS.length - 1 ? (
                <Button onClick={handleNext} disabled={!isAnswered}>
                  Tiếp <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  variant="gradient"
                  onClick={handleSubmit}
                  disabled={answeredCount < 20}
                >
                  Nộp bài
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Submitting
  if (step === 'submitting') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-4"
        >
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">AI đang phân tích kết quả của bạn...</p>
        </motion.div>
      </div>
    )
  }

  // Result
  if (step === 'result' && result) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {Array.from({ length: 60 }).map((_, i) => (
              <ConfettiPiece key={i} index={i} />
            ))}
          </div>
        )}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="max-w-md w-full"
        >
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <Trophy className="w-12 h-12 text-yellow-400 mx-auto" />
              </div>
              <CardTitle className="text-2xl">Kết quả của bạn</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Band score */}
              <div className={`text-center p-6 rounded-2xl border ${getBandBg(result.band)}`}>
                <div className={`text-6xl font-bold ${getBandColor(result.band)}`}>
                  {result.band.toFixed(1)}
                </div>
                <div className="text-sm text-muted-foreground mt-1">Estimated Band Score</div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-muted rounded-lg p-3">
                  <div className="text-xl font-bold text-emerald-400">{result.correct}</div>
                  <div className="text-xs text-muted-foreground">Đúng</div>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="text-xl font-bold text-red-400">{result.total - result.correct}</div>
                  <div className="text-xs text-muted-foreground">Sai</div>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="text-xl font-bold text-blue-400">{result.percentage}%</div>
                  <div className="text-xs text-muted-foreground">Điểm</div>
                </div>
              </div>

              {/* Recommendation */}
              <div className="bg-blue-600/10 border border-blue-600/30 rounded-xl p-4">
                <div className="flex items-start gap-2">
                  <Star className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-300">{result.recommendation}</p>
                </div>
              </div>

              <Button
                variant="gradient"
                size="lg"
                className="w-full"
                onClick={() => router.push('/dashboard')}
              >
                <CheckCircle2 className="w-5 h-5" />
                Bắt đầu luyện tập
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return null
}
