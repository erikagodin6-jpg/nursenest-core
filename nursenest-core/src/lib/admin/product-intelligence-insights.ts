import type { AdminStudyPerformanceData } from "@/lib/admin/load-admin-study-performance-analytics";

export type InsightTone = "attention" | "healthy" | "neutral";

export type ProductInsight = {
  tone: InsightTone;
  title: string;
  body: string;
  evidence: string[];
};

export type ProductIntelligenceSignals = {
  feedbackBySurface: Array<{ surface: string; total: number; friction: number }>;
  practiceTestByStatus: Array<{ status: string; n: number }>;
  examSessionInProgressWindow: number;
  examSessionCompletedWindow: number;
  staleExamSessionsInProgress: number;
  frustratedTopics: Array<{ topic: string; frustratedLearners: number; learners: number }>;
  appSectionViews: Array<{ section: string; views: number }> | null;
  posthogAppSectionError?: string;
  learnerAccuracyBuckets: Array<{ bucket: string; learners: number }>;
  flashcardSessionTouches: number;
};

function pct(n: number, d: number): number {
  return d > 0 ? Math.round((n / d) * 1000) / 10 : 0;
}

/**
 * Deterministic, explainable narratives from aggregated study + friction signals.
 * No fabricated KPIs — only rules applied to passed numbers.
 */
