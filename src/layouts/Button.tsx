import type { ReactNode } from 'react'
import { Magnetic } from '../motion'

/** Pill link that leans toward the pointer. */
export function Button({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Magnetic>
      <a className="button" href={href}>
        {children}
      </a>
    </Magnetic>
  )
}
