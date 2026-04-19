import assert from "node:assert/strict";
import test from "node:test";
import { collectCoreUrls } from "@/lib/seo/sitemap-static-xml";

async function withEnv<T>(env: Record<string, string | undefined>, run: () => Promise<T>): Promise<T> {
  const previous = new Map<string, string | undefined>();
  for (const [key, value] of Object.entries(env)) {
    previous.set(key, process.env[key]);
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }

  try {
    return await run();
  } finally {
    for (const [key, value] of previous) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

test("collectCoreUrls keeps only compact core marketing URLs in build safe mode", async () => {
  const origin = "https://example.com";

  const normalUrls = await withEnv(
    {
      NN_BUILD_SAFE_MODE: undefined,
      NEXT_PHASE: "phase-production-build",
      npm_lifecycle_event: "build",
    },
    () => collectCoreUrls(origin),
  );

  const safeUrls = await withEnv(
    {
      NN_BUILD_SAFE_MODE: "1",
      NEXT_PHASE: "phase-production-build",
      npm_lifecycle_event: "build",
    },
    () => collectCoreUrls(origin),
  );

  assert.ok(safeUrls.length < normalUrls.length);
  assert.ok(safeUrls.includes(`${origin}/`));
  assert.ok(safeUrls.includes(`${origin}/lessons`));
  assert.ok(safeUrls.includes(`${origin}/pricing`));
  assert.ok(safeUrls.includes(`${origin}/blog`));

  assert.equal(safeUrls.some((url) => url.includes("/questions/")), false);
  assert.equal(safeUrls.some((url) => url.includes("/tools/")), false);
  assert.equal(safeUrls.some((url) => url.includes("/lessons/topics/")), false);
});
