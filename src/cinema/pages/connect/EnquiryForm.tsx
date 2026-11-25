'use client'

import { useState, type FormEvent } from 'react'
import {magnetic} from '../../ui'
import s from '../../cinema.module.css'
import c from './connect.module.css'

type Status = 'idle' | 'sending' | 'sent' | 'error'

type Props = { line: string; enquiryTypes: string[]; email: string }

/** The enquiry form, posting name, email, type, message and the `company` honeypot to /api/enquiry. */
export function EnquiryForm({ line, enquiryTypes, email }: Props) {
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
    <section id="enquiry" aria-labelledby="enquiry-h" className={c.block}>
      <div className={c.inner}>
        <div className={`${c.intro} ${s.reveal}`}>
          <p className={`${s.mono} ${s.gold}`}>Enquiries</p>
          <h2 id="enquiry-h" className={s.h2}>
            Send an enquiry
          </h2>
          <p className={c.line}>{line}</p>
          <p className={`${s.mono} ${s.dim} ${c.direct}`}>Or write directly</p>
          <a href={`mailto:${email}`} className={`${c.email} ${s.uline}`}>
            {email}
          </a>
        </div>

        <form className={c.form} onSubmit={submit}>
          <div className={c.field}>
            <label htmlFor="enquiry-name" className={s.mono}>
              Name
            </label>
            <input id="enquiry-name" name="name" type="text" autoComplete="name" required maxLength={120} />
          </div>
          <div className={c.field}>
            <label htmlFor="enquiry-email" className={s.mono}>
              Email
            </label>
            <input id="enquiry-email" name="email" type="email" autoComplete="email" required maxLength={200} />
          </div>
          <div className={c.field}>
            <label htmlFor="enquiry-type" className={s.mono}>
              Enquiry
            </label>
            <select id="enquiry-type" name="type">
              {enquiryTypes.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className={c.field}>
            <label htmlFor="enquiry-msg" className={s.mono}>
              Message
            </label>
            <textarea id="enquiry-msg" name="message" rows={5} required maxLength={4000} />
          </div>
          {/* Honeypot: people never see or fill this. */}
          <input className={c.trap} type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <div className={c.actions}>
            <button type="submit" className={`${s.pill} ${s.pillLarge} ${s.mag} ${c.submit}`} disabled={status === 'sending'} {...magnetic}>
              <span className={`${s.mono} ${s.gold}`} aria-hidden="true">
                ●
              </span>
              {status === 'sending' ? 'Sending…' : 'Send enquiry'}
            </button>
            <p className={c.status} role="status">
              {status === 'sent' && 'Thank you. Your enquiry has been sent.'}
              {status === 'error' && (
                <>
                  That did not go through. Please email{' '}
                  <a href={`mailto:${email}`} className={s.uline}>
                    {email}
                  </a>{' '}
                  instead.
                </>
              )}
            </p>
          </div>
        </form>
      </div>
    </section>
  )
}
