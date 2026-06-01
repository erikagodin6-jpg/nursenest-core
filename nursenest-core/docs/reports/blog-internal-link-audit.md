# Blog Internal Link Audit
Generated: 2026-06-01

## Data Source Note
Database unavailable. Analysis covers 4,595 longtail markdown posts + 3 static TS posts = 4,598 total. Link detection parses `href="/"` patterns from raw file content. The blog post page applies `applyAutoLinksToHtml()` at render time, which may inject additional `/app/` links from `relatedLessonPaths` and `relatedTools`. The counts below reflect **authored content only**, not runtime-injected links.

---

## Summary
| Threshold | Count | % of Published |
|-----------|-------|----------------|
| Articles with 0 links | 70 | 1.5% |
| Articles with <3 internal links | 70 | 1.5% |
| Articles with 3-4 internal links | 4 | 0.1% |
| Articles with <5 internal links (total) | 74 | 1.6% |
| Articles with 5-9 internal links | 3,946 | 85.9% |
| Articles with 10+ internal links | 575 | 12.5% |
| Average internal links per article | 6.9 | — |

**Note:** The 3 static TS posts have 11–13 internal links each (well-linked). The above statistics cover longtail posts only.

### Static TS Posts Link Detail
| Title | Lesson Links | Flashcard Links | Practice Test Links | Blog Links | Total | Flag |
|-------|-------------|----------------|--------------------|-----------:|------:|------|
| Clinical judgment on exam day | 4 | 1 | 0 | 4 | 13 | OK |
| Pharmacology study that sticks | 3 | 0 | 0 | 3 | 11 | OK |
| Lab trends that matter in AKI | 3 | 1 | 0 | 2 | 11 | OK |

*Note: Static TS posts use `/question-bank`, `/flashcards`, `/tools`, `/us/rn/nclex-rn/lessons`, and `/pre-nursing/lessons/*` paths — not `/app/` prefixed paths. Auto-link injection at render time may add `/app/` links.*

---

## Per-Article Link Audit (Critical and Medium — All 74 Under-Threshold Articles)