export function buildProductIntelligenceInsights(
  study: AdminStudyPerformanceData,
  sig: ProductIntelligenceSignals,
): ProductInsight[] {
  const out: ProductInsight[] = [];
  const { lessons, questions, cat, engagement } = study;

  const drop = engagement.lessonDropOffRatePct;
  if (drop != null && drop >= 28) {
    out.push({
      tone: "attention",
      title: "Lessons are opened but many learners never engage",
      body: "A large share of recent lesson progress rows never reached the read-depth (engaged) threshold. That usually means skim-and-leave, wrong entry points, or lessons that feel too long before value appears.",
      evidence: [
        `Lesson drop-off / “never engaged” proxy: **${drop}%** of progress rows in this window.`,
        engagement.note,
      ],
    });
  }

  const weakLessons = lessons.topLessons
    .filter((l) => l.progressRows >= 8 && (l.completionRatePct ?? 100) < 42)
    .slice(0, 3);
  if (weakLessons.length > 0) {
    out.push({
      tone: "attention",
      title: "Some popular lessons rarely reach completion",
      body: "These lessons see meaningful traffic but completion stays low. Worth a content or UX pass (structure, quiz placement, mobile layout).",
      evidence: weakLessons.map(
        (l) =>
          `**${l.title?.slice(0, 72) ?? l.lessonKey}** — ${l.progressRows} learners touched, **${l.completionRatePct ?? "—"}%** completed, ${l.neverEngagedRows} never engaged.`,
      ),
    });
  }

  if (cat.practiceTestsCatStarted > 0) {
    const catDoneRate = pct(cat.practiceTestsCatCompleted, cat.practiceTestsCatStarted);
    if (catDoneRate < 45) {
      out.push({
        tone: "attention",
        title: "CAT-style practice is often started but not finished",
        body: "Learners open adaptive practice but many sessions do not reach a completed state in the window. Check time pressure, clarity of “done”, and whether sessions are resumable as expected.",
        evidence: [
          `CAT practice tests started: **${cat.practiceTestsCatStarted}**, completed: **${cat.practiceTestsCatCompleted}** (${catDoneRate}% completion).`,
          cat.note,
        ],
      });
    } else if (catDoneRate >= 65) {
      out.push({
        tone: "healthy",
        title: "CAT practice completion looks healthy",
        body: "Adaptive practice sessions in this window show a solid completion rate relative to starts.",
        evidence: [`${catDoneRate}% of started CAT practice tests completed in-window.`],
      });
    }
  }

  const pt = sig.practiceTestByStatus;
  const started = pt.reduce((a, r) => a + (r.status === "IN_PROGRESS" ? r.n : 0), 0);
  const done = pt.reduce((a, r) => a + (r.status === "COMPLETED" ? r.n : 0), 0);
  const abandoned = pt.reduce((a, r) => a + (r.status === "ABANDONED" ? r.n : 0), 0);
  const denom = started + done + abandoned;
  if (denom > 20 && pct(started + abandoned, denom) >= 55) {
    out.push({
      tone: "attention",
      title: "Practice tests show many non-completed sessions",
      body: "A high proportion of practice-test rows are still in progress or explicitly abandoned. Review flow length, save/resume, and whether diagnostics explain why users bail.",
      evidence: [
        `In-window practice tests — completed **${done}**, in progress **${started}**, abandoned **${abandoned}**.`,
        "Counts are from `practice_tests` rows with `startedAt` in the selected window.",
      ],
    });
  }

  if (sig.staleExamSessionsInProgress > 15) {
    out.push({
      tone: "neutral",
      title: "Many exam-style sessions sit in progress for days",
      body: "Stale `IN_PROGRESS` exam sessions (no touch for 48h+) suggest users treat them as disposable or lose the thread. Consider clearer “save & exit” and resume prompts.",
      evidence: [`Stale in-progress exam sessions (48h+ idle): **${sig.staleExamSessionsInProgress}**.`],
    });
  }

  const topFriction = sig.feedbackBySurface.find((f) => f.total >= 3 && f.friction / f.total >= 0.45);
  if (topFriction) {
    out.push({
      tone: "attention",
      title: "Bug and confusion reports cluster on specific surfaces",
      body: "When feedback volume concentrates on a route and a high share is bugs or confusing-question reports, treat it as a product weak point—not noise.",
      evidence: [
        `Surface **${topFriction.surface.slice(0, 120)}** — ${topFriction.total} reports, **${topFriction.friction}** bug/confusion (${pct(topFriction.friction, topFriction.total)}%).`,
        "Link triage in `/admin/feedback` to confirm patterns.",
      ],
    });
  }

  if (questions.hardestTopics[0] && questions.hardestTopics[0].accuracyPct < 48 && questions.hardestTopics[0].attempts >= 25) {
    const h = questions.hardestTopics[0];
    out.push({
      tone: "attention",
      title: "Question topics with very low aggregate accuracy",
      body: "Bank-level stats show some topics accumulate wrong answers. That can indicate unclear stems, harsh distractors, or prerequisite gaps.",
      evidence: [
        `Hardest topic in-window: **${h.topic}** — accuracy **${h.accuracyPct}%** over ${h.attempts} graded attempts (aggregated per learner/topic).`,
        questions.rationaleNote,
      ],
    });
  }

  if (sig.appSectionViews && sig.appSectionViews.length >= 4) {
    const max = sig.appSectionViews[0]?.views ?? 0;
    const tail = sig.appSectionViews.filter((s) => max > 0 && s.views < max * 0.08 && s.views > 0);
    if (tail.length >= 2 && max > 50) {
      out.push({
        tone: "neutral",
        title: "Some learner areas get far fewer views than the core shell",
        body: "Authenticated learners heavily use a few app sections while others stay almost invisible. That can mean low discoverability—or the feature is not yet pulling its weight.",
        evidence: [
          `Top section: **${sig.appSectionViews[0].section}** (${sig.appSectionViews[0].views} views).`,
          `Rarely opened (under ~8% of top): ${tail
            .slice(0, 5)
            .map((t) => `**${t.section}** (${t.views})`)
            .join(", ")}.`,
          "Source: PostHog `app_section_view` (requires personal API key + project id).",
        ],
      });
    }
  }

  const strong = sig.learnerAccuracyBuckets.find((b) => b.bucket === "strong")?.learners ?? 0;
  const struggling = sig.learnerAccuracyBuckets.find((b) => b.bucket === "struggling")?.learners ?? 0;
  if (strong + struggling >= 30) {
    out.push({
      tone: struggling > strong * 1.4 ? "attention" : "healthy",
      title:
        struggling > strong * 1.4
          ? "More learners look “struggling” than “strong” by bank-topic aggregates"
          : "Learner strength vs struggle mix looks balanced at the bank level",
      body: "We bucket learners by lifetime-ish topic accuracy (min attempts threshold). This is a coarse signal—not a substitute for cohort retention modeling.",
      evidence: sig.learnerAccuracyBuckets.map((b) => `**${b.bucket}**: ${b.learners} learners`),
    });
  }

  if (sig.flashcardSessionTouches < 20 && engagement.dailyActiveUsers.some((d) => d.users > 30)) {
    out.push({
      tone: "neutral",
      title: "Flashcard sessions look light relative to other study signals",
      body: "If flashcards are a strategic pillar, compare navigation prominence and onboarding prompts against this touch volume.",
      evidence: [
        `Flashcard study session rows touched in-window: **${sig.flashcardSessionTouches}** (table \`flashcard_study_sessions\`, by \`updated_at\`).`,
      ],
    });
  }

  if (sig.appSectionViews == null && sig.posthogAppSectionError) {
    out.push({
      tone: "neutral",
      title: "Connect PostHog for navigation-level usage contrast",
      body: "Section breakdown did not load. Other panels still use Postgres.",
      evidence: [sig.posthogAppSectionError],
    });
  }

  if (out.length === 0) {
    out.push({
      tone: "neutral",
      title: "No strong automated warnings in this window",
      body: "Threshold-based checks did not fire. Skim tables below and widen the date range if traffic is sparse.",
      evidence: ["Rules look at lesson completion, CAT practice completion, practice-test status mix, feedback friction, and hardest topics."],
    });
  }

  return out.slice(0, 12);
}
