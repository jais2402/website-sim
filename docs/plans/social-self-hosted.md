# Assessment: our own social feed service (no Behold)

Status: assessment only, nothing built. Written 25 November 2026. It follows on from [social-integration.md](./social-integration.md), which recommended Behold for Instagram and the paid X API. The question here is whether we can run the fetching ourselves, cheaply and within each platform's rules, and still feed the existing data shape (`platform, handle, profile, url, when, text, ratio, image`) used by `Moments` and `SocialWall`.

> Source note: docs.x.com and developers.facebook.com could not be opened directly from this environment, so the facts below come from search results that quote those pages. Anything marked **(verify)** needs checking in the vendor console before we build.

## Verdict

| Platform | Self-built? | How |
|---|---|---|
| Instagram | **Yes** | Official Instagram API with Instagram Login. No API fee, no App Review. We have to keep the token refreshed and keep our own copies of the images. |
| X | **Partly** | No free automated option is both compliant and stable. Two compliant routes: (a) a curated list of post URLs rendered through the official oEmbed endpoint, which is free, or (b) the official X API with owned reads, which costs cents a month. Nitter, RSSHub, scraping and the private syndication endpoint are ruled out. |

## 1. Instagram, self-built

**Is it free and allowed?** Yes. Meta charges nothing for the API. An app that serves only accounts we own or manage gets **Standard Access**, and Meta lists App Review as "Not required" for it. Advanced Access, which needs App Review and Business Verification, applies only to apps serving other people's accounts. ([App Review](https://developers.facebook.com/docs/instagram-platform/app-review), [Business Login](https://developers.facebook.com/documentation/instagram-platform/instagram-api-with-instagram-login/business-login))

