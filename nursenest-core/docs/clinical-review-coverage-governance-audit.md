# NurseNest Clinical Review Coverage & Governance Audit

Date: 2026-06-01  
Status: Repository-evidenced governance audit  
Scope: Clinical review coverage, reviewer evidence, freshness, governance compliance, institutional readiness  
Not in scope: Content quality, SEO performance, content authority, future product planning

## Audit Standard

This audit answers one question: how much of NurseNest is actually clinically reviewed according to repository evidence?

Credit is awarded only when an asset has clinical review evidence that includes, at minimum:

1. A reviewer identity that is not merely a team/institutional label.
2. A review date.
3. Review status or review event evidence tied to that asset.

This audit does not award credit for:

- Future plans.
- Roadmap documents.
- Hidden/admin-only product plans.
- Team labels alone, such as "Clinical review board (educational)".
- Institutional labels alone, such as "NurseNest Clinical Review".
- Undocumented reviews.
- Generic claims that content is reviewed.
- Schema fields that exist but are not populated with asset-level review evidence.

Primary evidence sources inspected:

- `src/content/blog-static-longtail/*.md`
- `src/content/pathway-lessons/generated-indexes/*.json`
- `src/content/questions/*`
- `src/content/clinical-case-studies.json`
- `src/content/cases/cnple-sample-cases.ts`
- `src/content/flashcard-samples.json`
- `src/lib/ecg-module/*`
- `prisma/schema.prisma`
- `docs/clinical-review-system-spec.md`
- `docs/content-governance-framework.md`
- `docs/question-quality-dashboard.md`

## 1. Executive Summary

Under a strict regulator/faculty/institutional review standard, repository-evidenced clinical review coverage is currently **0.00%** across the measurable audited content inventory.

That does not mean no human has ever reviewed NurseNest content. It means the repository does not provide enough asset-level evidence to prove clinical review at the standard requested here. Most visible review signals are team labels without named reviewer credentials or review dates.

### Direct Answer

If asked, "How much of NurseNest has actually been clinically reviewed?", the defensible answer is:

> NurseNest has review-governance infrastructure and partial metadata fields, but the repository does not currently evidence named, dated clinical review coverage for the measurable content inventory. Under the requested standard, clinically reviewed coverage is 0.00% until named reviewer records, review dates, credentials, and asset-level review events are backfilled and enforced.

### Key Findings

| Finding | Evidence | Governance impact |
| --- | ---: | --- |
| Blog files inspected | 4,595 | Large public content footprint requires review evidence. |
| Blog reviewer strings present | 4,595 | Presence is not enough because labels are institutional/team-based. |
| Blog named reviewer creditable under this audit | 0 | 0% clinical review credit for blogs. |
| Blog review dates present | 0 | Freshness cannot be proven. |
| Generated lesson summaries inspected | 3,162 | No reviewer/date/status review evidence found. |
| Static question source objects/calls counted | 163 | No reviewer/date/status review evidence found. |
| Flashcard sample cards counted | 7 | No reviewer/date/status review evidence found. |
| Clinical-case JSON items counted | 2 | No reviewer/date/status review evidence found. |
| CNPLE sample cases counted | 15 | Team review labels exist, but no named reviewer credit. |
| ECG source review metadata | Field occurrences exist | Asset-level coverage cannot be calculated from static source scan alone. |

## 2. Review Coverage Report

### Measurable Repository Inventory

| Asset class | Count source | Total assets counted | Credited clinically reviewed | Review coverage |
| --- | --- | ---: | ---: | ---: |
| Blog articles | `src/content/blog-static-longtail/*.md` | 4,595 | 0 | 0.00% |
| Generated lesson summaries | `src/content/pathway-lessons/generated-indexes/*.json` | 3,162 | 0 | 0.00% |
| Static question source items | `src/content/questions/*` | 163 | 0 | 0.00% |
| Flashcard sample cards | `src/content/flashcard-samples.json` and flashcard source scan | 7 | 0 | 0.00% |
| Clinical case studies JSON | `src/content/clinical-case-studies.json` | 2 | 0 | 0.00% |
| CNPLE sample cases | `src/content/cases/cnple-sample-cases.ts` | 15 | 0 | 0.00% |
| **Total measurable inventory** | Above sources | **7,944** | **0** | **0.00%** |