| Slug | Locale | Lesson | Flashcard | Practice Test | Blog | Total | Flag |
|------|--------|--------|-----------|---------------|------|-------|------|
| abg-interpretation-tricks-for-rt-students | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| best-aemca-study-tips | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| copd-management-for-respiratory-therapy-students | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| free-respiratory-therapy-practice-questions | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| how-to-pass-respiratory-therapy-board-exam | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| how-to-study-for-aemca-exam | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| hyperkalemia-ecg-changes-explained | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| nclex-patho-abg-post-arrest-pipeline | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| nclex-patho-ards-prone-pipeline | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| nclex-patho-qsofa-sirs-pipeline | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| nclex-patho-sglt2-hf-pipeline | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| nclex-patho-siadh-csw-pipeline | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| nclex-prioritization-questions-rationales | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| newgrad-nursing-after-charting-backlog-on-telemetry-rebuildi-pipeline | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| newgrad-nursing-after-code-blue-on-labor-delivery-rebuilding-pipeline | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| newgrad-nursing-after-night-shift-on-ltc-rebuilding-momentum-pipeline | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| newgrad-nursing-after-patient-death-on-dialysis-rebuilding-m-pipeline | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| newgrad-nursing-after-patient-death-on-step-down-rebuilding-pipeline | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| newgrad-nursing-after-preceptor-conflict-on-icu-rebuilding-m-pipeline | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| newgrad-nursing-after-shift-report-on-rehab-rebuilding-momen-pipeline | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| newgrad-nursing-calling-the-provider-on-same-day-surgery-as-pipeline | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| newgrad-nursing-first-end-of-shift-anxiety-on-psychiatry-as-pipeline | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| newgrad-nursing-first-med-pass-delays-on-the-ed-as-a-new-gra-pipeline | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| newgrad-nursing-first-missed-assessment-on-home-health-as-a-pipeline | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| newgrad-nursing-first-preceptor-conflict-on-dialysis-as-a-ne-pipeline | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| newgrad-nursing-first-unsafe-staffing-on-ltc-as-a-new-grad-n-pipeline | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| newgrad-nursing-from-orientation-to-labor-delivery-what-miss-pipeline | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| newgrad-nursing-from-orientation-to-med-surg-what-charting-b-pipeline | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| newgrad-nursing-from-orientation-to-pediatrics-what-patient-pipeline | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| newgrad-nursing-from-orientation-to-rehab-what-preceptor-con-pipeline | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| newgrad-nursing-from-orientation-to-same-day-surgery-what-mi-pipeline | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| newgrad-nursing-from-orientation-to-step-down-what-charting-pipeline | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| newgrad-nursing-from-orientation-to-step-down-what-code-blue-pipeline | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| newgrad-nursing-from-orientation-to-step-down-what-rapid-res-pipeline | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| newgrad-nursing-handling-angry-families-on-dialysis-as-a-new-pipeline | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| newgrad-nursing-handling-angry-families-on-pediatrics-as-a-n-pipeline | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| newgrad-nursing-handling-charting-backlog-on-pediatrics-as-a-pipeline | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| newgrad-nursing-handling-end-of-shift-anxiety-on-dialysis-as-pipeline | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| newgrad-nursing-handling-night-shift-on-same-day-surgery-as-pipeline | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| newgrad-nursing-handling-rapid-response-on-pediatrics-as-a-n-pipeline | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| newgrad-nursing-handling-shift-report-on-same-day-surgery-as-pipeline | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| newgrad-nursing-missed-assessment-on-dialysis-as-a-new-grad-pipeline | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| newgrad-nursing-missed-assessment-on-icu-a-practical-checkli-pipeline | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| newgrad-nursing-missed-assessment-on-psychiatry-a-practical-pipeline | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| newgrad-nursing-missed-assessment-on-telemetry-as-a-new-grad-pipeline | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| newgrad-nursing-new-grads-on-home-health-staying-organized-a-pipeline | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| newgrad-nursing-new-grads-on-icu-staying-organized-around-ni-pipeline | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| newgrad-nursing-new-grads-on-labor-delivery-staying-organize-pipeline | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| newgrad-nursing-new-grads-on-ltc-staying-organized-around-an-pipeline | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| newgrad-nursing-new-grads-on-ltc-staying-organized-around-pr-pipeline | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| newgrad-nursing-new-grads-on-pediatrics-staying-organized-ar-pipeline | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| newgrad-nursing-on-icu-how-new-grad-nurses-handle-code-blue-pipeline | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| newgrad-nursing-on-pediatrics-how-new-grad-nurses-handle-cal-pipeline | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| newgrad-nursing-on-rehab-how-new-grad-nurses-handle-code-blu-pipeline | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| newgrad-nursing-on-rehab-how-new-grad-nurses-handle-missed-a-pipeline | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| newgrad-nursing-on-step-down-how-new-grad-nurses-handle-unsa-pipeline | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| newgrad-nursing-on-telemetry-how-new-grad-nurses-handle-end-pipeline | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| newgrad-nursing-on-the-ed-how-new-grad-nurses-handle-angry-f-pipeline | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| newgrad-nursing-patient-death-on-same-day-surgery-as-a-new-g-pipeline | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| newgrad-nursing-rapid-response-on-rehab-as-a-new-grad-nurse-pipeline | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| newgrad-nursing-unsafe-staffing-on-dialysis-a-practical-chec-pipeline | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| newgrad-nursing-unsafe-staffing-on-icu-a-practical-checklist-pipeline | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| newgrad-nursing-unsafe-staffing-on-same-day-surgery-a-practi-pipeline | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| oxygen-delivery-devices-explained-for-rt-students | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| respiratory-therapy-abg-practice-questions | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| respiratory-therapy-study-guide-for-board-exams | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| ventilator-modes-explained-for-rt-students | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| why-furosemide-can-worsen-electrolyte-problems-on-nursing-exams | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| why-potassium-changes-are-dangerous-in-acute-kidney-injury-nursing-exams | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |
| why-shortness-of-breath-after-iv-fluids-matters-on-nclex-style-questions | en | 0 | 0 | 0 | 0 | 0 | CRITICAL |

