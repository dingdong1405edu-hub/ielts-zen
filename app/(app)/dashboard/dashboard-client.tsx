'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Flame, Coins, Zap, Trophy, BookOpen, Brain, FileText, Headphones, Mic, PenTool, ArrowRight, Share2, Crown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ActivityHeatmap } from '@/components/dashboard/activity-heatmap'
import { BandRadarChart } from '@/components/dashboard/band-radar'
import { ReferralCard } from '@/components/dashboard/referral-card'
import { formatBand, bandToColor, xpToLevel } from '@/lib/utils'

const sectionLinks = [
  { href: '/vocabulary', icon: BookOpen, label: 'Từ vựng', color: 'from-blue-500 to-blue-600' },
  { href: '/grammar', icon: Brain, label: 'Ngữ pháp', color: 'from-purple-500 to-purple-600' },
  { href: '/reading', icon: FileText, label: 'Reading', color: 'from-cyan-500 to-cyan-600' },
  { href: '/listening', icon: Headphones, label: 'Listening', color: 'from-green-500 to-green-600' },
  { href: '/speaking', icon: Mic, label: 'Speaking', color: 'from-red-500 to-red-600' },
  { href: '/writing', icon: PenTool, label: 'Writing', color: 'from-orange-500 to-orange-600' },
]

interface Props {
  user: any
  userId: string
  recentTests: any[]
  activities: any[]
  leaderboard: any[]
  progressBySection: any[]
}

export function DashboardClient({ user, userId, recentTests, activities, leaderboard, progressBySection }: Props) {
  const band = user?.currentBand ?? user?.bandScore ?? null
  const isPremium = user?.isPremium && user?.premiumExpiresAt > new Date()
  const levelInfo = xpToLevel(user?.totalXp ?? 0)
  const progressMap = Object.fromEntries(progressBySection.map((p: any) => [p.section, p._count]))

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Xin chào, {user?.name?.split(' ').slice(-1)[0]} 👋</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {band
                ? `Band hiện tại của bạn: `
                : 'Hãy làm bài thi thử để xác định band của bạn'}
              {band && <span className={`font-bold ${bandToColor(band)}`}>{formatBand(band)}</span>}
            </p>
          </div>
          {!band && (
            <Button variant="gradient" asChild>
              <Link href="/placement-test">
                Thi thử ngay <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          )}
        </div>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Flame, label: 'Streak', value: `${user?.streak ?? 0} ngày`, color: 'text-orange-400' },
          { icon: Coins, label: 'Tokens', value: isPremium ? '∞' : `${user?.tokens ?? 30}`, color: 'text-yellow-400' },
          { icon: Zap, label: 'XP', value: `${user?.totalXp ?? 0}`, color: 'text-blue-400' },
          { icon: Trophy, label: 'Level', value: levelInfo.title, color: 'text-purple-400' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="card-hover">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-muted`}>
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-xl font-bold">{s.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* XP progress bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">{levelInfo.title} Level</span>
            <span className="text-xs text-muted-foreground">{user?.totalXp ?? 0} / {levelInfo.nextXp} XP</span>
          </div>
          <Progress value={levelInfo.progress} className="h-3" indicatorClassName="bg-gradient-to-r from-blue-500 to-cyan-400" />
        </CardContent>
      </Card>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Activity heatmap (2 cols) */}
        <div className="lg:col-span-2">
          <ActivityHeatmap activities={activities} />
        </div>

        {/* Band radar */}
        <div>
          <BandRadarChart recentTests={recentTests} currentBand={band} />
        </div>
      </div>

      {/* Quick access sections */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Tiếp tục học</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {sectionLinks.map((s, i) => (
            <motion.div key={s.href} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
              <Link href={s.href} className="flex flex-col items-center gap-2 rounded-xl border border-border p-4 hover:bg-accent transition-all card-hover group">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} shadow-lg group-hover:scale-110 transition-transform`}>
                  <s.icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-xs font-medium text-center">{s.label}</span>
                {progressMap[s.label.toLowerCase()] && (
                  <Badge variant="secondary" className="text-[10px]">{progressMap[s.label.toLowerCase()]} bài</Badge>
                )}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom row: leaderboard + referral */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Mini leaderboard */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Trophy className="h-4 w-4 text-yellow-400" /> Bảng xếp hạng
              </CardTitle>
              <Button variant="ghost" size="sm" asChild><Link href="/leaderboard">Xem tất cả</Link></Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {leaderboard.slice(0, 5).map((u: any, i: number) => (
              <div key={u.id} className={`flex items-center gap-3 rounded-lg p-2 ${u.id === userId ? 'bg-blue-500/10 border border-blue-500/20' : 'hover:bg-muted'}`}>
                <span className={`text-sm font-bold w-6 text-center ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-slate-300' : i === 2 ? 'text-amber-600' : 'text-muted-foreground'}`}>{i + 1}</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-white text-xs font-bold">{u.name?.[0]?.toUpperCase() ?? 'U'}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{u.id === userId ? 'Bạn' : u.name}</p>
                  <p className="text-xs text-muted-foreground">{u.totalXp} XP</p>
                </div>
                {u.bandScore && <Badge variant="outline" className="text-xs">{formatBand(u.bandScore)}</Badge>}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Referral card */}
        <ReferralCard referralCode={user?.referralCode ?? ''} userId={userId} />
      </div>

      {/* Premium banner if not premium */}
      {!isPremium && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Crown className="h-8 w-8 text-yellow-300" />
              <div>
                <p className="font-bold text-white text-lg">Nâng cấp Premium</p>
                <p className="text-blue-100 text-sm">Token không giới hạn, AI feedback tức thì. Chỉ từ 300,000₫/tháng.</p>
              </div>
            </div>
            <Button variant="premium" size="lg" asChild className="shrink-0">
              <Link href="/premium">Nâng cấp ngay</Link>
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
