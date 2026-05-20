import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  SocialChallengeStatus,
  SocialChallengeType,
  SocialConnectionStatus,
  SocialGroupKind,
  SocialStatKey,
  SocialVisibilityScope,
} from "@prisma/client";
import {
  acceptSocialConnection,
  blockSocialConnection,
  connectWithSocialCode,
  createSocialChallenge,
  createSocialGroup,
  disableSocialInviteCode,
  generateSocialInviteCode,
  joinSocialGroupByCode,
  leaveSocialGroup,
  listSocialGroupLeaderboard,
  resolveVisibleSocialStats,
  updateSocialPrivacySettings,
} from "@/lib/social-study/social-study-service";
import { buildSanitizedSocialSnapshots } from "@/lib/social-study/social-stat-snapshot";
import { createMemorySocialStudyDb } from "@/lib/social-study/test-memory-db";

describe("social study privacy and invite codes", () => {
  it("generates non-PII invite codes and disabled codes cannot be used", async () => {
    const db = createMemorySocialStudyDb();
    db.addUser({ id: "u1", email: "student@example.com", displayName: "Learner One" });
    db.addUser({ id: "u2", email: "friend@example.com", displayName: "Learner Two" });

    const code = await generateSocialInviteCode(db, "u1", { enabled: true });
    assert.match(code.displayCode, /^NN-[A-Z0-9]{4}-[A-Z0-9]{2}$/);
    assert.equal(code.displayCode.includes("student"), false);
    assert.equal(code.displayCode.includes("@"), false);

    await disableSocialInviteCode(db, "u1", code.id);
    const result = await connectWithSocialCode(db, "u2", code.displayCode);
    assert.deepEqual(result, { ok: false, code: "code_disabled_or_missing" });
  });

  it("creates and accepts friend requests without exposing email", async () => {
    const db = createMemorySocialStudyDb();
    db.addUser({ id: "u1", email: "student@example.com", displayName: "Learner One" });
    db.addUser({ id: "u2", email: "friend@example.com", displayName: "Learner Two" });
    const code = await generateSocialInviteCode(db, "u1", { enabled: true });

    const connect = await connectWithSocialCode(db, "u2", code.displayCode);
    assert.equal(connect.ok, true);
    assert.equal(connect.kind, "friend");
    assert.equal(connect.connection?.status, SocialConnectionStatus.PENDING);
    assert.equal(JSON.stringify(connect).includes("student@example.com"), false);

    const accepted = await acceptSocialConnection(db, "u1", connect.connection!.id);
    assert.equal(accepted.ok, true);
    assert.equal(accepted.connection?.status, SocialConnectionStatus.ACCEPTED);
  });
});

describe("social study stat visibility", () => {
  it("hides stats when hidden or paused, then reveals only selected opt-in stats", async () => {
    const db = createMemorySocialStudyDb();
    db.addUser({ id: "u1", email: "student@example.com", displayName: "Learner One" });
    db.addUser({ id: "u2", email: "friend@example.com", displayName: "Learner Two" });
    const code = await generateSocialInviteCode(db, "u1", { enabled: true });
    const connect = await connectWithSocialCode(db, "u2", code.displayCode);
    await acceptSocialConnection(db, "u1", connect.connection!.id);

    await db.socialStatSnapshot.createMany({
      data: buildSanitizedSocialSnapshots("u1", {
        readinessScore: 87,
        readinessBand: "ready",
        weeklyStudyStreak: 6,
        practiceAccuracyPct: 78,
        flashcardProgressPct: 64,
        weakTopicCodes: ["airway", "safety"],
        catCompletedCount: 2,
      }),
    });

    await updateSocialPrivacySettings(db, "u1", {
      socialEnabled: true,
      statsHidden: true,
      visibilityScope: SocialVisibilityScope.FRIENDS,
      visibleStatKeys: [SocialStatKey.READINESS_RANGE],
    });
    assert.deepEqual(await resolveVisibleSocialStats(db, { viewerUserId: "u2", subjectUserId: "u1", audience: "friend" }), []);

    await updateSocialPrivacySettings(db, "u1", {
      socialEnabled: true,
      statsHidden: false,
      pausedUntil: new Date(Date.now() + 86_400_000),
      visibilityScope: SocialVisibilityScope.PAUSED,
      visibleStatKeys: [SocialStatKey.READINESS_RANGE],
    });
    assert.deepEqual(await resolveVisibleSocialStats(db, { viewerUserId: "u2", subjectUserId: "u1", audience: "friend" }), []);

    await updateSocialPrivacySettings(db, "u1", {
      socialEnabled: true,
      statsHidden: false,
      pausedUntil: null,
      visibilityScope: SocialVisibilityScope.FRIENDS,
      visibleStatKeys: [SocialStatKey.READINESS_RANGE, SocialStatKey.WEEKLY_STREAK],
    });
    const visible = await resolveVisibleSocialStats(db, { viewerUserId: "u2", subjectUserId: "u1", audience: "friend" });
    assert.deepEqual(
      visible.map((s) => s.statKey).sort(),
      [SocialStatKey.READINESS_RANGE, SocialStatKey.WEEKLY_STREAK].sort(),
    );
    assert.equal(JSON.stringify(visible).includes("87"), false);
    assert.equal(JSON.stringify(visible).includes("student@example.com"), false);
  });
});

