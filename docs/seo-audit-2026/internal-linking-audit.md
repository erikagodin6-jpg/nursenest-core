# NurseNest — Internal Linking Audit (Phase 6)

**Date:** 2026-05-30
**Scope:** Orphan pages, weak link depth, missing hub connections, breadcrumbs

---

## Current Internal Linking Infrastructure

NurseNest has several linking systems:

| System | Component/File | Connects |
|---|---|---|
| Breadcrumbs | `BreadcrumbTrail`, `breadcrumb-resolver.ts` | Every marketing page → parent hub |
| Cross-links | `marketing-study-cross-links.tsx` | Lessons ↔ questions ↔ flashcards |
| Hub navigation | `nursing-tier-hub-page.tsx` | Pathway hub → sub-pages |
| SEO continuation | `programmatic-seo-continuation-section.tsx` | Programmatic pages → related topics |
| Blog cross-links | `home-blog-teaser-section.server.tsx` | Homepage ↔ recent blog posts |
| Study modes hub | `programmatic-study-modes-hub.tsx` | Question types → modes |

---

## Orphan Page Analysis

### High-Risk Orphans (0–1 Internal Links)

These page categories are most likely to be orphaned or weakly linked:

#### 1. Allied Health Condition Pages

**Pattern:** `/allied-health/{discipline}/{topic}` — individual condition or skill pages for RT, OT, PT, MLT, PSW roles

**Risk:** These are often created as programmatic SEO targets but the only inbound link is from the Allied Health hub page (`/allied-health`). No cross-links from lesson pages, question bank pages, or blog posts.

**Fix:** Add "Related Allied Health Topics" section to all allied health hub pages and blog posts mentioning allied health roles. Each allied health blog post should link to 2–3 relevant condition pages.

#### 2. CNPLE / NP Specialty Pages

**Pattern:** `/np/{specialty}` — CNPLE, FNP, AGPCNP, PMHNP, WHNP, PNP-PC pages

**Risk:** The NP hub page links to specialty pages but these pages do not link back to each other (cross-specialty linking is absent). Additionally, blog posts and lesson pages rarely link to NP specialty pages.

**Fix:** Add "Other NP Pathways" navigation section to each NP specialty page. Add NP specialty links in relevant pharmacology, clinical judgment, and advanced practice lesson pages.

#### 3. Pre-Nursing / TEAS / HESI / CASPer Pages

**Pattern:** `/pre-nursing`, `/ati-teas`, `/hesi-a2`, `/casper-test`

**Risk:** The pre-nursing pathway card on the homepage links to `/pre-nursing`, but individual ATI TEAS, HESI A2, and CASPer pages receive no links from blog posts, lesson pages, or Q&A pages targeting pre-nursing audiences.

**Fix:** Blog posts about nursing school admissions should link to these pages. The `/pre-nursing` hub should prominently link to each exam page. Add "Preparing for nursing school?" cross-link section to foundational science lesson pages.

#### 4. Programmatic Authority Cluster Pages

**Pattern:** `/nursing-{condition}`, `/{condition}-nursing-care`, etc.

**Risk:** These pages often link forward (to question bank, lessons) but are not linked TO from other authority cluster pages that cover related topics. An isolated authority page about "Sepsis Nursing Care" may not receive links from "SIRS Assessment" or "Hemodynamic Monitoring" pages.

**Fix:** Each authority cluster page should include a "Related Topics" section listing 4–6 topically adjacent cluster pages.

---

## Crawl Depth Analysis

### Target: All valuable content reachable within 3 clicks from homepage

| Content Type | Current Depth | Target | Gap |
|---|---|---|---|
| Homepage | 1 | 1 | None |
| Marketing pathway hubs | 2 | 2 | None |
| Lesson hub pages | 2–3 | 2 | Marginal |
| Individual lesson pages | 3–4 | 3 | Some deep lessons at depth 4+ |
| Allied health condition pages | 4–5 | 3 | **Gap** |
| CNPLE specialty pages | 4–5 | 3 | **Gap** |
| Authority cluster pages | 3–4 | 3 | Marginal |
| Blog posts | 2–3 | 2 | None (blog teaser on homepage) |
| New grad specialty pages | 4–5 | 3 | **Gap** |

**Critical depth issue:** Allied health sub-pages, NP specialty pages, and new grad specialty pages are 4–5 clicks from the homepage. Google's crawl budget allocation drops significantly for deep pages.

