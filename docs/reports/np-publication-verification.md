# NP Publication Verification Report

**Generated:** 2026-06-01  
**Run by:** NP launch readiness publisher (5 pathways)  
**Database:** DigitalOcean managed PostgreSQL (production)  
**Method:** `--apply` runs; idempotent (`skipDuplicates: true` on all writes)

---

## Result: ALL FIVE PATHWAYS PUBLISHED ✅

Every NP specialty now has published questions, flashcards, practice exams, and a CAT-eligible adaptive pool reachable in the live database. A user with an active NP subscription can launch lessons, flashcards, practice tests, and CAT for all five specialties.

---

## Before / After Counts

### Questions Written to Database

| Pathway | Before | After | Written | Published | CAT-Eligible |
|---------|--------|-------|---------|-----------|--------------|
| FNP | 0 | **10,375** | +10,375 | 10,375 | **8,715** |
| AGPCNP | 0 | **5,000** | +5,000 | 5,000 | **4,196** |
| PMHNP | 0 | **4,000** | +4,000 | 4,000 | **4,000** |
| WHNP | 0 | **4,000** | +4,000 | 4,000 | **3,338** |
| PNP-PC | 0 | **4,000** | +4,000 | 4,000 | **3,348** |
| **Total** | **0** | **27,375** | **+27,375** | **27,375** | **23,597** |

*"Before" counts filtered by pathway source tag (`pathway:us-np-{specialty}`). All rows set `status = published`, `isAdaptiveEligible` per question type.*

### Flashcards Written to Database

| Pathway | Before | After | Written | Published | Deck Status |
|---------|--------|-------|---------|-----------|-------------|
| FNP | 0 | **8,300** | +8,300 | 8,300 | PUBLISHED / SUBSCRIBER |
| AGPCNP | 0 | **5,000** | +5,000 | 5,000 | PUBLISHED / SUBSCRIBER |
| PMHNP | 0 | **4,000** | +4,000 | 4,000 | PUBLISHED / SUBSCRIBER |
| WHNP | 0 | **4,000** | +4,000 | 4,000 | PUBLISHED / SUBSCRIBER |
| PNP-PC | 0 | **4,000** | +4,000 | 4,000 | PUBLISHED / SUBSCRIBER |
| **Total** | **0** | **25,300** | **+25,300** | **25,300** | — |

### Practice Exams Created

| Pathway | Before | After | Written | Status |
|---------|--------|-------|---------|--------|
| FNP | 0 | **300** | +300 | PUBLISHED |
| AGPCNP | 0 | **250** | +250 | PUBLISHED |
| PMHNP | 0 | **200** | +200 | PUBLISHED |
| WHNP | 0 | **200** | +200 | PUBLISHED |
| PNP-PC | 0 | **200** | +200 | PUBLISHED |
| **Total** | **0** | **1,150** | **+1,150** | PUBLISHED |

Practice exams are seeded using deterministic tag-selection from the CAT-eligible adaptive pool. Each exam selects 85 questions. Tags like `exam-preset-fnp-launch-001` are written to `exam_questions.tags`.

---

## Row Existence and Status Verification

### Questions: sample rows confirmed reachable

```
us-np-fnp:    id=fnp-np-hypertension-diagnosis-and-guideline-based-management-q-003
              exam=FNP tier=NP status=published isAdaptiveEligible=true studyLinkPathwayId=us-np-fnp ✅

us-np-agpcnp: id=agpcnp-np-urinary-incontinence-in-older-adults-q-475
              exam=AGPCNP tier=NP status=published isAdaptiveEligible=true studyLinkPathwayId=us-np-agpcnp ✅

us-np-pmhnp:  id=pmhnp-np-delirium-recognition-and-management-q-2888
              exam=PMHNP tier=NP status=published isAdaptiveEligible=true studyLinkPathwayId=us-np-pmhnp ✅

us-np-whnp:   id=whnp-np-premature-ovarian-insufficiency-q-739
              exam=WHNP tier=NP status=published isAdaptiveEligible=true studyLinkPathwayId=us-np-whnp ✅

us-np-pnp-pc: id=pnp-pc-np-antidepressant-selection-and-monitoring-q-010
              exam=PNP-PC tier=NP status=published isAdaptiveEligible=true studyLinkPathwayId=us-np-pnp-pc ✅
```

### Flashcard Decks: all PUBLISHED, SUBSCRIBER visibility

```
fnp-clinical-reasoning-launch-deck:    PUBLISHED  cardCount=8300  pathwayId=us-np-fnp    visibility=SUBSCRIBER ✅
agpcnp-clinical-reasoning-launch-deck: PUBLISHED  cardCount=5000  pathwayId=us-np-agpcnp visibility=SUBSCRIBER ✅
pmhnp-clinical-reasoning-launch-deck:  PUBLISHED  cardCount=4000  pathwayId=us-np-pmhnp  visibility=SUBSCRIBER ✅
whnp-clinical-reasoning-launch-deck:   PUBLISHED  cardCount=4000  pathwayId=us-np-whnp   visibility=SUBSCRIBER ✅
pnp-pc-clinical-reasoning-launch-deck: PUBLISHED  cardCount=4000  pathwayId=us-np-pnp-pc visibility=SUBSCRIBER ✅
```

