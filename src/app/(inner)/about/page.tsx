import type { Metadata } from 'next'
import about from '@content/about.json'
import biography from '@content/biography.json'
import memoryLane from '@content/memory-lane.json'
import who from '@content/who.json'
import { PageTitle } from '@/cinema/PageTitle'
import { Archive } from '@/cinema/pages/about/Archive'
import { Biography } from '@/cinema/pages/about/Biography'
import { Memory } from '@/cinema/scenes/Memory'
import { Who } from '@/cinema/scenes/Who'

export const metadata: Metadata = { title: 'About', description: biography.lede }

export default function AboutPage() {
  return (
    <>
      <PageTitle title="About" kicker={who.facts[0].value} lede={biography.lede} image={about.portrait} imagePosition="50% 28%" />
      <Who data={who} bioHref="#biography" />
      <Biography id="biography" chapters={biography.chapters} acts={about.timeline} />
      <Memory films={memoryLane.films} startFilm={memoryLane.startFilm} />
      <Archive id="archive" photos={memoryLane.polaroids} />
    </>
  )
}
