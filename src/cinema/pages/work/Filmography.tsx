'use client'

import { useEffect, useMemo, useState } from 'react'
import { Scene } from '../../ui'
import c from '../../cinema.module.css'
import s from './work.module.css'

export type Film = { slug: string; year: number; title: string; role: string | null; language: string }

const decadeOf = (year: number) => `${Math.floor(year / 10) * 10}s`

/**
 * The complete filmography in the cinema look: language and decade filters,
 * films grouped by year, newest first. The first row of each film carries
 * `id={slug}`, so the posters in "The films" can link to /work#slug.
 */
export function Filmography({ films, languages, n }: { films: Film[]; languages: string[]; n: number }) {
  const [language, setLanguage] = useState('All')
  const [decade, setDecade] = useState('All')
  const decades = useMemo(() => [...new Set(films.map((f) => decadeOf(f.year)))].sort().reverse(), [films])
  const shown = films.filter((f) => (language === 'All' || f.language === language) && (decade === 'All' || decadeOf(f.year) === decade))
  const years = [...new Set(shown.map((f) => f.year))].sort((a, b) => b - a)
  const id = `s${String(n).padStart(2, '0')}-h`

  // The film a poster link (/work#slug) landed on. Next.js links move with pushState, which
  // neither fires `hashchange` nor updates CSS :target, so the page watches the links itself.
  const [target, setTarget] = useState<string | null>(null)
  useEffect(() => {
    const land = (slug: string) => {
      if (!films.some((f) => f.slug === slug)) return
      setTarget(slug)
      // The filters hide that film: clear them so the row is there to land on.
      if (!document.getElementById(slug)) {
        setLanguage('All')
        setDecade('All')
        setTimeout(() => document.getElementById(slug)?.scrollIntoView(), 0)
      }
    }
    const fromHash = () => land(decodeURIComponent(window.location.hash.slice(1)))
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a')
      if (a && a.hash && a.pathname === window.location.pathname) land(decodeURIComponent(a.hash.slice(1)))
    }
    fromHash()
    const late = setTimeout(fromHash, 150) // a client-side arrival can set the URL after mount
    window.addEventListener('hashchange', fromHash)
    window.addEventListener('popstate', fromHash)
    document.addEventListener('click', onClick, true)
    return () => {
      clearTimeout(late)
      window.removeEventListener('hashchange', fromHash)
      window.removeEventListener('popstate', fromHash)
      document.removeEventListener('click', onClick, true)
    }
  }, [films])

  const chips = (label: string, options: string[], value: string, set: (v: string) => void) => (
    <div role="group" aria-label={label} className={s.chips}>
      <span className={`${c.mono} ${c.faint} ${s.chipLabel}`} aria-hidden="true">
        {label}
      </span>
      {['All', ...options].map((o) => (
        <button key={o} type="button" className={`${c.mono} ${s.chip}`} aria-pressed={value === o} onClick={() => set(o)}>
          {o}
        </button>
      ))}
    </div>
  )

  const seen = new Set<string>()

  return (
    <Scene n={n} name="Filmography" take={`${films.length} films`} className={s.listScene}>
      <div className={s.inner}>
        <header className={s.head}>
          <h2 id={id} className={`${c.h2} ${c.reveal}`}>
            Filmography
          </h2>
          <p className={`${c.mono} ${c.gold}`} aria-live="polite">
            {shown.length} {shown.length === 1 ? 'film' : 'films'}
          </p>
        </header>

        <div className={s.filters}>
          {chips('Language', languages, language, setLanguage)}
          {chips('Decade', decades, decade, setDecade)}
        </div>

        {years.length === 0 ? (
          <p className={`${c.sub} ${s.empty}`}>No films match these filters.</p>
        ) : (
          <ol className={s.years}>
            {years.map((year) => (
              <li key={year} className={s.yearRow}>
                <h3 className={s.year}>{year}</h3>
                <ul className={s.rows}>
                  {shown
                    .filter((f) => f.year === year)
                    .map((f) => {
                      // The same film can be listed once per language; only the first row gets the anchor.
                      const anchor = seen.has(f.slug) ? undefined : f.slug
                      seen.add(f.slug)
                      return (
                        <li key={`${f.slug}-${f.language}`} id={anchor} className={s.row} data-target={(anchor && anchor === target) || undefined}>
                          <span className={s.title}>{f.title}</span>
                          <span className={s.role}>{f.role ? `as ${f.role}` : ''}</span>
                          <span className={`${c.mono} ${s.lang}`}>{f.language}</span>
                        </li>
                      )
                    })}
                </ul>
              </li>
            ))}
          </ol>
        )}
      </div>
    </Scene>
  )
}
