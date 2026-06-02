# Legacy recovery — second-pass audit summary

Generated: 2026-04-14T17:57:09.531Z

## Git

- Short HEAD: `b7090578`

## Answers (recovery questions)

1. **Legacy content not yet in current app** — Majority of monolith lesson keys (`missingFromCurrentSnapshots: 4084`) per `unimported-legacy-content.json` classification C; plus external mirror not mounted (`aborted`).
2. **Current incomplete vs legacy** — Partial imports (A/B buckets) and pathway catalog vs DB drift — see `legacy-vs-current-content-gap-analysis.json` and per-domain completeness audits.
3. **Safe low-risk imports now** — Small batches of catalog-normalized lessons, blog posts via `import-blog.ts`, idempotent question rows with dedupe — **only with DB + operator review** (this pass did **not** execute imports).
4. **Requires transformation** — Class C lessons (slug/topic mapping), some NP content (`needs_slug_mapping` groups), legacy HTML → MDX/blog schema.
5. **Archive only** — Duplicate legacy UI routes, abandoned Replit-only experiments, and content flagged `riskFlags: tightly-coupled-ui` in legacy blog inventory — keep as reference; do not blindly port.

## Outputs (this pass)

| File | Purpose |
|------|---------|
| `data/audit/legacy-content-source-inventory.json` | Legacy source totals + scan roots |
| `data/audit/current-content-source-inventory.json` | Current app sources |
| `data/audit/legacy-vs-current-content-gap-analysis.json` | Gap by category |
| `data/audit/legacy-recovery-import-plan.json` | Phased import plan |
| `data/audit/legacy-recovery-risk-register.json` | Risks |
| `data/import-reports/second-pass-recovery-*.json` | Import report (no mutations) |

## Next steps

1. Re-run `npx tsx nursenest-core/scripts/audit/generate-full-parity-audit.mts` with `DATABASE_URL` for live DB counts.
2. Execute import batches using `legacy-recovery-import-plan.json` priority order (RN first).
3. Mount/copy external NurseNest mirror and re-run external inventory if full parity vs old monolith is required.

## Typecheck

Run `cd nursenest-core && npm run typecheck` after code changes; this audit script does not modify TypeScript sources.
