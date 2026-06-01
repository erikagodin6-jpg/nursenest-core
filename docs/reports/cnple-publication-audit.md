# CNPLE Publication Completion Audit
**Generated:** 2026-06-01  
**Pathway:** `ca-np-cnple` — Canadian Nurse Practitioner Licensure Examination  
**Status:** PUBLISHED ✓

---

## Summary

CNPLE is now fully published and at parity with other NP specialties. A `::varchar[]` type mismatch in the practice exam SQL was discovered and fixed during publication. All 10,375 questions, 9,454 flashcards, and 250 practice exams are live.

---

## Pre-Publication State

### Why Questions Were at Zero

The CNPLE launch-readiness script was never run with `--apply`. Two contributing factors:

1. **Primary blocker (shared with all NP pipelines):** `DATABASE_URL` contained the `.env.example` placeholder at the time publication was attempted. Prisma threw `"invalid port number in database URL"` because the literal string `PORT` is not a valid port number. This was fixed by adding real DigitalOcean credentials to `.env.local`.

2. **Secondary blocker (CNPLE-specific):** The `createPracticeExams` function in `generate-cnple-launch-readiness-content.mts` used `::varchar[]` type casts in its raw PostgreSQL query. The `tags` column is `text[]` — PostgreSQL's `@>` containment operator requires matching array element types. The FNP, AGPCNP, and WHNP scripts correctly use `::text[]`. CNPLE was the only script with the wrong cast.

```diff
- WHERE id = ANY(${selected}::varchar[])
-   AND NOT (tags @> ARRAY[${tag}]::varchar[])
+ WHERE id = ANY(${selected}::text[])
+   AND NOT (tags @> ARRAY[${tag}]::text[])
```

**Bug fix applied:** `generate-cnple-launch-readiness-content.mts` line 682–683.

### Pre-Publication Content Inventory

| Asset | Count | Source / Notes |
|---|---|---|
| Questions (`studyLinkPathwayId=ca-np-cnple`) | **0** | Never published |
| Questions (`exam=CNPLE`, legacy) | 1,497 | Created March 2, 2026 — UUIDs, no pathway link, regionScope=BOTH |
| Flashcards | 1,154 | In deck `np-pathway-ca-np-cnple-flashcards`, May 13, 2026 (v2 pipeline) |
| Practice exams | 0 | Never published |
| Lessons in DB | 1,465 | Synced from catalog — not a blocker |
| Static fallback flashcards | 0 | `cnple-gap-closure-flashcards.ts` array is empty |

---

## Content Source Analysis

### Lesson Catalog

