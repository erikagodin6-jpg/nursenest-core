# Lesson Filter Chain Audit

Date: 2026-05-31

## Filter Order

1. Authentication and subscriber entitlement.
2. Visible pathway IDs from subscription country, tier, and learner path.
3. Optional `pathwayId` filter.
4. Optional allied profession exclusive topic scope.
5. Optional `topicSlug` or `topic` filter.
6. Publication status: `PUBLISHED`.
7. Locale: `en`.
8. Country and tier row-level constraints.
9. Structural/renderability safety.
10. Optional text search.

## Failure Mode

The topic filter treated `topicSlug` as a single exact stored value. That made system-category routes brittle whenever the UI taxonomy and content inventory used different canonical labels.

Examples:

- UI: `Renal`; stored inventory: `renal-and-urinary`, `fluids-electrolytes-and-acid-base`.
- UI: `Maternity`; stored inventory: `maternal-and-newborn`.
- UI/taxonomy: `mental_health`; stored inventory: `mental-health`.

## Fix

`lessonSystemTopicSlugCandidates` now provides a shared alias set. The live Prisma filter uses `topicSlug in candidates`, and the catalog fallback uses the same candidate set against `topicSlug` and `bodySystem`.

## Risk

Alias expansion is intentionally scoped to known high-value lesson systems. It does not loosen entitlement, country, tier, publication, allied, or renderability gates.
