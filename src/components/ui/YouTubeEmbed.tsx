'use client'

import { useEffect, useRef, useState } from 'react'
import s from './YouTubeEmbed.module.css'

type Props = {
  id: string
  title: string
  /**
   * preview: muted, looping, no controls, cropped to fill the frame, and not
   * interactive (browsers only autoplay muted video). Stays invisible until the
   * video is actually playing, so a blocked or unavailable video never covers
   * the picture underneath.
   * play: the normal player with sound and controls, started by the visitor.
   */
  mode: 'preview' | 'play'
}

const BASE = 'https://www.youtube-nocookie.com/embed/'
const PLAYING = 1

/** Privacy-enhanced YouTube player that fills its positioned parent. */
export function YouTubeEmbed({ id, title, mode }: Props) {
  const frame = useRef<HTMLIFrameElement>(null)
  const [ready, setReady] = useState(mode === 'play')

  // Previews report their state through YouTube's postMessage API; show only once playing.
  useEffect(() => {
    if (mode !== 'preview') return
    const onMessage = (e: MessageEvent) => {
      if (e.source !== frame.current?.contentWindow) return
      let data: { event?: string; info?: unknown } | null = null
      try {
        data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data
      } catch {
        return
      }
      const info = data?.info as { playerState?: number } | number | undefined
      const state = typeof info === 'number' ? (data?.event === 'onStateChange' ? info : undefined) : info?.playerState
      if (state === PLAYING) setReady(true)
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [mode])

  const listen = () => {
    if (mode === 'preview') frame.current?.contentWindow?.postMessage(JSON.stringify({ event: 'listening', id, channel: 'widget' }), '*')
  }

  const params =
    mode === 'preview'
      ? `autoplay=1&mute=1&controls=0&loop=1&playlist=${id}&playsinline=1&rel=0&modestbranding=1&disablekb=1&iv_load_policy=3&enablejsapi=1`
      : 'autoplay=1&controls=1&playsinline=1&rel=0&modestbranding=1'
  return (
    <div className={mode === 'preview' ? s.preview : s.player} data-ready={ready || undefined}>
      <iframe
        ref={frame}
        src={`${BASE}${id}?${params}`}
        title={mode === 'preview' ? `${title} (muted preview)` : title}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        tabIndex={mode === 'preview' ? -1 : undefined}
        aria-hidden={mode === 'preview' || undefined}
        onLoad={listen}
      />
    </div>
  )
}
