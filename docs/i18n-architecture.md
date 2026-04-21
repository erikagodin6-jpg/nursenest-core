# NurseNest i18n architecture

## Canonical sources (static UI + marketing)

1. **Monolith string tables (per language)**  
   `tools/i18n/source/i18n-{lang}.ts`  
   Large flat `Record<string, string>` objects. **English (`i18n-en.ts`) is the key baseline** for parity checks across locales.

2. **Marketing-only strings (shared across apps)**  
   `tools/i18n/marketing/marketing-en.json` — English base.  
   `tools/i18n/marketing/locale/marketing-{lang}.json` — per-locale overlays (non-English).  
   These are **not** a second runtime system: they are **inputs** merged at build time into the same JSON blobs as the monolith tables.

## Compile pipeline

From the repository root:

```bash
npm run i18n:compile
```

This runs `script/compile-i18n.ts`, which:

1. Extracts keys from each `tools/i18n/source/i18n-{lang}.ts` and writes `client/public/i18n/{lang}.json`.
2. Runs `script/merge-marketing-i18n.ts`, which merges `{ monolith, marketingEn, overlay }` and writes:
   - `client/public/i18n/{lang}.json` (canonical for the Vite monolith)
   - `nursenest-core/public/i18n/{lang}.json` (same bytes for Next.js static `/i18n/{lang}.json`)

**Do not** hand-edit the merged JSON in `client/public/` or `nursenest-core/public/` except in emergencies — regenerate from source.

### Marketing canonical English and locale overlays (avoid regressions)

- **Canonical key set:** `tools/i18n/marketing/marketing-en.json` is the single list of marketing keys. `script/normalize-marketing-locale-overlays.ts` rewrites each `tools/i18n/marketing/locale/marketing-{lang}.json` so it contains **exactly** those keys (sorted). Any key in a locale file that is **not** in canonical English is removed as an **orphan** on compile. That is intentional: stray locale-only keys cannot drift alongside English.

- **Audited nav / footer / shell keys** (`nav.*`, `footer.*`, `components.footer.*`, `dashboard.breadcrumb*`, `brand.*`, `home.region.*` — see `nursenest-core/scripts/lib/nav-i18n-audit.mjs`) must appear in **canonical English** if they are to be translated via overlays. Some keys exist only in merged `en.json` (e.g. from `ensureRequiredEnNavKeys`); they must be **synced into** `marketing-en.json` or the next normalize pass will drop overlay translations for keys not in the canonical set.

- **Why compile before nav/footer fill:** `nursenest-core/scripts/fill-marketing-nav-footer-overlays.mjs` compares **merged** `nursenest-core/public/i18n/{lang}.json` to `en.json`. If you run fill against stale merged files, it may skip locales incorrectly. Always run `npm run i18n:compile` from the repo root immediately before (and after) overlay fills.

- **Learner UI (`learner.*`):** Maintained in `marketing-en.json` and locale overlays as a separate pass (e.g. `fill-marketing-learner-overlays.mjs`). **`sync-audited-keys-into-marketing-en.mjs` explicitly skips `learner.*`** so nav/footer structural fixes never overwrite learner strings.

- **One-command repair + verify (from repo root):** `npm run i18n:repair-marketing` runs compile → sync audited keys into `marketing-en.json` → compile → fill nav/footer overlays → compile → `i18n:validate` → `i18n:check-drift` → `nursenest-core` nav validation.

## Runtime loading

### Monolith (Vite SPA)

- `client/src/lib/i18n-translations.ts` loads `/i18n/{lang}.json`, with fallback `GET /api/assets/i18n/{lang}.json` when the static file is not served directly.
- `client/src/lib/i18n.tsx` provides `t` / `tSafe` using the loaded map.

### nursenest-core (Next.js)

- `nursenest-core/src/lib/marketing-i18n/load-marketing-messages.ts` (server-only) reads the **merged** JSON from `public/i18n/{locale}.json` via `fs` (supports monorepo cwd).
- `GET /api/assets/i18n/{filename}` mirrors the monolith fallback contract.

## Supported locales

`en`, `fr`, `tl`, `hi`, `es`, `zh`, `zh-tw`, `ar`, `ko`, `pt`, `pa`, `vi`, `ht`, `ur`, `ja`, `fa`, `de`, `th`, `tr`, `id` — keep lists in `script/compile-i18n.ts`, `script/merge-marketing-i18n.ts`, and nursenest-core API allowlists in sync.

