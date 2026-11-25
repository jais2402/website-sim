# Build conventions

Read `docs/handover/HANDOVER.md` first. It overrides `docs/handover/simran-direction.md`.

## Structure

- Every page uses the cinema look (design artboard **V9 · WebGL Cinema**). The homepage is `src/app/page.tsx` + `src/cinema/CinemaHome.tsx`; every other page sits in `src/cinema/InnerShell.tsx` (header, black ground, credits footer) via `src/app/(inner)/layout.tsx`.
- Building blocks: the scenes in `src/cinema/scenes/` (reuse them on any page), `PageTitle` for an inner page's opening, and page-specific pieces in `src/cinema/pages/<page>/` with their own `*.module.css`.
- A scene takes its content through props; content lives in `content/<name>.json` and the page passes it in. No copy in components apart from fixed UI labels.
- Server component by default. Add `'use client'` only to the file that needs state or effects.

## Content rules

- Anything the client has not confirmed stays as a `"[ … ]"` string in the JSON, copied from the design source. Never invent facts, quotes, dates, awards or film details.
- Missing media is `null` under one of these keys: `image`, `poster`, `video`, `src`, `cover`, `portrait`, `still`. Render the design's gradient stand-in when it is `null`, and an `<img>`/`<video>` when a path is present.
- Keys starting with `_` are notes to editors and are ignored by the validator.
- `npm run content:check` lists what is still outstanding. `CONTENT_STRICT=1` makes it fail the build.

## Styling

- CSS modules. The look lives in `src/cinema/cinema.module.css`: `.page` defines the cinema colours and fonts (Cinzel, Inter Tight, JetBrains Mono) and re-points the site tokens in `src/app/globals.css` to them, so anything inside it matches.
- Scene labels ("Scene 03 · The films · Take 1") are numbered per page by a CSS counter: write only the name and take; the opening/page title counts as scene 01.
- Must work at 390px with no horizontal page scroll. Below 900px scenes stack instead of overlaying.

## Interaction rules (HANDOVER.md §5–6)

- Every interactive element is a real `<button>` or `<a>`.
- Anything that reacts to hover must react the same way to keyboard focus and to tap: set the state from `onMouseEnter`, `onFocus` and `onClick`.
- `prefers-reduced-motion`: no autoplay, no movement. Carousels become static lists, callouts appear without animation. Use `useReducedMotion()` from `@/lib/motion` for behaviour and the global CSS rule already neutralises transitions.
- Timers: use `useAutoAdvance` from `@/lib/useAutoAdvance`. It already stops for reduced motion and exposes `setPaused` for hover/focus.
- Animate `transform` and `opacity` only.
- Sound only after the visitor presses play.

## Shared pieces

`@/cinema/ui`: `Scene`, `Sub`, `Timecode`, `magnetic`, `tilt`, `art`.
`@/cinema/PageTitle`, `@/cinema/ShaderCanvas`, `@/components/ui/YouTubeEmbed` (muted preview or player with sound).
`@/lib/motion`: `gsap`, `ScrollTrigger`, `useGSAP`, `useReducedMotion`. `@/lib/useAutoAdvance`: timers that stop for reduced motion.
`@/lib/status`: date-driven release status. `@/lib/youtube`: video id from a link.
