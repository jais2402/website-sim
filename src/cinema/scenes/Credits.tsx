import { ShaderCanvas } from '../ShaderCanvas'
import { Scene } from '../ui'
import s from '../cinema.module.css'

type Props = { email: string; line: string; social: { label: string; handle: string; href: string }[]; year: number; links: { label: string; href: string }[] }

/** Scene 12: end credits under a field of stars. This is the page's footer. */
export function Credits({ email, line, social, year, links }: Props) {
  return (
    <Scene n={12} name="Credits" className={s.creditsScene}>
      <div className={`${s.fill} ${s.glStars}`} aria-hidden="true">
        <ShaderCanvas shader="stars" />
      </div>
      <p className={`${s.mono} ${s.dim} ${s.reveal}`}>{line}</p>
      <h2 id="s12-h" className={`${s.email} ${s.reveal}`}>
        <a href={`mailto:${email}`} className={s.uline}>
          {email}
        </a>
      </h2>
      <dl className={`${s.handles} ${s.reveal}`}>
        {social.map((x) => (
          <div key={x.href} className={s.contents}>
            <dt className={s.mono}>{x.label}</dt>
            <dd>
              <a href={x.href} rel="noopener" className={s.uline}>
                {x.handle}
              </a>
            </dd>
          </div>
        ))}
      </dl>
      <nav aria-label="Site" className={`${s.siteLinks} ${s.reveal}`}>
        {links.map((l) => (
          <a key={l.href} href={l.href} className={`${s.uline} ${s.mono}`}>
            {l.label}
          </a>
        ))}
      </nav>
      <p className={`${s.fin} ${s.reveal}`}>Fin</p>
      <p className={`${s.mono} ${s.copyright}`}>© {year} Simran</p>
    </Scene>
  )
}
