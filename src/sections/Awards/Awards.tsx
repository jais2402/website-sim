'use client'

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from 'react'
import { Container, SectionHeading } from '@/components/ui'
import s from './Awards.module.css'

export type AwardItem = {
  /** Which shelf it stands on: 1 left upper, 2 right upper, 3 wall-hung (no plank), 4 left lower. */
  shelf: number
  /** "cup" | "star" | "crystal" | "plaque". Anything else draws a cup. Generic shapes only. */
  shape: string
  /** "gold" | "silver" (cups only). */
  metal: string
  /** Plinth colour: "black" | "navy". */
  base: string
  /** Trophy width in px at 1440. */
  size: number
  kind: string
  title: string
  count: string
  detail: string
  when: string
}

export type AwardsData = {
  heading: string
  headingTa?: string
  intro: string
  note?: string | null
  awards: AwardItem[]
}

/** Below this the shelves stack and the citation opens as a tap sheet (HANDOVER §5). */
const NARROW = '(max-width: 1000px)'
const SHELVES = [1, 2, 3, 4]
const BASES: Record<string, string> = { black: '#14110f', navy: '#1b2a44' }

function subscribeNarrow(onChange: () => void) {
  const mq = window.matchMedia(NARROW)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

export function Awards({ data }: { data: AwardsData }) {
  const [active, setActive] = useState(-1)
  const [sheet, setSheet] = useState(-1)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const narrow = useSyncExternalStore(
    subscribeNarrow,
    () => window.matchMedia(NARROW).matches,
    () => false,
  )

  const off = (k: number) => setActive((cur) => (cur === k ? -1 : cur))

  // Callout: dismiss with Escape or by tapping anywhere else.
  useEffect(() => {
    if (active < 0) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActive(-1)
    }
    const onDown = (e: PointerEvent) => {
      if (!(e.target instanceof Element) || !e.target.closest('[data-trophy]')) setActive(-1)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [active])

  // Tap sheet: a native modal dialog, so Escape, focus trapping and focus return come free.
  useEffect(() => {
    const d = dialogRef.current
    if (!d) return
    if (sheet >= 0 && !d.open) d.showModal()
    if (sheet < 0 && d.open) d.close()
  }, [sheet])

  const items = data.awards.map((a, k) => ({ a, k }))
  const sheetAward = sheet >= 0 ? data.awards[sheet] : undefined

  return (
    <section id="honours" aria-labelledby="hn-h" className={s.section}>
      <MetalDefs />
      <Container>
        <div className={s.head}>
          <div>
            <SectionHeading id="hn-h">{data.heading}</SectionHeading>
            <p className={s.intro}>{data.intro}</p>
          </div>
          <span lang="ta" className={s.headingTa}>
            {data.headingTa}
          </span>
        </div>

        <div className={s.wall}>
          {SHELVES.map((n) => {
            const onShelf = items.filter(({ a }) => a.shelf === n)
            if (!onShelf.length) return null
            const hung = n === 3
            return (
              <div key={n} className={s.shelf} data-shelf={n}>
                <div className={s.pool} aria-hidden="true" />
                <div className={s.row}>
                  {onShelf.map(({ a, k }) => {
                    const on = active === k
                    const tipId = `award-tip-${k}`
                    return (
                      <div key={k} className={s.item} data-active={on || undefined}>
                        <div role="tooltip" id={tipId} className={s.tip}>
                          <div className={s.card}>
                            <Citation award={a} />
                          </div>
                          <div className={s.tipArrow} aria-hidden="true" />
                        </div>
                        <button
                          type="button"
                          data-trophy
                          className={s.trophy}
                          style={{ '--w': `${a.size}px` } as CSSProperties}
                          aria-label={`${a.title}, ${a.count}`}
                          aria-describedby={tipId}
                          aria-expanded={narrow ? sheet === k : on}
                          aria-haspopup={narrow ? 'dialog' : undefined}
                          onMouseEnter={() => setActive(k)}
                          onMouseLeave={() => off(k)}
                          onFocus={() => setActive(k)}
                          onBlur={() => off(k)}
                          onClick={() => (narrow ? setSheet(k) : setActive(k))}
                        >
                          <span className={s.glow} aria-hidden="true" />
                          <Trophy shape={a.shape} metal={a.metal} base={BASES[a.base] ?? BASES.black} />
                        </button>
                      </div>
                    )
                  })}
                </div>
                {!hung && (
                  <>
                    <div className={s.plank} aria-hidden="true" />
                    <div className={s.brackets} aria-hidden="true">
                      <span />
                      <span />
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>

        {data.note ? <p className={s.note}>{data.note}</p> : null}
      </Container>

      <dialog
        ref={dialogRef}
        className={s.sheet}
        aria-labelledby="award-sheet-title"
        onClose={() => setSheet(-1)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setSheet(-1)
        }}
      >
        {sheetAward && (
          <div className={s.sheetCard}>
            <Citation award={sheetAward} titleId="award-sheet-title" />
            <button type="button" className={s.sheetClose} onClick={() => setSheet(-1)}>
              Close
            </button>
          </div>
        )}
      </dialog>
    </section>
  )
}

function Citation({ award, titleId }: { award: AwardItem; titleId?: string }) {
  return (
    <>
      <div className={s.cardTop}>
        <span className={s.kind}>{award.kind}</span>
        <span className={s.count}>{award.count}</span>
      </div>
      <div id={titleId} className={s.title}>
        {award.title}
      </div>
      <div className={s.rule} />
      <div className={s.detail}>{award.detail}</div>
      <div className={s.when}>{award.when}</div>
    </>
  )
}

/** Shared metal gradients, referenced by every trophy. */
function MetalDefs() {
  return (
    <svg className={s.defs} width="0" height="0" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="hn-m-gold" x1="0" x2="1">
          <stop offset="0" stopColor="#7a5a1e" />
          <stop offset="0.3" stopColor="#F8E3A3" />
          <stop offset="0.55" stopColor="#D4AF5A" />
          <stop offset="1" stopColor="#6b4f1a" />
        </linearGradient>
        <linearGradient id="hn-m-silver" x1="0" x2="1">
          <stop offset="0" stopColor="#6c7378" />
          <stop offset="0.3" stopColor="#F4F6F7" />
          <stop offset="0.55" stopColor="#B8C0C4" />
          <stop offset="1" stopColor="#5a6166" />
        </linearGradient>
        <linearGradient id="hn-s-gold" x1="0" x2="1">
          <stop offset="0" stopColor="#7a5a1e" />
          <stop offset="0.4" stopColor="#FBE7AE" />
          <stop offset="1" stopColor="#6b4f1a" />
        </linearGradient>
        <linearGradient id="hn-c-gl" x1="0" x2="1">
          <stop offset="0" stopColor="rgba(200,230,240,0.35)" />
          <stop offset="0.45" stopColor="rgba(255,255,255,0.9)" />
          <stop offset="0.55" stopColor="rgba(180,215,230,0.45)" />
          <stop offset="1" stopColor="rgba(140,180,200,0.3)" />
        </linearGradient>
        <linearGradient id="hn-p-gold" x1="0" x2="1">
          <stop offset="0" stopColor="#7a5a1e" />
          <stop offset="0.45" stopColor="#F8E3A3" />
          <stop offset="1" stopColor="#6b4f1a" />
        </linearGradient>
      </defs>
    </svg>
  )
}

/** Generic, illustrative trophies. Not replicas of any real statuette. */
function Trophy({ shape, metal, base }: { shape: string; metal: string; base: string }) {
  if (shape === 'star') {
    const g = 'url(#hn-s-gold)'
    return (
      <svg className={s.art} viewBox="0 0 120 200" aria-hidden="true">
        <path d="M60 6l12 24 26 4-19 18 5 26-24-13-24 13 5-26-19-18 26-4z" fill={g} />
        <path d="M60 78c-14 0-22 12-22 24 0 14 10 24 22 24s22-10 22-24c0-12-8-24-22-24z" fill={g} />
        <rect x="54" y="124" width="12" height="10" fill={g} />
        <path d="M42 134h36l5 10H37z" fill={g} />
        <rect x="28" y="144" width="64" height="52" rx="2" fill={base} />
        <rect x="40" y="158" width="40" height="20" fill={g} opacity="0.85" />
      </svg>
    )
  }
  if (shape === 'crystal') {
    return (
      <svg className={s.art} viewBox="0 0 120 200" aria-hidden="true">
        <path d="M60 4l24 32v108H36V36z" fill="url(#hn-c-gl)" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
        <path d="M60 4v140M36 36l24 14 24-14" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
        <rect x="26" y="144" width="68" height="52" rx="2" fill={base} />
        <rect x="38" y="158" width="44" height="20" fill="#D4AF5A" opacity="0.85" />
      </svg>
    )
  }
  if (shape === 'plaque') {
    const g = 'url(#hn-p-gold)'
    return (
      <svg className={s.art} viewBox="0 0 140 170" aria-hidden="true">
        <rect x="2" y="2" width="136" height="166" rx="3" fill="#3e2614" />
        <rect x="12" y="12" width="116" height="146" fill="#1b2a44" />
        <path d="M58 22h10l6 30H64zM82 22H72l-6 30h10z" fill="#7A1F24" />
        <circle cx="70" cy="80" r="30" fill={g} />
        <circle cx="70" cy="80" r="22" fill="none" stroke="rgba(107,79,26,0.7)" strokeWidth="2" />
        <path d="M70 66l4 9 10 1-7 7 2 10-9-5-9 5 2-10-7-7 10-1z" fill="#8a6a2a" />
        <rect x="34" y="124" width="72" height="20" fill={g} />
      </svg>
    )
  }
  const g = metal === 'silver' ? 'url(#hn-m-silver)' : 'url(#hn-m-gold)'
  return (
    <svg className={s.art} viewBox="0 0 120 200" aria-hidden="true">
      <path d="M28 14h64v40c0 24-14 40-32 40S28 78 28 54z" fill={g} />
      <path d="M28 22c-15 0-22 9-20 20 2 12 13 18 24 18" fill="none" stroke={g} strokeWidth="6" />
      <path d="M92 22c15 0 22 9 20 20-2 12-13 18-24 18" fill="none" stroke={g} strokeWidth="6" />
      <path d="M38 30h44" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
      <rect x="54" y="92" width="12" height="36" fill={g} />
      <ellipse cx="60" cy="110" rx="12" ry="6" fill={g} />
      <path d="M40 128h40l6 14H34z" fill={g} />
      <rect x="24" y="142" width="72" height="54" rx="2" fill={base} />
      <rect x="38" y="156" width="44" height="22" fill="url(#hn-m-gold)" opacity="0.85" />
    </svg>
  )
}
