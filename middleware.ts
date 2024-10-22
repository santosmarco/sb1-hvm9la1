import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const response = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res: response })

  // Refresh session if expired - required for Server Components
  await supabase.auth.getSession()

  // Bypass middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static')
  ) {
    return response
  }

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Auth pages are only accessible when not logged in
  if ((pathname.startsWith('/login') || pathname.startsWith('/register')) && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Protected routes require authentication
  const protectedPaths = ['/dashboard', '/settings', '/profile']
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))

  if (isProtectedPath && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}