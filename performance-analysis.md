# Performance Analysis: Slow Page Loads

## Root Cause Analysis

The Flashcards page (`/app/flashcards`) and Practice Tests page (`/app/practice-tests`) both suffer from **sequential aggregate SQL queries on the `exam_questions` table** with ~2.5M rows.

### Bottleneck #1: loadSubscriberDiscoveryAggregates (practice-tests)
Runs 3 aggregate queries in a transaction with 5.5s statement timeout:
```sql
SELECT COUNT(*) FROM exam_questions WHERE <complex where>
SELECT topic, COUNT(*) FROM exam_questions WHERE ... GROUP BY topic LIMIT 250
SELECT exam, COUNT(*) FROM exam_questions WHERE ... GROUP BY exam LIMIT 120
```

### Bottleneck #2: loadFlashcardsExamInventoryForPathway (flashcards)
Runs 4 aggregate queries in a transaction with 8s statement timeout:
```sql
SELECT COUNT(*) FROM exam_questions WHERE <complex where>
SELECT body_system, topic, COUNT(*) FROM exam_questions WHERE ... GROUP BY body_system, topic LIMIT 500
+ flashcard count + legacy canonical count
```

### The WHERE clause includes:
1. `status = 'published'` (highly selective)
2. `tier IN (...) ` (moderately selective, 3-5 tiers)
3. `region_scope IN ('BOTH', 'CA_ONLY')` (moderately selective)
4. Exam key normalization scope (by exam column)
5. OR clause with `study_link_pathway_id`
6. Quality gates: stem length, correct answer, format, non-ECG tag
7. General study bank scope (tags array check)

### Why is it slow?
- No covering index exists for these specific filter + GROUP BY patterns
- Postgres must do sequential scan on large table, then sort/group
- The `tags` array check (`'general-nursing-practice' = ANY(tags)`) cannot use B-tree index efficiently
- The `OR` clause with `coalesce(study_link_pathway_id, '') = ...` can defeat index usage
- Each page load re-executes these expensive queries from scratch

## Existing Indexes
- `[@index](status, tier)` - partial coverage
- `[@index](status, exam, tier, countryCode)` - close but missing region_scope + GROUP BY columns
- `[@index](status, exam, topic)` - close for topic discovery
- No index covering `(status, tier, region_scope, exam, topic)` for GROUP BY topic
- No index covering `(status, tier, region_scope, exam, body_system, topic)` for GROUP BY body_system,topic

## Solution
1. **Add composite covering indexes** for each query pattern
2. **Cache aggregate results** server-side with TTL
3. **Simplify WHERE clause** to avoid `coalesce` in OR
4. **Parallelize at page level** using `Promise.all`
