import crawl from '@content/crawl.json'
import site from '@content/site.json'
import { CreditCrawl, type CrawlData } from '@/sections/SiteHeader/CreditCrawl'
import { SiteFooter } from '@/sections/SiteFooter/SiteFooter'
import { SiteHeader } from '@/sections/SiteHeader/SiteHeader'

export { site }

/** The header with its crawl, ready to drop into any page shell. */
export function Header({ revealOnArrival = false }: { revealOnArrival?: boolean }) {
  return <SiteHeader nav={site.nav} revealOnArrival={revealOnArrival} crawl={<CreditCrawl data={crawl as CrawlData} now={new Date()} />} />
}

/** The typographic footer used on every page except the homepage, which ends on its credits scene. */
export function Footer() {
  return <SiteFooter email={site.email} social={site.social} year={new Date().getFullYear()} />
}
