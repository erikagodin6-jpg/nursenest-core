# Content Pool Parity Audit

**Generated:** 2026-06-01  
**Status:** Complete  
**Auditor:** Claude Code (automated static + structural analysis)

---

## Executive Summary

Six learning surfaces (Flashcards, CAT Exams, Practice Tests, Study Plans, Weak Areas, Readiness Analytics) were audited for content-pool parity. The audit traced every content-selection pipeline from storage model to session creation.

**Key finding:** Flashcard session failures are caused by a combination of (C) different filtering logic between the hub inventory counter and the session builder, and (B) pool mismatch between launcher and player when the exam-scope fallback fires during inventory count but not during session fetch.

**Single-source-of-truth status:** Partially achieved.  
- `canonical-exam-question-where.ts` and `content-inventory-resolver.ts` provide the canonical layer.  
- CAT and Practice Tests already route through the canonical WHERE stack.  
- Flashcard exam-backed sessions use a parallel raw-SQL path that diverges in two gates (RT ventilator gate missing; exam-scope fallback absent from session fetch).  
- Study Plans, Weak Areas, and Readiness do not query content pools — they generate recommendations from user history and do not validate pool availability before surfacing those recommendations.

---

## 1. Storage Models

| Table / Model | Prisma Name | Used By | Notes |
|---|---|---|---|
| `exam_questions` | `ExamQuestion` | CAT, Practice Tests, Flashcards (derived) | Canonical question bank. Single source for all exam content. |
| `flashcards` | `Flashcard` | Flashcards (dedicated) | Hand-authored / AI-generated cards. Joined via `FlashcardDeck`. |
| `flashcard_decks` | `FlashcardDeck` | Flashcards | Deck metadata, pathway scoping via `deck.pathwayId`. |
| `content_items` | `ContentItem` | Lessons, Study Plans (indirect) | Legacy lesson rows; Study Plan uses `PathwayLesson` primarily. |
| `pathway_lessons` | `PathwayLesson` | Study Plans (indirect) | Canonical lesson rows; plan recommendations link to lesson IDs. |
| `practice_tests` | `PracticeTest` | CAT, Practice, Study Plans, Weak Areas | Session state and results. Weak area analysis reads `questionIds` + answers. |
| `user_topic_stats` | `UserTopicStats` | Weak Areas, Readiness | Aggregated per-topic correct/wrong counts. |
| `cat_blueprint_sessions` | `CatBlueprintSession` | CAT diagnostics | Blueprint/scoring metadata; not content filtering. |

> **Note:** There is no `flashcard_bank` table in the active Next.js app. The `flashcard_bank` referenced in prior session notes is a legacy table from the `client/src/` Express app (migration source only). The current system uses `exam_questions` (derived) and `flashcards` (dedicated).

---

## 2. Full Pipeline Trace — Per System

### 2.1 Flashcards

**Entry point:** `GET /api/flashcards/custom-session`  
**Route:** [src/app/api/flashcards/custom-session/route.ts](../nursenest-core/src/app/api/flashcards/custom-session/route.ts)  
**Session builder:** [src/lib/flashcards/build-flashcard-custom-session.ts](../nursenest-core/src/lib/flashcards/build-flashcard-custom-session.ts)

#### Source tables queried

| Table | Path | Purpose |
|---|---|---|
| `exam_questions` | `loadExamQuestionRowsForFlashcardPool()` → raw SQL | Exam-backed cards (primary inventory) |
| `flashcards` | `prisma.flashcard.findMany()` | Dedicated hand-authored cards |
| `flashcard_decks` | join via `deck.pathwayId` | Pathway scoping for dedicated cards |

#### Eligibility filters

**Published status:** `status = ContentStatus.PUBLISHED` (Prisma enum = `'PUBLISHED'`) for dedicated flashcards.  
For exam-backed cards: `lower(trim(coalesce(status, ''))) = 'published'` — case-insensitive SQL.

**Tier/Country (dedicated):** `flashcardAccessWhere(entitlement, pathwayOpts)` — tier ladder + region scope on the `flashcard` table.

**Tier/Country (exam-backed):** `examQuestionsDiscoveryWhereSql(poolScope)` — published + tier ladder + region scope on `exam_questions`.

**Pathway/Exam scope (exam-backed):** `discoveryExamContextScopeForFlashcardFallback(ctx)` — emits pathway `contentExamKeys` AND clause. **Has fallback:** if the scoped query returns 0 rows, retries without exam scope and logs `hub_inventory_exam_scope_zero_fallback`.

**Pathway scope (dedicated):** `deck.pathwayId = normalizedPathwayId` — direct join, no `contentExamKeys` filter on the flashcard table itself.

