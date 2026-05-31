# Full Indexability Audit

Generated: 2026-05-31T22:38:34.909Z

## Scope

- Requested reference count: 4,627 public content URLs.
- Current live `/sitemap-blog.xml` loc count: 5822.
- Current live article URLs in `/sitemap-blog.xml`: 4217.
- Local static supplement article URLs not present in the live blog sitemap: 415.
- Total URLs audited in this run: 4632.

The live sitemap currently differs from the 4,627 recovery-inventory count. This audit checks every live article URL in the blog sitemap plus local static supplement article URLs that reconcile the recovery corpus class.

## Critical Interpretation

The dominant failure is live origin availability, not an ordinary SEO-template defect. During the full crawl, **4,628 of 4,632 audited URLs returned HTTP 504** from the production edge/origin path. Manual spot checks showed the same DigitalOcean/Cloudflare failure class on affected URLs: `x-do-failure-code: UH`, `x-do-failure-msg: no_healthy_upstream`, `x-do-orig-status: 503`.

For URLs returning a 504 error page, `noindex` and `canonical_missing` are secondary symptoms of the error response HTML. Treat the 504/no healthy upstream condition as the first recovery blocker. Re-run this audit after origin health is stable to separate true page metadata failures from outage artifacts.

## Summary

| Metric | Count |
|---|---:|
| Audited URLs | 4632 |
| Fully indexable URLs | 0 |
| Non-indexable / failing URLs | 4632 |
| Orphaned URLs | 4432 |
| Canonical issues | 4632 |
| Redirect issues | 0 |
| HTTP issues | 4628 |
| Robots blocked | 0 |
| Noindex URLs | 4629 |
| Missing from sitemap | 415 |
| Not internally linked | 4432 |
| Not linked from blog hub pagination | 4432 |

## Issue Breakdown

| Issue | Count |
|---|---:|
| canonical_missing | 4632 |
| noindex | 4629 |
| http_504 | 4628 |
| not_internally_linked | 4432 |
| not_linked_from_hub | 4432 |
| missing_from_sitemap | 415 |

## Failure Export

- JSON: `reports/full-indexability-audit/results.json`
- CSV: `reports/full-indexability-audit/failures.csv`

## Highest Priority Fixes

1. Repair URLs with non-200 or redirect responses first; these are hard crawl failures.
2. Restore sitemap inclusion for valid static supplement URLs or remove them from the public recovery corpus if they should not be public.
3. Fix canonical mismatches/missing canonicals on any public content URL.
4. Strengthen blog hub/category pagination links for URLs marked not internally linked.
5. Re-submit `/sitemap-blog.xml` after the sitemap and linking gaps are corrected.

## First Failure Samples

