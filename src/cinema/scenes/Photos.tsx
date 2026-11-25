import Link from 'next/link'
import { Scene, Sub } from '../ui'
import s from '../cinema.module.css'

export type Photo = { ratio: string; image: string | null; alt?: string }

const PLATES = [s.m1, s.m2, s.m3]

/** Scene 08: a grid of photos. Hover, focus or tap one to download it. */
export function Photos({ photos, allHref }: { photos: Photo[]; allHref?: string | null }) {
  return (
    <Scene n={8} name="Photoshoots">
      <div className={`${s.stage} ${s.photoStage}`}>
        <div className={s.photoHead}>
          <h2 id="s08-h" className={`${s.h2} ${s.reveal}`}>
            Photoshoots
          </h2>
          {allHref && (
            <Link href={allHref} className={`${s.uline} ${s.mono}`}>
              View all →
            </Link>
          )}
        </div>
        <ul className={`${s.shots} ${s.reveal}`}>
          {photos.map((p, k) => (
            <li key={k} className={s.shot} tabIndex={p.image ? undefined : 0}>
              {p.image ? <img className={`${s.cover} ${s.shotImg}`} src={p.image} alt={p.alt ?? ''} loading="lazy" /> : <div className={`${s.fill} ${s.shotImg} ${PLATES[k % 3]}`} />}
              <a className={`${s.pill} ${s.dl}`} href={p.image ?? undefined} download={p.image ? '' : undefined} aria-disabled={p.image ? undefined : true} aria-label={`Download photo ${k + 1}`}>
                <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M8 2v8M4.5 6.5 8 10l3.5-3.5M2.5 13.5h11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Download
              </a>
            </li>
          ))}
        </ul>
        <Sub className={s.caption}>Hover or tap a photo to download it.</Sub>
      </div>
    </Scene>
  )
}
