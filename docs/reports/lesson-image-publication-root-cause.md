# Phase 5E — Lesson Image Publication Root Cause

**Date:** 2026-06-01  
**Audit scope:** 801 lessons (US RN NCLEX-RN pathway)

---

## Findings

### Coverage audit (801 lessons, RN pathway)

| Metric | Value |
|---|---|
| Lessons with any resolved image | 89 (11.1%) |
| Lessons missing images | 712 |
| Lessons that SHOULD have images | 90 |
| Should-have still missing | 53 (41.1% have images, 58.9% missing) |
| Duplicate image candidates | 80 |

### Status breakdown

| Status | Count | Meaning |
|---|---|---|
| `no_image` | 712 | No match found by any resolver step |
| `duplicate_image_candidate` | 80 | Same image would serve this lesson as another |
| `fuzzy_match` | 3 | Fuzzy inventory match (low confidence) |
| `fallback_match` | 2 | Body system fallback (very low confidence) |
| `low_quality_image` | 2 | Resolved but fails quality gate |
| `exact_match` | 2 | Exact slug match in inventory |

---

## Root Cause

### 1. Sparse inventory (primary cause)

`src/config/education-image-inventory.json` contains **50 object keys**, all in the dermatology/ophthalmology category:

```
uploads/images/alopecia.png
uploads/images/atopic-dermatitis.png
uploads/images/conjunctivitis.png
...
```

Core nursing topics — cardiac, respiratory, pharmacology, fluids/electrolytes — have **zero** inventory entries. The image resolver falls through all 8 matching steps with no match.

### 2. Inventory sync not automated (structural cause)

The inventory is a **static JSON file** committed to the repository. It must be rebuilt by running:

```bash
node scripts/sync-lesson-image-inventory.mjs
```

This script lists all objects in the DigitalOcean Spaces bucket and writes the updated JSON. Without running this script:
- Images uploaded to Spaces are **invisible** to the resolver
- Lessons that COULD show images continue to show none

The script was not wired into CI/CD, so the inventory drifts from the actual bucket contents over time.

### 3. Lesson-image-map.ts entries reference unconfirmed bucket objects (secondary cause)

`src/lib/lessons/lesson-image-map.ts` (540 lines) contains keyword/slug mappings to object keys like `"cardiactamponade.jpeg"` and `"bariatricsurgery.png"`. These are expected to be root-level objects in the `nursenest-images` bucket.

If those objects exist in the bucket but the sync script hasn't been run, the inventory doesn't contain them → the inventory-based matching steps fail → the map-based steps succeed only if the CDN URL resolves.

**The `SafeLessonRemoteImage` component handles load failures gracefully** (calls `onHidden()` on error), so broken image URLs produce no visible UI — they silently disappear. This makes it difficult to detect missing uploads.

---

## Fix implemented

### Automated inventory sync workflow

`/.github/workflows/sync-lesson-image-inventory.yml`

- Runs daily at 03:00 UTC
- Lists all Spaces objects and writes updated `education-image-inventory.json`
- Auto-commits if changed (skips commit when no changes)
- Requires secrets: `SPACES_KEY`, `SPACES_SECRET`
- Trigger on workflow_dispatch for manual runs

**Expected outcome after running with valid credentials:**
- Inventory updated to reflect all objects in the bucket
- Lessons with uploaded images immediately start showing them on next deploy
- No code changes needed per-upload after workflow is active

---

## To reach 90% image coverage (success criteria)

The 90% target for "lessons with images when one exists" requires:
1. Uploading images to Spaces for the 53 high-priority missing lessons
2. Running the sync script (or letting the daily workflow run)
3. Committing the updated inventory JSON

**Priority upload queue** (from audit, `critical` priority):
- 40 critical-priority lessons identified (cardiac, respiratory, pharmacology emphasis)
- 23 high-priority lessons
- Full list: `/root/nursenest-core/reports/lesson-image-audit/IMAGE-PRODUCTION-ROADMAP.md`

---

## Editorial workflow (for content team)

1. Upload image to `nursenest-images` Spaces bucket named after the lesson slug:
   - `pulmonary-embolism.webp` — serves the "Pulmonary Embolism" lesson automatically
   - `heart-failure.webp` — serves heart failure lessons automatically
2. Run inventory sync (or wait for nightly CI job):
   ```bash
   SPACES_KEY=… SPACES_SECRET=… node scripts/sync-lesson-image-inventory.mjs
   ```
3. Commit `src/config/education-image-inventory.json`
4. Image appears on the lesson within one deploy

For images where slug matching fails, add an entry to `src/lib/lessons/lesson-image-overrides.ts`:
```typescript
"acute-kidney-injury": "uploads/images/aki.webp"
```
