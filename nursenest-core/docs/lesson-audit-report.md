# Pathway lesson audit (catalog health)

**Verification:** `npm run audit:lesson-health` (runs `scripts/audit-lesson-content-health.ts`). This pass reads `src/content/pathway-lessons/catalog.json`, merges scoped-gold lessons, and does **not** import `pathway-lesson-loader` (avoids the `server-only` graph). It does **not** evaluate `structuralQuality.publicComplete` or premium gates; use app code or admin tooling for those.

## Latest run (representative)

| Metric | Count |
|--------|------:|
| Total lesson rows (all non-hidden exam pathways) | 1019 |
| Thin body (&lt;80 words across section bodies) | 15 |
| Few sections (&lt;3 when any exist) | 0 |
| `relatedLessonRefs` → slug missing in **global** merged catalog | 0 |
| `](LESSON:slug)` wiki links → slug not in global set | 152 |

**Per-pathway split (lessons / thin / fewSec / badRelated / badWiki):** see command output; thin lessons cluster in `ca-rn-nclex-rn` and `us-rn-nclex-rn`; broken wiki links cluster in REx-PN / NCLEX-PN mirrors and NP pathways.

## Root causes

1. **Related refs:** Previously counted as broken when resolved only inside a single pathway. Cross-pathway references are valid; the audit now resolves `relatedLessonRefs` against **all** merged pathway slugs (`globalSlugs`).
2. **Wiki links:** Remaining `LESSON:` failures are slugs that never appear in any pathway’s merged catalog (typos, renamed lessons, or placeholders). Fixing requires content edits in `catalog.json` (or adding the missing lesson rows).
3. **Thin lessons:** Short section bodies—editorial expansion, not routing.

## Implemented product changes (reference)

- High-yield strips: `deriveLessonHighYieldStudyFields`, `PathwayLessonStudy*Strip` components, marketing/allied/learner lesson pages, `globals.css` pastel blocks.
- `PATHWAY_CATALOG_LIST_HARD_CAP` lives in `pathway-lesson-scale.ts` for use from `pathway-lesson-catalog-sync` without circular imports.

## Remaining gaps

- Repair or remove the 152 bad `LESSON:` targets in content.
- Structural/premium completeness: not covered by this script.
- Full `tsc`: the repo may still have unrelated TypeScript errors outside this audit; run `npm run typecheck` when cleaning CI.
