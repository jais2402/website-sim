import { Wordmark } from '@/components/ui'
import s from './SiteFooter.module.css'

type Props = { email: string; social: { label: string; href: string }[]; year: number }

/** Typographic close: bilingual mark, email and handles. */
export function SiteFooter({ email, social, year }: Props) {
  return (
    <footer className={s.footer}>
      <div className={s.inner}>
        <Wordmark size={30} />
        <ul className={s.links}>
          <li>
            <a href={`mailto:${email}`}>{email}</a>
          </li>
          {social.map((x) => (
            <li key={x.href}>
              <a href={x.href} rel="noopener">
                {x.label}
              </a>
            </li>
          ))}
        </ul>
        <p className={s.legal}>© {year} Simran. All rights reserved.</p>
      </div>
    </footer>
  )
}
