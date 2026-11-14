import type { ButtonHTMLAttributes } from 'react'
import s from './ui.module.css'

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  direction: 'prev' | 'next'
  label: string
  /** outline: quiet. red / cream / brass: the emphasised "next" arrow for that surface. */
  tone?: 'outline' | 'red' | 'cream' | 'brass'
}

/** 52px round arrow used by every carousel on the site. */
export function ArrowButton({ direction, label, tone = 'outline', className, ...rest }: Props) {
  return (
    <button type="button" aria-label={label} className={[s.arrow, s[tone], className].filter(Boolean).join(' ')} {...rest}>
      <svg width="18" height="18" viewBox="0 0 16 16" aria-hidden="true">
        <path d={direction === 'prev' ? 'M10 3 5 8l5 5' : 'M6 3l5 5-5 5'} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}
