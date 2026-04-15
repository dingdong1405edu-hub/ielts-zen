'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Crown, Check, Zap, Calendar, CreditCard, History, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

type Plan = 'monthly' | 'bimonthly' | 'quarterly'

interface Subscription {
  id: string
  plan: string
  amount: number
  status: string
  startsAt: Date
  expiresAt: Date
  createdAt: Date
}

interface Props {
  isPremiumActive: boolean
  premiumExpiresAt: Date | null
  tokens: number
  subscriptions: Subscription[]
}

const PLANS: {
  id: Plan
  name: string
  price: number
  duration: string
  days: number
  badge?: string
  popular?: boolean
  gradient: string
  savings?: string
}[] = [
  {
    id: 'monthly',
    name: '1 Tháng',
    price: 300000,
    duration: '30 ngày',
    days: 30,
    popular: true,
    gradient: 'from-blue-600 to-cyan-500',
  },
  {
    id: 'bimonthly',
    name: '2 Tháng',
    price: 540000,
    duration: '60 ngày',
    days: 60,
    badge: 'Tiết kiệm 10%',
    savings: '-60,000₫',
    gradient: 'from-purple-600 to-pink-500',
  },
  {
    id: 'quarterly',
    name: '3 Tháng',
    price: 720000,
    duration: '90 ngày',
    days: 90,
    badge: 'Tiết kiệm 20%',
    savings: '-180,000₫',
    gradient: 'from-yellow-500 to-amber-400',
  },
]

const FREE_FEATURES = [
  { label: '30 tokens/tháng', included: true },
  { label: 'Đọc hiểu không giới hạn', included: true },
  { label: 'Nghe hiểu không giới hạn', included: true },
  { label: 'Từ vựng & Ngữ pháp', included: true },
  { label: 'Placement test', included: true },
  { label: 'Token không giới hạn', included: false },
  { label: 'Speaking AI không giới hạn', included: false },
  { label: 'Writing AI không giới hạn', included: false },
  { label: 'Phân tích chi tiết IELTS', included: false },
  { label: 'Priority AI feedback', included: false },
]

const PREMIUM_FEATURES = [
  { label: 'Token không giới hạn', included: true },
  { label: 'Đọc hiểu không giới hạn', included: true },
  { label: 'Nghe hiểu không giới hạn', included: true },
  { label: 'Từ vựng & Ngữ pháp', included: true },
  { label: 'Placement test', included: true },
  { label: 'Speaking AI không giới hạn', included: true },
  { label: 'Writing AI không giới hạn', included: true },
  { label: 'Phân tích chi tiết IELTS', included: true },
  { label: 'Priority AI feedback', included: true },
  { label: 'Lịch sử bài làm đầy đủ', included: true },
]

const PLAN_LABELS: Record<string, string> = {
  monthly: '1 Tháng',
  bimonthly: '2 Tháng',
  quarterly: '3 Tháng',
}