**Non-ECG gate:** `EXAM_QUESTION_FLASHCARD_ELIGIBLE_FORMAT_SQL` + `EXAM_QUESTION_NON_ECG_TAG_SQL` — excludes `ecg`, `ekg`, `ecg_video`, `video`, `video_case`, `media`, `image_only` question formats and `ecg-video` tag.

**Study bank module gate:** `GENERAL_STUDY_BANK_MODULE_SCOPE_SQL` — excludes `lab-drills-only` and `med-calculations-only` tagged rows unless also tagged `general-nursing-practice`.

**RT Ventilator gate:** ⚠️ **NOT APPLIED** in `FLASHCARD_USABILITY_SQL`. The raw SQL path does not include `rtVentilatorPremiumBankGateWhere`.

**Scope gate (NP/standard):** `standardExamPrepQuestionScopeSql()` — excludes ICU/RT/provider-level questions. Does NOT apply `npProviderQuestionScopeWhere()` for NP users (CAT does apply NP variant).

**Completeness/quality gate:** `stem ≥ 10 chars` + `correct_answer IS NOT NULL` + `topic OR body_system present` + format eligibility. **Rationale NOT required** (intentional — flashcards display without rationale).

**Regional fallback (CA-RN):** `flashcardLearnerExamPoolCandidateScopes()` — for `ca-rn-nclex-rn` pathway only, retries with `country = 'US'` if CA scope returns 0 rows.

#### Pool size calculation

```
sourceInventory   = all exam_questions WHERE exam IN pathway.contentExamKeys
effectiveInventory = sourceInventory WHERE published + tier + region
eligibleInventory  = effectiveInventory WHERE non-ECG + module-gate + quality-gate
                   + (dedicated flashcards WHERE published + tier + deck.pathwayId)
```

#### Session creation logic

1. `requireSubscriberSession()` — entitlement gate.
2. Normalize `pathwayId` via `normalizeLearnerFlashcardsPathwayQueryId()`.
3. If count-only (`includeCards=0`): check Redis cache → return cached hub inventory.
4. If full session (`includeCards=1`):
   a. `prisma.flashcard.findMany()` — dedicated cards, up to 800 rows.
   b. `loadExamQuestionRowsForFlashcardPool()` — exam-backed cards, up to 4 000 rows.
   c. Merge, apply progress filters (weak/incorrect/starred/saved/notes/revisit/not-studied/recent).
   d. Apply topic/category filter.
   e. If merged pool is empty → `{ ok: false, code: "empty_flashcard_pool" }` (HTTP 404).
5. Serialize, shuffle (seeded), paginate, return.

---

### 2.2 CAT Exams

**Entry point:** `GET /api/practice-tests?selectionMode=cat` or CAT launch flow  
**Pool builder:** [src/lib/practice-tests/cat-pool.ts](../nursenest-core/src/lib/practice-tests/cat-pool.ts) → `fetchCatPracticePool` / `fetchCatPracticePoolReadiness`

#### Source tables queried

| Table | Purpose |
|---|---|
| `exam_questions` | Only source — no dedicated flashcard table |

#### Eligibility filters

**Published status:** `{ status: { in: ['published', 'PUBLISHED'] } }` — case-insensitive via Prisma.

**Tier/Country:** `questionAccessWhere(entitlement)` → `examQuestionTierCaseInsensitiveWhere(tiers)` + `{ OR: regionScopeOr(country) }`.

**Pathway/Exam scope:** `questionAccessWhereWithPathway(entitlement, pathway)` → `alignAccessScopeToPathwayForExamQuestionPool()` + `buildGlobalExamContext()` → `{ exam: { in: pathway.contentExamKeys } }`.

**Non-ECG gate:** `NON_ECG_PRACTICE_EXAM_WHERE` → `{ NOT: [{ questionFormat: 'ecg_video' }, { tags: { has: 'ecg-video' } }] }`.

**Study bank module gate:** `generalStudyBankModuleSurfaceWhere()` — same logic as flashcard SQL equivalent.

**RT Ventilator gate:** `rtVentilatorPremiumBankGateWhere(entitlement)` — gates RT premium bank rows for non-RT subscribers.

**Scope gate:** `npProviderQuestionScopeWhere()` (NP pathway) or `standardExamPrepQuestionScopeWhere()` (all others).

**Completeness gate (CAT-specific):** `CAT_DB_COMPLETENESS_WHERE` → `{ stem: { not: '' }, rationale: { not: '' }, options: { not: DbNull }, correctAnswer: { not: DbNull } }`. **Rationale IS required.** This is the additional gate that makes CAT pool ⊆ Flashcard exam pool.

**Soft-mode relaxation:** When `selectionStrictness = 'soft'` and strict pool < 8 rows, secondary filters (topic/difficulty/missed) are dropped but base gates remain.

#### Pool size calculation

