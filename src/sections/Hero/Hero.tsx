'use client'

import { useRef, useState } from 'react'
import { Wordmark } from '@/components/ui'
import { gsap, useGSAP, useReducedMotion } from '@/lib/motion'
import s from './Hero.module.css'

export type HeroData = {
  /** Official autograph as an SVG path file. Blocking client asset. */
  signature: string | null
  poster: string | null
  posterMobile: string | null
  /** 8–15s muted loop, 16:9. */
  video: string | null
  /** 9:16 crop framed on the face. */
  videoMobile: string | null
  /** Sound-on cut for the "Watch reel" dialog. */
  reelVideo: string | null
}

type Props = { data: HeroData; roles: string }

/**
 * Title Sequence hero — STUB.
 *
 * The final hero zooms through the official autograph used as an SVG mask
 * (docs/handover/simran-direction.md §3). That asset has not arrived and the
 * zoom may not ship on a typeset stand-in, so this version holds the poster
 * with the typeset mark, enlarges it, and dissolves to the page ground — the simpler
 * fallback the direction allows. The scroll beats and distances are the real
 * ones, so swapping in the mask later only changes the timeline below.
 */
export function Hero({ data, roles }: Props) {
  const pin = useRef<HTMLDivElement>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const reel = useRef<HTMLVideoElement>(null)
  const reduced = useReducedMotion()
  const [failed, setFailed] = useState(false)

  useGSAP(
    () => {
      if (reduced) return
      const q = gsap.utils.selector(pin)
      // Beats as fractions of the pin: hold · signature in · zoom · handoff.
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: pin.current, start: 'top top', end: 'bottom bottom', scrub: 0.7 },
      })
      tl.to(q(`.${s.chrome}`), { autoAlpha: 0, duration: 0.1 }, 0.3)
        .to(q(`.${s.dim}`), { opacity: 0.5, duration: 0.12 }, 0.3)
        .to(q(`.${s.mark}`), { scale: 5, yPercent: -120, ease: 'power2.inOut', duration: 0.45 }, 0.42)
        .to(q(`.${s.dim}`), { opacity: 1, duration: 0.3 }, 0.57)
        .to(q(`.${s.mark}`), { autoAlpha: 0, duration: 0.13 }, 0.87)
    },
    { scope: pin, dependencies: [reduced] },
  )

  const openReel = () => {
    dialog.current?.showModal()
    void reel.current?.play()
  }
  const closeReel = () => {
    reel.current?.pause()
    dialog.current?.close()
  }

  const showVideo = data.video && !reduced && !failed

  return (
    <section aria-label="Hero" className={[s.pin, reduced ? s.still : ''].join(' ')} ref={pin}>
      <div className={s.stage}>
        <div className={[s.media, data.poster ? '' : s.standIn].join(' ')}>
          {data.poster && (
            <picture>
              {data.posterMobile && <source media="(max-width: 700px)" srcSet={data.posterMobile} />}
              <img src={data.poster} alt="" fetchPriority="high" />
            </picture>
          )}
          {showVideo && (
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={data.poster ?? undefined}
              onError={() => setFailed(true)}
              aria-hidden="true"
            >
              {data.videoMobile && <source media="(max-width: 700px)" src={data.videoMobile} type="video/mp4" />}
              <source src={data.video!} type="video/mp4" />
            </video>
          )}
        </div>
        <div className={s.dim} aria-hidden="true" />

        <h1 className={s.mark}>
          {data.signature ? <img src={data.signature} alt="Simran" /> : <Wordmark className={s.wordmark} />}
        </h1>

        <div className={s.chrome}>
          <p className={s.roles}>{roles}</p>
          {data.reelVideo ? (
            <button type="button" className={s.watch} onClick={openReel}>
              <PlayIcon />
              <span>Watch reel</span>
            </button>
          ) : (
            <a className={s.watch} href="#reel">
              <PlayIcon />
              <span>Watch reel</span>
            </a>
          )}
        </div>
      </div>

      {data.reelVideo && (
        <dialog ref={dialog} className={s.dialog} aria-label="Showreel" onClose={() => reel.current?.pause()}>
          <video ref={reel} src={data.reelVideo} controls playsInline preload="none" />
          <button type="button" className={s.close} onClick={closeReel}>
            Close
          </button>
        </dialog>
      )}
    </section>
  )
}

function PlayIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
      <path d="M2 1.5v9l8-4.5z" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  )
}
