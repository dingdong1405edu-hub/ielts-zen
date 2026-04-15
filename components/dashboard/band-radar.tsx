'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts'
import { TrendingUp } from 'lucide-react'

export function BandRadarChart({ recentTests, currentBand }: { recentTests: any[], currentBand: number | null }) {
  // Build radar data from recent tests
  const byType: Record<string, number[]> = { listening: [], reading: [], writing: [], speaking: [] }
  recentTests.forEach(t => {
    const d = t.details as any
    if (d?.listening) byType.listening.push(d.listening)
    if (d?.reading) byType.reading.push(d.reading)
    if (d?.writing) byType.writing.push(d.writing)
    if (d?.speaking) byType.speaking.push(d.speaking)
  })

  const avg = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : currentBand ?? 0

  const data = [
    { skill: 'Listening', score: avg(byType.listening) || currentBand || 0 },
    { skill: 'Reading', score: avg(byType.reading) || currentBand || 0 },
    { skill: 'Writing', score: avg(byType.writing) || (currentBand ? currentBand - 0.5 : 0) },
    { skill: 'Speaking', score: avg(byType.speaking) || (currentBand ? currentBand - 0.5 : 0) },
  ]

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-blue-400" /> Band Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        {currentBand ? (
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={data}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="skill" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Radar
                name="Band"
                dataKey="score"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                labelStyle={{ color: '#f1f5f9' }}
                formatter={(v: any) => [v.toFixed(1), 'Band']}
              />
            </RadarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <p className="text-sm text-muted-foreground mb-3">Chưa có dữ liệu band</p>
            <p className="text-xs text-muted-foreground">Làm bài thi thử để xem biểu đồ</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
