# CNPLE Cognitive-Level Distribution Audit
**Generated:** 2026-06-02  
**Phase:** 4 of CNPLE Final Hardening Sprint

---

## Summary

A bug was found and fixed in `cat-inference-maps.ts`: the `"analyz"` substring (US spelling of "analyze") was missing from the `COGNITIVE_LEVEL_TO_LAYER` lookup table. After the fix, 100% of CNPLE questions map cleanly to `CognitiveLayer = L3`. No questions are unmapped.

---

## Bug Found and Fixed

### Root Cause

`COGNITIVE_LEVEL_TO_LAYER` had `["analys", "L3"]` which matches:
- ✓ `"analysis"` → L3
- ✓ `"analyse"` (British) → L3
- ✗ `"analyze"` (US spelling) → **no match → null**

The CNPLE launch-readiness pipeline stored `cognitiveLevel = "analyze"` (US spelling) for 3,735 questions. The CAT adapter called `cognitiveLayerFromLevel("analyze")` which returned `null`, causing those questions to use the `COGNITIVE_LAYER_DEFAULT = "L2"` fallback in `inferCognitiveLayer`.

**Fix applied:** Added `["analyz", "L3"]` to `COGNITIVE_LEVEL_TO_LAYER` in `cat-inference-maps.ts`.

```diff
  ["analys",     "L3"],  // matches "analysis", "analyse"
+ ["analyz",     "L3"],  // matches "analyze" (US spelling stored by launch-readiness pipeline)
```

---

## Distribution: Before Fix

| `cognitiveLevel` (DB) | Count | % | `cognitiveLayerFromLevel` result |
|---|---|---|---|
| `"evaluate"` | 6,640 | 64% | `L3` ✓ |
| `"analyze"` | 3,735 | 36% | `null` ✗ → fell back to `L2` default |

**CAT layer tally (before):**

| Layer | Count | % | Notes |
|---|---|---|---|
| L1 | 0 | 0% | — |
| L2 | 0 | 0% | — |
| L3 | 6,640 | 64% | Only `"evaluate"` questions |
| Unmapped (null) | 3,735 | 36% | All `"analyze"` questions — silently fell to L2 in adapter |

**Effect on CAT:** 36% of CNPLE questions (all `"analyze"` type — MCQ format) were silently treated as L2 items by `inferCognitiveLayer`'s `COGNITIVE_LAYER_DEFAULT`. The CAT adaptive selection appeared to have a mix of L2 and L3, but this was an inference artifact, not by design.

---

## Distribution: After Fix

| `cognitiveLevel` (DB) | Count | % | `cognitiveLayerFromLevel` result |
|---|---|---|---|
| `"evaluate"` | 6,640 | 64% | `L3` ✓ |
| `"analyze"` | 3,735 | 36% | `L3` ✓ |

**CAT layer tally (after):**

| Layer | Count | % |
|---|---|---|
| **L1** | **0** | **0%** |
| **L2** | **0** | **0%** |
| **L3** | **10,375** | **100%** |
| Unmapped | 0 | 0% |

---

## Difficulty Distribution (unchanged by fix)

| Difficulty | Count | % | CAT role |
|---|---|---|---|
| 3 (medium-hard) | 2,965 | 29% | Entry-level NP items |
| 4 (hard) | 4,446 | 43% | Core clinical reasoning |
| 5 (hardest) | 2,964 | 29% | Advanced differential/prescribing |

No difficulty 1 or 2 items exist — by design for NP-level content.

---

## CAT Adaptive Pool

| Metric | Value |
|---|---|
| Total adaptive-eligible questions | 8,715 |
| Layer distribution (after fix) | 100% L3 |
| Difficulty range | 3–5 |
| CAT_TARGET minimum | 3,000 ✓ |

The CAT pool exceeds the configured minimum (3,000) by 2.9×.

---

## Question Type by Layer (After Fix)

| Question Type | `cognitiveLevel` | Layer | Count |
|---|---|---|---|
| MCQ | `"analyze"` | L3 | 3,735 |
| MCQ | `"evaluate"` | L3 | 2,490 |
| SATA | `"evaluate"` | L3 | 1,660 |
| MATRIX | `"evaluate"` | L3 | 830 |
| ORDERED_RESPONSE | `"evaluate"` | L3 | 830 |
| NGN_BOWTIE | `"evaluate"` | L3 | 830 |

All six question formats are represented. All are L3.

---

## Interpretation: All-L3 Design

CNPLE questions are intentionally all L3 (evaluation/analysis). This reflects:

1. **Bloom's taxonomy:** NP licensure requires higher-order clinical reasoning. L1 (recall) and L2 (interpretation) items are appropriate for RN content but insufficient for NP-level decision-making.

2. **CAT implications:** The CAT ladder (L1→L2→L3 escalation) does not apply to CNPLE. Instead, the CAT adapts on the **difficulty** dimension (3→4→5) within the L3 tier. The CAT engine handles this correctly — `difficulty` is the primary adaptation lever when cognitive layer is uniform.

3. **Readiness scoring:** L3 questions carry the maximum item weight (`COGNITIVE_WEIGHTS.L3 × RISK_WEIGHTS.high = 2.2 × 2.5 = 5.5`). CNPLE readiness scores will reflect NP-level clinical mastery rather than a tiered recall→application→action progression.

---

## Recommendation

If curriculum-level diagnostic differentiation is desired (ability to identify learners who struggle with NP-level recall vs. advanced clinical decision-making), a set of L1/L2 "diagnostic anchor" questions (terminology, pathophysiology, Canadian regulatory facts) should be added to the CNPLE pool. These would enable the CAT tier ladder to function as designed. This is **not required for launch** — the current all-L3 design is pedagogically sound and technically correct.

---

## Files Changed

| File | Change |
|---|---|
| `src/lib/cat/cat-inference-maps.ts` | Added `["analyz", "L3"]` to fix US-spelling `"analyze"` → L3 mapping |
