import { Scene } from '../../ui'
import c from '../../cinema.module.css'
import s from './work.module.css'

export type Show = { year: string; title: string; role: string; language: string; channel: string }

/** Television work as a ruled ledger in the cinema look, newest first. */
export function Television({ shows, n }: { shows: Show[]; n: number }) {
  const rows = [...shows].sort((a, b) => b.year.localeCompare(a.year))
  return (
    <Scene n={n} name="Television" take={`${shows.length} shows`} className={s.listScene}>
      <div className={s.inner}>
        <header className={s.head}>
          <h2 id={`s${String(n).padStart(2, '0')}-h`} className={`${c.h2} ${c.reveal}`}>
            Television
          </h2>
        </header>
        <ul className={s.ledger}>
          {rows.map((t) => (
            <li key={`${t.year}-${t.title}`} className={s.ledgerRow}>
              <span className={s.ledgerYear}>{t.year.replace('-', '–')}</span>
              <span>
                <span className={s.title}>{t.title}</span>
                {t.role && <span className={`${s.role} ${s.block}`}>{t.role}</span>}
              </span>
              <span className={`${c.mono} ${s.lang}`}>
                {t.language} · {t.channel}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Scene>
  )
}