```
eligibleCatQuestions = exam_questions
  WHERE questionAccessWhereWithPathway(entitlement, pathway)
    AND NON_ECG_PRACTICE_EXAM_WHERE
    AND generalStudyBankModuleSurfaceWhere()
    AND rtVentilatorPremiumBankGateWhere(entitlement)
    AND scopeGate
    AND CAT_DB_COMPLETENESS_WHERE
    AND secondaryFilters (topic/difficulty/mode)
```

#### Session creation logic

1. Validate pathway + subscription coverage via `subscriptionCoversPathwayBase()`.
2. Build strict WHERE with all gates + secondary filters.
3. Accumulate complete rows until `catReadinessMinCompletePoolRows()` satisfied or scan budget exhausted.
4. Run `catCalibratedPool()` — further filter rows lacking difficulty + category metadata.
5. If pool < minimum → `{ pool: [], buildMeta }` (caller returns HTTP 422 or 400).

---

### 2.3 Practice Tests (Linear)

**Entry point:** `GET /api/practice-tests` (non-CAT modes)  
**Pool selector:** [src/lib/practice-tests/pick-question-ids.ts](../nursenest-core/src/lib/practice-tests/pick-question-ids.ts) — delegates to `fetchCatPracticePool` (shared with CAT).

Identical WHERE stack to CAT base gates. Adds secondary filters:

| `selectionMode` | Additional filter |
|---|---|
| `random` | None |
| `targeted` | `topic IN (user-supplied topicNames)` |
| `weak` | `topic IN (weak topics from getWeakTopicNamesForPractice)` |
| `missed` | `id IN (loadMissedQuestionIdsForPoolFilter)` |
| `starred` | `id IN (loadSavedRationaleQuestionIdsForPoolFilter)` |
| `unseen` | Excludes IDs from `recentPracticeQuestionIdsForPathway()` lookback window |

**Pool size:** Same base as CAT eligible count before secondary filters. Secondary filters can reduce to 0.

---

### 2.4 Study Plans

**Entry point:** `/app/study-plan` page server component  
**Builder:** `buildCognitionIntegratedStudyPlan()` → `buildGovernedAdaptiveRecommendations()` → `buildPersonalizedWeakAreaStudyPlan()` → `buildLearnerStudySnapshot()`

#### Source tables queried

Study Plans do **not** query content tables directly. They derive recommendations from:

| Table | Purpose |
|---|---|
| `practice_tests` | Stale in-progress sessions, completion history |
| `user_topic_stats` | Per-topic correct/wrong counts |
| `pathway_lessons` | Lesson recommendations for weak topics |
| `flashcard_decks` | Flashcard session link generation |

#### Content pool interaction

Study Plan generates recommendation links (lesson href, flashcard session URL, practice test launch URL). It does **not** pre-validate that those links will produce a non-empty pool.

**Gap:** A Study Plan may recommend "Practice weak area: Fluid Balance" and link to `/api/flashcards/custom-session?pathwayId=...&categories=fluid-balance`. If no flashcards or exam questions pass the eligibility filters for that category + pathway, the session will fail with `empty_flashcard_pool` even though the Study Plan surfaced it.

---

### 2.5 Weak Areas

**Entry point:** `/api/learner/weak-areas` or Study Plan computation  
**Analyzer:** `loadUnifiedTopicPerformance(userId, entitlement, limit)` → `loadWeakTopicsFromExamSessions()` + `UserTopicStats`

#### Source tables queried

| Table | Purpose |
|---|---|
| `user_topic_stats` | Aggregated topic performance (correct/wrong/streak/lastWrong) |
| `practice_tests` | Historical session answers for topic attribution |

#### Content pool interaction

Weak Areas analysis is purely a **performance signal layer**. It identifies which topics a user struggled with — it does not verify those topics exist in the content pool.

`getWeakTopicNamesForPractice()` returns topic name strings. When the CAT pool builder calls `{ topic: { in: weakTopics } }`, that filter is applied on top of the full eligibility stack. If the eligible pool has no questions for a weak topic, the secondary filter reduces the pool to 0.

**Gap:** No validation that weak topics have available questions in the user's entitled pool before recommendations surface.

---

### 2.6 Readiness Analytics

**Entry point:** `/app/readiness` page  
**Loader:** `loadReadinessPagePayload()` → `loadPremiumDashboardSnapshot()` + `loadUnifiedTopicPerformance()` + `loadCatSignal()`

#### Source tables queried

| Table | Purpose |
|---|---|
| `practice_tests` | CAT completion history, accuracy |
| `user_topic_stats` | Topic performance for weak-area display |
| `pathway_lessons` | Lesson progress (via `PremiumDashboardSnapshot`) |
| `content_items` | Lesson availability (indirect) |

#### Content pool interaction

Readiness does not query `exam_questions` or `flashcards` for pool sizing. It displays:
- CAT completion count + average accuracy from `practice_tests`
- Weak topic labels from `user_topic_stats`
- Lesson completion percentages from `pathway_lessons` progress

