# NurseNest E-E-A-T Authority Masterplan

**Date:** 2026-05-31  
**Role lens:** Senior SEO Strategist, Healthcare Content Governance Lead, Nursing Education Director, Trust & Safety Auditor.  
**Scope:** RN, RPN/LPN, NP, New Graduate, Pre-Nursing; designed to extend to Allied Health and international nursing pathways.

## Executive Answer

If Google manually reviewed NurseNest tomorrow, the strongest evidence that NurseNest is a trustworthy nursing education platform would be:

- Public Editorial Policy and Content Review Policy pages.
- Blog pages with author/reviewer fields, visible dates, breadcrumbs, FAQ schema, `BlogPosting` schema, and E-E-A-T attribution.
- Healthcare authority pages with clinical review status, reviewer credentials, reviewed/updated/next-review dates, references, quality gate, related learning, and structured data.
- Internal E-E-A-T audit artifacts and `/admin/eeat-editorial` dashboard.
- Executable content-quality systems for question quality, rationale depth, distractors, clinical pearls, flashcard verification, evidence governance, reference validation, and freshness.
- ECG governance with review status, review dates, guideline versions, stale detection, and tests for advanced/pediatric ECG review coverage.

The weakest evidence would be:

- Lessons and many product preview pages do not yet show named author, named reviewer, references, and clinical review dates as consistently as healthcare authority pages.
- E-E-A-T audit artifacts show average score `65.8`, 433 pages below threshold, and 534 internal-link gaps.
- Lesson audit artifacts show 282 thin-content flags and 456 lessons missing at least one E-E-A-T section.
- Outcome/pass-rate/readiness methodology is not yet formalized.
- Reviewer identity is often team-based rather than named and credentialed.

## Source Documents Created

- `docs/trust-signal-audit.md`
- `docs/author-system-spec.md`
- `docs/clinical-review-system-spec.md`
- `docs/content-governance-framework.md`
- `docs/reference-management-spec.md`
- `docs/schema-expansion-roadmap.md`
- `docs/outcomes-reporting-framework.md`
- `docs/authority-benchmark-report.md`
- `docs/authority-roadmap-12-months.md`

## Platform Evidence Inventory

| Evidence | File/artifact | Finding |
| --- | --- | --- |
| Editorial policy | `nursenest-core/content/legal/editorial-policy.md` | Public policy exists, includes YMYL scope, editorial standards, AI-assisted content disclosure, independence, and corrections. |
| Content review policy | `nursenest-core/content/legal/content-review-policy.md` | Public review process exists, but reviewer use is phrased as "where available" and attribution "may appear." |
| About trust links | `nursenest-core/src/components/marketing/about-page-client.tsx` | About page links users to editorial policy, content review policy, and disclaimer. |
| Blog E-E-A-T | `nursenest-core/src/app/(marketing)/(default)/blog/[slug]/page.tsx` | Blog page emits `BlogPostingJsonLd`, last-reviewed dates when present, attribution block, FAQ schema, breadcrumbs, and related learning. |
| Attribution component | `nursenest-core/src/components/seo/eeat-content-attribution.tsx` | Supports named blog authors/reviewers; lessons currently get institutional disclosure and policy links. |
| Lesson E-E-A-T guard | `nursenest-core/src/lib/lessons/marketing-lesson-eeat-surface.policy.test.ts` | Ensures lesson editorial disclosure exists and stays below study chrome. |
| Healthcare authority template | `nursenest-core/src/app/(marketing)/(default)/healthcare/[category]/[slug]/page.tsx` | Best current public E-E-A-T pattern: review card, references, governance, related learning, premium funnel. |
| Authority engine | `nursenest-core/src/lib/authority/healthcare-authority-content-engine.ts` | Defines review status, reviewer, references, quality score, publication gates, schema, and clinical authority standard. |
| Schema primitives | `nursenest-core/src/components/seo/seo-json-ld.tsx` | Organization, WebSite, SearchAction, BlogPosting, MedicalWebPage/Article/LearningResource, Course, FAQ. |
| Breadcrumb schema | `nursenest-core/src/components/seo/breadcrumb-json-ld.tsx` | Filters invalid private/system URLs and emits `BreadcrumbList`. |
| E-E-A-T admin | `nursenest-core/src/app/(admin)/admin/eeat-editorial/page.tsx` | Admin-only operational dashboard reads static E-E-A-T audit outputs. |
| E-E-A-T audit | `../data/audit/eeat-final-status.json` | 601 pages scored; average E-E-A-T 65.8; 433 below 70; 534 internal-link gaps. |
| Content audit | `../data/audit/eeat-content-audit.json` | 562 catalog lessons; 282 thin flags; 456 lessons missing at least one E-E-A-T section. |
| Question quality | `nursenest-core/src/lib/questions/question-quality-score.ts` | Scores clinical accuracy, educational value, reasoning, distractors, rationales, hints, pearls, exam relevance. |
| Rationale quality | `nursenest-core/src/lib/questions/rationale-quality-score.ts` | Gates fail/review/publish/flagship with rationale depth and repetition detection. |
| Flashcard trust | `nursenest-core/src/lib/flashcards/flashcard-verification.ts` | Supports clinician-reviewed/source-verified statuses, sources, review metadata, and safety warnings. |
| Evidence governance | `nursenest-core/src/lib/evidence/evidence-governance.ts` | Blocks missing citations, low-confidence sources, stale sources, missing reviewer, unsupported high-risk domains. |
| Reference validation | `nursenest-core/src/lib/evidence/reference-validation-evidence-governance-engine.ts` | Audits missing/broken/outdated/low-quality references and high-risk review queues. |
| Freshness | `nursenest-core/src/lib/seo/content-freshness-evergreen-authority-engine.ts` | Defines review cycles, freshness badges, stale detection, decay signals, certification trackers. |

