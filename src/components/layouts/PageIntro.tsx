import type { ReactNode } from 'react'
import { Container } from '@/components/ui'
import s from './layouts.module.css'

/** Opening block for an inner page: Tamil word, h1 and an optional lede. */
export function PageIntro({ title, tamil, lede, children }: { title: string; tamil?: string; lede?: string; children?: ReactNode }) {
  return (
    <Container className={s.intro}>
      {tamil && (
        <p lang="ta" className={s.introTa}>
          {tamil}
        </p>
      )}
      <h1 className={s.introTitle}>{title}</h1>
      {lede && <p className={s.introLede}>{lede}</p>}
      {children}
    </Container>
  )
}