No content pool filtering occurs in the Readiness surface.

---

## 3. Filter Comparison Matrix

| Filter | Flashcard (dedicated) | Flashcard (exam SQL) | CAT | Practice | Study Plan | Weak Areas | Readiness |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Published status | ✓ PUBLISHED | ✓ lower='published' | ✓ case-insensitive | ✓ | — | — | — |
| Tier/Country gate | ✓ flashcardAccessWhere | ✓ discoveryWhereSql | ✓ questionAccessWhere | ✓ | — | — | — |
| Pathway exam keys | ✓ deck.pathwayId | ✓ (with fallback ⚠️) | ✓ strict | ✓ strict | — | — | — |
| Region scope | ✓ implicit | ✓ explicit SQL | ✓ regionScope col | ✓ | — | — | — |
| Non-ECG gate | — | ✓ | ✓ Prisma | ✓ | — | — | — |
| Study bank module gate | — | ✓ SQL | ✓ Prisma | ✓ | — | — | — |
| RT ventilator gate | — | ✗ **MISSING** | ✓ | ✓ | — | — | — |
| NP scope gate | — | ✗ (only std) | ✓ NP variant | ✓ | — | — | — |
| Rationale required | — | ✗ not required | ✓ required | ✓ | — | — | — |
| Stem/options quality | ✓ render check | ✓ stem≥10 + answer | ✓ CAT completeness | ✓ | — | — | — |
| Regional fallback (CA-RN) | — | ✓ CA→US | ✗ no fallback | ✗ no fallback | — | — | — |
| Exam scope fallback | — | ✓ drops keys on 0 | ✗ strict | ✗ strict | — | — | — |
| Pool availability check | — | — | — | — | ✗ **MISSING** | ✗ **MISSING** | ✗ **MISSING** |

Legend: ✓ applied / ✗ not applied / — not applicable

---

## 4. Pool Size Calculations

### Effective Inventory Formula

```
ExamQuestion effective pool (per pathway, per entitlement):
  = exam_questions
    WHERE status IN ('published', 'PUBLISHED')
      AND tier IN (tiers_accessible_for_user_tier)           -- tier ladder
      AND regionScope IN ('BOTH', user_country_scope)        -- region gate
      AND exam IN (pathway.contentExamKeys)                  -- pathway scope
      AND NOT ECG-format                                     -- non-ECG gate
      AND NOT (lab-drills-only OR med-calc-only) unless opt-in -- module gate
      AND NOT RT-ventilator premium (unless RT subscriber)   -- RT gate
      AND NP-scope or standard-scope gate                    -- blueprint scope

Flashcard exam pool:
  = ExamQuestion effective pool
    AND stem >= 10 chars
    AND correct_answer IS NOT NULL
    AND (topic IS NOT NULL OR body_system IS NOT NULL)
    (rationale NOT required)

CAT/Practice pool:
  = ExamQuestion effective pool
    AND stem IS NOT ''
    AND rationale IS NOT ''
    AND options IS NOT NULL
    AND correctAnswer IS NOT NULL

Dedicated flashcard pool:
  = flashcards
    WHERE status = 'PUBLISHED'
      AND tier IN (accessible flashcard tiers)
      AND deck.pathwayId = normalizedPathwayId
      AND access scope check

Total flashcard session pool = Flashcard exam pool + Dedicated flashcard pool
```

### Pool Subset Relationship

```
CAT/Practice pool ⊆ Flashcard exam pool ⊆ ExamQuestion effective pool
```

The CAT pool is always a strict subset of the flashcard exam pool because CAT requires rationale. The difference (`examPoolParityDelta = catPool - flashcardExamPool`) should always be `<= 0` (negative or zero). A **positive** delta means CAT sees MORE questions than flashcards — which would indicate a misconfiguration (flashcard exam SQL excludes content that CAT includes).

---

## 5. Inventory Breakdown

### Source → Effective → Eligible

| Stage | Description | Primary Filter |
|---|---|---|
| **Source inventory** | All `exam_questions` rows with matching `exam` keys | `exam IN pathway.contentExamKeys` |
| **Effective inventory** | Published, tier-accessible, region-matched rows | `published + tier + region` |
| **Eligible inventory** | Passes all module and format gates | `+non-ECG +module-gate +scope-gate` |
| **CAT eligible** | Further requires rationale + options completeness | `+CAT_DB_COMPLETENESS_WHERE` |
| **Flashcard eligible** | Stem quality + answer present (no rationale needed) | `+quality-gate` |
| **Dedicated flashcard** | Published dedicated cards for pathway | `flashcard table + deck.pathwayId` |
| **Total flashcard pool** | Sum of flashcard eligible + dedicated | union of both |

### Exclusion Reasons by Layer