| URL | Issues |
|---|---|
| https://nursenest.ca/allied-health/imaging/blog/common-imaging-mistakes | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/allied-health/imaging/blog/how-to-pass-arrt-exam | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/allied-health/imaging/blog/top-50-radiology-questions | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/allied-health/mlt/blog/blood-bank-antibody-identification | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/allied-health/mlt/blog/blood-banking-abo-rh-typing | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/allied-health/mlt/blog/clinical-chemistry-electrolyte-panels | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/allied-health/mlt/blog/coagulation-cascade-mixing-studies | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/allied-health/mlt/blog/csmls-vs-ascp-certification-comparison | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/allied-health/mlt/blog/hematology-cbc-interpretation-guide | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/allied-health/mlt/blog/histotechnology-special-stains-guide | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/allied-health/mlt/blog/immunology-serology-hiv-hepatitis-testing | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/allied-health/mlt/blog/microbiology-gram-stain-technique | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/allied-health/mlt/blog/mlt-study-strategies-exam-day-tips | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/allied-health/mlt/blog/molecular-diagnostics-pcr-primer | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/allied-health/mlt/blog/parasitology-ova-parasites-exam-guide | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/allied-health/mlt/blog/quality-control-westgard-rules-explained | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/allied-health/mlt/blog/specimen-collection-order-of-draw | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/allied-health/mlt/blog/urinalysis-body-fluids-review | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/allied-health/paramedic/blog/common-ems-mistakes-1 | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/allied-health/paramedic/blog/how-to-pass-paramedic-exam-1 | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/allied-health/paramedic/blog/top-50-ems-questions-1 | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/abg-interpretation-advanced-review-np-certification | canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/abg-interpretation-tricks-for-rt-students | noindex, canonical_missing, missing_from_sitemap, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/abo-rh-blood-group-typing-forward-reverse-mlt | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/acc-injury-care-nursing-documentation-basics-nz-education | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/ace-inhibitors-clinical-pharmacology-pharmacy-guide | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/activity-analysis-ot-student-guide | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/acute-abdominal-pain-workup-np-certification | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/acute-care-ot-discharge-planning-basics | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/acute-kidney-injury-fluid-electrolyte-nursing-review-australia | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/acute-kidney-injury-nursing-priorities-licensing-exams-longtail | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/acute-kidney-injury-prerenal-intrinsic-postrenal | canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/acute-psychosis-agitation-prehospital-sedation-protocol-ems | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/acute-stroke-management-np-certification | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/adapting-to-nursing-work-australia-for-international-nurse-graduates | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/adaptive-equipment-adls-ot | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/adhd-management-review-np-certification | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/adls-vs-iadls-ot-student-guide | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/ahpra-nurse-registration-pathway-international-educational-overview | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/airway-adjuncts-ems-difficult-airway-communication-and-plan-b-ems | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/airway-adjuncts-ems-op-vs-npa-indications-and-sizing-ems | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/airway-adjuncts-ems-post-intubation-confirmation-and-etco2-ems | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/airway-adjuncts-ems-suction-bvm-and-two-person-ventilation-ems | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/airway-adjuncts-ems-supraglottic-airway-selection-basics-ems | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/altitude-illness-hape-hace-prehospital-recognition-ems | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/aminoglycoside-toxicity-pharmacy-review | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/ana-screening-autoimmune-serology-basics-mlt | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/anaphylaxis-prehospital-airway-edema-biphasic-return-precautions-ems | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/anaphylaxis-prehospital-epinephrine-im-first-line-and-repeat-dosing-ems | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/anaphylaxis-prehospital-h1-h2-blockers-steroids-as-adjuncts-ems | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/anaphylaxis-prehospital-observation-and-refusal-documentation-ems | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/anaphylaxis-prehospital-orthostatic-and-shock-presentation-ems | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/anaphylaxis-prehospital-protocol-epinephrine-ems | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/anion-gap-metabolic-acidosis-laboratory-mlt | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/antibiotic-classes-pharmacology-overview | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/antibody-screen-unexpected-antibodies-blood-bank-mlt | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/anticoagulant-prescribing-review-np-certification | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/anticoagulants-pharmacology-overview-pharmacy | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/antipsychotic-side-effects-pharmacy-clinical-guide | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/anxiety-disorders-for-pmhnp-certification | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/aortic-dissection-suspicion-field-assessment-ems | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/ar-intl-acid-base-arterial-blood-gas-intl-topic-007 | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/ar-intl-acid-base-arterial-blood-gas-intl-topic-035 | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/ar-intl-acid-base-arterial-blood-gas-intl-topic-063 | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/ar-intl-acid-base-arterial-blood-gas-intl-topic-091 | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/ar-intl-acid-base-arterial-blood-gas-intl-topic-119 | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/ar-intl-acs-nursing-first-hour-intl-topic-005 | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/ar-intl-acs-nursing-first-hour-intl-topic-033 | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/ar-intl-acs-nursing-first-hour-intl-topic-061 | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/ar-intl-acs-nursing-first-hour-intl-topic-089 | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/ar-intl-acs-nursing-first-hour-intl-topic-117 | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/ar-intl-acute-asthma-airway-intl-topic-016 | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/ar-intl-acute-asthma-airway-intl-topic-044 | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/ar-intl-acute-asthma-airway-intl-topic-072 | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/ar-intl-acute-asthma-airway-intl-topic-100 | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/ar-intl-acute-asthma-airway-intl-topic-128 | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/ar-intl-acute-heart-failure-decomp-intl-topic-024 | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/ar-intl-acute-heart-failure-decomp-intl-topic-052 | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/ar-intl-acute-heart-failure-decomp-intl-topic-080 | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
| https://nursenest.ca/blog/ar-intl-acute-heart-failure-decomp-intl-topic-108 | http_504, noindex, canonical_missing, not_internally_linked, not_linked_from_hub |
