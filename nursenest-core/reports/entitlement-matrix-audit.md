# Entitlement matrix audit — NurseNest (audit only)

**Sources:** `src/lib/entitlements/*`, `src/lib/lessons/pathway-lesson-access.ts`, `src/lib/exam-pathways/pathway-entitlements-policy.ts`, `src/lib/entitlements/require-subscriber-session.ts`, representative `/app` pages and marketing lesson body. **No auth or Stripe changes.**

**Tags:** `SAFE_FOR_AI` — matrix safe for runbooks / automation · `DEV_ONLY` — needs staff credentials, PII-adjacent context, or incident review

---

## A. Canonical resolution chain

| Layer | Implementation | Notes |
|-------|----------------|-------|
| **DB truth** | `getUserAccess` → `accessScopeFromUserAccess` → `AccessScope` | Order documented in `entitlement-state-matrix.ts` (staff bypass → subscription → trial → canceled paid-through). |
| **Page helper** | `resolveEntitlementForPage(userId)` | Fail-closed to `"error"` on throw. |
| **Subscriber APIs** | `requireSubscriberSession()` | Session + `hasAccess`; 401/403/503; not pathway-specific alone. |
| **Pathway match** | `subscriptionCoversPathwayBase`, `canViewFullPathwayLesson` | Country + tier ladder + **NP `learnerPath` vs `pathway.id`**. |
| **SQL pools** | `questionAccessWhere`, `lessonAccessWhere`, etc. in `content-access-scope.ts` | Tier + region; staff bypass widens. |

---

## B. Persona × surface matrix (high level)

Legend: **G** = gated (needs `hasAccess` or public rules) · **P** = public preview / marketing rules · **F** = free tier / freemium rules may apply · **—** = not primary surface

| Surface | Free (no sub) | Paid (RN/RPN/LPN ladder) | NP (specialty) | Allied | Admin / staff | Support (no special tier) |
|---------|---------------|---------------------------|----------------|--------|---------------|---------------------------|
| **Marketing lesson detail** | **P** (preview; `publicComplete` gate) | **P*** | **P*** | **P*** | Staff full via separate staff flags in other flows | **P** |
| **In-app `/app/lessons`** | **G** (paywall) | **G** (full if `hasAccess`) | **G** | **G** | **G** (often `admin_override`) | **G** |
| **In-app `/app/lessons/[id]`** | Paywall | Full content + pathway checks in page | Same + pathway alignment | Same | Bypass | Paywall |
| **Flashcards** | Paywall page | Full + API `requireSubscriberSession` | Same | Same | Bypass | Paywall |
| **CAT / practice tests** | Paywall | Hub + APIs gated | Pathway in session config; API owns row | Same | Bypass | Paywall |
| **ECG / labs (learner)** | Paywall in pages | Component-level paywall (`SubscriptionPaywall` in lab/med pages) | Same | Same | Typically full | Paywall |
| **`/modules/*` (public tools)** | **P**/tool rules | **P** (not subscriber shell) | **P** | **P** | — | **P** |
| **Blogs (marketing)** | **P** | **P** | **P** | **P** | — | **P** |
| **Admin tools** | N/A | N/A | N/A | N/A | **RBAC** (outside `AccessScope`; server `requireAdmin` patterns) | N/A unless staff |

\*Marketing lesson body currently resolves entitlement with **`userId = ""`** in `pathway-lesson-detail-page-body.tsx` — so **marketing URL never receives subscriber `fullAccess`** in that RSC; full lesson is **in-app**. See `paywall-risk-surfaces.md`.

---

## C. RN vs RPN vs NP vs Allied (policy summary)

| Rule | Source |
|------|--------|
| **Country** must match pathway `countryCode` for `subscriptionCoversPathwayBase` | `pathway-entitlements-policy.ts` |
| **Tier ladder** (e.g. RN may include lower nursing tiers, not vice versa) | `accessibleTiersForUserTier` / `stripeTier` on pathway |
| **NP** requires `learnerPath === pathway.id` when `learnerPath` set | `canViewFullPathwayLesson` |
| **Allied** isolated to allied pathways via tier/catalog | Same policy + pathway catalog |
| **Staff** | `accessScopeIsStaffLearnerEntitlementBypass` → broad pathway visibility |

---

## D. `entitlement === "error"` behavior

| Context | Typical UX |
|---------|----------|
| Learner pages | Fail-soft message or paywall-adjacent copy; see e.g. `/app/lessons/[id]` early return |

**Risk:** Users without DB temporarily see **deny-like** UI — support should treat as incident, not “upgrade” (`DEV_ONLY` runbook).

---

## E. Consistency positives

- Single **`getUserAccess`** narrative in `entitlement-state-matrix.ts`.  
- **`requireSubscriberSession`** centralizes API 401/403 for many `/api/*` routes.  
- Marketing lesson **serialization contract** (`marketing-pathway-lesson-client-contract.ts`) limits client leakage.  
- **`pathway-lesson-route-access.ts`** single resolver for marketing lesson route decisions.

---

## F. Gaps to track (matrix holes)

| Gap | Tag |
|-----|-----|
| Pathway-specific enforcement **inside every** subscriber API (vs only `hasAccess`) | DEV_ONLY — code review per route family |
| **Marketing vs app** dual URL for same lesson (preview vs full) | SAFE_FOR_AI — documentation / support macros |
| **Freemium** question routes vs bank (mixed `resolveEntitlement` + `requireSubscriberSession` in `questions/route.ts`) | DEV_ONLY |

See `duplicate-gating-systems.md` and `paywall-risk-surfaces.md` for issue list with fixes.
