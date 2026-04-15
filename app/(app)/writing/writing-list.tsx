'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { PenLine, ChevronRight, BarChart3 } from 'lucide-react'

type Prompt = {
  id: string
  taskType: string
  band: number
  prompt: string
  topic: string | null
  sampleBand6: string | null
  sampleBand8: string | null
  createdAt: Date
}

type Props = {
  task1: Prompt[]
  task2: Prompt[]
}

const task1Description =
  'Describe a visual (graph, chart, map, diagram). Min 150 words. 20 minutes.'
const task2Description =
  'Write an essay responding to an argument or point of view. Min 250 words. 40 minutes.'

function getBandVariant(band: number): 'success' | 'default' | 'warning' | 'secondary' {
  if (band >= 8) return 'success'
  if (band >= 7) return 'default'
  if (band >= 6) return 'warning'
  return 'secondary'
}

function PromptCard({ p }: { p: Prompt }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="card-hover">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {p.topic && (
                  <Badge variant="secondary" className="text-xs">
                    {p.topic}
                  </Badge>
                )}
                <Badge variant={getBandVariant(p.band)}>
                  Band {p.band.toFixed(1)}+
                </Badge>
                {p.sampleBand8 && (
                  <Badge variant="outline" className="text-xs">
                    Sample included
                  </Badge>
                )}
              </div>
              <p className="text-sm font-medium text-foreground leading-relaxed line-clamp-3">
                {p.prompt}
              </p>
            </div>
            <Link href={`/writing/${p.id}`} className="flex-shrink-0">
              <Button size="sm" variant="outline" className="gap-1.5">
                <PenLine className="w-3.5 h-3.5" />
                Write
                <ChevronRight className="w-3 h-3" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function WritingList({ task1, task2 }: Props) {
  const [bandFilter, setBandFilter] = useState<'all' | 'foundation' | 'intermediate' | 'advanced'>('all')

  const filter = (prompts: Prompt[]) => {
    if (bandFilter === 'all') return prompts
    if (bandFilter === 'foundation') return prompts.filter((p) => p.band < 6)
    if (bandFilter === 'intermediate') return prompts.filter((p) => p.band >= 6 && p.band < 7)
    if (bandFilter === 'advanced') return prompts.filter((p) => p.band >= 7)
    return prompts
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center">
            <PenLine className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Writing Practice</h1>
            <p className="text-sm text-muted-foreground">
              {task1.length + task2.length} prompts — AI grading in seconds
            </p>
          </div>
        </div>
      </div>

      {/* Band filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(['all', 'foundation', 'intermediate', 'advanced'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setBandFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all capitalize ${
              bandFilter === f
                ? 'bg-blue-600 text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <Tabs defaultValue="task2">
        <TabsList className="mb-6 w-full">
          <TabsTrigger value="task1" className="flex-1">
            Task 1
            <Badge variant="secondary" className="ml-2">{task1.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="task2" className="flex-1">
            Task 2
            <Badge variant="secondary" className="ml-2">{task2.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="task1">
          <div className="mb-4 p-3 rounded-lg bg-muted/50 border border-border flex items-start gap-2">
            <BarChart3 className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">{task1Description}</p>
          </div>
          {filter(task1).length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <PenLine className="w-8 h-8 mx-auto mb-3 opacity-40" />
              <p>No prompts found for this filter.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filter(task1).map((p) => (
                <PromptCard key={p.id} p={p} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="task2">
          <div className="mb-4 p-3 rounded-lg bg-muted/50 border border-border flex items-start gap-2">
            <PenLine className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">{task2Description}</p>
          </div>
          {filter(task2).length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <PenLine className="w-8 h-8 mx-auto mb-3 opacity-40" />
              <p>No prompts found for this filter.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filter(task2).map((p) => (
                <PromptCard key={p.id} p={p} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
