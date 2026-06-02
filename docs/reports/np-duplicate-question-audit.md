# NP Duplicate Question Audit

**Generated:** 2026-06-01  
**Source:** Live production database — post-publication counts  
**Scope:** All 27,375 questions published in the five NP launch-readiness sprints

---

## Summary

| Pathway | Total | Exact Dup Hashes | Exact Dup Rows | % | Near-Dup Prefix | % | Cross-Pathway Dups |
|---------|-------|-----------------|---------------|---|-----------------|---|--------------------|
| FNP | 10,375 | 2,210 groups | 5,840 rows | **56.3%** | 10,375 | 100.0% | 971 |
| AGPCNP | 5,000 | 1,088 groups | 3,036 rows | **60.7%** | 4,803 | 96.1% | 971 |
| PMHNP | 4,000 | 362 groups | 1,892 rows | **47.3%** | 2,469 | 61.7% | — |
| WHNP | 4,000 | 285 groups | 2,639 rows | **66.0%** | 2,857 | 71.4% | — |
| PNP-PC | 4,000 | 555 groups | 2,035 rows | **50.9%** | 3,360 | 84.0% | — |

**971 cross-pathway exact duplicates exist between FNP and AGPCNP** — the same stemHash appears in both pools.

---

## Root Cause

The launch-readiness publishers generate questions deterministically using a rotation formula. Given a fixed set of ~20 domains cycling over lessons, the MCQ stem template produces identical stems when:

1. The same `localIndex % N` position maps to the same question type
2. The same domain is selected for two different lessons (domain rotates by `lessonIndex + i`)
3. The same lesson appears across pathways (AGPCNP borrows FNP lessons filtered by body system)

**MCQ stem template (FNP example):**
```
"FNP {domain.label} item {localIndex+1}. A nurse practitioner sees {domain.presentation} 
while applying {lesson.title}. Key cue: {domain.cue}. Which plan best demonstrates 
advanced NP clinical reasoning?"
```

When `domain.presentation` is identical for two different `(lesson, index)` pairs, the entire stem matches — producing a duplicate `stemHash`.

The 100% near-duplicate prefix rate for FNP means every MCQ stem begins with `"FNP {domain.label} item N."` — a shared prefix across all MCQ items for the same domain label.

---

## Duplicate Classification

### Type 1: Exact Stem Duplicates (stemHash collision)

Same question text, different IDs. These represent functionally identical items that would deliver the exact same question twice to a learner.

| Pathway | Duplicate rows | Unique questions effectively available |
|---------|---------------|----------------------------------------|
| FNP | 5,840 (56.3%) | ~4,535 unique stems |
| AGPCNP | 3,036 (60.7%) | ~1,964 unique stems |
| PMHNP | 1,892 (47.3%) | ~2,108 unique stems |
| WHNP | 2,639 (66.0%) | ~1,361 unique stems |
| PNP-PC | 2,035 (50.9%) | ~1,965 unique stems |

### Type 2: Near-Duplicate Stems (shared 80-char prefix)

The first 80 characters of the stem are identical. Learners experience these as the same question with minor variation in the trailing context (lesson title changes, domain details fill in differently).

FNP near-duplicate rate of 100% confirms every MCQ begins with the same `"FNP {label} item N."` opener — this is the template prefix structure.

### Type 3: Concept Over-Representation

Topic+bodySystem pairs repeated far beyond pedagogic value:

**FNP top repeated concepts:**
- Cardiovascular | Cardiovascular: 700×
- Geriatrics | Geriatrics: 650×
- Primary Care | Primary Care: 650×

**WHNP:**
- Women's Health | Women's Health: 3,715× (93% of pool)

**PMHNP:**
- Mental Health | Mental Health: 2,366× (59% of pool)

**PNP-PC:**
- Endocrine | Endocrine: 1,170×; Pediatrics | Pediatrics: 1,152×; Mental Health | Mental Health: 1,144×

### Type 4: Cross-Pathway Duplicates

**971 questions have identical stemHashes in both FNP and AGPCNP.** This occurs because AGPCNP borrows FNP lessons that pass an adult/geriatric filter — when those lessons generate questions using the same domain, the stems collide exactly.

---

## Affected Pathways

All five pathways are affected. WHNP is most severe (66% exact duplicates). PMHNP is least severe (47%) because its lessons were filtered by a psychiatric keyword pattern, producing more varied lesson inputs.

---

