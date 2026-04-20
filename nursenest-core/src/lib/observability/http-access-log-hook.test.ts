import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const thisDir = dirname(fileURLToPath(import.meta.url));
const hookSource = readFileSync(join(thisDir, "http-access-log-hook.ts"), "utf8");

describe("http-access-log-hook", () => {
  it("does not patch Server.prototype.emit (createServer-only instrumentation)", () => {
    assert.equal(/(?:^|[^a-zA-Z.])Server\.prototype\.emit\s*=/.test(hookSource), false);
    assert.equal(/emitPatched/.test(hookSource), false);
  });

  it("patches createServer for access logging", () => {
    assert.match(hookSource, /patchCreateServer/);
    assert.match(hookSource, /__nnHttpAccessLogCreateServerPatched/);
  });
});
