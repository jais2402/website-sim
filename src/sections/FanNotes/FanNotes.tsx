'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Container, SectionHeading } from '@/components/ui'
import { useReducedMotion } from '@/lib/motion'
import s from './FanNotes.module.css'

export type FanNote = {
  occasion: string
  date: string
  /** Salutation line. */
  greet: string
  /** Simran's own words, exactly as supplied. Blank lines separate paragraphs. */
  body: string
  /** One line shown in the "Earlier notes" list. */
  preview: string
}

export type FanNotesLink = { label: string; href: string }

export type FanNotesData = {
  heading: string
  /** Tamil tag beside the intro line. */
  tamil?: string
  intro?: string
  signOff: string
  /** `image` is the scanned signature; `null` renders the typeset stand-in. */
  signature: { name: string; image: string | null }
  cta: FanNotesLink
  /** Optional link to a notes archive, shown top right. */
  allNotes?: FanNotesLink
  disclaimer?: string
  notes: FanNote[]
}

/** Letter fades out for this long before the text is swapped (HANDOVER.md §3.13). */
const FADE_OUT_MS = 180

function ActionLink({ link, className }: { link: FanNotesLink; className: string }) {
  const body = <>{link.label} →</>
  return /^(https?:|mailto:|#)/.test(link.href) ? (
    <a href={link.href} className={className}>
      {body}
    </a>
  ) : (
    <Link href={link.href} className={className}>
      {body}
    </Link>
  )
}

export function FanNotes({ data }: { data: FanNotesData }) {
  const reduced = useReducedMotion()
  const [selected, setSelected] = useState(0)
  const [fading, setFading] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const pick = (k: number) => {
    if (k === selected) return
    clearTimeout(timer.current)
    if (reduced) {
      setFading(false)
      setSelected(k)
      return
    }
    setFading(true)
    timer.current = setTimeout(() => {
      setSelected(k)
      setFading(false)
    }, FADE_OUT_MS)
  }

  const cur = data.notes[selected] ?? data.notes[0]
  if (!cur) return null

  return (
    <section id="notes" aria-labelledby="fn-h" className={s.section}>
      <Container>
        <div className={s.head}>
          <div>
            <SectionHeading id="fn-h" className={s.heading}>
              {data.heading}
            </SectionHeading>
            {data.tamil || data.intro ? (
              <p className={s.sub}>
                {data.tamil ? (
                  <span lang="ta" className={s.tamil}>
                    {data.tamil}
                  </span>
                ) : null}
                {data.intro ? <span className={s.intro}>{data.intro}</span> : null}
              </p>
            ) : null}
          </div>
          {data.allNotes ? <ActionLink link={data.allNotes} className={s.allNotes} /> : null}
        </div>

        <div className={s.body}>
          <div className={s.desk}>
            <div className={s.sheet} aria-hidden="true" />
            <article aria-live="polite" className={[s.letter, fading ? s.fading : ''].join(' ')}>
              <div className={s.seal} aria-hidden="true">
                S
              </div>
              <div className={s.meta}>
                <span>{cur.occasion}</span>
                <span className={s.date}>{cur.date}</span>
              </div>
              <p className={s.greet}>{cur.greet}</p>
              <p className={s.text}>{cur.body}</p>
              <div className={s.foot}>
                <div>
                  <div className={s.signOff}>{data.signOff}</div>
                  {data.signature.image ? (
                    <img className={s.signatureImage} src={data.signature.image} alt={data.signature.name} loading="lazy" />
                  ) : (
                    <>
                      <div className={s.signature}>{data.signature.name}</div>
                      <div className={s.signatureNote}>Signature placeholder</div>
                    </>
                  )}
                </div>
                <ActionLink link={data.cta} className={s.cta} />
              </div>
            </article>
          </div>

          <div className={s.aside}>
            <h3 className={s.listLabel}>Earlier notes</h3>
            <ul className={s.list}>
              {data.notes.map((n, k) => (
                <li key={k}>
                  <button
                    type="button"
                    className={s.note}
                    aria-pressed={k === selected}
                    onClick={() => pick(k)}
                    onMouseEnter={() => pick(k)}
                    onFocus={() => pick(k)}
                  >
                    <span className={s.noteOccasion}>{n.occasion}</span>
                    <span className={s.noteDate}>{n.date}</span>
                    <span className={s.notePreview}>{n.preview}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {data.disclaimer ? <p className={s.disclaimer}>{data.disclaimer}</p> : null}
      </Container>
    </section>
  )
}
