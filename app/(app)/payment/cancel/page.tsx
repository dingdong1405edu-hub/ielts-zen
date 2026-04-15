'use client'

import { motion } from 'framer-motion'
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function PaymentCancelPage() {
  const router = useRouter()

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="text-center max-w-md mx-auto"
      >
        {/* Cancel Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-br from-slate-400/20 to-slate-500/20 border border-slate-400/30 mb-6"
        >
          <XCircle className="h-12 w-12 text-slate-400" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-extrabold text-foreground mb-3"
        >
          Thanh toán bị hủy
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-muted-foreground mb-2"
        >
          Bạn đã hủy quá trình thanh toán. Không có khoản phí nào bị tính.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-muted-foreground text-sm mb-8"
        >
          Bạn có thể thử lại bất cứ lúc nào. Nếu gặp vấn đề khi thanh toán, liên hệ{' '}
          <a href="mailto:support@ieltszen.vn" className="text-blue-400 hover:underline">
            support@ieltszen.vn
          </a>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Button
            variant="gradient"
            size="lg"
            onClick={() => router.push('/premium')}
          >
            <RefreshCw className="h-4 w-4" />
            Thử lại
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.push('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4" />
            Về Dashboard
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
