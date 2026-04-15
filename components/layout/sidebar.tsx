'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, BookOpen, Brain, FileText, Headphones,
  Mic, PenTool, Trophy, User, Crown, ChevronLeft, ChevronRight,
  Zap, Menu, X, FlameIcon, Coins
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ThemeToggle } from './theme-toggle'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/vocabulary', icon: BookOpen, label: 'Từ vựng' },
  { href: '/grammar', icon: Brain, label: 'Ngữ pháp' },
  { href: '/reading', icon: FileText, label: 'Reading' },
  { href: '/listening', icon: Headphones, label: 'Listening' },
  { href: '/speaking', icon: Mic, label: 'Speaking' },
  { href: '/writing', icon: PenTool, label: 'Writing' },
]

const bottomItems = [
  { href: '/leaderboard', icon: Trophy, label: 'Bảng xếp hạng' },
  { href: '/premium', icon: Crown, label: 'Premium', badge: 'HOT' },
  { href: '/profile', icon: User, label: 'Hồ sơ' },
]

interface SidebarProps {
  tokens?: number
  streak?: number
  xp?: number
  isPremium?: boolean
}

export function Sidebar({ tokens = 30, streak = 0, xp = 0, isPremium = false }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={cn('flex h-full flex-col', collapsed && !mobile ? 'items-center' : '')}>
      {/* Logo */}
      <div className={cn('flex items-center gap-2 p-4 mb-2', collapsed && !mobile ? 'justify-center' : '')}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400">
          <Zap className="h-5 w-5 text-white" />
        </div>
        {(!collapsed || mobile) && <span className="text-lg font-bold gradient-text">IELTS ZEN</span>}
      </div>

      {/* Stats strip */}
      {(!collapsed || mobile) && (
        <div className="mx-3 mb-4 flex items-center justify-between rounded-xl bg-gradient-to-r from-blue-600/10 to-cyan-500/10 border border-blue-500/20 p-3">
          <div className="flex items-center gap-1.5">
            <FlameIcon className="h-4 w-4 text-orange-400" />
            <span className="text-xs font-bold text-orange-400">{streak}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Coins className="h-4 w-4 text-yellow-400" />
            <span className="text-xs font-bold text-yellow-400">{isPremium ? '∞' : tokens}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="h-4 w-4 text-blue-400" />
            <span className="text-xs font-bold text-blue-400">{xp} XP</span>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2 space-y-0.5">
        {navItems.map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
                collapsed && !mobile ? 'justify-center px-2' : '',
                active
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <item.icon className={cn('h-5 w-5 shrink-0', active ? 'text-white' : '')} />
              {(!collapsed || mobile) && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="px-2 pb-2 space-y-0.5">
        {bottomItems.map(item => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
                collapsed && !mobile ? 'justify-center px-2' : '',
                active ? 'bg-accent text-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <item.icon className={cn('h-5 w-5 shrink-0', item.href === '/premium' ? 'text-yellow-400' : '')} />
              {(!collapsed || mobile) && (
                <span className="flex-1">{item.label}</span>
              )}
              {(!collapsed || mobile) && item.badge && (
                <Badge variant="warning" className="text-[10px] px-1.5 py-0">{item.badge}</Badge>
              )}
            </Link>
          )
        })}
        <div className={cn('flex items-center px-3 py-2', collapsed && !mobile ? 'justify-center' : 'justify-between')}>
          {(!collapsed || mobile) && <span className="text-xs text-muted-foreground">Theme</span>}
          <ThemeToggle />
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden md:flex flex-col h-full border-r border-border bg-card transition-all duration-300 relative',
          collapsed ? 'w-16' : 'w-60'
        )}
      >
        <SidebarContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card shadow-sm hover:bg-accent transition-colors"
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      </aside>

      {/* Mobile: top bar + drawer */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex h-14 items-center justify-between px-4 border-b border-border bg-card/90 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold gradient-text">IELTS ZEN</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button onClick={() => setMobileOpen(true)} className="rounded-lg p-1.5 hover:bg-accent">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="md:hidden fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border shadow-2xl"
            >
              <button onClick={() => setMobileOpen(false)} className="absolute right-3 top-3 rounded-lg p-1.5 hover:bg-accent">
                <X className="h-5 w-5" />
              </button>
              <SidebarContent mobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
