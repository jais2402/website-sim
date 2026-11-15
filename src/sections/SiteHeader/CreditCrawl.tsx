import { crawlState, type CrawlState, type Production } from '@/lib/status'
import s from './CreditCrawl.module.css'

export type CrawlData = { titles: { title: string; production: Production }[] }

const ORDER: CrawlState[] = ['now-showing', 'coming-soon', 'shooting']

function Label({ state }: { state: CrawlState }) {
  if (state === 'now-showing') return <span className={s.state}>Now showing</span>
  if (state === 'shooting') return <span className={s.state}>Shooting</span>
  return <span className={s.state}>Coming soon</span>
}

/**
 * Red band under the nav. Three honest states only, each computed from the
 * production's dates at render time (the page revalidates hourly).
 */
export function CreditCrawl({ data, now = new Date() }: { data: CrawlData; now?: Date }) {
  const items = data.titles
    .map((t) => ({ title: t.title, state: crawlState(t.production, now) }))
    .filter((t): t is { title: string; state: CrawlState } => t.state !== null)
    .sort((a, b) => ORDER.indexOf(a.state) - ORDER.indexOf(b.state))

  if (items.length === 0) return null

  const run = (hidden: boolean) => (
    <ul className={s.run} aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <li key={i} className={s.item}>
          <span>
            <Label state={item.state} /> — {item.title}
          </span>
          <span className={s.dot} aria-hidden="true">
            ·
          </span>
        </li>
      ))}
    </ul>
  )

  // Enough copies to fill wide screens; the track moves by exactly one copy.
  const copies = Math.max(2, Math.ceil(12 / items.length))

  return (
    <div className={s.crawl} role="region" aria-label="Release status" tabIndex={0}>
      <div className={s.track} style={{ ['--copies' as string]: copies }}>
        {run(false)}
        {Array.from({ length: copies - 1 }, (_, i) => (
          <div key={i} className={s.copy}>
            {run(true)}
          </div>
        ))}
      </div>
    </div>
  )
}
