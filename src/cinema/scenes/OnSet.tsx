import Link from 'next/link'
import { stageOn, type Production } from '@/lib/status'
import { Scene, Sub } from '../ui'
import s from '../cinema.module.css'

export type OnSetFilm = { title: string; meta: string; production: Production; cta?: { label: string; href: string } }
export type NewsItem = { category: string; title: string; meta: string; href: string }

const fmt = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' })

/**
 * Scene 04: the production in front of the camera, the next one coming, and a
 * news ticker. "Shooting now" / "Coming soon" come from each film's dates.
 */
export function OnSet({ films, news, updatesHref, now }: { films: OnSetFilm[]; news: NewsItem[]; updatesHref: string; now: Date }) {
  const open = films.filter((f) => stageOn(f.production, now) !== 'released')
  const lead = open.find((f) => stageOn(f.production, now) === 'shooting') ?? open[0]
  if (!lead) return null
  const shooting = stageOn(lead.production, now) === 'shooting'
  const next = open.find((f) => f !== lead)

  const run = (hidden: boolean) =>
    news.map((n, i) => (
      <a key={`${hidden}-${i}`} href={n.href} className={s.tickerItem} aria-hidden={hidden || undefined} tabIndex={hidden ? -1 : undefined}>
        <span className={`${s.mono} ${s.gold}`}>{n.category}</span>
        <span>{n.title}</span>
        <span className={`${s.mono} ${s.faint}`}>{n.meta}</span>
      </a>
    ))

  return (
    <Scene n={4} name="On set now" className={s.newsreel}>
      <div className={s.stage}>
        <div className={`${s.plate} ${s.m3} ${s.kb}`} />
        <div className={`${s.fill} ${s.onSetShade}`} aria-hidden="true" />
        <div className={s.grain} />

        <div className={s.onSetLead}>
          <p className={`${s.badge} ${s.reveal}`} data-live={shooting || undefined}>
            <i className={shooting ? s.live : undefined} aria-hidden="true" />
            <span className={s.mono}>{shooting ? 'Shooting now' : 'Coming soon'}</span>
          </p>
          <h2 id="s04-h" className={`${s.onSetTitle} ${s.reveal}`}>
            {lead.title}
          </h2>
          <Sub className={`${s.onSetMeta} ${s.reveal}`}>
            {lead.meta} ·{' '}
            <Link href={updatesHref} className={s.uline}>
              Production updates →
            </Link>
          </Sub>
        </div>

        {next && (
          <Link href={updatesHref} className={`${s.nextCard} ${s.reveal}`}>
            <span className={`${s.mono} ${s.gold}`}>Coming soon</span>
            <span className={s.nextTitle}>{next.title}</span>
            <span className={s.nextDate}>
              {next.production.releaseDate ? `In cinemas ${fmt.format(new Date(`${next.production.releaseDate}T00:00:00+05:30`))}` : 'Release date to be announced'}
            </span>
          </Link>
        )}

        {news.length > 0 && (
          <div className={s.tickerBar}>
            <span className={`${s.mono} ${s.tickerFlag}`}>Newsreel</span>
            <div className={s.tickerWindow}>
              <div className={s.ticker}>
                {run(false)}
                {run(true)}
              </div>
            </div>
          </div>
        )}
      </div>
    </Scene>
  )
}
