'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ShaderCanvas } from '../ShaderCanvas'
import { Scene, art } from '../ui'
import s from '../cinema.module.css'

export type MemoryFilm = { title: string; year: number; language: string; image?: string | null }

// One sepia tone per year on the dial, repeating if there are more years.
const TINTS = ['#8a6a45', '#8f6f4a', '#9a7a4c', '#a3835a', '#94704a', '#8a6a45', '#7d6a52', '#6e5a48', '#7a6650', '#5f5446', '#8a7658']
const DARK = '#1a130d'

/** Scene 07: a wall of years. Pick one and the frame burns through to that film. */
export function Memory({ films, startFilm }: { films: MemoryFilm[]; startFilm?: string }) {
  const start = Math.max(0, films.findIndex((f) => f.title === startFilm))
  const [index, setIndex] = useState(start)
  const years = useMemo(() => [...new Set(films.map((f) => f.year))], [films])
  const film = films[index]
  const yi = years.indexOf(film.year)
  const tint = TINTS[yi % TINTS.length]
  const n = films.length

  // On narrow screens the dial scrolls; keep the chosen year in view without moving the page.
  const dial = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = dial.current
    const btn = el?.querySelector<HTMLElement>('[aria-pressed="true"]')
    if (el && btn) el.scrollLeft = btn.offsetLeft - el.offsetLeft - (el.clientWidth - btn.offsetWidth) / 2
  }, [yi])

  return (
    <Scene n={7} name="Memory lane">
      <div className={s.stage}>
        <div className={s.fill} style={{ background: art(tint, DARK) }}>
          <ShaderCanvas shader="mem" colors={[tint, DARK]} />
        </div>
        {film.image && <img key={film.image} className={s.memPhoto} src={film.image} alt="" loading="lazy" />}
        <div className={`${s.fill} ${s.memShade}`} aria-hidden="true" />
        <div className={`${s.grain} ${s.grainHeavy}`} />
        <h2 id="s07-h" className={`${s.h2} ${s.memHeading} ${s.reveal}`}>
          Memory lane
        </h2>

        <div className={s.yearWindow} aria-hidden="true">
          <div className={s.yearStack} style={{ ['--i' as string]: yi }}>
            {years.map((y) => (
              <div key={y}>{y}</div>
            ))}
          </div>
        </div>

        <div aria-live="polite" className={s.memFilm} key={film.title}>
          <p className={s.sub}>{film.title}</p>
          <p className={`${s.mono} ${s.gold}`}>
            {film.year} · {film.language} · montage
          </p>
        </div>

        <div className={s.dial}>
          <button type="button" className={s.round} aria-label="Previous film" onClick={() => setIndex((index - 1 + n) % n)}>
            <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div ref={dial} role="group" aria-label="Years" className={s.years}>
            {years.map((y) => (
              <button key={y} type="button" aria-pressed={y === film.year} onClick={() => setIndex(films.findIndex((f) => f.year === y))}>
                <i aria-hidden="true" />
                {y}
              </button>
            ))}
          </div>
          <button type="button" className={`${s.round} ${s.roundSolid}`} aria-label="Next film" onClick={() => setIndex((index + 1) % n)}>
            <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </Scene>
  )
}
