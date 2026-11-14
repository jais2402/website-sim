import type { ReactNode } from 'react'
import { Container } from '@/components/ui'
import s from './layouts.module.css'

export type LedgerRow = { key: string; lead: ReactNode; title: ReactNode; detail?: ReactNode; aside?: ReactNode }

/** Ruled typographic list: a gold lead (year), a serif title, and quiet detail. */
export function LedgerList({ id, heading, rows }: { id?: string; heading: string; rows: LedgerRow[] }) {
  return (
    <Container className={s.ledger}>
      <h2 id={id} className={s.ledgerHeading}>
        {heading}
      </h2>
      <ul>
        {rows.map((r) => (
          <li key={r.key} className={s.ledgerRow}>
            <span className={s.ledgerLead}>{r.lead}</span>
            <span>
              <span className={s.ledgerTitle}>{r.title}</span>
              {r.detail && <span className={s.ledgerDetail}>{r.detail}</span>}
            </span>
            <span className={s.ledgerAside}>{r.aside}</span>
          </li>
        ))}
      </ul>
    </Container>
  )
}
