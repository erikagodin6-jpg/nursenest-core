# Developer trap audit — NurseNest

**Method:** Static review of naming collisions, deprecated entrypoints, dual stacks (`docs/legacy-restoration-map.md`), route-param semantics, metadata/env fallbacks, and grep hotspots (`@deprecated`, `legacy`, `compat`). **Audit only** — no refactors.

Each row: **file/system** · **why risky** · **onboarding impact** · **runtime impact** · **SAFE_FOR_AI / DEV_ONLY** · **recommended stabilization path** (documentation or phased work — not executed here).

---

## 1. Semantic collisions (wrong mental model)

| File / system | Why risky | Onboarding | Runtime | Tag | Stabilization path |
|---------------|-----------|------------|---------|-----|-------------------|
| **`[locale]` under `/(marketing)/(default)/[locale]/[slug]/[examCode]`** | Segment is **pathway `countrySlug`** (`us`, `canada`), not BCP-47 marketing locale | Engineers add `/fr/us/...` alternates or cookie logic incorrectly | Wrong SEO / 404 if routes mis-generated | **SAFE_FOR_AI** | Onboarding doc + diagram in `ExamPathwayLayout` comment; link from `AGENTS.md` |
| **`safeGenerateMetadata` + `ctx.locale`** | Exam hub passes `countrySlug` as `locale`; guard skips `localeRobotsOverride` only when `routeGroup` starts with `marketing.exam_hub` | Forgetting `routeGroup` **noindexes US hubs** | Catastrophic SEO if mis-copied | **DEV_ONLY** | Lint or template for `generateMetadata` wrappers |
| **`AUTH_SECRET` vs `NEXTAUTH_SECRET`, `AUTH_URL` vs `NEXTAUTH_URL`** | Either works; docs prefer one | Duplicate secrets in env; “auth works locally, fails in prod” | Session / callback failures | **SAFE_FOR_AI** | Single runbook section (`docs/environment-reference.md`); CI warning already partially covered |
| **`DATABASE_URL` vs `PROD_DATABASE_URL` / `DIRECT_URL`** | Legacy name still set in some deploys | Migrations use wrong URL | Prisma migrate vs pooler errors | **DEV_ONLY** | Keep diagnostics; remove `PROD_DATABASE_URL` in dashboards |

---

## 2. Silent or observe-only failure modes

| File / system | Why risky | Onboarding | Runtime | Tag | Stabilization path |
|---------------|-----------|------------|---------|-----|-------------------|
| **`safe-marketing-metadata.ts`** | HTTP validation failures → **generic** `FALLBACK_SITE_METADATA` | “Page loads” but SERP titles duplicate | Users see site; SEO degrades quietly | **DEV_ONLY** | Dashboards on `metadata_validation_failed_nonfatal` |
| **`filterPublicHreflangRecord`** | Drops bad URLs with logs — easy to miss | hreflang “missing” in head | Index consolidation issues | **DEV_ONLY** | Alerting on reject reasons |
| **`pathway-lesson-detail-page-body.tsx` + `userId = ""`** | Marketing lesson never resolves subscriber entitlement in that RSC path | “Logged in but still preview” support noise | No server leakage; UX confusion | **SAFE_FOR_AI** | Support macro + product doc (already noted in entitlement audit) |

---

## 3. Misleading or foot-gun APIs

| File / system | Why risky | Onboarding | Runtime | Tag | Stabilization path |
|---------------|-----------|------------|---------|-----|-------------------|
| **`safeExamHubMetadata`** (`safe-marketing-metadata.ts`) | **@deprecated** but still exported | New code imports old helper | Same as `safeGenerateMetadata` if used wrong | **DEV_ONLY** | Remove after grep-clean migration; ESLint deprecation rule |
| **`marketing-message-keys.generated.ts`** | Name says “keys” but file is **huge generated artifact** | Editors open it; PRs touch it | None if regen-only | **SAFE_FOR_AI** | `.cursorignore` / CONTRIBUTING “never edit”; regen docs |
| **`pathway-lesson-catalog-sync.ts`** | **~2k lines**, multiple concerns + **@deprecated** `normalizeLesson` | Hard to review changes | Regression risk in catalog sync | **DEV_ONLY** | Split by pipeline stage when allowed |

---

## 4. Dual-stack and parallel ownership

| File / system | Why risky | Onboarding | Runtime | Tag | Stabilization path |
|---------------|-----------|------------|---------|-----|-------------------|
| **Next marketing vs `client/` Vite SPA** (`legacy-restoration-map.md`) | Same **conceptual** features; **different trees** | Fix marketing twice | Divergent UX / bugs | **DEV_ONLY** | Document “change both” or extract shared primitives |
| **`server/` monolith + Next API routes** | Entitlements / lessons may exist in both narratives | Wrong file “source of truth” | Inconsistent business rules | **DEV_ONLY** | Feature matrix in `legacy-restoration-map.md` — extend per new feature |
| **`ContentItem` vs `PathwayLesson`** | Editorial policy references legacy JSON body | Wrong loader for publish | Wrong content in app | **DEV_ONLY** | Registry tests (`admin-edit-publish-surface`); comments on loaders |

---

## 5. Stale comments and ops traps

| File / system | Why risky | Onboarding | Runtime | Tag | Stabilization path |
|---------------|-----------|------------|---------|-----|-------------------|
| **`lessons/page.tsx` — “legacy ops grep”** | Comment ties behavior to **grep workflows** | Magic path constants | None | **DEV_ONLY** | Replace with explicit module export for ops tooling |
| **`verify-build` / `env:validate` script chain** (if still broken in a clone) | Diagnose step expects scripts in `nursenest-core/package.json` | “CI said env ok” when step never ran | False confidence | **DEV_ONLY** | Align package scripts (separate env audit) |

---

## 6. Giant interactive clients (review burden)

| File | Lines (approx) | Trap |
|------|------------------|------|
| `practice-test-runner-client.tsx` | ~3100+ | State machine + CAT + UI — easy to break edge cases |
| `admin-blog-control-panel-client.tsx` | ~2800+ | Many modes in one file |
| `question-bank-practice-client.tsx` | ~1900+ | Practice + filters |

**Onboarding:** “Where do I change X?” → unclear. **Runtime:** bundle weight + bug blast radius. **Tag:** **DEV_ONLY**. **Stabilization:** slice by feature vertical when product allows (not in this audit).

---

## 7. Acceptance

**Hidden traps** (param semantics, deprecated SEO helpers, silent metadata fallback, dual Next/Vite/server, legacy content duality, giant clients) and **misleading abstractions** are documented with **risk → onboarding → runtime → tag → stabilization** guidance.
