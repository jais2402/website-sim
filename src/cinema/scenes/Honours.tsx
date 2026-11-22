'use client'

import Link from 'next/link'
import { useRef, useState, type PointerEvent } from 'react'
import { Scene, art } from '../ui'
import s from '../cinema.module.css'

export type Honour = { title: string; count: string; when: string; metal?: string; image?: string | null }

const TINT: Record<string, string> = { gold: '#8a6a2a', silver: '#6c7378', glass: '#4f6f80' }

/** Scene 09: honours as closing credits. A trophy photo follows the pointer over each line. */
export function Honours({ awards, allHref }: { awards: Honour[]; allHref: string }) {
  const [active, setActive] = useState(-1)
  const card = useRef<HTMLDivElement>(null)
  const current = awards[Math.max(active, 0)]

  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (!card.current) return
    const b = e.currentTarget.getBoundingClientRect()
    card.current.style.left = `${Math.round(e.clientX - b.left)}px`
    card.current.style.top = `${Math.round(e.clientY - b.top)}px`
  }

  return (
    <Scene n={9} name="Honours">
      <div className={`${s.stage} ${s.honourStage}`} onPointerMove={move} onPointerLeave={() => setActive(-1)}>
        <div className={s.grain} />
        <h2 id="s09-h" className={`${s.kicker} ${s.kickerStatic} ${s.reveal}`}>
          Honours
        </h2>
        <ul className={s.honours} data-active={active >= 0 || undefined}>
          {awards.map((a, k) => (
            <li key={a.title} onPointerEnter={() => setActive(k)}>
              <Link href={allHref} data-on={active === k || undefined} onFocus={() => setActive(k)} onBlur={() => setActive(-1)}>
                <span className={s.mono}>{a.when}</span>
                <span aria-hidden="true">·</span>
                <span className={s.honourTitle}>
                  {a.title} <em>{a.count}</em>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div ref={card} className={s.trophy} data-show={active >= 0 || undefined} data-odd={active % 2 === 1 || undefined} aria-hidden="true">
          {current.image ? (
            <img className={s.cover} src={current.image} alt="" />
          ) : (
            <>
              <div className={s.fill} style={{ background: art(TINT[current.metal ?? 'gold'] ?? TINT.gold, '#151210') }} />
              <span className={s.mono}>Trophy photo</span>
            </>
          )}
        </div>
      </div>
    </Scene>
  )
}
