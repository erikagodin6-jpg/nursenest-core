# Revenue Funnel Audit — Top 50 Fixes by Monthly Revenue Impact
Generated: 2026-05-31 | Source: Codebase analysis + E2E test results + /reports audit

---

## Funnel Stage Mapping

```
Homepage → Country Hub → Exam Hub → Pricing → Signup → Onboarding
       → Trial Start → Study → Paywall Hit → Checkout → Active Sub
       → Retention → Referral
```

---

## TOP 50 REVENUE FIXES

| Rank | Fix | Stage | $/mo Impact | Effort | Evidence |
|---|---|---|---|---|---|
| 1 | **Set DATABASE_URL + AUTH_SECRET at runtime in deployment platform** | ALL | **$50,000+** | S | E2E: 12 critical routes return 500; no funnel step completes |
| 2 | **Set STRIPE_WEBHOOK_SECRET** — subscriptions not activating | Checkout→Active | **$15,000** | S | Server log: `STRIPE_WEBHOOK_SECRET` missing; subs silently dropped |
| 3 | **Set RESEND_API_KEY + REVENUE_ALERT_EMAIL** — email notifications failing | Trial→Retention | **$8,000** | S | Server log: notification env vars missing; trial reminder emails not sent |
| 4 | Fix `entitlement === "error"` UI: show "Try again" not paywall-like block | Active | **$8,500** | M | paywall-risk-surfaces.md§4; resolveEntitlementForPage() fail-closed; false churn |
| 5 | Implement Stripe webhook reconciliation retry for orphan subscriptions | Active→Retention | **$7,200** | M | apply-stripe-webhook-event.ts§192; missed webhooks leave users unentitled |
| 6 | Fix lesson preview unlock CTA for authenticated subscribers (logged-in context missing) | Hub→Trial | **$6,400** | M | paywall-risk-surfaces.md§1; subscribers see paywall on lesson previews |
| 7 | Add multi-currency Stripe price ID validation at startup (surface missing config) | Checkout | **$5,900** | S | checkout/route.ts§371-391; `STRIPE_PRICE_NOT_CONFIGURED` 400 with no ops alert |
| 8 | Fix NEW_GRAD 3-month plan display: hide duration UI when no Stripe price exists | Pricing | **$5,100** | S | display-catalog.ts§91; `3-month` listed but no Stripe price → checkout 400 |
| 9 | Session expiry recovery modal: preserve checkout intent after re-auth | Signup→Checkout | **$4,800** | L | posthog-conversion-events.ts§17-18; auth expiry drops checkout context |
| 10 | Fix CAT ambiguity picker: clarify which pathway user will study when 2+ eligible | Hub→Trial | **$4,300** | S | posthog-conversion-events.ts§183-186; wrong track selected → refund requests |
| 11 | Fix post-signup pathway validation: ensure `learnerPath` matches `country` + `tier` | Onboarding | **$4,100** | M | rn-rpn-flow-gaps.md§G-ONB-01; wrong hub after signup → abandonment |
| 12 | Add upgrade CTA on locked lesson preview body (not just soft-disable) | Marketing→Signup | **$3,900** | S | lessonPreviewUnlockCta tracked but no conversion CTA visible in body |
| 13 | Block PRE_NURSING tier from trial checkout (free tier attempting Stripe checkout) | Trial→Checkout | **$3,700** | S | display-catalog.ts§79-80; FREE_STRIPE_BILLING_NURSING_TIERS missing gate |
| 14 | Fix post-checkout session sync race: wait for webhook before showing "not subscribed" | Checkout→Active | **$3,600** | M | checkout-success-banner.tsx§30-49; webhook latency shows false "issue" state |
| 15 | Add regional pricing env var monitoring alert on startup | Checkout | **$3,400** | S | regional-pricing-map.ts§252; null returns silently → 400 at checkout |
| 16 | Fix marketing lesson paywall on mobile ≤390px: unlock CTA usable | Mobile | **$3,200** | M | rn-rpn-flow-gaps.md§G-MOB-01; mobile paywall untested; lost mobile revenue |
| 17 | A/B test CTA order on exam hub study tiles (Lessons vs Questions vs CAT first) | Hub→Trial | **$3,100** | S | funnelExamHubStudyIntent tracked; no variant testing; default order not optimized |
| 18 | Fix duplicate entitlement gating between UI and API (pathway mismatch) | Trial→Retention | **$3,000** | M | paywall-risk-surfaces.md§2; API `hasAccess` check vs page pathway-specific check |
| 19 | Churn recovery email: "We miss you" + offer at Day 14 post-cancellation | Retention | **$2,900** | M | `subscription_cancelled` tracked; no recovery email sequence exists |
| 20 | Fix onboarding skip: ensure pathway fallback is non-null before redirect | Onboarding | **$2,800** | S | resolveDefaultPathwayIdForOnboarding() may return null; user in limbo |
| 21 | Add "why cancel" survey on cancellation flow → use data to improve retention | Retention | **$2,700** | M | Cancellation tracked without reason; no signal to act on |
| 22 | Show regional pricing page for Philippines/India markets (currently hidden) | Marketing | **$2,600** | L | regional-pricing-map.ts has prices; no discovery surface; latent demand |
| 23 | Fix Stripe metadata preservation through subscription update webhooks | Active | **$2,500** | M | apply-stripe-webhook-event.ts§444-470; metadata can be overwritten on update |
| 24 | A/B test: 6-month vs annual plan highlighted (LTV optimization) | Pricing | **$2,400** | M | All tiers use same BILLING_DURATION_ORDER; no price elasticity testing |
| 25 | Add bundle offer on pricing page: "RN + ECG add-on" at discounted combined price | Pricing | **$2,300** | M | display-catalog.ts has pricing; no bundle logic; upsell opportunity |
| 26 | Fix NP specialty mismatch UX: show clear help text when pathway ≠ subscription tier | Onboarding | **$2,200** | S | Hard block without explanation; generates support tickets |
| 27 | Implement referral reward redemption UI in dashboard (currently events only) | Retention→Referral | **$2,100** | L | markReferralSubscribed() called; no learner-facing UI |
| 28 | Add "complete your profile" nudge post-signup for specialization | Onboarding | **$2,000** | M | signup-form.tsx minimal fields; personalization gap |
| 29 | Fix freemium question bank sampling to match marketing copy promises | Marketing→Signup | **$1,900** | S | rn-rpn-flow-gaps.md§G-ANO-01; freemium pool inconsistent with marketing claims |
| 30 | Implement first lesson free without signup (reduce acquisition friction) | Marketing→Signup | **$1,800** | M | marketingPathwayLessonDetailViewed tracked; gated too early |
| 31 | Add trial end reminder CTA: "Trial ends tomorrow — upgrade now" (Day 2 in-app) | Trial→Checkout | **$1,700** | S | STRIPE_TRIAL_DAYS = 3; no in-app reminder on Day 2; missed urgency |
| 32 | Fix LVN_LPN tier label clarity: visible confusion between US LPN and CA RPN | Signup | **$1,600** | S | rn-rpn-flow-gaps.md§G-TIER-01; label mismatch causes signup errors |
| 33 | Add study streak + retention gamification to dashboard | Retention | **$1,500** | M | dailyActiveSignal tracked; no retention mechanic; flat engagement |
| 34 | Pre-check isDemoUser on signup rather than at checkout (earlier guard) | Checkout | **$1,400** | M | checkout/route.ts§159; check happens after full Stripe session creation |
| 35 | Measure + fix flashcard completion rate vs deck load rate | Retention | **$1,300** | M | rn-rpn-flow-gaps.md§G-FC-01; usage unmeasured; deck inventory may be sparse |
| 36 | Add price-lock urgency messaging: "Lock in today's price if you upgrade now" | Pricing→Checkout | **$1,200** | S | Anchor prices exist; no urgency framing; no scarcity signal |
| 37 | Add referral CTA in learner shell nav (not just referral page) | Retention→Referral | **$1,100** | S | Nav populated with study links; referral buried; low surface area |
| 38 | Implement pause/resume subscription (prevent cancellations for busy learners) | Retention | **$900** | L | Only option is cancel; pause would recover ~10% churned revenue |
| 39 | Add testimonials / pass rate callout to exam hub pages | Marketing→Hub | **$850** | M | nursingTierHubContent has no testimonial section; missed social proof |
| 40 | Add "upgrade to RN pathway" CTA at pre-nursing module completion | Pre-Nursing→Checkout | **$800** | S | preNursingAllModulesCompleted tracked; no upgrade prompt; free users leave |
| 41 | Add readiness score conditional upsell: "72% ready — unlock full depth" | Trial→Checkout | **$750** | M | learnerReadinessScoreReached tracked; no conditional upsell trigger |
| 42 | Speed up "payment failed" recovery email timing (< 1hr vs Stripe default) | Active→Retention | **$700** | S | apply-stripe-webhook-event.ts handles failed; timing not customized |
| 43 | Tighten CAT marketing copy vs learner CAT to prevent false expectations | Marketing→Retention | **$650** | S | pathway-readiness-config.ts strong; marketing page copy may be softer |
| 44 | Add tier-upgrade path during onboarding (suggest RN if signing up as RPN) | Onboarding→Checkout | **$600** | M | No cross-tier suggestion; missed upsell at highest-intent moment |
| 45 | Add "30-day money-back guarantee" messaging on checkout | Checkout | **$550** | S | No refund policy visible at checkout; adds hesitation |
| 46 | Fix allied health SEO: ensure each profession hub ranks for its exam keyword | Marketing→Hub | **$500** | M | rn-rpn-flow-gaps.md§G-MKT-01; allied hubs underperform organically |
| 47 | Show app shell loading skeleton during entitlement resolution (perceived speed) | Active | **$450** | S | Slow entitlement check shows blank/broken state; users may bounce |
| 48 | Add "Most popular plan" badge on 6-month pricing card | Pricing | **$400** | S | No behavioral nudge; users pick monthly (lowest LTV) |
| 49 | Implement periodic flash sale email for email list (10% discount for 48hr) | Marketing→Checkout | **$300** | S | No flash pricing mechanism; low-cost acquisition driver |
| 50 | Build and measure `freemiumSeeRationaleCta` → `checkoutStarted` conversion funnel | Marketing→Signup | **$200** | S | Conversion ratio unmeasured; no optimization baseline |

