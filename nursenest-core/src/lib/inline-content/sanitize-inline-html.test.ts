import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { sanitizeInlineRichHtml } from "@/lib/inline-content/sanitize-inline-html";

describe("sanitizeInlineRichHtml", () => {
  test("strips script tags and inline handlers", () => {
    const raw = `<p onclick="evil()">Hi</p><script>alert(1)</script><p>OK</p>`;
    const out = sanitizeInlineRichHtml(raw);
    assert.match(out, /OK/);
    assert.doesNotMatch(out, /onclick/i);
    assert.doesNotMatch(out, /<script/i);
  });

  test("neutralizes javascript: URLs and strips iframes", () => {
    const raw = `<a href="javascript:alert(1)">x</a><iframe src="https://evil"></iframe>`;
    const out = sanitizeInlineRichHtml(raw);
    assert.doesNotMatch(out, /javascript:/i);
    assert.doesNotMatch(out, /<iframe/i);
  });
});
