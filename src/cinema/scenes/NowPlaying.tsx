import { crawlState, type CrawlState, type Production } from '@/lib/status'
import { Scene, Sub } from '../ui'
import s from '../cinema.module.css'

export type RollData = { titles: { title: string; production: Production }[] }

const STATES: Record<CrawlState, { label: string; color: string; live?: boolean }> = {
  shooting: { label: 'Shooting', color: '#FF5A61', live: true },
  'coming-soon': { label: 'Coming soon', color: '#E8C77A' },
  'now-showing': { label: 'Now showing', color: '#8FD19E' },
}
const ORDER: CrawlState[] = ['shooting', 'coming-soon', 'now-showing']

/** Scene 02: an end-credits roll of what is shooting, coming and showing. States come from dates. */
export function NowPlaying({ data, now }: { data: RollData; now: Date }) {
  const items = data.titles
    .map((t) => ({ title: t.title, state: crawlState(t.production, now) }))
    .filter((t): t is { title: string; state: CrawlState } => t.state !== null)
    .sort((a, b) => ORDER.indexOf(a.state) - ORDER.indexOf(b.state))
  if (items.length === 0) return null

  const copy = (hidden: boolean) => (
    <ul className={s.rollCopy} aria-hidden={hidden || undefined}>
      {items.map((c, i) => {
        const st = STATES[c.state]
        return (
          <li key={i} className={s.rollRow}>
            <span className={`${s.mono} ${s.rollState}`} style={{ color: st.color }}>
              <i className={st.live ? s.live : undefined} style={{ background: st.color }} aria-hidden="true" />
              {st.label}
            </span>
            <span className={s.rollDot} aria-hidden="true">
              ·
            </span>
            <span className={s.rollTitle}>{c.title}</span>
          </li>
        )
      })}
    </ul>
  )
  // Enough copies to overfill the window; the roll moves by exactly half its height.
  const half = Math.max(2, Math.ceil(6 / items.length))

  return (
    <Scene n={2} name="Now playing" className={s.credits}>
      <div className={`${s.stage} ${s.rollStage}`}>
        <div className={s.grain} />
        <h2 id="s02-h" className={`${s.kicker} ${s.reveal}`}>
          Now playing
        </h2>
        <div className={s.rollWindow} tabIndex={0} role="region" aria-label="Release status">
          <div className={s.roll}>
            {copy(false)}
            {Array.from({ length: half * 2 - 1 }, (_, i) => (
              <div key={i} className={s.contents}>
                {copy(true)}
              </div>
            ))}
          </div>
        </div>
        <Sub className={s.caption}>Statuses update on release day.</Sub>
      </div>
    </Scene>
  )
}