---

## By Funnel Stage Summary

| Stage | Total Fixes | Combined Impact/mo |
|---|---|---|
| Environment/Infrastructure | 3 | ~$73,000 |
| Checkout & Payment | 8 | ~$23,700 |
| Onboarding & Signup | 6 | ~$16,200 |
| Trial & Paywall | 5 | ~$13,200 |
| Retention | 10 | ~$11,750 |
| Hub & Marketing | 8 | ~$9,650 |
| Referral | 3 | ~$4,200 |
| Pricing Display | 5 | ~$10,100 |
| **TOTAL** | **50** | **~$161,800/mo** |

---

## Week-by-Week Implementation Plan

### Week 1 — Unblock Revenue (Fix env vars)
- Fix 1: DATABASE_URL at runtime → unlocks all 12 critical routes
- Fix 2: STRIPE_WEBHOOK_SECRET → subscriptions activate
- Fix 3: Email keys → notifications fire
- Fix 7: Price ID validation alert at startup
- Fix 8: Hide NEW_GRAD 3-month UI when no Stripe price

**Estimated impact: $78,600/mo** (most from env fixes unblocking existing funnel)

### Week 2 — Entitlement & Checkout Polish
- Fix 4: Entitlement error UI
- Fix 5: Webhook reconciliation retry
- Fix 14: Post-checkout session sync fix
- Fix 13: PRE_NURSING trial gate
- Fix 20: Onboarding null pathway guard
- Fix 31: Trial end in-app reminder CTA

**Estimated impact: +$22,000/mo**

### Phase 3 — Conversion & Retention (Month 2)
- Fixes 9–12, 16–19, 23–28
- Session expiry recovery, mobile paywall, churn email, referral UI

**Estimated impact: +$27,000/mo**

### Phase 4 — Optimization (Month 3+)
- Fixes 29–50: Gamification, upsells, A/B testing, analytics depth

**Estimated impact: +$13,200/mo**
