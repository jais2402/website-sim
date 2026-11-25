import type { Metadata } from 'next'
import showreel from '@content/showreel.json'
import { PageTitle } from '@/cinema/PageTitle'
import { Reel } from '@/cinema/scenes/Reel'
import { ClipList } from '@/cinema/pages/reel/ClipList'

export const metadata: Metadata = { title: 'Reel', description: 'The showreel and selected scenes.' }

export default function ReelPage() {
  return (
    <>
      <PageTitle
        title="Reel"
        kicker={`Trailers & first looks · ${showreel.clips.length} clips`}
        lede="Sound stays off until you press play."
        image="/media/video/tourist-family-trailer.webp"
      />
      <div id="showreel">
        <Reel clips={showreel.clips} />
      </div>
      <div id="clips">
        <ClipList clips={showreel.clips} n={6} heading="In this reel" />
      </div>
    </>
  )
}
