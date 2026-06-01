# NurseNest Trust Signal Audit

Date: 2026-06-01

Status: Evidence-backed audit for E-E-A-T authority buildout. No public route, navigation, sitemap, pricing, or learner-facing behavior changes were made.

## Evidence Base

Repository evidence reviewed:

- Public marketing route inventory: 246 default marketing `page.tsx` files under `src/app/(marketing)/(default)` and 55 localized marketing `page.tsx` files under `src/app/(marketing)/[locale]`.
- High-priority trust surfaces: 88 default route files matching blog, lessons, questions, flashcards, practice exams, CAT, ECG, labs, clinical, pharmacology, pricing, about, and public policy paths.
- Long-tail blog corpus: 4,595 Markdown files under `src/content/blog-static-longtail`.
- Public policy pages: `src/app/(marketing)/(default)/editorial-policy/page.tsx`, `src/app/(marketing)/(default)/content-review-policy/page.tsx`, `src/app/(marketing)/(default)/disclaimer/page.tsx`, with source copy in `content/legal/`.
- Blog public trust display: `src/app/(marketing)/(default)/blog/[slug]/page.tsx`.
- Shared E-E-A-T attribution component: `src/components/seo/eeat-content-attribution.tsx`.
- JSON-LD helpers: `src/components/seo/seo-json-ld.tsx`.
- Clinical reference/evidence governance: `src/lib/blog/blog-citation-safety.ts`, `src/lib/evidence/evidence-governance.ts`, `src/lib/evidence/reference-validation-evidence-governance-engine.ts`.
- Publish gates: `src/lib/content/editorial-publish-policy.ts`.
- Admin E-E-A-T reporting: `src/lib/admin/eeat-editorial-dashboard.ts`.

## Executive Finding

NurseNest has a real E-E-A-T foundation: public editorial policies, content review policy, educational disclaimer, APA reference support for blogs, reviewer fields in the blog model, lesson trust disclosures, clinical review metadata in selected authority pages, publish gates for questions and lessons, and evidence-governance libraries.

The main gap is consistency. Trust proof is visible on some pages, partial on others, and absent from several major commercial surfaces. A manual reviewer could find evidence of editorial process, but would also find uneven bylines, limited named reviewer profiles, inconsistent reference display outside blog/authority pages, and no unified author/reviewer directory.

## Public Surface Audit

| Surface | Current trust evidence | Missing or inconsistent signals | Priority |
|---|---|---:|---:|
| Homepage | Emits `WebPageJsonLd`; references product capabilities and adaptive platform positioning. | No compact "clinically governed" proof block linking to editorial policy, content review policy, reviewer system, and outcomes methodology. | High |
| Pricing | Public pricing route exists and emits `WebPageJsonLd` through localized/default surfaces. | Needs "educational use only", no pass guarantee unless substantiated, evidence of refund/subscription terms, and clear feature availability by tier. | High |
| About | `about/page.tsx` has indexable metadata and a product narrative. | Needs leadership/editorial team, clinical advisory structure, reviewer directory links, content methodology, and correction process. | Critical |
| Editorial policy | Public page exists; `content/legal/editorial-policy.md` explains YMYL scope, AI-assisted content, corrections, clinical alignment, and independence. | Needs stronger public link prominence from every YMYL page and a date/review cadence table. | Medium |
| Content review policy | Public page exists; `content/legal/content-review-policy.md` explains review roles and high-impact updates. | Needs reviewer qualification classes, high-risk review rules, and visible audit status per asset. | High |
| Disclaimer | Public page exists; `content/legal/educational-disclaimer.md` clearly states educational-only limitations. | Needs standardized short disclaimer block across all high-risk content types, not only blog/lesson surfaces. | High |
| Blog | `blog/[slug]/page.tsx` displays byline when present, last clinical review date when present, E-E-A-T attribution block, APA 7 references when present, educational disclaimer, BlogPosting JSON-LD, FAQ JSON-LD. | Static/legacy posts may use generic "Clinical review board (educational)" metadata and not named reviewers; structured references are disabled on some scoped blog routes. | Critical |
| Lessons | Lesson pages emit `PathwayLessonMedicalEducationJsonLd`; header shows updated/reviewed label; `EeatContentAttribution` links policies. | Lesson schema author is organization only; no named author/reviewer fields in `PathwayLesson`; references are not first-class on public lesson pages. | Critical |
| Question Banks | `question-bank/page.tsx` emits `WebPageJsonLd` and links pathway hubs. `ExamQuestion` has rationale, clinical pearl, distractor rationales, reference source, quality score fields. | Public/commercial pages need visible methodology: blueprint mapping, item review process, psychometric limitations, and sample rationale/reviewer proof. | Critical |
| Flashcards | Some public flashcard pages reference reviewed status and moderation. Verified study cards have `referencesJson`. | Needs consistent source-of-truth display: generated-from-question, reviewed status, scope, references, and duplicate/audit status. | High |
| Practice Exams | Practice runners show "References / Source" when available. | Public practice-exam pages need test construction methodology, blueprint balancing, scoring limitations, and review dates. | Critical |
| CAT Exams | CAT surfaces exist; adaptive policy code exists in exam libs. | Needs transparent CAT methodology, psychometric limitations, "not the NCLEX algorithm" disclosure unless independently validated, and readiness confidence language. | Critical |
| Study Plans | Learner study-plan systems exist; public trust proof is light. | Needs adaptive recommendation methodology, data inputs, limitations, and privacy note. | Medium |
| ECG | Advanced ECG pages make "clinician-reviewed" claims; ECG JSON/marketing pages exist. | Claims need named reviewer or review board proof, reference display, and date/version status. Avoid unsupported ACLS/certification implications. | Critical |
| Clinical Skills | Clinical Skills competency UI exists; public trust layer is mixed. | Needs skill source methodology, scope flags, documentation references, and competency limitation disclaimer. | High |
| Labs | Lab interpretation surfaces exist; evidence-governance supports reference validation. | Needs lab range/unit methodology, reference ranges by system/country, critical value disclaimer, review dates. | Critical |
| Pharmacology | Pharmacology content and roadmap docs exist; question model has medication naming variants/reference source. | Needs drug reference policy, formulary jurisdiction disclosure, medication safety review workflow, and high-risk update cadence. | Critical |

