'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Lock, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const email = searchParams.get('email') ?? ''
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) { setError('Mật khẩu không khớp'); return }
    if (password.length < 8) { setError('Mật khẩu tối thiểu 8 ký tự'); return }
    setError('')
    setLoading(true)
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, email, password }),
    })
    const json = await res.json()
    setLoading(false)
    if (!res.ok) { setError(json.error); return }
    setDone(true)
    setTimeout(() => router.push('/login'), 2000)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
      <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
        {done ? (
          <div className="text-center py-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Đổi mật khẩu thành công!</h2>
            <p className="text-muted-foreground text-sm">Đang chuyển về trang đăng nhập...</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/10 mb-4">
                <Lock className="h-7 w-7 text-blue-400" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Đặt lại mật khẩu</h1>
              <p className="text-muted-foreground text-sm">Nhập mật khẩu mới cho <strong>{email}</strong></p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="password">Mật khẩu mới</Label>
                <Input id="password" type="password" placeholder="Tối thiểu 8 ký tự" className="mt-1.5" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="confirm">Xác nhận mật khẩu</Label>
                <Input id="confirm" type="password" placeholder="Nhập lại mật khẩu" className="mt-1.5" value={confirm} onChange={e => setConfirm(e.target.value)} required />
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
              <Button type="submit" variant="gradient" className="w-full" loading={loading}>Đặt lại mật khẩu</Button>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-6">
              <Link href="/login" className="text-blue-400 hover:underline flex items-center justify-center gap-1">
                <ArrowLeft className="h-3.5 w-3.5" /> Quay lại đăng nhập
              </Link>
            </p>
          </>
        )}
      </div>
    </motion.div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="w-full max-w-md h-64 rounded-2xl bg-card animate-pulse" />}>
      <ResetPasswordForm />
    </Suspense>
  )
}
