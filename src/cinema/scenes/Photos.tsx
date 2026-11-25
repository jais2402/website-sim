'use client'

import Link from 'next/link'
import { useRef, useState, type KeyboardEvent } from 'react'
import { Scene } from '../ui'
import s from '../cinema.module.css'

export type Photo = { ratio: string; image: string | null; alt?: string; message?: string | null }

const PLATES = [s.m1, s.m2, s.m3]

/**
 * Mosaic shape for each position, repeating every 12 photos. Two blocks that
 * each fill 4 columns × 3 rows exactly:
 *   A: big 2×2 · tall · small · small · wide 2×1 · small · small   (7 photos)
 *   B: tall · big 2×2 · tall · wide · wide                         (5 photos)
 */
const SHAPES = ['big', 'tall', '', '', 'wide', '', '', 'tall', 'big', 'tall', 'wide', 'wide'] as const
const SHAPE_CLASS: Record<string, string | undefined> = { big: s.shotBig, tall: s.shotTall, wide: s.shotWide }

function DownloadIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 2v8M4.5 6.5 8 10l3.5-3.5M2.5 13.5h11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** Scene 08: a mosaic of photos. Hover shows the set; click opens the photo full screen with download. */
export function Photos({ photos, allHref }: { photos: Photo[]; allHref?: string | null }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [open, setOpen] = useState(0)
  const viewable = photos.filter((p) => p.image)
  const current = viewable[open]

  const show = (photo: Photo) => {
    setOpen(Math.max(0, viewable.indexOf(photo)))
    dialog.current?.showModal()
  }
  const step = (d: number) => setOpen((i) => (i + d + viewable.length) % viewable.length)
  const onKey = (e: KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === 'ArrowRight') step(1)
    if (e.key === 'ArrowLeft') step(-1)
  }

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
            <li key={p.image ?? k} className={[s.shot, SHAPE_CLASS[SHAPES[k % 12]]].filter(Boolean).join(' ')}>
              {p.image ? (
                <button type="button" className={s.shotOpen} onClick={() => show(p)} aria-label={`View full screen${p.alt ? `: ${p.alt}` : ''}`}>
                  <img className={`${s.cover} ${s.shotImg}`} src={p.image} alt="" loading="lazy" />
                  <span className={s.shotCaption} aria-hidden="true">
                    {p.message && <span className={`${s.mono} ${s.gold}`}>{p.message}</span>}
                    <span className={s.shotView}>View</span>
                  </span>
                </button>
              ) : (
                <div className={`${s.fill} ${s.shotImg} ${PLATES[k % 3]}`} />
              )}
            </li>
          ))}
        </ul>
      </div>

      <dialog ref={dialog} className={s.lightbox} aria-label="Photo viewer" onKeyDown={onKey} onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}>
        {current && (
          <>
            <img key={current.image} className={s.lightboxImg} src={current.image!} alt={current.alt ?? ''} />
            <div className={s.lightboxBar}>
              <span className={`${s.mono} ${s.gold}`}>
                {current.message ?? 'Photo'} · {open + 1} / {viewable.length}
              </span>
              <span className={s.lightboxActions}>
                <a className={s.pill} href={current.image!} download>
                  <DownloadIcon />
                  Download
                </a>
                <button type="button" className={s.round} aria-label="Previous photo" onClick={() => step(-1)}>
                  <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button type="button" className={`${s.round} ${s.roundSolid}`} aria-label="Next photo" onClick={() => step(1)}>
                  <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button type="button" className={s.round} aria-label="Close" onClick={() => dialog.current?.close()}>
                  <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </button>
              </span>
            </div>
          </>
        )}
      </dialog>
    </Scene>
  )
}
