# SEO Recovery Execution Roadmap — Ranked by (Traffic × Revenue) / Effort
Generated: 2026-05-31 | Source: All /reports/ audits

Score = (Traffic impact 1-10 × Revenue impact 1-10) / Effort 1-10

---

## TOP 25 FIXES

| Rank | Fix | SEO | Traffic | Revenue | Effort | Score | Source |
|---|---|---|---|---|---|---|---|
| 1 | Ensure `/us/rn/nclex-rn` is indexable — verify in GSC URL Inspection after env fix | 9 | 10 | 9 | 1 | **90.0** | noindex-review.md |
| 2 | Request re-indexing for top 20 US pages via GSC URL Inspection tool (post-500 fix) | 8 | 9 | 7 | 1 | **63.0** | crawled-not-indexed-remediation.md |
| 3 | Submit `/sitemap.xml` index to Google Search Console with all child sitemap references | 9 | 8 | 6 | 1 | **48.0** | sitemap-cleanup-report.md |
| 4 | Strip query params (`?ref=`, `?pathwayId=`, `?checkout=success`) from canonical URL generation | 9 | 9 | 8 | 2 | **36.0** | canonical-audit.md |
| 5 | Fix `/us` homepage primaryCta: `/lessons` → `/us/rn/nclex-rn` (already done this session) | 8 | 9 | 8 | 1 | **36.0** | internal-linking-audit.md |
| 6 | Fix robots.txt re-crawl: 2,037 "Blocked by robots.txt" GSC entries need validation after locale fix | 9 | 6 | 4 | 1 | **36.0** | robots-indexability-audit.md |
| 7 | Monitor RN question pool growth monthly; establish 5,000-question target milestone | 8 | 9 | 8 | 1 | **72.0** | content-completeness-audit-2026-05-29.md |
| 8 | Add US-specific paragraph (100–150 words) to top 10 lesson pages to differentiate from CA | 6 | 7 | 6 | 2 | **21.0** | duplicate-content-audit.md |
| 9 | Add NCLEX-RN cross-links in blog posts → `/us/rn/nclex-rn` + `/nclex-question-bank` | 7 | 8 | 7 | 2 | **28.0** | internal-linking-audit.md |
| 10 | Increase word count on `/us/rn/nclex-rn` hub from ~400 to 600+ words with NGN content | 8 | 8 | 7 | 2 | **28.0** | crawled-not-indexed-remediation.md |
| 11 | Add internal links pointing to each programmatic topic page from hub + related lessons (3+ each) | 7 | 8 | 6 | 4 | **12.0** | crawled-not-indexed-remediation.md |
| 12 | Verify 370 "Duplicate without canonical" GSC entries; ensure query params stripped | 8 | 7 | 6 | 2 | **21.0** | canonical-audit.md |
| 13 | Monitor GSC "Duplicate without canonical" weekly after canonical fix | 7 | 6 | 5 | 1 | **30.0** | canonical-audit.md |
| 14 | Build `/us/rn/nclex-rn/test-bank` with 500+ words + FAQ schema | 10 | 9 | 10 | 4 | **22.5** | healthcare-exam-seo-implementation-roadmap.md |
| 15 | Add `MedicalWebPage` schema to all lesson detail pages (`/lessons/[slug]`) | 9 | 7 | 6 | 4 | **10.5** | schema-health-report.md |
| 16 | Build `/us/rn/nclex-rn/study-guide` with exam format + 8-week study schedule | 10 | 8 | 9 | 5 | **14.4** | healthcare-exam-seo-implementation-roadmap.md |
| 17 | Add 150–250 word substantive content to programmatic topic pages | 8 | 8 | 7 | 5 | **11.2** | crawled-not-indexed-remediation.md |
| 18 | Implement breadcrumb `BreadcrumbJsonLd` on all pathway hubs | 7 | 6 | 5 | 3 | **10.0** | breadcrumb-governance-expansion-2026-05-20.md |
| 19 | Add `Article` + `FAQPage` schema to blog posts for rich snippet eligibility | 8 | 6 | 5 | 3 | **10.0** | schema-health-report.md |
| 20 | Build `/canada/rpn/rex-pn/test-bank` with substantive content + FAQ schema | 10 | 9 | 9 | 4 | **20.25** | healthcare-exam-seo-implementation-roadmap.md |
| 21 | Fix `/en/…` locale redirect chains (no redirect chains > 2 hops) | 7 | 6 | 5 | 3 | **10.0** | canonical-audit.md |
| 22 | Ensure US lesson detail pages have `publicComplete: true` for indexing | 8 | 8 | 7 | 2 | **28.0** | canonical-risk-surfaces.md |
| 23 | Add 300–400 word content to `/us/rn/nclex-rn/questions` hub page | 8 | 7 | 6 | 2 | **21.0** | crawled-not-indexed-remediation.md |
| 24 | Add internal links from `/lessons` hub to top 5 highest-performing lesson pages | 6 | 7 | 6 | 2 | **21.0** | internal-linking-audit.md |
| 25 | Build `/canada/np/cnple/study-guide` with NP exam format + study plan | 10 | 8 | 9 | 5 | **14.4** | healthcare-exam-seo-implementation-roadmap.md |

