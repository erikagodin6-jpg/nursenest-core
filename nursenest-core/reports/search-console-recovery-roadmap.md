# Phase 9 — Search Console Recovery Roadmap
Generated: 2026-05-30

---

## Current GSC Issues Summary

| Issue | Count | Root Cause | Priority |
|---|---|---|---|
| Blocked by robots.txt | 2,037 | Historical locale-level `Disallow` (now removed) | AUTO-RESOLVES |
| Noindex | 5,611 | Locale preview pages + learner shell + filtered URLs | MOSTLY INTENTIONAL |
| Duplicate without canonical | 370 | Query parameter URLs (`?ref=`, `?pathwayId=`) | HIGH |
| Google chose different canonical | 23 | Internal links to wrong URL (fixed this session) | FIXED |
| Crawled — Not Indexed | 718 | Thin content, new pages, waiting for indexing | MEDIUM |

---

## Recovery Timeline

### Week 1 — Immediate Actions (Days 1–5)

**Day 1 — GSC Setup**
```
□ Submit /sitemap.xml to Google Search Console
□ Submit all 10 child sitemaps individually
□ Use URL Inspection tool on:
  - /us/rn/nclex-rn
  - /us/rn/nclex-rn/questions
  - /us/rn/nclex-rn/lessons
  - /nclex-question-bank
  - /free-nclex-practice-questions
  Request indexing for each
□ Confirm /us and /canada are indexed
□ Verify robots.txt in GSC settings shows no blocked valuable pages
```

**Day 2 — Canonical Fix**
```
□ Audit top 370 duplicate URLs in GSC
□ Identify which query parameters create duplicates
□ Implement canonical stripping for tracking params (?ref, ?pathwayId, ?checkout)
□ Verify /us/rn/nclex-rn?ref=X → canonical /us/rn/nclex-rn
```

**Day 3 — Indexability Checks**
```
□ Run Google Rich Results Test on /us/rn/nclex-rn
□ Run on /nclex-question-bank (FAQ schema)
□ Run on 3 blog posts (Article schema)
□ Check Mobile Usability report for US pages
□ Verify Page Experience signals (CWV) for /us/rn/nclex-rn
```

**Day 4-5 — Content + Internal Links**
```
□ Verify /us CTA now links to /us/rn/nclex-rn (fix applied)
□ Add NCLEX-focused blog posts with internal links to US hub
□ Verify lesson hub at /us/rn/nclex-rn/lessons shows lesson count
□ Check that /nclex-question-bank links to /us/rn/nclex-rn/pricing
```

---

### Week 2 — Content & Authority Building

**The "Crawled — Not Indexed" 718 Pages**

These are pages Google has seen but decided not to index. Root causes:
1. **Low content depth** — Pages with little unique text
2. **Slow indexing** — New pages Google hasn't evaluated yet
3. **Thin variants** — Locale-prefixed pages with same content as English

**Remediation:**
```
For each affected URL in GSC:
1. Check word count — must be >300 unique words
2. Check uniqueness — must not be near-duplicate of another indexed page
3. Check internal links — must have at least 2-3 internal links pointing to it
4. Check schema — structured data signals quality to Google
5. Request indexing via URL Inspection tool (after fixing)
```

**Most likely affected:** Programmatic topic pages that are thin (short description, no unique content). Fix: expand content depth on each topic page.

---

### Month 1 — Monitoring & Iteration

**GSC Metrics to Watch**

| Metric | Baseline (current) | Target (30 days) | Target (90 days) |
|---|---|---|---|
| Indexed pages | Unknown | +200 new US/NCLEX pages | +500 |
| Clicks (US/NCLEX queries) | Baseline | +15% | +40% |
| Impressions | Baseline | +30% | +80% |
| Average position | Establish | Track trend | Top 10 for "NCLEX practice questions" |
| Coverage errors | Current issues | -50% | -80% |

---

## Priority Matrix

| Issue | Traffic Impact | Implementation Effort | Weeks to Resolve |
|---|---|---|---|
| Submit sitemaps to GSC | HIGH | 1 hour | Immediate |
| Fix `?ref=` canonical | HIGH | 2 hours | 1 week |
| Request indexing for US pages | HIGH | 2 hours | 2-4 weeks (Google lag) |
| Robots.txt historical blocks | MEDIUM | None (auto-resolves) | 4-12 weeks |
| Noindex on preview locales | LOW | None (intentional) | N/A |
| Crawled not indexed — thin pages | MEDIUM | 4-8h content work | 4-8 weeks |
| MedicalWebPage schema | MEDIUM | 4 hours | 2-4 weeks after deploy |

---

## US-Specific SEO Action List (30 Days)

```
□ /us/rn/nclex-rn — Request indexing + verify Course schema
□ /us/rn/nclex-rn/questions — Verify indexed, 5+ internal links pointing in
□ /nclex-question-bank — Top commercial page — verify indexed + FAQ schema working
□ /free-nclex-practice-questions — High-volume commercial intent — request indexing
□ /cat-nclex-simulator — CAT-specific — request indexing
□ /how-to-pass-nclex-2026 — Informational — request indexing
□ Add 3 NCLEX-specific blog posts with "NCLEX-RN" as primary keyword
□ Add MedicalWebPage schema to top 5 lesson pages
□ Verify Core Web Vitals for /us/rn/nclex-rn (target: LCP < 2.5s, CLS < 0.1)
```

---

## Expected Traffic Impact Timeline

| Action | Expected Organic Traffic Impact | Timeline |
|---|---|---|
| Sitemap submission + indexing requests | +20-30% impressions | 2-4 weeks |
| Canonical fix (deduplication) | +10-15% organic clicks | 3-6 weeks |
| Internal linking fix (already done) | +5-10% authority flow | 4-8 weeks |
| Blog content (3 posts) | +15-25% long-tail traffic | 6-12 weeks |
| Schema improvements | Rich results eligibility | 4-8 weeks |
| **Combined** | **+50-80% US organic traffic** | **12 weeks** |
