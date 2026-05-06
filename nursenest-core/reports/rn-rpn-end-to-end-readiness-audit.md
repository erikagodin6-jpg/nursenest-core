# RN / RPN End-to-End Learner Readiness Audit (NurseNest)

**Scope:** US & Canada **NCLEX-RN**, **REx-PN (Canada RPN)**, **NCLEX-PN (US LVN/LPN)** — public marketing → signup → paywall → `/app` dashboard → lessons, flashcards, CAT, linear practice exams, progress, mobile, SEO, admin visibility.

**Method:** Static codebase review (no runtime probes, no schema or route edits). Evidence is cited by primary module or route path under `nursenest-core/`.

**Pathway registry (canonical ids):**

| Pathway id | Exam | Country | Stripe tier (`TierCode`) | CAT readiness mode |
|------------|------|---------|--------------------------|---------------------|
| `us-rn-nclex-rn` | NCLEX-RN | US | `RN` | `production_ready` (`pathway-readiness-config.ts`) |
| `ca-rn-nclex-rn` | NCLEX-RN | CA | `RN` | `production_ready` |
| `us-lpn-nclex-pn` | NCLEX-PN | US | `LVN_LPN` | `production_ready` |
| `ca-rpn-rex-pn` | REx-PN | CA | `RPN` | `production_ready` |

Supporting modules: `exam-pathways-data-segment-a.ts`, `exam-pathways-data-segment-b.ts`, `pathway-entitlements-policy.ts`, `content-access-scope.ts`, `accessible-tiers.ts`.

---

## 1. Anonymous visitor flow

**Expected:** Marketing hubs per country/track (`buildExamPathwayPath`), clear CTAs to signup/pricing, programmatic SEO where applicable, no broken deep links.

**Observed:** Pathways are first-class in `EXAM_PATHWAYS` with `acquisitionMode: "subscribe"` for all four RN/PN tracks. `pathwayAllowsCatAdaptiveStart` gates CAT starts for `hidden` / `info_only` / certain `waitlist` states — all four targets are active subscribe mode. `programmatic-slug-redirects.ts` documents removal of blanket `rex-pn-*` → Canada-only redirects to avoid stranding **US NCLEX-PN** audiences; `PROGRAMMATIC_SLUG_TO_PATHWAY_PATH` is intentionally **empty** (shared programmatic pages stay on `/{slug}` per file comment).

**Gaps / risks:** See **G-SEO-01**, **G-MKT-01** in `rn-rpn-flow-gaps.md`. Marketing→app handoff depends on `loginWithCallback` / entry routes (`marketing-entry-routes`) — not exhaustively re-walked here; treat as P2 unless analytics show drop-off.

---

## 2. Signup / onboarding

**Expected:** Country + exam goal map to a **registry pathway id** on `User.learnerPath` / `targetExamPathwayId`; incomplete users routed to `/app/onboarding`.

**Observed:**

- `api/onboarding/complete/route.ts` sets `learnerPath` and `targetExamPathwayId` via `resolveDefaultPathwayIdForOnboarding(examGoal, country)` — maps `rn` → US/CA NCLEX-RN ids, `rpn` → US NCLEX-PN vs CA REx-PN (`resolve-default-pathway-for-onboarding.ts`).
- `api/signup/route.ts` accepts `learnerPath` as **`new_grad` | `experienced` | `career_change`** (experience profile), **not** a pathway id (`signup-form.tsx` + schema).
- `start-studying/page.tsx`: if `learnerPath` is not a valid registry id, **falls back** to `resolveDefaultPathwayIdForOnboarding(user.examFocus, user.country)` before loading hub content — mitigates stale signup values **after** `onboardingCompletedAt` is set.

**Gaps / risks:** **G-ONB-01** (semantic overload of `learnerPath`). Users who complete signup with all optional fields but **never** call onboarding API may keep experience enum in DB until corrected — dashboard/nav partly fall back via tier (`examsNavLabelFromLearnerContext` in `app/(learner)/page.tsx`).

---

## 3. Subscription / paywall

**Expected:** Server-side entitlement; subscribed RN/PN users unlock pathway-aligned pools; unpaid users see `SubscriptionPaywall` where required.

**Observed:** Learner routes import `SubscriptionPaywall` across lessons, flashcards, practice tests (including CAT launch), questions, study plan, etc. `subscriptionCoversPathwayBase` enforces **country match** and `accessibleTiersForUserTier` includes **Prisma tier ladder** (RN subscription includes `RPN`, `LVN_LPN`, `RN` in `prismaTierCodesForProfileTier`) — RN subscribers can satisfy **stripeTier** checks for lower-tier pathways (product choice: broader nursing access vs strict exam SKU).

**Gaps / risks:** **G-PAY-01** (ladder vs commercial packaging clarity). `resolveEntitlementForPage` fail-soft returns `"error"` UI path — **G-PAY-02**.

---

## 4. Learner dashboard (`/app`)

**Expected:** Resume study, weak areas, CAT entry, entitlement-aware CTAs.

