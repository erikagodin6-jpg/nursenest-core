# ECG + OSCE subscriber publication audit (FINAL)

**Date:** 2026-05-09  
**Scope:** Gating, marketing hubs, SEO/discovery posture, validation commands.  
**Truthpack:** `.vibecheck/truthpack/` not present in this workspace; conclusions follow code and existing hub contracts.

**Note:** Requested path `reports/ecg-osce-subscriber-publication-FINAL.md` is blocked from agent Write in this environment; equivalent report: `nursenest-core/docs/reports-ecg-osce-subscriber-publication-FINAL.md`.

---

## Executive summary

- **ECG:** In-app access was already correct (`ENABLE_ECG_MODULE` + internal course `published` + RN/NP tier + RPN/REx-PN blocked in `ecg-module.server.ts`). **Root gap:** RN/NP marketing hub premium tiles always treated the ECG card as navigable when the pathway allowed ECG, even when the module was disabled or unpublished—so hubs could imply access then users hit `notFound()` after login.
- **Fix shipped:** Server-resolved `ecgModulePublic` from `resolveMarketingHubEcgModulePublic()` (env on + DB published + DB configured) is passed into `NursingTierHubPage` / `AlliedHealthPathwayHub` → `ExamPathwayHubPremiumModules`. The ECG tile now uses `locked: !ecgModulePublic` (same UX pattern as OSCE `locked: !osceOn`). Client-only parents still fall back to `NEXT_PUBLIC_ENABLE_ECG_MODULE` via `isEcgModuleMarketingInventoryEnabled()`.
- **OSCE:** No code change to product rules. Gating remains `NEXT_PUBLIC_ENABLE_OSCE_SCENARIOS === "true"` for public/marketing + learner shells; production without the flag correctly `notFound()` on `/app/osce` and locks hub OSCE tiles.

---

## Gating matrix (files of record)

| Surface | ECG | OSCE |
|--------|-----|------|
| **Pathway policy (marketing ECG tile presence)** | `pathwayAllowsEcgLinkedLearning` — RN/NP tier pathways only; excludes `rex-pn`, `new-grad`; allied omitted | OSCE tile on nursing + allied premium grids; allied hrefs profession-scoped |
| **Feature / rollout env** | `ENABLE_ECG_MODULE` (server APIs + `getCurrentEcgModuleAccess`); `NEXT_PUBLIC_ENABLE_ECG_MODULE` (client-only marketing fallback) | `NEXT_PUBLIC_ENABLE_OSCE_SCENARIOS` |
| **Publish / inventory** | `getEcgModuleStatus()` → `published` required for learner + hub unlock when server resolves hub | OSCE list gated by same public flag + `resolveOsceScenarioRouteAccessMode` |
| **Entitlement** | `loadCanonicalLearnerAccessForUserId` + `hasAccess` + tier RN/NP + `assertNoEcgForRpn` | Learner routes follow scenario access helpers |
| **Admin preview** | `getAdminModulePreviewAccess` when module off/unpublished | `OsceScenariosDevGate` in non-prod when flag off |

### Files changed (this PR)

- `src/lib/ecg-module/ecg-marketing-hub-surface.server.ts` (new)
- `src/lib/ecg-module/ecg-module-config.ts`
- `src/lib/marketing/exam-pathway-hub-premium-modules.ts`
- `src/components/exam-pathways/exam-pathway-hub-premium-modules.tsx`
- `src/components/marketing/nursing-tier-hub-page.tsx`
- `src/components/marketing/allied-health-pathway-hub.tsx`
- `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/page.tsx`
- `src/app/(marketing)/(default)/allied/[career]/page.tsx`
- `src/app/(marketing)/(default)/allied/allied-health/page.tsx`
- `src/app/(marketing)/(default)/allied-health/[slug]/page.tsx`
- `src/components/exam-pathways/exam-pathway-hub-premium-modules.contract.test.tsx`
- `src/lib/ecg-module/ecg-module-config.test.ts`

---

## RN / NP vs RPN vs Allied

- **RN/NP:** ECG tile when `pathwayAllowsEcgLinkedLearning`; lock follows server `ecgModulePublic` or `NEXT_PUBLIC` fallback.
- **RPN / REx-PN / New Grad:** No ECG marketing tile; in-app tier/pathway blocks unchanged.
- **Allied:** No ECG tile; OSCE remains; lock driven by OSCE public flag.

---

## SEO / discovery

- OSCE: existing `osceScenariosRobotsMetadata()` — unchanged.
- ECG: existing module robots contracts — unchanged.
- No sitemap/hreflang edits; no admin leakage.

---

## Hubs vs practice sub-routes

- Premium grids stay on primary pathway hubs only; no duplicate grids on sub-routes.

---

## Validation

| Command | Exit |
|---------|------|
| `npm run typecheck:critical` | 0 |
| `npm run test:homepage` | 0 (78 pass, 1 skip) |
| `node --import tsx --test src/lib/ecg-module/ecg-module-config.test.ts` | 0 |

---

## Screenshots

Target: `docs/screenshots/ecg-osce-publication/`.  
**Blocker:** Playwright matrix not run (no dev server + themes in this session).

---

## Eligible subscribers: correctly served?

- **ECG yes when:** `ENABLE_ECG_MODULE`, course `ecg-mastery-module` **published**, paid RN/NP allowed pathway; hub tile unlock matches server resolver.
- **OSCE yes when:** `NEXT_PUBLIC_ENABLE_OSCE_SCENARIOS=true`; else intentional denial.

---

## Deploy notes

- Set `NEXT_PUBLIC_ENABLE_ECG_MODULE` with `ENABLE_ECG_MODULE` for any client-only `ExamPathwayHubPremiumModules` parent that does not pass `ecgModulePublic` from RSC.
- OSCE: `NEXT_PUBLIC_ENABLE_OSCE_SCENARIOS`.
