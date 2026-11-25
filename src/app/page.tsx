import awards from '@content/awards.json'
import buzz from '@content/buzz.json'
import connect from '@content/connect.json'
import crawl from '@content/crawl.json'
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
import { Words } from '@/cinema/scenes/Words'
import { reads } from '@/cinema/reads'

// Release states (Now playing, On set) are date-driven, so refresh hourly.
export const revalidate = 3600

// Scene order follows the design: "V9 · WebGL Cinema".

// Play the film leader once per browser session; on return visits go straight to the title.
const SKIP_LEADER = `try{if(sessionStorage.getItem('leader'))document.documentElement.classList.add('seen');else sessionStorage.setItem('leader','1')}catch(e){}`

export default function Home() {
  const now = new Date()
  return (
    <CinemaHome>
      <script dangerouslySetInnerHTML={{ __html: SKIP_LEADER }} />
      <Opening name={site.name} tagline={site.tagline} reelHref="#s05" image={site.heroImage} imageAlt={site.heroImageAlt} />
      <CinemaHeader brand={site.name} links={site.nav} />
      <NowPlaying data={crawl as RollData} now={now} />
      <Films films={reelWall.films} allHref="/work" more={reelWall.more} />
      <OnSet films={upcoming.films as OnSetFilm[]} news={buzz.items.slice(0, 3).map((n) => ({ category: n.category, title: n.title, meta: n.meta, href: '/press#buzz' }))} updatesHref="/work#upcoming" now={now} />
      <Reel clips={showreel.clips} />
      <Who data={who} bioHref="/about" />
      <Memory films={memoryLane.films} startFilm={memoryLane.startFilm} />
      <Photos photos={photoshoots.photos.slice(0, 12)} allHref="/photoshoots" />
      <Honours awards={awards.awards} allHref="/press#awards" />
      <Words reads={reads()} />
      <Moments posts={social.posts.slice(0, 4)} profiles={social.follow.profiles} />
      <Credits email={site.email} line="Press · Brands · Professional enquiries" social={site.social} year={now.getFullYear()} links={site.nav} />
    </CinemaHome>
  )
}
