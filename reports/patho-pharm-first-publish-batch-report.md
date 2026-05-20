# Pathophysiology / pharmacology — first publish batch report

**Date:** 2026-05-09  
**Scope:** Intended safe first batch (15 topics) from `reports/patho-pharm-longtail-topic-inventory.md` using the **existing admin blog pipeline** only.  
**Outcome:** **No posts were generated or published** in this run. Blockers are documented below with verification and command results.

---

## 1. Topics selected for batch 1 (15)

These are consecutive inventory rows **#21–#35** (pathophysiology / pharmacology / med-safety long-tail mix). Slugs are taken verbatim from the inventory table.

| Inv # | Slug |
|------:|------|
| 21 | `lt-21-nms-rigidity-fever-after-antipsychotic-increase-norcet-np` |
| 22 | `lt-22-lithium-toxicity-coarse-tremor-sodium-low-ati-new-grad` |
| 23 | `lt-23-digoxin-toxicity-brady-with-normal-potassium-trap-nclex-rn-pre-nursing` |
| 24 | `lt-24-tca-overdose-sodium-bicarb-for-wide-qrs-hesi-allied` |
| 25 | `lt-25-salicylate-mixed-acid-base-presentation-nclex-pn-rn` |
| 26 | `lt-26-acetaminophen-staggered-overdose-nomogram-panic-nmc-cbt-rpn` |
| 27 | `lt-27-intracranial-bleed-on-warfarin-reversal-agents-chaos-cpnre-np` |
| 28 | `lt-28-hit-platelet-drop-day-5-post-surgery-ahpra-new-grad` |
| 29 | `lt-29-tumor-lysis-prophylaxis-allopurinol-timing-rex-pn-pre-nursing` |
| 30 | `lt-30-neutropenic-fever-cultures-before-tylenol-debate-pnle-allied` |
| 31 | `lt-31-c-diff-watery-stool-after-recent-cephalosporin-ngn-rn` |
| 32 | `lt-32-pancreatitis-lipase-sky-high-pain-radiates-back-norcet-rpn` |
| 33 | `lt-33-ascites-fever-diagnostic-paracentesis-when-ati-np` |
| 34 | `lt-34-aki-creatinine-bump-after-contrast-myth-vs-reality-nclex-rn-new-grad` |
| 35 | `lt-35-rhabdomyolysis-tea-urine-ck-climbing-hesi-pre-nursing` |

Full titles: see `reports/patho-pharm-longtail-topic-inventory.md` rows 21–35 (script: `node scripts/blog/patho-pharm-inventory-topics.mjs --limit 35` then drop first 20 lines externally if needed).

**Inventory script smoke** (from `nursenest-core/`, first 3 titles):

```bash
node scripts/blog/patho-pharm-inventory-topics.mjs --limit 3
```

**Exit code:** `0`

---

## 2. Admin pipeline traced (HTTP contracts — no bypass)

| Step | Method | Route | Notes |
|------|--------|-------|------|
| Create draft batch | `POST` | `/api/admin/blog/draft-batch` | Body: `topicsText`, `exam`, `template`, optional `intent`, `funnelStage`, `tone`, … (`blogDraftGenerationBatchCreateBodySchema`). |
| Process chunk | `POST` | `/api/admin/blog/draft-batch/[id]/process` | JSON `{ limit }` optional. **`adminAiGenerationHttpBlock({ pipeline: "blog" })`** then `processDraftGenerationBatchItems`. |
| Inspect post | `GET` | `/api/admin/blog/[id]` | |
| Pre-publish validation | `GET` | `/api/admin/blog/[id]/pre-publish-validation` | Do not skip for real publishes. |
| Publish | `PATCH` | `/api/admin/blog/[id]` | `action: "publish_now"` (and related); canonical path uses `publishBlogPostCanonical`. |

**UI:** `nursenest-core/src/components/admin/admin-blog-draft-batch-client.tsx`

**Auth:** `requireAdmin` → `getStaffSession()` (DB-backed staff session + RBAC on path).

**Generation:** `processDraftGenerationBatchItems` requires `getAdminAiGenerationGate().runnable` (see `src/lib/blog/blog-draft-generation-batch.ts`).

---

## 3. Environment / DB

- **`DATABASE_URL`:** Set in environment; Prisma read queries succeeded.
- **`.env.local`:** Present; grep for standard AI env **names** did not show `AI_ADMIN_GENERATION_ENABLED` / OpenAI / OpenRouter lines (other injection possible, but gate is the documented blocker for local HTTP generation).
- **Prod vs staging:** Not classified. No credentials invented.

**Prisma checks:**

- `BlogPost` count with slug prefix `lt-1-` (inventory row-1 style): **0**
- `BlogPost` rows with slug prefix `lt-`: **50** (e.g. `lt-reg-cs-*`, mostly **`NEEDS_REVIEW`** — not inventory SEO slugs `lt-21-…`).

---

## 4. `safe-blog-queries` / sitemap / public blog

- **List + detail:** `src/lib/blog/safe-blog-queries.ts`
- **Sitemap merge:** `src/lib/seo/sitemap-blog-xml.ts` → `getMergedBlogSitemapSlugRows` (contract tests in `npm run test:blog-recovery`).
- **This run:** No publish → no new sitemap URLs to diff. Verification = **code + tests**, not live production sitemap fetch.

---

## 5. Published URLs

**None** for §1 slugs. Intended pattern: `/blog/<slug>` on the deployment host.

---

## 6. Failed generations

| Stage | Result |
|--------|--------|
| Draft batch | Not executed (no admin session + automated HTTP). |
| Process | Would not run AI locally without enabled gate + provider key. |
| Publish | Not executed. |

---

## 7. Commands + exit codes (cwd: `nursenest-core/`)

| Command | Exit |
|---------|------|
| `npm run typecheck:critical` | **0** |
| `npm run test:blog-recovery` | **0** |
| `npm run test:homepage` | **0** (1 subtest **skipped**) |
| `npx playwright test tests/e2e/public/blog-patho-pharm-smoke.spec.ts` | **1** |

**Playwright:** 28 tests (chromium + webkit). **2 passed**, **2 skipped**, **24 failed** (~14.3m). Common issues: `page.goto` **120s timeout**; `article` missing or **loading** (`aria-busy="true"`). Likely dev server + DB slowness / contention under 2 workers—not attributed to the unpublished batch.

---

## 8. Draft / post IDs

**None** for this batch.

---

## 9. Next steps

1. Staging (recommended): staff login → enable `AI_ADMIN_GENERATION_ENABLED` + blog provider keys → `POST` draft-batch with 15 topic lines → `POST` process until complete → pre-publish → `PATCH` publish_now per post.
2. Re-verify `BlogPost` rows, `/blog`, `/blog/[slug]`, and sitemap merge on that host.
3. Re-run Playwright against a **stable** `BASE_URL` if local `next dev` is slow.

---

## 10. Truthpack

`.vibecheck/truthpack/` not found in this clone.
