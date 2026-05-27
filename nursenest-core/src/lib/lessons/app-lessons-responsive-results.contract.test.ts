import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const componentPath = join(here, "../../components/student/learner-lessons-responsive-results.tsx");

test("app lesson results keep the shell stable during category/search loading", () => {
  const source = readFileSync(componentPath, "utf8");
  assert.match(source, /AbortController/);
  assert.match(source, /LessonsListSkeleton/);
  assert.match(source, /prefetchFilters/);
  assert.match(source, /prefetchingKeysRef/);
  assert.match(source, /prefetchControllersRef/);
  assert.match(source, /signal: controller\.signal/);
  assert.match(source, /controller\.abort\(\)/);
  assert.match(source, /onTopicPrefetch=\{prefetchTopic\}/);
  assert.match(source, /aria-busy=\{loading\}/);
  assert.match(source, /window\.history\.pushState/);
  assert.doesNotMatch(source, /window\.location\.reload/);
});
