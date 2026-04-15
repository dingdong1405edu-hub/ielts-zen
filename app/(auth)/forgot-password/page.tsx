'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
    } catch {
      setError('Không thể gửi yêu cầu. Thử lại sau.')
    } finally {
      setLoading(false)
      setSent(true) // Always show success to prevent email enumeration
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
      <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
        {!sent ? (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/10 mb-4">
                <Mail className="h-7 w-7 text-blue-400" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Quên mật khẩu?</h1>
              <p className="text-muted-foreground text-sm">Nhập email để nhận link đặt lại mật khẩu</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" className="mt-1.5" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
              <Button type="submit" variant="gradient" className="w-full" loading={loading}>Gửi link đặt lại</Button>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="text-5xl mb-4">📧</div>
            <h2 className="text-xl font-bold mb-2">Đã gửi email!</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Nếu <strong>{email}</strong> tồn tại trong hệ thống, bạn sẽ nhận được link đặt lại mật khẩu trong vài phút.
            </p>
            <Button variant="outline" asChild className="w-full">
              <Link href="/login"><ArrowLeft className="h-4 w-4 mr-2" /> Quay lại đăng nhập</Link>
            </Button>
          </div>
        )}
        {!sent && (
          <p className="text-center text-sm text-muted-foreground mt-6">
            <Link href="/login" className="text-blue-400 hover:underline flex items-center justify-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" /> Quay lại đăng nhập
            </Link>
          </p>
        )}
      </div>
    </motion.div>
  )
}
