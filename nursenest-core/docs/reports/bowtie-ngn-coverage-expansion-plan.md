# Bowtie/NGN Coverage Expansion Plan

Generated: 2026-05-10

## Scope Rules

Bowtie and Trend rows are supported anywhere the learner question runner uses `tryNormalizeBowtiePayload`, `BowtieQuestionRenderer`, and `gradeMatches`: practice/review sessions, rationale reveal, readiness analytics that aggregate `exam_questions`, remediation links that reuse eligible `exam_questions`, New Grad practice, NP practice, RPN/REx-PN, LPN/NCLEX-PN, Allied practice, and Pre-Nursing foundation practice.

CAT remains partially constrained: the UI can render bowties, but CAT pool completeness historically expects array-shaped options in some balancing paths. The current expansion treats bowties as practice/review/readiness eligible and documents CAT inclusion as gated by CAT completeness validation.

Allied support is intentionally limited to profession-appropriate respiratory, paramedic/EMT, MLT/lab, and PTA/rehab-style safety scenarios. Pre-Nursing support is limited to clinical reasoning foundations rather than full NGN simulation.

## Current Coverage Matrix

| Tier | Exam | Country | Supported scope | Current | Target | Gap | Priority |
|---|---|---:|---|---:|---:|---:|---|
| RN | NCLEX-RN | US/CA | Existing RN bowtie/trend pool | 443 | 1000 | 557 | High |
| RPN | REx-PN | CA | Native RPN/REx-PN practice/review/readiness | 75 | 1000 | 925 | High |
| LVN/LPN | NCLEX-PN | US | Native practical nursing practice/review/readiness | 75 | 1000 | 925 | High |
| NP | NP | US | Native NP assessment/diagnostics/management | 75 | 1000 | 925 | High |
| New Grad | New Grad Transition | US | Transition-to-practice scenarios | 50 | 1000 | 950 | Medium |
| Allied | ALLIED | US | Respiratory, paramedic/EMT, MLT/lab, PTA safety only | 32 | 1000 | 968 | Medium |
| Pre-Nursing | Pre-Nursing Foundations | US | Foundation reasoning only | 20 | 1000 | 980 | Low |

## System Distribution Requirements

| System/category | RPN | LVN/LPN | NP | New Grad | Allied | Pre-Nursing |
|---|---:|---:|---:|---:|---:|---:|
| Cardiovascular | 5 | 5 | 5 | 4 | 8 | 4 |
| Respiratory | 5 | 5 | 5 | 4 | 8 | 4 |
| Endocrine | 5 | 5 | 5 | 3 | 0 | 4 |
| Neurological | 5 | 5 | 5 | 3 | 0 | 0 |
| Renal/Urinary | 5 | 5 | 5 | 3 | 0 | 4 |
| Gastrointestinal | 5 | 5 | 5 | 3 | 0 | 0 |
| Maternal/Newborn | 5 | 5 | 5 | 3 | 0 | 0 |
| Pediatric | 5 | 5 | 5 | 3 | 0 | 0 |
| Mental Health | 5 | 5 | 5 | 3 | 0 | 0 |
| Pharmacology | 5 | 5 | 5 | 3 | 0 | 0 |
| Infection/Sepsis | 5 | 5 | 5 | 3 | 0 | 0 |
| Safety/Prioritization | 5 | 5 | 4 | 3 | 8 | 0 |
| Delegation | 5 | 5 | 4 | 3 | 0 | 0 |
| Labs/Diagnostics | 5 | 5 | 4 | 3 | 8 | 4 |
| ECG/Arrhythmia | 0 | 0 | 4 | 3 | 0 | 0 |
| Fluids/Electrolytes | 5 | 5 | 4 | 3 | 0 | 0 |

No new nursing batch has a single system over 7% of that tier batch. Allied is intentionally concentrated across four profession-appropriate tracks at 25% each.

## Inclusion / Exclusion Decisions

| Surface | Decision | Notes |
|---|---|---|
| Practice Exams | Include | Renderer and grading support structured bowtie payloads. |
| Review Mode | Include | Rationale reveal supports bowtie selected/correct mapping. |
| Readiness Reports | Include | Counts and attempts can aggregate by `exam_questions` metadata. |
| Remediation | Include | Uses question IDs and study links; no new client-only bypass. |
| CAT Exams | Conditional | UI supports bowtie; object-shaped options require dedicated CAT completeness checks before broad inclusion. |
| New Grad modules | Include | Native transition-to-practice rows added. |
| NP exams | Include | Native NP rows focus on differential/diagnostic/management decisions. |
| RPN/REx-PN | Include | Native RPN rows added, Canadian region scoped. |
| LPN/NCLEX-PN | Include | Native LVN/LPN rows added, U.S. region scoped. |
| Allied Health practice | Limited include | Only respiratory, paramedic/EMT, MLT/lab, and PTA safety styles. |
| Pre-Nursing | Foundation only | Not positioned as full NGN exam simulation. |

## Next Scaling Priorities

1. Add clinically reviewed RN gap batches to move RN from 443 to 1000 without remapping existing rows.
2. Expand RPN/LPN/NP in 100-150 question increments with clinical review gates.
3. Add CAT-specific completeness tests before including bowties in all adaptive pool paths.
4. Expand Allied only after each profession scope has explicit pathway support and review criteria.
