import { NextResponse } from 'next/server'
import { getExpectedToken, ADMIN_COOKIE_NAME } from '@/lib/admin-auth'

export async function POST(req: Request) {
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'ADMIN_PASSWORD non configuré sur le serveur' }, { status: 500 })
  }
  try {
    const { password } = await req.json()
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 })
    }
    const token = await getExpectedToken()
    const res = NextResponse.json({ success: true })
    res.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    })
    return res
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 })
  }
}
