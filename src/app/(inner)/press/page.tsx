import type { Metadata } from 'next'
import awards from '@content/awards.json'
import brands from '@content/brands.json'
import buzz from '@content/buzz.json'
import honours from '@content/honours.json'
import interviews from '@content/interviews.json'
import press from '@content/press.json'
import { LedgerList, PageIntro } from '@/components/layouts'
import { Awards } from '@/sections/Awards/Awards'
import { Buzz } from '@/sections/Buzz/Buzz'
import { CoverStory } from '@/sections/CoverStory/CoverStory'
import { Interviews } from '@/sections/Interviews/Interviews'

export const metadata: Metadata = { title: 'Press', description: 'Cover stories, honours, interviews and news.' }

export default function PressPage() {
  return (
    <>
      <PageIntro title="Press" lede="Cover stories, honours, interviews and the latest news." />
      <CoverStory data={press} id="cover-story" />
      <Awards data={awards} />
      <LedgerList
        id="honours-list"
        heading="Awards and nominations"
        rows={honours.awards.map((a) => ({
          key: `${a.year}-${a.body}-${a.award}`,
          lead: a.year,
          title: a.award,
          detail: [a.body, a.work].filter(Boolean).join(' · '),
          aside: a.result,
        }))}
      />
      <LedgerList
        id="brands"
        heading="Brands"
        rows={brands.brands.map((b) => ({ key: b.name, lead: b.year ?? '·', title: b.name, detail: b.note || undefined }))}
      />
      <Interviews data={interviews} />
      <Buzz data={buzz} now={new Date().toISOString()} />
    </>
  )
}
