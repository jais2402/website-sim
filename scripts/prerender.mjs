// Renders the app to static HTML and writes it into dist/index.html,
// so the page paints before any JavaScript has loaded.
import { readFile, writeFile, rm } from 'node:fs/promises'

const { render } = await import('../dist-server/entry-server.js')
const file = new URL('../dist/index.html', import.meta.url)
const html = await readFile(file, 'utf8')
const marker = '<div id="root"></div>'
if (!html.includes(marker)) throw new Error('prerender: root marker not found in dist/index.html')

await writeFile(file, html.replace(marker, `<div id="root">${render()}</div>`))
await rm(new URL('../dist-server', import.meta.url), { recursive: true })
console.log('prerendered dist/index.html')
