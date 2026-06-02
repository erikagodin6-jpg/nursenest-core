# Follow-up: FR / ES copy parity (global + Canada-first)

## Context

English (`public/i18n/en/pages.json`) homepage and related marketing strings were updated so positioning explicitly combines **global reach** with **Canada-first exam depth** (not Canada-only). Canonical examples:

- `pages.home.hero.eyebrow` — global platform + Canada-first depth
- `pages.home.hero.subheadingPremium` — worldwide learners
- Root metadata / registry headlines aligned in application code (`src/app/layout.tsx`, `src/lib/marketing/countries/registry.ts`, etc.)

## Gap

**French (`fr`) and Spanish (`es`) marketing shards** do not yet carry matching translated phrases for this positioning. Until they do, promoting those locales in **sitemap, hreflang, or SEO-first surfaces** risks:

- Mismatch with EN brand messaging (Canada-only vs global + Canada depth)
- Weaker or contradictory trust signals for non-EN learners

## Recommended before locale promotion

1. Translate the updated EN keys (at minimum hero eyebrow, premium subheading, and any shared meta/description strings mirrored per locale).
2. Editorial QA: ensure FR/ES read naturally and preserve the dual message (global audience + Canada-first depth where product differs).
3. Re-run locale-specific marketing smoke / contract checks your pipeline uses, then advance sitemap or SEO priority for those locales.

## Tracking

Treat this as a **content / i18n workstream** tied to the EN copy change; no schema or API changes required.
