import s from '../cinema.module.css'

export type NewsItem = { category: string; title: string; meta: string; href: string }

/** The red "Newsreel" band: headlines crawling along the foot of the hero. */
export function NewsTicker({ news }: { news: NewsItem[] }) {
  if (news.length === 0) return null
  const run = (hidden: boolean) =>
    news.map((n, i) => (
      <a key={`${hidden}-${i}`} href={n.href} className={s.tickerItem} aria-hidden={hidden || undefined} tabIndex={hidden ? -1 : undefined}>
        <span className={`${s.mono} ${s.gold}`}>{n.category}</span>
        <span>{n.title}</span>
        <span className={`${s.mono} ${s.faint}`}>{n.meta}</span>
      </a>
    ))
  return (
    <div className={s.tickerBar} role="region" aria-label="Newsreel">
      <span className={`${s.mono} ${s.tickerFlag}`}>Newsreel</span>
      <div className={s.tickerWindow}>
        <div className={s.ticker}>
          {run(false)}
          {run(true)}
        </div>
      </div>
    </div>
  )
}
