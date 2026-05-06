# Paywall risk surfaces — NurseNest (audit only)

Each row: **affected route/system** · **risk level** · **revenue impact** · **SAFE_FOR_AI / DEV_ONLY** · **recommended fix** (documentation or code — **not applied** in this audit).

**Risk:** Critical / High / Medium / Low  
**Revenue:** churn, support cost, leakage (unauthorized premium), false blocks

---

## 1. Marketing pathway lesson (subscriber logged in on marketing URL)

| Affected | `/(marketing)/.../lessons/[lessonSlug]` via `PathwayLessonDetailPageBody` |
| Risk | **Medium** (UX/support, not server leakage of paid JSON to anonymous) |
| Revenue | Support tickets; perceived “broken paywall” |
| Tag | **SAFE_FOR_AI** |
| Detail | `userId` is hardcoded `""` → `resolveEntitlementForPage("")` → no subscriber access on **this** page body; `fullAccess` stays false for normal subscribers on marketing URL. |
| Recommended fix | **Product/support doc:** “Full lesson opens in **Study** (`/app/lessons/...`) after subscribe.” Optional future: thread session userId for marketing lesson (would be a **product** change, not audit). |

---

## 2. In-app coarse gate vs pathway-specific value

| Affected | `/app/practice-tests/*`, `/app/questions/*` pages show `SubscriptionPaywall` when `!hasAccess`; APIs use `requireSubscriberSession` (any premium) then **row/config** checks |
| Risk | **Medium** — paid user wrong pathway might see hub UI before API denies, or vice versa |
| Revenue | Confusion; rare wrongful access if handler skips pathway check |
| Tag | **DEV_ONLY** |
| Recommended fix | Per-route checklist: practice test **GET/PATCH** validates `pathwayId` vs entitlement where not only “owns row”. |

---

## 3. NP specialty mismatch

| Affected | Marketing + in-app lesson access, preview kind `np_specialty_mismatch` |
| Risk | **Low** false block (intentional) |
| Revenue | Prevents wrong-unlock; good |
| Tag | **SAFE_FOR_AI** |
| Recommended fix | Keep; ensure onboarding sets `learnerPath` consistently (already separate onboarding E2E). |

---

## 4. Entitlement resolve failure (`"error"`)

| Affected | Any `resolveEntitlementForPage` consumer (`/app/lessons/[id]`, layout, etc.) |
| Risk | **High** during outages — blocks like no subscription |
| Revenue | False “not subscribed” → churn risk if prolonged |
| Tag | **DEV_ONLY** |
| Recommended fix | Monitoring on `entitlement_resolve_failed`; status page messaging (ops). |

---

## 5. Staff `admin_override` vs real subscriber

| Affected | Learner shell banner + `getUserAccess` branch |
| Risk | **Low** for leakage; staff sees full catalog |
| Revenue | N/A |
| Tag | **DEV_ONLY** |
| Recommended fix | Keep banner; train support not to screenshot billing as “proof of paid”. |

---

## 6. Client-side premium gates (`premium-gate.tsx`)

| Affected | Study surfaces inside `/app` |
| Risk | **Medium** if server ever trusts client — should remain **presentation only** |
| Revenue | None if server authoritative |
| Tag | **SAFE_FOR_AI** |
| Recommended fix | Code review rule: **no** new premium content fetch keyed only off client gate. |

---

## 7. Labs / med-calc / ECG learner pages

| Affected | `lab-lesson-page.tsx`, `med-calculations-lesson-page.tsx`, ECG quiz surfaces |
| Risk | **Medium** — duplicate `SubscriptionPaywall` + page-specific logic |
| Revenue | Wrong block → churn; leakage → over-access |
| Tag | **DEV_ONLY** |
| Recommended fix | Align with `/app/lessons` entitlement pattern; single “subscriber shell” wrapper (future refactor). |

---

## 8. Public `/modules/*` tools

| Affected | ECG, lab-values modules (marketing-style) |
| Risk | **Low–Medium** — different from `/app` entitlement tree |
| Revenue | Free tier value; ensure no subscriber-only question banks embedded without API gate |
| Tag | **SAFE_FOR_AI** |
| Recommended fix | Inventory which module APIs are public vs `requireSubscriberSession`. |

---

## 9. Blogs

| Affected | Marketing blog routes |
| Risk | **Low** for subscription (public content) |
| Revenue | SEO / trust |
| Tag | **SAFE_FOR_AI** |
| Recommended fix | If subscriber-only posts appear later, add `getUserAccess` at RSC layer. |

---

## 10. Admin tools (non-learner)

| Affected | `/admin/*` |
| Risk | **Critical** if RBAC wrong — **outside** `AccessScope` paywall model |
| Revenue | Compliance / trust |
| Tag | **DEV_ONLY** |
| Recommended fix | Always enforce `requireAdmin` / DB role on **server**; never rely on learner `SubscriptionPaywall`. |

---

## Summary

Highest **perception** risk: **marketing lesson URL never upgrades for logged-in subscriber** in current RSC body.  
Highest **integrity** risk: **API handlers** that assume `requireSubscriberSession` alone equals pathway-correct exam access.  
Highest **ops** risk: **`entitlement === "error"`** misread as “needs upgrade”.