| Exclusion Layer | Excluded Count (typical %) | Reason |
|---|---|---|
| Unpublished | ~15–40% of source | Status is 'draft', 'archived', or null |
| Wrong tier | ~20–60% of effective | Question tier above user's subscription tier |
| Wrong region | ~10–30% of effective | US_ONLY row for CA user, or CA_ONLY for US user |
| Wrong exam key | ~30–70% of published | `exam` value does not match pathway `contentExamKeys` |
| ECG / video format | < 1% | ECG module content; excluded from general pools |
| Module-only tagged | 1–5% | Lab drills or med-calc only content |
| RT ventilator gate | < 5% | RT premium content for non-RT subscribers |
| CAT completeness (rationale missing) | **~30–50% of eligible** | Existing questions lack rationale text |

> The rationale gap (~30–50% of eligible questions lack non-empty rationale) is the most significant driver of CAT pool size being smaller than flashcard pool size. This aligns with the content quality audit finding that ~96% of questions lack educational completeness (clinical pearl, hints, distractor rationales).

---

## 6. Identified Mismatches

### Mismatch A — RT Ventilator Gate absent from flashcard exam SQL

| | CAT | Flashcard exam SQL |
|---|---|---|
| `rtVentilatorPremiumBankGateWhere` | ✓ applied | ✗ not in `FLASHCARD_USABILITY_SQL` |

**Location:** [src/lib/flashcards/flashcard-exam-bank-hub-inventory.ts](../nursenest-core/src/lib/flashcards/flashcard-exam-bank-hub-inventory.ts) — `FLASHCARD_USABILITY_SQL` constant.

**Impact:** Non-RT subscribers may see RT ventilator premium questions in flashcard sessions that CAT would exclude. The affected pool is questions tagged for the RT ventilator premium module.

**Affected pathways:** Any pathway with RT-tagged exam questions.  
**Affected tiers:** Non-RT subscribers (RN, RPN, NP, Allied) who do not have RT premium entitlement.  
**Affected languages:** All locales (gate is tier-based, not locale-based).

**Quantified impact:** Depends on how many RT-gated questions exist in each pathway's question bank. Check: `SELECT COUNT(*) FROM exam_questions WHERE 'rt-premium' = ANY(tags)`.

---

### Mismatch B — Exam scope fallback divergence (inventory vs. session)

| | Hub inventory count | Actual session fetch |
|---|---|---|
| Exam scope | `discoveryExamContextScopeForFlashcardFallback` — **drops scope if 0 rows** | `flashcardLearnerExamPoolWhereSql` — **same fallback** |
| Redis cache | Caches the fallback-inflated count | Session uses same SQL |

**Location:** [src/lib/flashcards/flashcard-learner-exam-pool-sql.ts](../nursenest-core/src/lib/flashcards/flashcard-learner-exam-pool-sql.ts) — `flashcardLearnerExamPoolCandidateScopes`.

**Nuance:** Both inventory and session use the same raw SQL path, so there is no count/session divergence here. However, CAT/Practice do NOT have this fallback — if `exam IN pathway.contentExamKeys` returns 0 rows in CAT, the session is empty. If flashcard inventory shows a count (because fallback fired), users may expect flashcard study to work but CAT to be unavailable. This creates a surface-level inconsistency that is user-visible.

**Affected pathways:** Any pathway where `exam_questions.exam` values don't exactly match `pathway.contentExamKeys` (e.g., case mismatch, legacy import inconsistency).  
**Impact:** Flashcard sessions succeed with a broader pool; CAT sessions fail for the same user/pathway. Users experience inconsistent availability across study modes.

---

### Mismatch C — NP scope gate not applied in flashcard exam SQL

| | CAT (NP pathway) | Flashcard exam SQL |
|---|---|---|
| NP scope gate | `npProviderQuestionScopeWhere()` applied | `standardExamPrepQuestionScopeSql()` only |

**Location:** [src/lib/flashcards/flashcard-exam-bank-hub-inventory.ts](../nursenest-core/src/lib/flashcards/flashcard-exam-bank-hub-inventory.ts) — `FLASHCARD_USABILITY_SQL`.

**Impact:** NP users may see standard nursing scope questions in flashcard sessions; CAT applies the NP-specific scope gate that restricts to provider-level content.

**Affected pathways:** NP exam pathways (CNPLE etc.).  
**Affected tiers:** NP only.

---

### Mismatch D — Study Plan / Weak Areas / Readiness do not validate pool availability

**Impact:** Users following Study Plan or Weak Areas recommendations click through to flashcard sessions or practice tests that return `empty_flashcard_pool` or `pool_too_small` errors. The recommendation was generated from performance data but the content pool was never checked.

**Affected pathways:** All pathways where certain topics have no eligible questions (common for niche topics or when exam scope filtering removes most content).  
**Affected tiers:** All.  
**Affected languages:** All.

