'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity } from 'lucide-react'

interface ActivityData {
  date: Date | string
  xp: number
  count: number
}

function getColor(xp: number) {
  if (xp === 0) return 'bg-muted'
  if (xp < 20) return 'bg-blue-900'
  if (xp < 50) return 'bg-blue-700'
  if (xp < 100) return 'bg-blue-500'
  return 'bg-blue-400'
}

export function ActivityHeatmap({ activities }: { activities: ActivityData[] }) {
  const activityMap = useMemo(() => {
    const map: Record<string, number> = {}
    activities.forEach(a => {
      const key = new Date(a.date).toISOString().split('T')[0]
      map[key] = (map[key] || 0) + a.xp
    })
    return map
  }, [activities])

  const weeks = useMemo(() => {
    const today = new Date()
    const days: Array<{ date: string; xp: number }> = []
    for (let i = 364; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      const key = d.toISOString().split('T')[0]
      days.push({ date: key, xp: activityMap[key] || 0 })
    }
    // Pad to full weeks
    const firstDay = new Date(days[0].date).getDay()
    const pad = Array(firstDay).fill(null)
    const allDays = [...pad, ...days]
    const result: typeof days[] = []
    for (let i = 0; i < allDays.length; i += 7) {
      result.push(allDays.slice(i, i + 7) as typeof days)
    }
    return result
  }, [activityMap])

  const totalXp = activities.reduce((s, a) => s + a.xp, 0)
  const activeDays = activities.filter(a => a.xp > 0).length

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-400" /> Hoạt động học tập
          </CardTitle>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>{activeDays} ngày học</span>
            <span>{totalXp} XP</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-[3px] min-w-max">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map((day, di) => (
                  day === null
                    ? <div key={di} className="h-3 w-3" />
                    : (
                      <div
                        key={di}
                        className={`h-3 w-3 rounded-sm ${getColor(day.xp)} transition-colors`}
                        title={`${day.date}: ${day.xp} XP`}
                      />
                    )
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
          <span>Ít hơn</span>
          {['bg-muted', 'bg-blue-900', 'bg-blue-700', 'bg-blue-500', 'bg-blue-400'].map(c => (
            <div key={c} className={`h-3 w-3 rounded-sm ${c}`} />
          ))}
          <span>Nhiều hơn</span>
        </div>
      </CardContent>
    </Card>
  )
}
