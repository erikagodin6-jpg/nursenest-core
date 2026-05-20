# Australia RN hybrid static long-tail batch (40 posts)
**Batch date:** 2026-05-09  
**Scope:** Deterministic in-repo HTML long-tail under `src/content/blog-static-longtail/` for Australian RN registration orientation and clinical practice preparation, aimed at internationally educated nurses (IENs) and students adapting to Australia.
## Post count note (resolved contradiction)
The request referenced both **~200 posts** and **“generate 35–40 posts.”** This batch **delivers 40 posts** (within the 35–40 band). The larger figure was not implemented as a single batch scope here; treat **40** as the authoritative count for this deliverable.
## SEO and schema parity
- Frontmatter matches existing `blog-static-longtail` conventions: `slug`, `title`, `excerpt`, `category`, JSON `tags`, `publishedAt`/`updatedAt`, `seoTitle`, `seoDescription`, `canonicalUrl` (`/blog/{slug}`), `authorDisplayName`, `medicalReviewerName`, `disclaimer` (includes **educational** + **exam preparation** + **not individualized medical advice** markers).
- Body mirrors comparable batches: **Introduction**, **Key Takeaways**, registration/exam context, eligibility/orientation, prioritisation, safety, documentation, communication/teaching, escalation, exam-focused points, **Suggested internal links**, **Premium CTA**, **FAQ Schema Questions** (heading pattern used across repo long-tail), **APA-7 References** (official AU agencies; no fabricated DOIs).
- **Indigenous cultural safety:** Two dedicated posts use partnership/respect-led framing and explicitly avoid stereotyping; all posts reference culturally safe communication where relevant.
- **AHPRA / NMBA:** Educational references only; articles state they are not legal or individual registration advice.
## Internal link patterns used
Each post links to:
- Three other AU batch posts (descriptive anchor text = full `title`).
- Existing long-tail clinical scaffold: `/blog/sepsis-pathophysiology-early-nursing-recognition`.
- Learner app surfaces: `/app/lessons`, `/app/flashcards`, `/app/practice-tests`, `/app/questions`, `/app/cat`, `/app/labs`, `/app/ecg-video-quiz`, `/app/account/progress`, `/app/dashboard`.
## Slug collision check (DB wins)
`npm run diagnose:blog-slug-collisions -- --write-report` reported **0** live `BlogPost` rows overlapping the supplement slug union at run time. Diagnostic output: `docs/reports/blog-slug-collision-diagnostic.txt`.
## Validation commands (exit codes)
| Command | Exit |
|---------|------|
| `npm run validate:blog-static-longtail` | 0 |
| `npm run diagnose:blog-slug-collisions -- --write-report` | 0 |
| `npm run typecheck:critical` | 0 (after removing a corrupted local `.next/dev/types/routes.d.ts` artifact that caused `tsc` parse errors; not caused by this batch) |
| `npm run test:blog-recovery` | 0 |
| `npm run test:homepage` | 0 |
## Per-post inventory (approximate body word count = whitespace-delimited tokens after frontmatter)
| # | Slug | Title (short) | ~Words |
|---|------|---------------|--------|
| 1 | `ahpra-nurse-registration-pathway-international-educational-overview` | AHPRA Nurse Registration in Australia: Pathway Overview for Interna... | 1130 |
| 2 | `nursing-in-australia-for-internationally-qualified-nurses-longtail-guide` | Nursing in Australia for Internationally Qualified Nurses: Orientat... | 1132 |
| 3 | `australian-medication-safety-seven-standard-expectations-nurses` | Australian Medication Safety: What Nurses Should Know About the Nat... | 1128 |
| 4 | `clinical-handover-isbar-sbar-australian-hospital-nursing` | Clinical Handover in Australia: ISBAR, SBAR, and Safe Transfer of A... | 1129 |
| 5 | `sepsis-recognition-escalation-australian-acute-care-nursing-review` | Sepsis Recognition and Escalation in Australian Acute Care: Nursing... | 1133 |
| 6 | `copd-nursing-care-australia-oxygen-inhaler-safety-review` | COPD Nursing Care in Australia: Oxygen Safety, Inhalers, and Exacer... | 1130 |
| 7 | `mental-health-nursing-australia-communication-safety-basics` | Mental Health Nursing in Australia: Therapeutic Communication and S... | 1130 |
| 8 | `indigenous-cultural-safety-for-nurses-australia-educational-overview` | Indigenous Cultural Safety for Nurses in Australia: Educational Fra... | 1132 |
| 9 | `fluid-balance-monitoring-iv-therapy-australian-nursing-review` | Fluid Balance and IV Therapy Monitoring: Australian Nursing Review | 1131 |
| 10 | `oxygen-therapy-spo2-targets-australian-nursing-education` | Oxygen Therapy and SpO2 Targets: Australian Nursing Education Notes | 1130 |
| 11 | `ecg-interpretation-basics-for-australian-rn-learners` | ECG Interpretation Basics for Australian RN Learners | 1132 |
| 12 | `diabetes-management-nursing-priorities-australian-primary-acute-care` | Diabetes Management: Nursing Priorities Across Australian Primary a... | 1127 |
| 13 | `pressure-injury-prevention-australian-clinical-care-standards` | Pressure Injury Prevention and the Australian Clinical Care Standards | 1134 |
| 14 | `nursing-documentation-standards-australia-educational-framework` | Nursing Documentation Standards in Australia: Educational Framework | 1130 |
| 15 | `falls-prevention-multifactorial-strategies-australian-hospitals` | Falls Prevention: Multifactorial Strategies in Australian Hospitals | 1127 |
| 16 | `icu-nursing-basics-for-australian-rn-learner-orientation` | ICU Nursing Basics for Australian RN Learner Orientation | 1133 |
| 17 | `clinical-prioritization-strategies-for-australian-nursing-exams` | Clinical Prioritization Strategies for Australian Nursing Exams | 1132 |
| 18 | `medication-dose-calculations-si-units-australian-nursing-practice` | Medication Dose Calculations and SI Units in Australian Nursing Pra... | 1135 |
| 19 | `australian-healthcare-system-medicare-public-private-overview-nurses` | Australian Healthcare System Explained for Nurses: Medicare, Public... | 1131 |
| 20 | `adapting-to-nursing-work-australia-for-international-nurse-graduates` | Adapting to Nursing Work in Australia for International Nurse Gradu... | 1135 |
| 21 | `nmba-registered-nurse-standards-for-practice-study-guide` | NMBA Registered Nurse Standards for Practice: Educational Study Guide | 1131 |
| 22 | `clinical-supervision-and-support-for-nurses-new-to-australia` | Clinical Supervision and Support for Nurses New to Australia | 1134 |
| 23 | `mandatory-notifications-nursing-professional-conduct-education-only-overview` | Mandatory Notifications and Professional Conduct: Education-Only Ov... | 1130 |
| 24 | `rural-remote-nursing-australia-scope-safety-and-resources` | Rural and Remote Nursing in Australia: Scope, Safety, and Resources | 1131 |
| 25 | `digital-health-and-ehr-documentation-expectations-australian-nursing` | Digital Health and EHR Documentation Expectations for Australian Nu... | 1134 |
| 26 | `nsqhs-standards-for-nurses-educational-safety-quality-overview` | National Safety and Quality Health Service Standards: Nurse-Focused... | 1132 |
| 27 | `cross-cultural-communication-patient-centred-care-australia` | Cross-Cultural Communication and Patient-Centred Care in Australia | 1132 |
| 28 | `recognising-deteriorating-patient-ews-met-calls-australian-settings` | Recognising the Deteriorating Patient: EWS, MET Calls, and Escalati... | 1129 |
| 29 | `infection-control-standard-transmission-based-precautions-australia` | Infection Control in Australia: Standard and Transmission-Based Pre... | 1129 |
| 30 | `palliative-and-end-of-life-nursing-care-basics-australia` | Palliative and End-of-Life Nursing Care Basics in Australia | 1133 |
| 31 | `delirium-prevention-assessment-older-adults-australian-hospitals` | Delirium Prevention and Assessment for Older Adults in Australian H... | 1135 |
| 32 | `wound-assessment-and-pressure-injury-staging-review-australia` | Wound Assessment and Pressure Injury Staging Review for Australian ... | 1135 |
| 33 | `cardiac-monitoring-and-telemetry-nursing-essentials-australia` | Cardiac Monitoring and Telemetry Nursing Essentials in Australia | 1133 |
| 34 | `stroke-nursing-assessment-priorities-time-sensitive-care-education` | Stroke Nursing Assessment Priorities and Time-Sensitive Care Education | 1133 |
| 35 | `acute-kidney-injury-fluid-electrolyte-nursing-review-australia` | Acute Kidney Injury: Fluid and Electrolyte Nursing Review for Austr... | 1128 |
| 36 | `postoperative-nursing-assessment-and-complication-recognition` | Postoperative Nursing Assessment and Complication Recognition in Au... | 1133 |
| 37 | `continence-stoma-care-nursing-basics-australian-context` | Continence and Stoma Care Nursing Basics in an Australian Context | 1135 |
| 38 | `working-with-aboriginal-torres-strait-islander-health-services-education` | Working Respectfully With Aboriginal and Torres Strait Islander Hea... | 1135 |
| 39 | `enrolled-nurse-vs-registered-nurse-scope-australia-educational-overview` | Enrolled Nurse vs Registered Nurse Scope in Australia: Educational ... | 1133 |
| 40 | `clinical-simulations-and-objective-structured-assessment-nursing-readiness-australia` | Clinical Simulations and Objective Structured Assessment: Nursing R... | 1131 |

**Total approximate body words (sum):** 45267
## Files touched
- Added: `src/content/blog-static-longtail/*.md` — **40** new files (slugs listed above).
- Added: this report `reports/australia-rn-longtail-batch-40.md`.
- Regenerated: `docs/reports/blog-slug-collision-diagnostic.txt` (from diagnose script).
