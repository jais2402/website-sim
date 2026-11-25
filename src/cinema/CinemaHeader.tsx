'use client'

import Link from 'next/link'
import { useState } from 'react'
import s from './cinema.module.css'

type Props = { brand: string; links: { label: string; href: string }[] }

/**
 * Site header for the homepage. It sits in the page flow straight after the
 * hero, then sticks to the top of the viewport once you scroll past it.
 */
export function CinemaHeader({ brand, links }: Props) {
  const [open, setOpen] = useState(false)
  return (
    <header className={s.header}>
      <nav aria-label="Main" className={s.hdrNav}>
        <a href="#s01" className={s.hdrBrand}>
          {brand.toUpperCase()}
        </a>
        <button type="button" className={`${s.hdrMenu} ${s.mono}`} aria-expanded={open} aria-controls="cinema-menu" onClick={() => setOpen((o) => !o)}>
          {open ? 'Close' : 'Menu'}
        </button>
        <ul id="cinema-menu" className={s.hdrLinks} data-open={open || undefined}>
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={s.mono} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
