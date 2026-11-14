import Link from 'next/link'
import type { ReactNode } from 'react'
import s from './ui.module.css'

/** Small tracked uppercase link with a gold underline ("Full filmography", "View all →"). */
export function TextLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  const cls = [s.textLink, className].filter(Boolean).join(' ')
  return /^(https?:|mailto:)/.test(href) ? (
    <a href={href} className={cls}>
      {children}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {children}
    </Link>
  )
}
