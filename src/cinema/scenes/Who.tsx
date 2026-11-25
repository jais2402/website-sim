'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useAutoAdvance } from '@/lib/useAutoAdvance'
import { Scene } from '../ui'
import s from '../cinema.module.css'

export type WhoData = {
  portrait: string | null
  portraitAlt: string
  facts: { label: string; value: string }[]
  /** Real interview exchange, shown one line at a time as subtitles. */
  lines: { who: string; text: string }[]
}

/** Scene 06: interview portrait, three facts, and a subtitled exchange that advances on its own. */
export function Who({ data, bioHref }: { data: WhoData; bioHref: string }) {
  const { index, go, setPaused } = useAutoAdvance({ count: data.lines.length, interval: 4000 })
  // Fade the old line out before the new one comes in.
  const [shown, setShown] = useState(index)
  useEffect(() => {
    if (shown === index) return
    const id = setTimeout(() => setShown(index), 300)
    return () => clearTimeout(id)
  }, [index, shown])
  const line = data.lines[shown]

  return (
    <Scene n={6} name="Who she is">
      <div className={s.stage} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
        {data.portrait ? <img className={s.whoPhoto} src={data.portrait} alt={data.portraitAlt} loading="lazy" /> : <div className={`${s.plate} ${s.m1} ${s.kb}`} />}
        <div className={`${s.fill} ${s.whoShade}`} aria-hidden="true" />
        <div className={s.grain} />
        {!data.portrait && <span className={`${s.mono} ${s.plateNote}`}>Interview portrait · placeholder</span>}

        <div className={s.whoBody}>
          <h2 id="s06-h" className={`${s.h2} ${s.reveal}`}>
            Who she is
          </h2>
          <dl className={`${s.facts} ${s.reveal}`}>
            {data.facts.map((f) => (
              <div key={f.label} className={s.contents}>
                <dt className={`${s.mono} ${s.gold}`}>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
          <Link href={bioHref} className={`${s.uline} ${s.mono} ${s.whoLink}`}>
            Read the biography →
          </Link>
        </div>

        <div aria-live="polite" className={`${s.swap} ${s.whoLine} ${shown !== index ? s.swapDown : ''}`}>
          <p className={`${s.mono} ${s.gold}`}>{line.who}</p>
          <p className={s.sub}>{line.text}</p>
        </div>
        <div role="group" aria-label="Interview lines" className={s.lineDots}>
          {data.lines.map((_, k) => (
            <button key={k} type="button" aria-label={`Line ${k + 1}`} aria-pressed={k === index} onClick={() => go(k)}>
              <span />
            </button>
          ))}
        </div>
      </div>
    </Scene>
  )
}
