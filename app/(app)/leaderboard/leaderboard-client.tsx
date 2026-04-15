'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Medal, Star, Flame, Crown } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn, formatBand, bandToColor, xpToLevel } from '@/lib/utils'

type LeaderboardUser = {
  id: string
  name: string | null
  avatar: string | null
  totalXp: number
  bandScore: number | null
  currentBand: number | null
  streak: number
}

interface Props {
  allTimeUsers: LeaderboardUser[]
  monthlyUsers: LeaderboardUser[]
  currentUserId: string
}

const RANK_STYLES: Record<number, { bg: string; text: string; border: string; icon: React.ReactNode; label: string }> = {
  1: {
    bg: 'bg-gradient-to-br from-yellow-400/20 to-amber-300/20',
    text: 'text-yellow-400',
    border: 'border-yellow-400/40',
    icon: <Crown className="h-5 w-5 text-yellow-400" />,
    label: '1st',
  },
  2: {
    bg: 'bg-gradient-to-br from-slate-300/20 to-slate-400/20',
    text: 'text-slate-300',
    border: 'border-slate-300/40',
    icon: <Medal className="h-5 w-5 text-slate-300" />,
    label: '2nd',
  },
  3: {
    bg: 'bg-gradient-to-br from-amber-600/20 to-orange-500/20',
    text: 'text-amber-500',
    border: 'border-amber-500/40',
    icon: <Medal className="h-5 w-5 text-amber-500" />,
    label: '3rd',
  },
}

function PodiumCard({ user, rank, isCurrent }: { user: LeaderboardUser; rank: number; isCurrent: boolean }) {
  const style = RANK_STYLES[rank]
  const initials = user.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() ?? '?'
  const band = user.currentBand ?? user.bandScore
  const levelInfo = xpToLevel(user.totalXp)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.1 }}
      className={cn(
        'relative flex flex-col items-center gap-3 rounded-2xl border p-6 text-center',
        style.bg,
        style.border,
        isCurrent && 'ring-2 ring-blue-500',
        rank === 1 && 'scale-110'
      )}
    >
      <div className={cn('absolute -top-3 flex h-7 w-7 items-center justify-center rounded-full border-2 font-bold text-xs', style.border, style.text, 'bg-background')}>
        {rank}
      </div>
      <div className="relative">
        <Avatar className="h-16 w-16 ring-2 ring-offset-2 ring-offset-background" style={{ '--tw-ring-color': rank === 1 ? '#facc15' : rank === 2 ? '#94a3b8' : '#f97316' } as React.CSSProperties}>
          {user.avatar && <AvatarImage src={user.avatar} alt={user.name ?? ''} />}
          <AvatarFallback className="text-lg">{initials}</AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-1 -right-1">
          {style.icon}
        </div>
      </div>
      <div>
        <p className="font-semibold text-foreground truncate max-w-[120px]">{user.name ?? 'Anonymous'}</p>
        <p className={cn('text-xs font-medium', style.text)}>{levelInfo.title} Lv.{levelInfo.level}</p>
      </div>
      <div className="flex flex-col items-center gap-1">
        <span className={cn('text-2xl font-extrabold', style.text)}>
          {user.totalXp.toLocaleString()} XP
        </span>
        {band != null && (
          <Badge variant="secondary" className="text-xs">
            Band <span className={bandToColor(band)}>{formatBand(band)}</span>
          </Badge>
        )}
      </div>
      {user.streak > 0 && (
        <div className="flex items-center gap-1 text-orange-400 text-xs">
          <Flame className="h-3.5 w-3.5" />
          <span>{user.streak} ngày</span>
        </div>
      )}
    </motion.div>
  )
}

function UserRow({ user, rank, isCurrent }: { user: LeaderboardUser; rank: number; isCurrent: boolean }) {
  const initials = user.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() ?? '?'
  const band = user.currentBand ?? user.bandScore
  const levelInfo = xpToLevel(user.totalXp)

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: (rank - 4) * 0.03 }}
      className={cn(
        'flex items-center gap-3 rounded-xl px-4 py-3 transition-colors',
        isCurrent
          ? 'bg-blue-600/10 border border-blue-500/30'
          : 'hover:bg-muted/50'
      )}
    >
      <span className="w-8 text-center text-sm font-bold text-muted-foreground">{rank}</span>
      <Avatar className="h-9 w-9 shrink-0">
        {user.avatar && <AvatarImage src={user.avatar} alt={user.name ?? ''} />}
        <AvatarFallback className="text-xs">{initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className={cn('font-medium truncate text-sm', isCurrent && 'text-blue-400')}>
          {user.name ?? 'Anonymous'}
          {isCurrent && <span className="ml-1 text-xs text-blue-400">(bạn)</span>}
        </p>
        <p className="text-xs text-muted-foreground">{levelInfo.title} Lv.{levelInfo.level}</p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {user.streak > 0 && (
          <div className="hidden sm:flex items-center gap-1 text-orange-400 text-xs">
            <Flame className="h-3.5 w-3.5" />
            <span>{user.streak}</span>
          </div>
        )}
        {band != null && (
          <span className={cn('hidden sm:block text-xs font-semibold', bandToColor(band))}>
            {formatBand(band)}
          </span>
        )}
        <span className="text-sm font-bold text-foreground">{user.totalXp.toLocaleString()}</span>
        <span className="text-xs text-muted-foreground">XP</span>
      </div>
    </motion.div>
  )
}

function LeaderboardList({ users, currentUserId }: { users: LeaderboardUser[]; currentUserId: string }) {
  const top3 = users.slice(0, 3)
  const rest = users.slice(3)

  const podiumOrder = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3

  return (
    <div className="space-y-8">
      {top3.length > 0 && (
        <div className="flex items-end justify-center gap-4">
          {podiumOrder.map((user) => {
            const rank = users.indexOf(user) + 1
            return (
              <PodiumCard
                key={user.id}
                user={user}
                rank={rank}
                isCurrent={user.id === currentUserId}
              />
            )
          })}
        </div>
      )}

      {rest.length > 0 && (
        <div className="space-y-1">
          {rest.map((user, idx) => (
            <UserRow
              key={user.id}
              user={user}
              rank={idx + 4}
              isCurrent={user.id === currentUserId}
            />
          ))}
        </div>
      )}

      {users.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Star className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>Chưa có dữ liệu</p>
        </div>
      )}
    </div>
  )
}

export function LeaderboardClient({ allTimeUsers, monthlyUsers, currentUserId }: Props) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 shadow-lg shadow-yellow-500/30 mb-2">
          <Trophy className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-2xl font-extrabold text-foreground">Bảng xếp hạng</h1>
        <p className="text-muted-foreground text-sm">Top học viên IELTS ZEN</p>
      </div>

      <Tabs defaultValue="monthly">
        <TabsList className="w-full">
          <TabsTrigger value="monthly" className="flex-1">Tháng này</TabsTrigger>
          <TabsTrigger value="alltime" className="flex-1">Mọi thời đại</TabsTrigger>
        </TabsList>
        <TabsContent value="monthly" className="mt-6">
          <LeaderboardList users={monthlyUsers} currentUserId={currentUserId} />
        </TabsContent>
        <TabsContent value="alltime" className="mt-6">
          <LeaderboardList users={allTimeUsers} currentUserId={currentUserId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
