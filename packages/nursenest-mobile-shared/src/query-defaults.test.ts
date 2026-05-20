import { describe, expect, it } from "vitest";
import { isLikelyUnauthorized, mobileQueryClientDefaults } from "./query-defaults.js";

describe("query defaults", () => {
  it("does not retry unauthorized", () => {
    const { retry } = mobileQueryClientDefaults().queries;
    expect(retry(0, { status: 401 })).toBe(false);
    expect(retry(0, { status: 403 })).toBe(false);
    expect(retry(0, { status: 404 })).toBe(false);
    expect(retry(0, { status: 503 })).toBe(true);
    expect(retry(0, new Error("network"))).toBe(true);
    expect(retry(2, new Error("network"))).toBe(false);
  });

  it("detects unauthorized error object", () => {
    expect(isLikelyUnauthorized({ status: 401 })).toBe(true);
    expect(isLikelyUnauthorized(new Error("x"))).toBe(false);
  });
});
