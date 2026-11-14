'use client'

import { useState } from 'react'
import { Container, SectionHeading } from '@/components/ui'
import s from './SocialWall.module.css'

export type SocialPost = {
  /** 'instagram' | 'x' */
  platform: string
  handle: string
  /** Profile the handle links to. */
  profile: string
  /** Permalink of the post. */
  url: string
  when: string
  text: string
  /** Image width / height as a CSS aspect-ratio, e.g. "4 / 5". Instagram posts default to square. */
  ratio?: string
  /** `null` renders the stand-in (Instagram) or no image (X). */
  image: string | null
}

export type SocialProfile = {
  platform: string
  handle: string
  url: string
  /** Button word: "Follow" or "Subscribe". */
  cta: string
}

export type SocialWallData = {
  heading: string
  /** Already fetched and cached by the page. This component never calls a network or loads a widget. */
  posts: SocialPost[]
  follow: {
    heading: string
    note?: string
    footnote?: string
    profiles: SocialProfile[]
  }
}

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'x', label: 'X' },
] as const

type FilterId = (typeof FILTERS)[number]['id']

const PLATFORM_NAME: Record<string, string> = { instagram: 'Instagram', x: 'X' }

const external = { target: '_blank', rel: 'noopener noreferrer' } as const

export function SocialWall({ data }: { data: SocialWallData }) {
  const [filter, setFilter] = useState<FilterId>('all')
  const tabs = FILTERS.filter((f) => f.id === 'all' || data.posts.some((p) => p.platform === f.id))
  const posts = filter === 'all' ? data.posts : data.posts.filter((p) => p.platform === filter)

  return (
    <section id="social" aria-labelledby="sw-h" className={s.section}>
      <Container>
        <div className={s.head}>
          <SectionHeading id="sw-h">{data.heading}</SectionHeading>
          <div role="group" aria-label="Filter" className={s.filters}>
            {tabs.map((t) => (
              <button key={t.id} type="button" className={s.filter} aria-pressed={t.id === filter} onClick={() => setFilter(t.id)}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className={s.wall}>
          {posts.map((p, i) => {
            const insta = p.platform === 'instagram'
            const name = PLATFORM_NAME[p.platform] ?? p.platform
            return (
              <article key={`${filter}-${i}`} className={s.post}>
                {p.image ? (
                  <img className={s.image} src={p.image} alt="" loading="lazy" decoding="async" style={{ aspectRatio: p.ratio ?? '1 / 1' }} />
                ) : insta ? (
                  <div className={`still ${s.image}`} style={{ aspectRatio: p.ratio ?? '1 / 1' }} />
                ) : null}
                <div className={s.postBody}>
                  <div className={s.meta}>
                    <span className={s.who}>
                      {insta ? (
                        <svg width="14" height="14" viewBox="0 0 16 16" role="img" aria-label="Instagram">
                          <rect x="1.5" y="1.5" width="13" height="13" rx="4" fill="none" stroke="currentColor" strokeWidth="1.2" />
                          <circle cx="8" cy="8" r="3" fill="none" stroke="currentColor" strokeWidth="1.2" />
                        </svg>
                      ) : (
                        <span className={s.xMark}>{name}</span>
                      )}
                      <a href={p.profile} {...external} className={s.handle}>
                        {p.handle}
                      </a>
                    </span>
                    <span>{p.when}</span>
                  </div>
                  <p className={insta ? s.caption : s.tweet}>{p.text}</p>
                  <a href={p.url} {...external} className={s.view} aria-label={`View post on ${name}`}>
                    View post →
                  </a>
                </div>
              </article>
            )
          })}
        </div>

        <div className={s.follow}>
          <div className={s.followHead}>
            <h3 className={s.followHeading}>{data.follow.heading}</h3>
            {data.follow.note ? <span className={s.followNote}>{data.follow.note}</span> : null}
          </div>
          <div className={s.profiles}>
            {data.follow.profiles.map((pr) => (
              <a
                key={pr.url}
                href={pr.url}
                {...external}
                className={s.profile}
                data-platform={pr.platform.toLowerCase()}
              >
                <span className={s.ring} aria-hidden="true">
                  <span className={s.avatar}>S</span>
                </span>
                <span className={s.profileText}>
                  <span className={s.platform}>{pr.platform}</span>
                  <span className={s.profileHandle}>{pr.handle}</span>
                </span>
                <span className={s.profileCta}>{pr.cta}</span>
              </a>
            ))}
          </div>
          {data.follow.footnote ? <div className={s.footnote}>{data.follow.footnote}</div> : null}
        </div>
      </Container>
    </section>
  )
}
