import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from './gsap'

/** Trailing cursor dot that grows over links, buttons and [data-cursor] elements. */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const el = ref.current!
    if (prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) return

    gsap.set(el, { xPercent: -50, yPercent: -50 })
    const xTo = gsap.quickTo(el, 'x', { duration: 0.35 })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.35 })

    const move = (e: PointerEvent) => {
      xTo(e.clientX)
      yTo(e.clientY)
      el.classList.add('is-visible')
      const target = (e.target as Element).closest('a, button, [data-cursor]')
      el.classList.toggle('is-active', Boolean(target))
    }
    const hide = () => el.classList.remove('is-visible')

    window.addEventListener('pointermove', move)
    document.documentElement.addEventListener('pointerleave', hide)
    return () => {
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', hide)
    }
  })

  return <div ref={ref} className="cursor" aria-hidden="true" />
}
