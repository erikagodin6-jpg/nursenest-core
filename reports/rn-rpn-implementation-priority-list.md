# RN / RPN implementation priority list (Phase 1)

Use after **staging verification** of pools and entitlements. Order: **revenue risk first**, then **coverage**, then **polish**.

---

## Phase 1A — Verify or fix before marketing push (P0 / revenue)

| Priority | Gap ID | Work item | Owner | Exit criteria |
| --- | --- | --- | --- | --- |
| 1A.1 | G3 | Confirm non-zero flashcard pools for `us-rn-nclex-rn`, `ca-rn-nclex-rn`, `ca-rpn-rex-pn`, `us-lpn-nclex-pn` in staging + prod | Dev + content | Admin or SQL shows counts ≥ product minimum per pathway |
| 1A.2 | G4 | Confirm CAT blueprint pool mapping ≥ warning threshold for each pathway; fix blueprint if mapped fraction low | Dev | `admin/diagnostics/cat-blueprint-sessions` green for recent sessions |
| 1A.3 | G9 | Run Stripe test-mode scenarios: subscribe → access; cancel → downgrade; no false 403 on entitled routes | Dev | Scripted checklist + optional new E2E with Stripe test clock |

---

## Phase 1B — Regression safety (P1)

| Priority | Gap ID | Work item | Fix class | Exit criteria |
| --- | --- | --- | --- | --- |
| 1B.1 | G13 | Add automated assertion: CAT **exam** mode does not render rationale feedback before session end | `DEVELOPER_ONLY` | Unit or Playwright on CAT runner |
| 1B.2 | G14 | Keep flashcard SQL exclusions enforced on every PR | `DEVELOPER_ONLY` | CI runs `flashcard-pool-exam-fallback.test.ts` |
| 1B.3 | G11 | Eliminate raw i18n keys on CA PN / REx-PN marketing routes | `SAFE_FOR_AI` + review | `i18n-route-readiness` passes |

---

## Phase 1C — Coverage and confidence (P2)

| Priority | Gap ID | Work item | Fix class | Exit criteria |
| --- | --- | --- | --- | --- |
| 1C.1 | G1 | Add Canada REx-PN signup → `/app` Playwright | `AI_CAN_PREP_BUT_DEV_SHOULD_REVIEW` | Spec green in CI |
| 1C.2 | G2 | Paid mobile path for RPN fixture (or seed) | `AI_CAN_PREP_BUT_DEV_SHOULD_REVIEW` | No overlap/cutoff on `/app`, lessons |
| 1C.3 | G12 | Pathway-scoped progress API/component test | `AI_CAN_PREP_BUT_DEV_SHOULD_REVIEW` | Fails if progress mis-attributed |
| 1C.4 | G6 | Document / enforce practice–CAT pool parity where product requires | `DEVELOPER_ONLY` | Written matrix + one integration proof |

---

## Phase 1D — Polish (P3)

| Priority | Gap ID | Work item | Fix class |
| --- | --- | --- | --- |
| 1D.1 | G5 | Onboarding copy: disambiguate US PN vs CA RPN | `SAFE_FOR_AI` |
| 1D.2 | G7 | Optional admin “readiness” rollup tile | `AI_CAN_PREP_BUT_DEV_SHOULD_REVIEW` |
| 1D.3 | G8 | Stabilize `typecheck` in CI (heap / parallelism) | `DEVELOPER_ONLY` |
| 1D.4 | G10 | Schedule periodic sitemap diff vs production | `AI_CAN_PREP_BUT_DEV_SHOULD_REVIEW` |

---

## Recommended test additions (bundle)

1. **RN onboarding** — existing `rn-student-signup-flow.spec.ts`; keep in CI.
2. **RPN onboarding** — new CA REx-PN spec (G1).
3. **Paid entitlement** — extend tier-matrix or add API-level 403/200 matrix per pathway.
4. **Lesson hub** — already in `test:pathway-lessons` + production gate; add RPN hub if missing from matrix.
5. **Flashcard pool count** — staging script or admin query + unit SQL tests.
6. **CAT session start** — staging Playwright: start CAT, answer one item, verify no rationale in exam mode.
7. **Practice session start** — same with rationale after submit/end per config.
8. **Mobile homepage** — `test:e2e:mobile` + `mobile-usability-audit`.
9. **Mobile lesson** — paid mobile spec on lesson detail width/scroll.
10. **Sitemap / canonical** — `npm run test:seo-sitemap` + `verify:seo-indexability`.

---

## Handoff note for developers

Do **not** weaken paywalls or broaden public lesson payloads while closing G3/G4. Prefer **admin diagnostics** and **bounded** list endpoints when adding visibility.
