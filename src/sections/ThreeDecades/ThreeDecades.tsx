import { Container, SectionHeading, TextLink } from '@/components/ui'
import s from './ThreeDecades.module.css'

export type AboutData = {
  portrait: string | null
  portraitAlt: string
  intro: string
  timeline: { era: string; text: string }[]
}

/** About tease: portrait, short bio and a three-row timeline. */
export function ThreeDecades({ data, id = 'about', title = 'Three Decades', moreHref = '/about' }: { data: AboutData; id?: string; title?: string; moreHref?: string | null }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className={s.section}>
      <Container className={s.grid}>
        <div className={[s.portrait, data.portrait ? '' : 'still'].join(' ')}>
          {data.portrait ? <img src={data.portrait} alt={data.portraitAlt} loading="lazy" /> : <span className={s.note}>Editorial portrait — commissioned</span>}
        </div>
        <div>
          <SectionHeading id={`${id}-h`} className={s.title}>
            {title}
          </SectionHeading>
          <p className={s.intro}>{data.intro}</p>
          <ol className={s.timeline}>
            {data.timeline.map((row) => (
              <li key={row.era} className={s.row}>
                <span className={s.era}>{row.era}</span>
                <span className={s.text}>{row.text}</span>
              </li>
            ))}
          </ol>
          {moreHref && <TextLink href={moreHref}>Read the biography</TextLink>}
        </div>
      </Container>
    </section>
  )
}
