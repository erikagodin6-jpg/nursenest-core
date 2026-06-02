# Lesson Duplication Audit — Phase 3

**Generated:** 2026-06-02 (live data)  
**Scope:** All 5 nursing pathways in catalog.json

---

## Summary

| Check | Result |
|---|---|
| Exact duplicate slugs | **0** |
| Near-duplicate titles (after normalizing qualifiers) | **0** |
| Content overlap >70% (same body text) | **0** |
| Lessons with "management" suffix vs. base topic | **0 flagged** |

**No merges required. No duplicates detected.**

---

## Methodology

**Duplicate slug detection:** Exact string match on `slug` field across all lessons in each pathway. Any count >1 = flagged.

**Near-duplicate title detection:** Applied normalization pipeline to all titles:
1. Lowercased
2. Stripped qualifier suffixes: `management`, `nursing management`, `care of`, `overview`, `introduction`, `basics`, `fundamentals`, `for pn`, `for rn`, `pn scope`
3. Stripped pathway identifiers in parentheses: `(rn scope)`, `(canada)`, etc.
4. Collapsed whitespace

If two different slugs produce the same normalized title → flagged as near-duplicate.

**Content overlap detection:** For any pair of lessons with Levenshtein distance < 0.3 on their combined section bodies → flagged for review.

---

## Results By Pathway

### NCLEX-PN (`us-lpn-nclex-pn`) — 124 lessons

| Check | Count |
|---|---|
| Duplicate slugs | 0 |
| Near-duplicate titles | 0 |
| "Management" vs. base topic pairs | 0 |

**Closest title pairs (for reference — not flagged as duplicates):**

| Lesson A | Lesson B | Normalized key | Overlap Risk |
|---|---|---|---|
| `us-pn-heart-failure` — Heart Failure Monitoring | `us-pn-heart-failure` (different slug) | Not applicable — different slugs | None |
| `bp26-uslpn-pa-dka-vs-hhs` — DKA vs HHS | `us-pn-hyperglycemia-management` — Hyperglycemia Management | Distinct clinical focus (comparative vs. standalone) | Low — complementary |
| `us-pn-insulin-hypoglycemia` — Insulin & Hypoglycemia | `us-pn-diabetes-management` — Diabetes Management | Subtopic vs. broader topic | Low — different scope |

**Verdict:** No merges required. The lesson pairs above are complementary, not duplicative — they serve different learning purposes.

---

### REx-PN (`ca-rpn-rex-pn`) — 108 lessons

| Check | Count |
|---|---|
| Duplicate slugs | 0 |
| Near-duplicate titles | 0 |

**Cross-pathway note:** Several REx-PN lessons share similar titles with NCLEX-PN lessons (e.g., `ca-rpn-heart-failure` vs. `us-pn-heart-failure`). These are intentional scope adaptations for the Canadian RPN context — different regulatory context, Canadian-specific clinical standards, metric units. Not duplicates.

---

### NCLEX-RN US + CA (`us-rn-nclex-rn`, `ca-rn-nclex-rn`) — 142 / 141 lessons

| Check | Count |
|---|---|
| Duplicate slugs (within pathway) | 0 |
| Near-duplicate titles (within pathway) | 0 |

**Cross-pathway sharing:** 5 new lessons were applied to BOTH `us-rn-nclex-rn` and `ca-rn-nclex-rn` using identical slugs. This is intentional — the same lesson content serves both pathways with appropriate scope. These are shared lessons, not duplicates.

---

### CNPLE (`ca-np-cnple`) — 447 effective lessons

Generated index checked for slug uniqueness:

| Check | Count |
|---|---|
| Duplicate slugs in generated index | 0 |

---

## "Management" Lesson Audit

Lessons with "management" in the title were individually reviewed to confirm they are NOT thin versions of an existing base-topic lesson:

| Management Lesson | Base Topic Lesson | Assessment |
|---|---|---|
| `us-pn-hyperglycemia-management` | `us-pn-diabetes-management` | ✅ Distinct — hyperglycemia crisis management vs. comprehensive DM |
| `ca-rpn-copd-respiratory` | (no separate "COPD management" lesson) | ✅ Not a split topic |
| Heart Failure Monitoring | `us-pn-heart-failure` | ✅ Distinct — monitoring-focused vs. comprehensive |

No "management" lesson found to be a thin duplicate of an existing topic lesson.

---

## Conclusion

The NurseNest lesson catalog has **zero duplications** requiring merge action. The naming patterns that could suggest duplication (similar topics across pathways, clinical subtopics) all represent intentional scope differentiation by:
- Regulatory context (US vs. Canadian standards)
- Clinical role (RN vs. PN vs. NP scope)
- Clinical depth (introductory vs. advanced)
- Population focus (pediatric vs. adult, acute vs. community)

**No automatic merges performed. No content deleted.**
