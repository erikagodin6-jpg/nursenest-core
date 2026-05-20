# Do not break — protected surfaces

These surfaces are **contractually sensitive** for learners, SEO, and revenue. Changes here require **extra review**, targeted tests, and often a staged rollout.

**Default rule:** If a PR is not *required* to touch one of these, **do not touch it**.

---

## Marketing and public site

| Surface | Why it matters |
|---------|----------------|
| **Homepage** | Primary acquisition and trust; layout and streaming behavior are easy to regress. |
| **Pricing** | Legal and commercial accuracy; must match live Stripe products and copy. |
| **Signup / onboarding** | Funnel drop-off; auth callback URLs and env must stay aligned. |
| **Public marketing hubs** | Pathway SEO, performance, and deep links—coordinate before URL or canonical changes. |

---

## Revenue and access

| Surface | Why it matters |
|---------|----------------|
| **Subscription / paywall** | Server-enforced entitlements; never “fix” by client-only checks. |
| **Stripe webhooks and checkout** | Incorrect handling = double charges, access loss, or free access. |
| **Account / billing UI** | High anxiety surface; copy and errors must be accurate. |

---

## Core learner product (paid)

| Surface | Why it matters |
|---------|----------------|
| **RN lesson hub** | Highest volume; pagination and payload size are safety-critical. |
| **RPN lesson hub** | Same constraints as RN; regional and pathway scoping must not leak. |
| **Lesson detail pages** | Progress, paywall, and content loading—do not bloat payloads. |
| **CAT exams** (adaptive) | Session contracts, pool scoping, exam vs practice rationale behavior. |
| **Practice exams** (linear) | Distinct from CAT; hydrate contracts and rationale timing must stay coherent. |
| **Flashcards** | Subscriber list, custom session, decks—ECG/video must not pollute default pools. |
| **Question bank** | Tier and region gates; pathway isolation for RN/PN/NP. |

---

## Content and SEO

| Surface | Why it matters |
|---------|----------------|
| **Blogs** (`/blog`, career-prefixed routes where used) | Canonical URLs, duplicates, and thin content hurt domain reputation. |
| **Sitemap** (`/sitemap.xml` and related urlsets) | Must remain valid XML; avoid auth-only or noindex URLs in the public index. |
| **Robots.txt** | Must stay consistent with sitemap and staging rules. |
| **Hreflang / canonical** | International and locale routing—easy to break with “small” metadata edits. |

---

## Admin and staff

| Surface | Why it matters |
|---------|----------------|
| **Admin diagnostics** | False greens erode trust; must not expose secrets or PII in JSON. |
| **Content publish paths** | Accidental publish affects SEO and learners—server gates mandatory. |

---

## Practical checklist before merge

- [ ] Identified which **do-not-break** rows apply to this PR.  
- [ ] Ran the **narrowest** scripted tests for those rows (e.g. `test:homepage`, `test:sitemap`, `audit:paywall-security`, pathway lesson tests).  
- [ ] Did **not** weaken `Cache-Control` / private learner cache semantics without explicit approval.  
- [ ] Did **not** change stable learner **URLs** or redirects without product + SEO sign-off.  
- [ ] No **schema** or migration in the same PR as unrelated UI (split PRs).  

---

## If you must change a protected surface

1. Write a **one-paragraph rollback plan** in the PR description.  
2. Add **before/after** evidence (screenshots, curl of sitemap snippet, API JSON shape).  
3. Schedule **post-deploy verification** (homepage, pricing, one lesson hub, one practice flow).  

Escalate ambiguities to the engineering lead—**do not ship on assumption**.
