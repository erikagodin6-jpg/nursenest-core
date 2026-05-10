# US NP certification long-tail batch (50 posts)

**Batch:** deterministic hybrid static long-tail SEO for U.S. nurse practitioner certification exam preparation.  
**Generator:** `scripts/blog/generate-us-np-cert-longtail-batch-50.mts`  
**Content directory:** `src/content/blog-static-longtail/`  
**Topic count:** exactly **50** (matches user-ordered canonical list; no split/combine required).

## Track tagging

Each post lists a **primary** NP population track in the table (`Primary NP track`). Frontmatter `tags` includes the primary track plus cross-track labels where clinically appropriate (see per-file YAML).

## Word count gate

All bodies (HTML after frontmatter) are **≥ 1,850 words** by generator guard; observed range after generation **~3,770–4,016 words** (strip-tags word count).

## SEO completeness

Every file includes `title`, `slug`, `excerpt`, `category`, `tags`, `seoTitle`, `seoDescription`, `canonicalUrl` (`/blog/{slug}`), `authorDisplayName`, `medicalReviewerName`, `disclaimer`, `publishedAt`, `updatedAt`.

## Internal links

Each post includes **Suggested internal links** with five rotating `/blog/{slug}` links to existing long-tail nursing articles plus `/app/lessons`, `/app/questions`, `/app/practice-tests`, `/app/flashcards`, `/app/labs`, `/app/ecg-video-quiz`, `/app/account/progress`, `/app/dashboard`.

## Slug collisions (DB wins)

None of the **new** batch slugs appeared in the live DB overlap list from `diagnose:blog-slug-collisions` (overlap remains on pre-existing supplement slugs). Batch slugs use distinct `-np-certification` / `-for-nps-certification` / `-for-whnp-certification` suffix patterns.

## Excluded failures

None: generator throws if any post is below `MIN_WORDS` or if topic count ≠ 50.

## Validation commands (from `nursenest-core/`)

| Command | Exit code | Notes |
| --- |:---:| --- |
| `npm run validate:blog-static-longtail` | **0** | Repo long-tail frontmatter + slug uniqueness |
| `npm run diagnose:blog-slug-collisions -- --write-report` | **0** | Writes `docs/reports/blog-slug-collision-diagnostic.txt` |
| `npm run typecheck:critical` | **0** | Long run (~4+ min) in this environment |
| `npm run test:blog-recovery` | **0** | Includes hybrid long-tail contract tests |
| `npm run test:homepage` | **0** | One skipped test; no failures |

## Post index

