import assert from "node:assert/strict";
import test from "node:test";
import { getNextBestAction } from "@/lib/learner/next-best-action";
import { DEFAULT_STUDY_SETTINGS } from "@/lib/learner/study-settings";

test("getNextBestAction falls back to a neutral manual path when adaptive plan is disabled", () => {
  const action = getNextBestAction(
    {
      continueLesson: { title: "Cardiac review", href: "/app/lessons/cardiac" },
      insights: {
        recommendations: {
          primary: {
            title: "Adaptive next step",
            href: "/app/review",
            kind: "review",
            why: "Adaptive engine selected this.",
            what: "Review your due cards.",
            how: "Spaced repetition reduces forgetting.",
          },
          secondary: [],
        },
        dailyPlan: {
          todayTasks: [],
          weeklyPriorities: [],
        },
      },
    } as never,
    {
      topWeak: {
        topic: "Pharmacology",
        missed: 3,
        attempted: 10,
        missRate: 30,
      },
    } as never,
    {
      credits: 0,
      target: 3,
      breakdown: {
        hasLessonTouch: false,
        hasExamActivity: false,
        hasPracticeCompleted: false,
      },
    } as never,
    {
      ...DEFAULT_STUDY_SETTINGS,
      enableAdaptivePlan: false,
    },
  );

  assert.equal(action.kind, "fallback");
  assert.equal(action.href, "/app/questions");
  assert.match(action.title, /Manual Study|Start a Session/i);
});
