# Content migration framework

Use this package for **dry-run → validate → dedupe → migrate → verify → report** flows.

- Types: `types.ts`
- Orchestration stub: `pipeline.ts` (extend per content type in `scripts/*.mts` or dedicated runners)
- **Do not delete** legacy `client/src/data/*` or `@legacy-client` sources until:
  1. Rows exist in canonical Prisma tables
  2. Learner + public routes render the migrated content
  3. A rollback / backup plan is recorded in the migration log

See `CONTENT_REGISTRY` in `src/lib/content-source-of-truth/content-registry.ts` for canonical models per content type.
