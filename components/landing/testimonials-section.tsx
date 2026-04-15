'use client'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const testimonials = [
  { name: 'Nguyễn Minh Anh', role: 'Du học sinh Úc', band: '7.5', prev: '6.0', text: 'Sau 2 tháng dùng IELTS ZEN, band writing của mình tăng từ 5.5 lên 7.0. AI feedback cực kỳ chi tiết, chỉ ra đúng điểm yếu của mình.', avatar: 'M' },
  { name: 'Trần Bảo Khoa', role: 'Sinh viên năm 4', band: '7.0', prev: '5.5', text: 'Reading split-screen y chang thi thật, không bị ngợp khi thi chính thức. Vocabulary game vui như chơi điện thoại, không biết mình đang học.', avatar: 'B' },
  { name: 'Lê Thị Hương', role: 'Giáo viên tiếng Anh', band: '8.0', prev: '7.0', text: 'Phần speaking AI chấm rất chính xác, gần như bằng examiner thật. Tôi dùng để chuẩn bị cho học sinh của mình trước kỳ thi.', avatar: 'H' },
  { name: 'Phạm Đức Dũng', role: 'Kỹ sư phần mềm', band: '7.5', prev: '6.5', text: 'Giao diện đẹp, mượt mà. Hệ thống streak giúp mình duy trì thói quen học mỗi ngày. 45 ngày liên tiếp chưa bỏ buổi nào.', avatar: 'D' },
  { name: 'Vũ Thị Lan', role: 'Nghiên cứu sinh', band: '8.5', prev: '7.5', text: 'Writing Task 2 là điểm yếu của tôi. AI phân tích cấu trúc luận điểm rất tốt, gợi ý cụ thể từng câu. Band tăng liên tục.', avatar: 'L' },
  { name: 'Hoàng Việt Hùng', role: 'Marketing Manager', band: '7.0', prev: '5.0', text: 'Từ band 5 lên 7 sau 3 tháng. Lộ trình học rõ ràng, biết mình cần học gì tiếp theo. Tính năng Daily Challenge rất hay.', avatar: 'V' },
]

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-[#0a0f1e]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">
            Học viên nói gì về{' '}
            <span className="gradient-text">IELTS ZEN</span>
          </h2>
          <p className="text-slate-400 text-lg">Hàng nghìn học viên đã tăng band điểm với IELTS ZEN</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: (i % 3) * 0.1 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 hover:border-blue-500/20 transition-all"
            >
              <div className="flex mb-3">
                {[...Array(5)].map((_, j) => <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
              </div>
              <p className="text-sm text-slate-300 leading-relaxed mb-5">"{t.text}"</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-white font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Band</p>
                  <p className="text-sm font-bold">
                    <span className="text-slate-400 line-through mr-1">{t.prev}</span>
                    <span className="text-emerald-400">→ {t.band}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
