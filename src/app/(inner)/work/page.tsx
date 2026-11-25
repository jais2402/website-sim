import type { Metadata } from 'next'
import buzz from '@content/buzz.json'
import crawl from '@content/crawl.json'
import filmography from '@content/filmography.json'
import reelWall from '@content/reel-wall.json'
import upcoming from '@content/upcoming.json'
import { PageTitle } from '@/cinema/PageTitle'
import { Films } from '@/cinema/scenes/Films'
import { NowPlaying, type RollData } from '@/cinema/scenes/NowPlaying'
import { OnSet, type OnSetFilm } from '@/cinema/scenes/OnSet'
import { Filmography } from '@/cinema/pages/work/Filmography'
import { Television } from '@/cinema/pages/work/Television'

export const metadata: Metadata = {
  title: 'Work',
  description: 'The complete filmography of Simran across Tamil, Telugu, Hindi, Malayalam and Kannada cinema, and television.',
}

const firstYear = Math.min(...filmography.films.map((f) => f.year))

export default function WorkPage() {
  const now = new Date()
  return (
    <>
      <PageTitle
        title="Work"
        kicker={`Filmography · ${firstYear}–today`}
        lede="Every film, by year. Filter by language or decade."
        image="/media/stills/dharman-team.webp"
        imagePosition="50% 35%"
      />
      <Films films={reelWall.films} allHref="/work" />
      <NowPlaying data={crawl as RollData} now={now} />
      {/* The homepage links "Production updates" to /work#upcoming. */}
      <div id="upcoming">
        <OnSet
          films={upcoming.films as OnSetFilm[]}
          news={buzz.items.slice(0, 3).map((n) => ({ category: n.category, title: n.title, meta: n.meta, href: '/press#buzz' }))}
          updatesHref="/press#buzz"
          now={now}
        />
      </div>
      <div id="filmography">
        <Filmography films={filmography.films} languages={filmography.languages} n={6} />
      </div>
      <div id="television">
        <Television shows={filmography.television} n={7} />
      </div>
    </>
  )
}
