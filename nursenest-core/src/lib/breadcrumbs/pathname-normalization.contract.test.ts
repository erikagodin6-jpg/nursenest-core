import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { test } from "node:test";
import { ACADEMY_PATHNAME_REGISTRY, normalizeEducationalPathname } from "@/lib/breadcrumbs/pathname-normalization";

const ROOT = new URL("../../../", import.meta.url).pathname.replace(/\/$/, "");
const MARKETING = join(ROOT, "src/app/(marketing)/(default)");

function walk(dir: string, acc: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (p.endsWith("page.tsx")) acc.push(p);
  }
  return acc;
}

test("academy pages with PATH declare pathname on AcademyBreadcrumbBar", () => {
  const missing: string[] = [];
  for (const file of walk(MARKETING)) {
    const text = readFileSync(file, "utf8");
    if (!text.includes("AcademyBreadcrumbBar")) continue;
    if (!text.includes("const PATH")) continue;
    if (!text.includes("pathname={PATH}") && !text.includes("pathname={PATH}")) {
      missing.push(relative(ROOT, file));
    }
  }
  assert.deepEqual(missing, []);
});

test("registry paths are normalized", () => {
  for (const path of Object.values(ACADEMY_PATHNAME_REGISTRY)) {
    assert.equal(path, normalizeEducationalPathname(path));
  }
});