Formula: `credited clinically reviewed / total measurable inventory`.

### Content Status Coverage

The repository does not expose universal published/draft/archived status fields across the audited static inventory. Status evidence is fragmented:

| Asset class | Published evidence | Draft/internal evidence | Archived evidence | Status conclusion |
| --- | ---: | ---: | ---: | --- |
| Blog markdown | Static file presence; frontmatter reviewer labels | No universal draft status in markdown scan | Not evidenced | Published status not universally derivable from markdown alone. |
| Generated lessons | Effective generated summaries | No review status fields | Not evidenced | Inventory only; not review-governed. |
| Static questions | Source objects and static catalogs | No review status fields | Not evidenced | Inventory only; not review-governed. |
| CNPLE sample cases | 1 `reviewStatus: "published"` | 14 `reviewStatus: "internal_review"` | Not evidenced | Review status exists, but reviewer is team label. |
| ECG | Schema/source review fields exist | `publishSafetyStatus` and QA fields exist in implementation | Not enough static asset linkage | Needs runtime/data audit. |

### Review Metadata Coverage

| Asset class | Reviewer present | Named reviewer credited | Review date present | Missing reviewer/date risk |
| --- | ---: | ---: | ---: | --- |
| Blog articles | 4,595 | 0 | 0 | Critical |
| Generated lesson summaries | 0 | 0 | 0 | Critical |
| Static questions | 0 | 0 | 0 | Critical |
| Flashcard samples | 0 | 0 | 0 | Critical |
| Clinical-case JSON | 0 | 0 | 0 | Critical |
| CNPLE sample cases | 2 team labels | 0 | 1 | High |

## 3. Coverage By Pathway

The pathway-level lesson/question inventory below uses committed repository counts from `src/config/pathway-readiness-snapshot.json` and generated-index counts from `docs/content-instrumentation-report.md`. No pathway has named, dated clinical review evidence in the inspected static content sources.

| Area | Evidence denominator | Credited reviewed | Reviewed % | Unreviewed / unknown % | Stale % | Missing reviewer | Missing date | Risk |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| RN | 610 launch-gate CA/US RN lessons+questions; 1,593 generated RN lessons | 0 | 0.00% | 100.00% | Not calculable | 100.00% | 100.00% | Critical |
| RPN | 530 REx-PN launch-gate lessons+questions; 410 generated REx-PN lessons | 0 | 0.00% | 100.00% | Not calculable | 100.00% | 100.00% | Critical |
| NCLEX-RN | 680 US launch-gate lessons+questions; 796 generated lessons | 0 | 0.00% | 100.00% | Not calculable | 100.00% | 100.00% | Critical |
| NCLEX-PN | 555 launch-gate lessons+questions; 86 generated lessons | 0 | 0.00% | 100.00% | Not calculable | 100.00% | 100.00% | Critical |
| CNPLE | 1,932 launch-gate lessons+questions; 436 generated lessons; 15 sample cases | 0 | 0.00% | 100.00% | Not calculable | 100.00% | 100.00% except one team-dated case | Critical |
| FNP | 371 launch-gate lessons+questions; 496 generated lessons | 0 | 0.00% | 100.00% | Not calculable | 100.00% | 100.00% | Critical |
| AGPCNP | 370 launch-gate lessons+questions | 0 | 0.00% | 100.00% | Not calculable | 100.00% | 100.00% | Critical |
| PMHNP | 355 launch-gate lessons+questions | 0 | 0.00% | 100.00% | Not calculable | 100.00% | 100.00% | Critical |
| WHNP | 340 launch-gate lessons+questions | 0 | 0.00% | 100.00% | Not calculable | 100.00% | 100.00% | Critical |
| PNP-PC | 325 launch-gate lessons+questions | 0 | 0.00% | 100.00% | Not calculable | 100.00% | 100.00% | Critical |
| Allied Health | 435 CA/US launch-gate lessons+questions; 102 generated lessons | 0 | 0.00% | 100.00% | Not calculable | 100.00% | 100.00% | Critical |

Stale percentage is not calculated because review due dates are absent from the audited static content. Missing next-review date is effectively universal in the audited static inventory.

