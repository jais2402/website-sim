# Hero → Scene 02 transition: research and shortlist

Status: research note, Nov 2026. Scope: how Scene 01 (Opening: photo, `hero` projector shader, SIMRAN, tagline, "Watch the reel") hands off to Scene 02 (Now playing credits roll), now that the signature artwork for the brief's zoom (direction §3, §9) has not been supplied.

What we already have: `ShaderCanvas` passes `uScroll` (0–1 as the hero leaves the screen) to the `hero` shader, which widens the beam and dims the frame. So a scroll-driven light change costs one or two extra uniforms, not a new WebGL setup. The photo is a plain `<img>` under the canvas (`mix-blend-mode: screen`), not a shader texture. That matters for option 4 below.

Rules for every option: pin with ScrollTrigger and `scrub: 0.6–0.8` (§9). Under `prefers-reduced-motion`, skip the pin and the scrub and let the page scroll normally. Use `svh` for pin lengths. Make the pin about 40% shorter on phones (§3: around 180–200vh).

## Shortlist

**1. Lamp-down into the gate (projector gate).** *Effort: S–M.*
- **What the visitor sees:** as they scroll, the beam narrows, and the frame closes from full-bleed to a 2.39:1 letterboxed "gate". The film then pulls down one frame: the hero slides up past a thin frame line, and the next frame is the credits roll.
- **How it's built:** one pinned timeline:
  - `clip-path: inset()` on `.opening`, from `0%` to a 2.39:1 rectangle;
  - a new `uOut` uniform that narrows the beam's `width` and brightens the gate edge;
  - a `yPercent: -100` pull-down, with a 2px ivory frame line and a short `opacity` flicker (two or three steps);
  - Scene 02 underneath with `clip-path` matched to the gate, which then opens to full screen.
- **Reuses the projector shader:** yes.
- **Performance:** clip-path and transforms are cheap. Keep `will-change` on during the pin only.
- **Reduced motion:** no pin. The gate shows as a static letterbox crop, then the next section.
- **Mobile:** use a 4:5 gate instead of 2.39:1, which would be a thin strip on a phone. Pin about 120svh.

**2. Name as the door (zoom through the "I" of SIMRAN).** *Effort: M.*
- **What the visitor sees:** the hero fades to the name, and the camera dives into the vertical stem of the Cinzel **I**. The stem is a lit slit, like a projector gate or a door left ajar. It widens until the credits fill the screen.
- **How it's built:**
  - Put an SVG `<mask>` on a black overlay. The mask holds the name as `<text>` or as outlined paths, with white letters on a black ground, so the letters become holes in the overlay.
  - Scale the mask group from 1 to about 40, with `transform-origin` on the I. This is the "zoom into a specific letter" approach discussed on the GSAP forum.
  - When the stem is wider than the viewport, switch the mask to `none` (§9).
- **Swapping in the signature later:** the code stays the same. Replace the `<text>` with `signature.svg` and the brief's original zoom ships with no rework.
- **Reuses the projector shader:** partly. The beam can track toward the I.
- **Performance:** SVG masks repaint on every scale step. Animate a transform on the masked group, not mask attributes, and test Safari early.
- **Reduced motion:** static hero, then normal scroll.
- **Mobile:** the name is narrower on a phone, but the I still works. Pin about 140svh.
- **Watch out:** the hero and Scene 02 are both near-black. Light the first credits frame with a tungsten wash so the opening reads.

**3. Iris out (silent-film close).** *Effort: S.*
- **What the visitor sees:** a soft-edged circle closes on Simran's face. On black, the first credit fades up. This is the classic iris, the `circle`/`circleopen` family in gl-transitions.
- **How it's built:** `mask-image: radial-gradient()` driven by a registered `@property --r`. Animate `--r` with GSAP from 150% to 0%, centred on the face (photo `object-position: 50% 22%`).
- **Performance:** very light.
- **Reduced motion:** a crossfade.
- **Mobile:** works unchanged.
- **Caveat:** a familiar move. Fresh only if the edge carries grain and gate weave.

**4. Film burn / shader dissolve.** *Effort: L.*
- **What the visitor sees:** the frame "catches" in the gate. A tungsten burn blooms from the beam's hotspot and dissolves the photo, and the credits come through the burn.
- **How it's built:**
  - Move the photo into the shader as a texture.
  - Port gl-transitions `FilmBurn` or a noise-threshold dissolve.
  - Drive a `progress` uniform from scroll.
  - Render Scene 02 as a texture, or just as black, behind it.
- **Reuses the projector shader:** heavily.
- **Performance:** needs the existing watchdog and a CSS fallback (crossfade). It is fill-rate heavy on phones.
- **Reduced motion:** a crossfade.
- **Mobile:** fallback only on weak GPUs.
- **Risk:** reads as an "effect" if overplayed.

