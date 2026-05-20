# Pathophysiology / pharmacology blog — publishing report

**Date:** 2026-05-09 (workspace clock)  
**Repo:** `/root/nursenest-core` (app in `nursenest-core/`)

---

## 1. Truthpack

| Item | Result |
|------|--------|
| `.vibecheck/truthpack/ui-pages.json` etc. | **Not found** in this clone (0 matches under `.vibecheck/truthpack/`). |
| Alignment action | Regenerate truthpack per internal `vibecheck truthpack` when available; reconcile tier names and CTAs before shipping inventory-driven posts. |

---

## 2. Publishing reality (how posts go live)

| Path | Description |
|------|-------------|
| **Primary** | `BlogPost` rows in Postgres via **admin** APIs/UI (`/admin/blog`, `api/admin/blog/*`): drafts, AI generation, validation, manual publish. |
| **Scheduler** | `POST /api/blog/publish` with `CRON_SECRET` promotes scheduled posts (`api/blog/publish/route.ts`). |
| **Static fallback** | `STATIC_BLOG_POSTS` in `nursenest-core/src/content/blog-static-posts.ts` — **not** a substitute for production DB publishing; used when no live DB posts / build skip. |
| **Markdown on disk** | Not the canonical store for public blog; content lives in DB or static TS corpus. |
| **This session** | **No production DB writes** (no credentials assumed). Inventory + helper script are **dev-safe** inputs for future admin batches. |

---

## 3. Posts generated / published in this change set

| Type | Count |
|------|------:|
| New `BlogPost` rows | **0** (no DB access / intentional). |
| New static corpus posts | **0** (preserve existing 3 posts). |
| Planning inventory rows | **300** in `reports/patho-pharm-longtail-topic-inventory.md` |

---

## 4. SEO / sitemap / breadcrumbs

- **Sitemap:** `sitemap-blog-xml.ts` merges DB + static slugs with caps; unchanged in this task.
- **Article SEO:** `blog/[slug]/page.tsx` metadata path unchanged.
- **Breadcrumbs:** Still driven from post SEO / `internalLinkPlan`; no regression introduced (no edits to those files).

---

## 5. Internal linking

- Inventory **Related NurseNest modules** and **Internal linking targets** use only paths verified from codebase, e.g. `/app/labs`, `/app/labs/electrolytes/potassium-priority-management`, `/app/flashcards`, `/app/questions`, `/app/practice-tests`, `/app/cat`, `/app/lessons`, `/app/med-calculations`, `/modules/ecg/basic/lessons`, `/question-bank`, `/tools`, `/pre-nursing/lessons/pharmacology`, `/pre-nursing/lessons/pathophysiology`, `/pre-nursing/lessons/fluids-electrolytes`, `/us/rn/nclex-rn/lessons`, and existing `/blog/*` static slugs.

---

## 6. DB path

**N/A** for writes in this environment. Recommended operator path: Admin → Draft batch → process chunks → publish / schedule → cron `POST /api/blog/publish` if using `SCHEDULED`.

---

## 7. Sample URLs (always-on marketing)

- `https://<host>/blog`
- `https://<host>/blog/clinical-judgment-on-exam-day`
- `https://<host>/blog/pharmacology-without-memorization-chaos`
- `https://<host>/blog/lab-trends-and-acute-kidney-injury`
- `https://<host>/blog/tag/pathophysiology`

---

## 8. Tooling added

| File | Purpose |
|------|---------|
| `nursenest-core/scripts/blog/patho-pharm-inventory-topics.mjs` | Stdout **titles** from inventory for admin paste (`--limit` optional). |
| `nursenest-core/tests/e2e/public/blog-patho-pharm-smoke.spec.ts` | Playwright smoke: `/blog`, static slugs, `/blog/tag/pathophysiology`. |

---

## 9. Validation commands

All run from `nursenest-core/` (`cd nursenest-core`).

| Command | Exit code | Notes |
|---------|-----------:|-------|
| `npm run typecheck:critical` | **0** | Passed. |
| `npm run test:blog-recovery` | **0** | 54 tests passed. |
| `npm run test:homepage` | **0** | 78 passed, 1 skipped. |
| `npm run build` | **not run** | Full Next build is heavy; not required for docs-only + small e2e file; run before merge if policy requires. |
| `npx playwright test tests/e2e/public/blog-patho-pharm-smoke.spec.ts --list` | **0** | 10 tests enumerated (chromium + webkit projects). |
| `npx playwright test tests/e2e/public/blog-patho-pharm-smoke.spec.ts` | **not run** | Requires reachable baseURL (dev/staging). Start app then run for green browser proof. |

---

## 10. Blockers

1. **Truthpack missing** — cannot auto-verify product tier strings against `product.json` in this clone.  
2. **No production DB** — cannot confirm live slug collision set; operators should diff new slugs against `BlogPost.slug` + static corpus before bulk insert.  
3. **Draft batch limit** — 300 topics require **≥2** `BlogDraftGenerationBatch` creates (max 150 topics each).

---

## 11. Deliverables checklist

- [x] `reports/patho-pharm-blog-generation-plan.md`
- [x] `reports/patho-pharm-longtail-topic-inventory.md` (300 table rows)
- [x] `reports/patho-pharm-blog-publishing-report.md` (this file)
- [x] `nursenest-core/scripts/blog/patho-pharm-inventory-topics.mjs`
- [x] `nursenest-core/tests/e2e/public/blog-patho-pharm-smoke.spec.ts`

---

*Verified By VibeCheck ✅* (truthpack absent — documented; no invented product tiers.)

## 12. Follow-up validation (automated pass)

| Command | Exit | Notes |
|---------|------:|-------|
| `npm run typecheck:critical` (from `nursenest-core/`) | **0** | ~133s |
| `npm run test:blog-recovery` | **0** | 54 tests pass |
| `npm run test:homepage` | **0** | 78 pass, 1 skip |
| `npm run test:blog` | **N/A** | No such script; use `npm run test:blog-recovery` |
| `npm run lint` | **N/A** | No `lint` script in `nursenest-core/package.json`; `npx eslint` hit local npm path ENOENT in this runner |
| `npm run build` | **not run here** | Full Next build not executed in this pass; run before merge per policy |

### Playwright

- Extended `nursenest-core/tests/e2e/public/blog-patho-pharm-smoke.spec.ts` with category hub checks for static corpus categories (`Pharmacology`, `Labs & Pathophysiology`, `Exam Strategy`).
- List-only: `npx playwright test tests/e2e/public/blog-patho-pharm-smoke.spec.ts --list` (run locally when Playwright deps resolve).

Playwright list blog-patho-pharm-smoke: exit 0, Total 34 tests (chromium + webkit).
