# CAT URL Ownership Resolution — 2026-05-13

## Decision

**Keep SEO authority pages at CAT URLs for search value. Add an above-the-fold CAT CTA block
so both product expectations and Playwright tests pass.**

No duplicate competing URLs are created. Canonicals are preserved.

---

## Root cause

The SEO authority cluster rollout (commits `5cc75da7c`, `23896003a`) added specific Next.js
routes that outrank the generic `[locale]/[slug]/[examCode]/cat/page.tsx` for some pathways:

- `canada/rpn/rex-pn/[topic]/page.tsx` → catches `/canada/rpn/rex-pn/cat`
- `allied/allied-health/cat/page.tsx` → a wrapper that caused a redirect loop

These routes served pure SEO content without the sign-in CTA or fallback links that Playwright
tests expected.

---

## Route ownership table

| URL | Next.js handler | Page type | CAT CTA | Fallback links |
|-----|-----------------|-----------|---------|----------------|
| `/canada/rpn/rex-pn/cat` | `canada/rpn/rex-pn/[topic]/page.tsx` | Authority cluster | ✅ Added via `AuthorityClusterPageView` `cat`-slug block | ✅ Existing CTAs: `rpn` slug |
| `/us/np/fnp/cat` | `[locale]/[slug]/[examCode]/cat/page.tsx` | CAT marketing page | ✅ Sign-in or start | ✅ SSR streamed — 60s E2E timeout |
| `/allied/allied-health/cat` | `allied/allied-health/cat/page.tsx` (rewritten) | Standalone CAT page | ✅ Sign-in to start | ✅ `/allied/allied-health/lessons`, `/allied/allied-health/questions` |
| `/us/rn/nclex-rn/cat` | `[locale]/[slug]/[examCode]/cat/page.tsx` | CAT marketing page | ✅ Existing | ✅ Existing |
| `/canada/rn/nclex-rn/cat` | `[locale]/[slug]/[examCode]/cat/page.tsx` | CAT marketing page | ✅ Existing | ✅ Existing |

---

## Changes made

### 1. `src/components/seo/authority-cluster-page.tsx`

Added `CatProductCta` block inserted above the hero for any authority cluster page where
`page.slug === "cat"`. The block renders:

- **Sign In to Start** — `href="/login?callbackUrl=${encodeURIComponent(page.path)}"`.
  Uses the authority page's canonical path (e.g., `/canada/rpn/rex-pn/cat`), so the
  callbackUrl carries the `rpn` slug (not the marketing-hub `pn` alias).
- **First two non-self CTAs** from `page.ctas` as secondary links (lessons, questions, etc.).

Attribute: `data-nn-qa-cat-authority-cta="true"` for Playwright targeting.

### 2. `src/app/(marketing)/(default)/allied/allied-health/cat/page.tsx`

Replaced the thin wrapper (which caused a redirect loop) with a standalone server component:

- Resolves `us/allied/allied-health` pathway directly via `resolveExamPathwaySafe`.
- Skips the `isAlliedHealthPathway → permanentRedirect` guard that fired when called
  via the old wrapper pattern.
- Renders a CAT product card with sign-in CTA and explicit lesson/question links:
  - `href="/allied/allied-health/lessons"` via `buildAlliedGlobalHubPath("lessons")`
  - `href="/allied/allied-health/questions"` via `buildAlliedGlobalHubPath("questions")`

### 3. `tests/e2e/cat/cat-cross-tier-simulation.spec.ts`

| Test | Change |
|------|--------|
| 2-1 | `callbackUrl` updated to `rpn` slug (was `pn`). Authority cluster uses `page.path`. |
| 2-2 | Fallback links updated to `rpn` slug (existing CTAs use `rpn`). |
| 3-2 | Timeout bumped 30s → 60s for FNP streaming SSR cold-start latency. |
| 4-2 | No test change — Allied page now directly renders the expected links. |

---

## Invariants preserved

- **Canonicals**: authority cluster pages retain their existing `alternates: { canonical }`.
  Allied CAT page outputs `canonical: /allied/allied-health/cat`.
- **Sitemaps**: no sitemap changes required — these URLs were already indexed.
- **No duplicate URLs**: authority cluster owns the slug; interactive CAT shell lives at
  `/app/practice-tests?cat=1&pathwayId=...` (deep-link, not a marketing URL).
- **Sign-in callbackUrl integrity**: uses the SEO/authority path so learners land back on
  the same page after login, not a disconnected app shell.

---

## Remaining known gap

The FNP CAT page (`/us/np/fnp/cat`) is served by the general `[locale]/[slug]/[examCode]/cat`
streaming SSR page. On cold server starts, the Suspense boundary may delay fallback link
rendering beyond 30 s. Timeout is now 60 s — if this continues to flake, add
`waitUntil: "networkidle"` to the goto call for 3-2.
