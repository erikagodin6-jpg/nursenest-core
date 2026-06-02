/**
 * Phase 3 — learner hubs keep QA render trace in a separate client chunk (next/dynamic).
 *
 * Run with: `node --import tsx --test src/app/(app)/app/(learner)/learner-hub-trace-import.contract.test.ts`
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FLASH = path.join(HERE, "flashcards", "page.tsx");
const PRACTICE = path.join(HERE, "practice-tests", "page.tsx");

describe("learner hub render trace import (Phase 3)", () => {
  it("loads LearnerRenderTraceBanner via dynamic wrapper, not the eager client module", () => {
    for (const f of [FLASH, PRACTICE]) {
      const src = fs.readFileSync(f, "utf8");
      assert.match(src, /learner-render-trace-banner\.dynamic/);
      assert.ok(!src.includes(`from "@/components/dev/learner-render-trace-banner"`));
    }
  });
});
