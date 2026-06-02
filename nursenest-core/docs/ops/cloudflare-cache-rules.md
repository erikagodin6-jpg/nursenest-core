# Cloudflare Cache Rules — NurseNest Configuration

**Origin:** `https://nursenestcore-njhcf.ondigitalocean.app`  
**Production domain:** `nursenest.ca`  
**Configured by:** Erika (2026-05)

---

## Architecture Overview

```
User → Cloudflare Edge PoP → (cache HIT: ~10ms) → User
                           → (cache MISS/BYPASS: ~1000ms) → DigitalOcean App Platform → User
```

**Who gets cached responses:**
- Anonymous users on SEO content pages (ECG, CNPLE, blog)

**Who always hits origin:**
- Any user with a session/auth cookie
- All `/app/*`, `/admin/*`, `/api/*`, `/account/*`, `/checkout/*` requests

---

## Rule Execution Order

Rules execute in priority order (1 = highest). Bypass rules MUST run before cache rules.

| Priority | Rule Name | Action |
|---|---|---|
| 1 | Bypass: Auth cookies present | Bypass Cache |
| 2 | Bypass: Private routes | Bypass Cache |
| 3 | Cache: Public SEO HTML | Cache Everything |

---

## Rule 1 — Bypass: Auth cookies present (Priority 1)

**Purpose:** Any request carrying a session/auth cookie must never be cached. This is the primary security control preventing learner data, payment state, or admin content from being cached and served to other users.

### Cloudflare Cache Rules UI (Dashboard)

**Go to:** Cloudflare → nursenest.ca → Caching → Cache Rules → Create Rule

```
Rule name:   Bypass cache — auth session cookies
When:        (Custom filter expression)

Expression:
  (
    http.cookie contains "next-auth.session-token" or
    http.cookie contains "__Secure-next-auth.session-token" or
    http.cookie contains "authjs.session-token" or
    http.cookie contains "__Secure-authjs.session-token"
  )

Then:        Bypass cache
```

### Terraform (Cloudflare Provider)

```hcl
resource "cloudflare_cache_rule" "bypass_auth_cookies" {
  zone_id  = var.cloudflare_zone_id
  name     = "Bypass cache — auth session cookies"
  priority = 1

  filter {
    expression = <<-EOT
      (
        http.cookie contains "next-auth.session-token" or
        http.cookie contains "__Secure-next-auth.session-token" or
        http.cookie contains "authjs.session-token" or
        http.cookie contains "__Secure-authjs.session-token"
      )
    EOT
  }

  action {
    value = "bypass"
  }
}
```

### Cloudflare API (cURL)

```bash
curl -X POST \
  "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/cache/rules" \
  -H "Authorization: Bearer ${CF_API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "rules": [
      {
        "description": "Bypass cache — auth session cookies",
        "expression": "(http.cookie contains \"next-auth.session-token\" or http.cookie contains \"__Secure-next-auth.session-token\" or http.cookie contains \"authjs.session-token\" or http.cookie contains \"__Secure-authjs.session-token\")",
        "action": "bypass",
        "enabled": true
      }
    ]
  }'
```

---

## Rule 2 — Bypass: Private routes (Priority 2)

**Purpose:** Bypass cache for all routes containing private, personalised, or admin content regardless of cookies. Defence-in-depth alongside the origin `Cache-Control: no-store` headers already set by Next.js.

```
Rule name:   Bypass cache — private routes
When:        (Custom filter expression)

Expression:
  (
    starts_with(http.request.uri.path, "/app") or
    starts_with(http.request.uri.path, "/admin") or
    starts_with(http.request.uri.path, "/account") or
    starts_with(http.request.uri.path, "/checkout") or
    starts_with(http.request.uri.path, "/modules") or
    http.request.uri.path eq "/login" or
    http.request.uri.path eq "/signup" or
    starts_with(http.request.uri.path, "/api/subscriptions") or
    starts_with(http.request.uri.path, "/api/auth")
  )

Then:        Bypass cache
```

### Note: `/api/*` strategy

The blanket `/api/*` bypass is NOT recommended because some API routes are intentionally public and cacheable (e.g. `/api/public/*`). Only explicitly auth-sensitive API prefixes are bypassed here. The origin already sets `Cache-Control: no-store` on auth API routes.

---

## Rule 3 — Cache: Public SEO HTML (Priority 3)

**Purpose:** Cache the HTML for public SEO content pages at the Cloudflare edge. These pages produce identical HTML for all anonymous users (no user-specific content in the server-rendered body).

