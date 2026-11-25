import awards from '@content/awards.json'
import buzz from '@content/buzz.json'
import connect from '@content/connect.json'
import crawl from '@content/crawl.json'
import fanNotes from '@content/fan-notes.json'
import interviews from '@content/interviews.json'
import memoryLane from '@content/memory-lane.json'
import photoshoots from '@content/photoshoots.json'
import reelWall from '@content/reel-wall.json'
import showreel from '@content/showreel.json'
import site from '@content/site.json'
import social from '@content/social.json'
import upcoming from '@content/upcoming.json'
import who from '@content/who.json'
import { CinemaHeader } from '@/cinema/CinemaHeader'
import { CinemaHome } from '@/cinema/CinemaHome'
import { Credits } from '@/cinema/scenes/Credits'
import { Films } from '@/cinema/scenes/Films'
import { Honours } from '@/cinema/scenes/Honours'
import { Memory } from '@/cinema/scenes/Memory'
import { Moments } from '@/cinema/scenes/Moments'
import { NowPlaying, type RollData } from '@/cinema/scenes/NowPlaying'
import { OnSet, type OnSetFilm } from '@/cinema/scenes/OnSet'
import { Opening } from '@/cinema/scenes/Opening'
import { Photos } from '@/cinema/scenes/Photos'
import { Reel } from '@/cinema/scenes/Reel'
import { Who } from '@/cinema/scenes/Who'
import { Words, type Read } from '@/cinema/scenes/Words'

// Release states (Now playing, On set) are date-driven, so refresh hourly.
export const revalidate = 3600

// Scene order follows the design: "V9 · WebGL Cinema".

// Play the film leader once per browser session; on return visits go straight to the title.
const SKIP_LEADER = `try{if(sessionStorage.getItem('leader'))document.documentElement.classList.add('seen');else sessionStorage.setItem('leader','1')}catch(e){}`

/** "In her words": the latest note, then one each of the first video, interview and article. */
function reads(): Read[] {
  const note = fanNotes.notes[0]
  const pick = (type: string) => interviews.items.find((i) => i.type === type)
  const pieces = [pick('Video'), pick('Interview'), pick('Article')].filter((i) => i !== undefined)
  return [
    { type: 'Note to fans', short: note.greet, title: note.greet, body: `${note.body}\n\n— ${fanNotes.signature.name}`, source: note.date },
    ...pieces.map((i) => ({
      type: i.type === 'Video' ? 'Video interview' : i.type,
      short: i.title,
      title: i.title,
      body: i.quote ?? ('dek' in i ? (i.dek ?? '') : ''),
      source: i.source,
      url: i.url,
    })),
  ]
}

export default function Home() {
  const now = new Date()
  return (
    <CinemaHome>
      <script dangerouslySetInnerHTML={{ __html: SKIP_LEADER }} />
      <Opening name={site.name} tagline={site.tagline} reelHref="#s05" image={site.heroImage} imageAlt={site.heroImageAlt} />
      <CinemaHeader brand={site.name} links={site.nav} />
      <NowPlaying data={crawl as RollData} now={now} />
      <Films films={reelWall.films} allHref="/work" />
      <OnSet films={upcoming.films as OnSetFilm[]} news={buzz.items.slice(0, 3).map((n) => ({ category: n.category, title: n.title, meta: n.meta, href: '/press#buzz' }))} updatesHref="/work#upcoming" now={now} />
      <Reel clips={showreel.clips} />
      <Who data={who} bioHref="/about" />
      <Memory films={memoryLane.films} startFilm={memoryLane.startFilm} />
      <Photos photos={photoshoots.photos.slice(0, 8)} allHref="/photoshoots" />
      <Honours awards={awards.awards} allHref="/press#honours-list" />
      <Words reads={reads()} />
      <Moments posts={social.posts.slice(0, 4)} profiles={social.follow.profiles} />
      <Credits email={site.email} line="Press · Brands · Professional enquiries" social={site.social} year={now.getFullYear()} links={site.nav} />
    </CinemaHome>
  )
}
