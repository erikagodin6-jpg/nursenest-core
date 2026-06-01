# NCLEX-RN Format Distribution Audit

Generated: 2026-06-01T22:26:18.272Z

Deterministic question format metadata backfill was applied before this audit: **7,667** previously untagged NCLEX-RN questions were tagged by existing question structure. No stems, answers, rationales, or options were generated or modified.

## Next Gen Format Targets

| Format | Actual | Target Minimum | Deficit | Status |
| --- | --- | --- | --- | --- |
| multiple_choice | 9034 | 3500 | 0 | PASS |
| sata | 1635 | 1500 | 0 | PASS |
| bowtie | 392 | 1000 | 608 | SHORT |
| matrix | 197 | 500 | 303 | SHORT |
| ordering | 730 | 500 | 0 | PASS |
| hotspot | 0 | 500 | 500 | SHORT |
| calculation | 0 | 300 | 300 | SHORT |
| ecg | 0 | 300 | 300 | SHORT |
| case_study | 0 | 0 | 0 | PASS |
| trend | 51 | 0 | 0 | PASS |
| cloze | 0 | 0 | 0 | PASS |
| matrix_mr | 0 | 0 | 0 | PASS |

## Actual questionFormat Distribution

| questionFormat | Count |
| --- | --- |
| multiple_choice | 9034 |
| sata | 1635 |
| ordering | 730 |
| exhibit | 557 |
| bowtie | 392 |
| matrix | 197 |
| drag_drop | 119 |
| hot_spot | 110 |
| fill_in | 77 |
| trend | 51 |

## Auto-Generation Status

Additional item generation was **not executed** because no high-quality generation provider is configured in this environment (ANTHROPIC_API_KEY, OPENROUTER_API_KEY, and OPENAI_API_KEY are missing). Generating 2,011 NGN items without a clinical-grade generation/review provider would violate the sprint rule against placeholder or generic content.
