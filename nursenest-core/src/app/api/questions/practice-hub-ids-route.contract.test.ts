import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const __dirname = dirname(fileURLToPath(import.meta.url));
const routePath = join(__dirname, "route.ts");

describe("GET /api/questions practiceHubIds", () => {
  it("parses practiceHubIds and merges pathway hub pool", () => {
    const src = readFileSync(routePath, "utf8");
    assert.ok(src.includes('searchParams.get("practiceHubIds")'));
    assert.ok(src.includes("parsePracticeHubIdsParam"));
    assert.ok(src.includes("loadPathwayPracticeBodySystemHubAggregates"));
    assert.ok(src.includes("mergePracticeHubPoolForApi"));
    assert.ok(src.includes("prismaWhereForPracticeHubPool"));
  });
});
