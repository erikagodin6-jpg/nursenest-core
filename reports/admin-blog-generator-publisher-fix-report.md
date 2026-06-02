# Admin blog generator / publisher — trace, harness, and verification

**Date:** 2026-05-09  
**Workspace:** `/root/nursenest-core` (Next app: `nursenest-core/`)

## Executive outcome

| Item | Status |
|------|--------|
| New `BlogPost` for slug `why-potassium-changes-are-dangerous-in-acute-kidney-injury-nursing-exams` | **Not created in this session** — automation environment had `DATABASE_URL` but **no** `AI_ADMIN_GENERATION_ENABLED` / OpenAI / OpenRouter API keys in `process.env`, so the LLM pipeline cannot run here. |
| Code / tooling | **Updated:** CLI-friendly auth env check when `NODE_ENV` is unset; **added** `nursenest-core/scripts/blog/admin-control-panel-generator-harness.mts` + `npm run blog:admin-control-panel-harness`. |
| Target slug availability (DB) | **Confirmed free** via harness `--dry-run` (`ensureUniqueBlogPostSlug` result equals requested slug). |

**Parent summary:** **Not** end-to-end fixed in this agent (no generated row). **Post ID:** n/a. **Public URL:** would be `https://<marketing-host>/blog/why-potassium-changes-are-dangerous-in-acute-kidney-injury-nursing-exams` after successful publish. **Blocker:** missing AI admin env + API key material in the runner environment (see §6).

---

## 1. Trace — admin APIs and persistence

| Step | Location |
|------|-----------|
| Control panel enqueue | `POST /api/admin/blog/control-panel/generate` → `createBlogArticleGenerationJob` (202 + `jobId`) — `nursenest-core/src/app/api/admin/blog/control-panel/generate/route.ts` |
| Worker tick (same as cron primitive) | `POST /api/admin/blog/control-panel/article-jobs/[id]/tick` → `tickBlogArticleGenerationJob` — `nursenest-core/src/app/api/admin/blog/control-panel/article-jobs/[id]/tick/route.ts` |
| Pipeline | `runBlogArticleGenerationPipeline` → `persistControlPanelDraft` → optional `publishGeneratedBlogArticle` → `publishBlogPostCanonical` — `src/lib/blog/blog-article-generation-pipeline.ts`, `blog-control-panel-generation.ts`, `publish-generated-blog-article.ts`, `publish-blog-post-canonical.ts` |
| Direct create (non-queue) | `POST /api/admin/blog` — `src/app/api/admin/blog/route.ts` |
| Other generators | `POST /api/admin/blog/generate-ai`, `POST /api/admin/blog/generate-gemini-draft`, batch routes |
| Cron promotion | `POST /api/blog/publish` — `src/app/api/blog/publish/route.ts` — optional `Authorization: Bearer ${CRON_SECRET}` when `CRON_SECRET` set; calls `promoteScheduledBlogPosts` + `revalidateBlogPublishingSurfaces` |

**Prisma model:** `BlogPost` — `nursenest-core/prisma/schema.prisma` (`postStatus`, `publishAt`, `scheduledAt`, `workflowStatus`, slug, body, …).

**Public visibility:** `blogLiveWhere` / `blogPostIsLive` — `nursenest-core/src/lib/blog/blog-visibility.ts`. For **PUBLISHED** rows, public live requires `workflowStatus === PUBLISHED` and `publishAt` null or `<= now`.

**Static fallback:** `STATIC_BLOG_POSTS` is only used when DB is skipped/unconfigured or static probe allows it — `src/lib/blog/safe-blog-queries.ts` (`resolveBlogStaticFallbackProbe`). With live rows in DB (`blogLiveWhere` count > 0), public routes use **DB-backed** posts, not static-only masking.

---

## 2. Admin UI — generator + scheduler

- **Primary generator surface:** `/admin/blog` → `AdminBlogControlPanelClient` — enqueues `control-panel/generate`, then polls `article-jobs/{id}/tick` (long timeout).
- **Scheduler UI:** Same page includes **“Schedule publish date/time”** (`#schedule-publish`) and **“Scheduled/queued posts with status”** (`#scheduled-queued-posts`) fed by `scheduledPosts`, campaigns, and batch items — `nursenest-core/src/app/(admin)/admin/blog/page.tsx`. Dedicated scheduler route: `/admin/blog/scheduler`.

---

## 3. Root cause (this session)

1. **No funded AI + admin flag in agent `process.env`** → `getAdminAiGenerationGate({ pipeline: "blog" })` is not runnable; `validateRuntimeEnvOrThrow` in `src/lib/env/runtime-env-guard.ts` lists missing `AI_ADMIN_GENERATION_ENABLED` and OpenAI/OpenRouter keys when evaluated strictly.
2. **Secondary friction:** `isNonDevelopmentNodeEnv()` treated **unset** `NODE_ENV` like production for the **Auth secret** requirement, which breaks bare `npx tsx` diagnostics. **Fixed** by treating empty/whitespace `NODE_ENV` as non-production for that check.