**Observed:** `page.tsx` composes snapshots, coach bundle, benchmarks, paywall overlays. Pathway-aware nav label uses `getExamPathwayById(learnerPath)` when valid, else tier heuristics.

**Gaps / risks:** Heavy server composition — durability flags (`shouldSkipNonCriticalLearnerWork`) exist; RN/RPN-specific regression risk is **data absence** rather than pathway logic (**G-DASH-01** P3).

---

## 5. Lessons

**Expected:** Pathway-scoped marketing lessons + `/app/lessons` with entitlement + `learnerPath` for NP-style specialty scoping; RN/PN use `lessonAccessWhere`.

**Observed:** `pathway-lesson-access.ts`, `pathway-lesson-route-access.ts`, `lessonAccessWhere` in `content-access-scope.ts`. Freemium pools documented separately (`freemiumLessonWhereForProfile`).

**Gaps / risks:** **G-LES-01** — full-lesson body rules vs marketing previews (already heavily tested in repo); RN/PN-specific: ensure **country** alignment for CA vs US hubs (enforced in subscription base).

---

## 6. Flashcards

**Expected:** Tier + country scoped decks; paywall on `/app/flashcards`.

**Observed:** `flashcardBankWhereForProfile` / `flashcardAccessWhere` tie to `prismaTierCodesForProfileTier`.

**Gaps / risks:** **G-FC-01** P3 — verify deck coverage counts in admin vs learner expectation (operational, not code-verified here).

---

## 7. CAT exams

**Expected:** Production CAT parameters for RN/PN tracks; marketing CAT links route into `/app/practice-tests/cat-launch`.

**Observed:** `pathway-readiness-config.ts` sets min/max/time for all four pathways. `study-loop-cat-routing.ts` / `practice-exams-cat-start.ts` use `buildExamPathwayPath`.

**Gaps / risks:** **G-CAT-01** P2 — staff messaging: simulation disclaimer copy is centralized in `publicCopyForReadinessConfig`; ensure marketing pages do not over-claim “official NCLEX algorithm”.

---

## 8. Practice exams (linear)

**Expected:** `/app/practice-tests` respects entitlement; pathway defaulting uses `defaultPracticeTestPathwayId` (`pathway-entitlements.ts`).

**Gaps / risks:** **G-EX-01** P3 — when `compatible.length === 0` (no sub), builder returns null pathway — edge case for misconfigured profile.

---

## 9. Progress tracking

**Expected:** Topic stats, daily goals, report card surfaces gated.

**Observed:** Dashboard pulls `loadTodayGoalProgress`, `loadDailyQuestionGoalProgress`, report card model; account progress pages use `SubscriptionPaywall`.

**Gaps / risks:** **G-PRO-01** P3 — cross-device consistency depends on DB writes in attempt APIs (not re-audited per-pathway here).

---

## 10. Mobile UX

**Expected:** Learner shell responsive; touch targets; no clipped nav (per production governance).

**Observed:** Not re-proven in this audit (no device matrix). Prior repo artifacts (`reports/mobile-*`) may exist for horizontal coverage.

**Gaps / risks:** **G-MOB-01** P2 — treat as **verification debt**: RN/PN journeys should be smoke-tested on 375px width specifically for **hub → app** transitions.

---

## 11. Admin visibility

**Expected:** Staff can inspect pathway lessons, diagnostics, question bank health.

**Observed:** Admin allowlists include pathway lessons, diagnostics, observability (`admin-path-policy.ts` patterns from prior work).

**Gaps / risks:** **G-ADM-01** P3 — no single “RN/RPN health” scorecard in code; operations rely on multiple admin surfaces.

---

## 12. SEO / canonical

**Expected:** Hub depth canonicalized via `buildExamPathwayPath`; learner `/app` noindex.

**Observed:** `np-seo-alias-canonical-policy.ts` documents canonical strategy; learner dashboard metadata sets `robots: { index: false, follow: false }` (`app/(learner)/page.tsx`).

**Gaps / risks:** **G-SEO-01** P2 — programmatic slug pages vs hubs: comment in `programmatic-slug-redirects.ts` warns against wrong-country redirects; ongoing SEO hygiene is **content + Search Console**, not code.

---

## Summary verdict

| Area | Readiness (code-level) | Notes |
|------|------------------------|-------|
| Pathway definitions | **Strong** | All four RN/PN tracks active + CAT production config |
| Onboarding mapping | **Good with caveat** | Registry id only guaranteed after onboarding API; start-studying mitigates |
| Paywall / entitlements | **Strong** | Server paywall components pervasive; tier ladder is broad for RN |
| Learner product surfaces | **Strong** | Same patterns across lessons/flashcards/practice |
| SEO / programmatic | **Moderate** | Policy docs solid; empty slug→hub map by design |
| Mobile proof | **Unverified** | Needs Playwright/device pass |
| Admin | **Moderate** | Tools exist; holistic RN/RPN dashboard not codified |

**Next:** Use `rn-rpn-flow-gaps.md` for the issue register and `rn-rpn-implementation-priority-list.md` for sequencing.
