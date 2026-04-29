/**
 * Contract tests for Practice Questions setup (no Next.js runtime — stable strings only).
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import { BODY_SYSTEMS } from "@/components/student/practice-question-session-setup-client";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe("Practice question session setup contracts", () => {
  it("body system cards use system-level labels only (no condition-level disease tiles)", () => {
    const labels = BODY_SYSTEMS.map((b) => b.label).join(" ");
    const forbidden = ["Angina", "Heart Failure", "Hypertension", "Diabetes Mellitus", "COPD"];
    for (const term of forbidden) {
      assert.ok(
        !labels.includes(term),
        `Setup must not surface condition-level card "${term}" in body-system grid`,
      );
    }
  });

  it("renders Start Adaptive Practice before secondary cards section in source order", () => {
    const src = readFileSync(join(__dirname, "practice-question-session-setup-client.tsx"), "utf8");
    const start = src.indexOf('data-testid="start-practice-btn"');
    const secondary = src.indexOf('data-testid="secondary-cards"');
    assert.ok(start > 0 && secondary > start, "Primary CTA must appear before secondary cards block");
  });
});
