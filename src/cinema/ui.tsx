'use client'

import { useEffect, useRef, type CSSProperties, type PointerEvent, type ReactNode } from 'react'
import s from './cinema.module.css'

const pad = (n: number) => String(n).padStart(2, '0')

/* ---------- Timecode: one shared clock for every scene ---------- */

const clocks = new Set<HTMLElement>()
let timer: ReturnType<typeof setInterval> | undefined
let tick = 0

const format = (t: number) => {
  const fr = t * 6 // 24 frames a second, ticking four times a second
  return `01:${pad(Math.floor(fr / 86400) % 60)}:${pad(Math.floor(fr / 1440) % 60)}:${pad(Math.floor(fr / 24) % 60)}:${pad(fr % 24)}`
}

/** Running SMPTE-style timecode in the corner of a scene. Decorative. */
export function Timecode() {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    clocks.add(el)
    timer ??= setInterval(() => {
      if (document.hidden) return
      const text = format(++tick)
      clocks.forEach((node) => (node.textContent = text))
    }, 250)
    return () => {
      clocks.delete(el)
      if (clocks.size === 0) {
        clearInterval(timer)
        timer = undefined
      }
    }
  }, [])
  return (
    <span ref={ref} className={`${s.mono} ${s.tc}`} aria-hidden="true">
      01:00:00:00
    </span>
  )
}

/* ---------- Scene shell ---------- */

type SceneProps = {
  n: number
  /** Name on the slate, e.g. "The films". */
  name: string
  /** Last part of the slate. Defaults to "Take 1". */
  take?: string
  className?: string
  children: ReactNode
  /** Leave out the slate and timecode (the full-screen opening). */
  bare?: boolean
}

/** One full-height scene with its slate ("Scene 03 · The films · Take 1") and timecode. */
export function Scene({ n, name, take = 'Take 1', className, bare = false, children }: SceneProps) {
  const id = `s${pad(n)}`
  return (
    <section id={id} aria-labelledby={`${id}-h`} className={[s.scene, className].filter(Boolean).join(' ')}>
      {!bare && (
        <>
          <p className={`${s.mono} ${s.slate}`} aria-hidden="true">
            {name} · {take}
          </p>
          <Timecode />
        </>
      )}
      {children}
    </section>
  )
}

/** Subtitle-styled line, as if burned into the frame. */
export function Sub({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <p className={[s.sub, className].filter(Boolean).join(' ')} style={style}>
      {children}
    </p>
  )
}

/* ---------- Pointer helpers (write straight to the element; no re-render) ---------- */

/** Handlers that pull an element toward the pointer while hovered. Spread onto a `.mag` element. */
export const magnetic = {
  onPointerMove(e: PointerEvent<HTMLElement>) {
    if (e.pointerType !== 'mouse') return
    const b = e.currentTarget.getBoundingClientRect()
    const x = Math.round((e.clientX - b.left - b.width / 2) * 0.28)
    const y = Math.round((e.clientY - b.top - b.height / 2) * 0.32)
    e.currentTarget.style.transform = `translate(${x}px, ${y}px)`
  },
  onPointerLeave(e: PointerEvent<HTMLElement>) {
    e.currentTarget.style.transform = ''
  },
}

/** Handlers that tilt a card in 3D under the pointer. Spread onto a `.tilt` element. */
export const tilt = {
  onPointerMove(e: PointerEvent<HTMLElement>) {
    if (e.pointerType !== 'mouse') return
    const b = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - b.left) / b.width - 0.5
    const py = (e.clientY - b.top) / b.height - 0.5
    e.currentTarget.style.transform = `rotateX(${Math.round(-py * 16)}deg) rotateY(${Math.round(px * 16)}deg) scale(1.04)`
    e.currentTarget.dataset.tilting = ''
  },
  onPointerLeave(e: PointerEvent<HTMLElement>) {
    e.currentTarget.style.transform = ''
    delete e.currentTarget.dataset.tilting
  },
}

/** Writes the pointer position (0–1 from bottom-left of the element) into a ref for a shader. */
export const trackPointer = (target: { current: [number, number] }) => (e: PointerEvent<HTMLElement>) => {
  const b = e.currentTarget.getBoundingClientRect()
  target.current = [(e.clientX - b.left) / b.width, 1 - (e.clientY - b.top) / b.height]
}

/** Radial stand-in for imagery that has not been supplied. */
export const art = (a: string, b: string) => `radial-gradient(ellipse 80% 70% at 50% 30%, ${a} 0%, ${b} 60%, #0d0b0a 100%)`
