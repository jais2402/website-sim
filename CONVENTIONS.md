# Build conventions

Read `docs/handover/HANDOVER.md` first. It overrides `docs/handover/simran-direction.md`.

## Sections

- One folder per section: `src/sections/<Name>/<Name>.tsx` + `<Name>.module.css`.
- A section is a reusable layout. It takes all of its content through a typed `data` prop (export the type from the section file) and holds no copy of its own apart from fixed UI labels (button names, aria labels).
- Content lives in `content/<name>.json`. The page imports the JSON and passes it in.
- Server component by default. Add `'use client'` only to the file that needs state or effects.

## Content rules

- Anything the client has not confirmed stays as a `"[ … ]"` string in the JSON, copied from the design source. Never invent facts, quotes, dates, awards or film details.
- Missing media is `null` under one of these keys: `image`, `poster`, `video`, `src`, `cover`, `portrait`, `still`. Render the design's gradient stand-in when it is `null`, and an `<img>`/`<video>` when a path is present.
- Keys starting with `_` are notes to editors and are ignored by the validator.
- `npm run content:check` lists what is still outstanding. `CONTENT_STRICT=1` makes it fail the build.

## Styling

- CSS modules. Colours, fonts, easing and container width come from the variables in `src/app/globals.css`. Section-specific scenery colours (wood, brass gradients and so on) may be literal, copied from the design source.
- Desktop matches the design source at 1440px. Headings use `SectionHeading` (64px serif, fluid down to 40px). No numbered eyebrows.
- Use `Container` for the 1280px / 32px-gutter column.
- Must work at 390px with no horizontal page scroll. Mobile rules are in HANDOVER.md §5.

## Interaction rules (HANDOVER.md §5–6)

- Every interactive element is a real `<button>` or `<a>`.
- Anything that reacts to hover must react the same way to keyboard focus and to tap: set the state from `onMouseEnter`, `onFocus` and `onClick`.
- `prefers-reduced-motion`: no autoplay, no movement. Carousels become static lists, callouts appear without animation. Use `useReducedMotion()` from `@/lib/motion` for behaviour and the global CSS rule already neutralises transitions.
- Timers: use `useAutoAdvance` from `@/lib/useAutoAdvance`. It already stops for reduced motion and exposes `setPaused` for hover/focus.
- Animate `transform` and `opacity` only.
- Sound only after the visitor presses play.

## Shared pieces

`@/components/ui`: `Container`, `SectionHeading`, `ArrowButton`, `TextLink`, `Wordmark`.
`@/lib/motion`: `gsap`, `ScrollTrigger`, `useGSAP`, `useReducedMotion`.
`@/lib/status`: date-driven release status.
