# New Zealand RN long-tail hybrid static SEO batch (35 posts)

## Post count note (resolved contradiction)

The brief referenced both **~200 posts** and **"Generate 30–35 posts."** This batch **delivers exactly 35** published long-tail files (within the 30–35 band). The larger figure is **not** implemented here; treat it as out of scope for this slice.

## Batch summary

| Item | Value |
| --- | --- |
| Output directory | `src/content/blog-static-longtail/` |
| New markdown files | **35** (unique kebab-case slugs) |
| Audience | Internationally educated nurses orienting to **Aotearoa New Zealand** practice and **NCNZ** registration themes |
| Content source | In-repo authored HTML (no external paid AI APIs) |
| Schema | Matches existing `blog-static-longtail` frontmatter + HTML body pattern (disclaimer markers, `canonicalUrl` = `/blog/{slug}`, FAQ `h3` blocks under `FAQ Schema Questions`, APA-7 style web references without fabricated DOIs) |

## Slug collision / DB precedence

`npm run diagnose:blog-slug-collisions -- --write-report` reported **8** live DB slugs overlapping the **global** supplement union (pre-existing clinical long-tails). **None of the 35 new NZ batch slugs** appeared in that overlap list — **no renames required** for this batch.

Diagnostic output file: `docs/reports/blog-slug-collision-diagnostic.txt`.

## SEO / quality checklist (per post)

- **Title + `seoTitle`**: NZ / NCNZ / international nurse long-tail phrasing; `| NurseNest` on `seoTitle`.
- **`seoDescription`**: reuses focused `excerpt` text.
- **Sections**: Introduction; Key Takeaways; registration/practice context; clinical priorities (topic-specific lead paragraph); safety; documentation; communication/teaching; escalation; exam/orientation review; internal links; Premium CTA; FAQ schema pattern; APA-7 references (NCNZ, Te Whatu Ora, Ministry of Health NZ, WHO patient safety — verify live page titles before academic submission).
- **Cultural safety / Māori health**: educational, respectful, non-stereotyping; Te Tiriti-aware framing at high level; defers tikanga specifics to workplace training.
- **Internal links**: five rotating `/blog/*` clinical long-tails + `/app/dashboard`.

## Posts (slug, title, word count — `wc -w` full file)

