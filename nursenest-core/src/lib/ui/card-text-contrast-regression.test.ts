import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** nursenest-core/ — this file lives at src/lib/ui/ */
const PACKAGE_ROOT = join(__dirname, "../../..");

const FORBIDDEN = /\btext-white(?:\/\d{2,3})?\b/;

function isSkippableLine(line: string): boolean {
  const t = line.trim();
  if (t.startsWith("//") || t.startsWith("*") || t.startsWith("/*")) return true;
  // Docstrings mentioning the token as guidance
  if (t.includes("Avoids `text-white`")) return true;
  return false;
}

function* walkSourceFiles(dir: string): Generator<string> {
  let entries: ReturnType<typeof readdirSync>;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const ent of entries) {
    const p = join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === "node_modules" || ent.name.startsWith(".")) continue;
      yield* walkSourceFiles(p);
    } else if (
      ent.isFile() &&
      (ent.name.endsWith(".tsx") || ent.name.endsWith(".ts")) &&
      !ent.name.includes(".test.")
    ) {
      yield p;
    }
  }
}

const SCAN_DIRS = [
  join(PACKAGE_ROOT, "src/components/pathway-lessons"),
  join(PACKAGE_ROOT, "src/components/marketing"),
  join(PACKAGE_ROOT, "src/components/study"),
  join(PACKAGE_ROOT, "src/components/ui"),
  join(PACKAGE_ROOT, "src/components/flashcards"),
  join(PACKAGE_ROOT, "src/components/lessons"),
  join(PACKAGE_ROOT, "src/components/exam-pathways"),
  join(PACKAGE_ROOT, "src/app/(marketing)/(default)/flashcards"),
  join(PACKAGE_ROOT, "src/components/learner-account-ui"),
];

test("lesson / marketing / study surfaces: no raw text-white (use nn-text-on-solid-fill or inherit)", () => {
  const offenders: string[] = [];

  for (const root of SCAN_DIRS) {
    if (!existsSync(root)) continue;
    for (const file of walkSourceFiles(root)) {
      const rel = relative(PACKAGE_ROOT, file);
      const text = readFileSync(file, "utf8");
      const lines = text.split(/\r?\n/);
      lines.forEach((line, idx) => {
        if (isSkippableLine(line)) return;
        if (FORBIDDEN.test(line)) {
          offenders.push(`${rel}:${idx + 1}: ${line.trim()}`);
        }
      });
    }
  }

  assert.equal(
    offenders.length,
    0,
    `Remove text-white from light-surface hubs; use nn-text-on-solid-fill on dark fills or inherit from gradient/chip parents.\n${offenders.join("\n")}`,
  );
});
