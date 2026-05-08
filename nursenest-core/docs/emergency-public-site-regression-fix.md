# Emergency public site regression fix

**Branch:** `hotfix/public-site-keys-theme-routing`  
**Date:** 2026-05-08  

**Repo-root report:** create `reports/emergency-public-site-regression-fix.md` by copying this file if your workflow expects that path (agent could not write repo-root `reports/` here).

## Done vs remaining

| Item | Status |
|------|--------|
| Blog index (`min-w-0`, error copy, pathophysiology blurb) | Done |
| Blog article H1 clamp + semantic brand chrome | Done |
| `/blog/rn`, `/nursing/.../blog` H1 + metadata | Done |
| About + How it works metadata | Done |
| Localized exam blog index title (`·`) | Done |
| Failsafe footer + New Grad SEO fallbacks + study ecosystem default | Done |
| Blog cards: semantic brand instead of `text-primary` | Done |
| Screenshot dirs | Done (`nursenest-core/preview-screenshots/emergency-public-site/`, `reports/ui-redesign-preview/emergency-public-site/`) |
| Full marketing em-dash purge | Remaining |
| `npm run typecheck` | Remaining (OOM in agent run) |
| Playwright public smoke | Remaining |
| `npm run i18n:validate` | Pre-existing RU placeholder mismatches |
| `npm run test:i18n` | Pass |

## Files changed (source)

- `nursenest-core/src/app/(marketing)/(default)/blog/page.tsx`
- `nursenest-core/src/app/(marketing)/(default)/blog/[slug]/page.tsx`
- `nursenest-core/src/app/(marketing)/(default)/blog/rn/page.tsx`
- `nursenest-core/src/app/(marketing)/(default)/nursing/[careerSlug]/blog/page.tsx`
- `nursenest-core/src/app/(marketing)/(default)/about/page.tsx`
- `nursenest-core/src/app/(marketing)/(default)/how-it-works/page.tsx`
- `nursenest-core/src/app/(marketing)/(default)/us/new-grad/page.tsx`
- `nursenest-core/src/app/(marketing)/(default)/canada/new-grad/page.tsx`
- `nursenest-core/src/components/marketing/marketing-default-layout-chrome-failsafe.tsx`
- `nursenest-core/src/components/marketing/home/premium-study-ecosystem.tsx`
- `nursenest-core/src/components/blog/blog-post-card.tsx`
- `nursenest-core/src/lib/blog/blog-index-hero-copy.ts`

## Tests

- `npm run typecheck` → killed (OOM)
- `npm run i18n:validate` → exit 1 (RU)
- `npm run test:i18n` → pass

## Stashes / branches

- Screenshot-only commit exists on `audit/ui-redesign-preview` (`03b8dc486`); **this hotfix commit** should supersede with code + assets together.
- Stashes: `audit ui redesign wip before hotfix emergency`, possibly `wip chore before hotfix emergency`.
