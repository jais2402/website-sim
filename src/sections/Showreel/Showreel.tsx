'use client'

import { useState } from 'react'
import { ArrowButton, Container, SectionHeading } from '@/components/ui'
import { useReducedMotion } from '@/lib/motion'
import { useAutoAdvance } from '@/lib/useAutoAdvance'
import s from './Showreel.module.css'

export type Clip = {
  title: string
  film: string
  duration: string
  /** Reel, Scene, Song… */
  kind: string
  video: string | null
  poster: string | null
  /** Stand-in colour until the clip is supplied. */
  tint: string
}

export type ShowreelData = { secondsPerClip: number; clips: Clip[] }

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * Red-curtain coverflow of 16:9 screens. Advances every few seconds, pauses on
 * hover and focus, and only ever plays sound after the visitor presses play.
 */
export function Showreel({ data, id = 'reel', title = 'Showreel' }: { data: ShowreelData; id?: string; title?: string }) {
  const n = data.clips.length
  const reduced = useReducedMotion()
  const [playing, setPlaying] = useState<number | null>(null)
  const { index, progress, setPaused, go } = useAutoAdvance({
    count: n,
    interval: data.secondsPerClip * 1000,
    enabled: playing === null,
  })

  const pick = (i: number) => {
    setPlaying(null)
    go(i)
  }

  return (
    <section id={id} aria-labelledby={`${id}-h`} className={s.curtain}>
      <Container className={s.head}>
        <SectionHeading id={`${id}-h`}>{title}</SectionHeading>
        <div className={s.controls}>
          <span className={s.counter} aria-live="polite">
            <span className="sr-only">Clip </span>
            {pad(index + 1)} <span className={s.total}>/ {pad(n)}</span>
          </span>
          <ArrowButton direction="prev" label="Previous clip" onClick={() => pick(index - 1)} />
          <ArrowButton direction="next" tone="cream" label="Next clip" onClick={() => pick(index + 1)} />
        </div>
      </Container>

      <ul
        className={s.stage}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        {data.clips.map((c, i) => {
          // Signed distance from the active screen, wrapped around the ring.
          let d = i - index
          if (d > n / 2) d -= n
          if (d < -n / 2) d += n
          const active = d === 0
          const isPlaying = playing === i && c.video
          return (
            <li
              key={c.title}
              className={s.screen}
              data-active={active || undefined}
              data-far={Math.abs(d) > 2 || undefined}
              style={{ ['--d' as string]: d, ['--ad' as string]: Math.abs(d), background: `radial-gradient(ellipse 70% 60% at 60% 40%, ${c.tint} 0%, #141110 60%, var(--ground) 100%)` }}
            >
              {c.poster && !isPlaying && <img className={s.fill} src={c.poster} alt="" loading="lazy" />}
              {c.video && active && !isPlaying && !reduced && (
                <video className={s.fill} src={c.video} muted loop autoPlay playsInline preload="none" aria-hidden="true" />
              )}
              {isPlaying && <video className={s.fill} src={c.video!} controls autoPlay playsInline />}

              {!isPlaying && (
                <>
                  <span className={s.kind}>
                    {c.kind}
                    {c.video ? ' · muted preview' : ''}
                  </span>
                  {active ? (
                    <>
                      <button type="button" className={s.play} aria-label={`Play ${c.title} with sound`} disabled={!c.video} onClick={() => setPlaying(i)}>
                        <svg width="22" height="22" viewBox="0 0 12 12" aria-hidden="true">
                          <path d="M3 1.5v9l7.5-4.5z" fill="currentColor" />
                        </svg>
                      </button>
                      <div className={s.caption}>
                        <div>
                          <h3 className={s.clipTitle}>{c.title}</h3>
                          <p className={s.clipMeta}>
                            {c.film} · {c.duration}
                          </p>
                        </div>
                        <span className={s.sound}>Sound on ↗</span>
                      </div>
                      <span className={s.bar} style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
                    </>
                  ) : (
                    <button type="button" className={s.pick} aria-label={`Go to clip ${i + 1}: ${c.title}`} onClick={() => pick(i)}>
                      <span className={s.pickTitle}>{c.title}</span>
                    </button>
                  )}
                </>
              )}
            </li>
          )
        })}
      </ul>

      <Container>
        <div role="group" aria-label="Clips" className={s.segments}>
          {data.clips.map((c, i) => (
            <button key={c.title} type="button" className={s.segment} aria-label={`Go to clip ${i + 1}: ${c.title}`} aria-pressed={i === index} onClick={() => pick(i)}>
              <span className={s.segTrack}>
                <span className={s.segFill} style={{ transform: `scaleX(${i < index ? 1 : i === index ? progress : 0})` }} />
              </span>
            </button>
          ))}
        </div>
      </Container>
    </section>
  )
}
