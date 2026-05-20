# Generated pathway lesson indexes (optional cold-start)

Precomputed marketing-hub summaries and slug maps are written here by:

```bash
npm run build:lesson-indexes
```

`*.json` files are **gitignored** and are **not** committed. Production builds run `build:lesson-indexes` and
`verify:lesson-indexes` automatically inside `scripts/run-next-prod-build.mjs` **before** `next build`
(unless opted out — see below), then `ensure-standalone-static.mjs` copies them next to each standalone
`server.js` so runtime reads the same paths as in dev.

Validate against the live catalog merge:

```bash
npm run verify:lesson-indexes
```

That command **fails** when no `*.json` files exist unless `NN_SKIP_LESSON_INDEX_BUILD` is set (same as production
gates). Runtime still falls back to the in-process normalization cache when files are missing or invalid at serve time.

**Disk location:** JSON is read from `src/content/pathway-lessons/generated-indexes/{pathwayId}.json` under the
`nursenest-core` package root. For tests or alternate output dirs, set `NN_PATHWAY_LESSON_INDEX_DIR` to an absolute
path (see `pathway-lesson-generated-index.ts`).

**Escape hatch:** set `NN_SKIP_LESSON_INDEX_BUILD=true` to skip generation, verification, standalone copy, and the
extra standalone artifact checks (marketing paths fall back to `live_normalize`).

**Deploy:** Heroku postbuild / `npm run build` / `npm run build:compile` / Docker `heroku-postbuild` all use
`run-next-prod-build`, which materializes indexes before Next compile. Logs: `[lesson-indexes] generating` →
`verifying` → `ready`, or `skipped reason=NN_SKIP_LESSON_INDEX_BUILD`.
