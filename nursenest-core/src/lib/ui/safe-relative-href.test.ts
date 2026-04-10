import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isSafeRelativeNavHref, sanitizeRelativeNavHrefOrFallback } from "@/lib/ui/safe-relative-href";

describe("safe-relative-href", () => {
  it("accepts normal app and marketing paths", () => {
    assert.equal(isSafeRelativeNavHref("/app/lessons"), true);
    assert.equal(isSafeRelativeNavHref("/us/rn/nclex-rn/lessons"), true);
  });

  it("rejects protocol-relative and traversal", () => {
    assert.equal(isSafeRelativeNavHref("//evil.example"), false);
    assert.equal(isSafeRelativeNavHref("/a/../b"), false);
    assert.equal(isSafeRelativeNavHref("https://x.com/"), false);
    assert.equal(isSafeRelativeNavHref("javascript:alert(1)"), false);
  });

  it("sanitizeRelativeNavHrefOrFallback returns fallback for unsafe", () => {
    assert.equal(sanitizeRelativeNavHrefOrFallback("//x", "/"), "/");
    assert.equal(sanitizeRelativeNavHrefOrFallback("/ok", "/"), "/ok");
  });
});
