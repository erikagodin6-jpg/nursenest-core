# Flashcard Mapping Audit
**Generated:** 2026-05-30  
**Status:** Pre-implementation analysis — no changes made

---

## Summary

Three critical problems: (1) single-select only — learners cannot pick Cardiac + Respiratory together; (2) card counts sometimes show 0 due to data loading race; (3) flashcard taxonomy is not aligned with the lesson/question bank blueprint.

---

## Problem 1 — Single System Select Only (CRITICAL)

**Current behaviour:** The flashcard hub allows selecting ONE body system at a time (e.g. Cardiac). Clicking a second system deselects the first.

**Required behaviour:** Multi-select. Learners should be able to study:
- Cardiac + Respiratory
- Cardiac + Neuro + Endocrine
- All Systems (default)

**Root cause:** The flashcard custom session builder at `src/app/(app)/app/(learner)/flashcards/custom-session/` uses a single `bodySystem` param, not an array. The API at `/api/flashcards/cards` likely only accepts one system.

**Files to change:**
- `src/app/(app)/app/(learner)/flashcards/` — hub system selector UI
- `src/app/(app)/app/(learner)/flashcards/custom-session/` — session builder
- `src/app/api/flashcards/cards/` — add `systems[]` array param
- `src/lib/flashcards/build-flashcard-custom-session.ts` — multi-system query

**Fix pattern:**
```typescript
// BEFORE (single system)
bodySystem: "cardiovascular"

// AFTER (multi-select array)
bodySystems: ["cardiovascular", "respiratory", "neurological"]
```

---

## Problem 2 — Card Counts Show 0 (HIGH)

**Current behaviour:** System cards sometimes show "0 cards" even when flashcards exist for that system.

**Root cause (probable):**
1. Count query runs against `FlashcardDeck.cardCount` (pre-aggregated) but the deck's `country` or `tier` filter doesn't match the learner's entitlement profile
2. OR: The count is fetched client-side after the page renders, causing a flash of 0 before the count loads
3. OR: The system filter key (`bodySystem`) doesn't match the `category.slug` used in the flashcard schema

**Verification query needed:**
```sql
-- Check how many flashcards exist per category/body system for a subscriber
SELECT c.name, c.slug, COUNT(f.id) as card_count
FROM flashcard_categories c
LEFT JOIN flashcards f ON f."categoryId" = c.id
  AND f.status = 'published'
  AND f.tier IN ('RN', 'PRE_NURSING')  -- example subscriber tier ladder
  AND f.country = 'CA'
GROUP BY c.name, c.slug
ORDER BY card_count DESC;
```

**Fix:** Server-side count with caching, matching the learner's exact entitlement tier and country.

---

## Problem 3 — Flashcard Taxonomy Disconnected from Blueprint (MEDIUM)

**Required:** Flashcard system categories must mirror the lesson and question bank categories exactly.

**Current flashcard categories** (from `FlashcardDeck.country` / `Category` model):
- Cardiovascular, Respiratory, Pharmacology, etc. (unknown exact list)

**Lesson taxonomy** (from `PathwayLesson.bodySystem`):
- cardiovascular, respiratory, renal, endocrine, neuro, GI, musculoskeletal, integumentary, hematology, maternal-newborn, pediatrics, mental-health, leadership, pharmacology, fundamentals

**CAT/Question Bank taxonomy** (from `ExamQuestion.bodySystem`):
- Same as lesson taxonomy above

**Gap:** If flashcard `category.slug` values don't exactly match `ExamQuestion.bodySystem` and `PathwayLesson.bodySystem`, the "All Systems" count displayed per topic will be inconsistent.

**Fix:** Align `Category.slug` to the canonical body system taxonomy used by lessons and questions.

---

## System Coverage Matrix

| Body System | Lessons Available | Questions Available | Flashcards Available | CAT Eligible | Mismatch? |
|---|---|---|---|---|---|
| Cardiovascular | ✅ Yes | ✅ Yes | ❓ Needs check | ✅ Yes | Unknown |
| Respiratory | ✅ Yes | ✅ Yes | ❓ Needs check | ✅ Yes | Unknown |
| Pharmacology | ✅ Yes | ✅ Yes | ❓ Needs check | ✅ Yes | Unknown |
| Renal | ✅ Yes | ✅ Yes | ❓ Needs check | ✅ Yes | Unknown |
| Neurological | ✅ Yes | ✅ Yes | ❓ Needs check | ✅ Yes | Unknown |
| Endocrine | ✅ Yes | ✅ Yes | ❓ Needs check | ✅ Yes | Unknown |
| GI | ✅ Yes | ✅ Yes | ❓ Needs check | ✅ Yes | Unknown |
| Mental Health | ✅ Yes | ✅ Yes | ❓ Needs check | ✅ Yes | Unknown |
| Maternal-Newborn | ✅ Yes | ✅ Yes | ❓ Needs check | ✅ Yes | Unknown |
| Pediatrics | ✅ Yes | ✅ Yes | ❓ Needs check | ✅ Yes | Unknown |
| Leadership | ✅ Yes | ✅ Yes | ❓ Needs check | ✅ Yes | Unknown |
| Fundamentals | ✅ Yes | ✅ Yes | ❓ Needs check | ✅ Yes | Unknown |

*"❓ Needs check" means: requires DB query to confirm card count > 0 for subscriber tier*

---

## Flashcard Hub — Required UI Changes

### Current state
- Single system selector (radio button behaviour)
- Counts may show 0 on load
- No clear connection to CAT or Question Bank from hub page

### Required state
- Multi-system selector (checkbox behaviour)  
- Counts loaded server-side, guaranteed accurate  
- "Study These Systems in CAT" CTA when ≥1 system selected  
- "Practice Questions on This Topic" CTA per selected system  
- "Related Lessons" chip linking to matching lesson hub filter  

### System selector component change
```tsx
// BEFORE: single select
<SystemSelector 
  systems={BODY_SYSTEMS}
  selected={selectedSystem}        // string | null
  onSelect={(s) => setSelected(s)} // replaces
/>

// AFTER: multi-select
<SystemSelector
  systems={BODY_SYSTEMS}
  selected={selectedSystems}               // string[]
  onToggle={(s) => toggleSystem(s)}        // adds or removes
  onSelectAll={() => setAll()}
  onClear={() => setNone()}
/>
```

---

## Implementation Priority

| Fix | Impact | Effort | Priority |
|---|---|---|---|
| Multi-select system picker | High — core UX | Medium | P0 |
| Fix 0-count bug (server-side counts) | High — trust issue | Small | P0 |
| Align taxonomy slugs to blueprint | Medium — consistency | Small | P1 |
| Add CAT/Question Bank CTAs on hub | Medium — engagement | Small | P1 |
| "Related Lessons" chips on flashcard hub | Low — discovery | Small | P2 |
