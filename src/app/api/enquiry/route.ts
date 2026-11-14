import { NextResponse } from 'next/server'

/**
 * Receives the Closed Set form. Validated enquiries are forwarded as JSON to
 * ENQUIRY_WEBHOOK_URL (a mail service, CRM or automation endpoint). Until that
 * is configured the route answers 503 and the form tells the visitor to email.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid body' }, { status: 400 })
  }

  const text = (key: string, max: number) => (typeof body[key] === 'string' ? (body[key] as string).trim().slice(0, max) : '')
  const enquiry = { name: text('name', 120), email: text('email', 200), type: text('type', 40), message: text('message', 4000) }

  // Honeypot filled in: pretend it worked.
  if (text('company', 10)) return NextResponse.json({ ok: true })

  if (!enquiry.name || !enquiry.message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiry.email)) {
    return NextResponse.json({ error: 'missing fields' }, { status: 422 })
  }

  const url = process.env.ENQUIRY_WEBHOOK_URL
  if (!url) return NextResponse.json({ error: 'enquiries are not configured' }, { status: 503 })

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ ...enquiry, receivedAt: new Date().toISOString() }),
  })
  if (!res.ok) return NextResponse.json({ error: 'delivery failed' }, { status: 502 })
  return NextResponse.json({ ok: true })
}
