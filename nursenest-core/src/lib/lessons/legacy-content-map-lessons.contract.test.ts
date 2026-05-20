import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SOURCE_PATH = join(__dirname, "legacy-content-map-lessons.ts");

describe("legacy content map lessons runtime loader", () => {
  it("avoids static legacy lesson imports and keeps a lesson body compatible local type", () => {
    const source = readFileSync(SOURCE_PATH, "utf8");

    assert.match(source, /^import "server-only";/m);
    assert.doesNotMatch(source, /from ["']@legacy-client\/data\/lessons\/(?:index|types)["']/);
    assert.match(source, /new Function\("s", "return import\(s\)"\)/);
    assert.doesNotMatch(source, /title:\s*unknown;/);
    assert.match(source, /title:\s*string;/);
  });
});