## Strategic Diagnosis

NurseNest has the bones of a credible healthcare education authority. The problem is not absence of governance; it is inconsistency of public evidence. The platform already contains internal audit dashboards, content-quality scoring, reference governance, and clinical review metadata. Search engines and users need to see that evidence consistently on the pages where trust decisions happen.

The healthcare authority page model should become the universal trust primitive.

## E-E-A-T Operating Model

### Experience

Show that content is designed for real nursing education and clinical learning:

- Case scenarios.
- Clinical reasoning.
- Common mistakes.
- Patient safety implications.
- Placement/new-graduate relevance.
- Exam strategy.

Current strength: question/rationale/pearl/distractor systems explicitly evaluate clinical realism and educational value.

### Expertise

Show who created and reviewed the content:

- Named authors.
- Credentials.
- Specialty areas.
- Reviewer profiles.
- Contribution history.

Current gap: author/reviewer infrastructure exists partially in blog and authority pages, but not universally.

### Authoritativeness

Show that NurseNest has organized subject authority:

- Internal linking.
- Topic clusters.
- Schema.
- Breadcrumb hierarchy.
- Reference lists.
- Review cycles.

Current gap: audit artifacts show 534 internal-link gaps and many lesson E-E-A-T section gaps.

### Trustworthiness

Show process, transparency, and limitations:

- Editorial policy.
- Content review policy.
- Disclaimer.
- Reference standard.
- Outcome methodology.
- Correction process.
- User feedback/report issue.

Current gap: policy pages exist, but outcome methodology and universal public trust display are incomplete.

## Priority Implementation Sequence

### Phase 1: Make Existing Governance Visible

1. Promote the healthcare authority review card into a shared trust panel.
2. Add it to public lessons, product preview pages, and high-risk clinical surfaces.
3. Link to editorial policy, content review policy, references, and report-an-issue.
4. Display review dates and reviewer credentials where available.

### Phase 2: Build Human Authority Infrastructure

1. Create author profiles.
2. Create reviewer profiles.
3. Map authors/reviewers to content.
4. Emit `Person`/`ProfilePage` schema.
5. Replace team-only review labels with named reviewers where clinical review is claimed.

### Phase 3: Normalize References

1. Create shared reference registry.
2. Backfill pharmacology, labs, ECG, clinical skills, care plans, and top lessons.
3. Add APA renderer.
4. Enforce evidence gates for high-risk content.

### Phase 4: Govern Outcomes

1. Publish outcomes methodology.
2. Create consented success story collection.
3. Separate anecdotal, self-reported, verified, and platform-observed outcomes.
4. Prohibit unsupported pass-rate and guarantee claims.

### Phase 5: Raise E-E-A-T Scores

1. Remediate 433 pages below 70.
2. Fix 534 internal-link gaps.
3. Prioritize 282 thin lesson flags.
4. Raise YMYL authority publication threshold to 90.

## 20 Highest-Impact Authority Initiatives

1. Shared public `EducationalTrustPanel`.
2. Author profile system.
3. Clinical reviewer profile system.
4. Clinical review workflow and audit logs.
5. Reference registry and APA renderer.
6. Public outcome methodology page.
7. High-risk content source gates.
8. Lesson trust metadata backfill.
9. Internal-link gap remediation.
10. Thin lesson remediation.
11. Pharmacology reference and review coverage.
12. Labs reference and review coverage.
13. ECG reviewer/guideline visibility.
14. Clinical skills review/reference coverage.
15. CAT/readiness methodology disclosure.
16. Question/rationale quality public methodology.
17. Schema parity audit for visible content.
18. Reviewer overdue/stale content dashboard.
19. Verified success story governance.
20. Annual public content transparency report.

## Success Definition

NurseNest reaches strong healthcare E-E-A-T when a skeptical reviewer can answer:

- Who wrote this?
- Who reviewed it?
- What qualifies them?
- When was it reviewed?
- What sources support it?
- What changed recently?
- What does NurseNest claim, and what does it not claim?
- How does this page connect to the broader learning ecosystem?
- How does NurseNest correct errors?
- How are outcomes measured without exaggeration?

The platform is close because the internal systems exist. The next step is discipline: make those systems canonical, visible, and mandatory across every public healthcare education surface.
