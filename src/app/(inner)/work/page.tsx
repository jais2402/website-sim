import type { Metadata } from 'next'
import filmography from '@content/filmography.json'
import reelWall from '@content/reel-wall.json'
import upcoming from '@content/upcoming.json'
import { Filmography, LedgerList, PageIntro } from '@/components/layouts'
import { ReelWall } from '@/sections/ReelWall/ReelWall'
import { Upcoming, type UpcomingData } from '@/sections/Upcoming/Upcoming'

export const metadata: Metadata = {
  title: 'Work',
  description: 'The complete filmography of Simran across Tamil, Telugu, Hindi, Malayalam and Kannada cinema, and television.',
}

export default function WorkPage() {
  return (
    <>
      <PageIntro title="Work" lede="Every film, by year. Filter by language or decade." />
      <ReelWall data={reelWall} id="signature" title="Signature titles" allHref={null} />
      <PageIntro title="Filmography" />
      <Filmography films={filmography.films} languages={filmography.languages} />
      <Upcoming data={upcoming as UpcomingData} now={new Date()} />
      <LedgerList
        id="television"
        heading="Television"
        rows={filmography.television.map((t) => ({
          key: `${t.year}-${t.title}`,
          lead: t.year,
          title: t.title,
          detail: t.role,
          aside: `${t.language} · ${t.channel}`,
        }))}
      />
    </>
  )
}
