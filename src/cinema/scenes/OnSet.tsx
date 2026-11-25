import Link from 'next/link'
import { stageOn, type Production } from '@/lib/status'
import { Scene, Sub } from '../ui'
import s from '../cinema.module.css'

export type OnSetFilm = { title: string; meta: string; production: Production; still?: string | null; cta?: { label: string; href: string } }

const fmt = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' })

/**
 * Scene 04: the production in front of the camera and the next one coming. "Shooting now" / "Coming soon" come from each film's dates.
 */
export function OnSet({ films, updatesHref, now }: { films: OnSetFilm[]; updatesHref: string; now: Date }) {
  const open = films.filter((f) => stageOn(f.production, now) !== 'released')
  const lead = open.find((f) => stageOn(f.production, now) === 'shooting') ?? open[0]
  if (!lead) return null
  const shooting = stageOn(lead.production, now) === 'shooting'
  const next = open.find((f) => f !== lead)

  return (
    <Scene n={4} name="On set now">
      <div className={s.stage}>
        {lead.still ? <img className={s.onSetPhoto} src={lead.still} alt="" loading="lazy" /> : <div className={`${s.plate} ${s.m3} ${s.kb}`} />}
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
          {next && (
          <Link href={updatesHref} className={`${s.nextCard} ${s.reveal}`}>
            <span className={`${s.mono} ${s.gold}`}>Coming soon</span>
            <span className={s.nextTitle}>{next.title}</span>
            <span className={s.nextDate}>
              {next.production.releaseDate ? `In cinemas ${fmt.format(new Date(`${next.production.releaseDate}T00:00:00+05:30`))}` : 'Release date to be announced'}
            </span>
          </Link>
          )}
        </div>

      </div>
    </Scene>
  )
}
