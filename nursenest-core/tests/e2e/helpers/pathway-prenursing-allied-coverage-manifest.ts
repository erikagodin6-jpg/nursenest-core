/**
 * Non-executable documentation attached to the prenursing/allied Playwright suite so reports cannot
 * overclaim coverage. Every “proven by code” statement lists concrete source files in this repo.
 */
export const PRENURSING_ALLIED_COVERAGE_MANIFEST = {
  schemaVersion: 1,
  generatedFor: "pathway-prenursing-allied-access.spec.ts",

  canonicalLearnerSurfaces: {
    preNursing: {
      routes: ["/pre-nursing/lessons", "/pre-nursing/mini-cat", "/app/flashcards (tier-scoped; no EXAM pathway row)"],
      provenNotExamPathwaysBacked:
        "There is no TierCode.PRE_NURSING row in `src/lib/exam-pathways/exam-product-registry.ts` (`EXAM_PATHWAYS`). Canonical URLs live under `PRE_NURSING_LESSONS_INDEX_PATH` in `src/lib/lessons/lesson-routes.ts` and module data in `src/content/pre-nursing/pre-nursing-registry.ts`.",
      primaryInteractiveAssessment:
        "The interactive assessment surface wired for pre-nursing subscribers is `/pre-nursing/mini-cat` via `PreNursingMiniCatRunner` (`src/components/pre-nursing/pre-nursing-mini-cat-runner.tsx`) and `src/lib/pre-nursing/pre-nursing-exam-engine.ts`. This suite treats it as the primary bounded interactive exam-style check (not `/app/practice-tests?cat=1` + RN pathway).",
      appQuestionsHub: {
        status: "intentionally_not_asserted_as_primary_pre_nursing_surface",
        reason:
          "`/app/questions` is pathway-scoped to `ExamPathwayDefinition` rows from `EXAM_PATHWAYS`. `listPathwaysCompatibleWithSubscription` in `src/lib/exam-pathways/pathway-entitlements.ts` yields no pathway for a pure PRE_NURSING tier match to catalog pathways (no PRE_NURSING stripe tier in `EXAM_PATHWAYS`). Separately, `examQuestionTierStringsForProfileTier` in `src/lib/entitlements/accessible-tiers.ts` does expose `prenursing` question-tier strings for PRE_NURSING — those feed pathway-scoped APIs when a compatible pathway exists, which is not the pre-nursing marketing/catalog model here.",
      },
    },
    allied: {
      sharedPathwayIds: ["us-allied-core", "ca-allied-core"],
      practiceEngine: {
        kind: "SIMULATION",
        provenBy: "Overrides for `us-allied-core` / `ca-allied-core` in `src/lib/exam-pathways/pathway-readiness-config.ts` set `engineType: \"SIMULATION\"`. The suite uses `pathwayLinearPracticeExamSurface` (random/linear builder + modal start), not `pathwayCatSurface` (NCLEX CAT hub flow).",
      },
    },
  },

  professionContext: {
    sharedPathwayModel:
      "All entries in `ALLIED_PROFESSIONS` use the same `pathwayId` (`us-allied-core` in `src/lib/allied/allied-professions-registry.ts`). Profession is stored on `User.alliedProfessionKey`.",
    apiLessonQuestionPools:
      "Grep: `src/app/api/lessons` and `src/app/api/questions` do not branch on `alliedProfessionKey` — pools are entitlement + pathway/tier scoped, not per-profession lesson IDs.",
    weakTopicAndDashboard:
      "When `User.tier === ALLIED` and `alliedProfessionKey` is set, `filterWeakTopicsForAlliedProfession` / `filterTopicRowsForAlliedProfession` in `src/lib/allied/allied-weak-topic-filter.ts` may narrow weak-topic lists **only if** the profession defines `topicSlugsIn` on `AlliedProfessionMarketing`. Current registry entries omit `topicSlugsIn`, so the filter is a no-op (returns rows unchanged) until/unless product adds slugs per profession.",
    uiAndSettings:
      "Profession affects nav badge labeling for ALLIED (`examIndicatorLabel` in `src/components/layout/site-header.tsx`) and exam-plan payload (`GET /api/learner/exam-plan` in `src/app/api/learner/exam-plan/route.ts`).",
    suiteEnforcement:
      "For allied matrix rows, the suite requires a non-null `alliedProfessionKey` in session and consistency with `GET /api/learner/exam-plan` — this validates learner profile wiring without claiming per-profession pathway IDs that do not exist.",
  },

  marketingOnly: {
    routes: "Pattern `/allied-health/{professionKey}/lessons` — profession-specific **marketing** hubs; not a substitute for `/app/lessons?pathwayId=us-allied-core` entitlement checks.",
  },

  intentionalNonGoals: [
    "No per-profession crawl of all eight professions with distinct QA accounts (bounded runtime).",
    "No assertion that changing profession alters `/api/lessons` list rows until `topicSlugsIn` or explicit API filters ship.",
  ],
} as const;
