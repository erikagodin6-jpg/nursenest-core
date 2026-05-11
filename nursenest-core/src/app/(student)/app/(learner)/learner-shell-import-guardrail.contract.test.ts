/**
 * Guardrail: block new static imports of heavy route islands into the global learner shell layout.
 *
 * Run: `npm run test:learner-shell-imports`
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const LAYOUT = path.join(HERE, "layout.tsx");

/** Static `import … from "…"` specifiers must not match these (add narrow exceptions only with comment in test). */
const BLOCKED_IMPORT_SUBSTRINGS = [
  "practice-test-runner-client",
  "admin-blog-control-panel-client",
  "question-bank-practice-client",
  "practice-tests-hub-client",
  "admin-learner-qa-simulation",
  "admin-view-as-learner-context",
] as const;

function staticImportSpecifiers(source: string): string[] {
  const out: string[] = [];
  const re = /^\s*import(?!\s+type\b)\s+[^'"]*\s+from\s+['"]([^'"]+)['"]\s*;?/gm;
  let m: RegExpExecArray | null;
  while ((m = re.exec(source)) !== null) {
    out.push(m[1]!);
  }
  return out;
}

describe("learner shell layout static imports", () => {
  it("does not pull blocked heavy client modules into the global learner shell", () => {
    const src = fs.readFileSync(LAYOUT, "utf8");
    const specifiers = staticImportSpecifiers(src);
    const hits: string[] = [];
    for (const s of specifiers) {
      for (const b of BLOCKED_IMPORT_SUBSTRINGS) {
        if (s.includes(b)) hits.push(s);
      }
    }
    assert.deepEqual(
      hits,
      [],
      `Remove static imports of heavy route modules from learner layout; use route-level or dynamic import instead.\nOffenders:\n${hits.join("\n")}`,
    );
  });
});
