# simran.actor

The official site for Simran, built from the *Title Sequence* handover pack in `docs/handover/`.

Next.js (App Router) + TypeScript + CSS modules, with GSAP/ScrollTrigger for the hero. Fonts are self-hosted.

The homepage follows the design canvas artboard **V9 · WebGL Cinema**: twelve full-height scenes with live WebGL backgrounds. The inner pages still use the earlier *Title Sequence* sections.

## Run it

```bash
npm install
npm run dev            # http://localhost:3000
npm run build          # content report, then production build
npm run start
npm run typecheck
npm run content:check  # list every unconfirmed placeholder and missing asset
```

Set `CONTENT_STRICT=1` on production deploys. The build then fails while any `[ … ]` placeholder or missing media remains, so none can ship.

`ENQUIRY_WEBHOOK_URL` is where the Connect form forwards enquiries (JSON POST). Until it is set the form tells visitors to email instead.

## Where things are

| Path | What |
| --- | --- |
| `content/*.json` | All copy and data. Nothing is hard-coded in components. |
| `src/app/` | Routes: `/`, `/work`, `/about`, `/reel`, `/press`, `/connect`, `/photoshoots`. |
| `src/cinema/` | The homepage: `scenes/` (one component per scene), `shaders.ts`, `ShaderCanvas.tsx`, shared `ui.tsx` and `cinema.module.css`. |
| `src/sections/` | Sections used by the inner pages, each taking a typed `data` prop. |
| `src/components/layouts/` | Inner-page layouts: `PageIntro`, `Chapters`, `Filmography`, `LedgerList`. |
| `src/components/ui/` | `Container`, `SectionHeading`, `ArrowButton`, `TextLink`, `Wordmark`. |
| `src/app/globals.css` | Design tokens. |
| `src/lib/status.ts` | Date-driven release status for the crawl and Coming Soon. |
| `CONVENTIONS.md` | Rules for adding or changing a section. |
| `docs/handover/` | The handover, creative direction and design sources. |

## Media

Everything in `public/media/` was taken from the current simran.actor in November 2026: posters, photos, award photos and the YouTube thumbnails of videos that site links to. `public/media/sources.json` lists each file with its original URL.

The handover (§4) asks for photos of Simran to come only from files her team supplies or clears. Treat these as working copies: swap each one for a cleared file before launch, keeping the same path, and nothing else needs to change.

Text taken from the same site: filmography, awards, biography, brands, the in-production slate, article links, and Simran’s own posts (used verbatim for “In her words”, the interview lines and the notes).

## Content that is still outstanding

Run `npm run content:check` for the full list. The blocking client assets are in `docs/handover/HANDOVER.md` §4: the official autograph SVG, hero loop and poster, key art, clips, photos, and confirmed titles, dates and awards.

- **Homepage stills and clips** are colour stand-ins until `poster`, `image`, `video` and `portrait` paths are filled in the content files.
- **Filmography, honours list and biography** (`filmography.json`, `honours.json`, `biography.json`) are carried over from the current simran.actor and need client review.
- **Release status** is never typed. Set `production.stage` and, once locked, `production.releaseDate`; the crawl flips to NOW SHOWING on that date. Pages revalidate hourly.
- **Moments** renders `content/social.json`. Replace it with a cached Instagram Graph API or Behold fetch; no third-party widget.

## Homepage WebGL

Four scenes draw a fragment shader behind their content (projector light, film wash, memory burn, stars). `ShaderCanvas` only renders while its scene is on screen, caps the pixel ratio, and draws a single still frame under `prefers-reduced-motion`. If the browser has no GPU acceleration, reports a software renderer, or cannot hold about 24fps, the canvas is hidden and the CSS gradient behind it shows instead, so the page never stalls.

The film leader (3 · 2 · 1) plays once per browser session.
