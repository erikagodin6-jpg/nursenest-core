# CAT question-type coverage

**Generated:** 2026-06-01T22:21:14.650Z

DATABASE_URL not set — run against a configured database for SQL counts.

## Runtime renderer matrix (static)

| Logical format | Example question_type labels | Client renderer | Positive E2E | Notes / exclusion |
| --- | --- | --- | --- | --- |
| mcq | MCQ, MULTIPLE_CHOICE, multiple_choice | mcq | yes | — |
| sata | SATA, SELECT_ALL_THAT_APPLY | sata | yes | — |
| bowtie_trend | Bowtie, NGN_BOWTIE, Trend, TREND | bowtie | yes | — |
| matrix_grid | MATRIX, MATRIX_GRID, MATRIX_MULTI_SELECT | unsupported_fallback | no | Structured matrix / grid options require a dedicated runner; client shows safe fallback (role=alert) until a matrix renderer ships. |
| cloze_dropdown | CLOZE, DROPDOWN, FILL_IN_BLANK | unsupported_fallback | no | Cloze / dropdown JSON shapes are not flattened to MCQ; runner refuses non-scalar option arrays. |
| ordered_priority | ORDERED, PRIORITY, DELEGATION | unsupported_fallback | no | Ordering / priority interactions are not implemented in the CAT shell; type hint or structured options trigger fallback. |
| exhibit_chart | EXHIBIT, CHART, LAB_TABLE | unsupported_fallback | no | `SPECIALIZED_TYPE_HINTS` treats EXHIBIT/CHART/LAB tokens as specialized even when `options` are MCQ-shaped, so the runner shows the safe fallback until labels are normalized to MCQ/SATA or a dedicated exhibit shell exists. |
| case_unfolding | NGN_CASE, CASE_STUDY, UNFOLDING | unsupported_fallback | no | Case / unfolding multi-part shells are not wired into the licensing CAT runner; specialized type tokens or non-list options use fallback. |
| hotspot_image | HOTSPOT, HOT_SPOT, IMAGE_ITEM | unsupported_fallback | no | Image map / hotspot answering is not implemented in CAT exam mode; MCQ-only stem images may still appear as presentational chrome for MCQ items. |
| ecg_video | ecg_video | unsupported_fallback | n/a | `NON_ECG_PRACTICE_EXAM_WHERE` removes ECG video rows from the RN/PN practice + CAT pool; NP/live-strip surfaces are out of scope for this matrix. |