## Impact on CAT Engine

The CAT engine pulls from `isAdaptiveEligible = true` published questions. Duplicate stems in the adaptive pool mean:

1. **Learners may receive identical questions** across sessions or within the same long session
2. **Item difficulty calibration is inflated** — the same question at different IDs appears as multiple data points
3. **Pool diversity is overstated** — effective unique item count is 34–53% of reported pool size

Effective unique CAT-eligible items after deduplication:

| Pathway | Reported CAT-eligible | Est. unique (post-dedup) | Sufficient (≥75)? |
|---------|----------------------|--------------------------|-------------------|
| FNP | 8,715 | ~3,800 | ✅ |
| AGPCNP | 4,196 | ~1,660 | ✅ |
| PMHNP | 4,000 | ~2,100 | ✅ |
| WHNP | 3,338 | ~1,135 | ✅ |
| PNP-PC | 3,348 | ~1,640 | ✅ |

All pathways remain above the 75-item floor even after deduplication, but learner experience quality degrades significantly above a few dozen sessions per pathway.

---

## Remediation Plan

### Immediate (pre-launch)

**1. Quarantine exact duplicates** — keep one row per stemHash per pathway, quarantine the rest:

```sql
-- Quarantine duplicate rows (keep lowest-ID per hash per pathway)
UPDATE exam_questions
SET status = 'quarantined'
WHERE id NOT IN (
  SELECT MIN(id)
  FROM exam_questions
  WHERE tags @> ARRAY['pathway:us-np-fnp']::text[]
    AND stemHash IS NOT NULL
  GROUP BY stemHash
)
AND tags @> ARRAY['pathway:us-np-fnp']::text[]
AND status = 'published';
-- Repeat for each pathway tag
```

**2. Remove cross-pathway duplicates** — questions in both FNP and AGPCNP with matching stemHashes should be de-tagged from AGPCNP (keep the FNP-tagged canonical):

```sql
-- Remove AGPCNP tag from questions that also exist in FNP with same hash
-- (971 rows)
```

Estimated post-remediation counts (unique published per pathway):
- FNP: ~4,535 questions, ~3,800 CAT-eligible
- AGPCNP: ~1,964 questions (after cross-pathway dedup), ~1,660 CAT-eligible
- PMHNP: ~2,108 questions, ~2,100 CAT-eligible
- WHNP: ~1,361 questions, ~1,135 CAT-eligible
- PNP-PC: ~1,965 questions, ~1,640 CAT-eligible

### Short-term (within 2 weeks)

**3. Fix stem generation template** — add lesson-specific content into MCQ stems:
- Include 2–3 words from the lesson's `topic` or first `section.heading` to differentiate
- Vary the domain description when the same domain cycles across multiple lessons
- Use different sentence openers per question type slot

**4. Reduce concept density** — cap questions per topic+bodySystem pair to 25 per pathway. Estimated reduction: 40-50% of current volume becomes available for new topic coverage.

**5. Diversify WHNP/PMHNP lesson sources** — both pathways drew from a narrow lesson set (28 WHNP, 44 PMHNP). Expanding to 80–100 lessons each would proportionally reduce per-concept repetition.

### Medium-term

**6. Introduce AI-generated variation** — use `generate-fnp-question-flashcard-pipeline.mts` (OpenAI-backed) to replace template-generated duplicates with higher-variance items tuned to the same clinical domains.

**7. Add deduplication gate to publisher** — before `createMany`, check if `stemHash` already exists in the pathway's pool and skip:

```typescript
const existingHashes = new Set(
  (await prisma.examQuestion.findMany({
    where: { tags: { has: `pathway:${PATHWAY_ID}` }, stemHash: { not: null } },
    select: { stemHash: true },
  })).map(r => r.stemHash!)
);
questions = questions.filter(q => !existingHashes.has(hash(q.stem)));
```

---

## Duplicate Percentage Summary

| Pathway | Exact Dup % | Near-Dup % | Cross-Pathway Dup |
|---------|------------|------------|-------------------|
| FNP | 56.3% | 100.0% | 971 rows in AGPCNP |
| AGPCNP | 60.7% | 96.1% | 971 rows from FNP |
| PMHNP | 47.3% | 61.7% | None |
| WHNP | 66.0% | 71.4% | None |
| PNP-PC | 50.9% | 84.0% | None |
| **Overall** | **56.3%** | **82.6%** | **971 cross-pathway** |
