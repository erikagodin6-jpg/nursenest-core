# RN / RPN — Phase 1 implementation priority list

Ordered for **revenue protection first**, then **learner fluidity**, then **observability and SEO**. All items reference **`reports/rn-rpn-flow-gaps.md`** IDs (`nursenest-core/reports/` and repo root `reports/`).

---

## Phase 0 — Block release / revenue (P0)

| Order | Gap ID | Title | Category | Owner |
| --- | --- | --- | --- | --- |
| 0.1 | G-004 | Core pathway exam question pools non-zero (RN + US PN + CA RPN) | DEVELOPER_ONLY | Eng + content |
| 0.2 | G-005 | CAT / practice can start with real pools | DEVELOPER_ONLY | Eng |
| 0.3 | G-006 | CAT rationale lock in live exam mode | DEVELOPER_ONLY | Eng |
| 0.4 | G-016 | Cross-tier paywall leakage none; paid users not blocked | DEVELOPER_ONLY | Eng |
| 0.5 | G-020 | Stripe webhook + subscription row integrity (staging → prod) | DEVELOPER_ONLY | Eng + ops |

**Exit criteria:** `audit:exam-bank` / `content:ensure:exam-bank` green for `CORE_PATHWAY_AUDIT_ROWS`; `verify:no-cross-tier-leakage` green; manual CAT attempt on RN + one PN pathway; Stripe test subscription end-to-end on staging.

---

## Phase 1 — Learner journey completeness (P1 / high P2)

| Order | Gap ID | Title | Category | Owner |
| --- | --- | --- | --- | --- |
| 1.1 | G-001 | Add US NCLEX-PN to tier-matrix signup E2E | AI_CAN_PREP_BUT_DEV_SHOULD_REVIEW | QA + eng |
| 1.2 | G-015 | Keep pathway lesson link graph green in CI | AI_CAN_PREP_BUT_DEV_SHOULD_REVIEW | Eng |
| 1.3 | G-007 | Document / test practice vs CAT pool parity | AI_CAN_PREP_BUT_DEV_SHOULD_REVIEW | Eng |
| 1.4 | G-014 | Flashcard “effective pool” UX vs API counts | AI_CAN_PREP_BUT_DEV_SHOULD_REVIEW | Eng |

---

## Phase 2 — Clarity, SEO, mobile (P2)

| Order | Gap ID | Title | Category | Owner |
| --- | --- | --- | --- | --- |
| 2.1 | G-002 | US PN vs CA RPN onboarding + hub copy | SAFE_FOR_AI (copy) + product sign-off | Product + eng |
| 2.2 | G-008 | Nightly mobile paid shell for `us-rn-nclex-rn` + `us-lpn-nclex-pn` | AI_CAN_PREP_BUT_DEV_SHOULD_REVIEW | QA |
| 2.3 | G-009 | SEO sitemap/canonical checks on PR | SAFE_FOR_AI | Eng |
| 2.4 | G-011 | Raw i18n key sweep on PN hubs | SAFE_FOR_AI | Eng |
| 2.5 | G-012 | Admin: surface target pathway + deep link to audits | AI_CAN_PREP_BUT_DEV_SHOULD_REVIEW | Eng |

---

## Phase 3 — Hardening (P3)

| Order | Gap ID | Title | Category | Owner |
| --- | --- | --- | --- | --- |
| 3.1 | G-003 | Dashboard Prisma catch behavior vs onboarding redirect | AI_CAN_PREP_BUT_DEV_SHOULD_REVIEW | Eng |
| 3.2 | G-010 | hreflang assertions | DEVELOPER_ONLY | Eng |
| 3.3 | G-013 | Optional admin pathway pool health card | DEVELOPER_ONLY | Eng |
| 3.4 | G-017 | Onboarding `examGoal` fallback telemetry / validation | AI_CAN_PREP_BUT_DEV_SHOULD_REVIEW | Eng |

---

## Test bundle to add or keep green

1. **RN onboarding:** Tier-matrix RN row + `POST /api/onboarding/complete` with `examGoal=rn` (US/CA).
2. **RPN / PN onboarding:** CA `rpn` + US PN path once G-001 exists.
3. **Paid entitlement:** `verify:no-cross-tier-leakage` + `tier-matrix-cross-tier-gating.spec.ts`.
4. **Lesson hub:** `npm run test:pathway-lessons`.
5. **Flashcard pool:** API or script assertion against `audit-flashcard-pools` / flashcard E2E.
6. **CAT session start:** `paid-user-cat-focused-viewport.spec.ts` (with creds).
7. **Practice session start:** Practice builder E2E with pathway param.
8. **Mobile homepage:** `mobile-usability-audit.spec.ts` + `test:e2e:mobile`.
9. **Mobile lesson detail:** Mobile paid optional spec or manual checklist.
10. **Sitemap / canonical:** `npm run test:seo-sitemap` + `verify:sitemap`.

---

## AI execution policy (for follow-on PRs)

- **SAFE_FOR_AI:** Copy, comments, test fixtures, non-gating assertions, docs.
- **AI_CAN_PREP_BUT_DEV_SHOULD_REVIEW:** New E2E rows, admin read-only aggregations, refactors near entitlement filters.
- **DEVELOPER_ONLY:** Stripe, webhook signing, paywall condition changes, pool SQL filters, schema, route shape changes.