**What the client sets up (about 30 minutes, with whoever holds the Instagram login):**
1. Switch @simranrishibagga to a **Creator or Business** account. Followers and posts are unaffected. Instagram Login doesn't need a linked Facebook Page. ([Overview](https://developers.facebook.com/documentation/instagram-platform/overview))
2. Create a Meta developer account and an app with the Instagram product, choosing "API setup with Instagram login". ([Create an app](https://developers.facebook.com/documentation/development/create-an-app/other-app-types/instagram-apis))
3. Add her account to the app as an Instagram tester and accept the invite in Instagram. The exact menu path changes often **(verify)**.
4. Grant **only `instagram_business_basic`**. The old `business_basic` names were withdrawn in January 2025. ([Phyllo](https://www.getphyllo.com/post/instagram-api-permissions-scopes))
5. Generate the first token in the App Dashboard and send it to us over a secure channel. I couldn't confirm whether the app can stay in Development mode for a tester-only account **(verify)**.

**Tokens.** A short-lived token lasts 1 hour and is exchanged for a **long-lived token that lasts 60 days**. Calling `GET https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=…` returns a token valid for another 60 days. A token can only be refreshed once it is at least 24 hours old and not yet expired. If it lapses, someone has to log in by hand again. ([refresh_access_token](https://developers.facebook.com/documentation/instagram-platform/reference/refresh_access_token), [access_token](https://developers.facebook.com/documentation/instagram-platform/reference/access_token)) Because the token changes, it can't sit in a static environment variable. The job stores it, refreshes it weekly, and sends an alert if a refresh fails, which leaves about 50 days to fix the problem.

*Alternative:* the Graph API through her Facebook Page (`Simranbaggaofficial`) with Facebook Login. A Page token derived from a long-lived user token is generally reported not to expire, which would remove the refresh job. It needs the Page linked to the Instagram account and more permissions (`instagram_basic`, `pages_show_list`, `pages_read_engagement`) **(verify)**. Use it only if refreshing tokens turns out to be a problem.

**Rate limits.** Business Use Case limit: roughly 4,800 × the account's impressions per 24 hours **(verify; third-party sources)**. ([bundle.social](https://bundle.social/blog/instagram-api-rate-limits), [Phyllo](https://www.getphyllo.com/post/navigating-instagram-api-rate-limit-errors-a-comprehensive-guide)) Our job makes about 2 calls an hour, which is well under that.

**Fetch:** `GET /me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,children{media_type,media_url,thumbnail_url}&limit=12`, pinned to an explicit API version. Since July 2026 `media_url` can be missing on video, so fall back to `thumbnail_url`. ([Changelog](https://developers.facebook.com/documentation/instagram-platform/changelog))

**Images.** CDN URLs are signed and expire. The `oe` parameter holds the expiry, usually a few days ahead, after which the URL returns "URL signature expired". This is reported by the community, not documented by Meta. ([Iframely](https://iframely.com/help/015914-how-to-deal-with-expiring-images-of-tik-tok-and-instagram), [Webflow forum](https://discourse.webflow.com/t/instagram-zapier-expired-cdn-urls/149617)) The job downloads each **new** media id once, converts it with `sharp` to a WebP 1080 px wide, records width and height for `ratio` (clamped to 4:5 for tall reels), and serves the result from our own storage. It never links to Instagram's CDN.

## 2. X, self-built

| Option | Compliant? | Stable? | Verdict |
|---|---|---|---|
| **X API v2, pay-per-use** | Yes | Yes (paid) | Recommended if posts should appear automatically |
| **oEmbed (`publish.x.com/oembed`) on curated URLs** | Yes, it's a documented public endpoint with no auth | Mostly | **Recommended free option** |
| Syndication / `cdn.syndication.twimg.com` (used by `react-tweet`) | Undocumented; not covered by any developer terms | Has broken before (token added in Aug 2023) | Don't depend on it |
| Nitter / RSSHub | No. They need a logged-in account cookie (`TWITTER_COOKIE`), which counts as scraping | No. Nitter got a cease-and-desist in Aug 2026 and most instances are down | **Rule out** |
| Direct scraping | No. The Terms ban crawling without written consent | No | **Rule out** |

**X API.** Pay-per-use credits have replaced the subscription tiers. Ordinary post reads cost **$0.005** each. **Owned reads**, meaning your own account's data such as `GET /2/users/:id/tweets`, cost **$0.001** each. A resource is billed once per 24-hour UTC window, however often you request it. There is no general free tier for new developers. ([Pricing](https://docs.x.com/x-api/getting-started/pricing), [bundle.social](https://bundle.social/blog/x-api-pricing-2026-costs-limits), [Open Terms Archive](https://opentermsarchive.org/en/memos/x-replaces-its-dollar200-entry-level-api-plan-with-a-pay-per-use-model/)) To get the owned rate, the developer account should be created under @simranbaggaoffc, and requests may need to use her user-context OAuth token rather than an app bearer token **(verify)**. The minimum credit purchase is also unconfirmed **(verify)**.

Cost at an hourly refresh reading the latest 5 posts: deduplication means each post is billed about once a day, so 5 × 30 ≈ 150 reads a month. That is **about $0.15 at the owned rate or about $0.75 at the standard rate**. The earlier plan's estimate of $3.60 didn't account for deduplication.

**oEmbed with curation.** The team pastes post URLs into `content/social-x.json`. The job calls `https://publish.x.com/oembed?url=…&omit_script=true` and stores the returned `<blockquote>` (text, date, link). We render it with our own CSS and never load `widgets.js` or an iframe, so the site design and privacy stance are unchanged. ([oEmbed docs](https://docs.x.com/x-for-websites/oembed-api), [legacy page: no auth, no rate limit](https://developer.x.com/en/docs/x-for-websites/oembed-api)) For `Moments` we need only the text, the URL and the date, because X tiles have no image. Keep the post text intact and link back to X. Restyling the blockquote is generally accepted, but whether pulling the text into our own card meets X's display requirements is unconfirmed **(verify)**. On each run, a 404 from oEmbed means the post was deleted, so we drop it. This meets the 24-hour removal rule. ([Developer Policy](https://docs.x.com/developer-terms/policy))

**Legal background:** X's Terms ban scraping and set liquidated damages of $15,000 per million posts accessed in 24 hours. Our volumes are tiny, but the ban applies at any volume. ([TechCrunch](https://techcrunch.com/2023/09/08/x-updates-its-terms-to-ban-crawling-and-scraping), [ConductAtlas](https://conductatlas.com/platform/x/x-terms-of-service/acceptable-use-and-scraping-prohibition/), [Nitter C&D, TechCrunch](https://techcrunch.com/2026/08/25/x-sends-cease-and-desist-to-open-source-project-nitter-over-alleged-scraping/), [Privacy Guides](https://www.privacyguides.org/news/2026/08/26/x-com-sends-privacy-frontend-nitter-a-cease-and-desist-permanently-shuts-it-down/), [RSSHub cookie config](https://www.github.com/DIYgod/RSSHub/pull/15384), [react-tweet](https://www.stefanjudis.com/blog/how-to-prerender-tweets-without-using-the-official-twitter-apis))

## 3. Recommended self-hosted design

The host isn't chosen yet, so the design is host-agnostic: **one scheduled GitHub Actions job writes a snapshot, and the site reads it.**

```
.github/workflows/social-sync.yml   cron "17 * * * *" + workflow_dispatch
scripts/social/
  sync.ts          entry: refresh token if due → fetch IG → fetch X → write snapshot
  instagram.ts     /me/media, field mapping, video/carousel fallbacks
  x.ts             mode "oembed" (curated) | "api" (owned reads, since_id)
  images.ts        download new ids, sharp → webp, width/height → ratio
  token-store.ts   read/refresh/save IG token; alert on failure
content/social-x.json        curated X URLs (team edits)
content/social-live.json     generated snapshot, SocialPost[] + fetchedAt
src/lib/social/index.ts      getSocialPosts(): live snapshot + curation + fallback to social.json
```

There are two storage variants:

- **A. Commit to repo (simplest and free).** Images go to `public/media/social/ig/{id}.webp` and the snapshot to `content/social-live.json`. The job commits only when something changed, and the host redeploys on push. The token is stored as a repo secret and rewritten with `gh secret set` using a fine-grained PAT. The cost is a few small commits a week. GitHub disables scheduled workflows after 60 days without repo activity in public repos **(verify for this repo)**.
- **B. Vercel-native (if we host on Vercel Pro).** A Vercel Cron route `/api/cron/social` writes images and `social-live.json` to **Vercel Blob** and keeps the token in Upstash Redis or Edge Config. Pages read the JSON with `fetch(..., { next: { revalidate: 3600, tags: ['social'] } })`. Hobby crons run **once a day at most**, and Hobby is for non-commercial use, so this variant needs Pro. ([Vercel cron limits](https://vercel.com/docs/schedules/cron-jobs/usage-and-pricing), [Blob pricing](https://vercel.com/docs/vercel-blob/usage-and-pricing))

Either way, failures leave the last good snapshot in place, and `social.json` remains the final fallback, as described in the earlier plan (§6).

**Env/secrets:** `IG_ACCESS_TOKEN` (rotated by the job), `IG_TOKEN_REFRESHED_AT`, `X_MODE` (`oembed`|`api`), `X_USER_ID` and `X_BEARER_TOKEN` (API mode only), `GH_SECRETS_PAT` (variant A), `BLOB_READ_WRITE_TOKEN` / `KV_*` (variant B), `ALERT_WEBHOOK` or an email address, and `REVALIDATE_SECRET`.

## 4. Cost and effort

| | Behold + X API (earlier plan) | Self-built (IG API + X oEmbed) | Self-built (IG API + X API) |
|---|---|---|---|
| Recurring fees | Behold Starter ~$10/mo **(verify)** + X ~$0.15–0.75/mo | **$0** (GitHub Actions minutes and storage fit free tiers) | ~$0.15–0.75/mo + any minimum credit purchase |
| Hosting impact | none | none (variant A); needs Vercel Pro (~$20/mo per seat) for variant B, which we'd likely need anyway for a commercial site | same |
| Build effort | 2–3 d IG + 1.5–2 d X | **IG 3–4 d** (token store, refresh, images, mapping, tests) + **X 1 d** | IG 3–4 d + X 1.5–2 d |
| Ongoing upkeep | low; Behold absorbs Meta changes | ~1–2 h/month: watch alerts, re-authorise if a refresh fails, bump the Graph API version every year or two, update the X URL list | same, minus manual X curation |

Self-building saves about $120 a year but adds about 1–1.5 days of build time plus ongoing upkeep. The real benefits are elsewhere: no third party in the data path, no view-count limits, image copies we control and archive, and a single job that serves both platforms.

## 5. Risks

- An Instagram token lapse (a failed refresh left unnoticed for 50 days, or a password or permission change) means manual re-authorisation. Alerts mitigate this.
- Meta changes fields or behaviour, such as the 2026 change to `media_url` on video.
- oEmbed output or availability changes, or X tightens its display rules. The fallback is to switch `X_MODE=api`.
- Photo rights for reposted shoot images (see the earlier plan §7).
- Missed scheduled runs. GitHub cron is best-effort and can run late.

## 6. Prototype plan

1. **Client (day 0):** switch the Instagram account to Creator/Business, create the Meta app, add her as tester, generate a token, and send it over a secure channel. Decide on X oEmbed (free) or X API (create the developer account under @simranbaggaoffc and load $5–10 of credits).
2. **Day 1:** `scripts/social/instagram.ts` + `images.ts`. Run locally against the real account and write `content/social-live.json` plus WebP files. Check video, carousel and reel ratios.
3. **Day 2:** `token-store.ts` (refresh when older than 7 days, alert on error) and `.github/workflows/social-sync.yml` running hourly at :17, committing only on a diff.
4. **Day 3:** `x.ts` in oEmbed mode with `content/social-x.json`, deleted-post pruning, and an API-mode stub behind `X_MODE`.
5. **Day 4:** `src/lib/social/index.ts`. Wire `page.tsx` and the Connect page to `getSocialPosts()`, fill pins and hides from the curation file, add fallback tests, and review on staging.
6. **Later:** if the site goes to Vercel Pro, move storage to variant B without changing the snapshot format.
