'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Play, Sparkles, Star, CheckCircle2, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

const floatingCards = [
  { icon: '📚', text: 'Band 7.0 → 8.0', delay: 0, x: -20, y: 0 },
  { icon: '🎯', text: 'AI Chấm Ngay', delay: 0.2, x: 20, y: 100 },
  { icon: '🔥', text: '30 Ngày Streak', delay: 0.4, x: -30, y: 200 },
]

export function HeroSection() {
  return (
    <section className="relative min-h-screen grid-bg flex items-center overflow-hidden">
      {/* Glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 mb-6"
            >
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              <span className="text-xs text-blue-300 font-medium">Powered by Google Gemini AI</span>
            </motion.div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-6">
              Luyện IELTS{' '}
              <span className="gradient-text">Thông Minh</span>
              {' '}Cùng AI
            </h1>

            <p className="text-lg text-slate-400 mb-8 max-w-xl leading-relaxed">
              Thi thử để biết band điểm thật sự của bạn. Học theo lộ trình cá nhân hóa.
              AI chấm bài Speaking &amp; Writing tức thì — tăng band nhanh nhất.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Button variant="gradient" size="xl" asChild className="group">
                <Link href="/register">
                  Bắt đầu miễn phí
                  <ArrowRight className="ml-1 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild className="border-slate-700 text-white hover:bg-slate-800">
                <Link href="/placement-test" className="flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  Thi thử ngay
                </Link>
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 text-sm text-slate-400">
              {['Miễn phí 30 tokens/tháng', 'Không cần thẻ tín dụng', 'AI phản hồi tức thì'].map((t) => (
                <div key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  {t}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Main card */}
              <div className="glass rounded-2xl p-6 border border-blue-500/20 shadow-2xl shadow-blue-900/30">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-slate-400 text-sm">Band điểm của bạn</p>
                    <p className="text-5xl font-bold gradient-text">7.0</p>
                  </div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-3 mb-5">
                  {[['Nghe', '7.5', 'blue'], ['Đọc', '7.0', 'cyan'], ['Viết', '6.5', 'purple'], ['Nói', '6.5', 'pink']].map(([label, score, color]) => (
                    <div key={label} className="rounded-xl bg-white/5 p-3 text-center">
                      <p className="text-xs text-slate-400 mb-1">{label}</p>
                      <p className={`text-lg font-bold text-${color}-400`}>{score}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2.5">
                  {[['Listening', 84], ['Reading', 72], ['Writing', 65]].map(([label, val]) => (
                    <div key={label as string}>
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>{label}</span><span>{val}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-700">
                        <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{ width: `${val}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating cards */}
              {floatingCards.map((card, i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3 + i * 0.5, delay: card.delay, repeat: Infinity }}
                  className={`absolute glass rounded-xl px-3 py-2 border border-white/10 flex items-center gap-2 shadow-lg`}
                  style={{ right: card.x > 0 ? `-${card.x}px` : 'auto', left: card.x < 0 ? `${Math.abs(card.x)}px` : 'auto', top: `${card.y}px` }}
                >
                  <span>{card.icon}</span>
                  <span className="text-xs font-medium text-white">{card.text}</span>
                </motion.div>
              ))}
            </div>

            {/* Stars */}
            <div className="mt-6 flex items-center gap-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-slate-400"><strong className="text-white">4.9/5</strong> từ 2,000+ học viên</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" className="w-full">
          <path d="M0,60 C360,0 1080,0 1440,60 L1440,60 L0,60 Z" fill="#0a0f1e" />
        </svg>
      </div>
    </section>
  )
}
