import { Container, SectionHeading } from '@/components/ui'
import { daysUntil, stageOn, type Production } from '@/lib/status'
import s from './Upcoming.module.css'

export type UpcomingFilm = {
  title: string
  /** Language · role line under the title. */
  meta: string
  /** Key art path, or null for the typeset gradient stand-in. */
  poster: string | null
  /** Wide production still (used on the homepage On set scene). */
  still?: string | null
  /** Small line on the stand-in poster. Ignored while shooting ("Now filming"). */
  posterLine?: string
  /** Drives status, tracker and countdown. Never type a status label. */
  production: Production
  /** Shown in place of the date while none is locked. Defaults to "To be announced". */
  releaseNote?: string
  cta: { label: string; href: string }
}

export type UpcomingData = {
  heading: string
  headingTa?: string
  updatedNote?: string | null
  footnote?: string | null
  films: UpcomingFilm[]
}

const STEPS = ['Announced', 'Shooting', 'Post', 'In cinemas'] as const
const STEP_INDEX = { announced: 0, shooting: 1, post: 2, released: 3 } as const

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' }).format(
    new Date(`${iso}T00:00:00+05:30`),
  )

const isExternal = (href: string) => /^https?:/.test(href)

/**
 * Coming Soon & On Set. Server component: pass `now` (server time) so every card
 * is derived from the same instant. Released films are left out, they belong on the Reel Wall.
 */
export function Upcoming({ data, now = new Date() }: { data: UpcomingData; now?: Date }) {
  const films = data.films.filter((f) => stageOn(f.production, now) !== 'released')
  if (films.length === 0) return null

  return (
    <section id="upcoming" aria-labelledby="up-h" className={s.section}>
      <Container>
        <div className={s.head}>
          <div className={s.titles}>
            <SectionHeading id="up-h">{data.heading}</SectionHeading>
            <span lang="ta" className={s.ta}>
              {data.headingTa}
            </span>
          </div>
          {data.updatedNote && <span className={s.updated}>{data.updatedNote}</span>}
        </div>

        <div className={s.grid}>
          {films.map((f, i) => {
            const stage = stageOn(f.production, now)
            const current = STEP_INDEX[stage]
            const shooting = stage === 'shooting'
            const days = daysUntil(f.production, now)
            const locked = f.production.releaseDate
            const titleId = `up-film-${i}`

            return (
              <article key={`${f.title}-${i}`} aria-labelledby={titleId} className={`${s.card} ${shooting ? s.red : s.gold}`}>
                <div className={s.frame}>
                  {f.poster ? (
                    <img className={s.posterImg} src={f.poster} alt={`${f.title} poster`} loading="lazy" />
                  ) : (
                    <div className={s.poster} aria-hidden="true">
                      <div className={s.sheen} />
                      <div className={s.posterName}>Simran</div>
                      <div className={s.posterFoot}>
                        <div className={s.posterTitle}>{f.title}</div>
                        <div className={s.posterLine}>{shooting ? 'Now filming' : (f.posterLine ?? 'Coming soon')}</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className={s.body}>
                  <p className={s.status}>
                    <span className={s.dot} aria-hidden="true" />
                    {shooting ? 'Shooting now' : 'Coming soon'}
                  </p>

                  <div>
                    <h3 id={titleId} className={s.title}>
                      {f.title}
                    </h3>
                    <p className={s.meta}>{f.meta}</p>
                  </div>

                  <ol aria-label="Production stage" className={s.steps}>
                    {STEPS.map((label, k) => (
                      <li
                        key={label}
                        className={`${s.step} ${k < current ? s.done : k === current ? s.current : ''}`}
                        aria-current={k === current ? 'step' : undefined}
                      >
                        <span className={s.bar} />
                        <span className={s.stepLabel}>
                          {label}
                          {k < current && <span className="sr-only"> (done)</span>}
                        </span>
                      </li>
                    ))}
                  </ol>

                  <div className={s.foot}>
                    <div className={s.release}>
                      <span className={s.dateLabel}>{shooting || stage === 'announced' ? 'Release' : 'In cinemas'}</span>
                      {locked ? (
                        <time className={s.date} dateTime={locked}>
                          {formatDate(locked)}
                        </time>
                      ) : (
                        <span className={s.date}>{f.releaseNote ?? 'To be announced'}</span>
                      )}
                    </div>

                    {days !== null && (
                      <p className={s.countdown}>
                        <span className={s.days}>{days}</span>
                        <span className={s.daysLabel}>{days === 1 ? 'day to go' : 'days to go'}</span>
                      </p>
                    )}

                    <a
                      className={s.cta}
                      href={f.cta.href}
                      {...(isExternal(f.cta.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {f.cta.label}
                      <span className="sr-only">: {f.title}</span>
                      <span aria-hidden="true">→</span>
                    </a>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {data.footnote && <p className={s.footnote}>{data.footnote}</p>}
      </Container>
    </section>
  )
}