## 4. High-Risk Content Report

High-risk content was identified by filename/title keyword matches across `src/content/blog-static-longtail/*.md`. These are exact repository keyword-bucket counts, not clinical completeness judgments. Overlap exists between categories; a file can appear in multiple risk buckets.

| High-risk category | Blog files matched | Named reviewed | Team label only | Review date present | References present in frontmatter | Risk |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Medication Safety / Pharmacology | 408 | 0 | 408 | 0 | 0 | Critical |
| Labs | 459 | 0 | 459 | 0 | 0 | Critical |
| ECG | 385 | 0 | 385 | 0 | 0 | Critical |
| Critical Care | 280 | 0 | 280 | 0 | 0 | Critical |
| Pediatrics | 135 | 0 | 135 | 0 | 0 | Critical |
| Emergency Nursing | 756 | 0 | 756 | 0 | 0 | Critical |
| Mental Health | 294 | 0 | 294 | 0 | 0 | Critical |
| Scope of Practice | 2,486 | 0 | 2,486 | 0 | 0 | Critical |
| Clinical Skills | 616 | 0 | 616 | 0 | 0 | Critical |
| Disease Management | 563 | 0 | 563 | 0 | 0 | Critical |

### Publication Compliance

Under `docs/clinical-review-system-spec.md`, high-risk and critical content requires named reviewer evidence, review date, and evidence-source validation. The audited high-risk blog buckets do not meet that standard because:

- Reviewer labels are team/institutional labels.
- Review dates are absent.
- Frontmatter references are absent.
- Next-review dates are absent.

Recommended compliance status for high-risk pages until backfilled:

- Do not use "clinically reviewed" language publicly unless a named reviewer/date/scope exists.
- Add `noindex` or suppress high-risk pages that make clinical claims without review evidence.
- Prioritize pharmacology, labs, ECG, pediatrics, emergency, mental health, and scope-of-practice review queues.

## 5. Reviewer Capacity Report

### Reviewer Inventory

| Reviewer category | Count evidenced | Notes |
| --- | ---: | --- |
| Named individual reviewers | 0 | No named, credential-verifiable individual reviewer was found in the audited static inventory. |
| Team reviewers | 4,583 blog files | Mostly "Clinical review board (educational)" style labels. No credit under audit rules. |
| Institutional reviewer labels | 12 blog files | "NurseNest Clinical Review" appears, but is not a named reviewer. |
| Case team reviewer labels | 2 occurrences | `NurseNest Clinical Team` appears in CNPLE sample cases. No credit under audit rules. |
| Credential verification records | 0 | No contributor credential registry exists in Prisma. |
| Specialty verification records | 0 | No reviewer specialty verification model exists. |

### Reviewer Shortages

| Specialty area | Shortage level | Reason |
| --- | --- | --- |
| Pharmacology / medication safety | Critical | 408 high-risk blog matches and no credited named review. |
| Labs / critical values | Critical | 459 high-risk blog matches and no credited named review. |
| ECG / telemetry | Critical | 385 high-risk blog matches and no credited named review. |
| Emergency / deterioration | Critical | 756 high-risk blog matches and no credited named review. |
| Pediatrics | Critical | 135 high-risk blog matches and no credited named review. |
| Mental health / suicide safety | Critical | 294 high-risk blog matches and no credited named review. |
| Scope of practice / delegation | Critical | 2,486 high-risk blog matches and no credited named review. |
| NP diagnostic/prescribing content | Critical | CNPLE and NP content exists, but no named reviewer registry. |

## 6. Freshness Report

Freshness coverage is not currently defensible for the static content inventory.

| Freshness field | Blog files | Generated lessons | Static questions | Flashcards | Cases |
| --- | ---: | ---: | ---: | ---: | ---: |
| Review date present | 0 / 4,595 | 0 / 3,162 | 0 / 163 | 0 / 7 | 1 team-dated CNPLE case / 17 case files/items counted |
| Next review date present | 0 / 4,595 | 0 / 3,162 | 0 / 163 | 0 / 7 | 0 |
| Overdue review calculable | No | No | No | No | No |
| Approaching review date calculable | No | No | No | No | No |

Freshness Coverage Score: **0.00%** for the measurable audited inventory.

