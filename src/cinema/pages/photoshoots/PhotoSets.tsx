'use client'

import { useMemo, useState } from 'react'
import { Photos, type Photo } from '../../scenes/Photos'
import s from '../../cinema.module.css'
import p from './PhotoSets.module.css'

export type SetPhoto = Photo & { message: string }

/** Every photo in the homepage Photoshoots scene, with a filter by set (the `message` each photo carries). */
export function PhotoSets({ photos }: { photos: SetPhoto[] }) {
  const sets = useMemo(() => {
    const counts = new Map<string, number>()
    photos.forEach((ph) => counts.set(ph.message, (counts.get(ph.message) ?? 0) + 1))
    return [...counts].map(([name, count]) => ({ name, count }))
  }, [photos])
  const [active, setActive] = useState<string | null>(null)
  const shown = active ? photos.filter((ph) => ph.message === active) : photos

  return (
    <>
      {sets.length > 1 && (
        <div className={p.bar}>
          <div role="group" aria-label="Show photos from" className={p.chips}>
            <button type="button" className={`${s.mono} ${p.chip}`} aria-pressed={active === null} onClick={() => setActive(null)}>
              All <span className={p.count}>{photos.length}</span>
            </button>
            {sets.map((set) => (
              <button key={set.name} type="button" className={`${s.mono} ${p.chip}`} aria-pressed={active === set.name} onClick={() => setActive(set.name)}>
                {set.name} <span className={p.count}>{set.count}</span>
              </button>
            ))}
          </div>
          <p className={`${s.mono} ${p.status}`} aria-live="polite">
            {active ? `${active} · ${shown.length} of ${photos.length}` : `All ${photos.length} photos`}
          </p>
        </div>
      )}
      <Photos photos={shown} allHref={null} />
    </>
  )
}
