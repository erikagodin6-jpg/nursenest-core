# RN / RPN Implementation Priority List

Sorted by **severity × revenue impact**, then engineering dependency. **No schema or route changes** in this audit wave — each item notes safe change class.

## P0 — (none identified in static audit)

No code-only P0 blockers found for the four registry pathways; production CAT config exists. **Runtime** P0s could still exist (data gaps, 5xx) — require staging smoke.

## P1

1. **G-PAY-02 — Entitlement `"error"` handling**  
   - **Why:** Silent or wrong UI if pages omit `"error"` branch → perceived outage after payment.  
   - **Fix class:** SAFE_FOR_AI — systematic grep + uniform fallback.  
   - **Tests:** Add/extend route tests for `resolveEntitlementForPage` === `"error"`.

2. **G-ONB-01 — `learnerPath` semantic overload**  
   - **Why:** Downstream `pathwayFromLearnerPath` expects registry id; signup stores experience enum until onboarding completes. Mitigations exist but cognitive load + edge cases remain.  
   - **Fix class:** SAFE_FOR_AI (API field rename) **requires** coordinated mobile/web + migration — schedule carefully.  
   - **Tests:** Signup + partial onboarding E2E; assert `targetExamPathwayId` after `api/onboarding/complete`.

## P2

3. **G-PAY-01 — Tier ladder vs commercial packaging**  
   - Document or tighten per product decision.  
   - Tests: entitlement matrix for RN viewing PN hub.

4. **G-MKT-01 / G-SEO-01 — Marketing + SEO monitoring**  
   - Ops: Search Console, synthetic checks.  
   - DEV_ONLY tooling preferred over code churn.

5. **G-CAT-01 — CAT marketing copy alignment**  
   - Content QA between `publicCopyForReadinessConfig` and public CAT landings.

6. **G-MOB-01 — Mobile RN/PN smoke**  
   - Playwright mobile on: `/us/rn/nclex-rn`, `/canada/rpn/rex-pn`, `/app`, `/app/practice-tests/cat-launch`.

7. **G-ANO-01 — Freemium vs marketing copy**  
   - Align public claims with `FREEMIUM_*` budgets in `freemium.ts`.  
   - Tests: marketing↔freemium parity.  

8. **G-TIER-01 — LVN_LPN labeling**  
   - Copy pass on signup and marketing for US PN.

## P3

9. **G-EX-01, G-DASH-01, G-FC-01, G-PRO-01, G-ADM-01**  
   - Backlog polish; optional admin aggregation.

---

## Suggested verification sprint (2–3 days)

| Day | Activity |
|-----|----------|
| 1 | Staging E2E: anonymous hub → signup (CA RPN + US RN + US PN) → Stripe test → `/app` dashboard |
| 2 | CAT launch + 10-question linear exam + flashcard deck for each pathway; mobile width smoke |
| 3 | SEO spot-check + entitlement `"error"` page audit + documentation updates |

---

## Out of scope (this audit)

- Allied / NP tracks (except where ladders touch RN).  
- Schema, pricing, Stripe price IDs.  
- New routes or redirects.
