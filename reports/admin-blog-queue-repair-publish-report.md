# Admin blog queue — repair, validation, publish report

**Branch:** `main` (after `efe9e9560`).  
**Outcome:** Queue audited; **one** admin-test row set to **`FAILED`**; **zero** posts published — **all queue rows fail strict `validateBlogPrePublish`**.

## Summary totals

| Metric | Value |
|--------|------:|
| Rows audited (non-live queue statuses) | 146 |
| Rows repaired (DB status hygiene only) | 1 |
| Rows published | **0** |
| Rows left unpublished | **146** |

## Database & APIs

- **Model:** `BlogPost` — `nursenest-core/prisma/schema.prisma`
- **Publish:** `PATCH /api/admin/blog/[id]` with `action: "publish_now"` → `publishBlogPostCanonical` (`nursenest-core/src/lib/blog/publish-blog-post-canonical.ts`)
- **Cron / batch:** `nursenest-core/src/app/api/cron/blog-batch-schedule/route.ts` (+ related admin batch routes)

## Repair performed

1. **`phase1-gemini-verify-1776115667592`** — `postStatus: FAILED`, `workflowStatus: FAILED_GENERATION`, `publishAt: null` (aligned with admin **mark_failed** semantics).

No routing, schema migrations, or learner UI changes.

## Validation code

- `nursenest-core/src/lib/blog/blog-pre-publish-validation.ts` — **unchanged** (gates already sufficient).

## Commands (exit codes)

| Command | Exit |
|---------|-----:|
| `npx tsx scripts/blog/verify-blog-publication-readiness.mts` | **0** |
| `npx tsx scripts/blog/verify-admin-publish-path.mts` (dry-run) | **0** |
| `npm run typecheck:critical` | **0** |
| `npm run test:seo-sitemap` | **1** — `long-tail-seo-trio-blog-seed.contract.test.ts` word-count assertion (**pre-existing**, unrelated) |

`npm run build` — not run.

## Revalidation

On successful publish, `revalidateBlogPublishingSurfaces` runs (`nursenest-core/src/lib/blog/blog-revalidate-publishing.ts`). **No publish this run → no ISR.**

## Live QA

**Not verified** — no `BASE_URL`/deployment target provided for HTTP checks; no HTTP 200 evidence collected.

## Files changed (git)

- `reports/admin-blog-queue-audit.md`
- `reports/admin-blog-queue-detail.tsv`
- `reports/blog-publication-readiness.md` (from verify script)
- `nursenest-core/scripts/blog/export-admin-blog-queue-tsv.mts`

## Git commit

After staging:

```bash
git commit -m "fix(blog): repair and publish queued admin posts"
```

**Commit:** `git log -1 --oneline --grep="fix(blog): repair and publish queued admin posts"` (reports bundled in that revision).

---

## Parent handoff

| Field | Value |
|-------|-------|
| **Published count** | **0** |
| **Blockers** | All queue rows fail `validateBlogPrePublish` — especially nursing/mechanism sections, content + publish quality gates, ~1500-word target, internal links/FAQ plans, stubs on `lt-reg-cs-*` |
| **Live QA** | **No** |
