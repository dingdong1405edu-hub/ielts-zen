import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

const protectedPaths = ['/dashboard', '/vocabulary', '/grammar', '/reading', '/listening', '/speaking', '/writing', '/placement-test', '/leaderboard', '/profile', '/premium']

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isProtected = protectedPaths.some(p => pathname.startsWith(p))

  if (isProtected && !req.auth) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if ((pathname === '/login' || pathname === '/register') && req.auth) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|public).*)'],
}
