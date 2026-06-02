# NurseNest Trust Signal Audit

**Date:** 2026-05-31  
**Scope:** Public-facing trust evidence across marketing pages, public educational pages, and premium-product preview surfaces.  
**Method:** Static code inspection of the current repository, existing generated audit artifacts, and prior SEO audit documents. This is not a browser crawl.

## Evidence Summary

| Surface | Evidence found | Trust gaps | Severity |
| --- | --- | --- | --- |
| Homepage | Marketing layout emits `OrganizationJsonLd` and `WebSiteJsonLd` from `nursenest-core/src/components/seo/seo-json-ld.tsx`; public footer links to editorial, review, disclaimer, privacy, and terms pages. Prior audit `docs/seo-audit-2026/homepage-authority-audit.md` already identifies homepage E-E-A-T gaps. | Homepage still needs visible clinical review/author trust proof, named educator/reviewer signals, and outcome methodology before using success claims. | Critical |
| Pricing | `/pricing` uses canonical metadata, `WebPageJsonLd`, breadcrumbs, Suspense streaming, and plan rendering from `nursenest-core/src/app/(marketing)/(default)/pricing/page.tsx`. | Pricing does not visibly connect paid value to clinical governance, content review standards, reference standards, or ethical outcome reporting. | High |
| About | `/about` links to Editorial policy, Content review policy, and Educational disclaimer in `AboutPageClient` (`EditorialTrustSection`). | About page has process-level trust, but not a named clinical leadership roster, reviewer profiles, advisory board, or reviewer contribution list. | High |
| Blog | Blog detail pages render `BlogPostingJsonLd`, optional FAQ schema, visible publication and last-reviewed dates, E-E-A-T attribution, breadcrumbs, related reading, and internal lesson links in `nursenest-core/src/app/(marketing)/(default)/blog/[slug]/page.tsx`. | Named authors/reviewers depend on populated CMS fields; current audit says blog named-author gaps are zero, but reviewer completeness and credentials are not yet enforced as a universal publication gate. | Medium |
| Lessons | Marketing lesson detail pages mount `EeatContentAttribution variant="lesson"` below study cross-links and render lesson metadata/quality notices. Guard test: `nursenest-core/src/lib/lessons/marketing-lesson-eeat-surface.policy.test.ts`. | Lesson E-E-A-T block is institutional, not per-author/per-reviewer. Generated audit reports `authorPresent:false` for lessons and 534 internal-link gaps. | Critical |
| Question banks | Question quality score engines exist: `question-quality-score.ts`, `rationale-quality-score.ts`, distractor/pearl standards, and content-quality dashboards under `nursenest-core/docs/content-quality/`. | Public question-bank previews do not expose reviewer methodology, rationale contract, source standard, or quality scoring in a user-facing trust block. | High |
| Flashcards | `flashcard-verification.ts` supports verification states, reviewer metadata, source references, unsafe absolute-claim warnings, and dosage-without-source blockers. | Public flashcard pages need the same visible verification labels and source/reviewer metadata that the internal model already supports. | High |
| Practice exams and CAT | Premium learner routes and marketing pages exist for CAT/practice exams. Schema supports `Course`/`EducationalOccupationalProgram` in `seo-json-ld.tsx`. | Readiness/prediction claims need methodology disclosure, limitations, validation status, and no unsupported pass-rate framing. | Critical |
| Study plans/readiness | Learner study plan and readiness/report-card systems exist across `/app` routes. | Public trust language should explain adaptive recommendations as educational guidance, not clinical or exam-outcome guarantees. | High |
| ECG | ECG curriculum config includes clinical review statuses, `reviewedAt`, `reviewedBy`, stale checks, and CI-style governance (`ecg-curriculum-config.ts`, pediatric ECG governance tests). | Reviewer values are team labels, not named credentialed reviewer profiles. Public ECG pages should expose review date, guideline version, and deterministic waveform disclosure consistently. | High |
| Clinical skills | Learner and marketing route inventory shows clinical-skills surfaces. | No universal public attribution/reference standard was found for clinical skill pages comparable to the healthcare authority library. | High |
| Labs | Lab learner and marketing routes exist, plus authority-library lab support. | Lab interpretation needs visible reference ranges/source policy, jurisdiction/lab-variation disclaimer, review date, and source list. | High |
| Pharmacology | Pharmacology learner route exists; evidence governance and question quality systems flag medication-safety risk. | Medication/pharmacology pages need high-confidence drug references, review cadence, and explicit non-prescribing disclaimer. | Critical |
| Healthcare authority pages | `/healthcare/[category]/[slug]` displays clinical review status, reviewer, credentials, specialty, reviewed/updated/next-review dates, quality gate, references, related learning, and premium funnel cards. | This is the strongest public model, but it is currently a separate authority-library implementation rather than the universal E-E-A-T primitive for lessons, questions, flashcards, CAT, labs, ECG, pharmacology, and clinical skills. | Medium |

