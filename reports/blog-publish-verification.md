# Blog publish verification

## Automated checks added

- `blog-generation-output-gate.ts` — rejects metadata-only bodies (&lt;300 words), missing title/slug/SEO for publish mode, placeholders, “as an AI” phrasing, trivial H2 sections.
- `publish-generated-blog-article.ts` — publish word floor uses explicit `minWords` when passed; otherwise `contentDepth` → **800** (standard) or **1200** (pillar).
- `blog-publish-live-gate.contract.test.ts` — documents `blogPostIsLive` rules for `/blog` + sitemap parity.

## Manual smoke (staging)

1. Publish a draft from `/admin/blog` → `/blog/{slug}` shows saved HTML.
2. `/blog` index lists the post when `blogPostIsLive` is true.
3. Sitemap slice includes slug (merged resolver unchanged).
4. `/api/version` unchanged by blog edits (no route touched).

## Recovery importer

- `scripts/import-recoverable-blog-manifests.mjs` (dry-run) → `reports/recoverable-blog-import-report.json`.
- `--apply` throws until a Prisma-backed importer is explicitly approved.
