import type { ReactNode } from 'react'
import { Rail } from './ui'
import s from './cinema.module.css'

/** Page shell for the "WebGL Cinema" homepage: black ground, scene rail, then the scenes in order. */
export function CinemaHome({ scenes, children }: { scenes: string[]; children: ReactNode }) {
  return (
    <div className={s.page}>
      <Rail scenes={scenes} />
      <main id="main">{children}</main>
    </div>
  )
}
