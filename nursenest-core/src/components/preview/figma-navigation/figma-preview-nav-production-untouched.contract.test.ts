import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

const REPO_ROOT = path.resolve(import.meta.dirname, "../../../../..");

const FORBIDDEN_PATHS = [
  "nursenest-core/src/components/layout/site-header.tsx",
  "nursenest-core/src/lib/navigation/global-nav-config.ts",
];

const ALLOWED_PREFIXES = [
  "nursenest-core/src/app/(preview)/preview/figma-navigation/",
  "nursenest-core/src/components/preview/figma-navigation/",
  "nursenest-core/reports/figma-navigation-preview-2026-05-08",
  "reports/figma-navigation-preview-2026-05-08.md",
];

const ALLOWED_SUBSTRINGS = [
  "figma-preview-nav-production-untouched.contract.test.ts",
  "tests/e2e/preview/figma-navigation-preview.smoke.spec.ts",
  "tests/e2e/preview/figma-navigation-preview.capture.spec.ts",
  "nursenest-core/reports/figma-navigation-preview-2026-05-08",
  "reports/figma-navigation-preview-2026-05-08.md",
];

/** Hot pink and common vivid pink literals — preview must avoid these in source. */
const DISALLOWED_COLOR_SNIPPETS = [
  "#ff69b4",
  "#ff1493",
  "#ff00ff",
  "hotpink",
  "deeppink",
];

function gitDiffNameOnly(base: string): string[] {
  const out = execSync(`git diff --name-only ${base}...HEAD`, {
    encoding: "utf8",
    cwd: REPO_ROOT,
  });
  return out
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function walkTsx(dir: string, acc: string[]) {
  if (!fs.existsSync(dir)) return;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkTsx(p, acc);
    else if (ent.name.endsWith(".tsx") || ent.name.endsWith(".ts")) acc.push(p);
  }
}

describe("figma preview navigation contracts", () => {
  it("diff vs merge-base does not touch production nav sources", () => {
    let files: string[];
    try {
      const base = execSync("git merge-base origin/main HEAD", { encoding: "utf8", cwd: REPO_ROOT }).trim();
      files = gitDiffNameOnly(base);
    } catch {
      return;
    }
    if (files.length === 0) return;

    for (const f of files) {
      if (ALLOWED_SUBSTRINGS.some((s) => f.includes(s))) continue;
      assert.ok(
        ALLOWED_PREFIXES.some((p) => f.startsWith(p)),
        `Unexpected path in diff (production nav must stay untouched): ${f}`,
      );
      assert.ok(!FORBIDDEN_PATHS.includes(f), `Forbidden production path modified: ${f}`);
    }
  });

  it("preview components contain no disallowed pink literals", () => {
    const root = path.join(REPO_ROOT, "nursenest-core/src/components/preview/figma-navigation");
    const files: string[] = [];
    walkTsx(root, files);
    assert.ok(files.length >= 3, "expected preview figma-navigation source files");
    for (const file of files) {
      if (file.endsWith(".contract.test.ts")) continue;
      const body = fs.readFileSync(file, "utf8");
      const lower = body.toLowerCase();
      for (const snip of DISALLOWED_COLOR_SNIPPETS) {
        assert.equal(
          lower.includes(snip.toLowerCase()),
          false,
          `${path.relative(REPO_ROOT, file)} must not contain ${snip}`,
        );
      }
    }
  });
});