## Existing Trust Assets

- Public trust policies exist and are indexable:
  - `nursenest-core/content/legal/editorial-policy.md`
  - `nursenest-core/content/legal/content-review-policy.md`
  - `nursenest-core/src/app/(marketing)/(default)/editorial-policy/page.tsx`
  - `nursenest-core/src/app/(marketing)/(default)/content-review-policy/page.tsx`
- Public policy links are surfaced in About, footer, blog/lesson attribution, and lesson next steps.
- The healthcare authority page template already has the right trust anatomy: clinical review card, reviewer credentials, governance dates, quality gate, references, related learning, and schema.
- Blog pages already support author/reviewer fields, `BlogPosting` schema, FAQ schema, breadcrumbs, last-reviewed date, and sanitized/auto-linked article bodies.
- Internal governance is strong: `/admin/eeat-editorial` reads static audit outputs, filters missing attribution/internal links/thin pages/stale content, and exports CSV.
- The generated E-E-A-T audit (`../data/audit/eeat-page-scores.json`) scored 601 pages, average score `65.8`, with 433 pages below the 70 threshold and 534 internal-link gaps.
- `../data/audit/eeat-content-audit.json` reports 562 catalog lessons, 282 thin-content flags, and 456 lessons missing at least one E-E-A-T section.
- Question-level quality standards are executable, not merely documented.
- Evidence governance engines exist for high-risk clinical claims, references, stale sources, missing reviewers, and unsupported answer/rationale claims.

## Critical Gaps

1. **Public trust evidence is uneven.** Healthcare authority pages show a mature trust pattern; lessons and many product surfaces still use institutional disclosure instead of named authors/reviewers and reference lists.
2. **Lessons are the largest E-E-A-T risk.** The audit artifact shows `authorPresent:false` on pathway lessons and widespread internal-link gaps.
3. **Outcome claims need a formal standard.** Existing pages should not use pass-rate, prediction, or readiness claims without methodology, denominator, sample size, date range, and limitations.
4. **Reviewer identity is often team-based.** ECG and authority systems include review metadata, but team labels such as "Clinical Content Team" are weaker than named, credentialed reviewer profiles.
5. **Reference support is not universal.** Authority pages and some blog/content systems support references, but lessons, flashcards, questions, CAT, and clinical tools need a shared reference model.
6. **Internal governance is ahead of public transparency.** NurseNest has real audit and quality infrastructure, but users and search engines see only part of it.

## Highest-Priority Fixes

| Priority | Fix | Evidence basis | Effort |
| --- | --- | --- | ---: |
| 1 | Promote the healthcare authority review card into a shared `EducationalTrustPanel` for lessons, blogs, questions, flashcards, ECG, labs, pharmacology, clinical skills, CAT, and study plans. | Strong implementation in `/healthcare/[category]/[slug]`; weaker institutional-only lesson attribution. | 2-4 days |
| 2 | Add named author and named clinical reviewer profiles before claiming clinical review on public YMYL pages. | Current review policy says reviewers are used "where available"; team labels appear in ECG configs. | 3-5 days |
| 3 | Backfill lesson trust metadata and internal links for the 433 below-threshold pages and 534 internal-link gaps in audit artifacts. | `eeat-page-scores.json`; `eeat-final-status.json`. | 2-4 weeks |
| 4 | Publish outcome methodology before using pass-rate or readiness-performance claims. | Competitors make strong claims; NurseNest should avoid unsupported claims. | 2-3 days |
| 5 | Add public reference lists and source/currency labels to pharmacology, labs, ECG, and clinical skills. | Existing evidence engines support this but public display is uneven. | 1-2 weeks |
| 6 | Raise the E-E-A-T internal threshold from 70 to clinical publication target 90 for YMYL authority pages. | Existing `clinical-authority-content-standard.md` sets 90; E-E-A-T admin threshold is 70. | 1 day |

## Manual Reviewer Readiness Answer

If Google manually reviewed NurseNest tomorrow, the strongest trust evidence would be:

- Published editorial and content-review policies.
- Public blog byline/reviewer support and structured `BlogPosting` schema.
- Healthcare authority pages with clinical review status, reviewer credentials, governance dates, references, and schema.
- Internal E-E-A-T dashboard and generated audit artifacts.
- Executable content-quality engines for rationales, distractors, clinical pearls, flashcards, evidence, freshness, and questions.

The weakest evidence would be:

- Public lessons and product previews that do not yet show named author/reviewer/reference metadata.
- Missing universal outcome methodology.
- Team-level reviewer labels instead of credentialed profile pages.
- Widespread internal-link gaps in generated audit artifacts.
