# Hub module relocation — practice surface declutter (FINAL)

Mirror copy: `/root/nursenest-core/reports/hub-module-relocation-FINAL.md` (when `reports/` is writable).

## Summary

Large `ExamPathwayHubPremiumModules` grids (“Study tools”, “Readiness & progress”, pathway module cards) were **removed from marketing sub-routes** where they duplicated the main pathway hub. Modules remain on **primary pathway hubs** (`ExamPathwayHubBody`, `NursingTierHubPage`, allied / pre-nursing hubs). **No routing, entitlements, or module inventory logic changed** — composition only.

## Prior vs new render locations

| Surface | Before | After |
|--------|--------|--------|
| Pathway overview (`/[locale]/[slug]/[examCode]`) | `ExamPathwayHubBody` includes premium modules | Unchanged |
| `NursingTierHubPage` (RN / NP / etc.) | Premium modules | Unchanged |
| Allied / pre-nursing marketing hubs | Premium modules | Unchanged |
| Marketing `…/questions` | Full premium grid + `StudyBottomNav` | Grid **removed**; `StudyBottomNav` **`compact`**; single link to pathway **overview** for full toolkit |
| Marketing `…/cat` | Premium grid + links | Grid **removed**; overview + lesson/q links retained |
| Marketing `…/lessons` | Premium grid (zero-lessons + main branches) | Grid **removed**; single overview link (main branch) before bottom nav |
| Marketing `…/pricing` | Premium grid under copy | Grid **removed**; “← overview” link retained |
| Learner `/app/questions`, runners, bank | No `ExamPathwayHubPremiumModules` | Unchanged |

## ECG policy verification

- **Unchanged:** ECG still only where `buildPremiumMarketingModuleCards` / `ExamPathwayHubPremiumModules` already emit it (RN/NP-capable pathways per existing policy; not RPN; not generic stacks added here).
- **Contract:** `npm run test:homepage` includes `exam-pathway-hub-premium-modules.contract.test.tsx` and `buildPremiumMarketingModuleCards` tests — **pass**.

## Figma

Structural composition only. **No `use_figma` call** — no new layout spec beyond existing semantic tokens and patterns.

## Files changed

- `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/questions/page.tsx`
- `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/cat/page.tsx`
- `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/page.tsx`
- `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/pricing/page.tsx`

## Validation

| Command | Exit code |
|---------|-----------|
| `npm run typecheck:critical` | **0** |
| `npm run test:homepage` | **0** (77 pass, 1 skip) |

Playwright for marketing `/questions` only: **not run** (needs dev server). `nursing-pathway-hubs-smoke` / hub-module interaction specs target **overview** URLs — still valid.

## Screenshots

Target: `docs/screenshots/hub-module-relocation/` (repo root `.gitkeep` created). **Not captured** in this session.

## UX risks

- **Discoverability:** Bookmark-only users on `…/questions` or `…/lessons` lose inline module grid; mitigated by overview link + breadcrumbs.
- **Pricing:** Less module cross-sell on pathway pricing sub-page.
- **i18n:** New link labels on questions/lessons are English inline strings (matches adjacent hardcoded marketing copy on those pages).

## Decluttered?

**Yes.**
