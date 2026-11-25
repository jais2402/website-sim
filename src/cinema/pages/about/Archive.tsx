import { Timecode } from '../../ui'
import s from '../../cinema.module.css'
import a from './Archive.module.css'

export type ArchivePhoto = { caption: string; image: string | null }

/** Archive photos from Memory lane, laid out like the homepage Photoshoots grid. */
export function Archive({ id, photos }: { id: string; photos: ArchivePhoto[] }) {
  const shown = photos.filter((p): p is ArchivePhoto & { image: string } => Boolean(p.image))
  if (shown.length === 0) return null
  return (
    <section id={id} aria-labelledby={`${id}-h`} className={`${s.scene} ${a.archive}`}>
      <p className={`${s.mono} ${s.slate}`} aria-hidden="true">
        Memory lane · Archive
      </p>
      <Timecode />
      <div className={`${s.stage} ${s.photoStage}`}>
        <div className={s.photoHead}>
          <h2 id={`${id}-h`} className={`${s.h2} ${s.reveal}`}>
            From the archive
          </h2>
          <p className={`${s.mono} ${s.faint}`}>{shown.length} photographs</p>
        </div>
        <ul className={`${s.shots} ${a.shots} ${s.reveal}`}>
          {shown.map((p) => (
            <li key={p.image} className={s.shot}>
              <figure className={a.figure}>
                <img className={s.cover} src={p.image} alt="" loading="lazy" />
                <figcaption className={`${s.mono} ${a.caption}`}>{p.caption}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
