# Rationale Repetition Audit

Generated: 2026-05-31T04:42:06.490Z

This audit detects rationale language that can make NurseNest content feel templated instead of authored by an experienced clinician educator.

## Pattern Summary

| Pattern | Count | Severity | Meaning |
| --- | --- | --- | --- |
| is_correct_because | 2 | high | Circular or templated correct-answer phrasing detected. |
| cross_item_reuse | 2 | medium | Rationale text appears reused across 2 items. |

## Reused Text Blocks

| Occurrences | Repeated Text |
| --- | --- |
| 2 | routine oxygen in a normoxic stemi patient spo 97 causes coronary vasoconstriction and worsens outcomes use oxygen only if spo 94 |

## Flagged Records

| Pattern | Severity | Pool | Score | Source | Excerpt |
| --- | --- | --- | --- | --- | --- |
| is_correct_because | high | NP | 1 | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:400 | is correct because |
| is_correct_because | high | NP | 11 | src/content/questions/cnple-practical-nursing-ngn-expansion.ts:426 | is correct because |
| cross_item_reuse | medium | ECG | 23 | src/lib/ecg-module/ecg-ngn-cases.ts:414 | Routine oxygen in a normoxic STEMI patient (SpO₂ 97%) causes coronary vasoconstriction and worsens ... |
| cross_item_reuse | medium | ECG | 16 | src/lib/ecg-module/ecg-simulation-catalog.ts:652 | Routine oxygen in a normoxic STEMI patient (SpO₂ 97%) causes coronary vasoconstriction and worsens ... |

## Required Remediation

- Replace circular statements such as "is correct because" with cue-specific clinical reasoning.
- Replace "option X is incorrect because" templates with a specific explanation of the distractor trap.
- Rewrite repeated phrases so each rationale reflects its own patient cue, pathway, and safety implication.
- Prioritize records that are both repeated and below the 85 publish-eligible gate.
