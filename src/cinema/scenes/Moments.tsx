'use client'

import { Fragment } from 'react'
import { Scene, magnetic } from '../ui'
import s from '../cinema.module.css'

export type Post = { platform: string; handle: string; url: string; text: string; image: string | null; when?: string }
export type Profile = { platform: string; handle: string; url: string; cta: string }
/** Name, handle and photo shown on X post cards. */
export type XProfile = { name: string; handle: string; avatar: string | null }

const PLATES = [s.m3, s.m2, s.m1, s.m3]

/** Post text with #hashtags, @mentions and links in X's blue, as on X. Plain text, not an image. */
function PostText({ text }: { text: string }) {
  const parts = text.split(/((?:#|@)[\p{L}\p{N}_]+|https?:\/\/\S+)/u)
  return (
    <>
      {parts.map((part, i) =>
        /^(#|@|https?:)/.test(part) ? (
          <span key={i} className={s.xLink}>
            {part}
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  )
}

/** An X post set as text in the look of a post on X: photo, name, handle, logo, text, date. */
function XCard({ post, profile }: { post: Post; profile: XProfile }) {
  return (
    <span className={s.xCard}>
      <span className={s.xHead}>
        {profile.avatar ? <img className={s.xAvatar} src={profile.avatar} alt="" loading="lazy" /> : <span className={s.xAvatar} />}
        <span className={s.xWho}>
          <span className={s.xName}>{profile.name}</span>
          <span className={s.xHandle}>{profile.handle}</span>
        </span>
        <svg className={s.xLogo} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="currentColor" />
        </svg>
      </span>
      <span className={s.xText}>
        <PostText text={post.text} />
      </span>
      {post.when && <span className={s.xDate}>{post.when}</span>}
      <span className={s.xView}>View on X</span>
    </span>
  )
}

/** Scene 11: four posts split the screen and widen on hover or focus; follow links sit below. */
export function Moments({ posts, profiles, xProfile }: { posts: Post[]; profiles: Profile[]; xProfile?: XProfile }) {
  const profile: XProfile = xProfile ?? { name: 'Simran', handle: '@SimranbaggaOffc', avatar: null }
  return (
    <Scene n={11} name="Moments">
      <div className={s.stage}>
        <div className={`${s.fill} ${s.split}`}>
          {posts.map((p, k) => {
            const isX = p.platform.toLowerCase() === 'x'
            return (
              <a key={k} href={p.url} target="_blank" rel="noopener" data-x={isX || undefined}>
                {p.image ? <img className={`${s.cover} ${s.kb}`} src={p.image} alt="" loading="lazy" /> : <span className={`${s.plate} ${s.kb} ${PLATES[k % 4]}`} />}
                <span className={`${s.fill} ${s.postShade}`} aria-hidden="true" />
                {isX ? (
                  <>
                    <span className="sr-only">Post on X by {p.handle}: </span>
                    <XCard post={p} profile={profile} />
                  </>
                ) : (
                  <span className={`${s.mono} ${s.postHandle}`}>
                    <span className="sr-only">Instagram post by </span>
                    {p.handle}
                  </span>
                )}
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
