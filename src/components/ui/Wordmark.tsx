import s from './ui.module.css'

/** Typeset mark. A stand-in wherever the official autograph will go. */
export function Wordmark({ size = 30, className }: { size?: number; className?: string }) {
  return (
    <span className={[s.wordmark, className].filter(Boolean).join(' ')} style={{ fontSize: size }}>
      Simran
    </span>
  )
}
