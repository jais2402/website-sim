import { Sub } from './ui'
import s from './cinema.module.css'

type Props = {
  title: string
  /** Small mono line above the title, e.g. "Filmography · 1995–2026". */
  kicker?: string
  lede?: string
  /** Full-bleed still behind the title. */
  image?: string | null
  /** CSS object-position for the still, e.g. "50% 20%". */
  imagePosition?: string
}

/** Opening block of an inner page: a short full-bleed still with the page title over it. */
export function PageTitle({ title, kicker, lede, image, imagePosition }: Props) {
  return (
    <section className={s.pageTitle} aria-labelledby="page-title" style={imagePosition ? { ['--pos' as string]: imagePosition } : undefined}>
      {image && <img src={image} alt="" fetchPriority="high" className={s.kb} />}
      <div className={s.pageTitleShade} aria-hidden="true" />
      <div className={s.grain} />
      <div className={s.pageTitleBody}>
        {kicker && <p className={`${s.mono} ${s.gold}`}>{kicker}</p>}
        <h1 id="page-title">{title}</h1>
        {lede && <Sub>{lede}</Sub>}
      </div>
    </section>
  )
}
