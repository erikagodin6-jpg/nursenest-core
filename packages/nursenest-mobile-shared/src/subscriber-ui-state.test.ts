import { describe, expect, it } from "vitest";
import { resolveSubscriberUiState, subscriberHeadlineFromSubscriberApi403 } from "./subscriber-ui-state.js";

describe("resolveSubscriberUiState", () => {
  it("blocks locked flash while auth is not ready", () => {
    const s = resolveSubscriberUiState({
      authReady: false,
      hasApiCredentials: true,
      profile: { isLoading: false, isSuccess: false, isError: false, data: undefined },
    });
    expect(s.phase).toBe("wait_auth");
    expect(s.blockLockedCopyFlash).toBe(true);
    expect(s.subscriberAccess).toBe(false);
  });

  it("blocks locked flash while profile is loading", () => {
    const s = resolveSubscriberUiState({
      authReady: true,
      hasApiCredentials: true,
      profile: { isLoading: true, isSuccess: false, isError: false, data: undefined },
    });
    expect(s.phase).toBe("profile_loading");
    expect(s.blockLockedCopyFlash).toBe(true);
  });

  it("surfaces verify_failed from entitlementVerifyFailed", () => {
    const s = resolveSubscriberUiState({
      authReady: true,
      hasApiCredentials: true,
      profile: {
        isLoading: false,
        isSuccess: true,
        isError: false,
        data: { subscriberAccess: false, entitlementVerifyFailed: true },
      },
    });
    expect(s.phase).toBe("verify_failed");
    expect(s.subscriberAccess).toBe(false);
  });

  it("treats missing subscriberAccess as no_subscriber_access", () => {
    const s = resolveSubscriberUiState({
      authReady: true,
      hasApiCredentials: true,
      profile: {
        isLoading: false,
        isSuccess: true,
        isError: false,
        data: { subscriberAccess: false, entitlementVerifyFailed: false },
      },
    });
    expect(s.phase).toBe("no_subscriber_access");
    expect(s.neutralSummaryLine).toMatch(/website/i);
  });

  it("subscriber_ok when subscriberAccess true", () => {
    const s = resolveSubscriberUiState({
      authReady: true,
      hasApiCredentials: true,
      profile: {
        isLoading: false,
        isSuccess: true,
        isError: false,
        data: { subscriberAccess: true, entitlementVerifyFailed: false },
      },
    });
    expect(s.phase).toBe("subscriber_ok");
    expect(s.subscriberAccess).toBe(true);
    expect(s.neutralSummaryLine).toBe("");
  });
});

describe("subscriberHeadlineFromSubscriberApi403", () => {
  it("maps not_subscribed", () => {
    expect(subscriberHeadlineFromSubscriberApi403({ code: "not_subscribed" })).toMatch(/website/i);
  });
  it("maps access_verify_failed", () => {
    expect(subscriberHeadlineFromSubscriberApi403({ code: "access_verify_failed" })).toMatch(/verified/i);
  });
});
