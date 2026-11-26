import { NextResponse, type NextRequest } from 'next/server'

/**
 * Optional password gate for previews (works on any host, including Vercel Hobby).
 * Off unless the SITE_PASSWORD environment variable is set. Visitors then get the
 * browser's sign-in prompt: user name SITE_USER (default "simran") and the password.
 */
export function proxy(request: NextRequest) {
  const password = process.env.SITE_PASSWORD
  if (!password) return NextResponse.next()
  const user = process.env.SITE_USER || 'simran'

  const header = request.headers.get('authorization') ?? ''
  if (header.startsWith('Basic ')) {
    try {
      const decoded = atob(header.slice(6))
      const split = decoded.indexOf(':')
      if (same(decoded.slice(0, split), user) && same(decoded.slice(split + 1), password)) return NextResponse.next()
    } catch {
      // Malformed header: fall through to the prompt.
    }
  }

  return new NextResponse('Password required.', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Simran preview", charset="UTF-8"', 'Cache-Control': 'no-store' },
  })
}

/** Compare without stopping at the first different character. */
function same(a: string, b: string) {
  let diff = a.length ^ b.length
  for (let i = 0; i < Math.max(a.length, b.length); i++) diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0)
  return diff === 0
}