### Medium Threshold Articles (3-4 links)
| Slug | Locale | Lesson | Flashcard | Practice Test | Blog | Total | Flag |
|------|--------|--------|-----------|---------------|------|-------|------|
| liver-cirrhosis-symptoms-nursing-care | en | 0 | 0 | 0 | 0 | 4 | MEDIUM |
| hypokalemia-pathophysiology-nursing-priorities | en | 0 | 0 | 0 | 0 | 4 | MEDIUM |
| nclex-rn-cardiac-tamponade-nursing-clinical-reasoning | en | 0 | 0 | 0 | 0 | 4 | MEDIUM |
| nclex-rn-nursing-assessment-respiratory-failure | en | 0 | 0 | 0 | 0 | 3 | MEDIUM |

---

## Recommended Links for Under-Linked Articles

### For RT / AEMCA / Paramedic Articles (0 links)
These articles cover respiratory therapy, AEMCA exam prep, and prehospital topics with no internal links. Suggested additions:

1. `abg-interpretation-tricks-for-rt-students` — Add:
   - `<a href="/app/practice-tests">Practice tests for RT exam readiness</a>`
   - `<a href="/app/flashcards">ABG flashcards for spaced recall</a>`
   - `<a href="/blog/abg-interpretation-advanced-review-np-certification">ABG interpretation advanced review</a>`

2. `ventilator-modes-explained-for-rt-students` — Add:
   - `<a href="/app/lessons">NurseNest lessons library</a>`
   - `<a href="/app/practice-tests">Ventilator practice questions</a>`
   - `<a href="/blog/rt-auto-peep-dynamic-hyperinflation-equipment-monitoring">Auto-PEEP and dynamic hyperinflation</a>`

3. `respiratory-therapy-study-guide-for-board-exams` — Add:
   - `<a href="/app/practice-tests">RT board exam practice</a>`
   - `<a href="/app/flashcards">RT study flashcards</a>`
   - `<a href="/blog/abg-interpretation-tricks-for-rt-students">ABG interpretation tricks</a>`

### For NCLEX Pathophysiology Pipeline Stubs (0 links — body is incomplete)
These are pipeline pointer stubs. The primary fix is to complete the body HTML; internal links should be added as part of that process:

4. `nclex-patho-ards-prone-pipeline` — After body completion, add:
   - `<a href="/app/lessons">NCLEX-RN lessons library</a>`
   - `<a href="/app/practice-tests">ARDS practice questions</a>`
   - `<a href="/blog/clinical-judgment-on-exam-day">Clinical judgment on exam day</a>`

5. `nclex-patho-qsofa-sirs-pipeline` — After body completion, add:
   - `<a href="/app/practice-tests">Sepsis practice questions</a>`
   - `<a href="/app/lessons">Critical care lessons</a>`
   - `<a href="/blog/lab-trends-and-acute-kidney-injury">Lab trends in AKI</a>`

### For New Grad Pipeline Stubs (0 links — body is stub text)
New grad nursing pipeline stubs need body completion first. After completion, standard CTA template:
- `<a href="/app/lessons">NurseNest lessons library</a>`
- `<a href="/app/practice-tests">Practice test readiness</a>`
- `<a href="/app/flashcards">Flashcards for medication and assessment</a>`

### For Electrolyte/Pharmacology Posts (0 links)
- `why-furosemide-can-worsen-electrolyte-problems-on-nursing-exams`:
  - `<a href="/app/practice-tests">Electrolyte practice questions</a>`
  - `<a href="/blog/lab-trends-and-acute-kidney-injury">Lab trends in AKI</a>`
  - `<a href="/app/flashcards">Pharmacology flashcards</a>`

- `hyperkalemia-ecg-changes-explained`:
  - `<a href="/app/practice-tests">ECG and cardiac NCLEX questions</a>`
  - `<a href="/app/flashcards">Electrolyte flashcards</a>`
  - `<a href="/blog/lab-trends-and-acute-kidney-injury">Lab trends in AKI</a>`

---

## Link Quality Observation

The vast majority of articles (86%) have 5–9 internal links, primarily in this pattern:
- 5 `/app/` links (lessons, questions, practice-tests, flashcards, labs)
- 3–5 `/blog/` links to related articles

This is a consistent template-generated structure. The 70 zero-link articles are outliers representing either incomplete pipeline stubs or older static content written without the standard link template.
