import type { ReactNode } from 'react'
import s from './ui.module.css'

/** 64px serif section title. No numbered eyebrows (HANDOVER.md §2). */
export function SectionHeading({ id, children, as: Tag = 'h2', className }: { id?: string; children: ReactNode; as?: 'h1' | 'h2'; className?: string }) {
  return (
    <Tag id={id} className={[s.heading, className].filter(Boolean).join(' ')}>
      {children}
    </Tag>
  )
}
