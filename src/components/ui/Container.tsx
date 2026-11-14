import type { CSSProperties, ReactNode } from 'react'
import s from './ui.module.css'

export function Container({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div className={[s.container, className].filter(Boolean).join(' ')} style={style}>
      {children}
    </div>
  )
}