Formula: assets with review date and next-review/review-due date / measurable inventory. Result: `0 / 7,944 = 0.00%`.

## 7. Governance Compliance Report

### Existing Governance Infrastructure

| System | Evidence | Compliance value |
| --- | --- | --- |
| Blog model | `BlogPost` includes author/reviewer strings, review dates, due dates, references, and risk flags in Prisma | Good foundation, but static inventory is not populated with dates/references. |
| Draft review models | Generated question/flashcard/lesson drafts include `reviewStatus`, `reviewedById`, `reviewedAt` | Good internal workflow foundation. |
| ECG QA fields | ECG question schema includes clinician/manual review and publish safety fields | Good system-specific foundation. |
| Publish gates | `governExamQuestionPublish` and `governContentItemLessonPublish` exist | Quality gates exist, but universal clinical review gates are not evidenced. |
| E-E-A-T admin infrastructure | `src/lib/admin/eeat-*` and `src/lib/eeat/eeat-scoring.ts` exist | Useful dashboard/scoring foundation. |
| Clinical review spec | `docs/clinical-review-system-spec.md` | Defines target state but does not prove coverage. |

### Missing or Incomplete Gates

| Gate | Current evidence | Compliance verdict |
| --- | --- | --- |
| Named clinical reviewer required for high-risk content | Not universally enforced in audited static content | Missing |
| Review date required | Not present in blog/lesson/question static inventory | Missing |
| Next review date required | Not present in static inventory | Missing |
| Credential verification required | No contributor/reviewer credential registry | Missing |
| Specialty scope verification | No normalized model | Missing |
| References required for high-risk content | Blog model supports it, frontmatter scan found 0 references fields | Not enforced in static content |
| Public trust panel | Existing attribution fragments, no universal trust panel | Partial |
| Review expiry handling | Model fields exist for blog, not populated in static inventory | Partial |
| Correction/report issue workflow | Not proven in this audit | Missing/unknown |

### YMYL Governance Violations

The following are governance violations under the requested standard:

1. High-risk blog pages with clinical topics but no named reviewer.
2. Clinical pages with no review date.
3. Clinical pages with no next review date.
4. High-risk clinical topics with no visible references in frontmatter.
5. Team-label reviewer fields treated as if they were clinical review proof.
6. Lessons and questions lacking asset-level clinical reviewer/date evidence.

## 8. Institutional Readiness Report

The percentages below are evidence-gate percentages, not market estimates. Each readiness area has five required evidence gates. Score = passed gates / five.

| Institutional use case | Required evidence gates | Gates passed | Readiness |
| --- | --- | ---: | ---: |
| Hospital partnerships | Named reviewers, credential verification, high-risk review coverage, review freshness, correction workflow | 0 / 5 | 0% |
| Nursing school partnerships | Named reviewers, curriculum review, lesson review coverage, question review coverage, freshness | 0 / 5 | 0% |
| Faculty adoption | Contributor profiles, reviewer identity, references, review dates, issue reporting | 0 / 5 | 0% |
| Institutional licensing | Audit logs, reviewer verification, content status coverage, stale-content controls, evidence packages | 0 / 5 | 0% |
| Enterprise sales | Clinical governance proof, named reviewers, methodology review, freshness dashboard, risk queue | 0 / 5 | 0% |

NurseNest has product and governance foundations, but under this audit it is not institutionally ready to prove clinical review coverage to a hospital, nursing faculty committee, accreditation reviewer, or enterprise procurement team.

## 9. Coverage Dashboard

| Area | Coverage | Stale | Missing Reviewer | Risk |
| --- | ---: | ---: | ---: | --- |
| RN | 0.00% | Not calculable | 100.00% | Critical |
| RPN | 0.00% | Not calculable | 100.00% | Critical |
| NCLEX-RN | 0.00% | Not calculable | 100.00% | Critical |
| NCLEX-PN | 0.00% | Not calculable | 100.00% | Critical |
| CNPLE | 0.00% | Not calculable | 100.00% | Critical |
| FNP | 0.00% | Not calculable | 100.00% | Critical |
| AGPCNP | 0.00% | Not calculable | 100.00% | Critical |
| PMHNP | 0.00% | Not calculable | 100.00% | Critical |
| WHNP | 0.00% | Not calculable | 100.00% | Critical |
| PNP-PC | 0.00% | Not calculable | 100.00% | Critical |
| Allied Health | 0.00% | Not calculable | 100.00% | Critical |

