# French Completion And English Protection

English (`en`) is the canonical source language. French work must read English sources and write only French targets unless a reviewed command includes `--allow-english-write`.

## Guardrails

- `src/lib/i18n/translation-readiness-registry.ts` defines required shards, SEO fields, JSON-LD fields, indexability, and fallback policy by surface.
- `src/lib/i18n/english-source-guard.ts` snapshots critical English copy and rejects accidental English writes.
- `src/lib/i18n/mixed-language-detector.ts` flags raw keys, missing-key sentinels, placeholders, English fallback on French pages, and French leakage on English pages.
- `src/lib/seo/locale-indexability-gate.ts` keeps incomplete French pages renderable but `noindex,follow`, out of sitemap, and out of completed hreflang clusters.

## Adding French Translations Safely

Run `npm run i18n:translate:fr:dry-run` first. Review `reports/translate-fr-missing-report.json`, then run `npm run i18n:translate:fr:apply` only when the proposed French output is acceptable. The script refuses to write English files.

Preserve Canadian French terminology from `src/lib/i18n/fr-ca-clinical-glossary.ts`. Do not translate protected terms such as NurseNest, REx-PN, NCLEX, CPNRE, OSCE, CAT, RN, RPN, PN, NP, NGN, NCSBN, and CASN.

## Adding A New Locale

Add the locale as `incomplete` in `marketing-languages.ts`, compile shards, run the audits, and only promote it after the registry surfaces pass with localized UI, metadata, JSON-LD, and route smoke. Incomplete or partial locales must stay out of sitemap and completed hreflang clusters.

## Noindex Behavior

English can remain indexable when complete. French pages are indexable only when readiness passes. Incomplete French pages should still render when useful, but must emit `noindex,follow`, must not be included in sitemap, and must not emit `fr-CA` as a completed alternate.

## Hreflang

Completed English/French pairs should emit:

- `en-CA`
- `fr-CA`
- `x-default`

Run `npm run i18n:seo:verify` and inspect page source for canonical plus alternate tags before deploy.

## Deploy Checklist

Run:

```bash
npm run i18n:audit:en
npm run i18n:audit:fr
npm run i18n:seo:verify
npm run test:i18n:routes
```

Review `reports/i18n-readiness-summary.md` for English status, French status, REx-PN readiness, missing keys, and indexability decisions.
