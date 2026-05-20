import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import { Prisma, SubscriptionStatus, UserRole } from "@prisma/client";
import {
  ACCOUNT_DELETION_BILLING_WARNING,
  ACCOUNT_DELETION_CONFIRMATION_PHRASE,
  ACCOUNT_DELETION_RETAINED_RECORDS_COPY,
  buildDeletedAccountEmail,
  deleteLearnerAccount,
  isDeletedAccountEmail,
} from "@/lib/account/delete-learner-account";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const appRoot = join(__dirname, "..", "..");
const settingsPageSource = join(appRoot, "app", "(student)", "app", "(learner)", "account", "settings", "page.tsx");
const dangerZoneSource = join(appRoot, "components", "account", "account-delete-danger-zone.tsx");
const apiRouteSource = join(appRoot, "app", "api", "account", "delete", "route.ts");
const authSource = join(appRoot, "lib", "auth.ts");
const entitlementsSource = join(appRoot, "lib", "entitlements", "get-user-access.ts");

const USER_ID = "user_delete_test_123";
const USER_EMAIL = "maya@example.com";

describe("account deletion policy copy", () => {
  it("keeps App Store compliance copy visible from account settings", () => {
    const settingsSrc = readFileSync(settingsPageSource, "utf8");
    const dangerZoneSrc = readFileSync(dangerZoneSource, "utf8");

    assert.match(settingsSrc, /AccountDeleteDangerZone/);
    assert.match(dangerZoneSrc, /Delete Account/);
    assert.match(dangerZoneSrc, /Delete my account/);
    assert.match(dangerZoneSrc, /profile\/account access/);
    assert.match(dangerZoneSrc, /practice\/CAT exam history/);
    assert.match(dangerZoneSrc, /readiness reports\/analytics/);
    assert.match(dangerZoneSrc, /ACCOUNT_DELETION_RETAINED_RECORDS_COPY/);
    assert.match(dangerZoneSrc, /ACCOUNT_DELETION_BILLING_WARNING/);
  });

  it("exports the required confirmation and billing warning language", () => {
    assert.equal(ACCOUNT_DELETION_CONFIRMATION_PHRASE, "DELETE");
    assert.match(ACCOUNT_DELETION_RETAINED_RECORDS_COPY, /legal billing records/i);
    assert.match(ACCOUNT_DELETION_BILLING_WARNING, /does not automatically cancel/i);
  });

  it("wires protected API and inactive-account guards", () => {
    const apiSrc = readFileSync(apiRouteSource, "utf8");
    const authSrc = readFileSync(authSource, "utf8");
    const entitlementSrc = readFileSync(entitlementsSource, "utf8");

    assert.match(apiSrc, /export async function DELETE/);
    assert.match(apiSrc, /const session = await auth\(\)/);
    assert.match(apiSrc, /status: 401/);
    assert.match(apiSrc, /deleteLearnerAccount\(prisma/);
    assert.match(authSrc, /isDeletedAccountEmail\(user\.email\)/);
    assert.match(authSrc, /account_deleted/);
    assert.match(entitlementSrc, /isDeletedAccountEmail\(user\.email\)/);
    assert.match(entitlementSrc, /return base/);
  });
});

describe("deleteLearnerAccount", () => {
  it("rejects unauthenticated, mismatched, and staff/admin deletion attempts", async () => {
    await assert.rejects(
      () => deleteLearnerAccount(makeDb({ role: UserRole.LEARNER }), { sessionUserId: "", confirmation: "DELETE" }),
      (error: unknown) => (error as { code?: string }).code === "UNAUTHORIZED",
    );
    await assert.rejects(
      () =>
        deleteLearnerAccount(makeDb({ role: UserRole.LEARNER }), {
          sessionUserId: USER_ID,
          requestedUserId: "someone_else",
          confirmation: "DELETE",
        }),
      (error: unknown) => (error as { code?: string }).code === "FORBIDDEN",
    );
    await assert.rejects(
      () => deleteLearnerAccount(makeDb({ role: UserRole.ADMIN }), { sessionUserId: USER_ID, confirmation: "DELETE" }),
      (error: unknown) => (error as { code?: string }).code === "STAFF_FORBIDDEN",
    );
  });

  it("requires DELETE or the signed-in user's email as confirmation", async () => {
    await assert.rejects(
      () => deleteLearnerAccount(makeDb({ role: UserRole.LEARNER }), { sessionUserId: USER_ID, confirmation: "delete" }),
      (error: unknown) => (error as { code?: string }).code === "CONFIRMATION_REQUIRED",
    );

    const byEmail = await deleteLearnerAccount(makeDb({ role: UserRole.LEARNER }), {
      sessionUserId: USER_ID,
      confirmation: USER_EMAIL,
    });
    assert.equal(byEmail.ok, true);
  });

  it("soft-disables the account, revokes internal premium access, and does not delete global content", async () => {
    const calls: string[] = [];
    const db = makeDb({ role: UserRole.LEARNER, calls });

    const result = await deleteLearnerAccount(db, { sessionUserId: USER_ID, confirmation: "DELETE" });

    assert.equal(result.ok, true);
    assert.equal(result.signOutRequired, true);
    assert.equal(result.subscriptionCancellationRequired, true);
    assert.ok(calls.includes("subscription.updateMany"));
    assert.ok(calls.includes("learnerSessionActivity.updateMany"));
    assert.ok(calls.includes("passwordResetToken.deleteMany"));
    assert.ok(calls.includes("emailVerificationToken.deleteMany"));
    assert.ok(calls.includes("learnerNote.deleteMany"));
    assert.ok(calls.includes("user.update"));
    assert.ok(!calls.some((name) => name.includes("lesson.deleteMany")));
    assert.ok(!calls.some((name) => name.includes("question.deleteMany")));
    assert.ok(!calls.some((name) => name.includes("blogPost.deleteMany")));
  });

  it("marks deleted-account emails so entitlement and login checks can treat them as inactive", () => {
    const email = buildDeletedAccountEmail("abc123");
    assert.equal(email, "deleted+abc123@nursenest.invalid");
    assert.equal(isDeletedAccountEmail(email), true);
    assert.equal(isDeletedAccountEmail(USER_EMAIL), false);
  });
});

function makeDb({
  role,
  calls = [],
}: {
  role: UserRole;
  calls?: string[];
}) {
  const del =
    (name: string) =>
    async ({ where }: { where: Record<string, unknown> }) => {
      assert.ok(JSON.stringify(where).includes(USER_ID), `${name} must scope to current user`);
      calls.push(name);
      return { count: 1 };
    };
  const update =
    (name: string) =>
    async ({ where }: { where: Record<string, unknown> }) => {
      assert.ok(JSON.stringify(where).includes(USER_ID), `${name} must scope to current user`);
      calls.push(name);
      return { count: 1 };
    };

  const tx = {
    examSession: { deleteMany: del("examSession.deleteMany") },
    examAttempt: { deleteMany: del("examAttempt.deleteMany") },
    practiceTest: { deleteMany: del("practiceTest.deleteMany") },
    progress: { deleteMany: del("progress.deleteMany") },
    flashcardProgress: { deleteMany: del("flashcardProgress.deleteMany") },
    flashcardStudySession: { deleteMany: del("flashcardStudySession.deleteMany") },
    flashcardUserStats: {
      delete: async ({ where }: { where: { userId: string } }) => {
        assert.equal(where.userId, USER_ID);
        calls.push("flashcardUserStats.delete");
        return {};
      },
    },
    verifiedStudyCardProgress: { deleteMany: del("verifiedStudyCardProgress.deleteMany") },
    examQuestionPracticeAnswerAttempt: { deleteMany: del("examQuestionPracticeAnswerAttempt.deleteMany") },
    ecgVideoQuestionPracticeAnswerAttempt: { deleteMany: del("ecgVideoQuestionPracticeAnswerAttempt.deleteMany") },
    userTopicStat: { deleteMany: del("userTopicStat.deleteMany") },
    userRemediationEvent: { deleteMany: del("userRemediationEvent.deleteMany") },
    userRemediationQueue: { deleteMany: del("userRemediationQueue.deleteMany") },
    baselineAssessmentAttempt: { deleteMany: del("baselineAssessmentAttempt.deleteMany") },
    clinicalScenarioSimulationRun: { deleteMany: del("clinicalScenarioSimulationRun.deleteMany") },
    accuracy_trends: { deleteMany: del("accuracy_trends.deleteMany") },
    analytics_events: { deleteMany: del("analytics_events.deleteMany") },
    custom_practice_sessions: { deleteMany: del("custom_practice_sessions.deleteMany") },
    exam_attempts: { deleteMany: del("exam_attempts.deleteMany") },
    exam_followup_responses: { deleteMany: del("exam_followup_responses.deleteMany") },
    lesson_bookmarks: { deleteMany: del("lesson_bookmarks.deleteMany") },
    practice_recommendations: { deleteMany: del("practice_recommendations.deleteMany") },
    readiness_history: { deleteMany: del("readiness_history.deleteMany") },
    spaced_repetition_cards: { deleteMany: del("spaced_repetition_cards.deleteMany") },
    student_study_profiles: { deleteMany: del("student_study_profiles.deleteMany") },
    study_milestones: { deleteMany: del("study_milestones.deleteMany") },
    study_plan_schedule: { deleteMany: del("study_plan_schedule.deleteMany") },
    test_bank_progress: { deleteMany: del("test_bank_progress.deleteMany") },
    topic_mastery_scores: { deleteMany: del("topic_mastery_scores.deleteMany") },
    unified_question_history: { deleteMany: del("unified_question_history.deleteMany") },
    weak_area_alerts: { deleteMany: del("weak_area_alerts.deleteMany") },
    flashcard_preview_usage: { deleteMany: del("flashcard_preview_usage.deleteMany") },
    exam_planner_settings: {
      updateMany: async ({ where, data }: { where: { user_id: string }; data: Record<string, unknown> }) => {
        assert.equal(where.user_id, USER_ID);
        assert.deepEqual(data.generated_plan, Prisma.JsonNull);
        calls.push("exam_planner_settings.updateMany");
        return { count: 1 };
      },
    },
    subscription: {
      updateMany: async ({ where, data }: { where: Record<string, unknown>; data: Record<string, unknown> }) => {
        assert.deepEqual(where, { userId: USER_ID });
        assert.equal(data.status, SubscriptionStatus.CANCELLED);
        calls.push("subscription.updateMany");
        return { count: 1 };
      },
    },
    learnerSessionActivity: { updateMany: update("learnerSessionActivity.updateMany") },
    passwordResetToken: { deleteMany: del("passwordResetToken.deleteMany") },
    emailVerificationToken: { deleteMany: del("emailVerificationToken.deleteMany") },
    learnerNote: { deleteMany: del("learnerNote.deleteMany") },
    user: {
      update: async ({ where, data }: { where: { id: string }; data: Record<string, unknown> }) => {
        assert.equal(where.id, USER_ID);
        if ("email" in data) {
          assert.equal(data.email, buildDeletedAccountEmail(USER_ID));
          assert.equal(data.passwordHash, null);
          assert.deepEqual(data.credentialVersion, { increment: 1 });
        } else {
          assert.equal(data.freeQuestionViews, 0);
          assert.equal(data.bankQuestionsGradedCount, 0);
        }
        calls.push("user.update");
        return {};
      },
    },
  };

  return {
    user: {
      findUnique: async ({ where }: { where: { id: string } }) => {
        assert.equal(where.id, USER_ID);
        return { id: USER_ID, email: USER_EMAIL, role, credentialVersion: 0 };
      },
    },
    $transaction: async (fn: (transaction: typeof tx) => Promise<void>) => fn(tx),
  };
}
