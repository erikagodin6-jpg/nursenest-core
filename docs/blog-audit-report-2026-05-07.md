# Blog content quality audit — 2026-05-07

## Executive summary

**Canonical public blog corpus (this repo):** `nursenest-core/src/content/blog-static-posts.ts` is the runtime source for the bundled static fallback used when `MARKETING_BLOG_SKIP_DB_FOR_BUILD=true`, when the database is unavailable, or when `getPublishedBlogPostBySlug` falls back after a scoped DB miss (see `src/lib/blog/static-blog-posts.ts` and `safe-blog-queries.ts`). **Production with a populated `BlogPost` table** still serves Prisma-backed rows first; static posts are the safety net and build-time corpus, not a substitute for DB editorial workflow.

**Companion file:** `nursenest-core/src/content/blog-static-posts.json` is registry-approved (`content-registry.ts`) but **not** imported by the Next app at runtime; it was brought in line with the `.ts` corpus for metadata and teaching themes to reduce drift.

**Truthpack:** `.vibecheck/truthpack/*.json` was **not present** in this workspace (only `.vibecheck/sync-queue.json`, registry-cache, etc.). Alignment used in-repo routes verified against `pre-nursing-registry` and marketing route files.

## Inventory

| Layer | Role |
|--------|------|
| `BlogPost` (Prisma) | Primary live content when DB has published rows |
| `blog-static-posts.ts` | **Canonical in-repo** static HTML corpus |
| `blog-static-posts.json` | Approved root content file; updated for parity |
| Admin / scripts (`scripts/blog/*`, import pipelines) | DB seeding and generation; not edited in this pass |

**Total static posts audited:** 3

| Slug | Category | Notes |
|------|----------|--------|
| `clinical-judgment-on-exam-day` | Exam Strategy | Exam / clinical judgment |
| `pharmacology-without-memorization-chaos` | Pharmacology | Pharm study |
| `lab-trends-and-acute-kidney-injury` | Labs & Pathophysiology | Pathophysiology-adjacent (AKI) |

**Coverage vs. requested mix (≥3 patho, ≥3 pharm, etc.):** The static corpus contains **one** Pharmacology article, **one** Labs & Pathophysiology article, and **one** Exam Strategy article. Additional pathophysiology and pharmacology volume lives in **database-seeded** catalogs (`scripts/blog/pathophysiology-nursing-blog-seed-catalog.ts`, long-tail seeds, etc.), which were **not** modified here because they require DB application and clinical review outside file-only edits.

## Placeholder / low-quality scan

- Grep on `blog-static-posts.ts` for `Lorem`, `TODO`, `TBD`, `Coming soon`, `placeholder`, boilerplate openers: **no matches**.
- Raw i18n keys in static HTML: **none found**.

## Fixes applied (safe, source-aligned)

### All posts

- Category capitalization: `Exam Strategy`, `Labs & Pathophysiology` (Pharmacology unchanged).
- Internal links: added `/flashcards` where appropriate; retained verified `/pre-nursing/lessons/*`, `/question-bank`, `/us/rn/nclex-rn/lessons`, `/tools`, cross-blog links.

### `lab-trends-and-acute-kidney-injury` (Pathophysiology / AKI)

- **SEO / excerpt:** Fixed punctuation `shifts-how` → em dash `shifts—how` (matches JSON excerpt style).
- **Substantive sections added** (no fabricated dosing or new numeric thresholds): **Nursing priorities**, **Clinical judgment and red flags**, **Patient and family education**, **Exam relevance** — consistent with existing AKI narrative in the same article.

### `pharmacology-without-memorization-chaos`

- **New section:** **Contraindications, precautions, and interaction vigilance** — class-level nursing exam framing only; no patient-specific doses.

### `clinical-judgment-on-exam-day`

- **New sections:** **CAT Exam and unfolding case items**; **Patient education after stability** — aligned with NGN / case-style item behavior already described elsewhere in the post.
- Summary paragraph: link text tuned for **Lessons** / **Flashcards** / **Pharmacology** capitalization.

### `blog-static-posts.json`

- Excerpts and categories synced; body HTML expanded from thin teaser paragraphs to short structured HTML reflecting the same teaching arcs (still shorter than `.ts` by design to keep JSON maintainable).

## Posts unchanged vs. fixed

| Post | Change |
|------|--------|
| All three | Metadata / structure / new sections as above |
| None | Left entirely unchanged |

## SEO / meta

- Excerpt quality improved on AKI post (punctuation).
- No title changes (already descriptive); no keyword stuffing.

## Internal links added or adjusted

- `/flashcards` from clinical judgment summary and AKI summary.
- “Lessons” anchor text on exam pathway link in clinical judgment summary.

## References

- No fabricated citations; existing article did not use APA blocks in static shape.

## Rendering QA

| Check | Result |
|--------|--------|
| Cursor IDE Browser MCP → `http://127.0.0.1:3010/blog/...` | **Failed** (`chrome-error://chromewebdata/`) — MCP browser cannot reach this environment’s localhost. |
| `curl` to `127.0.0.1:3010` | Slow/large responses; not used for pixel QA. |

**Screenshots:** Directory created at `docs/blog-audit-screenshots-2026-05-07/` — **no image files** saved (browser MCP unreachable to localhost). **Recommended follow-up:** run `MARKETING_BLOG_SKIP_DB_FOR_BUILD=true NN_SKIP_DEV_AUTH_SECRET=1 npx next dev` locally and capture desktop + mobile for the three slugs above.

**Published site:** Not verified; depends on deployment and which layer (DB vs static) serves each slug in production.

## Validation commands

```bash
cd nursenest-core
MARKETING_BLOG_SKIP_DB_FOR_BUILD=true npm run typecheck:critical
node --import tsx --test src/lib/marketing/build-phase-memory-guards.test.ts
```

- **typecheck:critical:** PASS  
- **build-phase-memory-guards.test.ts:** PASS (19 tests)

## Posts needing later clinical expansion

- Any **future** DB-backed pathophysiology or pharmacology long-tail posts should be reviewed with **source-backed** clinical references per `blog-content-quality-gate.ts` / admin pipeline rules.
- Static corpus remains intentionally small (3 posts); scaling content remains a **DB + editorial** concern.

## Remaining risks

- **DB vs static divergence:** If production DB rows for these slugs differ from the static corpus, users see DB content until fallback conditions apply.
- **JSON vs TS body length:** JSON bodies are abbreviated; only `.ts` is authoritative for full HTML at runtime.

## Files touched

- `nursenest-core/src/content/blog-static-posts.ts`
- `nursenest-core/src/content/blog-static-posts.json`
- `docs/blog-audit-report-2026-05-07.md` (this file)
- `docs/blog-audit-screenshots-2026-05-07/` (empty directory placeholder for screenshot workflow)

No Prisma schema or migrations.
