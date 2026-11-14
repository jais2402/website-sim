'use client'

import { useEffect, useState } from 'react'
import { Container, SectionHeading } from '@/components/ui'
import s from './Buzz.module.css'

export type BuzzItem = {
  /** One of `BuzzData.categories`. */
  category: string
  kicker: string
  title: string
  /** Standfirst shown when the item is the lead story. */
  dek: string
  /** Source and time. */
  meta: string
  /** Lead photo path, or null for the sepia stand-in. */
  image: string | null
  href: string
}

export type BuzzData = {
  heading: string
  /** Red tag at the right of the masthead. */
  flag: string
  /** Filter chips, in order. "All" is added in front. */
  categories: string[]
  items: BuzzItem[]
  allNews: { label: string; href: string }
}

const ALL = 'All'
const DATE: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
const isExternal = (href: string) => /^https?:/.test(href)
const linkProps = (href: string) => (isExternal(href) ? { href, target: '_blank', rel: 'noopener noreferrer' } : { href })

/**
 * The Buzz. The masthead date is never stored: pass `now` (formatted in IST, so server
 * and client agree), or leave it out and the visitor's own date appears after mount.
 */
export function Buzz({ data, now }: { data: BuzzData; now?: Date | string | number }) {
  const [cat, setCat] = useState(ALL)
  const [active, setActive] = useState(0)
  const [clientNow, setClientNow] = useState<Date | null>(null)

  useEffect(() => {
    if (now === undefined) setClientNow(new Date())
  }, [now])

  const today = now !== undefined ? new Date(now) : clientNow
  const todayLabel = today
    ? today.toLocaleDateString('en-IN', now !== undefined ? { ...DATE, timeZone: 'Asia/Kolkata' } : DATE)
    : null

  const pool = cat === ALL ? data.items : data.items.filter((n) => n.category === cat)
  const index = Math.min(active, Math.max(pool.length - 1, 0))
  const lead = pool[index] ?? data.items[0]

  const pick = (c: string) => {
    setCat(c)
    setActive(0)
  }

  if (!lead) return null

  return (
    <section id="buzz" aria-labelledby="bz-h" className={s.section}>
      <Container>
        <div className={s.masthead}>
          <span className={s.today}>
            {todayLabel && today ? <time dateTime={today.toISOString().slice(0, 10)}>{todayLabel}</time> : ' '}
          </span>
          <SectionHeading id="bz-h" className={s.name}>
            {data.heading}
          </SectionHeading>
          <span className={s.flag}>
            <span className={s.flagDot} aria-hidden="true" />
            {data.flag}
          </span>
        </div>

        <div className={s.chips} role="group" aria-label="Filter news by category">
          {[ALL, ...data.categories].map((c) => (
            <button key={c} type="button" className={s.chip} aria-pressed={c === cat} onClick={() => pick(c)}>
              {c}
            </button>
          ))}
        </div>

        <div className={s.columns}>
          <article className={s.lead}>
            <a className={s.leadLink} {...linkProps(lead.href)}>
              <div className={s.photo}>
                {lead.image ? (
                  <img className={s.photoImg} src={lead.image} alt="" loading="lazy" />
                ) : (
                  <span className={s.photoNote} aria-hidden="true">
                    Photo placeholder
                  </span>
                )}
                <span className={s.kicker}>{lead.kicker}</span>
              </div>
              <h3 className={s.headline}>{lead.title}</h3>
              <p className={s.dek}>{lead.dek}</p>
              <span className={s.leadMeta}>
                {lead.meta} · Read the story <span aria-hidden="true">→</span>
              </span>
            </a>
          </article>

          <div className={s.side}>
            <h3 className={s.sideTitle}>Trending</h3>
            <ol className={s.list}>
              {pool.map((n, k) => (
                <li key={`${n.title}-${k}`} className={s.item}>
                  <button
                    type="button"
                    className={s.row}
                    aria-pressed={k === index}
                    onMouseEnter={() => setActive(k)}
                    onFocus={() => setActive(k)}
                    onClick={() => setActive(k)}
                  >
                    <span className={s.num} aria-hidden="true">
                      {k + 1}
                    </span>
                    <span className={s.rowText}>
                      <span className={s.rowKicker}>{n.kicker}</span>
                      <span className={s.rowTitle}>{n.title}</span>
                      <span className={s.rowMeta}>{n.meta}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ol>
            <a className={s.all} {...linkProps(data.allNews.href)}>
              {data.allNews.label} <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </Container>
    </section>
  )
}
