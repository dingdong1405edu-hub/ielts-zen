'use client'
import { motion } from 'framer-motion'

const stats = [
  { value: '50,000+', label: 'Học viên', emoji: '👨‍🎓' },
  { value: '95%', label: 'Tăng band', emoji: '📈' },
  { value: '4.9/5', label: 'Đánh giá', emoji: '⭐' },
  { value: '< 30s', label: 'Phản hồi AI', emoji: '⚡' },
]

export function StatsSection() {
  return (
    <section className="py-16 bg-[#0d1629] border-y border-blue-500/10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl mb-2">{s.emoji}</div>
              <div className="text-3xl md:text-4xl font-extrabold gradient-text mb-1">{s.value}</div>
              <div className="text-sm text-slate-400">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
