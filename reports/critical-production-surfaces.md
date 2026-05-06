# NurseNest — critical production surfaces (non-regression contract)

These surfaces **must not regress** without an explicit migration plan, QA on entitlements, and SEO checks where applicable.  
**Enforcement today:** mix of E2E (Playwright), API contracts, entitlement middleware, and manual release checklist items.

---

## Tier A — revenue, trust, and crawlability

| Surface | Primary routes / handlers | Why critical |
|---------|-----------------------------|--------------|
| **Homepage** | `(marketing)/(default)/page.tsx` → `HomeRestoredClient` | Primary acquisition; lazy legacy sections; image fallbacks. |
| **Pricing** | `/[locale]/[slug]/[examCode]/pricing`, allied pricing mirrors | Stripe / plan copy; wrong gating = legal + revenue risk. |
| **Subscription / paywall** | Server `requireSubscriberSession`, `requireAnyPaidTier`, entitlement resolvers, Stripe webhooks | **Server-side** truth; client guards are additive only. |
| **Signup / onboarding** | Marketing auth CTAs + learner `/app` onboarding flows | Funnel breakage; session cookies. |
| **Sitemap / hreflang / canonical** | `sitemap*.xml` routes, per-page metadata, blog canonical fields | SEO regressions are silent revenue killers. |

---

## Tier B — core study product (learner)

| Surface | Routes / APIs | Notes |
|---------|---------------|-------|
| **Learner dashboard** | `/app`, `load-learner-dashboard.ts` | Aggregates progress; cache invalidation sensitive. |
| **Learner lessons** | `/app/lessons`, `/app/lessons/[id]` | PathwayLesson Option B + legacy redirects. |
| **Marketing lesson pages** | `/[locale]/[slug]/[examCode]/lessons/...` | Public completeness gates; hub + topic + detail. |
| **CAT engine (practice)** | `/app/practice-tests/*`, `/api/practice-tests`, `lib/exams/cat-engine` | Adaptive state + blueprint diagnostics. |
| **Practice tests / exams hub** | `/app/practice-tests`, `/app/practice-exams` | Same POST API; launch header contract. |
| **Questions hub** | `/app/questions`, related APIs | Entitlement + pathway filters. |
| **Flashcards** | `/app/flashcards`, `/api/flashcards*` | Subscriber list + deck study; watermark/preview rules. |

---

## Tier C — adjacent high-traffic

| Surface | Notes |
|---------|-------|
| **Labs** | `/app/labs/*` — `labs-engine` corpus. |
| **OSCE** | Public `/…/osce/*` + learner `/app/osce/*` — DB published rows gate legacy JSON. |
| **Med calculations** | `/app/med-calculations/*` — pathway-scoped study tools. |
| **Account / progress / report card** | `/app/account/*` — learner trust surfaces. |

---

## Explicit non-goals for “hotfix in prod”

- Silently switching lesson SoT from `PathwayLesson` back to `ContentItem`.  
- Client-only paywall or admin authorization.  
- Unbounded lesson/list APIs (pagination caps are part of the contract).  
- Hand-editing merged i18n JSON as a long-term strategy (`docs/i18n-architecture.md`).

---

## Verification pointers

- Entitlements: `src/lib/entitlements/*`  
- Paywall logging: `entitlement-logging.ts`  
- Content registry guard: `npm run content:source-of-truth:check`  
- i18n: `npm run i18n:validate` / `i18n:ci`  
- Cursor/IDE stability (tooling): `reports/cursor-remote-stability.md`


---

## Tier D — auth entry / onboarding (explicit paths)

| Flow | Key paths | Regression risk |
|------|-----------|-----------------|
| **Signup CTA** | Marketing pages link **`/signup`** | Broken link = acquisition loss. |
| **Login** | **`/login`** with `callbackUrl` (e.g. onboarding) | Loop or lost return URL. |
| **Onboarding** | **`/app/onboarding`** until `onboardingCompletedAt` set | Infinite redirect or skipped pathway selection breaks downstream entitlement UX. |
| **Start studying** | **`/app/start-studying`** re-checks onboarding | Secondary gate — keep aligned with dashboard. |
