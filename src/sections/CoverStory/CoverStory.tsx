import type { ReactNode } from 'react'
import { Container, SectionHeading } from '@/components/ui'
import s from './CoverStory.module.css'

export type PressData = {
  cover: string | null
  coverAlt: string
  coverLine: string
  quote: string
  publication: string
}

/** Magazine cover with a cover line, beside a pull quote. */
export function CoverStory({ data, id = 'press', title = 'Cover Story', children }: { data: PressData; id?: string; title?: string; children?: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className={s.section}>
      <Container className={s.grid}>
        <div className={[s.cover, data.cover ? '' : 'still'].join(' ')}>
          {data.cover && <img src={data.cover} alt={data.coverAlt} loading="lazy" />}
          <div className={s.masthead}>SIMRAN</div>
          <div className={s.coverFoot}>
            <p className={s.coverLine}>{data.coverLine}</p>
            {!data.cover && <p className={s.note}>Cover still placeholder</p>}
          </div>
        </div>
        <div>
          <SectionHeading id={`${id}-h`} className={s.title}>
            {title}
          </SectionHeading>
          <blockquote className={s.quote}>“{data.quote}”</blockquote>
          <p className={s.source}>— {data.publication}</p>
          {children}
        </div>
      </Container>
    </section>
  )
}
