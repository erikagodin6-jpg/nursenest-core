import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const __dirname = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(__dirname, "site-header.tsx"), "utf8");

describe("site header Start Free CTA", () => {
  it("uses the computed signup href, not the blog href", () => {
    assert.match(source, /const guestMarketingSignupHref = useMemo/);
    assert.match(source, /href=\{guestMarketingSignupHref\}/);
    assert.doesNotMatch(source, /aria-label="Start free account[^"]*"[\s\S]{0,220}href=\{"?\/blog/);
  });
});