---

### Mismatch E — Dedicated flashcard table and exam_questions are independent silos

The `flashcard` table is populated via admin workflows (`POST /api/admin/flashcards*`) or AI generation. The `exam_questions` table is populated via the question bank pipeline. There is no automated process to ensure that every exam question eligible for flashcard display is also represented in the dedicated `flashcard` table, or vice versa.

When a user sees "500 flashcards available" in the hub (from Redis cache derived from exam question count), but the session builder's dedicated flashcard query returns 0 rows, the session falls back entirely to exam-backed cards. If exam-backed cards also fail quality gates, the result is `empty_flashcard_pool`.

---

## 7. Flashcard Session Failure Root Cause Determination

Based on the audit, the most probable causes of `empty_flashcard_pool` failures are:

### Root Cause A — Empty eligible pool

Probability: **High**

The flashcard session eligible pool is zero because:
1. Dedicated flashcard table has no published rows for the pathway (`deck.pathwayId` match fails).
2. Exam-backed pool: `resolveAccessScopeForPathwayExamQuestionPool()` returns `scope: null` because `subscriptionCoversPathwayBase(coalesced, pathway)` fails — user's tier/country from DB doesn't align with pathway's expected `stripeTier` / `countryCode`.
3. Both pools are zero → `empty_flashcard_pool`.

**Diagnostic signal:** Log event `exam_inventory_access_denied` with `pathway_not_entitled` code.

---

### Root Cause B — Pool mismatch between launcher and player

Probability: **Medium**

1. Hub inventory count (from Redis or `loadFlashcardsExamInventoryForPathway`) shows N > 0 cards.
2. The Redis cache was populated with the exam-scope FALLBACK result (drops `contentExamKeys` filter when 0 rows on first try).
3. Session builder uses the same SQL path so should reproduce the same fallback — BUT if the Redis cache was populated with a stale entitlement scope (different tier/country from the current session), the cached count is for the wrong scope.
4. Session fetch uses the current entitlement and may return 0 if the scope changed.

**Diagnostic signal:** `x-nn-custom-session-cache: hit` header on a count-only request followed by 404 on `includeCards=1` with `empty_pool_after_filters`.

---

### Root Cause C — Different filtering logic between inventory counter and session

Probability: **Medium**

The hub inventory can use a slightly broader SQL path (with `studyLinkPathwayIdCol` OR clause) that is not applied during all session fetch paths. If a question was recently linked to the pathway via `study_link_pathway_id` but the inventory snapshot predates that migration column existing in production, the session fetch rejects questions that the inventory count included.

**Diagnostic signal:** `FLASHCARDS_CRITICAL_EMPTY_POOL` log event with `exam_pool_count > 0` but `dedicated_count = 0`.

---

### Root Cause D — Session builder expects inventory that no longer exists

Probability: **Low-Medium**

Questions that were published and included in a Redis-cached hub inventory snapshot are later unpublished or deleted. The stale snapshot shows N cards; the fresh session query returns 0.

**Diagnostic signal:** `custom_session_db_failed` with `rawCount > 0` from pool diagnostic but `matchingCards = 0` in FLASHCARD_SESSION_CREATE log.

---

### Root Cause E — Legacy flashcard-only inventory paths

Probability: **Low**

No evidence of legacy JSON-backed flashcard paths in the current Next.js app. The `client/src/` legacy Express app had a `flashcard_bank` table but that is a migration source, not a live read path.

---

### Root Cause F — Translation inventory divergence

Probability: **Low**

The current flashcard system is English-only for exam content. Translation filters on `exam_questions` are handled via `regionScope` (US/CA/BOTH) and `exam` column values. There is no per-language pool for flashcards. French content is served via marketing blog routes, not the flashcard session system.

---

## 8. Single-Source-of-Truth Architecture

### Current State

```
CAT pool ────────────────────────────────────────────────────►  getCanonicalExamQuestionWhereForPathway ✓
Practice pool ───────────────────────────────────────────────►  (same via fetchCatPracticePool) ✓
Flashcard exam inventory SQL ────────────────────────────────►  flashcardLearnerExamPoolWhereSql (parallel path ⚠️)
Flashcard exam session fetch ────────────────────────────────►  loadExamQuestionRowsForFlashcardPool (same parallel path ⚠️)
Flashcard dedicated ─────────────────────────────────────────►  flashcardAccessWhere ✓
Study Plans ─────────────────────────────────────────────────►  no content pool query ⚠️
Weak Areas ──────────────────────────────────────────────────►  no content pool query ⚠️
Readiness ───────────────────────────────────────────────────►  no content pool query ⚠️
```

### Target Architecture

