# REx-PN / Canadian RPN hybrid static long-tail batch (330 posts)

**Generated:** 2026-05-10 (repo-local deterministic generator; no external LLM APIs)  
**Output directory:** `src/content/blog-static-longtail/`  
**Slug prefix:** `rex-pn-rpn-` (namespace + collision avoidance with legacy pathophysiology slugs)  
**Generator:** `scripts/blog/rex-pn-rpn-longtail/generate-batch.mts`  
**npm script:** `npm run generate:rex-pn-rpn-longtail`

## Topic matrix (330 unique slugs)

- **30 anchor clinical themes** in `scripts/blog/rex-pn-rpn-longtail/anchors-data.ts`.
- **11 variant exam lenses** in `scripts/blog/rex-pn-rpn-longtail/variants-data.ts`.
- **330 combinations** = 30 × 11; each has a **unique slug**, **unique title**, and anchor-specific `lens` / `cues` / `settings` in `body-build.ts`.

**Note:** The task referenced “30 user-listed topics” but the list was not included in the prompt. This batch uses 30 in-repo anchors plus 300 permutations via variants. Replace `ANCHORS` / `VARIANTS` to align with a provided list if needed.

## Quality gates

| Gate | Result |
|------|--------|
| Body word count (`countWordsFromHtml`) | **min 2171**, **max 2257**, **avg ~2202** (≥ 1400 required) |
| `npm run validate:blog-static-longtail` | **exit 0** |
| `npm run diagnose:blog-slug-collisions -- --write-report` | **exit 0** |
| `npm run typecheck:critical` | **exit 0** |
| `npm run test:blog-recovery` | **exit 0** |
| `npm run test:homepage` | **exit 0** |

## DB slug collisions

Diagnostic reported **20** live DB posts overlapping supplement slugs (legacy pathophysiology long-tail). **No** `rex-pn-rpn-*` slugs appeared in the overlap list. Report: `docs/reports/blog-slug-collision-diagnostic.txt`.

## Manifest CSV

- `docs/reports/rex-pn-rpn-longtail-batch-330-manifest.csv`
- Copy: `reports/rex-pn-rpn-longtail-batch-330-manifest.csv`

## Truthpack

`.vibecheck/truthpack/copy.json` was not found in this workspace; CTA follows existing long-tail tone without inventing tiers.

## Regeneration

```bash
cd nursenest-core
npm run generate:rex-pn-rpn-longtail
npm run validate:blog-static-longtail
```
