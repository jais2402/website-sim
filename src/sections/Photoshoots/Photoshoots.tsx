'use client'

import { useState, type CSSProperties, type FocusEvent } from 'react'
import Link from 'next/link'
import { Container, SectionHeading } from '@/components/ui'
import s from './Photoshoots.module.css'

export type PhotoshootItem = {
  /** CSS aspect-ratio: "2 / 3", "4 / 5", "1 / 1", "3 / 2", "4 / 3" or "16 / 9". */
  ratio: string
  /** Optional line shown over the photo. Empty string or null for none. */
  message?: string | null
  /** Path to the cleared file. null renders the gradient stand-in and disables Download. */
  image: string | null
  alt?: string
}

export type PhotoshootsData = {
  heading: string
  viewAll: { label: string; href: string }
  /** Small line under the grid. Optional. */
  note?: string | null
  photos: PhotoshootItem[]
}

type Props = {
  data: PhotoshootsData
  /** Show only the first n shoots. Omit to show them all. */
  limit?: number
  /** Hide the "View all" link, e.g. on the full gallery page. */
  showViewAll?: boolean
}

const TONES = ['#2f2823', '#2a2420', '#332a24', '#262019']

export function Photoshoots({ data, limit, showViewAll = true }: Props) {
  const [active, setActive] = useState(-1)
  const photos = typeof limit === 'number' ? data.photos.slice(0, Math.max(0, limit)) : data.photos

  const leave = (i: number) => setActive((cur) => (cur === i ? -1 : cur))
  const blur = (i: number) => (e: FocusEvent<HTMLElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) leave(i)
  }

  return (
    <section id="gallery" aria-labelledby="ps-h" className={s.section}>
      <Container>
        <div className={s.head}>
          <SectionHeading id="ps-h">{data.heading}</SectionHeading>
          {showViewAll && (
            <Link href={data.viewAll.href} className={s.viewAll}>
              {data.viewAll.label}
              <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          )}
        </div>

        <div className={s.grid}>
          {photos.map((p, i) => {
            const on = active === i
            const n = i + 1
            return (
              <figure
                key={i}
                className={s.tile}
                data-active={on || undefined}
                style={{ '--ratio': p.ratio, '--angle': `${150 + i * 12}deg`, '--tone': TONES[i % 4] } as CSSProperties}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => leave(i)}
                onFocus={() => setActive(i)}
                onBlur={blur(i)}
              >
                {p.image ? (
                  <img className={s.img} src={p.image} alt={p.alt ?? ''} loading="lazy" decoding="async" />
                ) : (
                  <div className={s.standIn} aria-hidden="true" />
                )}

                {/* Tap / keyboard target that reveals the overlay. */}
                <button type="button" className={s.reveal} aria-expanded={on} aria-label={`Show options for photo ${n}`} onClick={() => setActive(i)} />

                <div className={s.overlay}>
                  {p.message ? <p className={s.message}>{p.message}</p> : null}
                  {p.image ? (
                    <a className={s.download} href={p.image} download aria-label={`Download photo ${n}`}>
                      <DownloadIcon />
                      Download
                    </a>
                  ) : (
                    <a className={s.download} role="link" aria-disabled="true" aria-label={`Download photo ${n} (not available yet)`}>
                      <DownloadIcon />
                      Download
                    </a>
                  )}
                </div>
              </figure>
            )
          })}
        </div>

        {data.note ? <p className={s.note}>{data.note}</p> : null}
      </Container>
    </section>
  )
}

function DownloadIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 2v8M4.5 6.5 8 10l3.5-3.5M2.5 13.5h11" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
