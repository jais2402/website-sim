import { Timecode } from '../../ui'
import s from '../../cinema.module.css'
import b from './Biography.module.css'

export type BioChapter = { era: string; title: string; paragraphs: string[] }
export type BioAct = { era: string; text: string }

const pad = (n: number) => String(n).padStart(2, '0')

/** The biography as a cinema long-read: a short overview, then one chapter per era. */
export function Biography({ id, chapters, acts = [] }: { id: string; chapters: BioChapter[]; acts?: BioAct[] }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className={`${s.scene} ${b.bio}`}>
      <p className={`${s.mono} ${s.slate}`} aria-hidden="true">
        Biography · {chapters.length} chapters
      </p>
      <Timecode />
      <div className={b.inner}>
        <h2 id={`${id}-h`} className={`${s.h2} ${s.reveal}`}>
          Biography
        </h2>

        {acts.length > 0 && (
          <ol className={`${b.acts} ${s.reveal}`}>
            {acts.map((a) => (
              <li key={a.era}>
                <p className={`${s.mono} ${s.gold}`}>{a.era}</p>
                <p className={b.actText}>{a.text}</p>
              </li>
            ))}
          </ol>
        )}

        {chapters.map((c, k) => (
          <article key={c.era} className={b.chapter} aria-labelledby={`${id}-c${k}`}>
            <div className={b.era}>
              <p className={`${s.mono} ${b.num}`}>Chapter {pad(k + 1)}</p>
              <p className={b.eraLabel}>{c.era}</p>
            </div>
            <div className={`${b.body} ${s.reveal}`}>
              <h3 id={`${id}-c${k}`} className={b.title}>
                {c.title}
              </h3>
              {c.paragraphs.map((p, i) => (
                <p key={i} className={b.text}>
                  {p}
                </p>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
