import type { Metadata } from 'next'
import about from '@content/about.json'
import biography from '@content/biography.json'
import memoryLane from '@content/memory-lane.json'
import { Chapters, PageIntro } from '@/components/layouts'
import { MemoryLane } from '@/sections/MemoryLane/MemoryLane'
import { ThreeDecades } from '@/sections/ThreeDecades/ThreeDecades'

export const metadata: Metadata = { title: 'About', description: biography.lede }

export default function AboutPage() {
  return (
    <>
      <PageIntro title="About" tamil="சிம்ரன்" lede={biography.lede} />
      <ThreeDecades data={about} id="three-decades" moreHref={null} />
      <Chapters chapters={biography.chapters} />
      <MemoryLane data={memoryLane} />
    </>
  )
}
