# Blog quality audit — methodology and gates

This document describes **how NurseNest evaluates public blog quality**, where automation lives, and how to **refresh a data-backed audit** without changing URLs, slugs, or canonical metadata.

## What "weak" means here

| Dimension | Signal | Primary enforcement |
| --- | --- | --- |
| Placeholder / stub copy | Lorem ipsum, bracket TODOs, "content goes here", mustache templates, WIP markers | `educational-content-placeholder-guard` + `validateBlogPrePublish` (`educational_stub_language`) |
| Thin or shell articles | Low word count vs publish targets | `blog-pre-publish-validation` (`body`, `body_word_count`), `evaluateBlogGenerationOutputGate` |
| Repetitive / filler prose | Banned phrases, paragraph similarity, arc coverage | `blog-content-quality-gate`, `blog-publish-quality-validator` |
| SEO bundle | Meta title/description length, schema summary JSON | `blog-pre-publish-validation` |
| Internal linking | Plan rows, invalid paths, anchor opportunities | `blog-pre-publish-validation` (`internal_links`, …) |
| References (when required) | APA list + structured sources | `blog-pre-publish-validation` (`references_required`, `sources_structure`) |

## Code map (source of truth)

- **Pre-publish (admin / canonical publish path):** `nursenest-core/src/lib/blog/blog-pre-publish-validation.ts`  
  - Includes **hard block** for shared placeholder + AI meta-disclaimer patterns (`educational_stub_language`).
- **Generated HTML before persist / schedule:** `nursenest-core/src/lib/blog/blog-generation-output-gate.ts`  
  - Uses the same shared guard for placeholder + disclaimer detection (reason codes remain machine-readable).
- **Corpus-level quality:** `blog-content-quality-gate.ts`, `blog-publish-quality-validator.ts`, `blog-generated-draft-quality.ts`.
- **Governance scoring (read-only audits):** `blog-quality-score.ts` (used by `npm run blog:audit-published-quality`).

## Shared anti-placeholder module

`nursenest-core/src/lib/education/educational-content-placeholder-guard.ts`

- Stable pattern **ids** for logs and audits (`lorem_ipsum`, `todo_colon`, `mustache_template`, …).
- **AI disclaimer** phrasing is blocked for live educational copy (aligned with premium clinical voice).

## How to run audits (read-only)

From `nursenest-core/`:

```bash
npm run blog:audit-published-quality -- --limit=300
```

Writes timestamped `reports/blog-audit-published-*.md` + `.json` with composite scores and weak rows.

**Placeholder + thin + internal-link heuristics (blogs + pathway lessons):**

```bash
npm run content:audit-published-educational -- --limit=400
```

Writes `reports/educational-audit-snapshot-*.md` (requires `DATABASE_URL`).

## Remediation principles

1. **Do not change slugs or indexed URLs** — edit body/meta in place; use 301 only when product explicitly requires it (out of scope for this audit track).
2. **Prefer surgical rewrites** over deletion; thin posts should be **expanded or demoted** via workflow status, not mass-removed.
3. Re-run `validateBlogPrePublish` (or admin "validate publish") after edits until `okToPublish` is true.

## Tests

- `src/lib/blog/blog-pre-publish-validation.test.ts` — includes placeholder blocking.
- `src/lib/education/educational-content-placeholder-guard.test.ts` — pattern + duplicate-paragraph coverage.
