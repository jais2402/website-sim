import s from '../../cinema.module.css'
import { Block } from './Block'
import c from './press.module.css'

export type Brand = { name: string; note: string; year: string | null }

/** Brand work as a credits roll: name in Cinzel, the note and year (where known) beneath. */
export function BrandList({ brands }: { brands: Brand[] }) {
  return (
    <Block id="brands" slate="Brands · Take 1" kicker={`${brands.length} brands`} heading="Brands">
      <ul className={c.brands}>
        {brands.map((b) => (
          <li key={b.name} className={c.brand}>
            <span className={c.brandName}>{b.name}</span>
            {(b.note || b.year) && (
              <span className={c.brandMeta}>
                {b.year && <span className={`${s.mono} ${s.gold}`}>{b.year}</span>}
                {b.note && <span>{b.note}</span>}
              </span>
            )}
          </li>
        ))}
      </ul>
    </Block>
  )
}
