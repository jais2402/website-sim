import { useRef, type ReactNode } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from './gsap'

type Props = {
  children: ReactNode
  className?: string
  /** Seconds to wait after the element enters the viewport. */
  delay?: number
  /** Stagger direct children instead of animating the wrapper as one block. */
  stagger?: number
}

/** Fades and lifts its content into place the first time it scrolls into view. */
export function Reveal({ children, className, delay = 0, stagger }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (prefersReducedMotion()) return
    const el = ref.current!
    gsap.from(stagger ? el.children : el, {
      y: 48,
      autoAlpha: 0,
      delay,
      stagger,
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    })
  }, { scope: ref })

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
