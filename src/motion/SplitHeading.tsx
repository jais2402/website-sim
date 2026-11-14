import { useRef, type ElementType, type ReactNode } from 'react'
import { gsap, SplitText, useGSAP, prefersReducedMotion } from './gsap'

type Props = {
  as?: ElementType
  children: ReactNode
  className?: string
  /** Animate on page load instead of waiting for scroll. */
  immediate?: boolean
}

/** Heading whose lines rise out of a mask, one after another. */
export function SplitHeading({ as: Tag = 'h2', children, className, immediate }: Props) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(() => {
    if (prefersReducedMotion()) return
    const el = ref.current!
    // autoSplit re-splits when fonts load or the container resizes.
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      autoSplit: true,
      onSplit: (self) => {
        gsap.set(el, { visibility: 'visible' })
        return gsap.from(self.lines, {
          yPercent: 110,
          duration: 1.1,
          ease: 'power4.out',
          stagger: 0.09,
          scrollTrigger: immediate ? undefined : { trigger: el, start: 'top 85%', once: true },
        })
      },
    })
  }, { scope: ref })

  return (
    <Tag ref={ref} className={className} data-intro={immediate || undefined}>
      {children}
    </Tag>
  )
}
