import assert from "node:assert/strict";
import test from "node:test";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { handlePublicFlashcardTagsGet, PUBLIC_FLASHCARD_TAGS_CONTRACT_VERSION } from "./handle-public-flashcard-tags-get";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function readJson(res: Response): Promise<unknown> {
  const text = await res.text();
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new Error(`not_json: ${text.slice(0, 200)}`);
  }
}

test("handlePublicFlashcardTagsGet returns 200 JSON with tags + v3 contract on success", async () => {
  const res = await handlePublicFlashcardTagsGet(() =>
    Promise.resolve({ tags: [{ slug: "airway", name: "Airway" }], inventorySource: "db" }),
  );
  assert.equal(res.status, 200);
  assert.equal(res.headers.get("content-type")?.includes("application/json"), true);
  const body = (await readJson(res)) as {
    tags?: unknown;
    contractVersion?: string;
    source?: string;
    tagCount?: number;
    inventorySource?: string;
  };
  assert.ok(Array.isArray(body.tags));
  assert.equal((body.tags as { slug: string }[]).length, 1);
  assert.equal(body.contractVersion, PUBLIC_FLASHCARD_TAGS_CONTRACT_VERSION);
  assert.equal(body.source, "db");
  assert.equal(body.tagCount, 1);
  assert.equal("inventorySource" in body, false, "inventorySource must not leak to clients");
});

test("handlePublicFlashcardTagsGet maps inventorySource fallback to branch source", async () => {
  const res = await handlePublicFlashcardTagsGet(() =>
    Promise.resolve({ tags: [{ slug: "deck-a", name: "Deck A" }], inventorySource: "fallback" }),
  );
  assert.equal(res.status, 200);
  const body = (await readJson(res)) as { source?: string; tagCount?: number };
  assert.equal(body.source, "fallback");
  assert.equal(body.tagCount, 1);
});

test("handlePublicFlashcardTagsGet returns 503 JSON with stable code on thrown DB-ish error", async () => {
  const res = await withConfiguredDatabaseUrl(() =>
    handlePublicFlashcardTagsGet(() => Promise.reject(new Error("database_timeout"))),
  );
  assert.equal(res.status, 503);
  const body = (await readJson(res)) as {
    code?: string;
    tags?: unknown;
    error?: string;
    surface?: string;
    contractVersion?: string;
    source?: string;
    tagCount?: number;
  };
  assert.equal(body.tags === undefined || body.tags === null, true, "must not fake-success with tags key");
  assert.equal(body.code, "database_error");
  assert.equal(body.error, "DATA_UNAVAILABLE");
  assert.equal(body.surface, "flashcard_tags");
  assert.ok(typeof body.reasonFailed === "string");
  assert.equal(body.contractVersion, PUBLIC_FLASHCARD_TAGS_CONTRACT_VERSION);
  assert.equal(body.source, "db");
  assert.equal(body.tagCount, 0);
});

test("handlePublicFlashcardTagsGet returns public_flashcard_tags_unavailable for db_query_shape_failure class", async () => {
  const res = await withConfiguredDatabaseUrl(() =>
    handlePublicFlashcardTagsGet(() =>
      Promise.reject(new Error("Invalid `prisma.flashcardTag.findMany()` invocation:")),
    ),
  );
  assert.equal(res.status, 503);
  const body = (await readJson(res)) as { code?: string; error?: string; contractVersion?: string };
  assert.equal(body.code, "public_flashcard_tags_unavailable");
  assert.equal(body.error, "DATA_UNAVAILABLE");
  assert.equal(body.contractVersion, PUBLIC_FLASHCARD_TAGS_CONTRACT_VERSION);
});

test("handlePublicFlashcardTagsGet returns 503 public_flashcard_tags_unavailable when tags is not an array", async () => {
  const res = await handlePublicFlashcardTagsGet(() =>
    Promise.resolve({ tags: "not-array" } as unknown as { tags: { slug: string; name: string }[] }),
  );
  assert.equal(res.status, 503);
  const body = (await readJson(res)) as {
    code?: string;
    reasonFailed?: string;
    tags?: unknown;
    contractVersion?: string;
  };
  assert.equal(body.code, "public_flashcard_tags_unavailable");
  assert.equal(body.reasonFailed, "INVALID_TAG_PAYLOAD");
  assert.equal(body.tags === undefined || body.tags === null, true);
  assert.equal(body.contractVersion, PUBLIC_FLASHCARD_TAGS_CONTRACT_VERSION);
});

test("handlePublicFlashcardTagsGet returns 503 DATA_UNAVAILABLE when loader returns zero tags — no tags key", async () => {
  const res = await handlePublicFlashcardTagsGet(() => Promise.resolve({ tags: [] }));
  assert.equal(res.status, 503);
  const body = (await readJson(res)) as Record<string, unknown>;
  assert.equal("tags" in body, false, "empty inventory must not include tags:[]");
  assert.equal(body.code, "DATA_UNAVAILABLE");
  assert.equal(body.message, "No public flashcard tags available");
  assert.equal(body.contractVersion, PUBLIC_FLASHCARD_TAGS_CONTRACT_VERSION);
  assert.equal(body.source, "db");
  assert.equal(body.tagCount, 0);
});

test("route.ts uses safeJsonRoute and does not reference safeJsonReadRoute", () => {
  const routePath = join(__dirname, "route.ts");
  const src = readFileSync(routePath, "utf8");
  assert.ok(src.includes("safeJsonRoute"), "must wrap with safeJsonRoute");
  assert.ok(!src.includes("safeJsonReadRoute"), "must not use safeJsonReadRoute (no fake 200 empty lists)");
});

test("repo must not register GET /api/public/flashcard-tags on safeJsonReadRoute", () => {
  const nursenestCoreRoot = join(__dirname, "../../../../../");
  try {
    const out = execFileSync(
      "rg",
      ["-n", "safeJsonReadRoute\\([\"']GET /api/public/flashcard-tags", nursenestCoreRoot],
      { encoding: "utf8" },
    );
    assert.fail(`unexpected safeJsonReadRoute wiring for flashcard-tags:\n${out}`);
  } catch (e) {
    const err = e as { status?: number; stderr?: Buffer };
    if (err.status === 1) return;
    if (err.status === 127) {
      assert.fail("rg (ripgrep) not installed — install ripgrep or run this check in CI with rg available");
    }
    throw e;
  }
});

function withConfiguredDatabaseUrl<T>(run: () => Promise<T>): Promise<T> {
  const prev = process.env.DATABASE_URL;
  process.env.DATABASE_URL = "postgresql://user:pass@127.0.0.1:5432/test";
  return run().finally(() => {
    if (prev === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = prev;
  });
}
