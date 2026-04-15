'use client'
import { motion } from 'framer-motion'
import { ClipboardList, Target, BookOpen, TrendingUp } from 'lucide-react'

const steps = [
  { icon: ClipboardList, title: 'Thi thử xác định band', desc: 'Làm bài thi tổng hợp 40 câu để AI xác định band điểm thực sự của bạn, hoặc tự chọn band nếu bạn đã biết.', num: '01' },
  { icon: Target, title: 'Nhận lộ trình cá nhân', desc: 'Hệ thống gợi ý bài học phù hợp với band hiện tại, sắp xếp theo thứ tự ưu tiên để tăng band nhanh nhất.', num: '02' },
  { icon: BookOpen, title: 'Học và luyện tập', desc: 'Học từ vựng, ngữ pháp với game. Luyện đọc, nghe, nói, viết với bài thực tế. AI chấm bài tức thì.', num: '03' },
  { icon: TrendingUp, title: 'Theo dõi tiến độ', desc: 'Dashboard với heatmap, streak, biểu đồ band score. Thấy rõ sự tiến bộ từng ngày và duy trì động lực.', num: '04' },
]

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-[#0d1629]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">
            Bắt đầu chỉ trong <span className="gradient-text">4 bước</span>
          </h2>
          <p className="text-slate-400 text-lg">Đơn giản, hiệu quả, và được cá nhân hóa cho bạn.</p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              viewport={{ once: true }}
              className="relative"
            >
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[calc(100%-1rem)] w-full h-px border-t border-dashed border-blue-500/30 z-0" />
              )}
              <div className="relative z-10 text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/20 mb-4">
                  <s.icon className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">{s.num}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
