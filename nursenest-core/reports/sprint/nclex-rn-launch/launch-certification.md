# NCLEX-RN Launch Certification — Baseline

**Generated:** 2026-06-01T18:07:04.013542+00:00  
**Data source:** Static audit (pre-sprint baseline; run sprint-6 with live DB for post-sprint results)

## Verdict

❌ **NOT READY** — 8 critical gates failing

**5 / 19** gates passing

## Gate Checklist

| Gate | Actual | Min | Target | Status |
|---|---:|---:|---:|:---:|
| Total published questions | 12,838 | 10,000 | 20,000 | ✓ |
| CAT-eligible questions | 11,660 | 3,000 | 5,000 | ✓ |
| Flashcards (published) | 0 | 15,000 | 25,000 | ❌ |
| Practice exam sets | 0 | 100 | 500 | ❌ |
| Questions missing rationale (= 0) | 638 | 0 | 0 | ❌ |
| Invalid bowtie payloads (= 0) | 392 | 0 | 0 | ❌ |
| Questions missing options (= 0) | 97 | 0 | 0 | ❌ |
| questionFormat tagged (≥ 90%) | 0 | 90 | 100 | ❌ |
| MCQ questions (≥ 3,500) | 0 | 3,500 | 7,000 | ⚠ |
| SATA questions (≥ 1,500) | 0 | 1,500 | 3,000 | ❌ |
| Bowtie questions (≥ 1,000) | 392 | 1,000 | 2,000 | ❌ |
| Matrix questions (≥ 1,000) | 0 | 1,000 | 2,000 | ⚠ |
| Ordering/prioritization (≥ 150) | 0 | 150 | 500 | ⚠ |
| Hotspot questions (≥ 100) | 0 | 100 | 500 | ⚠ |
| L1 Easy (≥ 3%) | 0.3 | 3 | 10 | ⚠ |
| L2 Moderate-Easy (≥ 10%) | 11.9 | 10 | 20 | ✓ |
| L4 Hard (≥ 15%) | 23.4 | 15 | 25 | ✓ |
| L5 Very Hard (≥ 3%) | 0.4 | 3 | 5 | ⚠ |
| Production-ready lessons (≥ 100) | 132 | 100 | 500 | ✓ |

## Critical Failures (blocks launch)

- ❌ **flashcards**: need +15,000 to reach minimum (current: 0 / min: 15,000)
- ❌ **practice_exams**: need +100 to reach minimum (current: 0 / min: 100)
- ❌ **missing_rationale**: need +-638 to reach minimum (current: 638 / min: 0)
- ❌ **invalid_bowtie**: need +-392 to reach minimum (current: 392 / min: 0)
- ❌ **missing_options**: need +-97 to reach minimum (current: 97 / min: 0)
- ❌ **format_tagged_pct**: need +90 to reach minimum (current: 0 / min: 90)
- ❌ **fmt_sata**: need +1,500 to reach minimum (current: 0 / min: 1,500)
- ❌ **fmt_bowtie**: need +608 to reach minimum (current: 392 / min: 1,000)

## Sprint Tasks Required

| # | Task | Script | Closes gates |
|---|---|---|---|
| 1 | Backfill questionFormat | sprint-1-backfill-question-format.mts | format_tagged_pct, fmt_sata, fmt_bowtie, fmt_matrix |
| 2 | Repair bowtie CAT validation | sprint-2-repair-bowtie-cat.mts | invalid_bowtie, fmt_bowtie |
| 3 | Generate 638 missing rationales | sprint-3-generate-missing-rationales.mts | missing_rationale |
| 4 | Generate 15,000 flashcards | sprint-4-generate-nclex-rn-flashcards.mts | flashcards |
| 5 | Generate 500 practice exam sets | sprint-5-generate-nclex-rn-practice-exams.mts | practice_exams |
| 6 | Re-run this audit | sprint-6-launch-certification.mts | — |

---
*Run `npx tsx scripts/sprint-6-launch-certification.mts` after each sprint task to track progress.*
