import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const __dirname = dirname(fileURLToPath(import.meta.url));
const UI_DIR = __dirname;

/** Flag likely unreadable light-on-light: text-white adjacent to light card surfaces in same line. */
const SUSPECT = /text-white.*\b(bg-card|bg-muted)\b|\b(bg-card|bg-muted)\b.*text-white/;

test("learner-account-ui: avoid text-white paired with light card backgrounds on one line", () => {
  const offenders: string[] = [];
  for (const name of readdirSync(UI_DIR)) {
    if (!name.endsWith(".tsx")) continue;
    const p = join(UI_DIR, name);
    const lines = readFileSync(p, "utf8").split(/\r?\n/);
    lines.forEach((line, idx) => {
      if (line.trim().startsWith("//")) return;
      if (SUSPECT.test(line)) offenders.push(`${name}:${idx + 1}`);
    });
  }
  assert.equal(offenders.length, 0, offenders.join("\n"));
});

test("learner-account-ui shell exports data marker for E2E / smoke", () => {
  const shell = readFileSync(join(UI_DIR, "learner-account-shell.tsx"), "utf8");
  assert.ok(shell.includes("data-nn-learner-account-shell"));
});
