import type { Metadata } from 'next'
import Link from 'next/link'
import { InnerShell } from '@/cinema/InnerShell'
import s from '@/cinema/cinema.module.css'

export const metadata: Metadata = { title: 'Scene missing' }

/** 404: a cut to black with the way back to the start. */
export default function NotFound() {
  return (
    <InnerShell>
      <section className={s.pageTitle} aria-labelledby="page-title" style={{ minHeight: 'calc(100svh - var(--hdr))' }}>
        <div className={`${s.fill} ${s.m2} ${s.kb}`} aria-hidden="true" />
        <div className={s.pageTitleShade} aria-hidden="true" />
        <div className={`${s.grain} ${s.grainHeavy}`} />
        <div className={s.pageTitleBody}>
          <p className={`${s.mono} ${s.gold}`}>Scene missing · 404</p>
          <h1 id="page-title">
            Cut.
          </h1>
          <p className={s.sub}>That page is not in the picture.</p>
          <p style={{ marginTop: 36 }}>
            <Link href="/" className={`${s.pill} ${s.pillLarge}`}>
              <span className={`${s.mono} ${s.gold}`} aria-hidden="true">
                ←
              </span>
              Back to the start
            </Link>
          </p>
        </div>
      </section>
    </InnerShell>
  )
}
