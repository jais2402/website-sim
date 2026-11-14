'use client'

import { useMemo, useState } from 'react'
import { Container } from '@/components/ui'
import s from './layouts.module.css'

export type Film = { slug: string; year: number; title: string; role: string | null; language: string }

type Props = { films: Film[]; languages: string[] }

const decadeOf = (year: number) => `${Math.floor(year / 10) * 10}s`

/** Complete filmography, filterable by language (Tamil first) and by decade. */
export function Filmography({ films, languages }: Props) {
  const [language, setLanguage] = useState('All')
  const [decade, setDecade] = useState('All')
  const decades = useMemo(() => [...new Set(films.map((f) => decadeOf(f.year)))].sort().reverse(), [films])
  const shown = films.filter((f) => (language === 'All' || f.language === language) && (decade === 'All' || decadeOf(f.year) === decade))

  // Group by year, newest first.
  const years = [...new Set(shown.map((f) => f.year))]
  const seen = new Set<string>()

  const chips = (label: string, options: string[], value: string, set: (v: string) => void) => (
    <div role="group" aria-label={label} className={s.chips}>
      {['All', ...options].map((o) => (
        <button key={o} type="button" className={s.chip} aria-pressed={value === o} onClick={() => set(o)}>
          {o === 'All' ? `All ${label.toLowerCase()}` : o}
        </button>
      ))}
    </div>
  )

  return (
    <Container className={s.filmography}>
      <div className={s.filters}>
        {chips('Languages', languages, language, setLanguage)}
        {chips('Decades', decades, decade, setDecade)}
      </div>
      <p className={s.count} aria-live="polite">
        {shown.length} {shown.length === 1 ? 'film' : 'films'}
      </p>
      <ol className={s.years}>
        {years.map((year) => (
          <li key={year} className={s.yearRow}>
            <h2 className={s.year}>{year}</h2>
            <ul className={s.films}>
              {shown
                .filter((f) => f.year === year)
                .map((f) => {
                  // The same film can be listed once per language; only the first gets the anchor id.
                  const id = seen.has(f.slug) ? undefined : f.slug
                  seen.add(f.slug)
                  return (
                    <li key={`${f.slug}-${f.language}`} id={id} className={s.filmRow}>
                      <span className={s.filmTitle}>{f.title}</span>
                      <span className={s.filmRole}>{f.role ?? ''}</span>
                      <span className={s.filmLang}>{f.language}</span>
                    </li>
                  )
                })}
            </ul>
          </li>
        ))}
      </ol>
    </Container>
  )
}
