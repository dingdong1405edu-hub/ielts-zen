'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Zap, LogIn, ChevronDown, User, LogOut, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/#features', label: 'Tính năng' },
  { href: '/pricing', label: 'Bảng giá' },
  { href: '/about', label: 'Về chúng tôi' },
  { href: '/blog', label: 'Blog' },
]

interface NavbarProps {
  user?: { name?: string | null; email?: string | null; image?: string | null } | null
}

export function Navbar({ user }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  const isLanding = pathname === '/'

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled || !isLanding
          ? 'border-b border-border/50 bg-background/80 backdrop-blur-xl shadow-sm'
          : 'bg-transparent'
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg group-hover:shadow-blue-500/40 transition-shadow">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">IELTS ZEN</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-blue-400',
                  pathname === link.href ? 'text-blue-400' : 'text-muted-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-full p-1 hover:bg-accent transition-colors"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.image ?? ''} />
                    <AvatarFallback>{user.name?.[0]?.toUpperCase() ?? 'U'}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{user.name?.split(' ')[0]}</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 mt-2 w-48 rounded-xl border border-border bg-card shadow-xl py-1"
                    >
                      <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent" onClick={() => setUserMenuOpen(false)}>
                        <LayoutDashboard className="h-4 w-4" /> Dashboard
                      </Link>
                      <Link href="/profile" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent" onClick={() => setUserMenuOpen(false)}>
                        <User className="h-4 w-4" /> Hồ sơ
                      </Link>
                      <hr className="my-1 border-border" />
                      <form action="/api/auth/signout" method="POST">
                        <button type="submit" className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-accent">
                          <LogOut className="h-4 w-4" /> Đăng xuất
                        </button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login"><LogIn className="h-4 w-4 mr-1" /> Đăng nhập</Link>
                </Button>
                <Button variant="gradient" size="sm" asChild>
                  <Link href="/register">Bắt đầu miễn phí</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile: theme + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-lg p-2 hover:bg-accent transition-colors"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl"
          >
            <nav className="flex flex-col gap-1 p-4">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-4 py-3 text-sm font-medium hover:bg-accent transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <hr className="my-2 border-border" />
              {user ? (
                <>
                  <Link href="/dashboard" className="rounded-lg px-4 py-3 text-sm font-medium hover:bg-accent flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Link>
                  <Link href="/profile" className="rounded-lg px-4 py-3 text-sm font-medium hover:bg-accent flex items-center gap-2">
                    <User className="h-4 w-4" /> Hồ sơ
                  </Link>
                  <form action="/api/auth/signout" method="POST">
                    <button type="submit" className="w-full text-left rounded-lg px-4 py-3 text-sm text-red-400 hover:bg-accent flex items-center gap-2">
                      <LogOut className="h-4 w-4" /> Đăng xuất
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-2">
                  <Button variant="outline" asChild><Link href="/login">Đăng nhập</Link></Button>
                  <Button variant="gradient" asChild><Link href="/register">Bắt đầu miễn phí</Link></Button>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
