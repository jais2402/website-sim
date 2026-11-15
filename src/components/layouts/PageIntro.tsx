import type { ReactNode } from 'react'
import { Container } from '@/components/ui'
import s from './layouts.module.css'

/** Opening block for an inner page: h1 and an optional lede. */
export function PageIntro({ title, lede, children }: { title: string; lede?: string; children?: ReactNode }) {
  return (
    <Container className={s.intro}>
      <h1 className={s.introTitle}>{title}</h1>
      {lede && <p className={s.introLede}>{lede}</p>}
      {children}
    </Container>
  )
}
