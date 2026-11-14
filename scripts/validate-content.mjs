// Finds unconfirmed "[ … ]" placeholders and missing media in content/*.json.
// Default: report and pass. CONTENT_STRICT=1 (set this for production deploys): fail.
import { readdir, readFile } from 'node:fs/promises'

const dir = new URL('../content/', import.meta.url)
const strict = process.env.CONTENT_STRICT === '1'
const PLACEHOLDER = /\[[^\]]*\]/
const MEDIA_KEY = /^(image|poster|video|src|cover|portrait|still|signature)$/i
const problems = []

function walk(value, path, file) {
  if (typeof value === 'string') {
    if (PLACEHOLDER.test(value)) problems.push(`${file}  ${path}  placeholder: ${value}`)
  } else if (Array.isArray(value)) {
    value.forEach((v, i) => walk(v, `${path}[${i}]`, file))
  } else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      if (k.startsWith('_')) continue // notes to editors
      if (v === null && MEDIA_KEY.test(k)) problems.push(`${file}  ${path}.${k}  missing media`)
      else walk(v, path ? `${path}.${k}` : k, file)
    }
  }
}

for (const name of (await readdir(dir)).filter((f) => f.endsWith('.json')).sort()) {
  walk(JSON.parse(await readFile(new URL(name, dir), 'utf8')), '', name)
}

if (problems.length === 0) {
  console.log('content: no placeholders or missing media')
} else {
  console.log(problems.join('\n'))
  console.log(`\ncontent: ${problems.length} item(s) still need client content`)
  if (strict) {
    console.error('CONTENT_STRICT=1: refusing to build with unconfirmed content')
    process.exit(1)
  }
}
