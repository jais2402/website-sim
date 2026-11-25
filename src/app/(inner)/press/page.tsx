import type { Metadata } from 'next'
import awards from '@content/awards.json'
import brands from '@content/brands.json'
import buzz from '@content/buzz.json'
import honours from '@content/honours.json'
import interviews from '@content/interviews.json'
import press from '@content/press.json'
import { PageTitle } from '@/cinema/PageTitle'
import { AwardsLedger } from '@/cinema/pages/press/AwardsLedger'
import { BrandList } from '@/cinema/pages/press/BrandList'
import { PressGrid, type PressPiece } from '@/cinema/pages/press/PressGrid'
import { reads } from '@/cinema/reads'
import { Honours } from '@/cinema/scenes/Honours'
import { Words } from '@/cinema/scenes/Words'

export const metadata: Metadata = { title: 'Press', description: 'Cover stories, honours, interviews and news.' }

/** Interviews first, then any news piece not already listed (matched by url). A missing picture or description is filled from the duplicate. */
function pieces(): PressPiece[] {
  const byUrl = new Map(buzz.items.map((b) => [b.href, b]))
  const fromInterviews: PressPiece[] = interviews.items.map((i) => {
    const twin = byUrl.get(i.url)
    return {
      url: i.url,
      kicker: i.type,
      source: i.source,
      title: i.title,
      dek: ('dek' in i ? i.dek : null) ?? twin?.dek ?? null,
      image: i.poster ?? twin?.image ?? null,
      action: i.action,
    }
  })
  const seen = new Set(interviews.items.map((i) => i.url))
  const fromBuzz: PressPiece[] = buzz.items
    .filter((b) => !seen.has(b.href))
    .map((b) => ({ url: b.href, kicker: b.kicker, source: b.meta, title: b.title, dek: b.dek, image: b.image, action: 'Read' }))
  return [...fromInterviews, ...fromBuzz]
}

export default function PressPage() {
  return (
    <>
      <PageTitle title="Press" kicker="Honours · Interviews · Brands" lede={`“${press.quote}” — ${press.publication}`} image={press.cover} imagePosition="50% 25%" />
      <Honours awards={awards.awards} allHref="#awards" />
      <AwardsLedger awards={honours.awards} />
      <Words reads={reads()} />
      <PressGrid pieces={pieces()} />
      <BrandList brands={brands.brands} />
    </>
  )
}
