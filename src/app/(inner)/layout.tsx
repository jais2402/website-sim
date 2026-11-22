import type { ReactNode } from 'react'
import { Footer, Header } from '@/lib/site'

// Release states in the crawl are date-driven, so refresh hourly.
export const revalidate = 3600

/** Shell for every page except the homepage: header visible from the start. */
export default function InnerLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </>
  )
}
