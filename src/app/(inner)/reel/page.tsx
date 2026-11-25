import type { Metadata } from 'next'
import showreel from '@content/showreel.json'
import { LedgerList, PageIntro } from '@/components/layouts'
import { Showreel } from '@/sections/Showreel/Showreel'

export const metadata: Metadata = { title: 'Reel', description: 'The showreel and selected scenes.' }

export default function ReelPage() {
  return (
    <>
      <PageIntro title="Reel" lede="One primary reel, then a few selected scenes. Sound stays off until you press play." />
      <Showreel data={showreel} id="showreel" />
      <LedgerList
        id="clips"
        heading="In this reel"
        rows={showreel.clips.map((c, i) => ({
          key: `${c.film} · ${c.title}`,
          lead: String(i + 1).padStart(2, '0'),
          title: c.title,
          detail: c.film,
          aside: c.duration ? `${c.kind} · ${c.duration}` : c.kind,
        }))}
      />
    </>
  )
}
