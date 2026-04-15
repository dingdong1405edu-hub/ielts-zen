import Link from 'next/link'
import { Zap } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-[#060b17] border-t border-white/5 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold gradient-text">IELTS ZEN</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">Nền tảng luyện thi IELTS thông minh với AI — tăng band điểm nhanh nhất.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Học</h4>
            <ul className="space-y-2">
              {['Từ vựng', 'Ngữ pháp', 'Reading', 'Listening', 'Speaking', 'Writing'].map(l => (
                <li key={l}><Link href={`/${l.toLowerCase()}`} className="text-sm text-slate-400 hover:text-white transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Công ty</h4>
            <ul className="space-y-2">
              {[['Về chúng tôi', '/about'], ['Bảng giá', '/pricing'], ['Blog', '/blog'], ['Liên hệ', '/contact']].map(([l, h]) => (
                <li key={l as string}><Link href={h as string} className="text-sm text-slate-400 hover:text-white transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Hỗ trợ</h4>
            <ul className="space-y-2">
              {[['FAQ', '/faq'], ['Chính sách bảo mật', '/privacy'], ['Điều khoản dịch vụ', '/terms']].map(([l, h]) => (
                <li key={l as string}><Link href={h as string} className="text-sm text-slate-400 hover:text-white transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 pt-8 text-center text-sm text-slate-500">
          © 2025 IELTS ZEN. All rights reserved. Made with ❤️ in Vietnam.
        </div>
      </div>
    </footer>
  )
}
