import type { ReactNode } from 'react'
import s from './cinema.module.css'

/** Page shell for the "WebGL Cinema" homepage: black ground, then the scenes in order. */
export function CinemaHome({ children }: { children: ReactNode }) {
  return (
    <div className={s.page}>
      <main id="main">{children}</main>
    </div>
  )
}
