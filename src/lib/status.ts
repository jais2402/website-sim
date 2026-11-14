/**
 * Release status is derived from dates, never typed by hand, so it cannot go stale
 * (HANDOVER.md §3.2 and §6). Pages that use it revalidate hourly.
 */
export type Stage = 'announced' | 'shooting' | 'post' | 'released'
export type CrawlState = 'now-showing' | 'coming-soon' | 'shooting'

export type Production = {
  /** Where the production has reached, as last confirmed by the team. */
  stage: 'announced' | 'shooting' | 'post'
  /** Locked release date, YYYY-MM-DD, or null while unannounced. */
  releaseDate: string | null
  /** Last day in cinemas, YYYY-MM-DD. After it the title leaves "Now showing". */
  runEnds?: string | null
}

const day = (iso: string) => new Date(`${iso}T00:00:00+05:30`).getTime() // IST

/** The stage today: a locked release date that has passed always wins. */
export function stageOn(p: Production, now: Date = new Date()): Stage {
  if (p.releaseDate && now.getTime() >= day(p.releaseDate)) return 'released'
  return p.stage
}

/** The crawl has three honest states only, or null when the title should not be listed. */
export function crawlState(p: Production, now: Date = new Date()): CrawlState | null {
  const stage = stageOn(p, now)
  if (stage === 'released') {
    if (p.runEnds && now.getTime() > day(p.runEnds) + 86_400_000) return null
    return 'now-showing'
  }
  if (stage === 'shooting') return 'shooting'
  return 'coming-soon'
}

/** Whole days until release, or null when no date is locked or it has passed. */
export function daysUntil(p: Production, now: Date = new Date()): number | null {
  if (!p.releaseDate) return null
  const diff = day(p.releaseDate) - now.getTime()
  return diff > 0 ? Math.ceil(diff / 86_400_000) : null
}
