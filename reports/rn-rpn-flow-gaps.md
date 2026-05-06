# RN / RPN flow gaps

Each row is a **gap or verification item**. “Actual” is **unknown until measured in staging** where marked.

**Severity:** P0 = revenue or learner blocked; P1 = major friction; P2 = polish; P3 = nice-to-have.

**Fix class:** `SAFE_FOR_AI` | `AI_CAN_PREP_BUT_DEV_SHOULD_REVIEW` | `DEVELOPER_ONLY`

---

| ID | Affected system | Route / file (primary) | Expected behavior | Actual / risk | Likely cause | Sev | Blocks revenue? | AI fix? | Dev review? | Recommended fix | Required test |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| G1 | E2E coverage | `tests/e2e/` | Canada REx-Pn learner can be created and reaches `/app` with `ca-rpn-rex-pn` pathway | Only RN-dedicated signup flow (`rn-student-signup-flow.spec.ts`); PN marketing i18n is public | Missing spec for full CA RPN onboarding | P2 | No | `AI_CAN_PREP_BUT_DEV_SHOULD_REVIEW` | Yes | Add `rpn-canada-rex-pn-signup-flow.spec.ts` mirroring RN (select CA + RPN goal, complete onboarding, assert pathway) | New Playwright spec |
| G2 | E2E coverage | `tests/e2e/mobile/` | RPN user on mobile sees usable nav + lesson shell | Mobile suite may skip paid; no pathway-specific RPN assertions | Credential gating + spec scope | P2 | No | `AI_CAN_PREP_BUT_DEV_SHOULD_REVIEW` | Yes | Extend mobile spec with tagged RPN fixture or API-seeded user | `mobile-learner-authenticated-layout.spec.ts` extension |
| G3 | Data / content | DB `ExamQuestion` + flashcard inventory | Flashcard pool counts > 0 for each production pathway | **Unknown** without prod/staging counts | Content import gaps | P0 if zero | Yes if pool empty | `DEVELOPER_ONLY` | Yes | Run admin diagnostics + SQL inventory; backfill questions | `flashcard-pool-exam-fallback.test.ts` + staging count script |
| G4 | Data / content | CAT blueprint + `pathway-readiness-config.ts` | CAT start non-empty for RN and RPN pathways | **Unknown** if blueprint misaligned | Blueprint or pool mapping | P0 if empty | Yes | `DEVELOPER_ONLY` | Yes | Align blueprint with question tags; monitor `poolMappedFraction` | `study-loop-cat-routing.test.ts` + staging CAT start |
| G5 | Product clarity | Onboarding UI `exam-selector` | US user choosing “RPN” understands mapping to NCLEX-PN | Code maps `rpn` → `us-lpn-nclex-pn` (correct for US PN) | Naming “RPN” vs “LPN/PN” | P2 | No | `SAFE_FOR_AI` | Yes | Copy review: label US row as “PN (NCLEX-PN)” vs Canada “RPN (REx-PN)” | Manual QA + optional copy snapshot test |
| G6 | Practice vs CAT | Practice test config + `PracticeTestRunnerClient` | Practice uses intended eligible pool vs CAT | **Requires** config compare in admin/DB | Separate configs | P2 | Maybe | `DEVELOPER_ONLY` | Yes | Document parity matrix; align filters if product requires | Admin review + integration test on one blueprint |
| G7 | Admin UX | `admin/diagnostics/*` | Single glance “RPN readiness red” for support | Diagnostics exist but fragmented | No unified tile | P3 | No | `AI_CAN_PREP_BUT_DEV_SHOULD_REVIEW` | Yes | Optional dashboard widget aggregating cat-blueprint + flashcard counts | None / manual |
| G8 | Typecheck CI | `npm run typecheck` | Completes in CI within timeout | Occasional OOM/timeout in constrained agents | Heap / project size | P2 | No | `DEVELOPER_ONLY` | Yes | CI NODE_OPTIONS, incremental, or split projects | CI job must pass typecheck |
| G9 | Paywall | Entitlement middleware + pages | No cross-tier leakage; subscribed users never false-blocked | Automated audits exist; edge cases need Stripe | Webhook race, stale session | P0 if occurs | Yes | `DEVELOPER_ONLY` | Yes | Keep `verify:no-cross-tier-leakage`; add idempotent entitlement refresh on invoice | `audit:paywall-security` + staging Stripe scenarios |
| G10 | SEO | `sitemap.xml` + lesson metadata | REx-PN and NCLEX-PN URLs canonical and listed | Tests cover merged routes; **prod** crawl optional | Drift | P2 | No | `AI_CAN_PREP_BUT_DEV_SHOULD_REVIEW` | Yes | Run `test:seo-sitemap` in CI; periodic Lighthouse | `npm run test:seo-sitemap` |
| G11 | i18n | Marketing + learner shards | No raw keys on RPN surfaces | i18n-route-readiness lists CA PN paths | Missing translation | P1 | No | `SAFE_FOR_AI` | Yes | Fill shards; run `i18n-route-readiness` | `tests/e2e/i18n/i18n-route-readiness.spec.ts` |
| G12 | Progress | Dashboard + APIs | RPN progress cards match DB | Not asserted in E2E for RPN | Spec gap | P2 | No | `AI_CAN_PREP_BUT_DEV_SHOULD_REVIEW` | Yes | API contract test for pathway-scoped progress | New API or component test |
| G13 | CAT rationale | `cat-rationale-panel.tsx` + runner | Rationales hidden during CAT exam | `locked` mode when test not study | Logic spread across runner | P1 if wrong | No | `DEVELOPER_ONLY` | Yes | Regression test: exam mode never shows feedback before end | Unit + E2E snapshot of rationale column |
| G14 | Flashcard filters | `flashcard-exam-bank-hub-inventory.ts` | ECG/video excluded | Covered by unit tests | SQL drift | P1 if regresses | No | `DEVELOPER_ONLY` | Yes | Keep tests on PR | `flashcard-pool-exam-fallback.test.ts` |
| G15 | Wrong-answer review | Practice / question bank | Review list pathway-scoped | Implementation exists in runners; **RPN** spot-check | Data volume | P2 | No | `AI_CAN_PREP_BUT_DEV_SHOULD_REVIEW` | Yes | Manual RPN session + verify mistake notebook | Playwright optional |

---

## Summary counts (by fix class)

- **SAFE_FOR_AI:** G5 (copy/docs), G11 (translations if keys only).
- **AI_CAN_PREP_BUT_DEV_SHOULD_REVIEW:** G1, G2, G7, G10, G12, G15.
- **DEVELOPER_ONLY:** G3, G4, G8, G9, G6, G13, G14.

## Revenue-blocking candidates (verify first in staging)

- **G3, G4, G9** — empty pools or entitlement bugs directly block conversion and retention.
