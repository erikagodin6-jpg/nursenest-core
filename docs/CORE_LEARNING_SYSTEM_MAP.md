# Core learning system map

Practical map for developers new to NurseNest. Paths are under `nursenest-core/` unless noted.

## 1. Pathways (RN, RPN, NP, Allied)

| Concept | Where it lives |
|---------|----------------|
| Canonical list of exam tracks | `src/lib/exam-pathways/exam-pathways-catalog.ts` (aggregates `exam-pathways-data-segment-*.ts`) |
| Marketing URL → pathway | `getExamPathwayByRoute`, `resolveExamPathwayFromMarketingHubSegment` in `exam-product-registry.ts` |
| Stripe tier + country on pathway | `stripeTier`, `countryCode` on `ExamPathwayDefinition` |
| Question bank column filter | `contentExamKeys` → `questionAccessWhereWithPathway` in question + CAT + flashcard loaders |
| Hub layout / lesson grouping | `pathway-learning-structure.ts`, hub components under marketing routes (`NclexRnLessonsHub`, `NclexPnLessonsHub`, `PathwayLessonsGroupedHub`, …) |

**RN (example):** `us-rn-nclex-rn`, `ca-rn-nclex-rn` — NCLEX-RN exam keys, RN tier.  
**RPN / PN:** `ca-rpn-rex-pn` (REx-PN keys), `us-lpn-nclex-pn` (NCLEX-PN) — shared PN-style hub patterns with different copy/labels.  
**NP:** `us-np-fnp`, `us-np-pmhnp`, … — NP hub categories, `ExamFamily.NP`, NP `contentExamKeys` union for diagnostics.  
**Allied:** `us-allied-core`, `ca-allied-core` — allied hub categories, `TierCode.ALLIED`.

## 2. Lessons

| Concern | Location |
|---------|----------|
| Learner list/detail | `src/app/(student)/app/(learner)/lessons/`, `lessons/[id]/page.tsx` |
| Marketing pathway lesson | `(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/`, `pathway-lesson-detail-page-body.tsx` |
| Access decisions | `resolveEntitlementForPage`, `canViewFullPathwayLesson`, pathway lesson types in `src/lib/lessons/` |
| Pagination / safety | Hub list loaders use bounded queries—see `rn-lesson-library-safety` rule and `marketing-pathway-lessons` loaders |

**Source of truth:** Published content in Postgres + normalized lesson indexes (build scripts in `nursenest-core/package.json`). Content pipeline schema: `src/lib/content/pipeline-schema.ts`.

## 3. Questions and practice tests

| Concern | Location |
|---------|----------|
| Subscriber question list | `src/app/api/questions/route.ts` |
| Single question | `src/app/api/questions/[id]/route.ts` |
| Practice test CRUD / sessions | `src/app/api/practice-tests/**`, `src/lib/practice-tests/` |
| Entitlement in SQL | `src/lib/entitlements/content-access-scope.ts`, `questionAccessWhere` helpers |

## 4. CAT vs non-CAT practice

| Mode | Config / behavior |
|------|-------------------|
| CAT adaptive engine | `src/lib/exams/cat-engine.ts`, `cat-adaptive-policy.ts`, `cat-session.ts` |
| Exam simulation | `catPresentationMode: "exam_simulation"`, `catExamFeedbackMode: "test"` (no rationale during session) — see `practice-adaptive-setup.test.ts` |
| Practice / study CAT | `catExamFeedbackMode: "study"` (rationale after answer), optional study continue flag in `CatAdaptiveState` |
| Results API shaping | `src/app/api/practice-tests/[id]/route.ts` (+ related routes) |

## 5. Flashcards

| Concern | Location |
|---------|----------|
| REST APIs | `src/app/api/flashcards/**` |
| Decks / verified study | `src/app/api/verified-study/**` |
| Pool + pathway | `src/lib/flashcards/*`, linkage `lesson-linked-flashcards-for-pathway.ts`, tests in `flashcard-pool-exam-fallback.test.ts` |

## 6. Paid vs free access

1. **`getUserAccess(userId)`** loads subscription + trial + staff override from DB.  
2. **`resolveEntitlement` / `accessScopeFromUserAccess`** produce `AccessScope` for helpers.  
3. **Routes:** `resolveEntitlementForPage` for RSC pages; **`requireSubscriberSession()`** for premium APIs.  
4. **Freemium:** Limited lesson/question peek when `hasAccess` false—see lessons list page and freemium helpers.  
5. **Marketing previews:** `fullAccess === false` hides premium sections (`pathway-lesson-visible-sections`, paywall policy tests).

## 7. Topic linking (lessons ↔ questions ↔ flashcards ↔ report cards)

- **Topic slug** is the cross-feature join key in study tooling (`topicSlug` / `topic` fields on questions, lesson metadata, study scripts).  
- **Scripts:** `npm run study:link-content`, `study:audit-topic-slugs` (see `package.json`).  
- **Report card / learner models:** `src/lib/learner/learner-report-card-model.ts` (+ tests).  
- **Study loop contracts:** `src/lib/study/study-loop-learning.contract.test.ts`, pathway lesson study materials tests.

## 8. Quick “start here” file list

1. `src/lib/exam-pathways/exam-pathways-catalog.ts`  
2. `src/lib/entitlements/get-user-access.ts`  
3. `src/lib/entitlements/require-subscriber-session.ts`  
4. `src/lib/practice-tests/cat-session.ts` + `src/components/student/practice-test-runner-client.tsx`  
5. `src/app/(student)/app/(learner)/lessons/page.tsx`  
6. `src/lib/auth/guards.ts` + `src/lib/admin/ensure-admin.ts`
