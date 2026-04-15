'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Mic, ChevronRight, BookOpen } from 'lucide-react'

type Question = {
  id: string
  part: number
  band: number
  question: string
  topic: string | null
  tips: string | null
  createdAt: Date
}

type Props = {
  grouped: {
    1: Question[]
    2: Question[]
    3: Question[]
  }
}

function getBandColor(band: number) {
  if (band >= 8) return 'success'
  if (band >= 7) return 'default'
  if (band >= 6) return 'warning'
  return 'secondary'
}

function getBandLabel(band: number) {
  if (band >= 8) return 'Advanced'
  if (band >= 7) return 'Upper-Inter'
  if (band >= 6) return 'Intermediate'
  return 'Foundation'
}

const partDescriptions: Record<number, string> = {
  1: 'Familiar topics — introduce yourself, talk about your daily life, hobbies & preferences.',
  2: 'Individual long turn — speak for 1–2 minutes on a given topic card.',
  3: 'Two-way discussion — abstract and analytical questions related to Part 2 topic.',
}

function QuestionCard({ q }: { q: Question }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="card-hover">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {q.topic && (
                  <Badge variant="secondary" className="text-xs">
                    {q.topic}
                  </Badge>
                )}
                <Badge variant={getBandColor(q.band) as 'default' | 'secondary' | 'warning' | 'success'}>
                  Band {q.band.toFixed(1)} — {getBandLabel(q.band)}
                </Badge>
              </div>
              <p className="text-sm font-medium text-foreground line-clamp-2 leading-relaxed">
                {q.question}
              </p>
              {q.tips && (
                <p className="text-xs text-muted-foreground mt-2 flex items-start gap-1">
                  <BookOpen className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-1">{q.tips}</span>
                </p>
              )}
            </div>
            <Link href={`/speaking/${q.id}`} className="flex-shrink-0">
              <Button size="sm" variant="outline" className="gap-1.5">
                <Mic className="w-3.5 h-3.5" />
                Practice
                <ChevronRight className="w-3 h-3" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function SpeakingList({ grouped }: Props) {
  const [filter, setFilter] = useState<'all' | 'foundation' | 'intermediate' | 'advanced'>('all')

  const filterQuestions = (qs: Question[]) => {
    if (filter === 'all') return qs
    if (filter === 'foundation') return qs.filter((q) => q.band < 6)
    if (filter === 'intermediate') return qs.filter((q) => q.band >= 6 && q.band < 7)
    if (filter === 'advanced') return qs.filter((q) => q.band >= 7)
    return qs
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center">
            <Mic className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Speaking Practice</h1>
            <p className="text-sm text-muted-foreground">
              {grouped[1].length + grouped[2].length + grouped[3].length} questions across 3 parts
            </p>
          </div>
        </div>
      </div>

      {/* Band filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(['all', 'foundation', 'intermediate', 'advanced'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all capitalize ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Parts tabs */}
      <Tabs defaultValue="1">
        <TabsList className="mb-6 w-full">
          <TabsTrigger value="1" className="flex-1">Part 1</TabsTrigger>
          <TabsTrigger value="2" className="flex-1">Part 2</TabsTrigger>
          <TabsTrigger value="3" className="flex-1">Part 3</TabsTrigger>
        </TabsList>

        {([1, 2, 3] as const).map((part) => (
          <TabsContent key={part} value={String(part)}>
            <div className="mb-4 p-3 rounded-lg bg-muted/50 border border-border">
              <p className="text-sm text-muted-foreground">{partDescriptions[part]}</p>
            </div>
            {filterQuestions(grouped[part]).length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Mic className="w-8 h-8 mx-auto mb-3 opacity-40" />
                <p>No questions found for this filter.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filterQuestions(grouped[part]).map((q) => (
                  <QuestionCard key={q.id} q={q} />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
