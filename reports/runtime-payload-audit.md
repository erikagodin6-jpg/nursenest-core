# Runtime payload audit (NurseNest)

**Purpose:** document **large static corpora**, **API payload guardrails**, and **import boundaries** so runtime memory and TTFB stay predictable.

**Script:** `npm run audit:runtime-payloads` (`AUDIT_RUNTIME_PAYLOADS_STRICT=1` to fail on guard violations).

---

## 1. Large JSON corpora (`nursenest-core/src/content`)

Pathway lesson **catalog shards** (`catalog.json`, `np-*-catalog.json`, RN expansion catalogs, `lesson-library.json`, etc.) are **multi‑MiB** files. They are **expected** for authoring/merge pipelines.

**Rules (non-negotiable for stability):**

1. **Never** import these JSONs from **`use client`** components (would bloat client bundles).  
2. **Never** add `generated-indexes` paths under `src/app/**` — indexes are consumed from **`pathway-lesson-loader`** / sync utilities on the server.  
3. Prefer **lazy** `require()` / dynamic import inside **server-only** code paths (already pattern in catalog sync) rather than top-level app layout imports.

The audit script lists files **> 512 KiB** and notes shards **> 2 MiB** as “catalog — server only”.

---

## 2. `generated-indexes/`

Produced by **`run-lesson-indexes-for-build.mjs`** → `build:lesson-indexes`. Typical total size **~2 MiB** (order of magnitude).  
**Isolation:** must not be referenced from `src/app` route modules; use lib loaders.

---

## 3. Runtime API payload guardrails (existing production code)

| Mechanism | Location | Threshold |
|-----------|----------|-----------|
| **Large response log** | `logLargeApiResponse` in `perf-log-core.ts` | **> 500 KB** UTF-8 estimate (`LARGE_API_RESPONSE_BYTES`) |
| **Earlier alert** | `logApiPayloadAlert` | **> 250 KB** (`ALERT_API_PAYLOAD_BYTES`) |
| **Hard guard** | `jsonResponseGuarded` / `guardJsonResponseSize` in `response-guard.ts` | Same 500 KB cap when `isResponseGuardEnabled()` — returns **413** if exceeded |

Constants: `src/lib/observability/api-response-size-constants.ts`.

**Representative instrumented routes:** `/api/questions`, `/api/questions/[id]`, `/api/questions/discovery`, `/api/lessons` (see `logLargeApiResponse` grep).

---

## 4. Duplicated / risky data loading patterns (watch list)

- **Marketing lesson hubs** pull paginated DB/catalog data — ensure **pagination** stays bounded (see global engineering constraints).  
- **Subscriber + freemium** question APIs share scoring paths — keep `select` lists tight (no full `content` JSON on list endpoints).  
- **`pathway-lesson-catalog-sync`** may `require()` many catalog files — **server-only**; audit script fails (strict) if `use client` + this module co-exist in a route file.

---

## 5. SEO / cache behavior

This audit **does not** recommend changing `Cache-Control`, redirects, or sitemap routes. Payload limits apply to **API JSON**, not HTML document policy.

---

## 6. Environment variables for audits

| Variable | Effect |
|----------|--------|
| `AUDIT_GIANT_JSON_BYTES` | Override giant JSON note threshold (default 2 MiB). |
| `AUDIT_LARGE_JSON_BYTES` | Listing threshold (default 512 KiB). |
| `AUDIT_RUNTIME_PAYLOADS_STRICT` | `1` → non-zero exit on isolation failures. |
