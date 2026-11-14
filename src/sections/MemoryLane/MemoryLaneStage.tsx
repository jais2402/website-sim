'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent, PointerEvent, ReactNode } from 'react'
import { useReducedMotion } from '@/lib/motion'
import { useAutoAdvance } from '@/lib/useAutoAdvance'
import type { MemoryLaneData } from './types'
import s from './MemoryLane.module.css'

/** Milliseconds each film stays on screen while Auto is on. */
const AUTO_INTERVAL = 3500
/** Length of the static burst on a channel change. */
const STATIC_MS = 260
/** Degrees the channel knob turns per film. */
const KNOB_STEP = 21

/** Sepia stand-in tints per era: [highlight, mid]. Scenery, copied from the design source. */
const ERA_TINTS: [string, string][] = [
  ['#8a6a45', '#3b2a1b'],
  ['#9a7a4c', '#40301e'],
  ['#8a7658', '#2e241b'],
]
/** Stand-in tones for polaroids 2–7. The first one follows the film on screen. */
const POLAROID_TONES = ['#a3835a', '#7a5d3e', '#8f6f4a', '#6e5338', '#9a7a4c', '#5c4630']

const PLAY_ICON = 'M3 1.5v9l7.5-4.5z'
const PAUSE_ICON = 'M2.5 1.5h2.5v9H2.5zM7 1.5h2.5v9H7z'

const round = (n: number) => Math.round(n * 100) / 100
const pct = (n: number) => `${round(n)}%`

/** Height (px) of the fairy-light wire at x (0–100), matching the SVG path. */
function wireY(x: number) {
  const [a, b, c, u] = x <= 50 ? [10, 90, 30, x / 50] : [30, 90, 10, (x - 50) / 50]
  return (1 - u) * (1 - u) * a + 2 * u * (1 - u) * b + u * u * c
}

const BULBS = Array.from({ length: 22 }, (_, k) => {
  const x = 2 + k * (96 / 21)
  return { left: pct(x), top: `${round(wireY(x))}px`, bright: k % 3 === 0 }
})

