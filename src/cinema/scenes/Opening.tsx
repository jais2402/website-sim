'use client'

import { useRef } from 'react'
import { ShaderCanvas } from '../ShaderCanvas'
import { Scene, Sub, magnetic, trackPointer } from '../ui'
import s from '../cinema.module.css'

/** Scene 01: countdown leader, letterbox opening onto projector light, and the name. */
export function Opening({ name, tagline, reelHref, image, imageAlt }: { name: string; tagline: string; reelHref: string; image?: string | null; imageAlt?: string }) {
  const pointer = useRef<[number, number]>([0.5, 0.5])
  return (
    <Scene n={1} name="Opening" className={s.opening}>
      <div className={s.fill} onPointerMove={trackPointer(pointer)}>
        <div className={`${s.fill} ${s.glHero}`}>
          {image && <img className={s.heroPhoto} src={image} alt={imageAlt ?? ''} fetchPriority="high" />}
          <ShaderCanvas shader="hero" pointer={pointer} />
        </div>
        <div className={`${s.fill} ${s.heroShade}`} aria-hidden="true" />
        <div className={`${s.lb} ${s.lbTop}`} aria-hidden="true" />
        <div className={`${s.lb} ${s.lbBottom}`} aria-hidden="true" />

        <div className={s.heroBody}>
          <h1 id="s01-h" className={s.heroName} aria-label={name}>
            {Array.from(name.toUpperCase()).map((c, i) => (
              <span key={i} className={s.word} style={{ ['--d' as string]: `${(2 + i * 0.09).toFixed(2)}s` }} aria-hidden="true">
                {c}
              </span>
            ))}
          </h1>
          <Sub className={s.heroSub}>
            <span className={s.word} style={{ ['--d' as string]: '3.4s' }}>
              {tagline}
            </span>
          </Sub>
          <span className={`${s.word} ${s.heroCta}`} style={{ ['--d' as string]: '3.7s' }}>
            <a href={reelHref} className={`${s.pill} ${s.pillLarge} ${s.mag}`} {...magnetic}>
              <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                <path d="M2.5 1.5v9l8-4.5z" fill="currentColor" />
              </svg>
              Watch the reel
            </a>
          </span>
        </div>

        <div className={s.cueTrack} aria-hidden="true">
          <span className={s.cue} />
        </div>

        <div className={s.leader} aria-hidden="true">
          <div className={s.leaderDial}>
            <div className={s.sweep} />
            <i className={s.leaderV} />
            <i className={s.leaderH} />
            {[3, 2, 1].map((n, i) => (
              <span key={n} className={s.ln} style={{ animationDelay: `${i * 0.55}s` }}>
                {n}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Scene>
  )
}
