import type { ReactNode } from 'react'
import { Cursor, SmoothScroll } from '../motion'

export type NavLink = { label: string; href: string }

type Props = {
  brand: ReactNode
  links: NavLink[]
  children: ReactNode
  /** Rendered after <main>, typically a CtaLayout. */
  footer?: ReactNode
}

/** Page shell: smooth scrolling, custom cursor, fixed nav, main and footer slots. */
export function PageLayout({ brand, links, children, footer }: Props) {
  return (
    <SmoothScroll>
      <Cursor />
      <header className="nav container">
        <a className="nav__brand" href="#top">
          {brand}
        </a>
        <nav className="nav__links" aria-label="Primary">
          {links.map((l) => (
            <a href={l.href} key={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
      </header>
      <main id="top">{children}</main>
      {footer}
    </SmoothScroll>
  )
}
