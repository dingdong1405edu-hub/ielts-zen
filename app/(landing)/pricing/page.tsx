import { Metadata } from 'next'
import { PricingSection } from '@/components/landing/pricing-section'
import { ChevronDown } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Bảng giá – IELTS ZEN',
  description: 'Chọn gói phù hợp với mục tiêu IELTS của bạn. Bắt đầu miễn phí, nâng cấp khi sẵn sàng.',
}

const faqs = [
  {
    q: 'Token là gì?',
    a: 'Token là đơn vị sử dụng AI trong IELTS ZEN. Mỗi lần bạn nhận phản hồi từ AI (Speaking, Writing) tốn 1 token. Gói miễn phí có 30 token/tháng. Premium có token không giới hạn.',
  },
  {
    q: 'Premium bao gồm những gì?',
    a: 'Premium mở khóa: token không giới hạn cho Speaking và Writing AI, phân tích chi tiết theo từng tiêu chí IELTS (Task Achievement, Coherence, Lexical Resource, Grammar), lịch sử bài làm không giới hạn, và ưu tiên xếp hàng xử lý AI.',
  },
  {
    q: 'Tôi có thể hủy Premium bất cứ lúc nào không?',
    a: 'Premium của IELTS ZEN là mua theo kỳ (30/60/90 ngày) chứ không phải subscription tự động gia hạn. Bạn sẽ không bị tính phí lại sau khi hết hạn trừ khi mua thêm.',
  },
  {
    q: 'Phương thức thanh toán được chấp nhận?',
    a: 'Chúng tôi chấp nhận thẻ Visa, Mastercard, thẻ ATM nội địa qua cổng thanh toán Stripe. Giao dịch được mã hóa SSL bảo mật.',
  },
  {
    q: 'Tôi có thể hoàn tiền không?',
    a: 'Chúng tôi hỗ trợ hoàn tiền trong vòng 24 giờ kể từ khi thanh toán nếu bạn chưa sử dụng token Premium. Liên hệ support@ieltszen.vn để được hỗ trợ.',
  },
  {
    q: 'Gói 2 tháng và 3 tháng tiết kiệm bao nhiêu?',
    a: 'Gói 2 tháng (540,000₫) tiết kiệm 10% so với mua 2 lần gói 1 tháng. Gói 3 tháng (720,000₫) tiết kiệm 20% — chỉ 240,000₫/tháng. Phù hợp nếu bạn có kế hoạch học dài hạn.',
  },
  {
    q: 'Reading và Listening có miễn phí không?',
    a: 'Có! Toàn bộ bài đọc (Reading) và nghe (Listening) đều miễn phí không giới hạn. Chỉ có Speaking AI và Writing AI mới tốn token vì cần xử lý AI phức tạp hơn.',
  },
  {
    q: 'Placement test có tính phí không?',
    a: 'Không. Placement test để xác định trình độ ban đầu hoàn toàn miễn phí và không tốn token.',
  },
]

export default function PricingPage() {
  return (
    <div className="bg-[#0a0f1e] text-white min-h-screen pt-16">
      {/* Hero */}
      <div className="pt-16 pb-4 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">
          Bảng giá minh bạch
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          Không phí ẩn, không tự gia hạn. Trả bao nhiêu, dùng bấy nhiêu.
        </p>
      </div>

      <PricingSection />

      {/* FAQ */}
      <section className="py-20 px-4 bg-[#0a0f1e]">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white mb-3">Câu hỏi thường gặp</h2>
            <p className="text-slate-400">Giải đáp thắc mắc về gói dịch vụ và thanh toán</p>
          </div>
          <div className="space-y-3">
            {faqs.map(({ q, a }, i) => (
              <details
                key={i}
                className="group rounded-xl border border-white/5 bg-white/[0.03] overflow-hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-white font-medium hover:bg-white/5 transition-colors list-none">
                  <span>{q}</span>
                  <ChevronDown className="h-4 w-4 text-slate-400 transition-transform group-open:rotate-180 shrink-0 ml-4" />
                </summary>
                <div className="px-6 pb-5 text-slate-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                  {a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 px-4 text-center">
        <p className="text-slate-400 mb-4">Vẫn còn thắc mắc?</p>
        <a
          href="mailto:support@ieltszen.vn"
          className="text-blue-400 font-medium hover:text-blue-300 transition-colors"
        >
          Liên hệ support@ieltszen.vn
        </a>
      </section>
    </div>
  )
}
