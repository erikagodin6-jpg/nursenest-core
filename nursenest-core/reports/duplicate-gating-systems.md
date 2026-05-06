# Duplicate gating systems — NurseNest (audit only)

Multiple **valid** layers (defense in depth) can look like “duplication”; this file separates **intentional layers** from **drift risks** and lists **recommended consolidation** (not implemented).

---

## Layer model (intended)

| Layer | Role | Primary files |
|-------|------|---------------|
| **L1 DB / subscription** | `getUserAccess`, Stripe webhook → DB | `get-user-access.ts`, webhooks |
| **L2 AccessScope** | `resolveEntitlement` / `resolveEntitlementForPage` | `resolve-entitlement.ts`, `resolve-entitlement-for-page.ts` |
| **L3 Pathway / content policy** | Country, tier ladder, NP match | `pathway-entitlements-policy.ts`, `pathway-lesson-access.ts` |
| **L4 SQL filters** | Tier + region for questions/lessons | `content-access-scope.ts`, `questionAccessWhere` |
| **L5 HTTP API** | `requireSubscriberSession` | `require-subscriber-session.ts` |
| **L6 RSC page** | `SubscriptionPaywall` when `!hasAccess` | Many `app/(learner)/**/page.tsx` |
| **L7 Client presentation** | `premium-gate.tsx`, `ProtectedPremiumContent` | Study UI |

**Rule:** L7 must never be the **only** gate for premium data.

---

## Duplication / drift issues

| # | Affected route/system | Risk level | Revenue impact | Tag | Recommended fix |
|---|----------------------|------------|------------------|-----|-----------------|
| 1 | **Many learner pages** repeat `if (!entitlement.hasAccess) return <SubscriptionPaywall />` | Low (consistent pattern) | Maintenance cost | **SAFE_FOR_AI** | Optional shared `assertSubscriberPage(entitlement, context)` helper — cosmetic. |
| 2 | **`requireSubscriberSession` vs `resolveEntitlement` in same handler** (e.g. questions route) | Medium | Wrong combination could skip a check | **DEV_ONLY** | Document pattern: “session gate first, then pathway/tier for pool”. |
| 3 | **Marketing `resolveMarketingPathwayLessonRouteResolution` vs in-app lesson page** | Medium | Two mental models for “full lesson” | **SAFE_FOR_AI** | Single doc diagram: marketing = preview pipeline; app = subscriber pipeline. |
| 4 | **`canViewFullPathwayLesson` vs `hasFullMarketingPathwayLessonAccess`** (staff flag) | Low | Staff edge cases | **DEV_ONLY** | Keep; add unit tests when staff flag changes. |
| 5 | **`premium-gate` + `SubscriptionPaywall`** | Medium | Inconsistent CTA copy | **Low revenue** (conversion nuance) | **SAFE_FOR_AI** | Shared copy constants file (marketing + paywall already partially aligned). |
| 6 | **`lessonAccessWhere` vs page-level paywall** | Low | Defense in depth | **SAFE_FOR_AI** | Keep SQL filter; pages catch before heavy work. |
| 7 | **Practice test API: subscriber session + row userId + `enforcePracticeTestDetailProtection`** | Medium | IDOR if middle layer skipped | **High revenue** (trust) | **DEV_ONLY** | Security review checklist on new practice-test endpoints. |

---

## “Not duplicate” — do not merge

| System | Why |
|--------|-----|
| **Client serialization contract** vs **server `visibleSectionsForLesson`** | Different concerns (wire size vs HTML). |
| **Admin RBAC** vs **learner AccessScope** | Different identity source (staff roles). |

---

## Staff / QA simulation (special case)

| System | `admin-view-as-learner-context`, QA shell payloads |
| Risk | Drift between **simulated** entitlement and **real** `getUserAccess` |
| Tag | **DEV_ONLY** |
| Recommended fix | E2E already uses QA payloads; keep parity tests when simulation shape changes. |

---

## Consolidation priorities

1. **Documentation** — one internal wiki page linking `entitlement-state-matrix.ts` + marketing vs app lesson URLs (**SAFE_FOR_AI**).  
2. **API audit checklist** — pathway match on top of `requireSubscriberSession` for exam/question mutations (**DEV_ONLY**).  
3. **Paywall copy** — single source for primary CTA between `subscription-paywall` and `premium-gate` (**SAFE_FOR_AI**).  
4. **Avoid** collapsing L4 SQL filters into page-only checks — would increase leakage risk.

---

## Reference map (read first)

| Topic | File |
|-------|------|
| Billing / reason order | `entitlement-state-matrix.ts` |
| Marketing lesson decision | `pathway-lesson-route-access.ts` |
| Pathway tier/country | `pathway-entitlements-policy.ts` |
| NP specialty | `pathway-lesson-access.ts` |
| API gate | `require-subscriber-session.ts` |
| SQL tier/region | `content-access-scope.ts` |
