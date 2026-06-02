# Homepage production polish — verification notes

## Scope

Production-grade clinical-education presentation for the premium marketing homepage (hero, readiness, trust, bottom CTA), shared CSS in `premium-redesign-2026.css`, and authoritative English strings in `tools/i18n/marketing/marketing-en.json` (compiled to `public/i18n/en/pages.json`).

## Files changed (authoring)

| File | Change |
|------|--------|
| `src/components/marketing/home/premium-homepage-hero.tsx` | Sinus-style rhythm strip (programmatic path), `Intl` comma formatting for stats line, semantic stat tiles (Target / Flame / BookMarked), panel copy via i18n + `{{count}}` for mastered items, readiness/info progress fills |
| `src/components/marketing/home/premium-readiness-preview.tsx` | Domain labels from `pages.home.premium.readiness.domains.*` |
| `src/components/marketing/home/premium-homepage-trust.tsx` | All visible strings via `pages.home.premium.trust.*` |
| `src/components/marketing/home/premium-homepage-cta.tsx` | Bottom section uses `pages.home.premium.bottomCta.*`; duplicate import removed |
| `src/app/premium-redesign-2026.css` | Stat modifiers `--readiness` / `--streak` / `--mastery`; ECG drift animation + overflow clip; hero grid gap; compact hero CTAs; logo contrast filter; mini-card topic borders |
| `tools/i18n/marketing/marketing-en.json` | New `pages.home.hero.*` and `pages.home.premium.*` keys (see compile output) |

## Compiled i18n artifacts

After `npm run i18n:compile`, `public/i18n/{locale}/pages.json` (and related shards) include the new keys.

## Automated validation

- `npm run typecheck:critical` — pass
- `npm run test:homepage` — pass

## Manual checklist (recommended)

- Desktop / tablet / mobile layout and touch targets
- Dark mode and key themes (Ocean, Midnight, Apex)
- Hero CTAs and analytics events unchanged in browser network tab

---

_Update after QA sign-off._
