# NurseNest — Crawled Not Indexed Remediation (Phase 7)

**Date:** 2026-05-30
**Scope:** 718 pages with "Crawled — Currently Not Indexed" status in Google Search Console

---

## Why Google Refuses to Index Crawled Pages

Google crawls a page but decides not to index it when it judges the page as:
1. Low quality / thin content
2. Duplicate of a higher-quality version
3. Unhelpful to users (generic, template-heavy, low unique value)
4. Missing signals of authority (no internal links, no schema, no E-E-A-T)
5. Technically problematic (slow response, render-blocked content, poor Core Web Vitals)

---

## Estimated Distribution of 718 Affected Pages

| Root Cause | Estimated Count | Priority |
|---|---|---|
| Thin programmatic SEO pages | ~280 | CRITICAL |
| Near-duplicate country pathway variants | ~120 | HIGH |
| Locale pages with minimal unique content | ~150 | MEDIUM |
| Authority cluster pages with generic templates | ~80 | HIGH |
| Pages affected by past 5xx incidents | ~50 | MEDIUM (self-resolving) |
| Misc (orphaned, deep, no internal links) | ~38 | LOW |

---

## Group 1 — Thin Programmatic SEO Pages (CRITICAL, ~280 pages)

### What They Are

Pages generated from condition/topic/question-type databases that render via a shared template. If the database entry has limited content, the rendered page may have:
- A unique H1 and meta title
- A 1–2 paragraph intro (machine-generated or lightly templated)
- A question bank CTA
- No unique body content beyond the template

### Why Google Rejects Them

Google's Helpful Content system targets exactly this pattern: "pages that aren't primarily made for people but are made to rank." A page about "atrial fibrillation nursing questions" that has one paragraph, a CTA, and a question bank embed is not more helpful than the main question bank page.

### Remediation Strategy

**Tier 1 — Promote (add real content):**
- For topics with >500 questions in the question bank: add a dedicated 400–600 word clinical overview specific to that topic, written for the specific exam pathway
- Add 3–5 frequently asked questions with direct answers (FAQ schema)
- Add 3 cross-links to related topics
- Add "Why this topic matters on NCLEX/CNPLE" box

**Tier 2 — Consolidate (merge into parent):**
- For topics with <50 questions: remove the standalone page, redirect to the topic's section within the parent hub page
- Remove from sitemap immediately

**Tier 3 — Noindex (low-value, not yet worth promotion):**
- Topics with 50–200 questions that don't have budget for content improvement: add `noindex` temporarily until content is ready
- Remove from sitemap

**Decision Matrix:**
| Questions | Unique Content | Action |
|---|---|---|
| >500 | Yes | Promote (invest in content) |
| >500 | No | Add content within 30 days |
| 100–500 | Yes | Promote |
| 100–500 | No | Noindex until content added |
| <100 | Any | Consolidate to parent hub + 301 |

---

## Group 2 — Country Pathway Variants (~120 pages)

**Examples:**
- `/canada/rn/nclex-rn/questions/pharmacology` vs `/us/rn/nclex-rn/questions/pharmacology`
- These are nearly identical except for the country-specific introductory sentence

**Why Google rejects them:** The pages are too similar. Google picks one and ignores the other.

### Remediation Strategy

For each Canada/US pair:
1. **Ensure distinct H1:** "NCLEX-RN Pharmacology Questions — Canada" vs "NCLEX-RN Pharmacology Questions — United States"
2. **Add 200-word country-specific intro** that mentions Canadian-specific context (e.g., Canadian drug naming conventions, CRNE/REx-PN vs NCLEX) OR US-specific context (e.g., NCSBN, state boards)
3. **Add country-specific FAQ items** that address exam-specific concerns
4. **If differentiation is not feasible**: keep Canada (primary market) and noindex the US equivalent, redirecting to the Canada version until US content is properly differentiated

---

## Group 3 — Locale Pages with Minimal Unique Content (~150 pages)

**Affected:** `tier: "partial"` locales (French, Spanish, Portuguese, etc.) where translation is incomplete

**Why Google rejects them:** The page is crawlable, has a canonical to the English page, but shows mostly English content with some translated sections. Google sees this as thin and unhelpful to the intended locale audience.

### Remediation Strategy

This is controlled by the existing locale tier system:
1. All `tier: "partial"` locales should be **downgraded to `tier: "incomplete"`** if their translation coverage is <60%
2. Only promote a locale to `tier: "complete"` when all major page sections are professionally translated AND the page provides >200 words of unique localized content per page

**Immediate fix:** Audit each `tier: "partial"` locale. If the percentage of translated content per page is <60%, set tier to `"incomplete"` to trigger auto-noindex. This removes ~150 crawled-not-indexed URLs from the problem.

---

## Group 4 — Authority Cluster Pages with Generic Templates (~80 pages)

**Examples:** Condition pages, comparison pages, "vs" pages using `authority-comparison-page.tsx`

**Issue:** These pages share a template where the unique content is only in the H1, meta title, and one swapped paragraph. The rest (feature lists, CTAs, testimonials) is identical across all pages.

### Remediation Strategy

1. Identify the 20 highest-traffic authority cluster pages using Search Console click data
2. For each: add a genuine 300–500 word clinically written section specific to that topic
3. Add topic-specific FAQ (3–5 questions with real answers)
4. Add schema: `MedicalWebPage`, `FAQPage`, or `Article` as appropriate
5. Link to 3–5 related authority cluster pages
6. For the remaining 60 low-traffic pages: noindex until content is ready, remove from sitemap

---

## Group 5 — Pages Affected by Past 5xx Incidents (~50 pages)

**Background:** See `seo-5xx-audit.md`. Pages that returned 5xx during Google's crawl window are stored as "Crawled — Currently Not Indexed" until Google re-crawls them and finds a 200 response.

**Remediation:** These should self-resolve as Google re-crawls. However:
1. Use Google Search Console URL Inspection + "Request Indexing" for the 10 highest-value affected pages
2. Submit affected URLs via sitemap re-submission after confirming 200 status

---

## Content Quality Checklist

For any page targeted for promotion from "Crawled Not Indexed" to "Indexed":

- [ ] Unique H1 (topic + exam + country-specific)
- [ ] Unique meta description (distinct from H1, addresses user intent)
- [ ] Minimum 300 words of unique body content (not template copy)
- [ ] 3–5 FAQ items with genuinely useful answers
- [ ] At least 3 inbound links from related pages
- [ ] Breadcrumb (visible + JSON-LD)
- [ ] At least one relevant schema type (Article, FAQPage, MedicalWebPage)
- [ ] At least one internal CTA (to question bank, lesson, or flashcards for this topic)
- [ ] Page loads in <3 seconds on mobile

---

## Measurement Plan

**Baseline:** 718 "Crawled — Currently Not Indexed" pages (2026-05-30)

**Review cadence:**
- Week 2: Re-request indexing for all promoted pages
- Month 1: Expect 150–200 removals from the list (thin pages removed/noindexed, promoted pages indexed)
- Month 3: Target <300 pages in this state
- Month 6: Target <150 pages in this state

**Metrics to track in Search Console:**
- "Crawled — Currently Not Indexed" count (target: decreasing)
- Total indexed pages (target: increasing)
- Impressions for newly indexed pages (target: appears within 4–6 weeks of indexing)

---

*Generated from code review of `src/components/seo/authority-*.tsx`, `src/lib/seo/indexability-policy.ts`, `src/lib/i18n/language-readiness.ts`, cross-referenced with `noindex-audit.md` and `sitemap-health-report.md`*
