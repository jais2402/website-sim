import site from '@content/site.json'
import type { ReactNode } from 'react'
import { CinemaHeader } from './CinemaHeader'
import { Credits } from './scenes/Credits'
import s from './cinema.module.css'

/** Shell for every page except the homepage: the homepage's header, ground, type and credits footer. */
export function InnerShell({ children }: { children: ReactNode }) {
  return (
    <div className={s.page}>
      <CinemaHeader brand={site.name} links={site.nav} brandHref="/" />
      <main id="main">{children}</main>
      <Credits email={site.email} line="Press · Brands · Professional enquiries" social={site.social} year={new Date().getFullYear()} links={site.nav} />
    </div>
  )
}
