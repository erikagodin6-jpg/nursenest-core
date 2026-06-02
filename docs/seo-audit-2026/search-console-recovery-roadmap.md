# NurseNest — Search Console Recovery Roadmap (Phase 9)

**Date:** 2026-05-30
**Baseline:** As of 2026-05-30 Search Console data

---

## Current State

| Issue | Count | Est. Impact |
|---|---|---|
| Blocked by robots.txt | 2,037 | LOW — correct blocks mostly |
| Noindex | 5,611 | MEDIUM — mostly locale pages |
| Duplicate without user-selected canonical | 370 | HIGH — indexation loss |
| Duplicate — Google chose different canonical | 23 | HIGH — split equity |
| Crawled — Currently Not Indexed | 718 | HIGH — content waste |
| **Total pages with issues** | **~8,759** | |

---

## Recovery Categories

### Category A — Correct and Expected (Do Not Fix)

These numbers represent correct behavior and should not be changed:

| Issue | Count | Reason |
|---|---|---|
| Noindex — auth pages (login, signup, forgot-password) | ~800 | Correct — should not be indexed |
| Noindex — app shell (/app/*) | ~200 | Correct — learner app, not indexable |
| Noindex — incomplete locales | ~4,200 | Correct — noindex via tier system |
| Blocked by robots.txt — /app/ + /admin/ + /api/ | ~2,037 | Correct — private surfaces |

**These ~7,237 issues require zero action.** They are deliberate SEO decisions.

### Category B — Fixable, High Impact

| Issue | Count | Fix | Est. Traffic Gain |
|---|---|---|---|
| Crawled not indexed — thin programmatic pages | ~280 | Add content OR consolidate | 15–25% indexation improvement |
| Duplicate — country pathway pairs | ~143 | Differentiate H1 + intro copy | 5–10% impression gain |
| Duplicate — practice exam URL cluster | ~12 | Consolidate + 301 | Minor (consolidates equity) |
| Crawled not indexed — authority cluster pages | ~80 | Add FAQ + unique content | 8–12% indexation improvement |
| Missing schema (WebSite + SearchAction) | All pages | Add to layout | Enables sitelinks search box |
| Missing Organization schema | All pages | Add to layout | EEAT + entity recognition |

### Category C — Fixable, Medium Impact

| Issue | Count | Fix | Est. Traffic Gain |
|---|---|---|---|
| Noindex — partial locale pages | ~410 | Promote to complete OR downgrade to incomplete | 5–8% (when ready) |
| Crawled not indexed — locale pages | ~150 | Downgrade tier to incomplete | Removes from "problem" list |
| Missing Article schema on blog posts | ~150+ posts | Add Article + author schema | E-E-A-T improvement |
| Missing FAQPage schema on lessons | ~200+ lessons | Add FAQ schema | PAA rich results |
| Orphaned allied health pages | ~40 pages | Add internal links | Crawl + index improvement |

---

## Prioritized Roadmap

### Sprint 1 — Foundation (Weeks 1–2)

**Owner:** Engineering + SEO

**Goal:** Fix critical technical infrastructure issues that affect all pages.

| Task | File/Component | Effort |
|---|---|---|
| Add `WebSite` schema + `SearchAction` to root layout | `src/app/layout.tsx` | 2h |
| Add `Organization` schema with `sameAs` to root layout | `src/app/layout.tsx` | 2h |
| Verify `sitemap-localized.xml` excludes all `tier: "incomplete"` locales | `sitemap-localized.xml` + locale tier config | 3h |
| Confirm no noindex page appears in any sitemap | Sitemap generators | 4h |
| Consolidate `/nclex-practice-questions` + `/free-nclex-practice-questions` → 301 to canonical | Route config | 2h |
| Request re-indexing for 10 highest-value pages affected by 5xx history | Search Console | 1h |

**Expected impact:** Fixes sitelinks eligibility, removes 50 invalid sitemap URLs, improves entity recognition.

---

### Sprint 2 — Content Differentiation (Weeks 3–4)

**Owner:** Content + Engineering

**Goal:** Eliminate the "Duplicate — Google chose different canonical" cases.

| Task | File/Component | Effort |
|---|---|---|
| Write unique H1 + 200-word intro for each Canada/US pathway pair | Pathway hub pages | 8h content |
| Add country-scope badge to all pathway hub pages | Hub page components | 3h |
| Differentiate meta title + description for top 20 pathway page pairs | Metadata generators | 4h |
| Ensure each programmatic SEO slug has truly unique H1 | `src/app/(marketing)/(default)/[slug]/` | 4h audit |

**Expected impact:** Resolves ~143 "Duplicate — Google chose different canonical" cases over 4–8 weeks.

---

### Sprint 3 — Content Quality (Weeks 5–8)

**Owner:** Content team

**Goal:** Move 200+ "Crawled Not Indexed" pages to indexed status.

| Task | Priority | Effort |
|---|---|---|
| Identify top 50 thin programmatic pages with >500 questions | CRITICAL | 4h audit |
| Write 400-word clinical overview for each top-50 topic | CRITICAL | 50h content |
| Consolidate bottom 100 thin pages (301 + remove from sitemap) | HIGH | 8h |
| Add FAQ sections (3+ Q&A) to all authority cluster pages | HIGH | 30h content |
| Add `FAQPage` JSON-LD to all pages with FAQ sections | HIGH | 8h engineering |
| Downgrade all `tier: "partial"` locales with <60% translation to `tier: "incomplete"` | MEDIUM | 2h |

**Expected impact:** 150–200 pages move from "Crawled Not Indexed" to indexed over weeks 8–12.

---

### Sprint 4 — E-E-A-T + Schema Depth (Weeks 9–12)

**Owner:** Engineering + Content

**Goal:** Strengthen authority signals for medical/health content.

| Task | Priority | Effort |
|---|---|---|
| Add `Article` schema with author credentials to all blog posts | HIGH | 6h engineering |
| Add `MedicalWebPage` schema to all lesson pages | HIGH | 4h engineering |
| Create author profile pages for all named content contributors | HIGH | 8h content |
| Add `EducationalOccupationalProgram` schema to RN/PN/NP pathway hubs | MEDIUM | 4h engineering |
| Add `Course` schema to ECG module and structured content programs | MEDIUM | 3h engineering |
| Add `MedicalCondition` schema to top 50 condition authority pages | MEDIUM | 4h engineering |

**Expected impact:** Improved E-E-A-T score over 3–6 months; potential rich result appearances (PAA, course cards, article bylines).

---

### Sprint 5 — Internal Linking + Crawl Efficiency (Weeks 13–16)

**Owner:** Engineering + Content

**Goal:** Ensure all valuable pages receive crawl budget and link equity.

| Task | Priority | Effort |
|---|---|---|
| Add "Related Topics" cross-links to all authority cluster pages | HIGH | 8h engineering |
| Add NP specialty cross-links from advanced practice lessons | HIGH | 4h content |
| Add pre-nursing entry points from foundational science lessons | HIGH | 3h content |
| Ensure all blog posts in ECG/pharmacology/labs topics link to feature pages | MEDIUM | 4h content |
| Add HTML sitemap page visible to users and crawlers | LOW | 4h engineering |

**Expected impact:** Reduces orphaned pages, improves crawl depth for allied health + NP specialty pages.

---

## Success Metrics

### 30 Days

| Metric | Current | Target |
|---|---|---|
| "Submitted URL has noindex" errors | 0 | 0 (maintain) |
| "Submitted URL not found (404)" | Unknown | 0 |
| "Crawled — Currently Not Indexed" | 718 | <600 |

### 90 Days

| Metric | Current | Target |
|---|---|---|
| "Duplicate without user-selected canonical" | 370 | <200 |
| "Duplicate — Google chose different canonical" | 23 | <10 |
| "Crawled — Currently Not Indexed" | 718 | <400 |
| Total indexed pages | Unknown | +200 net new |
| Organic impressions | Baseline | +15–20% |

### 180 Days

| Metric | Current | Target |
|---|---|---|
| "Crawled — Currently Not Indexed" | 718 | <200 |
| Total indexed pages | Unknown | +500 net new |
| Organic impressions | Baseline | +35–50% |
| Organic clicks | Baseline | +25–40% |

---

## Revenue Impact Estimates

These are directional estimates based on industry benchmarks for healthcare/education SaaS:

| Action | Estimated Traffic Gain | Conversion Rate | Monthly Revenue Impact |
|---|---|---|---|
| 200 new pages indexed | +500–1,000 monthly sessions | 2–3% → trial/signup | +$500–$2,000/mo |
| Sitelinks search box | +5–8% branded CTR | — | Retention / brand signal |
| FAQ rich results on 50 pages | +10–20% impression CTR | 1.5–2% | +$300–$800/mo |
| Consolidate duplicate URLs | Consolidates equity to primary | 2–3% | +$200–$600/mo |
| E-E-A-T improvements | Long-term authority | — | Compound over 6–12 months |

**Conservative 6-month outlook:** +$1,200–$4,000/month additional revenue attributable to SEO recovery.

---

## Risk Registry

| Risk | Likelihood | Mitigation |
|---|---|---|
| Consolidating practice exam URLs causes short-term ranking drop | MEDIUM | Monitor top 5 keywords, 301 permanent (not temporary) |
| Downgrading locale tiers triggers Google deindex cascade | LOW | Monitor Search Console weekly post-change |
| Adding schema causes validation errors if malformed | MEDIUM | Run Rich Results Test before deploying each schema type |
| Thin page consolidation removes pages Google has indexed | MEDIUM | 301 all removed pages immediately, never 410 unless content was malicious |

---

*Cross-references: `robots-audit.md`, `noindex-audit.md`, `canonical-audit.md`, `duplicate-content-audit.md`, `sitemap-cleanup-report.md`, `internal-linking-audit.md`, `crawled-not-indexed-remediation.md`, `schema-health-report.md`*