---

## Breadcrumb Coverage

**Current status:**
- `BreadcrumbTrail` is rendered on all marketing pages via `marketingHomeSurfaceBreadcrumbs()`
- `BreadcrumbJsonLd` structured data is emitted on homepage and lesson pages
- The homepage renders breadcrumbs conditionally: `{crumbs.length > 0 ? ... : null}`

**Gaps:**
1. Authority cluster pages — do they all have `BreadcrumbJsonLd`? Verify via grep.
2. Pre-nursing pages — breadcrumb should show Home → Pre-Nursing → ATI TEAS (not just Home → ATI TEAS)
3. Allied health condition pages — breadcrumb should show Home → Allied Health → [Discipline] → [Topic]

---

## Missing Hub Connections

### 1. Homepage → ECG Content

**Current:** The homepage has a dedicated ECG section (`PremiumHomepageEcg`) with CTA to `/ecg-interpretation` and `/ecg-practice-questions`. These links exist.

**Gap:** No link from the ECG section to the Advanced ECG Add-On landing page or to the Telemetry Shift simulation page. A visitor interested in ECG can see the add-on exists but cannot easily navigate to its pricing.

### 2. Lessons → Questions (Same Topic)

**Current:** `marketing-study-cross-links.tsx` provides cross-links.

**Gap:** Verify that every lesson page links to the question bank scoped to that lesson's topic. If lessons emit cross-links to `/canada/rn/nclex-rn/questions` (the generic hub) instead of a topic-scoped URL, the cross-link value is minimal.

### 3. Question Bank → Flashcards (Same Topic)

**Gap:** After completing a practice set, the platform suggests remediation, but the marketing/public-facing question bank pages don't visibly link to topic-scoped flashcard pages. This reduces the perceived ecosystem depth for visitors who land on practice question pages.

### 4. Blog Posts → Feature Pages

**Current:** Blog posts link to relevant lesson and question pages.

**Gap:** Blog posts about ECG, labs, medication math, or pharmacology should link to the respective feature landing pages (`/ecg-interpretation`, `/labs-interpretation`, `/clinical-modules`). Check that all blog posts in these topics contain at least one feature page link.

### 5. Pricing Page → Feature Deep-Dives

**Gap:** The pricing page (`/pricing`) should link to each major feature's marketing landing page so visitors can understand what they're paying for. This also improves crawl distribution to feature pages.

---

## Weak-Link Pages

### Pages with High Traffic Potential but Few Inbound Links

| Page | Estimated Value | Current Inbound Links |
|---|---|---|
| `/ecg-interpretation` | HIGH | Homepage, ECG section only |
| `/labs-interpretation` | HIGH | Clinical depth section only |
| `/medication-math` | HIGH | Clinical depth section only |
| `/clinical-skills` | HIGH | Clinical depth section only |
| `/new-grad` or `/canada/new-grad` | HIGH | Pathway card only |
| `/for-institutions` | HIGH | Footer only |
| `/pre-nursing` | HIGH | Pathway card, no blog links |
| `/np` + specialty pages | HIGH | Pathway card, no blog links |

---

## Priority Fix List

### Critical (Do This Week)
1. Add "Related Topics" cross-links to all authority cluster pages (min 4 links per page)
2. Add NP specialty cross-links on every NP-adjacent lesson page
3. Add pre-nursing entry points to all foundational science lesson pages

### High Priority (This Sprint)
4. Audit allied health pages for depth > 3 — add shortcut links from the allied health hub
5. Ensure every blog post in high-value topics (ECG, pharmacology, labs, NGN) links to the corresponding feature page
6. Add "Study with Questions" and "Study with Flashcards" links to every lesson page's footer

### Medium Priority (Next Sprint)
7. Add a "Related Simulations" section to ECG and labs lesson pages
8. Add breadcrumb JSON-LD to all authority cluster pages
9. Create a `/sitemap` HTML page (visible to visitors) linking to all major content hubs — helps both users and crawlers discover deep content

---

*Generated from code review of `src/components/seo/marketing-study-cross-links.tsx`, `src/lib/seo/breadcrumb-resolver.ts`, `src/components/marketing/home-restored-client.tsx`, `src/components/seo/programmatic-seo-continuation-section.tsx`*
