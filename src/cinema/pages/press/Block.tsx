import type { ReactNode } from 'react'
import s from '../../cinema.module.css'
import c from './press.module.css'

type Props = {
  id: string
  /** Decorative slate, e.g. "The full list · Take 2". The page numbers it ("Scene 03 · …"). */
  slate: string
  kicker?: string
  heading: string
  /** id for the heading; defaults to `${id}-h`. */
  headingId?: string
  children: ReactNode
}

/** A plain scene on the black ground: slate, timecode, a Cinzel heading and its content. */
export function Block({ id, slate, kicker, heading, headingId = `${id}-h`, children }: Props) {
  return (
    <section id={id} aria-labelledby={headingId} className={c.block}>
      <div className={c.inner}>
        <header className={`${c.head} ${s.reveal}`}>
          {kicker && <p className={`${s.mono} ${s.gold}`}>{kicker}</p>}
          <h2 id={headingId} className={s.h2}>
            {heading}
          </h2>
        </header>
        {children}
      </div>
    </section>
  )
}
