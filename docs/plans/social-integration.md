# Plan: Instagram and X on the Moments wall

Status: plan only, not implemented. Written 25 November 2026. Scope: `Moments` (homepage scene 11, first 4 posts) and `SocialWall` (Connect page). Requirements come from HANDOVER.md §3 item 14 and simran-direction.md §7: a cached feed, no raw widgets, not Basic Display, the team pins the first row, and X only after Instagram works.

> Source note: Meta, X and Behold doc pages could not be fetched directly from this environment, so the facts below come from search results that quote those pages. Check every figure marked **verify** in the vendor console before you buy anything.

## 1. Facts this plan relies on

**Instagram API with Instagram Login**
- Works only with a **professional (Business or Creator) account**. The permission needed to read our own media is `instagram_business_basic`. [Overview](https://developers.facebook.com/documentation/instagram-platform/instagram-api-with-instagram-login), [Business Login](https://developers.facebook.com/documentation/instagram-platform/instagram-api-with-instagram-login/business-login)
- **No App Review** is needed for an app that serves only accounts we own or manage (Standard Access). Advanced Access requires App Review and Business Verification, and we don't need it. [App Review](https://developers.facebook.com/docs/instagram-platform/app-review)
- A short-lived token (1 h) is exchanged for a **long-lived token that lasts 60 days**. It can be refreshed once it is at least 24 h old and not yet expired, and each refresh gives another 60 days. If it lapses, someone has to log in again by hand. [access_token](https://developers.facebook.com/documentation/instagram-platform/reference/access_token), [refresh_access_token](https://developers.facebook.com/documentation/instagram-platform/reference/refresh_access_token)
- Rate limits are Business Use Case limits, roughly 4800 × impressions per 24 h (**verify**). An hourly fetch is far below that. [Meta rate limiting](https://developers.facebook.com/docs/graph-api/overview/rate-limiting/)
- Media fields: `id, caption, media_type (IMAGE|VIDEO|CAROUSEL_ALBUM), media_url, thumbnail_url (video only), permalink, timestamp, children{…}`. Since the 30 July 2026 changelog, **`media_url` can be missing on video**, and Meta says to fall back to `thumbnail_url` or `permalink`. [IG Media](https://developers.facebook.com/documentation/instagram-platform/reference/instagram-media), [Changelog](https://developers.facebook.com/documentation/instagram-platform/changelog)
- **CDN URLs are signed and expire.** The `oe` parameter holds a hex expiry time, and expired URLs return "URL signature expired". Meta doesn't document this; the evidence is community reports. [dev.to](https://dev.to/alex97po/pre-signed-url-expiry-how-to-detect-when-your-media-urls-will-break-4g74), [Iframely](https://iframely.com/help/015914-how-to-deal-with-expiring-images-of-tik-tok-and-instagram)

**Behold**
- Plans: Free $0 (1,200 views/mo, 1 feed, daily updates), Starter $10, Pro $30, Business $60, Scale $180. Every plan includes JSON feeds, and each request to the feed URL counts as one view. A second Behold page shows different terms (**verify**). [Pricing](https://behold.so/pricing)
- The JSON is `{ …metadata, posts: [...] }`. Each post has `mediaType`, `mediaUrl` (the video source for video), `sizes.{small,medium,large,full}.{mediaUrl,width,height}` (taken from the thumbnail or first frame for video), `children` for carousels, `permalink`, `timestamp`, `caption` and `prunedCaption`. [JSON Feeds](https://behold.so/docs/json-feeds)

**X API v2**
- **Pay-per-use credits; the subscription tiers are gone** (the $200 Basic plan was retired in 2026). Posts read cost **$0.005 each**. "Owned reads" cost **$0.001** when the app belongs to the same account whose posts it reads. The monthly cap is 2M or 3M post reads, depending on the source (**verify**). [Pricing](https://docs.x.com/x-api/getting-started/pricing), [Open Terms Archive memo](https://opentermsarchive.org/en/memos/x-replaces-its-dollar200-entry-level-api-plan-with-a-pay-per-use-model/)
- Endpoint: `GET /2/users/:id/tweets`. The per-15-minute limits are listed in the console (**verify**). [Rate limits](https://docs.x.com/x-api/fundamentals/rate-limits)
- Terms: content must be removed **within 24 h** when it is deleted or made unavailable on X. Posts must be shown intact, and **X content may not be shown in iframes** (use official embeds or render it ourselves). [Developer Policy](https://docs.x.com/developer-terms/policy), [Developer Agreement](https://docs.x.com/developer-terms/agreement)
- Official embeds and oEmbed (`publish.x.com/oembed`) are documented but have a history of showing an empty "Nothing to see here" box to logged-out visitors. [oEmbed](https://docs.x.com/x-for-websites/oembed-api), [ShortPoint known issue](https://support.shortpoint.com/support/solutions/articles/1000318706)

## 2. Recommended architecture

```
src/lib/social/
  types.ts        SocialPost (extended), FeedResult
  instagram.ts    fetchInstagram(): Behold adapter (Phase 1), Graph adapter (optional)
  x.ts            fetchX(): X API v2 adapter (Phase 2)
  curate.ts       merge pinned + hidden + live, interleave platforms
  index.ts        getSocialPosts(): try live, else fall back
content/social.json            fallback posts + follow panel (unchanged role)
content/social-curation.json   { pinned: [...ids|permalinks], hidden: [...] }
```

- **Fetch on the server only.** `page.tsx` and `connect/page.tsx` call `getSocialPosts()` in place of importing `social.posts`. `SocialWall` already promises never to load a widget or call a network, so it stays a client component that receives plain data. `Moments` keeps receiving `posts.slice(0, 4)`.
- **Caching:** use `fetch(url, { next: { revalidate: 3600, tags: ['social'] } })`, which matches the pages' existing `revalidate = 3600`. A secret-protected route handler `POST /api/revalidate-social` calls `revalidateTag('social', 'max')` so the team can publish a new pin straight away. (Check that signature against `node_modules/next/dist/docs` for Next 16.)
- **Secrets** go in host environment variables and never in `NEXT_PUBLIC_*`: `BEHOLD_FEED_URL`, `X_BEARER_TOKEN`, `X_USER_ID`, `REVALIDATE_SECRET`. These need a new `.env.example`.
- **Token refresh** applies only if we use the Graph API directly. A long-lived token can't live in a static env var because it changes every refresh. Store it in a small KV (Upstash, Vercel KV or Edge Config). A weekly cron route (`/api/cron/instagram-token`) refreshes it when it is more than 7 days old and alerts by email if a refresh fails. Behold removes this job entirely.

## 3. Data mapping and type changes

Extend `SocialPost` in a backward-compatible way. Existing JSON stays valid and `Moments.Post` remains a subset of it.

```ts
id?: string            // IG media id / X post id; key for pin/hide
date?: string          // ISO timestamp; `when` is derived from it ("12 Nov 2026")
kind?: 'image' | 'video' | 'carousel' | 'text'
alt?: string           // team-written alt for pinned items; otherwise ""
pinned?: boolean
```

| SocialPost | Instagram (Behold / Graph) | X v2 |
|---|---|---|
| platform, handle, profile | constants from `follow.profiles` | constants |
| url | `permalink` | `https://x.com/simranbaggaoffc/status/{id}` |
| date / when | `timestamp` | `created_at` |
| text | `prunedCaption` / `caption`, trimmed to about 220 chars | `text` (decode entities; expand `entities.urls`) |
| image | `sizes.large.mediaUrl` / `media_url`; for video `thumbnail_url`; for carousel `children[0]` | first `attachments.media_keys` photo `url`, else `null` |
| ratio | `sizes.large.width / height` (Graph: measure with `sharp` while mirroring) | from media `width/height` |

Change the hard-coded `ratio ?? '1 / 1'` so it is used only when nothing better is known. Reels are 9:16, so clamp very tall media to `4 / 5`, which suits the masonry.

## 4. Images

Don't hotlink `cdninstagram.com` / `fbcdn.net` URLs. A page cached for an hour, or an optimiser cache keyed by URL, will start serving broken images once the signature expires.

- **With Behold:** use its pre-sized renditions and add Behold's image host to `images.remotePatterns` if we switch to `next/image` (the current components use `<img>`). **Verify** that Behold's URLs are stable.
- **With the Graph API:** during the fetch, copy each new media id's image into object storage (Vercel Blob or S3/R2) at `social/ig/{id}.webp` and serve that stable URL. This gives us dimensions for `ratio` and keeps an archive in case the API goes down.

## 5. Curation and pinning

`content/social-curation.json` is edited by PR, or by a CMS later:

```json
{ "pinned": ["DCx…", "https://www.instagram.com/p/…/"], "hidden": ["179…"], "maxX": 3 }
```

Merge order:
1. Pinned items in the listed order, which fill the first row and therefore all of the homepage `Moments`.
2. Live Instagram posts, newest first, with hidden and duplicate posts removed.
3. X posts mixed in at no more than one per three Instagram posts, capped by `maxX`.

If a pinned post is missing from the live feed, it falls back to its entry in `social.json`, so stills that have been art-directed never vanish.

## 6. Fallback

`getSocialPosts()` wraps each platform in a timeout (about 5 s) and a try/catch. If one platform fails, its posts come from `content/social.json` and the other platform stays live. If both fail, the page renders all of `social.json`. A failed ISR revalidation also keeps serving the last good page. Log failures to stdout or Sentry, and never break the page build. Replace the `[Date]` and `[Caption]` placeholders in `social.json` with real posts before launch so the fallback looks finished.

## 7. Moderation and legal

- Only her own accounts are shown: no hashtags, mentions or comments. The `hidden` list removes a post within an hour, or immediately via the revalidate route.
- X compliance: each refresh fetches posts again, so deleted posts drop off within 1 h, well inside the 24 h limit. Pinned X posts must be checked on every refresh and dropped if they no longer exist. Render X content intact (no edited text) with a link back to the post, and never inside an iframe.
- Instagram: link every tile to its `permalink` and follow the Meta Platform Terms and Developer Policies.
- Photo rights: shoot photographers or brands may limit where an image is reused. Ask the team to confirm that reposting to the website is covered.
- Privacy: no tracking embeds load, which is a plus. Add a mention of Behold and X as data sources to the privacy notice.

## 8. What the client's team must provide

1. Switch @simranrishibagga to a **Creator or Business** account, if it isn't one already. Followers and posts are unaffected.
2. **Phase 1 (Behold):** a Behold account on Starter ($10/mo, **verify**), connected by someone who can log in to Instagram. Then hand over the feed URL.
   **Phase 1 (Graph API, alternative):** a Meta developer account plus a Meta app with Instagram Login, with her account added as a tester. Then the one-time login to issue the token.
3. **Phase 2:** an X developer account, ideally created **under @simranbaggaoffc** so reads are billed at the owned-read rate, with prepaid credits ($10–20 is enough to start) and a spending limit set.
4. A named person who curates the pin and hide lists and receives alerts when a token or fetch fails.

## 9. Phased rollout and effort

| Phase | Work | Effort |
|---|---|---|
| 0 | Account switch, real fallback posts in `social.json`, curation file | 0.5 day |
| 1a | Behold adapter, type changes, merge and fallback, page wiring, revalidate route, tests | 2–3 days |
| 1b | *(instead of 1a)* Graph API adapter, KV token store and refresh cron, image mirroring to Blob, alerts | 4–6 days |
| 1c | Review on staging: video, carousel and tall reels; logged-out and slow network; empty feed | 0.5 day |
| 2 | X adapter (`/2/users/:id/tweets?max_results=5&exclude=replies,retweets`, `since_id`), compliance check for pinned posts, mixing rules | 1.5–2 days |

Expected X cost: hourly refresh × 5 posts ≈ 3,600 reads a month, about $3.60 at the owned rate or $18 at the standard rate. Fetching every 3 h and using `since_id` cuts that further.

## 10. Decisions for the client

| # | Decision | Recommendation |
|---|---|---|
| 1 | **Behold or direct Graph API for Instagram** | **Behold Starter.** It is cheap, handles token refresh and image hosting, and takes about half the build time. Keep it behind an adapter so we can switch to the Graph API later. |
| 2 | Is the account professional yet? | Switch it now; nothing in Phase 1 can be built without it. |
| 3 | Show X as live API posts, curated links or an official embed? | Live API with owned reads. Embeds fail for logged-out visitors and break the design; curated links in JSON are a free fallback if no budget is approved. |
| 4 | Refresh interval | 1 h (already the site default), plus an on-demand revalidate. |
| 5 | Show videos as video? | No. Show the poster frame and link out; that is lighter and matches "reads as stills". |
| 6 | Who owns curation and alerts | A named person on the team; through PRs for now, with a CMS later. |
| 7 | Where the site is hosted (affects KV, Blob and cron) | Confirm. Vercel makes cron, KV and Blob simplest if we take the Graph API route. |
