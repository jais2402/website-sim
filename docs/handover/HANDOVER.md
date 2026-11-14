# Simran.actor — build handover

**From:** design canvas *Simran.actor — Title Sequence* (Claude Design)
**Canvas:** https://claude.ai/artifact/1PqhAajShHXWVeigN6ampx
**Creative direction:** `simran-direction.md` (in this pack). The direction is "Title Sequence". Where this handover and the brief differ, this handover wins: it records decisions made in design review on 15 Nov 2026.
**Design source:** `design-source/*.dc.html`. Each file is one section, written as HTML with inline styles plus a small logic class. Treat the markup, spacing, colours and interaction logic as the spec. Do not ship it as-is.

---

## 1. Build target

- **Stack (recommended):** Next.js (App Router) + TypeScript, plain CSS modules or Tailwind, and **GSAP + ScrollTrigger** for the hero pin and zoom. No Elementor, no slider plugins.
- **Content:** a headless CMS or JSON files for films, notes, news, awards, shoots, clips and crawl status. Everything marked `[ … ]` in the design is a placeholder and must come from content, never hard-coded.
- **Performance:** hero video ≤ 4–6 MB on desktop and ≤ 2–3 MB on mobile, poster first paint, lazy-load everything below the fold.
- **Accessibility:** every interactive element is a real `<button>` or `<a>`. Hover callouts must also open on keyboard focus. Respect `prefers-reduced-motion` (see §5).

## 2. Design tokens

| Token | Value | Use |
| --- | --- | --- |
| ground | `#0A0A0A` | page |
| ink | `#F3EDE3` | text on dark |
| ink-warm | `#F1E6D2` | Memory Lane / Notes text |
| gold | `#C4A35A` (light `#E3C77F`, deep `#9C7E3C`) | accents, brass plates |
| cinema red | `#7A1F24` (bright `#C8323A`, glow `#E0565E`) | crawl band, Showreel, Interviews, the "next" arrows |
| amber | `#F2C25B` | TV on-screen text, tuner |
| newsprint | `#EFE6D6` → `#DCCFB6` | The Buzz |
| teal wall | `#17313a` → `#0b1a20` | Honours |

**Fonts:**
- Cormorant Garamond (display, often italic)
- Noto Serif Tamil (Tamil)
- Inter (UI/body, 400/500)
- Oswald (poster titles, plates, counters)

**Style rules:**
- Headings are 64px serif with no numbered eyebrows. They were removed site-wide on purpose.
- Container is max 1280px with 32px gutters.

## 3. Page order (homepage)

1. **Hero: Title Sequence.** Full-bleed muted loop, pinned about 270–310vh, signature-mask zoom, then the header reveal. Storyboard: canvas frames *Beat 1–5*. The header is hidden until the zoom completes, then it is sticky and hides when scrolling down.
2. **Header + Credit Crawl.** Nav: Work · About · Reel · Press · Connect. The crawl is a **red band** (`#7A1F24`) scrolling slowly and pausing on hover. It has only three honest states: NOW SHOWING / COMING SOON (வருகை) / SHOOTING. It is data-driven and must auto-flip to NOW SHOWING on the release date.
3. **The Reel Wall.** A premium cinema corridor.
   - Background: espresso wood panelling, a ceiling cove light with downlights, wall-wash light pools, a brass skirting rail and a dark marble floor.
   - Posters: backlit lightbox frames (27:40 key art, glow tinted per film) with a **brass plate** under each showing `YEAR | label`.
   - The row has a slight perspective (`rotateY(-6deg)`). The ← → arrows slide one poster at a time.
4. **Coming Soon & On Set** (`Upcoming`). One card per film:
   - a backlit mini poster and a status (Shooting = red, Coming soon = gold)
   - a 4-step production tracker: Announced → Shooting → Post → In cinemas
   - a release date and a CTA
   - a countdown **only** once a date is locked
5. **The Buzz** (`Buzz`). Vintage newspaper front page on newsprint: masthead with today's date, category chips, a lead story and a numbered Trending list. **Hovering a trending item swaps the lead story.**
6. **Showreel** on a red curtain. A 3D coverflow of five 16:9 screens:
   - Autoplays about 8s per clip, pauses on hover.
   - Clicking a side screen or using the arrows changes clip; a 01 / 05 counter sits up top.
   - Thin progress segments sit under it. The chapter list was removed on purpose.
   - Sound only after the user presses play.
