import { describe, expect, it } from "vitest";
import { isPaywallOrAuthCode, parseApiErrorCode, shouldShowUpgradeUi } from "./paywall.js";

describe("paywall helpers", () => {
  it("parses code from JSON body", () => {
    expect(parseApiErrorCode({ code: "not_subscribed" })).toBe("not_subscribed");
    expect(parseApiErrorCode(null)).toBeUndefined();
  });

  it("classifies known codes", () => {
    expect(isPaywallOrAuthCode("not_subscribed")).toBe(true);
    expect(isPaywallOrAuthCode("random")).toBe(false);
  });

  it("upgrade UI on 401 or subscription 403", () => {
    expect(shouldShowUpgradeUi(401, {})).toBe(true);
    expect(shouldShowUpgradeUi(403, { code: "not_subscribed" })).toBe(true);
    expect(shouldShowUpgradeUi(403, { code: "learner_path_invalid" })).toBe(false);
    expect(shouldShowUpgradeUi(200, {})).toBe(false);
  });
});
