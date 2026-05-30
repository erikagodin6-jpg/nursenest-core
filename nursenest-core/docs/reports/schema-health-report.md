# Schema Health Report

Generated: 2026-05-30T17:07:34.223Z

## Source-Level Schema Coverage

| Schema Type | Local Source File Count | Notes |
| --- | --- | --- |
| Article | 3890 | Blog and article-like authority surfaces. |
| FAQ | 4791 | FAQ blocks on blogs, exam pages, advanced ECG, and long-tail authority content. |
| Breadcrumb | 313 | Breadcrumb JSON-LD/components and route hierarchy helpers. |
| Course | 655 | Exam preparation and education-program landing pages. |
| MedicalCondition / MedicalWebPage | 4717 | Clinical/medical educational entity helpers and clinical content pages. |
| Organization / WebSite | 2810 | Sitewide brand and search schema helpers. |
| EducationalOccupationalProgram | 705 | Program-oriented exam/pathway structured data. |

### Structured data / JSON-LD sources

- src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/[exam]/page.tsx
- src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/flashcards/page.tsx
- src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/[lessonSlug]/pathway-lesson-detail-page-body.tsx
- src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/page.tsx
- src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/page.tsx
- src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/report-card/page.tsx
- src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/simulation/page.tsx
- src/app/(marketing)/(default)/acls-rhythms/page.tsx
- src/app/(marketing)/(default)/advanced-ecg-nursing/12-lead-stemi/page.tsx
- src/app/(marketing)/(default)/advanced-ecg-nursing/acls-rhythms/page.tsx
- src/app/(marketing)/(default)/advanced-ecg-nursing/critical-care-ecg/page.tsx
- src/app/(marketing)/(default)/advanced-ecg-nursing/ecg-case-simulations/page.tsx
- src/app/(marketing)/(default)/advanced-ecg-nursing/electrolyte-ecg-changes/page.tsx
- src/app/(marketing)/(default)/advanced-ecg-nursing/medication-induced-ecg-changes/page.tsx
- src/app/(marketing)/(default)/advanced-ecg-nursing/page.tsx
- src/app/(marketing)/(default)/advanced-ecg-nursing/pediatric-ecg/page.tsx
- src/app/(marketing)/(default)/advanced-ecg-nursing/rhythm-practice/page.tsx
- src/app/(marketing)/(default)/advanced-ecg-nursing/telemetry-monitoring/page.tsx
- src/app/(marketing)/(default)/advanced-hemodynamic-monitoring/page.tsx
- src/app/(marketing)/(default)/advanced-labs-interpretation/page.tsx
- src/app/(marketing)/(default)/allied-health/[slug]/blog/[postSlug]/page.tsx
- src/app/(marketing)/(default)/allied-health/[slug]/blog/page.tsx
- src/app/(marketing)/(default)/allied-health/[slug]/page.tsx
- src/app/(marketing)/(default)/allied-health/page.tsx
- src/app/(marketing)/(default)/allied/[career]/page.tsx
- src/app/(marketing)/(default)/allied/allied-health/page.tsx
- src/app/(marketing)/(default)/arterial-line-interpretation/page.tsx
- src/app/(marketing)/(default)/blog/[slug]/page.tsx
- src/app/(marketing)/(default)/blog/category/[category]/page.tsx
- src/app/(marketing)/(default)/blog/rn/[slug]/page.tsx
- src/app/(marketing)/(default)/blog/rn/page.tsx
- src/app/(marketing)/(default)/blog/tag/[tag]/page.tsx
- src/app/(marketing)/(default)/canada-np-exam-prep/page.tsx
- src/app/(marketing)/(default)/canada/new-grad/[workArea]/page.tsx
- src/app/(marketing)/(default)/canada/new-grad/page.tsx
- src/app/(marketing)/(default)/cardiac-output-monitoring/page.tsx
- src/app/(marketing)/(default)/clinical-modules/page.tsx
- src/app/(marketing)/(default)/cnple-simulation-exam/page.tsx
- src/app/(marketing)/(default)/cnple-study-guide/page.tsx
- src/app/(marketing)/(default)/cnple-vs-cnpe/page.tsx
- src/app/(marketing)/(default)/critical-care-bundle/page.tsx
- src/app/(marketing)/(default)/ecg-interpretation/page.tsx
- src/app/(marketing)/(default)/ecg-practice-questions/page.tsx
- src/app/(marketing)/(default)/ecg-telemetry-mastery/page.tsx
- src/app/(marketing)/(default)/ecg/[topic]/page.tsx
- src/app/(marketing)/(default)/ecg/page.tsx
- src/app/(marketing)/(default)/exams/canada/page.tsx
- src/app/(marketing)/(default)/exams/philippines/page.tsx
- src/app/(marketing)/(default)/exams/uk/page.tsx
- src/app/(marketing)/(default)/faq/page.tsx
- src/app/(marketing)/(default)/flashcards/[slug]/page.tsx
- src/app/(marketing)/(default)/hemodynamic-monitoring/page.tsx
- src/app/(marketing)/(default)/hemodynamics-monitoring/page.tsx
- src/app/(marketing)/(default)/how-it-works/page.tsx
- src/app/(marketing)/(default)/labs-interpretation/page.tsx
- src/app/(marketing)/(default)/layout.tsx
- src/app/(marketing)/(default)/lessons/page.tsx
- src/app/(marketing)/(default)/nursing-glossary/[term]/page.tsx
- src/app/(marketing)/(default)/nursing-mechanisms/[slug]/page.tsx
- src/app/(marketing)/(default)/nursing/[careerSlug]/blog/[postSlug]/page.tsx
- src/app/(marketing)/(default)/nursing/[careerSlug]/blog/page.tsx
- src/app/(marketing)/(default)/page.tsx
- src/app/(marketing)/(default)/pals-rhythms/page.tsx
- src/app/(marketing)/(default)/pediatric-ecg/page.tsx
- src/app/(marketing)/(default)/practice-exams/page.tsx
- src/app/(marketing)/(default)/pre-nursing/lessons/[slug]/page.tsx
- src/app/(marketing)/(default)/pre-nursing/lessons/page.tsx
- src/app/(marketing)/(default)/pre-nursing/mini-cat/page.tsx
- src/app/(marketing)/(default)/pre-nursing/page.tsx
- src/app/(marketing)/(default)/pre-nursing/practice/[slug]/page.tsx
- src/app/(marketing)/(default)/pre-nursing/study-plan/page.tsx
- src/app/(marketing)/(default)/pricing/page.tsx
- src/app/(marketing)/(default)/pulmonary-artery-catheter/page.tsx
- src/app/(marketing)/(default)/question-bank/page.tsx
- src/app/(marketing)/(default)/questions/[slug]/page.tsx
- src/app/(marketing)/(default)/shock-and-perfusion/page.tsx
- src/app/(marketing)/(default)/telemetry-nursing/page.tsx
- src/app/(marketing)/(default)/us/new-grad/[workArea]/page.tsx
- src/app/(marketing)/(default)/us/new-grad/page.tsx
- src/app/(marketing)/(default)/what-is-the-cnple/page.tsx
- ... 40 more

## Validation Findings

| Requirement | Status |
| --- | --- |
| Article schema | Present in source, especially blog/authority content. |
| FAQ schema | Present in source. Validate production snippets for invalid generated FAQ copy. |
| Breadcrumb schema | Present through breadcrumb helpers/components. |
| Course schema | Present in exam/program-oriented helpers. |
| MedicalCondition / MedicalWebPage | Present in clinical/educational entity helpers; production validation still required. |
| Organization / WebSite | Present in source-level schema helpers. |
| EducationalOccupationalProgram | Present in program/exam helper surface. |

## Unable To Verify Without Runtime Crawl

- Whether every high-value rendered page emits valid JSON-LD.
- Whether JSON-LD fields pass Google Rich Results validation.
- Whether there are conflicting schema blocks on a specific URL.
