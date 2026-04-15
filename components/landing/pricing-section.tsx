'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Check, Zap, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'

const plans = [
  {
    name: 'Miễn phí',
    price: '0',
    period: 'mãi mãi',
    icon: Zap,
    color: 'from-slate-500 to-slate-600',
    features: ['30 tokens/tháng', 'Đọc + Nghe không giới hạn', 'Từ vựng + Ngữ pháp', 'Placement test', 'Dashboard cơ bản'],
    cta: 'Bắt đầu miễn phí',
    href: '/register',
    popular: false,
  },
  {
    name: 'Premium 1 Tháng',
    price: '300,000',
    period: '30 ngày',
    icon: Crown,
    color: 'from-blue-600 to-cyan-500',
    features: ['Token không giới hạn', 'Tất cả tính năng free', 'Speaking AI không giới hạn', 'Writing AI không giới hạn', 'Priority AI feedback', 'Phân tích chi tiết'],
    cta: 'Nâng cấp ngay',
    href: '/premium',
    popular: true,
  },
  {
    name: 'Premium 2 Tháng',
    price: '540,000',
    period: '60 ngày',
    icon: Crown,
    color: 'from-purple-600 to-pink-500',
    features: ['Tiết kiệm 10%', 'Token không giới hạn', 'Tất cả tính năng free', 'Speaking + Writing AI', 'Priority feedback', 'Phân tích chi tiết'],
    cta: 'Tiết kiệm 10%',
    href: '/premium',
    popular: false,
    badge: 'Tiết kiệm 10%',
  },
  {
    name: 'Premium 3 Tháng',
    price: '720,000',
    period: '90 ngày',
    icon: Crown,
    color: 'from-yellow-500 to-amber-400',
    features: ['Tiết kiệm 20%', 'Token không giới hạn', 'Tất cả tính năng free', 'Speaking + Writing AI', 'Priority feedback', 'Phân tích chi tiết'],
    cta: 'Tiết kiệm 20%',
    href: '/premium',
    popular: false,
    badge: 'Tiết kiệm 20%',
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-[#0d1629]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">
            Đơn giản, <span className="gradient-text">minh bạch</span>
          </h2>
          <p className="text-slate-400 text-lg">Bắt đầu miễn phí. Nâng cấp khi bạn sẵn sàng.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`relative rounded-2xl p-6 border transition-all ${
                plan.popular
                  ? 'border-blue-500/50 bg-blue-600/10 shadow-lg shadow-blue-500/10 scale-105'
                  : 'border-white/5 bg-white/[0.03] hover:border-white/10'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-0.5 text-xs font-semibold text-white">Phổ biến nhất</div>
              )}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-yellow-500 px-3 py-0.5 text-xs font-semibold text-black">{plan.badge}</div>
              )}
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${plan.color} mb-4`}>
                <plan.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-white mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-3xl font-extrabold text-white">{plan.price}</span>
                <span className="text-sm text-slate-400">₫</span>
              </div>
              <p className="text-xs text-slate-400 mb-5">/{plan.period}</p>
              <ul className="space-y-2.5 mb-6">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.popular ? 'gradient' : 'outline'}
                className="w-full border-white/20 text-white hover:bg-white/10"
                asChild
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
