'use client'

import Link from 'next/link'
import { useRef, useState, type UIEvent } from 'react'
import { ShaderCanvas } from '../ShaderCanvas'
import { Scene, Sub, art, tilt, trackPointer } from '../ui'
import s from '../cinema.module.css'

export type CinemaFilm = {
  slug: string
  title: string
  year: string
  language: string
  /** Billing line, e.g. "Lead". */
  meta: string
  poster: string | null
  /** [inner, outer] colours for the stand-in art and the background wash. */
  cinema: string[]
}

/** Scene 03: scroll the posters sideways; the year, title and background follow the frame. */
export function Films({ films, allHref }: { films: CinemaFilm[]; allHref: string }) {
  const pointer = useRef<[number, number]>([0.6, 0.5])
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const [index, setIndex] = useState(0)
  const [swapping, setSwapping] = useState(false)
  const film = films[index]

  const onScroll = (e: UIEvent<HTMLUListElement>) => {
    const el = e.currentTarget
    const step = (el.firstElementChild as HTMLElement | null)?.offsetWidth ?? 260
    const k = Math.min(films.length - 1, Math.max(0, Math.round(el.scrollLeft / (step + 28))))
    if (k === index || swapping) return
    setSwapping(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setIndex(k)
      setSwapping(false)
    }, 220)
  }

  return (
    <Scene n={3} name="The films">
      <div className={s.stage} onPointerMove={trackPointer(pointer)}>
        <div className={s.fill} style={{ background: art(film.cinema[0], film.cinema[1]) }}>
          <ShaderCanvas shader="film" pointer={pointer} colors={[film.cinema[0], film.cinema[1]]} />
        </div>
        <div className={`${s.fill} ${s.filmShade}`} aria-hidden="true" />
        <div className={s.grain} />

        <div className={s.filmInfo}>
          <h2 id="s03-h" className={`${s.h2} ${s.reveal}`}>
            The films
          </h2>
          <div aria-live="polite" className={`${s.swap} ${swapping ? s.swapOut : ''}`}>
            <p className={s.filmYear}>{film.year}</p>
            <p className={s.filmTitle}>{film.title}</p>
            <p className={`${s.mono} ${s.dim}`}>
              {film.language} · {film.meta}
            </p>
          </div>
          <Link href={allHref} className={`${s.uline} ${s.mono}`}>
            Full filmography →
          </Link>
        </div>

        <ul className={s.filmStrip} onScroll={onScroll}>
          {films.map((f, k) => (
            <li key={f.slug} className={s.filmCell}>
              <Link href={`${allHref}#${f.slug}`} className={`${s.poster} ${s.tilt}`} data-current={k === index || undefined} {...tilt}>
                {f.poster ? (
                  <img src={f.poster} alt="" loading="lazy" className={s.cover} />
                ) : (
                  <>
                    <span className={s.fill} style={{ background: art(f.cinema[0], f.cinema[1]) }} />
                    <span className={`${s.mono} ${s.posterNote}`}>Key art</span>
                  </>
                )}
                <span className={`${s.fill} ${s.posterShade}`} />
                <span className={`${s.fill} ${s.sheen}`} aria-hidden="true" />
                <span className={s.posterText}>
                  <span className={s.posterTitle}>{f.title}</span>
                  <span className={`${s.mono} ${s.posterMeta}`}>
                    {f.year} · {f.language}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Sub className={`${s.caption} ${s.filmCaption}`}>Scroll the reel sideways — the year follows the frame.</Sub>
      </div>
    </Scene>
  )
}
