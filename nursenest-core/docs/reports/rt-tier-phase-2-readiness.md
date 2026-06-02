# RT tier — Phase 2 readiness inventory

_Generated: 2026-05-11 (UTC). Source: `npx tsx scripts/rt-tier-phase-2-inventory.mts`._

## Scope

- **Lessons**: `pathway_lessons` with `pathway_id ∈ {us-allied-core, ca-allied-core}` and `allied_profession_key = 'respiratory'` when the column exists.
- **Lesson scope note**: `allied_profession_key` is absent in this database — lesson totals are **allied-core pathway only** (not RT-filtered).
- **Flashcard decks**: `flashcard_decks.pathway_id` in allied core + `tier = ALLIED` (RT-aligned decks; deck rows are not keyed by allied profession).
- **Flashcards**: published cards on those decks.
- **Practice pool**: `respiratoryTherapyExamQuestionPoolWhere()` + published (hub inventory excludes `module:rt-ventilator` from general RT counts).
- **Ventilator module**: allied core marketing tier/region + exam keys + study-bank gates + respiratory profession slice + `module:rt-ventilator` tag.

## Counts

| Asset | Count |
| --- | ---: |
| Lessons (total) | 46 |
| Flashcard decks (allied core / ALLIED tier) | 0 |
| Flashcards (published, those decks) | 0 |
| Practice questions (published, RT general pool) | 0 |
| CAT-eligible (published, RT pool, `isAdaptiveEligible`) | 0 |
| Ventilator module questions (published, tagged) | 0 |

### Lessons by status

- **PUBLISHED**: 46

### Exam questions by status (RT pool, all statuses)


### Question types (published RT practice pool)

_No rows._

### Body system / category (top 40, published RT pool)

_No rows._

## RT core categories (marketing taxonomy)

Eleven pillar categories are defined in `src/lib/allied/allied-profession-taxonomy.ts` under `ALLIED_PROFESSION_TAXONOMIES.respiratory`.

