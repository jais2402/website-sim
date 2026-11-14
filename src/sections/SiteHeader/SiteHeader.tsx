'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import s from './SiteHeader.module.css'

export type NavItem = { label: string; href: string }

type Props = {
  nav: NavItem[]
  /** The Credit Crawl band, rendered under the nav. */
  crawl?: ReactNode
  /**
   * Home only: stay invisible until the header first reaches the top of the
   * viewport (the hero has finished), then fade and slide in.
   */
  revealOnArrival?: boolean
}

/** Sticky header: five nav words, hides on scroll down, returns on scroll up. */
export function SiteHeader({ nav, crawl, revealOnArrival = false }: Props) {
  const ref = useRef<HTMLElement>(null)
  const pathname = usePathname()
  const [revealed, setRevealed] = useState(!revealOnArrival)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let last = window.scrollY
    // Where the header sits in the page before it sticks (0 on inner pages).
    let origin = 0
    const onScroll = () => {
      const el = ref.current
      if (!el) return
      const y = window.scrollY
      const stuck = el.getBoundingClientRect().top <= 0.5
      if (!stuck) origin = el.offsetTop
      // Arrival counts from a little earlier so the header is fading in as it lands.
      if (el.getBoundingClientRect().top <= window.innerHeight * 0.35) setRevealed(true)
      // Only hide once it is stuck and the visitor is clearly heading down the page.
      if (Math.abs(y - last) > 6) {
        setHidden(stuck && y > last && y > origin + 200)
        last = y
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  const cls = [s.header, revealed ? s.revealed : s.waiting, hidden && !open ? s.hidden : ''].join(' ')

  return (
    <header
      ref={ref}
      className={cls}
      // Keyboard users must never tab into an invisible header.
      onFocus={() => {
        setRevealed(true)
        setHidden(false)
      }}
    >
      <nav aria-label="Main" className={s.nav}>
        <Link href="/" className={s.brand}>
          SIMRAN
        </Link>
        <button type="button" className={s.menuButton} aria-expanded={open} aria-controls="main-menu" onClick={() => setOpen((o) => !o)}>
          {open ? 'Close' : 'Menu'}
        </button>
        <ul id="main-menu" className={[s.links, open ? s.open : ''].join(' ')}>
          {nav.map((item) => (
            <li key={item.href}>
              <Link href={item.href} aria-current={pathname === item.href ? 'page' : undefined}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {crawl}
    </header>
  )
}