## 10. Top 50 Highest-Risk Gaps

| Rank | Gap | Safety impact | Trust impact | Institutional impact | Effort |
| ---: | --- | --- | --- | --- | --- |
| 1 | No named reviewer registry | Critical | Critical | Critical | High |
| 2 | No credential verification model | Critical | Critical | Critical | High |
| 3 | No specialty scope verification | Critical | Critical | Critical | High |
| 4 | Blog reviewer labels are team labels | High | Critical | Critical | Medium |
| 5 | 4,595 blog files missing review dates | High | Critical | High | Medium |
| 6 | 4,595 blog files missing next-review dates | High | Critical | High | Medium |
| 7 | High-risk pharmacology pages lack credited review | Critical | Critical | Critical | High |
| 8 | High-risk lab pages lack credited review | Critical | Critical | Critical | High |
| 9 | High-risk ECG pages lack credited review | Critical | Critical | Critical | High |
| 10 | Emergency/deterioration pages lack credited review | Critical | Critical | Critical | High |
| 11 | Pediatric pages lack credited review | Critical | Critical | Critical | High |
| 12 | Mental health pages lack credited review | Critical | Critical | Critical | High |
| 13 | Scope-of-practice pages lack credited review | Critical | Critical | Critical | High |
| 14 | Clinical skills pages lack credited review | Critical | Critical | Critical | High |
| 15 | Disease management pages lack credited review | Critical | Critical | Critical | High |
| 16 | Generated lesson summaries lack review metadata | High | High | High | Medium |
| 17 | Static questions lack review metadata | High | High | High | Medium |
| 18 | Flashcard samples lack review metadata | Moderate | High | Medium | Low |
| 19 | CNPLE sample cases use team reviewer labels | High | High | High | Low |
| 20 | Clinical-case JSON lacks review metadata | High | High | High | Low |
| 21 | No universal review event model | Critical | Critical | Critical | High |
| 22 | No universal EducationalTrustPanel | High | High | High | Medium |
| 23 | No public reviewer pages | Medium | High | Medium | Medium |
| 24 | No advisory/review board composition page | Medium | High | Medium | Medium |
| 25 | No stale-content dashboard from asset review dates | High | High | High | Medium |
| 26 | No public correction workflow proven | High | High | High | Medium |
| 27 | No high-risk noindex/suppression rule proven | High | High | High | Medium |
| 28 | No reference coverage in static blog frontmatter | High | High | High | Medium |
| 29 | No review coverage by pathway dashboard | Medium | High | High | Medium |
| 30 | No reviewer capacity plan by specialty | High | High | Critical | Medium |
| 31 | No reviewer expiration/credential renewal tracking | High | High | High | Medium |
| 32 | No clinical review audit log | High | High | Critical | High |
| 33 | No methodology reviewer evidence for CAT | High | High | High | Medium |
| 34 | No methodology reviewer evidence for readiness scores | High | High | High | Medium |
| 35 | No psychometric reviewer evidence for question banks | Medium | High | High | Medium |
| 36 | No NP prescribing reviewer proof | Critical | Critical | Critical | High |
| 37 | No medication safety reviewer proof | Critical | Critical | Critical | High |
| 38 | No ECG waveform/interpretation reviewer proof by asset | Critical | Critical | High | Medium |
| 39 | No lab critical-value reviewer proof by asset | Critical | Critical | High | Medium |
| 40 | No clinical skill procedure safety reviewer proof | Critical | Critical | High | Medium |
| 41 | No maternity/pregnancy reviewer proof | Critical | Critical | High | Medium |
| 42 | No pediatric emergency reviewer proof | Critical | Critical | High | Medium |
| 43 | No mental health safety reviewer proof | Critical | Critical | High | Medium |
| 44 | No regulatory/scope reviewer proof | High | Critical | High | Medium |
| 45 | No country-specific reviewer scope evidence | High | High | High | High |
| 46 | No language/localization reviewer evidence | Medium | High | Medium | Medium |
| 47 | No review-source evidence snapshots | High | High | High | Medium |
| 48 | No verified author-reviewer relationship map | Medium | High | Medium | Medium |
| 49 | No route-level trust compliance report | Medium | High | High | Medium |
| 50 | No publish-blocking status for unreviewed high-risk static assets | Critical | Critical | Critical | High |

