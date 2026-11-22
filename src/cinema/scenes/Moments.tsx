'use client'

import { Scene, magnetic } from '../ui'
import s from '../cinema.module.css'

export type Post = { platform: string; handle: string; url: string; text: string; image: string | null }
export type Profile = { platform: string; handle: string; url: string; cta: string }

const PLATES = [s.m3, s.m2, s.m1, s.m3]

/** Scene 11: four posts split the screen and widen on hover or focus; follow links sit below. */
export function Moments({ posts, profiles }: { posts: Post[]; profiles: Profile[] }) {
  return (
    <Scene n={11} name="Moments">
      <div className={s.stage}>
        <div className={`${s.fill} ${s.split}`}>
          {posts.map((p, k) => {
            const isX = p.platform.toLowerCase() === 'x'
            return (
              <a key={k} href={p.url} target="_blank" rel="noopener">
                {p.image ? <img className={`${s.cover} ${s.kb}`} src={p.image} alt="" loading="lazy" /> : <span className={`${s.plate} ${s.kb} ${PLATES[k % 4]}`} />}
                <span className={`${s.fill} ${s.postShade}`} aria-hidden="true" />
                {isX && <span className={s.postText}>{p.text}</span>}
                <span className={`${s.mono} ${s.postHandle}`}>
                  <span className="sr-only">{isX ? 'Post on X by ' : 'Instagram post by '}</span>
                  {p.handle}
                </span>
              </a>
            )
          })}
        </div>
        <div className={s.grain} />
        <h2 id="s11-h" className={`${s.h2} ${s.momentsHeading}`}>
          Moments
        </h2>
        <div className={s.follow}>
          {profiles.map((p) => (
            <a key={p.platform} href={p.url} target="_blank" rel="noopener" className={`${s.pill} ${s.mag}`} {...magnetic}>
              <span className={`${s.mono} ${s.gold}`}>{p.platform}</span>
              {p.cta}
            </a>
          ))}
        </div>
      </div>
    </Scene>
  )
}
