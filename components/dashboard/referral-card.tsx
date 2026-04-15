'use client'

import { useState, useEffect } from 'react'
import { Copy, Share2, Check } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { toast } from '@/components/ui/toaster'

interface Props { referralCode: string; userId: string }

export function ReferralCard({ referralCode, userId }: Props) {
  const [copied, setCopied] = useState(false)
  const [count, setCount] = useState(0)
  const referralUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/register?ref=${referralCode}`

  useEffect(() => {
    fetch('/api/referral/count').then(r => r.json()).then(d => setCount(d.count || 0))
  }, [])

  const copy = async () => {
    await navigator.clipboard.writeText(referralUrl)
    setCopied(true)
    toast({ title: 'Đã copy link!', description: 'Chia sẻ link cho bạn bè nhé 🎉', variant: 'success' })
    setTimeout(() => setCopied(false), 2000)
  }

  const share = async () => {
    if (navigator.share) {
      await navigator.share({ title: 'IELTS ZEN', text: 'Học IELTS cùng mình với AI!', url: referralUrl })
    } else copy()
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Share2 className="h-4 w-4 text-emerald-400" /> Chia sẻ nhận quà
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-xl bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 p-4">
          <p className="text-sm font-medium mb-1">Giới thiệu 5 bạn bè → 15 ngày Premium miễn phí 🎁</p>
          <p className="text-xs text-muted-foreground">Bạn bè chưa dùng app, phải dùng 1 lần mới tính</p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Tiến độ: {count}/5 bạn bè</span>
            {count >= 5 && <span className="text-xs text-emerald-400 font-semibold">✓ Đủ điều kiện nhận quà!</span>}
          </div>
          <Progress value={(count / 5) * 100} indicatorClassName="bg-gradient-to-r from-emerald-500 to-blue-500" />
        </div>

        <div className="flex gap-2">
          <div className="flex-1 min-w-0 rounded-lg border border-border bg-muted px-3 py-2 text-xs text-muted-foreground truncate">
            {referralUrl}
          </div>
          <Button variant="outline" size="icon" onClick={copy} className="shrink-0">
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button variant="gradient" size="icon" onClick={share} className="shrink-0">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
