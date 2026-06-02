# Content Inventory Maturity Standard

Date: 2026-05-31

Purpose: define the minimum content inventory required before a NurseNest exam pathway can be considered launch-ready, mature, competitive, and publication-safe.

This standard applies to RN, PN/RPN/LPN, NP, international nursing, and future exam pathways. It is a governance threshold, not a content-generation target. Pathways below these standards may exist as drafts, waitlists, admin-only previews, or SEO discovery pages, but they should not be positioned as fully mature paid exam ecosystems.

Inventory counts alone do not prove readiness. Every pathway must also satisfy the blueprint, specialty, body system, patient population, lab, ECG, clinical skills, and simulation depth requirements in `docs/blueprint-specialty-depth-requirements.md`.

## Maturity Definitions

| Status | Meaning | Public posture |
|---|---|---|
| `draft` | Pathway architecture exists, but inventory is incomplete. | `published=false`, `launchReady=false`, `visibleInNavigation=false`, `indexable=false`, `adminOnly=true` |
| `launch_candidate` | Pathway meets launch minimums, quality gates, and blueprint coverage. | May enter controlled launch review. |
| `launch_ready` | Pathway meets launch minimums and all required quality, metadata, analytics, and publication checks. | Public launch allowed. |
| `mature` | Pathway meets mature inventory targets and is competitive against major exam-prep alternatives. | Full competitive positioning allowed. |
| `flagship` | Pathway exceeds mature inventory targets, has strong adaptive loops, high-quality rationales, and differentiated simulations/CAT/readiness. | Flagship marketing allowed. |

## Nurse Practitioner Pathways

| Exam | Launch Minimum Questions | Mature Target Questions |
|---|---:|---:|
| CNPLE | 2,500 | 5,000 |
| FNP | 2,500 | 6,000 |
| AGPCNP | 2,500 | 5,000 |
| PMHNP | 2,500 | 5,000 |
| PNP-PC | 2,500 | 4,500 |
| WHNP | 2,500 | 4,000 |
| ENP | 2,500 | 4,000 |

## Registered Nurse Pathways

| Exam | Launch Minimum Questions | Mature Target Questions |
|---|---:|---:|
| NCLEX-RN | 10,000 | 20,000 |
| Canadian NCLEX-RN | 10,000 | 20,000 |
| New Graduate RN | 2,500 | 5,000 |

## Practical Nurse Pathways

| Exam | Launch Minimum Questions | Mature Target Questions |
|---|---:|---:|
| REx-PN | 5,000 | 10,000 |
| NCLEX-PN | 5,000 | 10,000 |

## International Nursing Exams

These are baseline international maturity targets. For prioritized market launches, apply the stricter country/exam thresholds in `docs/international-expansion-roadmap.md` and `docs/global-nursing-exam-multilingual-expansion-framework.md`.

| Exam | Launch Minimum Questions | Mature Target Questions |
|---|---:|---:|
| NMC CBT | 2,500 | 5,000 |
| NMC OSCE | 2,500 | 4,000 |
| AHPRA RN | 2,500 | 5,000 |
| NCNZ RN | 2,500 | 5,000 |
| DHA RN | 2,500 | 4,000 |
| HAAD RN | 2,500 | 4,000 |
| MOH RN | 2,500 | 4,000 |
| Singapore SNB RN | 2,500 | 4,000 |

## Question Type Distribution

Every pathway must maintain this target distribution:

| Question type | Target share |
|---|---:|
| Traditional MCQ | 35% |
| SATA | 15% |
| Bowtie | 10% |
| Matrix | 10% |
| Case Studies | 10% |
| Trend Recognition | 5% |
| Prioritization | 5% |
| Delegation | 3% |
| Documentation | 2% |

No pathway may exceed 50% traditional MCQ.

### Distribution Gate

A pathway fails publication readiness if:

- traditional MCQ exceeds 50%,
- any required question type is absent,
- clinical judgment item types are not blueprint-mapped,
- question types are present but lack rationales, hints, clinical pearls, metadata, or analytics tags.

## Practice Exam Requirements

Every pathway must contain at least 100 full-length practice exams.

Each practice exam must include:

- blueprint weighting,
- randomized pools,
- mixed difficulty,
- tutor mode,
- exam mode,
- detailed rationales,
- hints,
- clinical pearls,
- performance analytics.

Practice exams may be generated from larger governed item pools, but the pool must support 100 full-length exam experiences without repetitive, shallow, or blueprint-distorting reuse.

