# UK NMC / CBT / OSCE long-tail static blog batch (40 posts)

**Generated:** 2026-05-10  
**Scope:** Deterministic hybrid static long-tail SEO for internationally educated nurses preparing for **UK NMC registration**, **CBT**, and **OSCE** (educational framing; not legal or regulatory advice).

## Post count contradiction (user brief)

The request text referenced both **200 posts** and **“Generate 35–40 posts”**. This batch **delivers 40 posts** (within 35–40). No 200-post batch was generated.

## Files added

Forty new markdown files under:

`nursenest-core/src/content/blog-static-longtail/`

…with kebab-case slugs, `canonicalUrl: /blog/{slug}`, matching frontmatter schema used by existing long-tail posts (`slug`, `title`, `excerpt`, `category`, `tags`, `publishedAt`, `updatedAt`, `seoTitle`, `seoDescription`, `canonicalUrl`, `authorDisplayName`, `medicalReviewerName`, `disclaimer`).

**Collision safety:** Slugs are distinct from each other. Live **DB wins** on slug overlap; `npm run diagnose:blog-slug-collisions -- --write-report` reported **0** live DB rows overlapping the supplement union for this environment.

## Topic coverage

- **26** topic seeds from the brief (CBT, OSCE, NMC registration, NHS documentation, NEWS2, sepsis screening, medicines, IPC, falls, SBAR, fluid balance, pressure injury, diabetes, COPD, stroke, mental health, elder care, IV meds, manual handling, oxygen, ECG, interview prep, adaptation, therapeutic communication, prioritisation, documentation).
- **14** additional UK-focused topics (revalidation overview, safeguarding adults, duty of candour overview, medicines governance, mental capacity education notes, information governance, preceptorship, Band 5 expectations, incident reporting culture, person-centred care planning, palliative recognition in acute care, phlebotomy/labelling safety, MDT handover, nutrition/malnutrition screening).

## Validation and tests (npm exit codes)

| Command | Exit code | Notes |
|--------|-----------|--------|
| `npm run validate:blog-static-longtail` | **0** | All long-tail files validate (repo-wide count includes pre-existing files). |
| `npm run diagnose:blog-slug-collisions -- --write-report` | **0** | Report: `nursenest-core/docs/reports/blog-slug-collision-diagnostic.txt`. |
| `npm run typecheck:critical` | **0** | First run failed on corrupted `.next/dev/types/routes.d.ts`; removing `nursenest-core/.next/dev` cleared stale generated types; re-run **passed**. |
| `npm run test:blog-recovery` | **0** | Includes `hybrid-blog-static-longtail.contract.test.ts`. |
| `npm run test:homepage` | **0** | 78 passed, 1 skipped. |

## SEO completeness (batch-level)

Each post includes: `seoTitle`, `seoDescription`, `canonicalUrl` aligned with slug, FAQ-style `h2`/`h3` block, **Suggested internal links** with **five** `/blog/{peer-slug}` links (rotated across the 40-post set) plus `/app/dashboard`, and **APA-7 References** with public web titles and URLs (NMC, NHS England, RCN, DHSC duty of candour guidance). **No DOIs fabricated.**

## Per-post inventory

Approximate **body** word count (HTML stripped, whitespace tokenised):

