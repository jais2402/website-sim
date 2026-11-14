import type { Metadata } from 'next'
import photoshoots from '@content/photoshoots.json'
import { PageIntro } from '@/components/layouts'
import { Photoshoots } from '@/sections/Photoshoots/Photoshoots'

export const metadata: Metadata = { title: 'Photoshoots', description: 'Editorial portraits and photoshoots.' }

export default function PhotoshootsPage() {
  return (
    <>
      <PageIntro title="Photoshoots" tamil="புகைப்படங்கள்" />
      <Photoshoots data={photoshoots} showViewAll={false} />
    </>
  )
}
