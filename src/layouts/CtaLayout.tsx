import type { ElementType, ReactNode } from 'react'
import { Reveal, SplitHeading } from '../motion'

type Props = {
  /** Use "footer" for the page footer, "section" for a mid-page call to action. */
  as?: ElementType
  id?: string
  title: ReactNode
  actions?: ReactNode
  note?: ReactNode
}

/** Oversized closing statement with an action and an optional small note. */
export function CtaLayout({ as: Tag = 'section', id, title, actions, note }: Props) {
  return (
    <Tag className="cta container" id={id}>
      <SplitHeading className="display">{title}</SplitHeading>
      {actions && <Reveal className="actions">{actions}</Reveal>}
      {note && <p className="cta__note">{note}</p>}
    </Tag>
  )
}