> **Important:** Use **"Override origin TTL"** (not "Respect existing headers") for the edge TTL.
> 
> Next.js sets `Cache-Control: private, no-cache, no-store` for all routes under a `force-dynamic`
> layout — even pages that individually declare `revalidate = 86400`. The `next.config.mjs` headers()
> override should correct this after deployment, but using "Override origin TTL" ensures Cloudflare
> caches correctly regardless of what the origin header says, as long as the auth bypass rules (Rules 1+2)
> have already allowed the request through.
>
> Security model: since Rule 1 (auth cookie bypass) has Priority 1, authenticated requests NEVER reach
> Rule 3. Only anonymous requests reach Rule 3, and those requests produce identical HTML for all users.

```
Rule name:   Cache public SEO content — HTML
When:        (Custom filter expression)

Expression:
  (
    http.request.uri.path eq "/advanced-ecg-nursing" or
    starts_with(http.request.uri.path, "/advanced-ecg-nursing/") or
    starts_with(http.request.uri.path, "/ecg/") or
    http.request.uri.path eq "/clinical-modules" or
    http.request.uri.path eq "/ecg-interpretation" or
    http.request.uri.path eq "/ecg-telemetry-mastery" or
    starts_with(http.request.uri.path, "/cnple-") or
    starts_with(http.request.uri.path, "/blog/")
  )

Then:
  - Cache status:        Cache Everything
  - Edge TTL:            Override origin — 1 hour (3600 seconds)
  - Browser TTL:         Respect existing headers (pass-through to browser)
```

The "Override origin" setting tells Cloudflare to cache for 1 hour regardless of `Cache-Control` from
the origin. Browsers still receive the origin's `Cache-Control` header (which may say `private` — that's
fine, browsers handle their own caching independently from Cloudflare's edge cache).

### Terraform

```hcl
resource "cloudflare_cache_rule" "cache_seo_html" {
  zone_id  = var.cloudflare_zone_id
  name     = "Cache public SEO content — HTML"
  priority = 3

  filter {
    expression = <<-EOT
      (
        http.request.uri.path eq "/advanced-ecg-nursing" or
        starts_with(http.request.uri.path, "/advanced-ecg-nursing/") or
        starts_with(http.request.uri.path, "/ecg/") or
        http.request.uri.path eq "/clinical-modules" or
        http.request.uri.path eq "/ecg-interpretation" or
        http.request.uri.path eq "/ecg-telemetry-mastery" or
        starts_with(http.request.uri.path, "/cnple-") or
        starts_with(http.request.uri.path, "/blog/")
      )
    EOT
  }

  action {
    value = "cache"

    action_parameters {
      cache = true
      edge_ttl {
        mode    = "respect_origin"
        default = 3600
      }
      browser_ttl {
        mode    = "respect_origin"
        default = 300
      }
      serve_stale = {
        disable_stale_while_updating = false
      }
    }
  }
}
```

---

## Cloudflare Zone Settings (Required)

These global zone settings must be configured in addition to Cache Rules:

### Dashboard: Caching → Configuration

| Setting | Value | Reason |
|---|---|---|
| Caching Level | Standard | Cache files with query strings |
| Browser Cache TTL | Respect Existing Headers | Let origin control browser TTL |
| Always Online | On | Serve stale on origin failure |
| Development Mode | Off | Production: never on |

### Dashboard: Network

| Setting | Value | Reason |
|---|---|---|
| HTTP/2 | On | Required for multiplexed requests |
| HTTP/3 (QUIC) | On | Faster connection on mobile |
| 0-RTT Connection Resumption | On | Reduces TTFB on repeat visits |

### Dashboard: Speed → Optimization

| Setting | Value | Reason |
|---|---|---|
| Auto Minify: HTML | Off | Next.js already minifies |
| Auto Minify: CSS | Off | Next.js already minifies |
| Auto Minify: JS | Off | Next.js already minifies — Cloudflare minification can corrupt JS |
| Brotli | On | Better compression than gzip for text |
| Rocket Loader | **Off** | Can conflict with Next.js hydration timing |
| Mirage | Off | Not applicable (no standard `<img>` optimization) |

> ⚠️ **Rocket Loader** must be OFF. It asynchronously loads JS which can interfere with Next.js's `beforeInteractive` scripts (theme seed, navigation intent) and cause visible theme flash (FOUC) on first load.

---

## `Vary: Cookie` Behavior

The origin sends `Vary: Cookie` on cacheable SEO routes. This is intentional for correctness but has important Cloudflare implications:

**Cloudflare default behavior:** Cloudflare **ignores** `Vary: Cookie` for HTML responses and uses the URL as the sole cache key (Cloudflare does not create per-cookie cache variants for HTML by default).