---

## FIXES 26–50

| Rank | Fix | Score | Source |
|---|---|---|---|
| 26 | Ensure all programmatic slug pages have `robots: { index: false }` | 24.0 | noindex-review.md |
| 27 | Build `/us/np/fnp/test-bank` with NP-specific content + CAT explanation | 18.0 | healthcare-exam-seo-implementation-roadmap.md |
| 28 | Add footer cross-link widget on US NP hubs → "Also studying for NCLEX-RN?" | 21.0 | internal-linking-audit.md |
| 29 | Sync `SITEMAP_FALLBACK_PATHWAYS_PATHS` with `listPublishedExamPathwaysForPublicSite()` | 12.0 | sitemap-cleanup-report.md |
| 30 | Complete RPN question quality audit: resolve 250 near-duplicate pairs | 8.57 | rn-lesson-quality-audit.md |
| 31 | Build `/seo-cluster/insulin-nursing-questions` with 5–10 sample Q&A + rationales | 7.0 | healthcare-exam-seo-implementation-roadmap.md |
| 32 | Build `/us/np/pmhnp/test-bank` + `/us/np/pmhnp/study-guide` | 14.4 | healthcare-exam-seo-implementation-roadmap.md |
| 33 | Add hreflang bidirectional test for all US-CA pathway lesson pages | 8.17 | hreflang-consistency-audit.md |
| 34 | Build `/seo-cluster/copd-respiratory-questions` with ABG case studies | 5.0 | healthcare-exam-seo-implementation-roadmap.md |
| 35 | Build `/seo-cluster/dosage-calculations` with practice problems + calculator link | 5.0 | healthcare-exam-seo-implementation-roadmap.md |
| 36 | Validate all US lesson pages have non-generic meta descriptions | 9.33 | canonical-risk-surfaces.md |
| 37 | Regenerate `/sitemap-lessons.xml`, validate lesson counts non-zero | 9.33 | sitemap-cleanup-report.md |
| 38 | Add external links to NCSBN and ANA from US hub page (authority signal) | 6.4 | healthcare-exam-seo-authority-architecture.md |
| 39 | Build `/us/np/agpcnp/study-guide` with AGPCNP-focused content | 11.2 | healthcare-exam-seo-implementation-roadmap.md |
| 40 | Add robots test for accidental `/app/` routes in public sitemap | 12.0 | robots-indexability-audit.md |
| 41 | Update blog post `dateModified` schema; add `author` structured data | 15.0 | schema-health-report.md |
| 42 | Build `/allied/mlt/test-bank` + `/allied/paramedic/test-bank` (Phase 3) | 5.6 | healthcare-exam-seo-implementation-roadmap.md |
| 43 | Implement hreflang consistency contract tests in CI | 6.0 | hreflang-consistency-audit.md |
| 44 | Build breadcrumb validation CI check (max 3–5 crumbs per surface) | 5.0 | breadcrumb-governance-expansion-2026-05-20.md |
| 45 | Build `/allied/respiratory/test-bank` + ecosystem pages | 4.9 | healthcare-exam-seo-implementation-roadmap.md |
| 46 | Expand ECG question pool from 43 to 150 minimum | 5.6 | content-completeness-audit-2026-05-29.md |
| 47 | Add `MedicalCondition` schema to glossary condition pages | 6.67 | schema-health-report.md |
| 48 | Verify ECG module pages have `FAQPage` or `Article` schema | 6.67 | schema-health-report.md |
| 49 | Add structured data governance to enforce schema on all lesson hubs | 6.0 | breadcrumb-governance-expansion-2026-05-20.md |
| 50 | Fix legacy slug redirect tests in CI (no redirect chains > 1 hop) | 12.0 | canonical-risk-surfaces.md |

