'use client'

import { useState } from 'react'
import s from './YouTubeEmbed.module.css'

type Props = {
  id: string
  title: string
  /**
   * preview: muted, looping, no controls, cropped to fill the frame, and not
   * interactive (browsers only autoplay muted video).
   * play: the normal player with sound and controls, started by the visitor.
   */
  mode: 'preview' | 'play'
}

const BASE = 'https://www.youtube-nocookie.com/embed/'

/** Privacy-enhanced YouTube player that fills its positioned parent. */
export function YouTubeEmbed({ id, title, mode }: Props) {
  const [ready, setReady] = useState(false)
  const params =
    mode === 'preview'
      ? `autoplay=1&mute=1&controls=0&loop=1&playlist=${id}&playsinline=1&rel=0&modestbranding=1&disablekb=1&iv_load_policy=3`
      : 'autoplay=1&controls=1&playsinline=1&rel=0&modestbranding=1'
  return (
    <div className={mode === 'preview' ? s.preview : s.player} data-ready={ready || undefined}>
      <iframe
        src={`${BASE}${id}?${params}`}
        title={mode === 'preview' ? `${title} (muted preview)` : title}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        tabIndex={mode === 'preview' ? -1 : undefined}
        aria-hidden={mode === 'preview' || undefined}
        onLoad={() => setReady(true)}
      />
    </div>
  )
}