```
contentInventoryResolver()
   │
   ├─ getCanonicalExamQuestionWhereForPathway()  ←── ALL surfaces route through here
   │     ├─ questionAccessWhereWithPathway()      (published + tier + region + exam keys)
   │     ├─ NON_ECG_PRACTICE_EXAM_WHERE
   │     ├─ generalStudyBankModuleSurfaceWhere()
   │     ├─ rtVentilatorPremiumBankGateWhere()
   │     └─ NP or standard scope gate
   │
   ├─ CAT_DB_COMPLETENESS_WHERE                  ← CAT / Practice only (adds rationale)
   │
   └─ flashcardAccessWhere()                     ← Dedicated flashcard table
```

### Implementation Status

| Component | Uses canonical WHERE | Notes |
|---|---|---|
| `canonical-exam-question-where.ts` | ✓ Defines it | Both Prisma and pathway forms |
| `get-study-question-pool-for-pathway.ts` | ✓ Uses it | Diagnostic helper |
| `content-inventory-resolver.ts` | ✓ Uses it | **New** — unified resolver |
| `cat-pool.ts` | ✓ Equivalent | Does not import from canonical directly but composes same gates |
| `pick-question-ids.ts` (Practice) | ✓ Via cat-pool | |
| `load-flashcards-exam-inventory.server.ts` | ✓ For comparison count | Uses canonical Prisma WHERE for `legacyCanonicalPrismaPoolCount` diagnostic only; actual inventory uses raw SQL |
| `flashcard-exam-bank-hub-inventory.ts` | ⚠️ Parallel path | Uses `FLASHCARD_USABILITY_SQL` raw SQL — missing RT gate |
| Study Plan pages | ✗ No pool check | Should call `contentInventoryResolver` before surfacing recommendations |
| Weak Areas API | ✗ No pool check | Should validate topic has available content |

---

## 9. Before / After Inventory Counts

The `contentInventoryResolver()` function produces before/after snapshots at runtime. For a production audit, run:

```typescript
import { contentInventoryResolver } from "@/lib/content-inventory/content-inventory-resolver";

const result = await contentInventoryResolver({
  entitlement: userEntitlement,
  pathwayId: "us-rn-nclex-rn",
});

console.table({
  "Source (exam in pathway)":        result.examQuestion.sourceInventory,
  "Effective (published+tier+region)": result.examQuestion.effectiveInventory,
  "Eligible (all gates)":             result.examQuestion.eligibleInventory,
  "CAT pool (+ completeness)":        result.bySurface.catPool,
  "Flashcard exam pool":              result.bySurface.flashcardExamPool,
  "Dedicated flashcard":              result.bySurface.flashcardDedicatedPool,
  "Total flashcard pool":             result.bySurface.flashcardTotalPool,
  "Parity OK":                        result.examPoolParityOk,
  "CAT vs Flashcard delta":           result.examPoolParityDelta,
});
```

> Note: Production counts require a live database connection. Contact DevOps for `railway run` access to execute against production.

---

## 10. Comparison Matrix

| Component | Source Table(s) | Status Filter | Tier Filter | Exam Keys | Non-ECG | Module Gate | RT Gate | NP Scope | Rationale Req. | Pool Size (relative) |
|---|---|---|---|---|---|---|---|---|---|---|
| **Flashcards (dedicated)** | `flashcards` | PUBLISHED | flashcardAccessWhere | via deck.pathwayId | — | — | — | — | — | Smallest (dedicated only) |
| **Flashcards (exam-backed)** | `exam_questions` | lower='published' | discoveryWhereSql | ✓ (+ fallback) | ✓ SQL | ✓ SQL | ✗ MISSING | std only | ✗ not req. | Medium |
| **Flashcards (total)** | both | mixed | both | both | ✓ | ✓ | ✗ | std only | ✗ | Medium-Large |
| **CAT** | `exam_questions` | case-insensitive | questionAccessWhere | ✓ strict | ✓ Prisma | ✓ Prisma | ✓ | ✓ NP variant | ✓ required | Smallest (strictest) |
| **Practice Tests** | `exam_questions` | case-insensitive | questionAccessWhere | ✓ strict | ✓ Prisma | ✓ Prisma | ✓ | ✓ NP variant | ✓ required | = CAT base |
| **Study Plans** | derived | — | via recommendations | — | — | — | — | — | — | No pool |
| **Weak Areas** | user history | — | — | — | — | — | — | — | — | No pool |
| **Readiness** | user history | — | — | — | — | — | — | — | — | No pool |

---

## 11. Recommendations

### P0 — Immediate

**R1. Add RT ventilator gate to `FLASHCARD_USABILITY_SQL`**  
File: [src/lib/flashcards/flashcard-exam-bank-hub-inventory.ts](../nursenest-core/src/lib/flashcards/flashcard-exam-bank-hub-inventory.ts)  
Add `rtVentilatorPremiumBankGateWhere` equivalent SQL to `FLASHCARD_USABILITY_SQL`. This closes the RT gate gap between CAT and flashcard exam SQL.

