# simran.actor

The official site for Simran, built from the *Title Sequence* handover pack in `docs/handover/`.

Next.js (App Router) + TypeScript + CSS modules, with GSAP/ScrollTrigger for the hero. Fonts are self-hosted.

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
| `src/sections/` | One reusable layout per section, each taking a typed `data` prop. |
| `src/components/layouts/` | Inner-page layouts: `PageIntro`, `Chapters`, `Filmography`, `LedgerList`. |
| `src/components/ui/` | `Container`, `SectionHeading`, `ArrowButton`, `TextLink`, `Wordmark`. |
| `src/app/globals.css` | Design tokens. |
| `src/lib/status.ts` | Date-driven release status for the crawl and Coming Soon. |
| `CONVENTIONS.md` | Rules for adding or changing a section. |
| `docs/handover/` | The handover, creative direction and design sources. |

## Content that is still outstanding

Run `npm run content:check` for the full list. The blocking client assets are in `docs/handover/HANDOVER.md` §4: the official autograph SVG, hero loop and poster, key art, clips, photos, and confirmed titles, dates and awards.

- **Hero** is a stub (`src/sections/Hero/Hero.tsx`): poster stand-in, typeset mark and the real scroll beats. The signature-mask zoom goes in when `content/hero.json` has `signature`.
- **Filmography, honours list and biography** (`filmography.json`, `honours.json`, `biography.json`) are carried over from the current simran.actor and need client review.
- **Release status** is never typed. Set `production.stage` and, once locked, `production.releaseDate`; the crawl flips to NOW SHOWING on that date. Pages revalidate hourly.
- **Moments** renders `content/social.json`. Replace it with a cached Instagram Graph API or Behold fetch; no third-party widget.
