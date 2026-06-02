# US Conversion Optimization Audit
Generated: 2026-05-30 | Evidence-backed from live codebase

---

## Methodology

Conversion issues are sourced from:
- Component code inspection (CTAs, trust signals, value props)
- Existing E2E test flow analysis revealing friction points
- Comparison against `posthog-conversion-events.ts` tracking inventory
- Marketing page structure analysis

---

## 1. HOMEPAGE

### 1.1 — US hero CTA tracking exists, copy not verified for US specificity
**Expected Impact: HIGH**

**Evidence:**
- `posthog-conversion-events.ts:38–39` — `marketingHomeHeroPrimaryCta` and `marketingHomeHeroSecondaryCta` events exist
- `posthog-conversion-events.ts:92–94` — `funnelHomepageViewed` tracks homepage loads

**Issue:** The homepage hero must show US-specific exam framing ("NCLEX-RN", not "REx-PN" or generic). A US visitor who sees Canadian-first copy (e.g., "REx-PN" prominent) will bounce.

**Recommendation:**
1. Verify the US marketing cookie (`nn_global_region=US`) causes the homepage to prominently feature "NCLEX-RN" above "REx-PN"
2. The `funnelHomepageViewed` event fires with `marketing_region` — confirm this dimension is being used in PostHog to segment US vs CA homepage performance
3. Add A/B test: "Start your 3-day free trial" vs "Try NCLEX-RN free for 3 days" for US visitors

**Current State:** Unknown — requires visual QA with US cookie set

---

### 1.2 — Sample question unlock CTA tracks engagement
**Expected Impact: MEDIUM**

**Evidence:**
- `posthog-conversion-events.ts:66` — `marketingSampleRationaleUnlock`
- `posthog-conversion-events.ts:67` — `marketingSampleUnlockFullCta`

**Observation:** The sample question feature exists and tracks engagement. This is a strong conversion lever (answer a question → see rationale → hit paywall → sign up).

**Recommendation:**
- Ensure the sample question on the US homepage uses a high-quality NCLEX-RN question (not REx-PN)
- The rationale unlock CTA should say "Unlock 480 NCLEX-RN questions" (number from snapshot), not a generic CTA
- Track: what % of US homepage visitors click "Unlock" → sign up conversion rate

---

### 1.3 — Trust bar exists, content not US-optimized
**Expected Impact: HIGH**

**Evidence:** `posthog-conversion-events.ts:62` — `marketingTrustBarView` fires on homepage

**Issue:** The trust bar likely shows statistics calibrated for Canada. US visitors should see:
- US-specific pass rate data or learner counts
- NCLEX-RN-specific claims (not REx-PN)
- Social proof from US nursing programs if available

**Recommendation:**
- Add US-specific trust metrics (e.g., "Trusted by X US nursing students")
- If no US-specific data yet: use global stats ("X questions practiced globally") rather than CA-specific

---

## 2. US RN HUB PAGE (/us/rn/nclex-rn)

### 2.1 — Hub CTA tracking exists
**Expected Impact: MEDIUM**

**Evidence:**
- `posthog-conversion-events.ts:97` — `funnelExamHubViewed` fires on hub page
- `posthog-conversion-events.ts:107` — `funnelExamHubStudyIntent` fires when user clicks lessons/questions/CAT cards

**Observation:** The US RN hub at `/us/rn/nclex-rn` is confirmed in the E2E test (`rn-student-signup-flow.spec.ts:36`). CTA tracking is in place.

**Recommendation:**
- Verify the hub shows "200 lessons · 480 questions" (actual content counts from snapshot)
- Add "Next Generation NCLEX ready" badge — NGN is a major US differentiator vs competitors
- Add a "How it works" section specific to NCLEX-RN (CAT exam simulator, adaptive questions)

---

### 2.2 — Hub paywall strip for lesson previews
**Expected Impact: HIGH**

**Evidence:**
- `src/components/pathway-lessons/marketing-public-lessons-hub-anonymous-upgrade-strip.tsx` exists
- `posthog-conversion-events.ts:72` — `lessonPreviewUnlockCta` fires from lesson previews

**Recommendation:**
- Ensure the anonymous upgrade strip on the US RN hub says "Unlock all 200 NCLEX-RN lessons" with a "Start free trial" CTA
- The strip fires `lessonPreviewUnlockCta` — confirm this is tracked in the PostHog US acquisition funnel

---

## 3. PRICING PAGE (/pricing)

### 3.1 — Currency display gap (US → USD)
**Expected Impact: CRITICAL**

**Evidence:** `display-catalog.ts:89–100` — base prices are in CAD. USD prices live in `regional-pricing-map.ts` and only display when `region === "us"`.

**Issue:** If US visitors land on /pricing without the US cookie set (e.g., direct URL, email link, ad click), they see CAD prices.

**Recommendation:**
- Add explicit "USD" / "CAD" selector/toggle always visible on pricing page
- Auto-detect and show the correct currency based on cookie, with a tooltip "Prices shown in USD for US visitors"
- Consider showing both currencies in a toggle for clarity

---

### 3.2 — Missing explicit trial length prominently
**Expected Impact: HIGH**

**Issue:** 3-day trial is shorter than UWorld (7-day free) and Archer (free questions). If trial length isn't prominently displayed, it doesn't serve as a conversion lever.

**Recommendation:**
- Make "3-day free trial" visually prominent on the pricing page
- Add comparison: "Start free, no commitment" or "Cancel before Day 3 for free"
- Consider extending to 7 days for US launch (see Launch Readiness Audit finding 1.3)