| Title | Slug | Primary NP track | Word count (approx) |
| --- | --- | --- | ---: |
| Hypertension Guidelines for NPs: Primary Care Integration for Certification Exams | hypertension-guidelines-for-nps | FNP | 3804 |
| Diabetes Management for FNP Students: Glycemic Targets, Therapy Sequencing, and Safety Monitoring | diabetes-management-for-fnp-students | FNP | 3877 |
| COPD Pharmacology Review for NP Certification: Inhaled Therapies, Exacerbations, and Monitoring | copd-pharmacology-review-np-certification | FNP | 3896 |
| Heart Failure Management for NP Certification: Phenotypes, GDMT, and Decompensation Clues | heart-failure-management-np-certification | FNP | 3921 |
| Chest Pain Differential Diagnosis for NP Certification: ACS Mimics, Risk Stratification, and Workup | chest-pain-differential-diagnosis-np-certification | AGPCNP | 3898 |
| Acute Abdominal Pain Workup for NP Certification: Surgical Emergencies, Imaging, and Laboratory Clues | acute-abdominal-pain-workup-np-certification | AGPCNP | 3909 |
| Chronic Kidney Disease Staging for NP Certification: eGFR, Albuminuria, and Medication Safety | chronic-kidney-disease-staging-np-certification | FNP | 3968 |
| Hyperthyroidism vs Hypothyroidism for NP Certification: Symptoms, Labs, and Therapy Monitoring | hyperthyroidism-vs-hypothyroidism-np-certification | FNP | 3969 |
| Anticoagulant Prescribing Review for NP Certification: DOACs, Warfarin, Reversal Concepts, and Monitoring | anticoagulant-prescribing-review-np-certification | FNP | 3829 |
| Asthma Stepwise Therapy for NP Certification: ICS Formulations, Risk Reduction, and Acute Escalation | asthma-stepwise-therapy-np-certification | FNP | 3855 |
| Pediatric Fever Evaluation for NP Certification: Age-Based Risk, Serious Bacterial Infection Clues, and Parent Education | pediatric-fever-evaluation-np-certification | PNP-PC | 3830 |
| ADHD Management Review for NP Certification: Diagnosis Integrity, Stimulants, and Cardiovascular Screening | adhd-management-review-np-certification | PNP-PC | 3789 |
| Depression Treatment Guidelines for NP Certification: SSRI Selection, Monitoring, and Scope-Safe Referral | depression-treatment-guidelines-np-certification | FNP | 3959 |
| Anxiety Disorders for PMHNP Certification: GAD, Panic, Phobias, and Evidence-Informed Therapy Sequencing | anxiety-disorders-for-pmhnp-certification | PMHNP | 3857 |
| Bipolar Disorder Pharmacology for NP Certification: Mood Stabilizers, Antipsychotics, and Monitoring Burdens | bipolar-disorder-pharmacology-np-certification | PMHNP | 3966 |
| Schizophrenia Medication Management for NP Certification: Long-Acting Injectables, Monitoring, and Relapse Prevention | schizophrenia-medication-management-np-certification | PMHNP | 3910 |
| Substance Use Disorder Treatment for NP Certification: MAT Concepts, Stigma Reduction, and Safety Monitoring | substance-use-disorder-treatment-np-certification | PMHNP | 4014 |
| Prenatal Care Basics for WHNP Certification: Visit Cadence, Screening, and High-Risk Referral Triggers | prenatal-care-basics-for-whnp-certification | WHNP | 3893 |
| Contraception Prescribing Review for NP Certification: Hormonal Methods, IUD Counseling, and Contraindication Screening | contraception-prescribing-review-np-certification | WHNP | 3883 |
| STI Management Guidelines for NP Certification: Testing, Treatment Partners, and Special Populations | sti-management-guidelines-np-certification | WHNP | 3899 |
| Sepsis Recognition and Management for NP Certification: qSOFA Context, Lactate, and Escalation Discipline | sepsis-recognition-and-management-np-certification | FNP | 3911 |
| ECG Interpretation for NPs: High-Yield Rhythm and Ischemia Patterns for Certification Study | ecg-interpretation-for-nps-certification | FNP | 3844 |
| ABG Interpretation Advanced Review for NP Certification: Acid–Base, Oxygenation, and Compensation Patterns | abg-interpretation-advanced-review-np-certification | AGPCNP | 3892 |
| Acute Stroke Management for NP Certification: Time Windows, Imaging Decisions, and Blood Pressure Controversies | acute-stroke-management-np-certification | AGPCNP | 3901 |
| Migraine Differential Diagnosis for NP Certification: Primary Headache Syndromes vs Secondary Emergencies | migraine-differential-diagnosis-np-certification | FNP | 3888 |
| Pneumonia Treatment Guidelines for NP Certification: Outpatient Regimens, Severity Tools, and Follow-Up | pneumonia-treatment-guidelines-np-certification | FNP | 3890 |
| UTI Treatment Considerations for NP Certification: Uncomplicated Cystitis, Pyelonephritis, and Special Populations | uti-treatment-considerations-np-certification | WHNP | 3876 |
| Osteoporosis Screening Guidelines for NP Certification: DXA Timing, FRAX Concepts, and Treatment Thresholds | osteoporosis-screening-guidelines-np-certification | WHNP | 3902 |
| Lipid Management Review for NP Certification: Statin Intensity, Add-On Therapies, and ASCVD Risk Tools | lipid-management-review-np-certification | FNP | 3885 |
| Obesity Pharmacotherapy for NP Certification: GLP-1 Agonists, Contraindications, and Monitoring Plans | obesity-pharmacotherapy-np-certification | FNP | 3874 |
| Polypharmacy in Older Adults for NP Certification: Deprescribing, Beer Criteria Concepts, and Fall Risk | polypharmacy-in-older-adults-np-certification | AGPCNP | 3894 |
| Delirium vs Dementia for NP Certification: Acute Workup, CAM Clues, and Safety Planning | delirium-vs-dementia-np-certification | AGPCNP | 3880 |
| Pediatric Developmental Milestones for NP Certification: Surveillance, Red Flags, and Referral Timing | pediatric-developmental-milestones-np-certification | PNP-PC | 3872 |
| Menopause Management for NP Certification: Vasomotor Therapies, Bone Health, and Shared Decision-Making | menopause-management-np-certification | WHNP | 3866 |
| Thyroid Medication Management for NP Certification: Levothyroxine Dosing, Monitoring, and Special Populations | thyroid-medication-management-np-certification | FNP | 3882 |
| Insulin Therapy Intensification for NP Certification: Basal–Bolus Concepts, Hypoglycemia Prevention, and Titration Rules | insulin-therapy-intensification-np-certification | FNP | 3906 |
| Chronic Pain Management for NP Certification: Multimodal Plans, Risk Tools, and Functional Goals | chronic-pain-management-np-certification | FNP | 3861 |
| Opioid Prescribing Safety for NP Certification: PDMP Use, MME Concepts, Naloxone, and Taper Principles | opioid-prescribing-safety-np-certification | FNP | 3863 |
| Dermatology Lesion Assessment for NP Certification: Benign Mimics, Melanoma Clues, and Biopsy Thresholds | dermatology-lesion-assessment-np-certification | FNP | 3849 |
| Lyme Disease Diagnosis for NP Certification: Endemic Risk, Erythema Migrans, and Testing Limitations | lyme-disease-diagnosis-np-certification | FNP | 3859 |
| Rheumatoid Arthritis Overview for NP Certification: Inflammatory Clues, Labs, and DMARD Monitoring Themes | rheumatoid-arthritis-overview-np-certification | FNP | 3891 |
| GERD Management Review for NP Certification: PPI Trials, Alarm Features, and Maintenance Strategies | gerd-management-review-np-certification | FNP | 3868 |
| Liver Function Interpretation for NP Certification: Hepatocellular vs Cholestatic Patterns, Imaging, and Medication Review | liver-function-interpretation-np-certification | FNP | 3886 |
| Iron Deficiency Anemia Workup for NP Certification: Ferritin Nuances, GI Evaluation, and Replacement Therapy | iron-deficiency-anemia-workup-np-certification | FNP | 3870 |
| GI Bleed Differential Diagnosis for NP Certification: Upper vs Lower Sources, Risk Stratification, and Stabilization | gi-bleed-differential-diagnosis-np-certification | AGPCNP | 3878 |
| Evidence-Based Practice for NP Students: Appraisal, Guidelines, and Certification-Style Application Questions | evidence-based-practice-for-np-students-certification | FNP | 3851 |
| SOAP Note Documentation Review for NP Certification: Assessment Synthesis, Plan Measurability, and Compliance | soap-note-documentation-review-np-certification | FNP | 3847 |
| Differential Diagnosis Frameworks for NP Certification: VINDICATE Mnemonics, Risk Stratification, and Test Selection | differential-diagnosis-frameworks-np-certification | FNP | 3865 |
| How to Pass the FNP Certification Exam: Study Architecture, Weak-Area Drills, and Test-Day Strategy | how-to-pass-fnp-certification-exam | FNP | 3836 |
| PMHNP Board Exam Study Strategies: Psychopharmacology Depth, Ethics Items, and Case-Based Practice | pmhnp-board-exam-study-strategies-certification | PMHNP | 3820 |

## truthpack / CTA

`.vibecheck/truthpack/copy.json` was **not present** in this workspace clone; premium CTA copy is authored inline in the generator and posts.
