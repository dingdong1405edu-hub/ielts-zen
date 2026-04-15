import { Metadata } from 'next'
import { Target, Users, Cpu, Heart, Zap, Globe, BookOpen, Mic, PenTool, Brain } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Về chúng tôi – IELTS ZEN',
  description: 'Tìm hiểu về sứ mệnh, đội ngũ và công nghệ đằng sau IELTS ZEN.',
}

const team = [
  {
    name: 'Nguyễn Minh Khoa',
    role: 'Co-founder & CEO',
    bio: 'Cựu giáo viên IELTS 8.5, đam mê EdTech và AI. Từng làm việc tại các trường đại học hàng đầu Việt Nam trước khi thành lập IELTS ZEN.',
    avatar: 'MK',
    gradient: 'from-blue-500 to-cyan-400',
  },
  {
    name: 'Trần Thị Lan Anh',
    role: 'Head of AI & Product',
    bio: 'Thạc sĩ Khoa học Máy tính tại NUS Singapore. Chuyên gia NLP và Speech Processing, thiết kế toàn bộ engine đánh giá AI của IELTS ZEN.',
    avatar: 'LA',
    gradient: 'from-purple-500 to-pink-400',
  },
  {
    name: 'Lê Hoàng Duy',
    role: 'Lead Engineer',
    bio: 'Full-stack engineer với 8 năm kinh nghiệm. Đã xây dựng sản phẩm cho hơn 1 triệu người dùng. Yêu thích Next.js, performance optimization và café đen.',
    avatar: 'HD',
    gradient: 'from-emerald-500 to-teal-400',
  },
]

const techStack = [
  { name: 'Google Gemini', desc: 'AI đánh giá Writing & Speaking, phân tích ngữ pháp chi tiết', icon: Brain, color: 'text-blue-400' },
  { name: 'Groq', desc: 'Inference siêu nhanh cho phản hồi real-time, độ trễ < 1 giây', icon: Zap, color: 'text-yellow-400' },
  { name: 'Deepgram', desc: 'Speech-to-text chính xác cao cho luyện Speaking tự động', icon: Mic, color: 'text-purple-400' },
  { name: 'Next.js 14', desc: 'App Router, Server Components, streaming UI hiệu năng cao', icon: Globe, color: 'text-white' },
  { name: 'Railway', desc: 'Deploy PostgreSQL và Next.js app trên cloud infrastructure tốc độ cao', icon: Cpu, color: 'text-emerald-400' },
  { name: 'Prisma ORM', desc: 'Type-safe database access, migration tự động, tích hợp mượt mà', icon: BookOpen, color: 'text-cyan-400' },
]

const values = [
  {
    icon: Target,
    title: 'Học có mục tiêu',
    desc: 'Mỗi bài học, bài kiểm tra được thiết kế với mục tiêu rõ ràng giúp bạn tiến bộ từng ngày.',
    color: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
    iconColor: 'text-blue-400',
  },
  {
    icon: Heart,
    title: 'Học viên là trung tâm',
    desc: 'Mọi tính năng được xây dựng dựa trên feedback thực tế từ cộng đồng học viên IELTS.',
    color: 'from-pink-500/20 to-pink-600/10 border-pink-500/30',
    iconColor: 'text-pink-400',
  },
  {
    icon: PenTool,
    title: 'Phản hồi thực chất',
    desc: 'Không chỉ chấm điểm, IELTS ZEN giải thích tại sao và hướng dẫn bạn cách cải thiện.',
    color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30',
    iconColor: 'text-emerald-400',
  },
  {
    icon: Users,
    title: 'Cộng đồng học tập',
    desc: 'Cạnh tranh lành mạnh qua leaderboard, chia sẻ kiến thức và hỗ trợ lẫn nhau tiến bộ.',
    color: 'from-purple-500/20 to-purple-600/10 border-purple-500/30',
    iconColor: 'text-purple-400',
  },
]

export default function AboutPage() {
  return (
    <div className="bg-[#0a0f1e] text-white min-h-screen overflow-hidden pt-16">
      {/* Hero / Mission */}
      <section className="relative py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 via-transparent to-transparent pointer-events-none" />
        <div className="mx-auto max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm text-blue-300 mb-6">
            <Zap className="h-3.5 w-3.5" />
            Sứ mệnh của chúng tôi
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            Giúp mọi người Việt{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              chinh phục IELTS
            </span>{' '}
            với chi phí hợp lý
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            IELTS ZEN ra đời từ niềm tin rằng công nghệ AI có thể mang lại trải nghiệm luyện thi IELTS
            cá nhân hóa, hiệu quả và tiết kiệm hơn bất kỳ trung tâm nào — ngay trên điện thoại của bạn.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-6 max-w-lg mx-auto">
            {[
              { value: '10,000+', label: 'Học viên' },
              { value: '98%', label: 'Hài lòng' },
              { value: '6.8', label: 'Band TB' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">{value}</p>
                <p className="text-slate-400 text-sm mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 bg-[#0d1629]">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">Giá trị cốt lõi</h2>
            <p className="text-slate-400">Những nguyên tắc định hướng mọi quyết định của chúng tôi</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map(({ icon: Icon, title, desc, color, iconColor }) => (
              <div
                key={title}
                className={`rounded-2xl border bg-gradient-to-br p-6 ${color}`}
              >
                <div className="mb-4">
                  <Icon className={`h-7 w-7 ${iconColor}`} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">Đội ngũ sáng lập</h2>
            <p className="text-slate-400">Những con người đứng sau IELTS ZEN</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member) => (
              <div
                key={member.name}
                className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 text-center hover:border-white/10 transition-colors"
              >
                <div className={`inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${member.gradient} text-2xl font-extrabold text-white mb-4 shadow-lg`}>
                  {member.avatar}
                </div>
                <h3 className="text-xl font-bold text-white mb-0.5">{member.name}</h3>
                <p className="text-sm text-blue-400 font-medium mb-4">{member.role}</p>
                <p className="text-slate-400 text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 px-4 bg-[#0d1629]">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">Công nghệ sử dụng</h2>
            <p className="text-slate-400">Chúng tôi chọn những công cụ tốt nhất để phục vụ bạn</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {techStack.map(({ name, desc, icon: Icon, color }) => (
              <div
                key={name}
                className="flex items-start gap-4 rounded-xl border border-white/5 bg-white/[0.03] p-5 hover:border-white/10 transition-colors"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5">
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <div>
                  <p className="font-semibold text-white mb-1">{name}</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">Sẵn sàng bắt đầu?</h2>
          <p className="text-slate-400 mb-8">Tham gia cùng hơn 10,000 học viên đang cải thiện IELTS mỗi ngày.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/register"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-8 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-shadow"
            >
              Bắt đầu miễn phí
            </a>
            <a
              href="/pricing"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 px-8 text-white font-semibold hover:bg-white/5 transition-colors"
            >
              Xem bảng giá
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
