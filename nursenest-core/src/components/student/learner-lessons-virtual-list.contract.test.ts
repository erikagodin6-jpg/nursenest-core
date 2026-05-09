import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe("learner-lessons-virtual-list", () => {
  it("virtual scroll parent avoids strict containment (zero-height regression)", () => {
    const src = readFileSync(join(__dirname, "learner-lessons-virtual-list.tsx"), "utf8");
    assert.doesNotMatch(src, /contain:\s*["']strict["']/);
    assert.match(src, /contain:\s*["']layout paint["']/);
  });
});