7. **Three Decades** (About tease). Portrait, short bio and a 3-row timeline.
8. **Memory Lane** (`MemoryLane`). A **vintage walnut TV** on a memory wall:
   - Above it: an LED fairy-light string with 7 polaroids on pegs.
   - TV: CRT screen with scanlines and glare, an amber `CH xx` on-screen label and a sepia montage.
   - Channel knob: changes film, rotating the knob with a ~260ms static flash.
   - Auto knob: plays through the films.
   - Tuner strip in the cabinet: **only the years that have films**, with "≈" marks for gaps, a red needle and brass ← → buttons. You can drag along the dial; there is no separate slider bar.
   - Pull quote below the TV.
   - Starts on Kannathil Muthamittal (2002).
9. **Latest Photoshoots.** A column masonry of mixed portrait and landscape ratios (2:3, 4:5, 1:1, 3:2, 4:3, 16:9) with no titles. Hover or tap shows an optional message plus a **Download** button. Top-right: **View all →**.
10. **Cover Story** (Press). Magazine cover, cover line and pull quote. The honours list moved to Honours.
11. **Honours** (`Awards`). A **trophy wall**, inspired by office trophy shelves:
    - Deep teal wall with a diagonal warm light beam, staggered floating walnut shelves with brackets, and gold/silver cups, a star, a glass crystal and a framed medal plaque.
    - **Hover/focus:** the trophy lifts 10px with a gold glow, and a cream citation card springs up above it (opacity 260ms; transform 380ms `cubic-bezier(.2,.9,.3,1.25)`, scale .92→1, y 14→0).
    - Trophies must stay generic. **Do not replicate real statuettes.**
12. **Interviews & Articles** on red. A featured panel beside a filterable list (All / Interviews / Articles / Video). **Hovering a row swaps the featured panel**: video rows show a play frame with a muted preview, article rows show a masthead, a pull quote and text lines.
13. **Notes from Simran** (`FanNotes`). A message board to fans: a letter on cream stationery with a wax "S" seal, occasion and date, and a sign-off, plus a list of earlier notes. Hover or click crossfades the letter (180ms out, 420ms in). It has a "Send your wishes" CTA. **Notes are published only in Simran's own words.**
14. **Moments** (`SocialWall`). A mixed Instagram + X masonry with filters, and post handles linking to the profiles.
    - **Follow Simran** panel: Instagram @simranrishibagga, X @simranbaggaoffc, YouTube @simranandsonsfilms6873, Facebook Simranbaggaofficial.
    - Feed: cached, via the Instagram Graph API or Behold. No raw widgets, and not the retired Basic Display API.
15. **Connect: Closed Set.** One line, admin@simran.actor, and a form (Name, Email, Enquiry type, Message).
16. **Footer.** Bilingual mark, email and handles.

*Parked, not on the homepage:* the `New-Movies` 16:9 block. Its content is covered by the Reel Wall and Coming Soon.

## 4. Assets needed from the client (blocking)

- **Official bilingual autograph** (சிம்ரன் / SIMRAN) as a vector. The hero zoom can't ship on a typeset stand-in.
- Hero loop (8–15s, 16:9 plus a 9:16 crop), a matching poster, the showreel and scene clips, and the montage per era for Memory Lane.
- Licensed key art for every Reel Wall and Coming Soon poster, plus photoshoot images and credits.
- **Photos of Simran:** use only files supplied or cleared by her team. Do not scrape them from the web or the old site.
- Confirmed data:
  - crawl titles
  - Dharman's role and language
  - award years, films and bodies (each marked `[confirm]`)
  - Memory Lane film list and years
  - notes text, news items and interview links

## 5. Motion and responsive rules

- `prefers-reduced-motion`: no pin, zoom or autoplay. Show the poster plus a static signature, and the header visible from the start. Carousels become static lists, and callouts show without movement.
- **Mobile:**
  - Hero pin about 180–200vh with the vertical crop.
  - The Reel Wall drops the perspective and becomes a swipeable row.
  - The Showreel coverflow becomes a flat swipe.
  - The Memory Lane TV scales down with its knobs below the screen, and the tuner scrolls horizontally.
  - Honours shelves stack, and the callout becomes a tap sheet.

These mobile layouts still need design sign-off; the only finished mobile design is the hero.

## 6. Acceptance

- The page order matches §3.
- Every hover interaction also works with keyboard focus and with touch (tap).
- No placeholder text ships: CMS validation must block `[ … ]` strings.
- Lighthouse scores ≥ 90 for performance and accessibility on desktop and mobile.
- The crawl and Coming Soon statuses cannot go stale (date-driven).
