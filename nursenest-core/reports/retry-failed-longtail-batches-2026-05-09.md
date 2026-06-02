# Retry: failed long-tail batches (2026-05-09)

Workspace: `nursenest-core/`. All commands run from `nursenest-core/` unless noted.

## Summary

| Batch | Target | Delivered | Generator / command | Notes |
| --- | ---: | ---: | --- | --- |
| "NCLEX-PN US ~330" (in-repo 330 PN long-tail) | 330 | 330 verified | `npx tsx scripts/blog/rex-pn-rpn-longtail/generate-batch.mts --verify-only` | **Clarification:** The only **330-post** deterministic batch in-repo is **Canadian REx-PN / RPN** (`rex-pn-rpn-*.md`), via `npm run generate:rex-pn-rpn-longtail`. There is **no separate US NCLEX-PN 330 generator** in `scripts/blog/`. All 330 files present; `--verify-only` passed (0 below 1400-word floor). Full regenerate **not** re-run (would rewrite 330 files unnecessarily). |
| NCLEX-RN US 40 | 40 | 40 | `npx tsx scripts/blog/generate-nclex-rn-us-longtail-batch-40.mts` | Prior run failed on **missing** `generate-nclex-rn-us-longtail-batch-40-data.mts`. Added that module (35 template-built specs) + moved import to top of main script. |
| Multilingual intl nursing (scoped) | 1120 (140 × 8) | 1120 | `npx tsx scripts/blog/generate-intl-nursing-longtail-batch.mts` | **Schema:** `BlogStaticLongtailRecord` + loader already support `locale`, `languageCode`, `translationGroupId` (`src/lib/blog/blog-static-longtail-types.ts`, `blog-static-longtail-load.ts`). Generator emits all three per file. UTF-8, ASCII kebab slugs (`es-intl-*`, `fr-intl-*`, …). |

## Files touched (this retry)

- **New:** `scripts/blog/generate-nclex-rn-us-longtail-batch-40-data.mts` — `appendRemainingPosts` (35 `PostSpec` rows; deterministic templates; no APIs).
- **Updated:** `scripts/blog/generate-nclex-rn-us-longtail-batch-40.mts` — top-level import of the data module; removed mid-file import; kept `appendRemainingPosts(POSTS, LK, SHARED_TAGS, NGN_STEPS_SENTENCE)` after the first five inline specs.
- **Written:** `src/content/blog-static-longtail/*.md` — **40** NCLEX-RN US batch files + **1120** international nursing multilingual files.
- **Reports (generator output):** `reports/nclex-rn-us-longtail-batch-40.md`, `reports/multilingual-longtail-batch-README.md`, `reports/multilingual-longtail-batch-part-01.md`.

## npm validation gates (exit codes)

Run order:

1. `npm run validate:blog-static-longtail` → **0**
2. `npm run diagnose:blog-slug-collisions -- --write-report` → **0**  
   - Console: **20** live DB rows overlap static supplement slugs (expected for internal-link targets used across corpus). Report written to `docs/reports/blog-slug-collision-diagnostic.txt`.
3. `npm run typecheck:critical` → **0**
4. `npm run test:blog-recovery` → **0**
5. `npm run test:homepage` → **0**

`validate:blog-static-longtail` reported **OK: 3888** long-tail file(s) after this session's writes.

## Explicit failures

- **None** for the five gates above (all exit **0**).
- Prior **NCLEX-RN generator** failure (`ERR_MODULE_NOT_FOUND` for `*-data.mts`) is **resolved** for this workspace.

## Git

Working tree left dirty (new/updated content + this report) — **no commit** per instructions.
