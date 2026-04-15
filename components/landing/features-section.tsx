'use client'
import { motion } from 'framer-motion'
import { BookOpen, Brain, FileText, Headphones, Mic, PenTool, Gamepad2, Trophy, Share2 } from 'lucide-react'

const features = [
  {
    icon: BookOpen,
    title: 'Từ vựng Gamified',
    desc: 'Học từ vựng theo band và chủ đề IELTS với 4 game: Flashcard, Ghép từ, Điền vào ô trống, Xếp câu. Giống Duolingo, không nhàm chán.',
    color: 'from-blue-500 to-blue-600',
    badge: 'Phổ biến nhất',
  },
  {
    icon: Brain,
    title: 'Ngữ pháp Tương Tác',
    desc: 'Lý thuyết ngữ pháp dạng card với ví dụ sinh động. Bài tập trắc nghiệm có giải thích chi tiết từng đáp án bằng AI.',
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: FileText,
    title: 'Reading Split-Screen',
    desc: 'Giao diện thi thật: bài đọc bên trái, câu hỏi bên phải. Highlight từ để tra từ điển ngay. Auto-save nếu thoát giữa chừng.',
    color: 'from-cyan-500 to-cyan-600',
  },
  {
    icon: Headphones,
    title: 'Listening Thực Tế',
    desc: 'Audio player với waveform visualizer. Điều chỉnh tốc độ 0.75x/1x/1.25x. Câu hỏi theo format IELTS thật. Transcript sau khi nộp.',
    color: 'from-green-500 to-green-600',
  },
  {
    icon: Mic,
    title: 'Speaking + AI Feedback',
    desc: 'Ghi âm trực tiếp, Deepgram chuyển giọng thành văn bản, Gemini chấm theo 4 tiêu chí IELTS và đưa ra bài mẫu cải thiện.',
    color: 'from-red-500 to-red-600',
    badge: 'AI Powered',
  },
  {
    icon: PenTool,
    title: 'Writing + AI Grading',
    desc: 'Editor đếm từ real-time. AI chấm Task 1 & Task 2 theo đúng 4 band descriptors của IELTS với nhận xét cụ thể từng đoạn văn.',
    color: 'from-orange-500 to-orange-600',
    badge: 'AI Powered',
  },
  {
    icon: Gamepad2,
    title: 'Gamification',
    desc: 'XP, streak, level (Bronze → Diamond), heatmap hoạt động như GitHub. Daily challenge mỗi ngày 5 phút, tặng bonus XP.',
    color: 'from-yellow-500 to-amber-500',
  },
  {
    icon: Trophy,
    title: 'Bảng Vinh Danh',
    desc: 'Xếp hạng theo tuần/tháng/all-time. Top 3 có hiệu ứng podium đặc biệt. Reset tự động đầu tháng, lưu kết quả vào hall of fame.',
    color: 'from-pink-500 to-pink-600',
  },
  {
    icon: Share2,
    title: 'Chia Sẻ Nhận Quà',
    desc: 'Giới thiệu 5 bạn bè chưa dùng app → nhận 15 ngày Premium miễn phí. Tracking real-time "X/5 bạn đã tham gia".',
    color: 'from-indigo-500 to-indigo-600',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-[#0a0f1e]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            Đầy đủ mọi kỹ năng{' '}
            <span className="gradient-text">trong một nền tảng</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Từ lý thuyết đến thực hành, từ gamification đến AI chấm bài — tất cả những gì bạn cần để tăng band IELTS.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: (i % 3) * 0.1 }}
              viewport={{ once: true }}
              className="group relative rounded-2xl border border-white/5 bg-white/[0.03] p-6 hover:bg-white/[0.06] hover:border-blue-500/30 transition-all duration-300 card-hover"
            >
              {f.badge && (
                <span className="absolute top-4 right-4 rounded-full bg-blue-500/20 border border-blue-500/30 px-2 py-0.5 text-[10px] font-semibold text-blue-300">{f.badge}</span>
              )}
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} mb-4 shadow-lg`}>
                <f.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">{f.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