| # | Slug | Title | Words |
| --- | --- | --- | --- |
| 1 | ncnz-rn-registration-steps-international-nurses-guide | NCNZ RN registration: steps for internationally qualified nurses (educational guide) | 1175 |
| 2 | cap-competence-assessment-program-nursing-nz-explained | CAP for nurses in Aotearoa New Zealand: competence assessment program basics | 1186 |
| 3 | nursing-in-new-zealand-health-system-overview-international-rns | Nursing in Aotearoa New Zealand: health system overview for internationally educated RNs | 1181 |
| 4 | cultural-safety-new-zealand-nursing-practice-basics | Cultural safety in Aotearoa New Zealand nursing: respectful foundations for practice | 1166 |
| 5 | maori-health-wellbeing-te-tiriti-aware-nursing-education | Māori health and wellbeing: Te Tiriti-aware nursing education at a careful introductory level | 1177 |
| 6 | medication-safety-nz-rn-scope-checks-reconciliation-basics | Medication safety for RNs in Aotearoa New Zealand: checks, reconciliation, and escalation habits | 1183 |
| 7 | sepsis-nursing-care-new-zealand-escalation-recognition | Sepsis nursing care in Aotearoa New Zealand: recognition, escalation, and documentation cues | 1166 |
| 8 | copd-nursing-review-new-zealand-community-hospital | COPD nursing review for Aotearoa New Zealand: community and hospital considerations | 1158 |
| 9 | stroke-nursing-assessment-fasts-new-zealand-context | Stroke nursing assessment: FAST messaging and neurovascular monitoring in an Aotearoa New Zealand study context | 1182 |
| 10 | documentation-standards-nursing-new-zealand-educational | Documentation standards for nursing in Aotearoa New Zealand: educational orientation checklist | 1162 |
| 11 | falls-prevention-nursing-multi-factor-strategies-nz | Falls prevention nursing: multifactor strategies for hospitals and aged residential care (Aotearoa study lens) | 1169 |
| 12 | pressure-injury-prevention-nursing-evidence-based-care | Pressure injury prevention: nursing assessment, staging language, and repositioning fundamentals | 1154 |
| 13 | oxygen-therapy-nursing-safety-spo2-targets-education | Oxygen therapy nursing safety: SpO2 targets, devices, and reassessment for exam preparation | 1160 |
| 14 | ecg-interpretation-nursing-foundations-rhythm-recognition | ECG interpretation foundations for nurses: rate, rhythm, ischemia clues, and escalation judgment | 1164 |
| 15 | therapeutic-communication-nursing-patient-centered-care | Therapeutic communication for nurses: trauma-informed pacing and teach-back | 1143 |
| 16 | clinical-prioritization-registered-nurses-abc-stable-unstable | Clinical prioritization for registered nurses: ABCs, Maslow, and stable versus unstable stems | 1153 |
| 17 | time-management-shift-work-nursing-safety-priorities | Time management and shift organisation for RNs: safety-first batching and delegation boundaries | 1154 |
| 18 | transitioning-international-nurse-to-new-zealand-practice | Transitioning into Aotearoa New Zealand nursing practice: orientation, preceptorship, and cultural humility | 1150 |
| 19 | te-whatu-ora-health-new-zealand-roles-nursing-education | Te Whatu Ora and population health: what international nurses should study at an introductory level | 1168 |
| 20 | rn-scope-practice-nursing-council-new-zealand-overview | RN scope of practice in Aotearoa New Zealand: Nursing Council frameworks as study anchors | 1171 |
| 21 | nursing-competencies-practice-assessment-nz-orientation | Nursing competencies and practice assessment during NZ orientation: documentation and feedback loops | 1152 |
| 22 | rural-nursing-new-zealand-access-continuity-challenges | Rural nursing in Aotearoa New Zealand: access, transport, and continuity themes for exam-oriented learners | 1158 |
| 23 | medicines-reconciliation-nursing-handoffs-transitions-nz | Medicines reconciliation at transitions of care: nursing responsibilities and communication scripts | 1148 |
| 24 | infection-prevention-control-nursing-hospital-community-nz | Infection prevention and control for nurses: PPE, transmission-based precautions, and outbreak awareness | 1151 |
| 25 | mental-health-nursing-new-zealand-collaboration-safety-education | Mental health nursing in Aotearoa New Zealand: collaboration, least restrictive care, and safety education | 1154 |
| 26 | primary-health-care-nursing-new-zealand-longtail-guide | Primary health care nursing in Aotearoa New Zealand: prevention, screening, and chronic disease partnerships | 1157 |
| 27 | acc-injury-care-nursing-documentation-basics-nz-education | ACC and injury-related care: nursing documentation basics in an Aotearoa New Zealand educational context | 1164 |
| 28 | child-youth-nursing-safeguarding-escalation-nz-context | Child and youth health nursing: safeguarding, consent, and escalation patterns (Aotearoa educational framing) | 1151 |
| 29 | med-safety-event-learning-quality-improvement-nursing-nz | Medication safety events and learning systems: quality improvement mindset for nurses | 1155 |
| 30 | consent-capacity-health-nursing-assessment-education-nz | Consent and capacity in health care: nursing assessment education for Aotearoa New Zealand learners | 1160 |
| 31 | palliative-end-of-life-nursing-comfort-communication-nz | Palliative and end-of-life nursing: comfort, family communication, and sacred space awareness | 1156 |
| 32 | diabetes-nursing-care-hyperglycemia-education-nz-context | Diabetes nursing care: hyperglycemia, sick-day rules, and foot risk education with Aotearoa study framing | 1149 |
| 33 | wound-care-assessment-documentation-nursing-fundamentals | Wound care fundamentals for nurses: assessment, infection signs, and measurement documentation | 1149 |
| 34 | iv-fluid-monitoring-nursing-electrolytes-safety-review | IV fluid therapy monitoring: nursing assessment, electrolytes, and overload vigilance | 1150 |
| 35 | professional-conduct-notifications-nursing-council-nz-education | Professional conduct and notifications: Nursing Council of New Zealand educational orientation (not legal advice) | 1159 |

## Validation (npm exit codes)

| Command | Exit |
| --- | ---: |
| `npm run validate:blog-static-longtail` | 0 |
| `npm run diagnose:blog-slug-collisions -- --write-report` | 0 |
| `npm run typecheck:critical` | 0 (after removing corrupted `nursenest-core/.next/dev`; see note) |
| `npm run test:blog-recovery` | 0 |
| `npm run test:homepage` | 0 |

**Typecheck note:** First `npm run typecheck:critical` failed on a corrupted `.next/dev/types/routes.d.ts`. After `rm -rf nursenest-core/.next/dev`, `npx tsc --noEmit --incremental false -p tsconfig.typecheck-critical.json` exited 0.

## Path note (requested `nursenest-core/reports/`)

Automated Write to `nursenest-core/reports/` was blocked by workspace rules. This report is stored at **`nursenest-core/docs/reports/new-zealand-rn-longtail-batch-35.md`**. Copy to `nursenest-core/reports/` locally if required.

## Files changed

- 35 new files under `nursenest-core/src/content/blog-static-longtail/` (slugs in table).
- This report: `nursenest-core/docs/reports/new-zealand-rn-longtail-batch-35.md`.
