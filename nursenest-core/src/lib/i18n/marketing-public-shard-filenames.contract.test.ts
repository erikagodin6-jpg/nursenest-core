/**
 * Run: `node --import tsx --test src/lib/i18n/marketing-public-shard-filenames.contract.test.ts`
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { MARKETING_PUBLIC_I18N_SHARD_FILENAMES } from "@/lib/i18n/marketing-public-shard-filenames";

describe("marketing-public-shard-filenames", () => {
  it("matches I18N_SHARD_FILENAMES minus admin in shared/i18n-shard-policy.ts", () => {
    const policyPath = path.join(process.cwd(), "../shared/i18n-shard-policy.ts");
    const raw = readFileSync(policyPath, "utf8");
    const m = /export const I18N_SHARD_FILENAMES = \[([\s\S]*?)\] as const/u.exec(raw);
    assert.ok(m, "could not find I18N_SHARD_FILENAMES in shared policy");
    const names = [...m[1].matchAll(/"([^"]+)"/g)]
      .map((x) => x[1])
      .filter((n) => n !== "admin");
    assert.deepEqual([...MARKETING_PUBLIC_I18N_SHARD_FILENAMES], names);
  });
});
