'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, Crown, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

function Confetti() {
  const [particles, setParticles] = useState<
    { id: number; x: number; color: string; delay: number; duration: number }[]
  >([])

  useEffect(() => {
    const colors = ['#3b82f6', '#06b6d4', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899']
    setParticles(
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 1.5,
        duration: 2 + Math.random() * 2,
      }))
    )
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-2 h-2 rounded-sm"
          style={{ left: `${p.x}%`, top: '-8px', backgroundColor: p.color }}
          animate={{
            y: ['0vh', '110vh'],
            rotate: [0, 720],
            opacity: [1, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}

export default function PaymentSuccessPage() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push('/dashboard')
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [router])

  return (
    <div className="relative flex min-h-[80vh] flex-col items-center justify-center px-4">
      <Confetti />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', duration: 0.6 }}
        className="relative z-10 text-center max-w-md mx-auto"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 shadow-2xl shadow-emerald-500/40 mb-6"
        >
          <CheckCircle className="h-12 w-12 text-white" />
        </motion.div>

        {/* Premium Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 px-4 py-1.5 text-sm text-yellow-400 mb-4"
        >
          <Crown className="h-4 w-4" />
          Premium đã được kích hoạt
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-3xl font-extrabold text-foreground mb-3"
        >
          Thanh toán thành công!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-muted-foreground mb-2"
        >
          Chào mừng bạn đến với IELTS ZEN Premium. Token không giới hạn đã được cộng vào tài khoản của bạn.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex items-center justify-center gap-2 text-muted-foreground text-sm mb-8"
        >
          <Sparkles className="h-4 w-4 text-yellow-400" />
          <span>9,999 tokens đã được thêm vào tài khoản</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-3"
        >
          <Button
            variant="gradient"
            size="lg"
            className="w-full"
            onClick={() => router.push('/dashboard')}
          >
            Bắt đầu học ngay
            <ArrowRight className="h-4 w-4" />
          </Button>
          <p className="text-xs text-muted-foreground">
            Tự động chuyển về Dashboard sau {countdown} giây...
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
