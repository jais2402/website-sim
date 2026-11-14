import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from '../motion'

type Props = {
  items: string[]
  /** Seconds for one full loop. */
  duration?: number
}

/** Endless ticker that speeds up and flips direction with scroll velocity. */
export function MarqueeLayout({ items, duration = 24 }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (prefersReducedMotion()) return
    const loop = gsap.to(ref.current!.firstElementChild, { xPercent: -50, duration, ease: 'none', repeat: -1 })
    const settle = gsap.quickTo(loop, 'timeScale', { duration: 0.8, ease: 'power2.out' })

    ScrollTrigger.create({
      trigger: ref.current,
      start: 'top bottom',
      end: 'bottom top',
      // Only run the loop while it is on screen.
      onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
      onUpdate: (self) => {
        const boost = gsap.utils.clamp(-6, 6, self.getVelocity() / 300)
        if (Math.abs(boost) > 1) gsap.set(loop, { timeScale: boost })
        settle(self.direction)
      },
    })
  }, { scope: ref })

  const row = items.map((item) => (
    <span className="marquee__item" key={item}>
      {item}
    </span>
  ))

  return (
    <div ref={ref} className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {row}
        {row}
      </div>
    </div>
  )
}
