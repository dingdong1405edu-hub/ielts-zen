'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  User, Mail, Calendar, Flame, Star, BookOpen, ClipboardList,
  Pencil, Trash2, ChevronRight, Crown, BookMarked
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { cn, formatBand, bandToColor, xpToLevel, formatRelativeDate } from '@/lib/utils'

type ProfileUser = {
  id: string
  name: string | null
  email: string | null
  avatar: string | null
  bandScore: number | null
  currentBand: number | null
  streak: number
  totalXp: number
  isPremium: boolean
  premiumExpiresAt: Date | null
  createdAt: Date
  _count: { testResults: number; progress: number }
}

type TestResult = {
  id: string
  testType: string
  bandScore: number
  duration: number
  createdAt: Date
}

type WordBankItem = {
  id: string
  word: string
  definition: string
  nextReview: Date
}

interface Props {
  user: ProfileUser | null
  recentTests: TestResult[]
  wordBank: WordBankItem[]
}

const TEST_TYPE_LABELS: Record<string, string> = {
  reading: 'Đọc hiểu',
  listening: 'Nghe hiểu',
  speaking: 'Nói',
  writing: 'Viết',
  placement: 'Placement',
}

export function ProfileClient({ user, recentTests, wordBank }: Props) {
  const router = useRouter()
  const [nameDialogOpen, setNameDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [newName, setNewName] = useState(user?.name ?? '')
  const [nameLoading, setNameLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  if (!user) return null

  const band = user.currentBand ?? user.bandScore
  const levelInfo = xpToLevel(user.totalXp)
  const initials = user.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() ?? '?'
  const isPremiumActive = user.isPremium && user.premiumExpiresAt && new Date(user.premiumExpiresAt) > new Date()

  async function handleChangeName() {
    if (!newName.trim()) return
    setNameLoading(true)
    try {
      const res = await fetch('/api/user/update-name', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim() }),
      })
      if (res.ok) {
        setNameDialogOpen(false)
        router.refresh()
      }
    } finally {
      setNameLoading(false)
    }
  }

  async function handleDeleteAccount() {
    setDeleteLoading(true)
    try {
      const res = await fetch('/api/user/delete-account', { method: 'DELETE' })
      if (res.ok) {
        router.push('/login')
      }
    } finally {
      setDeleteLoading(false)
    }
  }

  const stats = [
    { icon: Flame, label: 'Streak', value: `${user.streak} ngày`, color: 'text-orange-400' },
    { icon: Star, label: 'Tổng XP', value: user.totalXp.toLocaleString(), color: 'text-yellow-400' },
    { icon: BookOpen, label: 'Bài học', value: user._count.progress.toString(), color: 'text-blue-400' },
    { icon: ClipboardList, label: 'Bài kiểm tra', value: user._count.testResults.toString(), color: 'text-emerald-400' },
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Header Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="relative shrink-0">
                <Avatar className="h-24 w-24 ring-4 ring-blue-500/30">
                  {user.avatar && <AvatarImage src={user.avatar} alt={user.name ?? ''} />}
                  <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                </Avatar>
                {isPremiumActive && (
                  <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 ring-2 ring-background">
                    <Crown className="h-3.5 w-3.5 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 text-center sm:text-left space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <h1 className="text-2xl font-extrabold text-foreground">{user.name ?? 'Người dùng'}</h1>
                  {isPremiumActive && (
                    <Badge className="bg-gradient-to-r from-yellow-500 to-amber-400 text-black text-xs w-fit mx-auto sm:mx-0">
                      Premium
                    </Badge>
                  )}
                </div>
                <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                    <Mail className="h-3.5 w-3.5" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Tham gia {new Date(user.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              </div>
              {band != null && (
                <div className="text-center shrink-0">
                  <p className="text-xs text-muted-foreground mb-1">Band Score</p>
                  <p className={cn('text-5xl font-extrabold', bandToColor(band))}>{formatBand(band)}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* XP Level Progress */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              <span>Cấp độ</span>
              <span className="text-foreground font-bold">{levelInfo.title} (Lv.{levelInfo.level})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Progress value={levelInfo.progress} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{user.totalXp.toLocaleString()} XP</span>
              <span>Tiếp theo: {levelInfo.nextXp.toLocaleString()} XP</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map(({ icon: Icon, label, value, color }) => (
            <Card key={label}>
              <CardContent className="pt-4 pb-4 flex flex-col items-center gap-2 text-center">
                <Icon className={cn('h-5 w-5', color)} />
                <p className="text-xl font-bold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Recent Test Results */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-blue-400" />
              Kết quả gần đây
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentTests.length > 0 ? (
              <div className="space-y-2">
                {recentTests.map((test) => (
                  <div key={test.id} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {TEST_TYPE_LABELS[test.testType] ?? test.testType}
                      </p>
                      <p className="text-xs text-muted-foreground">{formatRelativeDate(test.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-muted-foreground">{Math.floor(test.duration / 60)}p</span>
                      <Badge variant="secondary" className={cn('font-bold', bandToColor(test.bandScore))}>
                        {formatBand(test.bandScore)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">Chưa có bài kiểm tra nào.</p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Word Bank Preview */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookMarked className="h-5 w-5 text-purple-400" />
                Ngân hàng từ vựng
              </div>
              <Button variant="ghost" size="sm" asChild>
                <a href="/vocabulary">Xem tất cả <ChevronRight className="h-3.5 w-3.5" /></a>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {wordBank.length > 0 ? (
              <div className="space-y-2">
                {wordBank.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 py-2 px-3 rounded-lg hover:bg-muted/50">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{item.word}</p>
                      <p className="text-xs text-muted-foreground truncate">{item.definition}</p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">
                      Ôn: {new Date(item.nextReview).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">Chưa có từ vựng nào.</p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Account Settings */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              Cài đặt tài khoản
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Tên hiển thị</p>
                <p className="text-xs text-muted-foreground">{user.name ?? 'Chưa đặt tên'}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setNameDialogOpen(true)}>
                <Pencil className="h-3.5 w-3.5 mr-1" />
                Đổi tên
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-400">Xóa tài khoản</p>
                <p className="text-xs text-muted-foreground">Hành động này không thể hoàn tác</p>
              </div>
              <Button variant="destructive" size="sm" onClick={() => setDeleteDialogOpen(true)}>
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Xóa
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Change Name Dialog */}
      <Dialog open={nameDialogOpen} onOpenChange={setNameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Đổi tên hiển thị</DialogTitle>
          </DialogHeader>
          <Input
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Nhập tên mới..."
            onKeyDown={e => e.key === 'Enter' && handleChangeName()}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setNameDialogOpen(false)}>Hủy</Button>
            <Button onClick={handleChangeName} loading={nameLoading}>Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-400">Xóa tài khoản</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Bạn có chắc muốn xóa tài khoản? Toàn bộ dữ liệu học tập, kết quả kiểm tra và từ vựng sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Hủy</Button>
            <Button variant="destructive" onClick={handleDeleteAccount} loading={deleteLoading}>
              Xóa tài khoản
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
