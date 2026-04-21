import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));

test("programmatic-question-topic-registry does not static-import the pages payload", () => {
  const src = readFileSync(join(dir, "programmatic-question-topic-registry.ts"), "utf8");
  assert.ok(
    !/^import\s*\{[^}]*PROGRAMMATIC_QUESTION_TOPIC_PAGES/m.test(src),
    "registry must not value-import PROGRAMMATIC_QUESTION_TOPIC_PAGES at module top",
  );
  assert.ok(
    /^import type \{[^}]*ProgrammaticQuestionTopicDefinition/m.test(src),
    "registry should use type-only import from pages module",
  );
  assert.match(src, /createRequire/);
  assert.match(src, /require\(\s*["']\.\/programmatic-question-topic-registry-pages["']\s*\)/);
});
