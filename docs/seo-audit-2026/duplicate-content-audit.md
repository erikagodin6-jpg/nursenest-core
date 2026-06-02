# NurseNest — Duplicate Content Audit (Phase 4)

**Date:** 2026-05-30
**Scope:** Duplicate and near-duplicate page patterns contributing to canonicalization failures

---

## Overview

Duplicate content on NurseNest falls into five categories:

| Category | Estimated URL Count | Risk Level |
|---|---|---|
| Locale mirror pages | ~4,200 | LOW — controlled by noindex |
| Practice exam hub URL proliferation | ~12 URLs | HIGH — all indexable |
| Pathway country variants | ~80 URLs | HIGH — nearly identical templates |
| Programmatic SEO near-duplicates | ~200 URLs | MEDIUM |
| Lesson hub pagination / filter variants | ~40 URLs | LOW |

---

## Category 1 — Locale Mirror Pages

**Pages:** `/fr/`, `/es/`, `/de/`, `/pt/`, `/it/`, `/ko/`, `/ja/`, `/zh/` + all their sub-pages

**Status:** CONTROLLED — `tier: "incomplete"` and `tier: "partial"` locales auto-emit `noindex` via `localeRobotsOverride()` in `safeGenerateMetadata`.

**Remaining risk:** `tier: "partial"` locales (e.g. French, Spanish, Portuguese) are partially translated but may share identical untranslated sections with the English original. When Google crawls these (they are crawlable per robots.txt), it compares content. If >70% is identical to the English canonical, Google may downgrade or disregard the canonical signal.

**Action:** For each `tier: "partial"` locale, audit content overlap. If machine-translated only, keep noindex. If professionally localized to >60% unique, consider promoting to `tier: "complete"`.

---

## Category 2 — Practice Exam Hub URL Proliferation (HIGH RISK)

The following indexable URLs serve substantially similar content:

| URL | Primary Topic | Differentiation Score |
|---|---|---|
| `/nclex-question-bank` | NCLEX questions | Baseline |
| `/nclex-practice-questions` | Free NCLEX questions | ~15% different |
| `/free-nclex-practice-questions` | Free NCLEX questions | ~15% different |
| `/adaptive-nclex-testing` | CAT / adaptive | ~30% different |
| `/nclex-rn-guide` | Study guide | ~40% different |
| `/nclex-study-plan` | Study planning | ~40% different |

**Root cause:** Each page was created as a programmatic SEO target for a different keyword cluster, but they share the same component templates with minimal content differentiation.

**Google Search Console signal:** "Duplicate — Google chose different canonical" (23 cases) is likely dominated by these pages. Google is treating several of these as the same document and picking one URL as the canonical.

### Recommended Action

**Merge strategy:**
1. `/nclex-question-bank` → PRIMARY (strongest brand URL, most backlinks likely)
2. `/nclex-practice-questions` → 301 to `/nclex-question-bank`
3. `/free-nclex-practice-questions` → 301 to `/nclex-question-bank` (or dedicate to a "free tier" landing page with distinct content)
4. `/adaptive-nclex-testing` → Keep, ensure H1 and opening 200 words are distinctly about CAT/adaptive methodology (not generic practice questions)

---

## Category 3 — Pathway Country Variants (HIGH RISK)

**Pattern:** The same lesson/question hub exists for both Canada and US:

| Canada URL | US URL | Template Overlap |
|---|---|---|
| `/canada/rn/nclex-rn/questions` | `/us/rn/nclex-rn/questions` | ~85% |
| `/canada/rn/nclex-rn/lessons` | `/us/rn/nclex-rn/lessons` | ~80% |
| `/canada/rn/nclex-rn/cat` | `/us/rn/nclex-rn/cat` | ~90% |
| `/canada/pn/rex-pn/questions` | `/us/pn/nclex-pn/questions` | ~75% |

**Current differentiation:** The `publicLessonsHubSectionLead*` functions in `nursing-tier-public-labels.ts` generate different body text per country, but the H1, page title template, feature grid, and CTA copy are identical.

**Google signal:** 23 "Duplicate — Google chose different canonical" cases are almost certainly these pairs. Google is picking one (usually the one with more backlinks or crawl priority) and treating the other as a duplicate.

### Recommended Action

**Differentiate meaningfully:**

1. H1 must include country: "NCLEX-RN Practice Questions for Canadian Nurses" vs "NCLEX-RN Practice Questions — United States"
2. Opening paragraph (first 150 words) must be country-unique — write separate content for each, not just a template variable swap
3. Add a visible "Canada-First" or "United States" scope badge in the hero
4. The meta description must be country-specific (currently uses the same template with a minor suffix)

---

## Category 4 — Programmatic SEO Near-Duplicates (MEDIUM RISK)

**Affected pages:** Authority cluster pages, condition pages, skill pages using shared templates.

**Pattern:** Pages like:
- `/nursing-pharmacology` vs `/nclex-pharmacology` vs `/pharmacology-nursing`
- `/lab-values` vs `/nursing-lab-values` vs `/clinical-lab-interpretation`
- `/ecg-interpretation` vs `/ecg-nursing` vs `/cardiac-rhythm-interpretation`

**Component:** `authority-cluster-page.tsx`, `authority-resource-page.tsx`

**Issue:** These use the same React component with different query params. If the template generates the same H1 and first 200 words, Google treats them as duplicates.

### Recommended Action

1. Audit which of these URL pairs are both in the sitemap
2. For each pair: either 301 the weaker to the stronger, or differentiate the H1, meta title, and opening section uniquely
3. Do NOT create more topic variants without committing to unique content per URL

---

## Category 5 — Lesson Hub Pagination/Filter Variants (LOW RISK)

**Pattern:** `/canada/rn/nclex-rn/lessons?page=2`, `/canada/rn/nclex-rn/lessons?category=pharmacology`

**Current status:** Query parameter variants are generally not in the sitemap (confirmed via `sitemap-public-index-filter.ts` which validates canonical URLs). The risk is low.

**Verify:** Ensure `?page=`, `?category=`, `?topic=`, and `?q=` query string URLs are NOT included in any sitemap. If they are, they must either have a self-referencing canonical or be omitted.

---

## Differentiation Scorecard

For each high-priority URL pair, these elements must be unique:

| Element | Weight | Required for Differentiation |
|---|---|---|
| `<title>` tag | 20% | Must be unique |
| H1 | 25% | Must be unique, country/topic-specific |
| Opening 150 words | 30% | Must be unique, different angle |
| FAQ section | 15% | Should be topic-specific |
| Schema | 10% | Must reference correct canonical |

---

## Summary: Merge vs Canonicalize vs Differentiate

| URL Group | Decision | Action |
|---|---|---|
| `/nclex-question-bank` + `/nclex-practice-questions` | Merge | 301 `/nclex-practice-questions` → `/nclex-question-bank` |
| `/free-nclex-practice-questions` | Differentiate | Dedicate to free-tier CTA page with unique copy |
| Canada vs US pathway pairs | Differentiate | Unique H1, opening paragraph, and country badge per variant |
| Programmatic authority clusters | Audit + decide | Merge weakest duplicates, differentiate survivors |
| Locale mirrors | No action | Noindex controls duplication |

---

*Generated from code review of `src/lib/marketing/nursing-tier-public-labels.ts`, `src/components/seo/authority-*.tsx`, `src/lib/seo/marketing-alternates.ts`*
