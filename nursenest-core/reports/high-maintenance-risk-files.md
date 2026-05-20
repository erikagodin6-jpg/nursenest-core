# High maintenance risk files — NurseNest

**Criteria:** very large line count, multiple domains in one module, generated artifacts, or central coupling points. Line counts from `wc -l` on this workspace (rounded). **Audit only.**

Legend: **O** = onboarding pain, **R** = runtime/regression blast radius.

---

## Tier S — extreme size or generated

| File / system | ~Lines | Why risky | O | R | Tag | Stabilization path |
|---------------|--------|-----------|---|---|-----|-------------------|
| `src/lib/i18n/marketing-message-keys.generated.ts` | **21k+** | Generated; accidental hand-edit breaks i18n | High | Med if wrong | **SAFE_FOR_AI** | Document regen command only; never review in PR as logic |
| `src/components/student/practice-test-runner-client.tsx` | **~3100** | CAT + linear + teaching + UI state | Very high | High | **DEV_ONLY** | Future extract: session hook, step renderer, telemetry |
| `src/components/admin/admin-blog-control-panel-client.tsx` | **~2850** | Admin blog studio — many flows | High | Med | **DEV_ONLY** | Route-level code split; server actions boundary map |

---

## Tier A — large library / page modules

| File / system | ~Lines | Why risky | O | R | Tag | Stabilization path |
|---------------|--------|-----------|---|---|-----|-------------------|
| `src/lib/lessons/pathway-lesson-catalog-sync.ts` | **~2086** | Catalog sync + deprecations + edge cases | Very high | High | **DEV_ONLY** | Split: ingest / validate / write / metrics |
| `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/page.tsx` | **~1530** | Hub + allied redirect + inventory + SEO | Very high | High | **DEV_ONLY** | Extract hub subcomponents already partially done — continue vertical slices |
| `src/components/student/question-bank-practice-client.tsx` | **~1900** | Filters + practice + analytics | High | Med | **DEV_ONLY** | Isolate “session runner” vs chrome |
| `src/lib/server/rate-limit.ts` | **~1576** | Security + Redis + memory paths | Med | **Critical** if wrong | **DEV_ONLY** | Property tests; single owner in CODEOWNERS-style doc |
| `src/lib/labs/labs-engine.ts` | **~1290** | Domain logic density | Med | Med | **DEV_ONLY** | Unit tests per lab type |
| `src/lib/practice-tests/cat-session.ts` | **~1220** | Adaptive engine | High | High | **DEV_ONLY** | Keep contract tests; avoid mixing UI concerns |
| `src/components/layout/site-header.tsx` | **~1170** | Nav + i18n + responsive + auth chrome | High | Med | **DEV_ONLY** | Already sensitive per governance — document touch policy |

---

## Tier B — large content TSX (data + presentation mixed)

| File | ~Lines | Why risky | Tag | Stabilization path |
|------|--------|-----------|-----|-------------------|
| `src/content/pre-nursing/modules/pre-nursing-anatomy.tsx` | **~1350** | Content edits need dev | **DEV_ONLY** | Consider MDX or data-driven extraction |
| `src/components/student/practice-tests-hub-client.tsx` | **~1510** | Hub state + lists | **DEV_ONLY** | Pagination boundaries already important — keep |

---

## Tier C — central coupling hubs (smaller file, high fan-in)

| File / system | ~Lines | Why risky | Tag | Stabilization path |
|---------------|--------|-----------|-----|-------------------|
| `src/lib/db.ts` | **~80** | Every feature imports Prisma | **DEV_ONLY** | Keep thin; never add business logic |
| `src/proxy.ts` | **~200** | Auth + routing edge | **DEV_ONLY** | Change control + E2E smoke |
| `src/lib/seo/sitemap-static-xml.ts` | **~610** | Sitemap + collectors | **DEV_ONLY** | Already has tests — extend when adding URL classes |

---

## Ownership clarity

| Gap | Risk | Tag | Stabilization path |
|-----|------|-----|-------------------|
| No per-directory `CODEOWNERS` in audit scope | Reviews inconsistent | **DEV_ONLY** | Add optional CODEOWNERS for `legacy/`, `rate-limit`, `entitlements` |
| `src/lib/legacy/*` (32 files) | “Is this still run?” | **DEV_ONLY** | See `legacy-compatibility-layer-map.md` |

---

## Acceptance

**High-maintenance** files are **ranked and justified** with onboarding/runtime notes and **stabilization paths** that are advisory only (no refactors performed).
