'use client'

import type { ReactNode } from 'react'
import { useReducedMotion } from '@/lib/motion'

/**
 * Orders the top of the homepage. Normally the header follows the hero and
 * appears once the title sequence is over; with reduced motion there is no
 * sequence, so the header comes first and is visible from the start.
 */
export function HomeTop({ hero, header }: { hero: ReactNode; header: ReactNode }) {
  const reduced = useReducedMotion()
  return reduced ? (
    <>
      {header}
      {hero}
    </>
  ) : (
    <>
      {hero}
      {header}
    </>
  )
}