**Why this is safe for NurseNest SEO pages:**
1. Server-rendered HTML for ECG/CNPLE pages contains no user-specific content
2. Region cookies (`nn_marketing_region`, `nn_global_region`) affect the header/footer ONLY — and those are rendered client-side via `useSession()` / React hydration
3. Anonymous users (no cookies) → all get identical HTML → 100% CDN hit rate
4. Authenticated users (session cookie) → Rule 1 bypasses cache → origin always hit

**Result:** Safe to have Cloudflare ignore `Vary: Cookie`. No user-specific content is served from cache.

---

## Cache Purge Strategy

### Post-deploy purge (automated)

After each deployment, purge the SEO route cache to ensure new content is served immediately:

```bash
# Purge specific URLs after deploy
curl -X POST \
  "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/purge_cache" \
  -H "Authorization: Bearer ${CF_API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "files": [
      "https://nursenest.ca/advanced-ecg-nursing",
      "https://nursenest.ca/clinical-modules",
      "https://nursenest.ca/ecg-interpretation",
      "https://nursenest.ca/ecg-telemetry-mastery",
      "https://nursenest.ca/cnple-practice-questions"
    ]
  }'
```

### Cache tag purge (add to post-deploy script)

Add `Cache-Tag` headers on cacheable routes (optional — advanced, requires Business/Enterprise plan):

```
Cache-Tag: ecg-content,seo-content
Cache-Tag: cnple-content,seo-content
Cache-Tag: blog-content,seo-content
```

Then purge by tag:
```bash
curl -X POST ".../purge_cache" -d '{"tags": ["seo-content"]}'
```

---

## DNS Cutover Procedure

### Step 1: Add Cloudflare as DNS proxy (not full proxy initially)

```
In Cloudflare DNS:
Record type: CNAME
Name:        nursenest.ca (or @)
Target:      nursenestcore-njhcf.ondigitalocean.app
Proxy:       DNS only (grey cloud) ← start here
TTL:         Auto
```

### Step 2: Test origin access through Cloudflare DNS (grey cloud)

```bash
# Verify origin is reachable through Cloudflare DNS resolver
BASE_URL=https://nursenest.ca node scripts/verify-cloudflare-cache.mjs --cold-only
```

Expected: All routes return 200, no CF-Cache-Status headers yet.

### Step 3: Enable Cloudflare proxy (orange cloud)

Change DNS record to proxied (orange cloud). Cache Rules activate immediately.

### Step 4: Warm cache + verify

```bash
# Wait 60 seconds for cache to warm, then verify
sleep 60
BASE_URL=https://nursenest.ca node scripts/verify-cloudflare-cache.mjs
```

Expected:
- SEO pages: `CF-Cache-Status: HIT` ✅
- Auth pages: `CF-Cache-Status: BYPASS` ✅

---

## Expected Cache Headers by Route

| Route | Cache-Control (origin) | CF-Cache-Status (after warm) | TTFB (HIT) |
|---|---|---|---|
| `/advanced-ecg-nursing` | `public, max-age=300, s-maxage=3600, stale-while-revalidate=86400` | HIT | ~10ms |
| `/ecg/stemi-localization` | `public, max-age=300, s-maxage=3600, stale-while-revalidate=86400` | HIT | ~10ms |
| `/clinical-modules` | `public, max-age=300, s-maxage=3600, stale-while-revalidate=86400` | HIT | ~10ms |
| `/cnple-practice-questions` | `public, max-age=300, s-maxage=3600, stale-while-revalidate=86400` | HIT | ~10ms |
| `/blog/[slug]` | `public, max-age=120, s-maxage=3600, stale-while-revalidate=7200` | HIT | ~10ms |
| `/` (homepage) | Next.js default | MISS/DYNAMIC | ~800ms |
| `/app/dashboard` | `private, no-cache, no-store` | BYPASS | ~400ms |
| `/admin/blog` | `private, no-cache, no-store` | BYPASS | ~400ms |
| `/api/subscriptions/checkout` | `private, no-cache, no-store` | BYPASS | varies |

---

## Security Checklist

Before enabling Cloudflare proxy:

- [ ] Rule 1 (auth cookie bypass) is Priority 1
- [ ] Rule 2 (private routes bypass) is Priority 2
- [ ] Rule 3 (cache SEO) is Priority 3
- [ ] Rocket Loader is **Off**
- [ ] `Always Online` serves only cached versions (no origin on stale)
- [ ] Cloudflare Bot Fight Mode is On (blocks scraping of cached content)
- [ ] Rate limiting enabled for `/api/subscriptions/*`
- [ ] Firewall rules block requests to `/admin/*` from non-staff IPs (optional)
- [ ] Verified `CF-Cache-Status: HIT` returns BEFORE session cookie bypass test
- [ ] Verified `CF-Cache-Status: BYPASS` when session cookie present on SEO page
- [ ] Verified no private content appears in `CF-Cache-Status: HIT` responses
