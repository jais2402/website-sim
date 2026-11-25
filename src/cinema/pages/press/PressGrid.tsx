import s from '../../cinema.module.css'
import { Block } from './Block'
import c from './press.module.css'

export type PressPiece = { url: string; kicker: string; source: string; title: string; dek?: string | null; image?: string | null; action: string }

const PLATES = [s.m1, s.m2, s.m3]

/** Every interview, video and article as a grid of cards. Each card is one link. */
export function PressGrid({ pieces }: { pieces: PressPiece[] }) {
  return (
    <Block id="buzz" slate="In print · Take 2" kicker={`${pieces.length} pieces`} heading="Interviews and articles">
      <ul className={c.grid}>
        {pieces.map((p, k) => {
          const external = /^https?:/.test(p.url)
          return (
            <li key={p.url}>
              <a href={p.url} className={c.card} {...(external ? { target: '_blank', rel: 'noopener' } : {})}>
                <span className={c.cardImage}>
                  {p.image ? <img src={p.image} alt="" loading="lazy" /> : <span className={`${s.fill} ${PLATES[k % 3]}`} />}
                  <span className={s.grain} aria-hidden="true" />
                </span>
                <span className={c.cardBody}>
                  <span className={`${s.mono} ${s.gold} ${c.cardKicker}`}>{p.kicker}</span>
                  <span className={c.cardTitle}>{p.title}</span>
                  {p.dek && <span className={c.cardDek}>{p.dek}</span>}
                  <span className={`${s.mono} ${c.cardSource}`}>
                    <span>{p.source}</span>
                    <span className={c.cardAction}>
                      {p.action} <span aria-hidden="true">→</span>
                      {external && <span className="sr-only"> (opens in a new tab)</span>}
                    </span>
                  </span>
                </span>
              </a>
            </li>
          )
        })}
      </ul>
    </Block>
  )
}
