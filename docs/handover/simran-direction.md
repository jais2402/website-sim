# Simran.actor — creative direction

**Direction:** Title Sequence  
**Hero:** Full-bleed muted video → scroll-zoom into the சிம்ரன் / SIMRAN signature → next section  
**Nav:** Hidden during the hero; fades in only after the zoom completes, then sticks  
**Status:** Creative direction for implementation. Drawn from the [inspiration board](https://cursor.com/canvas/store-2ef9f7ef-3b92-400f-bec3-3dea219e8a70/d2f61d02-7dcf-4852-97d9-daa252762579) (links verified 14 November 2026) plus hero and nav decisions locked 15 November 2026, Asia/Calcutta.  
**This is a brief, not a build.**

---

## 1. Overview and positioning

Simran is a Kollywood star — actress, producer, director — with a three-decade career across Tamil, Telugu, Hindi, Malayalam, and Kannada cinema. The official site already has the substance (biography, filmography, awards, contact). It does not yet have the register of a star site.

**Position the redesign as a premium official house, not a portfolio template.** More formal than a fan page, more cinematic than a lookbook, more confident than a casting site. Modern and clean: five nav words, almost no chrome, Tamil native to the brand.

The current site’s problems to leave behind: a ten-item nav, Elementor / Revolution Slider, leftover typography (Great Vibes, thin Poppins, Amiri, default blue), stale Upcoming titles, awkward slugs, and social reduced to footer icons.

---

## 2. Recommended direction — Title Sequence

Treat the site like the opening credits of a major Tamil film, with the quiet confidence of a luxury house. The face, the work, and time passing do the luxury — not ornaments or widgets.

Cover Story (paper-and-ink editorial) and Maison (almost-still quiet luxury) remain documented alternatives on the board. This document specifies Title Sequence only.

### Palette

| Token | Hex | Use |
| --- | --- | --- |
| Ground | `#0A0A0A` | Page, hero, header |
| Type | `#F3EDE3` | Body, nav, signature stroke |
| Gold | `#C4A35A` | Rare accent — signature ink optional, honours rules |
| Cinema red | `#7A1F24` | Rare. One use, if any (a single status word, never a theme) |

### Type

| Role | Pairing |
| --- | --- |
| Latin display | PP Editorial New, or Cormorant Garamond italic, for **SIMRAN** |
| Tamil display | Noto Serif Tamil, or a commissioned Tamil display, for **சிம்ரன்** — shared baseline with the Latin |
| Signature | A vectorised autograph, not a live font. See §4 |
| UI / body | Satoshi or Inter, regular and medium only |
| Captions | Same sans, small, widely tracked |

Tamil and Latin are equal partners. Do not morph one script into the other as a language toggle.

### Motion principles

- Slow and inevitable. No bounce, no slider dots, no grain overload, no SaaS glow.
- Scroll *is* the cut. The hero is pinned and scrubbed; it does not play as a timed after-effects sting.
- Almost no chrome over the first frame — including the header.
- Prefer typography, photography, and a single signature mark over decoration.

---

## 3. Hero sequence — storyboard

The first experience is a **full-bleed, muted, autoplaying showreel**. On scroll, the frame zooms into Simran’s **signature** (the bilingual சிம்ரன் / SIMRAN autograph). The mark scales until it becomes the threshold into the next section. The header stays off until that journey is complete.

### Story beats

| Step | Beat | Scroll / time | What happens |
| --- | --- | --- | --- |
| 0 | Preloader (optional) | 0.4–0.8s, not scroll-tied | A single glyph or a short 3–2–1. No logo pile-up. Skip if the poster is already on screen. |
| 1 | Video hold | Pin, first **100vh**. No header. | Full-bleed muted loop. Optional one-line role under the frame, very small. A quiet “Watch reel” control may sit in a corner (sound-on dialog, not a YouTube dump). No nav, no logo, no upcoming bar. |
| 2 | Scroll trigger | Next **20–30vh** of the pin | Scroll takes over. The loop may freeze on a chosen poster frame (or keep playing, very dimmed). A faint signature appears over the footage — small, centred or slightly low, cream or gold. |
| 3 | Signature zoom | Following **150–180vh** of the pin (total pin ≈ **270–310vh**) | The signature is the mask and the vehicle. It scales up (roughly `0.15 → 18–24`) and opens through the video, as if the autograph were a door. Easing: cinematic ease-in-out, scrubbed 1:1 to scroll (GSAP `scrub: 0.6–0.8` or equivalent). |
| 4 | Handoff | Last **20–40vh** of the pin | The scaled signature fills the viewport; its interior (or the mask inverse) reveals the next section — the Reel Wall tease on `#0A0A0A`. The video fades out. The signature can rest as a small mark, or dissolve. Unpin. |
| 5 | Header reveal | After pin end, **400–600ms** | Header fades and slides down (~16–24px). Then it is sticky. Only now may the Credit Crawl appear under it. |

**Do not** show the header, the crawl, or section chrome during steps 1–3. The first frame must feel like a theatre, not a website.

### Scroll distance (proposed, to tune in prototype)

- Total hero pin: **~270–310vh** (hold + trigger + zoom + handoff).
- Desktop: use the full range. Mobile: shorten to **~180–200vh**, keep the same beats.
- Scrub the zoom to scroll; do not autoplay the zoom on a timer.

### Video spec

| Item | Spec |
| --- | --- |
| Role | Muted hero showreel / footage, full-bleed, `object-fit: cover` |
| Autoplay | `muted` + `playsinline` + `loop` + `preload="metadata"`. No sound until “Watch reel”. |
| Length | **8–15s** seamless loop. Not a two-minute reel — that belongs in the dialog. |
| Picture | 16:9 master, **1920×1080** minimum; **2560×1440** preferred. Separate **9:16 or 4:5** crop for mobile, framed on the face. |
| Format | `video/mp4` (H.264, yuv420, +faststart) as the baseline; `video/webm` (VP9) as a progressive enhancement. Poster always required. |
| Weight | Desktop **≤ 4–6 MB**; mobile crop **≤ 2–3 MB**. Compress harder rather than adding a second decorative loop. |
| Poster | Still that **matches the first frame** (and the pause frame if the loop freezes). `WebP` + `JPG` fallback, 1600px wide, sharp, dark. Used immediately, and for `prefers-reduced-motion` / failed autoplay. |
| Fallback | If autoplay is blocked: hold the poster, keep the signature-zoom on scroll. Never leave a blank black frame. |

### Signature asset spec

The zoom needs a real autograph, not a typeset wordmark pretending to be one.

| Item | Spec |
| --- | --- |
| Artwork | Official or commissioned bilingual signature: **சிம்ரன் / SIMRAN** as one mark, both scripts present. Vector only. |
| File | `signature.svg` — a single compound **path** (or a tight group of paths), single colour, no embedded bitmap. ViewBox tight to the ink, with ~8–10% padding so scale-up does not clip. |
| Colour | Fill or stroke in `#F3EDE3` or `#C4A35A` on `#0A0A0A`. One colour in the asset; theme in CSS. |
| Stroke-draw (optional, step 2) | If the mark is a stroke path: `pathLength="1"`, animate `stroke-dashoffset` from 1 → 0 over the 20–30vh trigger (≈ 0.6–0.9s of scrub). Then switch to fill / mask for the zoom. Skip the draw if the autograph is a filled brush; a fade-in is cleaner. |
| Mask | Use the path as an **SVG/CSS mask** (or `clip-path`) on the hero layer. Scale the mask (transform-origin: centre of the mark) until the open area of the signature is larger than the viewport, revealing the next section through the ink. |
| Raster fallback | A 2× PNG of the same mark, for reduced-motion and email/OG only — not for the zoom. |
| Clear space | Do not set type or UI over the signature during the zoom. |

Source the path from a scanned or photographed signature, or a calligrapher working in both scripts. Do not auto-trace a low-res social image.

---

## 4. Header and nav

**Five words only:** Work · About · Reel · Press · Connect.

- Hidden (`opacity: 0`, no pointer events) for the entire pinned hero.
- After the zoom and handoff complete: fade + short slide-down, **400–600ms**, then **sticky**.
- Subsequent behaviour: hide on scroll down, show on scroll up (once it has been revealed once).
- Almost no logo chrome. If a mark is needed after reveal, use a tiny signature or the word **SIMRAN**, not a second lockup.
- Mobile: the same timing; a typographic menu, not a heavy fullscreen gallery.

---

## 5. Upcoming bar — Credit Crawl

Place the crawl **after the header reveal**, as a typographic line directly under the hero (or just under the new sticky header) — never over the video, never as a nav item.

**Line format:** `NOW SHOWING — Title  ·  COMING SOON — Title  ·  SHOOTING — Dharman`

- Three honest states only: now showing, coming soon, shooting / announced. A countdown appears only when a release date is locked, and must flip to NOW SHOWING when the date passes. This is how the current Upcoming module failed (stale titles).
- Slow horizontal crawl, pause on hover. Click opens a still and one line (role, language, status) — not a synopsis.
- Tamil-capable status is welcome (e.g. வருகை / COMING SOON).
- No ticket stubs, no cartoon clappers, no JPG logo strip.

Use current, checked titles only. The present site lists Tourist Family and Dharman (shooting) among recent work — confirm before the crawl ships.

---

## 6. Sitemap and section order

Nav is the five words above. Everything else lives on the page or one level down. Social never sits in the hero.

| Order | Section | Concept |
| --- | --- | --- |
| 1 | **Hero — Title Sequence** | Muted full-bleed reel, signature zoom, then header + Credit Crawl. “Watch reel” is a designed play state, not a raw embed. |
| 2 | **Selected work — The Reel Wall (tease)** | Short horizontal strip of signature and recent films. This is the natural handoff after the zoom. |
| 3 | **About — Three Decades (tease)** | Short editorial portrait and a brief timeline (mid-90s, return, 2020s). Full bio is an archive, not the homepage. |
| 4 | **Reel** | One primary showreel, then a few selected scenes. No wall of identical YouTube thumbnails. |
| 5 | **Work — The Reel Wall (full)** | Complete filmography, filterable by language and era, Tamil first. Signature titles sit larger than the archive. |
| 6 | **Gallery — Afterimage** | Art-directed headshots and editorials. Cursor reveals a second exposure or grade. Separate from the social wall. |
| 7 | **Press — Cover Story** | Magazine-cover treatment: one still, a cover line, honours as typographic bars, pull quotes. Brands may sit here as a quiet strip. |
| 8 | **Social — Moments Wall** | Curated Instagram, compact X, then Follow. After Press, before Connect. |
| 9 | **Connect — Closed Set** | One sentence for press, brands, and professional enquiries; `admin@simran.actor`; a short form; handles. No “show us your talent” copy. |

Footer: typographic close — email, handles, a small signature. No video footer.

---

## 7. Social — Moments Wall

The current site already links the right accounts but only as icons:

- Instagram: [instagram.com/simranrishibagga](https://www.instagram.com/simranrishibagga/)
- X: [x.com/simranbaggaoffc](https://x.com/simranbaggaoffc) (Connect also writes `x.com/SimranbaggaOffc`)

**Do:** Switch Instagram to a professional account if it is not one already. Build a custom, cached wall (Behold JSON or a small Graph API integration). Curate and pin the first row so it reads as stills. Add X once Instagram is right.

**Do not:** Drop a default widget on the homepage, leave a free-plan watermark, put the feed in the hero, replace Afterimage with the feed, or rely on the retired Basic Display API (retired 4 December 2024). Official oEmbed is for single posts, not a wall. Test official X embeds logged out; they can fail.

Preferred path: custom wall + Instagram API, or Behold Starter ($10/month as of November 2026 — confirm before purchase). SnapWidget or Curator only if Instagram and X must ship together quickly, paid and restyled.

---

## 8. Components and references (verified)

Starting points to restyle into this palette — not to drop in raw. All links below were verified on the board, 14 November 2026, Asia/Calcutta.

### Hero, signature zoom, header

- [Cinematic Footage Title — 21st.dev](https://21st.dev/@21st/components/mg-ppl-footage-title)
- [Scroll-Locked Video Hero — 21st.dev](https://21st.dev/@gughigug/components/scroll-locked-video-hero)
- [Hero Video Dialog — Magic UI](https://magicui.design/docs/components/hero-video-dialog) — the sound-on “Watch reel” action
- [Text Animate — Magic UI](https://magicui.design/docs/components/text-animate)
- [GSAP SplitText](https://gsap.com/docs/v3/Plugins/SplitText/)
- [Codrops on-scroll typography demo](https://tympanus.net/Development/OnScrollTypographyAnimations/)
- [Codrops expanding image typography](https://tympanus.net/Development/ImageExpansionTypography/) — a still opening through type; closest cousin to the signature zoom
- [Floating Navbar — Aceternity](https://ui.aceternity.com/components/floating-navbar) — after reveal only
- [Navigation Menu — shadcn/ui](https://ui.shadcn.com/docs/components/base/navigation-menu)
- [Fullscreen Navbars — Framer](https://www.framer.com/marketplace/components/fullscreen-navbars/) — if the build is in Framer; typographic, not a gallery explosion

**Storytelling references:** [Fillos do Vento](https://www.fillos-do-vento.com/) (footage first), [Working Stiff Films](https://www.workingstifffilms.com/) (GSAP journey), [A24](https://a24films.com/), [Beyoncé](https://beyonce.com/), [Dune official](https://www.dunemovie.com/).

### Credit Crawl

- [Magic UI Marquee](https://magicui.design/docs/components/marquee)
- [Scroll-based Velocity — Magic UI](https://magicui.design/docs/components/scroll-based-velocity)
- [Scroll Velocity — React Bits](https://reactbits.dev/text-animations/scroll-velocity)
- [Infinite Moving Cards — Aceternity](https://ui.aceternity.com/components/infinite-moving-cards) — restyle as type, not testimonial cards
- [Sticky Banner — Aceternity](https://ui.aceternity.com/components/sticky-banner) — only if a quieter single-title “In Theatres” line is preferred later

**References:** [Ferrari campaign archive](https://archive.ferrari.antinomy.studio/) (“In Theaters” language), [A24 films](https://a24films.com/films), [MUBI Now Showing](https://mubi.com/en/in/showing), [PVR](https://www.pvrcinemas.com/) and [Showcase](https://www.showcasecinemas.co.uk/) for vernacular only — not as a visual model.

### Reel Wall

- [Horizontal Scroll Gallery — 21st.dev](https://21st.dev/@pulkitxm/components/horizontal-scroll-gallery)
- [GSAP horizontal scrolling gallery](https://demos.gsap.com/demo/horizontal-scrolling-gallery/)
- [Film Strip Gallery — Framer](https://www.framer.com/marketplace/components/film-strip-gallery/)
- [Infinite Slider — Motion Primitives](https://www.motion-primitives.com/docs/infinite-slider)

### Three Decades

- [Timeline — Aceternity](https://ui.aceternity.com/components/timeline)
- [Sticky Scroll Reveal — Aceternity](https://ui.aceternity.com/components/sticky-scroll-reveal)
- [Timeline — Origin UI](https://coss.com/origin/timeline) (Origin now lives at coss.com/origin)
- [Skiper card stack (skiper17)](https://skiper-ui.com/v1/skiper17)

### Bilingual lockup (page titles, not the hero autograph)

- [Text Animate — Magic UI](https://magicui.design/docs/components/text-animate)
- [Text Effect — Motion Primitives](https://www.motion-primitives.com/docs/text-effect)
- [Split Text — React Bits](https://reactbits.dev/text-animations/split-text)
- [Codrops typography demo](https://tympanus.net/Development/OnScrollTypographyAnimations/)

### Cover Story

- [Images Slider — Aceternity](https://ui.aceternity.com/components/images-slider)
- [Feature Carousel — Cult UI](https://www.cult-ui.com/docs/components/feature-carousel)
- [Marquee — Magic UI](https://magicui.design/docs/components/marquee)
- [Layout Grid — Aceternity](https://ui.aceternity.com/components/layout-grid)

### Moments Wall

- [Blur Fade — Magic UI](https://magicui.design/docs/components/blur-fade)
- [Focus Cards — Aceternity](https://ui.aceternity.com/components/focus-cards)
- [Tweet Card — Magic UI](https://magicui.design/docs/components/tweet-card)
- [Direction Aware Hover — Aceternity](https://ui.aceternity.com/components/direction-aware-hover)
- [Instagram API with Instagram Login](https://developers.facebook.com/documentation/instagram-platform/instagram-api-with-instagram-login/get-started)
- [Instagram oEmbed](https://developers.facebook.com/documentation/instagram-platform/oembed)
- [X Publish](https://publish.x.com/)
- [Behold pricing](https://behold.so/pricing/)

### Afterimage

- [Chroma Grid — React Bits](https://reactbits.dev/components/chroma-grid)
- [Cursor Spotlight Reveal — 21st.dev](https://21st.dev/@21st/components/cursor-spotlight)
- [Image Comparison — Motion Primitives](https://www.motion-primitives.com/docs/image-comparison)
- [Lens — Aceternity](https://ui.aceternity.com/components/lens)

### Closed Set, nav, footer

- [shadcn/ui Forms](https://ui.shadcn.com/docs/forms)
- [Origin UI Input](https://coss.com/origin/input)
- [shadcn/ui Input](https://ui.shadcn.com/docs/components/base/input)
- [CinematicFooter — Framer](https://www.framer.com/marketplace/components/cinematicfooter/) — strip heavy grain; prefer type, email, handles

Further references already on the board, for pace and photography: [The 1975](https://the1975.com/), [oklama](https://oklama.com/), [blonded.co](https://blonded.co/), [Chanel](https://www.chanel.com/in/), [Maison Alaïa](https://www.maison-alaia.com/en-us/), [Loewe](https://www.loewe.com/), [Hermès](https://www.hermes.com/us/en/), [Brunello Cucinelli](https://www.brunellocucinelli.com/en/), [MUBI](https://mubi.com/), [NEON](https://www.neonrated.com/), [Netflix Tudum](https://www.netflix.com/tudum).

---

## 9. Implementation notes

**Preferred:** GSAP + ScrollTrigger. Pin the hero wrapper for ~270–310vh. Scrub a timeline: (a) signature draw or fade, (b) scale of the SVG mask / signature from ~0.15 to ~18–24, (c) video opacity → 0, (d) next section revealed through the mask, (e) unpin, then tween the header in. `scrub: 0.6–0.8` keeps the zoom cinematic without feeling loose. `anticipatePin: 1` reduces jump on pin.

**Alternative:** Framer Motion `useScroll` + `useTransform` on the same pin (a sticky hero whose parent is 270–310vh). Map scroll progress `0–0.15` hold, `0.15–0.25` trigger, `0.25–0.85` zoom, `0.85–1` handoff. Reveal the header when progress ≥ 1 (or ≥ 0.98).

**SVG mask zoom:** Put the video (and then the next section) inside a masked wrapper. The mask is the signature path, white ink on black. Scale the mask element, not the video, so the footage stays stable while the autograph opens. Transform-origin: the visual centre of the mark. When the open counter of the letterforms exceeds the viewport, fade the mask to `none` so the next section is a normal document flow. Test the path’s open counters — a fully closed brush will not “open a door”; add a controlled cut or use the path as a growing window around the mark.

**Video:** One `<video>` with `muted playsinline loop`. Pause or `playbackRate → 0` at the start of the zoom if a hold-frame is cleaner. Provide the poster as the first paint.

**Header:** Mount it in the tree but keep it inert until the pin callback `onLeave` / progress 1. Then fade/slide and attach sticky (or a small hide-on-scroll-down observer).

### Mobile and reduced motion

- **Mobile:** Same story, shorter pin (~180–200vh). Use the vertical crop. If the mask scale is too heavy, fall back to a simpler scale of the signature over a fading poster, still ending in the next section. Keep the header hidden until that completes.
- **`prefers-reduced-motion: reduce`:** No pin, no zoom, no autoplay. Show the poster, a static signature, the header already visible, and the Credit Crawl. The “Watch reel” dialog still works.
- **Low bandwidth / failed video:** Poster + static signature + scroll to the Reel Wall. Never a broken video icon over black.

Avoid default component chrome (sparkles, glowing borders, 3D toys). Restyle everything to the Title Sequence palette.

---

## 10. Open questions for the client

1. **Signature.** Is there an official autograph we can vectorise — including a Tamil form — or should we commission a bilingual mark? The zoom cannot ship on a typeset stand-in.
2. **Footage.** Who supplies the showreel, and who clears rights? We need an 8–15s muted loop plus a longer sound-on cut for “Watch reel”, and a poster that matches the first frame. Is there a preferred still for the zoom hold-frame?
3. **Handoff.** Confirm the section after the signature is the Reel Wall tease (recommended). Alternatively it could open into Three Decades.
4. **Crawl titles.** What is actually now showing, coming soon, or shooting, as of launch? Confirm Tourist Family, Dharman, and any other current title so the bar cannot go stale on day one.
5. **“Watch reel”.** A designed in-page dialog (recommended), or a link out? Sound on only after a user gesture.
6. **Instagram.** Is @simranrishibagga already a professional (Business/Creator) account? That gates a proper Moments Wall.
7. **Representation.** Should Closed Set list management or publicity first, and in what wording? The current Connect copy should go.
8. **Tamil display.** Is Noto Serif Tamil acceptable for launch, or is a commissioned Tamil display in scope?
9. **Type licences.** Confirm PP Editorial New vs Cormorant Garamond, and Satoshi vs Inter, including web-licence cover.
10. **Analytics and privacy.** Any requirement to delay or avoid autoplay tracking, and any geoblock on footage?

---

*Board: [Simran — creative pitch](https://cursor.com/canvas/store-2ef9f7ef-3b92-400f-bec3-3dea219e8a70/d2f61d02-7dcf-4852-97d9-daa252762579). Document written 15 November 2026, Asia/Calcutta.*