export function MemoryLaneStage({ data, heading }: { data: MemoryLaneData; heading: ReactNode }) {
  const { films, eras, polaroids } = data
  const n = films.length
  const reduced = useReducedMotion()

  const start = Math.max(
    0,
    films.findIndex((f) => f.title === data.startFilm),
  )

  const [playing, setPlaying] = useState(false)
  const [videoOn, setVideoOn] = useState(false)
  const [flash, setFlash] = useState(false)
  const [dragging, setDragging] = useState(false)

  const auto = useAutoAdvance({ count: n, interval: AUTO_INTERVAL, enabled: playing && !videoOn })
  // The timer counts from 0, so shift it to open on the start film without a flash of film 1.
  const index = n ? (auto.index + start) % n : 0
  const autoOn = playing && !reduced

  const years = useMemo(() => [...new Set(films.map((f) => f.year))].sort((a, b) => a - b), [films])
  const U = years.length
  const yearPos = (y: number) => (U > 1 ? (years.indexOf(y) / (U - 1)) * 100 : 50)

  const eraIndex = (y: number) => {
    const k = eras.findIndex((e) => e.beforeYear === undefined || y < e.beforeYear)
    return k < 0 ? Math.max(eras.length - 1, 0) : k
  }

  /** A choice made by hand stops Auto, as in the design. */
  const select = (k: number) => {
    setPlaying(false)
    auto.go(k - start)
  }

  // Static burst on every channel change (also the automatic ones).
  const shown = useRef(index)
  useEffect(() => {
    if (shown.current === index) return
    shown.current = index
    setVideoOn(false)
    setFlash(true)
    const id = setTimeout(() => setFlash(false), STATIC_MS)
    return () => clearTimeout(id)
  }, [index])

  // Tuner: drag on wide screens, tap + native horizontal scroll when it overflows (mobile).
  const scrollRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const pointer = useRef<{ mode: 'drag' | 'tap'; x: number } | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const scroller = scrollRef.current
    const track = trackRef.current
    const film = films[index]
    if (!scroller || !track || !film) return
    if (scroller.scrollWidth <= scroller.clientWidth + 1) return
    const x = track.offsetLeft + (yearPos(film.year) / 100) * track.offsetWidth
    scroller.scrollTo({ left: x - scroller.clientWidth / 2, behavior: reduced ? 'auto' : 'smooth' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, reduced])

  if (!n) return null

  const film = films[index]
  const era = eras[eraIndex(film.year)]
  const tint = ERA_TINTS[eraIndex(film.year) % ERA_TINTS.length]
  const channel = String(index + 1).padStart(2, '0')
  const autoLabel = autoOn ? 'Pause the decades' : 'Play the decades'
  const autoIcon = autoOn ? PAUSE_ICON : PLAY_ICON

  const pickAt = (clientX: number) => {
    const track = trackRef.current
    if (!track) return
    const r = track.getBoundingClientRect()
    const t = Math.min(Math.max((clientX - r.left) / r.width, 0), 1)
    const year = years[Math.round(t * (U - 1))]
    if (year === film.year) return
    const k = films.findIndex((f) => f.year === year)
    if (k >= 0) select(k)
  }

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if ((e.target as Element).closest('button')) return
    if (e.pointerType === 'mouse' && e.button !== 0) return
    const scroller = scrollRef.current
    const scrollable = !!scroller && scroller.scrollWidth > scroller.clientWidth + 1
    if (scrollable && e.pointerType === 'touch') {
      pointer.current = { mode: 'tap', x: e.clientX }
      return
    }
    pointer.current = { mode: 'drag', x: e.clientX }
    e.currentTarget.setPointerCapture?.(e.pointerId)
    setDragging(true)
    pickAt(e.clientX)
  }
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (pointer.current?.mode === 'drag') pickAt(e.clientX)
  }
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const p = pointer.current
    if (p?.mode === 'tap' && Math.abs(e.clientX - p.x) < 10) pickAt(e.clientX)
    pointer.current = null
    setDragging(false)
  }
  const onPointerCancel = () => {
    pointer.current = null
    setDragging(false)
  }

  const onSliderKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const yi = years.indexOf(film.year)
    const firstOfYear = (i: number) => films.findIndex((f) => f.year === years[Math.min(Math.max(i, 0), U - 1)])
    let next = index
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        next = Math.min(index + 1, n - 1)
        break
      case 'ArrowLeft':
      case 'ArrowDown':
        next = Math.max(index - 1, 0)
        break
      case 'PageUp':
        next = firstOfYear(yi + 1)
        break
      case 'PageDown':
        next = firstOfYear(yi - 1)
        break
      case 'Home':
        next = 0
        break
      case 'End':
        next = n - 1
        break
      default:
        return
    }
    e.preventDefault()
    if (next !== index && next >= 0) select(next)
  }

  const toggleVideo = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      v.muted = false
      void v.play().catch(() => setVideoOn(false))
    } else {
      v.pause()
    }
  }

  const stack: Record<number, number> = {}
  const marks = films.map((f, k) => {
    const level = stack[f.year] ?? 0
    stack[f.year] = level + 1
    return { film: f, k, left: pct(yearPos(f.year)), top: `${30 - level * 12}px` }
  })

  const gaps: string[] = []
  for (let u = 1; u < U; u++) {
    if (years[u] - years[u - 1] > 1) gaps.push(pct(((u - 0.5) / (U - 1)) * 100))
  }

  const standIn = (a: string) => `radial-gradient(ellipse 80% 70% at 50% 40%, ${a} 0%, #2a1f16 70%, #1a130d 100%)`
  const screenBg = `radial-gradient(ellipse 70% 60% at 55% 40%, ${tint[0]} 0%, ${tint[1]} 55%, #120d09 100%)`

  return (
    <>
      <div className={s.head}>
        {heading}
        <button
          type="button"
          className={`${s.playAll} ${autoOn ? s.playAllOn : ''}`}
          onClick={() => setPlaying(!autoOn)}
          aria-pressed={autoOn}
          disabled={reduced}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <path d={autoIcon} fill="currentColor" />
          </svg>
          {autoLabel}
        </button>
      </div>

      <div className={s.wall}>
        {/* Fairy lights and polaroids */}
        <div className={s.lights}>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" className={s.wire}>
            <path d="M0,10 Q25,90 50,30 Q75,90 100,10" fill="none" stroke="#4a3826" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          </svg>
          {BULBS.map((b) => (
            <span key={b.left} aria-hidden="true" className={`${s.bulb} ${b.bright ? s.bulbBright : ''}`} style={{ left: b.left, top: b.top }} />
          ))}
          {polaroids.map((p, k) => {
            const x = polaroids.length > 1 ? 9 + k * (82 / (polaroids.length - 1)) : 50
            const style = {
              left: pct(x),
              top: `${round(wireY(x) + 2)}px`,
              '--tilt': `${k % 2 ? 4 : -4}deg`,
            } as CSSProperties
            return (
              <figure key={k} className={s.polaroid} style={style}>
                <span aria-hidden="true" className={s.peg} />
                <div className={s.polaroidCard}>
                  {p.image ? (
                    <img className={s.polaroidPhoto} src={p.image} alt="" loading="lazy" />
                  ) : (
                    <div className={s.polaroidPhoto} style={{ background: standIn(k === 0 ? tint[0] : POLAROID_TONES[(k - 1) % POLAROID_TONES.length]) }} />
                  )}
                </div>
                <figcaption className={s.polaroidCap}>{p.caption}</figcaption>
              </figure>
            )
          })}
        </div>

        <div className={s.tvRow}>
          <div className={s.tv}>
            <div aria-hidden="true" className={`${s.antenna} ${s.antennaL}`} />
            <div aria-hidden="true" className={`${s.antenna} ${s.antennaR}`} />
            <div aria-hidden="true" className={s.antennaBase} />

            <div className={s.cabinet}>
              <div className={s.top}>
                <div className={s.bezel}>
                  <div className={s.screen} style={{ background: screenBg }}>
                    {film.video ? (
                      <video
                        key={film.video}
                        ref={videoRef}
                        className={s.media}
                        src={film.video}
                        poster={film.image ?? undefined}
                        playsInline
                        preload="none"
                        onPlay={() => setVideoOn(true)}
                        onPause={() => setVideoOn(false)}
                        onEnded={() => setVideoOn(false)}
                      />
                    ) : film.image ? (
                      <img className={s.media} src={film.image} alt={`${film.title} (${film.year})`} loading="lazy" />
                    ) : null}
                    <div aria-hidden="true" className={s.scanlines} />
                    <div aria-hidden="true" className={`${s.static} ${flash && !reduced ? s.staticOn : ''}`} />
                    <div className={s.channel}>CH {channel}</div>
                    <div className={s.era}>
                      <span aria-hidden="true" className={`${s.rec} ${autoOn ? s.recOn : ''}`} />
                      {era?.label}
                    </div>
                    <div className={s.screenCentre}>
                      <button
                        type="button"
                        className={`${s.screenPlay} ${videoOn ? s.screenPlayOn : ''}`}
                        aria-label={videoOn ? `Pause ${film.title} montage` : `Play ${film.title} montage with sound`}
                        onClick={toggleVideo}
                        disabled={!film.video}
                      >
                        <svg width="20" height="20" viewBox="0 0 12 12" aria-hidden="true">
                          <path d={videoOn ? PAUSE_ICON : PLAY_ICON} fill="currentColor" />
                        </svg>
                      </button>
                    </div>
                    <div className={s.caption}>
                      <div className={s.filmTitle}>{film.title}</div>
                      <div className={s.filmMeta}>
                        {film.year} · {film.language} · montage
                      </div>
                    </div>
                    <div aria-hidden="true" className={s.glare} />
                  </div>
                </div>

                <div className={s.side}>
                  <div className={s.badge}>{data.badge}</div>
                  <div className={s.knobGroup}>
                    <button type="button" className={`${s.brass} ${s.channelKnob}`} aria-label="Change channel" onClick={() => select((index + 1) % n)}>
                      <span aria-hidden="true" className={s.knobDial} style={{ transform: `rotate(${index * KNOB_STEP}deg)` }}>
                        <span className={s.knobTick} />
                      </span>
                    </button>
                    <span className={s.knobLabel}>Channel</span>
                  </div>
                  <div className={s.knobGroup}>
                    <button
                      type="button"
                      className={`${s.brass} ${s.autoKnob}`}
                      aria-label={autoLabel}
                      aria-pressed={autoOn}
                      onClick={() => setPlaying(!autoOn)}
                      disabled={reduced}
                    >
                      <svg width="14" height="14" viewBox="0 0 12 12" aria-hidden="true">
                        <path d={autoIcon} fill="#2a2018" />
                      </svg>
                    </button>
                    <span className={s.knobLabel}>Auto</span>
                  </div>
                  <div aria-hidden="true" className={s.grille} />
                </div>
              </div>

              <div role="group" aria-label="Tuner — choose a film by year" className={s.tuner}>
                <button type="button" className={`${s.brass} ${s.tunerBtn}`} aria-label="Previous film" onClick={() => select((index - 1 + n) % n)}>
                  <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M10 3 5 8l5 5" fill="none" stroke="#2a2018" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                <div className={s.dial}>
                  <div ref={scrollRef} className={s.dialScroll}>
                    <div className={s.dialInner}>
                      <div
                        ref={trackRef}
                        className={s.track}
                        onPointerDown={onPointerDown}
                        onPointerMove={onPointerMove}
                        onPointerUp={onPointerUp}
                        onPointerCancel={onPointerCancel}
                      >
                        <div aria-hidden="true" className={s.scale} />
                        {years.map((y) => (
                          <span key={y}>
                            <span aria-hidden="true" className={s.tick} style={{ left: pct(yearPos(y)) }} />
                            <span aria-hidden="true" className={`${s.year} ${y === film.year ? s.yearOn : ''}`} style={{ left: pct(yearPos(y)) }}>
                              {y}
                            </span>
                          </span>
                        ))}
                        {gaps.map((left) => (
                          <span key={left} aria-hidden="true" className={s.gap} style={{ left }}>
                            ≈
                          </span>
                        ))}
                        {marks.map((m) => (
                          <button
                            key={m.k}
                            type="button"
                            tabIndex={-1}
                            className={`${s.mark} ${m.k === index ? s.markOn : ''}`}
                            style={{ left: m.left, top: m.top }}
                            aria-label={`${m.film.title}, ${m.film.year}`}
                            aria-pressed={m.k === index}
                            onClick={() => select(m.k)}
                          >
                            <span className={s.markDot} />
                          </button>
                        ))}
                        <div
                          className={`${s.needleRail} ${dragging ? s.needleDrag : ''}`}
                          style={{ transform: `translateX(${pct(yearPos(film.year))})` }}
                        >
                          <div
                            role="slider"
                            tabIndex={0}
                            className={s.needle}
                            aria-label="Tuner dial"
                            aria-orientation="horizontal"
                            aria-valuemin={1}
                            aria-valuemax={n}
                            aria-valuenow={index + 1}
                            aria-valuetext={`${film.title}, ${film.year}`}
                            onKeyDown={onSliderKey}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <button type="button" className={`${s.brass} ${s.tunerBtn}`} aria-label="Next film" onClick={() => select((index + 1) % n)}>
                  <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M6 3l5 5-5 5" fill="none" stroke="#2a2018" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>

            <div aria-hidden="true" className={s.feet}>
              <span className={s.foot} />
              <span className={s.foot} />
            </div>
          </div>
        </div>

        <div className={s.quote}>
          <div className={s.quoteEra}>{era?.label}</div>
          <blockquote className={s.quoteText}>“{film.quote}”</blockquote>
        </div>

        <p className="sr-only" aria-live={autoOn ? 'off' : 'polite'} aria-atomic="true">
          Channel {index + 1} of {n}: {film.title}, {film.year}, {film.language}.
        </p>
      </div>
    </>
  )
}
