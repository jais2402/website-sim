# website-sim

A motion-first website starter: Vite, React and TypeScript, with GSAP (ScrollTrigger, SplitText) and Lenis smooth scrolling. Pages are assembled from reusable, prop-driven layouts.

## Run it

```bash
npm install
npm run dev      # develop at http://localhost:5173
npm run build    # type-check, bundle and prerender into dist/
npm run preview  # serve the production build
npm run lint
```

## Structure

| Path | What lives there |
| --- | --- |
| `src/pages/` | Pages. Each one holds its own content and passes it into layouts. |
| `src/layouts/` | Reusable layouts. No hard-coded content; everything comes in as props or children. |
| `src/motion/` | Motion primitives the layouts are built from. |
| `src/index.css` | Design tokens (`:root`) and the styles for every layout. |
| `scripts/prerender.mjs` | Writes the rendered page into `dist/index.html` at build time. |

### Layouts

| Layout | Use it for |
| --- | --- |
| `PageLayout` | Page shell: smooth scroll, cursor, fixed nav, `footer` slot. |
| `HeroLayout` | Full-height opener with masked headline and pointer-following glow. |
| `MarqueeLayout` | Ticker that reacts to scroll speed and direction. |
| `FeatureGridLayout` | Heading plus a grid of cards that stagger in. |
| `HorizontalScrollLayout` + `Card` | Pinned section where scrolling moves panels sideways. |
| `CtaLayout` | Oversized closing statement; `as="footer"` for the page footer. |
| `Button` | Magnetic pill link. |

Any layout can appear several times on a page or across pages; each instance scopes its own animations.

### Motion primitives

`SmoothScroll`, `Reveal`, `SplitHeading`, `Magnetic`, `Cursor`, plus the configured `gsap`, `ScrollTrigger` and `useGSAP` exports. Always import GSAP from `src/motion` so plugins are registered once.

## Adding a layout

1. Create `src/layouts/MyLayout.tsx` that takes its content as props or children.
2. Put animations in `useGSAP(() => { ... }, { scope: ref })` and select only inside that scope, so several instances never collide.
3. Return early when `prefersReducedMotion()` is true, and make sure the layout reads well without animation.
4. Export it from `src/layouts/index.ts`.

## Performance rules

- Animate `transform` and `opacity` only.
- The production page is prerendered, so it paints before JavaScript loads. Above-the-fold elements that animate in carry `data-intro`, which keeps them hidden until their entrance starts.
- Libraries are split into long-lived `react` and `motion` chunks.
- No web fonts are downloaded by default; add one in `--font` only if the brand needs it.