---

## FIXES 51–100

| Rank | Fix | Score | Source |
|---|---|---|---|
| 51 | Build `/allied/mlt/questions` + `/allied/paramedic/questions` with free previews | 13.5 | healthcare-exam-seo |
| 52 | Build `/allied/respiratory/questions` + allied profession question pages | 13.5 | healthcare-exam-seo |
| 53 | Build `/seo-cluster/np-case-studies-diagnostics` with SOAP note examples | 5.0 | healthcare-exam-seo |
| 54 | Expand Respiratory Therapy content: 0 → 150 lessons (Phase 0 blocker) | 7.875 | content-completeness-audit |
| 55 | Build allied health cross-link network (`/allied/mlt`, `/allied/paramedic`) | 10.0 | healthcare-exam-seo |
| 56 | Build `/seo-cluster/prioritization-delegation-sata` with NGN question type focus | 7.0 | healthcare-exam-seo |
| 57 | Build `/allied/mlt/study-guide` + `/allied/paramedic/study-guide` | 4.0 | healthcare-exam-seo |
| 58 | Build `/allied/respiratory/study-guide` + `/allied/social-work/study-guide` | 4.0 | healthcare-exam-seo |
| 59 | Increase Allied health question pool 310 → 2000 | 9.14 | content-completeness-audit |
| 60 | Build RN specialty content for new-grad tracks (ICU, Emergency, Medicine) | 4.375 | content-completeness-audit |
| 61 | Build `/allied/mlt/cat` + `/allied/paramedic/cat` with CAT explanation | 3.875 | healthcare-exam-seo |
| 62 | Build `/allied/respiratory/cat` + `/allied/social-work/cat` | 3.875 | healthcare-exam-seo |
| 63 | Build `/allied/mlt/flashcards` + `/allied/paramedic/flashcards` | 2.5 | healthcare-exam-seo |
| 64 | Build `/allied/respiratory/flashcards` + `/allied/social-work/flashcards` | 2.5 | healthcare-exam-seo |
| 65 | Consolidate `/app/exams` vs `/app/practice-tests` naming; single canonical entry | 14.0 | dead-route-candidates.md |
| 66 | Implement programmatic URL sitemap coverage monitoring in GSC | 9.33 | sitemap-cleanup-report.md |
| 67 | Build paywall status page for entitlement system outages | 13.33 | paywall-risk-surfaces.md |
| 68 | Document mobile RN/PN journeys for Playwright e2e validation | 14.0 | rn-rpn-e2e-readiness |
| 69 | Build `/allied/occupational-therapy/questions` + `/allied/physiotherapy/questions` | 13.5 | healthcare-exam-seo |
| 70 | Build `/allied/psychotherapy/questions` + `/allied/psw-hca/questions` | 13.5 | healthcare-exam-seo |
| 71 | Build `/allied/social-work/questions` + remaining allied question pages | 13.5 | healthcare-exam-seo |
| 72 | Build `/allied/occupational-therapy/flashcards` + remaining flashcard pages | 2.5 | healthcare-exam-seo |
| 73 | Build `/allied/physiotherapy/flashcards` + `/allied/psychotherapy/flashcards` | 2.5 | healthcare-exam-seo |
| 74 | Build `/allied/psw-hca/flashcards` | 2.5 | healthcare-exam-seo |
| 75 | Build `/allied/social-work/cat` + `/allied/occupational-therapy/cat` | 3.875 | healthcare-exam-seo |
| 76 | Build `/allied/physiotherapy/cat` + `/allied/psychotherapy/cat` | 3.875 | healthcare-exam-seo |
| 77 | Build `/allied/psw-hca/cat` | 3.875 | healthcare-exam-seo |
| 78 | Verify `/app` routes don't appear in public sitemaps | 12.0 | robots-indexability-audit.md |
| 79 | Audit lesson metadata for missing `publicComplete: true` | 9.33 | canonical-risk-surfaces.md |
| 80 | Build monitoring dashboard for GSC "Crawled–Not Indexed" trends | 9.33 | crawled-not-indexed-remediation.md |
| 81 | Build admin scorecard for RN/RPN launch health | 5.0 | rn-rpn-e2e-readiness |
| 82 | Build `/allied/mlt/study-guide` (Phase 3) | 4.0 | healthcare-exam-seo |
| 83 | Build `/allied/social-work/study-guide` (Phase 3) | 4.0 | healthcare-exam-seo |
| 84 | Complete French locale translations for `/fr/` paths | 2.4 | localized-seo-audit.md |
| 85 | Add site-level authority link target inventory (NCSBN, nursing orgs) | 5.88 | healthcare-exam-seo-authority |
| 86 | Build `/allied/occupational-therapy/study-guide` + `/allied/physiotherapy/study-guide` | 4.0 | healthcare-exam-seo |
| 87 | Build `/allied/psychotherapy/study-guide` + `/allied/psw-hca/study-guide` | 4.0 | healthcare-exam-seo |
| 88 | Build clinical skills content for allied health specialties (0 → 50+ per tier) | 5.36 | content-completeness-audit |
| 89 | Add title/description fallback testing for metadata HTTP timeout scenarios | 10.0 | canonical-risk-surfaces.md |
| 90 | Implement lesson-level schema diff testing: `MedicalWebPage` path vs canonical | 3.75 | canonical-risk-surfaces.md |
| 91 | Add i18n fallback validation for breadcrumb labels in non-English locales | 3.75 | breadcrumb-gap-audit.md |
| 92 | Extend structured-data governance to enforce schema ownership on lesson hubs | 6.0 | breadcrumb-governance |
| 93 | Build release-gate checklist for SEO sign-off (sitemap, robots, canonicals, schema) | 6.67 | na-rn-launch-readiness.md |
| 94 | Expand RN question pool from 1,020 to 5,000 (20.4% → 100%) | 12.5 | content-completeness-audit |
| 95 | Expand RPN question pool from 730 to 5,000 (14.6% → 100%) | 12.5 | content-completeness-audit |
| 96 | Ensure all programmatic lesson links include country slug in href (no `/en/` redirects) | 21.0 | internal-linking-audit.md |
| 97 | Build `/allied/social-work/test-bank` + `/allied/occupational-therapy/test-bank` | 4.29 | healthcare-exam-seo |
| 98 | Build `/allied/physiotherapy/test-bank` + `/allied/psychotherapy/test-bank` | 4.29 | healthcare-exam-seo |
| 99 | Build `/allied/psw-hca/test-bank` (Phase 3) | 4.29 | healthcare-exam-seo |
| 100 | Build SEO release-gate CI check for all key SEO signals | 6.67 | na-rn-launch-readiness.md |

---

## Implementation Phases

### Phase 1 — Immediate (Days 1–7, zero content creation)
Fixes 1–8 + 12 + 13 + 22 + 26

Priority: Fix the 500 errors first (unlocks all SEO indexability), then submit sitemap, request indexing, strip canonical query params.

**Expected impact:** Unblocks all 12 DB-dependent routes. 2,000+ pages become crawlable/indexable.

### Phase 2 — Content + Schema (Weeks 2–4)
Fixes 9–11 + 14–21 + 23–25

Priority: Build test-bank pages, study guides, add schema, increase hub word counts, add blog cross-links.

**Expected impact:** 30–50% increase in organic impressions from schema rich snippets + new indexed pages.

### Phase 3 — Allied + Programmatic (Months 2–3)
Fixes 27–60

Priority: Allied health SEO ecosystem, programmatic topic depth, NP study guides.

**Expected impact:** Allied health organic traffic + NP specialist keyword ranking.

### Phase 4 — Scale + Monitor (Month 4+)
Fixes 61–100

Priority: Question pool expansion, monitoring dashboards, remaining allied pages.
