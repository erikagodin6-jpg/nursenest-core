# RPN / PN — source of truth resolution

**Date:** 2026-05-07  
**Scope:** Resolve **where “RPN” lives** across registry, onboarding, study routing, and marketing — documentation only in this pass (no runtime edits).

## 1. Canonical pathway IDs (single registry)

Authoritative exam pathway definitions live under `nursenest-core/src/lib/exam-pathways/` (registry + `getExamPathwayById`). **Do not** duplicate parallel ID tables in client-only code.

| Learner intent | United States | Canada |
|----------------|---------------|--------|
| RN / NCLEX-RN | `us-rn-nclex-rn` | `ca-rn-nclex-rn` |
| PN / NCLEX-PN (practical nurse) | `us-lpn-nclex-pn` | — |
| RPN / REx-PN (Canadian practical nurse) | — | `ca-rpn-rex-pn` |

**Resolution:** “RPN” in **Canada** maps to **`ca-rpn-rex-pn`**. In the **US**, practical-nursing exam prep maps to **`us-lpn-nclex-pn`**. Tier entitlements and country gates live in `pathway-entitlements*.ts` and `pathway-entitlements.test.ts`.

## 2. Onboarding source of truth

`src/lib/onboarding/resolve-default-pathway-for-onboarding.ts` (see `reports/rn-rpn-end-to-end-readiness-audit.md`):

- Exam goal **`rpn`** → **US** → `us-lpn-nclex-pn`; **CA** → `ca-rpn-rex-pn`.

**Resolution:** Onboarding is the **first** persisted `targetExamPathwayId` SoT after signup intent.

## 3. Study / question pool normalization

`src/lib/study-question-pool/study-pathway-normalize.ts`:

- `rpn` → `ca-rpn-rex-pn` in alias table.
- `nclex-pn` / `nclex_pn` / `pn` → CA vs US split via `countryIsCa`.

**Resolution:** Pool routing must stay consistent with onboarding + registry; marketing hub tests (`marketing-hub-study-surfaces-scoping.test.ts`) encode expected `/app` hrefs for `ca-rpn-rex-pn`.

## 4. Content & lesson inventory

- **Normalized lesson indexes** — build/verify scripts under `npm run build:lesson-indexes` / `verify:lesson-indexes` remain SoT for **which slugs exist** per pathway.
- **RPN parity tooling** — `content:generate-rpn-parity`, `verify:rpn-lessons-visible`, `db:seed-rpn-parity-lessons` (`package.json`) — operational SoT for **catalog coverage**, not URL structure.

## 5. Marketing / SEO guardrails

- **Wrong deep links:** Playwright `cat-entrypoints` guards invalid US `/us/rpn/rex-pn` style paths (per `rn-rpn-end-to-end-readiness-audit.md`).
- **Tier copy:** `nursing-tier-hub-content.ts` (`case "rpn"`) must stay aligned with registry IDs and i18n keys.

## 6. Contradictions addressed

| Question | Answer |
|----------|--------|
| Is there a `us-rpn-*` pathway? | **No** in registry; US practical nursing is `us-lpn-nclex-pn`. |
| Does “RPN tier” imply `ca-rpn-rex-pn` always? | **No** — tier + **country** determine pathway; entitlements tests encode the matrix. |

## 7. Follow-up verification (staging)

- Canada-native user: confirm dashboard pill + `/app` deep links resolve to `ca-rpn-rex-pn` hubs.
- Optional E2E: dedicated **CA REx-PN signup** mirror of RN flow (`reports/rn-rpn-flow-gaps.md`).
