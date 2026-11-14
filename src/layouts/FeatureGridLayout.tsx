import type { ReactNode } from 'react'
import { Reveal, SplitHeading } from '../motion'

export type Feature = { title: string; body: ReactNode }

type Props = {
  id?: string
  eyebrow?: ReactNode
  title: ReactNode
  items: Feature[]
}

/** Section heading over a responsive grid of cards that stagger in on scroll. */
export function FeatureGridLayout({ id, eyebrow, title, items }: Props) {
  return (
    <section className="features container" id={id}>
      <div className="section-head">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <SplitHeading className="title">{title}</SplitHeading>
      </div>
      <Reveal className="grid" stagger={0.12}>
        {items.map((item) => (
          <div className="point" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </div>
        ))}
      </Reveal>
    </section>
  )
}
