import { PageIntro } from '@/components/layouts'
import { TextLink } from '@/components/ui'
import { Header } from '@/lib/site'

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" style={{ paddingBottom: 120 }}>
        <PageIntro title="Cut." lede="That page is not in the picture.">
          <p style={{ marginTop: 32 }}>
            <TextLink href="/">Back to the start</TextLink>
          </p>
        </PageIntro>
      </main>
    </>
  )
}
