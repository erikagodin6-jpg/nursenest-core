import { describe, expect, it } from "vitest";
import {
  isLessonHubRetryableErrorMessage,
  isLessonHubSubscriptionLockedMessage,
  neutralLessonLockedBodyForSurface,
} from "./lesson-access-messages.js";

describe("lesson-access-messages", () => {
  it("detects subscription-locked API copy", () => {
    expect(isLessonHubSubscriptionLockedMessage("Subscription required")).toBe(true);
    expect(isLessonHubSubscriptionLockedMessage("not_subscribed")).toBe(true);
    expect(isLessonHubSubscriptionLockedMessage("Lesson not found")).toBe(false);
  });

  it("does not mark locked errors as retryable", () => {
    expect(isLessonHubRetryableErrorMessage("Subscription required")).toBe(false);
  });

  it("marks typical transient errors as retryable", () => {
    expect(isLessonHubRetryableErrorMessage("Network request failed")).toBe(true);
    expect(isLessonHubRetryableErrorMessage("Unable to verify access. Try again shortly.")).toBe(true);
  });

  it("returns neutral bodies without purchase language", () => {
    const list = neutralLessonLockedBodyForSurface("list");
    const detail = neutralLessonLockedBodyForSurface("detail");
    expect(list.toLowerCase()).not.toMatch(/stripe|checkout|upgrade|buy|subscribe now/);
    expect(detail.toLowerCase()).not.toMatch(/stripe|checkout|upgrade|buy|subscribe now/);
    expect(list.length).toBeGreaterThan(20);
  });
});