**5. Hero becomes the screen (pinned scale-down).** *Effort: M.*
- **What the visitor sees:** the hero shrinks from full-bleed to a cinema screen hanging in darkness. The projector beam stays full-screen above it, now visibly *projecting onto* the frame. The credits roll starts on that screen, and then the screen grows back to full-bleed.
- **How it's built:**
  - Pin, then `scale` plus `clip-path: inset(… round 2px)` on the hero.
  - The canvas moves out of `.glHero` into a fixed layer during the pin.
  - The `hero` shader's beam source is aimed at the screen's top edge.
- **Performance:** fine. It is transforms only.
- **Reduced motion:** static.
- **Mobile:** use a smaller scale step (0.85, not 0.6), or skip the auditorium beat.

**6. Rotary shutter flicker.** *Effort: S–M.*
- **What the visitor sees:** two half-disc blades of a 180° shutter sweep across. Each pass strobes between the hero and the credits three or four times, then rests on the credits.
- **How it's built:** `mask-image: conic-gradient()` driven by an `@property --a` angle and scrubbed with GSAP.
- **Accessibility:** the flicker must stay under 3 flashes per second (WCAG 2.3.1). Scrub-tied, so the visitor's scroll speed controls it, but cap the speed anyway.
- **Reduced motion:** remove entirely.
- **Mobile:** fine.

**Not shortlisted: View Transitions API.** Same-document view transitions are now Baseline (Chrome/Edge 111, Safari 18, Firefox 144). They animate between DOM states on an event and cannot be scrubbed to scroll. Use them for "Watch the reel" opening the reel dialog or for route changes, not for this handoff.

## Recommendation

**Top: 1, Lamp-down into the gate.**
- Needs no artwork.
- Reuses the shader we already run.
- Is the most *on-theme* idea: the site is a projector, so end the hero the way a projector moves to the next frame.
- Is cheap, uses no extra WebGL, degrades to a plain crop, and has a clear mobile variant.

**Runner-up: 2, Name as the door.**
- Keeps the brief's "zoom through the mark into the next scene" without faking an autograph: it is the typeset name, honestly set.
- The same code becomes the signature zoom once `signature.svg` arrives.
- Costs more to tune (Safari mask repaint, the dark-on-dark handoff).

**Header (§3 step 5, either option):** keep the sticky header inert until the pin's `onLeave` fires. The current order puts it between Scene 01 and Scene 02, which would interrupt the gate or zoom.

## References

The tympanus.net and gsap.com pages could not be opened from this environment. The entries marked *(search listing only)* were confirmed only from search results, not read in full.

- Codrops, "SVG Mask Transitions on Scroll with GSAP and ScrollTrigger" (Mar 2026), https://tympanus.net/codrops/2026/03/11/svg-mask-transitions-on-scroll-with-gsap-and-scrolltrigger/ *(search listing only)*
- Codrops, "Building a Layered Zoom Scroll Effect with GSAP ScrollSmoother and ScrollTrigger" (Oct 2025), https://tympanus.net/codrops/2025/10/29/building-a-layered-zoom-scroll-effect-with-gsap-scrollsmoother-and-scrolltrigger/ *(search listing only)*
- Codrops, "Naked City Films: Designing and Building a Website That Refuses to Stand Still" (Jan 2026; CRT shader, scroll-driven welcome transition), https://tympanus.net/codrops/2026/01/19/naked-city-films-designing-and-building-a-website-that-refuses-to-stand-still/ *(search listing only)*
- Codrops, "How to Create Distortion and Grain Effects on Scroll with Shaders in Three.js" (Jul 2024), https://tympanus.net/codrops/2024/07/18/how-to-create-distortion-and-grain-effects-on-scroll-with-shaders-in-three-js/ *(search listing only)*
- Codrops, "Rock the Stage with a Smooth WebGL Shader Transformation on Scroll" (2021; scroll-driven uniforms), https://tympanus.net/codrops/2021/07/13/rock-the-stage-with-a-smooth-webgl-shader-transformation-on-scroll/
- GSAP forum, "Help creating zoom-in to text transition in Next.js", https://gsap.com/community/forums/topic/40015-help-creating-zoom-in-to-text-transition-in-nextjs/ *(search listing only)*
- gl-transitions catalog (`circleopen`, `FilmBurn`, `burn`), https://unpkg.com/gl-transitions@1.76.1/skills/gl-transitions/references/catalog.md
- Remotion `filmBurn()` (adapted from gl-transitions FilmBurn), https://remotion.dev/docs/transitions/presentations/film-burn
- web.dev, "Same-document view transitions are now Baseline Newly available" (Oct 2025), https://web.dev/blog/same-document-view-transitions-are-now-baseline-newly-available
- Chrome, "What's new in view transitions (2025 update)", https://developer.chrome.com/blog/view-transitions-in-2025
- Chrome, "Scroll-driven animations" (CSS alternative to the ScrollTrigger scrub), https://developer.chrome.com/docs/css-ui/scroll-driven-animations
- Chrome, "CSS scroll-triggered animations" (Chrome 145), https://developer.chrome.com/blog/scroll-triggered-animations

No award-listed film site using a scroll iris or shutter handoff could be verified. The searches for one turned up nothing usable.
