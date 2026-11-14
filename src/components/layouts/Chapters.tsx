import { Container } from '@/components/ui'
import s from './layouts.module.css'

export type Chapter = { era: string; title: string; paragraphs: string[] }

/** Long-form reading layout: a gold era label in the margin beside each chapter. */
export function Chapters({ chapters }: { chapters: Chapter[] }) {
  return (
    <Container className={s.chapters}>
      {chapters.map((c) => (
        <section key={c.era} className={s.chapter} aria-label={`${c.era}: ${c.title}`}>
          <p className={s.chapterEra}>{c.era}</p>
          <div>
            <h2 className={s.chapterTitle}>{c.title}</h2>
            {c.paragraphs.map((p, i) => (
              <p key={i} className={s.chapterText}>
                {p}
              </p>
            ))}
          </div>
        </section>
      ))}
    </Container>
  )
}
