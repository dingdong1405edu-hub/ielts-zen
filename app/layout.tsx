import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: {
    default: 'IELTS ZEN — Luyện Thi IELTS Bằng AI',
    template: '%s | IELTS ZEN',
  },
  description:
    'Nền tảng luyện thi IELTS thông minh với AI. Luyện đọc, nghe, nói, viết — chấm bài tức thì, tăng band nhanh nhất.',
  keywords: ['IELTS', 'luyện thi IELTS', 'học IELTS online', 'AI IELTS', 'IELTS ZEN'],
  authors: [{ name: 'IELTS ZEN Team' }],
  openGraph: {
    title: 'IELTS ZEN — Luyện Thi IELTS Bằng AI',
    description: 'Học IELTS thông minh hơn với AI. Tăng band điểm nhanh nhất.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0f1e',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
