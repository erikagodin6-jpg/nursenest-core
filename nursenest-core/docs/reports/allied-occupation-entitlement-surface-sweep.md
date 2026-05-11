# Allied occupation entitlement — surface sweep

**Date:** 2026-05-11

## Purpose

Inventory of learner and ops surfaces that depend on **canonical Allied occupation** (Stripe `alliedCareer` → `subscriberCanonicalAlliedProfessionKey`) vs legacy **registry-only** narrowing (`topicSlugsIn`).

## Weak topics and analytics (entitlement-first)

- **Canonical:** `src/lib/allied/allied-weak-topic-filter.ts` — `filterWeakTopicsForAlliedEntitlement`, `filterTopicRowsForAlliedEntitlement`.
- **Clinical intelligence:** `buildClinicalIntelligenceForAllied` / entitlement-aware `buildClinicalIntelligenceForAlliedProfession` in `src/lib/learner/clinical-intelligence.ts`.
- **Deprecated for new call sites:** `filterWeakTopicsForAlliedProfession` (non–allied-core `topicSlugsIn` only).

## Other `topicSlugsIn` uses (not weak-topic entitlement)

These remain **lesson hub / marketing / scripts** scoping — not substitutes for weak-topic entitlement:

- `pathway-lesson-loader.ts`, marketing lessons pages, `allied-hub-inventory-counts.server.ts`, `allied-lesson-access.ts`, admin content overview, audit scripts.

## Staff / admin

- Staff learner bypass: `accessScopeIsStaffLearnerEntitlementBypass`.
- Occupation health: `/admin/diagnostics/allied-occupation` (see migration report).

## Follow-ups

- Populate `SHARED_ALLIED_WEAK_TOPIC_SLUG_ALLOWLIST` where product confirms shared weak areas.
- Extend `classifyAlliedCoreWeakTopicSemantics` / catalog as **profession-primary** semantics mature (beyond legacy `topicSlugsIn`).
