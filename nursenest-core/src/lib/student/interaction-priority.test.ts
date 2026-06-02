import assert from "node:assert/strict";
import test from "node:test";
import {
  isWithinRecentWindow,
  resolveInteractionPriority,
  resolvePracticeHistoryEmphasis,
  resolvePriorityMessage,
  resolvePriorityTarget,
} from "@/lib/student/interaction-priority";

test("resolveInteractionPriority: resume + weak + recent -> resume wins", () => {
  const p = resolveInteractionPriority({
    hasResume: true,
    hasWeakFocus: true,
    hasRecentCompletion: true,
  });
  assert.equal(p, "resume");
});

test("resolveInteractionPriority: weak + recent -> weak_focus wins", () => {
  const p = resolveInteractionPriority({
    hasResume: false,
    hasWeakFocus: true,
    hasRecentCompletion: true,
  });
  assert.equal(p, "weak_focus");
});

test("resolveInteractionPriority: recent only -> review_recent wins", () => {
  const p = resolveInteractionPriority({
    hasResume: false,
    hasWeakFocus: false,
    hasRecentCompletion: true,
  });
  assert.equal(p, "review_recent");
});

test("resolveInteractionPriority: none -> none", () => {
  const p = resolveInteractionPriority({
    hasResume: false,
    hasWeakFocus: false,
    hasRecentCompletion: false,
  });
  assert.equal(p, "none");
});

test("resolvePriorityMessage returns exactly one message", () => {
  const messages = {
    resume: "resume message",
    weak_focus: "weak message",
    review_recent: "recent message",
  } as const;

  assert.equal(resolvePriorityMessage("resume", messages), "resume message");
  assert.equal(resolvePriorityMessage("weak_focus", messages), "weak message");
  assert.equal(resolvePriorityMessage("review_recent", messages), "recent message");
  assert.equal(resolvePriorityMessage("none", messages), null);
});

test("quick-link emphasis target resolves to one winner", () => {
  const targets = {
    resume: "lessons",
    weak_focus: "questions",
    review_recent: "cat",
  } as const;

  assert.equal(resolvePriorityTarget("resume", targets), "lessons");
  assert.equal(resolvePriorityTarget("weak_focus", targets), "questions");
  assert.equal(resolvePriorityTarget("review_recent", targets), "cat");
  assert.equal(resolvePriorityTarget("none", targets), null);
});

test("practice history emphasis never returns mixed winners", () => {
  const now = Date.now();
  const recentCompletedAt = new Date(now - 60 * 60 * 1000).toISOString();

  const inProgress = resolvePracticeHistoryEmphasis(
    "resume",
    { status: "IN_PROGRESS", completedAt: null },
    now,
  );
  assert.deepEqual(inProgress, { rowEmphasis: "resume", actionEmphasis: "resume" });

  const reviewRecent = resolvePracticeHistoryEmphasis(
    "review_recent",
    { status: "COMPLETED", completedAt: recentCompletedAt },
    now,
  );
  assert.deepEqual(reviewRecent, { rowEmphasis: "review_recent", actionEmphasis: "review_recent" });

  const blockedByPriority = resolvePracticeHistoryEmphasis(
    "resume",
    { status: "COMPLETED", completedAt: recentCompletedAt },
    now,
  );
  assert.deepEqual(blockedByPriority, { rowEmphasis: "none", actionEmphasis: "none" });
});

test("isWithinRecentWindow matches 72h default window", () => {
  const now = Date.now();
  const recent = new Date(now - 2 * 60 * 60 * 1000).toISOString();
  const stale = new Date(now - 96 * 60 * 60 * 1000).toISOString();
  assert.equal(isWithinRecentWindow(recent, now), true);
  assert.equal(isWithinRecentWindow(stale, now), false);
});
