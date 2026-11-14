import { useRef, type ReactNode } from 'react'
import { gsap, useGSAP, prefersReducedMotion, SplitHeading } from '../motion'

type Props = {
  id?: string
  eyebrow?: ReactNode
  title: ReactNode
  /** Panels that travel sideways, e.g. <Card> elements. */
  children: ReactNode
}

/**
 * Pinned section: vertical scroll drives the panels sideways.
 * Below 800px, or with reduced motion, the panels simply stack.
 */
export function HorizontalScrollLayout({ id, eyebrow, title, children }: Props) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(() => {
    if (prefersReducedMotion()) return
    const mm = gsap.matchMedia()
    mm.add('(min-width: 800px)', () => {
      const track = ref.current!.firstElementChild as HTMLElement
      const distance = () => track.scrollWidth - window.innerWidth
      gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      })
    })
  }, { scope: ref })

  return (
    <section ref={ref} className="hscroll" id={id}>
      <div className="hscroll__track">
        <div className="hscroll__intro section-head">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <SplitHeading className="title">{title}</SplitHeading>
        </div>
        {children}
      </div>
    </section>
  )
}

/** Default panel for HorizontalScrollLayout. */
export function Card({ index, tag, title }: { index?: ReactNode; tag?: ReactNode; title: ReactNode }) {
  return (
    <article className="card" data-cursor>
      <span className="card__index">{index}</span>
      <div>
        {tag && <p className="eyebrow">{tag}</p>}
        <h3 className="card__title">{title}</h3>
      </div>
    </article>
  )
}
