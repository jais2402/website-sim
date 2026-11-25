// Refreshes the X entries in content/social.json from the curated URLs in content/x-posts.json,
// using only X's official, no-auth oEmbed endpoint (no scraping, no cookies, no private APIs).
//
//   npm run social:x
//
// - Keeps a post only if oEmbed succeeds and its author is @simranbaggaoffc.
// - 404/403 from oEmbed (deleted or protected post) => post is dropped and flagged.
// - Any other failure (network, 5xx, 429) => nothing is written, exit 1, last good data stays.
// - Only entries with platform "x" are rewritten; Instagram entries and order are untouched.
//   X slots are filled newest first; extra posts are appended; unused slots get a placeholder.
import { readFile, writeFile } from 'node:fs/promises'

const HANDLE = 'simranbaggaoffc'
const PROFILE = `https://x.com/${HANDLE}`
const HOSTS = ['https://publish.twitter.com/oembed', 'https://publish.x.com/oembed']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const STATUS_URL = /^https:\/\/(?:www\.|mobile\.)?(?:x|twitter)\.com\/([A-Za-z0-9_]+)\/status\/(\d+)/

const listFile = new URL('../../content/x-posts.json', import.meta.url)
const socialFile = new URL('../../content/social.json', import.meta.url)

const placeholder = () => ({
  platform: 'x',
  handle: `@${HANDLE}`,
  profile: PROFILE,
  url: PROFILE,
  when: '[Date]',
  text: '[Post text — pulled live from X]',
  ratio: null,
  image: null,
})

function decodeEntities(s) {
  const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', mdash: '—', ndash: '–', hellip: '…' }
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === '#') {
      const cp = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10)
      return Number.isFinite(cp) ? String.fromCodePoint(cp) : m
    }
    return named[e.toLowerCase()] ?? m
  })
}

/** Plain text of the <p> inside the oEmbed blockquote; media links (pic.twitter.com, t.co) removed. */
function extractText(html) {
  const p = html.match(/<p\b[^>]*>([\s\S]*?)<\/p>/i)
  if (!p) return null
  let s = p[1]
  s = s.replace(/<a\b[^>]*>\s*(?:pic\.twitter\.com|https?:\/\/t\.co)\/[^<]*<\/a>/gi, '') // media / t.co links
  s = s.replace(/<br\s*\/?>/gi, '\n')
  // oEmbed drops the whitespace before #tag / @mention links ("journey❤️@a@b"); restore one space.
  s = s.replace(/([^\s(])(<a\b[^>]*>[#@])/gi, '$1 $2')
  s = s.replace(/<[^>]+>/g, '') // keep link text (#tags, @mentions), drop tags
  s = decodeEntities(s)
  s = s.replace(/(?:pic\.twitter\.com|https?:\/\/t\.co)\/\S+/gi, '') // any bare leftovers
  s = s.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').replace(/[ \t]{2,}/g, ' ')
  return s.trim()
}

/** "July 4, 2026" from the blockquote's last link => "4 July 2026". */
function extractDate(html) {
  const links = [...html.matchAll(/<a\b[^>]*>([^<]*)<\/a>/gi)]
  const last = links.at(-1)?.[1]?.trim() ?? ''
  const m = last.match(/^([A-Z][a-z]+) (\d{1,2}), (\d{4})$/)
  if (!m || !MONTHS.includes(m[1])) return null
  return `${Number(m[2])} ${m[1]} ${m[3]}`
}

class Fatal extends Error {}

async function oembed(url) {
  let lastErr
  for (const host of HOSTS) {
    const q = `${host}?url=${encodeURIComponent(url)}&omit_script=true&dnt=true`
    try {
      const res = await fetch(q, { headers: { accept: 'application/json' }, signal: AbortSignal.timeout(20000) })
      if (res.status === 404 || res.status === 403) return { gone: res.status }
      if (!res.ok) throw new Error(`HTTP ${res.status} from ${host}`)
      return { data: await res.json() }
    } catch (e) {
      lastErr = e
    }
  }
  throw new Fatal(`${url}: oEmbed failed on all hosts (${lastErr?.message ?? lastErr})`)
}

const { urls = [] } = JSON.parse(await readFile(listFile, 'utf8'))
const verified = []
const flagged = []
const seen = new Set()

for (const raw of urls) {
  const m = String(raw).trim().match(STATUS_URL)
  if (!m) { flagged.push(`${raw}: not a post URL`); continue }
  if (m[1].toLowerCase() !== HANDLE) { flagged.push(`${raw}: not @${HANDLE}`); continue }
  if (seen.has(m[2])) { flagged.push(`${raw}: duplicate`); continue }
  seen.add(m[2])

  let r
  try {
    r = await oembed(raw)
  } catch (e) {
    console.error(`social:x  ${e.message}\nsocial:x  nothing written; social.json left as it was`)
    process.exit(1)
  }
  if (r.gone) { flagged.push(`${raw}: oEmbed ${r.gone} (deleted or protected), dropped`); continue }

  const author = String(r.data.author_url ?? '').replace(/^https:\/\/(?:www\.)?twitter\.com/i, 'https://x.com').toLowerCase()
  if (author !== PROFILE) { flagged.push(`${raw}: author is ${r.data.author_url}, dropped`); continue }

  const text = extractText(String(r.data.html ?? ''))
  const when = extractDate(String(r.data.html ?? ''))
  if (!text || !when) { flagged.push(`${raw}: could not read text/date from oEmbed html, dropped`); continue }

  verified.push({
    platform: 'x',
    handle: `@${HANDLE}`,
    profile: PROFILE,
    url: String(r.data.url || raw),
    when,
    text,
    ratio: null,
    image: null,
  })
  console.log(`ok   ${when.padEnd(18)} ${raw}`)
}

const social = JSON.parse(await readFile(socialFile, 'utf8'))
const queue = [...verified]
social.posts = social.posts.map((p) => (p.platform === 'x' ? queue.shift() ?? placeholder() : p))
social.posts.push(...queue)
await writeFile(socialFile, JSON.stringify(social, null, 2) + '\n')

for (const f of flagged) console.warn(`skip ${f}`)
console.log(`social:x  ${verified.length} verified, ${flagged.length} skipped; content/social.json updated`)
