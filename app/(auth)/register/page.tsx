'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/toaster'

const schema = z.object({
  name: z.string().min(2, 'Tên tối thiểu 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(8, 'Mật khẩu tối thiểu 8 ký tự'),
})
type FormData = z.infer<typeof schema>

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const ref = searchParams.get('ref')
  const [showPw, setShowPw] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, referralCode: ref }),
    })
    const json = await res.json()
    if (!res.ok) {
      toast({ title: 'Đăng ký thất bại', description: json.error, variant: 'destructive' })
      return
    }
    // Auto-login after register
    await signIn('credentials', { email: data.email, password: data.password, redirect: false })
    router.push('/placement-test')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Tạo tài khoản miễn phí</h1>
          <p className="text-muted-foreground text-sm">30 tokens miễn phí để bắt đầu</p>
        </div>

        {ref && (
          <div className="mb-5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm text-emerald-400">
            🎉 Bạn được mời bởi một người dùng IELTS ZEN!
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Họ và tên</Label>
            <Input id="name" placeholder="Nguyễn Văn A" className="mt-1.5" {...register('name')} />
            {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" className="mt-1.5" {...register('email')} />
            {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <Label htmlFor="password">Mật khẩu</Label>
            <div className="relative mt-1.5">
              <Input id="password" type={showPw ? 'text' : 'password'} placeholder="Tối thiểu 8 ký tự" {...register('password')} />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
          </div>
          <Button type="submit" variant="gradient" className="w-full mt-2" loading={isSubmitting}>
            <UserPlus className="h-4 w-4 mr-1" /> Tạo tài khoản
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Bằng cách đăng ký, bạn đồng ý với{' '}
          <Link href="/terms" className="text-blue-400 hover:underline">Điều khoản</Link> &{' '}
          <Link href="/privacy" className="text-blue-400 hover:underline">Chính sách</Link>
        </p>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Đã có tài khoản?{' '}
          <Link href="/login" className="text-blue-400 hover:underline font-medium">Đăng nhập</Link>
        </p>
      </div>
    </motion.div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="w-full max-w-md h-96 rounded-2xl bg-card animate-pulse" />}>
      <RegisterForm />
    </Suspense>
  )
}