## CAT Requirements

Every pathway must contain at least 3,000 CAT-eligible questions.

Mature pathways must contain at least 5,000 CAT-eligible questions.

CAT pools must include:

- easy items,
- moderate items,
- hard items,
- high-discrimination items,
- blueprint domain coverage,
- item-level difficulty metadata,
- item-level analytics metadata,
- exclusion rules for unreviewed or low-quality items.

No pathway should claim CAT readiness if the pool is mostly static practice questions without CAT eligibility, difficulty calibration, blueprint mapping, and adaptive routing support.

## Flashcard Requirements

| Exam type | Minimum flashcards |
|---|---:|
| NP | 8,000-12,000 |
| RN | 15,000-25,000 |
| PN | 8,000-15,000 |
| International | 5,000-10,000 |

Every flashcard must include:

- answer,
- clinical pearl,
- memory anchor,
- exam relevance,
- common mistake.

Flashcards that only contain a term and a short answer are draft assets, not launch-ready assets.

## Clinical Judgment Requirements

Every pathway must contain at least:

| Asset type | Minimum |
|---|---:|
| Full NGN-style case studies | 100 |
| Bowties | 150 |
| Matrix cases | 150 |
| Trend interpretation cases | 150 |
| Prioritization cases | 150 |
| Delegation cases | 100 |
| Documentation cases | 100 |
| Multi-shift simulations | 50 |
| Virtual clinical simulations | 50 |

These assets must be mapped to the pathway blueprint and learner analytics model. They cannot be generic clinical judgment content loosely attached to a pathway.

## Publication Readiness Gate

Content is not complete unless all required elements exist:

- lesson,
- flashcards,
- questions,
- rationales,
- hints,
- clinical pearls,
- metadata,
- blueprint mapping,
- adaptive routing,
- CAT eligibility where applicable,
- analytics tagging.

If any required element is missing, the content remains:

```text
DRAFT - NOT READY FOR PUBLICATION
```

Only fully completed content may be marked:

```text
READY FOR PUBLICATION
```

## Pathway Launch Gate

An exam pathway cannot be considered launch-ready unless it passes all of these checks:

| Gate | Requirement |
|---|---|
| Question inventory | Meets launch minimum for the pathway type. |
| Blueprint and specialty depth | Meets `docs/blueprint-specialty-depth-requirements.md`, including major domain distribution, required subtopics, labs, ECG where applicable, skills, and simulations. |
| Question mix | Meets distribution target and traditional MCQ remains at or below 50%. |
| Practice exams | Supports at least 100 full-length blueprint-weighted practice exams. |
| CAT inventory | Contains at least 3,000 CAT-eligible questions where CAT is advertised. |
| Flashcards | Meets minimum flashcard inventory for the pathway type. |
| Clinical judgment | Meets minimum case, bowtie, matrix, trend, prioritization, delegation, documentation, and simulation counts. |
| Quality metadata | Rationales, hints, pearls, blueprint maps, adaptive routing, analytics tags, and publication metadata are complete. |
| Governance | Clinical review, author/reviewer metadata, references, freshness dates, and launch approval are complete. |

## Dashboard Metrics

The pathway readiness dashboard should expose:

- launch minimum progress,
- mature target progress,
- traditional MCQ share,
- non-MCQ clinical judgment share,
- CAT-eligible item count,
- full-length practice exam capacity,
- flashcard count,
- clinical judgment inventory count,
- publication-ready asset count,
- draft asset count,
- missing metadata count,
- missing rationale count,
- missing hint count,
- missing clinical pearl count,
- missing blueprint mapping count,
- missing analytics tag count.

## International Architecture Implication

International pathways with zero lessons, zero questions, generic exam-family shells, or reused NCLEX content without regulator-specific overlays must remain hidden, noindex, and waitlist-only.

Prioritized international markets must also satisfy the tier-specific question, lesson, flashcard, localization, translation, international SEO, country-specific blog, and 95% publication-readiness thresholds in `docs/international-expansion-roadmap.md` and `docs/global-nursing-exam-multilingual-expansion-framework.md`.

International SEO discovery pages may exist earlier, but paid exam pathway claims should wait until:

- local exam blueprint mapping exists,
- scope-of-practice localization exists,
- terminology and medication localization are reviewed,
- pathway inventory meets launch minimums,
- local clinical review is complete,
- billing and support readiness are complete.

This standard prevents international markets from launching as thin repackaged NCLEX pathways.
