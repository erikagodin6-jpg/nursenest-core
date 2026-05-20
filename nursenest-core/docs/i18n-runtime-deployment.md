# i18n runtime: build outputs and production behavior

This documents how merged translation JSON reaches https://www.nursenest.ca and how to tell **stale deploy**, **CDN overlay**, and **client-only** issues apart.

## Canonical source

- **English marketing + learner keys:** `tools/i18n/marketing/marketing-en.json`
- **Monolith base (per locale):** `tools/i18n/source/i18n-{lang}.ts`
- **Compile:** from repo root, `npm run i18n:compile` runs `script/compile-i18n.ts` then `script/merge-marketing-i18n.ts`, which writes:
  - `nursenest-core/public/i18n/{lang}.json`
  - `client/public/i18n/{lang}.json` (same bytes)
- **Locale overlays:** `tools/i18n/marketing/locale/marketing-{lang}.json` are normalized to the same key set as `marketing-en.json` (`npm run i18n:normalize-marketing`). Non-English overlays override marketing keys; missing overlay values fall back to English from `marketing-en.json` at merge time.

Do not hand-edit merged files under `nursenest-core/public/i18n/` except in emergencies; regenerate from sources.

## What production serves

### Static files (preferred probe for “what shipped in the build”)

Next.js exposes `public/i18n/{locale}.json` at:

- **`GET /i18n/{locale}.json`** (e.g. `/i18n/en.json`)

These files are included in the standalone server trace via `next.config.ts` → `outputFileTracingIncludes: ["./public/i18n/**/*.json"]`. The DigitalOcean **source directory** should be `nursenest-core` so `process.cwd()` resolves `public/i18n` next to the app.

### API fallback (may redirect to CDN)

- **`GET /api/assets/i18n/{locale}.json`** — `src/app/api/assets/i18n/[filename]/route.ts`

If `MARKETING_I18N_CDN_BASE` is set to an `https://` URL, this handler returns **307** to `{MARKETING_I18N_CDN_BASE}/{locale}.json`. Otherwise it reads `public/i18n/{locale}.json` from disk with:

`Cache-Control: public, max-age=3600, stale-while-revalidate=86400`

So **API + CDN** can lag behind a fresh deploy if CDN objects are updated separately; **static `/i18n/*.json`** is the direct shipped artifact from the Next build.

### Server Components (learner UI)

`loadMarketingMessages` in `src/lib/marketing-i18n/load-marketing-messages.ts` loads merged bundles with `readFileSync` from `public/i18n/{locale}.json` (or optional `MARKETING_I18N_CDN_BASE` fetch server-side). Messages are passed into `MarketingI18nProvider`; missing keys log `marketing_message_key_missing` in production.

Runtime does **not** require the browser to fetch `/i18n/en.json` for SSR copy; a missing key usually means the **server’s** merged JSON on disk (or CDN merge) lacked the key at request time.

## Caching

- **`/app` and `/app/*`:** `Cache-Control: private, no-cache, no-store, must-revalidate` (see `next.config.ts` `headers()`).
- **`/api/*`:** same private baseline.
- **`/i18n/*`:** no custom `headers()` rule in `next.config.ts`; Next static file defaults apply (not the long-lived marketing asset policy used for `/marketing/*`).

## Playwright verification

- `tests/e2e/paid-user/production-i18n-bundle.spec.ts` — fetches live `/i18n/en.json` and `/api/assets/i18n/en.json` and asserts the four `learner.account.nav.*` keys used by the account sidebar.
- `paid-subscriber-audit.spec.ts` — on observer failure, attaches `observerDiagnostics` including the same fetches so failures separate **i18n** vs **auth** vs **network**.
