'use client'

import { useState, type FormEvent } from 'react'
import { Container, SectionHeading } from '@/components/ui'
import s from './Connect.module.css'

export type ConnectData = { line: string; enquiryTypes: string[] }

type Status = 'idle' | 'sending' | 'sent' | 'error'

/** Closed Set: one line, the email address and a short enquiry form. */
export function Connect({ data, email, id = 'connect', title = 'Closed Set', as = 'h2' }: { data: ConnectData; email: string; id?: string; title?: string; as?: 'h1' | 'h2' }) {
  const [status, setStatus] = useState<Status>('idle')

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    setStatus('sending')
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      })
      if (!res.ok) throw new Error(String(res.status))
      form.reset()
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id={id} aria-labelledby={`${id}-h`} className={s.section}>
      <Container className={s.grid}>
        <div>
          <SectionHeading id={`${id}-h`} as={as} className={s.title}>
            {title}
          </SectionHeading>
          <p className={s.line}>{data.line}</p>
          <a href={`mailto:${email}`} className={s.email}>
            {email}
          </a>
        </div>
        <form className={s.form} onSubmit={submit}>
          <div className={s.field}>
            <label htmlFor={`${id}-name`}>Name</label>
            <input id={`${id}-name`} name="name" type="text" autoComplete="name" required maxLength={120} />
          </div>
          <div className={s.field}>
            <label htmlFor={`${id}-email`}>Email</label>
            <input id={`${id}-email`} name="email" type="email" autoComplete="email" required maxLength={200} />
          </div>
          <div className={s.field}>
            <label htmlFor={`${id}-type`}>Enquiry</label>
            <select id={`${id}-type`} name="type">
              {data.enquiryTypes.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className={s.field}>
            <label htmlFor={`${id}-msg`}>Message</label>
            <textarea id={`${id}-msg`} name="message" rows={4} required maxLength={4000} />
          </div>
          {/* Honeypot: people never see or fill this. */}
          <input className={s.trap} type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <button type="submit" className={s.submit} disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Send enquiry'}
          </button>
          <p className={s.status} role="status">
            {status === 'sent' && 'Thank you. Your enquiry has been sent.'}
            {status === 'error' && (
              <>
                That did not go through. Please email <a href={`mailto:${email}`}>{email}</a> instead.
              </>
            )}
          </p>
        </form>
      </Container>
    </section>
  )
}