## Missing-key policy (no silent English on non-English UI)

- **Non-English UI strings:** If a key is missing for the active locale, the UI shows a visible placeholder like `[missing:key]` and the miss is logged / reported — **not** English copy from another locale.
- **English:** Missing keys may still humanize the key path for development ergonomics; production content should be validated.
- **Marketing `formatMarketingMessage`:** Missing keys log to the console and return `[missing:key]` — no English backfill.

## Systems that stay separate (by design)

- **Pre-nursing:** `nursenest-core/src/content/pre-nursing/pre-nursing-i18n.tsx` and `usePreNursingT()` — small, route-scoped tables.
- **DB-backed content:** Lessons, exams, CMS fields — translated in PostgreSQL (`content_translations`, `content_item_translations`, etc.), not in the flat JSON pipeline.
- **Legacy lesson JSON packs:** `client/src/lib/getI18n.ts` loads `/api/assets/translations/{lang}.json` for structured lesson overlays — distinct from global UI i18n.
- **Pathway lesson file overlays:** `nursenest-core/public/i18n/educational-overlays/<locale>/lessons.json` plus optional `fragments/*.json` (sorted, deep-merged per lesson key at runtime in `educational-content-overlay.ts`).

## Translation engineering policy

Strict rules for shard sizes, content types, admin vs public bundles, and avoiding raw UI strings: **[docs/i18n-translation-engineering-policy.md](./i18n-translation-engineering-policy.md)**.

## Validation commands

| Command | Purpose |
|--------|---------|
| `npm run i18n:compile` | Regenerate merged JSON for all locales |
| `npm run i18n:validate` | Key parity, file presence, empty-value warnings, compiled shard / monolith size caps |
| `npm run i18n:check-drift` | Ensures marketing keys are included in merged `en.json` |
| `npm run i18n:repair-marketing` | Full marketing pipeline: compile → sync audited keys to `marketing-en.json` → fill nav/footer overlays → compile → validate + drift + nav checks |
| `npm run i18n:status` | Writes `reports/i18n-status.json` (diagnostics snapshot) |
| `npm run i18n:scan` / `i18n:scan:ci` | Hardcoded-string scan — Vite `client/src` (see `i18n-scan.config.json`) |
| `npm run i18n:scan:next` | Hardcoded-string scan — nursenest-core marketing + student + shared components |
| `npm run i18n:audit-payload` | Size / duplicate / long-value report → `tools/i18n/reports/i18n-payload-audit.json` (run after compile) |

## Adding a new language

1. Add `i18n-{lang}.ts` under `tools/i18n/source/` (copy structure from `i18n-en.ts` and translate).
2. Add `marketing-{lang}.json` under `tools/i18n/marketing/locale/` if marketing routes need locale-specific copy.
3. Append the code to `LANGUAGES` in `script/compile-i18n.ts` and `I18N_LANGUAGES` in `script/merge-marketing-i18n.ts`, and to nursenest-core `/api/assets/i18n` allowlist if present.
4. Run `npm run i18n:compile` and `npm run i18n:validate`.

## Adding new keys safely

1. Add the key to **`i18n-en.ts` first** (English value).
2. Add the same key to every other `i18n-*.ts` file (or stub with placeholder `[TODO: …]` only in dev if policy allows).
3. For marketing-only keys, add to `tools/i18n/marketing/marketing-en.json` and overlays as needed.
4. Run `npm run i18n:compile` and `npm run i18n:validate`.

## Diagnostics

- **Artifact:** `reports/i18n-status.json` (generated by `npm run i18n:status` or from the dashboards below).
- **Report builder (monolith):** Shared TypeScript under `server/` — single source of truth for locale rows, surfaces, and summary stats (`npm run i18n:status`, Express diagnostics routes).
- **Monolith (Vite) admin:** `client/src/pages/admin-i18n-diagnostics.tsx` at `/admin/i18n` → Express `GET/POST /api/admin/i18n-diagnostics`.
- **nursenest-core (Next) admin:** `/admin/i18n` (requires `ADMIN` session) — UI shell; run `npm run i18n:status` or use the monolith admin for live diagnostics backed by the Express API above.