---

### 3.3 — No urgency or scarcity signals
**Expected Impact: MEDIUM**

**Recommendation:**
- Add "NCLEX exam date" countdown (personalized: "You have 47 days until your exam — start now")
- NurseNest already has exam date tracking: `NclexTargetDateModal` in `layout.tsx:498`
- Wire this into the pricing page: "Set your NCLEX date → see recommended plan"

---

### 3.4 — No social proof on pricing page
**Expected Impact: MEDIUM**

**Recommendation:**
- Add 3–5 US learner testimonials (short quotes, ideally with NCLEX pass result)
- Add a "Rated 4.8/5 by NCLEX candidates" or similar metric
- Consider adding NCLEX pass rate data if NurseNest has this from analytics

---

### 3.5 — Annual plan discount not prominently shown
**Expected Impact: MEDIUM**

**Evidence:** `display-catalog.ts:117–120` — anchor prices exist (e.g., RN yearly anchor: $299.99 vs list $199.99 = 33% off)

**Recommendation:**
- Show savings as "Save 44%" vs monthly on annual plan
- Add "Most popular" badge to the plan with highest conversion (likely annual)

---

## 4. SIGNUP PAGE (/signup)

### 4.1 — Turnstile friction in CI/dev
**Expected Impact: MEDIUM**

**Evidence:** `rn-student-signup-flow.spec.ts:10–11` — "If `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set, the Create account button stays disabled until the widget resolves"

**Issue:** Cloudflare Turnstile is a bot protection layer. For legitimate US users, it adds friction before they can click "Create account."

**Recommendation:**
- Verify Turnstile solves automatically for most US users (not requiring CAPTCHA challenge)
- Monitor `signup_submit_attempt` vs actual `/api/signup` calls in PostHog — large gap = Turnstile friction

---

### 4.2 — Google OAuth path not verified for US
**Expected Impact: HIGH**

**Evidence:** `posthog-conversion-events.ts:12` — `authOAuthProviderSelected` event exists

**Issue:** Google signup is a major acquisition channel in the US (US users prefer OAuth over password). The existing E2E test (`rn-student-signup-flow.spec.ts`) only tests email/password. Google OAuth path is untested end-to-end.

**Recommendation:**
- Add OAuth E2E test (separate spec — requires Google test account or mock OAuth)
- Verify "Continue with Google" button is prominently placed on signup page
- Track `authOAuthProviderSelected` Google vs Apple split

---

### 4.3 — Country selector defaults
**Expected Impact: MEDIUM**

**Evidence:** `rn-student-signup-flow.spec.ts:95` — test manually selects `"US"` in `select[name="country"]`

**Issue:** If the country selector defaults to Canada (first alphabetically or by priority), US visitors must manually change it.

**Recommendation:**
- Auto-select "United States" in the country dropdown when `nn_global_region=US` cookie is present
- This reduces a friction click and reduces the risk of Canadian pathway being assigned to a US user

---

## 5. LEARNER DASHBOARD

### 5.1 — Paywall encounter tracking is in place
**Expected Impact: INFO**

**Evidence:** `posthog-conversion-events.ts:130` — `paywallEncounter` fires per mount with context.

**Recommendation:** In PostHog, create a funnel: `paywall_encounter` → `paywall_cta_clicked` → `checkout_started` → `learner_conversion_subscribed`. This is the US money funnel.

---

### 5.2 — Dashboard premium CTA tracked
**Expected Impact: INFO**

**Evidence:** `posthog-conversion-events.ts:210` — `dashboardPremiumCtaClicked`

---

## 6. NCLEX LANDING PAGES

### 6.1 — Programmatic SEO pages exist
**Expected Impact: MEDIUM**

**Evidence:** `src/components/seo/programmatic-seo-page.tsx` and `programmatic-funnel-ctas.tsx`

**Observation:** Programmatic landing pages exist for SEO traffic. These pages need NCLEX-specific CTAs for US organic traffic.

**Recommendation:**
- Audit all `/question-bank`, `/nclex-rn`, `/practice-questions` and similar landing pages
- Ensure each has a primary CTA → signup → US pathway
- Verify `marketingQuestionBankLandingViewed` event fires on these pages (it's in PH registry)

---

## CONVERSION RECOMMENDATIONS — PRIORITY SUMMARY

| Recommendation | Impact | Effort | Day |
|---|---|---|---|
| USD currency display for US visitors on pricing page | CRITICAL | 2h | Day 1 |
| Auto-select US country on signup | HIGH | 1h | Day 1 |
| Verify US hero copy shows NCLEX-RN (not RPN) | HIGH | 2h | Day 1 |
| Add Google OAuth E2E test | HIGH | 4h | Day 3 |
| Add "NCLEX-RN ready" badge + content counts on hub | HIGH | 2h | Day 2 |
| Display trial length prominently on pricing | HIGH | 1h | Day 2 |
| Add social proof / testimonials to pricing page | MEDIUM | 4h | Day 4 |
| Show annual plan savings % | MEDIUM | 2h | Day 3 |
| US-specific trust bar metrics | MEDIUM | 2h | Day 4 |
| Add exam date → recommended plan widget on pricing | MEDIUM | 4h | Day 7 |
| Monitor Turnstile friction in PostHog | MEDIUM | 1h | Day 2 |
| NGN "Next Generation NCLEX" differentiator on hub | MEDIUM | 2h | Day 5 |
