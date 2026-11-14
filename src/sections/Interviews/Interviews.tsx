'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Container, SectionHeading } from '@/components/ui'
import { useReducedMotion } from '@/lib/motion'
import { isPlaceholder } from '@/lib/placeholder'
import s from './Interviews.module.css'

export type InterviewItem = {
  /** 'Interview' | 'Article' | 'Video'. Video rows get the play frame; the rest get the masthead panel. */
  type: string
  title: string
  /** Publication or channel, and when. */
  source: string
  /** Link verb: "Read" or "Watch". */
  action: string
  /** Where the piece lives. While it is still a "[ … ]" placeholder the row links back to the section. */
  url: string
  /** Glow colour of the featured panel for this row. */
  tint?: string
  /** Article / interview rows: opening line or pull quote. */
  quote?: string | null
  /** Video rows: short muted preview clip. `null` renders the play-frame stand-in. */
  video?: string | null
  poster?: string | null
}

export type InterviewsData = {
  heading: string
  items: InterviewItem[]
}

const FILTERS = [
  { id: 'All', label: 'All' },
  { id: 'Interview', label: 'Interviews' },
  { id: 'Article', label: 'Articles' },
  { id: 'Video', label: 'Video' },
] as const

type FilterId = (typeof FILTERS)[number]['id']

function linkProps(url: string) {
  if (!url || isPlaceholder(url)) return { href: '#interviews' }
  return /^https?:/.test(url) ? { href: url, target: '_blank', rel: 'noopener noreferrer' } : { href: url }
}

export function Interviews({ data }: { data: InterviewsData }) {
  const reduced = useReducedMotion()
  const [filter, setFilter] = useState<FilterId>('All')
  const [active, setActive] = useState(0)
  /** True while the visitor is pointing at / focused inside the panel or list: the preview only plays then. */
  const [engaged, setEngaged] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const tabs = FILTERS.filter((f) => f.id === 'All' || data.items.some((x) => x.type === f.id))
  const list = filter === 'All' ? data.items : data.items.filter((x) => x.type === filter)
  const index = Math.min(active, Math.max(list.length - 1, 0))
  const cur: InterviewItem | undefined = list[index] ?? data.items[0]
  const isVideo = cur?.type === 'Video'
  const play = isVideo && engaged && !reduced

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (play) {
      v.muted = true
      v.play().catch(() => {})
    } else {
      v.pause()
    }
  }, [play, cur?.video])

  if (!cur) return null

  const show = (i: number) => {
    setActive(i)
    setEngaged(true)
  }

  return (
    <section id="interviews" aria-labelledby="iv-h" className={s.section}>
      <Container>
        <div className={s.head}>
          <SectionHeading id="iv-h">{data.heading}</SectionHeading>
          <div role="group" aria-label="Filter" className={s.filters}>
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                className={s.filter}
                aria-pressed={t.id === filter}
                onClick={() => {
                  setFilter(t.id)
                  setActive(0)
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div
          className={s.body}
          onMouseLeave={() => setEngaged(false)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setEngaged(false)
          }}
        >
          <a
            {...linkProps(cur.url)}
            className={s.feature}
            onMouseEnter={() => setEngaged(true)}
            onFocus={() => setEngaged(true)}
          >
            <span
              className={s.frame}
              style={cur.tint ? ({ '--tint': cur.tint } as CSSProperties) : undefined}
            >
              {isVideo ? (
                <>
                  {cur.video ? (
                    <video
                      ref={videoRef}
                      className={s.media}
                      src={cur.video}
                      poster={cur.poster ?? undefined}
                      muted
                      loop
                      playsInline
                      preload="none"
                      aria-hidden="true"
                      tabIndex={-1}
                    />
                  ) : cur.poster ? (
                    <img className={s.media} src={cur.poster} alt="" loading="lazy" />
                  ) : null}
                  <span className={[s.play, play && cur.video ? s.playHidden : ''].join(' ')} aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 12 12">
                      <path d="M3 1.5v9l7.5-4.5z" fill="none" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
                    </svg>
                  </span>
                </>
              ) : (
                <span className={s.article}>
                  <span className={s.masthead}>{cur.source}</span>
                  {cur.quote ? <span className={s.quote}>“{cur.quote}”</span> : null}
                  <span className={s.lines} aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </span>
                </span>
              )}
              <span className={s.badge}>{isVideo ? 'Video · muted preview' : `${cur.type} · preview`}</span>
            </span>
            <span className={s.featSource}>{cur.source}</span>
            <span className={s.featTitle}>{cur.title}</span>
            <span className={s.featAction}>{cur.action} →</span>
          </a>

          <ul className={s.list}>
            {list.map((it, i) => (
              <li key={`${filter}-${i}`} className={[s.item, i === index ? s.itemActive : ''].join(' ')}>
                <a
                  {...linkProps(it.url)}
                  className={s.row}
                  onMouseEnter={() => show(i)}
                  onFocus={() => show(i)}
                  onClick={() => show(i)}
                >
                  <span className={s.type}>{it.type}</span>
                  <span className={s.text}>
                    <span className={s.title}>{it.title}</span>
                    <span className={s.source}>{it.source}</span>
                  </span>
                  <span className={s.action}>{it.action} →</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  )
}
