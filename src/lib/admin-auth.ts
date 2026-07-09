export const ADMIN_COOKIE_NAME = 'nostalgie_admin'

const SESSION_MESSAGE = 'nostalgie-admin-session'

async function sign(secret: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(SESSION_MESSAGE))
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function getExpectedToken(): Promise<string> {
  return sign(process.env.ADMIN_PASSWORD || '')
}

export async function isValidToken(token: string | undefined | null): Promise<boolean> {
  if (!token || !process.env.ADMIN_PASSWORD) return false
  const expected = await getExpectedToken()
  if (token.length !== expected.length) return false
  let diff = 0
  for (let i = 0; i < token.length; i++) diff |= token.charCodeAt(i) ^ expected.charCodeAt(i)
  return diff === 0
}
