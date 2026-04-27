import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isNextNotFoundNavigationError,
  isNextRedirectError,
  rethrowNextNavigationControlFlow,
} from "@/lib/next/navigation-abort";

describe("navigation-abort", () => {
  it("detects NEXT_REDIRECT digest", () => {
    assert.equal(isNextRedirectError({ digest: "NEXT_REDIRECT;replace;/x" }), true);
    assert.equal(isNextRedirectError(new Error("nope")), false);
    assert.equal(isNextRedirectError(null), false);
  });

  it("detects NEXT_NOT_FOUND digest", () => {
    assert.equal(isNextNotFoundNavigationError({ digest: "NEXT_NOT_FOUND" }), true);
    assert.equal(isNextNotFoundNavigationError({ digest: "NEXT_NOT_FOUND;foo" }), true);
    assert.equal(isNextNotFoundNavigationError({ digest: "NEXT_REDIRECT;x" }), false);
  });

  it("rethrowNextNavigationControlFlow throws redirect and not-found", () => {
    const redirectErr = { digest: "NEXT_REDIRECT;permanent;/lessons/a" };
    assert.throws(() => rethrowNextNavigationControlFlow(redirectErr), (e) => e === redirectErr);
    const nf = { digest: "NEXT_NOT_FOUND" };
    assert.throws(() => rethrowNextNavigationControlFlow(nf), (e) => e === nf);
    assert.doesNotThrow(() => rethrowNextNavigationControlFlow(new Error("ordinary")));
  });
});
