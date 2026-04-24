import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { handlePublicFlashcardTagsGet } from "./handle-public-flashcard-tags-get";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function readJson(res: Response): Promise<unknown> {
  const text = await res.text();
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new Error(`not_json: ${text.slice(0, 200)}`);
  }
}

test("handlePublicFlashcardTagsGet returns 200 JSON with tags array on success", async () => {
  const res = await handlePublicFlashcardTagsGet(() =>
    Promise.resolve({ tags: [{ slug: "airway", name: "Airway" }] }),
  );
  assert.equal(res.status, 200);
  assert.equal(res.headers.get("content-type")?.includes("application/json"), true);
  const body = (await readJson(res)) as { tags?: unknown; __debug?: string };
  assert.ok(Array.isArray(body.tags));
  assert.equal((body.tags as { slug: string }[]).length, 1);
  assert.equal(body.__debug, "flashcard-tags-v2", "TEMP: remove __debug after prod deploy verification");
});

function withConfiguredDatabaseUrl<T>(run: () => Promise<T>): Promise<T> {
  const prev = process.env.DATABASE_URL;
  process.env.DATABASE_URL = "postgresql://user:pass@127.0.0.1:5432/test";
  return run().finally(() => {
    if (prev === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = prev;
  });
}

test("handlePublicFlashcardTagsGet returns 503 JSON with stable code on thrown DB-ish error", async () => {
  const res = await withConfiguredDatabaseUrl(() =>
    handlePublicFlashcardTagsGet(() => Promise.reject(new Error("database_timeout"))),
  );
  assert.equal(res.status, 503);
  const body = (await readJson(res)) as { code?: string; tags?: unknown; error?: string; surface?: string };
  assert.equal(body.tags === undefined || body.tags === null, true, "must not fake-success with tags key");
  assert.equal(body.code, "database_error");
  assert.equal(body.error, "DATA_UNAVAILABLE");
  assert.equal(body.surface, "flashcard_tags");
  assert.ok(typeof body.reasonFailed === "string");
});

test("handlePublicFlashcardTagsGet returns public_flashcard_tags_unavailable for db_query_shape_failure class", async () => {
  const res = await withConfiguredDatabaseUrl(() =>
    handlePublicFlashcardTagsGet(() =>
      Promise.reject(new Error("Invalid `prisma.flashcardTag.findMany()` invocation:")),
    ),
  );
  assert.equal(res.status, 503);
  const body = (await readJson(res)) as { code?: string; error?: string };
  assert.equal(body.code, "public_flashcard_tags_unavailable");
  assert.equal(body.error, "DATA_UNAVAILABLE");
});

test("handlePublicFlashcardTagsGet returns 503 public_flashcard_tags_unavailable when tags is not an array", async () => {
  const res = await handlePublicFlashcardTagsGet(() => Promise.resolve({ tags: "not-array" } as unknown as { tags: unknown[] }));
  assert.equal(res.status, 503);
  const body = (await readJson(res)) as { code?: string; reasonFailed?: string; tags?: unknown };
  assert.equal(body.code, "public_flashcard_tags_unavailable");
  assert.equal(body.reasonFailed, "INVALID_TAG_PAYLOAD");
  assert.equal(body.tags === undefined || body.tags === null, true);
});

test("handlePublicFlashcardTagsGet returns 503 DATA_UNAVAILABLE when loader returns zero tags", async () => {
  const res = await handlePublicFlashcardTagsGet(() => Promise.resolve({ tags: [] }));
  assert.equal(res.status, 503);
  const body = (await readJson(res)) as { error?: string; surface?: string; retryable?: boolean; tags?: unknown };
  assert.equal(body.error, "DATA_UNAVAILABLE");
  assert.equal(body.surface, "flashcard_tags");
  assert.equal(body.retryable, true);
  assert.equal(body.tags === undefined, true);
});

test("route.ts uses safeJsonRoute and does not reference safeJsonReadRoute", () => {
  const routePath = join(__dirname, "route.ts");
  const src = readFileSync(routePath, "utf8");
  assert.ok(src.includes("safeJsonRoute"), "must wrap with safeJsonRoute");
  assert.ok(!src.includes("safeJsonReadRoute"), "must not use safeJsonReadRoute (no fake 200 empty lists)");
});
