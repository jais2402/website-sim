'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ArrowButton, Container, SectionHeading, TextLink } from '@/components/ui'
import s from './ReelWall.module.css'

export type ReelFilm = {
  slug: string
  title: string
  language: string
  year: string
  /** Text on the brass plate, after the year. */
  plate: string
  /** Licensed 27:40 key art. */
  poster: string | null
  /** Top and middle colours of the stand-in art. */
  tint: [string, string] | string[]
  /** Lightbox glow as "r g b". */
  glow: string
}

export type ReelWallData = { films: ReelFilm[] }

const STEP = 296 // poster 240 + gap 56

/** Cinema corridor: backlit lightbox posters with brass plates, sliding one at a time. */
export function ReelWall({ data, id = 'work', title = 'The Reel Wall', allHref = '/work' }: { data: ReelWallData; id?: string; title?: string; allHref?: string | null }) {
  const viewport = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const [max, setMax] = useState(Math.max(data.films.length - 4, 0))

  useEffect(() => {
    const el = viewport.current
    if (!el) return
    const measure = () => {
      const visible = Math.max(1, Math.floor((el.clientWidth + 56) / STEP))
      setMax(Math.max(data.films.length - visible, 0))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [data.films.length])

  const at = Math.min(index, max)

  return (
    <section id={id} aria-labelledby={`${id}-h`} className={s.lobby}>
      <div aria-hidden="true" className={s.ceiling} />
      <Container className={s.head}>
        <SectionHeading id={`${id}-h`} className={s.title}>
          {title}
        </SectionHeading>
        <div className={s.controls}>
          {allHref && <TextLink href={allHref}>Full filmography</TextLink>}
          <div className={s.arrows}>
            <ArrowButton direction="prev" label="Previous film" disabled={at === 0} onClick={() => setIndex(Math.max(at - 1, 0))} />
            <ArrowButton direction="next" tone="red" label="Next film" disabled={at === max} onClick={() => setIndex(Math.min(at + 1, max))} />
          </div>
        </div>
      </Container>

      <Container className={s.viewport}>
        <div className={s.angle} ref={viewport}>
          <ul className={s.track} style={{ ['--shift' as string]: `${-at * STEP}px` }}>
            {data.films.map((f) => (
              <li key={f.slug} className={s.film}>
                <Link href={`/work#${f.slug}`} className={s.link}>
                  <div className={s.frame} style={{ ['--glow' as string]: f.glow }}>
                    <div className={s.art} style={f.poster ? undefined : { background: `linear-gradient(180deg, ${f.tint[0]} 0%, ${f.tint[1]} 55%, #0d0a09 100%)` }}>
                      {f.poster ? (
                        <img src={f.poster} alt={`${f.title} poster`} loading="lazy" />
                      ) : (
                        <>
                          <span className={s.artTop}>Simran</span>
                          <span className={s.artBody}>
                            <span className={s.artTitle} data-long={f.title.length > 16 || undefined}>
                              {f.title}
                            </span>
                            <span className={s.artMeta}>{f.language}</span>
                            <span className={s.artNote}>Key art placeholder</span>
                          </span>
                        </>
                      )}
                      <span aria-hidden="true" className={s.glare} />
                    </div>
                  </div>
                  <div className={s.plate}>
                    <span className={s.year}>{f.year}</span>
                    <span className={s.rule} />
                    <span className={s.plateLabel}>{f.plate}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
      <div aria-hidden="true" className={s.floor} />
    </section>
  )
}
