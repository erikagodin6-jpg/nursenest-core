# Blog Content Overhaul Report - 2026-05-07

## 1. Root Cause Analysis

The low-quality articles were produced by multiple blog generation paths that shared permissive quality gates. The highest-impact source was the pathophysiology/pharmacology long-tail generator:

- `scripts/blog/lib/patho-pharm-longtail-content.ts`
- `scripts/blog/lib/patho-pharm-longtail-post-builder.ts`
- `scripts/blog/generate-patho-pharm-longtail-posts.mts`

The broken pattern was not a renderer bug. The Prisma `BlogPost` rows contained completed-looking HTML with repeated section shells, generic FAQ answers, repeated references, and keyword-dense body copy. Runtime rendering was faithfully serving the canonical database content.

Primary failure modes:

- Generator prose used reusable shells such as "This section connects..." and role labels such as "mechanism narrative", "assessment clustering", "intervention priorities", and "teaching script".
- H2/H3 structure allowed fake educational headings such as "deeper" and "application".
- Generic APA/source starter sets were reused across unrelated clinical topics.
- FAQ generation reused broad escalation/review questions instead of topic-specific learner questions.
- Publish gates detected some placeholder issues, but not enough topic drift, heading boilerplate, keyword stuffing, duplicate section prose, or irrelevant references.

## 2. Generator And Template Files Found

Generation and prompt/control files reviewed or changed:

- `src/lib/blog/blog-article-pipeline-prompts.ts`
- `src/lib/blog/rn-lesson-seo-blog-generator.ts`
- `src/lib/blog/blog-generation-output-gate.ts`
- `src/lib/blog/blog-content-quality-gate.ts`
- `src/lib/blog/blog-publish-quality-validator.ts`
- `scripts/blog/lib/patho-pharm-longtail-content.ts`
- `scripts/blog/lib/patho-pharm-longtail-post-builder.ts`
- `scripts/blog/blog-quality-audit.mts`

Related publish/runtime architecture reviewed:

- `src/lib/blog/publish-blog-post-canonical.ts`
- `src/lib/blog/publish-generated-blog-article.ts`
- `src/lib/blog/safe-blog-queries.ts`
- `src/lib/blog/static-blog-posts.ts`
- `src/content/blog-static-posts.ts`

## 3. Architecture Map

Canonical runtime source:

1. `BlogPost` in Prisma remains the canonical runtime source for published blog pages.
2. Public blog routes query published rows through safe blog query helpers.
3. Static fallback content remains available for build/runtime resilience and `MARKETING_BLOG_SKIP_DB_FOR_BUILD`.

Generation flow:

1. Topic or lesson seed enters an admin/reliable/blog generator path.
2. Prompt builders or deterministic post builders create article HTML, FAQ, references, SEO fields, and internal link plans.
3. Drafts are written to `BlogPost`.
4. Canonical publish validates quality, SEO, links, references, and governance before `PUBLISHED`.

Fallback flow:

1. Build/runtime can skip DB reads when configured.
2. Static blog corpus remains server-side and unchanged by this overhaul.

Rendering flow:

1. Public route resolves slug.
2. Published `BlogPost` body is rendered server-side.
3. FAQ/schema/internal link data are emitted from stored structured fields when present.

## 4. Repetitive Patterns Removed Or Blocked

Removed from generators/prompts:

- "This section connects..."
- "This section focuses on..."
- fake "deeper" and "application" module labels
- "mechanism narrative"
- "assessment clustering"
- "intervention priorities"
- "teaching script"
- generic FAQ shell questions
- generic reference paragraph language
- RN lesson CTA heading "Go deeper..."

New blocking rules:

- Publish quality now blocks fake template headings.
- Output gate rejects draft HTML with template/filler headings before storage.
- Content gate blocks repeated fake subsection labels.
- Keyword stuffing threshold is stricter for primary phrase repetition.
- Reference relevance checks dedupe APA/source rows before scoring.
- Topic drift checks are enforced in canonical publish tests with a realistic body fixture.

## 5. Existing Article Cleanup

`npm run blog:quality:audit -- --limit=5000 --apply` scanned 169 published rows and flagged 142.

All 142 flagged published rows were moved to `NEEDS_REVIEW` / `NEEDS_SEO_REVIEW`; no rows were deleted. The audit wrote:

- `reports/blog-quality-audit.md`
- `reports/blog-quality-audit.json`

Representative affected examples were included in the flagged set:

- `lt-reg-cs-diabetic-neuropathy-loss-of-protective-sensation`
- `lt-reg-cs-metabolic-alkalosis-hypokalemia`
- `lt-reg-cs-respiratory-acidosis-confusion`

## 6. Before And After Examples

Before, generated pathophysiology content used generic meta prose:

> This section connects the clinical question...

After, the generator starts with topic-specific clinical mechanism language:

> At the bedside, the nurse sees the symptom after the disease process changes perfusion, oxygenation, fluid balance, neurologic signaling, or medication response.

Before, deterministic generator labels included:

- `Assessment clustering.`
- repeated generic FAQ answers
- repeated starter reference explanations

After, the generated structure uses:

- `Focused assessment.`
- topic-sensitive pathophysiology versus pharmacology FAQs
- a smaller starter reference set with explicit editor replacement guidance

## 7. Validation Commands And Results

Passed:

- `npx tsx --test src/lib/blog/blog-content-quality-gate.test.ts`
- `npx tsx --test src/lib/blog/blog-generation-output-gate.test.ts src/lib/blog/blog-content-quality-gate.test.ts src/lib/blog/rn-lesson-seo-blog-generator.test.ts`
- `npx tsx --test src/lib/blog/blog-publish-quality-validator.test.ts`
- `npm run typecheck:critical`
- `npm run blog:quality:test` - 59 tests passed
- `npm run blog:quality:audit -- --limit=5000 --apply` - scanned 169, quarantined 142

Targeted phrase scan was run across blog generator/library paths. Remaining matches are intentional test fixtures, validator banned-phrase lists, and prompt instructions that tell the model what not to write.

## 8. Remaining Limitations

The cleanup removed low-quality live posts from published status, but it did not automatically rewrite all 142 flagged articles into final clinical replacements. That should be handled by the improved generation path plus editorial review before republishing.

The audit intentionally fails closed. Some New Grad posts were quarantined for generic FAQ answers even when the main body may be salvageable.

## 9. Performance And Build Impact

No client-side rendering was introduced. No schema, Prisma model, migration, seed, runtime route, hydration, sitemap, canonical URL, or localization behavior was changed.

The stricter checks run in existing server-side generation/publish/audit paths. Static fallback behavior and `MARKETING_BLOG_SKIP_DB_FOR_BUILD` remain intact.

## 10. SEO Improvements

The overhaul reduces SEO risk by:

- blocking keyword stuffing
- blocking low-information repeated prose
- blocking irrelevant reference clusters
- preventing fake heading structures
- requiring topic/title terms to appear substantively in the body
- preserving canonical `BlogPost` publish boundaries
- moving flagged published rows out of public status until reviewed