No defect was found in `blogLiveWhere` / `publishBlogPostCanonical` contracts; `npm run test:blog-recovery` passes (including `blogPostIsLive` and publish-live-gate tests).

---

## 4. Actual changes (surgical)

| File | Change |
|------|--------|
| `nursenest-core/src/lib/env/runtime-env-guard.ts` | `isNonDevelopmentNodeEnv`: unset or blank `NODE_ENV` no longer implies production for auth env validation. |
| `nursenest-core/scripts/blog/admin-control-panel-generator-harness.mts` | **New** — loads dotenv + `loadBlogAuditEnv`, `--dry-run` for DB/slug/duplicate check without AI; full run creates job + tick + prints `blogPostIsLive`. |
| `nursenest-core/package.json` | Script: `blog:admin-control-panel-harness` → above harness. |

---

## 5. Required env (operator checklist)

From `runtime-env-guard.ts` + `admin-ai-policy.ts` + blog routing:

1. `DATABASE_URL` (+ `DIRECT_URL` as used by Prisma)
2. `AI_ADMIN_GENERATION_ENABLED=true` (or `1` / `yes` / `on`)
3. One of: `AI_INTEGRATIONS_OPENAI_API_KEY` or `OPENAI_API_KEY` with OpenAI routing, or `OPENROUTER_API_KEY` when OpenRouter is selected (`BLOG_AI_PROVIDER` / `AI_PROVIDER` per `src/lib/ai/blog-ai-routing.ts`)
4. For **Next.js server** with `NODE_ENV=production`: `AUTH_SECRET` or `NEXTAUTH_SECRET`
5. **Optional:** `CRON_SECRET` on `POST /api/blog/publish` when promoting scheduled rows (401 if mismatch when secret set)

**Local diagnostic only:** `NN_ENV_VALIDATION_MODE=warn` relaxes strict throws from `validateRuntimeEnvOrThrow` (still does not add API keys).

---

## 6. Blocker summary (this agent)

| Missing / invalid | Effect |
|-------------------|--------|
| `AI_ADMIN_GENERATION_ENABLED` + provider API key | Admin generate + harness full run cannot call OpenAI-compatible completions. |
| No `BlogPost` row | Cannot assign **post ID** or curl `/blog/[slug]` for this topic in this session. |

**To complete the mission on a machine with secrets:** from `nursenest-core/`:

```bash
export AI_ADMIN_GENERATION_ENABLED=true
# plus OPENAI_API_KEY or OPENROUTER_API_KEY + provider selection per docs
npx tsx scripts/blog/admin-control-panel-generator-harness.mts
```

Then verify:

```bash
npx tsx -e '(async()=>{ const {prisma}=await import("./src/lib/db.ts"); const s="why-potassium-changes-are-dangerous-in-acute-kidney-injury-nursing-exams"; const r=await prisma.blogPost.findUnique({where:{slug:s},select:{id:true,postStatus:true,workflowStatus:true,publishAt:true}}); console.log(r); await prisma.$disconnect(); })();'
```

Public: `/blog/<slug>` and index via `getPublishedBlogPostsPage` / `getPublishedBlogPostBySlug` (`safe-blog-queries.ts`).

---

## 7. Commands run (exit codes)

| Command | Working dir | Exit |
|---------|-------------|------|
| `npm run typecheck:critical` | `nursenest-core/` | **0** (`NODE_ENV=test`) |
| `npm run test:blog-recovery` | `nursenest-core/` | **0** (`NODE_ENV=test`) |
| `npm run test:homepage` | `nursenest-core/` | **0** (`NODE_ENV=test`) |
| `npx tsx scripts/blog/admin-control-panel-generator-harness.mts --dry-run` | `nursenest-core/` | **0** |
| `npm run blog:admin-control-panel-harness` (no AI keys) | `nursenest-core/` | **2** (expected: AI gate / env validation) |

---

## 8. Sitemap / blog XML

Blog sitemap slugs are merged via `getMergedBlogSitemapSlugRows` in `safe-blog-queries.ts` (used by `scripts/blog/verify-blog-publication-readiness.mts`). Live DB posts participate when they satisfy `blogLiveWhere`.

---

## 9. Security note

The agent environment `DATABASE_URL` pointed at a **managed production-style** host (`*.ondigitalocean.com`). **No mutating generate/tick** was executed against it without AI keys; only read-only counts and harness `--dry-run` ran. Operators should run the harness from **staging** or with explicit approval for production content inserts.

---

## 10. Follow-ups (optional)

1. Run full harness with real keys; capture `BlogPost.id` and curl `GET /blog/<slug>` on dev/staging (`npm run dev:next` + `curl -sSf http://localhost:3000/blog/...`).
2. Smoke-test `POST /api/blog/publish`: `curl -sS -X POST -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/blog/publish`.