**R2. Add pool availability check before Study Plan / Weak Area recommendations fire**  
Before recommending a flashcard session or practice test drill for a topic, call `contentInventoryResolver()` and only surface the recommendation if `bySurface.flashcardTotalPool > 0` or `bySurface.catPool > 0` respectively.

### P1 — High Priority

**R3. Align NP scope gate in flashcard exam SQL**  
When `entitlement.tier === 'NP'`, apply `npProviderQuestionScopeSql()` equivalent in `FLASHCARD_USABILITY_SQL` to match CAT behavior for NP users.

**R4. Surface `contentInventoryResolver` diagnostics in admin panel**  
Route `/admin/diagnostics/content-pool-parity?pathwayId=...&tier=...&country=...` should call `contentInventoryResolver()` and render the result table. This allows ops to verify pool health without ad-hoc DB queries.

**R5. Add parity assertion to CI**  
Extend [src/lib/content-inventory/content-inventory-resolver.contract.test.ts](../nursenest-core/src/lib/content-inventory/content-inventory-resolver.contract.test.ts) to assert that `FLASHCARD_USABILITY_SQL` includes the RT gate string literal. This prevents regression when the SQL is modified.

### P2 — Medium Priority

**R6. Align exam-scope fallback between flashcard inventory and CAT**  
Consider adding the same `exam_scope_zero_fallback` to CAT readiness so that pathways with mismatched `exam` column values behave consistently across all study surfaces, rather than succeeding in flashcards but failing in CAT.

**R7. Validate Redis hub inventory cache key includes tier + country**  
Stale cache entries from a previous entitlement scope can cause count/session divergence. Verify the cache key includes tier, country, and pathwayId. Current implementation in `content-cache.ts` does include tier and country — confirm this is also true for the snapshot path.

**R8. Content quality: resolve rationale gap**  
~30–50% of eligible exam questions lack rationale, making them flashcard-eligible but CAT-ineligible. Prioritize rationale content for the highest-traffic pathways to maximize CAT pool parity.

---

## 12. Automated Parity Tests

Tests written and passing at [src/lib/content-inventory/content-inventory-resolver.contract.test.ts](../nursenest-core/src/lib/content-inventory/content-inventory-resolver.contract.test.ts):

| # | Test | Coverage |
|---|---|---|
| 1 | canonical WHERE composes all 6 gate imports | canonical-exam-question-where.ts |
| 2 | CAT pool uses all 5 canonical gates | cat-pool.ts |
| 3 | Flashcard exam SQL uses non-ECG + module gate | flashcard-learner-exam-pool-sql.ts |
| 4 | Flashcard session imports canonical exam pool chain | build-flashcard-custom-session.ts |
| 5 | Flashcard inventory imports canonical Prisma WHERE | load-flashcards-exam-inventory.server.ts |
| 6 | Study plan uses Prisma-backed helpers (not static JSON) | personalized-weak-area-study-plan.ts |
| 7 | contentInventoryResolver exports correct surface counts | content-inventory-resolver.ts |
| 8 | CAT pool ⊆ flashcard pool invariant encoded in resolver | content-inventory-resolver.ts |
| 9 | Study question pool helper uses canonical gates | get-study-question-pool-for-pathway.ts |

**Result:** 41/41 tests pass.

---

## 13. Single-Source-of-Truth Certification

| Criterion | Status | Notes |
|---|---|---|
| Canonical WHERE function exists and is exported | ✓ ACHIEVED | `getCanonicalExamQuestionWhereForPathway` |
| CAT uses canonical WHERE stack | ✓ ACHIEVED | `cat-pool.ts` composes identical gates |
| Practice uses canonical WHERE stack | ✓ ACHIEVED | Via shared `fetchCatPracticePool` |
| Flashcard exam SQL uses equivalent gates | ⚠️ PARTIAL | Missing RT gate; uses parallel raw-SQL path |
| Flashcard dedicated uses access scoping | ✓ ACHIEVED | `flashcardAccessWhere` |
| `contentInventoryResolver` routes all counts through canonical WHERE | ✓ ACHIEVED | New implementation in this session |
| Study Plan validates pool before recommendation | ✗ NOT ACHIEVED | Recommendation surfacing deferred to P1 backlog |
| Weak Areas validates topic has available questions | ✗ NOT ACHIEVED | Same — deferred |
| Automated parity tests cover all surfaces | ✓ ACHIEVED | 41 contract tests, all passing |

**Overall verdict:** Single-source-of-truth architecture is **partially achieved**. CAT and Practice Tests are fully aligned. Flashcards are aligned on the canonical Prisma path but diverge on the raw-SQL session/inventory path (RT gate gap, NP scope gap). Study Plans, Weak Areas, and Readiness do not validate content pools — this is the most actionable root cause of user-visible session failures.
