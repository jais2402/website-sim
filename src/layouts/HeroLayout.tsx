import { useRef, type ReactNode } from 'react'
import { gsap, useGSAP, prefersReducedMotion, SplitHeading } from '../motion'

type Props = {
  id?: string
  eyebrow?: ReactNode
  title: ReactNode
  lede?: ReactNode
  /** Buttons or links shown under the lede. */
  actions?: ReactNode
}

/** Full-height opener: masked headline, pointer-following glow, parallax on scroll out. */
export function HeroLayout({ id, eyebrow, title, lede, actions }: Props) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(() => {
    if (prefersReducedMotion()) return
    const q = gsap.utils.selector(ref)
    const scrub = { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true }

    gsap.fromTo(q('.hero__fade'), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, stagger: 0.12, delay: 0.4 })
    gsap.to(q('.hero__glow'), { yPercent: 40, scale: 1.3, scrollTrigger: scrub })
    gsap.to(q('.hero__inner'), { yPercent: 20, opacity: 0.2, scrollTrigger: scrub })

    if (!window.matchMedia('(pointer: fine)').matches) return
    const xTo = gsap.quickTo(q('.hero__glow'), 'x', { duration: 1.2 })
    const yTo = gsap.quickTo(q('.hero__glow'), 'y', { duration: 1.2 })
    const move = (e: PointerEvent) => {
      xTo((e.clientX / window.innerWidth - 0.5) * 240)
      yTo((e.clientY / window.innerHeight - 0.5) * 160)
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, { scope: ref })

  return (
    <section ref={ref} className="hero" id={id}>
      <div className="hero__glow" aria-hidden="true" />
      <div className="hero__inner container">
        {eyebrow && <p className="eyebrow hero__fade" data-intro>{eyebrow}</p>}
        <SplitHeading as="h1" className="display" immediate>
          {title}
        </SplitHeading>
        {lede && <p className="lede hero__fade" data-intro>{lede}</p>}
        {actions && <div className="actions hero__fade" data-intro>{actions}</div>}
      </div>
    </section>
  )
}