## Existing Strengths

- Public editorial and content review policies are indexable and canonicalized.
- BlogPost schema includes `authorDisplayName`, `authorCredentials`, `authorBio`, `medicalReviewerName`, `medicalReviewerCredentials`, `lastReviewedAt`, `reviewDueAt`, `sourcesJson`, `apaReferences`, `requiresReferences`, and `medicalRiskFlags`.
- Blog publishing has citation safety: AI-suggested citations are excluded from published APA output unless verified.
- Question and lesson publish gates block missing/weak rationale or thin lessons unless explicitly overridden.
- Authority pages under `/healthcare/[category]/[slug]` already show clinical review status, reviewer credentials, reviewed date, quality gate, references, and next review.
- Admin E-E-A-T dashboard normalizes page scores, attribution gaps, stale content, internal link gaps, and structural gaps from audit JSON.

## Critical Gaps

1. No unified public author directory or reviewer directory was found.
2. No first-class cross-content author/reviewer data model exists for lessons, questions, flashcards, practice exams, CAT exams, ECG, labs, pharmacology, and clinical skills.
3. Blog E-E-A-T is more mature than other learning asset types.
4. "Clinically reviewed" claims appear on some commercial pages without a consistent public reviewer identity, review date, and source methodology block.
5. Reference management exists, but is not yet universally attached to content assets or public rendering.
6. Outcome/pass-rate reporting framework is not visible; this is safer than unsupported claims, but creates a conversion gap versus competitors that publish pass-rate claims with methodology footnotes.
7. Schema coverage is useful but uneven: Organization, WebSite, WebPage, BlogPosting, FAQPage, Course, EducationalOccupationalProgram, LearningResource, MedicalWebPage are present; Person/reviewer entity pages and review process schema are missing.

## Required Trust Signals By Asset Type

| Asset type | Required public trust signals |
|---|---|
| Blog | Named author or institutional author, named reviewer when clinically reviewed, author credentials, reviewer credentials, published date, last reviewed date, APA references, educational disclaimer, correction link. |
| Lesson | Author/reviewer or editorial board attribution, updated date, clinical review date, references for high-risk topics, pathway/scope disclaimer, exam blueprint mapping. |
| Question | Review status, source/reference link or reference note, rationale quality status internally, blueprint mapping, difficulty/cognitive level, scope/exam mapping. Public samples should show methodology without exposing paid rationales. |
| Flashcard | Source question/lesson, review status, role scope, exam mapping, generated date, clinical review date for high-risk cards. |
| Practice exam | Blueprint construction methodology, item review status, scoring limitation, published/reviewed date, no guarantee language. |
| CAT | Adaptive methodology, limitations, item eligibility gates, blueprint coverage, scoring confidence disclaimer, not affiliated with NCSBN unless licensed. |
| ECG/Labs/Pharmacology | Reference standard, review date, reviewer specialty, safety disclaimer, jurisdiction/unit/formulary caveats, update cadence. |

## Manual Review Evidence Package

If Google manually reviewed NurseNest tomorrow, the strongest evidence would be:

- Public editorial policy and content review policy.
- Educational disclaimer clearly limiting clinical/legal/exam guarantees.
- Blog article pages showing bylines, reviewer names where available, APA references, last reviewed dates, and BlogPosting schema.
- Healthcare authority pages showing reviewer credentials, reviewed/updated/next-review dates, references, and quality gate scores.
- Citation-safe blog workflow that refuses to auto-publish AI citation stubs as references.
- Publish gates for lessons and questions that block thin/missing educational content.
- Admin E-E-A-T dashboard that identifies author, structure, stale content, and internal-link gaps.

The weakest evidence would be:

- Lack of public author/reviewer profile pages.
- Generic review-board labels in many static articles.
- Uneven references outside blog/authority pages.
- Product and clinical specialty pages claiming review status without standardized visible reviewer/date/reference proof.