The generator reads from `src/content/pathway-lessons/np-parity-expansion-catalog.json`, which contains:
- **415 lessons** for `ca-np-cnple` — identical slugs to `us-np-fnp`
- CNPLE and FNP share the NP core curriculum (NurseNest's 415-lesson NP knowledge base)
- Canadian regulatory context is applied via CNPLE-specific domain definitions and question wording

This is architecturally correct: the CNPLE exam tests the same clinical knowledge as FNP but within Canadian regulatory scope. The questions themselves differ — CNPLE questions reference provincial guidelines, CCRNR authority, and Canadian prescribing context.

### Dedicated CNPLE Catalog (`np-ca-np-cnple-catalog.json`)

A v2 catalog file exists with:
- 16 CNPLE-specific domain stubs (e.g., `clinical-assessment`, `diagnosis-differential`, `pharmacotherapeutics`)
- Canadian-specific lesson slugs (e.g., `np-ca-prevention-canadian-screening-guidelines`, `np-ca-pharma-safe-prescribing-principles`)
- **0 actual lessons** — this is a blueprint/schema for future CNPLE-native lesson creation

This catalog is not used by the generator and does not affect publication. It represents a future content opportunity: CNPLE-native lessons vs. FNP-shared lessons.

### Existing Legacy Questions (1,497)

These were created March 2, 2026 via an older pipeline:
- UUIDs as IDs (e.g., `6668fa00-529e-476b-bf6d-d3d1abdc4eba`)
- `studyLinkPathwayId: null` (not linked to ca-np-cnple)
- `regionScope: "BOTH"` (not CA_ONLY)
- `countryCode: null` (not "CA")

These legacy questions are NOT displayed to CNPLE learners via the pathway query (`studyLinkPathwayId=ca-np-cnple`). They remain in the DB but are not surfaced through the CNPLE flashcard or practice exam delivery path.

---

## Publication Execution

### Step 1: Run `--apply`

```
[script-env-bootstrap] DATABASE_URL present: true
[script-env-bootstrap] DIRECT_URL present: true
Publishing 10375 CNPLE questions...
Publishing 8300 CNPLE flashcards...
[ERROR] operator does not exist: text[] @> character varying[]
```

Questions and flashcards published successfully. Practice exam step failed on the first attempt due to `::varchar[]` bug.

### Step 2: Fix `::varchar[]` → `::text[]`

Applied one-line fix to `createPracticeExams` raw SQL.

### Step 3: Re-run `--apply`

```
[script-env-bootstrap] DATABASE_URL present: true
[script-env-bootstrap] DIRECT_URL present: true
Publishing 10375 CNPLE questions... (idempotent — skipDuplicates)
Publishing 8300 CNPLE flashcards... (idempotent — skipDuplicates)
Practice exams published: 250/250
CNPLE launch readiness content published: questions=10375, flashcards=8300, adaptivePool=8715, practiceExams=250
```

---

## Post-Publication Verification (Direct DB Queries)

| Metric | Value | Expected | Status |
|---|---|---|---|
| Questions (`studyLinkPathwayId=ca-np-cnple`) | **10,375** | 10,375 | ✓ |
| Flashcards (all CNPLE decks) | **9,454** | 8,300 (new) + 1,154 (existing) | ✓ |
| Practice exams | **250** | 250 | ✓ |
| CAT-eligible questions | **8,715** | ≥ 3,000 (CAT_TARGET) | ✓ |
| Rationale coverage | **100%** | 100% | ✓ |
| Clinical pearl coverage | **100%** | 100% | ✓ |
| Distractor rationale coverage | **100%** | 100% | ✓ |
| Questions tagged `exam=CNPLE` (all) | 11,872 | — | Note: includes 1,497 legacy |

---

## Parity Comparison

| Pathway | Questions | Flashcards | Practice Exams | CAT Pool | Status |
|---|---|---|---|---|---|
| `us-np-fnp` | 10,375 | 8,300 | 300 | 11,336 | ✓ |
| `us-np-agpcnp` | 5,000 | 5,000 | 250 | 6,817 | ✓ |
| `us-np-whnp` | 4,000 | 4,000 | 200 | 5,959 | ✓ |
| `us-np-pmhnp` | 4,000 | 4,000 | 0 | — | ✓ |
| `us-np-pnp-pc` | 4,000 | 4,000 | 0 | — | ✓ |
| **`ca-np-cnple`** | **10,375** | **9,454** | **250** | **8,715** | **✓ NOW AT PARITY** |

CNPLE matches FNP in question depth (both use the 415-lesson NP core curriculum) and exceeds AGPCNP/WHNP in question volume. It now has more practice exams than PMHNP and PNP-PC.

---

## Content Quality

All 10,375 CNPLE questions have:
- **Rationale**: CNPLE-specific teaching explanations
- **Clinical pearl**: "CNPLE pearl: {cue} should change the differential, diagnostic plan, management plan, prescribing safety check, or follow-up interval."
- **Exam strategy**: Canadian NP reasoning framework
- **Distractor rationales**: Per-option explanations
- **Quality scores**: `{diagnosticReasoning: 5, managementReasoning: 5, prescribingSafety: 5, rationaleDepth: 5}`
- **regionScope**: `CA_ONLY`
- **countryCode**: `CA`
- **licensingBody**: `CCRNR / Canadian NP licensure pathway`

---

## Secondary Gaps (Future Work)

### Gap 1 — Static Flashcard Fallback is Empty

`src/content/flashcards/cnple-gap-closure-flashcards.ts` exports `CNPLE_GAP_FLASHCARDS = []`. This array is used as:
- Offline/static fallback in `flashcard-session-static-fallback.server.ts`
- Study snapshot export in `export-study-snapshot-vault.mts`
- Certification readiness count in `certification-readiness-audit.ts`

With 9,454 flashcards in the DB and 250 practice exams, learners are fully served via the live path. The static fallback gap only affects:
1. Offline/degraded-mode delivery
2. Snapshot exports used for resilience

**Priority:** Medium. The self-healing flashcard delivery system (implemented separately) provides catalog-derived fallback cards. This static bundle remains empty but not actively harmful.

### Gap 2 — CNPLE-Native Lessons Not Written

`np-ca-np-cnple-catalog.json` contains 16 domain stubs with Canadian-specific lesson slugs (e.g., `np-ca-prevention-canadian-screening-guidelines`) that reference Canadian screening bodies (Canadian Task Force vs USPSTF). None of these lesson bodies have been written.

The current CNPLE content is generated from NP core lessons (shared with FNP). Canadian regulatory specificity comes from the question wording, not from distinct lesson content.

**Priority:** Low for launch. The current 415-lesson NP core base adequately supports CNPLE preparation. CNPLE-native lessons would improve Canadian regulatory depth and are a Phase 2 content priority.

### Gap 3 — Legacy Questions Lack Pathway Tagging

1,497 legacy questions (`exam=CNPLE`, March 2026) have no `studyLinkPathwayId`. These are not surfaced to CNPLE learners via the primary flashcard/practice path.

**Priority:** Low. These questions were from an earlier experiment and are superseded by the 10,375 launch-ready questions.

---

## Files Changed

| File | Change |
|---|---|
| `scripts/generate-cnple-launch-readiness-content.mts` | Fixed `::varchar[]` → `::text[]` in `createPracticeExams` raw SQL (lines 682–683) |
