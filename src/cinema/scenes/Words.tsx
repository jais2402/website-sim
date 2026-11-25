'use client'

import { useEffect, useState } from 'react'
import { Scene, Sub } from '../ui'
import s from '../cinema.module.css'

export type Read = {
  /** "Note to fans", "Video interview", "Interview", "Article". */
  type: string
  /** Short label in the list. */
  short: string
  title: string
  body: string
  source: string
  url?: string | null
  /** Picture shown beside the text: poster, still or video thumbnail. */
  image?: string | null
}

const ICON: Record<string, string> = {
  'Note to fans': 'M1.5 2.5h9v7h-9zM1.5 2.5l4.5 4 4.5-4',
  'Video interview': 'M3 1.5v9l7.5-4.5z',
}

/** Scene 10: notes, interviews and articles. Hover, focus or tap a row to read it on the left, with its picture beside it. */
export function Words({ reads }: { reads: Read[] }) {
  const [index, setIndex] = useState(0)
  const [shown, setShown] = useState(0)
  useEffect(() => {
    if (shown === index) return
    const id = setTimeout(() => setShown(index), 220)
    return () => clearTimeout(id)
  }, [index, shown])
  const read = reads[shown]
  const link = read.url && /^https?:/.test(read.url) ? read.url : null

  return (
    <Scene n={10} name="In her words">
      <div className={s.stage}>
        <div className={`${s.plate} ${s.m2} ${s.kb}`} />
        <div className={`${s.fill} ${s.wordsShade}`} aria-hidden="true" />
        <div className={s.grain} />
        <h2 id="s10-h" className={`${s.h2} ${s.wordsHeading} ${s.reveal}`}>
          In her words
        </h2>

        <div aria-live="polite" className={`${s.swap} ${s.readPane} ${shown !== index ? s.swapOut : ''}`}>
          <span className={`${s.mono} ${s.gold}`}>{read.type}</span>
          <p className={s.readTitle}>{read.title}</p>
          <p className={s.readBody}>{read.body}</p>
          <p className={`${s.mono} ${s.dim}`}>
            {read.source}
            {link && (
              <>
                {' · '}
                <a href={link} target="_blank" rel="noopener" className={s.uline}>
                  Open →
                </a>
              </>
            )}
          </p>
        </div>

        {read.image && (
          <div className={s.readImage} aria-hidden="true">
            <img key={read.image} src={read.image} alt="" loading="lazy" />
          </div>
        )}

        <ul className={s.readList}>
          {reads.map((r, k) => (
            <li key={k}>
              <button type="button" aria-pressed={k === index} onClick={() => setIndex(k)} onMouseEnter={() => setIndex(k)} onFocus={() => setIndex(k)}>
                <span className={s.readIcon} aria-hidden="true">
                  <svg width="10" height="10" viewBox="0 0 12 12">
                    <path d={ICON[r.type] ?? 'M2 2h8v8H2z'} fill="currentColor" />
                  </svg>
                </span>
                <span>
                  <span className={`${s.mono} ${s.gold}`}>{r.type}</span>
                  <span className={s.readShort}>{r.short}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
        <Sub className={s.caption}>Notes are published only in Simran’s own words.</Sub>
      </div>
    </Scene>
  )
}