| # | Title | Slug | ~Words |
|---|-------|------|--------|
| 1 | UK NMC Computer-Based Test (CBT): Study Guide for Internationally Educated Nurses | `uk-nmc-cbt-exam-study-guide-international-nurses` | 2406 |
| 2 | UK OSCE Nursing Preparation: Skills, Communication, and Safety for the NMC Route | `uk-osce-nursing-preparation-nmc-route` | 2255 |
| 3 | UK NMC Registration Pathway Explained for Overseas-Educated Nurses | `uk-nmc-registration-pathway-explained-overseas-nurses` | 2230 |
| 4 | NHS Nursing Documentation Basics for Internationally Educated Nurses | `nhs-nursing-documentation-basics-international-nurses` | 2243 |
| 5 | NEWS2 (National Early Warning Score 2) Explained for Nurses in UK Acute Care | `news2-national-early-warning-score2-nurses-guide` | 2264 |
| 6 | Sepsis Screening and Recognition in NHS Settings: Nursing Overview | `nhs-sepsis-screening-recognition-nursing-overview` | 2239 |
| 7 | Medicines Administration Safety Checks in UK Nursing Practice | `uk-medicines-administration-safety-checks-nurses` | 2215 |
| 8 | Infection Prevention and Control Fundamentals in NHS Hospitals | `nhs-infection-prevention-control-nursing-fundamentals` | 2235 |
| 9 | Falls Risk Assessment and Prevention in UK Hospital Nursing | `falls-risk-assessment-prevention-uk-hospital-nursing` | 2209 |
| 10 | SBAR and Structured Communication When Escalating Concerns in the UK | `sbar-structured-communication-escalation-uk-nurses` | 2238 |
| 11 | Fluid Balance Monitoring and Charting for UK Nursing Students and Applicants | `fluid-balance-monitoring-charting-uk-nursing` | 2247 |
| 12 | Pressure Injury Prevention in UK Acute Care: Nursing Essentials | `pressure-injury-prevention-uk-acute-care-nursing` | 2228 |
| 13 | Diabetes Care in NHS Hospital Settings: Nursing Priorities | `diabetes-care-nhs-hospital-settings-nursing` | 2222 |
| 14 | COPD Nursing Review for UK Practice: Exacerbation and Breathlessness Care | `copd-nursing-review-uk-exacerbation-care` | 2244 |
| 15 | Stroke Nursing Assessment in the United Kingdom: FAST Thinking and Urgent Pathways | `stroke-nursing-assessment-uk-fast-thinking` | 2238 |
| 16 | Mental Health Nursing in the United Kingdom: Roles, Safety, and Therapeutic Boundaries | `mental-health-nursing-uk-roles-and-safety` | 2240 |
| 17 | Elder Care Nursing in UK Settings: Frailty, Dignity, and Complex Needs | `elder-care-nursing-frailty-uk-settings` | 2228 |
| 18 | IV Medication Administration: Competence and Safety Themes in UK Nursing | `iv-medication-administration-competence-uk-nursing` | 2227 |
| 19 | Safe Patient Handling and Moving and Handling in the NHS | `safe-patient-handling-moving-handling-uk-nhs` | 2234 |
| 20 | Oxygen Therapy and Monitoring in UK Hospital Nursing | `oxygen-therapy-monitoring-uk-hospital-nursing` | 2214 |
| 21 | ECG Interpretation Basics for Nurses Preparing for UK Practice | `ecg-interpretation-basics-nurses-uk-practice` | 2211 |
| 22 | UK Nursing Interview Preparation for International Applicants | `uk-nursing-interview-preparation-international-applicants` | 2222 |
| 23 | International Nurse Adaptation Guide for the UK NHS Workplace | `international-nurse-adaptation-guide-uk-nhs-workplace` | 2229 |
| 24 | Therapeutic Communication for UK Nursing Practice and OSCE-Style Assessments | `therapeutic-communication-uk-nursing-and-osce` | 2233 |
| 25 | Nursing Prioritisation Strategies for UK Registration Preparation | `nursing-prioritisation-strategies-uk-registration-prep` | 2218 |
| 26 | Documentation for International Nurses: Aligning With NMC Standards | `documentation-for-international-nurses-nmc-standards` | 2222 |
| 27 | NMC Revalidation Concepts for Internationally Educated Nurses in the United Kingdom | `nmc-revalidation-concepts-international-nurses-uk` | 2225 |
| 28 | Safeguarding Adults in the NHS: A Nursing Overview for International Applicants | `safeguarding-adults-nhs-nursing-overview` | 2236 |
| 29 | Duty of Candour: Educational Overview for Nurses in the United Kingdom | `duty-of-candour-educational-overview-uk-nurses` | 2235 |
| 30 | Medicines Management Governance and Safety Culture in UK Healthcare | `uk-medicines-management-governance-and-safety-culture` | 2231 |
| 31 | Mental Capacity and Best Interests: Nursing Education Notes for UK Practice | `mental-capacity-and-best-interests-nursing-education-uk` | 2228 |
| 32 | Information Governance and Patient Confidentiality for NHS Nurses | `information-governance-patient-confidentiality-nhs-nurses` | 2242 |
| 33 | Preceptorship Support for Newly Registered Nurses in the United Kingdom | `preceptorship-support-newly-registered-nurses-uk` | 2232 |
| 34 | NHS Band 5 Staff Nurse Role Expectations: Notes for International Nurses | `nhs-band-5-staff-nurse-role-expectations-international` | 2213 |
| 35 | Incident Reporting and Learning Culture in NHS Organisations | `incident-reporting-learning-culture-nhs-organisations` | 2232 |
| 36 | Person-Centred Care Planning and Documentation in UK Nursing | `person-centred-care-planning-documentation-uk` | 2228 |
| 37 | Palliative Care Recognition on Acute Wards: UK Nursing Notes | `palliative-care-recognition-acute-wards-uk-nurses` | 2217 |
| 38 | Phlebotomy, Sample Labelling, and Venepuncture Safety in UK Practice | `phlebotomy-sample-labelling-venepuncture-safety-uk` | 2215 |
| 39 | Multidisciplinary Handover and Ward Rounds in UK Hospitals | `multidisciplinary-handover-ward-rounds-uk-hospitals` | 2228 |
| 40 | Nutrition, Hydration, and Malnutrition Screening in UK Nursing | `nutrition-hydration-malnutrition-screening-uk-nursing` | 2237 |

**Validation status (per post):** Passed `validate:blog-static-longtail` (no per-file errors).

**Internal links:** Five peer `/blog/...` links plus `/app/dashboard` in each file.

## Excluded / deferred failures

- None for `test:blog-recovery` or `test:homepage`.
- `typecheck:critical` required removing stale `nursenest-core/.next/dev` before `tsc` succeeded.

## Handoff

- **Content:** 40 new files under `nursenest-core/src/content/blog-static-longtail/`.
- **Report:** `nursenest-core/reports/uk-nmc-longtail-batch-40.md`
- **npm exit codes:** validate `0`, diagnose `0`, typecheck:critical `0` (after `.next/dev` removal), test:blog-recovery `0`, test:homepage `0`.
