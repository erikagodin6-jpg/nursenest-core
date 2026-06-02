# CNPLE Dashboard Count Validation
**Generated:** 2026-06-02  
**Phase:** 3 of CNPLE Final Hardening Sprint

---

## Summary

All CNPLE dashboard and marketing counts have been updated from stale `exam="CNPLE"` queries to canonical `studyLinkPathwayId="ca-np-cnple"` queries. The snapshot emitter now uses `studyLinkPathwayId` as the preferred count source for all pathways that have questions published via the launch-readiness pipeline.

---

## Problem

### Root Cause

`buildQuestionBankCoverageReport` (used by `readiness:emit-snapshot`) counted questions with:
```typescript
where: { status: "published", exam: { in: ["NP", "CNPLE", "CAN-NP"] } }
```

For CNPLE this returned **11,872** — including 1,497 legacy questions from March 2026 that have `exam="CNPLE"` but `studyLinkPathwayId=null` and `regionScope="BOTH"`. These legacy questions are not served through the CNPLE pathway and should not be in the count.

The `cnple-inventory-metrics.ts` file was also stale, last updated 2026-05-13 with pre-publication values.

### Impact

| Surface | Old Value | Actual DB State | Problem |
|---|---|---|---|
| `pathway-readiness-snapshot.json` questions | 1,496 | 10,375 | Launch gate could fail or mis-report |
| `CNPLE_INVENTORY.cnpleTaggedLabel` | "1,496" | 10,375 | Hero count dramatically understated |
| `CNPLE_INVENTORY.caQuestionsLabel` | "4,000+" | 10,375 | Conservative but now stale |
| `CNPLE_INVENTORY.flashcardsLabel` | "1,154" | 9,454 | Understated by 8,300 launch-deck cards |
| `CNPLE_INVENTORY.lessonsLabel` | "1,463" | 1,465 | Minor (off by 2) |
| `CNPLE_INVENTORY.curatedFlashcardsLabel` | "100" | 60 | Overstated (60 authored, not 100) |

---

## Fixes Applied

### Fix 1 — `build-question-bank-diagnostics.ts`

Added `studyLinkPathwayId`-preferred count logic. For every pathway in `EXAM_PATHWAYS`, the emitter now:

1. First queries `count({ where: { status: "published", studyLinkPathwayId: p.id } })`
2. Uses that count when `> 0` (pathway has questions via launch pipeline)
3. Falls back to `count({ where: { status: "published", exam: { in: contentExamKeys } } })` for older pathways without `studyLinkPathwayId` set

```typescript
// Before:
const publishedCount = await prisma.examQuestion.count({
  where: { status: DB_PUBLISHED, exam: { in: keys } },
});

// After:
const studyLinkCount = await prisma.examQuestion.count({
  where: { status: DB_PUBLISHED, studyLinkPathwayId: p.id },
});
const publishedCount = studyLinkCount > 0
  ? studyLinkCount
  : await prisma.examQuestion.count({
      where: { status: DB_PUBLISHED, exam: { in: keys } },
    });
```

### Fix 2 — `scripts/readiness/emit-pathway-readiness-snapshot.mts`

Added `import "@/lib/db/script-env-bootstrap"` as the first import. The script previously required DATABASE_URL to be set in the shell before running. It now loads `.env.local` consistently with all other DB scripts.

### Fix 3 — `src/config/pathway-readiness-snapshot.json` (re-emitted)

Re-ran `npm run readiness:emit-snapshot` to regenerate with corrected counts.

### Fix 4 — `src/lib/marketing/cnple-inventory-metrics.ts`

Updated all stale constants to reflect the post-launch-sprint DB state.

---

## Validation: Before vs After

| Field | Before | After | Source |
|---|---|---|---|
| `pathway-readiness-snapshot.json["ca-np-cnple"].questions` | 1,496 | **10,375** | `studyLinkPathwayId=ca-np-cnple, status=published` |
| `pathway-readiness-snapshot.json["ca-np-cnple"].lessons` | 436 | **1,465** | `pathwayLesson where pathwayId=ca-np-cnple` |
| `CNPLE_INVENTORY.cnpleTaggedLabel` | "1,496" | **"10,375"** | studyLinkPathwayId count |
| `CNPLE_INVENTORY.caQuestionsLabel` | "4,000+" | **"10,000+"** | Conservative brand label |
| `CNPLE_INVENTORY.flashcardsLabel` | "1,154" | **"9,000+"** | All CNPLE deck cards |
| `CNPLE_INVENTORY.curatedFlashcardsLabel` | "100" | **"60"** | Actual authored count |
| `CNPLE_INVENTORY.lessonsLabel` | "1,463" | **"1,465"** | DB count |

### Parity with Other NP Pathways

| Pathway | Snapshot Questions | Method |
|---|---|---|
| `us-np-fnp` | 10,375 | studyLinkPathwayId |
| `us-np-agpcnp` | 5,000 | studyLinkPathwayId |
| `us-np-whnp` | 4,000 | studyLinkPathwayId |
| `us-np-pmhnp` | 4,000 | studyLinkPathwayId |
| `us-np-pnp-pc` | 4,000 | studyLinkPathwayId |
| **`ca-np-cnple`** | **10,375** | **studyLinkPathwayId** ✓ |

All NP pathways now use the same count methodology.

---

## Files Changed

| File | Change |
|---|---|
| `src/lib/questions/build-question-bank-diagnostics.ts` | Prefer `studyLinkPathwayId` count over `exam IN (keys)` count |
| `scripts/readiness/emit-pathway-readiness-snapshot.mts` | Add `script-env-bootstrap` import |
| `src/config/pathway-readiness-snapshot.json` | Re-emitted with corrected counts (questions: 1496→10375, lessons: 436→1465) |
| `src/lib/marketing/cnple-inventory-metrics.ts` | Updated all stale constants |
