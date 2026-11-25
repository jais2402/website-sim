'use client'

import { useState } from 'react'
import { YouTubeEmbed } from '@/components/ui/YouTubeEmbed'
import { youtubeId } from '@/lib/youtube'
import { Scene, art } from '../../ui'
import c from '../../cinema.module.css'
import s from './reel.module.css'

export type Clip = {
  title: string
  film: string
  kind: string
  duration: string | null
  video: string | null
  url?: string | null
  poster: string | null
  cinema: string[]
}

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * Every clip in the reel as a numbered ledger. Pressing a row opens the player
 * in place with sound; the YouTube link opens the clip on YouTube.
 */
export function ClipList({ clips, n, heading }: { clips: Clip[]; n: number; heading: string }) {
  const [playing, setPlaying] = useState<number | null>(null)

  return (
    <Scene n={n} name={heading} take={`${clips.length} clips`} className={s.listScene}>
      <div className={s.inner}>
        <h2 id={`s${pad(n)}-h`} className={`${c.h2} ${c.reveal} ${s.heading}`}>
          {heading}
        </h2>
        <ol className={s.list}>
          {clips.map((clip, k) => {
            const yt = youtubeId(clip.url)
            const canPlay = Boolean(clip.video || yt)
            const open = playing === k && canPlay
            const label = `${clip.film}: ${clip.title}`
            const panel = `clip-${k + 1}-player`
            const body = (
              <>
                <span className={`${c.mono} ${s.num}`}>{pad(k + 1)}</span>
                <span className={s.thumb} aria-hidden="true">
                  {clip.poster ? (
                    <img src={clip.poster} alt="" loading="lazy" className={c.cover} />
                  ) : (
                    <span className={c.fill} style={{ background: art(clip.cinema[0], clip.cinema[1]) }} />
                  )}
                  <span className={s.thumbShade} />
                  {canPlay && (
                    <span className={s.playDot}>
                      <svg width="14" height="14" viewBox="0 0 12 12">
                        <path d="M3 1.5v9l7.5-4.5z" fill="currentColor" />
                      </svg>
                    </span>
                  )}
                </span>
                <span className={s.text}>
                  <span className={`${c.mono} ${c.gold} ${s.film}`}>{clip.film}</span>
                  <span className={s.title}>{clip.title}</span>
                </span>
                <span className={`${c.mono} ${s.kind}`}>
                  {clip.kind}
                  {clip.duration ? ` · ${clip.duration}` : ''}
                </span>
              </>
            )
            return (
              <li key={`${clip.film} · ${clip.title}`} className={s.item} data-open={open || undefined}>
                <div className={s.row}>
                  {canPlay ? (
                    <button
                      type="button"
                      className={s.hit}
                      aria-expanded={open}
                      aria-controls={panel}
                      aria-label={`${open ? 'Close' : 'Play'} ${label} with sound`}
                      onClick={() => setPlaying(open ? null : k)}
                    >
                      {body}
                    </button>
                  ) : (
                    <div className={s.hit}>{body}</div>
                  )}
                  {clip.url && (
                    <a href={clip.url} target="_blank" rel="noopener noreferrer" className={`${c.mono} ${c.uline} ${s.out}`} aria-label={`${label} on YouTube (opens in a new tab)`}>
                      YouTube ↗
                    </a>
                  )}
                </div>
                {canPlay && (
                  <div id={panel} className={s.player} hidden={!open}>
                    {open &&
                      (clip.video ? (
                        <video className={c.cover} src={clip.video} controls autoPlay playsInline />
                      ) : (
                        <YouTubeEmbed id={yt!} title={label} mode="play" />
                      ))}
                  </div>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </Scene>
  )
}
