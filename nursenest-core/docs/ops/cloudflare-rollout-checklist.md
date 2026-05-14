# Cloudflare Edge Caching Rollout Checklist

**Origin:** `https://nursenestcore-njhcf.ondigitalocean.app`  
**Production domain:** `nursenest.ca`  
**Config reference:** `docs/ops/cloudflare-cache-rules.md`  
**Verification script:** `npm run verify:cache`

---

## Pre-Rollout Checklist

### 1. Cloudflare Account Setup

- [ ] NurseNest account at [dash.cloudflare.com](https://dash.cloudflare.com)
- [ ] Zone `nursenest.ca` is active in Cloudflare
- [ ] Nameservers updated at domain registrar to Cloudflare nameservers
- [ ] Zone status is **Active** (not Pending)
- [ ] API Token created with permissions:
  - `Zone: Cache Purge` (for post-deploy cache purge)
  - `Zone: Cache Rules: Edit` (for creating cache rules)
  - Store as `CF_ZONE_ID` and `CF_API_TOKEN` env vars

### 2. Origin Verification (grey-cloud DNS, no proxy)

> Run before enabling Cloudflare proxy. Grey-cloud DNS = Cloudflare resolves DNS but does NOT proxy traffic.

```bash
# Set DNS record to grey cloud (DNS only) in Cloudflare
# Then verify origin is healthy:

BASE_URL=https://nursenest.ca node nursenest-core/scripts/verify-cloudflare-cache.mjs --cold-only
```

**Expected results:**
- [ ] All SEO routes return HTTP 200
- [ ] `CF-Cache-Status` header is ABSENT (Cloudflare not yet proxying)
- [ ] `Cache-Control` on ECG/CNPLE/blog routes contains `s-maxage=3600`
- [ ] `Cache-Control` on `/app/*` is `private, no-cache, no-store, must-revalidate`
- [ ] `CDN-Cache-Control: no-store` present on `/admin/*`, `/app/*`, `/account/*`
- [ ] No 5xx errors on any route

### 3. Cache Rules Configuration

Create the three cache rules in Cloudflare Dashboard → Caching → Cache Rules:

**Rule 1 — Bypass: Auth cookies (Priority 1)**

- [ ] Created with expression matching all 4 auth cookie names
- [ ] Action: `Bypass cache`
- [ ] Priority: 1 (highest)

Cookie names covered:
```
next-auth.session-token
__Secure-next-auth.session-token
authjs.session-token
__Secure-authjs.session-token
```

**Rule 2 — Bypass: Private routes (Priority 2)**

- [ ] Created matching `/app*`, `/admin*`, `/account*`, `/checkout*`, `/modules*`, `/login`, `/signup`
- [ ] Action: `Bypass cache`
- [ ] Priority: 2

**Rule 3 — Cache: Public SEO HTML (Priority 3)**

- [ ] Created matching ECG/CNPLE/blog paths
- [ ] Action: `Cache Everything`
- [ ] Edge TTL: `Respect existing headers`
- [ ] Priority: 3

### 4. Zone Settings Verification

- [ ] Rocket Loader: **Off** (prevents Next.js hydration conflicts)
- [ ] Auto Minify (HTML/CSS/JS): Off (Next.js already handles this)
- [ ] Brotli: On
- [ ] HTTP/2: On
- [ ] HTTP/3 (QUIC): On
- [ ] Always Online: On
- [ ] Development Mode: Off
- [ ] Browser Cache TTL: Respect Existing Headers

---

## Rollout Procedure

### Step 1: Enable Cloudflare proxy (orange cloud)

In Cloudflare DNS, change the `nursenest.ca` / `www.nursenest.ca` CNAME record from DNS-only (grey cloud) to Proxied (orange cloud).

**Rollback:** Switch back to grey cloud immediately if issues arise. Takes ~30 seconds to propagate.

### Step 2: Immediate verification (first 5 minutes)

```bash
# Run immediately after enabling proxy
BASE_URL=https://nursenest.ca node nursenest-core/scripts/verify-cloudflare-cache.mjs
```

**Expected:**
- [ ] SEO pages return `CF-Cache-Status: MISS` (first hit per PoP)
- [ ] Private routes return `CF-Cache-Status: BYPASS`
- [ ] No 5xx errors
- [ ] HTTPS works (Cloudflare SSL active)

### Step 3: Cache warm-up (5–10 minutes after proxy enable)

```bash
# Wait for cache to warm, then re-run
sleep 120
BASE_URL=https://nursenest.ca node nursenest-core/scripts/verify-cloudflare-cache.mjs
```

**Expected:**
- [ ] ECG routes: `CF-Cache-Status: HIT` ✅
- [ ] CNPLE routes: `CF-Cache-Status: HIT` ✅
- [ ] Blog posts: `CF-Cache-Status: HIT` ✅
- [ ] Homepage `/`: `CF-Cache-Status: DYNAMIC` or `MISS` (expected — always dynamic)
- [ ] `/app/*`: `CF-Cache-Status: BYPASS` ✅

### Step 4: Auth bypass verification

```bash
# Use a real session cookie to verify bypass
VERIFY_SESSION_COOKIE="<paste-session-token-value>" \
BASE_URL=https://nursenest.ca \
node nursenest-core/scripts/verify-cloudflare-cache.mjs
```

**Expected:**
- [ ] Requests with session cookie on `/advanced-ecg-nursing` return `CF-Cache-Status: BYPASS`
- [ ] No authenticated user data leaked in any `CF-Cache-Status: HIT` response

### Step 5: TTFB measurement

```bash
BASE_URL=https://nursenest.ca node nursenest-core/scripts/verify-cloudflare-cache.mjs
```

**Expected TTFB targets:**

| Route | Before CF | After CF (HIT) | Pass? |
|---|---|---|---|
| `/advanced-ecg-nursing` | ~1000ms | **< 50ms** | [ ] |
| `/ecg/stemi-localization` | ~1000ms | **< 50ms** | [ ] |
| `/clinical-modules` | ~1000ms | **< 50ms** | [ ] |
| `/cnple-practice-questions` | ~1000ms | **< 50ms** | [ ] |
| `/blog/*` | ~800ms | **< 50ms** | [ ] |
| Homepage `/` | ~1000ms | ~800ms (still dynamic) | [ ] |

### Step 6: Lighthouse verification

```bash
# Run Lighthouse mobile against key routes (requires lighthouse CLI)
npm i -g lighthouse
BASE_URL=https://nursenest.ca node nursenest-core/scripts/verify-cloudflare-cache.mjs --lighthouse
```

Or manually using Chrome DevTools / PageSpeed Insights:

**Routes to test:**
- [ ] `https://nursenest.ca/` — Homepage
- [ ] `https://nursenest.ca/advanced-ecg-nursing` — ECG pillar
- [ ] `https://nursenest.ca/clinical-modules` — Clinical modules hub
- [ ] `https://nursenest.ca/ecg/stemi-localization` — ECG cluster page
- [ ] `https://nursenest.ca/blog/ecg-interpretation-nursing-foundations-rhythm-recognition` — Blog post

**Target scores:**

| Route | Target Mobile Score | LCP Target |
|---|---|---|
| Homepage | 65+ | ≤ 3.0s |
| `/advanced-ecg-nursing` | **90+** | ≤ 1.5s |
| `/clinical-modules` | **90+** | ≤ 1.5s |
| `/ecg/stemi-localization` | **90+** | ≤ 1.5s |
| Blog post | **85+** | ≤ 2.0s |

ECG/CNPLE/blog pages served from Cloudflare edge cache at ~10ms TTFB → text LCP becomes purely font + paint time → 90+ is achievable.

---

## SEO / Indexability Verification

### Google Search Console

After rollout, verify in Search Console:

- [ ] URL Inspection on `/advanced-ecg-nursing` returns HTTP 200
- [ ] Rendered page shows correct H1 and JSON-LD markup (not stale cached version)
- [ ] Coverage → Indexed pages includes ECG cluster pages
- [ ] No "Alternate page with proper canonical tag" errors introduced

### Sitemap verification

```bash
# Verify sitemap remains accessible through Cloudflare
curl -sI https://nursenest.ca/sitemap.xml | grep -E "HTTP|Cache"
curl -sI https://nursenest.ca/sitemap-clinical-modules.xml | grep -E "HTTP|Cache"
```

Expected: HTTP 200, and sitemap URLs are accessible.

### Canonical tag check

```bash
# Verify canonical tags are not corrupted by Cloudflare
curl -s https://nursenest.ca/advanced-ecg-nursing | grep 'rel="canonical"'
```

Expected: `<link rel="canonical" href="https://nursenest.ca/advanced-ecg-nursing"/>`

---

## Rollback Procedure

If any critical issue is found:

### Immediate rollback (< 30 seconds)

1. Go to Cloudflare DNS → `nursenest.ca` CNAME record
2. Click the orange cloud → change to grey cloud (DNS only)
3. Traffic returns directly to DigitalOcean App Platform
4. Run `BASE_URL=https://nursenest.ca node nursenest-core/scripts/verify-cloudflare-cache.mjs --cold-only` to confirm

### Cache purge (if stale content is served)

```bash
# Purge all cached content for nursenest.ca
curl -X POST \
  "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/purge_cache" \
  -H "Authorization: Bearer ${CF_API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"purge_everything": true}'
```

**Warning:** `purge_everything` clears the entire Cloudflare cache. Use route-specific purge when possible.

---

## Post-Rollout Monitoring (first 24 hours)

### Cloudflare Analytics

In Cloudflare Dashboard → Analytics:

- [ ] Cache Hit Rate > 80% for eligible routes (check "Top cached URLs")
- [ ] No spike in 5xx errors (check "HTTP Status")
- [ ] Request volume matches expected traffic

### DigitalOcean App Platform

- [ ] Origin request volume DECREASED (Cloudflare serving cached responses)
- [ ] No memory pressure or OOM events
- [ ] TTFB on origin requests is stable (Cloudflare only hits origin on MISS/BYPASS)

### Application logs

```bash
# Watch for any cache-related errors in app logs (via DO dashboard or doctl)
doctl apps logs <app-id> --follow
```

Look for:
- `[marketing-default-layout]` errors
- `[lessons-perf]` timeout messages
- Any new patterns of errors not seen before rollout

---

## Success Criteria

All of the following must be true before marking rollout complete:

- [ ] **Cache HIT rate:** ECG/CNPLE/blog routes return `CF-Cache-Status: HIT` on warm cache
- [ ] **Auth bypass works:** Requests with session cookies return `BYPASS`, not `HIT`
- [ ] **No private data cached:** Verified by manual inspection of cached responses + bypass test
- [ ] **TTFB dropped:** ECG/CNPLE pages < 50ms TTFB (from Cloudflare PoP)
- [ ] **Lighthouse improvement:** `/advanced-ecg-nursing` mobile score ≥ 90
- [ ] **SEO intact:** Canonical tags and sitemap correct through Cloudflare
- [ ] **Learner flows unaffected:** `/app/dashboard` authenticated flows work normally
- [ ] **Checkout unaffected:** Stripe checkout flow completes successfully
- [ ] **Admin unaffected:** `/admin/*` staff access works normally
- [ ] **24h monitoring clean:** No error spikes, cache anomalies, or security alerts

---

## Quick Reference Commands

```bash
# Run full verification suite
BASE_URL=https://nursenest.ca npm run verify:cache

# Run with session cookie bypass test
VERIFY_SESSION_COOKIE="<token>" BASE_URL=https://nursenest.ca npm run verify:cache

# Run with Lighthouse
BASE_URL=https://nursenest.ca npm run verify:cache -- --lighthouse

# Purge specific SEO routes
CF_ZONE_ID="<zone-id>" CF_API_TOKEN="<token>" node nursenest-core/scripts/purge-cloudflare-cache.mjs

# Check cache headers on a single URL
curl -sI https://nursenest.ca/advanced-ecg-nursing | grep -E "cf-cache|cache-control|vary"
```

---

## Troubleshooting

### `CF-Cache-Status: DYNAMIC` on SEO pages

**Cause:** Cloudflare isn't recognizing the route as cacheable.

**Fix:**
1. Verify Cache Rule 3 expression matches the path exactly
2. Check `Cache-Control` on origin response — must contain `s-maxage` and not `private`/`no-store`
3. Check that the route isn't also matching a bypass rule

```bash
curl -sI https://nursenest.ca/advanced-ecg-nursing | grep -E "cache-control|cf-cache|cdn-cache"
```

### `CF-Cache-Status: HIT` on authenticated pages

**Critical — immediate action required:**

1. Purge entire cache: `curl -X POST .../purge_cache -d '{"purge_everything": true}'`
2. Verify Rule 1 (auth cookie bypass) is Priority 1 in Cloudflare
3. Verify the cookie names in the bypass expression match exactly
4. Switch to grey-cloud DNS while investigating

### TTFB not improving after rollout

**Cause:** Cache miss on first request per PoP (expected), or Cloudflare not proxying.

**Check:**
```bash
curl -sI https://nursenest.ca/advanced-ecg-nursing | grep cf-ray
```

If `cf-ray` header is present → Cloudflare is proxying. If absent → DNS is grey cloud.

Send 2 requests to the same PoP. Second request should be much faster (cache HIT).

### Stale content visible after deploy

**Cause:** Cloudflare is serving cached HTML from before the deployment.

**Fix:**
```bash
# Purge affected routes after deploy (add to CI/CD pipeline)
BASE_URL=https://nursenest.ca CRON_SECRET="..." npm run deploy:revalidate-marketing-cache

# Or purge specific ECG routes
curl -X POST "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/purge_cache" \
  -H "Authorization: Bearer ${CF_API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"files": ["https://nursenest.ca/advanced-ecg-nursing", "https://nursenest.ca/clinical-modules"]}'
```

Add cache purge to `package.json` `deploy:revalidate-marketing-cache` script.
