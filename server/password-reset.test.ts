import { describe, it, expect } from "vitest";
import { hashPasswordResetToken } from "./password-reset";

describe("password-reset", () => {
  it("hashes raw token deterministically for DB storage", () => {
    const raw = "a".repeat(64);
    const a = hashPasswordResetToken(raw);
    const b = hashPasswordResetToken(raw);
    expect(a).toBe(b);
    expect(a.length).toBe(64);
    expect(a).not.toContain(raw);
  });
});