export function PremiumClient({ isPremiumActive, premiumExpiresAt, tokens, subscriptions }: Props) {
  const [loadingPlan, setLoadingPlan] = useState<Plan | null>(null)

  async function handleCheckout(plan: Plan) {
    setLoadingPlan(plan)
    try {
      const res = await fetch('/api/payment/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      if (!res.ok) throw new Error('Failed to create session')
      const { url } = await res.json()
      if (url) window.location.href = url
    } catch {
      alert('Có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setLoadingPlan(null)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 shadow-lg shadow-yellow-500/30 mb-2">
          <Crown className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-2xl font-extrabold text-foreground">IELTS ZEN Premium</h1>
        <p className="text-muted-foreground text-sm">Mở khóa toàn bộ tính năng AI để học hiệu quả hơn</p>
      </div>

      {/* Current Status */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className={cn(isPremiumActive && 'border-yellow-500/30 bg-gradient-to-br from-yellow-500/5 to-amber-500/5')}>
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-xl',
                  isPremiumActive ? 'bg-gradient-to-br from-yellow-400 to-amber-500' : 'bg-muted'
                )}>
                  {isPremiumActive ? <Crown className="h-5 w-5 text-white" /> : <Zap className="h-5 w-5 text-muted-foreground" />}
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {isPremiumActive ? 'Premium đang hoạt động' : 'Gói Miễn phí'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {isPremiumActive && premiumExpiresAt
                      ? `Hết hạn: ${new Date(premiumExpiresAt).toLocaleDateString('vi-VN')}`
                      : `Còn ${tokens} tokens`}
                  </p>
                </div>
              </div>
              <Badge
                className={cn(
                  'text-xs px-3 py-1',
                  isPremiumActive
                    ? 'bg-gradient-to-r from-yellow-500 to-amber-400 text-black'
                    : 'bg-secondary text-secondary-foreground'
                )}
              >
                {isPremiumActive ? 'PREMIUM' : 'FREE'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Plans */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="grid sm:grid-cols-3 gap-4">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className={cn(
                'relative rounded-2xl border p-5 flex flex-col gap-4',
                plan.popular
                  ? 'border-blue-500/50 bg-blue-600/5 shadow-lg shadow-blue-500/10'
                  : 'border-border bg-card hover:border-border/80 transition-colors'
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-0.5 text-xs font-semibold text-white whitespace-nowrap">
                  Phổ biến nhất
                </div>
              )}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-yellow-500 px-3 py-0.5 text-xs font-semibold text-black whitespace-nowrap">
                  {plan.badge}
                </div>
              )}
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${plan.gradient}`}>
                <Crown className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-extrabold text-foreground">{plan.price.toLocaleString('vi-VN')}</span>
                  <span className="text-sm text-muted-foreground">₫</span>
                </div>
                <p className="text-xs text-muted-foreground">/{plan.duration}</p>
                {plan.savings && (
                  <p className="text-xs text-emerald-400 font-medium mt-0.5">{plan.savings}</p>
                )}
              </div>
              <Button
                variant={plan.popular ? 'gradient' : 'outline'}
                className="w-full mt-auto"
                onClick={() => handleCheckout(plan.id)}
                loading={loadingPlan === plan.id}
                disabled={loadingPlan !== null}
              >
                {isPremiumActive ? 'Gia hạn' : 'Nâng cấp ngay'}
              </Button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Feature Comparison */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Check className="h-5 w-5 text-emerald-400" />
              So sánh tính năng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1" />
              <div className="text-center">
                <Badge variant="secondary" className="text-xs">Miễn phí</Badge>
              </div>
              <div className="text-center">
                <Badge className="bg-gradient-to-r from-yellow-500 to-amber-400 text-black text-xs">Premium</Badge>
              </div>
            </div>
            <Separator className="my-3" />
            <div className="space-y-2">
              {FREE_FEATURES.map((feat, i) => (
                <div key={feat.label} className="grid grid-cols-3 gap-4 items-center py-1">
                  <span className="text-sm text-foreground col-span-1">{feat.label}</span>
                  <div className="flex justify-center">
                    {feat.included
                      ? <Check className="h-4 w-4 text-emerald-400" />
                      : <X className="h-4 w-4 text-muted-foreground/40" />}
                  </div>
                  <div className="flex justify-center">
                    <Check className="h-4 w-4 text-emerald-400" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Transaction History */}
      {subscriptions.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <History className="h-5 w-5 text-muted-foreground" />
                Lịch sử thanh toán
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {subscriptions.map((sub) => (
                  <div key={sub.id} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-yellow-500/10">
                      <CreditCard className="h-4 w-4 text-yellow-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">Premium {PLAN_LABELS[sub.plan] ?? sub.plan}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(sub.createdAt).toLocaleDateString('vi-VN')}
                        {' · '}
                        Hết hạn {new Date(sub.expiresAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-foreground">{sub.amount.toLocaleString('vi-VN')}₫</p>
                      <Badge
                        variant="secondary"
                        className={cn(
                          'text-xs',
                          sub.status === 'active' && 'bg-emerald-500/10 text-emerald-400',
                          sub.status === 'expired' && 'bg-muted text-muted-foreground'
                        )}
                      >
                        {sub.status === 'active' ? 'Đang dùng' : sub.status === 'expired' ? 'Hết hạn' : sub.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
