import { NextRequest, NextResponse } from 'next/server'
import { isValidToken, ADMIN_COOKIE_NAME } from '@/lib/admin-auth'

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname === '/admin/login' || pathname === '/api/admin/login') {
    return NextResponse.next()
  }

  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value
  const valid = await isValidToken(token)

  if (!valid) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
