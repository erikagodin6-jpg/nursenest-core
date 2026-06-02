# Phase 7 — Crawled Not Indexed Remediation
Generated: 2026-05-30

---

## Overview

718 pages are "Crawled — Currently Not Indexed." This means Google visited them but decided they don't meet the quality bar for inclusion in search results.

---

## Diagnostic Framework

For each affected page, Google's decision is based on:
1. **Content depth** — Is there enough unique, valuable text?
2. **Uniqueness** — Is this near-duplicate of another indexed page?
3. **Internal links** — Does the page receive links from authoritative pages?
4. **Quality signals** — Schema, engagement metrics, E-E-A-T signals
5. **Page experience** — Core Web Vitals, mobile usability

---

## Most Likely Affected Page Types

### Category A — Programmatic Topic Pages (~200-300 pages)

**Example:** `/us/rn/nclex-rn/questions/cardiac-output-topic`

**Likely issue:** Short description, no unique content beyond a topic label and a list of question links.

**Fix:**
- Add 150–250 words of unique content per topic page
- Add schema: `DefinedTermSet` or `MedicalWebPage`
- Add internal links: 3+ links pointing to each topic page
- Add FAQ block specific to the topic

---

### Category B — Thin Locale Pages (~100-200 pages)

**Example:** `/fr/us/rn/nclex-rn` (French variant of US hub)

**Likely issue:** English content displayed with French locale prefix — near-duplicate of canonical English page.

**Fix:**
- For pages with `noindex`: Correct, no action needed
- For pages without noindex: Add French content OR add `noindex` if content is English

---

### Category C — New US Pages Not Yet Indexed (~50-100 pages)

**Example:** `/us/rn/nclex-rn`, `/us/pn/nclex-pn` etc.

**Likely issue:** Pages are new (US site just launching), Google hasn't crawled them with sufficient authority yet. Not a quality issue — a crawl timing issue.

**Fix:**
- Submit via URL Inspection → Request Indexing
- Build internal links to these pages from already-indexed pages
- Add content that earns external links (NCLEX study guides, blog posts)

---

### Category D — Stale 301/404 Targets (~50-100 pages)

**Example:** Old URLs that were restructured but may still appear in historical sitemaps or external links.

**Fix:**
- Verify all sitemap URLs return 200
- Check for redirect chains > 2 hops
- Remove 404 URLs from all sitemaps

---

## Remediation Plan by Priority

### HIGH — US Revenue Pages (Immediate)

| Page | Issue | Fix |
|---|---|---|
| `/us/rn/nclex-rn` | May be too new for Google to evaluate | Request indexing + internal links |
| `/us/rn/nclex-rn/questions` | May be thin without topic content | Add intro paragraph explaining the NCLEX-RN question bank |
| `/nclex-question-bank` | Commercial page — verify indexed | Request indexing + verify FAQ schema |

### MEDIUM — Programmatic Pages (Week 2-4)

| Fix | Scope | Effort |
|---|---|---|
| Add 150+ words to each topic page | All topic pages | 1h template, bulk apply |
| Add 3 internal links pointing to each topic | From hub and lesson pages | Engineering, 1 day |
| Add MedicalWebPage schema | High-value topics | 4h |

### LOW — Locale Thin Pages (Month 2)

| Fix | Scope | Action |
|---|---|---|
| Add noindex to English-only content on non-English locale pages | `/fr/`, `/es/` thin variants | Code change: detect content locale mismatch |
| Or: Translate key pages | Top 10 pages | Content work |

---

## Word Count Targets

| Page Type | Current Estimate | Target | Impact |
|---|---|---|---|
| Exam hub page (`/us/rn/nclex-rn`) | ~400 words | 600+ | HIGH |
| Questions hub | ~200 words | 400+ | HIGH |
| Lessons hub | ~300 words | 500+ | MEDIUM |
| Topic programmatic pages | ~80-120 words | 200-300 | MEDIUM |
| Commercial landing pages | ~800+ words | ✅ Already good | — |

---

## Expected Resolution Timeline

| Fix | Time to Index Change |
|---|---|
| URL Inspection → Request Indexing | 1-4 weeks |
| Internal links added | 2-6 weeks |
| Content depth improvements | 4-8 weeks |
| Schema additions | 2-4 weeks after deploy |
| New US launch pages (organic) | 4-12 weeks |