describe("social study challenges and groups", () => {
  it("creates challenges with expiry and supports block/remove privacy controls", async () => {
    const db = createMemorySocialStudyDb();
    db.addUser({ id: "u1", email: "student@example.com", displayName: "Learner One" });
    db.addUser({ id: "u2", email: "friend@example.com", displayName: "Learner Two" });
    await updateSocialPrivacySettings(db, "u2", { socialEnabled: true, allowFriendChallenges: true });
    const challenge = await createSocialChallenge(db, "u1", {
      participantUserIds: ["u2"],
      type: SocialChallengeType.FLASHCARD_SPRINT,
      title: "10-card sprint",
      expiresAt: new Date(Date.now() + 3_600_000),
    });
    assert.equal(challenge.ok, true);
    assert.equal(challenge.challenge?.status, SocialChallengeStatus.PENDING);
    assert.equal(challenge.participants.length, 2);

    const blocked = await blockSocialConnection(db, "u2", "u1");
    assert.equal(blocked.ok, true);
    assert.equal(blocked.connection?.status, SocialConnectionStatus.BLOCKED);
  });

  it("joins and leaves learner groups and staff-created classroom codes", async () => {
    const db = createMemorySocialStudyDb();
    db.addUser({ id: "u1", email: "student@example.com", displayName: "Learner One" });
    db.addUser({ id: "u2", email: "friend@example.com", displayName: "Learner Two" });
    db.addUser({ id: "staff", email: "staff@example.com", displayName: "Instructor" });

    const group = await createSocialGroup(db, "u1", { kind: SocialGroupKind.GROUP, name: "Night Shift Study", leaderboardEnabled: true });
    const classroom = await createSocialGroup(db, "staff", {
      kind: SocialGroupKind.CLASSROOM,
      name: "RN Cohort A",
      ownerUserId: null,
      leaderboardEnabled: true,
    });
    assert.equal(group.ok, true);
    assert.equal(classroom.ok, true);

    const ownerJoin = await joinSocialGroupByCode(db, "u1", group.group!.displayCode);
    const groupJoin = await joinSocialGroupByCode(db, "u2", group.group!.displayCode);
    const classroomJoin = await joinSocialGroupByCode(db, "u1", classroom.group!.displayCode);
    assert.equal(ownerJoin.ok, true);
    assert.equal(groupJoin.ok, true);
    assert.equal(classroomJoin.ok, true);

    await updateSocialPrivacySettings(db, "u1", {
      socialEnabled: true,
      statsHidden: false,
      leaderboardOptIn: true,
      visibilityScope: SocialVisibilityScope.GROUPS_CLASSROOMS,
      visibleStatKeys: [SocialStatKey.WEEKLY_STREAK],
    });
    await db.socialStatSnapshot.createMany({
      data: buildSanitizedSocialSnapshots("u1", { weeklyStudyStreak: 5 }),
    });
    const leaderboard = await listSocialGroupLeaderboard(db, "u2", group.group!.id);
    assert.equal(leaderboard.ok, true);
    assert.equal(leaderboard.entries.some((e) => e.userId === "u1"), true);

    const left = await leaveSocialGroup(db, "u2", group.group!.id);
    assert.equal(left.ok, true);
  });
});
