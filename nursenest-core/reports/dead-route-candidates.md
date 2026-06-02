# Dead route candidates — NurseNest (audit only)

**Method:** Static structure + config + proxy vs tests. **Not** a crawl of internal links. **No deletions** in this pass.

Each row uses: **path** | **owner** | **active vs legacy** | **runtime risk** | **SEO risk** | **SAFE_FOR_AI / DEV_ONLY** | **recommended action**

---

## A. Stale tests and docs (not HTTP routes)

| path | owner system | active or legacy | runtime risk | SEO risk | tag | recommended action |
|------|--------------|------------------|--------------|----------|-----|---------------------|
| `src/middleware.test.ts` expectations vs `src/proxy.ts` | QA / edge contract | **legacy / drift** | **Medium** — CI may pass wrong assertions or fail noise | None | **DEV_ONLY** | Regenerate test from current `proxy.ts` or archive test until matcher story is frozen. |

**Evidence:** Test requires matcher entries (`/us`, `/:locale/us`, `regional-marketing-public-gate.ts`, `enforceAdminProxyRoute`, etc.) that are **absent** from current `src/proxy.ts` (matcher is only `/`, `/app`, `/admin`, `/internal`, `/api`).

---

## B. Low-visibility or staff-only pages

| path | owner system | active or legacy | runtime risk | SEO risk | tag | recommended action |
|------|--------------|------------------|--------------|----------|-----|---------------------|
| `/internal/courses`, `/internal/courses/[courseId]` | `src/app/internal/**` | active (narrow) | Low if RBAC on data fetch; **Medium** if any handler trusts path alone | Low (likely noindex or blocked — verify metadata) | **DEV_ONLY** | Confirm product intent; link from admin nav or document as operator-only. |
| `/api/debug/*` (e.g. `debug/me`, `debug/sentry-test`, `debug/db-env`, …) | API routes | active in repo | **High** if exposed in prod without auth | None if disallowed in prod | **DEV_ONLY** | Verify env gates / auth on each handler; remove from public API docs. |
| `/api/internal/reliability/*` | API | active | Medium — ops surface | None | **DEV_ONLY** | Confirm auth + rate limits. |

---

## C. Redirect-only or bookmark-compat (not dead, but “thin”)

| path | owner system | active or legacy | runtime risk | SEO risk | tag | recommended action |
|------|--------------|------------------|--------------|----------|-----|---------------------|
| `/sitemap-index.xml` | `next.config.mjs` redirect → `/sitemap.xml` | **compat** | None | **Low** — consolidates signals | **SAFE_FOR_AI** | Keep; document in SEO runbook. |
| `/nursing/rn/blog`, `/nursing/rn/blog/:slug` | `next.config.mjs` → `/blog/rn` | **compat** | None | Low — intentional canonical | **SAFE_FOR_AI** | Keep. |
| `/us/allied/...`, `/canada/allied/...` | `next.config.mjs` → `/allied/allied-health` | **compat** | None | Low | **SAFE_FOR_AI** | Keep. |
| `/(marketing)/(default)/[locale]/rn/page.tsx` | Next page → `redirect(\`/${locale}/rn/nclex-rn\`)` | active shortcut | Low | Low — single hop | **SAFE_FOR_AI** | Ensure sitemap and internal links target final URL. |

---

## D. Possible unreachable or redundant UI (needs link / analytics confirmation)

| path | owner system | active or legacy | runtime risk | SEO risk | tag | recommended action |
|------|--------------|------------------|--------------|----------|-----|---------------------|
| Duplicate “exam” surfaces: `/app/exams` vs `/app/practice-tests` vs marketing “practice-exams” | Learner + marketing | active parallel | **Medium** — duplicate state if both hit same backend namespaces | Medium — duplicate titles if both indexed | **SAFE_FOR_AI** | Map CTAs to canonical learner entry; confirm robots on marketing. |
| `/app/labs/*` vs `/modules/lab-values/*` vs `/modules/ecg/*` vs `/app/ecg-video-quiz` | Learner vs marketing modules | active parallel | Medium — user confusion | Medium if both indexed | **SAFE_FOR_AI** | Single IA owner; canonical links between hubs. |

---

## E. Programmatic SEO empty params

| path | owner system | active or legacy | runtime risk | SEO risk | tag | recommended action |
|------|--------------|------------------|--------------|----------|-----|---------------------|
| `src/lib/exam-pathways/programmatic-slug-redirects.ts` (empty `PROGRAMMATIC_SLUG_TO_PATHWAY_PATH`) | Optional hub redirect map | **active intentional no-op** | None | None | SAFE_FOR_AI | Per file comment: empty to avoid wrong-country redirects; not dead code. |


---

## F. Vite / alternate dev server

| path | owner system | active or legacy | runtime risk | SEO risk | tag | recommended action |
|------|--------------|------------------|--------------|----------|-----|---------------------|
| `localhost:5000` (Vite) vs Next marketing URLs | `package.json` scripts | parallel dev | **Medium** — wrong origin in OAuth or links | N/A prod | **DEV_ONLY** | Onboarding doc: production URLs are Next only. |

---

## Summary

Highest-confidence **dead / drift** item: **`src/middleware.test.ts` vs `src/proxy.ts`**.  
Highest **product** ambiguity: **parallel labs / ECG / med-math / practice** trees — not dead, but need analytics + IA to mark true “primary” routes.

