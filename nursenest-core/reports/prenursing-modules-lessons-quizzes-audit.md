# Pre-nursing modules, lessons, quizzes, and routes — publication audit

**Generated:** 2026-05-08  
**Scope:** Pre-nursing marketing and learner-adjacent surfaces only (no RN/ECG/admin scope expansion).  
**Sources of truth (repo):**

- `tests/e2e/helpers/pathway-prenursing-allied-coverage-manifest.ts` — canonical learner surfaces and intentional non-goals for Playwright coverage.
- `tests/e2e/helpers/pathway-prenursing-allied-matrix.ts` — tier/pathway matrix (PRE_NURSING is **not** an `EXAM_PATHWAYS` id).
- `tests/e2e/helpers/pathway-prenursing-surfaces.ts` — asserted flows: lessons hub + sample modules, mini-CAT, `/app/flashcards` for paid tier.
- `src/content/pre-nursing/pre-nursing-registry.ts` — `PRE_NURSING_MODULE_REGISTRY` (30 modules, ordered).
- `src/content/pre-nursing/pre-nursing-module-map.tsx` — `getPreNursingModuleComponent` slug → React module (publish-ready UI).
- `src/lib/pre-nursing/pre-nursing-question-bank.ts` — static MCQ bank (`BANK_MODULE_SLUGS`, 10 modules).
- `src/lib/lessons/lesson-routes.ts` — `PRE_NURSING_LESSONS_INDEX_PATH = "/pre-nursing/lessons"`.

## Executive summary

| Area | Status |
|------|--------|
| Marketing routes under `/pre-nursing/*` | **Published** in codebase (Next App Router); default locale + `[locale]` mirrors where present. |
| Module count | **30** in registry; **30** mapped in `pre-nursing-module-map.tsx` (no orphan registry slugs). |
| Static practice quizzes (`/pre-nursing/practice/[slug]`) | **10 modules** backed by `PRE_NURSING_QUESTION_BANK`; remaining registry modules are **lesson-first** (inline quizzes may exist in module TSX; not all have bank-backed marketing practice pages). |
| Mini adaptive exam | **`/pre-nursing/mini-cat`** — primary bounded interactive assessment for this tier per manifest. |
| `EXAM_PATHWAYS` / catalog pathway | **No** `TierCode.PRE_NURSING` pathway row — documented in manifest; `/app/questions` is **not** asserted as canonical pre-nursing surface. |
| TEAS / HESI named product routes | **None** in `src/app/.../pre-nursing/**` — science readiness is expressed via modules (chemistry, anatomy-physiology, science-foundations, etc.), not separate TEAS/HESI URLs. |
| Reference doc `reports/full-site-forgotten-pages-theme-audit.md` | **Missing** in this clone at audit time — noted for follow-up. |

## Route inventory (pre-nursing)

| Route | Purpose | Publication (codebase) |
|-------|---------|-------------------------|
| `/pre-nursing` | Hub (lessons, flashcards entry, practice deep link, mini-CAT) | **Live** — `(marketing)/(default)/pre-nursing/page.tsx` |
| `/pre-nursing/lessons` | Paginated module index | **Live** — `.../pre-nursing/lessons/page.tsx` |
| `/pre-nursing/lessons/[slug]` | Module lesson surface | **Live** — default + `[locale]/pre-nursing/lessons/[slug]/page.tsx` |
| `/pre-nursing/practice/[slug]` | Static bank practice exam per eligible slug | **Live** — `.../pre-nursing/practice/[slug]/page.tsx` |
| `/pre-nursing/mini-cat` | Adaptive mini exam | **Live** — `.../pre-nursing/mini-cat/page.tsx` |
| `/pre-nursing/study-plan` | Study plan surface | **Live** — `.../pre-nursing/study-plan/page.tsx` |
| `/[locale]/pre-nursing` | Localized hub | **Live** — `[locale]/pre-nursing/page.tsx` |
| `/[locale]/pre-nursing/lessons/[slug]` | Localized module | **Live** |
| `/flashcards` (from hub card) | Marketing flashcards entry | **Separate** marketing route (not under `/pre-nursing/` prefix); hub links here by design. |
| `/app/flashcards` | Paid learner flashcards (suite) | **Live** app surface; asserted without `pathwayId` for PRE_NURSING in `pathway-prenursing-surfaces.ts`. |

**Draft / unlinked / missing from indexes:** No evidence in routing layer of intentionally hidden pre-nursing pages; modules not in `PRE_NURSING_SLUGS` would 404 at lesson detail — registry and map stay aligned.

## Module ↔ lessons ↔ question bank

**Registry modules (30)** — each has `slug`, i18n keys, and `lessons` count in `PRE_NURSING_MODULE_REGISTRY`.

**Question bank modules (10)** — from `BANK_MODULE_SLUGS`:

`anatomy-physiology`, `medical-terminology`, `pharmacology`, `fluids-electrolytes`, `infection-control`, `pathophysiology`, `chemistry`, `nutrition-foundations`, `oxygenation`, `health-assessment`

**Interpretation:** `/pre-nursing/practice/[slug]` is **publish-ready** only for slugs that resolve `getQuestionsForModule` to a non-empty set (the ten above). Other slugs remain **lesson-first** surfaces; adding bank arrays is the code path to expand practice coverage.

## Quizzes and practice sets (terminology)

| Kind | Where | Notes |
|------|-------|------|
| Inline lesson quizzes | Module TSX via `interactive-learning` patterns | Per-module. |
| Comprehensive review | `pre-nursing-comprehensive-review-quiz.ts` | Content artifact. |
| Marketing static practice | `pre-nursing-question-bank.ts` + practice page | 80 MCQs total across 10 modules per file header. |
| Mini-CAT | `pre-nursing-exam-engine.ts` + `PreNursingMiniCatRunner` | Adaptive; bounded question flow. |

## Playwright / “main deploy” alignment

- `pathway-prenursing-allied-access.spec.ts` attaches `prenursing-allied-coverage-manifest.json` for operator truth; manifest text matches this audit’s routing claims.
- **Wire only publish-ready content:** all registry slugs resolve components; stubs do not ship as empty routes for those slugs.

## Gaps and follow-ups

1. **`reports/full-site-forgotten-pages-theme-audit.md`** — not present in workspace; re-link when restored.
2. **TEAS/HESI** — no dedicated routes; product positioning should continue through hub copy + science modules unless marketing adds explicit hubs later.
3. **Expand practice bank** — optional product work: add `PRE_NURSING_QUESTION_BANK` sections for additional `PRE_NURSING_MODULE_REGISTRY` slugs, then practice pages auto-apply.

---

*This document is documentation-only; it does not change runtime behavior.*