## 11. Roadmap To 95%+ Clinical Review Coverage

### 30-Day Plan

| Action | Safety impact | Trust impact | SEO impact | Institutional impact | Effort |
| --- | --- | --- | --- | --- | --- |
| Freeze "clinically reviewed" public claims unless named reviewer/date exists | High | Critical | Medium | Critical | Low |
| Create contributor/reviewer registry spec-to-schema task | High | Critical | Low | Critical | Medium |
| Backfill actual named reviewers only where evidence exists | High | Critical | Medium | High | Medium |
| Add review date and next-review date fields to static content import model | High | High | Medium | High | Medium |
| Build high-risk URL/content queue from pharmacology, labs, ECG, emergency, peds, mental health | Critical | High | Medium | Critical | Medium |
| Define noindex/suppression rule for unreviewed high-risk pages | High | High | High | High | Medium |
| Create reviewer capacity matrix by specialty | High | High | Low | Critical | Low |

30-day target: prove review coverage honestly, even if the score remains low.

### 90-Day Plan

| Action | Safety impact | Trust impact | SEO impact | Institutional impact | Effort |
| --- | --- | --- | --- | --- | --- |
| Implement review event model for blogs, lessons, questions, cases, ECG, labs, pharmacology, skills | Critical | Critical | Medium | Critical | High |
| Clinically review top 500 highest-risk/high-traffic assets | Critical | Critical | High | High | High |
| Add EducationalTrustPanel to public health education surfaces | High | Critical | High | High | Medium |
| Add references/evidence snapshots for high-risk pages | Critical | High | High | High | High |
| Create freshness dashboard and stale-content queue | High | High | Medium | High | Medium |
| Publish reviewer/advisory board pages only for verified contributors | Medium | High | High | High | Medium |

90-day target: reach verifiable review coverage for the highest-risk/highest-traffic content and prove the review system works.

### 180-Day Plan

| Action | Safety impact | Trust impact | SEO impact | Institutional impact | Effort |
| --- | --- | --- | --- | --- | --- |
| Review all pharmacology, lab, ECG, emergency, pediatrics, mental health, and scope content | Critical | Critical | High | Critical | Very high |
| Backfill lessons and questions with named review events | Critical | High | Medium | Critical | Very high |
| Add methodology review for CAT and readiness models | High | High | Medium | High | Medium |
| Implement publish gates that block high-risk assets without verified review | Critical | Critical | Medium | Critical | High |
| Create institutional clinical review export/report | Medium | High | Low | Critical | Medium |

180-day target: high-risk content should be >95% reviewed, with lower-risk content following behind.

### 12-Month Plan

| Action | Safety impact | Trust impact | SEO impact | Institutional impact | Effort |
| --- | --- | --- | --- | --- | --- |
| Achieve 95%+ named, dated review coverage across all learner-accessible clinical content | Critical | Critical | High | Critical | Very high |
| Maintain review freshness with automated expiry queues | High | High | Medium | High | Medium |
| Add specialty reviewer redundancy for each high-risk domain | Critical | High | Low | Critical | High |
| Add public correction transparency where clinically appropriate | High | High | Medium | High | Medium |
| Add quarterly governance reports for institutional customers | Medium | High | Low | Critical | Medium |

12-month target: NurseNest can answer reviewer, date, evidence, freshness, correction, and maintenance questions at content-item level.

## Final Determination

NurseNest has meaningful governance foundations, but it cannot currently prove clinical review coverage at an institutional or regulatory standard from repository evidence. The most important next move is not more content; it is review evidence normalization:

1. Named contributors.
2. Verified credentials.
3. Asset-level review events.
4. Review dates and expiry dates.
5. Evidence snapshots.
6. Public trust surfaces.
7. Publish gates that block unreviewed high-risk content.

Until that exists, the safest defensible clinical review coverage answer is **0.00% clinically reviewed under the requested evidence standard**.

