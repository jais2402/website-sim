import type { Metadata } from 'next'
import photoshoots from '@content/photoshoots.json'
import { PageTitle } from '@/cinema/PageTitle'
import { PhotoSets } from '@/cinema/pages/photoshoots/PhotoSets'

export const metadata: Metadata = { title: 'Photoshoots', description: 'Editorial portraits and photoshoots.' }

export default function PhotoshootsPage() {
  return (
    <>
      <PageTitle title="Photoshoots" kicker={`${photoshoots.photos.length} photographs`} image="/media/photos/shoot-2.webp" imagePosition="50% 22%" />
      <PhotoSets photos={photoshoots.photos} />
    </>
  )
}
