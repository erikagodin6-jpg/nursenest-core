# RT Ventilator Premium Module — Implementation Audit

Generated as part of shipping the **Mechanical Ventilator Training** subsystem for **Tier `ALLIED` + profession `respiratory`** learners.

## Architecture overview

| Layer | Implementation |
| --- | --- |
| **Feature flags** | `ENABLE_RT_VENTILATOR_MODULE` — learner `/modules/rt-ventilator/*`; `NEXT_PUBLIC_ENABLE_RT_VENTILATOR_MARKETING` — marketing landing + allied hub card |
| **Entitlement model** | Server-only `getCurrentRtVentilatorModuleAccess` uses `loadCanonicalLearnerAccessForUserId` → requires **premium** (`hasAccess`), **`TierCode.ALLIED`**, **`alliedCareer === respiratory`**. When learner flag off, **staff admin preview** via `getAdminModulePreviewAccess` + `ENABLE_ADMIN_MODULE_PREVIEW`. |
| **Routes** | **`/modules/rt-ventilator`** (hub), **`/waveforms`**, **`/scenarios`** — **noindex** metadata; **`PremiumEducationalModuleShell`** (same family as **`/modules/ecg`**). |
| **Public marketing** | **`/respiratory-therapy/ventilator-training`** — indexable when marketing flag on; **`notFound()`** when flag off. |
| **Hub surfacing** | **Dashboard quick launch**: **Ventilator** tile when learner flag + snapshot `tier === ALLIED` + `alliedProfessionKey === respiratory`. **Allied respiratory hub**: featured card → landing when marketing flag on. |

## Entitlement model (explicit)

- **Not** a separate Stripe SKU in this slice — gated by **existing allied subscription + respiratory career key** (compare **ECG** RN/NP tier gate in `ecg-module.server.ts`).
- **RN/RPN/NP** → **`tier_denied`** → **`notFound()`** on module routes.
- **CAT / practice**: No schema changes; allied respiratory pools follow existing **`alliedProfession`** / tag / legacy **`careerType`** rules (`allied-exam-question-scope.ts`).

## Reusable ECG / chart infrastructure

- **ECG** supplies **shell + routing habit**, not waveform canvas code.
- **Implemented**: **`MechanicalVentWaveformPanel`** — SVG scalars using **`var(--semantic-*)`** only; suitable extension point for **loop** polygons.

## Verification commands

```bash
cd nursenest-core
npm run typecheck:critical
npm run test:homepage
npm run i18n:compile
npm run test:unit:rt-ventilator
npx playwright test tests/e2e/rt/rt-ventilator-module.spec.ts --project=chromium
```
