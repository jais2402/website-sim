'use client'

import { useState } from 'react'
import { Scene, Sub, art, magnetic } from '../ui'
import s from '../cinema.module.css'

export type ReelClip = { title: string; film: string; duration: string | null; video: string | null; url?: string | null; poster: string | null; cinema: string[] }

const pad = (n: number) => String(n).padStart(2, '0')

/** Scene 05: five frames side by side. Hover, focus or tap one to open it; sound only on play. */
export function Reel({ clips }: { clips: ReelClip[] }) {
  const [open, setOpen] = useState(0)
  const [playing, setPlaying] = useState<number | null>(null)
  const pick = (k: number) => {
    if (k === open) return
    setOpen(k)
    setPlaying(null)
  }

  return (
    <Scene n={5} name="The reel" take={clips.length === 5 ? 'Five frames' : `${clips.length} frames`} className={s.reelScene}>
      <h2 id="s05-h" className={`${s.h2} ${s.reelHeading}`}>
        The reel
      </h2>
      <div role="group" aria-label="Choose a clip" className={s.frames}>
        {clips.map((c, k) => {
          const on = k === open
          const live = on && playing === k && c.video
          return (
            <div key={`${c.film} · ${c.title}`} className={s.frameCell} data-open={on || undefined} onMouseEnter={() => pick(k)} onClick={() => pick(k)}>
              {live ? (
                <video className={s.cover} src={c.video!} controls autoPlay playsInline />
              ) : (
                <>
                  {c.poster ? <img className={s.cover} src={c.poster} alt="" loading="lazy" /> : <div className={`${s.plateWide} ${s.kb}`} style={{ background: art(c.cinema[0], c.cinema[1]) }} />}
                  <div className={`${s.fill} ${s.frameShade}`} aria-hidden="true" />
                  <div className={s.grain} />
                  <button type="button" className={s.spine} aria-pressed={on} onFocus={() => pick(k)} tabIndex={on ? -1 : 0}>
                    <span className={s.mono}>
                      {pad(k + 1)} · {c.film} · {c.title}
                    </span>
                  </button>
                  <div className={s.frameCard}>
                    <p className={`${s.mono} ${s.gold}`}>
                      {c.film}
                      {c.duration ? ` · ${c.duration}` : ''}
                    </p>
                    <p className={s.frameTitle}>{c.title}</p>
                  </div>
                  {on && (c.video || !c.url) && (
                    <button type="button" className={`${s.playBig} ${s.mag}`} aria-label={`Play ${c.title} with sound`} disabled={!c.video} onClick={() => setPlaying(k)} {...magnetic}>
                      <svg width="22" height="22" viewBox="0 0 12 12" aria-hidden="true">
                        <path d="M3 1.5v9l7.5-4.5z" fill="currentColor" />
                      </svg>
                    </button>
                  )}
                  {on && !c.video && c.url && (
                    <a className={`${s.playBig} ${s.mag}`} href={c.url} target="_blank" rel="noopener" aria-label={`Watch ${c.film}: ${c.title} on YouTube (opens in a new tab)`} {...magnetic}>
                      <svg width="22" height="22" viewBox="0 0 12 12" aria-hidden="true">
                        <path d="M3 1.5v9l7.5-4.5z" fill="currentColor" />
                      </svg>
                    </a>
                  )}
                </>
              )}
            </div>
          )
        })}
      </div>
      <Sub className={s.reelCaption}>Hover or tap a frame to open it. Press play to watch with sound.</Sub>
    </Scene>
  )
}