### Lessons: all previously published, confirmed reachable

```
us-np-fnp:    fnp-adult-hypertension-intensification  status=PUBLISHED ✅
us-np-agpcnp: (first PUBLISHED lesson)                status=PUBLISHED ✅
us-np-pmhnp:  (first PUBLISHED lesson)                status=PUBLISHED ✅
us-np-whnp:   (first PUBLISHED lesson)                status=PUBLISHED ✅
us-np-pnp-pc: (first PUBLISHED lesson)                status=PUBLISHED ✅
```

All lessons were already PUBLISHED before this run (1,422–1,643 per pathway). No lesson rows were touched.

---

## CAT Pool Verification

CAT eligibility gate: ≥ 75 adaptive-eligible published questions per pathway. All pathways pass with large margin.

| Pathway | CAT-Eligible (source tag) | CAT Pool (broad exam+tier filter used by engine) | Gate (≥75) |
|---------|--------------------------|--------------------------------------------------|------------|
| FNP | 8,715 | 11,336 | ✅ |
| AGPCNP | 4,196 | 6,817 | ✅ |
| PMHNP | 4,000 | 6,621 | ✅ |
| WHNP | 3,338 | 5,959 | ✅ |
| PNP-PC | 3,348 | 5,969 | ✅ |

*"Source tag" counts are from the new launch-readiness sprint rows only. "Broad" pool includes pre-existing NP question pool filtered by exam value and tier — these are the counts the CAT engine actually uses at session start.*

---

## Launch Readiness: What a User Can Now Do

| Action | FNP | AGPCNP | PMHNP | WHNP | PNP-PC |
|--------|-----|--------|-------|------|--------|
| Browse lessons | ✅ 1,643 | ✅ 1,465 | ✅ 1,459 | ✅ 1,422 | ✅ 1,422 |
| Study flashcards | ✅ 8,300 | ✅ 5,000 | ✅ 4,000 | ✅ 4,000 | ✅ 4,000 |
| Practice tests (timed) | ✅ 300 | ✅ 250 | ✅ 200 | ✅ 200 | ✅ 200 |
| CAT adaptive exam | ✅ 8,715 eligible | ✅ 4,196 eligible | ✅ 4,000 eligible | ✅ 3,338 eligible | ✅ 3,348 eligible |

---

## Script and Bug Notes

### PMHNP Script Created

No `generate-pmhnp-launch-readiness-content.mts` existed prior to this run. The script was created with:
- 7 PMHNP-specific domain overlays: suicide risk, bipolar disorder, psychosis/schizophrenia, anxiety disorders, substance use, psychopharmacology safety, crisis intervention
- Lesson filter targeting psychiatric/mental health content using a 40+ term regex
- Falls back to full lesson catalog if fewer than 20 matching lessons found
- Same deterministic generation pattern as FNP/AGPCNP/WHNP/PNP-PC

### SQL Type Cast Bug Fixed

All five publisher scripts had a `varchar[]` type cast in the practice-exam tag-writing SQL:

```sql
-- Before (broken):
AND NOT (tags @> ARRAY[${tag}]::varchar[])

-- After (fixed):
AND NOT (tags @> ARRAY[${tag}]::text[])
```

PostgreSQL rejected `text[] @> varchar[]` with error code `42883`. The `tags` column in `exam_questions` is `text[]` (not `varchar[]`). This fix was applied to all five scripts: `generate-fnp-*`, `generate-agpcnp-*`, `generate-pmhnp-*`, `generate-whnp-*`, `generate-pnp-pc-*`.

---

## Global NP Pool After Publication

| Pool | Before | After | Delta |
|------|--------|-------|-------|
| Total questions (exam=NP/FNP/CNPLE/NP-FNP) | 5,627 | 16,002 | +10,375 |
| Published questions | 5,619 | 15,994 | +10,375 |
| Total NP-tier flashcards | 1,756 | 27,056 | +25,300 |
| Published NP-tier flashcards | 1,756 | 27,056 | +25,300 |

*The global pool delta reflects FNP exam-tagged rows only (exam=FNP). AGPCNP/PMHNP/WHNP/PNP-PC questions use their own exam codes and are counted in the per-pathway source-tag totals above.*

---

## Idempotency

All publishers use `createMany({ data: batch, skipDuplicates: true })`. Re-running any publisher will skip already-written rows. Practice exam upserts are safe to re-run. The `stemHash` field deduplicates questions on re-import.
