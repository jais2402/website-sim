import s from '../../cinema.module.css'
import { Block } from './Block'
import c from './press.module.css'

export type HonourRow = { year: number; body: string; award: string; work: string | null; result: string }

/** Every award and nomination, newest first, as a ruled ledger. The year shows once per group. */
export function AwardsLedger({ awards }: { awards: HonourRow[] }) {
  const won = awards.filter((a) => a.result === 'Won').length
  return (
    <Block id="awards" headingId="honours-list" slate="The full list · Take 2" kicker={`${awards.length} entries · ${won} won`} heading="Awards and nominations">
      <ul className={c.ledger}>
        {awards.map((a, k) => (
          <li key={`${a.year}-${a.body}-${a.award}`} className={c.row}>
            <span className={c.year} data-repeat={(k > 0 && awards[k - 1].year === a.year) || undefined}>
              {a.year}
            </span>
            <span className={c.rowMain}>
              <span className={c.award}>{a.award}</span>
              <span className={c.detail}>{[a.body, a.work].filter(Boolean).join(' · ')}</span>
            </span>
            <span className={`${s.mono} ${c.result}`} data-won={a.result === 'Won' || undefined}>
              {a.result}
            </span>
          </li>
        ))}
      </ul>
    </Block>
  )
}
