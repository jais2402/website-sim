import about from '@content/about.json'
import awards from '@content/awards.json'
import buzz from '@content/buzz.json'
import connect from '@content/connect.json'
import fanNotes from '@content/fan-notes.json'
import hero from '@content/hero.json'
import interviews from '@content/interviews.json'
import memoryLane from '@content/memory-lane.json'
import photoshoots from '@content/photoshoots.json'
import press from '@content/press.json'
import reelWall from '@content/reel-wall.json'
import showreel from '@content/showreel.json'
import social from '@content/social.json'
import upcoming from '@content/upcoming.json'
import { Header, site } from '@/lib/site'
import { Awards } from '@/sections/Awards/Awards'
import { Buzz } from '@/sections/Buzz/Buzz'
import { Connect } from '@/sections/Connect/Connect'
import { CoverStory } from '@/sections/CoverStory/CoverStory'
import { FanNotes } from '@/sections/FanNotes/FanNotes'
import { Hero } from '@/sections/Hero/Hero'
import { HomeTop } from '@/sections/Hero/HomeTop'
import { Interviews } from '@/sections/Interviews/Interviews'
import { MemoryLane } from '@/sections/MemoryLane/MemoryLane'
import { Photoshoots } from '@/sections/Photoshoots/Photoshoots'
import { ReelWall } from '@/sections/ReelWall/ReelWall'
import { Showreel } from '@/sections/Showreel/Showreel'
import { SocialWall } from '@/sections/SocialWall/SocialWall'
import { ThreeDecades } from '@/sections/ThreeDecades/ThreeDecades'
import { Upcoming, type UpcomingData } from '@/sections/Upcoming/Upcoming'

// Release states (crawl, Coming Soon) are date-driven, so refresh hourly.
export const revalidate = 3600

// Section order is fixed by docs/handover/HANDOVER.md §3.
export default function Home() {
  const now = new Date()
  return (
    <>
      <HomeTop hero={<Hero data={hero} roles={site.roles} />} header={<Header revealOnArrival />} />
      <main id="main">
        <ReelWall data={reelWall} />
        <Upcoming data={upcoming as UpcomingData} now={now} />
        <Buzz data={buzz} now={now.toISOString()} />
        <Showreel data={showreel} />
        <ThreeDecades data={about} />
        <MemoryLane data={memoryLane} />
        <Photoshoots data={photoshoots} />
        <CoverStory data={press} />
        <Awards data={awards} />
        <Interviews data={interviews} />
        <FanNotes data={fanNotes} />
        <SocialWall data={social} />
        <Connect data={connect} email={site.email} />
      </main>
    </>
  )
}
