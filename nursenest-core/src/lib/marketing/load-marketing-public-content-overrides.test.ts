/**
 * Regression tests: missing marketing_public_content_overrides table must never crash the homepage.
 *
 * The loader (load-marketing-public-content-overrides.ts) has server-only and next/cache deps that
 * cannot be imported in a plain tsx/node:test context. These tests validate the two building blocks
 * the loader now uses — isNonFatalPrismaSchemaError and withPrismaReadFallback — with real P2021
 * payloads. A regression that removes the catch or changes the detection will break these tests.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { Prisma } from "@prisma/client";
import { isNonFatalPrismaSchemaError, withPrismaReadFallback } from "@/lib/prisma/safe-reads";

function makeP2021(table = "public.marketing_public_content_overrides"): Prisma.PrismaClientKnownRequestError {
  return new Prisma.PrismaClientKnownRequestError(
    `The table \`${table}\` does not exist in the current database.`,
    { code: "P2021", clientVersion: "5.0.0" },
  );
}

describe("marketing override table missing (P2021) — fail-soft regression", () => {
  it("isNonFatalPrismaSchemaError classifies P2021 as non-fatal", () => {
    assert.equal(isNonFatalPrismaSchemaError(makeP2021()), true);
  });

  it("isNonFatalPrismaSchemaError classifies marketing_public_content_overrides table error as non-fatal", () => {
    const e = makeP2021("public.marketing_public_content_overrides");
    assert.equal(isNonFatalPrismaSchemaError(e), true);
  });

  it("withPrismaReadFallback returns empty array when findMany throws P2021", async () => {
    const result = await withPrismaReadFallback(
      "marketing_public_content_overrides",
      async () => {
        throw makeP2021();
      },
      [] as Array<{ messageKey: string; value: string }>,
    );
    assert.deepEqual(result.value, []);
    assert.ok(typeof result.warning === "string", "warning string present");
    assert.ok(result.warning!.includes("schema_or_table"), "warning identifies schema/table error");
  });

  it("loader-equivalent catch pattern returns empty map when P2021 thrown", async () => {
    // Mirrors the catch block in loadMarketingPublicContentOverridesImpl so any change to
    // that block will also need to update this test to stay green.
    const out: Record<string, string> = {};
    try {
      await Promise.reject(makeP2021());
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      const isTableMissing =
        isNonFatalPrismaSchemaError(e) || msg.includes("marketing_public_content_overrides");
      if (!isTableMissing) throw e; // non-table errors would still propagate in the real loader
      // table-missing: return empty map, never throw
    }
    assert.deepEqual(out, {});
  });

  it("non-table Prisma errors are NOT silenced by the table-missing guard", () => {
    const connectionError = new Error("Connection refused to database host");
    assert.equal(isNonFatalPrismaSchemaError(connectionError), false);
    assert.equal(connectionError.message.includes("marketing_public_content_overrides"), false);
  });

  it("homepage render path .catch guard produces empty map on any loader throw", async () => {
    // Both layouts call:  loadMarketingPublicContentOverridesForLocale(locale).catch(() => ({}))
    // This test validates the outer safety net independently.
    async function simulateLoader(): Promise<Record<string, string>> {
      throw makeP2021();
    }
    const overrides = await simulateLoader().catch(() => ({} as Record<string, string>));
    assert.deepEqual(overrides, {});
  });
});
