# New graduate nursing hybrid static long-tail batch (325 posts)

**Generated:** 2026-05-10 (batch content `publishedAt` / `updatedAt`: 2026-05-09)  
**Content directory:** `src/content/blog-static-longtail/`  
**Deterministic generator:** `scripts/blog/lib/new-grad-longtail-generate-core.ts`  
**CLI:** `npx tsx scripts/blog/generate-new-grad-static-longtail.mts` (run from `nursenest-core/`)

## Scope and counting

- This batch adds **325** markdown files focused on **NCLEX-RN / REx-PN new graduates**, **transition to practice**, **residency-style habits**, **prioritization**, **delegation**, **communication**, **documentation**, **escalation**, **NGN-style reasoning**, and **shift organization**.
- Topic model: **25 explicit anchor slugs** plus **300** distinct combinations from **15 workflow themes × 20 care settings**, each with a unique `new-grad-nursing-*-transition-longtail` slug (no collisions with pre-existing filenames in this workspace at generation time).
- The long-tail directory also contains **other** hybrid supplements from prior work; this report inventories **only** the 325 batch rows. Machine-readable per-post metrics: `reports/new-grad-nursing-longtail-batch-325-posts.tsv`.

## Quality gates (user-requested)

| Gate | Result | Exit code |
|------|--------|-----------|
| `npm run validate:blog-static-longtail` | Pass | 0 |
| `npm run diagnose:blog-slug-collisions -- --write-report` | Pass (see DB note below) | 0 |
| `npm run typecheck:critical` | Pass | 0 |
| `npm run test:blog-recovery` | Pass | 0 |
| `npm run test:homepage` | Pass (1 skipped test unchanged) | 0 |

## Word count and schema

- **Target band:** each body is roughly **1600–1700 words** (above the **1400** floor, substantive HTML; not lorem padding). Spot checks pass `validateBlogPublishQuality` with `{ skipReferenceTopicAlignment: true }` and keep H2 section Jaccard **below 0.48** on sampled rows.
- **Frontmatter:** matches hybrid long-tail requirements (`slug`, `title`, `excerpt`, `category`, `tags`, `seoTitle`, `seoDescription`, `canonicalUrl`, `authorDisplayName`, `medicalReviewerName`, `disclaimer`, `publishedAt`, `updatedAt`).
- **On-page sections:** Introduction; Key Takeaways; Why this matters for new grads; Clinical reasoning considerations; Prioritization frameworks; Common mistakes and safety risks; Communication pearls; Documentation tips; Escalation/red flag situations; Shift organization and workflow tips; Delegation considerations; NGN-style thinking points; Exam-focused review points; Suggested Internal Links; Premium CTA; FAQ Schema Questions; APA-7 References (national organizations and federal sources; **no fabricated DOIs**).

## SEO completeness (batch-level)

- `seoTitle` clamped to ~60 characters with ` | NurseNest` suffix where needed.
- `seoDescription` ≤ 155 characters with ellipsis when truncated.
- `canonicalUrl` = `/blog/{slug}` for every row in the TSV (`canonical_ok=yes`).

## Internal links (pattern)

Each post includes the same **families** of internal URLs used elsewhere in hybrid long-tail content, rotated for variety:

- `/app/dashboard`, `/flashcards`, `/question-bank`, `/app/cat`, `/app/labs`, `/app/ecg`
- Three rotating `/blog/...` long-tail clinical supplements for cross-link depth.

## DB slug collision diagnostic (supplement ∩ live CMS)

`npm run diagnose:blog-slug-collisions -- --write-report` reported **20** live `BlogPost` rows whose slugs overlap the **supplement union** (bundled static + long-tail). **None** of those 20 are from this batch’s `new-grad-nursing-*` / anchor slug set; they are legacy **pathophysiology / clinical** long-tail slugs that already exist as published CMS posts. **DB continues to win** at merge time per product rules.

Report file written by the diagnostic: `docs/reports/blog-slug-collision-diagnostic.txt`.

## Excluded failures

- **None** for the shipped 325: all listed slugs were written, meet the ≥1400 word floor enforced in `buildMarkdownFile`, and passed `validate:blog-static-longtail`.

## Per-post listing

See **`reports/new-grad-nursing-longtail-batch-325-posts.tsv`** (columns: `slug`, `word_count`, `seo_title_len`, `seo_desc_len`, `canonical_ok`, `internal_link_count`, `title`).

## Files touched (this work)

- `scripts/blog/lib/new-grad-longtail-generate-core.ts` — manifest + HTML builder + markdown assembler.
- `scripts/blog/generate-new-grad-static-longtail.mts` — writer CLI (refuses to overwrite existing slugs).
- `src/content/blog-static-longtail/*.md` — **325** new files (batch slugs only).
- `reports/new-grad-nursing-longtail-batch-325.md` — this index.
- `reports/new-grad-nursing-longtail-batch-325-posts.tsv` — per-post metrics.

## Regeneration note

Re-running `generate-new-grad-static-longtail.mts` after files exist will **exit non-zero** until you remove or rename conflicting slugs, by design.
