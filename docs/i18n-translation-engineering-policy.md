# Translation engineering policy

Rules for static UI/marketing translations (`tools/i18n/*` → merged JSON). This complements [i18n-architecture.md](./i18n-architecture.md).

## File size and structure

- **No giant bundles**: Each shard under `nursenest-core/public/i18n/{locale}/{name}.json` must stay under **850 KB** (enforced by `npm run i18n:validate:production`). Split domains or move long-form text out of flat maps.
- **Legacy monolith files** (`public/i18n/{locale}.json` without a shard directory) must stay under **2.2 MB** until migrated to shards.
- Prefer **one shard per domain** (`marketing`, `learner`, `pages`, …) per `shared/i18n-shard-policy.ts`.

## What does not belong in static i18n

- **Exam question stems, answer choices, rationales, or scored item bodies** — store in the question bank / CMS / structured JSON pipelines.
- **Full lesson article body copy** — use pathway lesson content, DB, or `educational-overlays` as documented in i18n-architecture, not `Record<string, string>` UI maps.
- **`lessons.lesson.{slug}`** keys are **short titles** for lesson index cards (legacy pattern). Do not add new multi-paragraph lesson bodies here.

## Keys and locales

- **English first**: Add keys to `tools/i18n/source/i18n-en.ts` and/or `tools/i18n/marketing/marketing-en.json`, then compile.
- **No missing keys**: `npm run i18n:validate:production` requires full key parity across locales (strict mode: no empty values).
- **Naming**: Use dot-separated segments (`domain.area.feature`). Slug segments may include hyphens (`lessons.lesson.some-topic-slug`). Keep segments consistent across languages (same key, translated value).

## UI code

- **No user-visible raw strings** in product UI: use `t` / `formatMarketingMessage` / message keys. Run `npm run i18n:scan` (Vite client) and `npm run i18n:scan:next` (nursenest-core marketing + student surfaces) to find hardcoded copy.

## Admin vs public

- **Public** bundles: `public/i18n/{locale}/*.json` (no `admin.json` here). Staff copy lives in `nursenest-core/i18n-admin-only/{locale}/admin.json`.
- **Never** merge admin shards into public loaders or CDN paths. Admin layouts load **scoped** shards via `loadMarketingMessageShards` + `ADMIN_UI_MESSAGE_SHARDS` only.

## Loading

- **Marketing / server**: `loadMarketingMessages` (full bundle) and `loadMarketingMessageShards` (subset) — server-only, disk/CDN with caching per `src/lib/i18n/i18n-translation-cache.ts`.
- **Client**: fetch merged locale JSON or API route; do not import huge JSON into every client chunk — follow existing lazy patterns in the app.

## Enforcement commands

| Check | Command |
|--------|---------|
| Parity, placeholders, staff leak, **file size caps** | `npm run i18n:validate:production` |
| Payload / long values / heavy prefixes | `npm run i18n:compile && npm run i18n:audit-payload` |
| Hardcoded strings (client) | `npm run i18n:scan` / `npm run i18n:scan:ci` |
| Hardcoded strings (Next learner + marketing) | `npm run i18n:scan:next` |
